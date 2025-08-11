// controladores/programacion/programacionController.js  
const Programa = require('../../modelos/programacion/Programa');  
const BloquePublicitario = require('../../modelos/programacion/BloquePublicitario');  
const AnuncioBloque = require('../../modelos/programacion/AnuncioBloque');  
const OrdenProgramacion = require('../../modelos/programacion/OrdenProgramacion');  
const OrdenPublicidad = require('../../modelos/programacion/OrdenPublicidad');  
const Cliente = require('../../modelos/gestion_cliente/Cliente');  
const Persona = require('../../modelos/seguridad/Persona');  
const db = require('../../configuraciones/db');
  
// Obtener todos los programas  
const obtenerProgramas = async (req, res) => {  
  try {  
    const { tipoCalendario, categoria, estado } = req.query;
    const whereClause = {};
    
    if (tipoCalendario) whereClause.tipoCalendario = tipoCalendario;
    if (categoria) whereClause.categoria = categoria;
    if (estado) whereClause.estado = estado;
    
    const programas = await Programa.findAll({  
      where: Object.keys(whereClause).length ? whereClause : { estado: 'Activo' },  
      order: [['horaInicio', 'ASC']]  
    });  
    res.json(programas);  
  } catch (error) {  
    res.status(500).json({ mensaje: 'Error al obtener programas', error: error.message });  
  }  
};  

// Obtener programas por tipo de calendario
const obtenerProgramasPorTipoCalendario = async (req, res) => {
  try {
    const { tipoCalendario } = req.params;
    
    if (!['Lunes_Sabado', 'Domingo'].includes(tipoCalendario)) {
      return res.status(400).json({ mensaje: 'Tipo de calendario inválido. Debe ser "Lunes_Sabado" o "Domingo"' });
    }
    
    const programas = await Programa.findAll({
      where: { 
        tipoCalendario,
        estado: 'Activo' 
      },
      order: [['horaInicio', 'ASC']]
    });
    
    res.json(programas);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener programas por tipo de calendario', error: error.message });
  }
};

// Obtener programación completa por tipo de calendario
const obtenerProgramacionPorTipoCalendario = async (req, res) => {
  try {
    const { tipoCalendario } = req.params;
    
    if (!['Lunes_Sabado', 'Domingo'].includes(tipoCalendario)) {
      return res.status(400).json({ mensaje: 'Tipo de calendario inválido. Debe ser "Lunes_Sabado" o "Domingo"' });
    }
    
    const programas = await Programa.findAll({  
      where: { 
        tipoCalendario,
        estado: 'Activo' 
      },  
      include: [{  
        model: BloquePublicitario,  
        include: [{  
          model: AnuncioBloque,  
          include: [{  
            model: Cliente,  
            include: [{  
              model: Persona,  
              as: 'persona',  
              attributes: ['Pnombre', 'Papellido']  
            }]  
          }]  
        }]  
      }],  
      order: [  
        ['horaInicio', 'ASC'],  
        [BloquePublicitario, 'horaBloque', 'ASC']  
      ]  
    });  

    // Formatear datos para el frontend  
    const programacionFormateada = programas.map(programa => ({  
      bloque: programa.nombre,
      idPrograma: programa.idPrograma, // Agregar ID del programa
      comerciales: programa.BloquePublicitarios?.map(bloque => ({  
        hora: bloque.horaBloque.substring(0, 5), // HH:MM format  
        idPauta: bloque.idBloque, // Agregar ID del bloque como pauta
        empresas: bloque.AnuncioBloques?.map(anuncio =>   
          anuncio.Cliente?.persona ?   
          `${anuncio.Cliente.persona.Pnombre} ${anuncio.Cliente.persona.Papellido}`.toUpperCase() :   
          'CLIENTE'  
        ) || []  
      })) || []  
    }));  

    res.json(programacionFormateada);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener programación por tipo de calendario', error: error.message });
  }
};

const crearPrograma = async (req, res) => {  
  try {  
    const { nombre, tipoCalendario, horaInicio, duracion, categoria, estado, idEmpleado } = req.body;  
      
    const nuevoPrograma = await Programa.create({  
      nombre,  
      tipoCalendario,  
      horaInicio,  
      duracion,  
      categoria,  
      estado: estado || 'Activo',  
      idEmpleado: idEmpleado || 1, // Usar empleado por defecto si no se proporciona  
      fechaCreacion: new Date()  
    });  
      
    res.status(201).json({  
      mensaje: 'Programa creado exitosamente',  
      programa: nuevoPrograma  
    });  
  } catch (error) {  
    res.status(500).json({   
      mensaje: 'Error al crear programa',   
      error: error.message   
    });  
  }  
};  
  
