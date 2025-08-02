// controladores/inventario/MovimientoController.js  
const { body, validationResult } = require('express-validator');  
const Movimiento = require('../../modelos/inventario/Movimiento');  
const InventarioModel = require('../../modelos/inventario/Inventario');  
const Empleado = require('../../modelos/gestion_cliente/Empleado');  
const Persona = require('../../modelos/seguridad/Persona');  
const { Op } = require('sequelize');  
  
// === VALIDACIONES ===  
const reglasCrear = [  
  body('idInventario')  
    .notEmpty().withMessage('El idInventario es obligatorio')  
    .isInt({ min: 1 }).withMessage('El idInventario debe ser un número entero positivo'),  
  body('tipoMovimiento')  
    .notEmpty().withMessage('El tipo de movimiento es obligatorio')  
    .isIn(['Asignacion', 'Mantenimiento', 'Baja']).withMessage('Tipo de movimiento inválido'),  
  body('idEmpleado')  
    .optional()  
    .isInt({ min: 1 }).withMessage('El idEmpleado debe ser un número entero positivo'),  
  body('observaciones')  
    .optional()  
    .isLength({ max: 500 }).withMessage('Las observaciones no pueden exceder 500 caracteres')  
];  
  
const reglasEditar = [  
  body('idInventario')  
    .optional()  
    .isInt({ min: 1 }).withMessage('El idInventario debe ser un número entero positivo'),  
  body('tipoMovimiento')  
    .optional()  
    .isIn(['Asignacion', 'Mantenimiento', 'Baja']).withMessage('Tipo de movimiento inválido'),  
  body('idEmpleado')  
    .optional()  
    .isInt({ min: 1 }).withMessage('El idEmpleado debe ser un número entero positivo'),  
  body('observaciones')  
    .optional()  
    .isLength({ max: 500 }).withMessage('Las observaciones no pueden exceder 500 caracteres')  
];  
  
// === CONTROLADORES ===  
  
// Crear movimiento  
const crearMovimiento = [  
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
  
      // Validar existencia de idEmpleado si se proporciona  
      if (req.body.idEmpleado) {  
        const empleado = await Empleado.findByPk(req.body.idEmpleado);  
        if (!empleado) {  
          return res.status(400).json({ mensaje: 'El empleado asociado no existe' });  
        }  
      }  
  
      const movimiento = await Movimiento.create(req.body);  
      res.status(201).json({ mensaje: 'Movimiento creado', movimiento });  
    } catch (error) {  
      res.status(500).json({ mensaje: 'Error al crear movimiento', error: error.message });  
    }  
  }  
];  
  
// Obtener todos los movimientos con filtros  
const obtenerMovimientos = async (req, res) => {  
  try {  
    const { tipoMovimiento, idInventario, fechaInicio, fechaFin } = req.query;  
    const whereMovimiento = {};  
      
    if (tipoMovimiento) whereMovimiento.tipoMovimiento = tipoMovimiento;  
    if (idInventario) whereMovimiento.idInventario = idInventario;  
      
    if (fechaInicio && fechaFin) {  
      whereMovimiento.fechaMovimiento = {  
        [Op.between]: [new Date(fechaInicio), new Date(fechaFin)]  
      };  
    } else if (fechaInicio) {  
      whereMovimiento.fechaMovimiento = {  
        [Op.gte]: new Date(fechaInicio)  
      };  
    } else if (fechaFin) {  
      whereMovimiento.fechaMovimiento = {  
        [Op.lte]: new Date(fechaFin)  
      };  
    }  
  
    const movimientos = await Movimiento.findAll({  
      where: Object.keys(whereMovimiento).length ? whereMovimiento : undefined,  
      include: [  
        {  
          model: InventarioModel,  
          attributes: ['codigo', 'nombre', 'estado']  
        },  
        {  
          model: Empleado,  
          include: [{  
            model: Persona,  
            as: 'persona',  
            attributes: ['Pnombre', 'Snombre', 'Papellido', 'Sapellido']  
          }]  
        }  
      ],  
      order: [['fechaMovimiento', 'DESC']]  
    });  
    res.json(movimientos);  
  } catch (error) {  
    res.status(500).json({ mensaje: 'Error al obtener movimientos', error: error.message });  
  }  
};  
  
