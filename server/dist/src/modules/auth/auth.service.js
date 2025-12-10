"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = __importStar(require("bcrypt"));
const crypto_1 = require("crypto");
const prisma_1 = require("../../prisma");
const REFRESH_TTL_DAYS = 7;
const SALT_ROUNDS = 12;
let AuthService = AuthService_1 = class AuthService {
    prisma;
    jwtService;
    configService;
    logger = new common_1.Logger(AuthService_1.name);
    constructor(prisma, jwtService, configService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.configService = configService;
    }
    async register(input) {
        try {
            this.logger.debug('Hashing password...');
            const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);
            this.logger.debug('Starting transaction...');
            return await this.prisma.$transaction(async (tx) => {
                const organizationName = input.organizationName ?? `${input.fullName}'s Organization`;
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
        }
        catch (error) {
            this.logger.error(`Registration failed: ${error instanceof Error ? error.message : 'Unknown error'}`, error instanceof Error ? error.stack : undefined);
            throw error;
        }
    }
    async login(input) {
        const user = await this.prisma.user.findUnique({
            where: { email: input.email.toLowerCase() },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const valid = await bcrypt.compare(input.password, user.passwordHash);
        if (!valid) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        return this.issueTokens(this.prisma, user);
    }
    async refresh(input) {
        const tokenRecord = await this.findValidRefreshToken(input.refreshToken);
        const user = await this.prisma.user.findUnique({
            where: { id: tokenRecord?.userId ?? '' },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        await this.revokeToken(tokenRecord?.id ?? '');
        return this.issueTokens(this.prisma, user);
    }
    async logout(input) {
        const tokenRecord = await this.findValidRefreshToken(input.refreshToken, {
            ignoreExpiry: true,
            throwOnMissing: false,
        });
        if (tokenRecord) {
            await this.revokeToken(tokenRecord.id);
        }
        return { success: true };
    }
    async issueTokens(tx, user) {
        const payload = {
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
    generateRefreshToken() {
        return (0, crypto_1.randomBytes)(48).toString('hex');
    }
    async revokeToken(id) {
        await this.prisma.refreshToken.update({
            where: { id },
            data: { revokedAt: new Date() },
        });
    }
    async findValidRefreshToken(rawToken, options) {
        const tokens = await this.prisma.refreshToken.findMany({
            where: { revokedAt: null },
            orderBy: { createdAt: 'desc' },
            take: 20,
        });
        for (const token of tokens) {
            const matches = await bcrypt.compare(rawToken, token.hashedToken);
            if (!matches)
                continue;
            if (!options?.ignoreExpiry && token.expiresAt.getTime() < Date.now()) {
                throw new common_1.UnauthorizedException('Refresh token expired');
            }
            return token;
        }
        if (options?.throwOnMissing === false) {
            return null;
        }
        throw new common_1.UnauthorizedException('Invalid refresh token');
    }
    async generateUniqueSlug(tx, name) {
        const base = name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '')
            .slice(0, 50);
        let slug = base || `org-${(0, crypto_1.randomBytes)(3).toString('hex')}`;
        let counter = 1;
        while (true) {
            const exists = await tx.organization.findUnique({ where: { slug } });
            if (!exists)
                return slug;
            slug = `${base}-${counter++}`;
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_1.PrismaService,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map