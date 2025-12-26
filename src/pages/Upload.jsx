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
import imageCompression from 'browser-image-compression';

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
      toast.error(t('common.error'), { duration: 3000, position: 'bottom-center' });
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
      toast.error(t('upload.imageOnlyError'), { duration: 3000, position: 'bottom-center' });
      return;
    }

    setUploading(true);

    try {
      // Compression options
      const options = {
        maxSizeMB: 1,              // Max size: 1MB
        maxWidthOrHeight: 1500,    // Max dimension: 1500px
        useWebWorker: true,
        fileType: 'image/webp',    // Convert to WebP
        initialQuality: 0.8,       // Quality: 80%
        // browser-image-compression automatically handles EXIF orientation
      };

      // Compress and resize image
      const compressedFile = await imageCompression(file, options);
      
      // Upload
      const response = await productAPI.uploadReceipt(compressedFile);
      
      if (response.errorStatus === 0) {
        // Success
        const successMsg = response.message?.[i18n.language] || response.message?.en || t('upload.success');
        toast.success(successMsg, { duration: 3000, position: 'bottom-center' });
        
        // Refresh data
        fetchReceipts(selectedMonth);
        fetchLeaderboard(); 
      } else {
        // Failure from API logic (e.g., unsupported store)
        const errorMsg = response.message?.[i18n.language] || response.message?.en || t('common.error');
        toast.error(errorMsg, { duration: 3000, position: 'bottom-center' });

        fetchReceipts(selectedMonth);
      }
    } catch (error) {
      console.error('Upload or Compression error', error);
      const errorMsg = error.response?.data?.message?.[i18n.language] || 
                       error.response?.data?.message?.en || 
                       t('common.error');
      toast.error(errorMsg, { duration: 3000, position: 'bottom-center' });
    } finally {
      setUploading(false);
      // Reset input so same file can be selected again if needed
      if (fileInputRef.current) fileInputRef.current.value = '';
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
            {/* Improved Podium */}
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'flex-end', 
              gap: { xs: 2, sm: 4 },
              mb: 6,
              minHeight: 280
            }}>
              {podiumOrder.map((positionIndex) => {
                const user = leaderboard[positionIndex];
                // Render placeholder if user doesn't exist to maintain layout
                if (!user) return <Box key={`placeholder-${positionIndex}`} sx={{ width: { xs: '30%', sm: 140 } }} />;

                const isFirst = positionIndex === 0;
                const height = getRankHeight(positionIndex);
                const color = getRankColor(positionIndex);
                
                // Podium gradients based on rank
                const gradient = isFirst 
                  ? 'linear-gradient(135deg, #FFD700 0%, #FDB931 100%)' 
                  : positionIndex === 1
                    ? 'linear-gradient(135deg, #E0E0E0 0%, #BDBDBD 100%)'
                    : 'linear-gradient(135deg, #CD7F32 0%, #A0522D 100%)';

                return (
                  <Box key={user.username} sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    width: { xs: '30%', sm: 140 },
                    position: 'relative',
                    zIndex: isFirst ? 2 : 1,
                    transition: 'transform 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                    }
                  }}>
                    {/* Avatar Container */}
                    <Box sx={{ position: 'relative', mb: 2 }}>
                        {isFirst && (
                          <Box sx={{ 
                            position: 'absolute',
                            top: -35,
                            left: '50%',
                            transform: 'translateX(-50%)',
                            color: '#FFD700', 
                            fontSize: '2rem',
                            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
                            animation: 'float 3s ease-in-out infinite' 
                          }}>
                            <FontAwesomeIcon icon={faCrown} />
                          </Box>
                        )}
                        <Avatar 
                          src={`/avatars/${user.avatarId}.png`}
                          sx={{ 
                            width: { xs: 60, sm: 80 }, 
                            height: { xs: 60, sm: 80 }, 
                            border: `4px solid white`,
                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                          }}
                        />
                        <Box sx={{
                          position: 'absolute',
                          bottom: -10,
                          left: '50%',
                          transform: 'translateX(-50%)',
                          bgcolor: 'white',
                          borderRadius: '12px',
                          px: 1,
                          py: 0.2,
                          boxShadow: 1,
                          border: `1px solid ${theme.palette.divider}`
                        }}>
                           <Typography variant="caption" fontWeight={800} color="text.secondary">
                             {user.score}
                           </Typography>
                        </Box>
                    </Box>
                    
                    <Typography variant="subtitle2" fontWeight={700} noWrap sx={{ maxWidth: '100%', mb: 1, textAlign: 'center' }}>
                      {user.username}
                    </Typography>

                    {/* Podium Block */}
                    <Paper elevation={3} sx={{ 
                      width: '100%', 
                      height: height, 
                      background: gradient, 
                      borderRadius: '16px 16px 0 0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: 900,
                      fontSize: '2.5rem',
                      textShadow: '0 2px 4px rgba(0,0,0,0.2)',
                      position: 'relative',
                      overflow: 'hidden'
                    }}>
                       {/* Decorative shimmer */}
                       <Box sx={{
                         position: 'absolute',
                         top: 0,
                         left: 0,
                         right: 0,
                         bottom: 0,
                         background: 'linear-gradient(45deg, rgba(255,255,255,0) 40%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0) 60%)',
                         transform: 'skewX(-20deg)',
                       }} />
                       {positionIndex + 1}
                    </Paper>
                  </Box>
                );
              })}
            </Box>

            {/* Improved User Stats / Milestone Card */}
            {/* User Stats / Milestone - Simplified */}
            {userStats && (
              <Box sx={{ 
                maxWidth: 600, 
                mx: 'auto', 
                mt: 4, 
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2
              }}>
                {/* Simple Rank Display */}
                <Box sx={{ 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  gap: 1.5,
                  bgcolor: alpha(theme.palette.primary.main, 0.08),
                  px: 3,
                  py: 1,
                  borderRadius: '50px',
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
                }}>
                   <FontAwesomeIcon icon={faTrophy} color={theme.palette.primary.main} size="sm" />
                   <Typography variant="subtitle1" fontWeight={700} color="primary.main">
                     {t('upload.yourRank')}: <Box component="span" sx={{ fontSize: '1.2em', fontWeight: 800 }}>#{userStats.rank}</Box>
                   </Typography>
                </Box>

                {/* Milestone Message - Clean Text */}
                {userStats.nextMilestone && (
                   <Typography variant="body1" color="text.secondary" sx={{ fontStyle: 'italic', maxWidth: '90%', fontSize: '0.95rem' }}>
                     "{userStats.nextMilestone[i18n.language] || userStats.nextMilestone.en}"
                   </Typography>
                )}
              </Box>
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