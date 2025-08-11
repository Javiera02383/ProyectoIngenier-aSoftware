const Factura = require('../../modelos/facturacion/Factura');
const db = require('../../configuraciones/db');
const FacturaDetalle = require('../../modelos/facturacion/FacturaDetalle');
const DetalleDescuento = require('../../modelos/facturacion/DetalleDescuento');
const Cliente = require('../../modelos/gestion_cliente/Cliente');
const CAI = require('../../modelos/facturacion/Cai'); 
const OrdenPublicidad = require('../../modelos/programacion/OrdenPublicidad'); // Importar aquí para evitar dependencia circular

const PDFDocument = require('pdfkit');
const path = require('path');
const fs = require('fs');

// Configuración para formateo de números
const formatearNumero = new Intl.NumberFormat('es-HN', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
});

const Empleado = require('../../modelos/gestion_cliente/Empleado');  
const Persona = require('../../modelos/seguridad/Persona');  

//validaciones
const { body, validationResult } = require('express-validator');

exports.validarCrearFacturaCompleta = [

  body('factura.idCliente')
    .notEmpty().withMessage('idCliente es obligatorio')
    .isInt({ gt: 0 }).withMessage('Debe ser un número entero positivo'),

  body('factura.idFormaPago')
    .notEmpty().withMessage('idFormaPago es obligatorio')
    .isInt({ gt: 0 }).withMessage('Debe ser un número entero positivo'),

  body('factura.idEmpleado')
    .notEmpty().withMessage('idEmpleado es obligatorio')
    .isInt({ gt: 0 }).withMessage('Debe ser un número entero positivo'),

  body('factura.Tipo_documento')
    .optional()
    .isString().withMessage('Tipo_documento debe ser texto')
    .isLength({ max: 45 }).withMessage('Máximo 45 caracteres'),

  body('factura.Fecha')
    .optional()
    .isISO8601().withMessage('Debe ser una fecha válida'),

  body('factura.Total_Facturado')
    .optional()
    .isFloat({ gt: 0 }).withMessage('Total_Facturado debe ser un número positivo'),

  body('factura.estadoFactura')
    .optional()
    .isIn(['activa', 'anulada']).withMessage('estadoFactura debe ser "activa" o "anulada"'),

  // Validaciones básicas para los arrays
  body('detalles')
    .isArray({ min: 1 }).withMessage('Debes enviar al menos un detalle'),

  body('descuentos')
    .optional()
    .isArray().withMessage('descuentos debe ser un arreglo'),

  
];

// Middleware para manejar errores
exports.manejarErrores = (req, res, next) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }
  next();
};

exports.obtenerSiguienteNumeroFactura = async (req, res) => {  
  try {  
    const ultimaFactura = await Factura.findOne({  
      order: [['idFactura', 'DESC']],  
      attributes: ['idFactura']  
    });  
      
    const siguienteNumero = ultimaFactura ? ultimaFactura.idFactura + 1 : 1;  
      
    res.json({ siguienteNumero });  
  } catch (error) {  
    console.error(error);  
    res.status(500).json({ mensaje: 'Error al obtener siguiente número de factura', error: error.message });  
  }  
};


// Crear una factura simple
exports.crearFactura = async (req, res) => {
  try {
    const factura = await Factura.create(req.body);

    // --- Generar PDF de la factura aquí ---
    // Por ejemplo, usando pdfkit o cualquier otra librería
    // const doc = new PDFDocument();
    // doc.pipe(fs.createWriteStream(rutaPDF));
    // doc.text('Contenido de la factura...');
    // doc.end();

    // Simulación de nombre de archivo PDF
    const nombreArchivo = `factura_${factura.idFactura}.pdf`;
    const rutaPDF = path.join(__dirname, '../../uploads', nombreArchivo);

    // Aquí deberías generar y guardar el PDF en rutaPDF

    // Guardar el nombre del archivo PDF en la factura
    factura.archivo_pdf = nombreArchivo;
    await factura.save();

    res.status(201).json({ mensaje: 'Factura creada', factura });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al crear factura', error: error.message });
  }
};

