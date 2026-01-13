import { apiClient, clearAuth } from './api';
import type { ApiResponse } from './api';

export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
}

export interface RegisterResponse {
    accessToken: string;
    refreshToken: string;
}

export interface User {
    userId: string;
    email: string;
    organizationId?: string;
    role?: string;
}

class AuthService {
    async login(email: string, password: string): Promise<LoginResponse> {
        const response = await apiClient.post<ApiResponse<LoginResponse>>(
            '/auth/login',
            { email, password },
        );
        if (response.data.success && response.data.data) {
            return response.data.data;
        }
        throw new Error(response.data.message || 'Login failed');
    }

    async register(
        fullName: string,
        email: string,
        password: string,
        organizationName?: string,
    ): Promise<RegisterResponse> {
        const response = await apiClient.post<ApiResponse<RegisterResponse>>(
            '/auth/register',
            { fullName, email, password, organizationName },
        );
        if (response.data.success && response.data.data) {
            return response.data.data;
        }
        throw new Error(response.data.message || 'Registration failed');
    }

    async refresh(refreshToken: string): Promise<LoginResponse> {
        const response = await apiClient.post<ApiResponse<LoginResponse>>(
            '/auth/refresh',
            { refreshToken },
        );
        if (response.data.success && response.data.data) {
            return response.data.data;
        }
        throw new Error(response.data.message || 'Token refresh failed');
    }

    async logout(refreshToken: string): Promise<void> {
        await apiClient.post('/auth/logout', { refreshToken });
        clearAuth();
    }

    async getMe(): Promise<User> {
        const response = await apiClient.get<ApiResponse<{ user: User }>>('/auth/me');
        if (response.data.success && response.data.data?.user) {
            return response.data.data.user;
        }
        throw new Error(response.data.message || 'Failed to get user');
    }
}

export const authService = new AuthService();

