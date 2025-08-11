// rutas/programacion/programacionRutas.js  
const express = require('express');  
const router = express.Router();  
const { verificarUsuario } = require('../../configuraciones/passport');
const {  
  obtenerProgramas,  
  obtenerBloques,  
  obtenerAnunciosPorBloque,  
  obtenerProgramacionCompleta,  
  obtenerOrdenesProgramacion,
  crearPrograma,
  crearPauta,
  eliminarPrograma,
  eliminarPauta,
  eliminarAnuncio,
  obtenerProgramasPorTipoCalendario,
  obtenerProgramacionPorTipoCalendario
} = require('../../controladores/programacion/programacionController');  
  
// Rutas para programación  
router.post('/pauta', verificarUsuario, crearPauta);
router.post('/programa', verificarUsuario, crearPrograma);
router.get('/programa', obtenerProgramas);  
router.get('/programa/tipo/:tipoCalendario', obtenerProgramasPorTipoCalendario);
router.get('/programacion/tipo/:tipoCalendario', obtenerProgramacionPorTipoCalendario);
router.get('/bloques', obtenerBloques);  
router.get('/anuncios/:idBloque', obtenerAnunciosPorBloque);  
router.get('/completa', obtenerProgramacionCompleta);  
router.get('/orden-programacion', obtenerOrdenesProgramacion);  

// Rutas de eliminación
router.delete('/programa/:id', verificarUsuario, eliminarPrograma);
router.delete('/pauta/:id', verificarUsuario, eliminarPauta);
router.delete('/anuncio/:id', verificarUsuario, eliminarAnuncio);
  
module.exports = router;