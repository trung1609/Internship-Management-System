import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, Paper, Button, List, ListItem, Divider, CircularProgress, Chip, Stack } from "@mui/material";
import { assessmentRoundsApi } from "../../api/resourceApi";
import { ArrowBack, AssignmentTurnedIn } from "@mui/icons-material";

const AssessmentRoundDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [round, setRound] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const res = await assessmentRoundsApi.getRoundById(id);
                setRound(res?.data || res); // Tùy vào cấu trúc API trả về
            } catch (err) { console.error(err); } finally { setLoading(false); }
        };
        fetchDetail();
    }, [id]);

    if (loading) return <Box sx={{ p: 4, textAlign: 'center' }}><CircularProgress /></Box>;

    return (
        <Box sx={{ p: 4, maxWidth: "900px", margin: "0 auto" }}>
            <Button
                variant="outlined"
                startIcon={<ArrowBack />}
                onClick={() => navigate(-1)}
                sx={{ mb: 3, borderRadius: 2, fontWeight: 'bold' }}
            >
                Quay lại danh sách
            </Button>

            <Paper elevation={0} sx={{ p: { xs: 3, md: 5 }, borderRadius: 3, border: "1px solid #e0e0e0" }}>
                {/* Header Section */}
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h3" sx={{ fontWeight: '900', color: '#1a237e', mb: 1.5, letterSpacing: '-0.5px' }}>
                        {round?.roundName}
                    </Typography>
                    <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 400, lineHeight: 1.6 }}>
                        {round?.description}
                    </Typography>
                </Box>

                <Divider sx={{ mb: 4 }} />

                {/* Criteria Section */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, color: '#1565c0' }}>
                    <AssignmentTurnedIn sx={{ mr: 1.5, fontSize: 32 }} />
                    <Typography variant="h5" sx={{ fontWeight: '700' }}>
                        Danh sách tiêu chí đánh giá
                    </Typography>
                </Box>

                {/* SỬ DỤNG STACK ĐỂ XẾP DỌC THAY VÌ CSS GRID */}
                <Stack spacing={2.5}>
                    {round?.roundCriteria?.length > 0 ? (
                        round.roundCriteria.map((c, index) => (
                            <Paper
                                key={index}
                                elevation={0}
                                sx={{
                                    p: 3,
                                    bgcolor: '#f8f9fa',
                                    borderRadius: 2,
                                    border: '1px solid #e0e0e0',
                                    display: 'flex',
                                    flexDirection: { xs: 'column', sm: 'row' },
                                    justifyContent: 'space-between',
                                    alignItems: { xs: 'flex-start', sm: 'center' },
                                    gap: 2,
                                    transition: 'all 0.2s',
                                    '&:hover': {
                                        borderColor: '#1976d2',
                                        boxShadow: '0 4px 12px rgba(25, 118, 210, 0.08)'
                                    }
                                }}
                            >
                                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333' }}>
                                    {c.criterionName}
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                                    <Chip 
                                        label={`Trọng số: ${c.weight}%`} 
                                        color="primary" 
                                        sx={{ fontWeight: 600, px: 1 }} 
                                    />
                                    <Chip 
                                        label={`Điểm tối đa: ${c.maxScore}`} 
                                        color="secondary" 
                                        variant="outlined" 
                                        sx={{ fontWeight: 600, bgcolor: 'white' }} 
                                    />
                                </Box>
                            </Paper>
                        ))
                    ) : (
                        <Typography variant="body1" color="text.secondary" sx={{ fontStyle: 'italic', textAlign: 'center', py: 4 }}>
                            Chưa có tiêu chí nào được thiết lập cho vòng đánh giá này.
                        </Typography>
                    )}
                </Stack>
            </Paper>
        </Box>
    );
};

export default AssessmentRoundDetail;