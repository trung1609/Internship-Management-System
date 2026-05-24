import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { authApi } from '../api/authApi';
import { Box, Typography, TextField, Button, Alert, CircularProgress, Avatar, Slide, Paper, Grid, Stack } from '@mui/material';
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
      setSuccessMsg('Đăng ký thành công! Đang chuyển hướng...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      if (error.response?.data?.error) {
        const errObj = error.response.data.error;
        setBackendErrors(errObj);
        Object.keys(errObj).forEach(field => setError(field, { type: 'manual', message: errObj[field] }));
      } else {
        setBackendErrors({ general: 'Đăng ký thất bại. Vui lòng kiểm tra lại.' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", bgcolor: "#f4f6f8" }}>
      {/* Cột trái: Form có hiệu ứng Slide (Trượt từ phải sang) */}
      {/* Cột trái: Form có hiệu ứng Slide (Trượt từ phải sang) */}
      <Box sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", p: 3 }}>
        <Slide direction="left" in={true} mountOnEnter unmountOnExit timeout={1000}>
          {/* GIẢM maxWidth VỀ 450 ĐỂ BẰNG ĐÚNG KÍCH THƯỚC TRANG LOGIN */}
          <Paper elevation={4} sx={{ p: { xs: 4, sm: 5 }, width: "100%", maxWidth: 450, borderRadius: 3 }}>
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <Avatar sx={{ m: 1, bgcolor: "#1976d2", width: 56, height: 56 }}>
                <PersonAddOutlinedIcon fontSize="large" />
              </Avatar>
              <Typography component="h1" variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
                Tạo tài khoản
              </Typography>

              {successMsg && <Alert severity="success" sx={{ width: "100%", mb: 2 }}>{successMsg}</Alert>}
              {backendErrors.general && <Alert severity="error" sx={{ width: "100%", mb: 2 }}>{backendErrors.general}</Alert>}

              {/* Thay toàn bộ <Grid> bằng <Stack> để đảm bảo ô nhập dài full 100% */}
              <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ width: "100%" }}>

                <Stack spacing={2}>
                  <TextField fullWidth required label="Họ và tên" {...register('fullName', { required: 'Nhập họ tên' })} error={!!errors.fullName} helperText={errors.fullName?.message} />

                  <TextField fullWidth required label="Tên đăng nhập" {...register('username', { required: 'Nhập tên đăng nhập' })} error={!!errors.username} helperText={errors.username?.message} />

                  <TextField fullWidth required label="Email" type="email" {...register('email', { required: 'Nhập Email' })} error={!!errors.email} helperText={errors.email?.message} />

                  <TextField fullWidth required label="Số điện thoại" {...register('phoneNumber', { required: 'Nhập SĐT' })} error={!!errors.phoneNumber} helperText={errors.phoneNumber?.message} />

                  <TextField fullWidth required label="Mật khẩu" type="password" {...register('password', { required: 'Nhập mật khẩu' })} error={!!errors.password} helperText={errors.password?.message} />

                  <TextField fullWidth required label="Xác nhận mật khẩu" type="password" {...register('confirmPassword', { required: 'Xác nhận lại mật khẩu', validate: val => val === watch('password') || 'MK không khớp' })} error={!!errors.confirmPassword} helperText={errors.confirmPassword?.message} />
                </Stack>

                <Box sx={{ textAlign: "right", mt: 2, mb: 2 }}>
                  <Typography variant="body2">Đã có tài khoản? <Link to="/login" style={{ textDecoration: "none", color: "#1976d2", fontWeight: "bold" }}>Đăng nhập</Link></Typography>
                </Box>

                <Button type="submit" fullWidth variant="contained" disabled={isLoading} sx={{ py: 1.5, fontSize: "1.1rem", borderRadius: 2 }}>
                  {isLoading ? <CircularProgress size={24} color="inherit" /> : "ĐĂNG KÝ NGAY"}
                </Button>
                <Button fullWidth variant="text" onClick={() => navigate("/")} sx={{ mt: 1, color: "text.secondary" }}>Quay lại trang chủ</Button>
              </Box>
            </Box>
          </Paper>
        </Slide>
      </Box>

      {/* Cột phải: Gradient trang trí */}
      <Box sx={{ flex: 1, display: { xs: "none", md: "flex" }, background: "linear-gradient(135deg, #005A9C 0%, #001f3f 100%)", alignItems: "center", justifyContent: "center", color: "white" }}>
        <Typography variant="h3" sx={{ fontWeight: "bold", textAlign: "center", px: 4 }}>Bắt đầu hành trình! <br /> <Typography variant="h6" sx={{ mt: 2, fontWeight: 400 }}>Tạo tài khoản để truy cập hệ thống ngay hôm nay.</Typography></Typography>
      </Box>
    </Box>
  );
};

export default RegisterPage;