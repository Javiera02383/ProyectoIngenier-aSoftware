// controladores/inventario/MantenimientoController.js  
const { body, validationResult } = require('express-validator');  
const Mantenimiento = require('../../modelos/inventario/Mantenimiento');  
const InventarioModel = require('../../modelos/inventario/Inventario');  
const Movimiento = require('../../modelos/inventario/Movimiento');  
const { Op } = require('sequelize');  
  
// === VALIDACIONES ===  
const reglasCrear = [  
  body('idInventario')  
    .notEmpty().withMessage('El idInventario es obligatorio')  
    .isInt({ min: 1 }).withMessage('El idInventario debe ser un número entero positivo'),  
  body('descripcionMantenimiento')  
    .notEmpty().withMessage('La descripción del mantenimiento es obligatoria')  
    .isLength({ min: 10, max: 1000 }).withMessage('La descripción debe tener entre 10 y 1000 caracteres'),  
  body('costoMantenimiento')  
    .optional()  
    .isDecimal().withMessage('El costo debe ser un número decimal'),  
  body('fechaInicio')  
    .notEmpty().withMessage('La fecha de inicio es obligatoria')  
    .isISO8601().withMessage('La fecha de inicio debe tener formato válido (YYYY-MM-DD)'),  
  body('fechaFin')  
    .optional()  
    .isISO8601().withMessage('La fecha de fin debe tener formato válido (YYYY-MM-DD)'),  
  body('idMovimiento')  
    .optional()  
    .isInt({ min: 1 }).withMessage('El idMovimiento debe ser un número entero positivo'),  
  body('nombreImagen')  
    .optional()  
    .isLength({ max: 255 }).withMessage('El nombre de imagen no puede exceder 255 caracteres')  
];  
  
const reglasEditar = [  
  body('idInventario')  
    .optional()  
    .isInt({ min: 1 }).withMessage('El idInventario debe ser un número entero positivo'),  
  body('descripcionMantenimiento')  
    .optional()  
    .isLength({ min: 10, max: 1000 }).withMessage('La descripción debe tener entre 10 y 1000 caracteres'),  
  body('costoMantenimiento')  
    .optional()  
    .isDecimal().withMessage('El costo debe ser un número decimal'),  
  body('fechaInicio')  
    .optional()  
    .isISO8601().withMessage('La fecha de inicio debe tener formato válido (YYYY-MM-DD)'),  
  body('fechaFin')  
    .optional()  
    .isISO8601().withMessage('La fecha de fin debe tener formato válido (YYYY-MM-DD)'),  
  body('idMovimiento')  
    .optional()  
    .isInt({ min: 1 }).withMessage('El idMovimiento debe ser un número entero positivo'),  
  body('nombreImagen')  
    .optional()  
    .isLength({ max: 255 }).withMessage('El nombre de imagen no puede exceder 255 caracteres')  
];  
  
// === CONTROLADORES ===  
  
// Crear mantenimiento  
const crearMantenimiento = [  
  ...reglasCrear,  
  async (req, res) => {  
    const errores = validationResult(req);  
    if (!errores.isEmpty()) {  
      return res.status(400).json({ errores: errores.array() });  
    }  
    try {  
      // Validar existencia de idInventario  
      const inventario = await InventarioModel.findByPk(req.body.idInventario);  
      if (!inventario) {  
        return res.status(400).json({ mensaje: 'El activo de inventario asociado no existe' });  
      }  
  
      // Validar existencia de idMovimiento si se proporciona  
      if (req.body.idMovimiento) {  
        const movimiento = await Movimiento.findByPk(req.body.idMovimiento);  
        if (!movimiento) {  
          return res.status(400).json({ mensaje: 'El movimiento asociado no existe' });  
        }  
      }  
  
      // Validar que fechaFin sea posterior a fechaInicio si se proporciona  
      if (req.body.fechaFin && req.body.fechaInicio) {  
        const fechaInicio = new Date(req.body.fechaInicio);  
        const fechaFin = new Date(req.body.fechaFin);  
        if (fechaFin <= fechaInicio) {  
          return res.status(400).json({ mensaje: 'La fecha de fin debe ser posterior a la fecha de inicio' });  
        }  
      }  

      // Validar nombre de imagen si se proporciona
      if (req.body.nombreImagen) {
        if (typeof req.body.nombreImagen !== 'string' || req.body.nombreImagen.trim().length === 0) {
          return res.status(400).json({ mensaje: 'El nombre de imagen no puede estar vacío' });
        }
        if (req.body.nombreImagen.length > 255) {
          return res.status(400).json({ mensaje: 'El nombre de imagen es demasiado largo' });
        }
      }

      const mantenimiento = await Mantenimiento.create(req.body);  
      res.status(201).json({ mensaje: 'Mantenimiento creado', mantenimiento });  
    } catch (error) {  
      res.status(500).json({ mensaje: 'Error al crear mantenimiento', error: error.message });  
    }  
  }  
];  
  
