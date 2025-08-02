// modelos/inventario/Proveedor.js  
const { DataTypes } = require('sequelize');  
const db = require('../../configuraciones/db');  
const Persona = require('../../modelos/seguridad/Persona');
  
const Proveedor = db.define('Proveedor', {  
  idProveedor: {  
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
  codigoProveedor: {  
    type: DataTypes.STRING(45),  
    allowNull: true,  
    unique: true  
  },  
  tipoProveedor: {  
    type: DataTypes.ENUM('Nacional', 'Internacional'),  
    allowNull: false,  
    defaultValue: 'Nacional'  
  },  
  estado: {  
    type: DataTypes.ENUM('Activo', 'Inactivo'),  
    allowNull: false,  
    defaultValue: 'Activo'  
  },  
  fechaRegistro: {  
    type: DataTypes.DATE,  
    allowNull: false,  
    defaultValue: DataTypes.NOW  
  }  
}, {  
  tableName: 'proveedor',  
  timestamps: false  
});  
  
// Relaciones  
Proveedor.belongsTo(Persona, { foreignKey: 'idPersona', as: 'persona' });    
Persona.hasOne(Proveedor, {foreignKey: "idPersona", sourceKey:"idPersona"})
  
module.exports = Proveedor;