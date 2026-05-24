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
      } else {
        await internshipAssignmentApi.createAssignment(formData);
      }
      handleCloseDialog();
      fetchAssignments();
    } catch (err) {
      console.error("Error saving assignment:", err);
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
    { field: "status", label: "Status" },
  ];

  return (
    <Box>
      <DataTable
        title="Internship Assignments Management"
        columns={columns}
        data={data}
        loading={loading}
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
            value={formData.assignmentDescription}
            onChange={(e) =>
              setFormData({ ...formData, assignmentDescription: e.target.value })
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
              <MenuItem value="PENDING">Đang chờ</MenuItem>
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
