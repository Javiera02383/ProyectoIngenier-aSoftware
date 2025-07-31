const express = require('express');
const { body, param, validationResult, query } = require('express-validator');
const empleadoController = require('../../controladores/gestion_cliente/EmpleadoController');
const { verificarUsuario } = require('../../configuraciones/passport');
const router = express.Router();

router.get('/todos-empleados', verificarUsuario, empleadoController.obtenerTodosLosEmpleados);

/**
 * @swagger
 * /empleados/empleado:
 *   post:
 *     summary: Crear un nuevo empleado
 *     tags: [Empleados]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - idPersona
 *             properties:
 *               idPersona:
 *                 type: integer
 *                 description: ID de la persona asociada al empleado
 *                 example: 1
 *               Fecha_Registro:
 *                 type: string
 *                 format: date
 *                 description: Fecha de registro del empleado (opcional)
 *                 example: "2025-07-16"
 *     responses:
 *       201:
 *         description: Empleado creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: Empleado creado
 *                 empleado:
 *                   $ref: '#/components/schemas/Empleado'
 *       400:
 *         description: Error de validación o persona no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: La persona asociada (idPersona) no existe
 *                 errores:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       msg:
 *                         type: string
 *                         example: El idPersona debe ser un número entero positivo
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: Error al crear empleado
 *                 error:
 *                   type: string
 *                   example: Mensaje de error
 */


// Validaciones para crear y editar empleado
const validarEmpleado = [
  body('idPersona').isInt({ min: 1 }).withMessage('El idPersona debe ser un número entero positivo'),
  body('Fecha_Registro').optional().isISO8601().withMessage('La fecha debe tener un formato válido (YYYY-MM-DD)'),
];

router.post('/empleado',
  verificarUsuario,
  [
    body('idPersona').isInt({ min: 1 }).withMessage('El idPersona debe ser un número entero positivo')
      .custom(async value => {
        const Persona = require('../../modelos/seguridad/Persona');
        const existe = await Persona.findByPk(value);
        if (!existe) throw new Error('La persona asociada no existe');
        return true;
      }),
    body('Fecha_Registro').optional().isISO8601().withMessage('La fecha debe tener un formato válido (YYYY-MM-DD)')
  ],
  empleadoController.crearEmpleado
);

/**
 * @swagger
 * /empleados/empleado:
 *   get:
 *     summary: Obtener todos los empleados con filtros opcionales
 *     tags: [Empleados]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: Pnombre
 *         schema:
 *           type: string
 *           minLength: 3
 *         required: false
 *         description: Nombre de la persona para filtrar (mínimo 3 caracteres)
 *         example: Juan
 *       - in: query
 *         name: Papellido
 *         schema:
 *           type: string
 *           minLength: 3
 *         required: false
 *         description: Apellido de la persona para filtrar (mínimo 3 caracteres)
 *         example: Pérez
 *     responses:
 *       200:
 *         description: Lista de empleados
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Empleado'
 *       400:
 *         description: Error de validación o falta de filtros
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: Debe enviar al menos Pnombre o Papellido con mínimo 3 letras
 *                 errores:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       msg:
 *                         type: string
 *                         example: El nombre debe tener al menos 3 letras
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: Error al obtener empleados
 *                 error:
 *                   type: string
 *                   example: Mensaje de error
 */

router.get('/empleado',
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
  empleadoController.obtenerEmpleados
);

/**
 * @swagger
 * /empleados/empleado/{id}:
 *   get:
 *     summary: Obtener un empleado por ID
 *     tags: [Empleados]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID del empleado
 *         example: 1
 *     responses:
 *       200:
 *         description: Empleado encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Empleado'
 *       404:
 *         description: Empleado no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: Empleado no encontrado
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: Error al obtener empleado
 *                 error:
 *                   type: string
 *                   example: Mensaje de error
 */

router.get('/empleado/:id',
  verificarUsuario,
  param('id').isInt({ min: 1 }).withMessage('El id debe ser un número entero positivo'),
  empleadoController.obtenerEmpleadoPorId
);

/**
 * @swagger
 * /empleados/empleado/{id}:
 *   put:
 *     summary: Actualizar un empleado existente
 *     tags: [Empleados]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID del empleado
 *         example: 1
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               idPersona:
 *                 type: integer
 *                 description: ID de la persona asociada al empleado (opcional)
 *                 example: 1
 *               Fecha_Registro:
 *                 type: string
 *                 format: date
 *                 description: Fecha de registro del empleado (opcional)
 *                 example: "2025-07-16"
 *     responses:
 *       200:
 *         description: Empleado actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: Empleado actualizado
 *                 empleado:
 *                   $ref: '#/components/schemas/Empleado'
 *       400:
 *         description: Error de validación o persona no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: La persona asociada (idPersona) no existe
 *                 errores:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       msg:
 *                         type: string
 *                         example: El idPersona debe ser un número entero positivo
 *       404:
 *         description: Empleado no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: Empleado no encontrado
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: Error al editar empleado
 *                 error:
 *                   type: string
 *                   example: Mensaje de error
 */

router.put('/empleado/:id',
  verificarUsuario,
  [
    param('id').isInt({ min: 1 }).withMessage('El id debe ser un número entero positivo')
      .custom(async value => {
        const Empleado = require('../../modelos/gestion_cliente/Empleado');
        const existe = await Empleado.findByPk(value);
        if (!existe) throw new Error('El empleado no existe');
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
    body('Fecha_Registro').optional().isISO8601().withMessage('La fecha debe tener un formato válido (YYYY-MM-DD)')
  ],
  empleadoController.editarEmpleado
);

/**
 * @swagger
 * /empleados/empleado/{id}:
 *   delete:
 *     summary: Eliminar un empleado
 *     tags: [Empleados]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID del empleado
 *         example: 1
 *     responses:
 *       200:
 *         description: Empleado eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: Empleado eliminado
 *       404:
 *         description: Empleado no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: Empleado no encontrado
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: Error al eliminar empleado
 *                 error:
 *                   type: string
 *                   example: Mensaje de error
 */

router.delete('/empleado/:id',
  verificarUsuario,
  [
    param('id').isInt({ min: 1 }).withMessage('El id debe ser un número entero positivo')
      .custom(async value => {
        const Empleado = require('../../modelos/gestion_cliente/Empleado');
        const existe = await Empleado.findByPk(value);
        if (!existe) throw new Error('El empleado no existe');
        return true;
      })
  ],
  empleadoController.eliminarEmpleado
);

/**
 * @swagger
 * components:
 *   schemas:
 *     Empleado:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID del empleado
 *           example: 1
 *         idPersona:
 *           type: integer
 *           description: ID de la persona asociada
 *           example: 1
 *         Fecha_Registro:
 *           type: string
 *           format: date
 *           description: Fecha de registro del empleado
 *           example: "2025-07-16"
 *         Persona:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *               description: ID de la persona
 *               example: 1
 *             Pnombre:
 *               type: string
 *               description: Nombre de la persona
 *               example: Juan
 *             Papellido:
 *               type: string
 *               description: Apellido de la persona
 *               example: Pérez
 */

module.exports = router;