// Obtener todos los mantenimientos sin filtros  
const obtenerMantenimientoTodos = async (req, res) => {  
  try {  
    const mantenimientos = await Mantenimiento.findAll({  
      include: [  
        {  
          model: InventarioModel,  
          attributes: ['codigo', 'nombre', 'estado']  
        },  
        {  
          model: Movimiento,  
          attributes: ['tipoMovimiento', 'fechaMovimiento']  
        }  
      ],  
      order: [['fechaInicio', 'DESC']]  
      
    });  
    
    res.json(mantenimientos);  
  } catch (error) {  
    res.status(500).json({ mensaje: 'Error al obtener todos los mantenimientos', error: error.message });  
  }  
};

// Obtener todos los mantenimientos con filtros  
const obtenerMantenimientos = async (req, res) => {  
  try {  
    const { idInventario, fechaInicio, fechaFin, costoMin, costoMax } = req.query;  
    const whereMantenimiento = {};  
      
    if (idInventario) whereMantenimiento.idInventario = idInventario;  
      
    if (fechaInicio && fechaFin) {  
    // Mantenimientos que se superponen con el rango especificado  
    whereMantenimiento[Op.or] = [  
      {  
        fechaInicio: {  
          [Op.between]: [new Date(fechaInicio), new Date(fechaFin)]  
        }  
      },  
      {  
        fechaFin: {  
          [Op.between]: [new Date(fechaInicio), new Date(fechaFin)]  
        }  
      },  
      {  
        [Op.and]: [  
          { fechaInicio: { [Op.lte]: new Date(fechaInicio) } },  
          { fechaFin: { [Op.gte]: new Date(fechaFin) } }  
        ]  
      }  
    ];  
  } else if (fechaInicio) {  
    whereMantenimiento[Op.or] = [  
      { fechaInicio: { [Op.gte]: new Date(fechaInicio) } },  
      { fechaFin: { [Op.gte]: new Date(fechaInicio) } }  
    ];  
  } else if (fechaFin) {  
    whereMantenimiento.fechaInicio = {  
      [Op.lte]: new Date(fechaFin)  
    };  
  }  
  
    const mantenimientos = await Mantenimiento.findAll({  
      where: Object.keys(whereMantenimiento).length ? whereMantenimiento : undefined,  
      include: [  
        {  
          model: InventarioModel,  
          attributes: ['codigo', 'nombre', 'estado']  
        },  
        {  
          model: Movimiento,  
          attributes: ['tipoMovimiento', 'fechaMovimiento']  
        }  
      ],  
      order: [['fechaInicio', 'DESC']]  
    });  
    res.json(mantenimientos);  
  } catch (error) {  
    res.status(500).json({ mensaje: 'Error al obtener mantenimientos', error: error.message });  
  }  
};  
  
// Obtener mantenimiento por ID  
const obtenerMantenimientoPorId = async (req, res) => {  
  const { id } = req.params;  
  try {  
    const mantenimiento = await Mantenimiento.findByPk(id, {  
      include: [  
        {  
          model: InventarioModel,  
          attributes: ['codigo', 'nombre', 'descripcion', 'estado']  
        },  
        {  
          model: Movimiento,  
          attributes: ['tipoMovimiento', 'fechaMovimiento', 'observaciones']  
        }  
      ]  
    });  
    if (!mantenimiento) return res.status(404).json({ mensaje: 'Mantenimiento no encontrado' });  
    res.json(mantenimiento);  
  } catch (error) {  
    res.status(500).json({ mensaje: 'Error al obtener mantenimiento', error: error.message });  
  }  
};  
  
// Obtener historial de mantenimientos por activo  
const obtenerHistorialPorActivo = async (req, res) => {  
  const { idInventario } = req.params;  
  try {  
    const mantenimientos = await Mantenimiento.findAll({  
      where: { idInventario },  
      include: [  
        {  
          model: Movimiento,  
          attributes: ['tipoMovimiento', 'fechaMovimiento']  
        }  
      ],  
      order: [['fechaInicio', 'DESC']]  
    });  
    res.json(mantenimientos);  
  } catch (error) {  
    res.status(500).json({ mensaje: 'Error al obtener historial de mantenimientos', error: error.message });  
  }  
};  
  
