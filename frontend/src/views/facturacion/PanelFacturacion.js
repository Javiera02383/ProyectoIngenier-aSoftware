import React, { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Container,
  Row,
  Col,
  Table,
  Input,
  Button,
  FormGroup,
  Label,
  Badge,
} from "reactstrap";

import HeaderResponsive from "components/Headers/HeaderResponsive";

const PanelFacturacion = () => {
  const [filtros, setFiltros] = useState({
    cliente: "",
    fecha: "",
    estado: "",
  });

  const [facturas, setFacturas] = useState([]);
  const [resumen, setResumen] = useState({
    totalMes: 0,
    emitidas: 0,
    pendientes: 0,
  });

  const [estadoCAI, setEstadoCAI] = useState({
    activo: true,
    rango: "000-001-01-00000001 a 000-001-01-00000100",
    vencimiento: "2025-08-30",
    emitidas: 25,
  });

  useEffect(() => {
    // Simulación de datos iniciales
    const datosSimulados = [
      { id: 1, cliente: "Cliente A", fecha: "2025-07-01", estado: "pagada", total: 1200 },
      { id: 2, cliente: "Cliente B", fecha: "2025-07-08", estado: "pendiente", total: 950 },
      { id: 3, cliente: "Cliente C", fecha: "2025-07-10", estado: "pagada", total: 700 },
    ];
    setFacturas(datosSimulados);
    setResumen({
      totalMes: datosSimulados.reduce((acc, f) => acc + f.total, 0),
      emitidas: datosSimulados.length,
      pendientes: datosSimulados.filter((f) => f.estado === "pendiente").length,
    });
  }, []);

  const handleFiltro = (e) => {
    setFiltros({ ...filtros, [e.target.name]: e.target.value });
  };

  const facturasFiltradas = facturas.filter((factura) => {
    return (
      (filtros.cliente === "" ||
        factura.cliente.toLowerCase().includes(filtros.cliente.toLowerCase())) &&
      (filtros.fecha === "" || factura.fecha === filtros.fecha) &&
      (filtros.estado === "" || factura.estado === filtros.estado)
    );
  });

  return (
    <>
      <HeaderResponsive />
      <Container className="mt-4">
      {/* ACCIONES DEL MÓDULO DE FACTURACIÓN */}  
      <Row className="mb-4">  
        <Col md="12">  
          <Card className="shadow border-0">  
            <CardBody className="text-center">  
              <div className="d-flex flex-wrap justify-content-center gap-3">  
                <Button color="primary" href="/admin/crear-factura-nueva" className="m-2">  
                  <i className="ni ni-fat-add mr-2" />  
                  Crear Factura  
                </Button>  

                <Button color="danger" href="/admin/facturas" className="m-2">  
                  <i className="ni ni-archive-2 mr-2" />  
                  Lista de Facturas  
                </Button> 
                  
                <Button color="info" href="/admin/facturacion/pagos" className="m-2">  
                  <i className="ni ni-credit-card mr-2" />  
                  Registrar Pago  
                </Button>  
                  
                <Button color="success" href="/admin/facturacion/contratos" className="m-2">  
                  <i className="ni ni-folder-17 mr-2" />  
                  Ver Contratos  
                </Button>  
                  
                <Button color="warning" href="/admin/facturacion/canjes" className="m-2">  
                  <i className="ni ni-delivery-fast mr-2" />  
                  Gestionar Canjes  
                </Button>  
                  
                <Button color="default" href="/admin/facturacion/cai" className="m-2">  
                  <i className="ni ni-tag mr-2" />  
                  Administrar CAI  
                </Button>  
                  
 
              </div>  
            </CardBody>  
          </Card>  
        </Col>    
      </Row>

      {/* MÉTRICAS RESUMIDAS */}
      <Row className="mb-4">
        <Col md="2" sm="6" xs="6" className="mb-3">
          <Card className="card-stats shadow border-0">
            <CardBody className="py-3 px-3 text-center">
              <div className="text-primary">
                <i className="ni ni-money-coins display-4" />
              </div>
              <small className="text-muted">Facturado</small>
              <h4 className="text-primary">L. {resumen.totalMes.toFixed(2)}</h4>
            </CardBody>
          </Card>
        </Col>

        <Col md="2" sm="6" xs="6" className="mb-3">
          <Card className="card-stats shadow border-0">
            <CardBody className="py-3 px-3 text-center">
              <div className="text-success">
                <i className="ni ni-check-bold display-4" />
              </div>
              <small className="text-muted">Emitidas</small>
              <h4 className="text-success">{resumen.emitidas}</h4>
            </CardBody>
          </Card>
        </Col>

        <Col md="2" sm="6" xs="6" className="mb-3">
          <Card className="card-stats shadow border-0">
            <CardBody className="py-3 px-3 text-center">
              <div className="text-warning">
                <i className="ni ni-time-alarm display-4" />
              </div>
              <small className="text-muted">Pendientes</small>
              <h4 className="text-warning">{resumen.pendientes}</h4>
            </CardBody>
          </Card>
        </Col>

        <Col md="2" sm="6" xs="6" className="mb-3">
          <Card className="card-stats shadow border-0">
            <CardBody className="py-3 px-3 text-center">
              <div className="text-info">
                <i className="ni ni-check-bold display-4" />
              </div>
              <small className="text-muted">Canjes</small>
              <h4 className="text-info">4</h4>
            </CardBody>
          </Card>
        </Col>

        <Col md="2" sm="6" xs="6" className="mb-3">
          <Card className="card-stats shadow border-0">
            <CardBody className="py-3 px-3 text-center">
              <div className="text-danger">
                <i className="ni ni-tag display-4" />
              </div>
              <small className="text-muted">Descuentos</small>
              <h4 className="text-danger">L. 5,500</h4>
            </CardBody>
          </Card>
        </Col>

        <Col md="2" sm="6" xs="6" className="mb-3">
          <Card className="card-stats shadow border-0">
            <CardBody className="py-3 px-3 text-center">
              <div className="text-dark">
                <i className="ni ni-credit-card display-4" />
              </div>
              <small className="text-muted">Transferencias</small>
              <h4 className="text-dark">L. 8,250</h4>
            </CardBody>
          </Card>
        </Col>
      </Row>

        {/* ESTADO DEL CAI */}
        <Card className="mb-4">
          <CardHeader>
            <strong>Estado del CAI</strong>
          </CardHeader>
          <CardBody>
            <Row>
              <Col md="6">
                <p><strong>Rango:</strong> {estadoCAI.rango}</p>
                <p><strong>Facturas emitidas:</strong> {estadoCAI.emitidas}</p>
              </Col>
              <Col md="6">
                <p>
                  <strong>Válido hasta:</strong>{" "}
                  <Badge color={new Date(estadoCAI.vencimiento) < new Date() ? "danger" : "success"}>
                    {estadoCAI.vencimiento}
                  </Badge>
                </p>
                <p>
                  <strong>Estado:</strong>{" "}
                  <Badge color={estadoCAI.activo ? "success" : "danger"}>
                    {estadoCAI.activo ? "Activo" : "Inactivo"}
                  </Badge>
                </p>
              </Col>
            </Row>
          </CardBody>
        </Card>
      </Container>
    </>
  );
};

export default PanelFacturacion;
