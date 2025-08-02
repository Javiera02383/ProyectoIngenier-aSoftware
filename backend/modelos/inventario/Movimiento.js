// modelos/inventario/Movimiento.js  
const { DataTypes } = require('sequelize');  
const db = require('../../configuraciones/db');  
const InventarioModel = require('../../modelos/inventario/Inventario');  
const Empleado = require("../../modelos/gestion_cliente/Empleado"); 
  
const Movimiento = db.define('Movimiento', {  
  idMovimiento: {  
    type: DataTypes.INTEGER,  
    primaryKey: true,  
    autoIncrement: true  
  },  
  idInventario: {  
    type: DataTypes.INTEGER,  
    allowNull: false,  
    references: {  
      model: 'inventario',  
      key: 'idInventario'  
    }  
  },  
  tipoMovimiento: {  
    type: DataTypes.ENUM('Asignacion', 'Mantenimiento', 'Baja'),  
    allowNull: false  
  },  
  idEmpleado: {  
    type: DataTypes.INTEGER,  
    allowNull: true,  
    references: {  
      model: 'empleado',  
      key: 'idEmpleado'  
    }  
  },  
  observaciones: {  
    type: DataTypes.TEXT,  
    allowNull: true  
  },  
  fechaMovimiento: {  
    type: DataTypes.DATE,  
    allowNull: false,  
    defaultValue: DataTypes.NOW  
  }  
}, {  
  tableName: 'movimiento',  
  timestamps: false  
});  
  
// Relaciones  
Movimiento.belongsTo(InventarioModel, { foreignKey: 'idInventario' });  
Movimiento.belongsTo(Empleado, { foreignKey: 'idEmpleado' });  
InventarioModel.hasMany(Movimiento, { foreignKey: 'idInventario' });  
Empleado.hasMany(Movimiento, { foreignKey: 'idEmpleado', sourceKey: 'idEmpleado' });  

  
module.exports = Movimiento;