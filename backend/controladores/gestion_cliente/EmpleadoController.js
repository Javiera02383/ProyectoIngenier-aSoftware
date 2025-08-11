const { body, validationResult } = require('express-validator');
const Empleado = require('../../modelos/gestion_cliente/Empleado');
const Persona = require('../../modelos/seguridad/Persona');
const Rol = require('../../modelos/seguridad/Rol');
const { Op } = require('sequelize');

// === VALIDACIONES ===
const reglasCrear = [
  body('idPersona')
    .optional() // Ahora es opcional porque puede venir en personaData
    .isInt({ min: 1 }).withMessage('El idPersona debe ser un número entero positivo'),
  body('idRol')
    .optional()
    .isInt({ min: 1 }).withMessage('El idRol debe ser un número entero positivo'),
  body('Fecha_Registro')
    .optional()
    .isISO8601().withMessage('La fecha debe tener un formato válido (YYYY-MM-DD)'),
  body('personaData')
    .optional()
    .isObject().withMessage('personaData debe ser un objeto válido')
];

const reglasEditar = [
  body('idPersona')
    .optional()
    .isInt({ min: 1 }).withMessage('El idPersona debe ser un número entero positivo'),
  body('idRol')
    .optional()
    .isInt({ min: 1 }).withMessage('El idRol debe ser un número entero positivo'),
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
      let personaId = req.body.idPersona;
      
      // Si se envían datos de persona nueva, crear la persona primero
      if (req.body.personaData && !personaId) {
        console.log('📝 Creando nueva persona para empleado:', req.body.personaData);
        
        // Validar campos obligatorios de persona
        const { Pnombre, Papellido, DNI, correo } = req.body.personaData;
        if (!Pnombre || !Papellido || !DNI || !correo) {
          return res.status(400).json({ 
            mensaje: 'Los campos Pnombre, Papellido, DNI y correo son obligatorios para crear una nueva persona' 
          });
        }
        
        // Verificar que el DNI no exista
        const personaExistente = await Persona.findOne({ where: { DNI } });
        if (personaExistente) {
          return res.status(400).json({ 
            mensaje: 'Ya existe una persona con el DNI proporcionado' 
          });
        }
        
        // Crear la nueva persona
        const nuevaPersona = await Persona.create(req.body.personaData);
        personaId = nuevaPersona.idPersona;
        console.log('✅ Nueva persona creada con ID:', personaId);
      }
      
      // Si no hay personaId válido, retornar error
      if (!personaId) {
        return res.status(400).json({ 
          mensaje: 'Debe proporcionar un idPersona existente o datos de persona nueva' 
        });
      }
      
      // Validar que la persona existe
      const persona = await Persona.findByPk(personaId);
      if (!persona) {
        return res.status(400).json({ mensaje: 'La persona asociada no existe' });
      }
      
      // Crear el empleado con el personaId
      const datosEmpleado = {
        idPersona: personaId,
        idRol: req.body.idRol || null,
        Fecha_Registro: req.body.Fecha_Registro || new Date()
      };
      
      console.log('💼 Creando empleado con datos:', datosEmpleado);
      const empleado = await Empleado.create(datosEmpleado);
      
      // Obtener el empleado creado con sus relaciones
      const empleadoCompleto = await Empleado.findByPk(empleado.idEmpleado, {
        include: [
          { model: Persona, as: 'persona' },
          { model: Rol, as: 'rol' }
        ]
      });
      
      res.status(201).json({ 
        mensaje: 'Empleado creado exitosamente', 
        empleado: empleadoCompleto 
      });
    } catch (error) {
      console.error('❌ Error al crear empleado:', error);
      res.status(500).json({ mensaje: 'Error al crear empleado', error: error.message });
    }
  }
];

// Obtener todos los empleados sin filtros  
exports.obtenerTodosLosEmpleados = async (req, res) => {  
  try {  
    const empleados = await Empleado.findAll({  
      include: [
        {  
          model: Persona,  
          as: 'persona'  
        },
        {
          model: Rol,
          as: 'rol'
        }
      ]  
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
      include: [
        {
          model: Persona,
          as: 'persona',
          where: Object.keys(wherePersona).length ? wherePersona : undefined
        },
        {
          model: Rol,
          as: 'rol'
        }
      ]
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
      include: [
        {
          model: Persona,
          as: 'persona'
        },
        {
          model: Rol,
          as: 'rol'
        }
      ]
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
      
      // Si se envía idRol, validar que exista
      if (req.body.idRol) {
        const rol = await Rol.findByPk(req.body.idRol);
        if (!rol) {
          return res.status(400).json({ mensaje: 'El rol asociado (idRol) no existe' });
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

