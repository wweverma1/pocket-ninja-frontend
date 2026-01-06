import React, { useEffect, useState, useMemo } from 'react';
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
  Grid,
  alpha
} from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFireAlt,
  faYenSign,
  faShoppingCart,
  faSearch,
  faCircleQuestion,
  faPiggyBank,
  faHandshake,
  faLock,
  faCrown,
} from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import { ListSkeleton } from '../components/common/LoadingSkeleton';
import { globalStyles } from '../theme/globalStyles';
import LanguageSelectionDialog from '../components/common/LanguageSelectionDialog';
import LoginDialog from '../components/auth/LoginDialog';

// Updated: Floating Emojis Component with stable positions
const FloatingIcons = () => {
  // useMemo ensures these random values are calculated only once and persist across re-renders
  const floatingItems = useMemo(() => {
    const icons = [
      '🍞', '🍙', '🍱', '🧃', '🥬', 
      '🍣', '🍜', '🍥', '🍡', '🍤', '🍺'
    ];

    return icons.map((icon, i) => {
      return {
        icon,
        // CHANGED: Start from 0 (left/top of screen) instead of 10
        left: Math.floor(Math.random() * 100),
        top: Math.floor(Math.random() * 100),
        duration: 15 + Math.random() * 20,
        delay: Math.random() * -20,
        radius: 40 + Math.random() * 50,
        direction: i % 2 === 0 ? 1 : -1
      };
    });
  }, []); // Empty dependency array = calculate only on mount

  return (
    <Box 
      sx={{ 
        position: 'absolute', 
        inset: 0, 
        overflow: 'hidden', 
        pointerEvents: 'none', 
        zIndex: 1,
        // Radial Gradient Mask to fade icons behind text
        maskImage: 'radial-gradient(circle at 50% 50%, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.2) 20%, rgba(0,0,0,1) 70%)',
        WebkitMaskImage: 'radial-gradient(circle at 50% 50%, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.2) 20%, rgba(0,0,0,1) 70%)'
      }}
    >
      {floatingItems.map((item, i) => (
        <Box
          key={i}
          sx={{
            position: 'absolute',
            left: `${item.left}%`,
            top: `${item.top}%`,
            fontSize: { xs: '1.5rem', md: '3rem' },
            opacity: 0.9,
            // Use the pre-calculated stable values
            '--orbit-radius': `${item.radius}px`,
            '--orbit-dir': item.direction,
            animation: `orbit ${item.duration}s linear infinite`,
            animationDelay: `${item.delay}s`,
          }}
        >
          {item.icon}
        </Box>
      ))}
    </Box>
  );
};