// Obtener bloques publicitarios  
const obtenerBloques = async (req, res) => {  
  try {  
    const { idPrograma } = req.query;  
    const whereClause = idPrograma ? { idPrograma } : {};  
      
    const bloques = await BloquePublicitario.findAll({  
      where: whereClause,  
      include: [{  
        model: Programa,  
        attributes: ['nombre', 'horaInicio', 'duracion']  
      }],  
      order: [['horaBloque', 'ASC']]  
    });  
    res.json(bloques);  
  } catch (error) {  
    res.status(500).json({ mensaje: 'Error al obtener bloques', error: error.message });  
  }  
};  
  
// Obtener anuncios por bloque  
const obtenerAnunciosPorBloque = async (req, res) => {  
  try {  
    const { idBloque } = req.params;  
      
    const anuncios = await AnuncioBloque.findAll({  
      where: { idBloque },  
      include: [{  
        model: Cliente,  
        include: [{  
          model: Persona,  
          as: 'persona',  
          attributes: ['Pnombre', 'Papellido']  
        }]  
      }]  
    });  
    res.json(anuncios);  
  } catch (error) {  
    res.status(500).json({ mensaje: 'Error al obtener anuncios', error: error.message });  
  }  
};  
  
// Obtener programación completa para el calendario  
const obtenerProgramacionCompleta = async (req, res) => {  
  try {  
    const programas = await Programa.findAll({  
      where: { estado: 'Activo' },  
      include: [{  
        model: BloquePublicitario,  
        include: [{  
          model: AnuncioBloque,  
          include: [{  
            model: Cliente,  
            include: [{  
              model: Persona,  
              as: 'persona',  
              attributes: ['Pnombre', 'Papellido']  
            }]  
          }]  
        }]  
      }],  
      order: [  
        ['horaInicio', 'ASC'],  
        [BloquePublicitario, 'horaBloque', 'ASC']  
      ]  
    });  
  
    // Formatear datos para el frontend  
    const programacionFormateada = programas.map(programa => ({  
      bloque: programa.nombre,  
      comerciales: programa.BloquePublicitarios?.map(bloque => ({  
        hora: bloque.horaBloque.substring(0, 5), // HH:MM format  
        empresas: bloque.AnuncioBloques?.map(anuncio =>   
          anuncio.Cliente?.persona ?   
          `${anuncio.Cliente.persona.Pnombre} ${anuncio.Cliente.persona.Papellido}`.toUpperCase() :   
          'CLIENTE'  
        ) || []  
      })) || []  
    }));  
  
    res.json(programacionFormateada);  
  } catch (error) {  
    res.status(500).json({ mensaje: 'Error al obtener programación completa', error: error.message });  
  }  
};  
  
// Obtener órdenes de programación  
const obtenerOrdenesProgramacion = async (req, res) => {  
  try {  
    const { idPrograma, idOrden } = req.query;  
    const whereClause = {};  
      
    if (idPrograma) whereClause.idPrograma = idPrograma;  
    if (idOrden) whereClause.idOrden = idOrden;  
  
    const ordenes = await OrdenProgramacion.findAll({  
      where: whereClause,  
      include: [  
        {  
          model: Programa,  
          attributes: ['nombre', 'horaInicio']  
        },  
        {  
          model: OrdenPublicidad,  
          include: [{  
            model: Cliente,  
            include: [{  
              model: Persona,  
              as: 'persona',  
              attributes: ['Pnombre', 'Papellido']  
            }]  
          }]  
        }  
      ]  
    });  
    res.json(ordenes);  
  } catch (error) {  
    res.status(500).json({ mensaje: 'Error al obtener órdenes de programación', error: error.message });  
  }  
};  

