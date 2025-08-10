const express = require('express');
const router = express.Router();
const personaController = require('../../controladores/seguridad/personaController');
/**
 * @swagger
 * tags:
 *   name: Persona
 *   description: Rutas para gestión de personas
 */

/**
 * @swagger
 * /personas/persona:
 *   post:
 *     summary: Crear una nueva persona
 *     tags: [Persona]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - Pnombre
 *               - Papellido
 *               - DNI
 *               - genero
 *             properties:
 *               Pnombre:
 *                 type: string
 *                 example: Juan
 *               Snombre:
 *                 type: string
 *                 example: Carlos
 *               Papellido:
 *                 type: string
 *                 example: Pérez
 *               Sapellido:
 *                 type: string
 *                 example: Gómez
 *               Direccion:
 *                 type: string
 *                 example: Calle principal, Tegucigalpa
 *               DNI:
 *                 type: string
 *                 example: 08011999123453
 *               correo:
 *                 type: string
 *                 example: juan.perez@email.com
 *               fechaNacimiento:
 *                 type: string
 *                 format: date
 *                 example: 1999-01-01
 *               genero:
 *                 type: string
 *                 enum: [M, F]
 *                 example: M
 *     responses:
 *       201:
 *         description: Persona creada exitosamente
 *       400:
 *         description: Error en los datos enviados
 *       500:
 *         description: Error interno del servidor
 */

/**
 * @swagger
 * /personas/persona/{id}:
 *   put:
 *     summary: Editar una persona por ID
 *     tags: [Persona]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la persona a editar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Persona'
 *     responses:
 *       200:
 *         description: Persona actualizada exitosamente
 *       404:
 *         description: Persona no encontrada
 *       500:
 *         description: Error del servidor
 */

/**
 * @swagger
 * /personas/persona/{id}:
 *   delete:
 *     summary: Eliminar una persona por ID
 *     tags: [Persona]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la persona a eliminar
 *     responses:
 *       200:
 *         description: Persona eliminada exitosamente
 *       404:
 *         description: Persona no encontrada
 *       500:
 *         description: Error del servidor
 */

/**
 * @swagger
 * /personas/personas:
 *   post:
 *     summary: Crear múltiples personas
 *     tags: [Persona]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               $ref: '#/components/schemas/Persona'
 *     responses:
 *       201:
 *         description: Personas creadas exitosamente
 *       400:
 *         description: Datos inválidos
 *       500:
 *         description: Error del servidor
 */

/**
 * @swagger
 * /personas/persona:
 *   get:
 *     summary: Obtener todas las personas
 *     tags: [Persona]
 *     responses:
 *       200:
 *         description: Lista de personas obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Persona'
 *             example:
 *               - id: 1
 *                 Pnombre: Juan
 *                 Snombre: Carlos
 *                 Papellido: Pérez
 *                 Sapellido: Gómez
 *                 Direccion: Calle principal, Tegucigalpa
 *                 DNI: 08011999123453
 *                 correo: juan.perez@email.com
 *                 fechaNacimiento: 1999-01-01
 *                 genero: M
 *               - id: 2
 *                 Pnombre: Ana
 *                 Snombre: María
 *                 Papellido: López
 *                 Sapellido: Rodríguez
 *                 Direccion: Barrio Centro, Comayagua
 *                 DNI: 08011999000013
 *                 correo: ana.lopez@email.com
 *                 fechaNacimiento: 1998-05-10
 *                 genero: F
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Persona:
 *       type: object
 *       required:
 *         - Pnombre
 *         - Papellido
 *         - DNI
 *         - genero
 *       properties:
 *         Pnombre:
 *           type: string
 *           example: Ana
 *         Snombre:
 *           type: string
 *           example: María
 *         Papellido:
 *           type: string
 *           example: López
 *         Sapellido:
 *           type: string
 *           example: Rodríguez
 *         Direccion:
 *           type: string
 *           example: Barrio Centro, Comayagua
 *         DNI:
 *           type: string
 *           example: 08011999000013
 *         correo:
 *           type: string
 *           example: ana.lopez@email.com
 *         fechaNacimiento:
 *           type: string
 *           format: date
 *           example: 1998-05-10
 *         genero:
 *           type: string
 *           enum: [M, F]
 *           example: F
 */


// Ruta: Crear una persona
router.post('/persona', personaController.crearPersona);

// Ruta: Editar una persona
router.put('/persona/:id', personaController.editarPersona);

// Ruta: Eliminar una persona
router.delete('/persona/:id', personaController.eliminarPersona);

// Ruta: Crear varias personas
router.post('/personas', personaController.crearMultiplesPersonas);

// Ruta: Obtener todas las personas
router.get('/persona', personaController.obtenerPersonas);

// Ruta: Obtener una persona por ID
router.get('/persona/:id', personaController.obtenerPersonaPorId);

module.exports = router;
