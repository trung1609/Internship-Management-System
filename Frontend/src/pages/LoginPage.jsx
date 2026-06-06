import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { AuthContext } from "../context/AuthContext";
import { Box, Typography, TextField, Button, Alert, CircularProgress, Avatar, Paper, Stack } from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { motion } from "framer-motion";

const LoginPage = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setIsLoading(true);
    setErrorMsg("");
    try {
      await login(data.username, data.password);
      navigate("/dashboard");
    } catch (error) {
      if (error.response?.status === 401) setErrorMsg("Sai tài khoản hoặc mật khẩu!");
      else setErrorMsg("Đã xảy ra lỗi, vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 30 }} // Hiệu ứng khi bị đóng lại (trượt đi)
      transition={{ duration: 0.4, ease: "easeInOut" }}
      sx={{ minHeight: "100vh", display: "flex", bgcolor: "#ffffff" }}
    >
      <Box sx={{
        flex: 1.2,
        display: { xs: "none", md: "flex" },
        background: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden"
      }}>
        {/* Abstract floating shapes */}
        <motion.div
          animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          style={{ position: 'absolute', zIndex: 1 }}
        >
          <Box sx={{ width: 350, height: 200, background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(20px)', borderRadius: 4, border: '1px solid rgba(255,255,255,0.1)', p: 4, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
            <Typography variant="h5" sx={{ color: '#fff', fontWeight: 800, mb: 1 }}>Internship System</Typography>
            <Typography variant="body2" sx={{ color: '#94a3b8' }}>Nền tảng quản lý quy trình thực tập thông minh, minh bạch và hiệu quả nhất dành cho sinh viên IT.</Typography>
          </Box>
        </motion.div>
        {/* Glow behind the card */}
        <Box sx={{ position: 'absolute', width: 400, height: 400, background: 'radial-gradient(circle, rgba(56,189,248,0.3) 0%, rgba(0,0,0,0) 70%)', borderRadius: '50%' }} />
      </Box>

      {/* Cột phải: Form Đăng nhập */}
      <Box sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", p: { xs: 2, sm: 4 }, bgcolor: "#f8fafc" }}>
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, type: "spring" }}
          style={{ width: "100%", maxWidth: "420px" }}
        >
          <Paper elevation={0} sx={{ p: { xs: 4, sm: 5 }, borderRadius: 4, bgcolor: '#ffffff', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.08)', border: '1px solid #f1f5f9' }}>
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
              <Avatar sx={{ mb: 3, bgcolor: "#e0f2fe", color: "#0284c7", width: 56, height: 56, borderRadius: 3 }}>
                <LockOutlinedIcon fontSize="medium" />
              </Avatar>
              <Typography component="h1" variant="h4" sx={{ fontWeight: 800, mb: 1, color: '#0f172a' }}>
                Đăng nhập
              </Typography>
              <Typography variant="body1" sx={{ color: '#64748b', mb: 4 }}>
                Chào mừng trở lại! Vui lòng nhập thông tin.
              </Typography>

              {errorMsg && <Alert severity="error" sx={{ width: "100%", mb: 3, borderRadius: 2 }}>{errorMsg}</Alert>}

              <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ width: "100%" }}>
                <Stack spacing={2.5}>
                  <TextField
                    fullWidth
                    label="Tên đăng nhập"
                    autoFocus
                    {...register("username", { required: "Vui lòng nhập tên đăng nhập" })}
                    error={!!errors.username}
                    helperText={errors.username?.message}
                    InputProps={{ sx: { borderRadius: 2 } }}
                  />
                  <TextField
                    fullWidth
                    label="Mật khẩu"
                    type="password"
                    {...register("password", { required: "Vui lòng nhập mật khẩu" })}
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    InputProps={{ sx: { borderRadius: 2 } }}
                  />
                </Stack>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1.5, mb: 4 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    Chưa có tài khoản? <Link to="/register" style={{ textDecoration: "none", color: "#0284c7" }}>Đăng ký</Link>
                  </Typography>
                </Box>

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={isLoading}
                  sx={{ py: 1.6, fontSize: "1rem", fontWeight: 700, borderRadius: 2, background: 'linear-gradient(to right, #0284c7, #2563eb)', boxShadow: '0 4px 14px 0 rgba(37, 99, 235, 0.39)', '&:hover': { background: 'linear-gradient(to right, #0369a1, #1d4ed8)' } }}
                >
                  {isLoading ? <CircularProgress size={24} color="inherit" /> : "ĐĂNG NHẬP"}
                </Button>
                <Button fullWidth variant="text" onClick={() => navigate("/")} sx={{ mt: 2, color: "#64748b", fontWeight: 600, '&:hover': { bgcolor: 'transparent', color: '#0f172a' } }}>
                  ← Quay lại trang chủ
                </Button>
              </Box>
            </Box>
          </Paper>
        </motion.div>
      </Box>
    </Box>
  );
};

export default LoginPage;