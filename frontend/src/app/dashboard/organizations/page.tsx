'use client';

import { useState } from 'react';
import {
    Box,
    Typography,
    Paper,
    CircularProgress,
    List,
    ListItem,
    ListItemText,
    Chip,
    Container,
    AppBar,
    Toolbar,
    IconButton,
} from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';

import { ProtectedRoute } from '@/app/components/protected-route';
import { Sidebar } from '../../components/sidebar/page';
import { organizationsService, type Organization } from '@/app/lib/organizations';

function OrganizationsContent() {
    const [mobileOpen, setMobileOpen] = useState(false);

    const { data: organizations, isLoading, error } = useQuery<Organization[]>({
        queryKey: ['organizations'],
        queryFn: () => organizationsService.getAllOrganizations(),
    });

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', minHeight: '100vh' }}>
                <Sidebar open={mobileOpen} onClose={handleDrawerToggle} />
                <Box
                    component="main"
                    sx={{
                        flexGrow: 1,
                        width: { md: `calc(100% - 240px)` },
                        minHeight: '100vh',
                        backgroundColor: 'background.default',
                    }}
                >
                    <AppBar
                        position="fixed"
                        sx={{
                            width: { md: `calc(100% - 240px)` },
                            ml: { md: '240px' },
                            zIndex: (theme) => theme.zIndex.drawer + 1,
                        }}
                    >
                        <Toolbar>
                            <IconButton
                                color="inherit"
                                aria-label="open drawer"
                                edge="start"
                                onClick={handleDrawerToggle}
                                sx={{ mr: 2, display: { md: 'none' } }}
                            >
                                <MenuIcon />
                            </IconButton>
                            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                                Organizations
                            </Typography>
                        </Toolbar>
                    </AppBar>
                    <Toolbar />
                    <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        minHeight="60vh"
                    >
                        <CircularProgress />
                    </Box>
                </Box>
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ display: 'flex', minHeight: '100vh' }}>
                <Sidebar open={mobileOpen} onClose={handleDrawerToggle} />
                <Box
                    component="main"
                    sx={{
                        flexGrow: 1,
                        width: { md: `calc(100% - 240px)` },
                        minHeight: '100vh',
                        backgroundColor: 'background.default',
                    }}
                >
                    <AppBar
                        position="fixed"
                        sx={{
                            width: { md: `calc(100% - 240px)` },
                            ml: { md: '240px' },
                            zIndex: (theme) => theme.zIndex.drawer + 1,
                        }}
                    >
                        <Toolbar>
                            <IconButton
                                color="inherit"
                                aria-label="open drawer"
                                edge="start"
                                onClick={handleDrawerToggle}
                                sx={{ mr: 2, display: { md: 'none' } }}
                            >
                                <MenuIcon />
                            </IconButton>
                            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                                Organizations
                            </Typography>
                        </Toolbar>
                    </AppBar>
                    <Toolbar />
                    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                        <Paper sx={{ p: 3 }}>
                            <Typography variant="h6" color="error" gutterBottom>
                                Error loading organizations
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {error instanceof Error ? error.message : 'Unknown error'}
                            </Typography>
                        </Paper>
                    </Container>
                </Box>
            </Box>
        );
    }

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
            <AppBar
                position="fixed"
                sx={{
                    width: { md: `calc(100% - 240px)` },
                    ml: { md: '240px' },
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                }}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { md: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Organizations
                    </Typography>
                </Toolbar>
            </AppBar>

            <Sidebar open={mobileOpen} onClose={handleDrawerToggle} />

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    width: { md: `calc(100% - 240px)` },
                    minHeight: '100vh',
                    backgroundColor: 'background.default',
                }}
            >
                <Toolbar />
                <Container maxWidth="lg" sx={{ mt: 2, mb: 4 }}>
                    <Typography variant="h4" component="h1" gutterBottom>
                        Organizations
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        {organizations?.length || 0} organization{organizations?.length !== 1 ? 's' : ''} found
                    </Typography>

                    {organizations && organizations.length > 0 ? (
                        <Paper>
                            <List>
                                {organizations.map((org, index) => (
                                    <Box key={org.id}>
                                        <ListItem
                                            sx={{
                                                py: 2,
                                                '&:hover': {
                                                    backgroundColor: 'action.hover',
                                                },
                                            }}
                                        >
                                            <ListItemText
                                                primary={
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <Typography variant="h6" component="span">
                                                            {org.name}
                                                        </Typography>
                                                        <Chip
                                                            label={org.slug}
                                                            size="small"
                                                            variant="outlined"
                                                            sx={{ fontSize: '0.75rem' }}
                                                        />
                                                    </Box>
                                                }
                                                secondary={
                                                    <Box sx={{ mt: 1 }}>
                                                        <Typography variant="body2" color="text.secondary">
                                                            Created: {formatDate(org.createdAt)}
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                                                            ID: {org.id}
                                                        </Typography>
                                                    </Box>
                                                }
                                            />
                                        </ListItem>
                                        {index < organizations.length - 1 && <Box component="hr" sx={{ m: 0, border: 'none', borderTop: '1px solid', borderColor: 'divider' }} />}
                                    </Box>
                                ))}
                            </List>
                        </Paper>
                    ) : (
                        <Paper sx={{ p: 4, textAlign: 'center' }}>
                            <Typography variant="h6" color="text.secondary" gutterBottom>
                                No organizations found
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Organizations will appear here once they are created.
                            </Typography>
                        </Paper>
                    )}
                </Container>
            </Box>
        </Box>
    );
}

export default function OrganizationsPage() {
    return (
        <ProtectedRoute>
            <OrganizationsContent />
        </ProtectedRoute>
    );
}

