// services/facturaService.js    
import axiosInstance from '../../utils/axiosConfig';    
import { authService } from '../seguridad/authService';  
  
// Función para obtener el token del localStorage    
const getAuthToken = () => {    
  return localStorage.getItem('token');    
};    
  
export const facturaService = {  
  obtenerSiguienteNumeroFactura: async () => {  
    const response = await axiosInstance.get('/siguiente-numero');  
    return response.data;  
  },
  
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
  