// services/facturaService.js  
 
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
    const token = getAuthToken();  
    const response = await fetch(`${API_BASE}/cai/activo`, {  
      method: 'GET',  
      headers: {  
        'Content-Type': 'application/json',  
        'Authorization': `Bearer ${token}`  
      }  
    });  
  
    if (!response.ok) {  
      throw new Error(`HTTP error! status: ${response.status}`);  
    }  
    return response.json();  
  },

  // Guardar datos CAI  
  guardarCAI: async (caiData) => {  
    const token = getAuthToken();  
    const response = await fetch(`${API_BASE}/cai`, {  
      method: 'POST',  
      headers: {  
        'Content-Type': 'application/json',  
        'Authorization': `Bearer ${token}`  
      },  
      body: JSON.stringify(caiData)  
    });  
  
    if (!response.ok) {  
      throw new Error(`HTTP error! status: ${response.status}`);  
    }  
    return response.json();  
  },  
  
  // Obtener CAI por ID  
  obtenerCAIPorId: async (idCAI) => {  
    const token = getAuthToken();  
    const response = await fetch(`${API_BASE}/cai/${idCAI}`, {  
      method: 'GET',  
      headers: {  
        'Content-Type': 'application/json',  
        'Authorization': `Bearer ${token}`  
      }  
    });  
  
    if (!response.ok) {  
      throw new Error(`HTTP error! status: ${response.status}`);  
    }  
    return response.json();  
  },  
  
  // Actualizar CAI  
  actualizarCAI: async (idCAI, caiData) => {  
    const token = getAuthToken();  
    const response = await fetch(`${API_BASE}/cai/${idCAI}`, {  
      method: 'PUT',  
      headers: {  
        'Content-Type': 'application/json',  
        'Authorization': `Bearer ${token}`  
      },  
      body: JSON.stringify(caiData)  
    });  
  
    if (!response.ok) {  
      throw new Error(`HTTP error! status: ${response.status}`);  
    }  
    return response.json();  
  }  




};