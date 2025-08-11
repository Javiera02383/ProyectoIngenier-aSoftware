// rutas/programacion/ordenPublicidadRuta.js  
const express = require('express');  
const { body, param, query } = require('express-validator');  
const ordenController = require('../../controladores/programacion/ordenPublicidadController');  
const router = express.Router();  
const { verificarUsuario } = require('../../configuraciones/passport');  
  
// Crear orden de publicidad  
router.post('/orden',  
  verificarUsuario,  
  [  
    body('idCliente').isInt({ min: 1 }).withMessage('El idCliente debe ser un número entero positivo')  
      .custom(async value => {  
        const Cliente = require('../../modelos/gestion_cliente/Cliente');  
        const existe = await Cliente.findByPk(value);  
        if (!existe) throw new Error('El cliente asociado no existe');  
        return true;  
      }),  
    body('producto').isLength({ min: 3, max: 200 }).withMessage('Producto debe tener entre 3 y 200 caracteres'),  
    body('periodoInicio').isISO8601().withMessage('Período de inicio debe tener formato válido (YYYY-MM-DD)'),  
    body('periodoFin').isISO8601().withMessage('Período de fin debe tener formato válido (YYYY-MM-DD)')  
      .custom((value, { req }) => {  
        if (value && req.body.periodoInicio) {  
          const inicio = new Date(req.body.periodoInicio);  
          const fin = new Date(value);  
          if (fin <= inicio) {  
            throw new Error('La fecha de fin debe ser posterior a la fecha de inicio');  
          }  
        }  
        return true;  
      }),  
    body('valorSinImpuesto').isDecimal({ decimal_digits: '0,2' }).withMessage('Valor sin impuesto debe ser un número decimal'),  
    body('costoTotal').isDecimal({ decimal_digits: '0,2' }).withMessage('Costo total debe ser un número decimal'),  
    body('costoPeriodo').isDecimal({ decimal_digits: '0,2' }).withMessage('Costo del período debe ser un número decimal'),  
    body('idEmpleado').isInt({ min: 1 }).withMessage('ID de empleado debe ser un número entero positivo')  
      .custom(async value => {  
        const Empleado = require('../../modelos/gestion_cliente/Empleado');  
        const existe = await Empleado.findByPk(value);  
        if (!existe) throw new Error('El empleado asociado no existe');  
        return true;  
      })  
  ],  
  ordenController.crearOrden  
);  
  


// Obtener órdenes con filtros  
router.get('/orden',  
  verificarUsuario,  
  [  
    query('estado').optional().isIn(['Pendiente', 'Aprobada', 'En_Emision', 'Finalizada', 'Cancelada']).withMessage('Estado inválido'),  
    query('idCliente').optional().isInt({ min: 1 }).withMessage('El idCliente debe ser un número entero positivo'),  
    query('fechaInicio').optional().isISO8601().withMessage('Fecha de inicio debe tener formato válido (YYYY-MM-DD)'),  
    query('fechaFin').optional().isISO8601().withMessage('Fecha de fin debe tener formato válido (YYYY-MM-DD)')  
  ],  
  ordenController.obtenerOrdenes  
);  
  
// Obtener orden por ID  
router.get('/orden/:id',  
  verificarUsuario,  
  [  
    param('id').isInt({ min: 1 }).withMessage('El id debe ser un número entero positivo')  
  ],  
  ordenController.obtenerOrdenPorId  
);  
  
