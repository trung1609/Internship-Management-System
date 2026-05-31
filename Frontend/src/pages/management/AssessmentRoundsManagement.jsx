import { useState, useEffect, useContext } from "react";
import { DataTable } from "../../components/DataTable";
import { assessmentRoundsApi, evaluationCriteriaApi } from "../../api/resourceApi";
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
  Autocomplete,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  Stack,
  Paper,
  Divider,
} from "@mui/material";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const AssessmentRoundsManagement = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [editingRound, setEditingRound] = useState(null);
  const [allCriteria, setAllCriteria] = useState([]);
  const [formData, setFormData] = useState({
    roundName: "",
    description: "",
    startDate: "",
    endDate: "",
    phaseId: "",
    isDeleted: false,
    roundCriteria: []
  });


  const navigate = useNavigate();

  useEffect(() => {
    fetchAllCriteria();
    fetchRounds();
  }, [page, rowsPerPage, search]);

  const fetchAllCriteria = async () => {
    const res = await evaluationCriteriaApi.getAllCriteria();
    setAllCriteria(res?.content || []);
  };

  const fetchRounds = async () => {
    try {
      setLoading(true);
      const response = await assessmentRoundsApi.getAllRounds(
        search,
        null,
        page,
        rowsPerPage,
      );
      setData(response?.content || []);
      setTotalCount(response?.totalElements || 0);
    } catch (err) {
      console.error("Error loading assessment rounds:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (round = null) => {
    if (round) {
      const formatToISO = (dateStr) => {
        if (!dateStr) return "";
        if (dateStr.includes("-")) return dateStr;
        if (dateStr.includes("/")) {
          const [day, month, year] = dateStr.split("/");
          return `${year}-${month}-${day}`;
        }
        return dateStr;
      };
      setEditingRound(round);
      setFormData({
        roundName: round.roundName || "",
        description: round.description || "",
        startDate: formatToISO(round.startDate) || "",
        endDate: formatToISO(round.endDate) || "",
        phaseId: round.phaseId || "",
        isDeleted: round.isDeleted || false,
        roundCriteria: round.roundCriteria ? round.roundCriteria.map(rc => ({
          criterionId: rc.criterionId, // Giả sử backend trả về criterionId
          criterionName: rc.criterionName,
          weight: rc.weight,
          maxScore: rc.maxScore
        })) : []
      });
    } else {
      setEditingRound(null);
      setFormData({
        roundName: "",
        description: "",
        startDate: "",
        endDate: "",
        phaseId: "",
        isDeleted: false,
        roundCriteria: []
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingRound(null);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      console.log("Payload Criteria:", formData.roundCriteria);
      const payload = {
        ...formData,
        roundCriteria: formData.roundCriteria.map(c => ({
          criterionId: c.criterionId,
          weight: parseFloat(c.weight),
          maxScore: c.maxScore
        }))
      };
      if (editingRound) {
        await assessmentRoundsApi.updateRound(editingRound.id, payload);
        toast.success("Assessment round updated successfully");
      } else {
        await assessmentRoundsApi.createRound(payload);
        toast.success("Assessment round created successfully");
      }
      handleCloseDialog();
      fetchRounds();
    } catch (err) {
      console.error("Error saving assessment round:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (dataFormTable) => {
    const targetId = dataFormTable.id;
    try {
      setLoading(true);
      await assessmentRoundsApi.deleteRound(targetId);
      toast.success("Assessment round deleted successfully");
      fetchRounds();
    } catch (err) {
      console.error("Error deleting assessment round:", err);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { field: "id", label: "ID" },
    { field: "roundName", label: "Round Name" },
    { field: "description", label: "Description" },
    { field: "startDate", label: "Start Date" },
    { field: "endDate", label: "End Date" },
    { field: "phaseName", label: "Phase Name" },
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

  const { user } = useContext(AuthContext); // Lấy user từ Context
  const isAdmin = user?.role === "ADMIN" || user?.role === "ROLE_ADMIN";

  return (
    <Box sx={{ p: 3 }}>
      {/* Header trang */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: "#1a237e", mb: 0.5 }}>
            Quản lý Vòng Đánh giá
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Thiết lập các vòng đánh giá và phân bổ tiêu chí
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
          onEdit={isAdmin ? (round) => handleOpenDialog(round) : null}
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
          onDetail={(round) => navigate(`/admin/assessment-rounds/${round.id}`)}
        />
      </Paper>

      {/* Modal Thêm/Sửa */}
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
            {editingRound ? "Cập nhật Vòng đánh giá" : "Tạo Vòng đánh giá mới"}
          </Typography>
        </DialogTitle>
        <Divider />

        <DialogContent sx={{ pt: 3 }}>
          <Stack spacing={3}>
            <TextField
              fullWidth
              label="Tên vòng đánh giá"
              value={formData.roundName}
              onChange={(e) =>
                setFormData({ ...formData, roundName: e.target.value })
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
              label="Ngày bắt đầu"
              type={formData.startDate ? "date" : "text"}
              value={formData.startDate}
              onChange={(e) =>
                setFormData({ ...formData, startDate: e.target.value })
              }
              onFocus={(e) => (e.target.type = "date")}
              onBlur={(e) => {
                if (!formData.startDate) e.target.type = "text";
              }}
            />

            <TextField
              fullWidth
              label="Ngày kết thúc"
              type={formData.endDate ? "date" : "text"}
              value={formData.endDate}
              onChange={(e) =>
                setFormData({ ...formData, endDate: e.target.value })
              }
              onFocus={(e) => (e.target.type = "date")}
              onBlur={(e) => {
                if (!formData.endDate) e.target.type = "text";
              }}
            />

            <TextField
              fullWidth
              label="Mã giai đoạn"
              value={formData.phaseId}
              onChange={(e) =>
                setFormData({ ...formData, phaseId: e.target.value })
              }
            />

            {/* Phần chọn Tiêu chí */}
            <Box sx={{ bgcolor: "#f8f9fa", p: 2, borderRadius: 2, border: "1px solid #e0e0e0" }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "#555", mb: 1 }}>
                Chọn Tiêu chí đánh giá
              </Typography>
              <Autocomplete
                multiple
                options={allCriteria}
                getOptionLabel={(o) => o.criterionName}
                isOptionEqualToValue={(option, value) => option.criterionId === value.criterionId}
                value={formData.roundCriteria}
                onChange={(event, newValue) => {
                  const updated = newValue.map((item) => {
                    const currentId = item.id || item.criterionId;
                    const existing = formData.roundCriteria.find((old) => (old.id || old.criterionId) === currentId);

                    return {
                      criterionId: currentId,
                      criterionName: item.criterionName,
                      maxScore: item.maxScore,
                      weight: existing ? existing.weight : 0
                    };
                  });
                  setFormData({ ...formData, roundCriteria: updated });
                }}
                renderInput={(params) => <TextField {...params} placeholder="Tìm kiếm tiêu chí..." sx={{ bgcolor: 'white' }} />}
              />

              {formData.roundCriteria.length > 0 && (
                <Table size="small" sx={{ mt: 2, bgcolor: 'white', borderRadius: 1 }}>
                  <TableHead sx={{ bgcolor: "#e3f2fd" }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold' }}>Tiêu chí</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', width: '30%' }}>Trọng số</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {formData.roundCriteria.map((item, index) => (
                      <TableRow key={item.criterionId}>
                        <TableCell>{item.criterionName}</TableCell>
                        <TableCell>
                          <TextField
                            type="number"
                            size="small"
                            fullWidth
                            value={item.weight ?? ""}
                            onChange={(e) => {
                              const val = e.target.value;
                              setFormData(prev => {
                                const nextCriteria = [...prev.roundCriteria];
                                nextCriteria[index] = {
                                  ...nextCriteria[index],
                                  weight: val
                                };
                                return {
                                  ...prev,
                                  roundCriteria: nextCriteria
                                };
                              });
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </Box>

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
                    onChange={(e) => setFormData({ ...formData, isDeleted: !e.target.checked })}
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
            {editingRound ? "Lưu thay đổi" : "Tạo mới"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AssessmentRoundsManagement;