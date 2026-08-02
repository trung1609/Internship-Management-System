import {useState, useEffect} from "react";
import {useNavigate, Link as RouterLink} from "react-router-dom";
import {useForm} from "react-hook-form";
import {authApi} from "../../api/authApi";
import {
    Box,
    Typography,
    TextField,
    Button,
    Alert,
    CircularProgress,
    Stack,
    InputAdornment,
    IconButton,
    FormControl,
    InputLabel,
    OutlinedInput,
    FormHelperText,
    Select,
    MenuItem,
    Avatar,
    Paper,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {Visibility, VisibilityOff} from "@mui/icons-material";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";
import ShieldIcon from "@mui/icons-material/Shield";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import {motion, AnimatePresence} from "framer-motion";
import {toast} from "react-toastify";

// ==========================================
// COMPONENT DÙNG CHUNG: TOOLTIP HIỂN THỊ ĐIỀU KIỆN
// ==========================================
const ValidationTooltip = ({isVisible, title, conditions}) => (
    <AnimatePresence>
        {isVisible && (
            <motion.div
                initial={{opacity: 0, y: 10, scale: 0.95}}
                animate={{opacity: 1, y: 0, scale: 1}}
                exit={{opacity: 0, y: 10, scale: 0.95}}
                transition={{duration: 0.2}}
                style={{
                    position: "absolute",
                    top: "105%",
                    left: 0,
                    zIndex: 100,
                    width: "100%",
                    minWidth: "250px",
                }}
            >
                <Paper
                    elevation={6}
                    sx={{p: 2, bgcolor: "#1e293b", borderRadius: "12px", border: "1px solid #334155"}}
                >
                    {title && (
                        <Typography variant="caption"
                                    sx={{color: "#cbd5e1", display: "block", mb: 1, fontWeight: "bold"}}>
                            {title}
                        </Typography>
                    )}
                    <Stack spacing={1}>
                        {conditions.map((cond, idx) => (
                            <Stack direction="row" spacing={1} alignItems="center" key={idx}>
                                {cond.met ? (
                                    <CheckCircleIcon sx={{color: "#10b981", fontSize: 18}}/>
                                ) : (
                                    <RadioButtonUncheckedIcon sx={{color: "#64748b", fontSize: 18}}/>
                                )}
                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: cond.met ? "#f8fafc" : "#94a3b8",
                                        fontSize: "0.8rem",
                                        transition: "color 0.3s"
                                    }}
                                >
                                    {cond.label}
                                </Typography>
                            </Stack>
                        ))}
                    </Stack>
                </Paper>
            </motion.div>
        )}
    </AnimatePresence>
);

