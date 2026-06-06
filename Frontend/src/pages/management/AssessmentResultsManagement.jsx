import { useState, useEffect, useContext } from "react";
import { assessmentResultApi, assessmentRoundsApi } from "../../api/resourceApi";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  Box, Button, TextField, Autocomplete, Typography, Stack,
  Paper, Divider, Modal, IconButton, Chip, Avatar
} from "@mui/material";


// Import Icons
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import AddTaskIcon from '@mui/icons-material/AddTask';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import PersonIcon from '@mui/icons-material/Person';
import EventIcon from '@mui/icons-material/Event';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import DeleteIcon from "@mui/icons-material/Delete";

const MotionPaper = motion(Paper);

const AssessmentResultsManagement = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState("");
  
  const [openModal, setOpenModal] = useState(false);
  const [editingResult, setEditingResult] = useState(null);

  const [formData, setFormData] = useState({
    id: null,
    assignmentId: "",
    roundId: "",
    results: [],
  });

  const [suggestedCriteria, setSuggestedCriteria] = useState([]);
  const navigate = useNavigate();

  const { user } = useContext(AuthContext);
  const isMentor = user?.role === "MENTOR" || user?.role === "ROLE_MENTOR";

  useEffect(() => {
    fetchResults();
    fetchCriteriaForRound(formData.roundId);
  }, [page, rowsPerPage, search]);

  const fetchResults = async () => {
    try {
      setLoading(true);
      const response = await assessmentResultApi.getAllResults(null, page, rowsPerPage, search);
      setData(response?.content || []);
      setTotalCount(response?.totalElements || 0);
    } catch (err) {
      console.error("Error loading assessment results:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCriteriaForRound = async (roundId) => {
    if (!roundId) {
      setSuggestedCriteria([]);
      return;
    }
    try {
      const round = await assessmentRoundsApi.getRoundById(roundId);
      const criteria = round?.data?.roundCriteria || [];
      setSuggestedCriteria(criteria);

      const initializedResults = criteria.map(c => ({
        criterionId: c.criterionId,
        score: "",
        comments: ""
      }));

      if (!editingResult) {
        setFormData(prev => ({ ...prev, results: initializedResults }));
      }
    } catch (err) {
      console.error("Lỗi lấy tiêu chí:", err);
    }
  };

  const handleOpenModal = async (result = null) => {
    if (result) {
      setEditingResult(result);
      await fetchCriteriaForRound(result.roundId);
      setFormData({
        id: result.id,
        assignmentId: result.assignmentId || "",
        roundId: result.roundId || "",
        results: [{
          criterionId: result.criterionId,
          score: result.score,
          comments: result.comments
        }]
      });
    } else {
      setEditingResult(null);
      setFormData({
        id: null,
        assignmentId: "",
        roundId: "",
        results: [{ criterionId: "", score: "", comments: "" }]
      });
    }
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setEditingResult(null);
    setFormData({
      id: null,
      assignmentId: "",
      roundId: "",
      results: [{ criterionId: "", score: "", comments: "" }],
    });
    setSuggestedCriteria([]);
  };

  const handleResultChange = (index, field, value) => {
    const newResults = [...formData.results];
    newResults[index][field] = value;
    setFormData({ ...formData, results: newResults });
  };

  const handleAddResultRow = () => {
    setFormData({
      ...formData,
      results: [...formData.results, { criterionId: "", score: "", comments: "" }]
    });
  };

  const handleRemoveResultRow = (index) => {
    const newResults = formData.results.filter((_, i) => i !== index);
    setFormData({ ...formData, results: newResults });
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      if (editingResult) {
        const currentRow = formData.results[0];
        await assessmentResultApi.updateResult(formData.id, {
          score: parseFloat(currentRow.score) || 0,
          comments: currentRow.comments || ""
        });
        toast.success("Cập nhật thành công!");
      } else {
        const payload = {
          assignmentId: parseInt(formData.assignmentId),
          roundId: parseInt(formData.roundId),
          results: formData.results.map(r => ({
            criterionId: parseInt(r.criterionId),
            score: parseFloat(r.score) || 0,
            comments: r.comments || ""
          }))
        };
        await assessmentResultApi.createResult(payload);
        toast.success("Tạo thành công!");
      }
      handleCloseModal();
      fetchResults();
    } catch (err) {
      toast.error("Lỗi khi lưu!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 4, minHeight: '100vh', backgroundColor: '#f4f6f8' }}>
      
      {/* --- HEADER CHÍNH --- */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: "#1a237e", letterSpacing: '-0.5px' }}>
            Quản lý Kết quả Đánh giá
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
            Ghi nhận và theo dõi điểm số chi tiết từ Mentor
          </Typography>
        </Box>
        
        {isMentor && (
          <Button
            variant="contained" size="large" startIcon={<AddTaskIcon />} onClick={() => handleOpenModal()}
            sx={{ borderRadius: '50px', px: 4, py: 1.5, boxShadow: '0 8px 16px rgba(26, 35, 126, 0.2)', transition: 'all 0.3s', '&:hover': { transform: 'translateY(-2px)' } }}
          >
            Thêm Điểm Mới
          </Button>
        )}
      </Box>

      {/* --- THANH TÌM KIẾM --- */}
      <Paper sx={{ p: 2, mb: 4, borderRadius: 4, display: "flex", alignItems: "center", boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        <TextField 
          fullWidth variant="outlined" placeholder="Tìm kiếm kết quả..." 
          value={search} onChange={(e) => { setSearch(e.target.value); setPage(0); }}
          size="small" sx={{ '& fieldset': { border: 'none' }, bgcolor: '#f8f9fa', borderRadius: 2 }}
        />
      </Paper>

      {/* --- DANH SÁCH THẺ 3D --- */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4, justifyContent: 'flex-start' }}>
        <AnimatePresence>
          {data.map((result, index) => (
            <motion.div
              key={result.id || index}
              initial={{ opacity: 0, y: 50, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.4, delay: index * 0.05 }} whileHover={{ scale: 1.03, y: -5 }}
              style={{ flex: '1 1 350px', maxWidth: '420px' }}
            >
              <Paper
                sx={{ 
                  p: 3, borderRadius: 4, position: "relative", overflow: "hidden",
                  background: 'linear-gradient(145deg, #ffffff, #fcfcfc)',
                  boxShadow: '8px 8px 16px #e6e6e6, -8px -8px 16px #ffffff',
                  border: '1px solid rgba(0,0,0,0.04)', height: '100%', display: 'flex', flexDirection: 'column'
                }}
              >
                <Box sx={{ position: 'absolute', top: -30, right: -30, width: 100, height: 100, borderRadius: '50%', background: 'rgba(21, 101, 192, 0.05)', zIndex: 0 }} />

                <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ position: 'relative', zIndex: 1, mb: 3 }}>
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <Box sx={{ p: 1.5, borderRadius: 3, bgcolor: '#e3f2fd', color: '#1565c0' }}>
                      <AssignmentTurnedInIcon />
                    </Box>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 800, color: '#1a237e', lineHeight: 1.2, mb: 0.5 }}>
                        {result.assignmentName || "Tên phân công trống"}
                      </Typography>
                      <Chip label={`ID: ${result.id}`} size="small" sx={{ fontWeight: 'bold', fontSize: '0.7rem', height: 20, bgcolor: '#f5f5f5', color: '#757575' }} />
                    </Box>
                  </Box>
                </Stack>

                <Stack spacing={1.5} sx={{ mb: 3, position: 'relative', zIndex: 1, bgcolor: '#f8f9fa', p: 2, borderRadius: 3, flexGrow: 1 }}>
                  <Stack direction="row" alignItems="center" gap={1.5}>
                    <TrackChangesIcon sx={{ color: '#757575', fontSize: 18 }} />
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>Vòng ĐG: <span style={{ fontWeight: 400, color: '#f57c00' }}>{result.roundName || "N/A"}</span></Typography>
                  </Stack>
                  <Stack direction="row" alignItems="center" gap={1.5}>
                    <PersonIcon sx={{ color: '#757575', fontSize: 18 }} />
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>Mentor: <span style={{ fontWeight: 400 }}>{result.evaluatorName || "N/A"}</span></Typography>
                  </Stack>
                  <Stack direction="row" alignItems="center" gap={1.5}>
                    <EventIcon sx={{ color: '#757575', fontSize: 18 }} />
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>Ngày ĐG: <span style={{ fontWeight: 400 }}>{result.evaluationDate || "N/A"}</span></Typography>
                  </Stack>
                </Stack>

                <Divider sx={{ mb: 2, position: 'relative', zIndex: 1 }} />

                <Stack direction="row" justifyContent="space-between" sx={{ position: 'relative', zIndex: 1 }}>
                  <Button startIcon={<VisibilityIcon />} size="small" variant="contained" color="info" onClick={() => navigate(`/admin/assessment-results/${result.id}`)} sx={{ borderRadius: 2, fontWeight: 600, boxShadow: 0 }}>
                    Xem Chi Tiết
                  </Button>
                  
                  {isMentor && (
                    <IconButton size="small" color="primary" onClick={() => handleOpenModal(result)}>
                      <EditIcon />
                    </IconButton>
                  )}
                </Stack>
              </Paper>
            </motion.div>
          ))}
        </AnimatePresence>
      </Box>

      {/* --- PAGINATION CHẠY TAY --- */}
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2, mt: 6 }}>
        <Button variant="outlined" disabled={page === 0} onClick={() => setPage(p => p - 1)} sx={{ borderRadius: '50px', px: 3 }}>Trang trước</Button>
        <Typography variant="body2" fontWeight="bold">Trang {page + 1}</Typography>
        <Button variant="outlined" disabled={data.length < rowsPerPage} onClick={() => setPage(p => p + 1)} sx={{ borderRadius: '50px', px: 3 }}>Trang sau</Button>
      </Box>

      {/* --- MODAL THÊM / SỬA FRAMER MOTION CHỐNG KHỰNG --- */}
      <Modal open={openModal} onClose={handleCloseModal} closeAfterTransition sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(3px)' }}>
        <AnimatePresence>
          {openModal && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 30 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.8, opacity: 0, y: 30 }} transition={{ type: "spring", stiffness: 350, damping: 25 }}
              style={{ width: '100%', maxWidth: '650px', outline: 'none', padding: '16px' }}
            >
              <Paper sx={{ borderRadius: 4, overflow: 'hidden', boxShadow: '0 24px 48px rgba(0,0,0,0.25)', display: 'flex', flexDirection: 'column', maxHeight: '90vh' }}>
                <Box sx={{ p: 3, pb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: '#fff' }}>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: '#1a237e' }}>{editingResult ? "Cập nhật Kết quả" : "Thêm Kết quả Đánh giá"}</Typography>
                  <IconButton onClick={handleCloseModal} sx={{ bgcolor: '#f4f6f8', '&:hover': { bgcolor: '#e0e0e0' } }}><CloseIcon /></IconButton>
                </Box>
                <Divider />

                <Box sx={{ p: 4, bgcolor: '#fff', overflowY: 'auto' }}>
                  <Stack spacing={2.5}>
                    <TextField fullWidth label="Mã phân công (Assignment ID)" value={formData.assignmentId} onChange={(e) => setFormData({ ...formData, assignmentId: e.target.value })} disabled={editingResult !== null} />
                    <TextField
                      fullWidth label="Mã vòng đánh giá (Round ID)" value={formData.roundId} disabled={editingResult !== null}
                      onChange={(e) => { const id = e.target.value; setFormData({ ...formData, roundId: id }); fetchCriteriaForRound(id); }}
                    />
                  </Stack>

                  <Box sx={{ mt: 4, p: 3, bgcolor: '#f8f9fa', borderRadius: 3, border: '1px solid #e0e0e0' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#1565c0' }}>Chi tiết điểm các tiêu chí</Typography>
                      {!editingResult && (
                        <Button variant="outlined" size="small" onClick={handleAddResultRow} sx={{ borderRadius: 2, fontWeight: 'bold' }}>+ Thêm dòng</Button>
                      )}
                    </Box>

                    <Stack spacing={3}>
                      {formData.results.map((item, index) => (
                        <Paper key={index} elevation={0} sx={{ p: 2.5, border: '1px solid #e0e0e0', borderRadius: 3, bgcolor: '#ffffff' }}>
                          <Stack spacing={2}>
                            <Autocomplete
                              fullWidth options={suggestedCriteria} getOptionLabel={(option) => option.criterionName || ""}
                              value={suggestedCriteria.find(c => c.criterionId == item.criterionId) || null}
                              isOptionEqualToValue={(option, value) => option.criterionId == value.criterionId}
                              onChange={(e, newValue) => { handleResultChange(index, "criterionId", newValue ? newValue.criterionId : ""); }}
                              renderInput={(params) => (<TextField {...params} label="Chọn tiêu chí đánh giá" />)}
                            />
                            <TextField fullWidth label="Điểm số" type="number" inputProps={{ step: "0.1", min: "0" }} value={item.score} onChange={(e) => handleResultChange(index, "score", e.target.value)} />
                            <TextField fullWidth label="Nhận xét" multiline rows={2} value={item.comments} onChange={(e) => handleResultChange(index, "comments", e.target.value)} />
                            
                            {!editingResult && (
                              <Box sx={{ textAlign: 'right' }}>
                                <Button color="error" startIcon={<DeleteIcon />} onClick={() => handleRemoveResultRow(index)} disabled={formData.results.length === 1} sx={{ fontWeight: 'bold' }}>
                                  Xóa
                                </Button>
                              </Box>
                            )}
                          </Stack>
                        </Paper>
                      ))}
                    </Stack>
                  </Box>
                </Box>

                <Box sx={{ p: 3, pt: 0, display: 'flex', gap: 2, bgcolor: '#fff', borderTop: '1px solid #eee', mt: 2 }}>
                  <Button fullWidth variant="outlined" color="inherit" onClick={handleCloseModal} sx={{ borderRadius: 2, py: 1.5 }}>Hủy bỏ</Button>
                  <Button fullWidth variant="contained" onClick={handleSave} disabled={loading} sx={{ borderRadius: 2, py: 1.5, boxShadow: '0 8px 16px rgba(25, 118, 210, 0.2)' }}>
                    {loading ? "Đang lưu..." : "Lưu Kết Quả"}
                  </Button>
                </Box>
              </Paper>
            </motion.div>
          )}
        </AnimatePresence>
      </Modal>

    </Box>
  );
};

export default AssessmentResultsManagement;