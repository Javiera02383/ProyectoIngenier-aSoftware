import axiosInstance from '../../utils/axiosConfig';

export const empleadoService = {
  obtenerTodosLosEmpleados: async () => {  
  const response = await axiosInstance.get('/empleados/todos-empleados');  
  return response.data;  
},
  obtenerEmpleados: async (filtros = {}) => {
    const params = new URLSearchParams();
    if (filtros.Pnombre) params.append('Pnombre', filtros.Pnombre);
    if (filtros.Papellido) params.append('Papellido', filtros.Papellido);

    const response = await axiosInstance.get(`/empleados?${params.toString()}`);
    return response.data;
  },

  obtenerEmpleadoPorId: async (id) => {
    const response = await axiosInstance.get(`/empleados/${id}`);
    return response.data;
  },

  crearEmpleado: async (empleadoData) => {
    const response = await axiosInstance.post('/empleados', empleadoData);
    return response.data;
  },

  editarEmpleado: async (id, empleadoData) => {
    const response = await axiosInstance.put(`/empleados/${id}`, empleadoData);
    return response.data;
  },

  eliminarEmpleado: async (id) => {
    const response = await axiosInstance.delete(`/empleados/${id}`);
    return response.data;
  }
};
