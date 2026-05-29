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
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import { toast } from "react-toastify";

const StudentsManagement = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
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
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (student = null) => {
    if (student) {
      setEditingStudent(student);

      let formattedDate = "";
      if (student.dateOfBirth) {
        if (student.dateOfBirth.includes("-")) {
          formattedDate = student.dateOfBirth;
        }
        else if (student.dateOfBirth.includes("/")) {
          const [day, month, year] = student.dateOfBirth.split("/");
          formattedDate = `${year}-${month}-${day}`;
        }
      }

      setFormData({
        studentCode: student.studentCode || "",
        email: student.email || "",
        fullName: student.fullName || "",
        phoneNumber: student.phoneNumber || "",
        major: student.major || "",
        classRoom: student.classRoom || "",
        address: student.address || "",
        dateOfBirth: formattedDate,
      });
    } else {
      setEditingStudent(null);
      setFormData({
        studentCode: "",
        email: "",
        fullName: "",
        phoneNumber: "",
        major: "",
        classRoom: "",
        address: "",
        dateOfBirth: "",
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
      const payload = { ...formData };
      if (!payload.dateOfBirth || payload.dateOfBirth.trim() === "") {
        payload.dateOfBirth = null;
      }

      if (editingStudent) {
        await studentApi.updateStudent(editingStudent.studentId, payload);
        toast.success("Cập nhật sinh viên thành công!");
      } else {
        await studentApi.createStudent(payload);
        toast.success("Thêm mới sinh viên thành công!");
      }
      handleCloseDialog();
      fetchStudents(); // Cập nhật lại danh sách
    } catch (err) {
      console.error("Error saving student:", err);
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
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: "#1a237e" }}>Quản lý Sinh viên</Typography>
          <Typography variant="body2" color="text.secondary">Danh sách và thông tin chi tiết sinh viên</Typography>
        </Box>
        <Button variant="contained" size="large" onClick={() => handleOpenDialog()} sx={{ borderRadius: 2, px: 3 }}>
          Thêm sinh viên
        </Button>
      </Box>

      <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 2 }}>
        <DataTable
          columns={columns}
          data={data}
          loading={loading}
          onEdit={(student) => handleOpenDialog(student)}
          totalCount={totalCount}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={(newPage) => setPage(newPage)}
          onRowsPerPageChange={(newRowsPerPage) => { setRowsPerPage(newRowsPerPage); setPage(0); }}
        />
      </Paper>

      {/* Dialog Tối ưu hóa */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 'bold' }}>{editingStudent ? "Cập nhật thông tin sinh viên" : "Thêm mới sinh viên"}</DialogTitle>
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

            InputLabelProps={{

              shrink: true,

            }}

            margin="normal"

          />

        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleCloseDialog} color="inherit">Hủy</Button>
          <Button onClick={handleSave} variant="contained" sx={{ px: 4, borderRadius: 2 }}>Lưu</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StudentsManagement;
