import axios from 'axios';

// Base URL - update this with your Flask backend URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

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
export const authAPI = {
  onboard: async (username) => {
    const response = await api.post('/user/onboard', { username });
    return response.data;
  },
};

export const priceAPI = {
  compareCart: async (cartItems, location) => {
    const response = await api.post('/price/compare', {
      cartItems,
      location,
    });
    return response.data;
  },
};

export const receiptAPI = {
  uploadReceipt: async (formData) => {
    const response = await api.post('/receipt/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

export const campaignAPI = {
  getActiveCampaigns: async () => {
    const response = await api.get('/campaigns/active');
    return response.data;
  },
  
  createCampaign: async (campaignData) => {
    const response = await api.post('/campaigns/create', campaignData);
    return response.data;
  },
  
  joinCampaign: async (campaignId) => {
    const response = await api.post(`/campaigns/${campaignId}/join`);
    return response.data;
  },
  
  rateCampaign: async (campaignId, rating) => {
    const response = await api.post(`/campaigns/${campaignId}/rate`, { rating });
    return response.data;
  },
};

export const userAPI = {
  getProfile: async () => {
    const response = await api.get('/user/profile');
    return response.data;
  },
  
  updateProfile: async (profileData) => {
    const response = await api.put('/user/profile', profileData);
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