const crearPauta = async (req, res) => {  
  const transaction = await db.transaction();  
    
  try {  
    const { idPrograma, horaBloque, ordenBloque, duracionTotal, fechaVigencia, estado, anuncios } = req.body;  
      
    // Crear el bloque publicitario  
    const nuevoBloque = await BloquePublicitario.create({  
      idPrograma,  
      horaBloque,  
      ordenBloque,  
      duracionTotal,  
      fechaVigencia,  
      estado: estado || 'Activo'  
    }, { transaction });  
      
    // Crear los anuncios del bloque  
    const anunciosCreados = [];  
    for (let i = 0; i < anuncios.length; i++) {  
      const anuncio = anuncios[i];  
      const nuevoAnuncio = await AnuncioBloque.create({  
        idBloque: nuevoBloque.idBloque,  
        idCliente: anuncio.idCliente,  
        ordenAnuncio: i + 1,  
        duracionAnuncio: anuncio.duracionAnuncio,  
        nombreComercial: anuncio.nombreComercial,  
        estado: anuncio.estado || 'Programado'  
      }, { transaction });  
        
      anunciosCreados.push(nuevoAnuncio);  
    }  
      
    await transaction.commit();  
      
    res.status(201).json({  
      mensaje: 'Pauta publicitaria creada exitosamente',  
      bloque: nuevoBloque,  
      anuncios: anunciosCreados  
    });  
  } catch (error) {  
    await transaction.rollback();  
    res.status(500).json({   
      mensaje: 'Error al crear pauta publicitaria',   
      error: error.message   
    });  
  }  
};

// Eliminar programa
const eliminarPrograma = async (req, res) => {
  const { id } = req.params;
  const { eliminarOrdenes } = req.query; // Nuevo parámetro para eliminar en cascada
  
  try {
    console.log(`🗑️ Intentando eliminar programa ${id}`);
    
    // Verificar que el programa existe
    const programa = await Programa.findByPk(id);
    if (!programa) {
      return res.status(404).json({ mensaje: 'Programa no encontrado' });
    }

    // Verificar si tiene bloques asociados
    const bloquesAsociados = await BloquePublicitario.findAll({
      where: { idPrograma: id }
    });

    if (bloquesAsociados.length > 0) {
      return res.status(400).json({ 
        mensaje: 'No se puede eliminar el programa porque tiene bloques publicitarios asociados. Elimine primero los bloques.',
        codigo: 'PROGRAMA_CON_BLOQUES',
        bloquesAsociados: bloquesAsociados.length
      });
    }

    // Verificar si tiene órdenes de programación asociadas
    const ordenesAsociadas = await OrdenProgramacion.findAll({
      where: { idPrograma: id },
      include: [{
        model: OrdenPublicidad,
        attributes: ['idOrden', 'numeroOrden', 'fechaCreacion']
      }]
    });

    if (ordenesAsociadas.length > 0) {
      // Si se solicita eliminar en cascada
      if (eliminarOrdenes === 'true') {
        console.log(`🗑️ Eliminando programa ${id} con ${ordenesAsociadas.length} órdenes en cascada`);
        
        // Eliminar todas las órdenes de programación asociadas primero
        const ordenesEliminadas = await OrdenProgramacion.destroy({
          where: { idPrograma: id }
        });
        
        console.log(`✅ ${ordenesEliminadas} órdenes de programación eliminadas`);
        
        // Ahora eliminar el programa
        await programa.destroy();
        console.log(`✅ Programa ${id} eliminado exitosamente`);
        
        return res.json({ 
          mensaje: `Programa eliminado exitosamente junto con ${ordenesAsociadas.length} órdenes de programación`,
          ordenesEliminadas: ordenesAsociadas.length,
          programaEliminado: true
        });
      } else {
        // Informar al usuario sobre las órdenes asociadas
        return res.status(400).json({ 
          mensaje: `No se puede eliminar el programa porque tiene ${ordenesAsociadas.length} orden(es) de programación asociada(s).`,
          opciones: [
            'Eliminar programa y órdenes en cascada',
            'Cancelar eliminación',
            'Eliminar primero las órdenes manualmente'
          ],
          ordenesAsociadas: ordenesAsociadas.map(orden => ({
            id: orden.idOrdenProgramacion,
            numeroOrden: orden.OrdenPublicidad?.numeroOrden || 'Sin número',
            fechaCreacion: orden.OrdenPublicidad?.fechaCreacion || 'Sin fecha'
          })),
          codigo: 'PROGRAMA_CON_ORDENES'
        });
      }
    }

    // Si no tiene dependencias, eliminar directamente
    console.log(`🗑️ Eliminando programa ${id} sin dependencias`);
    await programa.destroy();
    console.log(`✅ Programa ${id} eliminado exitosamente`);
    
    res.json({ mensaje: 'Programa eliminado exitosamente' });
  } catch (error) {
    console.error('❌ Error eliminando programa:', error);
    res.status(500).json({ 
      mensaje: 'Error al eliminar el programa', 
      error: error.message 
    });
  }
};

