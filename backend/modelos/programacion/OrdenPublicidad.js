// modelos/programacion/OrdenPublicidad.js  
const { DataTypes } = require('sequelize');  
const db = require('../../configuraciones/db');  
const Cliente = require('../gestion_cliente/Cliente');  
const Empleado = require('../gestion_cliente/Empleado');  
const Factura = require('../facturacion/Factura');    

const OrdenPublicidad = db.define('OrdenPublicidad', {  
  idOrden: {  
    type: DataTypes.INTEGER,  
    primaryKey: true,  
    autoIncrement: true  
  },  
  numeroOrden: {  
    type: DataTypes.STRING(20),  
    allowNull: false,  
    unique: true  
  },  
  idCliente: {  
    type: DataTypes.INTEGER,  
    allowNull: false  
  },  
  producto: {  
    type: DataTypes.STRING(200),  
    allowNull: false // "Comidor, Cultures"  
  },  
  periodoInicio: {  
    type: DataTypes.DATEONLY,  
    allowNull: false  
  },  
  periodoFin: {  
    type: DataTypes.DATEONLY,  
    allowNull: false  
  },  
  valorSinImpuesto: {  
    type: DataTypes.DECIMAL(10, 2),  
    allowNull: false  
  },  
  impuesto: {  
    type: DataTypes.DECIMAL(10, 2),  
    allowNull: false,  
    defaultValue: 0.15 // 15% ISV  
  },  
  costoTotal: {  
    type: DataTypes.DECIMAL(10, 2),  
    allowNull: false  
  },  
  costoPeriodo: {  
    type: DataTypes.DECIMAL(10, 2),  
    allowNull: false  
  },  
  fechaAlAire: {  
    type: DataTypes.DATEONLY,  
    allowNull: true  
  },  
  estado: {  
    type: DataTypes.ENUM('Pendiente', 'Aprobada', 'En_Emision', 'Finalizada', 'Cancelada'),  
    allowNull: false,  
    defaultValue: 'Pendiente'  
  },  
  idEmpleado: {  
    type: DataTypes.INTEGER,  
    allowNull: false // Empleado que crea la orden  
  },  
  fechaCreacion: {  
    type: DataTypes.DATE,  
    allowNull: false,  
    defaultValue: DataTypes.NOW  
  },  
  archivo_pdf: {  
    type: DataTypes.STRING(255),  
    allowNull: true  
  },  
  observaciones: {  
    type: DataTypes.TEXT,  
    allowNull: true  
  }  
}, {  
  tableName: 'orden_publicidad',  
  timestamps: false  
});  
  
// Relaciones  
OrdenPublicidad.belongsTo(Cliente, { foreignKey: 'idCliente' });  
OrdenPublicidad.belongsTo(Empleado, { foreignKey: 'idEmpleado' });  
Cliente.hasMany(OrdenPublicidad, { foreignKey: 'idCliente', sourceKey: 'idCliente' });  
Empleado.hasMany(OrdenPublicidad, { foreignKey: 'idEmpleado', sourceKey: 'idEmpleado' }); 

// Relación: Una orden puede tener múltiples facturas  
OrdenPublicidad.hasMany(Factura, {   
  foreignKey: 'idOrdenPublicidad',  
  as: 'facturas'  
});  

module.exports = OrdenPublicidad;