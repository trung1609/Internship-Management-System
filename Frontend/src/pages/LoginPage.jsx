import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { AuthContext } from '../context/AuthContext';
import { 
  Container, 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Paper, 
  Alert, 
  CircularProgress 
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Avatar from '@mui/material/Avatar';

const LoginPage = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      const userData = await login(data.username, data.password);
      
      if (userData.role === 'ROLE_ADMIN') {
        navigate('/admin-dashboard');
      } else if (userData.role === 'ROLE_MENTOR') {
        navigate('/mentor-dashboard'); 
      } else {
        navigate('/dashboard'); 
      }
      
    } catch (error) {
      if (error.response && error.response.status === 401) {
         setErrorMsg('Sai tên đăng nhập hoặc mật khẩu!');
      } else {
         setErrorMsg('Có lỗi xảy ra, vui lòng thử lại sau.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ padding: 4, width: '100%', borderRadius: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
            Đăng nhập hệ thống
          </Typography>

          {errorMsg && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{errorMsg}</Alert>}

          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 1, width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Tên đăng nhập"
              autoComplete="username"
              autoFocus
              {...register('username', { required: 'Vui lòng nhập tên đăng nhập' })}
              error={!!errors.username}
              helperText={errors.username ? errors.username.message : ''}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Mật khẩu"
              type="password"
              id="password"
              autoComplete="current-password"
              {...register('password', { required: 'Vui lòng nhập mật khẩu' })}
              error={!!errors.password}
              helperText={errors.password ? errors.password.message : ''}
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isLoading}
              sx={{ mt: 3, mb: 2, py: 1.5 }}
            >
              {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Đăng nhập'}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default LoginPage;