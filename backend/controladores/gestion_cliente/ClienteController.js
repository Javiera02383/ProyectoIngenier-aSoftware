const { body, validationResult } = require('express-validator');
const Cliente = require('../../modelos/gestion_cliente/Cliente');
const Persona = require('../../modelos/seguridad/Persona');
const { Op } = require('sequelize');

// === CONTROLADORES ===

// Crear cliente con persona
const enviarCorreo = require('../../configuraciones/correo').EnviarCorreo;
const crearCliente = async (req, res) => {
  try {
    console.log('Datos recibidos en crearCliente:', req.body);
    const { personaData, ...clienteData } = req.body;
    let personaId = clienteData.idPersona;

    console.log('personaData:', personaData);
    console.log('clienteData:', clienteData);
    console.log('personaId:', personaId);

    // Si no se proporciona idPersona, crear nueva persona
    if (!personaId) {
      // Validaciones específicas según tipo de persona
      if (personaData.tipoPersona === 'natural') {
        if (!personaData.Pnombre) {
          return res.status(400).json({ mensaje: 'El primer nombre es requerido para personas naturales' });
        }
        if (!personaData.Papellido) {
          return res.status(400).json({ mensaje: 'El primer apellido es requerido para personas naturales' });
        }
        if (!personaData.DNI) {
          return res.status(400).json({ mensaje: 'El DNI es requerido para personas naturales' });
        }
      } else if (personaData.tipoPersona === 'comercial') {
        if (!personaData.razonSocial) {
          return res.status(400).json({ mensaje: 'La razón social es requerida para personas comerciales' });
        }
        if (!personaData.rtn) {
          return res.status(400).json({ mensaje: 'El RTN es requerido para personas comerciales' });
        }
        if (!personaData.nombreComercial) {
          return res.status(400).json({ mensaje: 'El nombre comercial es requerido para personas comerciales' });
        }
      }

      // Crear nueva persona
      const nuevaPersona = await Persona.create(personaData);
      personaId = nuevaPersona.idPersona;
    }

    // Crear cliente
    const cliente = await Cliente.create({
      ...clienteData,
      idPersona: personaId,
      fechaRegistro: clienteData.fechaRegistro || new Date()
    });

    // Buscar la persona para enviar correo
    const persona = await Persona.findByPk(personaId);
    if (persona && persona.correo) {
      const adminCorreo = process.env.correousuario || 'admin@canal40.com';
      const nombreMostrar = personaData.tipoPersona === 'natural' 
        ? `${persona.Pnombre} ${persona.Papellido}`
        : persona.razonSocial || persona.nombreComercial;

      await enviarCorreo({
        para: persona.correo,
        asunto: '¡Bienvenido a Canal 40!',
        descripcion: `Hola ${nombreMostrar}, su registro como cliente fue exitoso por el administrador (${adminCorreo}).`,
        html: `
          <div style="font-family: Arial, sans-serif; background: #f7f7f7; padding: 30px;">
            <div style="max-width: 500px; margin: auto; background: #fff; border-radius: 8px; box-shadow: 0 2px 8px #ccc; padding: 24px;">
              <h2 style="color: #2e7d32; text-align: center;">¡Bienvenido a Canal 40!</h2>
              <p style="font-size: 18px; color: #333;">Hola <b>${nombreMostrar}</b>,</p>
              <p style="font-size: 16px; color: #333;">Te informamos que has sido registrado exitosamente como cliente por el administrador.</p>
              <p style="font-size: 16px; color: #333;">Si tienes dudas, puedes contactarnos respondiendo a este correo.</p>
              <hr style="margin: 24px 0;">
              <p style="font-size: 14px; color: #888;">Correo del administrador: <b>${adminCorreo}</b></p>
              <p style="font-size: 14px; color: #888; text-align: center;">Gracias por confiar en nosotros.<br>Canal 40</p>
            </div>
          </div>
        `
      });
    }

    // Obtener cliente con datos de persona para respuesta
    const clienteCompleto = await Cliente.findByPk(cliente.idCliente, {
      include: [{ model: Persona, as: 'persona' }]
    });

    res.status(201).json({ 
      mensaje: 'Cliente creado exitosamente', 
      cliente: clienteCompleto 
    });
  } catch (error) {
    console.error('Error al crear cliente:', error);
    res.status(500).json({ 
      mensaje: 'Error al crear cliente', 
      error: error.message 
    });
  }
};

