// modelos/programacion/relaciones.js
// Archivo para manejar solo las relaciones de Órdenes de Publicidad
// Esto evita las dependencias circulares y conflictos de alias

const establecerRelaciones = () => {
  // Importar modelos solo cuando se necesiten las relaciones
  const OrdenPublicidad = require('./OrdenPublicidad');
  const OrdenProgramacion = require('./OrdenProgramacion');
  const Programa = require('./Programa');

  // === RELACIONES PARA ÓRDENES DE PUBLICIDAD ===
  // OrdenProgramacion -> OrdenPublicidad
  OrdenProgramacion.belongsTo(OrdenPublicidad, { 
    foreignKey: 'idOrden',
    as: 'ordenPublicidad'
  });
  
  // OrdenProgramacion -> Programa
  OrdenProgramacion.belongsTo(Programa, { 
    foreignKey: 'idPrograma',
    as: 'Programa'
  });

  // Relaciones inversas
  OrdenPublicidad.hasMany(OrdenProgramacion, { 
    foreignKey: 'idOrden',
    as: 'pautasProgramacion'
  });
  
  Programa.hasMany(OrdenProgramacion, { 
    foreignKey: 'idPrograma',
    as: 'ordenesProgramacion'
  });

  console.log('✅ Relaciones de órdenes de publicidad establecidas correctamente');
};

module.exports = { establecerRelaciones };
