import { useState, useEffect } from 'react';
import { authService } from '../services/seguridad/authService';

export const useAuthPersistence = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthStatus = () => {
      try {
        const storedUser = authService.getCurrentUser();
        const token = authService.getToken();
        
        if (storedUser && token) {
          setUser(storedUser);
        } else {
          // Si no hay token o usuario, limpiar localStorage
          authService.logout();
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        authService.logout();
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();

    // Escuchar cambios en localStorage de otras pestañas
    const handleStorageChange = (e) => {
      if (e.key === 'token' || e.key === 'usuario') {
        checkAuthStatus();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return { user, setUser, loading };
};
