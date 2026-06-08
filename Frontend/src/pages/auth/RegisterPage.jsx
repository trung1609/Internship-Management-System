import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { authApi } from "../../api/authApi";
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

const RegisterPage = () => {
  const navigate = useNavigate();
  const [successMsg, setSuccessMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [backendErrors, setBackendErrors] = useState({});

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setError,
  } = useForm();

  const onSubmit = async (data) => {
    setIsLoading(true);
    setBackendErrors({});
    try {
      const { confirmPassword, ...registerData } = data;
      await authApi.register(registerData);
      setSuccessMsg("Đăng ký thành công! Đang chuyển hướng...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      if (error.response?.data?.error) {
        const errObj = error.response.data.error;
        setBackendErrors(errObj);
        Object.keys(errObj).forEach((field) =>
          setError(field, { type: "manual", message: errObj[field] }),
        );
      } else {
        setBackendErrors({
          general: "Đăng ký thất bại. Vui lòng kiểm tra lại.",
        });
      }
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
      {/* Cột Trái: Form Đăng ký tối giản */}
      <Box
        component={motion.div}
        initial={{ x: -50, opacity: 0 }}
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
        <Box sx={{ width: "100%", maxWidth: "440px" }}>
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
            Tạo tài khoản.
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: "#64748b", mb: 5, fontSize: "1.1rem" }}
          >
            Đăng ký để bắt đầu quản lý thực tập dễ dàng hơn.
          </Typography>

          {successMsg && (
            <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
              {successMsg}
            </Alert>
          )}
          {backendErrors.general && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {backendErrors.general}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <Stack spacing={2.5}>
              <TextField
                fullWidth
                label="Họ và tên"
                variant="outlined"
                {...register("fullName", { required: "Nhập họ tên" })}
                error={!!errors.fullName}
                helperText={errors.fullName?.message}
                InputProps={{ sx: { borderRadius: "12px" } }}
              />
              <TextField
                fullWidth
                label="Tên đăng nhập"
                variant="outlined"
                {...register("username", { required: "Nhập tên đăng nhập" })}
                error={!!errors.username}
                helperText={errors.username?.message}
                InputProps={{ sx: { borderRadius: "12px" } }}
              />
              <TextField
                fullWidth
                label="Email"
                type="email"
                variant="outlined"
                {...register("email", { required: "Nhập Email" })}
                error={!!errors.email}
                helperText={errors.email?.message}
                InputProps={{ sx: { borderRadius: "12px" } }}
              />
              <TextField
                fullWidth
                label="Số điện thoại"
                variant="outlined"
                {...register("phoneNumber", { required: "Nhập SĐT" })}
                error={!!errors.phoneNumber}
                helperText={errors.phoneNumber?.message}
                InputProps={{ sx: { borderRadius: "12px" } }}
              />

              <Stack direction={{ xs: "column", sm: "row" }} spacing={2.5}>
                <TextField
                  fullWidth
                  label="Mật khẩu"
                  type="password"
                  variant="outlined"
                  {...register("password", { required: "Nhập mật khẩu" })}
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  InputProps={{ sx: { borderRadius: "12px" } }}
                />
                <TextField
                  fullWidth
                  label="Xác nhận MK"
                  type="password"
                  variant="outlined"
                  {...register("confirmPassword", {
                    required: "Xác nhận lại",
                    validate: (val) =>
                      val === watch("password") || "Không khớp",
                  })}
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword?.message}
                  InputProps={{ sx: { borderRadius: "12px" } }}
                />
              </Stack>
            </Stack>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isLoading}
              disableElevation
              sx={{
                mt: 4,
                mb: 3,
                py: 2,
                fontSize: "1rem",
                fontWeight: 700,
                borderRadius: "12px",
                bgcolor: "#0f172a",
                color: "#fff",
                textTransform: "none",
                "&:hover": { bgcolor: "#334155" },
              }}
            >
              {isLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Đăng ký tài khoản"
              )}
            </Button>

            <Typography
              variant="body1"
              align="center"
              sx={{ color: "#64748b" }}
            >
              Đã có tài khoản?{" "}
              <Link
                to="/login"
                style={{
                  textDecoration: "none",
                  color: "#0f172a",
                  fontWeight: 700,
                }}
              >
                Đăng nhập
              </Link>
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Cột Phải: Hình ảnh chất lượng cao có Overlay */}
      <Box
        sx={{
          flex: 1.2,
          display: { xs: "none", lg: "block" },
          backgroundImage: `url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&auto=format&fit=crop')`,
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
              "linear-gradient(180deg, rgba(16, 185, 129, 0.4) 0%, rgba(15, 23, 42, 0.9) 100%)",
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
            Hành trình của bạn <br />
            bắt đầu từ đây.
          </Typography>
          <Typography
            variant="h6"
            sx={{ color: "#cbd5e1", fontWeight: 400, maxWidth: "500px" }}
          >
            Hệ thống quản lý thực tập thông minh giúp bạn kết nối nhanh chóng
            với Mentor và doanh nghiệp.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default RegisterPage;
