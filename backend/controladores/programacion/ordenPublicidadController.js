// controladores/programacion/ordenPublicidadController.js  
const PDFDocument = require('pdfkit');  
const fs = require('fs');  
const path = require('path');  
  
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

    doc.fontSize(14).text('EL PRIMER CANAL DE LA ZONA GENITAL', { align: 'center', underline: true });
    doc.moveDown(1.5);

    doc.fontSize(16).text('ORDEN DE PUBLICIDAD', { align: 'center', bold: true });
    doc.moveDown(1);

    doc.fontSize(10).text('En esta fecha se ordena la transmisión de publicidad, bajo los términos descritos, quedando entendido que cualquier reclamo puede hacerlo en los primeros cinco días a partir de la fecha de inicio de la publicidad, caso contrario esta orden de publicidad se tomará como aceptada.', { align: 'justify' });
    doc.moveDown(2);

    // Tabla de información del cliente
    const clientTable = {
    headers: ['Cliente:', 'Producto:', 'Período de pauta:'],
    rows: [
        ['Lo de Krepo', 'Comidor, Cultures', '3 ~ 65']
    ]
    };

    // Dibujar tabla de cliente
    drawTable(doc, clientTable, 50, doc.y, 500, 30);
    doc.moveDown(2);

    // Horarios de pauta
    doc.fontSize(14).text('Horarios de Pauta', { bold: true });
    doc.moveDown(0.5);

    // Tabla de horarios
    const scheduleTable = {
    headers: ['Programa', 'Horas', 'Domingo', 'Lunes', 'Mares', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
    rows: [
        ['60 MINUTOS', '7 a 8:30 AM', '', '2', '', '', '', '', ''],
        ['Serie cómica', '8:30 a 9 AM', '', '', '', '', '', '', ''],
        ['Película Maturina', '9 a 11 AM', '', '', '', '', '', '', ''],
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

    // Dibujar tabla de horarios (necesitarías una función más compleja para tablas grandes)
    drawComplexTable(doc, scheduleTable, 50, doc.y, 500, 20);
    doc.moveDown(2);

    // Sección de valores
    doc.fontSize(12).text('Valor sin impuesto 15 % ISV');
    doc.text('L. ______');
    doc.text('L. ______');
    doc.text('Costo total');
    doc.text('L. ______');
    doc.text('Costo en el Período');
    doc.text('L. ______');
    doc.moveDown(2);

    // Lugar y fecha
    doc.text('___________________________________________');
    doc.text('Lugar y Fecha:');
    doc.moveDown(1);

    doc.text('Al aire:');
    doc.text('fecha de primer misión — Día ______');
    doc.moveDown(2);

    // Aprobado por
    doc.text('Aprobado por:');
    doc.text('Por Canal 40');

    // Finalizar el PDF
    doc.end();  
    return nombreArchivo;  
    };