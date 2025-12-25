import React, { useEffect, useState, useRef } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Grid,
  Avatar,
  Card,
  CardContent,
  CircularProgress,
  useTheme,
  alpha,
  TextField,
  Chip
} from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCamera,
  faTrophy,
  faReceipt,
  faCheckCircle,
  faExclamationCircle,
  faUpload,
  faCrown
} from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import { leaderboardAPI, productAPI, userAPI } from '../services/api';
import toast from 'react-hot-toast';
import { ListSkeleton } from '../components/common/LoadingSkeleton';

const Upload = () => {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const fileInputRef = useRef(null);

  const [leaderboard, setLeaderboard] = useState([]);
  const [userStats, setUserStats] = useState(null);
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(true);

  // History State
  const [receipts, setReceipts] = useState([]);
  const [loadingReceipts, setLoadingReceipts] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM
  
  // Upload State
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchLeaderboard();
  }, [i18n.language]);

  useEffect(() => {
    fetchReceipts(selectedMonth);
  }, [selectedMonth]);

  const fetchLeaderboard = async () => {
    try {
      // setLoadingLeaderboard(true); // Optional: keep old data while refreshing language
      const data = await leaderboardAPI.getLeaderboard();
      if (data.errorStatus === 0) {
        setLeaderboard(data.result.leaderboard || []);
        setUserStats(data.result.userStats || null);
      }
    } catch (error) {
      console.error('Failed to fetch leaderboard', error);
      toast.error(t('common.error'));
    } finally {
      setLoadingLeaderboard(false);
    }
  };

  const fetchReceipts = async (month) => {
    try {
      setLoadingReceipts(true);
      const data = await userAPI.getReceipts(month);
      if (data.errorStatus === 0) {
        setReceipts(data.result || []);
      } else {
        setReceipts([]);
      }
    } catch (error) {
      console.error('Failed to fetch receipts', error);
      // Don't show toast on 404/empty, just clear list
      setReceipts([]);
    } finally {
      setLoadingReceipts(false);
    }
  };

  const handleCameraClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Check if image
    if (!file.type.startsWith('image/')) {
      toast.error(t('upload.imageOnlyError'));
      return;
    }

    setUploading(true);
    const toastId = toast.loading(t('upload.processing'));

    try {
      // Convert to Base64
      const reader = new FileReader();
      reader.readAsDataURL(file);
      
      reader.onloadend = async () => {
        const base64String = reader.result;
        
        try {
          const response = await productAPI.uploadReceipt(base64String);
          
          if (response.errorStatus === 0) {
            // Success
            const successMsg = response.message?.[i18n.language] || response.message?.en || t('upload.success');
            toast.success(successMsg, { id: toastId });
            
            // Refresh data
            fetchReceipts(selectedMonth);
            fetchLeaderboard(); 
          } else {
            // Failure from API logic (e.g., unsupported store)
            const errorMsg = response.message?.[i18n.language] || response.message?.en || t('common.error');
            toast.error(errorMsg, { id: toastId });
          }
        } catch (apiError) {
          console.error('Upload API error', apiError);
          const errorMsg = apiError.response?.data?.message?.[i18n.language] || 
                           apiError.response?.data?.message?.en || 
                           t('common.error');
          toast.error(errorMsg, { id: toastId });
        } finally {
          setUploading(false);
          // Reset input so same file can be selected again if needed
          if (fileInputRef.current) fileInputRef.current.value = '';
        }
      };
      
      reader.onerror = () => {
        toast.error(t('common.error'), { id: toastId });
        setUploading(false);
      };

    } catch (e) {
      console.error('File reading error', e);
      toast.error(t('common.error'), { id: toastId });
      setUploading(false);
    }
  };

  const getRankColor = (index) => {
    switch(index) {
      case 0: return '#FFD700'; // Gold
      case 1: return '#C0C0C0'; // Silver
      case 2: return '#CD7F32'; // Bronze
      default: return theme.palette.grey[400];
    }
  };

  const getRankHeight = (index) => {
    // Podium visual steps
    switch(index) {
      case 0: return 160; 
      case 1: return 130;
      case 2: return 110;
      default: return 100;
    }
  };

  // Reorder for Podium: Silver (1) - Gold (0) - Bronze (2)
  const podiumOrder = [1, 0, 2]; 

  return (
    <Container maxWidth="lg" sx={{ pb: 8, pt: 4 }}>
      
      {/* 1. Leaderboard Section */}
      <Box sx={{ mb: 8 }}>
        <Box sx={{ textAlign: 'center', mb: 5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
            <Box sx={{ 
              p: 1.5, 
              borderRadius: '50%', 
              bgcolor: alpha(theme.palette.secondary.main, 0.1), 
              color: theme.palette.secondary.main,
              mr: 2
            }}>
              <FontAwesomeIcon icon={faTrophy} size="lg" />
            </Box>
            <Typography variant="h4" fontWeight={800} color="text.primary">
              {t('upload.leaderboardTitle')}
            </Typography>
          </Box>
          <Typography variant="body1" color="text.secondary">
            {t('upload.leaderboardSubtitle')}
          </Typography>
        </Box>

        {loadingLeaderboard ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', height: 200, alignItems: 'center' }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box>
            {/* Podium */}
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'flex-end', 
              gap: { xs: 1, sm: 3 },
              mb: 6,
              height: 250 // constrain height
            }}>
              {podiumOrder.map((positionIndex) => {
                const user = leaderboard[positionIndex];
                if (!user) return null; // Handle case where fewer than 3 users exist

                const isFirst = positionIndex === 0;
                const height = getRankHeight(positionIndex);
                const color = getRankColor(positionIndex);

                return (
                  <Box key={user.username} sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    width: { xs: '30%', sm: 140 },
                    position: 'relative'
                  }}>
                    {/* Crown for #1 */}
                    {isFirst && (
                       <Box sx={{ 
                         color: '#FFD700', 
                         mb: 1, 
                         fontSize: '1.5rem',
                         animation: 'float 3s ease-in-out infinite' 
                       }}>
                         <FontAwesomeIcon icon={faCrown} />
                       </Box>
                    )}
                    
                    <Avatar 
                      src={`/avatars/${user.avatarId}.png`}
                      sx={{ 
                        width: { xs: 50, sm: 70 }, 
                        height: { xs: 50, sm: 70 }, 
                        mb: 1,
                        border: `1px solid ${color}`,
                        boxShadow: `0 1px 1px ${alpha(color, 0.4)}`,
                        zIndex: 2
                      }}
                    />
                    <Typography variant="subtitle2" fontWeight={700} noWrap sx={{ maxWidth: '100%' }}>
                      {user.username}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ mb: 1 }}>
                       {user.score} {t('upload.points')}
                    </Typography>

                    {/* The Block */}
                    <Box sx={{ 
                      width: '100%', 
                      height: height, 
                      bgcolor: alpha(color, 0.2), 
                      borderTopLeftRadius: 8, 
                      borderTopRightRadius: 8,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: theme.palette.text.secondary,
                      fontWeight: 900,
                      fontSize: '2rem',
                      border: `1px solid ${alpha(color, 0.3)}`,
                      borderBottom: 'none'
                    }}>
                      {positionIndex + 1}
                    </Box>
                  </Box>
                );
              })}
            </Box>

            {/* User Stats / Milestone */}
            {userStats && (
              <Card sx={{ 
                maxWidth: 600, 
                mx: 'auto', 
                bgcolor: alpha(theme.palette.primary.main, 0.05),
                border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                boxShadow: 'none'
              }}>
                <CardContent sx={{ textAlign: 'center', py: 2 }}>
                  {userStats.rank > 3 && (
                    <Typography variant="h6" fontWeight={700} color="primary.main" gutterBottom>
                      {t('upload.yourRank')}: #{userStats.rank}
                    </Typography>
                  )}
                  {userStats.nextMilestone && (
                     <Typography variant="body1" fontWeight={500} sx={{ fontStyle: 'italic' }}>
                       "{userStats.nextMilestone[i18n.language] || userStats.nextMilestone.en}"
                     </Typography>
                  )}
                </CardContent>
              </Card>
            )}
          </Box>
        )}
      </Box>

      {/* 2. Contribute Section */}
      <Paper 
        elevation={0}
        sx={{ 
          p: { xs: 3, md: 5 }, 
          mb: 8, 
          borderRadius: 4, 
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.02)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
          border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
          borderLeft: `6px solid ${theme.palette.secondary.main}`,
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Box sx={{ position: 'absolute', top: -20, right: -20, opacity: 0.05, transform: 'rotate(15deg)' }}>
          <FontAwesomeIcon icon={faCamera} size="10x" />
        </Box>

        <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
          <Typography variant="h4" fontWeight={800} gutterBottom>
            {t('upload.contributeTitle')}
          </Typography>
          <Typography variant="body1" sx={{ mb: 4, opacity: 0.9, lineHeight: 1.6 }}>
            {t('upload.contributeSubtitle')}
          </Typography>

          <input
            type="file"
            accept="image/*"
            capture="environment"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />

          <Button
            variant="contained"
            color="secondary"
            size="large"
            onClick={handleCameraClick}
            disabled={uploading}
            startIcon={uploading ? <CircularProgress size={20} color="inherit" /> : <FontAwesomeIcon icon={faCamera} />}
            sx={{
              py: 1.5,
              px: 4,
              fontSize: '1.2rem',
              fontWeight: 700,
              borderRadius: 50,
              boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
              textTransform: 'none'
            }}
          >
            {uploading ? t('upload.uploading') : t('upload.snap')}
          </Button>
          
          <Typography variant="caption" display="block" sx={{ mt: 2, opacity: 0.7 }}>
             {t('upload.thankYouNote')}
          </Typography>
        </Container>
      </Paper>

      {/* 3. History Section */}
      <Box>
         <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3, flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
               <Box sx={{ 
                    width: { xs: 40, sm: 50 }, 
                    height: { xs: 40, sm: 50 }, 
                    borderRadius: '50%', 
                    backgroundColor: alpha(theme.palette.secondary.main, 0.1), 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    mr: 2 
                }}>
                 <FontAwesomeIcon icon={faReceipt} style={{ color: theme.palette.secondary.main }} size="lg" />
               </Box>
               <Typography variant="h5" fontWeight={700}>
                 {t('upload.historyTitle')}
               </Typography>
            </Box>
            
            <TextField
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              size="small"
              label={t('upload.selectMonth')}
              InputLabelProps={{ shrink: true }}
              sx={{ minWidth: 180, bgcolor: 'background.paper', borderRadius: 1 }}
            />
         </Box>

         <Paper 
            variant="outlined" 
            sx={{ 
              maxHeight: 500, 
              overflowY: 'auto', 
              bgcolor: '#fafafa',
              borderRadius: 3,
              p: 2
            }}
         >
            {loadingReceipts ? (
              <ListSkeleton count={3} />
            ) : receipts.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 6, color: 'text.secondary' }}>
                <FontAwesomeIcon icon={faReceipt} size="3x" style={{ opacity: 0.2, marginBottom: 16 }} />
                <Typography>{t('upload.noReceipts')}</Typography>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {receipts.map((receipt, index) => {
                  const isSuccess = receipt.status === 'SUCCESS';
                  // Handle message extraction based on the object structure from prompt
                  const resultMsgObj = receipt.result?.message;
                  const messageText = resultMsgObj?.[i18n.language] || resultMsgObj?.en || '';
                  
                  return (
                    <Card key={index} sx={{ 
                       borderRadius: 2, 
                       borderLeft: `5px solid ${isSuccess ? theme.palette.success.main : theme.palette.error.main}`,
                       boxShadow: 1
                    }}>
                      <CardContent sx={{ py: 2, '&:last-child': { pb: 2 } }}>
                         <Grid container spacing={2} alignItems="center">
                            {/* Icon */}
                            <Grid sx={{ textAlign: 'center' }}>
                               <FontAwesomeIcon 
                                 icon={isSuccess ? faCheckCircle : faExclamationCircle} 
                                 size="lg"
                                 color={isSuccess ? theme.palette.success.main : theme.palette.error.main}
                               />
                            </Grid>

                            {/* Info */}
                            <Grid>
                               <Typography variant="subtitle1" fontWeight={700}>
                                 {receipt.storeName || t('upload.unknownStore')}
                               </Typography>
                               <Typography variant="caption" color="text.secondary" display="block">
                                 {new Date(receipt.submittedAt).toLocaleString(i18n.language === 'en' ? 'en-GB' : i18n.language)}
                               </Typography>
                               <Typography variant="body2" sx={{ mt: 0.5, color: isSuccess ? 'text.primary' : 'error.main' }}>
                                  {messageText}
                               </Typography>
                            </Grid>
                            
                            {/* Stats */}
                            {isSuccess && (
                              <Grid sx={{ textAlign: { xs: 'left', sm: 'right' }, pl: { xs: 6, sm: 0 } }}>
                                 <Chip 
                                   label={`¥${receipt.totalAmount?.toLocaleString()}`} 
                                   color="success" 
                                   variant="outlined" 
                                   size="small" 
                                   sx={{ fontWeight: 700, mr: 1 }} 
                                 />
                                 <Chip 
                                   label={t('upload.productsFound', { count: receipt.productsFound })} 
                                   size="small" 
                                   sx={{ fontSize: '0.75rem' }} 
                                 />
                              </Grid>
                            )}
                         </Grid>
                      </CardContent>
                    </Card>
                  );
                })}
              </Box>
            )}
         </Paper>
      </Box>

      <style>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
          100% { transform: translateY(0px); }
        }
      `}</style>
    </Container>
  );
};

export default Upload;