import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  IconButton,
  Stack,
  CircularProgress,
  Button,
  Chip,
  Divider,
  TextField,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import PersonIcon from "@mui/icons-material/Person";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import BadgeIcon from "@mui/icons-material/Badge";
import SearchIcon from "@mui/icons-material/Search";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import FolderZipIcon from "@mui/icons-material/FolderZip";
import { reportApi } from "../../api/resourceApi";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";

const ReportManagement = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [exporting, setExporting] = useState(false);
  const [exportingZip, setExportingZip] = useState(false);

  const handleExportExcel = async () => {
    try {
      setExporting(true);
      toast.info("Đang khởi tạo dữ liệu Excel...");

      // Gọi API (Truyền searchTerm và size lớn để lấy nhiều dữ liệu)
      const response = await reportApi.exportExcel(searchTerm, 0, 100);

      // Xử lý tạo link tải file tự động
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `Bao_Cao_Thuc_Tap_${new Date().getTime()}.xlsx`,
      );
      document.body.appendChild(link);
      link.click();

      // Dọn dẹp
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success("Xuất file thành công!");
    } catch (error) {
      console.error("Lỗi xuất Excel:", error);
      toast.error("Không thể xuất file. Vui lòng thử lại!");
    } finally {
      setExporting(false);
    }
  };

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const res = await reportApi.getAllReports();
        setReports(res?.content || []);
      } catch (err) {
        console.error("Lỗi khi tải báo cáo:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const handleDownload = async (report) => {
    const toastId = toast.loading("Đang xử lý tải file, vui lòng đợi...");

    try {
      if (!report.fileUrl) {
        toast.update(toastId, { render: "Không tìm thấy đường dẫn file!", type: "error", isLoading: false, autoClose: 3000 });
        return;
      }

      const response = await fetch(report.fileUrl, {
        method: "GET",
        mode: "cors"
      });

      if (!response.ok) throw new Error("Lỗi mạng");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const fileExtension = report.fileUrl.split('.').pop();
      const fallbackName = `Bao_cao_so_${report.reportId}.${fileExtension}`;

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", report.originalFileName || fallbackName);

      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.update(toastId, { render: "Tải xuống thành công!", type: "success", isLoading: false, autoClose: 3000 });

    } catch (error) {
      console.error("Lỗi khi tải file:", error);
      toast.update(toastId, { render: "Tải xuống thất bại. Vui lòng thử lại!", type: "error", isLoading: false, autoClose: 3000 });
    }
  };

  const handleExportZip = async () => {
    try {
      setExportingZip(true);
      toast.info("Đang nén toàn bộ file, vui lòng đợi...");

      const response = await reportApi.exportZip(searchTerm, 0, 100);

      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `Tat_Ca_Bao_Cao_${new Date().getTime()}.zip`,
      );
      document.body.appendChild(link);
      link.click();

      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success("Tải toàn bộ báo cáo thành công!");
    } catch (error) {
      console.error("Lỗi xuất ZIP:", error);
      toast.error("Không thể nén file. Vui lòng thử lại!");
    } finally {
      setExportingZip(false);
    }
  };

  // Lọc danh sách theo từ khóa tìm kiếm (Lọc ở Frontend cho nhanh nếu dữ liệu ít)
  const filteredReports = reports.filter(
    (report) =>
      report.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.studentCode?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <Box
      sx={{
        p: { xs: 2, md: 4 },
        minHeight: "100vh",
        backgroundColor: "#f4f6f8",
      }}
    >
      {/* --- HEADER CHÍNH --- */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          sx={{ fontWeight: 800, color: "#1a237e", letterSpacing: "-0.5px" }}
        >
          Quản lý Báo cáo Sinh viên
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
          Danh sách các tài liệu, báo cáo tiến độ do sinh viên tải lên hệ thống
        </Typography>
      </Box>

      {/* --- THANH TÌM KIẾM --- */}
      <Paper
        sx={{
          p: 2,
          mb: 4,
          borderRadius: 4,
          display: "flex",
          alignItems: "center",
          boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
        }}
      >
        <SearchIcon sx={{ color: "#9e9e9e", mr: 1, ml: 1 }} />
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Tìm kiếm theo tiêu đề, tên hoặc mã sinh viên..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          size="small"
          sx={{
            "& fieldset": { border: "none" },
            bgcolor: "#f8f9fa",
            borderRadius: 2,
          }}
        />
      </Paper>

      <Box sx={{ mb: 4, display: "flex", justifyContent: "flex-end", gap: 2 }}>
        {/* Nút xuất Excel (Cũ) */}
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="outlined" // Đổi Excel thành viền cho bớt chói
            disabled={exporting}
            onClick={handleExportExcel}
            startIcon={
              exporting ? <CircularProgress size={20} /> : <FileDownloadIcon />
            }
            sx={{ borderRadius: "12px", px: 3, py: 1.2, fontWeight: 700 }}
          >
            Xuất Data (Excel)
          </Button>
        </motion.div>

        {/* Nút tải ZIP (Mới - Nổi bật) */}
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="contained"
            disabled={exportingZip}
            onClick={handleExportZip}
            startIcon={
              exportingZip ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <FolderZipIcon />
              )
            }
            sx={{
              borderRadius: "12px",
              px: 3,
              py: 1.2,
              fontWeight: 800,
              background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)", // Màu xanh lam chuyên nghiệp
              boxShadow: "0 8px 25px rgba(30, 60, 114, 0.3)",
              textTransform: "none",
              "&:hover": {
                background: "linear-gradient(135deg, #152b52 0%, #1c3869 100%)",
              },
            }}
          >
            {exportingZip ? "Đang nén file..." : "Tải toàn bộ File (ZIP)"}
          </Button>
        </motion.div>
      </Box>

      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "40vh",
          }}
        >
          <CircularProgress sx={{ color: "#1565c0" }} />
        </Box>
      ) : (
        /* --- DANH SÁCH THẺ BÁO CÁO 3D --- */
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr", // Màn hình nhỏ: 1 cột
              md: "repeat(2, 1fr)", // Màn hình vừa: 2 cột
              lg: "repeat(3, 1fr)", // Màn hình lớn: 3 cột
            },
            gap: 3,
          }}
        >
          <AnimatePresence>
            {filteredReports.length > 0 ? (
              filteredReports.map((report, index) => (
                <motion.div
                  key={report.reportId}
                  initial={{ opacity: 0, y: 50, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  style={{ flex: "1 1 350px", maxWidth: "420px" }}
                >
                  <Paper
                    sx={{
                      p: 3,
                      borderRadius: 4,
                      position: "relative",
                      overflow: "hidden",
                      background: "linear-gradient(145deg, #ffffff, #fcfcfc)",
                      boxShadow: "8px 8px 16px #e6e6e6, -8px -8px 16px #ffffff",
                      border: "1px solid rgba(0,0,0,0.04)",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    {/* Hình tròn mờ trang trí góc phải */}
                    <Box
                      sx={{
                        position: "absolute",
                        top: -30,
                        right: -30,
                        width: 100,
                        height: 100,
                        borderRadius: "50%",
                        background: "rgba(21, 101, 192, 0.05)",
                        zIndex: 0,
                      }}
                    />

                    {/* Header Thẻ: Icon và Tiêu đề */}
                    <Stack
                      direction="row"
                      alignItems="flex-start"
                      sx={{ position: "relative", zIndex: 1, mb: 3 }}
                    >
                      <Box
                        sx={{
                          p: 1.5,
                          borderRadius: 3,
                          bgcolor: "#e3f2fd",
                          color: "#1565c0",
                          mr: 2,
                        }}
                      >
                        <AssignmentTurnedInIcon />
                      </Box>
                      <Box>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 800,
                            color: "#1a237e",
                            lineHeight: 1.2,
                            mb: 0.5,
                            wordBreak: "break-word", 
                            display: "-webkit-box",
                            WebkitLineClamp: 2, 
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {report.title}
                        </Typography>
                        <Chip
                          label={`ID: ${report.reportId}`}
                          size="small"
                          sx={{
                            fontWeight: "bold",
                            fontSize: "0.7rem",
                            height: 20,
                            bgcolor: "#f5f5f5",
                            color: "#757575",
                          }}
                        />
                      </Box>
                    </Stack>

                    {/* Body Thẻ: Khối xám chứa thông tin sinh viên */}
                    <Stack
                      spacing={1.5}
                      sx={{
                        mb: 3,
                        position: "relative",
                        zIndex: 1,
                        bgcolor: "#f8f9fa",
                        p: 2,
                        borderRadius: 3,
                        flexGrow: 1,
                      }}
                    >
                      <Stack direction="row" alignItems="center" gap={1.5}>
                        <BadgeIcon sx={{ color: "#757575", fontSize: 18 }} />
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          Mã SV:{" "}
                          <span style={{ fontWeight: 700, color: "#1565c0" }}>
                            {report.studentCode}
                          </span>
                        </Typography>
                      </Stack>
                      <Stack direction="row" alignItems="center" gap={1.5}>
                        <PersonIcon sx={{ color: "#757575", fontSize: 18 }} />
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          Họ tên:{" "}
                          <span style={{ fontWeight: 500, color: "#333" }}>
                            {report.studentName}
                          </span>
                        </Typography>
                      </Stack>
                      <Stack direction="row" alignItems="center" gap={1.5}>
                        <CalendarMonthIcon
                          sx={{ color: "#757575", fontSize: 18 }}
                        />
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          Ngày nộp:{" "}
                          <span style={{ fontWeight: 500, color: "#f57c00" }}>
                            {report.uploadTime}
                          </span>
                        </Typography>
                      </Stack>
                    </Stack>

                    <Divider
                      sx={{
                        mb: 2,
                        position: "relative",
                        zIndex: 1,
                        borderStyle: "dashed",
                      }}
                    />

                    {/* Footer Thẻ: Nút Tải Xuống */}
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        position: "relative",
                        zIndex: 1,
                      }}
                    >
                      <Button
                        startIcon={<DownloadIcon />}
                        size="medium"
                        variant="contained"
                        onClick={() => handleDownload(report)}
                        sx={{
                          borderRadius: 2,
                          fontWeight: 700,
                          boxShadow: "0 4px 10px rgba(21, 101, 192, 0.2)",
                          bgcolor: "#1565c0",
                          "&:hover": { bgcolor: "#0d47a1" },
                        }}
                      >
                        TẢI XUỐNG
                      </Button>
                    </Box>
                  </Paper>
                </motion.div>
              ))
            ) : (
              <Box
                sx={{
                  gridColumn: "1 / -1",
                  width: "100%",
                  textAlign: "center",
                  py: 8,
                }}
              >
                <AssignmentTurnedInIcon
                  sx={{ fontSize: 64, color: "#cbd5e1", mb: 2 }}
                />
                <Typography variant="h6" color="text.secondary">
                  Hiện chưa có báo cáo nào được tải lên. Hãy khuyến khích sinh
                  viên nộp báo cáo để quản lý dễ dàng hơn!
                </Typography>
              </Box>
            )}
          </AnimatePresence>
        </Box>
      )}
    </Box>
  );
};

export default ReportManagement;
