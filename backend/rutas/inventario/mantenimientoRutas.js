// rutas/inventario/MantenimientoRuta.js  
const express = require('express');  
const { body, param, query } = require('express-validator');  
const mantenimientoController = require('../../controladores/inventario/mantenimientoController');  
const router = express.Router();  
const { verificarUsuario } = require('../../configuraciones/passport');  
  
// Crear mantenimiento  
router.post('/mantenimiento',  
  verificarUsuario,  
  [  
    body('idInventario').isInt({ min: 1 }).withMessage('El idInventario debe ser un número entero positivo')  
      .custom(async value => {  
        const InventarioModel = require('../../modelos/inventario/InventarioModel');  
        const existe = await InventarioModel.findByPk(value);  
        if (!existe) throw new Error('El activo de inventario asociado no existe');  
        return true;  
      }),  
    body('descripcionMantenimiento').isLength({ min: 10, max: 1000 }).withMessage('La descripción debe tener entre 10 y 1000 caracteres'),  
    body('costoMantenimiento').optional().isDecimal().withMessage('El costo debe ser un número decimal'),  
    body('fechaInicio').isISO8601().withMessage('La fecha de inicio debe tener formato válido (YYYY-MM-DD)'),  
    body('fechaFin').optional().isISO8601().withMessage('La fecha de fin debe tener formato válido (YYYY-MM-DD)')  
      .custom((value, { req }) => {  
        if (value && req.body.fechaInicio) {  
          const fechaInicio = new Date(req.body.fechaInicio);  
          const fechaFin = new Date(value);  
          if (fechaFin <= fechaInicio) {  
            throw new Error('La fecha de fin debe ser posterior a la fecha de inicio');  
          }  
        }  
        return true;  
      }),  
    body('idMovimiento').optional().isInt({ min: 1 }).withMessage('El idMovimiento debe ser un número entero positivo')  
      .custom(async value => {  
        if (value) {  
          const Movimiento = require('../../modelos/inventario/Movimiento');  
          const existe = await Movimiento.findByPk(value);  
          if (!existe) throw new Error('El movimiento asociado no existe');  
        }  
        return true;  
      }),  
    body('nombreImagen').optional().isLength({ max: 255 }).withMessage('El nombre de imagen no puede exceder 255 caracteres')  
  ],  
  mantenimientoController.crearMantenimiento  
);  
  
// Obtener todos los mantenimientos con filtros  
router.get('/mantenimiento',  
  verificarUsuario,  
  [  
    query('idInventario').optional().isInt({ min: 1 }).withMessage('El idInventario debe ser un número entero positivo'),  
    query('fechaInicio').optional().isISO8601().withMessage('La fecha de inicio debe tener formato válido (YYYY-MM-DD)'),  
    query('fechaFin').optional().isISO8601().withMessage('La fecha de fin debe tener formato válido (YYYY-MM-DD)'),  
    query('costoMin').optional().isDecimal().withMessage('El costo mínimo debe ser un número decimal'),  
    query('costoMax').optional().isDecimal().withMessage('El costo máximo debe ser un número decimal')  
  ],  
  mantenimientoController.obtenerMantenimientos  
);  
  
// Obtener mantenimiento por ID  
router.get('/mantenimiento/:id',  
  verificarUsuario,  
  [  
    param('id').isInt({ min: 1 }).withMessage('El id debe ser un número entero positivo')  
  ],  
  mantenimientoController.obtenerMantenimientoPorId  
);  

// Obtener historial de mantenimientos por activo  
router.get('/mantenimiento/historial/:idInventario',  
  verificarUsuario,  
  [  
    param('idInventario').isInt({ min: 1 }).withMessage('El idInventario debe ser un número entero positivo')  
      .custom(async value => {  
        const InventarioModel = require('../../modelos/inventario/InventarioModel');  
        const existe = await InventarioModel.findByPk(value);  
        if (!existe) throw new Error('El activo de inventario no existe');  
        return true;  
      })  
  ],  
  mantenimientoController.obtenerHistorialPorActivo  
);  
  
// Actualizar mantenimiento  
router.put('/mantenimiento/:id',  
  verificarUsuario,  
  [  
    param('id').isInt({ min: 1 }).withMessage('El id debe ser un número entero positivo')  
      .custom(async value => {  
        const Mantenimiento = require('../../modelos/inventario/Mantenimiento');  
        const existe = await Mantenimiento.findByPk(value);  
        if (!existe) throw new Error('El mantenimiento no existe');  
        return true;  
      }),  
    body('idInventario').optional().isInt({ min: 1 }).withMessage('El idInventario debe ser un número entero positivo')  
      .custom(async value => {  
        if (value) {  
          const InventarioModel = require('../../modelos/inventario/InventarioModel');  
          const existe = await InventarioModel.findByPk(value);  
          if (!existe) throw new Error('El activo de inventario asociado no existe');  
        }  
        return true;  
      }),  
    body('descripcionMantenimiento').optional().isLength({ min: 10, max: 1000 }).withMessage('La descripción debe tener entre 10 y 1000 caracteres'),  
    body('costoMantenimiento').optional().isDecimal().withMessage('El costo debe ser un número decimal'),  
    body('fechaInicio').optional().isISO8601().withMessage('La fecha de inicio debe tener formato válido (YYYY-MM-DD)'),  
    body('fechaFin').optional().isISO8601().withMessage('La fecha de fin debe tener formato válido (YYYY-MM-DD)')  
      .custom((value, { req }) => {  
        if (value && req.body.fechaInicio) {  
          const fechaInicio = new Date(req.body.fechaInicio);  
          const fechaFin = new Date(value);  
          if (fechaFin <= fechaInicio) {  
            throw new Error('La fecha de fin debe ser posterior a la fecha de inicio');  
          }  
        }  
        return true;  
      }),  
    body('idMovimiento').optional().isInt({ min: 1 }).withMessage('El idMovimiento debe ser un número entero positivo')  
      .custom(async value => {  
        if (value) {  
          const Movimiento = require('../../modelos/inventario/Movimiento');  
          const existe = await Movimiento.findByPk(value);  
          if (!existe) throw new Error('El movimiento asociado no existe');  
        }  
        return true;  
      }),  
    body('nombreImagen').optional().isLength({ max: 255 }).withMessage('El nombre de imagen no puede exceder 255 caracteres')  
  ],  
  mantenimientoController.editarMantenimiento  
);  
  
// Eliminar mantenimiento  
router.delete('/mantenimiento/:id',  
  verificarUsuario,  
  [  
    param('id').isInt({ min: 1 }).withMessage('El id debe ser un número entero positivo')  
      .custom(async value => {  
        const Mantenimiento = require('../../modelos/inventario/Mantenimiento');  
        const existe = await Mantenimiento.findByPk(value);  
        if (!existe) throw new Error('El mantenimiento no existe');  
        return true;  
      })  
  ],  
  mantenimientoController.eliminarMantenimiento  
);  
  
module.exports = router;