// controladores/programacion/ordenProgramacionController.js
const { body, validationResult } = require('express-validator');
const OrdenProgramacion = require('../../modelos/programacion/OrdenProgramacion');
const OrdenPublicidad = require('../../modelos/programacion/OrdenPublicidad');
const Programa = require('../../modelos/programacion/Programa');

// === VALIDACIONES ===
const reglasCrear = [
  body('idOrden')
    .notEmpty().withMessage('El idOrden es obligatorio')
    .isInt({ min: 1 }).withMessage('El idOrden debe ser un número entero positivo'),
  body('idPrograma')
    .notEmpty().withMessage('El idPrograma es obligatorio')
    .isInt({ min: 1 }).withMessage('El idPrograma debe ser un número entero positivo'),
  body('duracionPauta')
    .notEmpty().withMessage('La duración de pauta es obligatoria')
    .isInt({ min: 1 }).withMessage('La duración debe ser un número entero positivo'),
  body('cantidadSpots')
    .notEmpty().withMessage('La cantidad de spots es obligatoria')
    .isInt({ min: 1 }).withMessage('La cantidad de spots debe ser un número entero positivo'),
  body('diasEmision')
    .notEmpty().withMessage('Los días de emisión son obligatorios')
    .isLength({ min: 3, max: 100 }).withMessage('Los días de emisión deben tener entre 3 y 100 caracteres')
];

const reglasEditar = [
  body('duracionPauta')
    .optional()
    .isInt({ min: 1 }).withMessage('La duración debe ser un número entero positivo'),
  body('cantidadSpots')
    .optional()
    .isInt({ min: 1 }).withMessage('La cantidad de spots debe ser un número entero positivo'),
  body('estado')
    .optional()
    .isIn(['activo', 'pausado', 'cancelado']).withMessage('Estado inválido')
];

// === CONTROLADORES ===

// Crear nueva pauta de programación
const crearPauta = [
  ...reglasCrear,
  async (req, res) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json({ errores: errores.array() });
    }

    try {
      // Validar existencia de la orden
      const orden = await OrdenPublicidad.findByPk(req.body.idOrden);
      if (!orden) {
        return res.status(400).json({ mensaje: 'La orden de publicidad no existe' });
      }

      // Validar existencia del programa
      const programa = await Programa.findByPk(req.body.idPrograma);
      if (!programa) {
        return res.status(400).json({ mensaje: 'El programa no existe' });
      }

      // Crear la pauta
      const pauta = await OrdenProgramacion.create(req.body);

      res.status(201).json({
        mensaje: 'Pauta de programación creada exitosamente',
        pauta
      });
    } catch (error) {
      res.status(500).json({
        mensaje: 'Error al crear la pauta de programación',
        error: error.message
      });
    }
  }
];

// Obtener todas las pautas de una orden
const obtenerPautasPorOrden = async (req, res) => {
  const { idOrden } = req.params;

  try {
    const pautas = await OrdenProgramacion.findAll({
      where: { idOrden },
      include: [
        {
          model: Programa,
          as: 'Programa'
        }
      ],
      order: [['horaPauta', 'ASC']]
    });

    res.json(pautas);
  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al obtener las pautas de programación',
      error: error.message
    });
  }
};

// Obtener pauta por ID
const obtenerPautaPorId = async (req, res) => {
  const { id } = req.params;

  try {
    const pauta = await OrdenProgramacion.findByPk(id, {
      include: [
        {
          model: Programa,
          as: 'Programa'
        }
      ]
    });

    if (!pauta) {
      return res.status(404).json({ mensaje: 'Pauta de programación no encontrada' });
    }

    res.json(pauta);
  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al obtener la pauta de programación',
      error: error.message
    });
  }
};

// Actualizar pauta
const actualizarPauta = [
  ...reglasEditar,
  async (req, res) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json({ errores: errores.array() });
    }

    const { id } = req.params;

    try {
      const pauta = await OrdenProgramacion.findByPk(id);
      if (!pauta) {
        return res.status(404).json({ mensaje: 'Pauta de programación no encontrada' });
      }

      await pauta.update(req.body);

      res.json({
        mensaje: 'Pauta de programación actualizada exitosamente',
        pauta
      });
    } catch (error) {
      res.status(500).json({
        mensaje: 'Error al actualizar la pauta de programación',
        error: error.message
      });
    }
  }
];

// Eliminar pauta
const eliminarPauta = async (req, res) => {
  const { id } = req.params;

  try {
    const pauta = await OrdenProgramacion.findByPk(id);
    if (!pauta) {
      return res.status(404).json({ mensaje: 'Pauta de programación no encontrada' });
    }

    await pauta.destroy();

    res.json({
      mensaje: 'Pauta de programación eliminada exitosamente'
    });
  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al eliminar la pauta de programación',
      error: error.message
    });
  }
};

// Cambiar estado de pauta
const cambiarEstadoPauta = async (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;

  if (!['activo', 'pausado', 'cancelado'].includes(estado)) {
    return res.status(400).json({ mensaje: 'Estado inválido' });
  }

  try {
    const pauta = await OrdenProgramacion.findByPk(id);
    if (!pauta) {
      return res.status(404).json({ mensaje: 'Pauta de programación no encontrada' });
    }

    await pauta.update({ estado });

    res.json({
      mensaje: 'Estado de pauta actualizado exitosamente',
      pauta
    });
  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al cambiar el estado de la pauta',
      error: error.message
    });
  }
};

module.exports = {
  crearPauta,
  obtenerPautasPorOrden,
  obtenerPautaPorId,
  actualizarPauta,
  eliminarPauta,
  cambiarEstadoPauta
};