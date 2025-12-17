import React, { useState } from 'react';
import { Container, Paper, Typography, TextField, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';

const Onboarding = () => {
  const { t } = useTranslation();
  const { user, updateUsername } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [name, setName] = useState(location.state?.suggestedUsername || user?.username || '');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);

    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/user/onboard`,
        { username: name },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        // Updates the standalone 'username' key in localStorage
        updateUsername(name);
        toast.success(t('onboarding.success'));
        navigate('/dashboard');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || t('onboarding.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 10 }}>
      <Paper sx={{ p: 5, borderRadius: 4, textAlign: 'center' }} elevation={3}>
        <Typography variant="h4" fontWeight={800} gutterBottom>
          {t('onboarding.title')}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          {t('onboarding.subtitle')}
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField 
            fullWidth 
            label={t('onboarding.placeholder')} 
            variant="outlined" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            sx={{ mb: 4 }} 
            required
            disabled={loading}
          />
          <Button 
            fullWidth 
            variant="contained" 
            color="primary" 
            size="large" 
            type="submit" 
            disabled={loading}
            sx={{ py: 1.5, fontWeight: 700 }}
          >
            {loading ? t('common.loading') : t('onboarding.submit')}
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default Onboarding;