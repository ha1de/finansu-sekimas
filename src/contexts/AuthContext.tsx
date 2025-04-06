import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

interface User {
  _id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  navigateAfterAuth: (path: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [postAuthNavigation, setPostAuthNavigation] = useState<string | null>(null);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          const response = await axios.get('/api/user', {
            headers: {
              'x-auth-token': storedToken
            }
          });
          setUser(response.data);
        } catch (error) {
          localStorage.removeItem('token');
          setToken(null);
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const navigateAfterAuth = (path: string) => {
    window.location.href = path;
  };

  const login = async (email: string, password: string) => {
    const response = await axios.post('/api/auth/login', { email, password });
    const { token, ...userData } = response.data;
    localStorage.setItem('token', token);
    setToken(token);
    setUser(userData);
    navigateAfterAuth('/transactions');
  };

  const register = async (name: string, email: string, password: string) => {
    const response = await axios.post('/api/auth/register', { name, email, password });
    const { token, ...userData } = response.data;
    localStorage.setItem('token', token);
    setToken(token);
    setUser(userData);
    navigateAfterAuth('/transactions');
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    navigateAfterAuth('/login');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, loading, navigateAfterAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};