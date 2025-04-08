import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['x-auth-token'] = token;
  }
  return config;
}, (error) => Promise.reject(error));

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