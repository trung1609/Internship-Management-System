import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Box,
  Button,
  TextField,
  CircularProgress,
  Alert,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import { useState, useEffect } from "react";

export const DataTable = ({
  columns,
  data = [],
  loading = false,
  error = null,
  onEdit = null,
  onDelete = null,
  onAdd = null,
  totalCount = 0,
  page = 0,
  rowsPerPage = 10,
  onPageChange = null,
  onRowsPerPageChange = null,
  searchValue = "",
  onSearchChange = null,
  title = "Data",
}) => {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const handleDeleteClick = (id) => {
    setSelectedId(id);
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    if (onDelete && selectedId) {
      onDelete(selectedId);
    }
    setOpenDeleteDialog(false);
    setSelectedId(null);
  };

  const handleChangePage = (event, newPage) => {
    onPageChange?.(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    onRowsPerPageChange?.(parseInt(event.target.value, 10));
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <h2>{title}</h2>
        {onAdd && (
          <Button variant="contained" startIcon={<AddIcon />} onClick={onAdd}>
            Thêm mới
          </Button>
        )}
      </Box>

      {onSearchChange && (
        <Box sx={{ mb: 2 }}>
          <TextField
            placeholder="Tìm kiếm..."
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            size="small"
            sx={{ width: "300px" }}
          />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper}>
        {loading ? (
          <Box sx={{ p: 3, textAlign: "center" }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Table>
              <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell key={column.field} sx={{ fontWeight: "bold" }}>
                      {column.label}
                    </TableCell>
                  ))}
                  {(onEdit || onDelete) && (
                    <TableCell sx={{ fontWeight: "bold" }}>Hành động</TableCell>
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {data.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length + (onEdit || onDelete ? 1 : 0)}
                      sx={{ textAlign: "center", py: 3 }}
                    >
                      Không có dữ liệu
                    </TableCell>
                  </TableRow>
                ) : (
                  data.map((row) => (
                    <TableRow key={row.id} hover>
                      {columns.map((column) => (
                        <TableCell key={`${row.id}-${column.field}`}>
                          {column.render
                            ? column.render(row[column.field], row)
                            : row[column.field]}
                        </TableCell>
                      ))}
                      {(onEdit || onDelete) && (
                        <TableCell>
                          <Box sx={{ display: "flex", gap: 1 }}>
                            {onEdit && (
                              <IconButton
                                size="small"
                                color="primary"
                                onClick={() => onEdit(row)}
                              >
                                <EditIcon />
                              </IconButton>
                            )}
                            {onDelete && (
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleDeleteClick(row.id)}
                              >
                                <DeleteIcon />
                              </IconButton>
                            )}
                          </Box>
                        </TableCell>
                      )}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
            {onPageChange && (
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={totalCount}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            )}
          </>
        )}
      </TableContainer>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>
          <p>Bạn có chắc chắn muốn xóa mục này?</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Hủy</Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
          >
            Xóa
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
