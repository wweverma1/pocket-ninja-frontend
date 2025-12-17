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
import { faBars, faBolt, faShareNodes, faLanguage, faRightToBracket } from '@fortawesome/free-solid-svg-icons'; // Added faRightToBracket
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
  const { isLoggedIn } = useAuth();

  const loggedOutMenuItems = [
    { label: t('nav.home'), id: 'hero' },
    { label: t('nav.bestDeals'), id: 'leaderboard' },
    { label: t('nav.howItWorks'), id: 'howItWorks' },
    { label: t('nav.about'), id: 'developerNote' },
  ];

  const loggedInMenuItems = [
    { label: t('nav.home'), path: '/' },
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
    const message = i18n.language === 'ja'
      ? 'Check out Pocket Ninja - Find the best deals in Sapporo and save around 30% on your bills! 札幌で最安値を見つけて、約30%節約しよう！'
      : 'Check out Pocket Ninja - Find the best deals in Sapporo and save around 30% on your bills! 札幌で最安値を見つけて、約30%節約しよう！';
    
    const url = window.location.origin;
    const lineUrl = `https://line.me/R/msg/text/?${encodeURIComponent(message + ' ' + url)}`;
    window.open(lineUrl, '_blank');
  };
  
  // Replicating LanguageToggle logic for drawer context
  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'ja' : 'en';
    i18n.changeLanguage(newLang);
    localStorage.setItem('userPreferredLanguage', newLang);
  };


  return (
    <>
      <AppBar position="sticky" elevation={2}>
        <Toolbar>
          {isMobile && (
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
              aria-label="menu"
            >
              <FontAwesomeIcon icon={faBars} />
            </IconButton>
          )}

          <FontAwesomeIcon icon={faBolt} style={{ fontSize: '1.5rem', marginRight: '12px' }} />
          
          <Typography
            variant="h6"
            component="div"
            sx={{ 
              flexGrow: 1, 
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              lineHeight: 1.2,
            }}
            onClick={() => isLoggedIn ? navigate('/') : window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            {t('app.name')}
            <Typography
              variant="caption"
              sx={{ 
                fontSize: { xs: '0.65rem', sm: '0.75rem' },
                opacity: 0.9,
              }}
            >
              {t('app.tagline')}
            </Typography>
          </Typography>

          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              {menuItems.map((item, index) => (
                <Typography
                  key={index}
                  sx={{
                    cursor: 'pointer',
                    '&:hover': { opacity: 0.8 },
                    fontWeight: 500,
                  }}
                  onClick={() => handleNavigation(item)}
                >
                  {item.label}
                </Typography>
              ))}
            </Box>
          )}

          {/* Desktop buttons */}
          {!isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
              <LanguageToggle />
              
              <IconButton
                color="inherit"
                onClick={handleShare}
                aria-label="share"
                sx={{ p: 1 }}
              >
                <FontAwesomeIcon icon={faShareNodes} />
              </IconButton>
              
              {!isLoggedIn && (
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => setLoginOpen(true)}
                  sx={{
                    ml: 1,
                    fontWeight: 600,
                    textTransform: 'none',
                  }}
                >
                  {t('home.getStarted')}
                </Button>
              )}
            </Box>
          )}

          {/* Mobile: Only show Get Started button */}
          {isMobile && !isLoggedIn && (
            <Button
              variant="contained"
              color="secondary"
              onClick={() => setLoginOpen(true)}
              size="small"
              sx={{
                fontWeight: 600,
                textTransform: 'none',
                fontSize: '0.8rem',
                px: 2,
              }}
            >
              {t('home.getStarted')}
            </Button>
          )}
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={handleDrawerToggle}
        sx={{
          '& .MuiDrawer-paper': {
            width: 250,
          },
        }}
      >
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
          <FontAwesomeIcon icon={faBolt} style={{ fontSize: '1.5rem', marginRight: '12px' }} />
          <Typography variant="h6" fontWeight={700}>
            {t('app.name')}
          </Typography>
        </Box>
        <Divider />
        
        <List>
          {/* Add Get Started button to the top of the menu when logged out */}
          {!isLoggedIn && (
            <>
              <ListItem disablePadding>
                <ListItemButton 
                  onClick={() => {
                    setLoginOpen(true);
                    setDrawerOpen(false); // Close drawer after clicking
                  }}
                  sx={{ 
                    backgroundColor: theme.palette.secondary.main, 
                    color: theme.palette.secondary.contrastText,
                    '&:hover': {
                        backgroundColor: theme.palette.secondary.dark,
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <FontAwesomeIcon icon={faRightToBracket} />
                    <ListItemText primary={t('home.getStarted')} primaryTypographyProps={{ fontWeight: 600 }}/>
                  </Box>
                </ListItemButton>
              </ListItem>
              <Divider sx={{ my: 1 }} />
            </>
          )}

          {menuItems.map((item, index) => (
            <ListItem key={index} disablePadding>
              <ListItemButton onClick={() => handleNavigation(item)}>
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          ))}
          <Divider sx={{ my: 1 }} />
          
          {/* Language toggle in drawer - now using icon and current language text */}
          <ListItem disablePadding>
            <ListItemButton onClick={toggleLanguage}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexGrow: 1 }}>
                <FontAwesomeIcon icon={faLanguage} />
                <ListItemText 
                  primary={i18n.language === 'en' ? '日本語' : 'English'} 
                  secondary={i18n.language === 'en' ? 'Switch Language' : '言語を切り替え'} 
                  primaryTypographyProps={{ fontWeight: 600 }}
                />
              </Box>
            </ListItemButton>
          </ListItem>
          
          <ListItem disablePadding>
            <ListItemButton onClick={handleShare}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <FontAwesomeIcon icon={faShareNodes} />
                <ListItemText primary={t('common.share')} />
              </Box>
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>

      {/* Login Dialog */}
      <LoginDialog open={loginOpen} onOpenChange={setLoginOpen} />
    </>
  );
};

export default Header;