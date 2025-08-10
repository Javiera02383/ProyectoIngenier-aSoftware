const Inventario = require('../../modelos/inventario/Inventario');
const Empleado = require('../../modelos/gestion_cliente/Empleado');
const Persona = require('../../modelos/seguridad/Persona');
const Proveedor = require('../../modelos/inventario/Proveedor');
const Movimiento = require('../../modelos/inventario/Movimiento');
const Mantenimiento = require('../../modelos/inventario/Mantenimiento');

// Obtener todos los inventarios
const obtenerInventarios = async (req, res) => {
  try {
    const inventarios = await Inventario.findAll({
      include: [
        {
        model: Empleado,
        include: [{
          model: Persona,
          as: 'persona'
        }]
        },
        {
          model: Proveedor,
          include: [{
            model: Persona,
            as: 'persona'
          }]
        }
      ]
    });
    
    // Transformar los datos para usar nombres de campos consistentes
    const inventariosTransformados = inventarios.map(inventario => {
      const inventarioData = inventario.toJSON();
      
      // Transformar datos del empleado
      if (inventarioData.Empleado && inventarioData.Empleado.persona) {
        // Agregar campos con nombres consistentes
        inventarioData.Empleado.persona.nombre = inventarioData.Empleado.persona.Pnombre || '';
        inventarioData.Empleado.persona.primerApellido = inventarioData.Empleado.persona.Papellido || '';
        inventarioData.Empleado.persona.segundoApellido = inventarioData.Empleado.persona.Sapellido || '';
        
        // Crear nombre completo (nombre + primer apellido)
        const nombre = inventarioData.Empleado.persona.Pnombre || '';
        const primerApellido = inventarioData.Empleado.persona.Papellido || '';
        inventarioData.Empleado.persona.nombreCompleto = `${nombre} ${primerApellido}`.trim();
        
        // Agregar nombre completo al empleado para facilitar el acceso
        inventarioData.Empleado.nombre = inventarioData.Empleado.persona.nombreCompleto;
      }
      
      // Transformar datos del proveedor
      if (inventarioData.Proveedor && inventarioData.Proveedor.persona) {
        // Agregar campos con nombres consistentes
        inventarioData.Proveedor.persona.nombre = inventarioData.Proveedor.persona.Pnombre || '';
        inventarioData.Proveedor.persona.primerApellido = inventarioData.Proveedor.persona.Papellido || '';
        inventarioData.Proveedor.persona.segundoApellido = inventarioData.Proveedor.persona.Sapellido || '';
        
        // Crear nombre completo (nombre + primer apellido)
        const nombre = inventarioData.Proveedor.persona.Pnombre || '';
        const primerApellido = inventarioData.Proveedor.persona.Papellido || '';
        inventarioData.Proveedor.persona.nombreCompleto = `${nombre} ${primerApellido}`.trim();
        
        // Agregar nombre completo al proveedor para facilitar el acceso
        inventarioData.Proveedor.nombre = inventarioData.Proveedor.persona.nombreCompleto;
      }
      
      return inventarioData;
    });
    
    res.json(inventariosTransformados);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener los inventarios', error });
  }
};

