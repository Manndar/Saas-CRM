import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3000/api';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

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

class ApiClient {
  private client = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  constructor() {
    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor - add auth token
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        if (typeof window !== 'undefined') {
          const token = localStorage.getItem('accessToken');
          if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }
        return config;
      },
      (error) => Promise.reject(error),
    );

    // Response interceptor - handle token refresh
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & {
          _retry?: boolean;
        };

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const refreshToken = localStorage.getItem('refreshToken');
            if (!refreshToken) {
              this.clearAuth();
              if (typeof window !== 'undefined') {
                window.location.href = '/login';
              }
              return Promise.reject(error);
            }

            const response = await axios.post<ApiResponse<LoginResponse>>(
              `${API_BASE_URL}/auth/refresh`,
              { refreshToken },
            );

            if (response.data.success && response.data.data) {
              localStorage.setItem('accessToken', response.data.data.accessToken);
              localStorage.setItem(
                'refreshToken',
                response.data.data.refreshToken,
              );

              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${response.data.data.accessToken}`;
              }

              return this.client(originalRequest);
            }
          } catch (refreshError) {
            this.clearAuth();
            if (typeof window !== 'undefined') {
              window.location.href = '/login';
            }
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      },
    );
  }

  private clearAuth(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
  }

  // Auth endpoints
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await this.client.post<ApiResponse<LoginResponse>>(
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
    const response = await this.client.post<ApiResponse<RegisterResponse>>(
      '/auth/register',
      { fullName, email, password, organizationName },
    );
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Registration failed');
  }

  async refresh(refreshToken: string): Promise<LoginResponse> {
    const response = await this.client.post<ApiResponse<LoginResponse>>(
      '/auth/refresh',
      { refreshToken },
    );
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Token refresh failed');
  }

  async logout(refreshToken: string): Promise<void> {
    await this.client.post('/auth/logout', { refreshToken });
    this.clearAuth();
  }

  async getMe(): Promise<User> {
    const response = await this.client.get<ApiResponse<User>>('/auth/me');
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to get user');
  }
}

export const apiClient = new ApiClient();

