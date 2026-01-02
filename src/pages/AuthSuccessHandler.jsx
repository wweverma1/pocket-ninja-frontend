import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Box, Typography, CircularProgress } from '@mui/material';
import { useTranslation } from 'react-i18next';

const AuthSuccessHandler = () => {
  const [searchParams] = useSearchParams();
  const { t } = useTranslation();

  useEffect(() => {
    const token = searchParams.get('token');
    const isNewUser = searchParams.get('is_new_user') === 'true';
    const username = searchParams.get('username');

    if (token) {
      // Try window.opener first (works for Google on mobile, all providers on desktop)
      if (window.opener) {
        window.opener.postMessage(
          { 
            type: 'AUTH_COMPLETE', 
            token,
            username: username,
            isNewUser
          }, 
          window.location.origin
        );
        window.close();
      }
      
      // Always use BroadcastChannel as fallback (works for LINE on mobile)
      const channel = new BroadcastChannel('auth_channel');
      channel.postMessage({
        type: 'AUTH_COMPLETE',
        token,
        username,
        isNewUser
      });
      channel.close();
      
      // Close window after a brief delay
      setTimeout(() => window.close(), 500);
    }
  }, [searchParams]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', gap: 2 }}>
      <CircularProgress size={40} />
      <Typography variant="h6">{t('common.loading')}</Typography>
    </Box>
  );
};

export default AuthSuccessHandler;