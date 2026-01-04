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
  Chip,
  IconButton
} from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCamera,
  faTrophy,
  faReceipt,
  faCheckCircle,
  faExclamationCircle,
  faCrown,
  faCropSimple,
  faTimes,
  faGlassCheers
} from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import { leaderboardAPI, productAPI, userAPI } from '../services/api';
import toast from 'react-hot-toast';
import { ListSkeleton } from '../components/common/LoadingSkeleton';
import imageCompression from 'browser-image-compression';

// Radix UI Dialog
import * as Dialog from '@radix-ui/react-dialog';

// React Image Crop
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

// Helper to create the initial crop area (centered, 90% of image)
function centerAspectCrop(mediaWidth, mediaHeight, aspect) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  )
}

const Upload = () => {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const fileInputRef = useRef(null);
  
  // Data State
  const [leaderboard, setLeaderboard] = useState([]);
  const [userStats, setUserStats] = useState(null);
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(true);
  const [receipts, setReceipts] = useState([]);
  const [loadingReceipts, setLoadingReceipts] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  
  // Upload & Crop State
  const [uploading, setUploading] = useState(false);
  const [imgSrc, setImgSrc] = useState('');
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState(null);
  const [cropDialogOpen, setCropDialogOpen] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    fetchLeaderboard();
  }, [i18n.language]);

  useEffect(() => {
    fetchReceipts(selectedMonth);
  }, [selectedMonth]);

  const fetchLeaderboard = async () => {
    try {
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

  // 1. Handle File Selection -> Open Crop Dialog
  const handleFileChange = (event) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      if (!file.type.startsWith('image/')) {
        toast.error(t('upload.imageOnlyError'), { duration: 3000, position: 'bottom-center' });
        return;
      }
      
      setCrop(undefined); // Reset crop
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setImgSrc(reader.result.toString() || '');
        setCropDialogOpen(true);
      });
      reader.readAsDataURL(file);
      
      // Reset input to allow re-selecting same file
      event.target.value = ''; 
    }
  };

  // 2. Initialize Crop when image loads in Dialog
  function onImageLoad(e) {
    const { width, height } = e.currentTarget;
    const initialCrop = centerAspectCrop(width, height, 0); 
    setCrop({
        unit: '%',
        width: 90,
        height: 90,
        x: 5,
        y: 5
    });
  }

  // 3. Generate Cropped Blob using Canvas
  const getCroppedImg = (image, crop) => {
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    
    canvas.width = crop.width * scaleX;
    canvas.height = crop.height * scaleY;
    
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingQuality = 'high';

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width * scaleX,
      crop.height * scaleY
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Canvas is empty'));
            return;
          }
          blob.name = 'cropped_receipt.jpg';
          resolve(blob);
        },
        'image/jpeg',
        1 
      );
    });
  };

  // 4. Confirm Crop -> Compress -> Upload
  const handleCropConfirm = async () => {
    if (!imgRef.current || !completedCrop) {
        toast.error(t('common.error'), { position: 'bottom-center' });
        return;
    }

    try {
        setUploading(true);
        setCropDialogOpen(false); 

        // A. Get Blob from Canvas
        const croppedBlob = await getCroppedImg(imgRef.current, completedCrop);

        // B. Compress (WebP, 1500px, 1MB)
        const options = {
            maxSizeMB: 1,
            maxWidthOrHeight: 1500,
            useWebWorker: true,
            fileType: 'image/webp',
            initialQuality: 0.8,
        };
        
        const compressedFile = await imageCompression(croppedBlob, options);

        // C. Upload
        const response = await productAPI.uploadReceipt(compressedFile);

        if (response.errorStatus === 0) {
            const successMsg = response.message?.[i18n.language] || response.message?.en || t('upload.success');
            toast.success(successMsg, { duration: 3000, position: 'bottom-center' });
            setTimeout(() => {
                fetchReceipts(selectedMonth);
                fetchLeaderboard();
            }, 500);
        } else {
            const errorMsg = response.message?.[i18n.language] || response.message?.en || t('common.error');
            toast.error(errorMsg, { duration: 3000, position: 'bottom-center' });
            setTimeout(() => {
              fetchReceipts(selectedMonth);
            }, 500);
        }

    } catch (error) {
        console.error('Crop/Upload error', error);
        const errorMsg = error.response?.data?.message?.[i18n.language] || 
                       error.response?.data?.message?.en || 
                       t('common.error');
        toast.error(errorMsg, { duration: 3000, position: 'bottom-center' });
    } finally {
        setUploading(false);
    }
  };

  const handleCloseDialog = () => {
      setCropDialogOpen(false);
      setImgSrc('');
  };

  const handleOpenChangeWrapper = (isOpen) => {
    if (!isOpen && !uploading) {
      handleCloseDialog();
    }
  };

  // Helpers for Render
  const getRankColor = (index) => {
    switch(index) {
      case 0: return '#FFD700'; 
      case 1: return '#C0C0C0'; 
      case 2: return '#CD7F32'; 
      default: return theme.palette.grey[400];
    }
  };

  const getRankHeight = (index) => {
    switch(index) {
      case 0: return 160; 
      case 1: return 130;
      case 2: return 110;
      default: return 100;
    }
  };

  const podiumOrder = [1, 0, 2]; 

  // 1. Define Ribbon Colors
  const ribbonMainColor = userStats?.rank ? theme.palette.secondary.main : theme.palette.grey[400];
  const ribbonEndColor = userStats?.rank ? theme.palette.secondary.dark : theme.palette.grey[600];
  const ribbonFoldColor = userStats?.rank ? '#a12d22' : theme.palette.grey[700];

  // 2. Compact Ribbon Style (Dimensions matched to previous element)
  const ribbonStyle = {
    position: 'relative',
    margin: '0 auto',
    padding: '8px 32px', // Similar to px: 3, py: 1
    textAlign: 'center',
    backgroundColor: ribbonMainColor,
    color: 'white',
    width: 'fit-content',
    minWidth: '200px', // Reduced width
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
    transition: 'all 0.3s ease',
    borderRadius: '2px', // Slight rounding for softness
    
    // Ribbon Ends
    '&::before, &::after': {
      content: '""',
      width: '40px', // Smaller tails
      height: '100%',
      backgroundColor: ribbonEndColor,
      position: 'absolute',
      zIndex: -1,
      top: '10px', // Adjusted offset for smaller height
      clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%, 25% 50%)',
      
      // Fold
      backgroundImage: `linear-gradient(45deg, transparent 50%, ${ribbonFoldColor} 50%)`,
      backgroundSize: '10px 10px', // Smaller fold
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'bottom right',
    },
    
    '&::before': {
      left: '-25px', // Tucked closer
    },
    
    '&::after': {
      right: '-25px',
      transform: 'scaleX(-1)',
    }
  };

  return (
    <Container maxWidth="lg" sx={{ pb: 8, pt: 4 }}>
      
      {/* Leaderboard Section */}
      <Box sx={{ mb: 8 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 5, textAlign: 'center' }}>
          <Box sx={{ 
            width: { xs: 40, sm: 50 }, 
            height: { xs: 40, sm: 50 }, 
            borderRadius: '50%', 
            bgcolor: alpha(theme.palette.secondary.main, 0.1), 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            mr: 2 
          }}>
            <FontAwesomeIcon icon={faTrophy} style={{ fontSize: { xs: '1.25rem', sm: '1.5rem' }, color: theme.palette.secondary.main }} size="lg" />
          </Box>
          <Box sx={{ textAlign: 'left' }}>
            <Typography variant="h4" fontWeight={800} color="text.primary" sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }}>
              {t('upload.leaderboardTitle')}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {t('upload.leaderboardSubtitle')}
            </Typography>
          </Box>
        </Box>

        {loadingLeaderboard ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', height: 200, alignItems: 'center' }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box>
            {leaderboard.length === 0 ? (
              <Box sx={{ textAlign: 'center', color: 'text.secondary' }}>
                <Typography>{t('profile.noLeaderboard')}</Typography>
              </Box>
            ) : (
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
                  if (!user) return <Box key={`placeholder-${positionIndex}`} sx={{ width: { xs: '30%', sm: 140 } }} />;

                  const isFirst = positionIndex === 0;
                  const height = getRankHeight(positionIndex);
                  const color = getRankColor(positionIndex);
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
                      '&:hover': { transform: 'translateY(-5px)' }
                    }}>
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
                              width: { xs: 70, sm: 90 }, 
                              height: { xs: 70, sm: 90 }, 
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
                            border: `1px solid ${theme.palette.divider}`,
                            whiteSpace: 'nowrap'
                          }}>
                            <Typography variant="caption" fontWeight={800} color="text.secondary">
                              {user.score} <Typography component="span" variant="caption" sx={{ fontSize: '0.7em' }}>{t('upload.contributions')}</Typography>
                            </Typography>
                          </Box>
                      </Box>
                      <Typography variant="subtitle2" fontWeight={700} noWrap sx={{ maxWidth: '100%', mb: 1, textAlign: 'center' }}>
                        {user.username}
                      </Typography>
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
            )}

            {userStats && (
              <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4, mb: 2, display: 'flex', justifyContent: 'center' }}>
                 <Box sx={ribbonStyle}>
                    
                    {/* Rank Content */}
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1.5 }}>
                        {userStats.rank ? (
                          <>
                             <FontAwesomeIcon icon={faGlassCheers} style={{ color: '#FFD700', fontSize: '1.1rem' }} />
                             <Typography variant="subtitle1" fontWeight={700} sx={{ lineHeight: 1 }}>
                               {t('upload.yourRank')}:
                             </Typography>
                             <Typography variant="h5" fontWeight={800} sx={{ lineHeight: 1, textShadow: '0 1px 2px rgba(0,0,0,0.2)' }}>
                               #{userStats.rank}
                             </Typography>
                          </>
                        ) : (
                          <Typography variant="subtitle1" fontWeight={700}>
                             {t('upload.unranked')}
                          </Typography>
                        )}
                    </Box>

                    {/* Milestone Message - Compact */}
                    {userStats.nextMilestone && (
                       <Box sx={{ 
                          mt: 0.5, 
                          pt: 0.5,
                          width: '100%'
                       }}>
                          <Typography variant="caption" sx={{ fontStyle: 'italic', fontWeight: 500, fontSize: '0.75rem', opacity: 0.9 }}>
                            {userStats.nextMilestone[i18n.language] || userStats.nextMilestone.en}
                          </Typography>
                       </Box>
                    )}
                 </Box>
              </Box>
            )}
          </Box>
        )}
      </Box>

      {/* Contribute Section */}
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
          <Typography variant="h4" fontWeight={800} sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }} gutterBottom>
            {t('upload.contributeTitle')}
          </Typography>
          <Typography variant="body1" sx={{ mb: 4, opacity: 0.9, lineHeight: 1.6 }}>
            {t('upload.contributeSubtitle')}
          </Typography>

          <input
            type="file"
            accept="image/*"
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

      {/* History Section */}
      <Box>
         <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3, flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 5 }} >
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
                 <FontAwesomeIcon icon={faReceipt} style={{ color: theme.palette.secondary.main, fontSize: { xs: '1.25rem', sm: '1.5rem' } }} size="lg" />
               </Box>
               <Typography variant="h4" fontWeight={700} sx={{ fontSize: { xs: '1.5rem', sm: '2rem' }, textAlign: 'left' }}>
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
                  const resultMsgObj = receipt.result?.message;
                  const messageText = resultMsgObj?.[i18n.language] || resultMsgObj?.en || '';
                  
                  return (
                    <Card key={index} sx={{ 
                       borderRadius: 2, 
                       borderLeft: `5px solid ${isSuccess ? theme.palette.success.main : theme.palette.error.main}`,
                       boxShadow: 1
                    }}>
                      <CardContent sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'stretch', md: 'center' }, justifyContent: 'space-between', py: 2, '&:last-child': { pb: 2 } }}>
                         <Grid container spacing={2} alignItems="center" sx={{ width: { xs: '100%', md: '50%' }, minWidth: { md: '50%' }}}>
                            <Grid sx={{ textAlign: 'center' }}>
                               <FontAwesomeIcon 
                                 icon={isSuccess ? faCheckCircle : faExclamationCircle} 
                                 size="lg"
                                 color={isSuccess ? theme.palette.success.main : theme.palette.error.main}
                               />
                            </Grid>
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
                          </Grid>
                          {isSuccess && (
                            <Grid container spacing={2} alignItems="center" sx={{ mt: { xs: 1, md: 0 }, justifyContent: { xs: 'center', md: 'end' }, width: { xs: '100%', md: '50%' }, minWidth: { md: '50%' } }}>
                              <Grid> 
                                <Chip 
                                  label={t('upload.productsFound', { count: receipt.productsFound })} 
                                  size="small" 
                                  sx={{ fontSize: '0.75rem' }} 
                                />
                              </Grid>
                              <Grid>
                                <Chip 
                                  label={`¥${receipt.totalAmount?.toLocaleString()}`} 
                                  color="success" 
                                  variant="outlined" 
                                  size="small" 
                                  sx={{ fontWeight: 700, mr: 1 }} 
                                />
                              </Grid>
                            </Grid>
                          )}
                      </CardContent>
                    </Card>
                  );
                })}
              </Box>
            )}
         </Paper>
      </Box>

      {/* Radix UI Crop Dialog */}
      <Dialog.Root open={cropDialogOpen} onOpenChange={handleOpenChangeWrapper}>
        <Dialog.Portal>
          <Dialog.Overlay
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              zIndex: 9998,
              backdropFilter: 'blur(4px)',
              animation: 'fadeIn 0.3s ease-out',
            }}
          />
          <Dialog.Content
            aria-describedby={undefined}
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '90vw',
              maxWidth: '600px',
              maxHeight: '90vh',
              zIndex: 9999,
              backgroundColor: 'white',
              borderRadius: '16px',
              padding: '24px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
              animation: 'slideUp 0.3s ease-out',
              overflowY: 'auto'
            }}
          >
            <Box sx={{ position: 'relative' }}>
                {/* Title */}
                <Dialog.Title asChild>
                   <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, pb: 0.5 }}>
                       <FontAwesomeIcon icon={faCropSimple} />
                       <Typography variant="h6" fontWeight={800}>
                          {t('upload.edit') || "Edit Image"}
                       </Typography>
                   </Box>
                </Dialog.Title>

                {/* Crop Content */}
                <Box sx={{ mt: 3, mb: 3, display: 'flex', justifyContent: 'center', bgcolor: '#f5f5f5', p: 1 }}>
                    {!!imgSrc && (
                        <ReactCrop
                            crop={crop}
                            onChange={(_, percentCrop) => setCrop(percentCrop)}
                            onComplete={(c) => setCompletedCrop(c)}
                            aspect={undefined}
                        >
                            <img
                                ref={imgRef}
                                alt="Crop me"
                                src={imgSrc}
                                onLoad={onImageLoad}
                                style={{ maxWidth: '100%', maxHeight: '50vh', display: 'block' }}
                            />
                        </ReactCrop>
                    )}
                </Box>

                {/* Actions */}
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
                     <Button 
                        onClick={handleCloseDialog} 
                        color="inherit" 
                        disabled={uploading}
                        sx={{ fontWeight: 600, textTransform: 'none', borderRadius: 2 }}
                     >
                         {t('common.cancel')}
                     </Button>
                     <Button 
                        onClick={handleCropConfirm} 
                        variant="contained" 
                        color="secondary"
                        disabled={uploading}
                        startIcon={<FontAwesomeIcon icon={faCheckCircle} />}
                        sx={{ px: 3, borderRadius: 2, fontWeight: 700, textTransform: 'none', boxShadow: 4 }}
                    >
                         {t('upload.submit')}
                     </Button>
                </Box>
            </Box>
            <style>{`@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } } @keyframes slideUp { from { opacity: 0; transform: translate(-50%, -45%); } to { opacity: 1; transform: translate(-50%, -50%); } }`}</style>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

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