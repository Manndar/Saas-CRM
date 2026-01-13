import {
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';

import { PrismaService, PrismaTransactionClient } from '../../prisma';
import { AppError } from '../../common/errors/app-error';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { LogoutDto } from './dto/logout.dto';
import { AuthTokens, JwtPayload } from './types';

const REFRESH_TTL_DAYS = 7;
const SALT_ROUNDS = 12;

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(input: RegisterDto): Promise<AuthTokens> {
    try {
      this.logger.log(`Register attempt for email: ${input.email}`);

      const existing = await this.prisma.user.findUnique({
        where: { email: input.email.toLowerCase() },
      });

      if (existing) {
        this.logger.warn(`Registration failed: Email already in use - ${input.email}`);
        throw new AppError('Email already in use', 409);
      }

      this.logger.debug('Hashing password...');
      const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);

      this.logger.debug('Starting transaction...');
      return await this.prisma.$transaction(async (tx) => {
        const organizationName =
          input.organizationName ?? `${input.fullName}'s Organization`;
        
        this.logger.debug(`Generating unique slug for: ${organizationName}`);
        const slug = await this.generateUniqueSlug(tx, organizationName);

        this.logger.debug('Creating user...');
        const user = await tx.user.create({
          data: {
            email: input.email.toLowerCase(),
            fullName: input.fullName,
            passwordHash,
          },
        });

        this.logger.debug('Creating organization...');
        const organization = await tx.organization.create({
          data: {
            name: organizationName,
            slug,
          },
        });

        this.logger.debug('Creating organization member...');
        await tx.organizationMember.create({
          data: {
            userId: user.id,
            organizationId: organization.id,
            role: 'ADMIN',
          },
        });

        this.logger.debug('Issuing tokens...');
        return this.issueTokens(tx, user);
      });
    } catch (error) {
      this.logger.error(
        `Registration failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        error instanceof Error ? error.stack : undefined,
      );
      throw error;
    }
  }

  async login(input: LoginDto): Promise<AuthTokens> {
    const user = await this.prisma.user.findUnique({
      where: { email: input.email.toLowerCase() },
    });

    // console.log("user", user);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const valid = await bcrypt.compare(input.password, user.passwordHash);
    if (!valid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.issueTokens(this.prisma, user);
  }

  async refresh(input: RefreshTokenDto): Promise<AuthTokens> {
    const tokenRecord = await this.findValidRefreshToken(input.refreshToken);

    const user = await this.prisma.user.findUnique({
      where: { id: tokenRecord?.userId ?? '' },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    await this.revokeToken(tokenRecord?.id ?? '');

    return this.issueTokens(this.prisma, user);
  }

  async logout(input: LogoutDto): Promise<{ success: true }> {
    const tokenRecord = await this.findValidRefreshToken(input.refreshToken, {
      ignoreExpiry: true,
      throwOnMissing: false,
    });

    if (tokenRecord) {
      await this.revokeToken(tokenRecord.id);
    }

    return { success: true };
  }

  async getMe(userId: string): Promise<{
    userId: string;
    email: string;
    organizationId?: string;
    role?: string;
  }> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        memberships: {
          take: 1,
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const membership = user.memberships[0];

    return {
      userId: user.id,
      email: user.email,
      organizationId: membership?.organizationId,
      role: membership?.role,
    };
  }

  private async issueTokens(
    tx: PrismaTransactionClient,
    user: { id: string; email: string; fullName: string },
  ): Promise<AuthTokens> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      fullName: user.fullName,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    const refreshToken = this.generateRefreshToken();
    const hashedRefreshToken = await bcrypt.hash(refreshToken, SALT_ROUNDS);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + REFRESH_TTL_DAYS);

    await tx.refreshToken.create({
      data: {
        userId: user.id,
        hashedToken: hashedRefreshToken,
        expiresAt,
      },
    });

    return { accessToken, refreshToken };
  }

  private generateRefreshToken(): string {
    return randomBytes(48).toString('hex');
  }

  private async revokeToken(id: string): Promise<void> {
    await this.prisma.refreshToken.update({
      where: { id },
      data: { revokedAt: new Date() },
    });
  }

  private async findValidRefreshToken(
    rawToken: string,
    options?: { ignoreExpiry?: boolean; throwOnMissing?: boolean },
  ) {
    const tokens = await this.prisma.refreshToken.findMany({
      where: { revokedAt: null },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    for (const token of tokens) {
      const matches = await bcrypt.compare(rawToken, token.hashedToken);
      if (!matches) continue;

      if (!options?.ignoreExpiry && token.expiresAt.getTime() < Date.now()) {
        throw new UnauthorizedException('Refresh token expired');
      }

      return token;
    }

    if (options?.throwOnMissing === false) {
      return null;
    }

    throw new UnauthorizedException('Invalid refresh token');
  }

  private async generateUniqueSlug(
    tx: PrismaTransactionClient,
    name: string,
  ): Promise<string> {
    const base = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '')
      .slice(0, 50);

    let slug = base || `org-${randomBytes(3).toString('hex')}`;
    let counter = 1;

    while (true) {
      const exists = await tx.organization.findUnique({ where: { slug } });
      if (!exists) return slug;
      slug = `${base}-${counter++}`;
    }
  }
}
