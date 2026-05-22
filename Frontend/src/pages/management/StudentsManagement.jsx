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
  const [search, setSearch] = useState("");
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
      console.log("Students data content:", response?.content);
      console.log("Total count:", response?.totalElements);
      setData(response?.content || []);
      setTotalCount(response?.totalElements || 0);
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
        studentCode: student.studentCode || "",
        major: student.major || "",
        classRoom: student.classRoom || "",
        address: student.address || "",
        dateOfBirth: student.dateOfBirth || "",
      });
    } else {
      setEditingStudent(null);
      setFormData({
        userId: "",
        studentCode: "",
        major: "",
        classRoom: "",
        dateOfBirth: "",
        address: "",
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
        await studentApi.updateStudent(editingStudent.studentId, formData);
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
    { field: "studentId", label: "ID" },
    { field: "studentCode", label: "Student Code" },
    { field: "email", label: "Email" },
    { field: "fullName", label: "Full Name" },
    { field: "phoneNumber", label: "Phone Number" },
    { field: "major", label: "Major" },
    { field: "classRoom", label: "Classroom" },
    { field: "dateOfBirth", label: "Date of Birth" },
    { field: "address", label: "Address" },
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
          {!editingStudent && (
            <TextField
              fullWidth
              label="User ID"
              value={formData.userId}
              onChange={(e) =>
                setFormData({ ...formData, userId: e.target.value })
              }
              disabled={editingStudent !== null}
              margin="normal"
            />
          )}
          <TextField
            fullWidth
            label="Student Code"
            value={formData.studentCode}
            onChange={(e) =>
              setFormData({ ...formData, studentCode: e.target.value })
            }
            disabled={editingStudent !== null}
            margin="normal"
          />
          {editingStudent && (
            <TextField
              fullWidth
              label="Email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              margin="normal"
            />
          )}
          {editingStudent && (
            <TextField
              fullWidth
              label="Full Name"
              value={formData.fullName}
              onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })
              }
              margin="normal"
            />
          )}
          {editingStudent && (
            <TextField
              fullWidth
              label="Phone Number"
              value={formData.phoneNumber}
              onChange={(e) =>
                setFormData({ ...formData, phoneNumber: e.target.value })
              }
              margin="normal"
            />
          )}
          <TextField
            fullWidth
            label="Major"
            value={formData.major}
            onChange={(e) =>
              setFormData({ ...formData, major: e.target.value })
            }
            margin="normal"
          />
          <TextField
            fullWidth
            label="Classroom"
            value={formData.classRoom}
            onChange={(e) =>
              setFormData({ ...formData, classRoom: e.target.value })
            }
            margin="normal"
          />
          <TextField
            fullWidth
            label="Address"
            value={formData.address}
            onChange={(e) =>
              setFormData({ ...formData, address: e.target.value })
            }
            margin="normal"
          />
          <TextField
            fullWidth
            label="Date of Birth"
            type="date"
            value={formData.dateOfBirth}
            onChange={(e) =>
              setFormData({ ...formData, dateOfBirth: e.target.value })
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
