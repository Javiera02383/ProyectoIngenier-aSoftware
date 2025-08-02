// modelos/programacion/OrdenProgramacion.js  
const { DataTypes } = require('sequelize');  
const db = require('../../configuraciones/db');  
const OrdenPublicidad = require('./OrdenPublicidad');  
const Programa = require('./Programa');  
const BloquePublicitario = require('./BloquePublicitario');  
  
const OrdenProgramacion = db.define('OrdenProgramacion', {  
  idOrdenProgramacion: {  
    type: DataTypes.INTEGER,  
    primaryKey: true,  
    autoIncrement: true  
  },  
  idOrden: {  
    type: DataTypes.INTEGER,  
    allowNull: false  
  },  
  idPrograma: {  
    type: DataTypes.INTEGER,  
    allowNull: false  
  },  
  idBloque: {  
    type: DataTypes.INTEGER,  
    allowNull: false  
  },  
  cantidadSpots: {  
    type: DataTypes.INTEGER,  
    allowNull: false,  
    defaultValue: 1  
  },  
  diasEmision: {  
    type: DataTypes.STRING(100),  
    allowNull: true // "Lunes,Martes,Miércoles" o JSON  
  }  
}, {  
  tableName: 'orden_programacion',  
  timestamps: false  
});  
  
// Relaciones  
OrdenProgramacion.belongsTo(OrdenPublicidad, { foreignKey: 'idOrden' });  
OrdenProgramacion.belongsTo(Programa, { foreignKey: 'idPrograma' });  
OrdenProgramacion.belongsTo(BloquePublicitario, { foreignKey: 'idBloque' });  
  
OrdenPublicidad.hasMany(OrdenProgramacion, { foreignKey: 'idOrden' });  
Programa.hasMany(OrdenProgramacion, { foreignKey: 'idPrograma' });  
BloquePublicitario.hasMany(OrdenProgramacion, { foreignKey: 'idBloque' });  
  
module.exports = OrdenProgramacion;