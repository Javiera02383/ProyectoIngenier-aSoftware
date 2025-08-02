// modelos/programacion/AnuncioBloque.js  
const { DataTypes } = require('sequelize');  
const db = require('../../configuraciones/db');  
const BloquePublicitario = require('../programacion/BloquePublicitario');  
const Cliente = require('../gestion_cliente/Cliente');  
  
const AnuncioBloque = db.define('AnuncioBloque', {  
  idAnuncioBloque: {  
    type: DataTypes.INTEGER,  
    primaryKey: true,  
    autoIncrement: true  
  },  
  idBloque: {  
    type: DataTypes.INTEGER,  
    allowNull: false  
  },  
  idCliente: {  
    type: DataTypes.INTEGER,  
    allowNull: false  
  },  
  ordenAnuncio: {  
    type: DataTypes.INTEGER,  
    allowNull: false // 1, 2, 3, etc. orden dentro del bloque  
  },  
  duracionAnuncio: {  
    type: DataTypes.INTEGER, // segundos  
    allowNull: false,  
    defaultValue: 30  
  },  
  nombreComercial: {  
    type: DataTypes.STRING(100),  
    allowNull: true // "CLARO", "SECOPV" si difiere del nombre en Persona  
  },  
  archivoAnuncio: {  
    type: DataTypes.STRING(255),  
    allowNull: true // ruta del archivo de video/audio  
  },  
  estado: {  
    type: DataTypes.ENUM('Programado', 'Emitido', 'Cancelado'),  
    allowNull: false,  
    defaultValue: 'Programado'  
  }  
}, {  
  tableName: 'anuncio_bloque',  
  timestamps: false  
});  
  
// Relaciones  
AnuncioBloque.belongsTo(BloquePublicitario, { foreignKey: 'idBloque' });  
AnuncioBloque.belongsTo(Cliente, { foreignKey: 'idCliente' });  
BloquePublicitario.hasMany(AnuncioBloque, { foreignKey: 'idBloque' });  
Cliente.hasMany(AnuncioBloque, { foreignKey: 'idCliente', sourceKey: 'idCliente' });  
  
module.exports = AnuncioBloque;