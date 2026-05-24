import { useState, useEffect } from "react";
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
} from "@mui/material";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

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
        <span style={{
          color: isDeleted ? "red" : "green",
          fontWeight: "bold"
        }}>
          {isDeleted ? "Đã khóa" : "Hoạt động"}
        </span>
      ),
    },
  ];

  return (
    <Box>
      <DataTable
        title="Assessment Rounds Management"
        columns={columns}
        data={data}
        loading={loading}
        onEdit={(round) => handleOpenDialog(round)}
        onDelete={handleDelete}
        onAdd={() => handleOpenDialog()}
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

      {/* Add/Edit Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingRound
            ? "Update Assessment Round"
            : "Add New Assessment Round"}
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField
            fullWidth
            label="Tên vòng đánh giá"
            value={formData.roundName}
            onChange={(e) =>
              setFormData({ ...formData, roundName: e.target.value })
            }
            margin="normal"
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
            margin="normal"
          />
          <TextField
            fullWidth
            label="Ngày bắt đầu"
            type="date"
            value={formData.startDate}
            onChange={(e) =>
              setFormData({ ...formData, startDate: e.target.value })
            }
            InputLabelProps={{ shrink: true }}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Ngày kết thúc"
            type="date"
            value={formData.endDate}
            onChange={(e) =>
              setFormData({ ...formData, endDate: e.target.value })
            }
            InputLabelProps={{ shrink: true }}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Mã giai đoạn"
            value={formData.phaseId}
            onChange={(e) =>
              setFormData({ ...formData, phaseId: e.target.value })
            }
            margin="normal"
          />
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
            renderInput={(params) => <TextField {...params} label="Chọn tiêu chí" margin="normal" />}
          />
          {formData.roundCriteria.length > 0 && (
            <Table size="small" sx={{ mt: 2 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Tiêu chí</TableCell>
                  <TableCell>Trọng số</TableCell>
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
          <FormControlLabel
            control={
              <Switch
                checked={!formData.isDeleted}
                onChange={(e) => setFormData({ ...formData, isDeleted: !e.target.checked })}
                color="primary"
              />
            }
            label={formData.isDeleted ? "Trạng thái: Đã khóa" : "Trạng thái: Hoạt động"}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Hủy</Button>
          <Button onClick={handleSave} variant="contained">
            Lưu
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AssessmentRoundsManagement;