const RegisterPage = () => {
    const navigate = useNavigate();
    const [successMsg, setSuccessMsg] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [backendErrors, setBackendErrors] = useState({});

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // --- STATE QUẢN LÝ FOCUS TỪNG Ô ---
    const [focusState, setFocusState] = useState({
        fullName: false,
        username: false,
        phoneNumber: false,
        password: false,
    });

    const [step, setStep] = useState(1);
    const [otp, setOtp] = useState("");
    const [countdown, setCountdown] = useState(0);
    const [resending, setResending] = useState(false);
    const [savedFormData, setSavedFormData] = useState(null);

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown]);

    const {register, handleSubmit, watch, formState: {errors}, setError} = useForm({
        defaultValues: {role: "ROLE_STUDENT"},
    });

    const preventCopyPaste = (e) => e.preventDefault();

    const handleFocus = (field) => setFocusState((prev) => ({...prev, [field]: true}));
    const handleBlur = (field) => setFocusState((prev) => ({...prev, [field]: false}));

    // --- LẤY GIÁ TRỊ REAL-TIME ĐỂ CHECK ĐIỀU KIỆN ---
    const watchFullName = watch("fullName") || "";
    const watchUsername = watch("username") || "";
    const watchPhone = watch("phoneNumber") || "";
    const watchPassword = watch("password") || "";

    // --- ĐỊNH NGHĨA CÁC ĐIỀU KIỆN (Dựa theo Regex của Backend) ---
    const fullNameConditions = [
        {
            label: "Chỉ chứa chữ cái, số và khoảng trắng",
            met: watchFullName.length > 0 && /^[\p{L}0-9\s]+$/u.test(watchFullName)
        },
        {
            label: "Không dư khoảng trắng ở đầu/cuối",
            met: watchFullName.length > 0 && /^[\p{L}0-9]+( [\p{L}0-9]+)*$/u.test(watchFullName)
        },
    ];

    const usernameConditions = [
        {label: "Ít nhất 1 ký tự", met: watchUsername.length > 0},
        {
            label: "Chỉ chứa chữ cái, số và dấu gạch dưới (_)",
            met: watchUsername.length > 0 && /^[a-zA-Z0-9_]+$/.test(watchUsername)
        },
    ];

    const phoneConditions = [
        {label: "Bắt đầu bằng số 0", met: /^0/.test(watchPhone)},
        {label: "Đầu số hợp lệ (03, 05, 06, 07, 08, 09)", met: /^0[356789]/.test(watchPhone)},
        {label: "Đúng 10 chữ số", met: /^0[356789]\d{8}$/.test(watchPhone)},
    ];

    const passwordConditions = [
        {label: "Ít nhất 8 ký tự", met: watchPassword.length >= 8},
        {label: "Có ít nhất 1 chữ thường (a-z)", met: /[a-z]/.test(watchPassword)},
        {label: "Có ít nhất 1 chữ hoa (A-Z)", met: /[A-Z]/.test(watchPassword)},
        {label: "Có ít nhất 1 chữ số (0-9)", met: /\d/.test(watchPassword)},
        {label: "Có ký tự đặc biệt (!@#$%^&*)", met: /[!@#$%^&*()_+=\-]/.test(watchPassword)},
    ];

    // --- CUSTOM REGISTERS ---
    const customRegister = (name, patternRegex, errMsg) => {
        const reg = register(name, {
            required: "Không được để trống",
            pattern: {value: patternRegex, message: errMsg},
        });
        return {
            ...reg,
            onFocus: () => handleFocus(name),
            onBlur: (e) => {
                reg.onBlur(e);
                handleBlur(name);
            },
        };
    };

    const handleRegisterSubmit = async (data) => {
        setIsLoading(true);
        setBackendErrors({});
        try {
            const {confirmPassword, ...registerData} = data;
            const res = await authApi.register(registerData);
            if (res?.message === "OTP_SENT_REDIRECT" || res?.data?.message === "OTP_SENT_REDIRECT") {
                toast.success("Mã xác thực OTP đã gửi vào Email của bạn!");
                setSavedFormData(registerData);
                setStep(2);
                setCountdown(60);
            }
        } catch (error) {
            if (error.response?.data?.error) {
                const errObj = error.response.data.error;
                setBackendErrors(errObj);
                Object.keys(errObj).forEach((field) =>
                    setError(field, {type: "manual", message: errObj[field]})
                );
            } else {
                setBackendErrors({general: error.response?.data?.message || "Đăng ký thất bại. Vui lòng thử lại."});
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyAndFinalize = async () => {
        if (otp.length !== 6) {
            toast.warning("Vui lòng nhập đầy đủ mã OTP gồm 6 chữ số!");
            return;
        }
        setIsLoading(true);
        setBackendErrors({});
        try {
            await authApi.register({...savedFormData, otp});
            setSuccessMsg("Xác thực thành công! Tài khoản đã được kích hoạt.");
            toast.success("Tạo tài khoản thành công!");
            setTimeout(() => navigate("/login"), 2000);
        } catch (error) {
            if (error.response?.data?.error) setBackendErrors(error.response.data.error);
            else toast.error(error.response?.data?.message || "Mã OTP không chính xác hoặc đã hết hạn!");
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendOtp = async () => {
        try {
            setResending(true);
            await authApi.sendOtp({email: savedFormData.email});
            toast.success("Một mã OTP mới đã được gửi tới Email của bạn.");
            setCountdown(60);
        } catch (err) {
            toast.error("Không thể gửi lại mã vào lúc này.");
        } finally {
            setResending(false);
        }
    };

    return (
        <Box sx={{minHeight: "100vh", display: "flex", bgcolor: "#ffffff", overflow: "hidden"}}>
            <Box
                component={motion.div}
                initial={{x: -50, opacity: 0}}
                animate={{x: 0, opacity: 1}}
                exit={{x: -50, opacity: 0}}
                transition={{duration: 0.6, ease: "easeOut"}}
                sx={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    p: {xs: 3, sm: 6, md: 8}
                }}
            >
                <Box sx={{width: "100%", maxWidth: "440px"}}>
                    <AnimatePresence mode="wait">
                        {step === 1 ? (
                            <motion.div key="register-form" initial={{opacity: 0, x: -20}} animate={{opacity: 1, x: 0}}
                                        exit={{opacity: 0, x: 20}} transition={{duration: 0.3}}>
                                <Button
                                    startIcon={<ArrowBackIcon/>}
                                    onClick={() => navigate("/")}
                                    disableRipple
                                    sx={{
                                        mb: 4,
                                        color: "#64748b",
                                        fontWeight: 600,
                                        textTransform: "none",
                                        ml: -1,
                                        "&:hover": {bgcolor: "transparent", color: "#0f172a"}
                                    }}
                                >
                                    Trang chủ
                                </Button>
                                <Typography component="h1" variant="h3"
                                            sx={{fontWeight: 900, mb: 1.5, color: "#0f172a", letterSpacing: "-1px"}}>
                                    Tạo tài khoản.
                                </Typography>
                                <Typography variant="body1" sx={{color: "#64748b", mb: 4, fontSize: "1.1rem"}}>
                                    Đăng ký để bắt đầu quản lý thực tập dễ dàng hơn.
                                </Typography>

                                {backendErrors.general && <Alert severity="error" sx={{
                                    mb: 3,
                                    borderRadius: 2
                                }}>{backendErrors.general}</Alert>}

                                <Box component="form" onSubmit={handleSubmit(handleRegisterSubmit)} noValidate>
                                    <Stack spacing={2.5}>

                                        {/* HỌ VÀ TÊN */}
                                        <FormControl fullWidth sx={{position: "relative"}}>
                                            <TextField
                                                fullWidth
                                                label="Họ và tên"
                                                variant="outlined"
                                                error={!!errors.fullName}
                                                helperText={errors.fullName?.message}
                                                InputProps={{sx: {borderRadius: "12px"}}}
                                                {...customRegister("fullName", /^[\p{L}0-9]+( [\p{L}0-9]+)*$/u, "Họ tên không hợp lệ")}
                                            />
                                            <ValidationTooltip isVisible={focusState.fullName}
                                                               title="Yêu cầu họ và tên:"
                                                               conditions={fullNameConditions}/>
                                        </FormControl>

                                        {/* USERNAME */}
                                        <FormControl fullWidth sx={{position: "relative"}}>
                                            <TextField
                                                fullWidth
                                                label="Tên đăng nhập"
                                                variant="outlined"
                                                error={!!errors.username}
                                                helperText={errors.username?.message}
                                                InputProps={{sx: {borderRadius: "12px"}}}
                                                {...customRegister("username", /^[a-zA-Z0-9_]+$/, "Tên đăng nhập không hợp lệ")}
                                            />
                                            <ValidationTooltip isVisible={focusState.username}
                                                               title="Yêu cầu tên đăng nhập:"
                                                               conditions={usernameConditions}/>
                                        </FormControl>

                                        {/* EMAIL (Không cần tooltip phức tạp, để regex mặc định) */}
                                        <TextField
                                            fullWidth
                                            label="Email"
                                            type="email"
                                            variant="outlined"
                                            {...register("email", {
                                                required: "Nhập Email",
                                                pattern: {
                                                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                                    message: "Email không hợp lệ"
                                                }
                                            })}
                                            error={!!errors.email}
                                            helperText={errors.email?.message}
                                            InputProps={{sx: {borderRadius: "12px"}}}
                                        />

                                        {/* SỐ ĐIỆN THOẠI */}
                                        <FormControl fullWidth sx={{position: "relative"}}>
                                            <TextField
                                                fullWidth
                                                label="Số điện thoại"
                                                variant="outlined"
                                                error={!!errors.phoneNumber}
                                                helperText={errors.phoneNumber?.message}
                                                InputProps={{sx: {borderRadius: "12px"}}}
                                                {...customRegister("phoneNumber", /^0[356789]\d{8}$/, "Số điện thoại không hợp lệ")}
                                            />
                                            <ValidationTooltip isVisible={focusState.phoneNumber}
                                                               title="Yêu cầu số điện thoại:"
                                                               conditions={phoneConditions}/>
                                        </FormControl>

                                        {/* VAI TRÒ */}
                                        <FormControl fullWidth variant="outlined" error={!!errors.role}>
                                            <InputLabel id="role-select-label">Bạn là ai?</InputLabel>
                                            <Select
                                                labelId="role-select-label"
                                                id="role-select"
                                                label="Bạn là ai?"
                                                defaultValue="ROLE_STUDENT"
                                                {...register("role", {required: "Vui lòng chọn vai trò"})}
                                                sx={{borderRadius: "12px", textAlign: "left"}}
                                            >
                                                <MenuItem value="ROLE_STUDENT">Sinh viên thực tập</MenuItem>
                                                <MenuItem value="ROLE_MENTOR">Giảng viên / Cố vấn (Mentor)</MenuItem>
                                            </Select>
                                            {errors.role &&
                                                <FormHelperText error>{errors.role?.message}</FormHelperText>}
                                        </FormControl>

                                        {/* BỘ ĐÔI MẬT KHẨU */}
                                        <Stack direction={{xs: "column", sm: "row"}} spacing={2.5}>
                                            <FormControl fullWidth variant="outlined" error={!!errors.password}
                                                         sx={{position: "relative"}}>
                                                <InputLabel htmlFor="reg-password">Mật khẩu</InputLabel>
                                                <OutlinedInput
                                                    id="reg-password"
                                                    type={showPassword ? "text" : "password"}
                                                    onCopy={preventCopyPaste}
                                                    onPaste={preventCopyPaste}
                                                    onCut={preventCopyPaste}
                                                    {...customRegister("password", /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+=\-]).{8,}$/, "Mật khẩu chưa đủ mạnh")}
                                                    endAdornment={
                                                        <InputAdornment position="end">
                                                            <IconButton onClick={() => setShowPassword(!showPassword)}
                                                                        onMouseDown={(e) => e.preventDefault()}
                                                                        edge="end">
                                                                {showPassword ? <VisibilityOff/> : <Visibility/>}
                                                            </IconButton>
                                                        </InputAdornment>
                                                    }
                                                    label="Mật khẩu"
                                                    sx={{borderRadius: "12px"}}
                                                />
                                                {errors.password &&
                                                    <FormHelperText error>{errors.password?.message}</FormHelperText>}
                                                <ValidationTooltip isVisible={focusState.password}
                                                                   title="Mật khẩu của bạn phải có:"
                                                                   conditions={passwordConditions}/>
                                            </FormControl>

                                            <FormControl fullWidth variant="outlined" error={!!errors.confirmPassword}>
                                                <InputLabel htmlFor="reg-confirm-password">Xác nhận Mật
                                                    khẩu</InputLabel>
                                                <OutlinedInput
                                                    id="reg-confirm-password"
                                                    type={showConfirmPassword ? "text" : "password"}
                                                    onCopy={preventCopyPaste}
                                                    onPaste={preventCopyPaste}
                                                    onCut={preventCopyPaste}
                                                    {...register("confirmPassword", {
                                                        required: "Xác nhận lại",
                                                        validate: (val) => val === watch("password") || "Mật khẩu không khớp",
                                                    })}
                                                    endAdornment={
                                                        <InputAdornment position="end">
                                                            <IconButton
                                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                                onMouseDown={(e) => e.preventDefault()} edge="end">
                                                                {showConfirmPassword ? <VisibilityOff/> : <Visibility/>}
                                                            </IconButton>
                                                        </InputAdornment>
                                                    }
                                                    label="Xác nhận Mật khẩu"
                                                    sx={{borderRadius: "12px"}}
                                                />
                                                {errors.confirmPassword && <FormHelperText
                                                    error>{errors.confirmPassword?.message}</FormHelperText>}
                                            </FormControl>
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
                                            "&:hover": {bgcolor: "#334155"},
                                        }}
                                    >
                                        {isLoading ? <CircularProgress size={24} color="inherit"/> : "Tiếp tục đăng ký"}
                                    </Button>

                                    <Typography variant="body1" align="center" sx={{color: "#64748b"}}>
                                        Đã có tài khoản?{" "}
                                        <RouterLink to="/login"
                                                    style={{textDecoration: "none", color: "#0f172a", fontWeight: 700}}>
                                            Đăng nhập
                                        </RouterLink>
                                    </Typography>
                                </Box>
                            </motion.div>
                        ) : (
                            // --- MÀN HÌNH 2: OTP ---
                            <motion.div key="otp-screen" initial={{opacity: 0, x: 20}} animate={{opacity: 1, x: 0}}
                                        exit={{opacity: 0, x: -20}} transition={{duration: 0.3}}>
                                <Button startIcon={<ArrowBackIcon/>} onClick={() => setStep(1)}
                                        sx={{mb: 4, color: "#64748b", fontWeight: 600, textTransform: "none", ml: -1}}>
                                    Quay lại chỉnh sửa
                                </Button>
                                <Stack spacing={3} alignItems="center">
                                    <Avatar sx={{
                                        bgcolor: "#f1f5f9",
                                        color: "#0f172a",
                                        width: 64,
                                        height: 64,
                                        border: "2px solid #cbd5e1"
                                    }}>
                                        <ShieldIcon fontSize="large"/>
                                    </Avatar>
                                    <Box textAlign="center">
                                        <Typography variant="h4"
                                                    sx={{fontWeight: 900, color: "#0f172a", letterSpacing: "-0.5px"}}>Xác
                                            thực Email</Typography>
                                        <Typography variant="body1" sx={{color: "#64748b", mt: 1.5, lineHeight: 1.5}}>
                                            Hệ thống đã gửi mã OTP 6 số tới hộp thư:<br/><strong
                                            style={{color: "#0f172a"}}>{savedFormData?.email}</strong>
                                        </Typography>
                                    </Box>
                                    {successMsg && <Alert severity="success"
                                                          sx={{width: "100%", borderRadius: 2}}>{successMsg}</Alert>}
                                    {backendErrors.otp && <Alert severity="error" sx={{
                                        width: "100%",
                                        borderRadius: 2
                                    }}>{backendErrors.otp}</Alert>}
                                    <TextField
                                        fullWidth label="Nhập mã OTP 6 số" placeholder="000000" value={otp}
                                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                                        inputProps={{
                                            maxLength: 6,
                                            style: {
                                                textAlign: "center",
                                                fontWeight: "900",
                                                fontSize: "1.5rem",
                                                letterSpacing: "8px"
                                            }
                                        }}
                                        sx={{"& .MuiOutlinedInput-root": {borderRadius: "12px"}, mt: 2}}
                                    />
                                    <Button fullWidth variant="contained" onClick={handleVerifyAndFinalize}
                                            disabled={isLoading || successMsg} sx={{
                                        py: 2,
                                        borderRadius: "12px",
                                        fontSize: "1rem",
                                        fontWeight: 700,
                                        bgcolor: "#0f172a",
                                        color: "#fff",
                                        "&:hover": {bgcolor: "#334155"}
                                    }}>
                                        {isLoading ? <CircularProgress size={24}
                                                                       color="inherit"/> : "XÁC THỰC & HOÀN TẤT ĐĂNG KÝ"}
                                    </Button>
                                    <Button disabled={countdown > 0 || resending} variant="text"
                                            onClick={handleResendOtp} sx={{textTransform: "none", fontWeight: 700}}>
                                        {resending ? <CircularProgress
                                            size={20}/> : countdown > 0 ? `Gửi lại mã mới sau (${countdown}s)` : "Chưa nhận được email? Gửi lại mã ngay"}
                                    </Button>
                                </Stack>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </Box>
            </Box>

            {/* CỘT PHẢI: ẢNH NỀN */}
            <Box sx={{flex: 1.2, display: {xs: "none", lg: "block"}, position: "relative", overflow: "hidden"}}>
                <motion.div
                    initial={{scale: 1.1}} animate={{scale: 1}} transition={{duration: 10, ease: "easeOut"}}
                    style={{
                        position: "absolute",
                        inset: 0,
                        backgroundImage: `url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&auto=format&fit=crop')`,
                        backgroundSize: "cover",
                        backgroundPosition: "center"
                    }}
                />
                <Box sx={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(180deg, rgba(16, 185, 129, 0.2) 0%, rgba(15, 23, 42, 0.95) 100%)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-end",
                    p: 8
                }}>
                    <motion.div initial={{opacity: 0, y: 30}} animate={{opacity: 1, y: 0}}
                                transition={{delay: 0.5, duration: 0.8}}>
                        <Typography variant="h3" sx={{color: "#fff", fontWeight: 800, mb: 2, letterSpacing: "-1px"}}>Hành
                            trình của bạn <br/> bắt đầu từ đây.</Typography>
                        <Typography variant="h6" sx={{color: "#cbd5e1", fontWeight: 400, maxWidth: "500px"}}>Hệ thống
                            quản lý thực tập thông minh giúp bạn kết nối nhanh chóng với Mentor và doanh
                            nghiệp.</Typography>
                    </motion.div>
                </Box>
            </Box>
        </Box>
    );
};

export default RegisterPage;