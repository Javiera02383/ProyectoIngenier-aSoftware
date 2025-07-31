import axiosInstance from '../../utils/axiosConfig';

export const authService = {
  login: async (credentials) => {
    const response = await axiosInstance.post('/auth/login', credentials);
    
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('usuario', JSON.stringify(response.data.user));
    }
    
    return response.data;
  },

  register: async (userData) => {
    try {
      console.log('Iniciando registro con datos:', userData);
      
      // Paso 1: Registrar la persona primero
      const personaData = {
        Pnombre: userData.Pnombre,
        Snombre: userData.Snombre || '',
        Papellido: userData.Papellido,
        Sapellido: userData.Sapellido || '',
        Direccion: userData.Direccion || '',
        DNI: userData.DNI,
        correo: userData.correo,
        fechaNacimiento: userData.fechaNacimiento || null,
        genero: userData.genero
      };
      
      console.log('Enviando datos de persona:', personaData);
      const personaResponse = await axiosInstance.post('/auth/registrar-persona', personaData);
      console.log('Respuesta de persona:', personaResponse.data);
      
      // Paso 2: Registrar el usuario con el idPersona obtenido
      const usuarioData = {
        Nombre_Usuario: userData.Nombre_Usuario,
        contraseña: userData.contraseña, // Con ñ
        idPersona: personaResponse.data.idPersona,
        idrol: parseInt(userData.idrol) // Asegurar que sea número
      };
      
      console.log('Enviando datos de usuario:', usuarioData);
      const usuarioResponse = await axiosInstance.post('/auth/registro', usuarioData);
      console.log('Respuesta de usuario:', usuarioResponse.data);
      
      return usuarioResponse.data;
    } catch (error) {
      console.error('Error detallado en registro:', error);
      if (error.response) {
        console.error('Error response data:', error.response.data);
        const serverError = new Error(error.response.data.mensaje || error.response.data.errores?.[0]?.msg || 'Error en el servidor');
        serverError.response = error.response;
        throw serverError;
      }
      throw error; // Relanzar el error si no es de respuesta del servidor
    }
  },

  verifyPin: async (pinData) => {
    const response = await axiosInstance.post('/auth/verificar-pin', pinData);

    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('usuario', JSON.stringify(response.data.user));
    }

    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
  },

  getToken: () => {
    return localStorage.getItem('token');
  },

  getCurrentUser: () => {
    const usuario = localStorage.getItem('usuario');
    return usuario ? JSON.parse(usuario) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  }
};
