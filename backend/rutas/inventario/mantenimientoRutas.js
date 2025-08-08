// rutas/inventario/MantenimientoRuta.js  
const express = require('express');  
const { body, param, query } = require('express-validator');  
const mantenimientoController = require('../../controladores/inventario/mantenimientoController');  
const InventarioModel = require('../../modelos/inventario/Inventario');
const router = express.Router();  
const { verificarUsuario } = require('../../configuraciones/passport');  
const path = require('path');  
const fs = require('fs');  
const { uploadImagenMantenimiento } = require('../../configuraciones/archivo');

// Crear mantenimiento  
router.post('/mantenimiento',  
  verificarUsuario,
  (req, res, next) => {  
    uploadImagenMantenimiento(req, res, (err) => {  
      if (err) {  
        return res.status(400).json({ error: err.message });  
      }   
      if (req.file) {  
        req.body.nombreImagen = req.file.filename;  
      }  
      next();  
    });  
  },  
  [  
    body('idInventario').isInt({ min: 1 }).withMessage('El idInventario debe ser un número entero positivo')  
      .custom(async value => {  
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
    body('nombreImagen').optional().isLength({ max: 255 }).withMessage('El nombre de imagen no puede exceder 255 caracteres')  //cambio
  ],  
  mantenimientoController.crearMantenimiento  
);
// Endpoint para servir imágenes de mantenimiento  
router.get('/mantenimiento/:id/imagen', verificarUsuario, async (req, res) => {  
  try {  
    const Mantenimiento = require('../../modelos/inventario/Mantenimiento');
    const mantenimiento = await Mantenimiento.findByPk(req.params.id);
    //const mantenimiento = await mantenimientoController.obtenerMantenimientoPorId(req.params.id);  
    if (!mantenimiento || !mantenimiento.nombreImagen) {  
      return res.status(404).json({ error: 'Imagen de mantenimiento no encontrada' });  
    }  
      
    const filePath = path.resolve(__dirname, '../../../public/img/mantenimiento', mantenimiento.nombreImagen);  
    if (!fs.existsSync(filePath)) {  
      return res.status(404).json({ error: 'Archivo de imagen no encontrado' });  
    }  
    // Determinar el tipo de contenido basado en la extensión  
    const ext = path.extname(mantenimiento.nombreImagen).toLowerCase();  
    let contentType = 'image/jpeg';  
    if (ext === '.png') contentType = 'image/png'; 
    if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';  
    
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', 'inline');  
    res.sendFile(filePath);  
    // Headers para mostrar imagen en navegador 
    /*res.setHeader('Content-Type', 'image/jpeg');  
    res.setHeader('Cache-Control', 'no-cache'); */
  } catch (error) {  
    console.error('Error al servir imagen:', error);  
    res.status(500).json({ error: 'Error al obtener imagen de mantenimiento' });  
  }  
});
// Obtener todos los mantenimientos sin filtros  
router.get('/mantenimiento/todos',  
  verificarUsuario,  
  mantenimientoController.obtenerMantenimientoTodos  
);
  
  
// Obtener todos los mantenimientos con filtros  
router.get('/mantenimientos',  
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