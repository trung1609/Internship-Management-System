import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { authApi } from '../api/authApi';
import {
  Container, Box, Typography, TextField, Button,
  Paper, Alert, CircularProgress, Avatar, Grid
} from '@mui/material';
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [backendErrors, setBackendErrors] = useState({});

  const { register, handleSubmit, watch, formState: { errors }, setError } = useForm();

  const onSubmit = async (data) => {
    setIsLoading(true);
    setBackendErrors({});
    try {
      const { confirmPassword, ...registerData } = data;
      await authApi.register(registerData);
      setSuccessMsg('Registration successful! Redirecting...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      if (error.response && error.response.data) {
        const errorData = error.response.data;

        if (errorData.error && typeof errorData.error === 'object') {
          setBackendErrors(errorData.error);
          Object.keys(errorData.error).forEach((fieldName) => {
            setError(fieldName, {
              type: 'manual',
              message: errorData.error[fieldName]
            });
          });
        }
      } else {
        setBackendErrors({ general: 'Registration failed. Please check your information.' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box sx={{ marginTop: 6, display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh' }}>
        <Paper elevation={3} sx={{
          padding: { xs: 3, sm: 5 }, // Tăng nhẹ padding cho cân đối với form to
          width: '100%',
          borderRadius: 2,
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}>

          {/* Header section */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
            <Avatar sx={{
              m: 1,
              bgcolor: '#9c27b0',
              width: 56,
              height: 56
            }}>
              <PersonAddOutlinedIcon sx={{ fontSize: 32 }} />
            </Avatar>
            <Typography component="h1" variant="h4" sx={{
              fontWeight: 'bold',
              color: '#333',
              mt: 1
            }}>
              Create Account
            </Typography>
          </Box>

          {/* Success & Error messages */}
          {successMsg && <Alert severity="success" sx={{ mb: 2 }}>{successMsg}</Alert>}
          {backendErrors.general && <Alert severity="error" sx={{ mb: 2 }}>{backendErrors.general}</Alert>}

          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 2, width: '100%' }}>
            <Grid container spacing={2.5}>
              {/* Full Name */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  variant="outlined"
                  label="Full Name"
                  placeholder="Enter your full name"
                  {...register('fullName', {
                    required: 'Full name is required',
                    pattern: {
                      value: /^[\p{L}0-9]+( [\p{L}0-9]+)*$/u,
                      message: 'Full name must contain only letters, numbers, and spaces'
                    }
                  })}
                  error={!!errors.fullName || !!backendErrors.fullName}
                  helperText={backendErrors.fullName || errors.fullName?.message}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': { borderColor: '#9c27b0' },
                      '&.Mui-focused fieldset': { borderColor: '#9c27b0' }
                    }
                  }}
                />
              </Grid>

              {/* Username */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  variant="outlined"
                  label="Username"
                  placeholder="Minimum 3 characters"
                  {...register('username', {
                    required: 'Username is required',
                    minLength: { value: 3, message: 'Minimum 3 characters' }
                  })}
                  error={!!errors.username || !!backendErrors.username}
                  helperText={backendErrors.username || errors.username?.message}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': { borderColor: '#9c27b0' },
                      '&.Mui-focused fieldset': { borderColor: '#9c27b0' }
                    }
                  }}
                />
              </Grid>

              {/* Email */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  variant="outlined"
                  label="Email"
                  type="email"
                  placeholder="your.email@example.com"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^\S+@\S+\.\S+$/i,
                      message: 'Invalid email address'
                    }
                  })}
                  error={!!errors.email || !!backendErrors.email}
                  helperText={backendErrors.email || errors.email?.message}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': { borderColor: '#9c27b0' },
                      '&.Mui-focused fieldset': { borderColor: '#9c27b0' }
                    }
                  }}
                />
              </Grid>

              {/* Phone Number */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  variant="outlined"
                  label="Phone Number"
                  placeholder="0xxxxxxxxx"
                  {...register('phoneNumber', {
                    required: 'Phone number is required',
                    pattern: {
                      value: /^0[356789]\d{8}$/,
                      message: 'Phone number must start with 0 and have 10 digits'
                    }
                  })}
                  error={!!errors.phoneNumber || !!backendErrors.phoneNumber}
                  helperText={backendErrors.phoneNumber || errors.phoneNumber?.message}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': { borderColor: '#9c27b0' },
                      '&.Mui-focused fieldset': { borderColor: '#9c27b0' }
                    }
                  }}
                />
              </Grid>

              {/* Password */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  variant="outlined"
                  label="Password"
                  type="password"
                  placeholder="Min 8 characters, uppercase, lowercase, number, special character"
                  {...register('password', {
                    required: 'Password is required'
                  })}
                  error={!!errors.password || !!backendErrors.password}
                  helperText={backendErrors.password || errors.password?.message}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': { borderColor: '#9c27b0' },
                      '&.Mui-focused fieldset': { borderColor: '#9c27b0' }
                    }
                  }}
                />
              </Grid>

              {/* Confirm Password */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  variant="outlined"
                  label="Confirm Password"
                  type="password"
                  placeholder="Re-enter your password"
                  {...register('confirmPassword', {
                    required: 'Please confirm your password',
                    validate: (value) => value === watch('password') || 'Passwords do not match'
                  })}
                  error={!!errors.confirmPassword || !!backendErrors.confirmPassword}
                  helperText={backendErrors.confirmPassword || errors.confirmPassword?.message}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': { borderColor: '#9c27b0' },
                      '&.Mui-focused fieldset': { borderColor: '#9c27b0' }
                    }
                  }}
                />
              </Grid>
            </Grid>

            {/* Submit Button */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isLoading}
              sx={{
                mt: 4,
                mb: 2,
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 'bold',
                bgcolor: '#9c27b0',
                '&:hover': { bgcolor: '#7b1fa2' },
                '&:disabled': { bgcolor: '#bbb' }
              }}
            >
              {isLoading ? <CircularProgress size={24} color="inherit" /> : 'REGISTER NOW'}
            </Button>

            {/* Login Link */}
            <Box sx={{ textAlign: 'right', mt: 2 }}>
              <Typography variant="body1">
                Already have an account?{' '}
                <Link
                  to="/login"
                  style={{
                    textDecoration: 'none',
                    color: '#9c27b0',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
                  onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
                >
                  Login here
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default RegisterPage;