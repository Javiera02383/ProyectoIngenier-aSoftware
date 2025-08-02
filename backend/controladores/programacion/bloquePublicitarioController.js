// controladores/programacion/BloquePublicitarioController.js  
const { body, validationResult } = require('express-validator');  
const BloquePublicitario = require('../../modelos/programacion/BloquePublicitario');  
const Programa = require('../../modelos/programacion/Programa');  
const Empleado = require('../../modelos/gestion_cliente/Empleado');  
const Persona = require('../../modelos/seguridad/Persona');  
const { Op } = require('sequelize');  
  
// === VALIDACIONES ===  
const reglasCrear = [  
  body('idPrograma')  
    .notEmpty().withMessage('El idPrograma es obligatorio')  
    .isInt({ min: 1 }).withMessage('El idPrograma debe ser un número entero positivo'),  
  body('horaBloque')  
    .notEmpty().withMessage('La hora del bloque es obligatoria')  
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Hora del bloque debe tener formato HH:MM'),  
  body('ordenBloque')  
    .notEmpty().withMessage('El orden del bloque es obligatorio')  
    .isInt({ min: 1 }).withMessage('El orden del bloque debe ser un entero positivo'),  
  body('duracionTotal')  
    .optional()  
    .isInt({ min: 1 }).withMessage('La duración total debe ser un entero positivo'),  
  body('fechaVigencia')  
    .notEmpty().withMessage('La fecha de vigencia es obligatoria')  
    .isISO8601().withMessage('Fecha de vigencia debe tener formato válido (YYYY-MM-DD)'),  
  body('estado')  
    .optional()  
    .isIn(['Activo', 'Pausado']).withMessage('Estado inválido')  
];  
  
const reglasEditar = [  
  body('idPrograma')  
    .optional()  
    .isInt({ min: 1 }).withMessage('El idPrograma debe ser un número entero positivo'),  
  body('horaBloque')  
    .optional()  
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Hora del bloque debe tener formato HH:MM'),  
  body('ordenBloque')  
    .optional()  
    .isInt({ min: 1 }).withMessage('El orden del bloque debe ser un entero positivo'),  
  body('duracionTotal')  
    .optional()  
    .isInt({ min: 1 }).withMessage('La duración total debe ser un entero positivo'),  
  body('fechaVigencia')  
    .optional()  
    .isISO8601().withMessage('Fecha de vigencia debe tener formato válido (YYYY-MM-DD)'),  
  body('estado')  
    .optional()  
    .isIn(['Activo', 'Pausado']).withMessage('Estado inválido')  
];  
  
// === CONTROLADORES ===  
  
// Crear bloque publicitario  
const crearBloque = [  
  ...reglasCrear,  
  async (req, res) => {  
    const errores = validationResult(req);  
    if (!errores.isEmpty()) {  
      return res.status(400).json({ errores: errores.array() });  
    }  
    try {  
      // Validar existencia de idPrograma  
      const programa = await Programa.findByPk(req.body.idPrograma);  
      if (!programa) {  
        return res.status(400).json({ mensaje: 'El programa asociado no existe' });  
      }  
  
      // Validar que no exista otro bloque con el mismo orden en el mismo programa  
      const bloqueExistente = await BloquePublicitario.findOne({  
        where: {  
          idPrograma: req.body.idPrograma,  
          ordenBloque: req.body.ordenBloque  
        }  
      });  
      if (bloqueExistente) {  
        return res.status(400).json({ mensaje: 'Ya existe un bloque con ese orden en el programa especificado' });  
      }  
  
      const bloque = await BloquePublicitario.create(req.body);  
      res.status(201).json({ mensaje: 'Bloque publicitario creado', bloque });  
    } catch (error) {  
      res.status(500).json({ mensaje: 'Error al crear bloque publicitario', error: error.message });  
    }  
  }  
];  
  
