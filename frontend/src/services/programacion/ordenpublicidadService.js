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
  
    const response = await axiosInstance.get(`/ordenes-publicidad/orden?${params.toString()}`);  
    return response.data;  
  },  
  
  // Obtener orden por ID  
  obtenerOrdenPorId: async (id) => {  
    const response = await axiosInstance.get(`/ordenes-publicidad/orden/${id}`);  
    return response.data;  
  },  
  
  // Crear nueva orden de publicidad  
  crearOrden: async (ordenData) => {  
    const response = await axiosInstance.post('/ordenes-publicidad/orden', ordenData);  
    return response.data;  
  },  
  
  // Actualizar orden existente  
  actualizarOrden: async (id, ordenData) => {  
    const response = await axiosInstance.put(`/ordenes-publicidad/orden/${id}`, ordenData);  
    return response.data;  
  },  
  
  // Aprobar orden (cambiar estado a 'Aprobada')  
  aprobarOrden: async (id) => {  
    const response = await axiosInstance.patch(`/ordenes-publicidad/orden/${id}/aprobar`);  
    return response.data;  
  },  
  
  // Cancelar orden  
  cancelarOrden: async (id) => {  
    const response = await axiosInstance.patch(`/ordenes-publicidad/orden/${id}/cancelar`);  
    return response.data;  
  },  
  
  // Eliminar orden  
  eliminarOrden: async (id) => {  
    const response = await axiosInstance.delete(`/ordenes-publicidad/orden/${id}`);  
    return response.data;  
  },  
  
  // Verificar si el PDF existe para una orden
  verificarPDFExiste: async (id) => {
    try {
      const orden = await ordenPublicidadService.obtenerOrdenPorId(id);
      return !!orden.archivo_pdf;
    } catch (error) {
      console.error('Error al verificar si existe PDF:', error);
      return false;
    }
  },

  // Generar PDF de la orden (crea el archivo si no existe)  
  generarPDF: async (id) => {  
    try {
      const response = await axiosInstance.get(`/ordenes-publicidad/orden/${id}/pdf`);  
      return response.data;
    } catch (error) {
      console.error('Error al generar PDF:', error);
      throw error;
    }
  },  
  
  // Visualizar PDF en el navegador  
  visualizarPDF: async (id) => {  
    try {
      // Verificar si el PDF existe, si no, generarlo primero
      const pdfExiste = await ordenPublicidadService.verificarPDFExiste(id);
      if (!pdfExiste) {
        console.log('PDF no existe, generando...');
        await ordenPublicidadService.generarPDF(id);
      }
      
      const response = await axiosInstance.get(`/ordenes-publicidad/orden/${id}/pdf/view`, {
        responseType: 'blob'
      });
      
      // Crear un blob URL y abrirlo en una nueva pestaña
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const newWindow = window.open(url, '_blank');
      
      // Limpiar el blob URL después de un tiempo
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
      }, 1000);
      
      return response.data;
    } catch (error) {
      console.error('Error al visualizar PDF:', error);
      throw error;
    }
  },  
  
  // Descargar PDF directamente  
  descargarPDF: async (id) => {  
    try {  
      // Verificar si el PDF existe, si no, generarlo primero
      const pdfExiste = await ordenPublicidadService.verificarPDFExiste(id);
      if (!pdfExiste) {
        console.log('PDF no existe, generando...');
        await ordenPublicidadService.generarPDF(id);
      }
      
      // Usar la ruta de visualización que devuelve el archivo PDF
      const response = await axiosInstance.get(`/ordenes-publicidad/orden/${id}/pdf/view`, {
        responseType: 'blob'
      });
      
      const blob = new Blob([response.data], { type: 'application/pdf' });
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