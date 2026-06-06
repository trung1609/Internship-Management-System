import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Box, Typography, Paper, Button, CircularProgress, Chip, Stack, Divider
} from "@mui/material";
import {
    ArrowBack as ArrowBackIcon,
    Verified as VerifiedIcon,
    RateReview as RateReviewIcon,
    DateRange as DateRangeIcon
} from '@mui/icons-material';
import PersonOutlineIcon from "@mui/icons-material/PersonOutlineOutlined";
import { assessmentResultApi } from "../../api/resourceApi";
import { motion } from "framer-motion";

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
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchDetail();
    }, [id]);

    if (loading) return <Box sx={{ p: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}><CircularProgress /></Box>;

    return (
        <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: "900px", margin: "0 auto", backgroundColor: '#f4f6f8', minHeight: '100vh' }}>
            <Button
                variant="outlined" startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)}
                sx={{ mb: 4, borderRadius: '50px', px: 3, fontWeight: 700, bgcolor: 'white', '&:hover': { bgcolor: '#f0f0f0' } }}
            >
                Quay lại danh sách
            </Button>

            {/* Khung Thông Tin Tổng Quan */}
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <Paper elevation={0} sx={{ p: { xs: 3, md: 5 }, mb: 4, borderRadius: 4, background: 'linear-gradient(135deg, #ffffff, #fcfcfc)', boxShadow: '0 12px 32px rgba(0,0,0,0.05)', border: '1px solid rgba(0,0,0,0.03)' }}>

                    <Typography variant="h3" sx={{ fontWeight: '900', color: '#1a237e', mb: 1, letterSpacing: '-0.5px' }}>
                        {result?.assignmentName || "Kết quả đánh giá chi tiết"}
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
                        Theo dõi kết quả điểm số và lời nhận xét từ Mentor
                    </Typography>

                    <Stack spacing={0} sx={{ bgcolor: '#f8f9fa', borderRadius: 3, border: '1px solid #eeeeee', overflow: 'hidden' }}>
                        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, p: 3 }}>
                            <Typography variant="body1" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <VerifiedIcon color="primary" /> Vòng đánh giá:
                            </Typography>
                            <Typography variant="h6" sx={{ color: '#333', fontWeight: 700 }}>{result?.roundName || "N/A"}</Typography>
                        </Box>
                        <Divider />
                        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, p: 3 }}>
                            <Typography variant="body1" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <PersonOutlineIcon color="warning" /> Người đánh giá:
                            </Typography>
                            <Typography variant="h6" sx={{ color: '#333', fontWeight: 700 }}>{result?.evaluatorName || "N/A"}</Typography>
                        </Box>
                        <Divider />
                        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, p: 3 }}>
                            <Typography variant="body1" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <DateRangeIcon color="success" /> Ngày đánh giá:
                            </Typography>
                            <Typography variant="h6" sx={{ color: '#333', fontWeight: 700 }}>{result?.evaluationDate || "N/A"}</Typography>
                        </Box>
                    </Stack>

                </Paper>
            </motion.div>

            {/* Khung Hiển Thị Điểm Số (Thay thế Table) */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, color: '#1565c0', pl: 1 }}>
                    <RateReviewIcon sx={{ mr: 1.5, fontSize: 32 }} />
                    <Typography variant="h5" sx={{ fontWeight: '800' }}>
                        Chi tiết điểm số
                    </Typography>
                </Box>

                <Paper elevation={0} sx={{ p: 4, bgcolor: '#ffffff', borderRadius: 4, border: '1px solid #e0e0e0', display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4, alignItems: { xs: 'flex-start', md: 'center' }, boxShadow: '0 8px 24px rgba(25, 118, 210, 0.05)' }}>

                    {/* Phần Điểm và Tên Tiêu chí */}
                    <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle2" sx={{ textTransform: 'uppercase', color: '#9e9e9e', fontWeight: 800, letterSpacing: 1, mb: 1 }}>
                            Tiêu chí đánh giá
                        </Typography>
                        <Typography variant="h5" sx={{ fontWeight: 800, color: '#333', mb: 3 }}>
                            {result?.criterionName || "N/A"}
                        </Typography>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Typography variant="body1" sx={{ fontWeight: 600, color: '#555' }}>Đạt được:</Typography>
                            <Chip
                                label={result?.score !== undefined ? `${result.score} Điểm` : "Chưa chấm"}
                                color="primary"
                                sx={{ fontWeight: 900, fontSize: '1.2rem', py: 2.5, px: 1, borderRadius: 3 }}
                            />
                        </Box>
                    </Box>

                    <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', md: 'block' } }} />
                    <Divider flexItem sx={{ display: { xs: 'block', md: 'none' }, width: '100%' }} />

                    {/* Phần Lời nhận xét */}
                    <Box sx={{ flex: 2, bgcolor: '#f1f8e9', p: 3, borderRadius: 3, border: '1px dashed #a5d6a7', width: '100%' }}>
                        <Typography variant="subtitle2" sx={{ textTransform: 'uppercase', color: '#388e3c', fontWeight: 800, letterSpacing: 1, mb: 1.5 }}>
                            Lời nhận xét từ Mentor
                        </Typography>
                        <Typography variant="body1" sx={{ fontStyle: !result?.comments ? 'italic' : 'normal', color: !result?.comments ? '#9e9e9e' : '#2e7d32', lineHeight: 1.8, fontWeight: 500 }}>
                            "{result?.comments || "Mentor không để lại nhận xét chi tiết cho tiêu chí này."}"
                        </Typography>
                    </Box>

                </Paper>
            </motion.div>

        </Box>
    );
};
export default AssessmentResultDetail;