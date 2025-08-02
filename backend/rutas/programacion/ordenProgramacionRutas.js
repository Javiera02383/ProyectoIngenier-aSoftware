// rutas/programacion/OrdenProgramacionRuta.js  
const express = require('express');  
const { body, param, query } = require('express-validator');  
const ordenProgramacionController = require('../../controladores/programacion/ordenProgramacionController');  
const router = express.Router();  
const { verificarUsuario } = require('../../configuraciones/passport');  
  
// Crear orden de programación  
router.post('/orden-programacion',  
  verificarUsuario,  
  [  
    body('idOrden').isInt({ min: 1 }).withMessage('El idOrden debe ser un número entero positivo')  
      .custom(async value => {  
        const OrdenPublicidad = require('../../modelos/programacion/OrdenPublicidad');  
        const existe = await OrdenPublicidad.findByPk(value);  
        if (!existe) throw new Error('La orden de publicidad asociada no existe');  
        return true;  
      }),  
    body('idPrograma').isInt({ min: 1 }).withMessage('El idPrograma debe ser un número entero positivo')  
      .custom(async value => {  
        const Programa = require('../../modelos/programacion/Programa');  
        const existe = await Programa.findByPk(value);  
        if (!existe) throw new Error('El programa asociado no existe');  
        return true;  
      }),  
    body('idBloque').isInt({ min: 1 }).withMessage('El idBloque debe ser un número entero positivo')  
      .custom(async (value, { req }) => {  
        const BloquePublicitario = require('../../modelos/programacion/BloquePublicitario');  
        const bloque = await BloquePublicitario.findByPk(value);  
        if (!bloque) throw new Error('El bloque publicitario asociado no existe');  
        if (bloque.idPrograma !== req.body.idPrograma) {  
          throw new Error('El bloque publicitario no pertenece al programa especificado');  
        }  
        return true;  
      }),  
    body('cantidadSpots').optional().isInt({ min: 1 }).withMessage('La cantidad de spots debe ser un entero positivo'),  
    body('diasEmision').optional().isLength({ max: 100 }).withMessage('Los días de emisión no pueden exceder 100 caracteres')  
  ],  
  ordenProgramacionController.crearOrdenProgramacion  
);  
  
// Obtener órdenes de programación con filtros  
router.get('/orden-programacion',  
  verificarUsuario,  
  [  
    query('idOrden').optional().isInt({ min: 1 }).withMessage('El idOrden debe ser un número entero positivo'),  
    query('idPrograma').optional().isInt({ min: 1 }).withMessage('El idPrograma debe ser un número entero positivo'),  
    query('idBloque').optional().isInt({ min: 1 }).withMessage('El idBloque debe ser un número entero positivo')  
  ],  
  ordenProgramacionController.obtenerOrdenesProgramacion  
);  
  
// Obtener orden de programación por ID  
router.get('/orden-programacion/:id',  
  verificarUsuario,  
  [  
    param('id').isInt({ min: 1 }).withMessage('El id debe ser un número entero positivo')  
  ],  
  ordenProgramacionController.obtenerOrdenProgramacionPorId  
);  
  
// Obtener órdenes de programación por orden de publicidad  
router.get('/orden-programacion/orden/:idOrden',  
  verificarUsuario,  
  [  
    param('idOrden').isInt({ min: 1 }).withMessage('El idOrden debe ser un número entero positivo')  
      .custom(async value => {  
        const OrdenPublicidad = require('../../modelos/programacion/OrdenPublicidad');  
        const existe = await OrdenPublicidad.findByPk(value);  
        if (!existe) throw new Error('La orden de publicidad no existe');  
        return true;  
      })  
  ],  
  ordenProgramacionController.obtenerPorOrdenPublicidad  
);  
  
// Actualizar orden de programación  
router.put('/orden-programacion/:id',  
  verificarUsuario,  
  [  
    param('id').isInt({ min: 1 }).withMessage('El id debe ser un número entero positivo')  
      .custom(async value => {  
        const OrdenProgramacion = require('../../modelos/programacion/OrdenProgramacion');  
        const existe = await OrdenProgramacion.findByPk(value);  
        if (!existe) throw new Error('La orden de programación no existe');  
        return true;  
      }),  
    body('idOrden').optional().isInt({ min: 1 }).withMessage('El idOrden debe ser un número entero positivo')  
      .custom(async value => {  
        if (value) {  
          const OrdenPublicidad = require('../../modelos/programacion/OrdenPublicidad');  
          const existe = await OrdenPublicidad.findByPk(value);  
          if (!existe) throw new Error('La orden de publicidad asociada no existe');  
        }  
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
    body('idBloque').optional().isInt({ min: 1 }).withMessage('El idBloque debe ser un número entero positivo')  
      .custom(async (value, { req }) => {  
        if (value) {  
          const BloquePublicitario = require('../../modelos/programacion/BloquePublicitario');  
          const bloque = await BloquePublicitario.findByPk(value);  
          if (!bloque) throw new Error('El bloque publicitario asociado no existe');  
            
          // Validar que el bloque pertenezca al programa si se proporciona idPrograma  
          if (req.body.idPrograma && bloque.idPrograma !== req.body.idPrograma) {  
            throw new Error('El bloque publicitario no pertenece al programa especificado');  
          }  
        }  
        return true;  
      }),  
    body('cantidadSpots').optional().isInt({ min: 1 }).withMessage('La cantidad de spots debe ser un entero positivo'),  
    body('diasEmision').optional().isLength({ max: 100 }).withMessage('Los días de emisión no pueden exceder 100 caracteres')  
  ],  
  ordenProgramacionController.editarOrdenProgramacion  
);  
  
// Eliminar orden de programación  
router.delete('/orden-programacion/:id',  
  verificarUsuario,  
  [  
    param('id').isInt({ min: 1 }).withMessage('El id debe ser un número entero positivo')  
      .custom(async value => {  
        const OrdenProgramacion = require('../../modelos/programacion/OrdenProgramacion');  
        const existe = await OrdenProgramacion.findByPk(value);  
        if (!existe) throw new Error('La orden de programación no existe');  
        return true;  
      })  
  ],  
  ordenProgramacionController.eliminarOrdenProgramacion  
);  
  
module.exports = router;