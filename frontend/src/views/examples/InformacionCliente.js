import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useState } from "react";

import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  FormGroup,
  Input,
  Label,
  Row,
  Table,
} from "reactstrap";

import Encabezado from "assets/img/brand/Encabezado.jpeg";

const clientesDB = [
  // --- Agencias ---
  { nombre: "Claro", categoria: "Agencias", pagoEstado: "Pagado", mesPendiente: "Julio", contratoFinalizado: "No", fechaFinalizacion: "2025-12-31" },
  { nombre: "Casa Presidencial", categoria: "Agencias", pagoEstado: "No pagado", mesPendiente: "Agosto", contratoFinalizado: "No", fechaFinalizacion: "2025-12-31" },
  { nombre: "Gallo más Gallo", categoria: "Agencias", pagoEstado: "Pagado", mesPendiente: "Ninguno", contratoFinalizado: "Sí", fechaFinalizacion: "2025-06-30" },
  { nombre: "Link", categoria: "Agencias", pagoEstado: "No pagado", mesPendiente: "Septiembre", contratoFinalizado: "No", fechaFinalizacion: "2025-12-31" },
  { nombre: "Banpais", categoria: "Agencias", pagoEstado: "Pagado", mesPendiente: "Ninguno", contratoFinalizado: "Sí", fechaFinalizacion: "2024-12-31" },
  { nombre: "Pedidos Ya", categoria: "Agencias", pagoEstado: "No pagado", mesPendiente: "Julio", contratoFinalizado: "No", fechaFinalizacion: "2025-12-31" },

  // --- Locales ---
  { nombre: "Municom", categoria: "Locales", pagoEstado: "Pagado", mesPendiente: "Ninguno", contratoFinalizado: "Sí", fechaFinalizacion: "2024-11-30" },
  { nombre: "Sonria", categoria: "Locales", pagoEstado: "No pagado", mesPendiente: "Agosto", contratoFinalizado: "No", fechaFinalizacion: "2025-10-15" },
  { nombre: "Femol Rita", categoria: "Locales", pagoEstado: "Pagado", mesPendiente: "Ninguno", contratoFinalizado: "Sí", fechaFinalizacion: "2025-05-20" },
  { nombre: "Maconsa", categoria: "Locales", pagoEstado: "No pagado", mesPendiente: "Julio", contratoFinalizado: "No", fechaFinalizacion: "2025-09-12" },
  { nombre: "Empeños el Rey", categoria: "Locales", pagoEstado: "Pagado", mesPendiente: "Ninguno", contratoFinalizado: "Sí", fechaFinalizacion: "2025-03-01" },
  { nombre: "Secopv", categoria: "Locales", pagoEstado: "No pagado", mesPendiente: "Septiembre", contratoFinalizado: "No", fechaFinalizacion: "2025-12-31" },
  { nombre: "Vivero Central", categoria: "Locales", pagoEstado: "Pagado", mesPendiente: "Ninguno", contratoFinalizado: "Sí", fechaFinalizacion: "2024-12-15" },
  { nombre: "Laboratorio Popular", categoria: "Locales", pagoEstado: "No pagado", mesPendiente: "Octubre", contratoFinalizado: "No", fechaFinalizacion: "2025-08-22" },
  { nombre: "Coficesa", categoria: "Locales", pagoEstado: "Pagado", mesPendiente: "Ninguno", contratoFinalizado: "Sí", fechaFinalizacion: "2025-07-10" },
  { nombre: "Queso Olanchano Omar", categoria: "Locales", pagoEstado: "No pagado", mesPendiente: "Noviembre", contratoFinalizado: "No", fechaFinalizacion: "2025-12-31" },

  // --- Políticos ---
  { nombre: "Tito Asfura", categoria: "Políticos", pagoEstado: "Pagado", mesPendiente: "Ninguno", contratoFinalizado: "Sí", fechaFinalizacion: "2024-12-31" },
  { nombre: "Tirzo Ulloa", categoria: "Políticos", pagoEstado: "No pagado", mesPendiente: "Octubre", contratoFinalizado: "No", fechaFinalizacion: "2025-09-30" },
  { nombre: "Virgilio Galán", categoria: "Políticos", pagoEstado: "Pagado", mesPendiente: "Ninguno", contratoFinalizado: "Sí", fechaFinalizacion: "2025-06-30" },
  { nombre: "Yani Rosenthal", categoria: "Políticos", pagoEstado: "No pagado", mesPendiente: "Septiembre", contratoFinalizado: "No", fechaFinalizacion: "2025-12-31" },
];

