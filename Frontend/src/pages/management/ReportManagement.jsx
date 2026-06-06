import React, { useEffect, useState } from 'react';
import { 
    Box, Typography, Table, TableBody, TableCell, TableContainer, 
    TableHead, TableRow, Paper, IconButton, Stack, CircularProgress 
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import { reportApi } from '../../api/resourceApi';
import { motion } from 'framer-motion';

const ReportManagement = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReports = async () => {
            try {
                setLoading(true);
                const res = await reportApi.getAllReports();
                // Kiểm tra xem dữ liệu nằm ở đâu (res.data.data.content hoặc res.data.content)
                setReports(res?.content);
            } catch (err) {
                console.error("Lỗi khi tải báo cáo:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchReports();
    }, []);

    return (
        <Box 
            component={motion.div}
            initial={{ opacity: 0, scale: 0.98 }} 
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            sx={{ p: 4, minHeight: '80vh' }}
        >
            {/* Header chuyên nghiệp */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: 800, color: '#1e293b', mb: 1 }}>
                    Quản lý Báo cáo Sinh viên
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Danh sách các báo cáo tiến độ do sinh viên đã nộp lên hệ thống.
                </Typography>
            </Box>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <TableContainer 
                    component={Paper} 
                    sx={{ borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.05)', overflow: 'hidden' }}
                >
                    <Table>
                        <TableHead>
                            <TableRow sx={{ bgcolor: '#f8fafc' }}>
                                <TableCell sx={{ fontWeight: 700 }}>Tiêu đề báo cáo</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Mã sinh viên</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Tên sinh viên</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Ngày nộp</TableCell>
                                <TableCell sx={{ fontWeight: 700, textAlign: 'center' }}>Thao tác</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {reports.length > 0 ? (
                                reports.map((report) => (
                                    <TableRow 
                                        key={report.reportId} 
                                        hover 
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell sx={{ py: 2 }}>
                                            <Stack direction="row" alignItems="center" spacing={2}>
                                                <AssignmentTurnedInIcon sx={{ color: '#2563eb' }} />
                                                <Typography variant="body2" sx={{ fontWeight: 600 }}>{report.title}</Typography>
                                            </Stack>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" sx={{ bgcolor: '#eff6ff', display: 'inline-block', borderRadius: 1, color: '#1e40af' }}>
                                                {report.studentCode}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2">
                                                {report.studentName}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>{report.uploadTime}</TableCell>
                                        <TableCell align="center">
                                            <IconButton 
                                                color="primary" 
                                                onClick={() => window.open(`/api/v1/reports/download/${report.storedFileName}`)}
                                                sx={{ bgcolor: '#eff6ff', '&:hover': { bgcolor: '#dbeafe' } }}
                                            >
                                                <DownloadIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} align="center" sx={{ py: 5, color: '#64748b' }}>
                                        Chưa có báo cáo nào được nộp.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Box>
    );
};

export default ReportManagement;