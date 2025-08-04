import axiosInstance from '../../utils/axiosConfig';

export const clienteService = {
  
  // Para obtener TODOS los clientes sin filtros  
  obtenerTodosLosClientes: async () => {  
    const response = await axiosInstance.get('/clientes/todos-clientes');  
    return response.data;  
  },  
  
  // Para búsqueda con filtros  
  obtenerClientes: async (filtros = {}) => {  
    const params = new URLSearchParams();  
    if (filtros.Pnombre) params.append('Pnombre', filtros.Pnombre);  
    if (filtros.Papellido) params.append('Papellido', filtros.Papellido);  
  
    const response = await axiosInstance.get(`/clientes/cliente?${params.toString()}`);  
    return response.data;  
  },  

  obtenerClientePorId: async (id) => {
    const response = await axiosInstance.get(`/clientes/clientes/${id}`);
    return response.data;
  },

  crearCliente: async (clienteData) => {
    const response = await axiosInstance.post('/clientes/clientes', clienteData);
    return response.data;
  },

  editarCliente: async (id, clienteData) => {
    const response = await axiosInstance.put(`/clientes/clientes/${id}`, clienteData);
    return response.data;
  },

  eliminarCliente: async (id) => {
    const response = await axiosInstance.delete(`/clientes/clientes/${id}`);
    return response.data;
  }
};
