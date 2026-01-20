'use client';

import { useRouter, usePathname } from 'next/navigation';
import {
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Box,
    Divider,
    useTheme,
    useMediaQuery,
} from '@mui/material';
import {
    Business as BusinessIcon,
    Support as SupportIcon,
    Settings as SettingsIcon,
    People as PeopleIcon,
} from '@mui/icons-material';

const drawerWidth = 240;

interface SidebarProps {
    open?: boolean;
    onClose?: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
    const router = useRouter();
    const pathname = usePathname();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const menuItems = [
        {
            text: 'Organizations',
            icon: <BusinessIcon />,
            path: '/dashboard/organizations',
        },
        {
            text: 'Tickets',
            icon: <SupportIcon />,
            path: '/dashboard/tickets',
        },
        {
            text: 'Manage Customers',
            icon: <PeopleIcon />,
            path: '/dashboard/customers',
        },
        {
            text: 'Settings',
            icon: <SettingsIcon />,
            path: '/dashboard/settings',
        },
    ];

    const handleNavigation = (path: string) => {
        router.push(path);
        if (isMobile && onClose) {
            onClose();
        }
    };

    const drawerContent = (
        <Box>
            <Toolbar>
                <Box sx={{ fontWeight: 600, fontSize: '1.25rem' }}>
                    SaaS CRM
                </Box>
            </Toolbar>
            <Divider />
            <List>
                {menuItems.map((item) => {
                    const isActive = pathname === item.path;
                    return (
                        <ListItem key={item.text} disablePadding>
                            <ListItemButton
                                selected={isActive}
                                onClick={() => handleNavigation(item.path)}
                                sx={{
                                    '&.Mui-selected': {
                                        backgroundColor: 'primary.main',
                                        color: 'white',
                                        '&:hover': {
                                            backgroundColor: 'primary.dark',
                                        },
                                        '& .MuiListItemIcon-root': {
                                            color: 'white',
                                        },
                                    },
                                    '&:hover': {
                                        backgroundColor: 'action.hover',
                                    },
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        color: isActive
                                            ? 'white'
                                            : 'text.secondary',
                                    }}
                                >
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText primary={item.text} />
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </List>
        </Box>
    );

    if (isMobile) {
        return (
            <Drawer
                variant="temporary"
                open={open}
                onClose={onClose}
                ModalProps={{
                    keepMounted: true, // Better open performance on mobile.
                }}
                sx={{
                    display: { xs: 'block', md: 'none' },
                    '& .MuiDrawer-paper': {
                        boxSizing: 'border-box',
                        width: drawerWidth,
                    },
                }}
            >
                {drawerContent}
            </Drawer>
        );
    }

    return (
        <Drawer
            variant="permanent"
            sx={{
                display: { xs: 'none', md: 'block' },
                width: drawerWidth,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: drawerWidth,
                    boxSizing: 'border-box',
                },
            }}
            open
        >
            {drawerContent}
        </Drawer>
    );
}

