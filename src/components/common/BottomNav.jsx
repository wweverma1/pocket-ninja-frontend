import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { BottomNavigation, BottomNavigationAction, Paper, Box, Typography, useTheme } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faShoppingCart,
  faHandsHelping,
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
  const [value, setValue] = useState(0);
  const { isLoggedIn } = useAuth();
  const theme = useTheme();

  const navItems = [
    { label: t('nav.compare'), icon: faShoppingCart, path: '/shop' },
    { label: t('nav.upload'), icon: faHandsHelping, path: '/contribute' },
    // { label: t('nav.campaigns'), icon: faUsers, path: '/campaigns' },
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
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          backgroundColor: 'primary.main',
          color: 'white',
          boxShadow: '0px -2px 8px rgba(0,0,0,0.1)',
          borderRadius: 0
        }}
        elevation={0}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            py: 1.5,
            gap: 1,
          }}
        >
          <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>
            {t('common.developedWith')}
          </Typography>
          <FontAwesomeIcon icon={faHeart} style={{ color: '#E74C3C', fontSize: '1rem' }} />
          <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>
            {t('common.inSapporo')}
          </Typography>
        </Box>
      </Paper>
    );
  }

  return (
    <Paper
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        py: 0.5,
        backgroundColor: 'primary.main',
        boxShadow: '0px -2px 8px rgba(0,0,0,0.1)',
        borderRadius: 0
      }}
      elevation={4}
    >
      <BottomNavigation
        value={value}
        onChange={handleChange}
        showLabels
        sx={{
          backgroundColor: 'primary.main',
          '& .MuiBottomNavigationAction-root': {
            minWidth: 'auto',
          },
          '& .MuiBottomNavigationAction-label': {
            fontSize: '0.75rem',
            marginTop: 0.5,
          },
          '& .Mui-selected': {
            fontSize: '0.85rem',
            color: 'white'
          },
          '& .Mui-selected svg': {
            color: 'white'
          }
        }}
      >
        {navItems.map((item, index) => (
          <BottomNavigationAction
            key={index}
            label={item.label}
            icon={<FontAwesomeIcon icon={item.icon} />}
            sx={{ backgroundColor: 'primary.main' }}
          />
        ))}
      </BottomNavigation>
    </Paper>
  );
};

export default BottomNav;