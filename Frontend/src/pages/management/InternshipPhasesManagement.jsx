import { useState, useEffect } from "react";
import { DataTable } from "../../components/DataTable";
import { useContext } from "react";
import { internshipPhaseApi } from "../../api/resourceApi";
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControlLabel,
  Switch,
  Typography,
  Stack,
  Paper,
  Divider
} from "@mui/material";
import { toast } from "react-toastify";
import { AuthContext } from "../../context/AuthContext";

const InternshipPhasesManagement = () => {
  // ==========================================
  // PHẦN LOGIC
  // ==========================================
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [editingPhase, setEditingPhase] = useState(null);
  const [formData, setFormData] = useState({
    phaseName: "",
    description: "",
    startDate: "",
    endDate: "",
    isDeleted: false,
  });

  useEffect(() => {
    fetchPhases();
  }, [page, rowsPerPage, search]);

  const fetchPhases = async () => {
    try {
      setLoading(true);
      const response = await internshipPhaseApi.getAllPhases(
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

  const handleOpenDialog = (phase = null) => {
    if (phase) {
      setEditingPhase(phase);

      const formatToISO = (dateStr) => {
        if (!dateStr) return "";
        if (dateStr.includes("-")) return dateStr;
        if (dateStr.includes("/")) {
          const [day, month, year] = dateStr.split("/");
          return `${year}-${month}-${day}`;
        }
        return dateStr;
      };

      setFormData({
        phaseName: phase.phaseName || "",
        description: phase.description || "",
        startDate: formatToISO(phase.startDate),
        endDate: formatToISO(phase.endDate),
        isDeleted: phase.isDeleted || false,
      });
    } else {
      setEditingPhase(null);
      setFormData({
        phaseName: "",
        description: "",
        startDate: "",
        endDate: "",
        isDeleted: false,
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingPhase(null);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const payload = { ...formData };
      if (!payload.startDate || payload.startDate.trim() === "") payload.startDate = null;
      if (!payload.endDate || payload.endDate.trim() === "") payload.endDate = null;

      if (editingPhase) {
        await internshipPhaseApi.updatePhase(editingPhase.id, payload);
        toast.success("Cập nhật phase thành công!");
      } else {
        await internshipPhaseApi.createPhase(payload);
        toast.success("Thêm phase thành công!");
      }
      handleCloseDialog();
      fetchPhases();
    } catch (err) {
      console.error("Error saving phase:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (dataFormTable) => {
    const targetId = dataFormTable.phaseId || dataFormTable.id;
    try {
      setLoading(true);
      await internshipPhaseApi.deletePhase(targetId);
      toast.success("Xóa phase thành công!");
      fetchPhases();
    } catch (err) {
      console.error("Error deleting phase:", err);
    } finally {
      setLoading(false);
    }
  };

  const { user } = useContext(AuthContext);
  const isAdmin = user?.role === "ADMIN" || user?.role === "ROLE_ADMIN";

  const columns = [
    { field: "id", label: "ID" },
    { field: "phaseName", label: "Phase Name" },
    { field: "description", label: "Description" },
    { field: "startDate", label: "Start Date" },
    { field: "endDate", label: "End Date" },
    {
      field: "isDeleted",
      label: "Active",
      render: (isDeleted) => (
        <Box
          sx={{
            display: 'inline-block',
            px: 2,
            py: 0.5,
            borderRadius: '20px',
            backgroundColor: isDeleted ? "rgba(211, 47, 47, 0.1)" : "rgba(46, 125, 50, 0.1)",
            color: isDeleted ? "#d32f2f" : "#2e7d32",
            fontWeight: "bold",
            fontSize: "0.85rem"
          }}
        >
          {isDeleted ? "Đã khóa" : "Hoạt động"}
        </Box>
      ),
    },
  ];

  // ==========================================
  // PHẦN GIAO DIỆN (DÙNG STACK ĐỂ XẾP DỌC)
  // ==========================================
  return (
    <Box sx={{ p: 3 }}>
      {/* Header của trang */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: "#1a237e", mb: 0.5 }}>
            Quản lý Kỳ Thực tập
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Thiết lập và theo dõi các giai đoạn thực tập của sinh viên
          </Typography>
        </Box>
      </Box>

      {/* Bảng dữ liệu */}
      <Paper sx={{ p: 3, borderRadius: 3, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
        <DataTable
          title=""
          columns={columns}
          data={data}
          loading={loading}
          onEdit={isAdmin ? (phase) => handleOpenDialog(phase) : null}
          onDelete={isAdmin ? handleDelete : null}
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

      {/* Modal Thêm/Sửa */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3, overflow: 'visible' }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: "#333" }}>
            {editingPhase ? "Cập nhật Giai đoạn" : "Thêm Giai đoạn mới"}
          </Typography>
        </DialogTitle>
        <Divider />
        
        <DialogContent sx={{ pt: 3 }}>
          {/* SỬ DỤNG STACK ĐỂ CÁC Ô XẾP DỌC 100% CHIỀU NGANG */}
          <Stack spacing={2.5}>
            <TextField
              fullWidth
              label="Phase Name (Tên giai đoạn)"
              value={formData.phaseName}
              onChange={(e) =>
                setFormData({ ...formData, phaseName: e.target.value })
              }
            />

            <TextField
              fullWidth
              label="Description (Mô tả)"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              multiline
              rows={3}
            />

            <TextField
              fullWidth
              label="Start Date (Ngày bắt đầu)"
              type={formData.startDate ? "date" : "text"}
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              onFocus={(e) => (e.target.type = "date")}
              onBlur={(e) => {
                if (!formData.startDate) e.target.type = "text";
              }}
            />

            <TextField
              fullWidth
              label="End Date (Ngày kết thúc)"
              type={formData.endDate ? "date" : "text"}
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              onFocus={(e) => (e.target.type = "date")}
              onBlur={(e) => {
                if (!formData.endDate) e.target.type = "text";
              }}
            />

            {/* Switch Trạng thái */}
            <Box sx={{ 
              p: 2, 
              borderRadius: 2, 
              bgcolor: "#f8f9fa", 
              border: "1px solid #e0e0e0",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between"
            }}>
              <Typography variant="body2" sx={{ fontWeight: 600, color: "#555" }}>
                Trạng thái hoạt động
              </Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={!formData.isDeleted}
                    onChange={(e) =>
                      setFormData({ ...formData, isDeleted: !e.target.checked })
                    }
                    color="primary"
                  />
                }
                label={
                  <Typography variant="body2" sx={{ fontWeight: "bold", color: !formData.isDeleted ? "#2e7d32" : "#d32f2f" }}>
                    {!formData.isDeleted ? "Đang hoạt động" : "Đã khóa"}
                  </Typography>
                }
                labelPlacement="start"
                sx={{ m: 0 }}
              />
            </Box>
          </Stack>
        </DialogContent>

        <Divider />
        <DialogActions sx={{ p: 2.5, justifyContent: "flex-end" }}>
          <Button onClick={handleCloseDialog} sx={{ fontWeight: "bold", color: "#666" }}>
            Hủy bỏ
          </Button>
          <Button onClick={handleSave} variant="contained" sx={{ px: 4, borderRadius: 2, fontWeight: "bold" }}>
            {editingPhase ? "Lưu thay đổi" : "Tạo mới"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default InternshipPhasesManagement;