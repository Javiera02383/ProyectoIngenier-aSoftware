import axiosInstance from '../../utils/axiosConfig';

export const productoService = {
  // Obtener todos los productos
  obtenerProductos: async () => {
    const response = await axiosInstance.get('/productos/producto');
    return response.data;
  },

  // Obtener producto por ID
  obtenerProductoPorId: async (id) => {
    const response = await axiosInstance.get(`/productos/producto/${id}`);
    return response.data;
  },

  // Crear producto con imagen opcional
  crearProducto: async (productoData, imagen = null) => {
    let response;
    
    // Crear el producto primero
    response = await axiosInstance.post('/productos/producto', productoData);
    
    // Si hay imagen, subirla después
    if (imagen && response.data.producto) {
      try {
        const formData = new FormData();
        formData.append('imagen', imagen);
        
        await axiosInstance.post(`/productos/imagen?id=${response.data.producto.idProducto}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } catch (imageError) {
        console.warn('Producto creado pero error al subir imagen:', imageError);
        // No fallar completamente si solo falla la imagen
      }
    }
    
    return response.data;
  },

  // Actualizar producto
  actualizarProducto: async (id, productoData) => {
    const response = await axiosInstance.put(`/productos/producto/${id}`, productoData);
    return response.data;
  },

  // Actualizar imagen del producto
  actualizarImagenProducto: async (id, imagen) => {
    const formData = new FormData();
    formData.append('imagen', imagen);
    
    const response = await axiosInstance.post(`/productos/imagen?id=${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Eliminar producto
  eliminarProducto: async (id) => {
    const response = await axiosInstance.delete(`/productos/producto/${id}`);
    return response.data;
  },

  // Buscar productos
  buscarProductos: async (filtros) => {
    const params = new URLSearchParams();
    if (filtros.nombre) params.append('nombre', filtros.nombre);
    if (filtros.marca) params.append('marca', filtros.marca);
    if (filtros.categoria) params.append('categoria', filtros.categoria);
    if (filtros.precioMin) params.append('precioMin', filtros.precioMin);
    if (filtros.precioMax) params.append('precioMax', filtros.precioMax);

    const response = await axiosInstance.get(`/productos/producto/buscar?${params.toString()}`);
    return response.data;
  }
};
