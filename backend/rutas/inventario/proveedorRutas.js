// rutas/inventario/ProveedorRuta.js  
const express = require('express');  
const { body, param, query } = require('express-validator');  
const proveedorController = require('../../controladores/inventario/proveedorController');  
const router = express.Router();  
const { verificarUsuario } = require('../../configuraciones/passport');  
  
// Crear proveedor  
router.post('/proveedor',  
  verificarUsuario,  
  [  
    body('idPersona').isInt({ min: 1 }).withMessage('El idPersona debe ser un número entero positivo')  
      .custom(async value => {  
        const Persona = require('../../modelos/seguridad/Persona');  
        const existe = await Persona.findByPk(value);  
        if (!existe) throw new Error('La persona asociada no existe');  
        return true;  
      }),  
    body('codigoProveedor').optional().isLength({ max: 45 }).withMessage('El código no puede exceder 45 caracteres'),  
    body('tipoProveedor').optional().isIn(['Nacional', 'Internacional']).withMessage('Tipo de proveedor inválido'),  
    body('estado').optional().isIn(['Activo', 'Inactivo']).withMessage('Estado inválido')  
  ],  
  proveedorController.crearProveedor  
);  
  
// Obtener todos los proveedores con filtros  
router.get('/proveedor',  
  verificarUsuario,  
  [  
    query('nombre').optional().isLength({ min: 3 }).withMessage('El nombre debe tener al menos 3 caracteres'),  
    query('apellido').optional().isLength({ min: 3 }).withMessage('El apellido debe tener al menos 3 caracteres'),  
    query('tipoProveedor').optional().isIn(['Nacional', 'Internacional']).withMessage('Tipo de proveedor inválido'),  
    query('estado').optional().isIn(['Activo', 'Inactivo']).withMessage('Estado inválido')  
  ],  
  proveedorController.obtenerProveedores  
);  
  
// Obtener proveedor por ID  
router.get('/proveedor/:id',  
  param('id').isInt({ min: 1 }).withMessage('El id debe ser un número entero positivo'),  
  verificarUsuario,  
  proveedorController.obtenerProveedorPorId  
);  
  
// Actualizar proveedor  
router.put('/proveedor/:id',  
  [  
    param('id').isInt({ min: 1 }).withMessage('El id debe ser un número entero positivo')  
      .custom(async value => {  
        const Proveedor = require('../../modelos/inventario/Proveedor');  
        const existe = await Proveedor.findByPk(value);  
        if (!existe) throw new Error('El proveedor no existe');  
        return true;  
      }),  
    body('idPersona').optional().isInt({ min: 1 }).withMessage('El idPersona debe ser un número entero positivo')  
      .custom(async value => {  
        if (value) {  
          const Persona = require('../../modelos/seguridad/Persona');  
          const existe = await Persona.findByPk(value);  
          if (!existe) throw new Error('La persona asociada no existe');  
        }  
        return true;  
      }),  
    body('codigoProveedor').optional().isLength({ max: 45 }).withMessage('El código no puede exceder 45 caracteres'),  
    body('tipoProveedor').optional().isIn(['Nacional', 'Internacional']).withMessage('Tipo de proveedor inválido'),  
    body('estado').optional().isIn(['Activo', 'Inactivo']).withMessage('Estado inválido')  
  ],  
  verificarUsuario,  
  proveedorController.editarProveedor  
);  
  
// Eliminar proveedor  
router.delete('/proveedor/:id',  
  [  
    param('id').isInt({ min: 1 }).withMessage('El id debe ser un número entero positivo')  
      .custom(async value => {  
        const Proveedor = require('../../modelos/inventario/Proveedor');  
        const existe = await Proveedor.findByPk(value);  
        if (!existe) throw new Error('El proveedor no existe');  
        return true;  
      })  
  ],  
  verificarUsuario,  
  proveedorController.eliminarProveedor  
);  
  
module.exports = router;