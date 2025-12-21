import axios from 'axios';

// Base URL - update this with your Flask backend URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests if available using Bearer scheme
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// API endpoints
export const userAPI = {
  getProfile: async () => {
    const response = await api.get('/user/');
    return response.data;
  },
  
  updateUsername: async (profileData) => {
    const response = await api.put('/user/username', profileData);
    return response.data;
  },

  updateUserAvatar: async (profileData) => {
    const response = await api.put('/user/avatar', profileData);
    return response.data;
  },

  updatePreferredStoreProximity: async (profileData) => {
    const response = await api.put('/user/proximity', profileData);
    return response.data;
  },
};

export const leaderboardAPI = {
  getTopSavings: async () => {
    const response = await api.get('/leaderboard/top-savings');
    return response.data;
  },
};

export default api;