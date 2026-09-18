import React, { createContext, useContext, useState, useEffect } from 'react';
import { getUsers, initDB } from '../services/mockDbService';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initDB(); // Ensure DB is initialized
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    const users = getUsers();
    const foundUser = users.find(u => u.email === email && u.password === password);
    if (foundUser) {
      // Don't store password in context/localstorage in real app
      const userPayload = {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
        role: foundUser.role,
        organizationId: foundUser.organizationId
      };
      setUser(userPayload);
      localStorage.setItem('user', JSON.stringify(userPayload));
      return { success: true, user: userPayload };
    }
    return { success: false, message: 'Invalid credentials' };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
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
