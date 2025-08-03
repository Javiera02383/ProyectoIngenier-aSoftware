import axiosInstance from '../../utils/axiosConfig';  
  
export const mantenimientoService = {  
  obtenerMantenimientos: async (filtros = {}) => {  
    const params = new URLSearchParams();  
    if (filtros.idInventario) params.append('idInventario', filtros.idInventario);  
    if (filtros.fechaInicio) params.append('fechaInicio', filtros.fechaInicio);  
    if (filtros.fechaFin) params.append('fechaFin', filtros.fechaFin);  
    if (filtros.costoMin) params.append('costoMin', filtros.costoMin);  
    if (filtros.costoMax) params.append('costoMax', filtros.costoMax);  
  
    const response = await axiosInstance.get(`/inventario/mantenimiento?${params.toString()}`);  
    return response.data;  
  },  
  
  obtenerMantenimientoPorId: async (id) => {  
    const response = await axiosInstance.get(`/inventario/mantenimiento/${id}`);  
    return response.data;  
  },  
  
  obtenerHistorialPorActivo: async (idInventario) => {  
    const response = await axiosInstance.get(`/inventario/mantenimiento/historial/${idInventario}`);  
    return response.data;  
  },  
  
  crearMantenimiento: async (mantenimientoData) => {  
    const response = await axiosInstance.post('/inventario/mantenimiento', mantenimientoData);  
    return response.data;  
  },  
  
  editarMantenimiento: async (id, mantenimientoData) => {  
    const response = await axiosInstance.put(`/inventario/mantenimiento/${id}`, mantenimientoData);  
    return response.data;  
  },  
  
  eliminarMantenimiento: async (id) => {  
    const response = await axiosInstance.delete(`/inventario/mantenimiento/${id}`);  
    return response.data;  
  }  
};