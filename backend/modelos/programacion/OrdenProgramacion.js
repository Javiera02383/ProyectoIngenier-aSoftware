// modelos/programacion/OrdenProgramacion.js  
const { DataTypes } = require('sequelize');  
const db = require('../../configuraciones/db');  

const OrdenProgramacion = db.define('OrdenProgramacion', {  
  idOrdenProgramacion: {  
    type: DataTypes.INTEGER,  
    primaryKey: true,  
    autoIncrement: true  
  },  
  idOrden: {  
    type: DataTypes.INTEGER,  
    allowNull: false,
    references: {
      model: 'orden_publicidad',
      key: 'idOrden'
    }
  },  
  idPrograma: {  
    type: DataTypes.INTEGER,  
    allowNull: false,
    references: {
      model: 'programa',
      key: 'idPrograma'
    }
  },  
  duracionPauta: {
    type: DataTypes.INTEGER, // en minutos
    allowNull: false,
    defaultValue: 30
  },
  cantidadSpots: {  
    type: DataTypes.INTEGER,  
    allowNull: false,  
    defaultValue: 1  
  },  
  diasEmision: {  
    type: DataTypes.STRING(100),  
    allowNull: false, // "Lunes,Martes,Miércoles" o días específicos
    comment: 'Días de la semana separados por comas'
  },
  fechaInicio: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    comment: 'Fecha de inicio de la pauta'
  },
  fechaFin: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    comment: 'Fecha de fin de la pauta'
  },
  estado: {
    type: DataTypes.ENUM('activo', 'pausado', 'cancelado'),
    allowNull: false,
    defaultValue: 'activo'
  },
  precioSpot: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    comment: 'Precio por spot individual'
  },
  observaciones: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Observaciones adicionales para esta pauta'
  }
}, {  
  tableName: 'orden_programacion',  
  timestamps: false,
  // Configuración para sincronización automática
  sync: {
    force: false, // No forzar recreación de tabla
    alter: true   // Permitir alteraciones automáticas
  }
});  

module.exports = OrdenProgramacion;