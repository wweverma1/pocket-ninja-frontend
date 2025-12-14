import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons';
import { globalStyles } from '../theme/globalStyles';

const AuthFailureHandler = () => {
  const [searchParams] = useSearchParams();
  const error = searchParams.get('error') || 'An unknown error occurred during authentication.';

  return (
    <Box sx={{ ...globalStyles.pageContainer, textAlign: 'center', py: 10 }}>
      <FontAwesomeIcon icon={faCircleExclamation} style={{ fontSize: '3rem', color: '#E74C3C', marginBottom: '16px' }} />
      <Typography variant="h4" fontWeight={700} color="secondary.main" gutterBottom>
        Authentication Failed
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Error details: {error}
      </Typography>
      <Button 
        variant="contained" 
        color="primary" 
        onClick={() => window.location.href = '/'}
      >
        Go to Home
      </Button>
    </Box>
  );
};

export default AuthFailureHandler;