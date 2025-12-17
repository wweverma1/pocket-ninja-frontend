import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Box, Typography, CircularProgress } from '@mui/material';
import { useTranslation } from 'react-i18next';

const AuthFailureHandler = () => {
  const [searchParams] = useSearchParams();
  const { t } = useTranslation();

  useEffect(() => {
    const errorMsg = searchParams.get('error') || searchParams.get('message') || t('common.error');
    if (window.opener) {
      window.opener.postMessage({ type: 'AUTH_ERROR', message: errorMsg }, window.location.origin);
      window.close();
    }
  }, [searchParams, t]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', gap: 2 }}>
      <CircularProgress size={40} color="error" />
      <Typography variant="h6">{t('auth.failureTitle') || 'Authentication Failed'}</Typography>
    </Box>
  );
};

export default AuthFailureHandler;