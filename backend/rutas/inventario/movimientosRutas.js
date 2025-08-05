// rutas/inventario/MovimientoRuta.js  
const express = require('express');  
const { body, param, query } = require('express-validator');  
const movimientoController = require('../../controladores/inventario/movimientoController');  
const InventarioModel = require('../../modelos/inventario/Inventario');  
const router = express.Router();  
const { verificarUsuario } = require('../../configuraciones/passport');  
  
// Crear movimiento  
router.post('/movimiento',  
  verificarUsuario,  
  [  
    body('idInventario').isInt({ min: 1 }).withMessage('El idInventario debe ser un número entero positivo')  
      .custom(async value => {  
        
        const existe = await InventarioModel.findByPk(value);  
        if (!existe) throw new Error('El activo de inventario asociado no existe');  
        return true;  
      }),  
    body('tipoMovimiento').isIn(['Asignacion', 'Mantenimiento', 'Baja']).withMessage('Tipo de movimiento inválido'),  
    body('idEmpleado').optional().isInt({ min: 1 }).withMessage('El idEmpleado debe ser un número entero positivo')  
      .custom(async value => {  
        if (value) {  
          const Empleado = require('../../modelos/gestion_cliente/Empleado');  
          const existe = await Empleado.findByPk(value);  
          if (!existe) throw new Error('El empleado asociado no existe');  
        }  
        return true;  
      }),  
    body('observaciones').optional().isLength({ max: 500 }).withMessage('Las observaciones no pueden exceder 500 caracteres')  
  ],  
  movimientoController.crearMovimiento  
);  
  
// Obtener todos los movimientos con filtros  
router.get('/movimientos',  
  verificarUsuario,  
  [  
    query('tipoMovimiento').optional().isIn(['Asignacion', 'Mantenimiento', 'Baja']).withMessage('Tipo de movimiento inválido'),  
    query('idInventario').optional().isInt({ min: 1 }).withMessage('El idInventario debe ser un número entero positivo'),  
    query('fechaInicio').optional().isISO8601().withMessage('La fecha de inicio debe tener formato válido (YYYY-MM-DD)'),  
    query('fechaFin').optional().isISO8601().withMessage('La fecha de fin debe tener formato válido (YYYY-MM-DD)')  
  ],  
  movimientoController.obtenerMovimientos  
);  
  
// Obtener movimiento por ID  
router.get('/movimiento/:id',  
  verificarUsuario,  
  [  
    param('id').isInt({ min: 1 }).withMessage('El id debe ser un número entero positivo')  
  ],  
  movimientoController.obtenerMovimientoPorId  
);  
  
// Obtener historial de movimientos por activo  
router.get('/movimiento/historial/:idInventario',  
  verificarUsuario,  
  [  
    param('idInventario').isInt({ min: 1 }).withMessage('El idInventario debe ser un número entero positivo')  
      .custom(async value => {  
        const existe = await InventarioModel.findByPk(value);  
        if (!existe) throw new Error('El activo de inventario no existe');  
        return true;  
      })  
  ],  
  movimientoController.obtenerHistorialPorActivo  
);  
  
// Actualizar movimiento  
router.put('/movimiento/:id',  
  verificarUsuario,  
  [  
    param('id').isInt({ min: 1 }).withMessage('El id debe ser un número entero positivo')  
      .custom(async value => {  
        const Movimiento = require('../../modelos/inventario/Movimiento');  
        const existe = await Movimiento.findByPk(value);  
        if (!existe) throw new Error('El movimiento no existe');  
        return true;  
      }),  
    body('idInventario').optional().isInt({ min: 1 }).withMessage('El idInventario debe ser un número entero positivo')  
      .custom(async value => {  
        if (value) {  
          const existe = await InventarioModel.findByPk(value);  
          if (!existe) throw new Error('El activo de inventario asociado no existe');  
        }  
        return true;  
      }),  
    body('tipoMovimiento').optional().isIn(['Asignacion', 'Mantenimiento', 'Baja']).withMessage('Tipo de movimiento inválido'),  
    body('idEmpleado').optional().isInt({ min: 1 }).withMessage('El idEmpleado debe ser un número entero positivo')  
      .custom(async value => {  
        if (value) {  
          const Empleado = require('../../modelos/gestion_cliente/Empleado');  
          const existe = await Empleado.findByPk(value);  
          if (!existe) throw new Error('El empleado asociado no existe');  
        }  
        return true;  
      }),  
    body('observaciones').optional().isLength({ max: 500 }).withMessage('Las observaciones no pueden exceder 500 caracteres')  
  ],  
  movimientoController.editarMovimiento  
);  
  
// Eliminar movimiento  
router.delete('/movimiento/:id',  
  verificarUsuario,  
  [  
    param('id').isInt({ min: 1 }).withMessage('El id debe ser un número entero positivo')  
      .custom(async value => {  
        const Movimiento = require('../../modelos/inventario/Movimiento');  
        const existe = await Movimiento.findByPk(value);  
        if (!existe) throw new Error('El movimiento no existe');  
        return true;  
      })  
  ],  
  movimientoController.eliminarMovimiento  
);  
  
module.exports = router;