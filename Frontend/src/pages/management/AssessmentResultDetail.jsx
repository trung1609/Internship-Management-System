import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Box, Typography, Paper, Button, Divider, CircularProgress,
    Chip, Table, TableBody, TableCell, TableHead, TableRow, Stack
} from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { assessmentResultApi } from "../../api/resourceApi";

const AssessmentResultDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const res = await assessmentResultApi.getResultById(id);
                setResult(res?.data || res);
            } catch (err) { console.error(err); } finally { setLoading(false); }
        };
        fetchDetail();
    }, [id]);

    if (loading) return <Box sx={{ p: 4, textAlign: 'center' }}><CircularProgress /></Box>;

    return (
        <Box sx={{ p: 4, maxWidth: "1000px", margin: "0 auto" }}>
            <Button 
                variant="outlined" 
                startIcon={<ArrowBackIcon />} 
                onClick={() => navigate(-1)} 
                sx={{ mb: 3, borderRadius: 2, fontWeight: 'bold' }}
            >
                Quay lại danh sách
            </Button>

            <Paper elevation={0} sx={{ p: { xs: 3, md: 5 }, borderRadius: 3, border: "1px solid #e0e0e0" }}>
                {/* Header Thông tin chung */}
                <Typography variant="h4" sx={{ fontWeight: '800', color: '#1a237e', mb: 1 }}>
                    {result?.assignmentName || "Kết quả đánh giá"}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
                    Chi tiết điểm số đánh giá từ Mentor
                </Typography>

                {/* SỬ DỤNG STACK THAY VÌ GRID CHO THÔNG TIN CHUNG */}
                <Stack spacing={2} sx={{ mb: 4, p: 3, bgcolor: '#f8f9fa', borderRadius: 2, border: '1px solid #eeeeee' }}>
                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between' }}>
                        <Typography variant="body1" color="text.secondary">Vòng đánh giá:</Typography>
                        <Typography variant="h6" sx={{ color: '#333' }}>{result?.roundName}</Typography>
                    </Box>
                    <Divider />
                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between' }}>
                        <Typography variant="body1" color="text.secondary">Người đánh giá:</Typography>
                        <Typography variant="h6" sx={{ color: '#333' }}>{result?.evaluatorName}</Typography>
                    </Box>
                    <Divider />
                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between' }}>
                        <Typography variant="body1" color="text.secondary">Ngày đánh giá:</Typography>
                        <Typography variant="h6" sx={{ color: '#333' }}>{result?.evaluationDate}</Typography>
                    </Box>
                </Stack>

                {/* Bảng điểm chi tiết */}
                <Typography variant="h5" sx={{ mb: 2, fontWeight: '700', color: '#1565c0' }}>
                    📊 Chi tiết điểm số
                </Typography>
                
                <Table sx={{ minWidth: 650, border: '1px solid #e0e0e0', borderRadius: 2, overflow: 'hidden' }} aria-label="simple table">
                    <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold' }}>Tiêu chí</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }} align="center">Điểm số</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Nhận xét</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow hover>
                            <TableCell>{result?.criterionName}</TableCell>
                            <TableCell align="center">
                                <Chip label={result?.score} color="primary" sx={{ fontWeight: 'bold', fontSize: '1rem', px: 1 }} />
                            </TableCell>
                            <TableCell sx={{ fontStyle: !result?.comments ? 'italic' : 'normal', color: !result?.comments ? 'text.secondary' : 'inherit' }}>
                                {result?.comments || "Không có nhận xét"}
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </Paper>
        </Box>
    );
};
export default AssessmentResultDetail;