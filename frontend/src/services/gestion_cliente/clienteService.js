import axiosInstance from '../../utils/axiosConfig';

export const clienteService = {
  obtenerClientes: async (filtros = {}) => {
    const params = new URLSearchParams();
    if (filtros.Pnombre) params.append('Pnombre', filtros.Pnombre);
    if (filtros.Papellido) params.append('Papellido', filtros.Papellido);

    const response = await axiosInstance.get(`/gestion_cliente/clientes?${params.toString()}`);
    return response.data;
  },

  obtenerClientePorId: async (id) => {
    const response = await axiosInstance.get(`/gestion_cliente/clientes/${id}`);
    return response.data;
  },

  crearCliente: async (clienteData) => {
    const response = await axiosInstance.post('/gestion_cliente/clientes', clienteData);
    return response.data;
  },

  editarCliente: async (id, clienteData) => {
    const response = await axiosInstance.put(`/gestion_cliente/clientes/${id}`, clienteData);
    return response.data;
  },

  eliminarCliente: async (id) => {
    const response = await axiosInstance.delete(`/gestion_cliente/clientes/${id}`);
    return response.data;
  }
};
