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
    let avatar = localStorage.getItem('userAvatar');
    
    if (token && username) {
      // Ensure avatar exists for existing users
      if (!avatar) {
        avatar = getRandomEmoji();
        localStorage.setItem('userAvatar', avatar);
      }
      setIsLoggedIn(true);
      setUser({ username, avatar });
    }
    setLoading(false);
  }, []);

  const login = (username, token) => {
    let avatar = localStorage.getItem('userAvatar');
    if (!avatar) {
      avatar = getRandomEmoji();
      localStorage.setItem('userAvatar', avatar);
    }

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
    // We optionally keep userAvatar to persist identity across sessions, 
    // or remove it. Keeping it is usually better for UX.
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