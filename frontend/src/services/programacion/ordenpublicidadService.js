// services/programacion/ordenPublicidadService.js  
import axiosInstance from '../../utils/axiosConfig';  
  
export const ordenPublicidadService = {  
  // Obtener todas las órdenes con filtros opcionales  
  obtenerOrdenes: async (filtros = {}) => {  
    const params = new URLSearchParams();  
    if (filtros.estado) params.append('estado', filtros.estado);  
    if (filtros.idCliente) params.append('idCliente', filtros.idCliente);  
    if (filtros.fechaInicio) params.append('fechaInicio', filtros.fechaInicio);  
    if (filtros.fechaFin) params.append('fechaFin', filtros.fechaFin);  
  
    const response = await axiosInstance.get(`/programacion/orden?${params.toString()}`);  
    return response.data;  
  },  
  
  // Obtener orden por ID  
  obtenerOrdenPorId: async (id) => {  
    const response = await axiosInstance.get(`/programacion/orden/${id}`);  
    return response.data;  
  },  
  
  // Crear nueva orden de publicidad  
  crearOrden: async (ordenData) => {  
    const response = await axiosInstance.post('/programacion/orden', ordenData);  
    return response.data;  
  },  
  
  // Actualizar orden existente  
  actualizarOrden: async (id, ordenData) => {  
    const response = await axiosInstance.put(`/programacion/orden/${id}`, ordenData);  
    return response.data;  
  },  
  
  // Aprobar orden (cambiar estado a 'Aprobada')  
  aprobarOrden: async (id) => {  
    const response = await axiosInstance.patch(`/programacion/orden/${id}/aprobar`);  
    return response.data;  
  },  
  
  // Cancelar orden  
  cancelarOrden: async (id) => {  
    const response = await axiosInstance.patch(`/programacion/orden/${id}/cancelar`);  
    return response.data;  
  },  
  
  // Eliminar orden  
  eliminarOrden: async (id) => {  
    const response = await axiosInstance.delete(`/programacion/orden/${id}`);  
    return response.data;  
  },  
  
  // Generar PDF de la orden  
  generarPDF: async (id) => {  
    const response = await axiosInstance.get(`/programacion/orden/${id}/pdf`, {  
      responseType: 'blob'  
    });  
    return response.data;  
  },  
  
  // Visualizar PDF en el navegador  
  visualizarPDF: (id) => {  
    window.open(`${axiosInstance.defaults.baseURL}/programacion/orden/${id}/pdf/view`, '_blank');  
  },  
  
  // Descargar PDF directamente  
  descargarPDF: async (id) => {  
    try {  
      const blob = await ordenPublicidadService.generarPDF(id);  
      const url = window.URL.createObjectURL(blob);  
      const link = document.createElement('a');  
      link.href = url;  
      link.download = `orden-publicidad-${id}.pdf`;  
      document.body.appendChild(link);  
      link.click();  
      document.body.removeChild(link);  
      window.URL.revokeObjectURL(url);  
    } catch (error) {  
      console.error('Error al descargar PDF:', error);  
      throw error;  
    }  
  }  
};