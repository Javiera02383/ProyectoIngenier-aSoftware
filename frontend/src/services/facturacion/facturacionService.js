import { axiosInstance } from '../../utils/axiosConfig';

// === SERVICIOS DE FACTURACIÓN ===

// Obtener resumen de facturación del mes actual
export const obtenerResumenFacturacion = async () => {
  try {
    // Por ahora retornamos datos simulados
    // TODO: Implementar llamada real al backend cuando esté disponible
    const fechaActual = new Date();
    const mes = fechaActual.toLocaleString('es-ES', { month: 'long', year: 'numeric' });
    
    return {
      totalMes: 25850.00,
      emitidas: 3,
      pagadas: 2,
      pendientes: 1,
      mes: mes
    };
  } catch (error) {
    console.error('Error obteniendo resumen de facturación:', error);
    throw error;
  }
};

// Obtener estado actual del CAI
export const obtenerEstadoCAI = async () => {
  try {
    // Por ahora retornamos datos simulados
    // TODO: Implementar llamada real al backend cuando esté disponible
    return {
      activo: true,
      rango: "000-001-01-00000001 a 000-001-01-00099999",
      vencimiento: "2025-08-30",
      emitidas: 3,
      limite: 99999,
      disponible: 99996,
      porcentajeUso: 25.0
    };
  } catch (error) {
    console.error('Error obteniendo estado del CAI:', error);
    throw error;
  }
};

// Obtener facturas del mes actual
export const obtenerFacturasMes = async () => {
  try {
    // Por ahora retornamos datos simulados
    // TODO: Implementar llamada real al backend cuando esté disponible
    return [
      { id: 1, cliente: "Cliente A", fecha: "2025-07-01", estado: "pagada", total: 1200 },
      { id: 2, cliente: "Cliente B", fecha: "2025-07-08", estado: "pendiente", total: 950 },
      { id: 3, cliente: "Cliente C", fecha: "2025-07-10", estado: "pagada", total: 700 }
    ];
  } catch (error) {
    console.error('Error obteniendo facturas del mes:', error);
    throw error;
  }
};

// Obtener estadísticas de pagos
export const obtenerEstadisticasPagos = async () => {
  try {
    // Por ahora retornamos datos simulados
    // TODO: Implementar llamada real al backend cuando esté disponible
    return {
      total: 1900.00,
      cantidad: 2,
      promedio: 950.00
    };
  } catch (error) {
    console.error('Error obteniendo estadísticas de pagos:', error);
    throw error;
  }
};

// Obtener estadísticas de canjes
export const obtenerEstadisticasCanjes = async () => {
  try {
    // Por ahora retornamos datos simulados
    // TODO: Implementar llamada real al backend cuando esté disponible
    return {
      total: 1200.00,
      cantidad: 4,
      promedio: 300.00
    };
  } catch (error) {
    console.error('Error obteniendo estadísticas de canjes:', error);
    throw error;
  }
};

// Obtener estadísticas de descuentos
export const obtenerEstadisticasDescuentos = async () => {
  try {
    // Por ahora retornamos datos simulados
    // TODO: Implementar llamada real al backend cuando esté disponible
    return {
      total: 5500.00,
      cantidad: 8,
      promedio: 687.50
    };
  } catch (error) {
    console.error('Error obteniendo estadísticas de descuentos:', error);
    throw error;
  }
};

// Obtener estadísticas de transferencias
export const obtenerEstadisticasTransferencias = async () => {
  try {
    // Por ahora retornamos datos simulados
    // TODO: Implementar llamada real al backend cuando esté disponible
    return {
      total: 8250.00,
      cantidad: 12,
      promedio: 687.50
    };
  } catch (error) {
    console.error('Error obteniendo estadísticas de transferencias:', error);
    throw error;
  }
};
