import axiosInstance from '../../utils/axiosConfig';

export const empleadoService = {
  obtenerEmpleados: async (filtros = {}) => {
    const params = new URLSearchParams();
    if (filtros.Pnombre) params.append('Pnombre', filtros.Pnombre);
    if (filtros.Papellido) params.append('Papellido', filtros.Papellido);

    const response = await axiosInstance.get(`/gestion_cliente/empleados?${params.toString()}`);
    return response.data;
  },

  obtenerEmpleadoPorId: async (id) => {
    const response = await axiosInstance.get(`/gestion_cliente/empleados/${id}`);
    return response.data;
  },

  crearEmpleado: async (empleadoData) => {
    const response = await axiosInstance.post('/gestion_cliente/empleados', empleadoData);
    return response.data;
  },

  editarEmpleado: async (id, empleadoData) => {
    const response = await axiosInstance.put(`/gestion_cliente/empleados/${id}`, empleadoData);
    return response.data;
  },

  eliminarEmpleado: async (id) => {
    const response = await axiosInstance.delete(`/gestion_cliente/empleados/${id}`);
    return response.data;
  }
};
