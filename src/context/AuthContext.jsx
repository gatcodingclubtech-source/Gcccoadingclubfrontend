import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Configure axios defaults
  axios.defaults.baseURL = 'https://gcc-backend-api.onrender.com';
  axios.defaults.withCredentials = true;

  // Add interceptor to attach token from localStorage if it exists
  useEffect(() => {
    const interceptor = axios.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('gcc_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
    return () => axios.interceptors.request.eject(interceptor);
  }, []);

  const checkUserLoggedIn = async () => {
    try {
      const res = await axios.get('/api/auth/me');
      if (res.data.success) {
        setUser(res.data.user);
        localStorage.setItem('gcc_user', JSON.stringify(res.data.user));
      }
    } catch (err) {
      // Only clear if it's an explicit 401 Unauthorized
      if (err.response?.status === 401) {
        setUser(null);
        localStorage.removeItem('gcc_user');
        localStorage.removeItem('gcc_token');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const savedUser = localStorage.getItem('gcc_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setLoading(false);
    }
    checkUserLoggedIn();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post('/api/auth/login', { email, password });
      if (res.data.success) {
        setUser(res.data.user);
        localStorage.setItem('gcc_user', JSON.stringify(res.data.user));
        localStorage.setItem('gcc_token', res.data.token);
        return { success: true };
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed';
      setError(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post('/api/auth/register', userData);
      if (res.data.success) {
        setUser(res.data.user);
        localStorage.setItem('gcc_user', JSON.stringify(res.data.user));
        localStorage.setItem('gcc_token', res.data.token);
        return { success: true };
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed';
      setError(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await axios.post('/api/auth/logout');
    } catch (err) {
      console.error('Logout failed', err);
    } finally {
      setUser(null);
      localStorage.removeItem('gcc_user');
      localStorage.removeItem('gcc_token');
    }
  };

  const completeProfile = async (profileData) => {
    setLoading(true);
    try {
      const res = await axios.post('/api/auth/complete-profile', profileData);
      if (res.data.success) {
        setUser(res.data.user);
        localStorage.setItem('gcc_user', JSON.stringify(res.data.user));
        return { success: true };
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Profile update failed';
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
        completeProfile,
        checkUserLoggedIn,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
