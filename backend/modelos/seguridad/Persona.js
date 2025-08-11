const { DataTypes } = require('sequelize');
const db = require('../../configuraciones/db'); // Ajusta según tu estructura de proyecto

const Persona = db.define('Persona', {
  idPersona: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  Pnombre: {
    type: DataTypes.STRING(45),
    allowNull: true // Cambiado a true para permitir personas comerciales sin nombre
  },
  Snombre: {
    type: DataTypes.STRING(45),
    allowNull: true
  },
  Papellido: {
    type: DataTypes.STRING(45),
    allowNull: true
  },
  Sapellido: {
    type: DataTypes.STRING(45),
    allowNull: true
  },
  Direccion: {
    type: DataTypes.STRING(45),
    allowNull: true
  },
  DNI: {
    type: DataTypes.STRING(45),
    allowNull: true
  },
  correo: {
    type: DataTypes.STRING(45),
    allowNull: true
  },
  fechaNacimiento: {
    type: DataTypes.DATE,
    allowNull: true
  },
  genero: {
    type: DataTypes.STRING(1),
    allowNull: false,
    defaultValue: 'M'
  },
  tipoPersona: {
    type: DataTypes.ENUM('natural', 'comercial'),
    allowNull: false,
    defaultValue: 'natural'
  },
  // Campos específicos para personas comerciales
  razonSocial: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  rtn: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  nombreComercial: {
    type: DataTypes.STRING(100),
    allowNull: true
  }
}, {
  tableName: 'persona',
  timestamps: false
});

module.exports = Persona;
