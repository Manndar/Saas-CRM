import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000/api';

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
}

// Create a base axios instance with interceptors
const createApiClient = () => {
    const client = axios.create({
        baseURL: API_BASE_URL,
        headers: {
            'Content-Type': 'application/json',
        },
    });

    // Request interceptor - add auth token
    client.interceptors.request.use(
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
    client.interceptors.response.use(
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
                        clearAuth();
                        if (typeof window !== 'undefined') {
                            window.location.href = '/login';
                        }
                        return Promise.reject(error);
                    }

                    const response = await axios.post<ApiResponse<{ accessToken: string; refreshToken: string }>>(
                        `${API_BASE_URL}/auth/refresh`,
                        { refreshToken },
                    );

                    if (response.data.success && response.data.data) {
                        localStorage.setItem('accessToken', response.data.data.accessToken);
                        localStorage.setItem('refreshToken', response.data.data.refreshToken);

                        if (originalRequest.headers) {
                            originalRequest.headers.Authorization = `Bearer ${response.data.data.accessToken}`;
                        }

                        return client(originalRequest);
                    }
                } catch (refreshError) {
                    clearAuth();
                    if (typeof window !== 'undefined') {
                        window.location.href = '/login';
                    }
                    return Promise.reject(refreshError);
                }
            }

            return Promise.reject(error);
        },
    );

    return client;
};

const clearAuth = (): void => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
    }
};

// Export the base API client for use by other services
export const apiClient = createApiClient();
export { clearAuth };
