const { validationResult } = require('express-validator');
const Persona = require('../../modelos/seguridad/Persona');
const { 
  reglasBasePersona, 
  reglasPersonaNatural, 
  reglasPersonaComercial,
  validarPersonaComercial,
  validarPersonaNatural,
  establecerValoresPorDefecto
} = require('../../configuraciones/validacionesPersona');

// === VALIDACIONES PERSONALIZADAS ===
const reglasCrear = [
  ...reglasBasePersona,
  ...reglasPersonaNatural
];

const reglasEditar = [
  ...reglasBasePersona,
  ...reglasPersonaNatural
];

// === CONTROLADORES ===

// Crear una persona
const crearPersona = [
  ...reglasCrear,
  validarPersonaComercial,
  validarPersonaNatural,
  async (req, res) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json({ errores: errores.array() });
    }

    try {
      // Establecer valores por defecto si no se especifican
      const personaData = establecerValoresPorDefecto(req.body);

      const persona = await Persona.create(personaData);
      res.status(201).json({ mensaje: 'Persona creada exitosamente', persona });
    } catch (error) {
      console.error(error);
      res.status(500).json({ mensaje: 'Error al crear persona', error: error.message });
    }
  }
];

// Editar una persona
const editarPersona = [
  ...reglasEditar,
  validarPersonaComercial,
  validarPersonaNatural,
  async (req, res) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json({ errores: errores.array() });
    }

    const { id } = req.params;

    try {
      const persona = await Persona.findByPk(id);
      if (!persona) return res.status(404).json({ mensaje: 'Persona no encontrada' });

      // Si se está cambiando el tipo de persona, validar que los campos requeridos estén presentes
      if (req.body.tipoPersona && req.body.tipoPersona !== persona.tipoPersona) {
        if (req.body.tipoPersona === 'comercial') {
          if (!req.body.razonSocial || !req.body.rtn || !req.body.nombreComercial) {
            return res.status(400).json({ 
              mensaje: 'Al cambiar a persona comercial, debe proporcionar razón social, RTN y nombre comercial' 
            });
          }
        } else if (req.body.tipoPersona === 'natural') {
          if (!req.body.Papellido || !req.body.DNI || !req.body.genero) {
            return res.status(400).json({ 
              mensaje: 'Al cambiar a persona natural, debe proporcionar apellido, DNI y género' 
            });
          }
        }
      }

      await persona.update(req.body);
      res.json({ mensaje: 'Persona actualizada exitosamente', persona });
    } catch (error) {
      console.error(error);
      res.status(500).json({ mensaje: 'Error al editar persona', error: error.message });
    }
  }
];

// Eliminar una persona
const eliminarPersona = async (req, res) => {
  const { id } = req.params;

  try {
    const persona = await Persona.findByPk(id);
    if (!persona) return res.status(404).json({ mensaje: 'Persona no encontrada' });

    await persona.destroy();
    res.json({ mensaje: 'Persona eliminada exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al eliminar persona', error: error.message });
  }
};

// Obtener todas las personas
const obtenerPersonas = async (req, res) => {
  try {
    const { tipoPersona, Pnombre, Papellido, razonSocial, nombreComercial } = req.query;
    const where = {};

    if (tipoPersona) where.tipoPersona = tipoPersona;
    if (Pnombre) where.Pnombre = { [require('sequelize').Op.like]: `%${Pnombre}%` };
    if (Papellido) where.Papellido = { [require('sequelize').Op.like]: `%${Papellido}%` };
    if (razonSocial) where.razonSocial = { [require('sequelize').Op.like]: `%${razonSocial}%` };
    if (nombreComercial) where.nombreComercial = { [require('sequelize').Op.like]: `%${nombreComercial}%` };

    const personas = await Persona.findAll({ where });
    res.json(personas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener personas', error: error.message });
  }
};

// Obtener persona por ID
const obtenerPersonaPorId = async (req, res) => {
  const { id } = req.params;

  try {
    const persona = await Persona.findByPk(id);
    if (!persona) return res.status(404).json({ mensaje: 'Persona no encontrada' });

    res.json(persona);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener persona', error: error.message });
  }
};

// Crear múltiples personas (para migración)
const crearMultiplesPersonas = async (req, res) => {
  try {
    const { personas } = req.body;
    
    if (!Array.isArray(personas) || personas.length === 0) {
      return res.status(400).json({ mensaje: 'Debe enviar un array de personas' });
    }

    const personasCreadas = [];
    for (const personaData of personas) {
      // Establecer valores por defecto
      const data = establecerValoresPorDefecto(personaData);
      
      const persona = await Persona.create(data);
      personasCreadas.push(persona);
    }

    res.status(201).json({ 
      mensaje: `${personasCreadas.length} personas creadas exitosamente`, 
      personas: personasCreadas 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      mensaje: 'Error al crear múltiples personas', 
      error: error.message 
    });
  }
};

// === EXPORTAR ===
module.exports = {
  crearPersona,
  editarPersona,
  eliminarPersona,
  obtenerPersonas,
  obtenerPersonaPorId,
  crearMultiplesPersonas
};