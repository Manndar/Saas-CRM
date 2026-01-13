'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CircularProgress, Box } from '@mui/material';

import { getTokens } from '@/app/lib/auth-store';
import { authService } from '@/app/lib/auth';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            const tokens = getTokens();
            if (!tokens.accessToken || !tokens.refreshToken) {
                router.push('/login');
                return;
            }

            try {
                await authService.getMe();
                setIsAuthenticated(true);
            } catch {
                router.push('/login');
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, [router]);

    if (isLoading) {
        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="100vh"
            >
                <CircularProgress />
            </Box>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    return <>{children}</>;
}
