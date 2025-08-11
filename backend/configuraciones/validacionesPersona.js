// Configuración centralizada para validaciones de personas
// Este archivo contiene las reglas de validación y funciones auxiliares
// para manejar tanto personas naturales como comerciales

const { body } = require('express-validator');

// === REGLAS DE VALIDACIÓN BASE ===
const reglasBasePersona = [
  body('Pnombre')
    .notEmpty().withMessage('El primer nombre es obligatorio')
    .isAlpha('es-ES', { ignore: ' ' }).withMessage('El primer nombre solo puede contener letras'),

  body('Snombre')
    .optional()
    .isAlpha('es-ES', { ignore: ' ' }).withMessage('El segundo nombre solo puede contener letras'),

  body('Papellido')
    .optional()
    .isAlpha('es-ES', { ignore: ' ' }).withMessage('El primer apellido solo puede contener letras'),

  body('Sapellido')
    .optional()
    .isAlpha('es-ES', { ignore: ' ' }).withMessage('El segundo apellido solo puede contener letras'),

  body('Direccion')
    .optional()
    .isLength({ max: 45 }).withMessage('La dirección no puede exceder 45 caracteres'),

  body('correo')
    .optional()
    .isEmail().withMessage('El correo no tiene un formato válido'),

  body('fechaNacimiento')
    .optional()
    .isISO8601().withMessage('La fecha de nacimiento debe tener un formato válido'),

  body('tipoPersona')
    .optional()
    .isIn(['natural', 'comercial']).withMessage('El tipo de persona debe ser natural o comercial'),

  // Campos específicos para personas comerciales
  body('razonSocial')
    .optional()
    .isLength({ max: 100 }).withMessage('La razón social no puede exceder 100 caracteres'),

  body('rtn')
    .optional()
    .isLength({ max: 20 }).withMessage('El RTN no puede exceder 20 caracteres'),

  body('nombreComercial')
    .optional()
    .isLength({ max: 100 }).withMessage('El nombre comercial no puede exceder 100 caracteres')
];

// === REGLAS PARA PERSONAS NATURALES ===
const reglasPersonaNatural = [
  body('Papellido')
    .notEmpty().withMessage('El primer apellido es obligatorio para personas naturales')
    .isAlpha('es-ES', { ignore: ' ' }).withMessage('El primer apellido solo puede contener letras'),

  body('DNI')
    .notEmpty().withMessage('El DNI es obligatorio para personas naturales')
    .isLength({ min: 13, max: 13 }).withMessage('El DNI debe tener exactamente 13 caracteres'),

  body('genero')
    .notEmpty().withMessage('El género es obligatorio para personas naturales')
    .isIn(['M', 'F']).withMessage('El género debe ser M o F')
];

// === REGLAS PARA PERSONAS COMERCIALES ===
const reglasPersonaComercial = [
  body('razonSocial')
    .notEmpty().withMessage('La razón social es obligatoria para personas comerciales')
    .isLength({ max: 100 }).withMessage('La razón social no puede exceder 100 caracteres'),

  body('rtn')
    .notEmpty().withMessage('El RTN es obligatorio para personas comerciales')
    .isLength({ max: 20 }).withMessage('El RTN no puede exceder 20 caracteres'),

  body('nombreComercial')
    .notEmpty().withMessage('El nombre comercial es obligatorio para personas comerciales')
    .isLength({ max: 100 }).withMessage('El nombre comercial no puede exceder 100 caracteres')
];

// === FUNCIONES AUXILIARES ===

// Función para obtener el nombre completo de una persona
const obtenerNombreCompleto = (persona) => {
  if (!persona) return 'N/A';
  
  if (persona.tipoPersona === 'comercial') {
    return persona.razonSocial || persona.nombreComercial || 'N/A';
  } else {
    return `${persona.Pnombre} ${persona.Snombre || ''} ${persona.Papellido} ${persona.Sapellido || ''}`.trim();
  }
};

