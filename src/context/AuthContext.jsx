import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check localStorage for direct keys
    const token = localStorage.getItem('authToken');
    const username = localStorage.getItem('username');
    
    if (token && username) {
      setIsLoggedIn(true);
      setUser({ username });
    }
    setLoading(false);
  }, []);

  const login = (username, token) => {
    setIsLoggedIn(true);
    setUser({ username });
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('username', username);
    localStorage.setItem('authToken', token);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
    localStorage.removeItem('authToken');
  };

  const updateUsername = (newUsername) => {
    setUser(prev => ({ ...prev, username: newUsername }));
    localStorage.setItem('username', newUsername);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout, updateUsername, loading }}>
      {children}
    </AuthContext.Provider>
  );
};