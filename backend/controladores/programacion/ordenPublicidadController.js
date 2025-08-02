// controladores/programacion/ordenPublicidadController.js  
const { body, validationResult } = require('express-validator');  
const OrdenPublicidad = require('../../modelos/programacion/OrdenPublicidad');  
const Cliente = require('../../modelos/gestion_cliente/Cliente');  
const Empleado = require('../../modelos/gestion_cliente/Empleado');  
const Persona = require('../../modelos/seguridad/Persona');  
const PDFDocument = require('pdfkit');  
const fs = require('fs');  
const path = require('path');  
const { Op } = require('sequelize');  
  
// === VALIDACIONES ===  
const reglasCrear = [  
  body('idCliente')  
    .notEmpty().withMessage('El idCliente es obligatorio')  
    .isInt({ min: 1 }).withMessage('El idCliente debe ser un número entero positivo'),  
  body('producto')  
    .notEmpty().withMessage('El producto es obligatorio')  
    .isLength({ min: 3, max: 200 }).withMessage('Producto debe tener entre 3 y 200 caracteres'),  
  body('periodoInicio')  
    .notEmpty().withMessage('El período de inicio es obligatorio')  
    .isISO8601().withMessage('Período de inicio debe tener formato válido (YYYY-MM-DD)'),  
  body('periodoFin')  
    .notEmpty().withMessage('El período de fin es obligatorio')  
    .isISO8601().withMessage('Período de fin debe tener formato válido (YYYY-MM-DD)'),  
  body('valorSinImpuesto')  
    .notEmpty().withMessage('El valor sin impuesto es obligatorio')  
    .isDecimal({ decimal_digits: '0,2' }).withMessage('Valor sin impuesto debe ser un número decimal'),  
  body('costoTotal')  
    .notEmpty().withMessage('El costo total es obligatorio')  
    .isDecimal({ decimal_digits: '0,2' }).withMessage('Costo total debe ser un número decimal'),  
  body('costoPeriodo')  
    .notEmpty().withMessage('El costo del período es obligatorio')  
    .isDecimal({ decimal_digits: '0,2' }).withMessage('Costo del período debe ser un número decimal'),  
  body('idEmpleado')  
    .notEmpty().withMessage('El idEmpleado es obligatorio')  
    .isInt({ min: 1 }).withMessage('ID de empleado debe ser un número entero positivo')  
];  
  
const reglasEditar = [  
  body('producto')  
    .optional()  
    .isLength({ min: 3, max: 200 }).withMessage('Producto debe tener entre 3 y 200 caracteres'),  
  body('periodoInicio')  
    .optional()  
    .isISO8601().withMessage('Período de inicio debe tener formato válido (YYYY-MM-DD)'),  
  body('periodoFin')  
    .optional()  
    .isISO8601().withMessage('Período de fin debe tener formato válido (YYYY-MM-DD)'),  
  body('valorSinImpuesto')  
    .optional()  
    .isDecimal({ decimal_digits: '0,2' }).withMessage('Valor sin impuesto debe ser un número decimal'),  
  body('estado')  
    .optional()  
    .isIn(['Pendiente', 'Aprobada', 'En_Emision', 'Finalizada', 'Cancelada']).withMessage('Estado inválido'),  
  body('fechaAlAire')  
    .optional()  
    .isISO8601().withMessage('Fecha al aire debe tener formato válido (YYYY-MM-DD)')  
];  
  
// === FUNCIONES AUXILIARES PARA PDF ===  
function drawTable(doc, table, x, y, width, rowHeight) {  
  const colWidth = width / table.headers.length;  
    
  // Dibujar encabezados  
  table.headers.forEach((header, i) => {  
    doc.font('Helvetica-Bold').text(header, x + i * colWidth, y, { width: colWidth });  
  });  
    
  // Dibujar filas  
  table.rows.forEach((row, rowIndex) => {  
    row.forEach((cell, i) => {  
      doc.font('Helvetica').text(cell, x + i * colWidth, y + (rowIndex + 1) * rowHeight, { width: colWidth });  
    });  
  });  
}  
  
