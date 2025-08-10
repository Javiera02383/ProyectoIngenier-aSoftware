import React from "react";
import { Link } from "react-router-dom"; // Importa Link para la navegación
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  Button,
} from "reactstrap";
import HeaderBlanco from "components/Headers/HeaderBlanco.js";

const InventarioHub = () => {
  return (
    <>
      <HeaderBlanco />
      <Container className="mt--7" fluid>
        <Row className="justify-content-center">
          
          <Col lg="10" md="12">

            <Row>
              {/* Card para Inventario General */}
              <Col lg="4" md="6" className="mb-4">
                <Card className="shadow">
                  <CardBody className="text-center">
                    <i className="ni ni-box-2 ni-3x text-primary mb-3"></i>
                    <CardTitle tag="h4" className="text-uppercase text-muted mb-0">
                      Inventario General
                    </CardTitle>
                    <hr className="my-3" />
                    <Link to="/admin/lista-activos">
                      <Button color="primary">Ver y Buscar Activos</Button>
                    </Link>
                  </CardBody>
                </Card>
              </Col>

              {/* Card para Registrar Activo */}
              <Col lg="4" md="6" className="mb-4">
                <Card className="shadow">
                  <CardBody className="text-center">
                    <i className="ni ni-fat-add ni-3x text-success mb-3"></i>
                    <CardTitle tag="h4" className="text-uppercase text-muted mb-0">
                      Registrar Activo
                    </CardTitle>
                    <hr className="my-3" />
                    <Link to="/admin/registrar-activo">
                      <Button color="success">Añadir Nuevo Activo</Button>
                    </Link>
                  </CardBody>
                </Card>
              </Col>

              {/* Card para Gestionar Stock */}
              <Col lg="4" md="6" className="mb-4">
                <Card className="shadow">
                  <CardBody className="text-center">
                    <i className="ni ni-chart-bar-32 ni-3x text-info mb-3"></i>
                    <CardTitle tag="h4" className="text-uppercase text-muted mb-0">
                      Gestionar Stock
                    </CardTitle>
                    <hr className="my-3" />
                    <Link to="/admin/gestionar-stock">
                      <Button color="info">Salida de Stock</Button>
                    </Link>
                  </CardBody>
                </Card>
              </Col>

              {/* Card para Controlar Mantenimiento */}
              <Col lg="4" md="6" className="mb-4">
                <Card className="shadow">
                  <CardBody className="text-center">
                    <i className="ni ni-settings-gear-65 ni-3x text-primary mb-3"></i>
                    <CardTitle tag="h4" className="text-uppercase text-muted mb-0">
                      Controlar Mantenimiento
                    </CardTitle>
                    <hr className="my-3" />
                    <Link to="/admin/gestionar-mantenimiento">
                      <Button color="primary">Registrar Mantenimiento</Button>
                    </Link>
                  </CardBody>
                </Card>
              </Col>
              
              {/* Card para Generar Reportes */}
              <Col lg="4" md="6" className="mb-4">
                <Card className="shadow">
                  <CardBody className="text-center">
                    <i className="ni ni-book-bookmark ni-3x text-green mb-3"></i>
                    <CardTitle tag="h4" className="text-uppercase text-muted mb-0">
                      Generar Reportes
                    </CardTitle>
                    <hr className="my-3" />
                    <Link to="/admin/generar-reportes">
                      <Button color="success">Crear y Exportar Reportes</Button>
                    </Link>
                  </CardBody>
                </Card>
              </Col>

            </Row>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default InventarioHub;