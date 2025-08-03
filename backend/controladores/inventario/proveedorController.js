// controladores/inventario/ProveedorController.js  
const { body, validationResult } = require('express-validator');  
const Proveedor = require('../../modelos/inventario/Proveedor');  
const Persona = require('../../modelos/seguridad/Persona');  
const { Op } = require('sequelize');  
  
// === VALIDACIONES ===  
const reglasCrear = [  
  body('idPersona')  
    .notEmpty().withMessage('El idPersona es obligatorio')  
    .isInt({ min: 1 }).withMessage('El idPersona debe ser un número entero positivo'),  
  body('codigoProveedor')  
    .optional()  
    .isLength({ max: 45 }).withMessage('El código no puede exceder 45 caracteres'),  
  body('tipoProveedor')  
    .optional()  
    .isIn(['Nacional', 'Internacional']).withMessage('Tipo de proveedor inválido'),  
  body('estado')  
    .optional()  
    .isIn(['Activo', 'Inactivo']).withMessage('Estado inválido')  
];  
  
const reglasEditar = [  
  body('idPersona')  
    .optional()  
    .isInt({ min: 1 }).withMessage('El idPersona debe ser un número entero positivo'),  
  body('codigoProveedor')  
    .optional()  
    .isLength({ max: 45 }).withMessage('El código no puede exceder 45 caracteres'),  
  body('tipoProveedor')  
    .optional()  
    .isIn(['Nacional', 'Internacional']).withMessage('Tipo de proveedor inválido'),  
  body('estado')  
    .optional()  
    .isIn(['Activo', 'Inactivo']).withMessage('Estado inválido')  
];  
  
// Crear proveedor  
exports.crearProveedor = [  
  ...reglasCrear,  
  async (req, res) => {  
    const errores = validationResult(req);  
    if (!errores.isEmpty()) {  
      return res.status(400).json({ errores: errores.array() });  
    }  
    try {  
      // Validar existencia de idPersona  
      const persona = await Persona.findByPk(req.body.idPersona);  
      if (!persona) {  
        return res.status(400).json({ mensaje: 'La persona asociada (idPersona) no existe' });  
      }  
      const proveedor = await Proveedor.create(req.body);  
      res.status(201).json({ mensaje: 'Proveedor creado', proveedor });  
    } catch (error) {  
      res.status(500).json({ mensaje: 'Error al crear proveedor', error: error.message });  
    }  
  }  
];  

// Obtener todos los proveedores sin filtros    
exports.obtenerTodosLosProveedores = async (req, res) => {    
  try {    
    const proveedores = await Proveedor.findAll({    
      include: [{    
        model: Persona,    
        as: 'persona'    
      }]    
    });    
    res.json(proveedores);    
  } catch (error) {    
    res.status(500).json({ mensaje: 'Error al obtener todos los proveedores', error: error.message });    
  }    
};
  
// Obtener todos los proveedores con búsqueda por nombre/apellido de Persona  
exports.obtenerProveedores = async (req, res) => {  
  try {  
    const { Pnombre, Papellido, tipoProveedor, estado } = req.query;  
    const wherePersona = {};  
    const whereProveedor = {};  
      
    if (Pnombre) wherePersona.Pnombre = { [Op.like]: `%${Pnombre}%` };  
    if (Papellido) wherePersona.Papellido = { [Op.like]: `%${Papellido}%` };  
    if (tipoProveedor) whereProveedor.tipoProveedor = tipoProveedor;  
    if (estado) whereProveedor.estado = estado;  
  
    const proveedores = await Proveedor.findAll({  
      where: Object.keys(whereProveedor).length ? whereProveedor : undefined,  
      include: [{  
        model: Persona,  
        as: 'persona',  
        where: Object.keys(wherePersona).length ? wherePersona : undefined  
      }]  
    });  
    res.json(proveedores);  
  } catch (error) {  
    res.status(500).json({ mensaje: 'Error al obtener proveedores', error: error.message });  
  }  
};  
  
// Obtener proveedor por ID, incluyendo datos de Persona  
exports.obtenerProveedorPorId = async (req, res) => {  
  const { id } = req.params;  
  try {  
    const proveedor = await Proveedor.findByPk(id, {  
      include: [{  
        model: Persona,  
        as: 'persona'  
      }]  
    });  
    if (!proveedor) return res.status(404).json({ mensaje: 'Proveedor no encontrado' });  
    res.json(proveedor);  
  } catch (error) {  
    res.status(500).json({ mensaje: 'Error al obtener proveedor', error: error.message });  
  }  
};  
  
// Editar proveedor  
exports.editarProveedor = [  
  ...reglasEditar,  
  async (req, res) => {  
    const errores = validationResult(req);  
    if (!errores.isEmpty()) {  
      return res.status(400).json({ errores: errores.array() });  
    }  
    const { id } = req.params;  
    try {  
      // Si se envía idPersona, validar que exista  
      if (req.body.idPersona) {  
        const persona = await Persona.findByPk(req.body.idPersona);  
        if (!persona) {  
          return res.status(400).json({ mensaje: 'La persona asociada (idPersona) no existe' });  
        }  
      }  
      const proveedor = await Proveedor.findByPk(id);  
      if (!proveedor) return res.status(404).json({ mensaje: 'Proveedor no encontrado' });  
      await proveedor.update(req.body);  
      res.json({ mensaje: 'Proveedor actualizado', proveedor });  
    } catch (error) {  
      res.status(500).json({ mensaje: 'Error al editar proveedor', error: error.message });  
    }  
  }  
];  
  
// Eliminar proveedor  
exports.eliminarProveedor = async (req, res) => {  
  const { id } = req.params;  
  try {  
    const proveedor = await Proveedor.findByPk(id);  
    if (!proveedor) return res.status(404).json({ mensaje: 'Proveedor no encontrado' });  
    await proveedor.destroy();  
    res.json({ mensaje: 'Proveedor eliminado' });  
  } catch (error) {  
    res.status(500).json({ mensaje: 'Error al eliminar proveedor', error: error.message });  
  }  
};