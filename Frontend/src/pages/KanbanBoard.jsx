import React, { useState, useEffect, useContext, useMemo } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import {
  Box,
  Paper,
  Typography,
  Stack,
  Button,
  IconButton,
  Card,
  CardContent,
  Modal,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
  Chip,
  AvatarGroup,
  Tooltip,
  OutlinedInput,
  TablePagination,
  InputAdornment,
  Divider,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import SendIcon from "@mui/icons-material/Send";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import { taskApi } from "../api/resourceApi";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "../context/AuthContext";
import { BASE_URL } from "../api/axiosClient";

const COLUMNS = {
  TO_DO: { id: "TO_DO", title: "Cần làm", color: "#64748b" },
  IN_PROGRESS: { id: "IN_PROGRESS", title: "Đang thực hiện", color: "#0284c7" },
  COMPLETED: { id: "COMPLETED", title: "Hoàn thành", color: "#22c55e" },
};

const PRIORITY_COLORS = {
  HIGH: { color: "#ef4444", bg: "#fef2f2", label: "Gấp" },
  MEDIUM: { color: "#f59e0b", bg: "#fffbeb", label: "Vừa" },
  LOW: { color: "#3b82f6", bg: "#eff6ff", label: "Thấp" },
};

// 🔥 Đã nhận thêm loadProgress từ cha
const KanbanBoard = ({
  assignmentId,
  assignmentStudents = [],
  loadProgress,
}) => {
  const { user } = useContext(AuthContext);
  const isStudent = user?.role === "ROLE_STUDENT";

  const [tasks, setTasks] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [totalElements, setTotalElements] = useState(0);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterPriority, setFilterPriority] = useState("ALL");
  const [filterMyTasks, setFilterMyTasks] = useState(false);

  const [openModal, setOpenModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [dateFocus, setDateFocus] = useState(false);
  const [formData, setFormData] = useState({
    taskTitle: "",
    description: "",
    dueDate: "",
    assignedStudentIds: [],
  });

  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  useEffect(() => {
    if (assignmentId) loadTasks();
  }, [assignmentId, page, rowsPerPage]);

  const loadTasks = async () => {
    try {
      const res = await taskApi.getTasksByAssignment(
        assignmentId,
        page,
        rowsPerPage,
      );
      setTasks(res?.content || []);
      setTotalElements(res?.totalElements || 0);
    } catch (err) {
      toast.error("Không thể tải danh sách công việc");
    }
  };

  // 🔥 Hàm xóa nhanh thẻ Chip sinh viên
  const handleRemoveAssignee = (e, studentIdToRemove) => {
    e.stopPropagation(); // Không mở dropdown khi bấm X
    setFormData((prev) => ({
      ...prev,
      assignedStudentIds: prev.assignedStudentIds.filter(
        (id) => id !== studentIdToRemove,
      ),
    }));
  };

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchSearch = task.taskTitle
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchPriority =
        filterPriority === "ALL" ? true : task.priority === filterPriority;
      const matchMyTasks = filterMyTasks
        ? task.assignees?.some(
            (a) =>
              a.studentId === user.userId || a.studentId === user.studentId,
          )
        : true;
      return matchSearch && matchPriority && matchMyTasks;
    });
  }, [tasks, searchQuery, filterPriority, filterMyTasks, user]);

  const isOverdue = (dueDate, status) => {
    if (!dueDate || status === "COMPLETED") return false;
    return new Date(dueDate) < new Date(new Date().setHours(0, 0, 0, 0));
  };

  const getDisplayDate = (isoStr) => {
    if (!isoStr) return "";
    if (isoStr.includes("-")) {
      const [year, month, day] = isoStr.split("-");
      return `${day}/${month}/${year}`;
    }
    return isoStr;
  };

  const formatDateTime = (isoString) => {
    if (!isoString) return "";
    const dateObj = new Date(isoString);
    if (isNaN(dateObj)) return isoString;
    const hours = String(dateObj.getHours()).padStart(2, "0");
    const minutes = String(dateObj.getMinutes()).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const year = dateObj.getFullYear();
    return `${hours}:${minutes} - ${day}/${month}/${year}`;
  };

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;
    if (
      !destination ||
      (destination.droppableId === source.droppableId &&
        destination.index === source.index)
    ) {
      return;
    }

    const previousTasks = [...tasks];
    const newStatus = destination.droppableId;

    const updatedTasks = tasks.map((t) =>
      t.taskId.toString() === draggableId ? { ...t, status: newStatus } : t,
    );
    setTasks(updatedTasks);

    try {
      await taskApi.updateStatus(draggableId, newStatus);
      if (loadProgress) loadProgress();
    } catch (err) {
      toast.error(err.response?.data?.message || "Đổi trạng thái thất bại");
      setTasks(previousTasks);
    }
  };

  const handleOpenModal = async (task = null) => {
    if (task) {
      setEditingTask(task);
      let safeDate = "";
      if (task.dueDate) {
        if (task.dueDate.includes("/")) {
          const [day, month, year] = task.dueDate.split("/");
          safeDate = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
        } else if (task.dueDate.includes("-")) {
          safeDate = task.dueDate;
        }
      }
      setFormData({
        taskTitle: task.taskTitle || "",
        description: task.description || "",
        dueDate: safeDate,
        assignedStudentIds: task.assignees
          ? task.assignees.map((a) => a.studentId)
          : [],
      });
      try {
        const res = await taskApi.getComments(task.taskId);
        setComments(res || []);
      } catch (e) {
        console.error(e);
      }
    } else {
      setEditingTask(null);
      setFormData({
        taskTitle: "",
        description: "",
        dueDate: "",
        assignedStudentIds: [],
      });
    }
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setEditingTask(null);
  };

  const handleSaveTask = async () => {
    if (!formData.taskTitle.trim()) {
      toast.warning("Vui lòng nhập tiêu đề công việc");
      return;
    }
    try {
      const payload = {
        ...formData,
        assignmentId: assignmentId,
        dueDate: formData.dueDate || null,
      };
      if (editingTask) {
        await taskApi.updateTask(editingTask.taskId, payload);
        toast.success("Cập nhật công việc thành công!");
      } else {
        await taskApi.createTask(payload);
        toast.success("Đã thêm công việc mới!");
      }
      handleCloseModal();
      loadTasks();

      if (loadProgress) loadProgress();
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Có lỗi xảy ra khi lưu dữ liệu.",
      );
    }
  };

  const handleSendComment = async () => {
    if (!newComment.trim() || !editingTask) return;
    try {
      const res = await taskApi.addComment(editingTask.taskId, newComment);
      setComments([...comments, res]);
      setNewComment("");
    } catch (e) {
      toast.error("Không gửi được bình luận");
    }
  };

  const confirmDelete = async () => {
    try {
      await taskApi.deleteTask(taskToDelete.taskId);
      toast.success("Đã xóa công việc!");
      setOpenDeleteModal(false);
      loadTasks();

      if (loadProgress) loadProgress();
    } catch (err) {
      toast.error("Xóa thất bại");
    }
  };

  useEffect(() => {
    let stompClient = null;
    if (editingTask) {
      const socket = new SockJS(`${BASE_URL}/ws`);
      stompClient = Stomp.over(socket);
      stompClient.debug = null;
      stompClient.connect(
        {},
        () => {
          stompClient.subscribe(
            `/topic/tasks/${editingTask.taskId}/comments`,
            (message) => {
              if (message.body) {
                const receivedComment = JSON.parse(message.body);
                setComments((prevComments) => {
                  const isExist = prevComments.some(
                    (c) => c.commentId === receivedComment.commentId,
                  );
                  if (isExist) return prevComments;
                  return [...prevComments, receivedComment];
                });
              }
            },
          );
        },
        (error) => {
          console.error("Lỗi kết nối WebSocket:", error);
        },
      );
    }
    return () => {
      if (stompClient && stompClient.connected) stompClient.disconnect();
    };
  }, [editingTask]);

  return (
    <Box
      sx={{
        mt: 2,
        p: 3,
        bgcolor: "#f8fafc",
        borderRadius: 4,
        border: "1px solid #e2e8f0",
      }}
    >
      <Stack
        direction={{ xs: "column", md: "row" }}
        justifyContent="space-between"
        alignItems="center"
        sx={{ width: "100%", rowGap: 2, mb: 5 }}
      >
        <Stack
          direction="row"
          spacing={2}
          sx={{
            width: { xs: "100%", md: "auto" },
            flexWrap: "wrap",
            rowGap: 1.5,
          }}
        >
          <TextField
            size="small"
            placeholder="Tìm kiếm công việc..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ bgcolor: "#fff", minWidth: 250 }}
          />
          <FormControl size="small" sx={{ bgcolor: "#fff", minWidth: 150 }}>
            <Select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              displayEmpty
            >
              <MenuItem value="ALL">
                <FilterListIcon
                  sx={{ fontSize: 16, mr: 1, verticalAlign: "middle" }}
                />
                Tất cả ưu tiên
              </MenuItem>
              <MenuItem value="HIGH">Độ ưu tiên: Gấp</MenuItem>
              <MenuItem value="MEDIUM">Độ ưu tiên: Vừa</MenuItem>
              <MenuItem value="LOW">Độ ưu tiên: Thấp</MenuItem>
            </Select>
          </FormControl>
          {isStudent && (
            <Button
              variant={filterMyTasks ? "contained" : "outlined"}
              onClick={() => setFilterMyTasks(!filterMyTasks)}
              sx={{ borderRadius: 2, whiteSpace: "nowrap" }}
            >
              Việc của tôi
            </Button>
          )}
        </Stack>

        {!isStudent && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenModal()}
            sx={{ borderRadius: 2, fontWeight: 700 }}
          >
            Thêm Công Việc
          </Button>
        )}
      </Stack>

      {/* KANBAN BOARD */}
      <DragDropContext onDragEnd={onDragEnd}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={3}
          alignItems="flex-start"
          sx={{ minHeight: 480, overflowX: "auto", pb: 2 }}
        >
          {Object.values(COLUMNS).map((column) => {
            const columnTasks = filteredTasks.filter(
              (t) => t.status === column.id,
            );
            return (
              <Box
                key={column.id}
                sx={{ flex: 1, minWidth: 320, width: "100%" }}
              >
                <Paper
                  sx={{
                    p: 2,
                    mb: 2,
                    bgcolor: column.color,
                    color: "#fff",
                    borderRadius: 3,
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography sx={{ fontWeight: 800 }}>
                    {column.title} ({columnTasks.length})
                  </Typography>
                </Paper>

                <Droppable droppableId={column.id}>
                  {(provided, snapshot) => (
                    <Stack
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      spacing={2}
                      sx={{
                        p: 1.5,
                        borderRadius: 3,
                        bgcolor: snapshot.isDraggingOver
                          ? "#f1f5f9"
                          : "transparent",
                        border: "2px dashed",
                        borderColor: snapshot.isDraggingOver
                          ? column.color
                          : "#cbd5e1",
                        minHeight: 400,
                      }}
                    >
                      {columnTasks.map((task, index) => {
                        const taskOverdue = isOverdue(
                          task.dueDate,
                          task.status,
                        );
                        const priorityStyle =
                          PRIORITY_COLORS[task.priority || "MEDIUM"];

                        return (
                          <Draggable
                            key={task.taskId.toString()}
                            draggableId={task.taskId.toString()}
                            index={index}
                          >
                            {(provided, snapshot) => (
                              <Card
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                elevation={snapshot.isDragging ? 6 : 1}
                                sx={{
                                  borderRadius: 3,
                                  borderLeft: `6px solid ${column.color}`,
                                  border: taskOverdue
                                    ? "2px solid #dc2626"
                                    : "1px solid #e2e8f0",
                                  boxShadow: taskOverdue
                                    ? "0 4px 12px rgba(220, 38, 38, 0.08)"
                                    : "none",
                                  bgcolor: taskOverdue ? "#fff5f5" : "#fff",
                                  transform: snapshot.isDragging
                                    ? "rotate(3deg)"
                                    : "none",
                                  transition: "all 0.2s ease",
                                  "&:hover .task-actions": { opacity: 1 },
                                }}
                              >
                                <CardContent
                                  sx={{ p: 2, "&:last-child": { pb: 2 } }}
                                >
                                  <Stack
                                    direction="row"
                                    spacing={1}
                                    mb={1}
                                    flexWrap="wrap"
                                    gap={0.5}
                                  >
                                    <Chip
                                      size="small"
                                      icon={
                                        <WhatshotIcon
                                          style={{
                                            color: priorityStyle.color,
                                            fontSize: 14,
                                          }}
                                        />
                                      }
                                      label={priorityStyle.label}
                                      sx={{
                                        bgcolor: priorityStyle.bg,
                                        color: priorityStyle.color,
                                        fontWeight: 700,
                                        fontSize: "0.7rem",
                                        height: 20,
                                      }}
                                    />
                                    {taskOverdue && (
                                      <Chip
                                        size="small"
                                        label="Đã quá hạn! 🔥"
                                        sx={{
                                          bgcolor: "#dc2626",
                                          color: "#fff",
                                          fontWeight: 800,
                                          fontSize: "0.7rem",
                                          height: 20,
                                          animation:
                                            "blink 1.5s infinite ease-in-out",
                                          "@keyframes blink": {
                                            "0%, 100%": {
                                              opacity: 1,
                                              transform: "scale(1)",
                                            },
                                            "50%": {
                                              opacity: 0.5,
                                              transform: "scale(0.95)",
                                            },
                                          },
                                        }}
                                      />
                                    )}
                                  </Stack>

                                  <Box
                                    display="flex"
                                    justifyContent="space-between"
                                    alignItems="flex-start"
                                  >
                                    <Typography
                                      sx={{
                                        fontWeight: 700,
                                        color: taskOverdue
                                          ? "#991b1b"
                                          : "#0f172a",
                                        mb: 1,
                                        fontSize: "0.95rem",
                                      }}
                                    >
                                      {task.taskTitle}
                                    </Typography>
                                    <Box
                                      className="task-actions"
                                      sx={{
                                        opacity: 0,
                                        transition: "opacity 0.2s",
                                        display: "flex",
                                        gap: 0.5,
                                        mt: -0.5,
                                        mr: -1,
                                      }}
                                    >
                                      <IconButton
                                        size="small"
                                        color="primary"
                                        onClick={() => handleOpenModal(task)}
                                      >
                                        <EditIcon fontSize="small" />
                                      </IconButton>
                                      {!isStudent && (
                                        <IconButton
                                          size="small"
                                          color="error"
                                          onClick={() => {
                                            setTaskToDelete(task);
                                            setOpenDeleteModal(true);
                                          }}
                                        >
                                          <DeleteIcon fontSize="small" />
                                        </IconButton>
                                      )}
                                    </Box>
                                  </Box>

                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{
                                      display: "-webkit-box",
                                      WebkitLineClamp: 2,
                                      WebkitBoxOrient: "vertical",
                                      overflow: "hidden",
                                      mb: 2,
                                    }}
                                  >
                                    {task.description}
                                  </Typography>

                                  {task.dueDate && (
                                    <Stack
                                      direction="row"
                                      alignItems="center"
                                      gap={0.5}
                                      sx={{
                                        mb: 1.5,
                                        color: taskOverdue
                                          ? "#dc2626"
                                          : "#64748b",
                                      }}
                                    >
                                      <CalendarMonthIcon
                                        sx={{ fontSize: 16 }}
                                      />
                                      <Typography
                                        variant="caption"
                                        sx={{ fontWeight: 700 }}
                                      >
                                        Hạn chót: {getDisplayDate(task.dueDate)}
                                      </Typography>
                                    </Stack>
                                  )}

                                  <Box
                                    display="flex"
                                    justifyContent="space-between"
                                    alignItems="center"
                                  >
                                    {task.assignees?.length > 0 ? (
                                      <AvatarGroup
                                        max={3}
                                        sx={{
                                          "& .MuiAvatar-root": {
                                            width: 28,
                                            height: 28,
                                            fontSize: "0.8rem",
                                          },
                                        }}
                                      >
                                        {task.assignees.map((a) => (
                                          <Tooltip
                                            key={a.studentId}
                                            title={a.fullName}
                                          >
                                            <Avatar src={a.avatarUrl}>
                                              {a.fullName?.charAt(0)}
                                            </Avatar>
                                          </Tooltip>
                                        ))}
                                      </AvatarGroup>
                                    ) : (
                                      <Chip
                                        label="Chưa gán"
                                        size="small"
                                        variant="outlined"
                                        sx={{ height: 20, fontSize: "0.7rem" }}
                                      />
                                    )}
                                  </Box>
                                </CardContent>
                              </Card>
                            )}
                          </Draggable>
                        );
                      })}
                      {provided.placeholder}
                    </Stack>
                  )}
                </Droppable>
              </Box>
            );
          })}
        </Stack>
      </DragDropContext>

      <Divider sx={{ my: 2 }} />
      <Box display="flex" justifyContent="flex-end">
        <TablePagination
          component="div"
          count={totalElements}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[20]}
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} / ${count} Task`
          }
        />
      </Box>

      <Modal
        open={openModal}
        onClose={handleCloseModal}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backdropFilter: "blur(3px)",
        }}
      >
        <Paper
          sx={{
            borderRadius: 4,
            width: "100%",
            maxWidth: editingTask ? "800px" : "500px",
            maxHeight: "90vh",
            display: "flex",
            flexDirection: "column",
            outline: "none",
          }}
        >
          <Box
            sx={{
              p: 2,
              display: "flex",
              justifyContent: "space-between",
              borderBottom: "1px solid #eee",
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              {editingTask ? "Chi tiết & Thảo luận" : "Thêm công việc"}
            </Typography>
            <IconButton onClick={handleCloseModal} size="small">
              <CloseIcon />
            </IconButton>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              overflowY: "auto",
            }}
          >
            {/* CỘT TRÁI: FORM */}
            <Box
              sx={{
                p: 3,
                flex: 1,
                borderRight: editingTask ? { md: "1px solid #eee" } : "none",
              }}
            >
              <Stack spacing={3}>
                <TextField
                  fullWidth
                  label="Tiêu đề (*)"
                  value={formData.taskTitle}
                  onChange={(e) =>
                    setFormData({ ...formData, taskTitle: e.target.value })
                  }
                  disabled={isStudent}
                />
                <TextField
                  fullWidth
                  label="Mô tả"
                  multiline
                  rows={3}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  disabled={isStudent}
                />

                <Stack direction="row" spacing={2}>
                  <FormControl fullWidth disabled={isStudent}>
                    <InputLabel>Ưu tiên</InputLabel>
                    <Select
                      value={formData.priority}
                      onChange={(e) =>
                        setFormData({ ...formData, priority: e.target.value })
                      }
                      label="Ưu tiên"
                    >
                      <MenuItem value="HIGH">
                        <Chip
                          size="small"
                          label="Gấp"
                          sx={{
                            bgcolor: "#fef2f2",
                            color: "#ef4444",
                            fontWeight: "bold",
                          }}
                        />
                      </MenuItem>
                      <MenuItem value="MEDIUM">
                        <Chip
                          size="small"
                          label="Vừa"
                          sx={{
                            bgcolor: "#fffbeb",
                            color: "#f59e0b",
                            fontWeight: "bold",
                          }}
                        />
                      </MenuItem>
                      <MenuItem value="LOW">
                        <Chip
                          size="small"
                          label="Thấp"
                          sx={{
                            bgcolor: "#eff6ff",
                            color: "#3b82f6",
                            fontWeight: "bold",
                          }}
                        />
                      </MenuItem>
                    </Select>
                  </FormControl>

                  <TextField
                    fullWidth
                    label="Hạn chót"
                    type={dateFocus ? "date" : "text"}
                    value={
                      dateFocus
                        ? formData.dueDate
                        : getDisplayDate(formData.dueDate)
                    }
                    onChange={(e) =>
                      setFormData({ ...formData, dueDate: e.target.value })
                    }
                    onFocus={() => setDateFocus(true)}
                    onBlur={() => setDateFocus(false)}
                    placeholder="dd/MM/yyyy"
                    disabled={isStudent}
                  />
                </Stack>

                <FormControl fullWidth disabled={isStudent}>
                  <InputLabel>Giao việc (Nhiều người)</InputLabel>
                  <Select
                    multiple
                    value={formData.assignedStudentIds}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        assignedStudentIds: e.target.value,
                      })
                    }
                    input={<OutlinedInput label="Giao việc (Nhiều người)" />}
                    renderValue={(selected) => (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {selected.map((value) => {
                          const student = assignmentStudents.find(
                            (s) => (s.studentId || s.id) === value,
                          );
                          return (
                            <Chip
                              key={value}
                              label={
                                student?.fullName ||
                                student?.name ||
                                `ID: ${value}`
                              }
                              size="small"
                              color="primary"
                              variant="outlined"
                              // 🔥 Đã kích hoạt chức năng xóa sinh viên bằng nút x trên Chip
                              onMouseDown={(e) => e.stopPropagation()}
                              onDelete={(e) => handleRemoveAssignee(e, value)}
                            />
                          );
                        })}
                      </Box>
                    )}
                  >
                    {assignmentStudents.map((st) => (
                      <MenuItem
                        key={st.studentId || st.id}
                        value={st.studentId || st.id}
                      >
                        {st.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {!isStudent && (
                  <Button
                    variant="contained"
                    onClick={handleSaveTask}
                    sx={{ py: 1.5, borderRadius: 2 }}
                  >
                    LƯU CÔNG VIỆC
                  </Button>
                )}
              </Stack>
            </Box>

            {/* CỘT PHẢI: BÌNH LUẬN */}
            {editingTask && (
              <Box
                sx={{
                  p: 3,
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  bgcolor: "#f8fafc",
                }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: 800, color: "#64748b", mb: 2 }}
                >
                  THẢO LUẬN ({comments.length})
                </Typography>

                <Box
                  sx={{
                    flexGrow: 1,
                    overflowY: "auto",
                    maxHeight: 300,
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    pr: 1,
                  }}
                >
                  {comments.map((cmt) => (
                    <Box key={cmt.commentId} sx={{ display: "flex", gap: 1.5 }}>
                      <Avatar
                        src={cmt.authorAvatar}
                        sx={{ width: 32, height: 32 }}
                      >
                        {cmt.authorName?.charAt(0)}
                      </Avatar>
                      <Box
                        sx={{
                          bgcolor: "#fff",
                          p: 1.5,
                          borderRadius: 2,
                          border: "1px solid #e2e8f0",
                          width: "100%",
                        }}
                      >
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          alignItems="center"
                          gap={3}
                          mb={0.5}
                        >
                          <Typography
                            variant="caption"
                            sx={{ fontWeight: 800, mr: 1 }}
                          >
                            {cmt.authorName}
                          </Typography>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ whiteSpace: "nowrap" }}
                          >
                            {formatDateTime(cmt.createdAt)}
                          </Typography>
                        </Stack>
                        <Typography variant="body2">{cmt.content}</Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>

                <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Viết bình luận..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendComment()}
                    sx={{ bgcolor: "#fff" }}
                  />
                  <IconButton
                    color="primary"
                    onClick={handleSendComment}
                    sx={{ bgcolor: "#eff6ff" }}
                  >
                    <SendIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Box>
            )}
          </Box>
        </Paper>
      </Modal>

      <Modal
        open={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backdropFilter: "blur(3px)",
        }}
      >
        <Paper
          sx={{
            p: 4,
            borderRadius: 4,
            maxWidth: 400,
            textAlign: "center",
            outline: "none",
          }}
        >
          <Typography
            variant="h6"
            sx={{ fontWeight: 800, mb: 2, color: "#1e293b" }}
          >
            Xóa công việc này?
          </Typography>
          <Typography variant="body2" sx={{ color: "#64748b", mb: 4 }}>
            Bạn có chắc chắn muốn xóa <strong>{taskToDelete?.taskTitle}</strong>
            ? Toàn bộ dữ liệu liên quan sẽ bị mất.
          </Typography>
          <Stack direction="row" spacing={2}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => setOpenDeleteModal(false)}
            >
              Hủy
            </Button>
            <Button
              fullWidth
              variant="contained"
              color="error"
              onClick={confirmDelete}
            >
              Xóa ngay
            </Button>
          </Stack>
        </Paper>
      </Modal>
    </Box>
  );
};

export default KanbanBoard;