// Obtener todos los clientes sin filtros  
const obtenerTodosLosClientes = async (req, res) => {  
  try {  
    const clientes = await Cliente.findAll({  
      include: [{  
        model: Persona,  
        as: 'persona'  
      }]  
    });  
    res.json(clientes);  
  } catch (error) {  
    res.status(500).json({ mensaje: 'Error al obtener todos los clientes', error: error.message });  
  }  
};  
  
// Obtener todos los clientes con búsqueda por nombre/apellido de Persona
const obtenerClientes = async (req, res) => {
  try {
    const { Pnombre, Papellido, tipoPersona, razonSocial, nombreComercial } = req.query;
    const wherePersona = {};
    
    if (Pnombre) wherePersona.Pnombre = { [Op.like]: `%${Pnombre}%` };
    if (Papellido) wherePersona.Papellido = { [Op.like]: `%${Papellido}%` };
    if (tipoPersona) wherePersona.tipoPersona = tipoPersona;
    if (razonSocial) wherePersona.razonSocial = { [Op.like]: `%${razonSocial}%` };
    if (nombreComercial) wherePersona.nombreComercial = { [Op.like]: `%${nombreComercial}%` };

    const clientes = await Cliente.findAll({
      include: [{
        model: Persona,
        as: 'persona',
        where: Object.keys(wherePersona).length ? wherePersona : undefined
      }]
    });
    res.json(clientes);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener clientes', error: error.message });
  }
};

// Obtener cliente por ID, incluyendo datos de Persona
const obtenerClientePorId = async (req, res) => {
  const { id } = req.params;
  try {
    const cliente = await Cliente.findByPk(id, {
      include: [{
        model: Persona,
        as: 'persona'
      }]
    });
    if (!cliente) return res.status(404).json({ mensaje: 'Cliente no encontrado' });
    res.json(cliente);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener cliente', error: error.message });
  }
};

// Editar cliente con persona
const editarCliente = async (req, res) => {
  const { id } = req.params;
  try {
    console.log('Datos recibidos en editarCliente:', req.body);
    const { personaData, ...clienteData } = req.body;
    
    console.log('personaData:', personaData);
    console.log('clienteData:', clienteData);
    
    // Buscar cliente existente
    const cliente = await Cliente.findByPk(id, {
      include: [{ model: Persona, as: 'persona' }]
    });
    
    if (!cliente) {
      return res.status(404).json({ mensaje: 'Cliente no encontrado' });
    }

    // Actualizar datos de persona
    if (personaData && cliente.persona) {
      // Validaciones específicas según tipo de persona
      if (personaData.tipoPersona === 'natural') {
        if (!personaData.Pnombre) {
          return res.status(400).json({ mensaje: 'El primer nombre es requerido para personas naturales' });
        }
        if (!personaData.Papellido) {
          return res.status(400).json({ mensaje: 'El primer apellido es requerido para personas naturales' });
        }
        if (!personaData.DNI) {
          return res.status(400).json({ mensaje: 'El DNI es requerido para personas naturales' });
        }
      } else if (personaData.tipoPersona === 'comercial') {
        if (!personaData.razonSocial) {
          return res.status(400).json({ mensaje: 'La razón social es requerida para personas comerciales' });
        }
        if (!personaData.rtn) {
          return res.status(400).json({ mensaje: 'El RTN es requerido para personas comerciales' });
        }
        if (!personaData.nombreComercial) {
          return res.status(400).json({ mensaje: 'El nombre comercial es requerido para personas comerciales' });
        }
      }

      // Actualizar la persona
      await cliente.persona.update(personaData);
    }

    // Actualizar datos de cliente
    if (Object.keys(clienteData).length > 0) {
      await cliente.update(clienteData);
    }

    // Obtener cliente actualizado
    const clienteActualizado = await Cliente.findByPk(id, {
      include: [{ model: Persona, as: 'persona' }]
    });

    res.json({ 
      mensaje: 'Cliente actualizado exitosamente', 
      cliente: clienteActualizado 
    });
  } catch (error) {
    console.error('Error al editar cliente:', error);
    res.status(500).json({ 
      mensaje: 'Error al editar cliente', 
      error: error.message 
    });
  }
};

// Eliminar cliente
const eliminarCliente = async (req, res) => {
  const { id } = req.params;
  try {
    const cliente = await Cliente.findByPk(id);
    if (!cliente) return res.status(404).json({ mensaje: 'Cliente no encontrado' });
    await cliente.destroy();
    res.json({ mensaje: 'Cliente eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar cliente', error: error.message });
  }
};

// === EXPORTAR ===
module.exports = {
  crearCliente,
  obtenerClientes,
  obtenerClientePorId,
  editarCliente,
  obtenerTodosLosClientes,
  eliminarCliente
};