// Función para obtener la identificación de una persona
const obtenerIdentificacion = (persona) => {
  if (!persona) return 'N/A';
  
  if (persona.tipoPersona === 'comercial') {
    return persona.rtn || 'N/A';
  } else {
    return persona.DNI || 'N/A';
  }
};

// Función para obtener la etiqueta de identificación
const obtenerEtiquetaIdentificacion = (persona) => {
  if (!persona) return 'DNI:';
  
  return persona.tipoPersona === 'comercial' ? 'RTN:' : 'DNI:';
};

// Función para validar que una persona tenga los campos requeridos según su tipo
const validarCamposRequeridos = (persona) => {
  if (!persona) return { valido: false, mensaje: 'Persona no encontrada' };
  
  if (persona.tipoPersona === 'comercial') {
    if (!persona.razonSocial) {
      return { valido: false, mensaje: 'La razón social es obligatoria para personas comerciales' };
    }
    if (!persona.rtn) {
      return { valido: false, mensaje: 'El RTN es obligatorio para personas comerciales' };
    }
    if (!persona.nombreComercial) {
      return { valido: false, mensaje: 'El nombre comercial es obligatorio para personas comerciales' };
    }
  } else {
    if (!persona.Papellido) {
      return { valido: false, mensaje: 'El primer apellido es obligatorio para personas naturales' };
    }
    if (!persona.DNI) {
      return { valido: false, mensaje: 'El DNI es obligatorio para personas naturales' };
    }
    if (!persona.genero) {
      return { valido: false, mensaje: 'El género es obligatorio para personas naturales' };
    }
  }
  
  return { valido: true };
};

// Función para establecer valores por defecto en datos de persona
const establecerValoresPorDefecto = (personaData) => {
  return {
    ...personaData,
    tipoPersona: personaData.tipoPersona || 'natural',
    genero: personaData.genero || 'M'
  };
};

// === MIDDLEWARE DE VALIDACIÓN CONDICIONAL ===

// Middleware para validar persona comercial
const validarPersonaComercial = (req, res, next) => {
  const { tipoPersona, razonSocial, rtn, nombreComercial } = req.body;
  
  if (tipoPersona === 'comercial') {
    if (!razonSocial) {
      return res.status(400).json({ 
        mensaje: 'La razón social es obligatoria para personas comerciales' 
      });
    }
    if (!rtn) {
      return res.status(400).json({ 
        mensaje: 'El RTN es obligatorio para personas comerciales' 
      });
    }
    if (!nombreComercial) {
      return res.status(400).json({ 
        mensaje: 'El nombre comercial es obligatorio para personas comerciales' 
      });
    }
  }
  
  next();
};

// Middleware para validar persona natural
const validarPersonaNatural = (req, res, next) => {
  const { tipoPersona, Papellido, DNI, genero } = req.body;
  
  if (tipoPersona === 'natural' || !tipoPersona) {
    if (!Papellido) {
      return res.status(400).json({ 
        mensaje: 'El primer apellido es obligatorio para personas naturales' 
      });
    }
    if (!DNI) {
      return res.status(400).json({ 
        mensaje: 'El DNI es obligatorio para personas naturales' 
      });
    }
    if (!genero) {
      return res.status(400).json({ 
        mensaje: 'El género es obligatorio para personas naturales' 
      });
    }
  }
  
  next();
};

// === EXPORTAR ===
module.exports = {
  // Reglas de validación
  reglasBasePersona,
  reglasPersonaNatural,
  reglasPersonaComercial,
  
  // Funciones auxiliares
  obtenerNombreCompleto,
  obtenerIdentificacion,
  obtenerEtiquetaIdentificacion,
  validarCamposRequeridos,
  establecerValoresPorDefecto,
  
  // Middleware
  validarPersonaComercial,
  validarPersonaNatural
};
