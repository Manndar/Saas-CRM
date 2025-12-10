import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { LogoutDto } from './dto/logout.dto';
import { AuthTokens } from './types';
export declare class AuthService {
    private readonly prisma;
    private readonly jwtService;
    private readonly configService;
    private readonly logger;
    constructor(prisma: PrismaService, jwtService: JwtService, configService: ConfigService);
    register(input: RegisterDto): Promise<AuthTokens>;
    login(input: LoginDto): Promise<AuthTokens>;
    refresh(input: RefreshTokenDto): Promise<AuthTokens>;
    logout(input: LogoutDto): Promise<{
        success: true;
    }>;
    private issueTokens;
    private generateRefreshToken;
    private revokeToken;
    private findValidRefreshToken;
    private generateUniqueSlug;
}
