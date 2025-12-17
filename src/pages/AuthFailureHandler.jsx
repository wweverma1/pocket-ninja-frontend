import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Typography, Button, Container } from '@mui/material';
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
    const errorMsg = params.get('message') || 'Authentication failed';
    
    toast.error(errorMsg);
  }, [location]);

  return (
    <Container maxWidth="sm">
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center', 
          height: '70vh',
          textAlign: 'center'
        }}
      >
        <FontAwesomeIcon 
          icon={faTriangleExclamation} 
          style={{ fontSize: '4rem', color: '#E74C3C', marginBottom: '24px' }} 
        />
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Oops! Something went wrong.
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          We couldn't complete your login. This might be due to a cancelled request or a temporary server issue.
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          size="large"
          onClick={() => navigate('/')}
          sx={{ px: 4, fontWeight: 700 }}
        >
          Return to Home
        </Button>
      </Box>
    </Container>
  );
};

export default AuthFailureHandler;