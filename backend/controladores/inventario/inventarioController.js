const Inventario = require('../../modelos/inventario/Inventario');
const Empleado = require('../../modelos/gestion_cliente/Empleado');

// Obtener todos los inventarios
const obtenerInventarios = async (req, res) => {
  try {
    const inventarios = await Inventario.findAll({
      include: { model: Empleado }
    });
    res.json(inventarios);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener los inventarios', error });
  }
};

// Obtener inventario por ID
const obtenerInventarioPorId = async (req, res) => {
  try {
    const inventario = await Inventario.findByPk(req.params.id, {
      include: { model: Empleado }
    });
    if (!inventario) return res.status(404).json({ mensaje: 'Inventario no encontrado' });
    res.json(inventario);
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
    const inventario = await Inventario.findByPk(id);
    if (!inventario) return res.status(404).json({ mensaje: 'Inventario no encontrado' });

    await inventario.update(req.body);
    res.json(inventario);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar el inventario', error });
  }
};

// Eliminar inventario
const eliminarInventario = async (req, res) => {
  try {
    const { id } = req.params;
    const inventario = await Inventario.findByPk(id);
    if (!inventario) return res.status(404).json({ mensaje: 'Inventario no encontrado' });

    await inventario.destroy();
    res.json({ mensaje: 'Inventario eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar el inventario', error });
  }
};

module.exports = {
  obtenerInventarios,
  obtenerInventarioPorId,
  crearInventario,
  actualizarInventario,
  eliminarInventario
};
