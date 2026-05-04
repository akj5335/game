import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { supabase } from '../lib/supabase';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Configure axios defaults
  axios.defaults.baseURL = import.meta.env.VITE_API_URL || '';

  useEffect(() => {
    const initAuth = async () => {
      setLoading(true);
      const token = localStorage.getItem('neonplay_token');
      
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        try {
          const res = await axios.get('/api/auth/me');
          setUser(res.data.data.user);
        } catch (err) {
          console.error('Session verification failed', err);
          localStorage.removeItem('neonplay_token');
          delete axios.defaults.headers.common['Authorization'];
          
          // Fallback to guest if exists
          const savedGuest = localStorage.getItem('neonplay_guest');
          if (savedGuest) setUser(JSON.parse(savedGuest));
        }
      } else {
        const savedGuest = localStorage.getItem('neonplay_guest');
        if (savedGuest) setUser(JSON.parse(savedGuest));
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (phoneNumber, password) => {
    try {
      const res = await axios.post('/api/auth/login', { phoneNumber, password });
      const { token, data } = res.data;
      
      if (!token || token === 'undefined') {
        throw new Error('Invalid session token received from server');
      }

      localStorage.setItem('neonplay_token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(data.user);
      localStorage.removeItem('neonplay_guest');
      
      return data.user;
    } catch (err) {
      let errorMessage = 'Login failed';
      if (typeof err === 'string') {
        errorMessage = err;
      } else if (err.response?.data?.message) {
        if (Array.isArray(err.response.data.message)) {
          errorMessage = err.response.data.message[0]?.message || 'Validation error';
        } else {
          errorMessage = err.response.data.message;
        }
      } else if (err.message) {
        errorMessage = err.message;
      }
      throw errorMessage;
    }
  };

  const register = async (userData) => {
    try {
      const res = await axios.post('/api/auth/register', userData);
      const { token, data } = res.data;
      
      if (!token || token === 'undefined') {
        throw new Error('Invalid registration session received from server');
      }

      localStorage.setItem('neonplay_token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(data.user);
      localStorage.removeItem('neonplay_guest');
      
      return data.user;
    } catch (err) {
      let errorMessage = 'Registration failed';
      if (typeof err === 'string') {
        errorMessage = err;
      } else if (err.response?.data?.message) {
        if (Array.isArray(err.response.data.message)) {
          errorMessage = err.response.data.message[0]?.message || 'Validation error';
        } else {
          errorMessage = err.response.data.message;
        }
      } else if (err.message) {
        errorMessage = err.message;
      }
      throw errorMessage;
    }
  };

  const logout = () => {
    localStorage.removeItem('neonplay_token');
    localStorage.removeItem('neonplay_guest');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    // Also sign out from supabase just in case it was used elsewhere
    supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
