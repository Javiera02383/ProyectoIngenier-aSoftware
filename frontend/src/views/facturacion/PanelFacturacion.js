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
  Badge,
  Spinner,
  Alert,
} from "reactstrap";

import HeaderResponsive from "components/Headers/HeaderResponsive";
import { 
  obtenerResumenFacturacion, 
  obtenerEstadoCAI, 
  obtenerEstadisticasPagos,
  obtenerEstadisticasCanjes,
  obtenerEstadisticasDescuentos,
  obtenerEstadisticasTransferencias
} from "../../services/facturacion/facturacionService";

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
    pagadas: 0,
    pendientes: 0,
    mes: ''
  });

  const [estadoCAI, setEstadoCAI] = useState({
    activo: false,
    rango: "Sin CAI activo",
    vencimiento: "N/A",
    emitidas: 0,
    limite: 0,
    disponible: 0,
    porcentajeUso: 0
  });

  const [estadisticas, setEstadisticas] = useState({
    pagos: { total: 0, cantidad: 0, promedio: 0 },
    canjes: { total: 0, cantidad: 0, promedio: 0 },
    descuentos: { total: 0, cantidad: 0, promedio: 0 },
    transferencias: { total: 0, cantidad: 0, promedio: 0 }
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    cargarDatosFacturacion();
  }, []);

  const cargarDatosFacturacion = async () => {
    try {
      setLoading(true);
      setError(null);

      // Cargar todos los datos en paralelo
      const [
        resumenData,
        caiData,
        pagosData,
        canjesData,
        descuentosData,
        transferenciasData
      ] = await Promise.all([
        obtenerResumenFacturacion(),
        obtenerEstadoCAI(),
        obtenerEstadisticasPagos(),
        obtenerEstadisticasCanjes(),
        obtenerEstadisticasDescuentos(),
        obtenerEstadisticasTransferencias()
      ]);

      // Actualizar estados
      setResumen(resumenData);
      setEstadoCAI(caiData);
      setEstadisticas({
        pagos: pagosData,
        canjes: canjesData,
        descuentos: descuentosData,
        transferencias: transferenciasData
      });

      console.log('✅ Datos de facturación cargados exitosamente');
    } catch (error) {
      console.error('❌ Error cargando datos de facturación:', error);
      setError('Error al cargar los datos del servidor. Verifique su conexión.');
    } finally {
      setLoading(false);
    }
  };

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

  const formatearMoneda = (valor) => {
    return new Intl.NumberFormat('es-HN', {
      style: 'currency',
      currency: 'HNL',
      minimumFractionDigits: 2
    }).format(valor);
  };

  if (loading) {
    return (
      <>
        <HeaderResponsive />
        <Container className="mt-4">
          <div className="text-center">
            <Spinner color="primary" size="lg" />
            <p className="mt-3">Cargando datos de facturación...</p>
          </div>
        </Container>
      </>
    );
  }

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
                    Ver Ordenes de Pago 
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

        {/* Mensaje de error */}
        {error && (
          <Row className="mb-4">
            <Col>
              <Alert color="danger" className="mb-0">
                <i className="ni ni-bell-55 mr-2"></i>
                {error}
              </Alert>
            </Col>
          </Row>
        )}

        {/* MÉTRICAS RESUMIDAS */}
        <Row className="mb-4">
          <Col md="2" sm="6" xs="6" className="mb-3">
            <Card className="card-stats shadow border-0">
              <CardBody className="py-3 px-3 text-center">
                <div className="text-primary">
                  <i className="ni ni-money-coins display-4" />
                </div>
                <small className="text-muted">Facturado {resumen.mes}</small>
                <h4 className="text-primary">{formatearMoneda(resumen.totalMes)}</h4>
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
                <h4 className="text-info">{estadisticas.canjes.cantidad}</h4>
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
                <h4 className="text-danger">{formatearMoneda(estadisticas.descuentos.total)}</h4>
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
                <h4 className="text-dark">{formatearMoneda(estadisticas.transferencias.total)}</h4>
              </CardBody>
            </Card>
          </Col>
        </Row>

        {/* ESTADO DEL CAI */}
        <Card className="mb-4">
          <CardHeader className="d-flex justify-content-between align-items-center">
            <strong>Estado del CAI</strong>
            <Badge color={estadoCAI.activo ? "success" : "danger"}>
              {estadoCAI.activo ? "Activo" : "Inactivo"}
            </Badge>
          </CardHeader>
          <CardBody>
            <Row>
              <Col md="6">
                <p><strong>Rango:</strong> {estadoCAI.rango}</p>
                <p><strong>Facturas emitidas:</strong> {estadoCAI.emitidas} / {estadoCAI.limite}</p>
                <p><strong>Disponible:</strong> {estadoCAI.disponible}</p>
                <p><strong>Uso:</strong> {estadoCAI.porcentajeUso}%</p>
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
                {estadoCAI.activo && (
                  <div className="mt-3">
                    <div className="d-flex justify-content-between mb-1">
                      <small>Uso del CAI</small>
                      <small>{estadoCAI.porcentajeUso}%</small>
                    </div>
                    <div className="progress" style={{ height: '8px' }}>
                      <div 
                        className={`progress-bar ${estadoCAI.porcentajeUso > 80 ? 'bg-warning' : 'bg-success'}`}
                        style={{ width: `${estadoCAI.porcentajeUso}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </Col>
            </Row>
          </CardBody>
        </Card>
      </Container>
    </>
  );
};

export default PanelFacturacion;
