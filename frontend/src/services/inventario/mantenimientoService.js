import axiosInstance from '../../utils/axiosConfig';  
  
export const mantenimientoService = {  
  obtenerMantenimientos: async (filtros = {}) => {  
    const params = new URLSearchParams();  
    if (filtros.idInventario) params.append('idInventario', filtros.idInventario);  
    if (filtros.fechaInicio) params.append('fechaInicio', filtros.fechaInicio);  
    if (filtros.fechaFin) params.append('fechaFin', filtros.fechaFin);  
    if (filtros.costoMin) params.append('costoMin', filtros.costoMin);  
    if (filtros.costoMax) params.append('costoMax', filtros.costoMax);  
  
    const response = await axiosInstance.get(`/mantenimiento?${params.toString()}`);  
    return response.data;  
  },  
  
  obtenerMantenimientoPorId: async (id) => {  
    const response = await axiosInstance.get(`/mantenimiento/${id}`);  
    return response.data;  
  },  
  
  crearMantenimiento: async (mantenimientoData) => {  
    const response = await axiosInstance.post('/mantenimiento', mantenimientoData);  
    return response.data;  
  },  
  
  editarMantenimiento: async (id, mantenimientoData) => {  
    const response = await axiosInstance.put(`/mantenimiento/${id}`, mantenimientoData);  
    return response.data;  
  },  
  
  eliminarMantenimiento: async (id) => {  
    const response = await axiosInstance.delete(`/mantenimiento/${id}`);  
    return response.data;  
  }  
};