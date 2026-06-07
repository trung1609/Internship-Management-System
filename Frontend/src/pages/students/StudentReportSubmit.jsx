import React, { useState, useRef, useEffect } from 'react';
import {
    Box, Typography, Button, Paper, Stack, TextField,
    CircularProgress, Alert, IconButton, Divider, List, ListItem, ListItemText, ListItemAvatar, Avatar
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import CloseIcon from '@mui/icons-material/Close';
import AssignmentIcon from '@mui/icons-material/Assignment';
import DownloadIcon from '@mui/icons-material/Download';
import { reportApi } from '../../api/resourceApi';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

const StudentReportSubmit = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [title, setTitle] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState(null);

    // State lưu lịch sử
    const [myReports, setMyReports] = useState([]);
    const [isLoadingHistory, setIsLoadingHistory] = useState(true);

    const fileInputRef = useRef(null);

    // Lấy lịch sử nộp bài khi vào trang
    const fetchMyReports = async () => {
        try {
            setIsLoadingHistory(true);
            const res = await reportApi.getMyReports();
            setMyReports(res?.content || []);
        } catch (err) {
            console.error("Lỗi lấy lịch sử:", err);
        } finally {
            setIsLoadingHistory(false);
        }
    };

    useEffect(() => {
        fetchMyReports();
    }, []);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const validExtensions = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
            if (!validExtensions.includes(file.type)) {
                const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
                if (ext !== '.pdf' && ext !== '.docx') {
                    setError('Hệ thống chỉ hỗ trợ tải lên file PDF hoặc DOCX.');
                    return;
                }
            }
            const maxSize = 10 * 1024 * 1024;
            if (file.size > maxSize) {
                setError('Kích thước file vượt quá giới hạn (10MB).');
                return;
            }
            setSelectedFile(file);
            setError(null);
        }
    };

    const handleRemoveFile = () => {
        setSelectedFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleSubmit = async () => {
        if (!selectedFile || !title.trim()) {
            setError('Vui lòng nhập đầy đủ tiêu đề và chọn file.');
            return;
        }

        setIsUploading(true);
        setError(null);

        try {
            const response = await reportApi.uploadReport(selectedFile, title);

            if (response?.data?.success || response.success) {
                toast.success('Tải báo cáo lên thành công!');
                setTitle('');
                handleRemoveFile();
                // Nộp xong thì gọi lại API lấy lịch sử để update danh sách liền tay
                fetchMyReports();
            } else {
                throw new Error(response?.data?.message || "Upload thất bại");
            }
        } catch (err) {
            console.error(err);
            setError('Có lỗi xảy ra khi tải file. Vui lòng thử lại.');
            toast.error('Upload thất bại.');
        } finally {
            setIsUploading(false);
        }
    };

    // Hàm tải lại file do chính mình đã nộp
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
            if (error.code === 'ERR_CANCELED' || error.message === 'Network Error') return;
            toast.error("Tải xuống thất bại. Vui lòng thử lại.");
        }
    };

    return (
        <Box
            component={motion.div}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            sx={{ p: { xs: 2, md: 4 }, bgcolor: '#f4f6f8', minHeight: '80vh' }}
        >
            <Box sx={{ mb: 4, maxWidth: 800, mx: 'auto' }}>
                <Typography variant="h4" sx={{ fontWeight: 800, color: '#1a237e', mb: 1, letterSpacing: '-0.5px' }}>
                    Nộp Báo cáo Tiến độ
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Tải lên tài liệu hoặc báo cáo hàng tuần của bạn để Mentor đánh giá.
                </Typography>
            </Box>

            <Stack spacing={4} sx={{ maxWidth: 800, mx: 'auto' }}>
                {/* --- KHỐI NỘP BÀI --- */}
                <Paper sx={{ p: { xs: 3, sm: 5 }, borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                    {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}

                    <Stack spacing={4}>
                        <TextField
                            label="Tiêu đề báo cáo (Ví dụ: Báo cáo tuần 1 - Xây dựng DB)"
                            fullWidth
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            InputProps={{ sx: { borderRadius: 2 } }}
                        />

                        <Box
                            sx={{
                                border: '2px dashed #cbd5e1',
                                borderRadius: 3,
                                p: 4,
                                textAlign: 'center',
                                bgcolor: selectedFile ? '#f8fafc' : '#ffffff',
                                transition: 'all 0.2s',
                                '&:hover': { borderColor: '#3b82f6', bgcolor: '#f0f9ff' }
                            }}
                        >
                            {selectedFile ? (
                                <Stack direction="row" alignItems="center" justifyContent="center" spacing={2}>
                                    <AttachFileIcon sx={{ color: '#3b82f6', fontSize: 32 }} />
                                    <Box sx={{ textAlign: 'left' }}>
                                        <Typography variant="body1" sx={{ fontWeight: 600, color: '#1e293b' }}>
                                            {selectedFile.name}
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: '#64748b' }}>
                                            {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                                        </Typography>
                                    </Box>
                                    <IconButton size="small" onClick={handleRemoveFile} sx={{ color: '#ef4444' }}>
                                        <CloseIcon />
                                    </IconButton>
                                </Stack>
                            ) : (
                                <>
                                    <CloudUploadIcon sx={{ fontSize: 48, color: '#94a3b8', mb: 2 }} />
                                    <Typography variant="body1" sx={{ fontWeight: 500, color: '#475569', mb: 2 }}>
                                        Kéo thả file vào đây hoặc nhấp để duyệt
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: '#94a3b8', mb: 3 }}>
                                        Chỉ hỗ trợ định dạng PDF, DOCX (Tối đa 10MB)
                                    </Typography>

                                    <Button
                                        component="label"
                                        variant="outlined"
                                        sx={{ borderRadius: 2, fontWeight: 600, textTransform: 'none' }}
                                    >
                                        Chọn tập tin
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            hidden
                                            onChange={handleFileChange}
                                            accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                        />
                                    </Button>
                                </>
                            )}
                        </Box>

                        <Button
                            variant="contained"
                            onClick={handleSubmit}
                            disabled={isUploading}
                            startIcon={isUploading ? <CircularProgress size={20} color="inherit" /> : <CloudUploadIcon />}
                            sx={{
                                py: 1.5, borderRadius: 2, fontWeight: 700, bgcolor: '#1565c0',
                                boxShadow: '0 4px 14px rgba(21,101,192,0.2)', '&:hover': { bgcolor: '#0d47a1' }
                            }}
                        >
                            {isUploading ? 'ĐANG TẢI LÊN...' : 'XÁC NHẬN NỘP BÁO CÁO'}
                        </Button>
                    </Stack>
                </Paper>

                {/* --- KHỐI LỊCH SỬ NỘP BÀI --- */}
                <Paper sx={{ p: { xs: 3, sm: 5 }, borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#1a237e', mb: 2 }}>
                        Lịch sử nộp bài của bạn
                    </Typography>
                    <Divider sx={{ mb: 2 }} />

                    {isLoadingHistory ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                            <CircularProgress size={30} />
                        </Box>
                    ) : myReports.length > 0 ? (
                        <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                            {myReports.map((report, index) => (
                                <ListItem
                                    key={report.reportId || index}
                                    sx={{
                                        mb: 1.5,
                                        border: '1px solid #f1f5f9',
                                        borderRadius: 2,
                                        '&:hover': { bgcolor: '#f8fafc' }
                                    }}
                                    secondaryAction={
                                        <IconButton edge="end" color="primary" onClick={() => handleDownload(report.storedFileName, report.title)}>
                                            <DownloadIcon />
                                        </IconButton>
                                    }
                                >
                                    <ListItemAvatar>
                                        <Avatar sx={{ bgcolor: '#e0f2fe', color: '#0284c7' }}>
                                            <AssignmentIcon />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={<Typography sx={{ fontWeight: 600, color: '#334155' }}>{report.title}</Typography>}
                                        secondary={
                                            <React.Fragment>
                                                <Typography component="span" variant="body2" color="text.secondary">
                                                    Đã nộp vào: {report.uploadTime}
                                                </Typography>
                                                <Typography component="span" variant="caption" sx={{ display: 'block', color: '#94a3b8' }}>
                                                    File gốc: {report.originalFileName}
                                                </Typography>
                                            </React.Fragment>
                                        }
                                    />
                                </ListItem>
                            ))}
                        </List>
                    ) : (
                        <Box sx={{ textAlign: 'center', py: 4, color: '#94a3b8' }}>
                            <AssignmentIcon sx={{ fontSize: 40, opacity: 0.5, mb: 1 }} />
                            <Typography>Bạn chưa nộp báo cáo nào.</Typography>
                        </Box>
                    )}
                </Paper>
            </Stack>
        </Box>
    );
};

export default StudentReportSubmit;