// Obtener inventario por ID
const obtenerInventarioPorId = async (req, res) => {
  try {
    const inventario = await Inventario.findByPk(req.params.id, {
      include: [
        {
        model: Empleado,
        include: [{
          model: Persona,
          as: 'persona'
        }]
        },
        {
          model: Proveedor,
          include: [{
            model: Persona,
            as: 'persona'
          }]
        }
      ]
    });
    if (!inventario) return res.status(404).json({ mensaje: 'Inventario no encontrado' });
    
    // Transformar los datos para usar nombres de campos consistentes
    const inventarioData = inventario.toJSON();
    
    // Transformar datos del empleado
    if (inventarioData.Empleado && inventarioData.Empleado.persona) {
      // Agregar campos con nombres consistentes
      inventarioData.Empleado.persona.nombre = inventarioData.Empleado.persona.Pnombre || '';
      inventarioData.Empleado.persona.primerApellido = inventarioData.Empleado.persona.Papellido || '';
      inventarioData.Empleado.persona.segundoApellido = inventarioData.Empleado.persona.Sapellido || '';
      
      // Crear nombre completo (nombre + primer apellido)
      const nombre = inventarioData.Empleado.persona.Pnombre || '';
      const primerApellido = inventarioData.Empleado.persona.Papellido || '';
      inventarioData.Empleado.persona.nombreCompleto = `${nombre} ${primerApellido}`.trim();
      
      // Agregar nombre completo al empleado para facilitar el acceso
      inventarioData.Empleado.nombre = inventarioData.Empleado.persona.nombreCompleto;
    }
    
    // Transformar datos del proveedor
    if (inventarioData.Proveedor && inventarioData.Proveedor.persona) {
      // Agregar campos con nombres consistentes
      inventarioData.Proveedor.persona.nombre = inventarioData.Proveedor.persona.Pnombre || '';
      inventarioData.Proveedor.persona.primerApellido = inventarioData.Proveedor.persona.Papellido || '';
      inventarioData.Proveedor.persona.segundoApellido = inventarioData.Proveedor.persona.Sapellido || '';
      
      // Crear nombre completo (nombre + primer apellido)
      const nombre = inventarioData.Proveedor.persona.Pnombre || '';
      const primerApellido = inventarioData.Proveedor.persona.Papellido || '';
      inventarioData.Proveedor.persona.nombreCompleto = `${nombre} ${primerApellido}`.trim();
      
      // Agregar nombre completo al proveedor para facilitar el acceso
      inventarioData.Proveedor.nombre = inventarioData.Proveedor.persona.nombreCompleto;
    }
    
    res.json(inventarioData);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al buscar el inventario', error });
  }
};

// Crear inventario
const crearInventario = async (req, res) => {  
  try {  
    // Si no se proporciona idProveedor, usar un proveedor por defecto  
    if (!req.body.idProveedor || req.body.idProveedor === "") {  
      req.body.idProveedor = 1; // ID del proveedor por defecto  
    }  
      
    const nuevo = await Inventario.create(req.body);  
    res.status(201).json(nuevo);  
  } catch (error) {  
    res.status(500).json({ mensaje: 'Error al crear el inventario', error });  
  }  
};

// Actualizar inventario
const actualizarInventario = async (req, res) => {
  try {
    const { id } = req.params;
    const { cantidad, tipoMovimiento, idEmpleado, observaciones } = req.body;
    
    const inventario = await Inventario.findByPk(id);
    if (!inventario) return res.status(404).json({ mensaje: 'Inventario no encontrado' });

    // Si se está actualizando la cantidad, validar que no sea negativa
    if (cantidad !== undefined) {
      if (cantidad < 0) {
        return res.status(400).json({ 
          mensaje: 'La cantidad no puede ser negativa',
          cantidadActual: inventario.cantidad,
          cantidadSolicitada: cantidad
        });
      }
    }

    // Actualizar el inventario
    await inventario.update(req.body);
    
    // Si se especificó un tipo de movimiento, registrar el movimiento
    if (tipoMovimiento && cantidad !== undefined) {
      await Movimiento.create({
        idInventario: id,
        tipoMovimiento: tipoMovimiento,
        idEmpleado: idEmpleado || null,
        observaciones: observaciones || `Stock actualizado a ${cantidad} unidades`,
        fechaMovimiento: new Date()
      });
    }

    res.json({
      mensaje: 'Inventario actualizado correctamente',
      inventario: inventario,
      movimientoRegistrado: tipoMovimiento ? true : false
    });
  } catch (error) {
    console.error('Error al actualizar inventario:', error);
    res.status(500).json({ 
      mensaje: 'Error al actualizar el inventario', 
      error: error.message 
    });
  }
};

