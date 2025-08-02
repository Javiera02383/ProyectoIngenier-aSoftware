// rutas/programacion/programaRuta.js  
const express = require('express');  
const { body, param, query } = require('express-validator');  
const programaController = require('../../controladores/programacion/programaController');  
const router = express.Router();  
const { verificarUsuario } = require('../../configuraciones/passport');  
  
// Crear programa  
router.post('/programa',  
  verificarUsuario,  
  [  
    body('nombre').isLength({ min: 3, max: 100 }).withMessage('Nombre debe tener entre 3 y 100 caracteres'),  
    body('tipoCalendario').isIn(['Lunes_Sabado', 'Domingo']).withMessage('Tipo de calendario inválido'),  
    body('horaInicio').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Hora de inicio debe tener formato HH:MM'),  
    body('duracion').isInt({ min: 1 }).withMessage('Duración debe ser un entero positivo'),  
    body('categoria').isIn(['Noticias', 'Entretenimiento', 'Deportes', 'Cultural', 'Educativo', 'Infantil']).withMessage('Categoría inválida'),  
    body('idEmpleado').isInt({ min: 1 }).withMessage('ID de empleado debe ser un número entero positivo')  
      .custom(async value => {  
        const Empleado = require('../../modelos/gestion_cliente/Empleado');  
        const existe = await Empleado.findByPk(value);  
        if (!existe) throw new Error('El empleado asociado no existe');  
        return true;  
      })  
  ],  
  programaController.crearPrograma  
);  
  
// Obtener programas con filtros  
router.get('/programa',  
  verificarUsuario,  
  [  
    query('tipoCalendario').optional().isIn(['Lunes_Sabado', 'Domingo']).withMessage('Tipo de calendario inválido'),  
    query('categoria').optional().isIn(['Noticias', 'Entretenimiento', 'Deportes', 'Cultural', 'Educativo', 'Infantil']).withMessage('Categoría inválida'),  
    query('estado').optional().isIn(['Activo', 'Inactivo']).withMessage('Estado inválido'),  
    query('nombre').optional().isLength({ min: 3 }).withMessage('El nombre debe tener al menos 3 caracteres')  
  ],  
  programaController.obtenerProgramas  
);  
  
// Obtener programa por ID  
router.get('/programa/:id',  
  verificarUsuario,  
  [  
    param('id').isInt({ min: 1 }).withMessage('El id debe ser un número entero positivo')  
  ],  
  programaController.obtenerProgramaPorId  
);  
  
// Actualizar programa  
router.put('/programa/:id',  
  verificarUsuario,  
  [  
    param('id').isInt({ min: 1 }).withMessage('El id debe ser un número entero positivo')  
      .custom(async value => {  
        const Programa = require('../../modelos/programacion/Programa');  
        const existe = await Programa.findByPk(value);  
        if (!existe) throw new Error('El programa no existe');  
        return true;  
      }),  
    body('nombre').optional().isLength({ min: 3, max: 100 }).withMessage('Nombre debe tener entre 3 y 100 caracteres'),  
    body('tipoCalendario').optional().isIn(['Lunes_Sabado', 'Domingo']).withMessage('Tipo de calendario inválido'),  
    body('horaInicio').optional().matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Hora de inicio debe tener formato HH:MM'),  
    body('duracion').optional().isInt({ min: 1 }).withMessage('Duración debe ser un entero positivo'),  
    body('categoria').optional().isIn(['Noticias', 'Entretenimiento', 'Deportes', 'Cultural', 'Educativo', 'Infantil']).withMessage('Categoría inválida'),  
    body('estado').optional().isIn(['Activo', 'Inactivo']).withMessage('Estado inválido'),  
    body('idEmpleado').optional().isInt({ min: 1 }).withMessage('ID de empleado debe ser un número entero positivo')  
      .custom(async value => {  
        if (value) {  
          const Empleado = require('../../modelos/gestion_cliente/Empleado');  
          const existe = await Empleado.findByPk(value);  
          if (!existe) throw new Error('El empleado asociado no existe');  
        }  
        return true;  
      })  
  ],  
  programaController.editarPrograma  
);  
  
// Eliminar programa  
router.delete('/programa/:id',  
  verificarUsuario,  
  [  
    param('id').isInt({ min: 1 }).withMessage('El id debe ser un número entero positivo')  
      .custom(async value => {  
        const Programa = require('../../modelos/programacion/Programa');  
        const existe = await Programa.findByPk(value);  
        if (!existe) throw new Error('El programa no existe');  
        return true;  
      })  
  ],  
  programaController.eliminarPrograma  
);  
  
module.exports = router;