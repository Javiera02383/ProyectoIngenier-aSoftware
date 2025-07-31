const { body, validationResult } = require('express-validator');
const Empleado = require('../../modelos/gestion_cliente/Empleado');
const Persona = require('../../modelos/seguridad/Persona');
const { Op } = require('sequelize');

// === VALIDACIONES ===
const reglasCrear = [
  body('idPersona')
    .notEmpty().withMessage('El idPersona es obligatorio')
    .isInt({ min: 1 }).withMessage('El idPersona debe ser un número entero positivo'),
  body('Fecha_Registro')
    .optional()
    .isISO8601().withMessage('La fecha debe tener un formato válido (YYYY-MM-DD)')
];

const reglasEditar = [
  body('idPersona')
    .optional()
    .isInt({ min: 1 }).withMessage('El idPersona debe ser un número entero positivo'),
  body('Fecha_Registro')
    .optional()
    .isISO8601().withMessage('La fecha debe tener un formato válido (YYYY-MM-DD)')
];

// Crear empleado
exports.crearEmpleado = [
  ...reglasCrear,
  async (req, res) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json({ errores: errores.array() });
    }
    try {
      // Validar existencia de idPersona
      const persona = await Persona.findByPk(req.body.idPersona);
      if (!persona) {
        return res.status(400).json({ mensaje: 'La persona asociada (idPersona) no existe' });
      }
      const empleado = await Empleado.create(req.body);
      res.status(201).json({ mensaje: 'Empleado creado', empleado });
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al crear empleado', error: error.message });
    }
  }
];

// Obtener todos los empleados sin filtros  
exports.obtenerTodosLosEmpleados = async (req, res) => {  
  try {  
    const empleados = await Empleado.findAll({  
      include: [{  
        model: Persona,  
        as: 'persona'  
      }]  
    });  
    res.json(empleados);  
  } catch (error) {  
    res.status(500).json({ mensaje: 'Error al obtener todos los empleados', error: error.message });  
  }  
};

// Obtener todos los empleados con búsqueda por nombre/apellido de Persona
exports.obtenerEmpleados = async (req, res) => {
  try {
    const { Pnombre, Papellido } = req.query;
    const wherePersona = {};
    if (Pnombre) wherePersona.Pnombre = { [Op.like]: `%${Pnombre}%` };
    if (Papellido) wherePersona.Papellido = { [Op.like]: `%${Papellido}%` };

    const empleados = await Empleado.findAll({
      include: [{
        model: Persona,
        as: 'persona',
        where: Object.keys(wherePersona).length ? wherePersona : undefined
      }]
    });
    res.json(empleados);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener empleados', error: error.message });
  }
};

// Obtener empleado por ID, incluyendo datos de Persona
exports.obtenerEmpleadoPorId = async (req, res) => {
  const { id } = req.params;
  try {
    const empleado = await Empleado.findByPk(id, {
      include: [{
        model: Persona,
        as: 'persona'
      }]
    });
    if (!empleado) return res.status(404).json({ mensaje: 'Empleado no encontrado' });
    res.json(empleado);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener empleado', error: error.message });
  }
};

// Editar empleado
exports.editarEmpleado = [
  ...reglasEditar,
  async (req, res) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json({ errores: errores.array() });
    }
    const { id } = req.params;
    try {
      // Si se envía idPersona, validar que exista
      if (req.body.idPersona) {
        const persona = await Persona.findByPk(req.body.idPersona);
        if (!persona) {
          return res.status(400).json({ mensaje: 'La persona asociada (idPersona) no existe' });
        }
      }
      const empleado = await Empleado.findByPk(id);
      if (!empleado) return res.status(404).json({ mensaje: 'Empleado no encontrado' });
      await empleado.update(req.body);
      res.json({ mensaje: 'Empleado actualizado', empleado });
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al editar empleado', error: error.message });
    }
  }
];

// Eliminar empleado
exports.eliminarEmpleado = async (req, res) => {
  const { id } = req.params;
  try {
    const empleado = await Empleado.findByPk(id);
    if (!empleado) return res.status(404).json({ mensaje: 'Empleado no encontrado' });
    await empleado.destroy();
    res.json({ mensaje: 'Empleado eliminado' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar empleado', error: error.message });
  }
};

