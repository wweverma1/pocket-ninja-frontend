import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { BottomNavigation, BottomNavigationAction, Paper, Box, Typography, useTheme } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTableColumns,
  faChartLine,
  faUpload,
  faUsers,
  faUser,
  faHeart,
} from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';

const BottomNav = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const [value, setValue] = useState(0);
  const { isLoggedIn } = useAuth();

  const navItems = [
    { label: t('nav.dashboard') || 'Dashboard', icon: faTableColumns, path: '/dashboard' },
    { label: t('nav.compare'), icon: faChartLine, path: '/compare' },
    { label: t('nav.upload'), icon: faUpload, path: '/upload' },
    { label: t('nav.campaigns'), icon: faUsers, path: '/campaigns' },
    { label: t('nav.profile'), icon: faUser, path: '/profile' },
  ];

  useEffect(() => {
    const currentIndex = navItems.findIndex(item => item.path === location.pathname);
    if (currentIndex !== -1) {
      setValue(currentIndex);
    }
  }, [location.pathname]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    navigate(navItems[newValue].path);
  };

  if (!isLoggedIn) {
    return (
      <Paper
        sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: theme.zIndex.appBar, backgroundColor: 'primary.main', color: 'white', borderRadius: 0 }}
        elevation={0}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 2, gap: 1 }}>
          <Typography variant="body2" sx={{ fontSize: '0.85rem', opacity: 0.9 }}>Developed with</Typography>
          <FontAwesomeIcon icon={faHeart} style={{ color: theme.palette.secondary.main, fontSize: '0.9rem' }} />
          <Typography variant="body2" sx={{ fontSize: '0.85rem', opacity: 0.9 }}>in Sapporo</Typography>
        </Box>
      </Paper>
    );
  }

  return (
    <Paper
      sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: theme.zIndex.appBar, borderTop: `1px solid ${theme.palette.divider}` }}
      elevation={4}
    >
      <BottomNavigation
        value={value}
        onChange={handleChange}
        showLabels
        sx={{
          height: { xs: 65, md: 75 },
          '& .Mui-selected': { color: 'secondary.main' },
        }}
      >
        {navItems.map((item, index) => (
          <BottomNavigationAction
            key={index}
            label={item.label}
            icon={<FontAwesomeIcon icon={item.icon} style={{ fontSize: '1.2rem' }} />}
          />
        ))}
      </BottomNavigation>
    </Paper>
  );
};

export default BottomNav;