// Obtener todos los bloques con filtros  
const obtenerBloques = async (req, res) => {  
  try {  
    const { idPrograma, estado, fechaVigencia } = req.query;  
    const whereBloque = {};  
      
    if (idPrograma) whereBloque.idPrograma = idPrograma;  
    if (estado) whereBloque.estado = estado;  
    if (fechaVigencia) whereBloque.fechaVigencia = fechaVigencia;  
  
    const bloques = await BloquePublicitario.findAll({  
      where: Object.keys(whereBloque).length ? whereBloque : undefined,  
      include: [{  
        model: Programa,  
        attributes: ['nombre', 'tipoCalendario', 'horaInicio', 'categoria'],  
        include: [{  
          model: Empleado,  
          as: 'productor',  
          include: [{  
            model: Persona,  
            as: 'persona',  
            attributes: ['Pnombre', 'Snombre', 'Papellido', 'Sapellido']  
          }]  
        }]  
      }],  
      order: [['idPrograma', 'ASC'], ['ordenBloque', 'ASC']]  
    });  
    res.json(bloques);  
  } catch (error) {  
    res.status(500).json({ mensaje: 'Error al obtener bloques publicitarios', error: error.message });  
  }  
};  
  
// Obtener bloque por ID  
const obtenerBloquePorId = async (req, res) => {  
  const { id } = req.params;  
  try {  
    const bloque = await BloquePublicitario.findByPk(id, {  
      include: [{  
        model: Programa,  
        include: [{  
          model: Empleado,  
          as: 'productor',  
          include: [{  
            model: Persona,  
            as: 'persona',  
            attributes: ['Pnombre', 'Snombre', 'Papellido', 'Sapellido']  
          }]  
        }]  
      }]  
    });  
    if (!bloque) return res.status(404).json({ mensaje: 'Bloque publicitario no encontrado' });  
    res.json(bloque);  
  } catch (error) {  
    res.status(500).json({ mensaje: 'Error al obtener bloque publicitario', error: error.message });  
  }  
};  
  
// Obtener bloques por programa  
const obtenerBloquesPorPrograma = async (req, res) => {  
  const { idPrograma } = req.params;  
  try {  
    const bloques = await BloquePublicitario.findAll({  
      where: { idPrograma },  
      order: [['ordenBloque', 'ASC']]  
    });  
    res.json(bloques);  
  } catch (error) {  
    res.status(500).json({ mensaje: 'Error al obtener bloques por programa', error: error.message });  
  }  
};  
  
// Editar bloque publicitario  
const editarBloque = [  
  ...reglasEditar,  
  async (req, res) => {  
    const errores = validationResult(req);  
    if (!errores.isEmpty()) {  
      return res.status(400).json({ errores: errores.array() });  
    }  
    const { id } = req.params;  
    try {  
      const bloque = await BloquePublicitario.findByPk(id);  
      if (!bloque) return res.status(404).json({ mensaje: 'Bloque publicitario no encontrado' });  
  
      // Validar existencia de idPrograma si se proporciona  
      if (req.body.idPrograma) {  
        const programa = await Programa.findByPk(req.body.idPrograma);  
        if (!programa) {  
          return res.status(400).json({ mensaje: 'El programa asociado no existe' });  
        }  
      }  
  
      // Validar orden único si se cambia  
      if (req.body.ordenBloque && req.body.ordenBloque !== bloque.ordenBloque) {  
        const programaId = req.body.idPrograma || bloque.idPrograma;  
        const bloqueExistente = await BloquePublicitario.findOne({  
          where: {  
            idPrograma: programaId,  
            ordenBloque: req.body.ordenBloque,  
            idBloque: { [Op.ne]: id }  
          }  
        });  
        if (bloqueExistente) {  
          return res.status(400).json({ mensaje: 'Ya existe un bloque con ese orden en el programa especificado' });  
        }  
      }  
  
      await bloque.update(req.body);  
      res.json({ mensaje: 'Bloque publicitario actualizado', bloque });  
    } catch (error) {  
      res.status(500).json({ mensaje: 'Error al editar bloque publicitario', error: error.message });  
    }  
  }  
];  
  
// Eliminar bloque publicitario  
const eliminarBloque = async (req, res) => {  
  const { id } = req.params;  
  try {  
    const bloque = await BloquePublicitario.findByPk(id);  
    if (!bloque) return res.status(404).json({ mensaje: 'Bloque publicitario no encontrado' });  
  
    await bloque.destroy();  
    res.json({ mensaje: 'Bloque publicitario eliminado' });  
  } catch (error) {  
    res.status(500).json({ mensaje: 'Error al eliminar bloque publicitario', error: error.message });  
  }  
};  
  
module.exports = {  
  crearBloque,  
  obtenerBloques,  
  obtenerBloquePorId,  
  obtenerBloquesPorPrograma,  
  editarBloque,  
  eliminarBloque  
};