export default function ReporteClientesCanal40() {
  const clientesDisponibles = clientesDB.map((c) => c.nombre);
  const [cliente, setCliente] = useState(clientesDisponibles[0]);
  const clienteActual = clientesDB.find((c) => c.nombre === cliente);

  const handleClienteChange = (e) => {
    setCliente(e.target.value);
  };

  // 📌 PDF individual
  const handleDownloadPDF = async () => {
    if (!clienteActual) return;

    const pdf = new jsPDF();
    const headerImg = new Image();
    headerImg.src = Encabezado;
    await new Promise((res) => (headerImg.onload = res));

    pdf.addImage(headerImg, "JPEG", 15, 15, 180, 40);
    pdf.setFontSize(20).text("REPORTE DE CLIENTE", 105, 65, { align: "center" });

    autoTable(pdf, {
      startY: 75,
      head: [["Campo", "Valor"]],
      body: [
        ["Cliente", clienteActual.nombre],
        ["Categoría", clienteActual.categoria],
        ["Estado de Pago", clienteActual.pagoEstado],
        ["Mes Pendiente", clienteActual.mesPendiente],
        ["Contrato Finalizado", clienteActual.contratoFinalizado],
        ["Fecha Finalización", clienteActual.fechaFinalizacion],
      ],
      styles: { halign: "center" },
      headStyles: { fillColor: [0, 123, 255] },
    });

    pdf.save(`Reporte_${clienteActual.nombre}.pdf`);
  };

  // 📌 PDF por categoría
  const handleDownloadClientesPorCategoria = async () => {
    const pdf = new jsPDF();
    const headerImg = new Image();
    headerImg.src = Encabezado;
    await new Promise((res) => (headerImg.onload = res));

    pdf.addImage(headerImg, "JPEG", 15, 15, 180, 40);
    pdf.setFontSize(20).text("CLIENTES POR CATEGORÍA", 105, 65, { align: "center" });

    const categorias = [...new Set(clientesDB.map(c => c.categoria))];
    let yPos = 75;

    categorias.forEach(cat => {
      const clientesCat = clientesDB.filter(c => c.categoria === cat);
      autoTable(pdf, {
        startY: yPos,
        head: [[`Categoría: ${cat}`, "Estado", "Mes"]],
        body: clientesCat.map(c => [c.nombre, c.pagoEstado, c.mesPendiente]),
        styles: { halign: "center" },
        headStyles: { fillColor: [0, 200, 100] },
      });
      yPos = pdf.lastAutoTable.finalY + 10;
    });

    pdf.save("Clientes_Por_Categoria.pdf");
  };

  return (
    <>
      <div className="header bg-gradient-info pb-7 pt-5 pt-md-8 d-print-none">
        <Container fluid>
          <Row className="justify-content-center mb-4">
            <Col xl="10"></Col>
          </Row>
        </Container>
      </div>

      <Container className="mt--7" fluid>
        <Row className="justify-content-center">
          <Col xl="10">
            {/* 📌 Card Selección de Cliente */}
            <Card className="shadow mb-4 card-hover">
              <CardHeader className="bg-info text-white text-center">
                <h1>Seleccione Cliente</h1>
              </CardHeader>
              <CardBody>
                <FormGroup>
                  <Label>Cliente</Label>
                  <Input type="select" value={cliente} onChange={handleClienteChange}>
                    {clientesDisponibles.map((c, i) => (
                      <option key={i}>{c}</option>
                    ))}
                  </Input>
                </FormGroup>
              </CardBody>
            </Card>

            {/* 📌 Card Datos del Cliente */}
            {clienteActual && (
              <Card className="shadow card-hover">
                <CardHeader className="bg-info text-white text-center">
                  <h1>Datos del Cliente</h1>
                </CardHeader>
                <CardBody>
                  <Table bordered>
                    <tbody>
                      <tr><th>Categoría</th><td>{clienteActual.categoria}</td></tr>
                      <tr><th>Estado de Pago</th><td>{clienteActual.pagoEstado}</td></tr>
                      <tr><th>Mes Pendiente</th><td>{clienteActual.mesPendiente}</td></tr>
                      <tr><th>Contrato Finalizado</th><td>{clienteActual.contratoFinalizado}</td></tr>
                      <tr><th>Fecha Finalización</th><td>{clienteActual.fechaFinalizacion}</td></tr>
                    </tbody>
                  </Table>
                  <div className="text-center mt-3">
                    <Button color="success" onClick={handleDownloadPDF}>
                      Descargar PDF Cliente
                    </Button>
                  </div>
                </CardBody>
              </Card>
            )}
          </Col>
        </Row>
      </Container>
    </>
  );
}
