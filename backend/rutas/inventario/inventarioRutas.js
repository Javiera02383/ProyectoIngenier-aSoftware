const express = require('express');
const { body, param, validationResult } = require('express-validator');
const inventarioController = require('../../controladores/inventario/inventarioController');
const { verificarUsuario } = require('../../configuraciones/passport');

const router = express.Router();

// Middleware para manejar errores de validación
const manejarErrores = (req, res, next) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }
  next();
};

// Obtener todos los inventarios
router.get(
  '/todos',
  verificarUsuario,
  inventarioController.obtenerInventarios
);

// Obtener inventario por ID
router.get(
  '/:id',
  verificarUsuario,
  param('id').isInt().withMessage('ID debe ser un número entero'),
  manejarErrores,
  inventarioController.obtenerInventarioPorId
);

// Crear nuevo inventario
router.post(
  '/nuevoInventario',
  verificarUsuario,
  body('codigo').notEmpty().withMessage('Código es obligatorio'),
  body('nombre').notEmpty().withMessage('Nombre es obligatorio'),
  body('cantidad').isInt({ min: 1 }).withMessage('Cantidad debe ser un entero positivo'),
  body('ubicacion').notEmpty().withMessage('Ubicación es obligatoria'),
  body('idEmpleado').isInt().withMessage('ID de empleado debe ser un número entero'),
  body('estado').isIn(['Disponible', 'Asignado', 'En Mantenimiento', 'Baja']).withMessage('Estado inválido'),

  // Nuevos campos
  body('idProveedor')  
  .optional({ checkFalsy: true, nullable: true })  
  .isInt().withMessage('ID de proveedor debe ser un número entero'),
  body('marca')
    .optional({ checkFalsy: true })
    .isLength({ max: 100 }).withMessage('Marca no debe superar los 100 caracteres'),
  body('fechaCompra')
    .optional({ checkFalsy: true })
    .isISO8601().withMessage('Fecha de compra no es válida'),

  manejarErrores,
  inventarioController.crearInventario
);

// Actualizar inventario
router.put(
  '/:id',
  verificarUsuario,
  param('id').isInt().withMessage('ID debe ser un número entero'),
  body('cantidad').optional().isInt({ min: 1 }),
  body('estado').optional().isIn(['Disponible', 'Asignado', 'En Mantenimiento', 'Baja']),
  manejarErrores,
  inventarioController.actualizarInventario
);

// Eliminar inventario
router.delete(
  '/:id',
  verificarUsuario,
  param('id').isInt().withMessage('ID debe ser un número entero'),
  manejarErrores,
  inventarioController.eliminarInventario
);

module.exports = router;
