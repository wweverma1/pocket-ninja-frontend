import React from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  Button, 
  Box, 
  IconButton, 
  Typography, 
  useTheme,
  Divider
} from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle, faLine } from '@fortawesome/free-brands-svg-icons';
import { faXmark, faBolt, faLock } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';

const LoginDialog = ({ open, onOpenChange }) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const handleLogin = (provider) => {
    const API_BASE = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
    const url = `${API_BASE}/auth/redirect/${provider}`;
    
    // Popup dimensions and centering logic
    const width = 500;
    const height = 650;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;

    window.open(
      url,
      'pocket_ninja_auth',
      `width=${width},height=${height},top=${top},left=${left},scrollbars=yes,status=yes`
    );

    // Listener for message from the success handler
    const handleMessage = (event) => {
      if (event.origin !== window.location.origin) return;
      if (event.data?.type === 'AUTH_COMPLETE') {
        onOpenChange(false);
        window.removeEventListener('message', handleMessage);
      }
    };

    window.addEventListener('message', handleMessage);
  };

  return (
    <Dialog 
      open={open} 
      onClose={() => onOpenChange(false)} 
      maxWidth="xs" 
      fullWidth
      PaperProps={{
        sx: { borderRadius: 3, p: 1 }
      }}
    >
      <DialogTitle sx={{ m: 0, p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box 
            sx={{ 
              width: 32, 
              height: 32, 
              bgcolor: 'primary.main', 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}
          >
            <FontAwesomeIcon icon={faBolt} style={{ color: 'white', fontSize: '0.9rem' }} />
          </Box>
          <Typography variant="h6" fontWeight={700}>
            {t('auth.welcome')}
          </Typography>
        </Box>
        <IconButton onClick={() => onOpenChange(false)} size="small">
          <FontAwesomeIcon icon={faXmark} />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ p: 2, pb: 4 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          {t('auth.subtitle')}
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Button 
            variant="outlined" 
            fullWidth 
            size="large"
            onClick={() => handleLogin('google')}
            startIcon={<FontAwesomeIcon icon={faGoogle} />}
            sx={{ 
              py: 1.5, 
              textTransform: 'none', 
              fontWeight: 600,
              borderColor: '#ddd',
              color: '#555',
              '&:hover': { borderColor: '#bbb', bgcolor: '#f9f9f9' }
            }}
          >
            {t('auth.loginWith', { provider: 'Google' })}
          </Button>

          <Button 
            variant="contained" 
            fullWidth 
            size="large"
            onClick={() => handleLogin('line')}
            startIcon={<FontAwesomeIcon icon={faLine} />}
            sx={{ 
              py: 1.5, 
              textTransform: 'none', 
              fontWeight: 600,
              bgcolor: '#00B900',
              '&:hover': { bgcolor: '#009900' }
            }}
          >
            {t('auth.loginWith', { provider: 'LINE' })}
          </Button>
        </Box>

        <Divider sx={{ my: 4 }}>
          <Typography variant="caption" color="text.secondary" sx={{ px: 1 }}>
            <FontAwesomeIcon icon={faLock} style={{ marginRight: 4 }} />
            {t('auth.secureLogin') || 'Secure Login'}
          </Typography>
        </Divider>

        <Typography variant="caption" color="text.secondary" textAlign="center" display="block">
          {t('auth.terms')}
        </Typography>
      </DialogContent>
    </Dialog>
  );
};

export default LoginDialog;