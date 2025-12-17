import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@mui/material';
import { Toaster } from 'react-hot-toast';
import Header from './components/common/Header';
import BottomNav from './components/common/BottomNav';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import AuthSuccessHandler from './pages/AuthSuccessHandler';
import AuthFailureHandler from './pages/AuthFailureHandler';
import { useAuth } from './context/AuthContext';

function App() {
  const { isLoggedIn } = useAuth();

  return (
    <Router>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header />
        <Box component="main" sx={{ flexGrow: 1, pb: 10 }}>
          <Routes>
            <Route path="/" element={!isLoggedIn ? <Home /> : <Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={isLoggedIn ? <Dashboard /> : <Navigate to="/" />} />
            
            <Route path="/auth/success" element={<AuthSuccessHandler />} />
            <Route path="/auth/failure" element={<AuthFailureHandler />} />

            <Route 
              path="/onboarding" 
              element={isLoggedIn && user?.isNewUser ? <Onboarding /> : <Navigate to="/" />} 
            />
            
            {/* Placeholder routes for future features */}
            <Route path="/compare" element={isLoggedIn ? <Box sx={{p:4}}>Compare Page</Box> : <Navigate to="/" />} />
            <Route path="/upload" element={isLoggedIn ? <Box sx={{p:4}}>Upload Page</Box> : <Navigate to="/" />} />
            <Route path="/campaigns" element={isLoggedIn ? <Box sx={{p:4}}>Campaigns Page</Box> : <Navigate to="/" />} />
            <Route path="/profile" element={isLoggedIn ? <Box sx={{p:4}}>Profile Page</Box> : <Navigate to="/" />} />
          </Routes>
        </Box>
        <BottomNav />
        <Toaster />
      </Box>
    </Router>
  );
}

export default App;