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
  
  updateUsername: async (username) => {
    const response = await api.put('/user/username', { "username": username });
    return response.data;
  },

  updateUserAvatarId: async (userAvatarId) => {
    const response = await api.put('/user/avatar/id', { "userAvatarId": userAvatarId });
    return response.data;
  },

  updatePreferredStoreProximity: async (proximity) => {
    const response = await api.put('/user/proximity', { "preferredStoreProximity": proximity });
    return response.data;
  },
};

export const leaderboardAPI = {
  getTopSavings: async () => {
    const response = await api.get('/leaderboard/top-savings');
    return response.data;
  },
};

export const feedbackAPI = {
  getFeedback: async () => {
    const response = await api.get('/feedback/');
    return response.data;
  },
  submitFeedback: async (userRating, userFeedback) => {
    const response = await api.put('/feedback/', { 
      userRating, 
      userFeedback 
    });
    return response.data;
  },
};

export default api;