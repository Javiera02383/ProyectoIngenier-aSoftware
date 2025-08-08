// controladores/programacion/programacionController.js  
const Programa = require('../../modelos/programacion/Programa');  
const BloquePublicitario = require('../../modelos/programacion/BloquePublicitario');  
const AnuncioBloque = require('../../modelos/programacion/AnuncioBloque');  
const OrdenProgramacion = require('../../modelos/programacion/OrdenProgramacion');  
const OrdenPublicidad = require('../../modelos/programacion/OrdenPublicidad');  
const Cliente = require('../../modelos/gestion_cliente/Cliente');  
const Persona = require('../../modelos/seguridad/Persona');  
  
// Obtener todos los programas  
const obtenerProgramas = async (req, res) => {  
  try {  
    const programas = await Programa.findAll({  
      where: { estado: 'Activo' },  
      order: [['horaInicio', 'ASC']]  
    });  
    res.json(programas);  
  } catch (error) {  
    res.status(500).json({ mensaje: 'Error al obtener programas', error: error.message });  
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
  
module.exports = {  
  obtenerProgramas,  
  obtenerBloques,  
  obtenerAnunciosPorBloque,  
  obtenerProgramacionCompleta,  
  obtenerOrdenesProgramacion  
};