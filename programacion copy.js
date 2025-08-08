// src/views/programacion/programacion.js
import React from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Container,
  Row,
  Col,
  Button,
  Badge
} from "reactstrap";
import { useNavigate } from "react-router-dom";
import HeaderResponsive from "components/Headers/HeaderResponsive";
import CalendarioPautas from "views/programacion/CalendarioPautas"; // Asegúrate de que esta ruta sea la correcta

const Programacion = () => {
  const navigate = useNavigate();

  const pauta = [
    {
      bloque: "NOTICIAS 60 MINUTOS",
      comerciales: [
        { hora: "7:05", empresas: [] },
        { hora: "7:30", empresas: ["CLARO", "SECOPV", "MUNICOM", "MACONSA", "UNAH"] },
        { hora: "7:55", empresas: ["MOTOMUNDO", "MUNICOM", "SINET"] },
        { hora: "8:20", empresas: ["CLARO", "MUNICOM", "SANMARQUEÑA COOP", "SONRÍA"] },
        { hora: "8:30", empresas: ["CLARO", "COFICESA", "MUNICOM", "VILLAMIX"] }
      ]
    },
    {
      bloque: "PELÍCULA MATUTINA",
      comerciales: [
        { hora: "9:00", empresas: ["CLARO", "SECOPV", "SONRÍA", "CABLECOLOR"] },
        { hora: "9:30", empresas: ["LACOLONIA", "TIENDAERFA", "SINET"] },
        { hora: "10:00", empresas: ["CLARO", "SANMARQUEÑA COOP", "COFICESA"] },
        { hora: "10:30", empresas: ["MOTOMUNDO", "SECOPV", "PROMODJFLECHA"] },
        { hora: "11:00", empresas: ["CLARO", "MUNICOM", "MACONSA"] }
      ]
    },
    {
      bloque: "DOCUMENTALES",
      comerciales: [
        { hora: "11:15", empresas: ["COFICESA", "MUNICOM"] },
        { hora: "11:30", empresas: ["CLARO", "TIENDAERFA"] },
        { hora: "11:55", empresas: ["SECOPV", "MACONSA", "UNAH", "VILLAMIX"] }
      ]
    },
    {
      bloque: "TVN40 MERIDIANO",
      comerciales: [
        { hora: "12:10", empresas: ["LACOLONIA", "TIENDAERFA", "CABLECOLOR"] },
        { hora: "12:25", empresas: ["CLARO", "SANMARQUEÑA COOP", "SONRÍA", "COFICESA"] },
        { hora: "12:35", empresas: ["MOTOMUNDO", "MACONSA", "TIENDAERFA"] },
        { hora: "12:45", empresas: ["SINET", "MUNICOM"] },
        { hora: "12:55", empresas: ["CLARO", "SONRÍA", "MUNICOM"] }
      ]
    },
    {
      bloque: "INFANTILES",
      comerciales: [
        { hora: "1:15", empresas: ["MACONSA", "PROMODJFLECHA"] },
        { hora: "1:45", empresas: ["MUNICOM"] }
      ]
    },
    {
      bloque: "VIVA LA MÚSICA",
      comerciales: [
        { hora: "2:00", empresas: ["CLARO", "SANMARQUEÑACOOP", "SECOPV"] },
        { hora: "2:30", empresas: ["LACOLONIA", "MOTOMUNDO", "TIENDAERFA", "COFICESA"] },
        { hora: "3:00", empresas: ["CLARO", "SANMARQUEÑACOOP", "SECOPV", "VILLAMIX"] },
        { hora: "3:30", empresas: ["CLARO", "MACONSA", "SINET", "PROMODJFLECHA"] },
        { hora: "4:00", empresas: ["CLARO", "COFICESA", "CABLECOLOR"] }
      ]
    },
    {
      bloque: "SERIES",
      comerciales: [
        { hora: "5:00", empresas: ["CLARO", "CABLECOLOR", "MUNICOM", "PROMODJFLECHA"] },
        { hora: "5:15", empresas: ["SECOPV"] },
        { hora: "5:30", empresas: ["CLARO", "COFICESA"] },
        { hora: "5:45", empresas: ["MACONSA"] },
        { hora: "6:00", empresas: ["CLARO", "MUNICOM", "UNAH"] }
      ]
    },
    {
      bloque: "TV NOTICIAS 40",
      comerciales: [
        { hora: "6:10", empresas: ["CLARO", "SANMARQUEÑACOOP", "COFICESA", "TIENDAERFA", "SINET"] },
        { hora: "6:25", empresas: ["LACOLONIA", "MOTOMUNDO", "SONRÍA", "SECOPV", "MUNICOM"] },
        { hora: "6:35", empresas: ["CLARO", "CABLECOLOR", "SANMARQUEÑACOOP", "COFICESA"] },
        { hora: "6:45", empresas: ["MOTOMUNDO", "LACOLONIA", "SONRÍA", "MACONSA", "MUNICOM"] },
        { hora: "6:55", empresas: ["CLARO", "SECOPV", "CHAVERYASOCIADO", "VILLAMIX"] },
        { hora: "7:30", empresas: ["CLARO", "MOTOMUNDO", "SANMARQUEÑACOOP", "SONRÍA", "MUNICOM"] },
        { hora: "8:00", empresas: ["LACOLONIA", "TIENDAERFA", "COFICESA", "MACONSA", "SINET"] },
        { hora: "8:30", empresas: ["CLARO", "MOTOMUNDO", "SANMARQUEÑACOOP", "MUNICOM", "SECOPV", "CABLECOLOR"] },
        { hora: "9:00", empresas: ["LACOLONIA", "TIENDAERFA", "COFICESA", "MACONSA", "SINET", "PROMODJFLECHA"] },
        { hora: "9:30", empresas: ["CLARO", "MOTOMUNDO", "SANMARQUEÑACOOP", "MUNICOM", "CABLECOLOR"] }
      ]
    },
    {
      bloque: "CIERRE DE TRANSMISIÓN",
      comerciales: [
        { hora: "22:00", empresas: ["CIERRE"] }
      ]
    }
  ];

  return (
    <>
      <HeaderResponsive />
      <Container className="mt-5" fluid>
        <Row>
          <Col>
            <Card className="shadow">
              <CardHeader className="border-0 d-flex justify-content-between align-items-center">
                <h3 className="mb-0">Calendario de Programación</h3>
                <div>
                  <Button color="primary" className="me-2" onClick={() => navigate("/admin/crear-programa")}>
                    <i className="ni ni-fat-add mr-2"></i> Nuevo Programa
                  </Button>
                  <Button color="success" onClick={() => navigate("/admin/crear-pauta")}>
                    <i className="ni ni-fat-add mr-2"></i> Nueva Pauta
                  </Button>
                </div>
              </CardHeader>
              <CardBody>
                <CalendarioPautas />
              </CardBody>
            </Card>
          </Col>
        </Row>

        <Row className="mt-4">
          <Col>
            <Card className="shadow">
              <CardHeader className="text-center">
                <h3 className="mb-0 font-bold text-uppercase">Programación</h3>
                <p className="text-primary font-semibold">Lunes a Sábado - Agosto 2025</p>
              </CardHeader>
              <CardBody>
                <div style={{ overflowX: "auto", whiteSpace: "nowrap" }}>
                  {pauta.map((bloque, index) => (
                    <div
                      key={index}
                      style={{
                        display: "inline-block",
                        verticalAlign: "top",
                        width: "320px",
                        marginRight: "1rem"
                      }}
                    >
                      <Card className="border">
                        <CardHeader className="bg-info text-white text-center py-2">
                          <strong>{bloque.bloque}</strong>
                        </CardHeader>
                        <CardBody style={{ maxHeight: "400px", overflowY: "auto" }}>
                          {bloque.comerciales.map((comercial, idx) => (
                            <div key={idx} className="mb-3">
                              <h6 className="text-muted">
                                ⏰ <strong>{comercial.hora}</strong>
                              </h6>
                              <div className="d-flex flex-wrap gap-1">
                                {comercial.empresas.map((empresa, eIdx) => (
                                  <Badge key={eIdx} color="primary" pill className="text-white">
                                    {empresa}
                                  </Badge>
                                ))}
                              </div>
                              <hr />
                            </div>
                          ))}
                        </CardBody>
                      </Card>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Programacion;
