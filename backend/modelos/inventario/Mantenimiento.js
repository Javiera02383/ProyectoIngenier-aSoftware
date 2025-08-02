// modelos/inventario/Mantenimiento.js  
const { DataTypes } = require('sequelize');  
const db = require('../../configuraciones/db');  
const InventarioModel = require('../../modelos/inventario/Inventario');
const Movimiento = require('../../modelos/inventario/Movimiento');

const Mantenimiento = db.define('Mantenimiento', {  
  idMantenimiento: {  
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
  descripcionMantenimiento: {  
    type: DataTypes.TEXT,  
    allowNull: false  
  },  
  costoMantenimiento: {  
    type: DataTypes.DECIMAL(10, 2),  
    allowNull: true  
  },  
  fechaInicio: {  
    type: DataTypes.DATEONLY,  
    allowNull: false  
  },  
  fechaFin: {  
    type: DataTypes.DATEONLY,  
    allowNull: true  
  }, 
  idMovimiento: {  
  type: DataTypes.INTEGER,  
  allowNull: true,  
  references: {  
    model: 'movimiento',  
    key: 'idMovimiento'  
    }  
  }, 
  nombreImagen: {  
    type: DataTypes.STRING(255),  
    allowNull: true  
  }  
}, {  
  tableName: 'mantenimiento',  
  timestamps: false  
});  
  
// Relaciones  
Mantenimiento.belongsTo(InventarioModel, { foreignKey: 'idInventario' });  
InventarioModel.hasMany(Mantenimiento, { foreignKey: 'idInventario' });  

Mantenimiento.belongsTo(Movimiento, { foreignKey: 'idMovimiento' });  
Movimiento.hasOne(Mantenimiento, { foreignKey: 'idMovimiento' });
  
module.exports = Mantenimiento;