// Obtener historial de movimientos de un activo
const obtenerHistorialMovimientos = async (req, res) => {
  try {
    const { id } = req.params;
    
    const inventario = await Inventario.findByPk(id);
    if (!inventario) {
      return res.status(404).json({ mensaje: 'Inventario no encontrado' });
    }

    const movimientos = await Movimiento.findAll({
      where: { idInventario: id },
      include: [
        {
          model: Empleado,
          include: [{
            model: Persona,
            as: 'persona'
          }]
        }
      ],
      order: [['fechaMovimiento', 'DESC']]
    });

    // Transformar datos para mejor legibilidad
    const movimientosTransformados = movimientos.map(mov => {
      const movData = mov.toJSON();
      if (movData.Empleado && movData.Empleado.persona) {
        movData.Empleado.nombre = movData.Empleado.persona.nombreCompleto || 'No especificado';
      }
      return movData;
    });

    res.json({
      inventario: {
        idInventario: inventario.idInventario,
        nombre: inventario.nombre,
        codigo: inventario.codigo,
        stockActual: inventario.cantidad
      },
      movimientos: movimientosTransformados,
      totalMovimientos: movimientosTransformados.length
    });
  } catch (error) {
    console.error('Error al obtener historial de movimientos:', error);
    res.status(500).json({ 
      mensaje: 'Error al obtener el historial de movimientos', 
      error: error.message 
    });
  }
};

// Registrar salida de stock
const registrarSalidaStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { cantidad, idEmpleado, observaciones } = req.body;
    
    if (!cantidad || cantidad <= 0) {
      return res.status(400).json({ 
        mensaje: 'La cantidad debe ser mayor a 0',
        cantidadSolicitada: cantidad
      });
    }

    const inventario = await Inventario.findByPk(id);
    if (!inventario) {
      return res.status(404).json({ mensaje: 'Inventario no encontrado' });
    }

    // Verificar stock suficiente
    if (inventario.cantidad < cantidad) {
      return res.status(400).json({ 
        mensaje: 'Stock insuficiente para la salida',
        stockActual: inventario.cantidad,
        cantidadSolicitada: cantidad,
        stockDisponible: inventario.cantidad
      });
    }

    // Calcular nueva cantidad
    const nuevaCantidad = inventario.cantidad - cantidad;
    
    // Actualizar inventario
    await inventario.update({ cantidad: nuevaCantidad });
    
    // Registrar movimiento
    const movimiento = await Movimiento.create({
      idInventario: id,
      tipoMovimiento: 'Baja',
      idEmpleado: idEmpleado || null,
      observaciones: observaciones || `Salida de ${cantidad} unidades. Stock anterior: ${inventario.cantidad}, Stock actual: ${nuevaCantidad}`,
      fechaMovimiento: new Date()
    });

    res.json({
      mensaje: 'Salida de stock registrada correctamente',
      inventario: {
        idInventario: inventario.idInventario,
        nombre: inventario.nombre,
        codigo: inventario.codigo,
        stockAnterior: inventario.cantidad,
        stockActual: nuevaCantidad,
        cantidadRetirada: cantidad
      },
      movimiento: {
        idMovimiento: movimiento.idMovimiento,
        fecha: movimiento.fechaMovimiento,
        tipo: movimiento.tipoMovimiento
      }
    });
  } catch (error) {
    console.error('Error al registrar salida de stock:', error);
    res.status(500).json({ 
      mensaje: 'Error al registrar la salida de stock', 
      error: error.message 
    });
  }
};

// Eliminar inventario
const eliminarInventario = async (req, res) => {
  try {
    const { id } = req.params;
    const inventario = await Inventario.findByPk(id);
    if (!inventario) return res.status(404).json({ mensaje: 'Inventario no encontrado' });

    // Eliminar registros relacionados primero
    await Movimiento.destroy({ where: { idInventario: id } });
    await Mantenimiento.destroy({ where: { idInventario: id } });

    // Ahora eliminar el inventario
    await inventario.destroy();
    res.json({ mensaje: 'Inventario eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar inventario:', error);
    res.status(500).json({ mensaje: 'Error al eliminar el inventario', error: error.message });
  }
};

module.exports = {
  obtenerInventarios,
  obtenerInventarioPorId,
  crearInventario,
  actualizarInventario,
  obtenerHistorialMovimientos,
  registrarSalidaStock,
  eliminarInventario
};
