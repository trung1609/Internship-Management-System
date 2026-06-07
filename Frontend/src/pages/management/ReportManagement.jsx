import React, { useEffect, useState } from 'react';
import {
    Box, Typography, Paper, IconButton, Stack, CircularProgress,
    Button, Chip, Divider, TextField
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import PersonIcon from '@mui/icons-material/Person';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import BadgeIcon from '@mui/icons-material/Badge';
import SearchIcon from '@mui/icons-material/Search';
import { reportApi } from '../../api/resourceApi';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';

const ReportManagement = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

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

    const handleDownload = async (fileName, originalTitle) => {
        try {
            const response = await reportApi.downloadReport(fileName);
            const url = window.URL.createObjectURL(new Blob([response]));
            const extension = fileName.split('.').pop();
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${originalTitle}.${extension}`);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Lỗi download file:", error);
            if (error.code === 'ERR_CANCELED' || error.message === 'Network Error') {
                return; 
            }
            toast.error("Tải xuống thất bại. Vui lòng thử lại.");
        }
    };

    // Lọc danh sách theo từ khóa tìm kiếm (Lọc ở Frontend cho nhanh nếu dữ liệu ít)
    const filteredReports = reports.filter(report =>
        report.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.studentCode?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Box sx={{ p: { xs: 2, md: 4 }, minHeight: '100vh', backgroundColor: '#f4f6f8' }}>

            {/* --- HEADER CHÍNH --- */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: 800, color: "#1a237e", letterSpacing: '-0.5px' }}>
                    Quản lý Báo cáo Sinh viên
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                    Danh sách các tài liệu, báo cáo tiến độ do sinh viên tải lên hệ thống
                </Typography>
            </Box>

            {/* --- THANH TÌM KIẾM --- */}
            <Paper sx={{ p: 2, mb: 4, borderRadius: 4, display: "flex", alignItems: "center", boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                <SearchIcon sx={{ color: '#9e9e9e', mr: 1, ml: 1 }} />
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Tìm kiếm theo tiêu đề, tên hoặc mã sinh viên..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    size="small"
                    sx={{ '& fieldset': { border: 'none' }, bgcolor: '#f8f9fa', borderRadius: 2 }}
                />
            </Paper>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '40vh' }}>
                    <CircularProgress sx={{ color: '#1565c0' }} />
                </Box>
            ) : (
                /* --- DANH SÁCH THẺ BÁO CÁO 3D --- */
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4, justifyContent: 'flex-start' }}>
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
                                    style={{ flex: '1 1 350px', maxWidth: '420px' }}
                                >
                                    <Paper
                                        sx={{
                                            p: 3, borderRadius: 4, position: "relative", overflow: "hidden",
                                            background: 'linear-gradient(145deg, #ffffff, #fcfcfc)',
                                            boxShadow: '8px 8px 16px #e6e6e6, -8px -8px 16px #ffffff',
                                            border: '1px solid rgba(0,0,0,0.04)', height: '100%',
                                            display: 'flex', flexDirection: 'column'
                                        }}
                                    >
                                        {/* Hình tròn mờ trang trí góc phải */}
                                        <Box sx={{ position: 'absolute', top: -30, right: -30, width: 100, height: 100, borderRadius: '50%', background: 'rgba(21, 101, 192, 0.05)', zIndex: 0 }} />

                                        {/* Header Thẻ: Icon và Tiêu đề */}
                                        <Stack direction="row" alignItems="flex-start" sx={{ position: 'relative', zIndex: 1, mb: 3 }}>
                                            <Box sx={{ p: 1.5, borderRadius: 3, bgcolor: '#e3f2fd', color: '#1565c0', mr: 2 }}>
                                                <AssignmentTurnedInIcon />
                                            </Box>
                                            <Box>
                                                <Typography variant="h6" sx={{ fontWeight: 800, color: '#1a237e', lineHeight: 1.2, mb: 0.5 }}>
                                                    {report.title}
                                                </Typography>
                                                <Chip label={`ID: ${report.reportId}`} size="small" sx={{ fontWeight: 'bold', fontSize: '0.7rem', height: 20, bgcolor: '#f5f5f5', color: '#757575' }} />
                                            </Box>
                                        </Stack>

                                        {/* Body Thẻ: Khối xám chứa thông tin sinh viên */}
                                        <Stack spacing={1.5} sx={{ mb: 3, position: 'relative', zIndex: 1, bgcolor: '#f8f9fa', p: 2, borderRadius: 3, flexGrow: 1 }}>
                                            <Stack direction="row" alignItems="center" gap={1.5}>
                                                <BadgeIcon sx={{ color: '#757575', fontSize: 18 }} />
                                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                    Mã SV: <span style={{ fontWeight: 700, color: '#1565c0' }}>{report.studentCode}</span>
                                                </Typography>
                                            </Stack>
                                            <Stack direction="row" alignItems="center" gap={1.5}>
                                                <PersonIcon sx={{ color: '#757575', fontSize: 18 }} />
                                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                    Họ tên: <span style={{ fontWeight: 500, color: '#333' }}>{report.studentName}</span>
                                                </Typography>
                                            </Stack>
                                            <Stack direction="row" alignItems="center" gap={1.5}>
                                                <CalendarMonthIcon sx={{ color: '#757575', fontSize: 18 }} />
                                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                    Ngày nộp: <span style={{ fontWeight: 500, color: '#f57c00' }}>{report.uploadTime}</span>
                                                </Typography>
                                            </Stack>
                                        </Stack>

                                        <Divider sx={{ mb: 2, position: 'relative', zIndex: 1, borderStyle: 'dashed' }} />

                                        {/* Footer Thẻ: Nút Tải Xuống */}
                                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', position: 'relative', zIndex: 1 }}>
                                            <Button
                                                startIcon={<DownloadIcon />}
                                                size="medium"
                                                variant="contained"
                                                onClick={() => handleDownload(report.storedFileName, report.title)}
                                                sx={{
                                                    borderRadius: 2,
                                                    fontWeight: 700,
                                                    boxShadow: '0 4px 10px rgba(21, 101, 192, 0.2)',
                                                    bgcolor: '#1565c0',
                                                    '&:hover': { bgcolor: '#0d47a1' }
                                                }}
                                            >
                                                TẢI XUỐNG
                                            </Button>
                                        </Box>
                                    </Paper>
                                </motion.div>
                            ))
                        ) : (
                            <Box sx={{ width: '100%', textAlign: 'center', py: 8 }}>
                                <AssignmentTurnedInIcon sx={{ fontSize: 64, color: '#cbd5e1', mb: 2 }} />
                                <Typography variant="h6" color="text.secondary">
                                    Không tìm thấy báo cáo nào phù hợp.
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