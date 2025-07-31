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

const clientesDisponibles = [
  "EXCELL PUBLICIDAD Y MERCADEO S.A. DE C.V.",
  "CLIENTE XYZ S.A.",
  "BANCO DEL PAÍS S.A.",
];

const pautasPorCliente = {
  "EXCELL PUBLICIDAD Y MERCADEO S.A. DE C.V.": [
    { horaInicio: "07:25 A.M.", horaFin: "07:45 A.M.", programa: "60 MINUTOS" },
    { horaInicio: "10:00 A.M.", horaFin: "10:15 A.M.", programa: "PELÍCULA MATUTINA" },
    { horaInicio: "10:30 A.M.", horaFin: "10:45 A.M.", programa: "PELÍCULA MATUTINA" },
    { horaInicio: "11:15 A.M.", horaFin: "11:45 A.M.", programa: "USTED Y SU MEDICO" },
    { horaInicio: "12:10 M.", horaFin: "12:25 M.", programa: "TV NOTICAS 40 MERIDIANO" },
    { horaInicio: "02:30 P.M.", horaFin: "03:00 P.M.", programa: "VIVA LA MÚSICA" },
    { horaInicio: "03:30 P.M.", horaFin: "04:00 P.M.", programa: "VIVA LA MÚSICA" },
    { horaInicio: "05:15 P.M.", horaFin: "05:30 P.M.", programa: "DOCUMENTALES" },
    { horaInicio: "06:10 P.M.", horaFin: "06:25 P.M.", programa: "TV NOTICIAS 40" },
    { horaInicio: "08:00 P.M.", horaFin: "08:30 P.M.", programa: "NOCHE" },
    { horaInicio: "09:00 P.M.", horaFin: "09:30 P.M.", programa: "NOCHE" },
    { horaInicio: "09:30 P.M.", horaFin: "10:00 P.M.", programa: "NOCHE" },
  ],
  "BANCO DEL PAÍS S.A.": [
    { horaInicio: "20:00", horaFin: "20:30", programa: "Entretenimiento Nocturno" },
  ],
};

export default function PautaCanal40Editable() {
  const [cliente, setCliente] = useState(clientesDisponibles[0]);
  const [pautaActual, setPautaActual] = useState(
    pautasPorCliente[clientesDisponibles[0]] || []
  );

  const handleClienteChange = (e) => {
    const clienteSeleccionado = e.target.value;
    setCliente(clienteSeleccionado);
    setPautaActual(pautasPorCliente[clienteSeleccionado] || []);
  };

  const handleDownloadPDF = async () => {
    if (pautaActual.length === 0) return;

    const pdf = new jsPDF("p", "mm", "a4");
    const margin = 15;

    // Encabezado con imagen
    const headerImg = new Image();
    headerImg.src = Encabezado;
    await new Promise((resolve) => (headerImg.onload = resolve));

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const contentWidth = pdfWidth - margin * 2;
    const aspectRatio = headerImg.width / headerImg.height;
    const headerHeight = contentWidth / aspectRatio;

    pdf.addImage(headerImg, "JPEG", margin, margin, contentWidth, headerHeight);

    // Título
    const startY = margin + headerHeight + 10;
    pdf.setFontSize(20).setFont("helvetica", "bold");
    pdf.text("H O R A R I O  D E  P A U T A", pdfWidth / 2, startY, { align: "center" });

    // Datos con sangría y subrayado solo en el valor
    const infoStart = startY + 12;
    pdf.setFontSize(14);

    const datos = [
      ["CLIENTE:", cliente],
      ["PRODUCTO:", "PAUTA PUBLICITARIA"],
      ["VERSIÓN:", "VARIAS"],
      ["PERIODO:", "MENSUAL"],
    ];

    let y = infoStart;
    const valorX = margin + 40; // alineación de valores

    datos.forEach(([label, valor]) => {
      // Etiqueta
      pdf.setFont("helvetica", "bold");
      pdf.text(label, margin, y);

      // Valor con subrayado
      pdf.setFont("helvetica", "normal");
      pdf.text(valor, valorX, y);
      const valorAncho = pdf.getTextWidth(valor);
      pdf.line(valorX, y + 1, pdf.internal.pageSize.getWidth() - margin, y + 1);
      y += 8;
    });

    // Espacio con tabla
    y += 5;

    // Tabla
    autoTable(pdf, {
      startY: y,
      head: [["Hora", "Programa"]],
      body: pautaActual.map((b) => [`${b.horaInicio} - ${b.horaFin}`, b.programa]),
      styles: { fontSize: 10, cellPadding: 3 },
      headStyles: { fillColor: [200, 230, 255], textColor: 0 }, // azul más suave
      margin: { left: margin, right: margin },
      theme: "grid",
    });

    // Firma centrada con línea
    const pageHeight = pdf.internal.pageSize.getHeight();
    pdf.setFontSize(12);
    pdf.line(pdfWidth / 2 - 40, pageHeight - 30, pdfWidth / 2 + 40, pageHeight - 30);
    pdf.text("Firma Responsable", pdfWidth / 2, pageHeight - 25, { align: "center" });

    // Numeración
    const pageCount = pdf.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      pdf.setPage(i);
      pdf.setFontSize(10);
      pdf.text(`Página ${i} de ${pageCount}`, pdfWidth / 2, pageHeight - 10, { align: "center" });
    }

    pdf.save(`Pauta_${cliente}.pdf`);
  };

  return (
    <>
      <div className="header bg-gradient-info pb-7 pt-5 pt-md-8 d-print-none">
        <Container fluid>
          <Row className="justify-content-center mb-4">
            <Col xl="10" className="text-center"></Col>
          </Row>
        </Container>
      </div>

      <Container className="mt--7" fluid>
        <Row className="justify-content-center">
          <Col xl="10">
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

            {pautaActual.length > 0 ? (
              <Card className="shadow card-hover">
                <CardHeader className="bg-info text-white text-center">
                  <h1>Pauta Vigente</h1>
                </CardHeader>
                <CardBody>
                  <Table bordered>
                    <thead style={{ backgroundColor: "#c8e6ff" }}>
                      <tr>
                        <th>HORA</th>
                        <th>PROGRAMA</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pautaActual.map((b, i) => (
                        <tr key={i}>
                          <td>{b.horaInicio} - {b.horaFin}</td>
                          <td>{b.programa}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>

                  <div className="text-center mt-3">
                    <Button color="success" onClick={handleDownloadPDF}>
                      Descargar Pauta
                    </Button>
                  </div>
                </CardBody>
              </Card>
            ) : (
              <Card className="shadow card-hover">
                <CardHeader className="bg-warning text-white text-center">
                  <h3>No hay pauta vigente para este cliente</h3>
                </CardHeader>
                <CardBody className="text-center">
                  <p>El cliente seleccionado no tiene pauta publicitaria activa en este momento.</p>
                  <Button color="danger" disabled>Descargar Pauta</Button>
                </CardBody>
              </Card>
            )}
          </Col>
        </Row>
      </Container>
    </>
  );
}
