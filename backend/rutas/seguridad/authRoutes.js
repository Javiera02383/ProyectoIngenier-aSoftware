const express = require('express');
const { check } = require('express-validator');
const router = express.Router();
const authController = require('../../controladores/seguridad/authController');
const {verificarUsuario} = require('../../configuraciones/passport');
//prueba
// Ruta: Registro de usuario
/**
 * @swagger
 * tags:
 *   name: Autenticación
 *   description: Rutas para registrar e iniciar sesión
 */

/**
 * @swagger
 * /auth/registro:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - Nombre_Usuario
 *               - contraseña
 *               - idPersona
 *               - idrol
 *             properties:
 *               Nombre_Usuario:
 *                 type: string
 *                 example: juan123
 *               contraseña:
 *                 type: string
 *                 minLength: 6
 *                 example: password123
 *               idPersona:
 *                 type: integer
 *                 example: 1
 *               idrol:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: Usuario registrado exitosamente
 *                 usuario:
 *                   type: string
 *                   example: juan123
 *       400:
 *         description: Datos inválidos o usuario ya existe
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: El nombre de usuario ya está en uso
 *       500:
 *         description: Error interno del servidor
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Iniciar sesión de usuario
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - Nombre_Usuario
 *               - contraseña
 *             properties:
 *               Nombre_Usuario:
 *                 type: string
 *                 example: juan123
 *               contraseña:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: Inicio de sesión exitoso
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       400:
 *         description: Credenciales inválidas
 *       500:
 *         description: Error del servidor
 */
/**
 * @swagger
 * /auth/listar:
 *   get:
 *     summary: Listar todos los usuarios
 *     security:
 *      - BearerAuth: []
 *     tags: [Autenticación]
 *     responses:
 *       200:
 *         description: Lista de usuarios
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   idUsuario:
 *                     type: integer
 *                     example: 1
 *                   Nombre_Usuario:
 *                     type: string
 *                     example: juan123
 *       500:
 *         description: Error del servidor
 */

router.post(
  '/registro',
  [
    check('Nombre_Usuario')
      .notEmpty()
      .withMessage('El nombre de usuario es obligatorio'),
    check('contraseña')
      .isLength({ min: 6 })
      .withMessage('La contraseña debe tener al menos 6 caracteres')
  ],
  authController.registrar
);

// Ruta: Inicio de sesión
router.post(
  '/login',
  [
    check('Nombre_Usuario')
      .notEmpty()
      .withMessage('El nombre de usuario es obligatorio'),
    check('contraseña')
      .notEmpty()
      .withMessage('La contraseña es obligatoria')
  ],
  authController.iniciarSesion
);

// Ruta: Verificar PIN 2FA
router.post(
  '/verificar-pin',
  [
    check('Nombre_Usuario', 'El nombre de usuario es obligatorio').notEmpty(),
    check('pin', 'El PIN es obligatorio').notEmpty(),
  ],
  authController.verificarPin
);

// Ruta: Registrar Persona
router.post(
  '/registrar-persona',
  [
    check('Pnombre')
      .notEmpty()
      .withMessage('El primer nombre es obligatorio')
      .isLength({ min: 2, max: 45 })
      .withMessage('El primer nombre debe tener entre 2 y 45 caracteres'),
    check('genero')
      .isIn(['M', 'F'])
      .withMessage('El género debe ser M o F'),
    check('correo')
      .optional()
      .isEmail()
      .withMessage('El correo electrónico debe tener un formato válido'),
    check('fechaNacimiento')
      .optional()
      .isISO8601()
      .withMessage('La fecha de nacimiento debe tener un formato válido')
  ],
  authController.registrarPersona
);

router.get('/listar', verificarUsuario, authController.obtenerUsuarios);
router.get('/error', authController.error)

module.exports = router;
