// rutas/inventario/proveedorRuta.js        
const express = require('express');    
const { body, param, validationResult, query } = require('express-validator');    
const proveedorController = require('../../controladores/inventario/proveedorController');        
const { verificarUsuario } = require('../../configuraciones/passport');    
const router = express.Router();    
  
// MIDDLEWARE PARA MANEJAR ERRORES DE VALIDACIÓN  
const manejarErrores = (req, res, next) => {  
  const errores = validationResult(req);  
  if (!errores.isEmpty()) {  
    return res.status(400).json({ errores: errores.array() });  
  }  
  next();  
};  
  
// RUTAS ESPECÍFICAS PRIMERO (sin parámetros) - ORDEN CRÍTICO  
router.get('/proveedores/todos', verificarUsuario, proveedorController.obtenerTodosLosProveedores); 
  
// Obtener proveedores con filtros de búsqueda (sin parámetros de ruta)  
router.get('/proveedor',      
  verificarUsuario,      
  [      
    query('Pnombre').optional().isLength({ min: 3 }).withMessage('El nombre debe tener al menos 3 letras'),      
    query('Papellido').optional().isLength({ min: 3 }).withMessage('El apellido debe tener al menos 3 letras'),      
    (req, res, next) => {      
      const errores = validationResult(req);      
      if (!errores.isEmpty()) {      
        return res.status(400).json({ errores: errores.array() });      
      }      
      if (!req.query.Pnombre && !req.query.Papellido) {      
        return res.status(400).json({ mensaje: 'Debe enviar al menos Pnombre o Papellido con mínimo 3 letras.' });      
      }      
      next();      
    }      
  ],      
  proveedorController.obtenerProveedores      
);      
  
// Crear proveedor (POST sin parámetros de ruta)  
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
  manejarErrores,        
  proveedorController.crearProveedor        
);        
  
// RUTAS CON PARÁMETROS AL FINAL - ORDEN CRÍTICO  
// Obtener proveedor por ID        
router.get('/proveedor/:id',        
  verificarUsuario,      
  [  
    param('id').isInt({ min: 1 }).withMessage('El id debe ser un número entero positivo')  
  ],  
  manejarErrores,        
  proveedorController.obtenerProveedorPorId        
);        
        
// Actualizar proveedor        
router.put('/proveedor/:id',        
  verificarUsuario,      
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
  manejarErrores,        
  proveedorController.editarProveedor        
);        
        
// Eliminar proveedor        
router.delete('/proveedor/:id',        
  verificarUsuario,      
  [        
    param('id').isInt({ min: 1 }).withMessage('El id debe ser un número entero positivo')        
      .custom(async value => {        
        const Proveedor = require('../../modelos/inventario/Proveedor');        
        const existe = await Proveedor.findByPk(value);        
        if (!existe) throw new Error('El proveedor no existe');        
        return true;        
      })        
  ],  
  manejarErrores,        
  proveedorController.eliminarProveedor        
);        
        
module.exports = router;