// modelos/programacion/Programa.js  
const { DataTypes } = require('sequelize');  
const db = require('../../configuraciones/db');  
const Empleado = require('../gestion_cliente/Empleado');  
  
const Programa = db.define('Programa', {  
  idPrograma: {  
    type: DataTypes.INTEGER,  
    primaryKey: true,  
    autoIncrement: true  
  },  
  nombre: {  
    type: DataTypes.STRING(100),  
    allowNull: false // "NOTICIAS 60 MINUTOS", "PELÍCULA MATUTINA"  
  },  
  tipoCalendario: {  
    type: DataTypes.ENUM('Lunes_Sabado', 'Domingo'),  
    allowNull: false,  
    defaultValue: 'Lunes_Sabado'  
  },  
  horaInicio: {  
    type: DataTypes.TIME,  
    allowNull: false // 7:05 para noticias  
  },  
  duracion: {  
    type: DataTypes.INTEGER, // en minutos  
    allowNull: false  
  },  
  categoria: {  
    type: DataTypes.ENUM('Noticias', 'Entretenimiento', 'Deportes', 'Cultural', 'Educativo', 'Infantil'),  
    allowNull: false  
  },  
  estado: {  
    type: DataTypes.ENUM('Activo', 'Inactivo'),  
    allowNull: false,  
    defaultValue: 'Activo'  
  },  
  idEmpleado: {  
    type: DataTypes.INTEGER,  
    allowNull: false // Productor responsable  
  },  
  fechaCreacion: {  
    type: DataTypes.DATE,  
    allowNull: false,  
    defaultValue: DataTypes.NOW  
  }  
}, {  
  tableName: 'programa',  
  timestamps: false  
});  
  
// Relaciones  
Programa.belongsTo(Empleado, { foreignKey: 'idEmpleado', as: 'productor' });  
Empleado.hasMany(Programa, { foreignKey: 'idEmpleado', sourceKey: 'idEmpleado' });  
  
module.exports = Programa;