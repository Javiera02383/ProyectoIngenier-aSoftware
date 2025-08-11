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
  
// === PALETA DE COLORES ===
const COLORS = {
  primary: '#002b5c',
  secondary: '#f0f0f0',
  text: '#000000',
  tableHeader: '#d9e3f0',
  border: '#b0b0b0'
};

// === FUNCIONES AUXILIARES ===
function addHeaderImage(doc) {
  const possibleImages = [
    path.join(__dirname, '../../img/Encabezado.jpeg'),
    path.join(__dirname, '../../img/logoCanal.png'),
    path.join(__dirname, '../../img/encabezados/Encabezado.jpeg'),
    path.join(__dirname, '../../img/encabezados/Encabezado.jpg'),
    path.join(__dirname, '../../img/encabezados/encabezado.png'),
    path.join(__dirname, '../../img/encabezados/encabezado.jpg')
  ];

  for (const imagePath of possibleImages) {
    if (fs.existsSync(imagePath) && fs.statSync(imagePath).size > 0) {
      doc.image(imagePath, 50, 20, { width: doc.page.width - 100 });
      doc.moveDown(4);
      doc.strokeColor(COLORS.primary).lineWidth(2)
         .moveTo(50, doc.y)
         .lineTo(doc.page.width - 50, doc.y)
         .stroke();
      doc.moveDown(1);
      return true;
    }
  }
  return false;
}

function drawTable(doc, table, x, y, width, rowHeight) {
  const colWidth = width / table.headers.length;

  doc.fillColor(COLORS.tableHeader)
     .rect(x, y, width, rowHeight)
     .fill()
     .strokeColor(COLORS.border)
     .stroke();

  table.headers.forEach((header, i) => {
    doc.fillColor(COLORS.text)
       .font('Helvetica-Bold').fontSize(10)
       .text(header.toUpperCase(), x + 5 + i * colWidth, y + 5, { width: colWidth - 10, align: 'center' });
  });

  table.rows.forEach((row, rowIndex) => {
    const currentY = y + (rowIndex + 1) * rowHeight;
    doc.fillColor(rowIndex % 2 === 0 ? '#ffffff' : '#fafafa')
       .rect(x, currentY, width, rowHeight).fill();
    doc.strokeColor(COLORS.border).rect(x, currentY, width, rowHeight).stroke();

    row.forEach((cell, i) => {
      doc.fillColor(COLORS.text)
         .font('Helvetica').fontSize(9)
         .text(cell, x + 5 + i * colWidth, currentY + 5, { width: colWidth - 10, align: 'center' });
    });
  });
}

function drawComplexTable(doc, table, x, y, width, rowHeight) {
  const colWidths = new Array(table.headers.length).fill(width / table.headers.length);

  doc.fillColor(COLORS.tableHeader)
     .rect(x, y, width, rowHeight)
     .fill()
     .strokeColor(COLORS.border)
     .stroke();

  let currentX = x;
  table.headers.forEach((header, i) => {
    doc.fillColor(COLORS.text)
       .font('Helvetica-Bold').fontSize(9)
       .text(header.toUpperCase(), currentX + 3, y + 4, { width: colWidths[i] - 6, align: 'center' });
    currentX += colWidths[i];
  });

  table.rows.forEach((row, rowIndex) => {
    const currentY = y + (rowIndex + 1) * rowHeight;
    currentX = x;

    doc.fillColor(rowIndex % 2 === 0 ? '#ffffff' : '#fafafa')
       .rect(x, currentY, width, rowHeight).fill();
    doc.strokeColor(COLORS.border).rect(x, currentY, width, rowHeight).stroke();

    row.forEach((cell, i) => {
      let font = 'Helvetica';
      if (cell.toUpperCase().includes('RESUMEN') || cell.toUpperCase().includes('TOTAL')) {
        font = 'Helvetica-Bold';
      }
      doc.fillColor(COLORS.text)
         .font(font).fontSize(8)
         .text(cell, currentX + 3, currentY + 3, { width: colWidths[i] - 6, align: 'center' });
      currentX += colWidths[i];
    });
  });
}

