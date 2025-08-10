const { DataTypes } = require('sequelize');
const db = require('../../configuraciones/db');
const Persona = require('../../modelos/seguridad/Persona');
const Rol = require('../../modelos/seguridad/Rol');

const Empleado = db.define('Empleado', {
  idEmpleado: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  idPersona: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'persona',
      key: 'idPersona'
    }
  },
  idRol: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'rol',
      key: 'idrol'
    }
  },
  Fecha_Registro: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'empleado',
  timestamps: false
});

// Relaciones
Empleado.belongsTo(Persona, { foreignKey: 'idPersona', as: 'persona' });
Empleado.belongsTo(Rol, { foreignKey: 'idRol', as: 'rol' });
Persona.hasOne(Empleado, { foreignKey: "idPersona", sourceKey: "idPersona" });
Rol.hasMany(Empleado, { foreignKey: "idRol", sourceKey: "idrol" });

module.exports = Empleado;