// Actualizar orden de publicidad  
router.put('/orden/:id',  
  verificarUsuario,  
  [  
    param('id').isInt({ min: 1 }).withMessage('El id debe ser un número entero positivo')  
      .custom(async value => {  
        const OrdenPublicidad = require('../../modelos/programacion/OrdenPublicidad');  
        const existe = await OrdenPublicidad.findByPk(value);  
        if (!existe) throw new Error('La orden de publicidad no existe');  
        return true;  
      }),  
    body('producto').optional().isLength({ min: 3, max: 200 }).withMessage('Producto debe tener entre 3 y 200 caracteres'),  
    body('periodoInicio').optional().isISO8601().withMessage('Período de inicio debe tener formato válido (YYYY-MM-DD)'),  
    body('periodoFin').optional().isISO8601().withMessage('Período de fin debe tener formato válido (YYYY-MM-DD)'),  
    body('valorSinImpuesto').optional().isDecimal({ decimal_digits: '0,2' }).withMessage('Valor sin impuesto debe ser un número decimal'),  
    body('estado').optional().isIn(['Pendiente', 'Aprobada', 'En_Emision', 'Finalizada', 'Cancelada']).withMessage('Estado inválido'),  
    body('fechaAlAire').optional().isISO8601().withMessage('Fecha al aire debe tener formato válido (YYYY-MM-DD)')  
  ],  
  ordenController.editarOrden  
);  
  
// Generar PDF de orden  
router.get('/orden/:id/pdf',  
  verificarUsuario,  
  [  
    param('id').isInt({ min: 1 }).withMessage('El id debe ser un número entero positivo')  
      .custom(async value => {  
        const OrdenPublicidad = require('../../modelos/programacion/OrdenPublicidad');  
        const existe = await OrdenPublicidad.findByPk(value);  
        if (!existe) throw new Error('La orden de publicidad no existe');  
        return true;  
      })  
  ],  
  ordenController.generarPDF  
);  
  
// Visualizar PDF de orden en navegador  
router.get('/orden/:id/pdf/view',  
  verificarUsuario,  
  [  
    param('id').isInt({ min: 1 }).withMessage('El id debe ser un número entero positivo')  
  ],  
  ordenController.visualizarPDF  
);  
  
// Aprobar orden de publicidad  
router.patch('/orden/:id/aprobar',  
  verificarUsuario,  
  [  
    param('id').isInt({ min: 1 }).withMessage('El id debe ser un número entero positivo')  
      .custom(async value => {  
        const OrdenPublicidad = require('../../modelos/programacion/OrdenPublicidad');  
        const orden = await OrdenPublicidad.findByPk(value);  
        if (!orden) throw new Error('La orden de publicidad no existe');  
        if (orden.estado !== 'Pendiente') throw new Error('Solo se pueden aprobar órdenes pendientes');  
        return true;  
      })  
  ],  
  ordenController.aprobarOrden  
);  
  
// Cancelar orden de publicidad  
router.patch('/orden/:id/cancelar',  
  verificarUsuario,  
  [  
    param('id').isInt({ min: 1 }).withMessage('El id debe ser un número entero positivo')  
      .custom(async value => {  
        const OrdenPublicidad = require('../../modelos/programacion/OrdenPublicidad');  
        const orden = await OrdenPublicidad.findByPk(value);  
        if (!orden) throw new Error('La orden de publicidad no existe');  
        if (orden.estado === 'Finalizada') throw new Error('No se puede cancelar una orden finalizada');  
        return true;  
      })  
  ],  
  ordenController.cancelarOrden  
);  
  
// Eliminar orden de publicidad  
router.delete('/orden/:id',  
  verificarUsuario,  
  [  
    param('id').isInt({ min: 1 }).withMessage('El id debe ser un número entero positivo')  
      .custom(async value => {  
        const OrdenPublicidad = require('../../modelos/programacion/OrdenPublicidad');  
        const orden = await OrdenPublicidad.findByPk(value);  
        if (!orden) throw new Error('La orden de publicidad no existe');  
        if (orden.estado === 'En_Emision') throw new Error('No se puede eliminar una orden en emisión');  
        return true;  
      })  
  ],  
  ordenController.eliminarOrden  
);  

// Obtener programas disponibles para pautas de publicidad
router.get('/programas',
  verificarUsuario,
  ordenController.obtenerProgramasDisponibles
);

module.exports = router;