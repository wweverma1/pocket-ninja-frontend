import React, { useState } from 'react';
import { Container, Box, Typography, TextField, Button, Paper, useTheme } from '@mui/material';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserNinja } from '@fortawesome/free-solid-svg-icons';

const Onboarding = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { user, login, isLoggedIn } = useAuth();
  const [username, setUsername] = useState(user?.username || '');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Route protection: Only logged in new users should be here
  if (!isLoggedIn || !user?.isNewUser) {
    return <Navigate to="/" replace />;
  }

  const handleOnboard = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Call Step 3 endpoint: POST /user/onboard
      await authAPI.onboard(username);
      
      // Update local state: isNewUser is now false
      login({ ...user, username, isNewUser: false });
      
      toast.success(t('onboarding.success'));
      navigate('/dashboard', { replace: true });
    } catch (error) {
      const errorMsg = error.response?.data?.message || t('onboarding.error');
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper elevation={3} sx={{ p: { xs: 3, sm: 6 }, textAlign: 'center', borderRadius: 4 }}>
        <Box 
          sx={{ 
            width: 80, 
            height: 80, 
            bgcolor: 'secondary.main', 
            color: 'white', 
            borderRadius: '50%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            mx: 'auto', 
            mb: 3 
          }}
        >
          <FontAwesomeIcon icon={faUserNinja} size="2x" />
        </Box>

        <Typography variant="h4" fontWeight={800} gutterBottom>
          {t('onboarding.title')}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          {t('onboarding.subtitle')}
        </Typography>

        <form onSubmit={handleOnboard}>
          <TextField
            fullWidth
            label={t('onboarding.placeholder')}
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={loading}
            sx={{ mb: 3 }}
            required
            autoFocus
          />
          <Button
            fullWidth
            type="submit"
            variant="contained"
            color="secondary"
            size="large"
            disabled={loading}
            sx={{ 
              py: 1.5, 
              fontWeight: 700, 
              fontSize: '1.1rem',
              boxShadow: theme.shadows[4]
            }}
          >
            {loading ? t('common.loading') : t('onboarding.submit')}
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default Onboarding;