import React, { useState, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Box, Typography, Button, Divider } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle, faYahoo, faLine } from '@fortawesome/free-brands-svg-icons';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const LoginDialog = ({ open, onOpenChange }) => {
  const { t } = useTranslation();
  const { login, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [pendingRedirect, setPendingRedirect] = useState(null);

  useEffect(() => {
    if (isLoggedIn && pendingRedirect) {
        navigate(pendingRedirect, { replace: true });
        setPendingRedirect(null);
    }
  }, [isLoggedIn, pendingRedirect, navigate]);

  const handleLogin = (provider) => {
    if (provider === 'Yahoo') {
      toast.success(t('auth.loginComingSoon', { provider: 'Yahoo' }), {
        duration: 3000,
        position: 'bottom-center',
      });
      return;
    }

    if (provider === 'LINE') {
      toast.success(t('auth.loginComingSoon', { provider: 'LINE' }), {
        duration: 3000,
        position: 'bottom-center',
      });
      return;
    }

    const redirectPath = `${API_BASE_URL}/auth/redirect/${provider.toLowerCase()}`;
    const popup = window.open(
      redirectPath,
      'pocket_ninja_auth',
      'width=500,height=650,top=0,left=0,scrollbars=yes,status=yes'
    );

    const handleMessage = (event) => {
      if (event.origin !== window.location.origin) return;
      if (event.data?.type === 'AUTH_COMPLETE') {
        const { token, username, isNewUser } = event.data;
        login(username, token);
        onOpenChange(false);

        if (isNewUser)
        {
          toast.success(t('common.loginSuccessNewUser', { username: username }), {
            duration: 3000,
            position: 'bottom-center',
          });
        }
        else
        {
          toast.success(t('common.loginSuccess', { username: username }), {
            duration: 3000,
            position: 'bottom-center',
          });
        }
        
        // Schedule redirect based on user status; actual navigation happens in useEffect
        // once authentication state is updated.
        setPendingRedirect(isNewUser ? '/profile' : '/compare');
        
        window.removeEventListener('message', handleMessage);
      } else if (event.data?.type === 'AUTH_ERROR') {
        toast.error(event.data.message, { duration: 3000, position: 'bottom-center' });
        window.removeEventListener('message', handleMessage);
      }
    };

    window.addEventListener('message', handleMessage);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay
          style={{
            position: 'fixed', inset: 0, backgroundColor: 'rgba(0, 0, 0, 0.6)',
            zIndex: 9998, backdropFilter: 'blur(4px)', animation: 'fadeIn 0.3s ease-out',
          }}
        />
        <Dialog.Content
          style={{
            position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            width: '90vw', maxWidth: '450px', maxHeight: '85vh', zIndex: 9999,
            backgroundColor: 'white', borderRadius: '16px', padding: '24px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)', animation: 'slideUp 0.3s ease-out',
          }}
        >
          <Box sx={{ position: 'relative' }}>
            <Dialog.Close asChild>
              <Button sx={{ position: 'absolute', top: -8, right: -8, minWidth: 'auto', width: 40, height: 40, borderRadius: '50%', color: 'text.secondary' }}>
                <FontAwesomeIcon icon={faTimes} />
              </Button>
            </Dialog.Close>
            <Dialog.Title asChild>
              <Typography variant="h5" fontWeight={700} gutterBottom textAlign="center">{t('auth.welcome')}</Typography>
            </Dialog.Title>
            <Dialog.Description asChild>
              <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mb: 3 }}>{t('auth.subtitle')}</Typography>
            </Dialog.Description>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Button variant="outlined" fullWidth onClick={() => handleLogin('Google')} startIcon={<FontAwesomeIcon icon={faGoogle} />} sx={{ borderColor: '#4285F4', color: '#4285F4', py: 1.5, textTransform: 'none', fontWeight: 600, '&:hover': { borderColor: '#357AE8', backgroundColor: 'rgba(66, 133, 244, 0.04)' } }}>
                {t('auth.loginWith', { provider: 'Google' })}
              </Button>
              <Button variant="contained" fullWidth onClick={() => handleLogin('LINE')} startIcon={<FontAwesomeIcon icon={faLine} />} sx={{ backgroundColor: '#00B900', color: 'white', py: 1.5, textTransform: 'none', fontWeight: 600, '&:hover': { backgroundColor: '#00A000' } }}>
                {t('auth.loginWith', { provider: 'LINE' })}
              </Button>
              <Button variant="outlined" fullWidth onClick={() => handleLogin('Yahoo')} startIcon={<FontAwesomeIcon icon={faYahoo} />} sx={{ borderColor: '#6001D2', color: '#6001D2', py: 1.5, textTransform: 'none', fontWeight: 600, '&:hover': { borderColor: '#5001B2', backgroundColor: 'rgba(96, 1, 210, 0.04)' } }}>
                {t('auth.loginWith', { provider: 'Yahoo' })}
              </Button>
            </Box>
            <Divider sx={{ my: 3 }} />
            <Typography variant="caption" color="text.secondary" textAlign="center" display="block">{t('auth.terms')}</Typography>
          </Box>
          <style>{`@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } } @keyframes slideUp { from { opacity: 0; transform: translate(-50%, -45%); } to { opacity: 1; transform: translate(-50%, -50%); } }`}</style>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default LoginDialog;