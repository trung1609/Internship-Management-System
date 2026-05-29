import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, Paper, Button, List, ListItem, ListItemText, Divider, CircularProgress, Chip } from "@mui/material";
import { assessmentRoundsApi } from "../../api/resourceApi";
import { ArrowBack } from "@mui/icons-material";

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
                variant="contained"
                startIcon={<ArrowBack />}
                onClick={() => navigate(-1)}
                sx={{ mb: 3, borderRadius: 2 }}
            >
                Quay lại
            </Button>

            <Paper elevation={3} sx={{ p: 5, borderRadius: 3, backgroundColor: "#ffffff" }}>
                {/* Header Section */}
                <Typography variant="h3" sx={{ fontWeight: '800', color: '#1a237e', mb: 1 }}>
                    {round?.roundName}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 3, fontStyle: 'italic' }}>
                    {round?.description}
                </Typography>

                <Divider sx={{ mb: 4 }} />

                {/* Criteria Section */}
                <Typography variant="h5" sx={{ mb: 3, fontWeight: '600', display: 'flex', alignItems: 'center' }}>
                    📋 Danh sách tiêu chí đánh giá
                </Typography>

                <List sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                    {round?.roundCriteria?.map((c, index) => (
                        <ListItem
                            key={index}
                            sx={{
                                bgcolor: '#f8f9fa',
                                borderRadius: 2,
                                border: '1px solid #e0e0e0',
                                display: 'block'
                            }}
                        >
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                                {c.criterionName}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <Chip label={`Trọng số: ${c.weight}`} color="primary" variant="outlined" size="small" />
                                <Chip label={`Điểm tối đa: ${c.maxScore}`} color="secondary" variant="outlined" size="small" />
                            </Box>
                        </ListItem>
                    ))}
                </List>
            </Paper>
        </Box>
    );
};
export default AssessmentRoundDetail;