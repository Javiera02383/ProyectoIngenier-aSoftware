const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const jwt = require('jsonwebtoken');
const moment = require("moment");
const argon2 = require('argon2'); // ✅ Nuevo

const clave = 'Unah123.';
const expiracion = moment.duration(1, "days").asSeconds();
const Usuario = require('../modelos/seguridad/Usuario');

// ========================
// Función para generar el JWT
// ========================
exports.getToken = (data) => {
  return jwt.sign(data, clave, { expiresIn: expiracion });
};

// ========================
// Configuración estrategia JWT
// ========================
const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: clave,
};

exports.validarAutenticacion = passport.use(
  new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
      const usuario = await Usuario.findByPk(jwt_payload.idUsuario); // Asegúrate que `idUsuario` es la clave primaria
      if (usuario) {
        return done(null, usuario);
      } else {
        return done(null, false);
      }
    } catch (err) {
      return done(err, false);
    }
  })
);

// ========================
// Middleware para proteger rutas
// ========================
exports.verificarUsuario = (req, res, next) => {
  console.log('🔐 Verificando autenticación...');
  console.log('📋 Headers recibidos:', req.headers);
  
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err) {
      console.error('❌ Error en autenticación:', err);
      return next(err);
    }
    
    if (!user) {
      console.log('❌ Usuario no autenticado. Info:', info);
      return res.status(401).json({ mensaje: 'No autorizado - Token inválido o expirado' });
    }
    
    console.log('✅ Usuario autenticado:', {
      idUsuario: user.idUsuario,
      Nombre_Usuario: user.Nombre_Usuario
    });
    
    req.user = user;
    next();
  })(req, res, next);
};

// ========================
// Función para verificar contraseña con argon2
// ========================
exports.verificarPassword = async (passwordPlano, hashGuardado) => {
  try {
    return await argon2.verify(hashGuardado, passwordPlano);
  } catch (err) {
    console.error("Error al verificar la contraseña:", err);
    return false;
  }
};

// ========================
// Función para encriptar contraseña con argon2
// ========================
exports.hashearPassword = async (passwordPlano) => {
  try {
    return await argon2.hash(passwordPlano);
  } catch (err) {
    console.error("Error al hashear la contraseña:", err);
    throw err;
  }
};
