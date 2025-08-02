// controladores/programacion/AnuncioBloqueController.js  
const { body, validationResult } = require('express-validator');  
const AnuncioBloque = require('../../modelos/programacion/AnuncioBloque');  
const BloquePublicitario = require('../../modelos/programacion/BloquePublicitario');  
const Cliente = require('../../modelos/gestion_cliente/Cliente');  
const Persona = require('../../modelos/seguridad/Persona');  
const { Op } = require('sequelize');  
  
// === VALIDACIONES ===  
const reglasCrear = [  
  body('idBloque')  
    .notEmpty().withMessage('El idBloque es obligatorio')  
    .isInt({ min: 1 }).withMessage('El idBloque debe ser un número entero positivo'),  
  body('idCliente')  
    .notEmpty().withMessage('El idCliente es obligatorio')  
    .isInt({ min: 1 }).withMessage('El idCliente debe ser un número entero positivo'),  
  body('ordenAnuncio')  
    .notEmpty().withMessage('El orden del anuncio es obligatorio')  
    .isInt({ min: 1 }).withMessage('El orden del anuncio debe ser un entero positivo'),  
  body('duracionAnuncio')  
    .optional()  
    .isInt({ min: 1 }).withMessage('La duración debe ser un entero positivo'),  
  body('nombreComercial')  
    .optional()  
    .isLength({ max: 100 }).withMessage('El nombre comercial no puede exceder 100 caracteres'),  
  body('archivoAnuncio')  
    .optional()  
    .isLength({ max: 255 }).withMessage('La ruta del archivo no puede exceder 255 caracteres'),  
  body('estado')  
    .optional()  
    .isIn(['Programado', 'Emitido', 'Cancelado']).withMessage('Estado inválido')  
];  
  
const reglasEditar = [  
  body('idBloque')  
    .optional()  
    .isInt({ min: 1 }).withMessage('El idBloque debe ser un número entero positivo'),  
  body('idCliente')  
    .optional()  
    .isInt({ min: 1 }).withMessage('El idCliente debe ser un número entero positivo'),  
  body('ordenAnuncio')  
    .optional()  
    .isInt({ min: 1 }).withMessage('El orden del anuncio debe ser un entero positivo'),  
  body('duracionAnuncio')  
    .optional()  
    .isInt({ min: 1 }).withMessage('La duración debe ser un entero positivo'),  
  body('nombreComercial')  
    .optional()  
    .isLength({ max: 100 }).withMessage('El nombre comercial no puede exceder 100 caracteres'),  
  body('archivoAnuncio')  
    .optional()  
    .isLength({ max: 255 }).withMessage('La ruta del archivo no puede exceder 255 caracteres'),  
  body('estado')  
    .optional()  
    .isIn(['Programado', 'Emitido', 'Cancelado']).withMessage('Estado inválido')  
];  
  
// === CONTROLADORES ===  
  
// Crear anuncio en bloque  
const crearAnuncio = [  
  ...reglasCrear,  
  async (req, res) => {  
    const errores = validationResult(req);  
    if (!errores.isEmpty()) {  
      return res.status(400).json({ errores: errores.array() });  
    }  
    try {  
      // Validar existencia de idBloque  
      const bloque = await BloquePublicitario.findByPk(req.body.idBloque);  
      if (!bloque) {  
        return res.status(400).json({ mensaje: 'El bloque publicitario asociado no existe' });  
      }  
  
      // Validar existencia de idCliente  
      const cliente = await Cliente.findByPk(req.body.idCliente);  
      if (!cliente) {  
        return res.status(400).json({ mensaje: 'El cliente asociado no existe' });  
      }  
  
      // Validar que no exista otro anuncio con el mismo orden en el mismo bloque  
      const anuncioExistente = await AnuncioBloque.findOne({  
        where: {  
          idBloque: req.body.idBloque,  
          ordenAnuncio: req.body.ordenAnuncio  
        }  
      });  
      if (anuncioExistente) {  
        return res.status(400).json({ mensaje: 'Ya existe un anuncio con ese orden en el bloque especificado' });  
      }  
  
      const anuncio = await AnuncioBloque.create(req.body);  
      res.status(201).json({ mensaje: 'Anuncio creado', anuncio });  
    } catch (error) {  
      res.status(500).json({ mensaje: 'Error al crear anuncio', error: error.message });  
    }  
  }  
];  
  
