// controladores/programacion/ordenProgramacionController.js  
const { body, validationResult } = require('express-validator');  
const OrdenProgramacion = require('../../modelos/programacion/OrdenProgramacion');  
const OrdenPublicidad = require('../../modelos/programacion/OrdenPublicidad');  
const Programa = require('../../modelos/programacion/Programa');  
const BloquePublicitario = require('../../modelos/programacion/BloquePublicitario');  
const Cliente = require('../../modelos/gestion_cliente/Cliente');  
const Empleado = require('../../modelos/gestion_cliente/Empleado');  
const Persona = require('../../modelos/seguridad/Persona');  
const { Op } = require('sequelize');  
  
// === VALIDACIONES ===  
const reglasCrear = [  
  body('idOrden')  
    .notEmpty().withMessage('El idOrden es obligatorio')  
    .isInt({ min: 1 }).withMessage('El idOrden debe ser un número entero positivo'),  
  body('idPrograma')  
    .notEmpty().withMessage('El idPrograma es obligatorio')  
    .isInt({ min: 1 }).withMessage('El idPrograma debe ser un número entero positivo'),  
  body('idBloque')  
    .notEmpty().withMessage('El idBloque es obligatorio')  
    .isInt({ min: 1 }).withMessage('El idBloque debe ser un número entero positivo'),  
  body('cantidadSpots')  
    .optional()  
    .isInt({ min: 1 }).withMessage('La cantidad de spots debe ser un entero positivo'),  
  body('diasEmision')  
    .optional()  
    .isLength({ max: 100 }).withMessage('Los días de emisión no pueden exceder 100 caracteres')  
];  
  
const reglasEditar = [  
  body('idOrden')  
    .optional()  
    .isInt({ min: 1 }).withMessage('El idOrden debe ser un número entero positivo'),  
  body('idPrograma')  
    .optional()  
    .isInt({ min: 1 }).withMessage('El idPrograma debe ser un número entero positivo'),  
  body('idBloque')  
    .optional()  
    .isInt({ min: 1 }).withMessage('El idBloque debe ser un número entero positivo'),  
  body('cantidadSpots')  
    .optional()  
    .isInt({ min: 1 }).withMessage('La cantidad de spots debe ser un entero positivo'),  
  body('diasEmision')  
    .optional()  
    .isLength({ max: 100 }).withMessage('Los días de emisión no pueden exceder 100 caracteres')  
];  
  
// === CONTROLADORES ===  
  
// Crear orden programación  
const crearOrdenProgramacion = [  
  ...reglasCrear,  
  async (req, res) => {  
    const errores = validationResult(req);  
    if (!errores.isEmpty()) {  
      return res.status(400).json({ errores: errores.array() });  
    }  
    try {  
      // Validar existencia de idOrden  
      const orden = await OrdenPublicidad.findByPk(req.body.idOrden);  
      if (!orden) {  
        return res.status(400).json({ mensaje: 'La orden de publicidad asociada no existe' });  
      }  
  
      // Validar existencia de idPrograma  
      const programa = await Programa.findByPk(req.body.idPrograma);  
      if (!programa) {  
        return res.status(400).json({ mensaje: 'El programa asociado no existe' });  
      }  
  
      // Validar existencia de idBloque  
      const bloque = await BloquePublicitario.findByPk(req.body.idBloque);  
      if (!bloque) {  
        return res.status(400).json({ mensaje: 'El bloque publicitario asociado no existe' });  
      }  
  
      // Validar que el bloque pertenezca al programa  
      if (bloque.idPrograma !== req.body.idPrograma) {  
        return res.status(400).json({ mensaje: 'El bloque publicitario no pertenece al programa especificado' });  
      }  
  
      const ordenProgramacion = await OrdenProgramacion.create(req.body);  
      res.status(201).json({ mensaje: 'Orden de programación creada', ordenProgramacion });  
    } catch (error) {  
      res.status(500).json({ mensaje: 'Error al crear orden de programación', error: error.message });  
    }  
  }  
];  
  
// Obtener todas las órdenes de programación con filtros  
const obtenerOrdenesProgramacion = async (req, res) => {  
  try {  
    const { idOrden, idPrograma, idBloque } = req.query;  
    const whereOrdenProgramacion = {};  
      
    if (idOrden) whereOrdenProgramacion.idOrden = idOrden;  
    if (idPrograma) whereOrdenProgramacion.idPrograma = idPrograma;  
    if (idBloque) whereOrdenProgramacion.idBloque = idBloque;  
  
    const ordenesProgramacion = await OrdenProgramacion.findAll({  
      where: Object.keys(whereOrdenProgramacion).length ? whereOrdenProgramacion : undefined,  
      include: [  
        {  
          model: OrdenPublicidad,  
          include: [{  
            model: Cliente,  
            include: [{  
              model: Persona,  
              as: 'persona',  
              attributes: ['Pnombre', 'Snombre', 'Papellido', 'Sapellido']  
            }]  
          }]  
        },  
        {  
          model: Programa,  
          attributes: ['nombre', 'tipoCalendario', 'horaInicio', 'categoria']  
        },  
        {  
          model: BloquePublicitario,  
          attributes: ['horaBloque', 'ordenBloque', 'duracionTotal']  
        }  
      ],  
      order: [['idOrdenProgramacion', 'DESC']]  
    });  
    res.json(ordenesProgramacion);  
  } catch (error) {  
    res.status(500).json({ mensaje: 'Error al obtener órdenes de programación', error: error.message });  
  }  
};  
  
