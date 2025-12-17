import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Button,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
} from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBars, 
  faBolt, 
  faShareNodes, 
  faLanguage, 
  faRightToBracket, 
  faRightFromBracket 
} from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import LanguageToggle from './LanguageToggle';
import LoginDialog from '../auth/LoginDialog';

const Header = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const { isLoggedIn, logout, user } = useAuth();

  const loggedOutMenuItems = [
    { label: t('nav.home'), id: 'hero' },
    { label: t('nav.bestDeals'), id: 'leaderboard' },
    { label: t('nav.howItWorks'), id: 'howItWorks' },
    { label: t('nav.about'), id: 'developerNote' },
  ];

  const loggedInMenuItems = [
    { label: t('nav.dashboard') || 'Dashboard', path: '/dashboard' },
    { label: t('nav.compare'), path: '/compare' },
    { label: t('nav.upload'), path: '/upload' },
    { label: t('nav.campaigns'), path: '/campaigns' },
    { label: t('nav.profile'), path: '/profile' },
  ];

  const menuItems = isLoggedIn ? loggedInMenuItems : loggedOutMenuItems;

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleNavigation = (item) => {
    if (isLoggedIn) {
      navigate(item.path);
    } else {
      const element = document.getElementById(item.id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
    setDrawerOpen(false);
  };

  const handleShare = () => {
    const message = t('common.shareMessage') || 'Check out Pocket Ninja - Find the best deals in Sapporo!';
    const url = window.location.origin;
    const lineUrl = `https://line.me/R/msg/text/?${encodeURIComponent(message + ' ' + url)}`;
    window.open(lineUrl, '_blank');
  };

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'ja' : 'en';
    i18n.changeLanguage(newLang);
    localStorage.setItem('userPreferredLanguage', newLang);
  };

  return (
    <>
      <AppBar position="sticky" elevation={2} sx={{ zIndex: theme.zIndex.drawer + 1 }}>
        <Toolbar>
          {isMobile && (
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <FontAwesomeIcon icon={faBars} />
            </IconButton>
          )}

          <Box 
            onClick={() => isLoggedIn ? navigate('/dashboard') : window.scrollTo({ top: 0, behavior: 'smooth' })}
            sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', flexGrow: 1 }}
          >
            <FontAwesomeIcon icon={faBolt} style={{ fontSize: '1.5rem', marginRight: '12px' }} />
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                {t('app.name')}
              </Typography>
              <Typography variant="caption" sx={{ fontSize: '0.7rem', opacity: 0.9, display: { xs: 'none', sm: 'block' } }}>
                {t('app.tagline')}
              </Typography>
            </Box>
          </Box>

          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 3, alignItems: 'center', mr: 2 }}>
              {menuItems.map((item, index) => (
                <Typography
                  key={index}
                  sx={{
                    cursor: 'pointer',
                    fontWeight: 500,
                    fontSize: '0.95rem',
                    '&:hover': { color: theme.palette.secondary.light },
                  }}
                  onClick={() => handleNavigation(item)}
                >
                  {item.label}
                </Typography>
              ))}
            </Box>
          )}

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {!isMobile && <LanguageToggle />}
            
            <IconButton color="inherit" onClick={handleShare} sx={{ ml: 1 }}>
              <FontAwesomeIcon icon={faShareNodes} />
            </IconButton>

            {isLoggedIn ? (
              !isMobile && (
                <Button
                  variant="outlined"
                  color="inherit"
                  size="small"
                  onClick={logout}
                  startIcon={<FontAwesomeIcon icon={faRightFromBracket} />}
                  sx={{ ml: 2, textTransform: 'none' }}
                >
                  {t('common.logout') || 'Logout'}
                </Button>
              )
            ) : (
              <Button
                variant="contained"
                color="secondary"
                onClick={() => setLoginOpen(true)}
                size={isMobile ? "small" : "medium"}
                sx={{ ml: 2, fontWeight: 600, textTransform: 'none' }}
              >
                {t('home.getStarted')}
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={handleDrawerToggle}
        sx={{ '& .MuiDrawer-paper': { width: 260 } }}
      >
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', backgroundColor: 'primary.main', color: 'white' }}>
          <FontAwesomeIcon icon={faBolt} style={{ fontSize: '1.5rem', marginRight: '12px' }} />
          <Typography variant="h6" fontWeight={700}>{t('app.name')}</Typography>
        </Box>
        
        <List sx={{ pt: 0 }}>
          {!isLoggedIn && (
            <ListItem disablePadding>
              <ListItemButton 
                onClick={() => { setLoginOpen(true); setDrawerOpen(false); }}
                sx={{ py: 2, backgroundColor: 'secondary.main', color: 'white', '&:hover': { backgroundColor: 'secondary.dark' } }}
              >
                <FontAwesomeIcon icon={faRightToBracket} style={{ marginRight: '16px' }} />
                <ListItemText primary={t('home.getStarted')} primaryTypographyProps={{ fontWeight: 700 }} />
              </ListItemButton>
            </ListItem>
          )}

          {menuItems.map((item, index) => (
            <ListItem key={index} disablePadding>
              <ListItemButton onClick={() => handleNavigation(item)} sx={{ py: 1.5 }}>
                <ListItemText primary={item.label} primaryTypographyProps={{ fontWeight: 500 }} />
              </ListItemButton>
            </ListItem>
          ))}
          
          <Divider />
          
          <ListItem disablePadding>
            <ListItemButton onClick={toggleLanguage} sx={{ py: 1.5 }}>
              <FontAwesomeIcon icon={faLanguage} style={{ marginRight: '16px' }} />
              <ListItemText 
                primary={i18n.language === 'en' ? '日本語' : 'English'} 
                secondary={t('common.switchLanguage') || 'Switch Language'} 
              />
            </ListItemButton>
          </ListItem>

          {isLoggedIn && (
            <ListItem disablePadding>
              <ListItemButton onClick={logout} sx={{ py: 1.5, color: 'error.main' }}>
                <FontAwesomeIcon icon={faRightFromBracket} style={{ marginRight: '16px' }} />
                <ListItemText primary={t('common.logout') || 'Logout'} />
              </ListItemButton>
            </ListItem>
          )}
        </List>
      </Drawer>

      <LoginDialog open={loginOpen} onOpenChange={setLoginOpen} />
    </>
  );
};

export default Header;