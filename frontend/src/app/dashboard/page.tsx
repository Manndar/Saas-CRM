'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    Container,
    Box,
    Typography,
    Paper,
    Button,
    AppBar,
    Toolbar,
    Avatar,
    Menu,
    MenuItem,
    CircularProgress,
} from '@mui/material';
import { Logout as LogoutIcon } from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';

import { ProtectedRoute } from '@/app/components/protected-route';
import { authService, type User } from '@/app/lib/auth';
import { getTokens, clearTokens } from '@/app/lib/auth-store';

function DashboardContent() {
    const router = useRouter();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const { data: user, isLoading, error } = useQuery<User>({
        queryKey: ['user', 'me'],
        queryFn: () => authService.getMe(),
    });
    const handleLogout = async () => {
        const tokens = getTokens();
        if (tokens.refreshToken) {
            try {
                await authService.logout(tokens.refreshToken);
            } catch (error) {
                console.error('Logout error:', error);
            }
        }
        clearTokens();
        router.push('/login');
    };

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

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

    if (error) {
        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="100vh"
            >
                <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" color="error" gutterBottom>
                        Error loading user data
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {error instanceof Error ? error.message : 'Unknown error'}
                    </Typography>
                </Paper>
            </Box>
        );
    }
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        SaaS CRM
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Typography variant="body2">
                            {user?.email || 'Loading...'}
                        </Typography>
                        <Avatar
                            sx={{ bgcolor: 'secondary.main', cursor: 'pointer' }}
                            onClick={handleMenuOpen}
                        >
                            {user?.email?.charAt(0).toUpperCase() || 'U'}
                        </Avatar>
                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleMenuClose}
                        >
                            <MenuItem onClick={handleLogout}>
                                <LogoutIcon sx={{ mr: 1 }} fontSize="small" />
                                Logout
                            </MenuItem>
                        </Menu>
                    </Box>
                </Toolbar>
            </AppBar>

            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Welcome to Dashboard
                </Typography>
                <Paper sx={{ p: 3, mt: 2 }}>
                    <Typography variant="h6" gutterBottom>
                        User Information
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="body1">
                            <strong>Email:</strong> {user?.email}
                        </Typography>
                        <Typography variant="body1">
                            <strong>User ID:</strong> {user?.userId}
                        </Typography>
                        {user?.organizationId && (
                            <Typography variant="body1">
                                <strong>Organization ID:</strong> {user.organizationId}
                            </Typography>
                        )}
                        {user?.role && (
                            <Typography variant="body1">
                                <strong>Role:</strong> {user.role}
                            </Typography>
                        )}
                    </Box>
                </Paper>

                <Paper sx={{ p: 3, mt: 2 }}>
                    <Typography variant="h6" gutterBottom>
                        Quick Actions
                    </Typography>
                    <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                        <Button variant="contained" disabled>
                            View Tickets
                        </Button>
                        <Button variant="contained" disabled>
                            Manage Customers
                        </Button>
                        <Button variant="contained" disabled>
                            Settings
                        </Button>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
}

export default function DashboardPage() {
    return (
        <ProtectedRoute>
            <DashboardContent />
        </ProtectedRoute>
    );
}