const Home = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loginOpen, setLoginOpen] = useState(false);

  // Check if current language is English
  const isEnglish = i18n.language && i18n.language.startsWith('en');

  useEffect(() => {
    fetchHotProducts();
  }, []);

  const fetchHotProducts = () => {
    setLoading(true);
    // Directly set hardcoded data without API call
    setTimeout(() => {
      setLeaderboard([
        {
          productName: '‐196 ストロングゼロ 500ml',
          englishName: '-196 Strong Zero 500ml',
          maxPrice: 298,
          minPrice: 194,
          savingsPercent: 34.8
        },
        {
          productName: 'オシキリ 十勝きぬ豆腐',
          englishName: 'Oshikiri Tokachi Kinu Tofu',
          maxPrice: 218,
          minPrice: 149,
          savingsPercent: 31.6
        },
        {
          productName: 'タカノフーズ 凄い納豆 40gx3個',
          englishName: 'Takano Foods Amazing Natto 40g x 3 packs',
          maxPrice: 254,
          minPrice: 185,
          savingsPercent: 27.3
        },
      ]);
      setLoading(false);
    }, 1000);
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

  // Rank Colors
  const getRankColor = (index) => {
    switch(index) {
      case 0: return '#FFD700'; // Gold
      case 1: return '#C0C0C0'; // Silver
      case 2: return '#CD7F32'; // Bronze
      default: return theme.palette.grey[400];
    }
  };

  const getRankGlow = (index) => {
    switch(index) {
      case 0: return `0 0 15px ${alpha('#FFD700', 0.5)}`;
      case 1: return `0 0 10px ${alpha('#C0C0C0', 0.4)}`;
      case 2: return `0 0 8px ${alpha('#CD7F32', 0.3)}`;
      default: return 'none';
    }
  };

  const highlightColor = theme.palette.secondary.main;
  
  // Styles
  const highlightCSS = `
    .circle-sketch-highlight {
      position: relative;
      display: inline-block;
      text-decoration: none;
      font-weight: bold;
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
      /* Animation */
      clip-path: polygon(0 0, 0 0, 0 100%, 0 100%);
      animation: drawCircle 1s cubic-bezier(0.25, 1, 0.5, 1) forwards;
      animation-delay: 0.5s;
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
      /* Animation */
      clip-path: polygon(0 0, 0 0, 0 100%, 0 100%);
      animation: drawCircle 1s cubic-bezier(0.25, 1, 0.5, 1) forwards;
      animation-delay: 0.8s;
    }
    @keyframes drawCircle {
      0% { clip-path: polygon(0 0, 0 0, 0 100%, 0 100%); }
      100% { clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%); }
    }
    @keyframes fadeInUp {
      0% { opacity: 0; transform: translateY(30px); }
      100% { opacity: 1; transform: translateY(0); }
    }
    /* Circular Orbit Animation */
    @keyframes orbit {
      from { transform: rotate(0deg) translateX(var(--orbit-radius)) rotate(0deg); }
      to   { transform: rotate(calc(360deg * var(--orbit-dir))) translateX(var(--orbit-radius)) rotate(calc(-360deg * var(--orbit-dir))); }
    }
    @keyframes spin-slow {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    @keyframes float {
      0% { transform: translateY(0px); }
      100% { transform: translateY(-20px); }
    }
    .hero-animate {
      animation: fadeInUp 1s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
    }
  `;

  // Hero Background Gradient using Primary Color
  const heroGradient = `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`;

  return (
    <Box sx={globalStyles.pageContainer}>
      <style>{highlightCSS}</style>
      <LanguageSelectionDialog />
      
      {/* Hero Section */}
      <Box
        id="hero"
        sx={{
          background: heroGradient,
          color: 'white',
          minHeight: '65vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          clipPath: 'polygon(0 0, 100% 0, 100% 85%, 50% 100%, 0 85%)',
          mb: 6,
          pt: 0, 
          pb: 4
        }}
      >
        {/* Dynamic Background Elements */}
        
        {/* Layer 1: Floating Icons (Masked to fade in center) */}
        <FloatingIcons />
        
        {/* Layer 2: Content (Text/Buttons) */}
        <Container sx={{ position: 'relative', zIndex: 2 }}>
          <Box className="hero-animate">
            <Typography variant="h1" sx={{ 
              mb: 3, 
              fontWeight: 900, 
              fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' },
              textShadow: '0px 4px 12px rgba(0,0,0,0.3)',
              letterSpacing: '-0.02em'
            }}>
              {t('home.welcome')}
            </Typography>
            <Typography variant="h5" sx={{ 
              mb: 2, 
              opacity: 0.95, 
              fontWeight: 500, 
              fontSize: { xs: '1.1rem', sm: '1.4rem' },
              maxWidth: '800px',
              mx: 'auto'
            }}>
              {t('home.subtitle')}
            </Typography>
          </Box>
          
          <Box sx={{ my: 5 }}>
            <Typography variant="body1" sx={{ 
              opacity: 1, 
              fontSize: { xs: '1rem', sm: '1.2rem' }, 
              fontStyle: 'italic',
              fontWeight: 500,
              textShadow: '0 2px 4px rgba(0,0,0,0.5)'
            }}>
              <span className="circle-sketch-highlight">{t('home.savingsPromise')}</span>
            </Typography>
          </Box>

          <Button
            variant="contained"
            size="large"
            onClick={() => setLoginOpen(true)}
            sx={{
              backgroundColor: theme.palette.secondary.main,
              color: 'white',
              px: { xs: 4, sm: 6 },
              py: { xs: 1.5, sm: 2 },
              fontSize: { xs: '1.1rem', sm: '1.25rem' },
              fontWeight: 800,
              borderRadius: '50px',
              boxShadow: `0px 8px 25px ${alpha(theme.palette.secondary.main, 0.4)}`,
              '&:hover': {
                backgroundColor: theme.palette.secondary.dark,
                transform: 'translateY(-3px)',
                boxShadow: `0px 12px 30px ${alpha(theme.palette.secondary.main, 0.6)}`,
              },
              transition: 'all 0.3s ease',
            }}
          >
            {t('home.startSaving')}
          </Button>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ mb: 8 }}>
        
        {/* Leaderboard Section */}
        <Box id="leaderboard" sx={{ mb: { xs: 8, md: 12 }, scrollMarginTop: '100px' }}>
          {/* Title - Icon & Text Row Style */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 4, textAlign: 'center' }}>
            <Box sx={{ 
              width: { xs: 40, sm: 50 }, 
              height: { xs: 40, sm: 50 }, 
              borderRadius: '50%', 
              backgroundColor: alpha(theme.palette.secondary.main, 0.1), 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              mr: 2 
            }}>
              <FontAwesomeIcon icon={faFireAlt} style={{ color: theme.palette.secondary.main }} size="lg" />
            </Box>
            <Box sx={{ textAlign: 'left' }}>
              <Typography variant="h2" fontWeight={700} sx={{ lineHeight: 1.1 }}>
                {t('home.leaderboardTitle')}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                {t('home.leaderboardSubtitle')}
              </Typography>
            </Box>
          </Box>

          {loading ? (
            <ListSkeleton count={3} />
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {leaderboard.map((item, index) => {
                const isTop3 = index < 3;
                const rankColor = getRankColor(index);
                
                // Determine name order based on language
                const primaryName = isEnglish ? item.englishName : item.productName;
                
                return (
                  <Card
                    key={index}
                    onClick={() => setLoginOpen(true)}
                    sx={{
                      cursor: 'pointer',
                      position: 'relative',
                      overflow: 'visible',
                      transition: 'all 0.3s ease',
                      borderLeft: isTop3 ? `4px solid ${rankColor}` : `4px solid ${theme.palette.grey[300]}`,
                      boxShadow: isTop3 ? getRankGlow(index) : 1,
                      '&:hover': { 
                        transform: 'translateY(-4px)', 
                        boxShadow: 4,
                        // CHANGED: Target the crown icon on hover for smooth rise effect
                        '& .crown-icon': {
                            transform: 'scale(1.2) translateY(-5px)',
                        }
                      },
                    }}
                  >
                    {isTop3 && (
                      <Box 
                        className="crown-icon" // Added class for targeting
                        sx={{
                            position: 'absolute',
                            top: -10,
                            right: 20,
                            color: rankColor,
                            fontSize: '1.2rem',
                            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
                            transition: 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)', // Smooth growing transition
                            // Removed continuous animation
                        }}
                      >
                        <FontAwesomeIcon icon={faCrown} />
                      </Box>
                    )}
                    
                    <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
                      {/* Main Flex Container: Column on Mobile, Row on Desktop */}
                      <Box sx={{ 
                        display: 'flex', 
                        flexDirection: { xs: 'column', sm: 'row' },
                        alignItems: { xs: 'stretch', sm: 'center' },
                        justifyContent: 'space-between',
                        gap: 2
                      }}>
                        
                        {/* LEFT: Rank and Product Info - 50% width on Desktop */}
                        <Box sx={{ 
                          display: 'flex', 
                          alignItems: 'center',
                          width: { xs: '100%', md: '50%' },
                          minWidth: { md: '50%' }
                        }}>
                          <Avatar 
                            sx={{ 
                              bgcolor: rankColor, 
                              color: 'white', 
                              fontWeight: 800, 
                              width: 44, 
                              height: 44, 
                              mr: 2,
                              fontSize: '1rem',
                              boxShadow: 2
                            }}
                          >
                            {index + 1}
                          </Avatar>
                          <Typography variant="h6" fontWeight={600} sx={{ whiteSpace: { xs: 'normal', md: 'nowrap' }, overflow: { md: 'hidden' }, textOverflow: { md: 'ellipsis' }, maxWidth: '90%', fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
                            {primaryName}
                          </Typography>
                        </Box>

                        {/* RIGHT: Prices and Action - 50% width on Desktop */}
                        <Box sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          // Mobile: Space between elements; Desktop: Align end (or space-between to fill)
                          justifyContent: { xs: 'space-between', md: 'space-around' },
                          width: { xs: '100%', md: '50%' },
                          gap: { xs: 1, md: 3 },
                          mt: { xs: 1, md: 0 } // Small margin on mobile to separate from title
                        }}>
                          {/* Prices - 2 columns side by side */}
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                             {/* Max Price Column */}
                             <Box sx={{ textAlign: 'right', display: { xs: 'none', sm: 'block' } }}>
                                <Typography variant="caption" color="text.secondary" display="block">
                                   {t('home.leaderboardProductAvgPrice')}
                                </Typography>
                                <Typography variant="body2" sx={{ textDecoration: 'line-through', color: 'text.secondary' }}>
                                  <FontAwesomeIcon icon={faYenSign} size="xs" />{item.maxPrice}
                                </Typography>
                             </Box>

                             {/* Best Price Column */}
                             <Box sx={{ textAlign: 'right' }}>
                                <Typography variant="caption" color="success.main" display="block" fontWeight={600}>
                                  {t('home.leaderboardProductBestPrice')}
                                </Typography>
                                <Typography variant="h6" color="success.main" fontWeight={800} sx={{ lineHeight: 1 }}>
                                  <FontAwesomeIcon icon={faYenSign} size="xs" />{item.minPrice}
                                </Typography>
                             </Box>
                          </Box>

                          {/* Action Block: Savings & Button */}
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Chip 
                                label={t('home.savePercent', { percent: item.savingsPercent.toFixed(0) })}
                                size="small"
                                color="success"
                                sx={{ fontWeight: 800, height: 28, color: '#ffffff' }} 
                              />
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Button 
                                variant="contained" 
                                size="small"
                                color="primary"
                                onClick={() => setLoginOpen(true)} 
                                sx={{ borderRadius: 2, minWidth: '80px', fontSize: { xs: '0.85rem', sm: '1rem' } }}
                              >
                                <FontAwesomeIcon icon={faLock} style={{ marginRight: 6 }} />
                                {t('home.joinNow')}
                              </Button>
                          </Box>
                        </Box>

                      </Box>
                    </CardContent>
                  </Card>
                );
              })}
            </Box>
          )}
        </Box>

        {/* How It Works Section */}
        <Box id="howItWorks" sx={{ mb: { xs: 8, md: 10 }, scrollMarginTop: '100px' }}>
          {/* Title - Icon & Text Row Style */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 6, textAlign: 'center' }}>
             <Box sx={{ 
                width: { xs: 40, sm: 50 }, 
                height: { xs: 40, sm: 50 }, 
                borderRadius: '50%', 
                backgroundColor: alpha(theme.palette.secondary.main, 0.1), 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                mr: 2 
              }}>
                <FontAwesomeIcon icon={faCircleQuestion} style={{ color: theme.palette.secondary.main }} size="lg" />
            </Box>
            <Box sx={{ textAlign: 'left' }}>
              <Typography variant="h2" fontWeight={700}>
                {t('howItWorks.title')}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('howItWorks.subtitle')}
              </Typography>
            </Box>
          </Box>

          <Grid container spacing={4} sx={{ justifyContent: { xs: 'center', md: 'space-between' } }}>
            {howItWorksSteps.map((step, index) => (
              <Grid key={index}>
                <Card 
                  elevation={0}
                  sx={{ 
                    height: '100%', 
                    textAlign: 'center', 
                    p: { xs: 2, sm: 3 }, 
                    position: 'relative',
                    bgcolor: 'transparent',
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: 4,
                    transition: 'transform 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      borderColor: theme.palette.primary.main,
                      bgcolor: 'white',
                      boxShadow: '0 10px 40px rgba(0,0,0,0.08)'
                    }
                  }}
                >
                  <Box sx={{ 
                    width: 80, 
                    height: 80, 
                    borderRadius: '24px', 
                    backgroundColor: alpha(theme.palette.primary.main, 0.05), 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    margin: '0 auto', 
                    mb: 3, 
                    position: 'relative',
                    transform: 'rotate(45deg)'
                  }}>
                    <Box sx={{ transform: 'rotate(-45deg)' }}>
                      <FontAwesomeIcon icon={step.icon} style={{ fontSize: '2rem', color: theme.palette.primary.main }} />
                    </Box>
                    <Box sx={{ 
                      position: 'absolute', 
                      top: -10, 
                      right: -10, 
                      backgroundColor: theme.palette.secondary.main, 
                      color: 'white', 
                      width: 32, 
                      height: 32, 
                      borderRadius: '50%', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      fontWeight: 800, 
                      fontSize: '0.9rem',
                      boxShadow: 3,
                      transform: 'rotate(-45deg)'
                    }}>
                      {index + 1}
                    </Box>
                  </Box>
                  <Typography variant="h6" fontWeight={700} gutterBottom sx={{ mt: 2 }}>{step.title}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 280, margin: '0 auto', lineHeight: 1.6 }}>
                    {step.description}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Developer Note Section */}
        <Box id="developerNote" sx={{ mb: 4, scrollMarginTop: '100px' }}>
          <Paper 
            elevation={0}
            sx={{ 
              p: { xs: 4, md: 6 }, 
              background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.02)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`, 
              border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
              borderLeft: `6px solid ${theme.palette.secondary.main}`,
              borderRadius: 4,
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <Box sx={{ position: 'absolute', right: -20, top: -20, opacity: 0.05, transform: 'rotate(15deg)' }}>
              <FontAwesomeIcon icon={faHandshake} size="10x" />
            </Box>
            
            <Grid container spacing={4} alignItems="center">
              <Grid>
                <Typography variant="h4" fontWeight={800} gutterBottom sx={{ color: 'primary.main', fontSize: { xs: '1.5rem', sm: '2rem' } }}>
                  {t('developerNote.title')}
                </Typography>
                <Typography variant="body1" sx={{ 
                  fontSize: { xs: '1rem', sm: '1.1rem' }, 
                  lineHeight: 1.8, 
                  color: 'text.secondary',
                  mb: 3,
                  position: 'relative',
                  zIndex: 1
                }}>
                  {t('developerNote.content')}
                </Typography>
              </Grid>
              <Grid sx={{ textAlign: { xs: 'left', md: 'center' } }}>
                <Button 
                  variant="contained" 
                  color="secondary" 
                  size="large" 
                  onClick={() => setLoginOpen(true)} 
                  startIcon={<FontAwesomeIcon icon={faHandshake} />} 
                  sx={{ 
                    px: 4, 
                    py: 1.5,
                    fontWeight: 700,
                    borderRadius: 3,
                    boxShadow: 4
                  }}
                >
                  {t('developerNote.joinCommunity')}
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Box>
      </Container>
      <LoginDialog open={loginOpen} onOpenChange={setLoginOpen} />
    </Box>
  );
};

export default Home;