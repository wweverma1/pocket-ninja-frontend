import React, { useState, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Box, Typography, Card, CardContent, Button, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLanguage, faTimes } from '@fortawesome/free-solid-svg-icons';
import toast from 'react-hot-toast';

const LanguageSelectionDialog = () => {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    const savedLanguage = localStorage.getItem('userPreferredLanguage');
    if (!savedLanguage) {
      setOpen(true);
    }
  }, []);

  const handleLanguageSelect = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('userPreferredLanguage', lang);
    setOpen(false);
    
    toast.success(
      lang === 'ja' ? '言語が日本語に設定されました' : 'Language set to English',
      {
        duration: 3000,
        position: 'bottom-center',
      }
    );
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
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

            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <FontAwesomeIcon
                icon={faLanguage}
                style={{ fontSize: '2.5rem', color: theme.palette.primary.main, marginBottom: '16px' }}
              />
              <Dialog.Title asChild>
                <Typography variant="h5" fontWeight={700} gutterBottom>
                  Choose Your Language
                </Typography>
              </Dialog.Title>
              <Typography variant="h6" fontWeight={700} gutterBottom sx={{ mt: -1 }}>
                言語を選択してください
              </Typography>
              <Dialog.Description asChild>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Select your preferred language / お好みの言語を選択
                </Typography>
              </Dialog.Description>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Card
                sx={{
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  border: '2px solid transparent',
                  '&:hover': {
                    borderColor: theme.palette.primary.main,
                    transform: 'translateY(-2px)',
                    boxShadow: 3
                  },
                }}
                onClick={() => handleLanguageSelect('ja')}
              >
                <CardContent sx={{ textAlign: 'center', py: 2 }}>
                  <Typography variant="h4" sx={{ mb: 1 }}>
                    🇯🇵
                  </Typography>
                  <Typography variant="h6" fontWeight={600}>
                    日本語
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Japanese
                  </Typography>
                </CardContent>
              </Card>

              <Card
                sx={{
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  border: '2px solid transparent',
                  '&:hover': {
                    borderColor: theme.palette.primary.main,
                    transform: 'translateY(-2px)',
                    boxShadow: 3
                  },
                }}
                onClick={() => handleLanguageSelect('en')}
              >
                <CardContent sx={{ textAlign: 'center', py: 2 }}>
                  <Typography variant="h4" sx={{ mb: 1 }}>
                    🇬🇧
                  </Typography>
                  <Typography variant="h6" fontWeight={600}>
                    English
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    英語
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          </Box>

          <style>
            {`
              @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
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

export default LanguageSelectionDialog;