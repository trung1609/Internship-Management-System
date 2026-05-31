import { useState, useEffect, useContext } from "react";
import { DataTable } from "../../components/DataTable";
import { internshipAssignmentApi } from "../../api/resourceApi";
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  Stack,
  Paper,
  Divider,
} from "@mui/material";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-toastify";

const InternshipAssignmentsManagement = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [formData, setFormData] = useState({
    studentId: "",
    mentorId: "",
    phaseId: "",
    status: "PENDING",
    assignmentTitle: "",
    assignmentDescription: "",
  });

  const { user } = useContext(AuthContext);
  const isAdmin = user?.role === "ADMIN" || user?.role === "ROLE_ADMIN";

  useEffect(() => {
    fetchAssignments();
  }, [page, rowsPerPage, search]);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const response = await internshipAssignmentApi.getAllAssignments(
        search,
        page,
        rowsPerPage,
      );
      setData(response?.content || []);
      setTotalCount(response?.totalElements || 0);
    } catch (err) {
      console.error("Error status:", err?.response?.status);
      console.error("Error data:", err?.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (assignment = null) => {
    if (assignment) {
      setEditingAssignment(assignment);
      setFormData({
        studentId: assignment.studentId || "",
        mentorId: assignment.mentorId || "",
        phaseId: assignment.phaseId || "",
        status: assignment.status || "PENDING",
        assignmentTitle: assignment.assignmentTitle || "",
        assignmentDescription: assignment.assignmentDescription || "",
      });
    } else {
      setEditingAssignment(null);
      setFormData({
        studentId: "",
        mentorId: "",
        phaseId: "",
        status: "PENDING",
        assignmentTitle: "",
        assignmentDescription: "",
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingAssignment(null);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      if (editingAssignment) {
        await internshipAssignmentApi.updateAssignmentStatus(
          editingAssignment.id,
          formData,
        );
        toast.success("Cập nhật phân công thành công!");
      } else {
        await internshipAssignmentApi.createAssignment(formData);
        toast.success("Thêm phân công thành công!");
      }
      handleCloseDialog();
      fetchAssignments();
    } catch (err) {
      console.error("Error saving assignment:", err);
      toast.error("Có lỗi xảy ra khi lưu phân công!");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { field: "id", label: "ID" },
    { field: "assignmentTitle", label: "Assignment Title" },
    { field: "assignmentDescription", label: "Description" },
    { field: "studentName", label: "Student Name" },
    { field: "mentorName", label: "Mentor Name" },
    { field: "phaseName", label: "Phase Name" },
    { field: "assignedDate", label: "Assign Date" },
    {
      field: "status",
      label: "Status",
      render: (status) => {
        let color, bgColor, label;
        switch (status) {
          case "IN_PROGRESS":
            color = "#2e7d32";
            bgColor = "rgba(46, 125, 50, 0.1)";
            label = "Hoạt động";
            break;
          case "COMPLETED":
            color = "#1976d2";
            bgColor = "rgba(25, 118, 210, 0.1)";
            label = "Hoàn thành";
            break;
          case "CANCELLED":
            color = "#d32f2f";
            bgColor = "rgba(211, 47, 47, 0.1)";
            label = "Hủy";
            break;
          default:
            color = "#ed6c02";
            bgColor = "rgba(237, 108, 2, 0.1)";
            label = "Đang chờ";
        }
        return (
          <Box
            sx={{
              display: "inline-block",
              px: 2,
              py: 0.5,
              borderRadius: "20px",
              backgroundColor: bgColor,
              color: color,
              fontWeight: "bold",
              fontSize: "0.85rem",
            }}
          >
            {label}
          </Box>
        );
      },
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: "#1a237e", mb: 0.5 }}>
            Quản lý Phân công Thực tập
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Theo dõi phân công sinh viên, cố vấn và trạng thái đồ án
          </Typography>
        </Box>
      </Box>

      {/* Bảng Dữ Liệu */}
      <Paper sx={{ p: 3, borderRadius: 3, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
        <DataTable
          title=""
          columns={columns}
          data={data}
          loading={loading}
          onEdit={isAdmin ? (assignment) => handleOpenDialog(assignment) : null}
          onAdd={isAdmin ? () => handleOpenDialog() : null}
          totalCount={totalCount}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={(newPage) => setPage(newPage)}
          onRowsPerPageChange={(newRowsPerPage) => {
            setRowsPerPage(newRowsPerPage);
            setPage(0);
          }}
          searchValue={search}
          onSearchChange={(value) => {
            setSearch(value);
            setPage(0);
          }}
        />
      </Paper>

      {/* Modal Thêm/Sửa bằng Stack */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3, overflow: "visible" },
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h5" sx={{ fontWeight: "bold", color: "#333" }}>
            {editingAssignment ? "Cập nhật Phân công" : "Tạo Phân công mới"}
          </Typography>
        </DialogTitle>
        <Divider />

        <DialogContent sx={{ pt: 3 }}>
          <Stack spacing={2.5}>
            <TextField
              fullWidth
              label="Tiêu đề phân công"
              value={formData.assignmentTitle}
              onChange={(e) =>
                setFormData({ ...formData, assignmentTitle: e.target.value })
              }
            />

            <TextField
              fullWidth
              label="Mô tả công việc"
              value={formData.assignmentDescription}
              onChange={(e) =>
                setFormData({ ...formData, assignmentDescription: e.target.value })
              }
              multiline
              rows={3}
            />

            <TextField
              fullWidth
              label="Mã sinh viên"
              value={formData.studentId}
              onChange={(e) =>
                setFormData({ ...formData, studentId: e.target.value })
              }
            />

            <TextField
              fullWidth
              label="Mã cố vấn"
              value={formData.mentorId}
              onChange={(e) =>
                setFormData({ ...formData, mentorId: e.target.value })
              }
            />

            <TextField
              fullWidth
              label="Mã giai đoạn (Phase)"
              value={formData.phaseId}
              onChange={(e) =>
                setFormData({ ...formData, phaseId: e.target.value })
              }
            />

            <FormControl fullWidth>
              <InputLabel>Trạng thái phân công</InputLabel>
              <Select
                value={formData.status}
                label="Trạng thái phân công"
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
              >
                <MenuItem value="PENDING">Đang chờ (Pending)</MenuItem>
                <MenuItem value="IN_PROGRESS">Hoạt động (In Progress)</MenuItem>
                <MenuItem value="COMPLETED">Hoàn thành (Completed)</MenuItem>
                <MenuItem value="CANCELLED">Đã Hủy (Cancelled)</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>

        <Divider />
        <DialogActions sx={{ p: 2.5, justifyContent: "flex-end" }}>
          <Button onClick={handleCloseDialog} sx={{ fontWeight: "bold", color: "#666" }}>
            Hủy bỏ
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            sx={{ px: 4, borderRadius: 2, fontWeight: "bold" }}
          >
            {editingAssignment ? "Lưu thay đổi" : "Tạo mới"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default InternshipAssignmentsManagement;