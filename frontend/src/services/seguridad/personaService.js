import axiosInstance from '../../utils/axiosConfig';

export const personaService = {
  obtenerPersonas: async () => {
    const response = await axiosInstance.get('/personas/persona');
    return response.data;
  },

  obtenerPersonaPorId: async (id) => {
    const response = await axiosInstance.get(`/personas/persona/${id}`);
    return response.data;
  },

  crearPersona: async (personaData) => {
    const response = await axiosInstance.post('/personas/persona', personaData);
    return response.data;
  },

  actualizarPersona: async (id, personaData) => {
    const response = await axiosInstance.put(`/personas/persona/${id}`, personaData);
    return response.data;
  },

  eliminarPersona: async (id) => {
    const response = await axiosInstance.delete(`/personas/persona/${id}`);
    return response.data;
  }
};