// Editar mantenimiento  
const editarMantenimiento = [  
  ...reglasEditar,  
  async (req, res) => {  
    const errores = validationResult(req);  
    if (!errores.isEmpty()) {  
      return res.status(400).json({ errores: errores.array() });  
    }  
    const { id } = req.params;  
    try {  
      const mantenimiento = await Mantenimiento.findByPk(id);  
      if (!mantenimiento) return res.status(404).json({ mensaje: 'Mantenimiento no encontrado' });  
  
      // Validar existencia de idInventario si se proporciona  
      if (req.body.idInventario) {  
        const inventario = await InventarioModel.findByPk(req.body.idInventario);  
        if (!inventario) {  
          return res.status(400).json({ mensaje: 'El activo de inventario asociado no existe' });  
        }  
      }  
  
      // Validar existencia de idMovimiento si se proporciona  
      if (req.body.idMovimiento) {  
        const movimiento = await Movimiento.findByPk(req.body.idMovimiento);  
        if (!movimiento) {  
          return res.status(400).json({ mensaje: 'El movimiento asociado no existe' });  
        }  
      }  
  
      // Validar fechas si se proporcionan  
      const fechaInicio = req.body.fechaInicio || mantenimiento.fechaInicio;  
      const fechaFin = req.body.fechaFin || mantenimiento.fechaFin;  
        
      if (fechaFin && fechaInicio) {  
        const inicio = new Date(fechaInicio);  
        const fin = new Date(fechaFin);  
        if (fin <= inicio) {  
          return res.status(400).json({ mensaje: 'La fecha de fin debe ser posterior a la fecha de inicio' });  
        }  
      }  

      // Validar nombre de imagen si se proporciona
      if (req.body.nombreImagen !== undefined) {
        if (req.body.nombreImagen === null || req.body.nombreImagen === '') {
          // Si se envía null o string vacío, eliminar la imagen
          req.body.nombreImagen = null;
        } else if (typeof req.body.nombreImagen !== 'string' || req.body.nombreImagen.trim().length === 0) {
          return res.status(400).json({ mensaje: 'El nombre de imagen no puede estar vacío' });
        } else if (req.body.nombreImagen.length > 255) {
          return res.status(400).json({ mensaje: 'El nombre de imagen es demasiado largo' });
        }
      }

      await mantenimiento.update(req.body);  
      res.json({ mensaje: 'Mantenimiento actualizado', mantenimiento });  
    } catch (error) {  
      res.status(500).json({ mensaje: 'Error al editar mantenimiento', error: error.message });  
    }  
  }  
];  
  
// Eliminar mantenimiento  
const eliminarMantenimiento = async (req, res) => {  
  const { id } = req.params;  
  try {  
    const mantenimiento = await Mantenimiento.findByPk(id);  
    if (!mantenimiento) return res.status(404).json({ mensaje: 'Mantenimiento no encontrado' });  
  
    await mantenimiento.destroy();  
    res.json({ mensaje: 'Mantenimiento eliminado' });  
  } catch (error) {  
    res.status(500).json({ mensaje: 'Error al eliminar mantenimiento', error: error.message });  
  }  
};  

// Eliminar imagen de mantenimiento
const eliminarImagenMantenimiento = async (req, res) => {
  const { id } = req.params;
  try {
    const mantenimiento = await Mantenimiento.findByPk(id);
    if (!mantenimiento) {
      return res.status(404).json({ mensaje: 'Mantenimiento no encontrado' });
    }

    if (!mantenimiento.nombreImagen) {
      return res.status(400).json({ mensaje: 'Este mantenimiento no tiene imagen asociada' });
    }

    // Eliminar archivo físico del repositorio
    const fs = require('fs');
    const path = require('path');
    const rutaImagen = path.join(__dirname, '../../../public/img/mantenimiento/', mantenimiento.nombreImagen);
    
    if (fs.existsSync(rutaImagen)) {
      fs.unlinkSync(rutaImagen);
      console.log('Archivo de imagen eliminado del repositorio:', rutaImagen);
    } else {
      console.log('Archivo de imagen no encontrado en el repositorio:', rutaImagen);
    }

    // Actualizar base de datos
    mantenimiento.nombreImagen = null;
    await mantenimiento.save();

    res.json({ 
      mensaje: 'Imagen eliminada exitosamente', 
      mantenimiento: {
        idMantenimiento: mantenimiento.idMantenimiento,
        nombreImagen: mantenimiento.nombreImagen
      }
    });
  } catch (error) {
    console.error('Error al eliminar imagen:', error);
    res.status(500).json({ mensaje: 'Error al eliminar imagen', error: error.message });
  }
};
  
module.exports = {  
  crearMantenimiento,  
  obtenerMantenimientos,  
  obtenerMantenimientoTodos,
  obtenerMantenimientoPorId,  
  obtenerHistorialPorActivo,  
  editarMantenimiento,  
  eliminarMantenimiento,
  eliminarImagenMantenimiento
};