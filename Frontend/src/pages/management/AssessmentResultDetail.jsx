import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Box, Typography, Paper, Button, Divider, CircularProgress,
    Grid, Chip, Table, TableBody, TableCell, TableHead, TableRow
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
            <Button variant="contained" startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ mb: 3, borderRadius: 2 }}>
                Quay lại
            </Button>

            <Paper elevation={3} sx={{ p: 5, borderRadius: 3 }}>
                {/* Header Thông tin chung */}
                <Typography variant="h4" sx={{ fontWeight: '800', color: '#1a237e', mb: 2 }}>
                    Kết quả đánh giá: {result?.assignmentName}
                </Typography>

                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={12} sm={4}>
                        <Typography variant="body2" color="text.secondary">Vòng đánh giá</Typography>
                        <Typography variant="h6">{result?.roundName}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Typography variant="body2" color="text.secondary">Người đánh giá</Typography>
                        <Typography variant="h6">{result?.evaluatorName}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Typography variant="body2" color="text.secondary">Ngày đánh giá</Typography>
                        <Typography variant="h6">{result?.evaluationDate}</Typography>
                    </Grid>
                </Grid>

                <Divider sx={{ mb: 4 }} />

                {/* Bảng điểm chi tiết */}
                <Typography variant="h5" sx={{ mb: 3, fontWeight: '600' }}>📊 Chi tiết điểm số</Typography>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold' }}>Tiêu chí</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }} align="center">Điểm số</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Nhận xét</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell>{result?.criterionName}</TableCell>
                            <TableCell align="center">
                                <Chip label={result?.score} color="primary" sx={{ fontWeight: 'bold' }} />
                            </TableCell>
                            <TableCell>{result?.comments || "Không có nhận xét"}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </Paper>
        </Box>
    );
};
export default AssessmentResultDetail;