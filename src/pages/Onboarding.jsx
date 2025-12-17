import React, { useState, useEffect } from 'react';
import { Container, Paper, Typography, TextField, Button, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';

const Onboarding = () => {
  const { t } = useTranslation();
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Initialize with suggested username from AuthSuccessHandler or existing user state
  const [name, setName] = useState(location.state?.suggestedUsername || user?.username || '');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await authAPI.onboard(name);
      
      // Update local storage and auth state upon successful onboarding
      localStorage.setItem('username', name);
      login({ ...user, username: name, isNewUser: false });
      
      toast.success(t('onboarding.success') || 'Profile set up complete!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(t('onboarding.error') || 'Error setting username');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 10 }}>
      <Paper sx={{ p: 5, borderRadius: 4, textAlign: 'center' }} elevation={3}>
        <Typography variant="h4" fontWeight={800} gutterBottom>
          {t('onboarding.title') || 'Finalize Profile'}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          {t('onboarding.subtitle') || 'Choose a permanent username'}
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField 
            fullWidth 
            label={t('onboarding.placeholder') || 'Enter username'} 
            variant="outlined" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            sx={{ mb: 4 }} 
            required
          />
          <Button 
            fullWidth 
            variant="contained" 
            color="secondary" 
            size="large" 
            type="submit" 
            sx={{ py: 1.5, fontWeight: 700 }}
          >
            {t('onboarding.submit') || 'Finish Onboarding'}
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default Onboarding;