// Obtener todas las facturas
exports.obtenerFacturas = async (req, res) => {  
  try {  
    const facturas = await Factura.findAll({    
      include: [  
        {    
          model: Cliente,    
          include: [{    
            model: Persona,    
            as: 'persona'    
          }]    
        },  
        {  
          model: OrdenPublicidad,  
          as: 'ordenPublicidad',  
          required: false, // LEFT JOIN para facturas sin orden  
          attributes: ['numeroOrden', 'producto', 'estado', 'costoTotal']  
        }  
      ]    
    });   
       
    res.json({ facturas });  
  } catch (error) {  
    console.error(error);  
    res.status(500).json({ mensaje: 'Error al obtener facturas', error: error.message });  
  }  
};

// Obtener factura por ID
exports.obtenerFacturaPorId = async (req, res) => {
  try {
    const factura = await Factura.findByPk(req.params.id);
    if (!factura) return res.status(404).json({ mensaje: 'Factura no encontrada' });
    res.json({ factura });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener factura', error: error.message });
  }
};

// Editar una factura
exports.editarFactura = (req, res) => {
  return res.status(403).json({
    mensaje: 'Prohibido: Las facturas no pueden ser modificadas según regulación de la SAR. Deben ser anuladas.'
  });
};



// Anular una factura (estadoFactura = 'anulada')
exports.anularFactura = async (req, res) => {
  try {
    const factura = await Factura.findByPk(req.params.id);

    if (!factura) return res.status(404).json({ mensaje: 'Factura no encontrada' });

    if (factura.estadoFactura === 'anulada') {
      return res.status(400).json({ mensaje: 'La factura ya está anulada' });
    }

    factura.estadoFactura = 'anulada';
    await factura.save();

    res.json({ mensaje: 'Factura anulada correctamente', factura });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al anular factura', error: error.message });
  }
};
  
  
// ------------------------------------------------------------------------------------------  
// Configurar formateadores de moneda hondureña    
const formatearMoneda = new Intl.NumberFormat('es-HN', {    
  style: 'currency',    
  currency: 'HNL',    
  minimumFractionDigits: 2,    
  maximumFractionDigits: 2    
});    
    
