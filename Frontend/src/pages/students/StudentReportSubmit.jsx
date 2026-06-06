import React, { useRef, useState } from 'react';
import {
    Box, Typography, Button, Paper, Stack, TextField,
    CircularProgress, Alert, IconButton
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import CloseIcon from '@mui/icons-material/Close';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { reportApi } from '../../api/resourceApi';

const StudentReportSubmit = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [title, setTitle] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null);

    // Xử lý khi user chọn file
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

            // 2. Kiểm tra dung lượng (Tối đa 10MB)
            const maxSize = 10 * 1024 * 1024;
            if (file.size > maxSize) {
                setError('Kích thước file vượt quá giới hạn (10MB).');
                return;
            }

            setSelectedFile(file);
            setError(null);
        }
    };

    // Hủy file đã chọn
    const handleRemoveFile = () => {
        setSelectedFile(null);

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    // Submit lên Backend
    const handleSubmit = async () => {
        if (!selectedFile || !title.trim()) {
            setError('Vui lòng nhập đầy đủ tiêu đề và chọn file.');
            return;
        }

        setIsUploading(true);
        setError(null); // Xóa sạch lỗi cũ trước khi bắt đầu

        try {
            const response = await reportApi.uploadReport(selectedFile, title);

            // Kiểm tra chắc chắn response thành công trước khi báo
            if (response?.data?.success || response.success) {
                toast.success('Tải báo cáo lên thành công!');
                setTitle('');
                handleRemoveFile(); // Chú ý: Tên hàm là handleRemoveFile chứ không phải RemoveFile
            } else {
                throw new Error(response?.data?.message || "Upload thất bại");
            }
        } catch (err) {
            console.error("Lỗi upload:", err);
            // Chỉ set lỗi nếu không phải là lỗi do chính mình tạo ra ở trên
            setError('Có lỗi xảy ra khi tải file. Vui lòng thử lại.');
            toast.error('Upload thất bại.');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <Box
            component={motion.div}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            sx={{ p: { xs: 2, md: 4 }, bgcolor: '#f0f2f5', minHeight: '80vh' }}
        >
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: 800, color: '#1e293b', mb: 1 }}>
                    Nộp Báo cáo Tiến độ
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Tải lên tài liệu hoặc báo cáo hàng tuần của bạn để Mentor đánh giá.
                </Typography>
            </Box>

            <Paper sx={{ p: { xs: 3, sm: 5 }, borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.05)', maxWidth: 700 }}>

                {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}

                <Stack spacing={4}>
                    <TextField
                        label="Tiêu đề báo cáo (Ví dụ: Báo cáo tuần 1 - Xây dựng DB)"
                        fullWidth
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        InputProps={{ sx: { borderRadius: 2 } }}
                    />

                    {/* KHU VỰC CHỌN FILE (Thiết kế dạng Drag & Drop zone mỏng) */}
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
                            // Trạng thái đã chọn file
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
                            // Trạng thái chưa chọn file
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
                                        id="report-upload-input"
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
                            py: 1.5,
                            borderRadius: 2,
                            fontWeight: 700,
                            bgcolor: '#2563eb',
                            boxShadow: '0 4px 14px rgba(37,99,235,0.2)',
                            '&:hover': { bgcolor: '#1d4ed8' }
                        }}
                    >
                        {isUploading ? 'ĐANG TẢI LÊN...' : 'NỘP BÁO CÁO'}
                    </Button>

                </Stack>
            </Paper>
        </Box>
    );
};

export default StudentReportSubmit;