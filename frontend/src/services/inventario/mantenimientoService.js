import axiosInstance from '../../utils/axiosConfig';  
  
export const mantenimientoService = {  
  obtenerMantenimientos: async (filtros = {}) => {  
    const params = new URLSearchParams();  
      
    // Solo agregar parámetros que tengan valor  
    Object.entries(filtros).forEach(([key, value]) => {  
      if (value && value !== '') {  
        params.append(key, value);  
      }  
    });  
  
    const queryString = params.toString();  
    const url = queryString ? `/inventario/mantenimientos?${queryString}` : '/inventario/mantenimientos';  
      
    const response = await axiosInstance.get(url);  
    return response.data;  
  },  

  // NUEVO: Método sin filtros  
  obtenerMantenimientoTodos: async () => {  
    const response = await axiosInstance.get('/inventario/mantenimiento/todos');  
    return response.data;  
  }, 
  
  obtenerMantenimientoPorId: async (id) => {  
    const response = await axiosInstance.get(`/inventario/mantenimiento/${id}`);  
    return response.data;  
  },  
  
  crearMantenimiento: async (mantenimientoData) => {  
    const config = {};
    if (mantenimientoData instanceof FormData){
      config.headers = {
        'Content-Type': 'multipart/form-data'
      };
    }
    const response = await axiosInstance.post('/inventario/mantenimiento', mantenimientoData, config);  
    return response.data;  
  },  
  
  editarMantenimiento: async (id, mantenimientoData) => {  
    const response = await axiosInstance.put(`/inventario/mantenimiento/${id}`, mantenimientoData);  
    return response.data;  
  },
  
  editarMantenimientoConImagen: async (id, mantenimientoData) => {
    const config = {};
    if (mantenimientoData instanceof FormData) {
      config.headers = {
        'Content-Type': 'multipart/form-data'
      };
    }
    const response = await axiosInstance.put(`/inventario/mantenimiento/${id}/con-imagen`, mantenimientoData, config);
    return response.data;
  },
  
  eliminarMantenimiento: async (id) => {  
    const response = await axiosInstance.delete(`/inventario/mantenimiento/${id}`);  
    return response.data;  
  },

  eliminarImagenMantenimiento: async (id) => {
    const response = await axiosInstance.delete(`/inventario/mantenimiento/${id}/imagen`);
    return response.data;
  }
};