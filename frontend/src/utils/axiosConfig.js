import axios from 'axios';

const API_BASE = 'http://localhost:4051/api/optica';

// Crear una instancia de axios
const axiosInstance = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para requests - añadir token automáticamente
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para responses - manejar errores de autenticación
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('Error interceptado en axios:', error);
    console.error('Error response:', error.response?.data);
    console.error('Error status:', error.response?.status);
    
    if (error.response?.status === 401) {
      // Token expirado o inválido
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      window.location.href = '/auth/login';
    }
    
    // Preservar el error original con toda su información
    if (error.response) {
      // El servidor respondió con un código de error
      const serverError = new Error(error.response.data?.mensaje || error.response.data?.message || `Error ${error.response.status}`);
      serverError.response = error.response;
      serverError.status = error.response.status;
      serverError.data = error.response.data;
      return Promise.reject(serverError);
    } else if (error.request) {
      // La petición fue hecha pero no hubo respuesta
      return Promise.reject(new Error('No se pudo conectar con el servidor'));
    } else {
      // Algo pasó al configurar la petición
      return Promise.reject(error);
    }
  }
);

export default axiosInstance;
