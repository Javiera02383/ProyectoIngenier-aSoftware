// rutas/programacion/BloquePublicitarioRuta.js  
const express = require('express');  
const { body, param, query } = require('express-validator');  
const bloqueController = require('../../controladores/programacion/bloquePublicitarioController');  
const router = express.Router();  
const { verificarUsuario } = require('../../configuraciones/passport');  
  
// Crear bloque publicitario  
router.post('/bloque',  
  verificarUsuario,  
  [  
    body('idPrograma').isInt({ min: 1 }).withMessage('El idPrograma debe ser un número entero positivo')  
      .custom(async value => {  
        const Programa = require('../../modelos/programacion/Programa');  
        const existe = await Programa.findByPk(value);  
        if (!existe) throw new Error('El programa asociado no existe');  
        return true;  
      }),  
    body('horaBloque').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Hora del bloque debe tener formato HH:MM'),  
    body('ordenBloque').isInt({ min: 1 }).withMessage('Orden del bloque debe ser un entero positivo')  
      .custom(async (value, { req }) => {  
        const BloquePublicitario = require('../../modelos/programacion/BloquePublicitario');  
        const existe = await BloquePublicitario.findOne({  
          where: {  
            idPrograma: req.body.idPrograma,  
            ordenBloque: value  
          }  
        });  
        if (existe) throw new Error('Ya existe un bloque con ese orden en el programa especificado');  
        return true;  
      }),  
    body('duracionTotal').optional().isInt({ min: 1 }).withMessage('La duración total debe ser un entero positivo'),  
    body('fechaVigencia').isISO8601().withMessage('Fecha de vigencia debe tener formato válido (YYYY-MM-DD)'),  
    body('estado').optional().isIn(['Activo', 'Pausado']).withMessage('Estado inválido')  
  ],  
  bloqueController.crearBloque  
);  
  
// Obtener bloques con filtros  
router.get('/bloque',  
  verificarUsuario,  
  [  
    query('idPrograma').optional().isInt({ min: 1 }).withMessage('El idPrograma debe ser un número entero positivo'),  
    query('estado').optional().isIn(['Activo', 'Pausado']).withMessage('Estado inválido'),  
    query('fechaVigencia').optional().isISO8601().withMessage('Fecha de vigencia debe tener formato válido (YYYY-MM-DD)')  
  ],  
  bloqueController.obtenerBloques  
);  
  
// Obtener bloque por ID  
router.get('/bloque/:id',  
  verificarUsuario,  
  [  
    param('id').isInt({ min: 1 }).withMessage('El id debe ser un número entero positivo')  
  ],  
  bloqueController.obtenerBloquePorId  
);  
  
// Obtener bloques por programa  
router.get('/bloque/programa/:idPrograma',  
  verificarUsuario,  
  [  
    param('idPrograma').isInt({ min: 1 }).withMessage('El idPrograma debe ser un número entero positivo')  
      .custom(async value => {  
        const Programa = require('../../modelos/programacion/Programa');  
        const existe = await Programa.findByPk(value);  
        if (!existe) throw new Error('El programa no existe');  
        return true;  
      })  
  ],  
  bloqueController.obtenerBloquesPorPrograma  
);  
  
// Actualizar bloque publicitario  
router.put('/bloque/:id',  
  verificarUsuario,  
  [  
    param('id').isInt({ min: 1 }).withMessage('El id debe ser un número entero positivo')  
      .custom(async value => {  
        const BloquePublicitario = require('../../modelos/programacion/BloquePublicitario');  
        const existe = await BloquePublicitario.findByPk(value);  
        if (!existe) throw new Error('El bloque publicitario no existe');  
        return true;  
      }),  
    body('idPrograma').optional().isInt({ min: 1 }).withMessage('El idPrograma debe ser un número entero positivo')  
      .custom(async value => {  
        if (value) {  
          const Programa = require('../../modelos/programacion/Programa');  
          const existe = await Programa.findByPk(value);  
          if (!existe) throw new Error('El programa asociado no existe');  
        }  
        return true;  
      }),  
    body('horaBloque').optional().matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Hora del bloque debe tener formato HH:MM'),  
    body('ordenBloque').optional().isInt({ min: 1 }).withMessage('Orden del bloque debe ser un entero positivo')  
      .custom(async (value, { req }) => {  
        if (value) {  
          const BloquePublicitario = require('../../modelos/programacion/BloquePublicitario');  
          const existe = await BloquePublicitario.findOne({  
            where: {
              idPrograma: req.body.idPrograma || req.params.idPrograma,  
              ordenBloque: value,  
              idBloque: { [require('sequelize').Op.ne]: req.params.id }  
            }  
          });  
          if (existe) throw new Error('Ya existe un bloque con ese orden en el programa especificado');  
        }  
        return true;  
      }),  
    body('duracionTotal').optional().isInt({ min: 1 }).withMessage('La duración total debe ser un entero positivo'),  
    body('fechaVigencia').optional().isISO8601().withMessage('Fecha de vigencia debe tener formato válido (YYYY-MM-DD)'),  
    body('estado').optional().isIn(['Activo', 'Pausado']).withMessage('Estado inválido')  
  ],  
  bloqueController.editarBloque  
);  
  
// Eliminar bloque publicitario  
router.delete('/bloque/:id',  
  verificarUsuario,  
  [  
    param('id').isInt({ min: 1 }).withMessage('El id debe ser un número entero positivo')  
      .custom(async value => {  
        const BloquePublicitario = require('../../modelos/programacion/BloquePublicitario');  
        const existe = await BloquePublicitario.findByPk(value);  
        if (!existe) throw new Error('El bloque publicitario no existe');  
        return true;  
      })  
  ],  
  bloqueController.eliminarBloque  
);  
  
module.exports = router;