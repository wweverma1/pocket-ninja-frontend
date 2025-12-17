import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

const AuthSuccessHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  useEffect(() => {
    const handleAuthSuccess = () => {
      try {
        // 1. Extract params from URL (adjust based on your backend implementation)
        const params = new URLSearchParams(location.search);
        const token = params.get('token');
        const userDataStr = params.get('user');

        if (token && userDataStr) {
          const userData = JSON.parse(decodeURIComponent(userDataStr));
          
          // 2. Store token for API interceptor (from src/services/api.js)
          localStorage.setItem('authToken', token);
          
          // 3. Update global AuthContext state
          login(userData);
          
          toast.success('Successfully logged in!');
          
          // 4. Redirect to Dashboard
          navigate('/dashboard', { replace: true });
        } else {
          throw new Error('Missing authentication data');
        }
      } catch (error) {
        console.error('Auth success handling failed:', error);
        toast.error('Authentication failed. Please try again.');
        navigate('/', { replace: true });
      }
    };

    handleAuthSuccess();
  }, [location, login, navigate]);

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '80vh' 
      }}
    >
      <CircularProgress size={60} thickness={4} sx={{ mb: 2 }} />
      <Typography variant="h6" fontWeight={600}>
        Finalizing your login...
      </Typography>
    </Box>
  );
};

export default AuthSuccessHandler;