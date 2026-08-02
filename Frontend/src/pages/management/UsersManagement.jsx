import {useState, useEffect} from "react";
import {userApi} from "../../api/resourceApi";
import {toast} from "react-toastify";
import {useForm} from "react-hook-form";
import {motion, AnimatePresence} from "framer-motion";
import {
    Box,
    Button,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Paper,
    Typography,
    Stack,
    Modal,
    IconButton,
    Avatar,
    Chip,
    Divider,
    FormHelperText,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";

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
                    top: "100%",
                    left: 0,
                    zIndex: 1100,
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
                    <Stack spacing={0.5}>
                        {conditions.map((cond, idx) => (
                            <Stack direction="row" spacing={1} alignItems="center" key={idx}>
                                {cond.met ? (
                                    <CheckCircleIcon sx={{color: "#10b981", fontSize: 16}}/>
                                ) : (
                                    <RadioButtonUncheckedIcon sx={{color: "#64748b", fontSize: 16}}/>
                                )}
                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: cond.met ? "#f8fafc" : "#94a3b8",
                                        fontSize: "0.75rem",
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

const UsersManagement = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalCount, setTotalCount] = useState(0);
    const [search, setSearch] = useState("");
    const [role, setRole] = useState("");

    // State quản lý Form Modal (Thêm/Sửa)
    const [openModal, setOpenModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);

    // State quản lý Alert Modal (Xóa)
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);

    // --- TRẠNG THÁI FOCUS CỦA CÁC Ô NHẬP LIỆU ---
    const [focusState, setFocusState] = useState({
        fullName: false,
        username: false,
        phoneNumber: false,
        password: false,
    });

    // Tích hợp react-hook-form thay cho useState form truyền thống
    const {register, handleSubmit, watch, reset, setValue, formState: {errors}, setError} = useForm();

    useEffect(() => {
        fetchUsers();
    }, [page, rowsPerPage, role, search]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await userApi.getAllUsers(role, page, rowsPerPage, search);
            setData(response?.content || []);
            setTotalCount(response?.totalElements || 0);
        } catch (err) {
            console.error("Error fetching users:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleFocus = (field) => setFocusState((prev) => ({...prev, [field]: true}));
    const handleBlur = (field) => setFocusState((prev) => ({...prev, [field]: false}));

    // --- THEO DÕI GIÁ TRỊ REAL-TIME ĐỂ VALIDATE POPUP ---
    const watchFullName = watch("fullName") || "";
    const watchUsername = watch("username") || "";
    const watchPhone = watch("phoneNumber") || "";
    const watchPassword = watch("password") || "";

    // --- CẤU HÌNH ĐIỀU KIỆN (Khớp chính xác Regex Backend của bạn) ---
    const fullNameConditions = [
        {
            label: "Chỉ chứa chữ cái, số và khoảng trắng",
            met: watchFullName.length > 0 && /^[\p{L}0-9\s]+$/u.test(watchFullName)
        },
        {
            label: "Không chứa khoảng trắng thừa ở đầu/cuối",
            met: watchFullName.length > 0 && /^[\p{L}0-9]+( [\p{L}0-9]+)*$/u.test(watchFullName)
        },
    ];

    const usernameConditions = [
        {label: "Không được để trống", met: watchUsername.length > 0},
        {
            label: "Chỉ gồm chữ cái, số và dấu gạch dưới (_)",
            met: watchUsername.length > 0 && /^[a-zA-Z0-9_]+$/.test(watchUsername)
        },
    ];

    const phoneConditions = [
        {label: "Bắt đầu bằng số 0", met: /^0/.test(watchPhone)},
        {label: "Đầu số Việt Nam (03,05,06,07,08,09)", met: /^0[356789]/.test(watchPhone)},
        {label: "Độ dài chính xác 10 số", met: /^0[356789]\d{8}$/.test(watchPhone)},
    ];

    const passwordConditions = [
        {label: "Tối thiểu 8 ký tự", met: watchPassword.length >= 8},
        {label: "Có ít nhất 1 chữ thường (a-z)", met: /[a-z]/.test(watchPassword)},
        {label: "Có ít nhất 1 chữ hoa (A-Z)", met: /[A-Z]/.test(watchPassword)},
        {label: "Có ít nhất 1 chữ số (0-9)", met: /\d/.test(watchPassword)},
        {label: "Có 1 ký tự đặc biệt (!@#$%^&*()_+=-)", met: /[!@#$%^&*()_+=\-]/.test(watchPassword)},
    ];

    // --- HÀM TẠO LAYER EVENT CHO FIELD ---
    const customRegister = (name, patternRegex, errMsg, isRequired = true) => {
        const rules = {};
        if (isRequired) rules.required = "Trường này là bắt buộc";
        if (patternRegex) rules.pattern = {value: patternRegex, message: errMsg};

        const reg = register(name, rules);
        return {
            ...reg,
            onFocus: () => handleFocus(name),
            onBlur: (e) => {
                reg.onBlur(e);
                handleBlur(name);
            },
        };
    };

    const handleOpenModal = (user = null) => {
        if (user) {
            setEditingUser(user);
            reset({
                username: user.username,
                email: user.email,
                fullName: user.fullName,
                phoneNumber: user.phoneNumber || "",
                role: user.role,
                password: "", // sửa thì không cần mật khẩu
            });
        } else {
            setEditingUser(null);
            reset({
                username: "",
                email: "",
                fullName: "",
                phoneNumber: "",
                role: "ROLE_STUDENT",
                password: "",
            });
        }
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setEditingUser(null);
    };

    const onSubmitForm = async (formData) => {
        try {
            setLoading(true);
            if (editingUser) {
                const payload = {...formData};
                delete payload.password; // Không gửi password khi update
                await userApi.updateUser(editingUser.userId, payload);
                toast.success("Cập nhật người dùng thành công!");
            } else {
                await userApi.createUser(formData);
                toast.success("Thêm mới người dùng thành công!");
            }
            handleCloseModal();
            fetchUsers();
        } catch (err) {
            if (err.response?.data?.error) {
                const errObj = err.response.data.error;
                Object.keys(errObj).forEach((field) =>
                    setError(field, {type: "manual", message: errObj[field]})
                );
            } else {
                toast.error("Lỗi khi xử lý dữ liệu hệ thống!");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleOpenDeleteModal = (user) => {
        setUserToDelete(user);
        setOpenDeleteModal(true);
    };

    const handleCloseDeleteModal = () => {
        setOpenDeleteModal(false);
        setUserToDelete(null);
    };

    const handleConfirmDelete = async () => {
        if (!userToDelete) return;
        const targetId = userToDelete.userId || userToDelete.id;
        try {
            setLoading(true);
            await userApi.deleteUser(targetId);
            toast.success("Xóa người dùng thành công!");
            handleCloseDeleteModal();
            fetchUsers();
        } catch (err) {
            console.error("Lỗi khi xóa dữ liệu:", err);
        } finally {
            setLoading(false);
        }
    };

    const getRoleColor = (userRole) => {
        if (userRole === "ROLE_ADMIN") return "error";
        if (userRole === "ROLE_MENTOR") return "warning";
        return "primary";
    };

    const getRoleLabel = (userRole) => {
        if (userRole === "ROLE_ADMIN") return "Admin";
        if (userRole === "ROLE_MENTOR") return "Cố vấn";
        return "Học sinh";
    };

    return (
        <Box sx={{p: 4, minHeight: "100vh", backgroundColor: "#f4f6f8"}}>
            {/* --- HEADER --- */}
            <Box sx={{display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4}}>
                <Box>
                    <Typography variant="h4" sx={{fontWeight: 800, color: "#1a237e", letterSpacing: "-0.5px"}}>
                        Quản lý người dùng
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{mt: 1}}>
                        Hệ thống quản lý thông tin và tài khoản
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    size="large"
                    startIcon={<PersonAddAlt1Icon/>}
                    onClick={() => handleOpenModal()}
                    sx={{
                        borderRadius: "50px", px: 4, py: 1.5,
                        boxShadow: "0 8px 16px rgba(26, 35, 126, 0.2)",
                        transition: "all 0.3s",
                        "&:hover": {transform: "translateY(-2px)", boxShadow: "0 12px 20px rgba(26, 35, 126, 0.3)"},
                    }}
                >
                    Thêm người dùng
                </Button>
            </Box>

            {/* --- FILTER & SEARCH --- */}
            <Paper sx={{
                p: 2,
                mb: 4,
                borderRadius: 4,
                display: "flex",
                alignItems: "center",
                gap: 3,
                boxShadow: "0 4px 20px rgba(0,0,0,0.05)"
            }}>
                <FormControl sx={{minWidth: 220}} size="small">
                    <InputLabel>Lọc theo vai trò</InputLabel>
                    <Select
                        value={role}
                        label="Lọc theo vai trò"
                        onChange={(e) => {
                            setRole(e.target.value);
                            setPage(0);
                        }}
                        sx={{borderRadius: 2}}
                    >
                        <MenuItem value="">Tất cả vai trò</MenuItem>
                        <MenuItem value="ROLE_ADMIN">Admin</MenuItem>
                        <MenuItem value="ROLE_MENTOR">Cố vấn</MenuItem>
                        <MenuItem value="ROLE_STUDENT">Học sinh</MenuItem>
                    </Select>
                </FormControl>
            </Paper>

            {/* --- 3D CARD LIST --- */}
            <Box sx={{display: "flex", flexWrap: "wrap", gap: 4, justifyContent: "flex-start"}}>
                <AnimatePresence>
                    {data.map((user, index) => (
                        <motion.div
                            key={user.userId || user.id || index}
                            initial={{opacity: 0, y: 50, scale: 0.9}}
                            animate={{opacity: 1, y: 0, scale: 1}}
                            exit={{opacity: 0, scale: 0.8, transition: {duration: 0.2}}}
                            transition={{duration: 0.4, delay: index * 0.05}}
                            whileHover={{scale: 1.03, y: -5}}
                            style={{flex: "1 1 300px", maxWidth: "350px"}}
                        >
                            <Paper
                                sx={{
                                    p: 3, borderRadius: 4, position: "relative", overflow: "hidden",
                                    background: "linear-gradient(145deg, #ffffff, #f0f0f0)",
                                    boxShadow: "8px 8px 16px #e6e6e6, -8px -8px 16px #ffffff",
                                    border: "1px solid rgba(255,255,255,0.5)", height: "100%",
                                }}
                            >
                                <Box sx={{
                                    position: "absolute",
                                    top: -30,
                                    right: -30,
                                    width: 100,
                                    height: 100,
                                    borderRadius: "50%",
                                    background: "rgba(26, 35, 126, 0.03)",
                                    zIndex: 0
                                }}/>

                                <Stack direction="row" spacing={2} alignItems="center"
                                       sx={{position: "relative", zIndex: 1, mb: 2}}>
                                    <Avatar src={user.avatarUrl} sx={{
                                        width: 56,
                                        height: 56,
                                        bgcolor: getRoleColor(user.role) + ".main",
                                        fontWeight: "bold"
                                    }}>
                                        {!user.avatarUrl && user.fullName?.charAt(0).toUpperCase()}
                                    </Avatar>
                                    <Box>
                                        <Typography variant="h6"
                                                    sx={{fontWeight: 700, lineHeight: 1.2}}>{user.fullName}</Typography>
                                        <Typography variant="body2" color="text.secondary">@{user.username} |
                                            ID: {user.userId}</Typography>
                                    </Box>
                                </Stack>

                                <Stack spacing={1.5} sx={{position: "relative", zIndex: 1, mb: 3}}>
                                    <Typography variant="body2"><strong>Email:</strong> {user.email}</Typography>
                                    <Typography
                                        variant="body2"><strong>SĐT:</strong> {user.phoneNumber || "Chưa thiết lập"}
                                    </Typography>
                                    <Box><Chip label={getRoleLabel(user.role)} color={getRoleColor(user.role)}
                                               size="small" sx={{fontWeight: "bold"}}/></Box>
                                </Stack>

                                <Divider sx={{mb: 2}}/>

                                <Stack direction="row" justifyContent="space-between"
                                       sx={{position: "relative", zIndex: 1}}>
                                    <Button startIcon={<EditIcon/>} size="small" color="primary"
                                            onClick={() => handleOpenModal(user)} sx={{borderRadius: 2}}>
                                        Chỉnh sửa
                                    </Button>
                                    <IconButton size="small" color="error" onClick={() => handleOpenDeleteModal(user)}>
                                        <DeleteIcon/>
                                    </IconButton>
                                </Stack>
                            </Paper>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </Box>

            {/* --- PAGINATION --- */}
            <Box sx={{display: "flex", justifyContent: "center", alignItems: "center", gap: 2, mt: 6}}>
                <Button variant="outlined" disabled={page === 0} onClick={() => setPage((p) => p - 1)}
                        sx={{borderRadius: "50px", px: 3}}>Trang trước</Button>
                <Typography variant="body2" fontWeight="bold">Trang {page + 1}</Typography>
                <Button variant="outlined" disabled={data.length < rowsPerPage} onClick={() => setPage((p) => p + 1)}
                        sx={{borderRadius: "50px", px: 3}}>Trang sau</Button>
            </Box>

            {/* --- MODAL FORM THÊM / SỬA HỖ TRỢ POPUP VALIDATION REAL-TIME --- */}
            <Modal open={openModal} onClose={handleCloseModal} closeAfterTransition
                   sx={{display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(3px)"}}>
                <AnimatePresence>
                    {openModal && (
                        <motion.div
                            initial={{scale: 0.8, opacity: 0, y: 30}}
                            animate={{scale: 1, opacity: 1, y: 0}}
                            exit={{scale: 0.8, opacity: 0, y: 30}}
                            transition={{type: "spring", stiffness: 350, damping: 25}}
                            style={{width: "100%", maxWidth: "500px", outline: "none", padding: "16px"}}
                        >
                            <Paper
                                sx={{borderRadius: 4, overflow: "visible", boxShadow: "0 24px 48px rgba(0,0,0,0.25)"}}>
                                <Box sx={{
                                    p: 3,
                                    pb: 2,
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    bgcolor: "#fff"
                                }}>
                                    <Typography variant="h5" sx={{fontWeight: 800, color: "#1a237e"}}>
                                        {editingUser ? "Cập nhật tài khoản" : "Thêm mới tài khoản"}
                                    </Typography>
                                    <IconButton onClick={handleCloseModal}
                                                sx={{bgcolor: "#f4f6f8", "&:hover": {bgcolor: "#e0e0e0"}}}><CloseIcon/></IconButton>
                                </Box>
                                <Divider/>

                                <Box component="form" onSubmit={handleSubmit(onSubmitForm)} noValidate
                                     sx={{p: 4, bgcolor: "#fff"}}>
                                    <Stack spacing={3.5}>

                                        {/* TÊN ĐĂNG NHẬP */}
                                        <FormControl fullWidth sx={{position: "relative"}}>
                                            <TextField
                                                fullWidth label="Tên đăng nhập" variant="outlined"
                                                error={!!errors.username}
                                                helperText={errors.username?.message}
                                                disabled={editingUser !== null}
                                                {...customRegister("username", /^[a-zA-Z0-9_]+$/, "Tên đăng nhập không hợp lệ", true)}
                                            />
                                            <ValidationTooltip isVisible={focusState.username && !editingUser}
                                                               title="Yêu cầu tên đăng nhập:"
                                                               conditions={usernameConditions}/>
                                        </FormControl>

                                        {/* EMAIL */}
                                        <FormControl fullWidth>
                                            <TextField
                                                fullWidth label="Email" variant="outlined"
                                                error={!!errors.email}
                                                helperText={errors.email?.message}
                                                {...register("email", {
                                                    required: "Nhập Email",
                                                    pattern: {
                                                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                                        message: "Email không hợp lệ"
                                                    }
                                                })}
                                            />
                                        </FormControl>

                                        {/* HỌ VÀ TÊN */}
                                        <FormControl fullWidth sx={{position: "relative"}}>
                                            <TextField
                                                fullWidth label="Họ và tên" variant="outlined"
                                                error={!!errors.fullName}
                                                helperText={errors.fullName?.message}
                                                {...customRegister("fullName", /^[\p{L}0-9]+( [\p{L}0-9]+)*$/u, "Họ tên không đúng định dạng", true)}
                                            />
                                            <ValidationTooltip isVisible={focusState.fullName}
                                                               title="Yêu cầu họ và tên:"
                                                               conditions={fullNameConditions}/>
                                        </FormControl>

                                        {/* MẬT KHẨU (CHỈ HIỂN THỊ KHI THÊM MỚI) */}
                                        {!editingUser && (
                                            <FormControl fullWidth sx={{position: "relative"}}>
                                                <TextField
                                                    fullWidth label="Mật khẩu" type="password" variant="outlined"
                                                    error={!!errors.password}
                                                    helperText={errors.password?.message}
                                                    {...customRegister("password", /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+=\-]).{8,}$/, "Mật khẩu quá yếu", true)}
                                                />
                                                <ValidationTooltip isVisible={focusState.password}
                                                                   title="Mật khẩu của bạn phải có:"
                                                                   conditions={passwordConditions}/>
                                            </FormControl>
                                        )}

                                        {/* SỐ ĐIỆN THOẠI */}
                                        <FormControl fullWidth sx={{position: "relative"}}>
                                            <TextField
                                                fullWidth label="Số điện thoại" variant="outlined"
                                                error={!!errors.phoneNumber}
                                                helperText={errors.phoneNumber?.message}
                                                {...customRegister("phoneNumber", /^0[356789]\d{8}$/, "Số điện thoại không hợp lệ", false)}
                                            />
                                            <ValidationTooltip isVisible={focusState.phoneNumber}
                                                               title="Yêu cầu số điện thoại:"
                                                               conditions={phoneConditions}/>
                                        </FormControl>

                                        {/* VAI TRÒ */}
                                        <FormControl fullWidth error={!!errors.role}>
                                            <InputLabel id="role-select-managed-label">Vai trò</InputLabel>
                                            <Select
                                                labelId="role-select-managed-label"
                                                label="Vai trò"
                                                defaultValue="ROLE_STUDENT"
                                                {...register("role", {required: "Vui lòng chọn vai trò"})}
                                                sx={{textAlign: "left"}}
                                            >
                                                <MenuItem value="ROLE_STUDENT">Học sinh</MenuItem>
                                                <MenuItem value="ROLE_MENTOR">Cố vấn</MenuItem>
                                                <MenuItem value="ROLE_ADMIN">Admin</MenuItem>
                                            </Select>
                                            {errors.role &&
                                                <FormHelperText error>{errors.role?.message}</FormHelperText>}
                                        </FormControl>
                                    </Stack>

                                    <Box sx={{display: "flex", gap: 2, mt: 4}}>
                                        <Button fullWidth variant="outlined" color="inherit" onClick={handleCloseModal}
                                                sx={{borderRadius: 2, py: 1.5}}>
                                            Hủy bỏ
                                        </Button>
                                        <Button fullWidth type="submit" variant="contained" disabled={loading} sx={{
                                            borderRadius: 2,
                                            py: 1.5,
                                            boxShadow: "0 8px 16px rgba(25, 118, 210, 0.2)"
                                        }}>
                                            Lưu thông tin
                                        </Button>
                                    </Box>
                                </Box>
                            </Paper>
                        </motion.div>
                    )}
                </AnimatePresence>
            </Modal>

            {/* --- ALERT MODAL XÁC NHẬN XÓA GIỮ NGUYÊN --- */}
            <Modal open={openDeleteModal} onClose={handleCloseDeleteModal} closeAfterTransition
                   sx={{display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)"}}>
                <AnimatePresence>
                    {openDeleteModal && (
                        <motion.div initial={{scale: 0.85, opacity: 0, y: 20}} animate={{scale: 1, opacity: 1, y: 0}}
                                    exit={{scale: 0.85, opacity: 0, y: 20}}
                                    transition={{type: "spring", stiffness: 400, damping: 28}}
                                    style={{width: "100%", maxWidth: "400px", outline: "none", padding: "16px"}}>
                            <Paper sx={{
                                borderRadius: 4,
                                overflow: "hidden",
                                boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
                                p: 3,
                                bgcolor: "#fff"
                            }}>
                                <Stack alignItems="center" spacing={2} sx={{textAlign: "center", mb: 3}}>
                                    <Avatar sx={{
                                        bgcolor: "error.lighter",
                                        width: 64,
                                        height: 64,
                                        color: "error.main",
                                        mb: 1
                                    }}><WarningAmberRoundedIcon sx={{fontSize: 36}}/></Avatar>
                                    <Typography variant="h6" sx={{fontWeight: 800, color: "#1a237e"}}>Xác nhận xóa người
                                        dùng?</Typography>
                                    <Typography variant="body2" color="text.secondary">Bạn có chắc chắn muốn xóa tài
                                        khoản <strong>{userToDelete?.fullName}</strong> (@{userToDelete?.username})?
                                        Hành động này không thể hoàn tác.</Typography>
                                </Stack>
                                <Stack direction="row" spacing={2}>
                                    <Button fullWidth variant="outlined" color="inherit"
                                            onClick={handleCloseDeleteModal}
                                            sx={{borderRadius: 2, py: 1.2, fontWeight: 600}}>Hủy bỏ</Button>
                                    <Button fullWidth variant="contained" color="error" onClick={handleConfirmDelete}
                                            sx={{
                                                borderRadius: 2,
                                                py: 1.2,
                                                fontWeight: 600,
                                                boxShadow: "0 4px 12px rgba(211, 47, 47, 0.3)"
                                            }}>Xóa ngay</Button>
                                </Stack>
                            </Paper>
                        </motion.div>
                    )}
                </AnimatePresence>
            </Modal>
        </Box>
    );
};

export default UsersManagement;