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
    
const formatearNumero = new Intl.NumberFormat('es-HN', {    
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
        
    const doc = new PDFDocument({ margin: 50 });          
    doc.pipe(fs.createWriteStream(rutaPDF));          
      
    // LOGO DEL CANAL (lado izquierdo)
    const logoPath = path.join(__dirname, '../../img/logoCanal.png');
    if (fs.existsSync(logoPath)) {
      // pdfkit: image(src, x, y, options)
      doc.image(logoPath, 10, 10, { width: 30, height: 30 });
    } else {
      console.log('Logo no encontrado en la ruta especificada:', logoPath);
    }
      
    // ENCABEZADO DE LA EMPRESA (centrado, al lado del logo)  
    doc.fontSize(16).font('Helvetica-Bold')  
      .text('TELEVISIÓN COMAYAGUA - CANAL 40', 120, 55);  
      
    doc.fontSize(10).font('Helvetica')  
      .text('COLONIA SAN MIGUEL N°2, BOULEVARD DEL SUR', 120, 75)  
      .text('CONTIGUO A RESTAURANTE LO DE KERPO,', 120, 88)  
      .text('COMAYAGUA, COMAYAGUA, HONDURAS, C.A.', 120, 101)  
      .text('Tel: 2772-7427 / 2770-6810 Fax: 2772-6810 Cel: 9957-4580', 120, 114)  
      .text(`Propietario: José Dolores Gámez Suazo   RTN: ${caiActivo.rtnEmpresa}  E-mail: televisioncomayagua@yahoo.com`, 120, 140)  
  
  
    // Línea separadora          
    doc.moveTo(50, 170).lineTo(550, 170).stroke();          
    doc.moveDown(2);          
              
    // TÍTULO FACTURA          
    doc.fontSize(18).font('Helvetica-Bold')          
      .text('FACTURA', { align: 'center' });  
      
    // Tipo de factura  
    doc.fontSize(12).font('Helvetica')  
      .text('Contado', { align: 'center' });  
    doc.moveDown();          
              
    // INFORMACIÓN DE LA FACTURA (Lado izquierdo)        
    const facturaY = doc.y;        
    doc.fontSize(10).font('Helvetica-Bold')        
      .text('Factura No:', 50, facturaY)        
      .font('Helvetica')        
      .text(`000-001-01-000-${nuevaFactura.idFactura.toString().padStart(5, '0')}`, 130, facturaY);        
            
    doc.font('Helvetica-Bold')        
      .text('CAI:', 50, facturaY + 15)        
      .font('Helvetica')        
      .text(caiActivo.codigoCAI, 130, facturaY + 15);        
            
    doc.font('Helvetica-Bold')        
      .text('Fecha de emisión:', 50, facturaY + 30)        
      .font('Helvetica')        
      .text(new Date(nuevaFactura.Fecha).toLocaleDateString('es-HN'), 130, facturaY + 30);        
            
    // DATOS DEL EMPLEADO        
    const empleadoPersona = empleado?.persona;        
    const nombreEmpleado = empleadoPersona ?         
      `${empleadoPersona.Pnombre} ${empleadoPersona.Snombre || ''} ${empleadoPersona.Papellido} ${empleadoPersona.Sapellido || ''}`.trim() : 'N/A';        
            
    doc.font('Helvetica-Bold')        
      .text('Atendido por:', 50, facturaY + 45)        
      .font('Helvetica')        
      .text(nombreEmpleado, 130, facturaY + 45);        
            
    // DATOS DEL CLIENTE (Lado derecho) - MEJORADOS        
    const clientePersona = cliente?.persona;        
    const nombreCliente = clientePersona ?         
      `${clientePersona.Pnombre} ${clientePersona.Snombre || ''} ${clientePersona.Papellido} ${clientePersona.Sapellido || ''}`.trim() : 'N/A';        
            
    doc.font('Helvetica-Bold')        
      .text('Cliente:', 300, facturaY)        
      .font('Helvetica')        
      .text(nombreCliente, 350, facturaY);        
            
    // RTN DEL CLIENTE        
    const rtnCliente = clientePersona?.DNI;        
    const tieneRTN = rtnCliente && rtnCliente.length >= 13;        
            
    doc.font('Helvetica-Bold')        
      .text('RTN:', 300, facturaY + 15)        
      .font('Helvetica')        
      .text(rtnCliente || 'N/A', 350, facturaY + 15);        
      
    // CAMPOS ESPECÍFICOS PARA TV - TODOS LOS CAMPOS INCLUIDOS  
    let currentYY = facturaY + 30;    
      
    // Agencia/Nombre Comercial (SIEMPRE mostrar)  
    doc.font('Helvetica-Bold')    
      .text('Agencia:', 300, currentYY)    
      .font('Helvetica')    
      .text(nuevaFactura.agencia || 'N/A', 400, currentYY);    
    currentYY += 15;    
      
    // Producto del Cliente (SIEMPRE mostrar)  
    doc.font('Helvetica-Bold')    
      .text('Producto Cliente:', 300, currentYY)    
      .font('Helvetica')    
      .text(nuevaFactura.productoCliente || 'N/A', 400, currentYY);    
    currentYY += 15;    
      
    // Mención (SIEMPRE mostrar)  
    doc.font('Helvetica-Bold')    
      .text('Mención:', 300, currentYY)    
      .font('Helvetica')    
      .text(nuevaFactura.mencion || 'N/A', 400, currentYY);    
    currentYY += 15;    
      
    // Tipo de Servicio (SIEMPRE mostrar)  
    doc.font('Helvetica-Bold')    
      .text('Tipo Servicio:', 300, currentYY)    
      .font('Helvetica')    
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
      
    doc.font('Helvetica-Bold')    
      .text('Período:', 300, currentYY)    
      .font('Helvetica')    
      .text(periodoTexto, 400, currentYY);    
    currentYY += 15;    
      
    // Orden No (SIEMPRE mostrar)  
    doc.font('Helvetica-Bold')    
      .text('Orden No:', 300, currentYY)    
      .font('Helvetica')    
      .text(nuevaFactura.ordenNo || 'N/A', 400, currentYY);    
    currentYY += 15;    
      
    // SECCIÓN DE DATOS DE EXONERACIÓN - SIEMPRE MOSTRAR  
    doc.moveDown(2);    
    doc.fontSize(9).font('Helvetica-Bold')    
      .text('DATOS ADQUIRIDOS EXONERADOS:', 50, doc.y);    
      
    let exoneracionY = doc.y + 15;  
  
    // Todos los datos de exoneración en una sola línea  
    const datosExoneracion = [  
      `Orden Compra Exenta: ${nuevaFactura.ordenCompraExenta || 'N/A'}`,  
      `No. Registro SAG: ${nuevaFactura.numeroRegistroSAG || 'N/A'}`,  
      `Constancia Exonerado: ${nuevaFactura.constanciaExonerado || 'N/A'}`  
    ].join(' | ');  
      
    doc.font('Helvetica')  
      .fontSize(8)  
      .text(datosExoneracion, 50, exoneracionY, { width: 500 });  
      
    exoneracionY += 15;
      
    // Ajustar posición para continuar con el resto del PDF  
    doc.y = exoneracionY + 10;    
              
    doc.moveDown(4);       
            
    // TABLA DE PRODUCTOS/SERVICIOS        
    const tableTop = doc.y;        
    const itemCodeX = 50;        
    const descriptionX = 120;        
    const quantityX = 320;        
    const priceX = 380;        
    const totalX = 480;        
            
    // Encabezados de tabla        
    doc.fontSize(9).font('Helvetica-Bold');        
    doc.text('CÓDIGO', itemCodeX, tableTop);        
    doc.text('DESCRIPCIÓN', descriptionX, tableTop);        
    doc.text('CANT.', quantityX, tableTop);        
    doc.text('P. UNIT.', priceX, tableTop);        
    doc.text('TOTAL', totalX, tableTop);        
            
    // Línea bajo encabezados        
    doc.moveTo(itemCodeX, tableTop + 15).lineTo(550, tableTop + 15).stroke();        
            
    // ITERAR SOBRE LOS DETALLES REALES DE LA FACTURA      
    let currentY = tableTop + 25;        
    doc.fontSize(8).font('Helvetica');        
            
    for (let i = 0; i < detallesConProductos.length; i++) {      
      const detalle = detallesConProductos[i];      
      const producto = detalle.producto;      
            
      // Validación defensiva para precios usando Intl.NumberFormat    
      const precioReal = Number(producto?.precioVenta || detalle.precioUnitario || 0);    
      const cantidad = Number(detalle.cantidad || 0);    
      const impuestoProducto = Number(producto?.impuesto || 0);    
          
      // Formatear precios usando Intl.NumberFormat    
      const precioFormateado = `L. ${formatearNumero.format(precioReal)}`;    
      const totalLinea = `L. ${formatearNumero.format(cantidad * precioReal)}`;    
            
      doc.text(producto ? producto.idProducto.toString().padStart(3, '0') : (detalle.idProducto || '000').toString().padStart(3, '0'), itemCodeX, currentY);      
      doc.text(producto ? producto.Nombre : 'Producto', descriptionX, currentY);      
      doc.text(cantidad.toString(), quantityX, currentY);      
      doc.text(precioFormateado, priceX, currentY);      
      doc.text(totalLinea, totalX, currentY);      
            
      currentY += 20;      
    }      
            
    // TOTALES          
    const totalsY = currentY + 30;        
    doc.moveTo(350, totalsY - 10).lineTo(550, totalsY - 10).stroke();        
            
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
            
    doc.fontSize(10).font('Helvetica-Bold');        
    doc.text('SUBTOTAL:', 400, totalsY);        
    doc.text(`L. ${formatearNumero.format(subtotal)}`, 480, totalsY);        
            
    if (totalDescuentos > 0) {        
      doc.text('DESCUENTOS:', 400, totalsY + 15);        
      doc.text(`L. ${formatearNumero.format(totalDescuentos)}`, 480, totalsY + 15);        
              
      doc.text('ISV (15%):', 400, totalsY + 30);        
      doc.text(`L. ${formatearNumero.format(isv)}`, 480, totalsY + 30);        
              
      doc.fontSize(12).font('Helvetica-Bold');        
      doc.text('TOTAL:', 400, totalsY + 50);        
      doc.text(`L. ${formatearNumero.format(totalFinal)}`, 480, totalsY + 50);        
    } else {        
      doc.text('ISV (15%):', 400, totalsY + 15);        
      doc.text(`L. ${formatearNumero.format(isv)}`, 480, totalsY + 15);        
              
      doc.fontSize(12).font('Helvetica-Bold');        
      doc.text('TOTAL:', 400, totalsY + 35);        
      doc.text(`L. ${formatearNumero.format(totalFinal)}`, 480, totalsY + 35);        
    }      
      
    // Actualizar el Total_Facturado en la factura    
    nuevaFactura.Total_Facturado = totalFinal;    
    await nuevaFactura.save({ transaction: t });  
      
    // INFORMACIÓN LEGAL COMPLETA - SAR usando datos del CAI activo  
    const legalY = totalDescuentos > 0 ? totalsY + 80 : totalsY + 65;  
      
    doc.fontSize(8).font('Helvetica')    
      .text('Esta factura es válida por 30 días', 50, legalY)    
      .text(`Resolución ${caiActivo.resolucionSAR}`, 50, legalY + 15)    
      .text(`CAI: ${caiActivo.codigoCAI}`, 50, legalY + 30)    
      .text(`Rango Autorizado: Del ${caiActivo.numeroFacturaInicio} al ${caiActivo.numeroFacturaFin}`, 50, legalY + 45)    
      .text(`Fecha límite de emisión: ${new Date(caiActivo.fechaVencimiento).toLocaleDateString('es-HN')}`, 50, legalY + 60)    
      .text('Original: Cliente / Copia: Obligación Tributaria', 50, legalY + 75);       
          
    // LEYENDA TERRITORIAL OBLIGATORIA    
    doc.fontSize(9).font('Helvetica-Bold')    
      .text('Este documento es válido en todo el territorio nacional', 50, legalY + 95);    
      
    // Agregar cantidad en letras (función que necesitarás implementar)  
    const totalEnLetras = convertirNumeroALetras(totalFinal);  
    doc.fontSize(8).font('Helvetica')  
      .text(`Cantidad en letras: ${totalEnLetras}`, 50, legalY + 110);  
        
    // FIRMA Y EMPLEADO    
    doc.text('_________________________', 400, legalY + 20);    
    doc.text('Firma Autorizada:', 430, legalY + 35);    
    doc.fontSize(7).text(`Atendido por: ${nombreEmpleado}`, 400, legalY + 50);   
      
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