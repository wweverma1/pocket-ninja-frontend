import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Box, Typography, Button, Divider } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle, faYahoo, faLine } from '@fortawesome/free-brands-svg-icons';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
// REMOVED: toast import is no longer strictly necessary here, but we can keep it
// import toast from 'react-hot-toast'; // Kept but logic removed

// ADDED: Import the base API URL from the environment config
const BACKEND_BASE_URL = import.meta.env.VITE_API_URL.replace('/api', '');

const LoginDialog = ({ open, onOpenChange }) => {
  const { t } = useTranslation();

  const handleLogin = (provider) => {
    let redirectPath = null;

    switch (provider) {
      case 'LINE':
        // The backend handles the full OAuth flow, we just initiate the redirect
        redirectPath = `${BACKEND_BASE_URL}/auth/redirect/line`;
        break;
      case 'Google':
        redirectPath = `${BACKEND_BASE_URL}/auth/redirect/google`;
        break;
      case 'Yahoo':
        // Yahoo implementation is pending on the backend
        // We can keep the toast message for now or implement a pending redirect
        // For now, let's keep the mock/toast for Yahoo as the backend is 501
        break;
      default:
        return;
    }

    if (redirectPath) {
      // Perform a full page redirect to the backend's OAuth initiation endpoint
      window.location.href = redirectPath;
    } else {
      // Fallback for providers not ready (like Yahoo)
      toast.success(
        `${provider} ${t('auth.loginComingSoon')}`,
        {
          duration: 3000,
          position: 'bottom-center',
        }
      );
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            zIndex: 9998,
            backdropFilter: 'blur(4px)',
            animation: 'fadeIn 0.3s ease-out',
          }}
        />
        <Dialog.Content
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '90vw',
            maxWidth: '450px',
            maxHeight: '85vh',
            zIndex: 9999,
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            animation: 'slideUp 0.3s ease-out',
          }}
        >
          <Box sx={{ position: 'relative' }}>
            <Dialog.Close asChild>
              <Button
                sx={{
                  position: 'absolute',
                  top: -8,
                  right: -8,
                  minWidth: 'auto',
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  color: 'text.secondary',
                }}
              >
                <FontAwesomeIcon icon={faTimes} />
              </Button>
            </Dialog.Close>
            {/* FIXED: Added Dialog.Title and Dialog.Description for accessibility */}
            <Dialog.Title asChild>
              <Typography variant="h5" fontWeight={700} gutterBottom textAlign="center">
                {t('auth.welcome')}
              </Typography>
            </Dialog.Title>
            <Dialog.Description asChild>
              <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mb: 3 }}>
                {t('auth.subtitle')}
              </Typography>
            </Dialog.Description>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {/* LINE Login */}
              <Button
                variant="contained"
                size="large"
                fullWidth
                onClick={() => handleLogin('LINE')}
                sx={{
                  backgroundColor: '#00B900',
                  color: 'white',
                  py: 1.5,
                  fontSize: '1rem',
                  fontWeight: 600,
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: '#00A000',
                  },
                }}
                startIcon={<FontAwesomeIcon icon={faLine} />}
              >
                {t('auth.loginWith', { provider: 'LINE' })}
              </Button>

              {/* Google Login */}
              <Button
                variant="outlined"
                size="large"
                fullWidth
                onClick={() => handleLogin('Google')}
                sx={{
                  borderColor: '#4285F4',
                  color: '#4285F4',
                  py: 1.5,
                  fontSize: '1rem',
                  fontWeight: 600,
                  textTransform: 'none',
                  '&:hover': {
                    borderColor: '#357AE8',
                    backgroundColor: 'rgba(66, 133, 244, 0.04)',
                  },
                }}
                startIcon={<FontAwesomeIcon icon={faGoogle} />}
              >
                {t('auth.loginWith', { provider: 'Google' })}
              </Button>

              {/* Yahoo Login */}
              <Button
                variant="outlined"
                size="large"
                fullWidth
                onClick={() => handleLogin('Yahoo')}
                sx={{
                  borderColor: '#6001D2',
                  color: '#6001D2',
                  py: 1.5,
                  fontSize: '1rem',
                  fontWeight: 600,
                  textTransform: 'none',
                  '&:hover': {
                    borderColor: '#5001B2',
                    backgroundColor: 'rgba(96, 1, 210, 0.04)',
                  },
                }}
                startIcon={<FontAwesomeIcon icon={faYahoo} />}
              >
                {t('auth.loginWith', { provider: 'Yahoo' })}
              </Button>
            </Box>

            <Divider sx={{ my: 3 }} />

            <Typography variant="caption" color="text.secondary" textAlign="center" display="block">
              {t('auth.terms')}
            </Typography>
          </Box>

          <style>
            {`
              @keyframes fadeIn {
                from {
                  opacity: 0;
                }
                to {
                  opacity: 1;
                }
              }
              
              @keyframes slideUp {
                from {
                  opacity: 0;
                  transform: translate(-50%, -45%);
                }
                to {
                  opacity: 1;
                  transform: translate(-50%, -50%);
                }
              }
            `}
          </style>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default LoginDialog;