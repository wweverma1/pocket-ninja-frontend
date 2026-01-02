import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { Toaster } from 'react-hot-toast';
import Header from './components/common/Header';
import BottomNav from './components/common/BottomNav';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Upload from './pages/Upload';
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
            <Route 
              path="/" 
              element={
                !isLoggedIn ? (
                  <Home /> 
                ) : (
                  console.log("app navigating to route: /contribute") || <Navigate to="/contribute" replace />
                )
              } 
            />
            
            <Route path="/auth/success" element={<AuthSuccessHandler />} />
            <Route path="/auth/failure" element={<AuthFailureHandler />} />
            
            <Route path="/shop" element={isLoggedIn ? <Box sx={{p:4}}>{t('pages.compare')}</Box> : <Navigate to="/" replace />} />
            <Route 
              path="/contribute" 
              element={isLoggedIn ? <Upload /> : <Navigate to="/" replace />} 
            />
            {/* <Route path="/campaigns" element={isLoggedIn ? <Box sx={{p:4}}>{t('pages.campaigns')}</Box> : <Navigate to="/" replace />} /> */}
            <Route 
              path="/profile" 
              element={isLoggedIn ? <Profile /> : <Navigate to="/" replace />} 
            />
          </Routes>
        </Box>
        <BottomNav />
        <Toaster />
      </Box>
    </Router>
  );
}

export default App;