// ------------------------------------------------------------------------------------------    
// Función para convertir números a letras (agregar al inicio del archivo)  
function convertirNumeroALetras(numero) {  
  const unidades = ['', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve'];  
  const decenas = ['', '', 'veinte', 'treinta', 'cuarenta', 'cincuenta', 'sesenta', 'setenta', 'ochenta', 'noventa'];  
  const especiales = ['diez', 'once', 'doce', 'trece', 'catorce', 'quince', 'dieciséis', 'diecisiete', 'dieciocho', 'diecinueve'];  
  const centenas = ['', 'ciento', 'doscientos', 'trescientos', 'cuatrocientos', 'quinientos', 'seiscientos', 'setecientos', 'ochocientos', 'novecientos'];  
  
  if (numero === 0) return 'cero lempiras exactos';  
  if (numero === 1) return 'un lempira exacto';  
  
  let entero = Math.floor(numero);  
  let decimal = Math.round((numero - entero) * 100);  
  
  function convertirGrupo(num) {  
    if (num === 0) return '';  
    if (num === 100) return 'cien';  
      
    let resultado = '';  
    let c = Math.floor(num / 100);  
    let d = Math.floor((num % 100) / 10);  
    let u = num % 10;  
  
    if (c > 0) resultado += centenas[c];  
    if (d === 1 && u > 0) {  
      resultado += (resultado ? ' ' : '') + especiales[u];  
    } else {  
      if (d > 0) {  
        if (d === 2 && u > 0) {  
          resultado += (resultado ? ' ' : '') + 'veinti' + unidades[u];  
        } else {  
          resultado += (resultado ? ' ' : '') + decenas[d];  
          if (u > 0) resultado += ' y ' + unidades[u];  
        }  
      } else if (u > 0) {  
        resultado += (resultado ? ' ' : '') + unidades[u];  
      }  
    }  
    return resultado;  
  }  
  
  let resultado = '';  
    
  if (entero >= 1000000) {  
    let millones = Math.floor(entero / 1000000);  
    resultado += millones === 1 ? 'un millón' : convertirGrupo(millones) + ' millones';  
    entero %= 1000000;  
  }  
  
  if (entero >= 1000) {  
    let miles = Math.floor(entero / 1000);  
    resultado += (resultado ? ' ' : '') + (miles === 1 ? 'mil' : convertirGrupo(miles) + ' mil');  
    entero %= 1000;  
  }  
  
  if (entero > 0) {  
    resultado += (resultado ? ' ' : '') + convertirGrupo(entero);  
  }  
  
  resultado += entero === 1 ? ' lempira' : ' lempiras';  
    
  if (decimal > 0) {  
    resultado += ' con ' + convertirGrupo(decimal) + (decimal === 1 ? ' centavo' : ' centavos');  
  } else {  
    resultado += ' exactos';  
  }  
  
  return resultado.charAt(0).toUpperCase() + resultado.slice(1);  
}  
  
exports.crearFacturaCompleta = async (req, res) => {        
  const t = await db.transaction();        
        
  try {        
    let { factura, detalles, descuentos } = req.body;        
        
    descuentos = descuentos && descuentos.length > 0        
      ? descuentos        
      : [{ idDescuento: 0, monto: 0 }];        
      
    if (!factura.Fecha) {    
      factura.Fecha = new Date();    
    }    
    const nuevaFactura = await Factura.create(factura, { transaction: t });  
        
    for (let d of detalles) {      
      d.idFactura = nuevaFactura.idFactura;      
    }      
    await FacturaDetalle.bulkCreate(detalles, { transaction: t });        
        
    for (let d of descuentos) {        
      d.idFactura = nuevaFactura.idFactura;        
    }        
    await DetalleDescuento.bulkCreate(descuentos, { transaction: t });        
        
    // Obtener datos completos  
    const cliente = await Cliente.findByPk(nuevaFactura.idCliente, {        
      include: [{ model: Persona, as: 'persona' }]        
    });        
        
    const empleado = await Empleado.findByPk(nuevaFactura.idEmpleado, {        
      include: [{ model: Persona, as: 'persona' }]        
    });        
  
    const caiActivo = await CAI.findOne({     
      where: { activo: true },    
      order: [['fechaEmision', 'DESC']]    
    });    
        
    if (!caiActivo) {    
      throw new Error('No hay CAI activo configurado');    
    }  
        
    const ProductoModel = require('../../modelos/productos/ProductoModel');          
    const detallesConProductos = await Promise.all(            
      detalles.map(async (detalle) => {            
        const producto = await ProductoModel.findByPk(detalle.idProducto);          
        return { ...detalle, producto: producto };            
      })            
    );     
    // ------------------------------------------------------------------------------------------------------------    
    // --- Generar PDF corregido para Canal 40 ---        
    const nombreArchivo = `factura_${nuevaFactura.idFactura}.pdf`;        
    const rutaPDF = path.join(__dirname, '../../uploads', nombreArchivo);        
        
    const doc = new PDFDocument({ 
      size: 'A4', 
      margin: 40,
      info: {
        Title: `Factura ${nuevaFactura.idFactura}`,
        Author: 'Canal 40',
        Subject: 'Factura Comercial',
        Keywords: 'factura, canal 40, publicidad',
        Creator: 'Sistema de Facturación Canal 40'
      }
    });          
    doc.pipe(fs.createWriteStream(rutaPDF));          
      
    // FONDO DEL ENCABEZADO
    doc.rect(0, 0, 595, 240)
      .fill('##758384'); // Negro profundo
    
    // LOGO DEL CANAL (lado izquierdo)
    const logoPath = path.join(__dirname, '../../img/logoCanal.png');
    if (fs.existsSync(logoPath)) {
      doc.image(logoPath, 20, 20, { width: 80, height: 80 });
    } else {
      // Si no hay logo, crear un placeholder
      doc.rect(20, 20, 80, 80)
        .fill('#ffffff')
        .fontSize(12)
        .font('Helvetica-Bold')
        .fill('#1a1a1a')
        .text('CANAL 40', 25, 55);
    }
      
    // ENCABEZADO DE LA EMPRESA (en blanco sobre fondo azul)  
    doc.fill('#ffffff')
      .fontSize(24).font('Helvetica-Bold')  
      .text('TELEVISIÓN COMAYAGUA', 120, 30)
      .fontSize(20)
      .text('CANAL 40', 120, 55);  
      
    doc.fontSize(10).font('Helvetica')  
      .text('COLONIA SAN MIGUEL N°2, BOULEVARD DEL SUR', 120, 80)  
      .text('CONTIGUO A RESTAURANTE LO DE KERPO,', 120, 93)  
      .text('COMAYAGUA, COMAYAGUA, HONDURAS, C.A.', 120, 106);
      
    // Información de contacto en columnas
    doc.fontSize(9)
      .text('Tel: 2772-7427 / 2770-6810', 120, 125)
      .text(' Cel: 9957-4580', 120, 138)
      .text('E-mail: televisioncomayagua@yahoo.com', 120, 151)
      .text(`RTN: ${caiActivo.rtnEmpresa}`, 120, 164)
      .text('Propietario: José Dolores Gámez Suazo', 120, 177);  
  
  
    // SECCIÓN DE TÍTULO DE FACTURA
    doc.moveDown(3);
    
    // Fondo para el título
    doc.rect(50, 200, 495, 60)
      .fill('#f8fafc')
      .stroke('#e2e8f0');
    
    // TÍTULO FACTURA          
    doc.fill('#1a1a1a')
      .fontSize(24).font('Helvetica-Bold')          
      .text('FACTURA', 200, 215, { align: 'center' });  
      
    // Tipo de factura  
    doc.fill('#475569')
      .fontSize(12).font('Helvetica-Bold')  
      .text('Contado', 200, 245, { align: 'center' });
    
    // Línea decorativa
    doc.moveTo(100, 270).lineTo(495, 270)
      .stroke('#1a1a1a', 2);          
              
    // INFORMACIÓN DE LA FACTURA (Lado izquierdo)        
    const facturaY = 290;        
    
    // Fondo para información de factura
    doc.rect(50, facturaY - 10, 220, 120)
      .fill('#f8f9fa')
      .stroke('#6c757d');
    
    doc.fill('#1a1a1a')
      .fontSize(12).font('Helvetica-Bold')        
      .text('INFORMACIÓN DE LA FACTURA', 60, facturaY);        
    
    doc.fill('#475569')
      .fontSize(10).font('Helvetica-Bold')        
      .text('Factura No:', 60, facturaY + 20)        
      .font('Helvetica')        
      .text(`000-001-01-000-${nuevaFactura.idFactura.toString().padStart(5, '0')}`, 130, facturaY + 20);        
            
    doc.font('Helvetica-Bold')        
      .text('CAI:', 60, facturaY + 35)        
      .font('Helvetica')        
      .text(caiActivo.codigoCAI, 130, facturaY + 35);        
            
    doc.font('Helvetica-Bold')        
      .text('Fecha/Emisión:', 60, facturaY + 50)        
      .font('Helvetica')        
      .text(new Date(nuevaFactura.Fecha).toLocaleDateString('es-HN'), 130, facturaY + 50);        
            
    // DATOS DEL EMPLEADO        
    const empleadoPersona = empleado?.persona;        
    const nombreEmpleado = empleadoPersona ?         
      `${empleadoPersona.Pnombre} ${empleadoPersona.Snombre || ''} ${empleadoPersona.Papellido} ${empleadoPersona.Sapellido || ''}`.trim() : 'N/A';        
            
    doc.font('Helvetica-Bold')        
      .text('Atendido por:', 60, facturaY + 65)        
      .font('Helvetica')        
      .text(nombreEmpleado, 130, facturaY + 65);        
            
    // DATOS DEL CLIENTE (Lado derecho) - MEJORADOS        
    const clientePersona = cliente?.persona;        
    
    // Determinar nombre del cliente según tipo de persona
    let nombreCliente = 'N/A';
    if (clientePersona) {
      if (clientePersona.tipoPersona === 'comercial') {
        nombreCliente = clientePersona.razonSocial || clientePersona.nombreComercial || 'N/A';
      } else {
        nombreCliente = `${clientePersona.Pnombre} ${clientePersona.Snombre || ''} ${clientePersona.Papellido} ${clientePersona.Sapellido || ''}`.trim();
      }
    }
    
    // Fondo para información del cliente
    doc.rect(300, facturaY - 10, 245, 120)
      .fill('#e9ecef')
      .stroke('#495057');
    
    doc.fill('#1a1a1a')
      .fontSize(12).font('Helvetica-Bold')        
      .text('INFORMACIÓN DEL CLIENTE', 310, facturaY);
            
    doc.fill('#1a1a1a')
      .fontSize(10).font('Helvetica-Bold')        
      .text('Cliente:', 310, facturaY + 20)        
      .font('Helvetica')        
      .text(nombreCliente, 370, facturaY + 20);        
            
    // RTN/DNI DEL CLIENTE        
    let identificacionCliente = 'N/A';
    if (clientePersona) {
      if (clientePersona.tipoPersona === 'comercial') {
        identificacionCliente = clientePersona.rtn || 'N/A';
      } else {
        identificacionCliente = clientePersona.DNI || 'N/A';
      }
    }
    
    const etiquetaIdentificacion = clientePersona?.tipoPersona === 'comercial' ? 'RTN:' : 'DNI:';
    const tieneIdentificacion = identificacionCliente && identificacionCliente !== 'N/A';
            
    doc.fill('#1a1a1a')
      .font('Helvetica-Bold')        
      .text(etiquetaIdentificacion, 310, facturaY + 35)        
      .font('Helvetica')        
      .text(identificacionCliente, 370, facturaY + 35);        
      
    // CAMPOS ESPECÍFICOS PARA TV - TODOS LOS CAMPOS INCLUIDOS  
    let currentYY = facturaY + 50;    
      
          // Agencia/Nombre Comercial (SIEMPRE mostrar)  
      doc.fill('#1a1a1a')
        .font('Helvetica-Bold')    
        .text('Agencia:', 310, currentYY)    
        .font('Helvetica')    
        .text(nuevaFactura.agencia || 'N/A', 400, currentYY);    
      currentYY += 15;    
        
      // Producto del Cliente (SIEMPRE mostrar)  
      doc.fill('#1a1a1a')
        .font('Helvetica-Bold')    
        .text('Producto Cliente:', 310, currentYY)    
        .font('Helvetica')    
        .text(nuevaFactura.mencion || 'N/A', 400, currentYY);    
      currentYY += 15;    
        
      // Mención (SIEMPRE mostrar)  
      doc.fill('#1a1a1a')
        .font('Helvetica-Bold')    
        .text('Mención:', 310, currentYY)    
        .font('Helvetica')    
        .text(nuevaFactura.mencion || 'N/A', 400, currentYY);    
      currentYY += 15;    
        
      // Tipo de Servicio (SIEMPRE mostrar)  
      doc.fill('#1a1a1a')
        .font('Helvetica')    
        .text('Tipo Servicio:', 310, currentYY)    
        .text(nuevaFactura.tipoServicio || 'N/A', 400, currentYY);    
      currentYY += 15;    
      
          // Período (SIEMPRE mostrar)  
      let periodoTexto = 'N/A';  
      if (nuevaFactura.periodoInicio && nuevaFactura.periodoFin) {    
        periodoTexto = `Del ${new Date(nuevaFactura.periodoInicio).toLocaleDateString('es-HN')} al ${new Date(nuevaFactura.periodoFin).toLocaleDateString('es-HN')}`;    
      } else if (nuevaFactura.periodoInicio) {  
        periodoTexto = `Desde: ${new Date(nuevaFactura.periodoInicio).toLocaleDateString('es-HN')}`;  
      } else if (nuevaFactura.periodoFin) {  
        periodoTexto = `Hasta: ${new Date(nuevaFactura.periodoFin).toLocaleDateString('es-HN')}`;  
      }  
        
      doc.fill('#1a1a1a')
        .font('Helvetica-Bold')    
        .text('Período:', 310, currentYY)    
        .font('Helvetica')    
        .text(periodoTexto, 400, currentYY);    
      currentYY += 15;    
        
      // Orden No (SIEMPRE mostrar)  
      doc.fill('#1a1a1a')
        .font('Helvetica-Bold')    
        .text('Orden No:', 310, currentYY)    
        .font('Helvetica')    
        .text(nuevaFactura.ordenNo || 'N/A', 400, currentYY);    
      currentYY += 15;    
      
    // SECCIÓN DE DATOS DE EXONERACIÓN - SIEMPRE MOSTRAR  
    const exoneracionY = currentYY + 30;  
    
    // Fondo para la sección de exoneración
    doc.rect(50, exoneracionY - 10, 495, 40)
      .fill('#f8f9fa')
      .stroke('#495057');
    
    doc.fill('#1a1a1a')
      .fontSize(10).font('Helvetica-Bold')    
      .text('DATOS ADQUIRIDOS EXONERADOS:', 60, exoneracionY);  
  
    // Todos los datos de exoneración en una sola línea  
    const datosExoneracion = [  
      `Orden Compra Exenta: ${nuevaFactura.ordenCompraExenta || 'N/A'}`,  
      `No. Registro SAG: ${nuevaFactura.numeroRegistroSAG || 'N/A'}`,  
      `Constancia Exonerado: ${nuevaFactura.constanciaExonerado || 'N/A'}`  
    ].join(' | ');  
      
    doc.fill('#1a1a1a')
      .font('Helvetica')  
      .fontSize(8)  
      .text(datosExoneracion, 60, exoneracionY + 15, { width: 475 });       
            
    // TABLA DE PRODUCTOS/SERVICIOS        
    const tableTop = exoneracionY + 60;        
    const itemCodeX = 50;        
    const descriptionX = 120;        
    const quantityX = 320;        
    const priceX = 380;        
    const totalX = 480;        
    
    // Fondo del encabezado de tabla
    doc.rect(itemCodeX - 5, tableTop - 10, 500, 25)
      .fill('#1a1a1a')
      .stroke('#1a1a1a');
            
    // Encabezados de tabla        
    doc.fill('#758384')
      .fontSize(10).font('Helvetica-Bold');        
    doc.text('CÓDIGO', itemCodeX, tableTop);        
    doc.text('DESCRIPCIÓN', descriptionX, tableTop);        
    doc.text('CANT.', quantityX, tableTop);        
    doc.text('P. UNIT.', priceX, tableTop);        
    doc.text('TOTAL', totalX, tableTop);        
            
    // Línea bajo encabezados        
    doc.moveTo(itemCodeX, tableTop + 15).lineTo(550, tableTop + 15).stroke('#ffffff', 2);        
            
    // ITERAR SOBRE LOS DETALLES REALES DE LA FACTURA      
    let currentY = tableTop + 25;        
    doc.fontSize(9).font('Helvetica');        
            
    for (let i = 0; i < detallesConProductos.length; i++) {      
      const detalle = detallesConProductos[i];      
      const producto = detalle.producto;      
      
      // Fondo alternado para las filas
      const rowColor = i % 2 === 0 ? '#f8fafc' : '#ffffff';
      doc.rect(itemCodeX - 5, currentY - 5, 500, 20)
        .fill(rowColor)
        .stroke('#e2e8f0');
            
      // Validación defensiva para precios usando Intl.NumberFormat    
      const precioReal = Number(producto?.precioVenta || detalle.precioUnitario || 0);    
      const cantidad = Number(detalle.cantidad || 0);    
      const impuestoProducto = Number(producto?.impuesto || 0);    
          
      // Formatear precios usando Intl.NumberFormat    
      const precioFormateado = `L. ${formatearNumero.format(precioReal)}`;    
      const totalLinea = `L. ${formatearNumero.format(cantidad * precioReal)}`;    
            
      doc.fill('#1e293b')
        .text(producto ? producto.idProducto.toString().padStart(3, '0') : (detalle.idProducto || '000').toString().padStart(3, '0'), itemCodeX, currentY);      
      doc.text(producto ? producto.Nombre : 'Producto', descriptionX, currentY);      
      doc.text(cantidad.toString(), quantityX, currentY);      
      doc.text(precioFormateado, priceX, currentY);      
      doc.text(totalLinea, totalX, currentY);      
            
      currentY += 20;      
    }      
            
    // TOTALES          
    const totalsY = currentY + 30;        
    
    // Fondo para la sección de totales
    doc.rect(350, totalsY - 15, 200, 80)
      .fill('#f8f9fa')
      .stroke('#495057');
    
    // Línea separadora
    doc.moveTo(350, totalsY - 10).lineTo(550, totalsY - 10).stroke('#495057', 2);        
            
    // Calcular subtotal con validación usando Intl.NumberFormat      
    const subtotal = detallesConProductos.reduce((sum, detalle) => {        
      const producto = detalle.producto;        
      const precioReal = Number(producto?.precioVenta || detalle.precioUnitario || 0);      
      const cantidad = Number(detalle.cantidad || 0);      
      return sum + (cantidad * precioReal);        
    }, 0);   
            
    const totalDescuentos = descuentos.reduce((sum, desc) => sum + Number(desc.monto || 0), 0);        
    const subtotalConDescuento = subtotal - totalDescuentos;        
            
    // Calcular ISV sobre el subtotal con descuentos (15% estándar en Honduras)        
    const isv = subtotalConDescuento * 0.15;        
    const totalFinal = subtotalConDescuento + isv;        
            
    doc.fill('#1a1a1a')
      .fontSize(10).font('Helvetica-Bold');        
    doc.text('SUBTOTAL:', 400, totalsY);        
    doc.text(`L. ${formatearNumero.format(subtotal)}`, 480, totalsY);        
            
    if (totalDescuentos > 0) {        
      doc.text('DESCUENTOS:', 400, totalsY + 20);        
      doc.text(`L. ${formatearNumero.format(totalDescuentos)}`, 480, totalsY + 20);        
              
      doc.text('ISV (15%):', 400, totalsY + 40);        
      doc.text(`L. ${formatearNumero.format(isv)}`, 480, totalsY + 40);        
              
      doc.fontSize(12).font('Helvetica-Bold');        
      doc.text('TOTAL:', 400, totalsY + 65);        
      doc.text(`L. ${formatearNumero.format(totalFinal)}`, 480, totalsY + 65);        
    } else {        
      doc.text('ISV (15%):', 400, totalsY + 20);        
      doc.text(`L. ${formatearNumero.format(isv)}`, 480, totalsY + 20);        
              
      doc.fontSize(12).font('Helvetica-Bold');        
      doc.text('TOTAL:', 400, totalsY + 45);        
      doc.text(`L. ${formatearNumero.format(totalFinal)}`, 480, totalsY + 45);        
    }      
      
    // Actualizar el Total_Facturado en la factura    
    nuevaFactura.Total_Facturado = totalFinal;    
    await nuevaFactura.save({ transaction: t });  
      
    // INFORMACIÓN LEGAL COMPLETA - SAR usando datos del CAI activo  
    const legalY = totalDescuentos > 0 ? totalsY + 90 : totalsY + 70;  
    
    // Fondo para información legal
    doc.rect(50, legalY - 10, 280, 140)
      .fill('#f8f9fa')
      .stroke('#495057');
      
    doc.fontSize(8).font('Helvetica')    
      .fill('#1a1a1a')
      .text('Esta factura es válida por 30 días', 60, legalY)    
      .text(`Resolución ${caiActivo.resolucionSAR}`, 60, legalY + 15)    
      .text(`CAI: ${caiActivo.codigoCAI}`, 60, legalY + 30)    
      .text(`Rango Autorizado: Del ${caiActivo.numeroFacturaInicio} al ${caiActivo.numeroFacturaFin}`, 60, legalY + 45)    
      .text(`Fecha límite de emisión: ${new Date(caiActivo.fechaVencimiento).toLocaleDateString('es-HN')}`, 60, legalY + 60)    
      .text('Original: Cliente / Copia: Obligación Tributaria', 60, legalY + 75);       
          
    // LEYENDA TERRITORIAL OBLIGATORIA    
    doc.fontSize(9).font('Helvetica-Bold')    
      .fill('#1a1a1a')
      .text('Este documento es válido en todo el territorio nacional', 60, legalY + 95);    
      
    // Agregar cantidad en letras (función que necesitarás implementar)  
    const totalEnLetras = convertirNumeroALetras(totalFinal);  
    doc.fontSize(8).font('Helvetica')  
      .fill('#1a1a1a')
      .text(`Cantidad en letras: ${totalEnLetras}`, 60, legalY + 110);  
        
    // FIRMA Y EMPLEADO - Con fondo mejorado
    doc.rect(350, legalY - 10, 200, 80)
      .fill('#f8f9fa')
      .stroke('#495057');
      
    doc.fill('#1a1a1a')
      .text('_________________________', 380, legalY + 20)    
      .text('Firma Autorizada:', 410, legalY + 35)    
      .fontSize(7).text(`Atendido por: ${nombreEmpleado}`, 380, legalY + 50);   
      
    // FOOTER PROFESIONAL
    const footerY = legalY + 100;
    
    // Línea separadora del footer
    doc.moveTo(50, footerY).lineTo(545, footerY)
      .stroke('#1a1a1a', 2);
    
    // Fondo del footer
    doc.rect(0, footerY + 5, 595, 40)
      .fill('#1a1a1a');
    
    // Información del footer
    doc.fill('##758384')
      .fontSize(8).font('Helvetica')
      .text('© 2025 Televisión Comayagua - Canal 40. Todos los derechos reservados.', 50, footerY + 15)
      .text('Sistema de Facturación Automatizado | Generado el ' + new Date().toLocaleString('es-HN'), 50, footerY + 30);
    
    doc.end();
        
  
    // Guardar el nombre del archivo PDF en la factura  
    nuevaFactura.archivo_pdf = nombreArchivo;  
    await nuevaFactura.save({ transaction: t });  
  
    // 6. Confirmar transacción  
    await t.commit();  
  
    res.status(201).json({  
      mensaje: 'Factura completa registrada con éxito',  
      factura: nuevaFactura  
    });  
  
  } catch (error) {  
    await t.rollback();  
    console.error(error);  
    res.status(500).json({  
      mensaje: 'Error al crear factura completa',  
      error: error.message  
    });  
  }  
};