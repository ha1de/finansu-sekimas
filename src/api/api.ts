import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL
});

// Add request interceptor to include auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['x-auth-token'] = token;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export const authApi = {
  login: (email: string, password: string) => api.post('/auth/login', { email, password }),
  register: (name: string, email: string, password: string) => api.post('/auth/register', { name, email, password })
};

export const userApi = {
  getUser: () => api.get('/user'),
  updateUser: (name: string) => api.put('/user', { name })
};

export const transactionsApi = {
  getTransactions: () => api.get('/transactions'),
  getTransaction: (id: string) => api.get(`/transactions/${id}`),
  createTransaction: (data: any) => api.post('/transactions', data),
  updateTransaction: (id: string, data: any) => api.put(`/transactions/${id}`, data),
  deleteTransaction: (id: string) => api.delete(`/transactions/${id}`)
};

export default api;