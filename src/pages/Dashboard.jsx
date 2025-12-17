import React from 'react';
import { Container, Typography, Grid, Card, CardContent, Box, Button } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine, faPlusCircle, faUsers, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const actions = [
    { title: t('nav.compare'), icon: faChartLine, path: '/compare', color: '#27AE60' },
    { title: t('nav.upload'), icon: faPlusCircle, path: '/upload', color: '#E74C3C' },
    { title: t('nav.campaigns'), icon: faUsers, path: '/campaigns', color: '#2C3E50' },
    { title: t('nav.profile'), icon: faUserCircle, path: '/profile', color: '#7F8C8D' },
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          {t('dashboard.welcome') || 'Konnichiwa'}, {user?.username}!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {t('dashboard.subtitle') || 'Ready to save more today in Sapporo?'}
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {actions.map((action, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card 
              sx={{ 
                height: '100%', 
                cursor: 'pointer',
                transition: 'transform 0.2s',
                '&:hover': { transform: 'translateY(-4px)' }
              }}
              onClick={() => navigate(action.path)}
            >
              <CardContent sx={{ textAlign: 'center', py: 4 }}>
                <FontAwesomeIcon 
                  icon={action.icon} 
                  style={{ fontSize: '2.5rem', color: action.color, marginBottom: '16px' }} 
                />
                <Typography variant="h6" fontWeight={600}>
                  {action.title}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Dashboard;