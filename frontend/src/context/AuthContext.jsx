import React, { createContext, useContext, useState, useEffect } from 'react';
import apiClient from '../services/apiClient';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const storedUserStr = sessionStorage.getItem('user');
      const token = sessionStorage.getItem('adminToken');
      
      if (storedUserStr && token) {
        try {
          // Fetch fresh profile from backend to verify token is valid
          const res = await apiClient.get('/auth/profile');
          if (res.success && res.user) {
            // Backend schema uses organization_id, frontend expects organizationId
            const mappedUser = {
                ...res.user,
                organizationId: res.user.organization_id || res.user.organizationId
            };
            setUser(mappedUser);
            sessionStorage.setItem('user', JSON.stringify(mappedUser));
          } else {
             setUser(null);
             sessionStorage.removeItem('user');
             sessionStorage.removeItem('adminToken');
          }
        } catch(e) {
          console.error(e);
          setUser(null);
          sessionStorage.removeItem('user');
          sessionStorage.removeItem('adminToken');
        }
      }
      setLoading(false);
    };
    
    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await apiClient.post('/auth/login', { email, password });
      if (res.success && res.token) {
        const mappedUser = {
            ...res.user,
            organizationId: res.user.organization_id || res.user.organizationId
        };
        setUser(mappedUser);
        sessionStorage.setItem('user', JSON.stringify(mappedUser));
        sessionStorage.setItem('adminToken', res.token); localStorage.setItem('adminToken', res.token);
        return { success: true, user: mappedUser };
      }
      return { success: false, message: res.message || 'Invalid credentials' };
    } catch(e) {
      console.error(e);
      return { success: false, message: e.response?.data?.message || 'An error occurred during login' };
    }
  };

  const logout = async () => {
    try {
      await apiClient.post('/auth/logout');
    } catch(e) {
      console.error(e);
    }
    setUser(null);
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('adminToken');
  };

  const value = {
    user,
    login,
    logout,
    loading,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
