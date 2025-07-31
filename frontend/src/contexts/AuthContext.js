
import React, { createContext, useContext } from 'react';
import { authService } from '../services/seguridad/authService';
import { useAuthPersistence } from '../hooks/useAuthPersistence';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const { user, setUser, loading } = useAuthPersistence();

  const login = async (credentials) => {
    const response = await authService.login(credentials);
    if (!response.requiere_2fa) {
      const currentUser = authService.getCurrentUser();
      setUser(currentUser);
    }
    return response;
  };

  const verifyPin = async (pinData) => {
    const response = await authService.verifyPin(pinData);
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    return response;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const isAuthenticated = () => {
    return !!user;
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, verifyPin, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

