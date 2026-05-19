import { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { userApi } from '../api/resourceApi';
import {
    Container,
    Box,
    Typography,
    Button,
    Paper,
    Grid,
    Card,
    CardContent,
    AppBar,
    Toolbar,
    Menu,
    MenuItem,
    Chip,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    CircularProgress,
    Alert
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import GroupIcon from '@mui/icons-material/Group';
import PeopleIcon from '@mui/icons-material/People';

const AdminDashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);
    const [loading, setLoading] = useState(true);
    const [usersList, setUsersList] = useState([]);
    const [error, setError] = useState(null);
    const [stats, setStats] = useState({
        totalStudents: 0,
        totalMentors: 0,
        activeInternships: 0,
        totalUsers: 0
    });

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                const response = await userApi.getAllUsers(null, 0, 100);
                const users = response.content || [];
                console.log('Users API response:', response);
                console.log('First user:', users[0]);
                console.log('First user keys:', Object.keys(users[0] || {}));
                console.log('User IDs:', users.map(u => ({ email: u.email, userId: u.userId })));
                setUsersList(users);

                // Calculate stats
                const students = users.filter(u => u.role === 'ROLE_STUDENT').length;
                const mentors = users.filter(u => u.role === 'ROLE_MENTOR').length;

                setStats({
                    totalStudents: students,
                    totalMentors: mentors,
                    activeInternships: Math.floor(students * 0.8),
                    totalUsers: users.length
                });
            } catch (err) {
                console.error('Failed to load users:', err);
                setError('Failed to load user data');
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

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

    const getRoleColor = (role) => {
        switch (role?.toUpperCase()) {
            case 'ROLE_ADMIN':
            case 'ADMIN':
                return 'error';
            case 'ROLE_MENTOR':
            case 'MENTOR':
                return 'success';
            case 'ROLE_STUDENT':
            case 'STUDENT':
                return 'primary';
            default:
                return 'default';
        }
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#f5f5f5' }}>
            {/* Header */}
            <AppBar position="static" sx={{ bgcolor: '#d32f2f' }}>
                <Toolbar>
                    <AdminPanelSettingsIcon sx={{ mr: 2, fontSize: 28 }} />
                    <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: '600' }}>
                        Admin Dashboard
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Button
                            color="inherit"
                            onClick={handleMenuOpen}
                            startIcon={<PersonIcon />}
                            sx={{ textTransform: 'none', fontSize: '0.95rem' }}
                        >
                            {user?.fullName || 'Admin'}
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
                        {/* Welcome Section */}
                        <Paper elevation={1} sx={{ p: 2.5, mb: 3, bgcolor: '#d32f2f', color: 'white', borderRadius: 1 }}>
                            <Typography variant="h5" sx={{ fontWeight: '600', mb: 0.5 }}>
                                Welcome back, {user?.fullName}! 🔐
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                System administration and user management dashboard.
                            </Typography>
                        </Paper>

                        {/* Quick Stats */}
                        <Grid container spacing={2} sx={{ mb: 3 }}>
                            <Grid item xs={12} sm={6} md={3}>
                                <Card sx={{ boxShadow: 1, border: '1px solid #e0e0e0' }}>
                                    <CardContent sx={{ textAlign: 'center', py: 2 }}>
                                        <GroupIcon sx={{ fontSize: 40, color: '#1976d2', mb: 1 }} />
                                        <Typography variant="body2" color="textSecondary" sx={{ mb: 0.5 }}>
                                            Total Students
                                        </Typography>
                                        <Typography variant="h5" sx={{ fontWeight: '600', color: '#1976d2' }}>
                                            {stats.totalStudents}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>

                            <Grid item xs={12} sm={6} md={3}>
                                <Card sx={{ boxShadow: 1, border: '1px solid #e0e0e0' }}>
                                    <CardContent sx={{ textAlign: 'center', py: 2 }}>
                                        <PeopleIcon sx={{ fontSize: 40, color: '#388e3c', mb: 1 }} />
                                        <Typography variant="body2" color="textSecondary" sx={{ mb: 0.5 }}>
                                            Total Mentors
                                        </Typography>
                                        <Typography variant="h5" sx={{ fontWeight: '600', color: '#388e3c' }}>
                                            {stats.totalMentors}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>

                            <Grid item xs={12} sm={6} md={3}>
                                <Card sx={{ boxShadow: 1, border: '1px solid #e0e0e0' }}>
                                    <CardContent sx={{ textAlign: 'center', py: 2 }}>
                                        <Typography variant="body2" color="textSecondary" sx={{ mb: 0.5 }}>
                                            Active Internships
                                        </Typography>
                                        <Typography variant="h5" sx={{ fontWeight: '600', color: '#f57c00' }}>
                                            {stats.activeInternships}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>

                            <Grid item xs={12} sm={6} md={3}>
                                <Card sx={{ boxShadow: 1, border: '1px solid #e0e0e0' }}>
                                    <CardContent sx={{ textAlign: 'center', py: 2 }}>
                                        <Typography variant="body2" color="textSecondary" sx={{ mb: 0.5 }}>
                                            System Users
                                        </Typography>
                                        <Typography variant="h5" sx={{ fontWeight: '600', color: '#d32f2f' }}>
                                            {stats.totalUsers}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>

                        {/* Users Management */}
                        <Paper elevation={1} sx={{ p: 2.5, mb: 3, borderRadius: 1 }}>
                            <Typography variant="h6" sx={{ fontWeight: '600', mb: 2 }}>
                                User Management
                            </Typography>
                            {usersList.length === 0 ? (
                                <Typography variant="body2" color="textSecondary">
                                    No users found.
                                </Typography>
                            ) : (
                                <TableContainer>
                                    <Table size="small">
                                        <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                                            <TableRow>
                                                <TableCell sx={{ fontWeight: '600', fontSize: '0.9rem' }}>User Name</TableCell>
                                                <TableCell sx={{ fontWeight: '600', fontSize: '0.9rem' }}>Email</TableCell>
                                                <TableCell sx={{ fontWeight: '600', fontSize: '0.9rem' }}>Role</TableCell>
                                                <TableCell sx={{ fontWeight: '600', fontSize: '0.9rem' }}>Status</TableCell>
                                                <TableCell sx={{ fontWeight: '600', fontSize: '0.9rem' }} align="center">Action</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {usersList.map((userItem, index) => (
                                                <TableRow key={userItem.userId || userItem.email || index} sx={{ '&:hover': { bgcolor: '#f9f9f9' } }}>
                                                    <TableCell sx={{ fontSize: '0.9rem' }}>{userItem.fullName || userItem.name}</TableCell>
                                                    <TableCell sx={{ fontSize: '0.9rem' }}>{userItem.email}</TableCell>
                                                    <TableCell sx={{ fontSize: '0.9rem' }}>
                                                        <Chip label={userItem.role?.replace('ROLE_', '') || userItem.role} color={getRoleColor(userItem.role)} size="small" />
                                                    </TableCell>
                                                    <TableCell sx={{ fontSize: '0.9rem' }}>
                                                        <Chip
                                                            label={userItem.isActive ? 'Active' : 'Inactive'}
                                                            color={userItem.isActive ? 'success' : 'default'}
                                                            size="small"
                                                        />
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        <Button
                                                            size="small"
                                                            variant="outlined"
                                                            color="primary"
                                                            onClick={() => navigate(`/user/${userItem.userId}`)}
                                                        >
                                                            View
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            )}
                        </Paper>

                        {/* Profile Info */}
                        <Paper elevation={1} sx={{ p: 2.5, borderRadius: 1 }}>
                            <Typography variant="h6" sx={{ fontWeight: '600', mb: 2 }}>
                                Profile Information
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6} md={3}>
                                    <Box sx={{ p: 1.5, bgcolor: '#f9f9f9', borderRadius: 1, border: '1px solid #e0e0e0' }}>
                                        <Typography variant="caption" color="textSecondary">
                                            Full Name
                                        </Typography>
                                        <Typography variant="body2" sx={{ fontWeight: '600', mt: 0.5 }}>
                                            {user?.fullName}
                                        </Typography>
                                    </Box>
                                </Grid>

                                <Grid item xs={12} sm={6} md={3}>
                                    <Box sx={{ p: 1.5, bgcolor: '#f9f9f9', borderRadius: 1, border: '1px solid #e0e0e0' }}>
                                        <Typography variant="caption" color="textSecondary">
                                            Email
                                        </Typography>
                                        <Typography variant="body2" sx={{ fontWeight: '600', mt: 0.5 }}>
                                            {user?.email}
                                        </Typography>
                                    </Box>
                                </Grid>

                                <Grid item xs={12} sm={6} md={3}>
                                    <Box sx={{ p: 1.5, bgcolor: '#f9f9f9', borderRadius: 1, border: '1px solid #e0e0e0' }}>
                                        <Typography variant="caption" color="textSecondary">
                                            Phone
                                        </Typography>
                                        <Typography variant="body2" sx={{ fontWeight: '600', mt: 0.5 }}>
                                            {user?.phoneNumber}
                                        </Typography>
                                    </Box>
                                </Grid>

                                <Grid item xs={12} sm={6} md={3}>
                                    <Box sx={{ p: 1.5, bgcolor: '#f9f9f9', borderRadius: 1, border: '1px solid #e0e0e0' }}>
                                        <Typography variant="caption" color="textSecondary">
                                            Username
                                        </Typography>
                                        <Typography variant="body2" sx={{ fontWeight: '600', mt: 0.5 }}>
                                            {user?.username}
                                        </Typography>
                                    </Box>
                                </Grid>

                                <Grid item xs={12} sm={6} md={3}>
                                    <Box sx={{ p: 1.5, bgcolor: '#f9f9f9', borderRadius: 1, border: '1px solid #e0e0e0' }}>
                                        <Typography variant="caption" color="textSecondary">
                                            Role
                                        </Typography>
                                        <Typography variant="body2" sx={{ fontWeight: '600', mt: 0.5 }}>
                                            <Chip label="Admin" size="small" sx={{ bgcolor: '#d32f2f', color: 'white' }} />
                                        </Typography>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Paper>
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

export default AdminDashboard;
