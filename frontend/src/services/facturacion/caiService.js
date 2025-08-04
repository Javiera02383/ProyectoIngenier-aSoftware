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
    const response = await axiosInstance.get('/cai/activo');  
    return response.data;  
  },  
  
  // Guardar datos CAI    
  guardarCAI: async (caiData) => {    
    const response = await axiosInstance.post('/cai', caiData);  
    return response.data;  
  },    
    
  // Obtener CAI por ID    
  obtenerCAIPorId: async (idCAI) => {    
    const response = await axiosInstance.get(`/cai/${idCAI}`);  
    return response.data;  
  },    
    
  // Actualizar CAI    
  actualizarCAI: async (idCAI, caiData) => {    
    const response = await axiosInstance.put(`/cai/${idCAI}`, caiData);  
    return response.data;  
  }    
};