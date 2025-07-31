// modelos/inventario/InventarioModel.js
const { DataTypes } = require('sequelize');
const db = require('../../configuraciones/db');

const Empleado = require("../../modelos/gestion_cliente/Empleado");

const InventarioModel = db.define('Inventario', {
  idInventario: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  codigo: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  cantidad: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  },
  ubicacion: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  idEmpleado: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  valor: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  estado: {
    type: DataTypes.ENUM('Disponible', 'Asignado', 'En Mantenimiento', 'Baja'),
    allowNull: false
  },
  observacion: {
    type: DataTypes.STRING(100),
    allowNull: true
  }
}, {
  tableName: 'inventario',
  timestamps: false
});

// Relaciones
InventarioModel.belongsTo(Empleado, { foreignKey: 'idEmpleado' });
Empleado.hasMany(InventarioModel, { foreignKey: 'idEmpleado', sourceKey: 'idEmpleado' });

module.exports = InventarioModel;
