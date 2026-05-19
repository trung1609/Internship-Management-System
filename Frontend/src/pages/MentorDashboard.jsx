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
import MenuBookIcon from '@mui/icons-material/MenuBook';
import GroupIcon from '@mui/icons-material/Group';

const MentorDashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);
    const [loading, setLoading] = useState(true);
    const [studentsList, setStudentsList] = useState([]);
    const [error, setError] = useState(null);
    const [stats, setStats] = useState({
        totalStudents: 0,
        completed: 0,
        inProgress: 0,
        needReview: 0
    });

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                setLoading(true);
                const response = await studentApi.getAllStudents(0, 50);
                const students = response.content || [];
                setStudentsList(students);

                // Calculate stats from the fetched data
                const completed = students.filter(s => s.status === 'Completed').length;
                const inProgress = students.filter(s => s.status === 'Active' || s.status === 'In Progress').length;
                const needReview = students.filter(s => s.status === 'Need Review').length;

                setStats({
                    totalStudents: students.length,
                    completed,
                    inProgress,
                    needReview
                });
            } catch (err) {
                console.error('Failed to load students:', err);
                setError('Failed to load students information');
            } finally {
                setLoading(false);
            }
        };

        fetchStudents();
    }, []);

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'active':
            case 'in progress':
                return 'success';
            case 'completed':
                return 'info';
            case 'inactive':
            case 'need review':
                return 'warning';
            default:
                return 'default';
        }
    };

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

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#f5f5f5' }}>
            {/* Header */}
            <AppBar position="static" sx={{ bgcolor: '#388e3c' }}>
                <Toolbar>
                    <MenuBookIcon sx={{ mr: 2, fontSize: 28 }} />
                    <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: '600' }}>
                        Mentor Portal
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Button
                            color="inherit"
                            onClick={handleMenuOpen}
                            startIcon={<PersonIcon />}
                            sx={{ textTransform: 'none', fontSize: '0.95rem' }}
                        >
                            {user?.fullName || 'Mentor'}
                        </Button>
                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleMenuClose}
                        >
                            <MenuItem disabled>
                                <Typography variant="body2">
                                    Email: {user?.email}
                                </Typography>
                            </MenuItem>
                            <MenuItem onClick={handleLogout}>
                                <LogoutIcon sx={{ mr: 1 }} />
                                Logout
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
                        <Paper elevation={1} sx={{ p: 2.5, mb: 3, bgcolor: '#388e3c', color: 'white', borderRadius: 1 }}>
                            <Typography variant="h5" sx={{ fontWeight: '600', mb: 0.5 }}>
                                Welcome back, {user?.fullName}! 👨‍🏫
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                Manage and track your students' internship progress.
                            </Typography>
                        </Paper>

                        {/* Quick Stats */}
                        <Grid container spacing={2} sx={{ mb: 3 }}>
                            <Grid item xs={12} sm={6} md={3}>
                                <Card sx={{ boxShadow: 1, border: '1px solid #e0e0e0' }}>
                                    <CardContent sx={{ textAlign: 'center', py: 2 }}>
                                        <GroupIcon sx={{ fontSize: 40, color: '#388e3c', mb: 1 }} />
                                        <Typography variant="body2" color="textSecondary" sx={{ mb: 0.5 }}>
                                            Total Students
                                        </Typography>
                                        <Typography variant="h5" sx={{ fontWeight: '600', color: '#388e3c' }}>
                                            {stats.totalStudents}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>

                            <Grid item xs={12} sm={6} md={3}>
                                <Card sx={{ boxShadow: 1, border: '1px solid #e0e0e0' }}>
                                    <CardContent sx={{ textAlign: 'center', py: 2 }}>
                                        <Typography variant="body2" color="textSecondary" sx={{ mb: 0.5 }}>
                                            Completed
                                        </Typography>
                                        <Typography variant="h5" sx={{ fontWeight: '600', color: '#1976d2' }}>
                                            {stats.completed}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>

                            <Grid item xs={12} sm={6} md={3}>
                                <Card sx={{ boxShadow: 1, border: '1px solid #e0e0e0' }}>
                                    <CardContent sx={{ textAlign: 'center', py: 2 }}>
                                        <Typography variant="body2" color="textSecondary" sx={{ mb: 0.5 }}>
                                            In Progress
                                        </Typography>
                                        <Typography variant="h5" sx={{ fontWeight: '600', color: '#f57c00' }}>
                                            {stats.inProgress}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>

                            <Grid item xs={12} sm={6} md={3}>
                                <Card sx={{ boxShadow: 1, border: '1px solid #e0e0e0' }}>
                                    <CardContent sx={{ textAlign: 'center', py: 2 }}>
                                        <Typography variant="body2" color="textSecondary" sx={{ mb: 0.5 }}>
                                            Need Review
                                        </Typography>
                                        <Typography variant="h5" sx={{ fontWeight: '600', color: '#d32f2f' }}>
                                            {stats.needReview}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>

                        {/* Students List */}
                        <Paper elevation={1} sx={{ p: 2.5, mb: 3, borderRadius: 1 }}>
                            <Typography variant="h6" sx={{ fontWeight: '600', mb: 2 }}>
                                Assigned Students
                            </Typography>
                            {studentsList.length === 0 ? (
                                <Typography variant="body2" color="textSecondary">
                                    No students assigned yet.
                                </Typography>
                            ) : (
                                <TableContainer>
                                    <Table size="small">
                                        <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                                            <TableRow>
                                                <TableCell sx={{ fontWeight: '600', fontSize: '0.9rem' }}>Student Name</TableCell>
                                                <TableCell sx={{ fontWeight: '600', fontSize: '0.9rem' }}>Email</TableCell>
                                                <TableCell sx={{ fontWeight: '600', fontSize: '0.9rem' }}>Status</TableCell>
                                                <TableCell sx={{ fontWeight: '600', fontSize: '0.9rem' }} align="right">Progress</TableCell>
                                                <TableCell sx={{ fontWeight: '600', fontSize: '0.9rem' }} align="center">Action</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {studentsList.map((student) => (
                                                <TableRow key={student.studentId} sx={{ '&:hover': { bgcolor: '#f9f9f9' } }}>
                                                    <TableCell sx={{ fontSize: '0.9rem' }}>{student.fullName || student.name}</TableCell>
                                                    <TableCell sx={{ fontSize: '0.9rem' }}>{student.email}</TableCell>
                                                    <TableCell sx={{ fontSize: '0.9rem' }}>
                                                        <Chip
                                                            label={student.status || 'Active'}
                                                            color={getStatusColor(student.status)}
                                                            size="small"
                                                        />
                                                    </TableCell>
                                                    <TableCell align="right" sx={{ fontSize: '0.9rem' }}>{student.progress || 0}%</TableCell>
                                                    <TableCell align="center">
                                                        <Button
                                                            size="small"
                                                            variant="outlined"
                                                            color="primary"
                                                            onClick={() => navigate(`/student/${student.studentId}`)}
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
                                            <Chip label="Mentor" size="small" sx={{ bgcolor: '#388e3c', color: 'white' }} />
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

export default MentorDashboard;
