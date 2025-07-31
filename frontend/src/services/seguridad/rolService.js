import axiosInstance from '../../utils/axiosConfig';

export const rolService = {
  obtenerRoles: async () => {
    const response = await axiosInstance.get('/roles/roles');
    return response.data;
  },

  obtenerRolPorId: async (id) => {
    const response = await axiosInstance.get(`/roles/rol/${id}`);
    return response.data;
  },

  crearRol: async (rolData) => {
    const response = await axiosInstance.post('/roles/rol', rolData);
    return response.data;
  },

  actualizarRol: async (id, rolData) => {
    const response = await axiosInstance.put(`/roles/rol/${id}`, rolData);
    return response.data;
  },

  eliminarRol: async (id) => {
    const response = await axiosInstance.delete(`/roles/rol/${id}`);
    return response.data;
  }
};
