import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-hot-toast';

const AuthSuccessHandler = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  useEffect(() => {
    const handleAuthSuccess = () => {
      try {
        const params = new URLSearchParams(location.search);
        const token = params.get('token');
        const isNewUser = params.get('is_new_user') === 'true';
        const username = params.get('username');

        if (token) {
          // Store token for Bearer authentication
          localStorage.setItem('authToken', token);
          
          const userData = { 
            username: username || 'Ninja', 
            token: token,
            isNewUser: isNewUser
          };

          login(userData);

          // Communicate with parent window and close popup
          if (window.opener) {
            window.opener.postMessage({ type: 'AUTH_COMPLETE', isNewUser }, window.location.origin);
            window.close();
          } else {
            // Fallback for direct redirection
            navigate(isNewUser ? '/onboarding' : '/dashboard', { replace: true });
          }
        } else {
          toast.error(t('common.error'));
          if (window.opener) window.close();
          else navigate('/');
        }
      } catch (error) {
        console.error('Auth processing failed:', error);
        toast.error(t('common.error'));
        if (window.opener) window.close();
      }
    };

    handleAuthSuccess();
  }, [location, login, navigate, t]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', gap: 2 }}>
      <CircularProgress size={40} thickness={4} />
      <Typography variant="body1" fontWeight={500}>{t('common.loading')}</Typography>
    </Box>
  );
};

export default AuthSuccessHandler;