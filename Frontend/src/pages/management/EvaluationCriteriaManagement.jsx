import { useState, useEffect, useContext } from "react";
import { DataTable } from "../../components/DataTable";
import { evaluationCriteriaApi } from "../../api/resourceApi";
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
  Divider,
} from "@mui/material";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-toastify";

const EvaluationCriteriaManagement = () => {
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
  const [editingCriteria, setEditingCriteria] = useState(null);
  const [formData, setFormData] = useState({
    criterionName: "",
    description: "",
    maxScore: "",
    isDeleted: false,
  });

  const { user } = useContext(AuthContext);
  const isAdmin = user?.role === "ADMIN" || user?.role === "ROLE_ADMIN";

  useEffect(() => {
    fetchCriteria();
  }, [page, rowsPerPage, search]);

  const fetchCriteria = async () => {
    try {
      setLoading(true);
      const response = await evaluationCriteriaApi.getAllCriteria(
        search,
        page,
        rowsPerPage,
      );
      setData(response?.content || []);
      setTotalCount(response?.totalElements || 0);
    } catch (err) {
      console.error("Error loading criteria:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (criteria = null) => {
    if (criteria) {
      setEditingCriteria(criteria);
      setFormData({
        criterionName: criteria.criterionName || "",
        description: criteria.description || "",
        maxScore: criteria.maxScore || "",
        isDeleted: criteria.isDeleted || false,
      });
    } else {
      setEditingCriteria(null);
      setFormData({
        criterionName: "",
        description: "",
        maxScore: "",
        isDeleted: false,
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingCriteria(null);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      if (editingCriteria) {
        await evaluationCriteriaApi.updateCriteria(
          editingCriteria.id,
          formData,
        );
        toast.success("Cập nhật tiêu chí thành công!");
      } else {
        await evaluationCriteriaApi.createCriteria(formData);
        toast.success("Thêm tiêu chí thành công!");
      }
      handleCloseDialog();
      fetchCriteria();
    } catch (err) {
      console.error("Error saving criteria:", err);
      toast.error("Có lỗi xảy ra khi lưu tiêu chí!");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (dataFormTable) => {
    const targetId = dataFormTable.id;
    try {
      setLoading(true);
      await evaluationCriteriaApi.deleteCriteria(targetId);
      toast.success("Xóa tiêu chí thành công!");
      fetchCriteria();
    } catch (err) {
      console.error("Error deleting criteria:", err);
      toast.error("Có lỗi xảy ra khi xóa tiêu chí!");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { field: "id", label: "ID" },
    { field: "criterionName", label: "Criteria Name" },
    { field: "description", label: "Description" },
    { field: "maxScore", label: "Max Score" },
    {
      field: "isDeleted",
      label: "Active",
      render: (isDeleted) => (
        <Box
          sx={{
            display: "inline-block",
            px: 2,
            py: 0.5,
            borderRadius: "20px",
            backgroundColor: isDeleted
              ? "rgba(211, 47, 47, 0.1)"
              : "rgba(46, 125, 50, 0.1)",
            color: isDeleted ? "#d32f2f" : "#2e7d32",
            fontWeight: "bold",
            fontSize: "0.85rem",
          }}
        >
          {isDeleted ? "Đã khóa" : "Hoạt động"}
        </Box>
      ),
    },
  ];

  // ==========================================
  // PHẦN GIAO DIỆN (SỬ DỤNG STACK)
  // ==========================================
  return (
    <Box sx={{ p: 3 }}>
      {/* Header trang */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: "#1a237e", mb: 0.5 }}>
            Quản lý Tiêu chí Đánh giá
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Thiết lập bộ khung tiêu chí và thang điểm cho đồ án
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
          onEdit={isAdmin ? (criteria) => handleOpenDialog(criteria) : null}
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
          sx: { borderRadius: 3, overflow: "visible" },
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h5" sx={{ fontWeight: "bold", color: "#333" }}>
            {editingCriteria ? "Cập nhật Tiêu chí" : "Tạo Tiêu chí mới"}
          </Typography>
        </DialogTitle>
        <Divider />

        <DialogContent sx={{ pt: 3 }}>
          {/* Sử dụng Stack để form trải dài 100% */}
          <Stack spacing={2.5}>
            <TextField
              fullWidth
              label="Tên tiêu chí"
              value={formData.criterionName}
              onChange={(e) =>
                setFormData({ ...formData, criterionName: e.target.value })
              }
            />

            <TextField
              fullWidth
              label="Mô tả"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              multiline
              rows={3}
            />

            <TextField
              fullWidth
              label="Điểm tối đa"
              type="number"
              value={formData.maxScore}
              onChange={(e) =>
                setFormData({ ...formData, maxScore: e.target.value })
              }
            />

            {/* Switch Trạng thái */}
            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                bgcolor: "#f8f9fa",
                border: "1px solid #e0e0e0",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
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
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: "bold",
                      color: !formData.isDeleted ? "#2e7d32" : "#d32f2f",
                    }}
                  >
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
          <Button
            onClick={handleSave}
            variant="contained"
            sx={{ px: 4, borderRadius: 2, fontWeight: "bold" }}
          >
            {editingCriteria ? "Lưu thay đổi" : "Tạo mới"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EvaluationCriteriaManagement;