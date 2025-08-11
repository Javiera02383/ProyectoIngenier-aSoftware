// services/programacion/ordenProgramacionService.js
import axiosInstance from '../../utils/axiosConfig';

export const ordenProgramacionService = {
  // Obtener todos los programas disponibles para pautas
  obtenerProgramas: async () => {
    try {
      const response = await axiosInstance.get('/ordenes-publicidad/programas');
      return response.data;
    } catch (error) {
      console.error('Error obteniendo programas:', error);
      throw error;
    }
  },

  // Crear nueva pauta de programación
  crearPauta: async (pautaData) => {
    const response = await axiosInstance.post('/ordenes-publicidad/pautas', pautaData);
    return response.data;
  },

  // Obtener todas las pautas de una orden específica
  obtenerPautasPorOrden: async (idOrden) => {
    const response = await axiosInstance.get(`/ordenes-publicidad/orden/${idOrden}/pautas`);
    return response.data;
  },

  // Obtener pauta por ID
  obtenerPautaPorId: async (id) => {
    const response = await axiosInstance.get(`/ordenes-publicidad/pautas/${id}`);
    return response.data;
  },

  // Actualizar pauta existente
  actualizarPauta: async (id, pautaData) => {
    const response = await axiosInstance.put(`/ordenes-publicidad/pautas/${id}`, pautaData);
    return response.data;
  },

  // Eliminar pauta
  eliminarPauta: async (id) => {
    const response = await axiosInstance.delete(`/ordenes-publicidad/pautas/${id}`);
    return response.data;
  },

  // Cambiar estado de pauta
  cambiarEstadoPauta: async (id, estado) => {
    const response = await axiosInstance.patch(`/ordenes-publicidad/pautas/${id}/estado`, { estado });
    return response.data;
  },

  // Crear múltiples pautas para una orden
  crearMultiplesPautas: async (idOrden, pautas) => {
    const promises = pautas.map(pauta => 
      ordenProgramacionService.crearPauta({
        ...pauta,
        idOrden
      })
    );
    
    const resultados = await Promise.all(promises);
    return resultados;
  },

  // Obtener resumen de pautas por orden
  obtenerResumenPautas: async (idOrden) => {
    const pautas = await ordenProgramacionService.obtenerPautasPorOrden(idOrden);
    
    const resumen = {
      totalPautas: pautas.length,
      totalSpots: pautas.reduce((total, pauta) => total + (pauta.cantidadSpots || 1), 0),
      pautasActivas: pautas.filter(pauta => pauta.estado === 'activo').length,
      pautasPausadas: pautas.filter(pauta => pauta.estado === 'pausado').length,
      pautasCanceladas: pautas.filter(pauta => pauta.estado === 'cancelado').length,
      programas: [...new Set(pautas.map(pauta => pauta.Programa?.nombre).filter(Boolean))],
      horarios: [...new Set(pautas.map(pauta => pauta.Programa?.horaInicio).filter(Boolean))]
    };
    
    return resumen;
  }
};
