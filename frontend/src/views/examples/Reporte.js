import Chart from "chart.js";
import { useState } from "react";
import { Bar, Line, Pie } from "react-chartjs-2";
import { useNavigate } from "react-router-dom";

import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Form,
  FormGroup,
  Input,
  Label,
  Row,
  Table,
} from "reactstrap";

import {
  chartExample2,
  chartOptions,
  parseOptions,
} from "variables/charts.js";

const Reportes = () => {
  const navigate = useNavigate();

  const reportes = [
    {
      id: 1,
      modulo: "Inventario",
      detalle: "Cámara Sony X123",
      fecha: "2025-07-01",
      estado: "Activo",
    },
    {
      id: 2,
      modulo: "Publicidad",
      detalle: "Campaña Verano 2025",
      fecha: "2025-06-20",
      estado: "Pendiente",
    },
  ];

  const handleVerDetalle = (id) => {
    navigate(`/admin/detalle/${id}`);
  };

  const [filters, setFilters] = useState({
    fechaDesde: "",
    fechaHasta: "",
    modulo: "",
    tipoReporte: "",
    estado: "",
    tipoGrafica: "",
  });

  if (window.Chart) {
    parseOptions(Chart, chartOptions());
  }

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleGenerateReport = (e) => {
    e.preventDefault();
    console.log("Generando reporte con filtros:", filters);
  };

  const handleClearFilters = () => {
    setFilters({
      fechaDesde: "",
      fechaHasta: "",
      modulo: "",
      tipoReporte: "",
      estado: "",
      tipoGrafica: "",
    });
  };
  // Simulación de facturas 
  const facturas = [
  { id: 1, fecha: "2025-07-01", cliente: "Juan", total: 500 },
  { id: 2, fecha: "2025-07-10", cliente: "Ana", total: 300 },
  { id: 3, fecha: "2025-07-15", cliente: "Luis", total: 200 },
  { id: 4, fecha: "2025-07-22", cliente: "María", total: 100 },
  { id: 5, fecha: "2025-06-30", cliente: "Carlos", total: 800 },
];

  const hoy = new Date();
  const mesActual = hoy.getMonth();
  const añoActual = hoy.getFullYear();

  const facturasDelMes = facturas.filter((factura) => {
    const fecha = new Date(factura.fecha);
    return fecha.getMonth() === mesActual && fecha.getFullYear() === añoActual;
  });

  const totalDelMes = facturasDelMes.reduce((sum, f) => sum + f.total, 0);

  const datosPorDia = facturasDelMes.reduce((acc, factura) => {
    const dia = new Date(factura.fecha).getDate();
    acc[dia] = (acc[dia] || 0) + factura.total;
    return acc;
  }, {});

  const chartDataFacturas = {
    labels: Object.keys(datosPorDia).map((dia) => `Día ${dia}`),
    datasets: [
      {
        label: "Total Diario",
        data: Object.values(datosPorDia),
        backgroundColor: "rgba(75,192,192,0.6)",
      },
    ],
  };

  return (
    <>
      {/* 🔵 Estilos personalizados */}
      {/* Prueba*/}
      <style>
        {`
          .card-hover {
            transition: all 0.3s ease;
            cursor: pointer;
            border-radius: 10px;
          }

          .card-hover:hover {
            transform: scale(1.02);
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
          }
          /* 🎨 Colores personalizados */
          .bg-info {
            background-color: #4a90e2 !important;
          }
          .bg-success {
            background-color: #50e3c2 !important;
          }
          .btn-success {
            background-color: #50e3c2 !important;
            border-color: #50e3c2;
          }
          .btn-info {
            background-color: #4a90e2 !important;
            border-color: #4a90e2;
          }
          .btn-secondary {
            background-color: #b2bec3 !important;
            border-color: #b2bec3;
          }
          .thead-light th {
            background-color: #eaf4fb;
            color: #4a4a4a;
          }

          .table td, .table th {
            border-top: 1px solid #dee2e6;
          }
        `}
      </style>

      <div className="header bg-gradient-info pb-8 pt-5 pt-md-8">
        <Container fluid>
          <div className="header-body">
            <Row className="justify-content-center mb-4">
              <Col xl="10" className="text-center">
                
              </Col>
            </Row>
          </div>
        </Container>
      </div>
      <Container className="mt--7" fluid>
        {/* Cuadros de informes */}
        <Row className="mt-4">
          <Col lg="4" md="6" className="mb-4">
              <Card className="shadow">
                <CardBody className="text-center">
                  <i className="ni ni-chart-bar-32 ni-3x text-success mb-3"></i>
                    <CardHeader tag="h4" className="text-uppercase text-muted mb-0">
                      Reporte de Inventario
                    </CardHeader>
                    <CardBody>
                      <p>Consulta detallada sobre el estado actual del inventario.</p>
                    </CardBody>
                    <hr className="my-3" />
                    <Button color="success" onClick={() => navigate("/admin/ReporteInventario")}>
                      Ver
                    </Button>
                  </CardBody>
              </Card>
            </Col>
            <Col lg="4" md="6" className="mb-4">
              <Card className="shadow">
                <CardBody className="text-center">
                  <i className="ni ni-chart-bar-32 ni-3x text-success mb-3"></i>
                    <CardHeader tag="h4" className="text-uppercase text-muted mb-0">
                      Reporte de Pauta Publicitaria
                    </CardHeader>
                    <CardBody>
                      <p>Informe sobre horarios de pautas publicitarias por cliente</p>
                    </CardBody>
                    <hr className="my-3" />
                    <Button color="success" onClick={() => navigate("/admin/ReportePautaPorCliente")}>
                      Ver
                    </Button>
                  </CardBody>
              </Card>
            </Col>
            <Col lg="4" md="6" className="mb-4">
              <Card className="shadow">
                <CardBody className="text-center">
                  <i className="ni ni-chart-bar-32 ni-3x text-success mb-3"></i>
                    <CardHeader tag="h4" className="text-uppercase text-muted mb-0">
                      Reporte de Clientes
                    </CardHeader>
                    <CardBody>
                      <p>Informes sobre clientes vigentes</p>
                    </CardBody>
                    <hr className="my-3" />
                    <Button color="success" onClick={() => navigate("/admin/ReporteCliente")}>
                      Ver
                    </Button>
                  </CardBody>
              </Card>
            </Col>
        </Row>
          <Row className="mb-5 justify-content-center">
            <Col lg="4" md="6" className="mb-4">
              <Card className="shadow">
                <CardBody className="text-center">
                  <CardHeader tag="h4" className="bg-info text-white">
                    Facturas Emitidas este mes
                  </CardHeader>
                  <CardBody>
                    <h2>{facturasDelMes.length}</h2>
                    <p className="text-muted">Cantidad de facturas</p>
                  </CardBody>
                </CardBody>
              </Card>
            </Col>
            <Col lg="4" md="6" className="mb-4">
              <Card className="shadow">
                <CardBody className="text-center">
                  <CardHeader tag="h4" className="bg-info text-white">
                    Total Facturado este mes
                  </CardHeader>
                  <CardBody>
                    <h2>L {totalDelMes.toLocaleString()}</h2>
                    <p className="text-muted">Lempiras</p>
                  </CardBody>
                </CardBody>
              </Card>
            </Col>
          </Row>

          <Row className="mb-5">
            <Col xl="4">
            <Card className="shadow">
              <CardHeader className="bg-transparent text-center">
                <h6 className="text-uppercase text-muted ls-1 mb-1">
                  Resultados en Gráfico
                </h6>
                <h2 className="mb-0">Facturacion diaria del Mes Actual</h2>
              </CardHeader>
              <CardBody>
                <div className="chart">
                                    <Bar data={chartDataFacturas} options={{ responsive: true }} />
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col xl="4">
            <Card className="shadow">
              <CardHeader className="bg-transparent text-center">
                <h6 className="text-uppercase text-muted ls-1 mb-1">
                  Resultados en Gráfico
                </h6>
                <h2 className="mb-0">Facturacion Mensual</h2>
              </CardHeader>
              <CardBody>
                <div className="chart">
                                    <Bar data={chartDataFacturas} options={{ responsive: true }} />
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Reportes;
