import { useState, useEffect } from "react";
import { DataTable } from "../../components/DataTable";
import { studentApi } from "../../api/resourceApi";
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";

const StudentsManagement = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [formData, setFormData] = useState({
    email: "",
    fullName: "",
    phoneNumber: "",
    studentId: "",
  });

  useEffect(() => {
    fetchStudents();
  }, [page, rowsPerPage, search]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await studentApi.getAllStudents(
        page,
        rowsPerPage,
        search,
      );
      console.log("Students API Response:", response);
      console.log("Students data content:", response?.data?.content);
      console.log("Total count:", response?.data?.totalElements);
      setData(response?.data?.content || []);
      setTotalCount(response?.data?.totalElements || 0);
    } catch (err) {
      console.error("Error fetching students:", err);
      console.error("Error status:", err?.response?.status);
      console.error("Error data:", err?.response?.data);
      setError("Error loading data: " + (err.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (student = null) => {
    if (student) {
      setEditingStudent(student);
      setFormData({
        email: student.email || "",
        fullName: student.fullName || "",
        phoneNumber: student.phoneNumber || "",
        studentId: student.studentId || "",
      });
    } else {
      setEditingStudent(null);
      setFormData({
        email: "",
        fullName: "",
        phoneNumber: "",
        studentId: "",
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingStudent(null);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      if (editingStudent) {
        await studentApi.updateStudent(editingStudent.id, formData);
      } else {
        await studentApi.createStudent(formData);
      }
      handleCloseDialog();
      fetchStudents();
    } catch (err) {
      setError("Error saving data: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { field: "id", label: "ID" },
    { field: "studentId", label: "Student ID" },
    { field: "email", label: "Email" },
    { field: "fullName", label: "Full Name" },
    { field: "phoneNumber", label: "Phone Number" },
  ];

  return (
    <Box>
      <DataTable
        title="Student Management"
        columns={columns}
        data={data}
        loading={loading}
        error={error}
        onEdit={(student) => handleOpenDialog(student)}
        onAdd={() => handleOpenDialog()}
        totalCount={totalCount}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={(newPage) => setPage(newPage)}
        onRowsPerPageChange={(newRowsPerPage) => {
          setRowsPerPage(newRowsPerPage);
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
          {editingStudent ? "Update Student" : "Add New Student"}
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField
            fullWidth
            label="Student ID"
            value={formData.studentId}
            onChange={(e) =>
              setFormData({ ...formData, studentId: e.target.value })
            }
            disabled={editingStudent !== null}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            margin="normal"
          />
          <TextField
            fullWidth
            label="Full Name"
            value={formData.fullName}
            onChange={(e) =>
              setFormData({ ...formData, fullName: e.target.value })
            }
            margin="normal"
          />
          <TextField
            fullWidth
            label="Phone Number"
            value={formData.phoneNumber}
            onChange={(e) =>
              setFormData({ ...formData, phoneNumber: e.target.value })
            }
            margin="normal"
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

export default StudentsManagement;
