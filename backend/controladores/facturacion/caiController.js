const CAI = require('../../modelos/facturacion/Cai'); 
  
exports.obtenerCAIActivo = async (req, res) => {  
  try {  
    console.log('🔍 Buscando CAI activo...');
    
    const caiActivo = await CAI.findOne({  
      where: { activo: true },  
      order: [['fechaEmision', 'DESC']]  
    });  
      
    if (!caiActivo) {  
      console.log('⚠️ No hay CAI activo configurado');
      return res.status(404).json({ mensaje: 'No hay CAI activo configurado' });  
    }  
      
    console.log('✅ CAI activo encontrado:', caiActivo.codigoCAI);
    res.json({ cai: caiActivo });  
  } catch (error) {  
    console.error('❌ Error al obtener CAI:', error);
    res.status(500).json({ mensaje: 'Error al obtener CAI', error: error.message });  
  }  
};  
  
exports.crearCAI = async (req, res) => {  
  try {  
    // Desactivar CAI anterior  
    await CAI.update({ activo: false }, { where: { activo: true } });  
      
    // Remover idCAI del body si viene incluido  
    const { idCAI, ...datosCAI } = req.body;  
      
    const nuevoCAI = await CAI.create(datosCAI);  
    res.status(201).json({  
      mensaje: 'CAI creado exitosamente',  
      idCAI: nuevoCAI.idCAI, // El ID generado automáticamente  
      cai: nuevoCAI  
    });  
  } catch (error) {   
    res.status(500).json({ mensaje: 'Error al crear CAI', error: error.message });  
  }  
};  
  
exports.actualizarCAI = async (req, res) => {  
  try {  
    const cai = await CAI.findByPk(req.params.id);  
    if (!cai) {  
      return res.status(404).json({ mensaje: 'CAI no encontrado' });  
    }  
      
    await cai.update(req.body);  
    res.json({ mensaje: 'CAI actualizado exitosamente', cai });  
  } catch (error) {  
    res.status(500).json({ mensaje: 'Error al actualizar CAI', error: error.message });  
  }  
};