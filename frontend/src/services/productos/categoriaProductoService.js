import axiosInstance from '../../utils/axiosConfig';

export const categoriaProductoService = {
  obtenerCategorias: async () => {
    const response = await axiosInstance.get('/categorias/categoria');
    return response.data;
  },

  obtenerCategoriaPorId: async (id) => {
    const response = await axiosInstance.get(`/categorias/categoria/${id}`);
    return response.data;
  },

  crearCategoria: async (categoriaData) => {
    const response = await axiosInstance.post('/categorias/categoria', categoriaData);
    return response.data;
  },

  actualizarCategoria: async (id, categoriaData) => {
    const response = await axiosInstance.put(`/categorias/categoria/${id}`, categoriaData);
    return response.data;
  },

  eliminarCategoria: async (id) => {
    const response = await axiosInstance.delete(`/categorias/categoria/${id}`);
    return response.data;
  },
  
  buscarCategorias: async (filtros) => {
    const params = new URLSearchParams();
    if (filtros.nombre) params.append('nombre', filtros.nombre);
    if (filtros.marca) params.append('marca', filtros.marca);
    if (filtros.descripcion) params.append('descripcion', filtros.descripcion);

    const response = await axiosInstance.get(`/categorias/categoria/buscar?${params.toString()}`);
    return response.data;
  }
};