// Obtener orden de programación por ID  
const obtenerOrdenProgramacionPorId = async (req, res) => {  
  const { id } = req.params;  
  try {  
    const ordenProgramacion = await OrdenProgramacion.findByPk(id, {  
      include: [  
        {  
          model: OrdenPublicidad,  
          include: [{  
            model: Cliente,  
            include: [{  
              model: Persona,  
              as: 'persona',  
              attributes: ['Pnombre', 'Snombre', 'Papellido', 'Sapellido']  
            }]  
          }]  
        },  
        {  
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
        },  
        {  
          model: BloquePublicitario  
        }  
      ]  
    });  
    if (!ordenProgramacion) return res.status(404).json({ mensaje: 'Orden de programación no encontrada' });  
    res.json(ordenProgramacion);  
  } catch (error) {  
    res.status(500).json({ mensaje: 'Error al obtener orden de programación', error: error.message });  
  }  
};  
  
// Obtener órdenes de programación por orden de publicidad  
const obtenerPorOrdenPublicidad = async (req, res) => {  
  const { idOrden } = req.params;  
  try {  
    const ordenesProgramacion = await OrdenProgramacion.findAll({  
      where: { idOrden },  
      include: [  
        {  
          model: Programa,  
          attributes: ['nombre', 'tipoCalendario', 'horaInicio', 'categoria']  
        },  
        {  
          model: BloquePublicitario,  
          attributes: ['horaBloque', 'ordenBloque', 'duracionTotal']  
        }  
      ],  
      order: [['idPrograma', 'ASC'], ['idBloque', 'ASC']]  
    });  
    res.json(ordenesProgramacion);  
  } catch (error) {  
    res.status(500).json({ mensaje: 'Error al obtener órdenes de programación por orden de publicidad', error: error.message });  
  }  
};  
  
// Editar orden de programación  
const editarOrdenProgramacion = [  
  ...reglasEditar,  
  async (req, res) => {  
    const errores = validationResult(req);  
    if (!errores.isEmpty()) {  
      return res.status(400).json({ errores: errores.array() });  
    }  
    const { id } = req.params;  
    try {  
      const ordenProgramacion = await OrdenProgramacion.findByPk(id);  
      if (!ordenProgramacion) return res.status(404).json({ mensaje: 'Orden de programación no encontrada' });  
  
      // Validar existencias si se proporcionan  
      if (req.body.idOrden) {  
        const orden = await OrdenPublicidad.findByPk(req.body.idOrden);  
        if (!orden) {  
          return res.status(400).json({ mensaje: 'La orden de publicidad asociada no existe' });  
        }  
      }  
  
      if (req.body.idPrograma) {  
        const programa = await Programa.findByPk(req.body.idPrograma);  
        if (!programa) {  
          return res.status(400).json({ mensaje: 'El programa asociado no existe' });  
        }  
      }  
  
      if (req.body.idBloque) {  
        const bloque = await BloquePublicitario.findByPk(req.body.idBloque);  
        if (!bloque) {  
          return res.status(400).json({ mensaje: 'El bloque publicitario asociado no existe' });  
        }  
  
        // Validar que el bloque pertenezca al programa  
        const programaId = req.body.idPrograma || ordenProgramacion.idPrograma;  
        if (bloque.idPrograma !== programaId) {  
          return res.status(400).json({ mensaje: 'El bloque publicitario no pertenece al programa especificado' });  
        }  
      }  
  
      await ordenProgramacion.update(req.body);  
      res.json({ mensaje: 'Orden de programación actualizada', ordenProgramacion });  
    } catch (error) {  
      res.status(500).json({ mensaje: 'Error al editar orden de programación', error: error.message });  
    }  
  }  
];  
  
// Eliminar orden de programación  
const eliminarOrdenProgramacion = async (req, res) => {  
  const { id } = req.params;  
  try {  
    const ordenProgramacion = await OrdenProgramacion.findByPk(id);  
    if (!ordenProgramacion) return res.status(404).json({ mensaje: 'Orden de programación no encontrada' });  
  
    await ordenProgramacion.destroy();  
    res.json({ mensaje: 'Orden de programación eliminada' });  
  } catch (error) {  
    res.status(500).json({ mensaje: 'Error al eliminar orden de programación', error: error.message });  
  }  
};  
  
module.exports = {  
  crearOrdenProgramacion,  
  obtenerOrdenesProgramacion,  
  obtenerOrdenProgramacionPorId,  
  obtenerPorOrdenPublicidad,  
  editarOrdenProgramacion,  
  eliminarOrdenProgramacion  
};