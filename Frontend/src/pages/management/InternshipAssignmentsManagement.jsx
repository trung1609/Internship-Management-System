import { useState, useEffect } from "react";
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
} from "@mui/material";

const InternshipAssignmentsManagement = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [formData, setFormData] = useState({
    assignmentTitle: "",
    description: "",
    studentId: "",
    mentorId: "",
    phaseId: "",
    status: "ACTIVE",
  });

  useEffect(() => {
    fetchAssignments();
  }, [page, rowsPerPage, search]);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await internshipAssignmentApi.getAllAssignments(
        search,
        page,
        rowsPerPage,
      );
      setData(response?.data?.content || []);
      setTotalCount(response?.data?.totalElements || 0);
    } catch (err) {
      setError("Error loading data: " + (err.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (assignment = null) => {
    if (assignment) {
      setEditingAssignment(assignment);
      setFormData({
        assignmentTitle: assignment.assignmentTitle || "",
        description: assignment.description || "",
        studentId: assignment.studentId || "",
        mentorId: assignment.mentorId || "",
        phaseId: assignment.phaseId || "",
        status: assignment.status || "ACTIVE",
      });
    } else {
      setEditingAssignment(null);
      setFormData({
        assignmentTitle: "",
        description: "",
        studentId: "",
        mentorId: "",
        phaseId: "",
        status: "ACTIVE",
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
      } else {
        await internshipAssignmentApi.createAssignment(formData);
      }
      handleCloseDialog();
      fetchAssignments();
    } catch (err) {
      setError("Error saving data: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { field: "id", label: "ID" },
    { field: "assignmentTitle", label: "Assignment Title" },
    { field: "description", label: "Description" },
    { field: "studentId", label: "Student ID" },
    { field: "mentorId", label: "Mentor ID" },
    { field: "status", label: "Status" },
  ];

  return (
    <Box>
      <DataTable
        title="Internship Assignments Management"
        columns={columns}
        data={data}
        loading={loading}
        error={error}
        onEdit={(assignment) => handleOpenDialog(assignment)}
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
      />

      {/* Add/Edit Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingAssignment ? "Update Assignment" : "Add New Assignment"}
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField
            fullWidth
            label="Tiêu đề phân công"
            value={formData.assignmentTitle}
            onChange={(e) =>
              setFormData({ ...formData, assignmentTitle: e.target.value })
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
            label="Mã sinh viên"
            value={formData.studentId}
            onChange={(e) =>
              setFormData({ ...formData, studentId: e.target.value })
            }
            margin="normal"
          />
          <TextField
            fullWidth
            label="Mã cố vấn"
            value={formData.mentorId}
            onChange={(e) =>
              setFormData({ ...formData, mentorId: e.target.value })
            }
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
          <FormControl fullWidth margin="normal">
            <InputLabel>Trạng thái</InputLabel>
            <Select
              value={formData.status}
              label="Trạng thái"
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
            >
              <MenuItem value="ACTIVE">Hoạt động</MenuItem>
              <MenuItem value="COMPLETED">Hoàn thành</MenuItem>
              <MenuItem value="CANCELLED">Hủy</MenuItem>
            </Select>
          </FormControl>
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

export default InternshipAssignmentsManagement;
