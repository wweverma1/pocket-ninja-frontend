import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const FOOD_EMOJIS = ["🍱", "🍣", "🍜", "🍲", "🍛", "🍙", "🍚", "🍘", "🍢", "🍡", "🍧", "🍦", "🍰", "🍮", "🍵", "🍶"];

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

  const getRandomEmoji = () => FOOD_EMOJIS[Math.floor(Math.random() * FOOD_EMOJIS.length)];

  useEffect(() => {
    // Check localStorage for direct keys
    const token = localStorage.getItem('authToken');
    const username = localStorage.getItem('username');
    
    if (token && username) {
      const avatar = getRandomEmoji();
      setIsLoggedIn(true);
      setUser({ username, avatar });
    }
    setLoading(false);
  }, []);

  const login = (username, token) => {
    const avatar = getRandomEmoji();
    setIsLoggedIn(true);
    setUser({ username, avatar });
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