function drawComplexTable(doc, table, x, y, width, rowHeight) {  
  const colWidths = [120, 80, 50, 50, 50, 50, 50, 50, 50]; // Anchos específicos para cada columna  
  let currentX = x;  
    
  // Dibujar encabezados  
  table.headers.forEach((header, i) => {  
    doc.font('Helvetica-Bold').fontSize(8).text(header, currentX, y, { width: colWidths[i] });  
    currentX += colWidths[i];  
  });  
    
  // Dibujar filas  
  table.rows.forEach((row, rowIndex) => {  
    currentX = x;  
    row.forEach((cell, i) => {  
      doc.font('Helvetica').fontSize(8).text(cell, currentX, y + (rowIndex + 1) * rowHeight, { width: colWidths[i] });  
      currentX += colWidths[i];  
    });  
  });  
}  
  
const generarOrdenPDF = async (orden, cliente, programacion) => {  
  const nombreArchivo = `orden_publicidad_${orden.numeroOrden}.pdf`;  
  const rutaPDF = path.join(__dirname, '../../uploads', nombreArchivo);  
      
  const doc = new PDFDocument({ size: 'A4', margin: 50 });  
  doc.pipe(fs.createWriteStream(rutaPDF));  
      
  // Encabezado Canal 40  
  doc.fontSize(20).text('CANAL 40', { align: 'center' });  
  doc.moveDown(0.5);  
      
  doc.fontSize(12).text('TELEVISIÓN COMAYAGUA', { align: 'center' });  
  doc.text('CARRETERA DEL NORTE, SALIDA A TEQUICIALPA', { align: 'center' });  
  doc.text('TEL: 772-742277423 - FAX: 772-8060', { align: 'center' });  
  doc.text('EMAIL: televisióncomayagua@yahoo.com', { align: 'center' });  
  doc.moveDown(1);  
  
  doc.fontSize(14).text('EL PRIMER CANAL DE LA ZONA CENTRAL', { align: 'center', underline: true });  
  doc.moveDown(1.5);  
  
  doc.fontSize(16).text('ORDEN DE PUBLICIDAD', { align: 'center', bold: true });  
  doc.moveDown(1);  
  
  doc.fontSize(10).text('En esta fecha se ordena la transmisión de publicidad, bajo los términos descritos, quedando entendido que cualquier reclamo puede hacerlo en los primeros cinco días a partir de la fecha de inicio de la publicidad, caso contrario esta orden de publicidad se tomará como aceptada.', { align: 'justify' });  
  doc.moveDown(2);  
  
  // Tabla de información del cliente  
  const clienteNombre = cliente.persona ? `${cliente.persona.Pnombre} ${cliente.persona.Papellido}` : 'Cliente';  
  const clientTable = {  
    headers: ['Cliente:', 'Producto:', 'Período de pauta:'],  
    rows: [  
      [clienteNombre, orden.producto, `${orden.periodoInicio} ~ ${orden.periodoFin}`]  
    ]  
  };  
  
  // Dibujar tabla de cliente  
  drawTable(doc, clientTable, 50, doc.y, 500, 30);  
  doc.moveDown(2);  
  
  // Horarios de pauta  
  doc.fontSize(14).text('Horarios de Pauta', { bold: true });  
  doc.moveDown(0.5);  
  
  // Tabla de horarios (datos dinámicos si están disponibles, sino usar datos por defecto)  
  const scheduleTable = {  
    headers: ['Programa', 'Horas', 'Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],  
    rows: programacion && programacion.length > 0 ? programacion : [  
      ['60 MINUTOS', '7 a 8:30 AM', '', '2', '', '', '', '', ''],  
      ['Serie cómica', '8:30 a 9 AM', '', '', '', '', '', '', ''],  
      ['Película Matutina', '9 a 11 AM', '', '', '', '', '', '', ''],  
      ['Usted y su Médico', '11 a 12 AM', '', '', '', '', '', '', ''],  
      ['TV Noticias 40', '12 a 1 PM', '', '', '', '', '', '', ''],  
      ['Meridiano', '', '', '', '', '', '', '', ''],  
      ['Infantiles', '1 a 2 PM', '', '', '', '', '', '', ''],  
      ['Viva la Música', '2 a 4 PM', '', '', '', '', '', '', ''],  
      ['Fiesta Navideña', '5 a 6 PM', '', '', '', '', '', '', ''],  
      ['TV Noticias 40 Estelar', '6 a 7 PM', '', '', '', '', '', '', ''],  
      ['Cine Estreno', '7 a 9 PM', '', '', '', '', '', '', ''],  
      ['Película Estelar', '9 a 11 PM', '', '', '', '', '', '', ''],  
      ['Total', '', '', '', '', '', '', '', '']  
    ]  
  };  
  
  // Dibujar tabla de horarios  
  drawComplexTable(doc, scheduleTable, 50, doc.y, 500, 20);  
  doc.moveDown(2);  
  
  // Sección de valores  
  doc.fontSize(12).text('Valor sin impuesto 15% ISV');  
  doc.text(`L. ${parseFloat(orden.valorSinImpuesto).toFixed(2)}`);  
  doc.text(`L. ${(parseFloat(orden.valorSinImpuesto) * 0.15).toFixed(2)}`);  
  doc.text('Costo total');  
  doc.text(`L. ${parseFloat(orden.costoTotal).toFixed(2)}`);  
  doc.text('Costo en el Período');  
  doc.text(`L. ${parseFloat(orden.costoPeriodo).toFixed(2)}`);  
  doc.moveDown(2);  
  
  // Lugar y fecha  
  doc.text('___________________________________________');  
  doc.text(`Lugar y Fecha: Comayagua, ${new Date().toLocaleDateString('es-HN')}`);  
  doc.moveDown(1);  
  
  doc.text('Al aire:');  
  doc.text(`Fecha de primera emisión — Día ${orden.fechaAlAire || '______'}`);  
  doc.moveDown(2);  
  
  // Aprobado por  
  doc.text('Aprobado por:');  
  doc.text('Por Canal 40');  
  
  // Finalizar el PDF  
  doc.end();  
  return nombreArchivo;  
};  
  
// === CONTROLADORES ===  
  
// Crear orden de publicidad  
const crearOrden = [  
  ...reglasCrear,  
  async (req, res) => {  
    const errores = validationResult(req);  
    if (!errores.isEmpty()) {  
      return res.status(400).json({ errores: errores.array() });  
    }  
    try {  
      // Validar existencia de cliente y empleado  
      const cliente = await Cliente.findByPk(req.body.idCliente);  
      if (!cliente) {  
        return res.status(400).json({ mensaje: 'El cliente asociado no existe' });  
      }  
  
      const empleado = await Empleado.findByPk(req.body.idEmpleado);  
      if (!empleado) {  
        return res.status(400).json({ mensaje: 'El empleado asociado no existe' });  
      }  
  
      // Generar número de orden único  
      const ultimaOrden = await OrdenPublicidad.findOne({  
        order: [['idOrden', 'DESC']]  
      });  
      const numeroOrden = `OP-${String((ultimaOrden?.idOrden || 0) + 1).padStart(6, '0')}`;  
  
      // Calcular impuesto automáticamente  
      const valorSinImpuesto = parseFloat(req.body.valorSinImpuesto);  
      const impuesto = valorSinImpuesto * 0.15;  
      const costoTotal = valorSinImpuesto + impuesto;  
  
      const ordenData = {  
        ...req.body,  
        numeroOrden,  
        impuesto,  
        costoTotal: req.body.costoTotal || costoTotal  
      };  
  
      const orden = await OrdenPublicidad.create(ordenData);  
      res.status(201).json({ mensaje: 'Orden de publicidad creada', orden });  
    } catch (error) {  
      res.status(500).json({ mensaje: 'Error al crear orden de publicidad', error: error.message });  
    }  
  }  
];  
  
// Obtener órdenes con filtros  
const obtenerOrdenes = async (req, res) => {  
  try {  
    const { estado, idCliente, fechaInicio, fechaFin } = req.query;  
    const whereOrden = {};  
      
    if (estado) whereOrden.estado = estado;  
    if (idCliente) whereOrden.idCliente = idCliente;  
    if (fechaInicio) whereOrden.periodoInicio = { [Op.gte]: fechaInicio };  
    if (fechaFin) whereOrden.periodoFin = { [Op.lte]: fechaFin };  
  
    const ordenes = await OrdenPublicidad.findAll({  
      where: Object.keys(whereOrden).length ? whereOrden : undefined,  
      include: [  
        {  
          model: Cliente,  
          include: [{  
            model: Persona,  
            as: 'persona',  
            attributes: ['Pnombre', 'Snombre', 'Papellido', 'Sapellido']  
          }]  
        },  
        {  
          model: Empleado,  
          include: [{  
            model: Persona,  
            as: 'persona',  
            attributes: ['Pnombre', 'Snombre', 'Papellido', 'Sapellido']  
          }]  
        }  
      ],  
      order: [['fechaCreacion', 'DESC']]  
    });  
    res.json(ordenes);  
  } catch (error) {  
    res.status(500).json({ mensaje: 'Error al obtener órdenes de publicidad', error: error.message });  
  }  
};  

// 
const obtenerOrdenPorId = async (req, res) => {    
  const { id } = req.params;    
  try {    
    const orden = await OrdenPublicidad.findByPk(id, {    
      include: [    
        {    
          model: Cliente,    
          include: [{    
            model: Persona,    
            as: 'persona'    
          }]    
        },    
        {    
          model: Empleado,    
          include: [{    
            model: Persona,    
            as: 'persona'    
          }]  
       }]    
      })   
     
    if (!orden) return res.status(404).json({ mensaje: 'Orden de publicidad no encontrada' });    
    res.json(orden);    
  } catch (error) {    
    res.status(500).json({ mensaje: 'Error al obtener orden de publicidad', error: error.message });    
  }    
}; 
  
// Editar orden de publicidad  
const editarOrden = [  
  ...reglasEditar,  
  async (req, res) => {  
    const errores = validationResult(req);  
    if (!errores.isEmpty()) {  
      return res.status(400).json({ errores: errores.array() });  
    }  
    const { id } = req.params;  
    try {  
      const orden = await OrdenPublicidad.findByPk(id);  
      if (!orden) return res.status(404).json({ mensaje: 'Orden de publicidad no encontrada' });  
  
      // Recalcular costos si se cambia el valor sin impuesto  
      if (req.body.valorSinImpuesto) {  
        const valorSinImpuesto = parseFloat(req.body.valorSinImpuesto);  
        req.body.impuesto = valorSinImpuesto * 0.15;  
        req.body.costoTotal = valorSinImpuesto + req.body.impuesto;  
      }  
  
      await orden.update(req.body);  
      res.json({ mensaje: 'Orden de publicidad actualizada', orden });  
    } catch (error) {  
      res.status(500).json({ mensaje: 'Error al editar orden de publicidad', error: error.message });  
    }  
  }  
];  
  
// Generar PDF de orden  
const generarPDF = async (req, res) => {  
  const { id } = req.params;  
  try {  
    const orden = await OrdenPublicidad.findByPk(id, {  
      include: [  
        {  
          model: Cliente,  
          include: [{  
            model: Persona,  
            as: 'persona'  
          }]  
        }  
      ]  
    });  
      
    if (!orden) return res.status(404).json({ mensaje: 'Orden de publicidad no encontrada' });  
  
    const nombreArchivo = await generarOrdenPDF(orden, orden.Cliente, []);  
      
    // Actualizar la orden con el nombre del archivo PDF  
    await orden.update({ archivo_pdf: nombreArchivo });  
      
    res.json({ mensaje: 'PDF generado exitosamente', archivo: nombreArchivo });  
  } catch (error) {  
    res.status(500).json({ mensaje: 'Error al generar PDF', error: error.message });  
  }  
};  
  
// Visualizar PDF de orden en navegador  
const visualizarPDF = async (req, res) => {  
  const { id } = req.params;  
  try {  
    const orden = await OrdenPublicidad.findByPk(id);  
    if (!orden) return res.status(404).json({ mensaje: 'Orden de publicidad no encontrada' });  
      
    if (!orden.archivo_pdf) {  
      return res.status(404).json({ mensaje: 'PDF no encontrado para esta orden' });  
    }  
      
    const rutaPDF = path.join(__dirname, '../../uploads', orden.archivo_pdf);  
      
    if (!fs.existsSync(rutaPDF)) {  
      return res.status(404).json({ mensaje: 'Archivo PDF no encontrado en el servidor' });  
    }  
      
    res.setHeader('Content-Type', 'application/pdf');  
    res.setHeader('Content-Disposition', 'inline; filename=' + orden.archivo_pdf);  
      
    const stream = fs.createReadStream(rutaPDF);  
    stream.pipe(res);  
  } catch (error) {  
    res.status(500).json({ mensaje: 'Error al visualizar PDF', error: error.message });  
  }  
};  
  
// Aprobar orden de publicidad  
const aprobarOrden = async (req, res) => {  
  const { id } = req.params;  
  try {  
    const orden = await OrdenPublicidad.findByPk(id);  
    if (!orden) return res.status(404).json({ mensaje: 'Orden de publicidad no encontrada' });  
      
    if (orden.estado !== 'Pendiente') {  
      return res.status(400).json({ mensaje: 'Solo se pueden aprobar órdenes pendientes' });  
    }  
      
    await orden.update({ estado: 'Aprobada' });  
    res.json({ mensaje: 'Orden de publicidad aprobada', orden });  
  } catch (error) {  
    res.status(500).json({ mensaje: 'Error al aprobar orden de publicidad', error: error.message });  
  }  
};  
  
// Cancelar orden de publicidad  
const cancelarOrden = async (req, res) => {  
  const { id } = req.params;  
  try {  
    const orden = await OrdenPublicidad.findByPk(id);  
    if (!orden) return res.status(404).json({ mensaje: 'Orden de publicidad no encontrada' });  
      
    if (orden.estado === 'Finalizada') {  
      return res.status(400).json({ mensaje: 'No se puede cancelar una orden finalizada' });  
    }  
      
    await orden.update({ estado: 'Cancelada' });  
    res.json({ mensaje: 'Orden de publicidad cancelada', orden });  
  } catch (error) {  
    res.status(500).json({ mensaje: 'Error al cancelar orden de publicidad', error: error.message });  
  }  
};  
  
// Eliminar orden de publicidad  
const eliminarOrden = async (req, res) => {  
  const { id } = req.params;  
  try {  
    const orden = await OrdenPublicidad.findByPk(id);  
    if (!orden) return res.status(404).json({ mensaje: 'Orden de publicidad no encontrada' });  
      
    if (orden.estado === 'En_Emision') {  
      return res.status(400).json({ mensaje: 'No se puede eliminar una orden en emisión' });  
    }  
      
    // Eliminar archivo PDF si existe  
    if (orden.archivo_pdf) {  
      const rutaPDF = path.join(__dirname, '../../uploads', orden.archivo_pdf);  
      if (fs.existsSync(rutaPDF)) {  
        fs.unlinkSync(rutaPDF);  
      }  
    }  
      
    await orden.destroy();  
    res.json({ mensaje: 'Orden de publicidad eliminada' });  
  } catch (error) {  
    res.status(500).json({ mensaje: 'Error al eliminar orden de publicidad', error: error.message });  
  }  
};  
  
module.exports = {  
  crearOrden,  
  obtenerOrdenes,  
  obtenerOrdenPorId,  
  editarOrden,  
  generarPDF,  
  visualizarPDF,  
  aprobarOrden,  
  cancelarOrden,  
  eliminarOrden  
};