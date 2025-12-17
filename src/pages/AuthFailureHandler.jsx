import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Typography, Container } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

const AuthFailureHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const errorMsg = params.get('error') || params.get('message') || t('common.error');
    
    // Notify the parent window that auth failed and close popup
    if (window.opener) {
      window.opener.postMessage({ type: 'AUTH_ERROR', message: errorMsg }, window.location.origin);
      window.close();
    } else {
      // Fallback for direct window usage
      toast.error(errorMsg);
      navigate('/', { replace: true });
    }
  }, [location, navigate, t]);

  return (
    <Container maxWidth="sm">
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center', 
          height: '100vh',
          textAlign: 'center'
        }}
      >
        <FontAwesomeIcon 
          icon={faTriangleExclamation} 
          style={{ fontSize: '3rem', color: '#E74C3C', marginBottom: '16px' }} 
        />
        <Typography variant="h5" fontWeight={700}>
          {t('auth.failureTitle')}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {t('common.loading')}
        </Typography>
      </Box>
    </Container>
  );
};

export default AuthFailureHandler;