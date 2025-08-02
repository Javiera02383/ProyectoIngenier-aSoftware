// modelos/programacion/bloquePublicitario.js  
const { DataTypes } = require('sequelize');  
const db = require('../../configuraciones/db');  
const Programa = require('./Programa');  
  
const BloquePublicitario = db.define('BloquePublicitario', {  
  idBloque: {  
    type: DataTypes.INTEGER,  
    primaryKey: true,  
    autoIncrement: true  
  },  
  idPrograma: {  
    type: DataTypes.INTEGER,  
    allowNull: false  
  },  
  horaBloque: {  
    type: DataTypes.TIME,  
    allowNull: false // 7:30, 7:55, 8:20, etc.  
  },  
  ordenBloque: {  
    type: DataTypes.INTEGER,  
    allowNull: false // 1, 2, 3, etc. para ordenar los bloques  
  },  
  duracionTotal: {  
    type: DataTypes.INTEGER, // segundos totales del bloque  
    allowNull: false,  
    defaultValue: 120 // 2 minutos por defecto  
  },  
  fechaVigencia: {  
    type: DataTypes.DATEONLY,  
    allowNull: false // Marzo 2025  
  },  
  estado: {  
    type: DataTypes.ENUM('Activo', 'Pausado'),  
    allowNull: false,  
    defaultValue: 'Activo'  
  }  
}, {  
  tableName: 'bloque_publicitario',  
  timestamps: false  
});  
  
// Relaciones  
BloquePublicitario.belongsTo(Programa, { foreignKey: 'idPrograma' });  
Programa.hasMany(BloquePublicitario, { foreignKey: 'idPrograma' });  
  
module.exports = BloquePublicitario;