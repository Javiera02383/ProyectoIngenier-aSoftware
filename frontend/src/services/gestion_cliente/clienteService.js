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
    if (filtros.tipoPersona) params.append('tipoPersona', filtros.tipoPersona);
    if (filtros.razonSocial) params.append('razonSocial', filtros.razonSocial);
    if (filtros.nombreComercial) params.append('nombreComercial', filtros.nombreComercial);

    const response = await axiosInstance.get(`/clientes/cliente?${params.toString()}`);  
    return response.data;  
  },  

  obtenerClientePorId: async (id) => {
    const response = await axiosInstance.get(`/clientes/cliente/${id}`);
    return response.data;
  },

  crearCliente: async (clienteData) => {
    const response = await axiosInstance.post('/clientes/cliente', clienteData);
    return response.data;
  },

  editarCliente: async (id, clienteData) => {
    const response = await axiosInstance.put(`/clientes/cliente/${id}`, clienteData);
    return response.data;
  },

  eliminarCliente: async (id) => {
    const response = await axiosInstance.delete(`/clientes/cliente/${id}`);
    return response.data;
  }
};
