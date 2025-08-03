import axiosInstance from '../../utils/axiosConfig';  
  
export const inventarioService = {  
  obtenerInventarios: async () => {  
    const response = await axiosInstance.get('/inventario/todos');  
    return response.data;  
  },  
  
  obtenerInventarioPorId: async (id) => {  
    const response = await axiosInstance.get(`/inventario/${id}`);  
    return response.data;  
  },  
  
  crearInventario: async (inventarioData) => {  
    const response = await axiosInstance.post('/inventario/nuevoInventario', inventarioData);  
    return response.data;  
  },  
  
  actualizarInventario: async (id, inventarioData) => {  
    const response = await axiosInstance.put(`/inventario/${id}`, inventarioData);  
    return response.data;  
  },  
  
  eliminarInventario: async (id) => {  
    const response = await axiosInstance.delete(`/inventario/${id}`);  
    return response.data;  
  }  
};