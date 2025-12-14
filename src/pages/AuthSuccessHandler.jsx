import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { globalStyles } from '../theme/globalStyles';
import toast from 'react-hot-toast';

const AuthSuccessHandler = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');
    // const isNewUser = searchParams.get('is_new_user') === 'true'; // Not used in AuthContext yet

    if (token) {
      // In a real application, you would typically use the token to fetch
      // the user's profile, but for now, we'll store the token and mock user data
      
      // MOCK USER DATA (Replace with actual user data logic using the token later)
      const mockUserData = { 
        token: token,
        username: 'AuthUser',
        // Other profile details
      }; 

      login(mockUserData);
      
      toast.success('Login Successful!', {
        duration: 3000,
        position: 'bottom-center',
      });
      
      // Redirect to dashboard or home page after successful login
      navigate('/'); 
    } else {
      toast.error('Login failed: Token missing.', {
        duration: 5000,
        position: 'bottom-center',
      });
      navigate('/auth/failure?error=token_missing');
    }
  }, [searchParams, navigate, login]);

  return (
    <Box sx={{ ...globalStyles.pageContainer, textAlign: 'center', py: 10 }}>
      <Typography variant="h5">Processing Login...</Typography>
      <Typography variant="body1" color="text.secondary">Please wait while we log you in.</Typography>
    </Box>
  );
};

export default AuthSuccessHandler;