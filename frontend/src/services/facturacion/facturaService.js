// services/facturaService.js    
import axiosInstance from '../../utils/axiosConfig';    
import { authService } from '../seguridad/authService';  
  
// Función para obtener el token del localStorage    
const getAuthToken = () => {    
  return localStorage.getItem('token');    
};    
  
export const facturaService = {    
  // Obtener todas las facturas    
  obtenerFacturas: async () => {    
    const response = await axiosInstance.get('/facturas');  
    return response.data;    
  },    
      
  // Crear factura completa    
  crearFacturaCompleta: async (data) => {    
    const response = await axiosInstance.post('/factura-completa', data);  
    return response.data;  
  },    
      
  // Obtener factura por ID    
  obtenerFacturaPorId: async (id) => {    
    const response = await axiosInstance.get(`/factura/${id}`);  
    return response.data;  
  },    
      
  // Anular factura    
  anularFactura: async (id) => {    
    const response = await axiosInstance.put(`/factura/${id}/anular`);  
    return response.data;  
  },    
      
  // Descargar PDF de factura    
  descargarPDF: (id) => {    
    const token = authService.getToken();  
    window.open(`${axiosInstance.defaults.baseURL}/factura/${id}/pdf?token=${token}`, '_blank');    
  }    
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