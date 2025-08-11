// rutas/programacion/ordenProgramacionRutas.js
const express = require('express');  
const router = express.Router();  
const passport = require('passport');
const {
  crearPauta,
  obtenerPautasPorOrden,
  obtenerPautaPorId,
  actualizarPauta,
  eliminarPauta,
  cambiarEstadoPauta
} = require('../../controladores/programacion/ordenProgramacionController');

// Middleware de autenticación
const autenticar = passport.authenticate('jwt', { session: false });

// Rutas para pautas de programación
router.post('/pautas', autenticar, crearPauta);
router.get('/orden/:idOrden/pautas', autenticar, obtenerPautasPorOrden);
router.get('/pautas/:id', autenticar, obtenerPautaPorId);
router.put('/pautas/:id', autenticar, actualizarPauta);
router.delete('/pautas/:id', autenticar, eliminarPauta);
router.patch('/pautas/:id/estado', autenticar, cambiarEstadoPauta);
  
module.exports = router;