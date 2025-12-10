import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { LogoutDto } from './dto/logout.dto';
import type { JwtPayload } from './types';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(body: RegisterDto): Promise<import("./types").AuthTokens>;
    login(body: LoginDto): Promise<import("./types").AuthTokens>;
    refresh(body: RefreshTokenDto): Promise<import("./types").AuthTokens>;
    logout(body: LogoutDto): Promise<{
        success: true;
    }>;
    me(user: JwtPayload): {
        user: JwtPayload;
    };
}
