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

    if (token && window.opener) {
      // Create user data object
      const userData = { 
        token, 
        username: username || 'Ninja', 
        isNewUser 
      };

      // If returning user, persist the finalized username
      if (!isNewUser && username) {
        localStorage.setItem('username', username);
      }

      // Send data to main window context, including the suggested username for onboarding
      window.opener.postMessage(
        { 
          type: 'AUTH_COMPLETE', 
          userData, 
          token,
          suggestedUsername: username // Pass for Onboarding UI
        }, 
        window.location.origin
      );
      
      window.close();
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