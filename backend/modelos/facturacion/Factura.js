const { DataTypes } = require('sequelize');  
const db = require('../../configuraciones/db');  
const Cliente = require("../../modelos/gestion_cliente/Cliente")  
const Empleado = require("../../modelos/gestion_cliente/Empleado")  
const FormaPago = require('../../modelos/facturacion/FormaPago');  
// NO importar OrdenPublicidad aquí para evitar dependencia circular  
  
const Factura = db.define('Factura', {  
  idFactura: {  
    type: DataTypes.INTEGER,  
    primaryKey: true,  
    allowNull: true  
  },  
  Fecha: {  
    type: DataTypes.DATE,  
    allowNull: true  
  },  
  Total_Facturado: {  
    type: DataTypes.DOUBLE,  
    allowNull: true  
  },  
  Tipo_documento: {  
    type: DataTypes.STRING(45),  
    allowNull: true  
  },  
  // Campos específicos para TV    
  productoCliente: {    
    type: DataTypes.STRING(100),    
    allowNull: true    
  },    
  mencion: {    
    type: DataTypes.STRING(100),    
    allowNull: true    
  },    
  periodoInicio: {    
    type: DataTypes.DATE,    
    allowNull: true    
  },    
  periodoFin: {    
    type: DataTypes.DATE,    
    allowNull: true    
  },    
  tipoServicio: {    
    type: DataTypes.ENUM('spot', 'programa', 'contrato'),    
    allowNull: true    
  },    
  agencia: {    
    type: DataTypes.STRING(100),    
    allowNull: true    
  },  
  ordenNo: {      
    type: DataTypes.STRING(20), // Cambiar a STRING para almacenar numeroOrden  
    allowNull: true    
  },    
  idOrdenPublicidad: {    
    type: DataTypes.INTEGER,    
    allowNull: true,    
    references: {    
      model: 'orden_publicidad',    
      key: 'idOrden'    
    }    
  },  
  ordenCompraExenta: {    
    type: DataTypes.STRING(50),    
    allowNull: true    
  },    
  numeroRegistroSAG: {    
    type: DataTypes.STRING(50),    
    allowNull: true    
  },    
  constanciaExonerado: {    
    type: DataTypes.STRING(50),    
    allowNull: true    
  },   
  idCliente: {  
    type: DataTypes.INTEGER,  
    allowNull: false  
  },  
  idFormaPago: {  
    type: DataTypes.INTEGER,  
    allowNull: false  
  },  
  idEmpleado: {  
    type: DataTypes.INTEGER,  
    allowNull: false  
  },  
  archivo_pdf: {  
    type: DataTypes.STRING,  
    allowNull: true  
  },  
  estadoFactura: {    
    type: DataTypes.ENUM('activa', 'anulada', 'cobrada', 'pendiente'),    
    defaultValue: 'activa'    
  }  
}, {  
  tableName: 'factura',  
  timestamps: false  
});  
  
// Relaciones SOLO con Cliente, FormaPago y Empleado  
Factura.belongsTo(Cliente, { foreignKey: 'idCliente' });  
Factura.belongsTo(FormaPago, { foreignKey: 'idFormaPago' });  
Factura.belongsTo(Empleado, { foreignKey: 'idEmpleado' });  
  
Cliente.hasMany(Factura, { foreignKey: 'idCliente', sourceKey: 'idCliente'});  
FormaPago.hasMany(Factura, { foreignKey: 'idFormaPago', sourceKey: 'idFormaPago'});  
Empleado.hasMany(Factura, { foreignKey: 'idEmpleado', sourceKey: 'idEmpleado'});  
  
module.exports = Factura;
