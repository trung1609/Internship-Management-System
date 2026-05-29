import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { AuthContext } from "../context/AuthContext";
import { Box, Typography, TextField, Button, Alert, CircularProgress, Avatar, Slide, Paper } from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

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
    <Box sx={{ minHeight: "100vh", display: "flex", bgcolor: "#f4f6f8" }}>
      {/* Cột trái: Hình ảnh/Gradient trang trí */}
      <Box sx={{ flex: 1, display: { xs: "none", md: "flex" }, background: "linear-gradient(135deg, #001f3f 0%, #005A9C 100%)", alignItems: "center", justifyContent: "center", color: "white" }}>
        <Typography variant="h3" sx={{ fontWeight: "bold", textAlign: "center", px: 4 }}>Chào mừng trở lại! <br/> <Typography variant="h6" sx={{ mt: 2, fontWeight: 400 }}>Đăng nhập để tiếp tục quản lý tiến độ thực tập.</Typography></Typography>
      </Box>

      {/* Cột phải: Form có hiệu ứng Slide */}
      <Box sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", p: 3 }}>
        <Slide direction="right" in={true} mountOnEnter unmountOnExit timeout={1000}>
          <Paper elevation={4} sx={{ p: { xs: 4, sm: 6 }, width: "100%", maxWidth: 450, borderRadius: 3 }}>
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <Avatar sx={{ m: 1, bgcolor: "primary.main", width: 56, height: 56 }}><LockOutlinedIcon fontSize="large" /></Avatar>
              <Typography component="h1" variant="h5" sx={{ fontWeight: "bold", mb: 3 }}>Đăng nhập</Typography>

              {errorMsg && <Alert severity="error" sx={{ width: "100%", mb: 2 }}>{errorMsg}</Alert>}

              <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ width: "100%" }}>
                <TextField margin="normal" required fullWidth label="Tên đăng nhập" autoFocus {...register("username", { required: "Vui lòng nhập tên đăng nhập" })} error={!!errors.username} helperText={errors.username?.message} />
                <TextField margin="normal" required fullWidth label="Mật khẩu" type="password" {...register("password", { required: "Vui lòng nhập mật khẩu" })} error={!!errors.password} helperText={errors.password?.message} />

                <Box sx={{ textAlign: "right", mt: 1, mb: 2 }}>
                  <Typography variant="body2">Chưa có tài khoản? <Link to="/register" style={{ textDecoration: "none", color: "#1976d2", fontWeight: "bold" }}>Đăng ký ngay</Link></Typography>
                </Box>

                <Button type="submit" fullWidth variant="contained" disabled={isLoading} sx={{ py: 1.5, fontSize: "1.1rem", borderRadius: 2 }}>
                  {isLoading ? <CircularProgress size={24} color="inherit" /> : "ĐĂNG NHẬP"}
                </Button>
                <Button fullWidth variant="text" onClick={() => navigate("/")} sx={{ mt: 2, color: "text.secondary" }}>Quay lại trang chủ</Button>
              </Box>
            </Box>
          </Paper>
        </Slide>
      </Box>
    </Box>
  );
};

export default LoginPage;