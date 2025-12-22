import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  TextField,
  Rating,
  CircularProgress,
  useTheme,
  alpha
} from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import { feedbackAPI } from '../../services/api';
import toast from 'react-hot-toast';

const labels = {
  1: 'useless',
  2: 'poor',
  3: 'ok',
  4: 'good',
  5: 'excellent',
};

const FeedbackDialog = ({ open, onOpenChange }) => {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [avgRating, setAvgRating] = useState(5.0);
  
  // User input states
  const [initialRating, setInitialRating] = useState(0);
  const [value, setValue] = useState(0);
  const [hover, setHover] = useState(-1);
  const [feedbackText, setFeedbackText] = useState('');

  useEffect(() => {
    const fetchFeedbackData = async () => {
      try {
        setLoading(true);
        const response = await feedbackAPI.getFeedback();
        if (response.errorStatus === 0) {
          setAvgRating(response.result.averageRating ?? 5.0);
          
          const userRating = response.result.userRating || 0;
          setInitialRating(userRating);
          setValue(userRating);
          setFeedbackText(''); 
        }
      } catch (error) {
        console.error('Failed to fetch feedback', error);
        const msg = error.response?.data?.message?.[i18n.language] || 
                    error.response?.data?.message?.en || 
                    t('common.error');
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    };

    if (open) {
      fetchFeedbackData();
    }
  }, [open, i18n.language, t]);

  const handleSubmit = async () => {
    if (value === 0 && !feedbackText.trim()) {
       toast.error(t('feedback.validationError'));
       return;
    }

    setSubmitting(true);
    try {
      const ratingToSend = value === 0 ? null : value;
      
      const response = await feedbackAPI.submitFeedback(
        ratingToSend, 
        feedbackText
      );
      
      if (response.errorStatus === 0) {
        const msg = response.message?.[i18n.language] || response.message?.en || t('feedback.success');
        toast.success(msg, { duration: 3000, position: 'bottom-center' });
        onOpenChange(false);
      } else {
        const msg = response.message?.[i18n.language] || response.message?.en || t('common.error');
        toast.error(msg, { duration: 3000, position: 'bottom-center' });
      }
    } catch (error) {
      console.error('Failed to submit feedback', error);
      const msg = error.response?.data?.message?.[i18n.language] || 
                  error.response?.data?.message?.en || 
                  t('common.error');
      toast.error(msg, { duration: 3000, position: 'bottom-center' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!submitting) {
      onOpenChange(false);
    }
  };

  const getLabelText = (val) => {
    return t(`feedback.labels.${labels[val]}`);
  };

  const isUnchanged = (value === initialRating) && (feedbackText.trim() === '');

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      fullWidth 
      maxWidth="sm"
      PaperProps={{
        sx: { borderRadius: 3, p: 1 }
      }}
    >
      <DialogTitle sx={{ textAlign: 'center', fontWeight: 800, fontSize: '1.5rem', pb: 0.5 }}>
        {t('feedback.title')}
      </DialogTitle>
      
      <Typography variant="body2" color="text.secondary" align="center" sx={{ px: 4, mb: 1, lineHeight: 1.4 }}>
        {t('feedback.subtitle')}
      </Typography>
      
      <DialogContent sx={{ overflowY: 'visible' }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, pt: 2 }}>
            
            {/* Attractive Average Rating Display */}
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="overline" color="text.secondary" letterSpacing={1.5} fontWeight={600}>
                {t('feedback.averageRating')}
              </Typography>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                gap: 1.5,
                mt: 0.5
              }}>
                <Typography variant="h2" fontWeight="800" color="text.primary" sx={{ lineHeight: 1 }}>
                  {avgRating.toFixed(1)}
                </Typography>
                <FontAwesomeIcon icon={faStar} color="#faaf00" style={{ fontSize: '2.5rem' }} />
              </Box>
            </Box>

            {/* User Rating Input */}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
              <Typography variant="subtitle1" fontWeight="700">
                {t('feedback.yourRating')}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                <Rating
                  name="user-rating"
                  value={value}
                  precision={1}
                  size="large"
                  onChange={(event, newValue) => {
                    setValue(newValue);
                  }}
                  onChangeActive={(event, newHover) => {
                    setHover(newHover);
                  }}
                  sx={{
                    fontSize: '3.5rem',
                    color: '#faaf00',
                    '& .MuiRating-iconHover': {
                      color: '#faaf00',
                    },
                  }}
                />
                {/* Hover Feedback Label */}
                <Box sx={{ mt: 1, minHeight: '24px' }}>
                  {(hover !== -1 || value !== null) && (
                    <Typography 
                      color={hover !== -1 ? 'primary.main' : 'text.secondary'}
                      fontWeight={hover !== -1 ? 700 : 500}
                      sx={{ transition: 'all 0.2s' }}
                    >
                      {hover !== -1 ? getLabelText(hover) : (value ? getLabelText(value) : '')}
                    </Typography>
                  )}
                </Box>
              </Box>
            </Box>

            {/* Feedback Text Input */}
            <TextField
              multiline
              rows={4}
              placeholder={t('feedback.placeholder')}
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              variant="outlined"
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                  bgcolor: alpha(theme.palette.background.default, 0.5),
                  '&:hover': {
                    bgcolor: alpha(theme.palette.background.default, 0.8),
                  },
                  '&.Mui-focused': {
                    bgcolor: 'transparent',
                  }
                }
              }}
            />
          </Box>
        )}
      </DialogContent>
      
      <DialogActions sx={{ px: 3, pb: 3, justifyContent: 'center', gap: 2 }}>
        <Button 
          onClick={handleClose} 
          disabled={submitting} 
          color="inherit" 
          sx={{ 
            minWidth: 100, 
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600
          }}
        >
          {t('common.cancel')}
        </Button>
        <Button 
          variant="contained" 
          color="secondary" 
          onClick={handleSubmit} 
          disabled={submitting || loading || isUnchanged}
          sx={{ 
            minWidth: 140,
            fontWeight: 700,
            borderRadius: 2,
            textTransform: 'none',
            boxShadow: theme.shadows[4],
            py: 1
          }}
        >
          {submitting ? t('common.loading') : t('feedback.submit')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FeedbackDialog;