// Obtener movimiento por ID  
const obtenerMovimientoPorId = async (req, res) => {  
  const { id } = req.params;  
  try {  
    const movimiento = await Movimiento.findByPk(id, {  
      include: [  
        {  
          model: InventarioModel,  
          attributes: ['codigo', 'nombre', 'descripcion', 'estado']  
        },  
        {  
          model: Empleado,  
          include: [{  
            model: Persona,  
            as: 'persona',  
            attributes: ['Pnombre', 'Snombre', 'Papellido', 'Sapellido']  
          }]  
        }  
      ]  
    });  
    if (!movimiento) return res.status(404).json({ mensaje: 'Movimiento no encontrado' });  
    res.json(movimiento);  
  } catch (error) {  
    res.status(500).json({ mensaje: 'Error al obtener movimiento', error: error.message });  
  }  
};  
  
// Obtener historial de movimientos por activo  
const obtenerHistorialPorActivo = async (req, res) => {  
  const { idInventario } = req.params;  
  try {  
    const movimientos = await Movimiento.findAll({  
      where: { idInventario },  
      include: [  
        {  
          model: Empleado,  
          include: [{  
            model: Persona,  
            as: 'persona',  
            attributes: ['Pnombre', 'Snombre', 'Papellido', 'Sapellido']  
          }]  
        }  
      ],  
      order: [['fechaMovimiento', 'DESC']]  
    });  
    res.json(movimientos);  
  } catch (error) {  
    res.status(500).json({ mensaje: 'Error al obtener historial de movimientos', error: error.message });  
  }  
};  
  
// Editar movimiento  
const editarMovimiento = [  
  ...reglasEditar,  
  async (req, res) => {  
    const errores = validationResult(req);  
    if (!errores.isEmpty()) {  
      return res.status(400).json({ errores: errores.array() });  
    }  
    const { id } = req.params;  
    try {  
      const movimiento = await Movimiento.findByPk(id);  
      if (!movimiento) return res.status(404).json({ mensaje: 'Movimiento no encontrado' });  
  
      // Validar existencia de idInventario si se proporciona  
      if (req.body.idInventario) {  
        const inventario = await InventarioModel.findByPk(req.body.idInventario);  
        if (!inventario) {  
          return res.status(400).json({ mensaje: 'El activo de inventario asociado no existe' });  
        }  
      }  
  
      // Validar existencia de idEmpleado si se proporciona  
      if (req.body.idEmpleado) {  
        const empleado = await Empleado.findByPk(req.body.idEmpleado);  
        if (!empleado) {  
          return res.status(400).json({ mensaje: 'El empleado asociado no existe' });  
        }  
      }  
  
      await movimiento.update(req.body);  
      res.json({ mensaje: 'Movimiento actualizado', movimiento });  
    } catch (error) {  
      res.status(500).json({ mensaje: 'Error al editar movimiento', error: error.message });  
    }  
  }  
];  
  
// Eliminar movimiento  
const eliminarMovimiento = async (req, res) => {  
  const { id } = req.params;  
  try {  
    const movimiento = await Movimiento.findByPk(id);  
    if (!movimiento) return res.status(404).json({ mensaje: 'Movimiento no encontrado' });  
  
    await movimiento.destroy();  
    res.json({ mensaje: 'Movimiento eliminado' });  
  } catch (error) {  
    res.status(500).json({ mensaje: 'Error al eliminar movimiento', error: error.message });  
  }  
};  
  
module.exports = {  
  crearMovimiento,  
  obtenerMovimientos,  
  obtenerMovimientoPorId,  
  obtenerHistorialPorActivo,  
  editarMovimiento,  
  eliminarMovimiento  
};