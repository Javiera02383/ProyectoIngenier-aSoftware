// controladores/programacion/programaController.js  
const { body, validationResult } = require('express-validator');  
const Programa = require('../../modelos/programacion/Programa');  
const Empleado = require('../../modelos/gestion_cliente/Empleado');  
const Persona = require('../../modelos/seguridad/Persona');  
const { Op } = require('sequelize');  
  
// === VALIDACIONES ===  
const reglasCrear = [  
  body('nombre')  
    .notEmpty().withMessage('El nombre es obligatorio')  
    .isLength({ min: 3, max: 100 }).withMessage('El nombre debe tener entre 3 y 100 caracteres'),  
  body('tipoCalendario')  
    .notEmpty().withMessage('El tipo de calendario es obligatorio')  
    .isIn(['Lunes_Sabado', 'Domingo']).withMessage('Tipo de calendario inválido'),  
  body('horaInicio')  
    .notEmpty().withMessage('La hora de inicio es obligatoria')  
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Hora de inicio debe tener formato HH:MM'),  
  body('duracion')  
    .notEmpty().withMessage('La duración es obligatoria')  
    .isInt({ min: 1 }).withMessage('Duración debe ser un entero positivo'),  
  body('categoria')  
    .notEmpty().withMessage('La categoría es obligatoria')  
    .isIn(['Noticias', 'Entretenimiento', 'Deportes', 'Cultural', 'Educativo', 'Infantil']).withMessage('Categoría inválida'),  
  body('idEmpleado')  
    .notEmpty().withMessage('El idEmpleado es obligatorio')  
    .isInt({ min: 1 }).withMessage('ID de empleado debe ser un número entero positivo')  
];  
  
const reglasEditar = [  
  body('nombre')  
    .optional()  
    .isLength({ min: 3, max: 100 }).withMessage('El nombre debe tener entre 3 y 100 caracteres'),  
  body('tipoCalendario')  
    .optional()  
    .isIn(['Lunes_Sabado', 'Domingo']).withMessage('Tipo de calendario inválido'),  
  body('horaInicio')  
    .optional()  
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Hora de inicio debe tener formato HH:MM'),  
  body('duracion')  
    .optional()  
    .isInt({ min: 1 }).withMessage('Duración debe ser un entero positivo'),  
  body('categoria')  
    .optional()  
    .isIn(['Noticias', 'Entretenimiento', 'Deportes', 'Cultural', 'Educativo', 'Infantil']).withMessage('Categoría inválida'),  
  body('estado')  
    .optional()  
    .isIn(['Activo', 'Inactivo']).withMessage('Estado inválido'),  
  body('idEmpleado')  
    .optional()  
    .isInt({ min: 1 }).withMessage('ID de empleado debe ser un número entero positivo')  
];  
  
// === CONTROLADORES ===  
  
// Crear programa  
const crearPrograma = [  
  ...reglasCrear,  
  async (req, res) => {  
    const errores = validationResult(req);  
    if (!errores.isEmpty()) {  
      return res.status(400).json({ errores: errores.array() });  
    }  
    try {  
      // Validar existencia de idEmpleado  
      const empleado = await Empleado.findByPk(req.body.idEmpleado);  
      if (!empleado) {  
        return res.status(400).json({ mensaje: 'El empleado asociado no existe' });  
      }  
        
      const programa = await Programa.create(req.body);  
      res.status(201).json({ mensaje: 'Programa creado', programa });  
    } catch (error) {  
      res.status(500).json({ mensaje: 'Error al crear programa', error: error.message });  
    }  
  }  
];  
  
// Obtener todos los programas con filtros  
const obtenerProgramas = async (req, res) => {  
  try {  
    const { tipoCalendario, categoria, estado, nombre } = req.query;  
    const wherePrograma = {};  
      
    if (tipoCalendario) wherePrograma.tipoCalendario = tipoCalendario;  
    if (categoria) wherePrograma.categoria = categoria;  
    if (estado) wherePrograma.estado = estado;  
    if (nombre && nombre.length >= 3) {  
      wherePrograma.nombre = { [Op.like]: `%${nombre}%` };  
    }  
  
    const programas = await Programa.findAll({  
      where: Object.keys(wherePrograma).length ? wherePrograma : undefined,  
      include: [{  
        model: Empleado,  
        as: 'productor',  
        include: [{  
          model: Persona,  
          as: 'persona',  
          attributes: ['Pnombre', 'Snombre', 'Papellido', 'Sapellido']  
        }]  
      }],  
      order: [['fechaCreacion', 'DESC']]  
    });  
    res.json(programas);  
  } catch (error) {  
    res.status(500).json({ mensaje: 'Error al obtener programas', error: error.message });  
  }  
};  
  
// Obtener programa por ID  
const obtenerProgramaPorId = async (req, res) => {  
  const { id } = req.params;  
  try {  
    const programa = await Programa.findByPk(id, {  
      include: [{  
        model: Empleado,  
        as: 'productor',  
        include: [{  
          model: Persona,  
          as: 'persona',  
          attributes: ['Pnombre', 'Snombre', 'Papellido', 'Sapellido']  
        }]  
      }]  
    });  
    if (!programa) return res.status(404).json({ mensaje: 'Programa no encontrado' });  
    res.json(programa);  
  } catch (error) {  
    res.status(500).json({ mensaje: 'Error al obtener programa', error: error.message });  
  }  
};  
  
// Editar programa  
const editarPrograma = [  
  ...reglasEditar,  
  async (req, res) => {  
    const errores = validationResult(req);  
    if (!errores.isEmpty()) {  
      return res.status(400).json({ errores: errores.array() });  
    }  
    const { id } = req.params;  
    try {  
      const programa = await Programa.findByPk(id);  
      if (!programa) return res.status(404).json({ mensaje: 'Programa no encontrado' });  
  
      // Validar existencia de idEmpleado si se proporciona  
      if (req.body.idEmpleado) {  
        const empleado = await Empleado.findByPk(req.body.idEmpleado);  
        if (!empleado) {  
          return res.status(400).json({ mensaje: 'El empleado asociado no existe' });  
        }  
      }  
  
      await programa.update(req.body);  
      res.json({ mensaje: 'Programa actualizado', programa });  
    } catch (error) {  
      res.status(500).json({ mensaje: 'Error al editar programa', error: error.message });  
    }  
  }  
];  
  
// Eliminar programa  
const eliminarPrograma = async (req, res) => {  
  const { id } = req.params;  
  try {  
    const programa = await Programa.findByPk(id);  
    if (!programa) return res.status(404).json({ mensaje: 'Programa no encontrado' });  
  
    await programa.destroy();  
    res.json({ mensaje: 'Programa eliminado' });  
  } catch (error) {  
    res.status(500).json({ mensaje: 'Error al eliminar programa', error: error.message });  
  }  
};  
  
module.exports = {  
  crearPrograma,  
  obtenerProgramas,  
  obtenerProgramaPorId,  
  editarPrograma,  
  eliminarPrograma  
};