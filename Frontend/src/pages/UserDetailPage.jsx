import { useContext, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { userApi } from '../api/resourceApi';
import {
    Container,
    Box,
    Typography,
    Button,
    Paper,
    Grid,
    AppBar,
    Toolbar,
    Menu,
    MenuItem,
    CircularProgress,
    Alert,
    Chip
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import EditIcon from '@mui/icons-material/Edit';

const UserDetailPage = () => {
    const { user, logout } = useContext(AuthContext);
    const { userId } = useParams();
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);
    const [loading, setLoading] = useState(true);
    const [userInfo, setUserInfo] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserDetail = async () => {
            try {
                setError(null);
                setLoading(true);

                const token = localStorage.getItem('accessToken');
                console.log('Access Token exists:', !!token);
                console.log('User ID:', userId);
                
                const response = await userApi.getUserById(userId);
                console.log('User detail response:', response);
                setUserInfo(response?.data || {});
            } catch (err) {
                console.error('Failed to load user detail:', err);
                console.error('Error response:', err.response);
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            fetchUserDetail();
        }
    }, [userId]);

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const handleBack = () => {
        navigate(-1);
    };

    const getRoleColor = (role) => {
        switch (role) {
            case 'ROLE_ADMIN':
                return 'error';
            case 'ROLE_MENTOR':
                return 'success';
            case 'ROLE_STUDENT':
                return 'primary';
            default:
                return 'default';
        }
    };

    const getRoleLabel = (role) => {
        if (!role) return 'N/A';
        return role.replace('ROLE_', '');
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#f5f5f5' }}>
            {/* Header */}
            <AppBar position="static" sx={{ bgcolor: '#d32f2f' }}>
                <Toolbar>
                    <AdminPanelSettingsIcon sx={{ mr: 2, fontSize: 28 }} />
                    <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: '600' }}>
                        User Detail
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Button
                            color="inherit"
                            onClick={handleMenuOpen}
                            startIcon={<PersonIcon />}
                            sx={{ textTransform: 'none', fontSize: '0.95rem' }}
                        >
                            {user?.fullName || 'User'}
                        </Button>
                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleMenuClose}
                        >
                            <MenuItem disabled>
                                <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>
                                    {user?.email}
                                </Typography>
                            </MenuItem>
                            <MenuItem onClick={handleLogout}>
                                <LogoutIcon sx={{ mr: 1, fontSize: 20 }} />
                                <Typography variant="body2">Logout</Typography>
                            </MenuItem>
                        </Menu>
                    </Box>
                </Toolbar>
            </AppBar>

            {/* Main Content */}
            <Container maxWidth="lg" sx={{ py: 3, flex: 1 }}>
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={handleBack}
                    sx={{ mb: 2, textTransform: 'none', color: '#d32f2f', fontWeight: '600' }}
                >
                    Back
                </Button>

                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <>
                        {error && (
                            <Alert severity="error" sx={{ mb: 2 }}>
                                {error}
                            </Alert>
                        )}

                        {/* User Header */}
                        <Paper elevation={1} sx={{ p: 2.5, mb: 3, bgcolor: '#d32f2f', color: 'white', borderRadius: 1 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Box>
                                    <Typography variant="h5" sx={{ fontWeight: '600', mb: 0.5 }}>
                                        {userInfo?.fullName}
                                    </Typography>
                                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                        User ID: {userInfo?.userId}
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Chip
                                        label={getRoleLabel(userInfo?.role)}
                                        color={getRoleColor(userInfo?.role)}
                                        variant="outlined"
                                        sx={{ color: 'white', borderColor: 'white' }}
                                    />
                                    <Button
                                        variant="contained"
                                        color="success"
                                        startIcon={<EditIcon />}
                                        sx={{ textTransform: 'none', bgcolor: 'rgba(255,255,255,0.2)', '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' } }}
                                    >
                                        Edit
                                    </Button>
                                </Box>
                            </Box>
                        </Paper>

                        {/* User Info Grid */}
                        <Grid container spacing={2.5} sx={{ mb: 3 }}>
                            {/* Basic Information */}
                            <Grid item xs={12} md={6}>
                                <Paper elevation={1} sx={{ p: 2.5, border: '1px solid #e0e0e0' }}>
                                    <Typography variant="h6" sx={{ fontWeight: '600', mb: 2, color: '#d32f2f' }}>
                                        Basic Information
                                    </Typography>

                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant="caption" color="textSecondary">
                                            Full Name
                                        </Typography>
                                        <Typography variant="body2" sx={{ fontWeight: '600', mt: 0.5 }}>
                                            {userInfo?.fullName || 'N/A'}
                                        </Typography>
                                    </Box>

                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant="caption" color="textSecondary">
                                            Username
                                        </Typography>
                                        <Typography variant="body2" sx={{ fontWeight: '600', mt: 0.5 }}>
                                            {userInfo?.username || 'N/A'}
                                        </Typography>
                                    </Box>

                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant="caption" color="textSecondary">
                                            Email
                                        </Typography>
                                        <Typography variant="body2" sx={{ fontWeight: '600', mt: 0.5 }}>
                                            {userInfo?.email || 'N/A'}
                                        </Typography>
                                    </Box>

                                    <Box>
                                        <Typography variant="caption" color="textSecondary">
                                            Phone Number
                                        </Typography>
                                        <Typography variant="body2" sx={{ fontWeight: '600', mt: 0.5 }}>
                                            {userInfo?.phoneNumber || 'N/A'}
                                        </Typography>
                                    </Box>
                                </Paper>
                            </Grid>

                            {/* Account Information */}
                            <Grid item xs={12} md={6}>
                                <Paper elevation={1} sx={{ p: 2.5, border: '1px solid #e0e0e0' }}>
                                    <Typography variant="h6" sx={{ fontWeight: '600', mb: 2, color: '#d32f2f' }}>
                                        Account Information
                                    </Typography>

                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant="caption" color="textSecondary">
                                            Role
                                        </Typography>
                                        <Box sx={{ mt: 0.5 }}>
                                            <Chip
                                                label={getRoleLabel(userInfo?.role)}
                                                color={getRoleColor(userInfo?.role)}
                                                size="small"
                                            />
                                        </Box>
                                    </Box>

                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant="caption" color="textSecondary">
                                            Status
                                        </Typography>
                                        <Box sx={{ mt: 0.5 }}>
                                            <Chip
                                                label={userInfo?.isActive ? 'Active' : 'Inactive'}
                                                color={userInfo?.isActive ? 'success' : 'error'}
                                                size="small"
                                            />
                                        </Box>
                                    </Box>

                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant="caption" color="textSecondary">
                                            Created At
                                        </Typography>
                                        <Typography variant="body2" sx={{ fontWeight: '600', mt: 0.5 }}>
                                            {userInfo?.createdAt ? new Date(userInfo.createdAt).toLocaleString() : 'N/A'}
                                        </Typography>
                                    </Box>

                                    <Box>
                                        <Typography variant="caption" color="textSecondary">
                                            Last Updated
                                        </Typography>
                                        <Typography variant="body2" sx={{ fontWeight: '600', mt: 0.5 }}>
                                            {userInfo?.updatedAt ? new Date(userInfo.updatedAt).toLocaleString() : 'N/A'}
                                        </Typography>
                                    </Box>
                                </Paper>
                            </Grid>
                        </Grid>
                    </>
                )}
            </Container>

            {/* Footer */}
            <Box sx={{ bgcolor: '#f9f9f9', p: 1.5, textAlign: 'center', borderTop: '1px solid #e0e0e0' }}>
                <Typography variant="caption" color="textSecondary">
                    © 2026 Internship Management System. All rights reserved.
                </Typography>
            </Box>
        </Box>
    );
};

export default UserDetailPage;