// Eliminar pauta (bloque publicitario)
const eliminarPauta = async (req, res) => {
  const { id } = req.params;
  const { eliminarAnuncios } = req.query; // Nuevo parámetro para eliminar en cascada
  
  try {
    // Verificar que el bloque existe
    const bloque = await BloquePublicitario.findByPk(id);
    if (!bloque) {
      return res.status(404).json({ mensaje: 'Bloque publicitario no encontrado' });
    }

    // Verificar si tiene anuncios asociados
    const anunciosAsociados = await AnuncioBloque.findAll({
      where: { idBloque: id }
    });

    if (anunciosAsociados.length > 0) {
      // Si se solicita eliminar en cascada
      if (eliminarAnuncios === 'true') {
        console.log(`🗑️ Eliminando bloque ${id} con ${anunciosAsociados.length} anuncios en cascada`);
        
        // Eliminar todos los anuncios asociados primero
        const anunciosEliminados = await AnuncioBloque.destroy({
          where: { idBloque: id }
        });
        
        console.log(`✅ ${anunciosEliminados} anuncios eliminados`);
        
        // Luego eliminar el bloque
        await bloque.destroy();
        
        console.log(`✅ Bloque ${id} eliminado exitosamente`);
        
        return res.json({ 
          mensaje: `Bloque publicitario y ${anunciosAsociados.length} anuncios eliminados exitosamente`,
          anunciosEliminados: anunciosAsociados.length,
          bloqueEliminado: true
        });
      } else {
        // Informar al usuario sobre los anuncios asociados
        return res.status(400).json({ 
          mensaje: `No se puede eliminar el bloque porque tiene ${anunciosAsociados.length} anuncio(s) asociado(s).`,
          opciones: [
            'Eliminar solo el bloque (los anuncios quedarán huérfanos)',
            'Eliminar bloque y anuncios en cascada',
            'Eliminar primero los anuncios manualmente'
          ],
          anunciosAsociados: anunciosAsociados.map(anuncio => ({
            id: anuncio.idAnuncioBloque,
            nombre: anuncio.nombreComercial || 'Sin nombre',
            cliente: anuncio.idCliente
          })),
          codigo: 'BLOQUE_CON_ANUNCIOS'
        });
      }
    }

    // Si no tiene anuncios, eliminar directamente
    console.log(`🗑️ Eliminando bloque ${id} sin anuncios`);
    await bloque.destroy();
    console.log(`✅ Bloque ${id} eliminado exitosamente`);
    
    res.json({ mensaje: 'Bloque publicitario eliminado exitosamente' });
  } catch (error) {
    console.error('Error eliminando bloque:', error);
    res.status(500).json({ 
      mensaje: 'Error al eliminar el bloque publicitario', 
      error: error.message 
    });
  }
};

// Eliminar anuncio individual
const eliminarAnuncio = async (req, res) => {
  const { id } = req.params;
  
  try {
    // Verificar que el anuncio existe
    const anuncio = await AnuncioBloque.findByPk(id);
    if (!anuncio) {
      return res.status(404).json({ mensaje: 'Anuncio no encontrado' });
    }

    // Eliminar el anuncio
    await anuncio.destroy();
    
    res.json({ mensaje: 'Anuncio eliminado exitosamente' });
  } catch (error) {
    console.error('Error eliminando anuncio:', error);
    res.status(500).json({ 
      mensaje: 'Error al eliminar el anuncio', 
      error: error.message 
    });
  }
};

module.exports = {  
  obtenerProgramas,  
  obtenerProgramasPorTipoCalendario,
  obtenerProgramacionPorTipoCalendario,
  obtenerBloques,  
  obtenerAnunciosPorBloque,  
  obtenerProgramacionCompleta,  
  obtenerOrdenesProgramacion,
  crearPrograma,
  crearPauta,
  eliminarPrograma,
  eliminarPauta,
  eliminarAnuncio
};