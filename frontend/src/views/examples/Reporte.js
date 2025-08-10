// Reportes.js
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  Spinner,
  Table,
} from "reactstrap";

import axios from "axios";
import HeaderBlanco from "components/Headers/HeaderBlanco.js";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Bar } from "react-chartjs-2";
import { facturaService } from "services/facturacion/facturaService.js";

import Encabezado from "assets/img/brand/Encabezado.jpeg";

const Reportes = () => {
  const navigate = useNavigate();

  const [nombre, setNombre] = useState("");
  const [fecha, setFecha] = useState("");
  const [inventario, setInventario] = useState([]);
  const [cargandoInventario, setCargandoInventario] = useState(true);

  const [facturas, setFacturas] = useState([]);
  const [cargandoFacturas, setCargandoFacturas] = useState(true);

  
  // --- Datos de clientes y pautas ---
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
    ],
    "BANCO DEL PAÍS S.A.": [
      { horaInicio: "20:00", horaFin: "20:30", programa: "Entretenimiento Nocturno" },
    ],
  };

  const [clienteSeleccionado, setClienteSeleccionado] = useState(clientesDisponibles[0]);
  const [pautaActual, setPautaActual] = useState(
    pautasPorCliente[clientesDisponibles[0]] || []
  );

  useEffect(() => {
    const userName = localStorage.getItem("userName") || "Usuario";
    setNombre(userName);

    const hoy = new Date();
    const opciones = { day: "numeric", month: "long", year: "numeric" };
    setFecha(hoy.toLocaleDateString("es-ES", opciones));
  }, []);

  useEffect(() => {
    const obtenerInventario = async () => {
      try {
        setCargandoInventario(true);
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "http://localhost:4051/api/optica/inventario/todos",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setInventario(res.data || []);
      } catch (error) {
        console.error("Error cargando inventario:", error);
      } finally {
        setCargandoInventario(false);
      }
    };
    obtenerInventario();
  }, []);

  useEffect(() => {
    const cargarFacturas = async () => {
      try {
        setCargandoFacturas(true);
        const response = await facturaService.obtenerFacturas();
        setFacturas(response.facturas || []);
      } catch (error) {
        console.error("Error cargando facturas:", error);
      } finally {
        setCargandoFacturas(false);
      }
    };
    cargarFacturas();
  }, []);

  const parseNumber = (value) => {
    if (typeof value === "number" && Number.isFinite(value)) return value;
    if (value == null) return 0;
    const cleaned = String(value).replace(/[^0-9.-]+/g, "");
    const n = parseFloat(cleaned);
    return Number.isFinite(n) ? n : 0;
  };

  // Estadísticas inventario
  const totalItems = inventario.length;
  const totalCantidad = inventario.reduce(
    (sum, item) => sum + parseNumber(item.cantidad),
    0
  );
  const totalValor = inventario.reduce(
    (sum, item) => sum + parseNumber(item.valor),
    0
  );

  // Agrupar facturación por mención para tabla y gráfica
  const facturacionPorMencion = facturas.reduce((acc, factura) => {
    const mencion = factura.mencion || "Sin mención";
    acc[mencion] = (acc[mencion] || 0) + parseNumber(factura.Total_Facturado);
    return acc;
  }, {});

  const chartLabels = Object.keys(facturacionPorMencion);
  const chartDataValues = Object.values(facturacionPorMencion);

  const data = {
    labels: chartLabels,
    datasets: [
      {
        label: "Total Facturado (HNL)",
        backgroundColor: "#5e72e4",
        borderColor: "#5e72e4",
        borderWidth: 1,
        hoverBackgroundColor: "#324cdd",
        hoverBorderColor: "#324cdd",
        data: chartDataValues,
        maxBarThickness: 30,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: { y: { beginAtZero: true } },
    plugins: { legend: { display: true, position: "top" } },
  };

  const inventarioOrdenado = [...inventario].sort((a, b) => {
    const idA = Number(a.idInventario);
    const idB = Number(b.idInventario);
    if (isNaN(idA) || isNaN(idB)) return 0;
    return idB - idA;
  });

  // PDF Inventario
  const handleDownloadPDF = async () => {
    const pdf = new jsPDF("p", "mm", "a4");
    const margin = 15;
    const headerImg = new Image();
    headerImg.src = Encabezado;
    await new Promise((resolve) => (headerImg.onload = resolve));
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const contentWidth = pdfWidth - margin * 2;
    const aspectRatio = headerImg.width / headerImg.height;
    const headerHeight = contentWidth / aspectRatio;
    pdf.addImage(headerImg, "JPEG", margin, margin, contentWidth, headerHeight);
    const startY = margin + headerHeight + 10;
    pdf.setFontSize(20).setFont("helvetica", "bold");
    pdf.text("INVENTARIO", pdfWidth / 2, startY, { align: "center" });
    autoTable(pdf, {
      startY: startY + 8,
      head: [
        [
          "Código",
          "Nombre",
          "Descripción",
          "Cantidad",
          "Ubicación",
          "Asignado",
          "Valor",
          "Observación",
        ],
      ],
      body: inventario.map((item) => [
        item.codigo,
        item.nombre,
        item.descripcion,
        item.cantidad,
        item.ubicacion,
        item?.Empleado
          ? (item.Empleado.nombre || item.Empleado.persona?.nombreCompleto || "No asignado")
          : "No asignado",
        item.valor,
        item.observacion,
      ]),
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [41, 128, 185], textColor: 255 },
      theme: "grid",
      margin: { left: margin, right: margin, bottom: margin },
    });
    pdf.save("inventario_canal40.pdf");
  };

  // --- PDF Pautas ---
  const handleDownloadPautaPDF = async () => {
    if (pautaActual.length === 0) return;
    const pdf = new jsPDF("p", "mm", "a4");
    const margin = 15;
    const headerImg = new Image();
    headerImg.src = Encabezado;
    await new Promise((resolve) => (headerImg.onload = resolve));
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const contentWidth = pdfWidth - margin * 2;
    const aspectRatio = headerImg.width / headerImg.height;
    const headerHeight = contentWidth / aspectRatio;
    pdf.addImage(headerImg, "JPEG", margin, margin, contentWidth, headerHeight);
    const startY = margin + headerHeight + 10;
    pdf.setFontSize(20).setFont("helvetica", "bold");
    pdf.text("H O R A R I O  D E  P A U T A", pdfWidth / 2, startY, { align: "center" });
    const datos = [
      ["CLIENTE:", clienteSeleccionado],
      ["PRODUCTO:", "PAUTA PUBLICITARIA"],
      ["VERSIÓN:", "VARIAS"],
      ["PERIODO:", "MENSUAL"],
    ];
    let y = startY + 12;
    const valorX = margin + 40;
    datos.forEach(([label, valor]) => {
      pdf.setFont("helvetica", "bold");
      pdf.text(label, margin, y);
      pdf.setFont("helvetica", "normal");
      pdf.text(valor, valorX, y);
      pdf.line(valorX, y + 1, pdf.internal.pageSize.getWidth() - margin, y + 1);
      y += 8;
    });
    y += 5;
    autoTable(pdf, {
      startY: y,
      head: [["Hora", "Programa"]],
      body: pautaActual.map((b) => [`${b.horaInicio} - ${b.horaFin}`, b.programa]),
      styles: { fontSize: 10, cellPadding: 3 },
      headStyles: { fillColor: [200, 230, 255], textColor: 0 },
      margin: { left: margin, right: margin },
      theme: "grid",
    });
    pdf.save(`Pauta_${clienteSeleccionado}.pdf`);
  };

  const handleClienteChange = (e) => {
    const cliente = e.target.value;
    setClienteSeleccionado(cliente);
    setPautaActual(pautasPorCliente[cliente] || []);
  };

  return (
    <>
      <HeaderBlanco />
      <Container fluid className="mt--7">
        {/* Fecha */}
        <Row>
          <Col md="12">
            <Card className="shadow p-3 mb-4 text-center">
              <h1>{fecha}</h1>
            </Card>
          </Col>
        </Row>

        {/* Tarjetas rápidas clientes */}
        <Row>
          <Col md="4">
            <Card className="shadow-lg border-0" style={{ background: "linear-gradient(135deg, #ff9a9e, #fad0c4)", color: "white", borderRadius: "15px" }}>
              <CardBody className="text-center p-4">
                <h3>Total Clientes Registrados</h3>
                <h2>{new Set(facturas.map(f => f.idCliente)).size}</h2>
              </CardBody>
            </Card>
          </Col>
          <Col md="4">
            <Card className="shadow-lg border-0" style={{ background: "linear-gradient(135deg, #a18cd1, #fbc2eb)", color: "white", borderRadius: "15px" }}>
              <CardBody className="text-center p-4">
                <h3>Monto Total Facturado</h3>
                <h2>
                  {facturas.reduce((sum, f) => sum + parseNumber(f.Total_Facturado), 0)
                    .toLocaleString("es-HN", { style: "currency", currency: "HNL" })}
                </h2>
              </CardBody>
            </Card>
          </Col>
          <Col md="4">
            <Card className="shadow-lg border-0" style={{ background: "linear-gradient(135deg, #84fab0, #8fd3f4)", color: "white", borderRadius: "15px" }}>
              <CardBody className="text-center p-4">
                <h3>Top Cliente por Facturación</h3>
                <h4 style={{ fontWeight: "bold" }}>
                  {
                    Object.entries(facturas.reduce((acc, f) => {
                      acc[f.productoCliente] = (acc[f.productoCliente] || 0) + parseNumber(f.Total_Facturado);
                      return acc;
                    }, {})).sort((a, b) => b[1] - a[1])[0]?.[0] || "Sin datos"
                  }
                </h4>
              </CardBody>
            </Card>
          </Col>
        </Row>
        {/* Inventario y facturación */}
        <Row className="mt-4">
          <Col md="7">
            <Card className="shadow">
              <CardHeader className="d-flex justify-content-between align-items-center">
                <h4 className="mb-0">Informe de Inventario Disponible</h4>
                <Button color="success" onClick={handleDownloadPDF}>
                  Descargar Inventario Completo
                </Button>
              </CardHeader>
              <CardBody>
                <Row className="mb-4">
                  <Col md="4">
                    <Card className="shadow-lg border-0" style={{ background: "linear-gradient(135deg, #4facfe, #00f2fe)", color: "white", borderRadius: "15px" }}>
                      <CardBody className="text-center p-4">
                        <h3>Total de artículos</h3>
                        <h2>{totalItems}</h2>
                      </CardBody>
                    </Card>
                  </Col>
                  <Col md="4">
                    <Card className="shadow-lg border-0" style={{ background: "linear-gradient(135deg, #4facfe, #00f2fe)", color: "white", borderRadius: "15px" }}>
                      <CardBody className="text-center p-4">
                        <h3>Cantidad total</h3>
                        <h2>{totalCantidad}</h2>
                      </CardBody>
                    </Card>
                  </Col>
                  <Col md="4">
                    <Card className="shadow-lg border-0" style={{ background: "linear-gradient(135deg, #4facfe, #00f2fe)", color: "white", borderRadius: "15px" }}>
                      <CardBody className="text-center p-4">
                        <h3>Valor Total</h3>
                        <h2>
                          {totalValor.toLocaleString("es-HN", {
                            style: "currency",
                            currency: "HNL",
                            minimumFractionDigits: 2,
                          })}
                        </h2>
                      </CardBody>
                    </Card>
                  </Col>
                </Row>
                {cargandoInventario ? (
                  <div className="text-center">
                    <Spinner color="primary" />
                    <p>Cargando inventario...</p>
                  </div>
                ) : (
                  <>
                    <h4>Últimos 5 artículos en ingresar</h4>
                    <Table bordered responsive size="sm" className="mt-2">
                      <thead className="thead-light">
                        <tr>
                          <th>Nombre</th>
                          <th>Cantidad</th>
                          <th>Ubicación</th>
                        </tr>
                      </thead>
                      <tbody>
                        {inventarioOrdenado.slice(0, 5).map((item) => (
                          <tr key={item.idInventario}>
                            <td>{item.nombre}</td>
                            <td>{item.cantidad}</td>
                            <td>{item.ubicacion}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </>
                )}
              </CardBody>
            </Card>
          </Col>

          <Col md="5">
            <Card className="shadow">
              <CardHeader>Estadísticas de Facturación por Mención</CardHeader>
              <CardBody>
                {cargandoFacturas ? (
                  <div className="text-center">
                    <Spinner color="primary" />
                    <p>Cargando facturación...</p>
                  </div>
                ) : (
                  <>
                    <div style={{ height: "300px" }}>
                      <Bar data={data} options={options} />
                    </div>
                    <Table bordered responsive size="sm" className="mt-4">
                      <thead className="thead-light">
                        <tr>
                          <th>Mención</th>
                          <th>Total Facturado</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(facturacionPorMencion).map(([mencion, total]) => (
                          <tr key={mencion}>
                            <td>{mencion}</td>
                            <td>{total.toLocaleString("es-HN", {
                              style: "currency",
                              currency: "HNL"
                            })}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </>
                )}
              </CardBody>
            </Card>
          </Col>
          {/* Bloque de pautas */}
        </Row>
        <Row className="mt-4">
          <Col md="10" className="mx-auto">
            <Card className="shadow">
              <CardHeader className="bg-info text-white">
                <h4>Pauta Publicitaria por Cliente</h4>
              </CardHeader>
              <CardBody>
                <FormGroup>
                  <Label>Seleccione Cliente</Label>
                  <Input type="select" value={clienteSeleccionado} onChange={handleClienteChange}>
                    {clientesDisponibles.map((c, i) => (
                      <option key={i}>{c}</option>
                    ))}
                  </Input>
                </FormGroup>
                {pautaActual.length > 0 ? (
                  <>
                    <Table bordered responsive size="sm" className="mt-3">
                      <thead style={{ backgroundColor: "#c8e6ff" }}>
                        <tr>
                          <th>Hora</th>
                          <th>Programa</th>
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
                      <Button color="success" onClick={handleDownloadPautaPDF}>
                        Descargar Pauta
                      </Button>
                    </div>
                  </>
                ) : (
                  <p className="text-center text-warning mt-3">No hay pauta vigente para este cliente</p>
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Reportes;
