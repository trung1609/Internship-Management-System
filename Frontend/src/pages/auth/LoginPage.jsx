import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { AuthContext } from "../../context/AuthContext";
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Stack,
} from "@mui/material";
import { motion } from "framer-motion";

const LoginPage = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setIsLoading(true);
    setErrorMsg("");
    try {
      await login(data.username, data.password);
      navigate("/dashboard");
    } catch (error) {
      if (error.response?.status === 401)
        setErrorMsg("Sai tài khoản hoặc mật khẩu!");
      else setErrorMsg("Đã xảy ra lỗi, vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      sx={{ minHeight: "100vh", display: "flex", bgcolor: "#ffffff" }}
    >
      {/* Cột Trái: Hình ảnh công nghệ */}
      <Box
        sx={{
          flex: 1.2,
          display: { xs: "none", lg: "block" },
          backgroundImage: `url('https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(37, 99, 235, 0.4) 0%, rgba(15, 23, 42, 0.9) 100%)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            p: 8,
          }}
        >
          <Typography
            variant="h3"
            sx={{
              color: "#fff",
              fontWeight: 800,
              mb: 2,
              letterSpacing: "-1px",
            }}
          >
            Nền tảng <br />
            Thực tập số.
          </Typography>
          <Typography
            variant="h6"
            sx={{ color: "#cbd5e1", fontWeight: 400, maxWidth: "500px" }}
          >
            Đăng nhập để truy cập vào hệ thống đánh giá, nộp báo cáo và tương
            tác với nhóm của bạn.
          </Typography>
        </Box>
      </Box>

      {/* Cột Phải: Form Đăng nhập */}

      <Box
        component={motion.div}
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: { xs: 3, sm: 6, md: 8 },
        }}
      >
        <Box sx={{ width: "100%", maxWidth: "400px" }}>
          <Button
            variant="text"
            onClick={() => navigate("/")}
            sx={{
              mb: 4,
              ml: -1,
              color: "#64748b",
              justifyContent: "flex-start",
              textTransform: "none",
              fontWeight: 600,
              "&:hover": {
                bgcolor: "transparent",
                color: "#0f172a",
              },
            }}
          >
            ← Quay lại trang chủ
          </Button>
          <Typography
            component="h1"
            variant="h3"
            sx={{
              fontWeight: 900,
              mb: 1.5,
              color: "#0f172a",
              letterSpacing: "-1px",
            }}
          >
            Chào mừng trở lại.
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: "#64748b", mb: 5, fontSize: "1.1rem" }}
          >
            Vui lòng điền thông tin đăng nhập của bạn.
          </Typography>

          {errorMsg && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {errorMsg}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <Stack spacing={3}>
              <TextField
                fullWidth
                label="Tên đăng nhập"
                variant="outlined"
                autoFocus
                {...register("username", {
                  required: "Vui lòng nhập tên đăng nhập",
                })}
                error={!!errors.username}
                helperText={errors.username?.message}
                InputProps={{ sx: { borderRadius: "12px" } }}
              />
              <TextField
                fullWidth
                label="Mật khẩu"
                type="password"
                variant="outlined"
                {...register("password", {
                  required: "Vui lòng nhập mật khẩu",
                })}
                error={!!errors.password}
                helperText={errors.password?.message}
                InputProps={{ sx: { borderRadius: "12px" } }}
              />
            </Stack>

            <Box
              sx={{ display: "flex", justifyContent: "flex-end", mt: 2, mb: 4 }}
            >
              <Typography
                variant="body2"
                sx={{
                  color: "#64748b",
                  cursor: "pointer",
                  "&:hover": { color: "#0f172a" },
                }}
              >
                Quên mật khẩu?
              </Typography>
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isLoading}
              disableElevation
              sx={{
                mb: 3,
                py: 2,
                fontSize: "1rem",
                fontWeight: 700,
                borderRadius: "12px",
                bgcolor: "#2563eb",
                color: "#fff",
                textTransform: "none",
                "&:hover": { bgcolor: "#1d4ed8" },
              }}
            >
              {isLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Đăng nhập"
              )}
            </Button>

            <Typography
              variant="body1"
              align="center"
              sx={{ color: "#64748b" }}
            >
              Chưa có tài khoản?{" "}
              <Link
                to="/register"
                style={{
                  textDecoration: "none",
                  color: "#2563eb",
                  fontWeight: 700,
                }}
              >
                Đăng ký ngay
              </Link>
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default LoginPage;
