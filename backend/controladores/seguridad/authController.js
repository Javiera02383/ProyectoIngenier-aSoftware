const { validationResult } = require('express-validator');
const argon2 = require('argon2');
const Usuario = require('../../modelos/seguridad/Usuario');
const { getToken } = require('../../configuraciones/passport');
const { EnviarCorreo } = require('../../configuraciones/correo');
const Persona = require('../../modelos/seguridad/Persona');
const Empleado = require('../../modelos/gestion_cliente/Empleado');
const Rol = require('../../modelos/seguridad/Rol');

// Función para generar PIN de 6 dígitos
const generarPin = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// REGISTRAR
exports.registrar = async (req, res) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }

  const { Nombre_Usuario, contraseña, idPersona, idrol } = req.body;

  try {
    const existeUsuario = await Usuario.findOne({ where: { Nombre_Usuario } });
    if (existeUsuario) {
      return res.status(400).json({ mensaje: 'El nombre de usuario ya está en uso' });
    }

    const hash = await argon2.hash(contraseña);

    const nuevoUsuario = await Usuario.create({
      Nombre_Usuario,
      contraseña: hash,
      idPersona,
      idrol
    });

    // Asegurar que toda persona con usuario tenga registro de Empleado
    await Empleado.findOrCreate({
      where: { idPersona },
      defaults: { 
        idPersona,
        idRol: idrol || null // Asignar el rol si viene en el request
      }
    });

    res.status(201).json({ mensaje: 'Usuario registrado exitosamente', usuario: Nombre_Usuario });

  } catch (error) {
    res.status(500).json({
      mensaje: 'Error en el servidor',
      error: error.message,
      detalles: error.errors || null
    });
  }
};

// INICIAR SESIÓN
exports.iniciarSesion = async (req, res) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }

  const { Nombre_Usuario, contraseña } = req.body;

  try {
    const usuario = await Usuario.findOne({ 
      where: { Nombre_Usuario },
      include: [{ model: Persona, as: 'persona' }]
    });

    if (!usuario) {
      return res.status(400).json({ mensaje: 'Usuario no encontrado' });
    }

    const contraseñaValida = await argon2.verify(usuario.contraseña, contraseña);
    if (!contraseñaValida) {
      return res.status(400).json({ mensaje: 'Contraseña incorrecta' });
    }

    // Generar token JWT directamente (sin PIN 2FA por ahora)
    const payload = {
      idUsuario: usuario.idUsuario,
      Nombre_Usuario: usuario.Nombre_Usuario
    };

    // Garantizar que exista Empleado y obtener idEmpleado
    let empleado = await Empleado.findOne({ where: { idPersona: usuario.idPersona } });
    if (!empleado && usuario.idPersona) {
      // Crear empleado con el rol del usuario si existe
      empleado = await Empleado.create({ 
        idPersona: usuario.idPersona,
        idRol: usuario.idrol || null
      });
    }

    const token = getToken(payload);

    res.json({
      mensaje: 'Inicio de sesión exitoso',
      token,
      user: {
        idUsuario: usuario.idUsuario,
        Nombre_Usuario: usuario.Nombre_Usuario,
        idPersona: usuario.idPersona,
        idEmpleado: empleado ? empleado.idEmpleado : null
      }
    });

  } catch (error) {
    res.status(500).json({ mensaje: 'Error en el servidor', error: error.message });
  }
};

// OBTENER PERFIL ACTUAL
exports.obtenerPerfil = async (req, res) => {
  try {
    const usuarioDb = await Usuario.findByPk(req.user?.idUsuario || 0, {
      include: [{ model: Persona, as: 'persona' }],
      attributes: { exclude: ['contraseña'] }
    });
    if (!usuarioDb) return res.status(404).json({ mensaje: 'Usuario no encontrado' });

    // Obtener empleado por idPersona si existe
    let empleado = null;
    if (usuarioDb.idPersona) {
      empleado = await Empleado.findOne({ 
        where: { idPersona: usuarioDb.idPersona },
        include: [{ model: Rol, as: 'rol' }]
      });
    }

    res.json({
      user: {
        idUsuario: usuarioDb.idUsuario,
        Nombre_Usuario: usuarioDb.Nombre_Usuario,
        idPersona: usuarioDb.idPersona,
        idEmpleado: empleado ? empleado.idEmpleado : null,
        persona: usuarioDb.persona || null
      },
      empleado: empleado || null
    });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener perfil', error: error.message });
  }
};

// ACTUALIZAR USUARIO (nombre de usuario y/o contraseña)
exports.actualizarUsuario = async (req, res) => {
  const { id } = req.params;
  const { Nombre_Usuario, contraseña, contraseñaActual } = req.body;
  try {
    const usuario = await Usuario.findByPk(id);
    if (!usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado' });

    // Si se va a cambiar la contraseña, validar la contraseña actual
    if (contraseña && contraseñaActual) {
      const contraseñaValida = await argon2.verify(usuario.contraseña, contraseñaActual);
      if (!contraseñaValida) {
        return res.status(400).json({ mensaje: 'La contraseña actual es incorrecta' });
      }
    }

    if (Nombre_Usuario) {
      // Verificar que el nuevo nombre de usuario no esté en uso por otro usuario
      if (Nombre_Usuario !== usuario.Nombre_Usuario) {
        const existeUsuario = await Usuario.findOne({ 
          where: { 
            Nombre_Usuario,
            idUsuario: { [require('sequelize').Op.ne]: id }
          }
        });
        if (existeUsuario) {
          return res.status(400).json({ mensaje: 'El nombre de usuario ya está en uso' });
        }
        usuario.Nombre_Usuario = Nombre_Usuario;
      }
    }
    
    if (contraseña) {
      usuario.contraseña = await argon2.hash(contraseña);
    }
    
    await usuario.save();

    res.json({ mensaje: 'Usuario actualizado correctamente', user: { idUsuario: usuario.idUsuario, Nombre_Usuario: usuario.Nombre_Usuario } });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar usuario', error: error.message });
  }
};
// Obtener todos los usuarios
exports.obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll({
      attributes: { exclude: ['contraseña'] }
    });
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener usuarios', error: error.message });
  }
};

// VERIFICAR PIN 2FA - Temporalmente deshabilitado
exports.verificarPin = async (req, res) => {
  res.status(400).json({ mensaje: 'Funcionalidad de PIN 2FA temporalmente deshabilitada' });
};

// REGISTRAR PERSONA
exports.registrarPersona = async (req, res) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }

  const { Pnombre, Snombre, Papellido, Sapellido, Direccion, DNI, correo, fechaNacimiento, genero } = req.body;

  try {
    const nuevaPersona = await Persona.create({
      Pnombre,
      Snombre,
      Papellido,
      Sapellido,
      Direccion,
      DNI,
      correo,
      fechaNacimiento,
      genero
    });

    res.status(201).json({ mensaje: 'Persona registrada exitosamente', idPersona: nuevaPersona.idPersona });

  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al registrar persona',
      error: error.message,
      detalles: error.errors || null
    });
  }
};

exports.error = (req, res) => {
  res.status(401).json({ mensaje: 'Error en la autenticación' });
};
