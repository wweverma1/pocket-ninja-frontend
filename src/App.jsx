import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { Toaster } from 'react-hot-toast';
import Header from './components/common/Header';
import BottomNav from './components/common/BottomNav';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Onboarding from './pages/Onboarding';
import AuthSuccessHandler from './pages/AuthSuccessHandler';
import AuthFailureHandler from './pages/AuthFailureHandler';
import { useAuth } from './context/AuthContext';
import { useTranslation } from 'react-i18next';

function App() {
  const { isLoggedIn, loading } = useAuth();
  const { t } = useTranslation();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Router>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header />
        <Box component="main" sx={{ flexGrow: 1, pb: 8 }}>
          <Routes>
            <Route path="/" element={!isLoggedIn ? <Home /> : <Navigate to="/dashboard" replace />} />
            
            <Route path="/auth/success" element={<AuthSuccessHandler />} />
            <Route path="/auth/failure" element={<AuthFailureHandler />} />
            
            <Route 
              path="/dashboard" 
              element={isLoggedIn ? <Dashboard /> : <Navigate to="/" replace />} 
            />
            
            <Route 
              path="/onboarding" 
              element={isLoggedIn ? <Onboarding /> : <Navigate to="/" replace />} 
            />
            
            <Route path="/compare" element={isLoggedIn ? <Box sx={{p:4}}>{t('pages.compare')}</Box> : <Navigate to="/" replace />} />
            <Route path="/upload" element={isLoggedIn ? <Box sx={{p:4}}>{t('pages.upload')}</Box> : <Navigate to="/" replace />} />
            <Route path="/campaigns" element={isLoggedIn ? <Box sx={{p:4}}>{t('pages.campaigns')}</Box> : <Navigate to="/" replace />} />
            <Route path="/profile" element={isLoggedIn ? <Box sx={{p:4}}>{t('pages.profile')}</Box> : <Navigate to="/" replace />} />
          </Routes>
        </Box>
        <BottomNav />
        <Toaster />
      </Box>
    </Router>
  );
}

export default App;