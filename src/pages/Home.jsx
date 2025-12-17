import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
  Chip,
  Avatar,
  Paper,
  Grid
} from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTrophy,
  faYenSign,
  faStore,
  faShoppingCart,
  faSearch,
  faCircleQuestion,
  faPiggyBank,
  faHandshake,
  faLock,
} from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { leaderboardAPI } from '../services/api';
import { ListSkeleton } from '../components/common/LoadingSkeleton';
import { globalStyles } from '../theme/globalStyles';
import LanguageSelectionDialog from '../components/common/LanguageSelectionDialog';
import LoginDialog from '../components/auth/LoginDialog';

const Home = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { isLoggedIn } = useAuth();
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchLeaderboard();
  }, []);
  const [loginOpen, setLoginOpen] = useState(false);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const data = await leaderboardAPI.getTopSavings();
      setLeaderboard(data.slice(0, 5));
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      // Mock data for development
      setLeaderboard([
        {
          productName: 'コカ・コーラ 500ml',
          englishName: 'Coca-Cola 500ml',
          maxPrice: 150,
          minPrice: 98,
          savingsPercent: 34.7,
          cheapestStore: 'AEON',
        },
        {
          productName: 'サッポロ一番 味噌ラーメン',
          englishName: 'Sapporo Ichiban Miso Ramen',
          maxPrice: 180,
          minPrice: 128,
          savingsPercent: 28.9,
          cheapestStore: 'FamilyMart',
        },
        {
          productName: 'キリン 午後の紅茶',
          englishName: 'Kirin Afternoon Tea',
          maxPrice: 140,
          minPrice: 105,
          savingsPercent: 25.0,
          cheapestStore: 'Lawson',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const howItWorksSteps = [
    {
      icon: faShoppingCart,
      title: t('howItWorks.step1.title'),
      description: t('howItWorks.step1.description'),
    },
    {
      icon: faSearch,
      title: t('howItWorks.step2.title'),
      description: t('howItWorks.step2.description'),
    },
    {
      icon: faPiggyBank,
      title: t('howItWorks.step3.title'),
      description: t('howItWorks.step3.description'),
    },
  ];

  if (isLoggedIn) {
    navigate('/');
    return null;
  }

  // Define highlight color from theme
  const highlightColor = theme.palette.secondary.main;
  
  // Define CSS for sketch highlight effect (Snowfall CSS removed)
  const highlightCSS = `
    .circle-sketch-highlight {
      position: relative;
      display: inline-block;
      text-decoration: none;
    }

    .circle-sketch-highlight:before {
      content: "";
      z-index: -1;
      left: -0.5em;
      top: -0.1em;
      border-width: 2px;
      border-style: solid;
      border-color: ${highlightColor};
      position: absolute;
      border-right-color: transparent;
      width: 100%;
      height: 2em;
      transform: rotate(2deg);
      opacity: 0.7;
      border-radius: 50%;
      padding: 0.1em 0.25em;
    }

    .circle-sketch-highlight:after {
      content: "";
      z-index: -1;
      left: -0.5em;
      top: 0.1em;
      padding: 0.1em 0.25em;
      border-width: 2px;
      border-style: solid;
      border-color: ${highlightColor};
      border-left-color: transparent;
      border-top-color: transparent;
      position: absolute;
      width: 100%;
      height: 2em;
      transform: rotate(-1deg);
      opacity: 0.7;
      border-radius: 50%;
    }
  `;

  // --- NEW BACKGROUND LOGIC ---
  const darkOverlay = `radial-gradient(circle at center, ${theme.palette.primary.dark}e6 0%, ${theme.palette.primary.main}66 100%)`;
  // --- END NEW BACKGROUND LOGIC ---

  return (
    <Box sx={globalStyles.pageContainer}>
      {/* Inject custom CSS for the highlight effect */}
      <style>{highlightCSS}</style>
      
      <LanguageSelectionDialog />

      {/* Hero Section */}
      <Box
        id="hero"
        sx={{
          // MODIFIED: Replaced gradient/snowfall with image + dark gradient overlay
          backgroundImage: `${darkOverlay}, url(/pocket-ninja-background.png)`,
          backgroundSize: 'cover',
          backgroundPosition: { xs: '10% 50%', md: 'center' },
          backgroundRepeat: 'no-repeat',
          color: 'white',
          py: { xs: 8, md: 12 },
          px: 2,
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
          <Typography
            variant="h1"
            sx={{
              mb: 2,
              fontWeight: 800,
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
            }}
          >
            {t('home.welcome')}
          </Typography>
          
          <Typography
            variant="h6"
            sx={{
              mb: 1,
              opacity: 0.95,
              fontWeight: 400,
              fontSize: { xs: '1rem', sm: '1.25rem' },
            }}
          >
            {t('home.subtitle')}
          </Typography>

          <Typography
            variant="body2"
            sx={{
              mb: 4,
              opacity: 0.85,
              fontSize: { xs: '0.875rem', sm: '1rem' },
              fontStyle: 'italic',
            }}
          >
            {/* APPLIED: Circle sketch highlight effect */}
            <span className="circle-sketch-highlight">
              {t('home.savingsPromise')}
            </span>
          </Typography>
          
          <Button
            variant="contained"
            size="large"
            onClick={() => setLoginOpen(true)}
            sx={{
              backgroundColor: theme.palette.secondary.main,
              color: 'white',
              px: { xs: 3, sm: 5 },
              py: { xs: 1.5, sm: 2 },
              fontSize: { xs: '1rem', sm: '1.1rem' },
              fontWeight: 700,
              boxShadow: '0px 8px 20px rgba(0,0,0,0.2)',
              '&:hover': {
                backgroundColor: theme.palette.secondary.dark,
                transform: 'translateY(-2px)',
                boxShadow: '0px 12px 24px rgba(0,0,0,0.25)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            {t('home.startSaving')}
          </Button>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ mt: { xs: 4, md: 6 }, mb: 8 }}>
        {/* Best Value Leaderboard Section */}
        <Box id="leaderboard" sx={{ mb: { xs: 6, md: 8 }, scrollMarginTop: '80px' }}>
          {/* Section Header */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              mb: 4,
              textAlign: 'center',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Box
                sx={{
                  width: { xs: 40, sm: 50 },
                  height: { xs: 40, sm: 50 },
                  borderRadius: '50%',
                  backgroundColor: `${theme.palette.secondary.main}15`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mr: 2,
                }}
              >
                <FontAwesomeIcon
                  icon={faTrophy}
                  style={{ fontSize: isMobile ? '1.25rem' : '1.5rem', color: theme.palette.secondary.main }}
                />
              </Box>
              <Typography variant="h2" fontWeight={700}>
                {t('home.leaderboardTitle')}
              </Typography>
            </Box>
            <Typography variant="body1" color="text.secondary" maxWidth="600px">
              {t('home.leaderboardSubtitle')}
            </Typography>
          </Box>

          {/* Leaderboard Items */}
          {loading ? (
            <ListSkeleton count={3} />
          ) : (
            <Box>
              {leaderboard.map((item, index) => (
                <Card
                  key={index}
                  onClick={!isLoggedIn ? () => setLoginOpen(true) : undefined}
                  sx={{
                    mb: 2,
                    transition: 'all 0.3s ease',
                    ...(
                      !isLoggedIn && {
                        cursor: 'pointer',
                        '&:hover': {
                          boxShadow: 6,
                          transform: 'translateY(-2px)',
                        },
                      }
                    ),
                    ...(
                      isLoggedIn && {
                        '&:hover': {
                          boxShadow: 3,
                          transform: 'translateX(4px)',
                        },
                      }
                    )
                  }}
                >
                  <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                    {/* UPDATED: Flexbox for space-between layout on desktop */}
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        alignItems: { xs: 'flex-start', sm: 'center' },
                        justifyContent: { sm: 'space-between' },
                        gap: { xs: 2, sm: 1 },
                      }}
                    >
                      {/* 1. Index + Names (Left Group) */}
                      <Box 
                        sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          flexShrink: 0,
                          // FIXED: Assign max width for product names column on desktop
                          width: { xs: '100%', sm: '35%' }, 
                        }}
                      >
                        {/* A1. Index/Avatar */}
                        <Avatar
                          sx={{
                            bgcolor:
                              index === 0 ? '#FFD700' : index === 1 ? '#C0C0C0' : index === 2 ? '#CD7F32' : theme.palette.grey[400],
                            color: 'white',
                            fontWeight: 700,
                            width: 40,
                            height: 40,
                            mr: 2,
                            flexShrink: 0
                          }}
                        >
                          #{index + 1}
                        </Avatar>
                        {/* A2. Product Names */}
                        <Box sx={{ minWidth: 0 }}>
                          <Typography
                            variant="h6"
                            fontWeight={600}
                            sx={{
                              fontSize: { xs: '0.95rem', sm: '1.1rem' },
                              lineHeight: 1.2,
                              // FIXED: Allow long names to wrap
                              overflowWrap: 'break-word',
                            }}
                          >
                            {item.productName}
                          </Typography>
                          <Typography 
                            variant="body2" 
                            color="text.secondary" 
                            sx={{ 
                                fontSize: { xs: '0.8rem', sm: '0.875rem' },
                                // FIXED: Allow long names to wrap
                                overflowWrap: 'break-word',
                            }}
                          >
                            {item.englishName}
                          </Typography>
                        </Box>
                      </Box>

                      {/* 2. Price Info + Discount (Middle Group) - ORDER SWAPPED */}
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: { xs: 2, sm: 3 },
                          justifyContent: { xs: 'space-between', sm: 'flex-start' },
                          width: { xs: '100%', sm: 'auto' }, // Full width on mobile
                          flexShrink: 0,
                          ml: { xs: 0, sm: 3 }, // Slight margin push on desktop
                        }}
                      >
                        {/* B1. Price Info (Max/Best Price) */}
                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                          {/* Max Price */}
                          <Box sx={{ textAlign: 'right', lineHeight: 1.2 }}>
                            <Typography variant="caption" color="text.secondary" display="block">{t('home.leaderboardProductAvgPrice')}</Typography>
                            <Typography
                              variant="body1"
                              sx={{
                                textDecoration: 'line-through',
                                color: 'text.secondary',
                                fontSize: { xs: '0.9rem', sm: '1rem' },
                              }}
                            >
                              <FontAwesomeIcon icon={faYenSign} style={{ fontSize: '0.75rem' }} />{item.maxPrice}
                            </Typography>
                          </Box>
                          {/* Best Price */}
                          <Box sx={{ textAlign: 'right', lineHeight: 1.2 }}>
                            <Typography variant="caption" color="success.main" display="block">{t('home.leaderboardProductBestPrice')}</Typography>
                            <Typography variant="h6" color="success.main" fontWeight={700} sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
                              <FontAwesomeIcon icon={faYenSign} style={{ fontSize: '0.9rem' }} />{item.minPrice}
                            </Typography>
                          </Box>
                        </Box>
                        
                        {/* B2. Discount Chip */}
                        <Chip
                          label={`${item.savingsPercent.toFixed(1)}% ${t('home.leaderboardProductDiscount')}`}
                          sx={{
                            ...globalStyles.savingsTag,
                            fontSize: { xs: '0.8rem', sm: '0.875rem' },
                            fontWeight: 700,
                          }}
                        />

                      </Box>

                      {/* 3. Store Action Button (Right Group) */}
                      <Box sx={{ width: { xs: '100%', sm: 'auto' }, textAlign: { xs: 'center', sm: 'right' } }}>
                        {isLoggedIn ? (
                          <Button variant="contained" size="small" color="primary" sx={{ textTransform: 'none', px: 2 }}>
                            <FontAwesomeIcon icon={faStore} style={{ marginRight: 8 }} />
                            {i18n.language === 'ja' ? '店舗を見る' : 'View Store'}
                          </Button>
                        ) : (
                          <Button
                            variant="contained"
                            size="small"
                            color="secondary"
                            onClick={() => setLoginOpen(true)}
                            sx={{ textTransform: 'none', px: 2 }}
                          >
                            <FontAwesomeIcon icon={faLock} style={{ marginRight: 8 }} />
                            {t('home.joinNow')}
                          </Button>
                        )}
                      </Box>
                    </Box>
                    {/* END UPDATED LAYOUT */}
                  </CardContent>
                </Card>
              ))}
            </Box>
          )}
        </Box>

        {/* How It Works Section (Icon properties restored, description width limited) */}
        <Box id="howItWorks" sx={{ mb: { xs: 6, md: 8 }, scrollMarginTop: '80px' }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                {/* ICON BOX: Restored original sizing/color scheme */}
                <Box
                    sx={{
                        width: { xs: 40, sm: 50 },
                        height: { xs: 40, sm: 50 },
                        borderRadius: '50%',
                        backgroundColor: `${theme.palette.secondary.main}15`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mr: 2,
                    }}
                >
                    <FontAwesomeIcon
                      icon={faCircleQuestion}
                      style={{ fontSize: isMobile ? '1.25rem' : '1.5rem', color: theme.palette.secondary.main }}
                    />
                </Box>
                <Typography variant="h2" fontWeight={700}>
                    {t('howItWorks.title')}
                </Typography>
            </Box>
            <Typography variant="body1" color="text.secondary" maxWidth="600px" mx="auto">
              {t('howItWorks.subtitle')}
            </Typography>
          </Box>

          <Grid 
            container 
            spacing={3}
            // MODIFIED: Explicitly center items on mobile (xs)
            sx={{ justifyContent: { xs: 'center', md: 'space-between' } }}
          >
            {howItWorksSteps.map((step, index) => (
              <Grid xs={12} md={4} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    // Content inside card is centered by default, but explicitly keeping it here for safety
                    textAlign: 'center',
                    p: { xs: 3, sm: 4 },
                    position: 'relative',
                  }}
                >
                  <Box
                    sx={{
                      width: { xs: 70, sm: 80 },
                      height: { xs: 70, sm: 80 },
                      borderRadius: '50%',
                      backgroundColor: `${theme.palette.primary.main}15`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto',
                      mb: 2,
                      position: 'relative',
                    }}
                  >
                    <Typography
                      sx={{
                        position: 'absolute',
                        top: -10,
                        right: -10,
                        backgroundColor: theme.palette.secondary.main,
                        color: 'white',
                        width: 30,
                        height: 30,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: '0.9rem',
                      }}
                    >
                      {index + 1}
                    </Typography>
                    <FontAwesomeIcon
                      icon={step.icon}
                      style={{ fontSize: '2rem', color: theme.palette.primary.main }}
                    />
                  </Box>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    {step.title}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ 
                        maxWidth: 250,
                        margin: '0 auto',
                    }}
                  >
                    {step.description}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Developer's Note Section */}
        <Box id="developerNote" sx={{ mb: 4, scrollMarginTop: '80px' }}>
          <Paper
            sx={{
              p: { xs: 3, sm: 5 },
              background: `linear-gradient(135deg, ${theme.palette.primary.main}08 0%, ${theme.palette.secondary.main}08 100%)`,
              border: `2px solid ${theme.palette.primary.main}20`,
            }}
          >
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Typography variant="h2" fontWeight={700} gutterBottom>
                {t('developerNote.title')}
              </Typography>
            </Box>

            <Typography variant="body1" sx={{ fontSize: { xs: '0.95rem', sm: '1.1rem' }, lineHeight: 1.8, textAlign: 'center' }}>
              {t('developerNote.content')}
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4, flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                color="secondary"
                size="large"
                onClick={() => setLoginOpen(true)}
                startIcon={<FontAwesomeIcon icon={faHandshake} />}
                sx={{ px: 4, fontWeight: 600 }}
              >
                {t('developerNote.joinCommunity')}
              </Button>
            </Box>
          </Paper>
        </Box>
      </Container>
      
      <LoginDialog open={loginOpen} onOpenChange={setLoginOpen} />
    </Box>
  );
};

export default Home;