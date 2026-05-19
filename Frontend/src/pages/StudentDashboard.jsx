import { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { studentApi } from '../api/resourceApi';
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
    CircularProgress,
    Alert
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import SchoolIcon from '@mui/icons-material/School';
import AssignmentIcon from '@mui/icons-material/Assignment';

const StudentDashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);
    const [loading, setLoading] = useState(true);
    const [studentInfo, setStudentInfo] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStudentInfo = async () => {
            try {
                console.log('Fetching current student info...');
                setError(null);
                setLoading(true);

                const response = await studentApi.getCurrentStudentInfo();
                console.log('Student info response:', response);
                setStudentInfo(response?.data || {});
            } catch (err) {
                console.error('Failed to load student info:', err);
                setError('Failed to load student information: ' + (err.message || 'Unknown error'));
            } finally {
                setLoading(false);
            }
        };

        fetchStudentInfo();
    }, []);

    const handleMenuClose = () => {
        setAnchorEl(null);
    };
    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#f5f5f5' }}>
            {/* Header */}
            <AppBar position="static" sx={{ bgcolor: '#1976d2' }}>
                <Toolbar>
                    <SchoolIcon sx={{ mr: 2, fontSize: 28 }} />
                    <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: '600' }}>
                        Student Portal
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Button
                            color="inherit"
                            onClick={handleMenuOpen}
                            startIcon={<PersonIcon />}
                            sx={{ textTransform: 'none', fontSize: '0.95rem' }}
                        >
                            {user?.fullName || 'Student'}
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
                        <Paper elevation={1} sx={{ p: 2.5, mb: 3, bgcolor: '#1976d2', color: 'white', borderRadius: 1 }}>
                            <Typography variant="h5" sx={{ fontWeight: '600', mb: 0.5 }}>
                                Welcome back, {user?.fullName}! 👋
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                Manage your internship applications and track progress.
                            </Typography>
                        </Paper>

                        {/* Statistics Cards */}
                        <Grid container spacing={2} sx={{ mb: 3 }}>
                            <Grid item xs={12} sm={6} md={3}>
                                <Card sx={{ boxShadow: 1, border: '1px solid #e0e0e0' }}>
                                    <CardContent sx={{ textAlign: 'center', py: 2 }}>
                                        <AssignmentIcon sx={{ fontSize: 40, color: '#1976d2', mb: 1 }} />
                                        <Typography variant="body2" color="textSecondary" sx={{ mb: 0.5 }}>
                                            Student Code
                                        </Typography>
                                        <Typography variant="h5" sx={{ fontWeight: '600', color: '#1976d2' }}>
                                            {studentInfo?.studentCode || 'N/A'}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>

                            <Grid item xs={12} sm={6} md={3}>
                                <Card sx={{ boxShadow: 1, border: '1px solid #e0e0e0' }}>
                                    <CardContent sx={{ textAlign: 'center', py: 2 }}>
                                        <SchoolIcon sx={{ fontSize: 40, color: '#388e3c', mb: 1 }} />
                                        <Typography variant="body2" color="textSecondary" sx={{ mb: 0.5 }}>
                                            Major
                                        </Typography>
                                        <Typography variant="h5" sx={{ fontWeight: '600', color: '#388e3c' }}>
                                            {studentInfo?.major || 'N/A'}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>

                            <Grid item xs={12} sm={6} md={3}>
                                <Card sx={{ boxShadow: 1, border: '1px solid #e0e0e0' }}>
                                    <CardContent sx={{ textAlign: 'center', py: 2 }}>
                                        <PersonIcon sx={{ fontSize: 40, color: '#f57c00', mb: 1 }} />
                                        <Typography variant="body2" color="textSecondary" sx={{ mb: 0.5 }}>
                                            Class Room
                                        </Typography>
                                        <Typography variant="h5" sx={{ fontWeight: '600', color: '#f57c00' }}>
                                            {studentInfo?.classRoom || 'N/A'}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>

                            <Grid item xs={12} sm={6} md={3}>
                                <Card sx={{ boxShadow: 1, border: '1px solid #e0e0e0' }}>
                                    <CardContent sx={{ textAlign: 'center', py: 2 }}>
                                        <Typography sx={{ fontSize: 28, fontWeight: '600', color: '#d32f2f', mb: 1 }}>
                                            ✓
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary" sx={{ mb: 0.5 }}>
                                            Status
                                        </Typography>
                                        <Chip label="Active" size="small" color="success" />
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>

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
                                            <Chip label="Student" size="small" color="primary" />
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

export default StudentDashboard;
