import { useState, useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  Button,
  Stack,
  TextField,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
  FormHelperText,
  Avatar,
  Chip,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Security,
  Person,
  Edit,
  LockReset,
  Settings as SettingsIcon,
} from "@mui/icons-material";
import { authApi } from "../api/authApi"; // Đảm bảo bạn đã thêm API updateProfile và changePassword vào đây
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { userApi } from "../api/resourceApi";

// Component hỗ trợ chuyển Tab
function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && (
        <Box sx={{ py: 3 }}>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </Box>
      )}
    </div>
  );
}

const SettingsPage = () => {
  const { user } = useContext(AuthContext);
  const [tabValue, setTabValue] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState(null);

  // States cho form đổi mật khẩu
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Form Cập nhật thông tin
  const {
    register: regProfile,
    handleSubmit: handleProfileSubmit,
    reset: resetProfile,
    formState: { errors: profileErrors },
  } = useForm();

  // Form Đổi mật khẩu
  const {
    register: regPassword,
    handleSubmit: handlePasswordSubmit,
    watch,
    reset: resetPasswordForm,
    formState: { errors: passwordErrors },
  } = useForm();

  const fetchProfile = async () => {
    try {
      const res = await authApi.getMe();

      setProfileData(res.data);

      resetProfile({
        username: res.data.username || "",
        fullName: res.data.fullName || "",
        email: res.data.email || "",
        phoneNumber: res.data.phoneNumber || "",
      });
    } catch (error) {
      toast.error("Không thể tải thông tin cá nhân");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const preventCopyPaste = (e) => e.preventDefault();

  // Xử lý Cập nhật thông tin
  const onUpdateProfile = async (data) => {
    setIsLoading(true);
    try {
      const currentUserId = user?.userId || user?.id;

      if (!currentUserId) {
        toast.error("Không tìm thấy ID người dùng!");
        return;
      }

      await userApi.updateUser(currentUserId, data);
      toast.success("Cập nhật thông tin thành công!");

      await fetchProfile();
    } catch (error) {
      const responseData = error.response?.data;

      if (responseData?.error && typeof responseData.error === "object") {
        const errorMessages = Object.values(responseData.error).join(" | ");
        toast.error(errorMessages);
      }
      else {
        toast.error("Cập nhật thất bại. Vui lòng kiểm tra lại dữ liệu!");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Xử lý Đổi mật khẩu
  const onChangePassword = async (data) => {
    setIsLoading(true);
    try {
      await userApi.changePassword({
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      });
      toast.success("Đổi mật khẩu thành công!");
      resetPasswordForm();
    } catch (error) {
      const errMsg =
        error.response?.error?.message;
      toast.error(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", p: { xs: 2, md: 4 } }}>
      <Typography
        variant="h4"
        sx={{
          fontWeight: 800,
          color: "#1e293b",
          mb: 4,
          display: "flex",
          alignItems: "center",
          gap: 2,
        }}
      >
        <SettingsIcon fontSize="large" sx={{ color: "#2563eb" }} /> Cài đặt Tài
        khoản
      </Typography>

      <Paper
        sx={{
          borderRadius: 4,
          overflow: "hidden",
          boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
        }}
      >
        <Box
          sx={{ borderBottom: 1, borderColor: "divider", bgcolor: "#f8fafc" }}
        >
          <Tabs
            value={tabValue}
            onChange={(e, newValue) => setTabValue(newValue)}
            variant="fullWidth"
          >
            <Tab
              icon={<Person />}
              iconPosition="start"
              label="Hồ sơ của tôi"
              sx={{ fontWeight: 600, py: 2.5 }}
            />
            <Tab
              icon={<Edit />}
              iconPosition="start"
              label="Cập nhật thông tin"
              sx={{ fontWeight: 600, py: 2.5 }}
            />
            <Tab
              icon={<Security />}
              iconPosition="start"
              label="Đổi mật khẩu"
              sx={{ fontWeight: 600, py: 2.5 }}
            />
          </Tabs>
        </Box>

        {/* TAB 1: XEM THÔNG TIN */}
        <CustomTabPanel value={tabValue} index={0}>
          <Box
            sx={{
              px: 4,
              py: 2,
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: 4,
              alignItems: "center",
            }}
          >
            <Avatar
              sx={{
                width: 120,
                height: 120,
                bgcolor: "#e0e7ff",
                color: "#3b82f6",
                fontSize: "3rem",
                fontWeight: 800,
              }}
            >
              {profileData?.username?.charAt(0).toUpperCase() || "U"}
            </Avatar>
            <Box sx={{ flex: 1, width: "100%" }}>
              <Stack spacing={2}>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Tên đăng nhập
                  </Typography>
                  <Typography variant="h6" fontWeight="700">
                    {profileData?.username}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Họ và Tên
                  </Typography>
                  <Typography variant="body1" fontWeight="600">
                    {profileData?.fullName || "Chưa cập nhật"}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Email
                  </Typography>
                  <Typography variant="body1" fontWeight="600">
                    {profileData?.email}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Số điện thoại
                  </Typography>
                  <Typography variant="body1" fontWeight="600">
                    {profileData?.phoneNumber || "Chưa cập nhật"}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Vai trò hệ thống
                  </Typography>
                  <Box sx={{ mt: 0.5 }}>
                    <Chip
                      label={profileData?.role}
                      color="primary"
                      size="small"
                      sx={{ fontWeight: 700 }}
                    />
                  </Box>
                </Box>
              </Stack>
            </Box>
          </Box>
        </CustomTabPanel>

        {/* TAB 2: SỬA THÔNG TIN */}
        <CustomTabPanel value={tabValue} index={1}>
          <Box
            component="form"
            onSubmit={handleProfileSubmit(onUpdateProfile)}
            sx={{ px: { xs: 2, md: 4 } }}
          >
            <Stack spacing={3}>
              <TextField
                fullWidth
                label="Tên đăng nhập"
                {...regProfile("username")}
                disabled
              />
              <TextField
                fullWidth
                label="Họ và Tên"
                {...regProfile("fullName", {
                  required: "Vui lòng nhập họ tên",
                })}
                error={!!profileErrors.fullName}
                helperText={profileErrors.fullName?.message}
              />
              <TextField
                fullWidth
                label="Email"
                type="email"
                {...regProfile("email", { required: "Vui lòng nhập Email" })}
                error={!!profileErrors.email}
                helperText={profileErrors.email?.message}
              />
              <TextField
                fullWidth
                label="Số điện thoại"
                {...regProfile("phoneNumber")}
                error={!!profileErrors.phoneNumber}
                helperText={profileErrors.phoneNumber?.message}
              />
              <Button
                type="submit"
                variant="contained"
                disabled={isLoading}
                sx={{ py: 1.5, fontWeight: 700, borderRadius: 2 }}
              >
                {isLoading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Lưu Thay Đổi"
                )}
              </Button>
            </Stack>
          </Box>
        </CustomTabPanel>

        {/* TAB 3: ĐỔI MẬT KHẨU */}
        <CustomTabPanel value={tabValue} index={2}>
          <Box
            component="form"
            onSubmit={handlePasswordSubmit(onChangePassword)}
            sx={{ px: { xs: 2, md: 4 }, maxWidth: 500, mx: "auto" }}
          >
            <Stack spacing={3}>
              {/* Mật khẩu cũ */}
              <FormControl
                fullWidth
                variant="outlined"
                error={!!passwordErrors.oldPassword}
              >
                <InputLabel>Mật khẩu hiện tại</InputLabel>
                <OutlinedInput
                  type={showOldPassword ? "text" : "password"}
                  {...regPassword("oldPassword", {
                    required: "Vui lòng nhập mật khẩu hiện tại",
                  })}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowOldPassword(!showOldPassword)}
                        onMouseDown={(e) => e.preventDefault()}
                        edge="end"
                      >
                        {showOldPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Mật khẩu hiện tại"
                  sx={{ borderRadius: 2 }}
                />
                {passwordErrors.oldPassword && (
                  <FormHelperText error>
                    {passwordErrors.oldPassword.message}
                  </FormHelperText>
                )}
              </FormControl>

              {/* Mật khẩu mới */}
              <FormControl
                fullWidth
                variant="outlined"
                error={!!passwordErrors.newPassword}
              >
                <InputLabel>Mật khẩu mới</InputLabel>
                <OutlinedInput
                  type={showNewPassword ? "text" : "password"}
                  onCopy={preventCopyPaste}
                  onPaste={preventCopyPaste}
                  onCut={preventCopyPaste}
                  {...regPassword("newPassword", {
                    required: "Vui lòng nhập mật khẩu mới",
                    pattern: {
                      value:
                        /^(|(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+=-]).{8,})$/,
                      message:
                        "Mật khẩu yếu. Yêu cầu 8 ký tự gồm chữ hoa, thường, số, ký tự đặc biệt.",
                    },
                  })}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        onMouseDown={(e) => e.preventDefault()}
                        edge="end"
                      >
                        {showNewPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Mật khẩu mới"
                  sx={{ borderRadius: 2 }}
                />
                {passwordErrors.newPassword && (
                  <FormHelperText error>
                    {passwordErrors.newPassword.message}
                  </FormHelperText>
                )}
              </FormControl>

              {/* Xác nhận mật khẩu mới */}
              <FormControl
                fullWidth
                variant="outlined"
                error={!!passwordErrors.confirmPassword}
              >
                <InputLabel>Xác nhận mật khẩu mới</InputLabel>
                <OutlinedInput
                  type={showConfirmPassword ? "text" : "password"}
                  onCopy={preventCopyPaste}
                  onPaste={preventCopyPaste}
                  onCut={preventCopyPaste}
                  {...regPassword("confirmPassword", {
                    required: "Vui lòng xác nhận mật khẩu",
                    validate: (val) =>
                      val === watch("newPassword") || "Mật khẩu không khớp",
                  })}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        onMouseDown={(e) => e.preventDefault()}
                        edge="end"
                      >
                        {showConfirmPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Xác nhận mật khẩu mới"
                  sx={{ borderRadius: 2 }}
                />
                {passwordErrors.confirmPassword && (
                  <FormHelperText error>
                    {passwordErrors.confirmPassword.message}
                  </FormHelperText>
                )}
              </FormControl>

              <Button
                type="submit"
                variant="contained"
                color="error"
                disabled={isLoading}
                startIcon={<LockReset />}
                sx={{ py: 1.5, fontWeight: 700, borderRadius: 2 }}
              >
                {isLoading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Cập Nhật Mật Khẩu"
                )}
              </Button>
            </Stack>
          </Box>
        </CustomTabPanel>
      </Paper>
    </Box>
  );
};

export default SettingsPage;
