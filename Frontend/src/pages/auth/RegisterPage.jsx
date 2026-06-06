import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { authApi } from '../../api/authApi';
import { Box, Typography, TextField, Button, Alert, CircularProgress, Avatar, Paper, Stack } from '@mui/material';
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';
import { motion } from 'framer-motion';

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
    <Box
      component={motion.div}
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }} // Hiệu ứng khi thoát trang
      transition={{ duration: 0.4, ease: "easeInOut" }}
      sx={{ minHeight: "100vh", display: "flex", bgcolor: "#f8fafc" }}
    >

      {/* Cột trái: Form Đăng ký */}
      <Box sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", p: { xs: 2, sm: 4 } }}>
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, type: "spring" }}
          style={{ width: "100%", maxWidth: "450px" }}
        >
          <Paper elevation={0} sx={{ p: { xs: 4, sm: 5 }, borderRadius: 4, bgcolor: '#ffffff', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.08)', border: '1px solid #f1f5f9' }}>
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
              <Avatar sx={{ mb: 3, bgcolor: "#ecfdf5", color: "#059669", width: 56, height: 56, borderRadius: 3 }}>
                <PersonAddOutlinedIcon fontSize="medium" />
              </Avatar>
              <Typography component="h1" variant="h4" sx={{ fontWeight: 800, mb: 1, color: '#0f172a' }}>
                Tạo tài khoản
              </Typography>
              <Typography variant="body1" sx={{ color: '#64748b', mb: 3 }}>
                Điền thông tin dưới đây để bắt đầu hành trình.
              </Typography>

              {successMsg && <Alert severity="success" sx={{ width: "100%", mb: 3, borderRadius: 2 }}>{successMsg}</Alert>}
              {backendErrors.general && <Alert severity="error" sx={{ width: "100%", mb: 3, borderRadius: 2 }}>{backendErrors.general}</Alert>}

              <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ width: "100%" }}>
                {/* SỬ DỤNG STACK ĐỂ QUẢN LÝ KHOẢNG CÁCH, KHÔNG DÙNG GRID */}
                <Stack spacing={2.2}>
                  <TextField fullWidth label="Họ và tên" {...register('fullName', { required: 'Nhập họ tên' })} error={!!errors.fullName} helperText={errors.fullName?.message} InputProps={{ sx: { borderRadius: 2 } }} />
                  <TextField fullWidth label="Tên đăng nhập" {...register('username', { required: 'Nhập tên đăng nhập' })} error={!!errors.username} helperText={errors.username?.message} InputProps={{ sx: { borderRadius: 2 } }} />
                  <TextField fullWidth label="Email" type="email" {...register('email', { required: 'Nhập Email' })} error={!!errors.email} helperText={errors.email?.message} InputProps={{ sx: { borderRadius: 2 } }} />
                  <TextField fullWidth label="Số điện thoại" {...register('phoneNumber', { required: 'Nhập SĐT' })} error={!!errors.phoneNumber} helperText={errors.phoneNumber?.message} InputProps={{ sx: { borderRadius: 2 } }} />

                  {/* Gộp 2 ô Password gần nhau để UI đẹp hơn, vẫn dùng Stack */}
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2.2}>
                    <TextField fullWidth label="Mật khẩu" type="password" {...register('password', { required: 'Nhập mật khẩu' })} error={!!errors.password} helperText={errors.password?.message} InputProps={{ sx: { borderRadius: 2 } }} />
                    <TextField fullWidth label="Xác nhận" type="password" {...register('confirmPassword', { required: 'Xác nhận lại mật khẩu', validate: val => val === watch('password') || 'MK không khớp' })} error={!!errors.confirmPassword} helperText={errors.confirmPassword?.message} InputProps={{ sx: { borderRadius: 2 } }} />
                  </Stack>
                </Stack>

                <Box sx={{ textAlign: "right", mt: 1.5, mb: 3 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    Đã có tài khoản? <Link to="/login" style={{ textDecoration: "none", color: "#059669" }}>Đăng nhập</Link>
                  </Typography>
                </Box>

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={isLoading}
                  sx={{ py: 1.6, fontSize: "1rem", fontWeight: 700, borderRadius: 2, background: 'linear-gradient(to right, #059669, #10b981)', boxShadow: '0 4px 14px 0 rgba(16, 185, 129, 0.39)', '&:hover': { background: 'linear-gradient(to right, #047857, #059669)' } }}
                >
                  {isLoading ? <CircularProgress size={24} color="inherit" /> : "ĐĂNG KÝ NGAY"}
                </Button>
                <Button fullWidth variant="text" onClick={() => navigate("/")} sx={{ mt: 2, color: "#64748b", fontWeight: 600, '&:hover': { bgcolor: 'transparent', color: '#0f172a' } }}>
                  ← Quay lại trang chủ
                </Button>
              </Box>
            </Box>
          </Paper>
        </motion.div>
      </Box>

      {/* Cột phải: Artwork hiện đại (Màu lục nhạt cho cảm giác 'Tạo mới/Đăng ký') */}
      <Box sx={{
        flex: 1.2,
        display: { xs: "none", md: "flex" },
        background: "linear-gradient(135deg, #064e3b 0%, #0f172a 100%)",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden"
      }}>
        {/* Abstract floating shapes */}
        <motion.div
          animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          style={{ position: 'absolute', zIndex: 1 }}
        >
          <Box sx={{ width: 350, background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(20px)', borderRadius: 4, border: '1px solid rgba(255,255,255,0.1)', p: 4, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
            <Typography variant="h5" sx={{ color: '#fff', fontWeight: 800, mb: 2 }}>Bắt đầu hành trình!</Typography>
            <Stack spacing={2}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#10b981' }} />
                <Typography variant="body2" sx={{ color: '#cbd5e1' }}>Theo dõi tiến độ dễ dàng</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#10b981' }} />
                <Typography variant="body2" sx={{ color: '#cbd5e1' }}>Kết nối trực tiếp với Mentor</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#10b981' }} />
                <Typography variant="body2" sx={{ color: '#cbd5e1' }}>Đánh giá kết quả minh bạch</Typography>
              </Box>
            </Stack>
          </Box>
        </motion.div>
        <Box sx={{ position: 'absolute', width: 400, height: 400, background: 'radial-gradient(circle, rgba(16,185,129,0.2) 0%, rgba(0,0,0,0) 70%)', borderRadius: '50%', bottom: '10%', right: '10%' }} />
      </Box>
    </Box>
  );
};

export default RegisterPage;