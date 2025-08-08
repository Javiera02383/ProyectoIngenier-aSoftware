// rutas/programacion/programacionRutas.js  
const express = require('express');  
const router = express.Router();  
const {  
  obtenerProgramas,  
  obtenerBloques,  
  obtenerAnunciosPorBloque,  
  obtenerProgramacionCompleta,  
  obtenerOrdenesProgramacion  
} = require('../../controladores/programacion/programacionController');  
  
// Rutas para programación  
router.get('/programa', obtenerProgramas);  
router.get('/bloques', obtenerBloques);  
router.get('/anuncios/:idBloque', obtenerAnunciosPorBloque);  
router.get('/completa', obtenerProgramacionCompleta);  
router.get('/orden-programacion', obtenerOrdenesProgramacion);  
  
module.exports = router;