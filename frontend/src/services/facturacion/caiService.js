// services/facturaService.js    
import axiosInstance from '../../utils/axiosConfig';    
import { authService } from '../seguridad/authService';  
  
// Función para obtener el token del localStorage    
const getAuthToken = () => {    
  return localStorage.getItem('token');    
};     
  
export const caiService = {    
  // Obtener CAI activo    
  obtenerCAIActivo: async () => {    
    try {
      const response = await axiosInstance.get('/cai/activo');  
      return response.data;  
    } catch (error) {
      console.error('Error al obtener CAI activo:', error);
      if (error.response?.status === 404) {
        return { cai: null };
      }
      throw error;
    }
  },  
  
  // Guardar datos CAI    
  guardarCAI: async (caiData) => {    
    try {
      const response = await axiosInstance.post('/cai', caiData);  
      return response.data;  
    } catch (error) {
      console.error('Error al guardar CAI:', error);
      throw error;
    }
  },    
    
  // Obtener CAI por ID    
  obtenerCAIPorId: async (idCAI) => {    
    try {
      const response = await axiosInstance.get(`/cai/${idCAI}`);  
      return response.data;  
    } catch (error) {
      console.error('Error al obtener CAI por ID:', error);
      throw error;
    }
  },    
    
  // Actualizar CAI    
  actualizarCAI: async (idCAI, caiData) => {    
    try {
      const response = await axiosInstance.put(`/cai/${idCAI}`, caiData);  
      return response.data;  
    } catch (error) {
      console.error('Error al actualizar CAI:', error);
      throw error;
    }
  }    
};