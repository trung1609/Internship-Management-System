import { useContext, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { studentApi } from '../api/resourceApi';
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
    Card,
    CardContent
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import SchoolIcon from '@mui/icons-material/School';
import EditIcon from '@mui/icons-material/Edit';

const StudentDetailPage = () => {
    const { user, logout } = useContext(AuthContext);
    const { studentId } = useParams();
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);
    const [loading, setLoading] = useState(true);
    const [studentInfo, setStudentInfo] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStudentDetail = async () => {
            try {
                setError(null);
                setLoading(true);
                
                const response = await studentApi.getStudentById(studentId);
                setStudentInfo(response?.data || {});
            } catch (err) {
                console.error('Failed to load student detail:', err);
                setError('Failed to load student information: ' + (err.message || 'Unknown error'));
            } finally {
                setLoading(false);
            }
        };

        if (studentId) {
            fetchStudentDetail();
        }
    }, [studentId]);

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

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#f5f5f5' }}>
            {/* Header */}
            <AppBar position="static" sx={{ bgcolor: '#1976d2' }}>
                <Toolbar>
                    <SchoolIcon sx={{ mr: 2, fontSize: 28 }} />
                    <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: '600' }}>
                        Student Detail
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
                    sx={{ mb: 2, textTransform: 'none', color: '#1976d2', fontWeight: '600' }}
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

                        {/* Student Header */}
                        <Paper elevation={1} sx={{ p: 2.5, mb: 3, bgcolor: '#1976d2', color: 'white', borderRadius: 1 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Box>
                                    <Typography variant="h5" sx={{ fontWeight: '600', mb: 0.5 }}>
                                        {studentInfo?.fullName}
                                    </Typography>
                                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                        Student Code: {studentInfo?.studentCode}
                                    </Typography>
                                </Box>
                                <Button
                                    variant="contained"
                                    color="success"
                                    startIcon={<EditIcon />}
                                    sx={{ textTransform: 'none' }}
                                >
                                    Edit
                                </Button>
                            </Box>
                        </Paper>

                        {/* Student Info Grid */}
                        <Grid container spacing={2.5} sx={{ mb: 3 }}>
                            {/* Basic Information */}
                            <Grid item xs={12} md={6}>
                                <Paper elevation={1} sx={{ p: 2.5, border: '1px solid #e0e0e0' }}>
                                    <Typography variant="h6" sx={{ fontWeight: '600', mb: 2, color: '#1976d2' }}>
                                        Basic Information
                                    </Typography>

                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant="caption" color="textSecondary">
                                            Full Name
                                        </Typography>
                                        <Typography variant="body2" sx={{ fontWeight: '600', mt: 0.5 }}>
                                            {studentInfo?.fullName || 'N/A'}
                                        </Typography>
                                    </Box>

                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant="caption" color="textSecondary">
                                            Email
                                        </Typography>
                                        <Typography variant="body2" sx={{ fontWeight: '600', mt: 0.5 }}>
                                            {studentInfo?.email || 'N/A'}
                                        </Typography>
                                    </Box>

                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant="caption" color="textSecondary">
                                            Phone Number
                                        </Typography>
                                        <Typography variant="body2" sx={{ fontWeight: '600', mt: 0.5 }}>
                                            {studentInfo?.phoneNumber || 'N/A'}
                                        </Typography>
                                    </Box>

                                    <Box>
                                        <Typography variant="caption" color="textSecondary">
                                            Date of Birth
                                        </Typography>
                                        <Typography variant="body2" sx={{ fontWeight: '600', mt: 0.5 }}>
                                            {studentInfo?.dateOfBirth || 'N/A'}
                                        </Typography>
                                    </Box>
                                </Paper>
                            </Grid>

                            {/* Academic Information */}
                            <Grid item xs={12} md={6}>
                                <Paper elevation={1} sx={{ p: 2.5, border: '1px solid #e0e0e0' }}>
                                    <Typography variant="h6" sx={{ fontWeight: '600', mb: 2, color: '#388e3c' }}>
                                        Academic Information
                                    </Typography>

                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant="caption" color="textSecondary">
                                            Student Code
                                        </Typography>
                                        <Typography variant="body2" sx={{ fontWeight: '600', mt: 0.5, color: '#388e3c' }}>
                                            {studentInfo?.studentCode || 'N/A'}
                                        </Typography>
                                    </Box>

                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant="caption" color="textSecondary">
                                            Major
                                        </Typography>
                                        <Typography variant="body2" sx={{ fontWeight: '600', mt: 0.5 }}>
                                            {studentInfo?.major || 'N/A'}
                                        </Typography>
                                    </Box>

                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant="caption" color="textSecondary">
                                            Class Room
                                        </Typography>
                                        <Typography variant="body2" sx={{ fontWeight: '600', mt: 0.5 }}>
                                            {studentInfo?.classRoom || 'N/A'}
                                        </Typography>
                                    </Box>

                                    <Box>
                                        <Typography variant="caption" color="textSecondary">
                                            Address
                                        </Typography>
                                        <Typography variant="body2" sx={{ fontWeight: '600', mt: 0.5 }}>
                                            {studentInfo?.address || 'N/A'}
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

export default StudentDetailPage;
