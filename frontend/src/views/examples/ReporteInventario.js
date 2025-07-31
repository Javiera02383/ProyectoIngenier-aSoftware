import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Row,
  Table,
  Spinner,
} from "reactstrap";

import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import axios from "axios";

// ✅ Importar el logo desde assets
import Encabezado from "assets/img/brand/Encabezado.jpeg";

const ReporteInventario = () => {
  const printRef = useRef();
  const navigate = useNavigate();

  const [inventario, setInventario] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:4051/api/optica/inventario/todos", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setInventario(res.data);
        setCargando(false);
      } catch (error) {
        console.error("Error al cargar el inventario", error);
        setCargando(false);
      }
    };
    obtenerDatos();
  }, []);

  const handleDownloadPDF = async () => {
    const pdf = new jsPDF("p", "mm", "a4");
    const margin = 15;

    const headerImg = new Image();
    headerImg.src = Encabezado;
    await new Promise((resolve) => {
      headerImg.onload = resolve;
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const contentWidth = pdfWidth - margin * 2;
    const aspectRatio = headerImg.width / headerImg.height;
    const headerHeight = contentWidth / aspectRatio;

    pdf.addImage(headerImg, "PNG", margin, margin, contentWidth, headerHeight);

    const startY = margin + headerHeight + 10;
    pdf.setFontSize(20);
    pdf.setFont("helvetica", "bold");
    pdf.text("INVENTARIO", pdfWidth / 2, startY, { align: "center" });

    autoTable(pdf, {
      startY: startY + 8,
      head: [["Código", "Nombre", "Descripción", "Cantidad", "Ubicación", "Asignado", "Observación"]],
      body: inventario.map(item => [
        item.codigo,
        item.nombre,
        item.descripcion,
        item.cantidad,
        item.ubicacion,
        item?.Empleado?.Persona ? `${item.Empleado.Persona.Pnombre} ${item.Empleado.Persona.Papellido}` : "No asignado",
        item.observacion,
      ]),
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [41, 128, 185], textColor: 255 },
      theme: "grid",
      margin: { left: margin, right: margin, bottom: margin },
    });

    const pageCount = pdf.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      pdf.setPage(i);
      pdf.setFontSize(10);
      pdf.text(`Página ${i} de ${pageCount}`, pdfWidth / 2, pdf.internal.pageSize.getHeight() - 10, { align: "center" });
    }

    pdf.save("inventario_canal40.pdf");
  };

  return (
    <>
      <style>{/* tus estilos internos */}</style>

      <div className="header bg-gradient-info pb-8 pt-5 pt-md-8 d-print-none">
        <Container fluid />
      </div>

      <Container className="mt--7" fluid>
        <Row className="justify-content-center">
          <Col xl="10">
            <Card className="shadow card-hover">
              <CardHeader className="bg-info text-white text-center d-print-none" />
              <CardBody>
                <div ref={printRef}>
                  <div className="d-flex align-items-center mb-3">
                    <div className="text-center w-100">
                      <h1>I N V E N T A R I O</h1>
                      <p>{new Date().toLocaleDateString()}</p>
                    </div>
                  </div>

                  {cargando ? (
                    <div className="text-center">
                      <Spinner color="primary" />
                      <p>Cargando inventario...</p>
                    </div>
                  ) : (
                    <Table bordered responsive>
                      <thead className="thead-light">
                        <tr>
                          <th>Código</th>
                          <th>Nombre del equipo</th>
                          <th>Descripción</th>
                          <th>Cantidad</th>
                          <th>Ubicación</th>
                          <th>Asignado</th>
                          <th>Valor</th>
                          <th>Observación</th>
                        </tr>
                      </thead>
                      <tbody>
                        {inventario.map((item, index) => (
                          <tr key={index}>
                            <td>{item.codigo}</td>
                            <td>{item.nombre}</td>
                            <td style={{ whiteSpace: 'pre-line' }}>{item.descripcion}</td>
                            <td>{item.cantidad}</td>
                            <td>{item.ubicacion}</td>
                            <td>
                              {item?.Empleado?.Persona
                                ? `${item.Empleado.Persona.Pnombre} ${item.Empleado.Persona.Papellido}`
                                : "No asignado"}
                            </td>
                            <td>{item.valor}</td>
                            <td>{item.observacion}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  )}
                </div>

                <div className="text-center d-print-none mt-4">
                  <Button color="success" onClick={handleDownloadPDF}>
                    Descargar PDF
                  </Button>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default ReporteInventario;
