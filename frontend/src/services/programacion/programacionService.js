// services/programacion/programacionService.js  
import axiosInstance from '../../utils/axiosConfig';  
  
export const programacionService = {  
  // Obtener todos los programas  
  obtenerProgramas: async () => {  
    const response = await axiosInstance.get('/programacion/programa');  
    return response.data;  
  },  
  
  // Obtener bloques publicitarios  
  obtenerBloques: async (idPrograma = null) => {  
    const params = idPrograma ? `?idPrograma=${idPrograma}` : '';  
    const response = await axiosInstance.get(`/programacion/bloques${params}`);  
    return response.data;  
  },  
  
  // Obtener anuncios por bloque  
  obtenerAnunciosPorBloque: async (idBloque) => {  
    const response = await axiosInstance.get(`/programacion/anuncios/${idBloque}`);  
    return response.data;  
  },  
  
  // Obtener programación completa (programas + bloques + anuncios)  
  obtenerProgramacionCompleta: async () => {  
    const response = await axiosInstance.get('/programacion/completa');  
    return response.data;  
  },  
  
  // Obtener órdenes de programación  
  obtenerOrdenesProgramacion: async (filtros = {}) => {  
    const params = new URLSearchParams();  
    if (filtros.idPrograma) params.append('idPrograma', filtros.idPrograma);  
    if (filtros.idOrden) params.append('idOrden', filtros.idOrden);  
      
    const response = await axiosInstance.get(`/programacion/orden-programacion?${params.toString()}`);  
    return response.data;  
  } , 



  // Crear nuevo programa  
  crearPrograma: async (programaData) => {  
    const response = await axiosInstance.post('/programacion/programa', programaData);  
    return response.data;  
  },  
  
  // Crear nueva pauta publicitaria  
  crearPauta: async (pautaData) => {  
    const response = await axiosInstance.post('/programacion/pauta', pautaData);  
    return response.data;  
  },  

  
  
  // Obtener eventos para el calendario  
  obtenerEventosCalendario: async (fechaInicio, fechaFin) => {  
    const params = new URLSearchParams();  
    if (fechaInicio) params.append('fechaInicio', fechaInicio);  
    if (fechaFin) params.append('fechaFin', fechaFin);  
      
    const response = await axiosInstance.get(`/programacion/eventos?${params.toString()}`);  
    return response.data;  
  },  

    crearPauta: async (pautaData) => {  
    const response = await axiosInstance.post('/programacion/pauta', pautaData);  
    return response.data;  
    },  
    
    obtenerClientes: async () => {  
    const response = await axiosInstance.get('/clientes');  
    return response.data;  
    }
};