// === FUNCIÓN PRINCIPAL ===
const generarOrdenPDF = async (orden, cliente, programacion) => {  
  const nombreArchivo = `orden_publicidad_${orden.numeroOrden}.pdf`;  
  const rutaPDF = path.join(__dirname, '../../uploads', nombreArchivo);  
  const doc = new PDFDocument({ size: 'A4', margin: 50 });  
  doc.pipe(fs.createWriteStream(rutaPDF));  

  const checkPageBreak = (requiredHeight) => {
    if (doc.y + requiredHeight > doc.page.maxY() - 100) {
      doc.addPage();
      return true;
    }
    return false;
  };

  // === ENCABEZADO ===
  addHeaderImage(doc);

  // === TÍTULO ===
  doc.moveDown(1)
     .fontSize(18).fillColor(COLORS.primary)
     .font('Helvetica-Bold')
     .text('ORDEN DE PUBLICIDAD', { align: 'center' });
  doc.moveDown(1)
     .fontSize(12).fillColor(COLORS.text)
     .font('Helvetica-Bold')
     .text(`No Orden: ${orden.numeroOrden}`, { align: 'center' });
  doc.moveDown(1)
     .fontSize(10).font('Helvetica')
     .text('En esta fecha se ordena la transmisión de publicidad, bajo los términos descritos, quedando entendido que cualquier reclamo puede hacerlo en los primeros cinco días a partir de la fecha de inicio de la publicidad, caso contrario esta orden de publicidad se tomará como aceptada.', { align: 'justify' });
  doc.moveDown(2);

  // === INFO CLIENTE ===
  doc.fontSize(10).font('Helvetica-Bold').text('Información del Cliente');
  doc.moveDown(0.5);
  
  const clienteNombre = cliente.persona ? `${cliente.persona.Pnombre} ${cliente.persona.Snombre || ''} ${cliente.persona.Papellido} ${cliente.persona.Sapellido || ''}`.trim() : 'Cliente';
  const clientTable = {
    headers: ['Cliente:', 'Producto:', 'Período de pauta:'],
    rows: [
      [clienteNombre, orden.producto, `${orden.periodoInicio} ~ ${orden.periodoFin}`]
    ]
  };
  checkPageBreak(50);
  const clientTableWidth = 400;
  const clientTableX = (595.28 - clientTableWidth) / 2;
  drawTable(doc, clientTable, clientTableX, doc.y, clientTableWidth, 25);
  doc.moveDown(2);

  // === HORARIOS ===
  doc.fontSize(10).font('Helvetica-Bold')
     .text('Horario de Pauta', { align: 'center' });
  doc.moveDown(1);

  let scheduleTable;
  if (programacion && programacion.length > 0) {
    scheduleTable = {
      headers: ['Programa', 'Horario', 'Duración', 'Días', 'Spots', 'Estado'],
      rows: programacion.map(pauta => [
        pauta.programa ? pauta.programa.nombre || 'Programa' : 'Programa',
        pauta.programa ? pauta.programa.horaInicio || 'Por definir' : 'Por definir',
        pauta.duracionPauta ? `${pauta.duracionPauta} min` : 'Por definir',
        pauta.diasEmision || 'Todos los días',
        pauta.cantidadSpots ? pauta.cantidadSpots.toString() : '1',
        pauta.estado || 'activo'
      ])
    };
    const totalSpots = programacion.reduce((t, p) => t + (p.cantidadSpots || 1), 0);
    const totalPautas = programacion.length;
    scheduleTable.rows.push(['RESUMEN TOTAL', `Total Pautas: ${totalPautas}`, `Total Spots: ${totalSpots}`, '', '', '']);
    checkPageBreak((scheduleTable.rows.length + 1) * 18);
  } else {
    scheduleTable = {
      headers: ['Programa', 'Horas', 'Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
      rows: [['60 MINUTOS', '7 a 8:30 AM', '', '2', '', '', '', '', '']]
    };
  }
  const tableWidth = scheduleTable.headers.length === 6 ? 450 : 400;
  const tableX = (595.28 - tableWidth) / 2;
  drawComplexTable(doc, scheduleTable, tableX, doc.y, tableWidth, 18);
  doc.moveDown(2);

  // === INFO FINANCIERA ===
 
  doc.moveDown(0.5);
  const valoresTable = {
    headers: ['Concepto', 'Valor (L.)'],
    rows: [
      ['Valor sin impuesto (15% ISV)', `L. ${parseFloat(orden.valorSinImpuesto).toFixed(2)}`],
      ['Impuesto (15%)', `L. ${(parseFloat(orden.valorSinImpuesto) * 0.15).toFixed(2)}`],
      ['', ''],
      ['Costo total', `L. ${parseFloat(orden.costoTotal).toFixed(2)}`],
      ['Costo en el Período', `L. ${parseFloat(orden.costoPeriodo).toFixed(2)}`]
    ]
  };
  checkPageBreak(120);
  const valoresTableWidth = 300;
  const valoresTableX = (595.28 - valoresTableWidth) / 2;
  drawTable(doc, valoresTable, valoresTableX, doc.y, valoresTableWidth, 20);
  doc.moveDown(2);

  // Lugar y fecha
  const margenIzq = 50;
  doc.fontSize(12).font('Helvetica-Bold')
     .text(`Lugar y Fecha: Comayagua, ${new Date().toLocaleDateString('es-HN')}`, margenIzq, doc.y, { continued: true })
     .text(`     |   Al aire: ${orden.periodoInicio}`);
  doc.moveDown(2);


  doc.moveDown(1);
  const startX = 50;
  const endX = 545;
  const signatureWidth = 200;
  const signatureHeight = 80;
  const currentY = doc.y + 20;
  doc.fontSize(8).font('Helvetica-Bold')
     .text('Aprobado por:', startX, currentY);
  doc.rect(startX, currentY + 12, signatureWidth, signatureHeight).stroke();
  doc.fontSize(8).font('Helvetica')
     .text('Por Canal 40', startX + 5, currentY + 17)
     .text('Sello y Firma', startX + 5, currentY + 30);
  doc.fontSize(8).font('Helvetica-Bold')
     .text('Firma del Cliente:', endX - signatureWidth, currentY);
  doc.rect(endX - signatureWidth, currentY + 12, signatureWidth, signatureHeight).stroke();
  doc.fontSize(8).font('Helvetica')
     .text('Nombre y Firma', endX - signatureWidth + 5, currentY + 17);
  // Ajustamos cursor para no sobreescribir
  doc.moveDown(4);

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
        },
        {
          model: require('../../modelos/programacion/OrdenProgramacion'),
          as: 'pautasProgramacion',
          include: [
            {
              model: require('../../modelos/programacion/Programa'),
              as: 'Programa'
            }
          ]
        }
      ]  
    });  
      
    if (!orden) return res.status(404).json({ mensaje: 'Orden de publicidad no encontrada' });  

    // Obtener información de programación desde las pautas
    let programacion = [];
    if (orden.pautasProgramacion && orden.pautasProgramacion.length > 0) {
      programacion = orden.pautasProgramacion.map(pauta => ({
        programa: pauta.Programa,
        duracionPauta: pauta.duracionPauta,
        diasEmision: pauta.diasEmision,
        cantidadSpots: pauta.cantidadSpots,
        fechaInicio: pauta.fechaInicio,
        fechaFin: pauta.fechaFin,
        estado: pauta.estado,
        precioSpot: pauta.precioSpot
      }));
    }

    const nombreArchivo = await generarOrdenPDF(orden, orden.Cliente, programacion);  
      
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
  console.log('🔍 Intentando visualizar PDF para orden ID:', id);
  console.log('🔑 Usuario autenticado:', req.user);
  
  try {  
    const orden = await OrdenPublicidad.findByPk(id);  
    if (!orden) {
      console.log('❌ Orden no encontrada');
      return res.status(404).json({ mensaje: 'Orden de publicidad no encontrada' });  
    }
    
    console.log('📋 Orden encontrada:', {
      id: orden.idOrden,
      archivo_pdf: orden.archivo_pdf,
      estado: orden.estado
    });
      
    if (!orden.archivo_pdf) {  
      console.log('❌ No hay archivo PDF asociado a esta orden');
      return res.status(404).json({ mensaje: 'PDF no encontrado para esta orden' });  
    }  
      
    const rutaPDF = path.join(__dirname, '../../uploads', orden.archivo_pdf);  
    console.log('📁 Ruta del PDF:', rutaPDF);
      
    if (!fs.existsSync(rutaPDF)) {  
      console.log('❌ Archivo PDF no existe en el servidor');
      return res.status(404).json({ mensaje: 'Archivo PDF no encontrado en el servidor' });  
    }
    
    console.log('✅ Archivo PDF encontrado, enviando respuesta');
      
    res.setHeader('Content-Type', 'application/pdf');  
    res.setHeader('Content-Disposition', 'inline; filename=' + orden.archivo_pdf);  
      
    const stream = fs.createReadStream(rutaPDF);  
    stream.pipe(res);  
  } catch (error) {  
    console.error('💥 Error en visualizarPDF:', error);
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

// Obtener programas disponibles para pautas de publicidad
const obtenerProgramasDisponibles = async (req, res) => {
  try {
    const Programa = require('../../modelos/programacion/Programa');
    
    const programas = await Programa.findAll({
      where: { estado: 'Activo' },
      attributes: ['idPrograma', 'nombre', 'horaInicio', 'tipoCalendario', 'categoria'],
      order: [['horaInicio', 'ASC']]
    });
    
    res.json(programas);
  } catch (error) {
    console.error('Error obteniendo programas disponibles:', error);
    res.status(500).json({ 
      mensaje: 'Error al obtener programas disponibles', 
      error: error.message 
    });
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
  eliminarOrden,
  obtenerProgramasDisponibles
};