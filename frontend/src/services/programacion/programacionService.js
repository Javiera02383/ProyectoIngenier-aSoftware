// services/programacion/programacionService.js
import axiosInstance from '../../utils/axiosConfig';

export const programacionService = {
  // === PROGRAMAS ===
  // Obtener todos los programas
  obtenerProgramas: async () => {
    try {
      const response = await axiosInstance.get('/programacion/programa');
      return response.data;
    } catch (error) {
      console.error('Error obteniendo programas:', error);
      throw error;
    }
  },

  // Crear un nuevo programa
  crearPrograma: async (programaData) => {
    try {
      const response = await axiosInstance.post('/programacion/programa', programaData);
      return response.data;
    } catch (error) {
      console.error('Error creando programa:', error);
      throw error;
    }
  },

  // Obtener programa por ID
  obtenerProgramaPorId: async (id) => {
    try {
      const response = await axiosInstance.get(`/programacion/programa/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo programa:', error);
      throw error;
    }
  },

  // Actualizar programa
  actualizarPrograma: async (id, programaData) => {
    try {
      const response = await axiosInstance.put(`/programacion/programa/${id}`, programaData);
      return response.data;
    } catch (error) {
      console.error('Error actualizando programa:', error);
      throw error;
    }
  },

  // Eliminar programa
  eliminarPrograma: async (id) => {
    try {
      const response = await axiosInstance.delete(`/programacion/programa/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error eliminando programa:', error);
      throw error;
    }
  },

  // Eliminar programa con órdenes en cascada
  eliminarProgramaConOrdenes: async (id) => {
    try {
      const response = await axiosInstance.delete(`/programacion/programa/${id}?eliminarOrdenes=true`);
      return response.data;
    } catch (error) {
      console.error('Error eliminando programa con órdenes en cascada:', error);
      throw error;
    }
  },

  // === BLOQUES ===
  // Obtener bloques publicitarios por programa
  obtenerBloquesPorPrograma: async (idPrograma) => {
    try {
      const response = await axiosInstance.get(`/programacion/bloque/programa/${idPrograma}`);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo bloques:', error);
      throw error;
    }
  },

  // Obtener todos los bloques publicitarios
  obtenerTodosLosBloques: async () => {
    try {
      const response = await axiosInstance.get('/programacion/bloque');
      return response.data;
    } catch (error) {
      console.error('Error obteniendo bloques:', error);
      throw error;
    }
  },

  // Crear un nuevo bloque
  crearBloque: async (bloqueData) => {
    try {
      const response = await axiosInstance.post('/programacion/bloque', bloqueData);
      return response.data;
    } catch (error) {
      console.error('Error creando bloque:', error);
      throw error;
    }
  },

  // Obtener bloque por ID
  obtenerBloquePorId: async (id) => {
    try {
      const response = await axiosInstance.get(`/programacion/bloque/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo bloque:', error);
      throw error;
    }
  },

  // Actualizar bloque
  actualizarBloque: async (id, bloqueData) => {
    try {
      const response = await axiosInstance.put(`/programacion/bloque/${id}`, bloqueData);
      return response.data;
    } catch (error) {
      console.error('Error actualizando bloque:', error);
      throw error;
    }
  },

  // Eliminar bloque
  eliminarBloque: async (id) => {
    try {
      const response = await axiosInstance.delete(`/programacion/bloque/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error eliminando bloque:', error);
      throw error;
    }
  },

  // === PAUTAS DE PROGRAMACIÓN ===
  // Crear una nueva pauta de programación
  crearPauta: async (pautaData) => {
    try {
      const response = await axiosInstance.post('/programacion/pauta', pautaData);
      return response.data;
    } catch (error) {
      console.error('Error creando pauta de programación:', error);
      throw error;
    }
  },

  // Obtener pautas de programación por programa
  obtenerPautasPorPrograma: async (idPrograma) => {
    try {
      const response = await axiosInstance.get(`/programacion/pauta/programa/${idPrograma}`);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo pautas de programación:', error);
      throw error;
    }
  },

  // Obtener todas las pautas de programación
  obtenerTodasLasPautas: async () => {
    try {
      const response = await axiosInstance.get('/programacion/pauta');
      return response.data;
    } catch (error) {
      console.error('Error obteniendo pautas de programación:', error);
      throw error;
    }
  },

  // === PROGRAMACIÓN POR TIPO DE CALENDARIO ===
  // Obtener programación por tipo de calendario (Lunes_Sabado o Domingo)
  obtenerProgramacionPorTipoCalendario: async (tipoCalendario) => {
    try {
      const response = await axiosInstance.get(`/programacion/programacion/tipo/${tipoCalendario}`);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo programación por tipo de calendario:', error);
      throw error;
    }
  },

  // Eliminar pauta de programación
  eliminarPauta: async (id) => {
    try {
      const response = await axiosInstance.delete(`/programacion/pauta/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error eliminando pauta de programación:', error);
      throw error;
    }
  },

  // Eliminar pauta con anuncios en cascada
  eliminarPautaConAnuncios: async (id) => {
    try {
      const response = await axiosInstance.delete(`/programacion/pauta/${id}?eliminarAnuncios=true`);
      return response.data;
    } catch (error) {
      console.error('Error eliminando pauta con anuncios:', error);
      throw error;
    }
  },

  // Eliminar anuncio individual
  eliminarAnuncio: async (id) => {
    try {
      const response = await axiosInstance.delete(`/programacion/anuncio/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error eliminando anuncio:', error);
      throw error;
    }
  }
};