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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { isLoggedIn } = useAuth();
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loginOpen, setLoginOpen] = useState(false);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const data = await leaderboardAPI.getTopSavings();
      setLeaderboard(data.slice(0, 5));
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      setLeaderboard([
        { productName: 'コカ・コーラ 500ml', englishName: 'Coca-Cola 500ml', maxPrice: 150, minPrice: 98, savingsPercent: 34.7, cheapestStore: 'AEON' },
        { productName: 'サッポロ一番 味噌ラーメン', englishName: 'Sapporo Ichiban Miso Ramen', maxPrice: 180, minPrice: 128, savingsPercent: 28.9, cheapestStore: 'FamilyMart' },
        { productName: 'キリン 午後の紅茶', englishName: 'Kirin Afternoon Tea', maxPrice: 140, minPrice: 105, savingsPercent: 25.0, cheapestStore: 'Lawson' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const howItWorksSteps = [
    { icon: faShoppingCart, title: t('howItWorks.step1.title'), description: t('howItWorks.step1.description') },
    { icon: faSearch, title: t('howItWorks.step2.title'), description: t('howItWorks.step2.description') },
    { icon: faPiggyBank, title: t('howItWorks.step3.title'), description: t('howItWorks.step3.description') },
  ];

  const highlightColor = theme.palette.secondary.main;
  const highlightCSS = `
    .circle-sketch-highlight { position: relative; display: inline-block; text-decoration: none; }
    .circle-sketch-highlight:before { content: ""; z-index: -1; left: -0.5em; top: -0.1em; border-width: 2px; border-style: solid; border-color: ${highlightColor}; position: absolute; border-right-color: transparent; width: 100%; height: 2em; transform: rotate(2deg); opacity: 0.7; border-radius: 50%; padding: 0.1em 0.25em; }
    .circle-sketch-highlight:after { content: ""; z-index: -1; left: -0.5em; top: 0.1em; padding: 0.1em 0.25em; border-width: 2px; border-style: solid; border-color: ${highlightColor}; border-left-color: transparent; border-top-color: transparent; position: absolute; width: 100%; height: 2em; transform: rotate(-1deg); opacity: 0.7; border-radius: 50%; }
  `;

  const darkOverlay = `radial-gradient(circle at center, ${theme.palette.primary.dark}e6 0%, ${theme.palette.primary.main}66 100%)`;

  return (
    <Box sx={globalStyles.pageContainer}>
      <style>{highlightCSS}</style>
      <LanguageSelectionDialog />

      <Box
        id="hero"
        sx={{
          backgroundImage: `${darkOverlay}, url(/pocket-ninja-background.png)`,
          backgroundSize: 'cover',
          backgroundPosition: { xs: '10% 50%', md: 'center' },
          backgroundRepeat: 'no-repeat',
          color: 'white',
          py: { xs: 8, md: 12 },
          px: 2,
          textAlign: 'center',
          position: 'relative',
        }}
      >
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
          <Typography variant="h1" sx={{ mb: 2, fontWeight: 800, fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' } }}>
            {t('home.welcome')}
          </Typography>
          <Typography variant="h6" sx={{ mb: 1, opacity: 0.95, fontWeight: 400 }}>
            {t('home.subtitle')}
          </Typography>
          <Typography variant="body2" sx={{ mb: 4, opacity: 0.85, fontStyle: 'italic' }}>
            <span className="circle-sketch-highlight">{t('home.savingsPromise')}</span>
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => setLoginOpen(true)}
            sx={{
              backgroundColor: theme.palette.secondary.main,
              px: 5, py: 2, fontWeight: 700,
              '&:hover': { backgroundColor: theme.palette.secondary.dark, transform: 'translateY(-2px)' },
            }}
          >
            {t('home.startSaving')}
          </Button>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ mt: 6, mb: 8 }}>
        <Box id="leaderboard" sx={{ mb: 8, scrollMarginTop: '80px' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', mb: 4, textAlign: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Box sx={{ width: 50, height: 50, borderRadius: '50%', backgroundColor: `${theme.palette.secondary.main}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', mr: 2 }}>
                <FontAwesomeIcon icon={faTrophy} style={{ fontSize: '1.5rem', color: theme.palette.secondary.main }} />
              </Box>
              <Typography variant="h2" fontWeight={700}>{t('home.leaderboardTitle')}</Typography>
            </Box>
            <Typography variant="body1" color="text.secondary" maxWidth="600px">{t('home.leaderboardSubtitle')}</Typography>
          </Box>

          {loading ? <ListSkeleton count={3} /> : (
            <Box>
              {leaderboard.map((item, index) => (
                <Card key={index} sx={{ mb: 2 }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', width: { xs: '100%', sm: '35%' } }}>
                        <Avatar sx={{ bgcolor: index === 0 ? '#FFD700' : index === 1 ? '#C0C0C0' : index === 2 ? '#CD7F32' : theme.palette.grey[400], fontWeight: 700, mr: 2 }}>#{index + 1}</Avatar>
                        <Box sx={{ minWidth: 0 }}>
                          <Typography variant="h6" fontWeight={600} sx={{ lineHeight: 1.2 }}>{item.productName}</Typography>
                          <Typography variant="body2" color="text.secondary">{item.englishName}</Typography>
                        </Box>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                        <Box sx={{ textAlign: 'right' }}>
                          <Typography variant="caption" color="text.secondary" display="block">{t('home.leaderboardProductAvgPrice')}</Typography>
                          <Typography variant="body1" sx={{ textDecoration: 'line-through', color: 'text.secondary' }}>
                            <FontAwesomeIcon icon={faYenSign} />{item.maxPrice}
                          </Typography>
                        </Box>
                        <Box sx={{ textAlign: 'right' }}>
                          <Typography variant="caption" color="success.main" display="block">{t('home.leaderboardProductBestPrice')}</Typography>
                          <Typography variant="h6" color="success.main" fontWeight={700}>
                            <FontAwesomeIcon icon={faYenSign} />{item.minPrice}
                          </Typography>
                        </Box>
                        <Chip label={`${item.savingsPercent.toFixed(1)}% ${t('home.leaderboardProductDiscount')}`} sx={{ ...globalStyles.savingsTag, fontWeight: 700 }} />
                      </Box>
                      <Button variant="contained" size="small" color="secondary" onClick={() => setLoginOpen(true)}>
                        <FontAwesomeIcon icon={faLock} style={{ marginRight: 8 }} /> {t('home.joinNow')}
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
          )}
        </Box>

        <Box id="howItWorks" sx={{ mb: 8, scrollMarginTop: '80px' }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h2" fontWeight={700}>{t('howItWorks.title')}</Typography>
            <Typography variant="body1" color="text.secondary" maxWidth="600px" mx="auto">{t('howItWorks.subtitle')}</Typography>
          </Box>
          <Grid container spacing={3} justifyContent="center">
            {howItWorksSteps.map((step, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card sx={{ textAlign: 'center', p: 4 }}>
                  <Box sx={{ width: 80, height: 80, borderRadius: '50%', backgroundColor: `${theme.palette.primary.main}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', mb: 2 }}>
                    <FontAwesomeIcon icon={step.icon} style={{ fontSize: '2rem', color: theme.palette.primary.main }} />
                  </Box>
                  <Typography variant="h6" fontWeight={600}>{step.title}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 250, mx: 'auto' }}>{step.description}</Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
      <LoginDialog open={loginOpen} onOpenChange={setLoginOpen} />
    </Box>
  );
};

export default Home;