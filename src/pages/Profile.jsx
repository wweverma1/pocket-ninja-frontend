import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Grid, Avatar, IconButton, Button, TextField, Chip } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrophy, faCoins, faChartLine, faFileInvoiceDollar, faPen, faTimes, faStar } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../services/api';
import { ProfileSkeleton } from '../components/common/LoadingSkeleton';
import toast from 'react-hot-toast';
import * as Dialog from '@radix-ui/react-dialog';

const Profile = () => {
  const { t, i18n } = useTranslation();
  const { user, updateUsername } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Edit Dialog State
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await userAPI.getProfile();
      if (response.errorStatus === 0) {
        setProfileData(response.result);
      } else {
        toast.error(response.message[i18n.language] || response.message.en, { duration: 3000, position: 'bottom-center' });
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
      const response = await userAPI.updateProfile({ username: newUsername });
      
      if (response.errorStatus === 0) {
        toast.success(response.message[i18n.language] || response.message.en, { duration: 3000, position: 'bottom-center' });
        updateUsername(response.result.username);
        setProfileData(prev => ({ ...prev, username: response.result.username }));
        setIsEditDialogOpen(false);
      } else {
        toast.error(response.message[i18n.language] || response.message.en, { duration: 3000, position: 'bottom-center' });
      }
    } catch (error) {
      console.error('Failed to update username', error);
      toast.error(t('common.error'), { duration: 3000, position: 'bottom-center' });
    } finally {
      setUpdating(false);
    }
  };

  const openEditDialog = () => {
    setNewUsername(user?.username || '');
    setIsEditDialogOpen(true);
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

  if (loading) {
    return (
      <Box sx={{ p: 3, maxWidth: '800px', mx: 'auto' }}>
        <ProfileSkeleton />
      </Box>
    );
  }

  if (!profileData) return null;

  return (
    <Box sx={{ p: 3, maxWidth: '800px', mx: 'auto', display: 'flex', flexDirection: 'column', height: '100%', gap: 3 }}>
      {/* Header Section */}
      <Paper elevation={0} sx={{ p: 3, borderRadius: 4, background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', textAlign: 'center', position: 'relative' }}>
        <Box sx={{ position: 'relative', display: 'inline-block' }}>
          <Avatar sx={{ width: 90, height: 90, fontSize: '2.5rem', mx: 'auto', mb: 2, bgcolor: 'white', boxShadow: 3 }}>
            {user?.avatar || '🥷'}
          </Avatar>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 0.5 }}>
          <Typography variant="h4" fontWeight="bold" color="text.primary">
            {profileData.username}
          </Typography>
          <IconButton size="small" onClick={openEditDialog} sx={{ bgcolor: 'rgba(255,255,255,0.5)', '&:hover': { bgcolor: 'rgba(255,255,255,0.8)' } }}>
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
            sx={{ bgcolor: 'rgba(255, 255, 255, 0.6)', fontWeight: 'bold' }}
          />
        </Box>
      </Paper>

      {/* Gamified Stats Grid */}
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2} sx={{ height: '100%' }} alignItems="stretch">
          {/* Rank Score */}
          <Grid item xs={12} sm={6} sx={{ display: 'flex' }}>
            <StatCard 
              icon={faTrophy} 
              color="#f1c40f" 
              title={t('profile.rankScore')} 
              value={profileData.rankScore}
              subtitle={`+${profileData.lastRankIncrement}`}
            />
          </Grid>

          {/* Savings */}
          <Grid item xs={12} sm={6} sx={{ display: 'flex' }}>
            <StatCard 
              icon={faCoins} 
              color="#2ecc71" 
              title={t('profile.estimatedSavings')} 
              value={`¥${profileData.estimatedTotalSavings.toLocaleString()}`}
              monthlyValue={`¥${profileData.monthlyStats.savings.toLocaleString()}`}
              monthlyLabel={t('profile.thisMonth')}
            />
          </Grid>

          {/* Contributions */}
          <Grid item xs={12} sm={6} sx={{ display: 'flex' }}>
            <StatCard 
              icon={faFileInvoiceDollar} 
              color="#3498db" 
              title={t('profile.contributions')} 
              value={profileData.totalContributions} 
              monthlyValue={`${profileData.monthlyStats.contributions}`}
              monthlyLabel={t('profile.thisMonth')}
            />
          </Grid>

          {/* Expenditure */}
          <Grid item xs={12} sm={6} sx={{ display: 'flex' }}>
            <StatCard 
              icon={faChartLine} 
              color="#e74c3c" 
              title={t('profile.expenditure')} 
              value={`¥${profileData.totalExpenditure.toLocaleString()}`}
              monthlyValue={`¥${profileData.monthlyStats.expenditure.toLocaleString()}`}
              monthlyLabel={t('profile.thisMonth')}
            />
          </Grid>
        </Grid>
      </Box>

      {/* Edit Username Dialog */}
      <Dialog.Root open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <Dialog.Portal>
          <Dialog.Overlay
            style={{
              position: 'fixed', inset: 0, backgroundColor: 'rgba(0, 0, 0, 0.6)',
              zIndex: 9998, backdropFilter: 'blur(4px)', animation: 'fadeIn 0.3s ease-out',
            }}
          />
          <Dialog.Content
            style={{
              position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
              width: '90vw', maxWidth: '400px', maxHeight: '85vh', zIndex: 9999,
              backgroundColor: 'white', borderRadius: '16px', padding: '24px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)', animation: 'slideUp 0.3s ease-out',
            }}
          >
            <Box sx={{ position: 'relative' }}>
              <Dialog.Close asChild>
                <Button sx={{ position: 'absolute', top: -8, right: -8, minWidth: 'auto', width: 40, height: 40, borderRadius: '50%', color: 'text.secondary' }}>
                  <FontAwesomeIcon icon={faTimes} />
                </Button>
              </Dialog.Close>
              
              <Typography variant="h6" fontWeight="bold" gutterBottom textAlign="center">
                {t('profile.editUsername')}
              </Typography>
              
              <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  fullWidth
                  label={t('profile.usernameLabel')}
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  variant="outlined"
                  size="medium"
                />
                <Button 
                  variant="contained" 
                  color="secondary"
                  fullWidth 
                  onClick={handleUpdateUsername}
                  disabled={updating || !newUsername.trim()}
                  sx={{ py: 1.5, fontWeight: 600 }}
                >
                  {updating ? t('common.loading') : t('common.save')}
                </Button>
              </Box>
            </Box>
            <style>{`@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } } @keyframes slideUp { from { opacity: 0; transform: translate(-50%, -45%); } to { opacity: 1; transform: translate(-50%, -50%); } }`}</style>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </Box>
  );
};

const StatCard = ({ icon, color, title, value, subtitle, monthlyValue, monthlyLabel }) => (
  <Paper sx={{ p: 2, width: '100%', height: '100%', borderRadius: 3, display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden', minHeight: '140px' }}>
    <Box sx={{ position: 'absolute', right: -15, top: -15, opacity: 0.1, transform: 'rotate(15deg)' }}>
       <FontAwesomeIcon icon={icon} size="5x" color={color} />
    </Box>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
      <Box sx={{ bgcolor: `${color}20`, p: 1, borderRadius: '50%', display: 'flex', width: 36, height: 36, alignItems: 'center', justifyContent: 'center' }}>
        <FontAwesomeIcon icon={icon} color={color} size="sm" />
      </Box>
      <Typography variant="subtitle2" color="text.secondary" fontWeight="600">{title}</Typography>
    </Box>
    
    <Box sx={{ mt: 'auto' }}>
      <Typography variant="h4" fontWeight="bold" sx={{ lineHeight: 1.2 }}>{value}</Typography>
      
      {subtitle && (
        <Typography variant="caption" color="success.main" fontWeight="600" sx={{ display: 'block', mt: 0.5 }}>
          {subtitle}
        </Typography>
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

export default Profile;