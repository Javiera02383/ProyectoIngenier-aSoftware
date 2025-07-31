import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axiosInstance from '../utils/axiosConfig';

const AuthInterceptor = ({ children }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Interceptor para manejar respuestas
    const responseInterceptor = axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          logout();
          navigate('/auth/login');
        }
        return Promise.reject(error);
      }
    );

    // Cleanup
    return () => {
      axiosInstance.interceptors.response.eject(responseInterceptor);
    };
  }, [logout, navigate]);

  return children;
};

export default AuthInterceptor;
