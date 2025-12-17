import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Capture token for all protected requests per backend specs
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  onboard: async (username) => {
    const response = await api.post('/user/onboard', { username });
    return response.data;
  },
};

export const priceAPI = {
  compareCart: async (cartItems, location) => {
    const response = await api.post('/price/compare', { cartItems, location });
    return response.data;
  },
};

export const receiptAPI = {
  uploadReceipt: async (formData) => {
    const response = await api.post('/receipt/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
};

export default api;