// Obtener todos los anuncios con filtros  
const obtenerAnuncios = async (req, res) => {  
  try {  
    const { idBloque, idCliente, estado } = req.query;  
    const whereAnuncio = {};  
      
    if (idBloque) whereAnuncio.idBloque = idBloque;  
    if (idCliente) whereAnuncio.idCliente = idCliente;  
    if (estado) whereAnuncio.estado = estado;  
  
    const anuncios = await AnuncioBloque.findAll({  
      where: Object.keys(whereAnuncio).length ? whereAnuncio : undefined,  
      include: [  
        {  
          model: BloquePublicitario,  
          attributes: ['horaBloque', 'ordenBloque', 'duracionTotal']  
        },  
        {  
          model: Cliente,  
          include: [{  
            model: Persona,  
            as: 'persona',  
            attributes: ['Pnombre', 'Snombre', 'Papellido', 'Sapellido']  
          }]  
        }  
      ],  
      order: [['idBloque', 'ASC'], ['ordenAnuncio', 'ASC']]  
    });  
    res.json(anuncios);  
  } catch (error) {  
    res.status(500).json({ mensaje: 'Error al obtener anuncios', error: error.message });  
  }  
};  
  
// Obtener anuncio por ID  
const obtenerAnuncioPorId = async (req, res) => {  
  const { id } = req.params;  
  try {  
    const anuncio = await AnuncioBloque.findByPk(id, {  
      include: [  
        {  
          model: BloquePublicitario,  
          attributes: ['horaBloque', 'ordenBloque', 'duracionTotal', 'fechaVigencia']  
        },  
        {  
          model: Cliente,  
          include: [{  
            model: Persona,  
            as: 'persona',  
            attributes: ['Pnombre', 'Snombre', 'Papellido', 'Sapellido', 'correo', 'telefono']  
          }]  
        }  
      ]  
    });  
    if (!anuncio) return res.status(404).json({ mensaje: 'Anuncio no encontrado' });  
    res.json(anuncio);  
  } catch (error) {  
    res.status(500).json({ mensaje: 'Error al obtener anuncio', error: error.message });  
  }  
};  
  
// Obtener anuncios por bloque  
const obtenerAnunciosPorBloque = async (req, res) => {  
  const { idBloque } = req.params;  
  try {  
    const anuncios = await AnuncioBloque.findAll({  
      where: { idBloque },  
      include: [{  
        model: Cliente,  
        include: [{  
          model: Persona,  
          as: 'persona',  
          attributes: ['Pnombre', 'Snombre', 'Papellido', 'Sapellido']  
        }]  
      }],  
      order: [['ordenAnuncio', 'ASC']]  
    });  
    res.json(anuncios);  
  } catch (error) {  
    res.status(500).json({ mensaje: 'Error al obtener anuncios por bloque', error: error.message });  
  }  
};  
  
// Editar anuncio  
const editarAnuncio = [  
  ...reglasEditar,  
  async (req, res) => {  
    const errores = validationResult(req);  
    if (!errores.isEmpty()) {  
      return res.status(400).json({ errores: errores.array() });  
    }  
    const { id } = req.params;  
    try {  
      const anuncio = await AnuncioBloque.findByPk(id);  
      if (!anuncio) return res.status(404).json({ mensaje: 'Anuncio no encontrado' });  
  
      // Validar existencias si se proporcionan  
      if (req.body.idBloque) {  
        const bloque = await BloquePublicitario.findByPk(req.body.idBloque);  
        if (!bloque) {  
          return res.status(400).json({ mensaje: 'El bloque publicitario asociado no existe' });  
        }  
      }  
  
      if (req.body.idCliente) {  
        const cliente = await Cliente.findByPk(req.body.idCliente);  
        if (!cliente) {  
          return res.status(400).json({ mensaje: 'El cliente asociado no existe' });  
        }  
      }  
  
      // Validar orden único si se cambia  
      if (req.body.ordenAnuncio && req.body.ordenAnuncio !== anuncio.ordenAnuncio) {  
        const bloqueId = req.body.idBloque || anuncio.idBloque;  
        const anuncioExistente = await AnuncioBloque.findOne({  
          where: {  
            idBloque: bloqueId,  
            ordenAnuncio: req.body.ordenAnuncio,  
            idAnuncioBloque: { [Op.ne]: id }  
          }  
        });  
        if (anuncioExistente) {  
          return res.status(400).json({ mensaje: 'Ya existe un anuncio con ese orden en el bloque especificado' });  
        }  
      }  
  
      await anuncio.update(req.body);  
      res.json({ mensaje: 'Anuncio actualizado', anuncio });  
    } catch (error) {  
      res.status(500).json({ mensaje: 'Error al editar anuncio', error: error.message });  
    }  
  }  
];  
  
// Eliminar anuncio  
const eliminarAnuncio = async (req, res) => {  
  const { id } = req.params;  
  try {  
    const anuncio = await AnuncioBloque.findByPk(id);  
    if (!anuncio) return res.status(404).json({ mensaje: 'Anuncio no encontrado' });  
  
    await anuncio.destroy();  
    res.json({ mensaje: 'Anuncio eliminado' });  
  } catch (error) {  
    res.status(500).json({ mensaje: 'Error al eliminar anuncio', error: error.message });  
  }  
};  
  
module.exports = {  
  crearAnuncio,  
  obtenerAnuncios,  
  obtenerAnuncioPorId,  
  obtenerAnunciosPorBloque,  
  editarAnuncio,  
  eliminarAnuncio  
};