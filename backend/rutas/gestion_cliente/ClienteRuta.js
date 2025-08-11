const express = require('express');
const { body, param, validationResult } = require('express-validator');
const clienteController = require('../../controladores/gestion_cliente/ClienteController');
const router = express.Router();
const { verificarUsuario } = require('../../configuraciones/passport');

router.get('/todos-clientes', verificarUsuario, clienteController.obtenerTodosLosClientes);
/**
 * @swagger
 * /clientes/cliente:
 *   post:
 *     summary: Crear un nuevo cliente
 *     security:
 *       - BearerAuth: []
 *     tags: [Clientes]
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
 *                 description: ID de la persona asociada al cliente
 *                 example: 1
 *               fechaRegistro:
 *                 type: string
 *                 format: date
 *                 description: Fecha de registro del cliente (opcional)
 *                 example: "2025-07-16"
 *     responses:
 *       201:
 *         description: Cliente creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: Cliente creado
 *                 cliente:
 *                   $ref: '#/components/schemas/Cliente'
 *       400:
 *         description: Error de validación
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
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
 *                   example: Error al crear cliente
 *                 error:
 *                   type: string
 *                   example: Mensaje de error
 */

const validarCliente = [
  body('idPersona').isInt({ min: 1 }).withMessage('El idPersona debe ser un número entero positivo'),
  body('fechaRegistro').optional().isISO8601().withMessage('La fecha debe tener un formato válido (YYYY-MM-DD)'),
];

// Validaciones POST (crear)
router.post('/cliente',
  [
    // Validar que se envíe personaData o idPersona
    body().custom((value, { req }) => {
      if (!value.personaData && !value.idPersona) {
        throw new Error('Debe enviar personaData para crear nueva persona o idPersona para usar persona existente');
      }
      return true;
    }),
    // Validaciones para personaData cuando se crea nueva persona
    body('personaData.Pnombre')
      .if(body('personaData.tipoPersona').equals('natural'))
      .notEmpty().withMessage('El primer nombre es requerido para personas naturales'),
    body('personaData.correo')
      .if(body('personaData').exists())
      .notEmpty().withMessage('El correo es requerido')
      .isEmail().withMessage('El correo debe tener un formato válido'),
    body('personaData.tipoPersona')
      .if(body('personaData').exists())
      .isIn(['natural', 'comercial']).withMessage('El tipo de persona debe ser natural o comercial'),
    // Validaciones específicas para personas naturales
    body('personaData.Papellido')
      .if(body('personaData.tipoPersona').equals('natural'))
      .notEmpty().withMessage('El primer apellido es requerido para personas naturales'),
    body('personaData.DNI')
      .if(body('personaData.tipoPersona').equals('natural'))
      .notEmpty().withMessage('El DNI es requerido para personas naturales'),
    // Validaciones específicas para personas comerciales
    body('personaData.razonSocial')
      .if(body('personaData.tipoPersona').equals('comercial'))
      .notEmpty().withMessage('La razón social es requerida para personas comerciales'),
    body('personaData.rtn')
      .if(body('personaData.tipoPersona').equals('comercial'))
      .notEmpty().withMessage('El RTN es requerido para personas comerciales'),
    body('personaData.nombreComercial')
      .if(body('personaData.tipoPersona').equals('comercial'))
      .notEmpty().withMessage('El nombre comercial es requerido para personas comerciales'),
    // Validación para idPersona cuando se usa persona existente
    body('idPersona')
      .optional()
      .isInt({ min: 1 }).withMessage('El idPersona debe ser un número entero positivo')
      .custom(async value => {
        if (value) {
          const Persona = require('../../modelos/seguridad/Persona');
          const existe = await Persona.findByPk(value);
          if (!existe) throw new Error('La persona asociada no existe');
        }
        return true;
      }),
    body('fechaRegistro').optional().isISO8601().withMessage('La fecha debe tener un formato válido (YYYY-MM-DD)')
  ], 
  (req, res, next) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json({ errores: errores.array() });
    }
    next();
  },
  verificarUsuario,
  clienteController.crearCliente
);

/**
 * @swagger
 * /clientes/cliente:
 *   get:
 *     summary: Obtener todos los clientes con filtros opcionales
 *     security:
 *       - BearerAuth: []
 *     tags: [Clientes]
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
 *         description: Lista de clientes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Cliente'
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
 *                   example: Error al obtener clientes
 *                 error:
 *                   type: string
 *                   example: Mensaje de error
 */


const { query } = require('express-validator');

router.get('/cliente',
  [
    query('Pnombre').optional().isLength({ min: 3 }).withMessage('El nombre debe tener al menos 3 letras'),
    query('Papellido').optional().isLength({ min: 3 }).withMessage('El apellido debe tener al menos 3 letras'),
    (req, res, next) => {
      const errores = validationResult(req);
      if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() });
      }
      // Si no se envía ningún filtro, rechazar
      if (!req.query.Pnombre && !req.query.Papellido) {
        return res.status(400).json({ mensaje: 'Debe enviar al menos Pnombre o Papellido con mínimo 3 letras.' });
      }
      next();
    }
  ], verificarUsuario,
  clienteController.obtenerClientes
);

