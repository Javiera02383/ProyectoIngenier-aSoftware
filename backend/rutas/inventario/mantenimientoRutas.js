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
        console.error('Error en uploadImagenMantenimiento:', err);
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({ error: 'El archivo es demasiado grande. Máximo 5MB' });
        }
        if (err.code === 'LIMIT_FILE_COUNT') {
          return res.status(400).json({ error: 'Solo se permite un archivo' });
        }
        if (err.message && err.message.includes('Tipo de archivo no permitido')) {
          return res.status(400).json({ error: 'Solo se permiten archivos de imagen (JPG, JPEG, PNG)' });
        }
        return res.status(400).json({ error: err.message || 'Error al procesar la imagen' });  
      }   
      
      // Si hay archivo, agregar el nombre al body
      if (req.file) {  
        req.body.nombreImagen = req.file.filename;  
        console.log('Imagen recibida:', req.file.filename);
        console.log('Body completo después de procesar imagen:', req.body);
      } else {
        console.log('No se recibió imagen');
        console.log('Body completo sin imagen:', req.body);
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
    
    if (!mantenimiento || !mantenimiento.nombreImagen) {  
      return res.status(404).json({ error: 'Imagen de mantenimiento no encontrada' });  
    }  
      
    const filePath = path.resolve(__dirname, '../../public/img/mantenimiento', mantenimiento.nombreImagen);  
    console.log('Buscando imagen en:', filePath);
    
    if (!fs.existsSync(filePath)) {  
      console.error('Archivo no encontrado:', filePath);
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
  } catch (error) {  
    console.error('Error al servir imagen:', error);  
    res.status(500).json({ error: 'Error al obtener imagen de mantenimiento' });  
  }  
});

// Endpoint alternativo para servir imágenes directamente desde la ruta estática
router.get('/mantenimiento/:id/imagen/directa', verificarUsuario, async (req, res) => {
  try {
    const Mantenimiento = require('../../modelos/inventario/Mantenimiento');
    const mantenimiento = await Mantenimiento.findByPk(req.params.id);
    
    if (!mantenimiento || !mantenimiento.nombreImagen) {
      return res.status(404).json({ error: 'Imagen de mantenimiento no encontrada' });
    }
    
    // Redirigir a la ruta estática
    const imagenUrl = `/public/img/mantenimiento/${mantenimiento.nombreImagen}`;
    res.redirect(imagenUrl);
  } catch (error) {
    console.error('Error al redirigir imagen:', error);
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

// Actualizar mantenimiento con imagen (nueva ruta para manejar FormData)
router.put('/mantenimiento/:id/con-imagen',  
  verificarUsuario,  
  (req, res, next) => {  
    uploadImagenMantenimiento(req, res, (err) => {  
      if (err) {  
        console.error('Error en uploadImagenMantenimiento:', err);
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({ error: 'El archivo es demasiado grande. Máximo 5MB' });
        }
        if (err.code === 'LIMIT_FILE_COUNT') {
          return res.status(400).json({ error: 'Solo se permite un archivo' });
        }
        if (err.message && err.message.includes('Tipo de archivo no permitido')) {
          return res.status(400).json({ error: 'Solo se permiten archivos de imagen (JPG, JPEG, PNG)' });
        }
        return res.status(400).json({ error: err.message || 'Error al procesar la imagen' });  
      }   
      
      // Si hay archivo, agregar el nombre al body
      if (req.file) {  
        req.body.nombreImagen = req.file.filename;  
        console.log('Nueva imagen recibida para edición:', req.file.filename);
        console.log('Body completo después de procesar imagen para edición:', req.body);
      } else {
        console.log('No se recibió nueva imagen para edición');
        console.log('Body completo para edición sin nueva imagen:', req.body);
      }
      
      next();  
    });  
  },  
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

// Eliminar imagen de mantenimiento
router.delete('/mantenimiento/:id/imagen',  
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
  mantenimientoController.eliminarImagenMantenimiento  
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