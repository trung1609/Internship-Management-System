import React, { useEffect, useState, useContext } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Avatar,
  Chip,
  Button,
  Divider,
  Stack,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Select,
  MenuItem,
  FormControl,
  Tabs,
  Tab,
  LinearProgress, // 🔥 Đã Import LinearProgress
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import {
  assessmentResultApi,
  assessmentRoundsApi,
  internshipAssignmentApi,
  taskApi,
} from "../api/resourceApi.js";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";

// Import Icons
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import AssignmentIcon from "@mui/icons-material/Assignment";
import GroupsIcon from "@mui/icons-material/Groups";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import FlagIcon from "@mui/icons-material/Flag";
import SaveIcon from "@mui/icons-material/Save";
import TimelineIcon from "@mui/icons-material/Timeline";
import AlarmIcon from "@mui/icons-material/Alarm";
import ViewKanbanIcon from "@mui/icons-material/ViewKanban";

// Import Component KanbanBoard
import KanbanBoard from "./KanbanBoard";

// --- Custom TabPanel Helper ---
function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

const AssignmentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savingGrades, setSavingGrades] = useState(false);
  const [selectedRoundId, setSelectedRoundId] = useState("");
  const [selectedCriterionId, setSelectedCriterionId] = useState("");

  const [tabValue, setTabValue] = useState(0);
  const [rounds, setRounds] = useState([]);
  const [criteria, setCriteria] = useState([]);
  const { user } = useContext(AuthContext);

  // 🔥 State quản lý Tiến độ Kanban
  const [progress, setProgress] = useState({
    totalTasks: 0,
    completedTasks: 0,
    percentage: 0,
  });

  const isRoleNotAllowed = (role) =>
    ["ROLE_STUDENT", "ROLE_ADMIN"].includes(role);
  const [grades, setGrades] = useState({});

  // 🔥 Hàm fetch Progress
  const loadProgress = async () => {
    try {
      const res = await taskApi.getTaskProgress(id);
      setProgress(res);
    } catch (err) {
      console.error("Lỗi lấy tiến độ", err);
    }
  };

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        const res = await internshipAssignmentApi.getAssignmentById(id);
        const data = res?.data || res;
        setDetail(data);

        if (data && data.students) {
          const initialGrades = {};
          data.students.forEach((student) => {
            initialGrades[student.id] = {
              score: "",
              contribution: "100%",
              comment: "",
            };
          });
          setGrades(initialGrades);
        }

        // Gọi load progress sau khi load detail thành công
        loadProgress();
      } catch (err) {
        console.error("Lỗi lấy chi tiết:", err);
        toast.error("Không thể tải thông tin chi tiết.");
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  useEffect(() => {
    if (detail?.phaseId) {
      const fetchRounds = async () => {
        try {
          const res = await assessmentRoundsApi.getAllRounds(
            "",
            detail.phaseId,
          );
          setRounds(res?.content || res?.data || []);
        } catch (err) {
          console.error("Lỗi load rounds:", err);
        }
      };
      fetchRounds();
    }
  }, [detail?.phaseId]);

  useEffect(() => {
    if (selectedRoundId && selectedCriterionId) {
      const fetchExistingGrades = async () => {
        try {
          const res = await assessmentResultApi.getAllResults(
            null,
            0,
            1000,
            "",
          );
          let existingData = res?.content || res?.data?.content || [];

          existingData = existingData.filter(
            (item) =>
              item.assignmentId === parseInt(id) &&
              item.roundId === parseInt(selectedRoundId) &&
              item.criterionId === parseInt(selectedCriterionId),
          );

          setGrades((prevGrades) => {
            const newGrades = { ...prevGrades };
            Object.keys(newGrades).forEach((studentId) => {
              newGrades[studentId] = {
                score: "",
                contribution: "100%",
                comment: "",
              };
            });

            existingData.forEach((item) => {
              if (newGrades[item.studentId]) {
                newGrades[item.studentId] = {
                  score: item.score !== null ? item.score : "",
                  contribution: item.contribution || "100%",
                  comment: item.comments || item.comment || "",
                };
              }
            });
            return newGrades;
          });
        } catch (error) {
          console.error("Lỗi lấy điểm cũ:", error);
        }
      };
      fetchExistingGrades();
    }
  }, [id, selectedRoundId, selectedCriterionId]);

  const handleRoundChange = async (event) => {
    const roundId = event.target.value;
    setSelectedRoundId(roundId);
    setSelectedCriterionId("");
    setCriteria([]);
    try {
      const res = await assessmentRoundsApi.getRoundById(roundId);
      setCriteria(res?.data?.roundCriteria || res?.roundCriteria || []);
    } catch (error) {
      toast.error("Không tải được tiêu chí");
    }
  };

  const getStatusInfo = (status) => {
    switch (status) {
      case "COMPLETED":
        return {
          label: "Đã hoàn thành",
          color: "#2e7d32",
          bg: "#e8f5e9",
          icon: <CheckCircleIcon />,
        };
      case "IN_PROGRESS":
        return {
          label: "Đang thực hiện",
          color: "#1565c0",
          bg: "#e3f2fd",
          icon: <PendingActionsIcon />,
        };
      case "PENDING":
        return {
          label: "Chờ duyệt",
          color: "#ed6c02",
          bg: "#fff3e0",
          icon: <AccessTimeIcon />,
        };
      case "CANCELLED":
        return {
          label: "Đã hủy",
          color: "#d32f2f",
          bg: "#ffebee",
          icon: <FlagIcon />,
        };
      default:
        return {
          label: "Chờ duyệt",
          color: "#ed6c02",
          bg: "#fff3e0",
          icon: <AccessTimeIcon />,
        };
    }
  };

  const handleGradeChange = (studentId, field, value) => {
    setGrades((prev) => ({
      ...prev,
      [studentId]: { ...prev[studentId], [field]: value },
    }));
  };

  const handleSaveAllGrades = async () => {
    try {
      if (!selectedRoundId || !selectedCriterionId) {
        toast.warning(
          "Vui lòng chọn đầy đủ Vòng đánh giá và Tiêu chí trước khi chấm điểm!",
        );
        return;
      }
      setSavingGrades(true);
      const payload = {
        assignmentId: id,
        roundId: parseInt(selectedRoundId),
        criterionId: parseInt(selectedCriterionId),
        evaluations: Object.keys(grades).map((studentId) => ({
          studentId: parseInt(studentId),
          score: parseFloat(grades[studentId].score) || 0,
          contribution: grades[studentId].contribution,
          comment: grades[studentId].comment,
        })),
      };

      await assessmentResultApi.saveBulkGrades(payload);
      await new Promise((resolve) => setTimeout(resolve, 800));
      toast.success("Đã lưu điểm cho toàn bộ nhóm thành công!");
    } catch (error) {
      toast.error("❌ Không thể lưu điểm, vui lòng kiểm tra lại.");
    } finally {
      setSavingGrades(false);
    }
  };

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
        <CircularProgress />
      </Box>
    );
  if (!detail)
    return (
      <Typography sx={{ p: 4 }}>
        Không tìm thấy dữ liệu nhóm phân công.
      </Typography>
    );

  const statusStyle = getStatusInfo(detail.status);
  const currentCriterion = criteria.find(
    (c) => (c.criterionId || c.id) === parseInt(selectedCriterionId),
  );
  const maxScoreAllowed = currentCriterion?.maxScore || 10;

  return (
    <Box
      sx={{
        p: { xs: 2, md: 4 },
        minHeight: "100vh",
        backgroundColor: "#f8fafc",
      }}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 4 }}
      >
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          sx={{ fontWeight: 700, color: "#64748b" }}
        >
          Quay lại
        </Button>
        <Chip
          icon={statusStyle.icon}
          label={statusStyle.label}
          sx={{
            bgcolor: statusStyle.bg,
            color: statusStyle.color,
            fontWeight: 800,
            p: 2,
            borderRadius: "12px",
          }}
        />
      </Stack>

      <Grid container spacing={4}>
        <Grid item xs={12} lg={8}>
          {/* THÔNG TIN DỰ ÁN */}
          <Paper
            sx={{
              p: 4,
              borderRadius: "24px",
              boxShadow: "0 10px 40px rgba(0,0,0,0.04)",
              border: "1px solid #e2e8f0",
              mb: 4,
            }}
          >
            <Typography
              variant="caption"
              sx={{
                color: "#3b82f6",
                fontWeight: 800,
                letterSpacing: 1.5,
                textTransform: "uppercase",
              }}
            >
              {detail.phaseName}
            </Typography>
            <Typography
              variant="h4"
              sx={{ fontWeight: 900, color: "#0f172a", mt: 1, mb: 2 }}
            >
              {detail.assignmentTitle}
            </Typography>

            {/* 🔥 THANH TIẾN ĐỘ CÔNG VIỆC TRỰC QUAN */}
            <Box sx={{ mb: 4, bgcolor: "#f1f5f9", p: 2, borderRadius: 3 }}>
              <Stack direction="row" justifyContent="space-between" mb={1}>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 800, color: "#475569", mr: 0.75 }}
                >
                  Tiến độ hoàn thành dự án
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 800,
                    color: progress.percentage === 100 ? "#22c55e" : "#3b82f6",
                  }}
                >
                  {progress.percentage}% ({progress.completedTasks}/
                  {progress.totalTasks} Task)
                </Typography>
              </Stack>
              <LinearProgress
                variant="determinate"
                value={progress.percentage || 0}
                sx={{
                  height: 10,
                  borderRadius: 5,
                  bgcolor: "#cbd5e1",
                  "& .MuiLinearProgress-bar": {
                    bgcolor:
                      progress.percentage === 100 ? "#22c55e" : "#3b82f6",
                    borderRadius: 5,
                    transition: "transform 0.4s linear",
                  },
                }}
              />
            </Box>

            <Stack
              direction="row"
              spacing={4}
              sx={{ mb: 4, flexWrap: "wrap", rowGap: 3 }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Avatar
                  src={detail.mentorAvatarUrl}
                  sx={{ bgcolor: "#eff6ff", color: "#3b82f6" }}
                >
                  {!detail.mentorAvatarUrl && <SupervisorAccountIcon />}
                </Avatar>
                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ fontWeight: 600 }}
                  >
                    Mentor Hướng dẫn
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 700 }}>
                    {detail.mentorName}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Avatar sx={{ bgcolor: "#fef2f2", color: "#ef4444" }}>
                  <FlagIcon />
                </Avatar>
                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ fontWeight: 600 }}
                  >
                    Ngày giao đề tài
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 700 }}>
                    {detail.assignedDate}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Avatar sx={{ bgcolor: "#fff7ed", color: "#d97706" }}>
                  <AlarmIcon />
                </Avatar>
                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ fontWeight: 600 }}
                  >
                    Hạn chót (Deadline)
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight: 700,
                      color: detail.dueDate ? "#b45309" : "#94a3b8",
                    }}
                  >
                    {detail.dueDate ? detail.dueDate : "Chưa thiết lập"}
                  </Typography>
                </Box>
              </Box>
            </Stack>

            <Typography
              variant="h6"
              sx={{
                fontWeight: 800,
                mb: 2,
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <AssignmentIcon color="primary" /> Mô tả nhiệm vụ
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "#475569",
                lineHeight: 1.8,
                p: 3,
                bgcolor: "#f8fafc",
                borderRadius: 4,
                borderLeft: "5px solid #3b82f6",
              }}
            >
              {detail.assignmentDescription ||
                "Không có mô tả chi tiết cho đề tài này."}
            </Typography>
          </Paper>

          <Box sx={{ width: "100%" }}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                value={tabValue}
                onChange={(e, newValue) => setTabValue(newValue)}
                aria-label="assignment tabs"
              >
                <Tab
                  icon={<ViewKanbanIcon />}
                  iconPosition="start"
                  label="Tiến độ (Kanban)"
                  sx={{ fontWeight: 700, fontSize: "1rem" }}
                />
                <Tab
                  icon={<TimelineIcon />}
                  iconPosition="start"
                  label="Chấm điểm Đánh giá"
                  sx={{ fontWeight: 700, fontSize: "1rem" }}
                />
              </Tabs>
            </Box>

            <CustomTabPanel value={tabValue} index={0}>
              {/* 🔥 Truyền loadProgress vào Kanban để cập nhật tiến độ liên tục */}
              <KanbanBoard
                assignmentId={id}
                assignmentStudents={detail.students || []}
                loadProgress={loadProgress}
              />
            </CustomTabPanel>

            <CustomTabPanel value={tabValue} index={1}>
              <Paper
                sx={{
                  width: "100%",
                  overflow: "hidden",
                  borderRadius: "16px",
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.02)",
                }}
              >
                <Stack direction="row" spacing={3} sx={{ mb: 3, ml: 2, mt: 2 }}>
                  <FormControl size="small" sx={{ minWidth: 250 }}>
                    <Typography
                      variant="caption"
                      sx={{ fontWeight: 700, mb: 0.5, color: "#64748b" }}
                    >
                      Vòng đánh giá
                    </Typography>
                    <Select
                      value={selectedRoundId}
                      onChange={handleRoundChange}
                      displayEmpty
                      sx={{ bgcolor: "#fff", borderRadius: 2 }}
                    >
                      <MenuItem value="" disabled>
                        -- Chọn vòng đánh giá --
                      </MenuItem>
                      {rounds.map((round) => (
                        <MenuItem
                          key={round.roundId || round.id}
                          value={round.roundId || round.id}
                        >
                          {round.roundName || round.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl
                    size="small"
                    sx={{ minWidth: 250 }}
                    disabled={!selectedRoundId}
                  >
                    <Typography
                      variant="caption"
                      sx={{ fontWeight: 700, mb: 0.5, color: "#64748b" }}
                    >
                      Tiêu chí chấm điểm
                    </Typography>
                    <Select
                      value={selectedCriterionId}
                      onChange={(e) => setSelectedCriterionId(e.target.value)}
                      displayEmpty
                      sx={{ bgcolor: "#fff", borderRadius: 2 }}
                    >
                      <MenuItem value="" disabled>
                        {criteria.length === 0
                          ? "-- Không có tiêu chí --"
                          : "-- Chọn tiêu chí --"}
                      </MenuItem>
                      {criteria.map((crit) => (
                        <MenuItem
                          key={crit.criterionId || crit.id}
                          value={crit.criterionId || crit.id}
                        >
                          {crit.criterionName || crit.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Stack>

                <TableContainer>
                  <Table sx={{ minWidth: 650 }}>
                    <TableHead sx={{ bgcolor: "#f1f5f9" }}>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 800, color: "#475569" }}>
                          Thành viên
                        </TableCell>
                        <TableCell
                          sx={{ fontWeight: 800, color: "#475569", width: 140 }}
                        >
                          Đóng góp
                        </TableCell>
                        <TableCell
                          sx={{ fontWeight: 800, color: "#475569", width: 100 }}
                        >
                          Điểm số
                        </TableCell>
                        <TableCell sx={{ fontWeight: 800, color: "#475569" }}>
                          Nhận xét của Mentor
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {detail.students?.map((student) => (
                        <TableRow
                          key={student.id}
                          hover
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                        >
                          <TableCell>
                            <Typography
                              sx={{
                                fontWeight: 800,
                                color: "#0f172a",
                                display: "block",
                                mb: 0.5,
                              }}
                            >
                              {student.name}
                            </Typography>
                            <Chip
                              label={`MSSV: ${student.code}`}
                              size="small"
                              sx={{
                                bgcolor: "#f1f5f9",
                                color: "#64748b",
                                fontWeight: 600,
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            {isRoleNotAllowed(user?.role) ? (
                              <Typography
                                variant="body2"
                                fontWeight="700"
                                color="primary"
                              >
                                {grades[student.id]?.contribution || "Chưa có"}
                              </Typography>
                            ) : (
                              <FormControl fullWidth size="small">
                                <Select
                                  value={
                                    grades[student.id]?.contribution || "100%"
                                  }
                                  onChange={(e) =>
                                    handleGradeChange(
                                      student.id,
                                      "contribution",
                                      e.target.value,
                                    )
                                  }
                                  sx={{ bgcolor: "#fff", fontSize: "0.875rem" }}
                                >
                                  <MenuItem value="100%">100%</MenuItem>
                                  <MenuItem value="80%">80%</MenuItem>
                                  <MenuItem value="50%">50%</MenuItem>
                                  <MenuItem value="0%">0%</MenuItem>
                                </Select>
                              </FormControl>
                            )}
                          </TableCell>
                          <TableCell>
                            {isRoleNotAllowed(user?.role) ? (
                              <Chip
                                label={
                                  grades[student.id]?.score
                                    ? `${grades[student.id].score} đ`
                                    : "N/A"
                                }
                                color={
                                  grades[student.id]?.score
                                    ? "success"
                                    : "default"
                                }
                                sx={{ fontWeight: "bold" }}
                              />
                            ) : (
                              <TextField
                                size="small"
                                placeholder={`0-${maxScoreAllowed}`}
                                type="number"
                                inputProps={{
                                  min: 0,
                                  max: maxScoreAllowed,
                                  step: 0.5,
                                }}
                                value={grades[student.id]?.score || ""}
                                onChange={(e) => {
                                  let val = parseFloat(e.target.value);
                                  if (val > maxScoreAllowed) {
                                    toast.warning(
                                      `Điểm tối đa của tiêu chí này chỉ là ${maxScoreAllowed}`,
                                      { toastId: "maxScoreWarning" },
                                    );
                                  }
                                  handleGradeChange(
                                    student.id,
                                    "score",
                                    e.target.value,
                                  );
                                }}
                                sx={{
                                  bgcolor: "#fff",
                                  "& input": {
                                    textAlign: "center",
                                    fontWeight: "bold",
                                    color: "#1e3c72",
                                  },
                                  width: "80px",
                                }}
                              />
                            )}
                          </TableCell>
                          <TableCell>
                            {isRoleNotAllowed(user?.role) ? (
                              <Typography
                                variant="body2"
                                sx={{
                                  fontStyle: grades[student.id]?.comment
                                    ? "normal"
                                    : "italic",
                                  color: grades[student.id]?.comment
                                    ? "#333"
                                    : "#9e9e9e",
                                }}
                              >
                                {grades[student.id]?.comment ||
                                  "Không có nhận xét"}
                              </Typography>
                            ) : (
                              <TextField
                                size="small"
                                fullWidth
                                placeholder="Nhập nhận xét..."
                                value={grades[student.id]?.comment || ""}
                                onChange={(e) =>
                                  handleGradeChange(
                                    student.id,
                                    "comment",
                                    e.target.value,
                                  )
                                }
                                sx={{ bgcolor: "#fff" }}
                              />
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                {!isRoleNotAllowed(user?.role) && (
                  <Box
                    sx={{
                      p: 2.5,
                      bgcolor: "#f8fafc",
                      borderTop: "1px solid #e2e8f0",
                      display: "flex",
                      justifyContent: "flex-end",
                    }}
                  >
                    <Button
                      variant="contained"
                      startIcon={
                        savingGrades ? (
                          <CircularProgress size={20} color="inherit" />
                        ) : (
                          <SaveIcon />
                        )
                      }
                      onClick={handleSaveAllGrades}
                      disabled={savingGrades}
                      sx={{
                        bgcolor: "#1e3c72",
                        fontWeight: 800,
                        borderRadius: 2,
                        px: 3,
                        boxShadow: "0 4px 14px rgba(30, 60, 114, 0.4)",
                        "&:hover": { bgcolor: "#152b52" },
                      }}
                    >
                      {savingGrades ? "ĐANG LƯU..." : "LƯU TOÀN BỘ ĐIỂM"}
                    </Button>
                  </Box>
                )}
              </Paper>
            </CustomTabPanel>
          </Box>
        </Grid>

        <Grid item xs={12} lg={4} sx={{ width: "100%" }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 800,
              mb: 2,
              mt: { xs: 4, lg: 0 },
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <GroupsIcon color="primary" /> Thành viên nhóm (
            {detail.students?.length || 0})
          </Typography>

          <Grid container spacing={2}>
            <AnimatePresence>
              {detail.students?.map((student, index) => (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  lg={12}
                  key={student.id}
                  component={motion.div}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Paper
                    sx={{
                      p: 2,
                      borderRadius: "18px",
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      boxShadow: "0 4px 15px rgba(0,0,0,0.03)",
                      border: "1px solid #f1f5f9",
                      height: "100%",
                      width: "100%",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: "0 12px 25px rgba(0,0,0,0.08)",
                        transition: "all 0.3s ease",
                      },
                    }}
                  >
                    <Avatar
                      src={student.avatarUrl}
                      sx={{
                        bgcolor: index % 2 === 0 ? "#3b82f6" : "#8b5cf6",
                        width: 50,
                        height: 50,
                        fontWeight: 700,
                      }}
                    >
                      {!student.avatarUrl &&
                        student.name?.charAt(0).toUpperCase()}
                    </Avatar>
                    <Box sx={{ overflow: "hidden" }}>
                      <Typography
                        variant="body1"
                        sx={{
                          fontWeight: 800,
                          color: "#1e293b",
                          whiteSpace: "nowrap",
                          textOverflow: "ellipsis",
                          overflow: "hidden",
                        }}
                      >
                        {student.name}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          color: "#64748b",
                          display: "block",
                          fontWeight: 600,
                        }}
                      >
                        MSSV: {student.code}
                      </Typography>
                      <Chip
                        label={student.major}
                        size="small"
                        sx={{
                          mt: 0.5,
                          fontSize: "0.65rem",
                          height: 18,
                          bgcolor: "#f1f5f9",
                        }}
                      />
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </AnimatePresence>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AssignmentDetail;
