import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';
import { Toaster } from 'react-hot-toast';
import Header from './components/common/Header';
import BottomNav from './components/common/BottomNav';
import Home from './pages/Home';
import AuthSuccessHandler from './pages/AuthSuccessHandler';
import AuthFailureHandler from './pages/AuthFailureHandler';
// import Compare from './pages/Compare';
// import Upload from './pages/Upload';
// import Campaigns from './pages/Campaigns';
// import Profile from './pages/Profile';

function App() {
  return (
    <Router>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header />
        <Box component="main" sx={{ flexGrow: 1, pb: 8 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth/success" element={<AuthSuccessHandler />} />
            <Route path="/auth/failure" element={<AuthFailureHandler />} />
            {/* <Route path="/compare" element={<Compare />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/campaigns" element={<Campaigns />} />
            <Route path="/profile" element={<Profile />} /> */}
            <Route path="/dashboard" element={<Home />} />
          </Routes>
        </Box>
        <BottomNav />
        <Toaster />
      </Box>
    </Router>
  );
}

export default App;
