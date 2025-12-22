import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Avatar, 
  IconButton, 
  Button, 
  TextField, 
  Chip,
  Slider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
  alpha,
  Tooltip
} from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTrophy, 
  faCoins, 
  faChartLine, 
  faFileInvoiceDollar, 
  faPen, 
  faStar, 
  faMapMarkerAlt, 
  faCloudUploadAlt 
} from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../services/api';
import { ProfileSkeleton } from '../components/common/LoadingSkeleton';
import toast from 'react-hot-toast';

const Profile = () => {
  const { t, i18n } = useTranslation();
  const { updateUsername } = useAuth();
  const theme = useTheme();
  
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Dialog States
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAvatarDialogOpen, setIsAvatarDialogOpen] = useState(false);
  
  // Form States
  const [newUsername, setNewUsername] = useState('');
  const [updating, setUpdating] = useState(false);
  
  // Proximity State
  const [proximity, setProximity] = useState(1.0);
  const [originalProximity, setOriginalProximity] = useState(1.0);
  
  // Avatar Selection State
  const [selectedAvatarId, setSelectedAvatarId] = useState(1);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await userAPI.getProfile();
      if (response.errorStatus === 0) {
        setProfileData(response.result);
        
        // Initialize proximity
        const userProximity = response.result.preferredStoreProximity || 1.0;
        setProximity(userProximity);
        setOriginalProximity(userProximity);
        
        // Initialize avatar selection
        setSelectedAvatarId(response.result.userAvatarId || 1);
      } else {
        // Safe access to message object
        const msg = response.message?.[i18n.language] || response.message?.en || t('common.error');
        toast.error(msg, { duration: 3000, position: 'bottom-center' });
      }
    } catch (error) {
      console.error('Failed to fetch profile', error);
      toast.error(t('common.error'), { duration: 3000, position: 'bottom-center' });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUsername = async () => {
    if (!newUsername.trim()) return;
    
    setUpdating(true);
    try {
      const response = await userAPI.updateUsername(newUsername);
      
      if (response.errorStatus === 0) {
        const msg = response.message?.[i18n.language] || response.message?.en || t('common.save');
        toast.success(msg, { duration: 3000, position: 'bottom-center' });
        updateUsername(response.result.username);
        setProfileData(prev => ({ ...prev, username: response.result.username }));
        setIsEditDialogOpen(false);
      } else {
        const msg = response.message?.[i18n.language] || response.message?.en || t('common.error');
        toast.error(msg, { duration: 3000, position: 'bottom-center' });
      }
    } catch (error) {
      console.error('Failed to update username', error);
      toast.error(t('common.error'), { duration: 3000, position: 'bottom-center' });
    } finally {
      setUpdating(false);
    }
  };

  const handleUpdateProximity = async () => {
    setUpdating(true);
    try {
      const response = await userAPI.updatePreferredStoreProximity(proximity);
      
      if (response.errorStatus === 0) {
        const msg = response.message?.[i18n.language] || response.message?.en || t('common.save');
        toast.success(msg, { duration: 3000, position: 'bottom-center' });
        setProfileData(prev => ({ ...prev, preferredStoreProximity: proximity }));
        setOriginalProximity(proximity);
      } else {
        const msg = response.message?.[i18n.language] || response.message?.en || t('common.error');
        toast.error(msg, { duration: 3000, position: 'bottom-center' });
      }
    } catch (error) {
      console.error('Failed to update proximity', error);
      toast.error(t('common.error'), { duration: 3000, position: 'bottom-center' });
    } finally {
      setUpdating(false);
    }
  };

  const handleUpdateAvatar = async () => {
    setUpdating(true);
    try {
      const response = await userAPI.updateUserAvatarId(selectedAvatarId);
      
      if (response.errorStatus === 0) {
        const msg = response.message?.[i18n.language] || response.message?.en || t('common.save');
        toast.success(msg, { duration: 3000, position: 'bottom-center' });
        setProfileData(prev => ({ ...prev, userAvatarId: selectedAvatarId }));
        setIsAvatarDialogOpen(false);
      } else {
        const msg = response.message?.[i18n.language] || response.message?.en || t('common.error');
        toast.error(msg, { duration: 3000, position: 'bottom-center' });
      }
    } catch (error) {
      console.error('Failed to update avatar', error);
      toast.error(t('common.error'), { duration: 3000, position: 'bottom-center' });
    } finally {
      setUpdating(false);
    }
  };

  const openEditDialog = () => {
    setNewUsername(profileData?.username || '');
    setIsEditDialogOpen(true);
  };

  const openAvatarDialog = () => {
    setSelectedAvatarId(profileData?.userAvatarId || 1);
    setIsAvatarDialogOpen(true);
  };

  const getRelativeTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    const rtf = new Intl.RelativeTimeFormat(i18n.language, { numeric: 'auto' });

    const seconds = Math.round(diffInSeconds);
    const minutes = Math.round(diffInSeconds / 60);
    const hours = Math.round(minutes / 60);
    const days = Math.round(hours / 24);
    const months = Math.round(days / 30.416);
    const years = Math.round(days / 365);

    if (Math.abs(seconds) < 60) return rtf.format(-seconds, 'second');
    if (Math.abs(minutes) < 60) return rtf.format(-minutes, 'minute');
    if (Math.abs(hours) < 24) return rtf.format(-hours, 'hour');
    if (Math.abs(days) < 30) return rtf.format(-days, 'day');
    if (Math.abs(months) < 12) return rtf.format(-months, 'month');
    return rtf.format(-years, 'year');
  };

  const formatDistance = (value) => {
    if (value >= 5) return '>5km';
    if (value <= 0.2) return '<200m';
    if (value < 1) return `${Math.round(value * 1000)}m`;
    return `${value}km`;
  };

  if (loading) {
    return (
      <Box sx={{ p: 3, maxWidth: '800px', mx: 'auto' }}>
        <ProfileSkeleton />
      </Box>
    );
  }

  if (!profileData) return null;
  
  const marks = [
    { value: 0.2, label: '<200m' },
    { value: 1.0, label: '1km' },
    { value: 2.0, label: '2km' },
    { value: 3.0, label: '3km' },
    { value: 4.0, label: '4km' },
    { value: 5.0, label: '>5km' },
  ];

  const avatars = [1, 2, 3, 4, 5, 6, 7, 8];

  return (
    <Box sx={{ p: 3, maxWidth: '800px', mx: 'auto', display: 'flex', flexDirection: 'column', gap: 3, pb: 10 }}>
      {/* Header Section */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: 3, 
          borderRadius: 4, 
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', 
          textAlign: 'center', 
          position: 'relative'
        }}
      >
        <Box sx={{ position: 'relative', display: 'inline-block' }}>
          <Avatar 
            src={`/avatars/${profileData.userAvatarId}.png`}
            key={profileData.userAvatarId}
            sx={{ 
              width: 100, 
              height: 100, 
              mx: 'auto', 
              mb: 2, 
              bgcolor: 'white', 
              boxShadow: 3,
              border: `4px solid ${theme.palette.background.paper}`
            }}
          />
          <IconButton 
            size="small" 
            onClick={openAvatarDialog}
            sx={{ 
              position: 'absolute', 
              bottom: 16, 
              right: -4, 
              bgcolor: 'white', 
              boxShadow: 2,
              '&:hover': { bgcolor: '#f0f0f0' } 
            }}
          >
            <FontAwesomeIcon icon={faPen} size="xs" color={theme.palette.text.secondary} />
          </IconButton>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 0.5 }}>
          <Typography variant="h4" fontWeight="bold" color="text.primary">
            {profileData.username}
          </Typography>
          <IconButton size="small" onClick={openEditDialog} sx={{ bgcolor: alpha(theme.palette.common.white, 0.6), '&:hover': { bgcolor: alpha(theme.palette.common.white, 1) } }}>
            <FontAwesomeIcon icon={faPen} size="xs" />
          </IconButton>
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
          <Typography variant="body2" color="text.secondary">
             {t('profile.joinedAt')} {getRelativeTime(profileData.joinedAt)}
          </Typography>
          <Chip 
            icon={<FontAwesomeIcon icon={faStar} style={{ color: '#FFD700' }} />} 
            label={`${profileData.userRating} / 5`}
            size="small"
            sx={{ bgcolor: 'rgba(255, 255, 255, 0.8)', fontWeight: 'bold' }}
          />
        </Box>
      </Paper>

      {/* Gamified Stats Grid */}
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2} sx={{ height: '100%' }} alignItems="stretch">
          <Grid item xs={12} sm={6} sx={{ display: 'flex' }}>
            <StatCard 
              icon={faTrophy} 
              color="#f1c40f" 
              title={t('profile.rankScore')} 
              value={profileData.rankScore}
              subtitle={profileData.lastRankIncrement > 0 ? `+${profileData.lastRankIncrement}` : null}
              subtitleLabel={profileData.lastRankIncrement > 0 ? t('profile.points') : null}
            />
          </Grid>
          <Grid item xs={12} sm={6} sx={{ display: 'flex' }}>
            <StatCard 
              icon={faCoins} 
              color="#2ecc71" 
              title={t('profile.estimatedSavings')} 
              value={`¥${profileData.estimatedTotalSavings.toLocaleString()}`}
              monthlyValue={profileData.monthlyStats.savings > 0 ? `¥${profileData.monthlyStats.savings.toLocaleString()}` : null}
              monthlyLabel={profileData.monthlyStats.savings > 0 ? t('profile.thisMonth') : null}
            />
          </Grid>
          <Grid item xs={12} sm={6} sx={{ display: 'flex' }}>
            <StatCard 
              icon={faFileInvoiceDollar} 
              color="#3498db" 
              title={t('profile.contributions')} 
              value={profileData.totalContributions} 
              monthlyValue={profileData.monthlyStats.contributions > 0 ? `${profileData.monthlyStats.contributions}` : null}
              monthlyLabel={profileData.monthlyStats.contributions > 0 ? t('profile.thisMonth') : null}
            />
          </Grid>
          <Grid item xs={12} sm={6} sx={{ display: 'flex' }}>
            <StatCard 
              icon={faChartLine} 
              color="#e74c3c" 
              title={t('profile.expenditure')} 
              value={`¥${profileData.totalExpenditure.toLocaleString()}`}
              monthlyValue={profileData.monthlyStats.expenditure > 0 ? `¥${profileData.monthlyStats.expenditure.toLocaleString()}` : null}
              monthlyLabel={profileData.monthlyStats.expenditure > 0 ? t('profile.thisMonth') : null}
            />
          </Grid>
        </Grid>
      </Box>

      {/* Preferences Section - Styled to match StatCards */}
      <Paper 
        sx={{ 
          p: 3, 
          borderRadius: 3, 
          position: 'relative',
          overflow: 'hidden',
          transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: theme.shadows[3]
          }
        }}
      >
        {/* Decorative Watermark */}
        <Box sx={{ position: 'absolute', right: -15, top: -15, opacity: 0.05, transform: 'rotate(15deg)' }}>
          <FontAwesomeIcon icon={faMapMarkerAlt} size="8x" color={theme.palette.secondary.main} />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1, position: 'relative', zIndex: 1 }}>
          <Box sx={{ 
            bgcolor: alpha(theme.palette.secondary.main, 0.1), 
            p: 1, 
            borderRadius: '50%', 
            display: 'flex', 
            width: 36, 
            height: 36, 
            alignItems: 'center', 
            justifyContent: 'center' 
          }}>
            <FontAwesomeIcon icon={faMapMarkerAlt} style={{ color: theme.palette.secondary.main, fontSize: '1rem' }} />
          </Box>
          <Typography variant="h6" fontWeight="bold">{t('profile.proximity')}</Typography>
        </Box>
        
        <Box sx={{ px: { xs: 3, sm: 5 }, py: 4, position: 'relative', zIndex: 1 }}>
          <Slider
            value={proximity}
            onChange={(e, val) => setProximity(val)}
            step={0.1}
            marks={marks}
            min={0.2}
            max={5.0}
            valueLabelDisplay="auto"
            valueLabelFormat={formatDistance}
            sx={{
              color: 'secondary.main',
              height: 8,
              '&.MuiSlider-marked': {
                marginBottom: 0
              },
              '& .MuiSlider-track': { border: 'none' },
              '& .MuiSlider-thumb': {
                height: 24,
                width: 24,
                backgroundColor: '#fff',
                border: '2px solid currentColor',
                '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
                  boxShadow: 'inherit',
                },
                '&:before': { display: 'none' },
              },
              '& .MuiSlider-mark': {
                display: 'none' 
              },
              '& .MuiSlider-markLabel': {
                fontSize: { xs: '0.65rem', sm: '0.8rem' },
                mt: 1,
                // Removed display: 'none' for xs to show marks on mobile
              }
            }}
          />
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', position: 'relative', zIndex: 1 }}>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleUpdateProximity}
            disabled={updating || proximity === originalProximity}
            sx={{ minWidth: 100 }}
          >
            {updating ? t('common.loading') : t('profile.update')}
          </Button>
        </Box>
      </Paper>

      {/* Edit Username Dialog */}
      <Dialog 
        open={isEditDialogOpen} 
        onClose={() => !updating && setIsEditDialogOpen(false)} 
        fullWidth 
        maxWidth="xs"
      >
        <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold' }}>
          {t('profile.editUsername')}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <TextField
              fullWidth
              label={t('profile.usernameLabel')}
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              variant="outlined"
              autoFocus
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, justifyContent: 'center' }}>
          <Button onClick={() => setIsEditDialogOpen(false)} disabled={updating} color="inherit">
            {t('common.cancel')}
          </Button>
          <Button 
            variant="contained" 
            color="secondary" 
            onClick={handleUpdateUsername} 
            disabled={updating || !newUsername.trim() || newUsername === profileData.username}
          >
            {updating ? t('common.loading') : t('common.save')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Avatar Selection Dialog */}
      <Dialog 
        open={isAvatarDialogOpen} 
        onClose={() => !updating && setIsAvatarDialogOpen(false)} 
        fullWidth 
        maxWidth="sm"
      >
        <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold' }}>
          {t('profile.selectAvatar')}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={{ xs: 1, sm: 2 }} sx={{ p: 1 }}>
            {avatars.map((id) => (
              <Grid item xs={4} sm={3} key={id} sx={{ display: 'flex', justifyContent: 'center' }}>
                <Box
                  onClick={() => setSelectedAvatarId(id)}
                  sx={{
                    cursor: 'pointer',
                    p: { xs: 0.5, sm: 1 }, 
                    borderRadius: 2,
                    border: selectedAvatarId === id ? `3px solid ${theme.palette.secondary.main}` : '3px solid transparent',
                    transition: 'all 0.2s',
                    '&:hover': {
                      bgcolor: alpha(theme.palette.secondary.main, 0.05),
                      transform: 'scale(1.05)'
                    }
                  }}
                >
                  <Avatar 
                    src={`/avatars/${id}.png`} 
                    sx={{ 
                      width: { xs: 50, sm: 64 }, 
                      height: { xs: 50, sm: 64 }, 
                      bgcolor: 'transparent' 
                    }} 
                  />
                </Box>
              </Grid>
            ))}
            {/* Disabled Upload Option */}
            <Grid item xs={4} sm={3} sx={{ display: 'flex', justifyContent: 'center' }}>
               <Tooltip title={t('profile.customUploadComingSoon')}>
                  <Box
                    sx={{
                      p: { xs: 0.5, sm: 1 },
                      borderRadius: 2,
                      border: '3px solid transparent',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '100%',
                      opacity: 0.5,
                      cursor: 'not-allowed'
                    }}
                  >
                    <Box sx={{ 
                        width: { xs: 50, sm: 64 }, 
                        height: { xs: 50, sm: 64 }, 
                        borderRadius: '50%', 
                        bgcolor: theme.palette.grey[200],
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                      <FontAwesomeIcon icon={faCloudUploadAlt} size="lg" color={theme.palette.grey[500]} />
                    </Box>
                  </Box>
               </Tooltip>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, justifyContent: 'center' }}>
          <Button onClick={() => setIsAvatarDialogOpen(false)} disabled={updating} color="inherit">
            {t('common.cancel')}
          </Button>
          <Button 
            variant="contained" 
            color="secondary" 
            onClick={handleUpdateAvatar} 
            disabled={updating || selectedAvatarId === profileData.userAvatarId}
          >
            {updating ? t('common.loading') : t('common.save')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

const StatCard = ({ icon, color, title, value, subtitle, subtitleLabel, monthlyValue, monthlyLabel }) => {
  const theme = useTheme();
  return (
    <Paper 
      sx={{ 
        p: 2, 
        width: '100%', 
        height: '100%', 
        borderRadius: 3, 
        display: 'flex', 
        flexDirection: 'column', 
        position: 'relative', 
        overflow: 'hidden', 
        minHeight: '140px',
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[4]
        }
      }}
    >
      <Box sx={{ position: 'absolute', right: -15, top: -15, opacity: 0.1, transform: 'rotate(15deg)' }}>
         <FontAwesomeIcon icon={icon} size="5x" color={color} />
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
        <Box sx={{ bgcolor: alpha(color, 0.1), p: 1, borderRadius: '50%', display: 'flex', width: 36, height: 36, alignItems: 'center', justifyContent: 'center' }}>
          <FontAwesomeIcon icon={icon} color={color} size="sm" />
        </Box>
        <Typography variant="subtitle2" color="text.secondary" fontWeight="600">{title}</Typography>
      </Box>
      
      <Box sx={{ mt: 'auto' }}>
        <Typography variant="h4" fontWeight="bold" sx={{ lineHeight: 1.2 }}>{value}</Typography>
        
        {subtitle && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
             <Typography variant="caption" color="success.main" fontWeight="700">
               {subtitle}
             </Typography>
             {subtitleLabel && (
               <Typography variant="caption" color="text.secondary">
                 {subtitleLabel}
               </Typography>
             )}
          </Box>
        )}

        {monthlyValue && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
            <Typography variant="caption" color="success.main" fontWeight="700">
              {monthlyValue}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {monthlyLabel}
            </Typography>
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default Profile;