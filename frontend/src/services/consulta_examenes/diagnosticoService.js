import axiosInstance from '../../utils/axiosConfig';

export const diagnosticoService = {
  obtenerDiagnosticos: async () => {
    const response = await axiosInstance.get('/consulta_examenes/diagnosticos');
    return response.data;
  },

  obtenerDiagnosticoPorId: async (id) => {
    const response = await axiosInstance.get(`/consulta_examenes/diagnosticos/${id}`);
    return response.data;
  },

  crearDiagnostico: async (diagnosticoData) => {
    const response = await axiosInstance.post('/consulta_examenes/diagnosticos', diagnosticoData);
    return response.data;
  },

  editarDiagnostico: async (id, diagnosticoData) => {
    const response = await axiosInstance.put(`/consulta_examenes/diagnosticos/${id}`, diagnosticoData);
    return response.data;
  },

  eliminarDiagnostico: async (id) => {
    const response = await axiosInstance.delete(`/consulta_examenes/diagnosticos/${id}`);
    return response.data;
  }
};
