// rutas/programacion/anuncioBloqueRuta.js  
const express = require('express');  
const { body, param, query } = require('express-validator');  
const anuncioController = require('../../controladores/programacion/anuncioBloqueController');  
const router = express.Router();  
const { verificarUsuario } = require('../../configuraciones/passport');  
  
// Crear anuncio en bloque  
router.post('/anuncio',  
  verificarUsuario,  
  [  
    body('idBloque').isInt({ min: 1 }).withMessage('El idBloque debe ser un número entero positivo')  
      .custom(async value => {  
        const BloquePublicitario = require('../../modelos/programacion/BloquePublicitario');  
        const existe = await BloquePublicitario.findByPk(value);  
        if (!existe) throw new Error('El bloque publicitario asociado no existe');  
        return true;  
      }),  
    body('idCliente').isInt({ min: 1 }).withMessage('El idCliente debe ser un número entero positivo')  
      .custom(async value => {  
        const Cliente = require('../../modelos/gestion_cliente/Cliente');  
        const existe = await Cliente.findByPk(value);  
        if (!existe) throw new Error('El cliente asociado no existe');  
        return true;  
      }),  
    body('ordenAnuncio').isInt({ min: 1 }).withMessage('El orden del anuncio debe ser un entero positivo')  
      .custom(async (value, { req }) => {  
        const AnuncioBloque = require('../../modelos/programacion/AnuncioBloque');  
        const existe = await AnuncioBloque.findOne({  
          where: {  
            idBloque: req.body.idBloque,  
            ordenAnuncio: value  
          }  
        });  
        if (existe) throw new Error('Ya existe un anuncio con ese orden en el bloque especificado');  
        return true;  
      }),  
    body('duracionAnuncio').optional().isInt({ min: 1 }).withMessage('La duración debe ser un entero positivo'),  
    body('nombreComercial').optional().isLength({ max: 100 }).withMessage('El nombre comercial no puede exceder 100 caracteres'),  
    body('estado').optional().isIn(['Programado', 'Emitido', 'Cancelado']).withMessage('Estado inválido')  
  ],  
  anuncioController.crearAnuncio  
);  
  
// Obtener anuncios con filtros  
router.get('/anuncio',  
  verificarUsuario,  
  [  
    query('idBloque').optional().isInt({ min: 1 }).withMessage('El idBloque debe ser un número entero positivo'),  
    query('idCliente').optional().isInt({ min: 1 }).withMessage('El idCliente debe ser un número entero positivo'),  
    query('estado').optional().isIn(['Programado', 'Emitido', 'Cancelado']).withMessage('Estado inválido')  
  ],  
  anuncioController.obtenerAnuncios  
);  
  
// Obtener anuncio por ID  
router.get('/anuncio/:id',  
  verificarUsuario,  
  [  
    param('id').isInt({ min: 1 }).withMessage('El id debe ser un número entero positivo')  
  ],  
  anuncioController.obtenerAnuncioPorId  
);  
  
// Obtener anuncios por bloque  
router.get('/anuncio/bloque/:idBloque',  
  verificarUsuario,  
  [  
    param('idBloque').isInt({ min: 1 }).withMessage('El idBloque debe ser un número entero positivo')  
      .custom(async value => {  
        const BloquePublicitario = require('../../modelos/programacion/BloquePublicitario');  
        const existe = await BloquePublicitario.findByPk(value);  
        if (!existe) throw new Error('El bloque publicitario no existe');  
        return true;  
      })  
  ],  
  anuncioController.obtenerAnunciosPorBloque  
);  
  
// Actualizar anuncio  
router.put('/anuncio/:id',  
  verificarUsuario,  
  [  
    param('id').isInt({ min: 1 }).withMessage('El id debe ser un número entero positivo')  
      .custom(async value => {  
        const AnuncioBloque = require('../../modelos/programacion/AnuncioBloque');  
        const existe = await AnuncioBloque.findByPk(value);  
        if (!existe) throw new Error('El anuncio no existe');  
        return true;  
      }),  
    body('idBloque').optional().isInt({ min: 1 }).withMessage('El idBloque debe ser un número entero positivo')  
      .custom(async value => {  
        if (value) {  
          const BloquePublicitario = require('../../modelos/programacion/BloquePublicitario');  
          const existe = await BloquePublicitario.findByPk(value);  
          if (!existe) throw new Error('El bloque publicitario asociado no existe');  
        }  
        return true;  
      }),  
    body('idCliente').optional().isInt({ min: 1 }).withMessage('El idCliente debe ser un número entero positivo')  
      .custom(async value => {  
        if (value) {  
          const Cliente = require('../../modelos/gestion_cliente/Cliente');  
          const existe = await Cliente.findByPk(value);  
          if (!existe) throw new Error('El cliente asociado no existe');  
        }  
        return true;  
      }),  
    body('ordenAnuncio').optional().isInt({ min: 1 }).withMessage('El orden del anuncio debe ser un entero positivo')  
      .custom(async (value, { req }) => {  
        if (value) {  
          const AnuncioBloque = require('../../modelos/programacion/AnuncioBloque');  
          const existe = await AnuncioBloque.findOne({  
            where: {  
              idBloque: req.body.idBloque || req.params.idBloque,  
              ordenAnuncio: value,  
              idAnuncioBloque: { [require('sequelize').Op.ne]: req.params.id }  
            }  
          });  
          if (existe) throw new Error('Ya existe un anuncio con ese orden en el bloque especificado');  
        }  
        return true;  
      }),  
    body('duracionAnuncio').optional().isInt({ min: 1 }).withMessage('La duración debe ser un entero positivo'),  
    body('nombreComercial').optional().isLength({ max: 100 }).withMessage('El nombre comercial no puede exceder 100 caracteres'),  
    body('archivoAnuncio').optional().isLength({ max: 255 }).withMessage('La ruta del archivo no puede exceder 255 caracteres'),  
    body('estado').optional().isIn(['Programado', 'Emitido', 'Cancelado']).withMessage('Estado inválido')  
  ],  
  anuncioController.editarAnuncio  
);  
  
// Eliminar anuncio  
router.delete('/anuncio/:id',  
  verificarUsuario,  
  [  
    param('id').isInt({ min: 1 }).withMessage('El id debe ser un número entero positivo')  
      .custom(async value => {  
        const AnuncioBloque = require('../../modelos/programacion/AnuncioBloque');  
        const existe = await AnuncioBloque.findByPk(value);  
        if (!existe) throw new Error('El anuncio no existe');  
        return true;  
      })  
  ],  
  anuncioController.eliminarAnuncio  
);  
  
module.exports = router;