/**
 * @swagger
 * /clientes/cliente/{id}:
 *   get:
 *     summary: Obtener un cliente por ID
 *     security:
 *       - BearerAuth: []
 *     tags: [Clientes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID del cliente
 *         example: 1
 *     responses:
 *       200:
 *         description: Cliente encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cliente'
 *       404:
 *         description: Cliente no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: Cliente no encontrado
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: Error al obtener cliente
 *                 error:
 *                   type: string
 *                   example: Mensaje de error
 */

router.get('/cliente/:id',
  param('id').isInt({ min: 1 }).withMessage('El id debe ser un número entero positivo'), verificarUsuario,
  clienteController.obtenerClientePorId
);
/**
 * @swagger
 * /clientes/cliente/{id}:
 *   put:
 *     summary: Actualizar un cliente existente
 *     security:
 *       - BearerAuth: []
 *     tags: [Clientes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID del cliente
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
 *                 description: ID de la persona asociada al cliente (opcional)
 *                 example: 1
 *               fechaRegistro:
 *                 type: string
 *                 format: date
 *                 description: Fecha de registro del cliente (opcional)
 *                 example: "2025-07-16"
 *     responses:
 *       200:
 *         description: Cliente actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: Cliente actualizado
 *                 cliente:
 *                   $ref: '#/components/schemas/Cliente'
 *       400:
 *         description: Error de validación
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errores:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       msg:
 *                         type: string
 *                         example: El idPersona debe ser un número entero positivo
 *       404:
 *         description: Cliente no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: Cliente no encontrado
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: Error al editar cliente
 *                 error:
 *                   type: string
 *                   example: Mensaje de error
 */




// Validaciones PUT (editar)
router.put('/cliente/:id',
  [
    param('id').isInt({ min: 1 }).withMessage('El id debe ser un número entero positivo')
      .custom(async value => {
        const Cliente = require('../../modelos/gestion_cliente/Cliente');
        const existe = await Cliente.findByPk(value);
        if (!existe) throw new Error('El cliente no existe');
        return true;
      }),
    // Validar personaData si se envía
    body('personaData.Pnombre')
      .if(body('personaData.tipoPersona').equals('natural'))
      .optional().notEmpty().withMessage('El primer nombre no puede estar vacío para personas naturales'),
    body('personaData.correo')
      .if(body('personaData').exists())
      .optional().isEmail().withMessage('El correo debe tener un formato válido'),
    body('personaData.tipoPersona')
      .if(body('personaData').exists())
      .optional().isIn(['natural', 'comercial']).withMessage('El tipo de persona debe ser natural o comercial'),
    // Validaciones específicas para personas naturales cuando se edita
    body('personaData.Papellido')
      .if(body('personaData.tipoPersona').equals('natural'))
      .optional().notEmpty().withMessage('El primer apellido no puede estar vacío para personas naturales'),
    body('personaData.DNI')
      .if(body('personaData.tipoPersona').equals('natural'))
      .optional().notEmpty().withMessage('El DNI no puede estar vacío para personas naturales'),
    // Validaciones específicas para personas comerciales cuando se edita
    body('personaData.razonSocial')
      .if(body('personaData.tipoPersona').equals('comercial'))
      .optional().notEmpty().withMessage('La razón social no puede estar vacía para personas comerciales'),
    body('personaData.rtn')
      .if(body('personaData.tipoPersona').equals('comercial'))
      .optional().notEmpty().withMessage('El RTN no puede estar vacío para personas comerciales'),
    body('personaData.nombreComercial')
      .if(body('personaData.tipoPersona').equals('comercial'))
      .optional().notEmpty().withMessage('El nombre comercial no puede estar vacío para personas comerciales'),
    body('idPersona').optional().isInt({ min: 1 }).withMessage('El idPersona debe ser un número entero positivo')
      .custom(async value => {
        if (value) {
          const Persona = require('../../modelos/seguridad/Persona');
          const existe = await Persona.findByPk(value);
          if (!existe) throw new Error('La persona asociada no existe');
        }
        return true;
      }),
    body('fechaRegistro').optional().isISO8601().withMessage('La fecha debe tener un formato válido (YYYY-MM-DD)')
  ], 
  (req, res, next) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json({ errores: errores.array() });
    }
    next();
  },
  verificarUsuario,
  clienteController.editarCliente
);

/**
 * @swagger
 * /clientes/cliente/{id}:
 *   delete:
 *     summary: Eliminar un cliente
 *     security:
 *       - BearerAuth: []
 *     tags: [Clientes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID del cliente
 *         example: 1
 *     responses:
 *       200:
 *         description: Cliente eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: Cliente eliminado
 *       404:
 *         description: Cliente no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: Cliente no encontrado
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: Error al eliminar cliente
 *                 error:
 *                   type: string
 *                   example: Mensaje de error
 */



// Validación DELETE
router.delete('/cliente/:id',
  [
    param('id').isInt({ min: 1 }).withMessage('El id debe ser un número entero positivo')
      .custom(async value => {
        const Cliente = require('../../modelos/gestion_cliente/Cliente');
        const existe = await Cliente.findByPk(value);
        if (!existe) throw new Error('El cliente no existe');
        return true;
      })
  ], verificarUsuario,
  clienteController.eliminarCliente
);


/**
 * @swagger
 * components:
 *   schemas:
 *     Cliente:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID del cliente
 *           example: 1
 *         idPersona:
 *           type: integer
 *           description: ID de la persona asociada
 *           example: 1
 *         fechaRegistro:
 *           type: string
 *           format: date
 *           description: Fecha de registro del cliente
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