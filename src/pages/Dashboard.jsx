import React from 'react';
import { Container, Grid, Typography, Card, CardContent, Box, useTheme } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine, faUpload, faUsers, faUser, faBolt } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const theme = useTheme();
  const navigate = useNavigate();

  const cards = [
    { title: t('nav.compare'), icon: faChartLine, path: '/compare', color: theme.palette.success.main },
    { title: t('nav.upload'), icon: faUpload, path: '/upload', color: theme.palette.secondary.main },
    { title: t('nav.campaigns'), icon: faUsers, path: '/campaigns', color: theme.palette.primary.main },
    { title: t('nav.profile'), icon: faUser, path: '/profile', color: theme.palette.text.secondary },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <FontAwesomeIcon icon={faBolt} style={{ color: theme.palette.secondary.main, fontSize: '2rem' }} />
        <Typography variant="h4" fontWeight={800}>
          {t('dashboard.welcome', { username: user?.username })}
        </Typography>
      </Box>
      <Grid container spacing={3}>
        {cards.map((card, i) => (
          <Grid item xs={12} sm={6} md={3} key={i}>
            <Card sx={{ height: '100%', cursor: 'pointer', '&:hover': { transform: 'translateY(-4px)', transition: '0.3s' } }} onClick={() => navigate(card.path)}>
              <CardContent sx={{ textAlign: 'center', py: 4 }}>
                <FontAwesomeIcon icon={card.icon} style={{ fontSize: '2.5rem', color: card.color, marginBottom: '16px' }} />
                <Typography variant="h6" fontWeight={700}>{card.title}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Dashboard;