import React, { useState, useEffect } from "react";  
import {  
  Card,  
  CardHeader,  
  CardBody,  
  Container,  
  Row,  
  Col,  
  Button,  
  Badge,  
  Spinner,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane
} from "reactstrap";  
import { useNavigate } from "react-router-dom";  
import HeaderResponsive from "components/Headers/HeaderResponsive";  
import CalendarioPautas from "views/programacion/CalendarioPautas";  
import { programacionService } from "../../services/programacion/programacionService";  
import classnames from 'classnames';
  
const Programacion = () => {  
  const navigate = useNavigate();  
  const [pauta, setPauta] = useState([]);  
  const [pautaDomingos, setPautaDomingos] = useState([]);  
  const [loading, setLoading] = useState(true);  
  const [loadingDomingos, setLoadingDomingos] = useState(true);  
  const [activeTab, setActiveTab] = useState('1');
  
  useEffect(() => {  
    cargarProgramacion();  
    cargarProgramacionDomingos();  
  }, []);  
  
  const cargarProgramacion = async () => {  
    try {  
      setLoading(true);  
      const data = await programacionService.obtenerProgramacionPorTipoCalendario('Lunes_Sabado');  
      setPauta(data);  
    } catch (error) {  
      console.error("Error al cargar programación:", error);  
      // Mantener datos hardcodeados como fallback si hay error  
      setPauta([  
        {  
          bloque: "NOTICIAS 60 MINUTOS",  
          comerciales: [  
            { hora: "7:05", empresas: [] },  
            { hora: "7:30", empresas: ["CLARO", "SECOPV", "MUNICOM", "MACONSA", "UNAH"] }  
          ]  
        },
        {
          bloque: "PELÍCULA MATUTINA",
          comerciales: [
            { hora: "8:00", empresas: ["CINE", "ENTRETENIMIENTO"] },
            { hora: "9:30", empresas: ["PELICULA", "SERIE"] }
          ]
        },
        {
          bloque: "TELENOVELA",
          comerciales: [
            { hora: "14:00", empresas: ["DRAMA", "ROMANCE"] },
            { hora: "15:00", empresas: ["TELENOVELA", "SERIE"] }
          ]
        }
      ]);  
    } finally {  
      setLoading(false);  
    }  
  };  

  const cargarProgramacionDomingos = async () => {
    try {
      setLoadingDomingos(true);
      const data = await programacionService.obtenerProgramacionPorTipoCalendario('Domingo');
      setPautaDomingos(data);
    } catch (error) {
      console.error("Error al cargar programación dominical:", error);
      // Datos hardcodeados de ejemplo para domingos
      setPautaDomingos([
        {
          bloque: "MISA DOMINICAL",
          comerciales: [
            { hora: "8:00", empresas: ["IGLESIA", "COMUNIDAD"] },
            { hora: "9:00", empresas: ["RELIGION", "FE"] }
          ]
        },
        {
          bloque: "PROGRAMA FAMILIAR",
          comerciales: [
            { hora: "10:30", empresas: ["FAMILIA", "COLEGIO"] },
            { hora: "11:30", empresas: ["EDUCACION", "CULTURA"] }
          ]
        },
        {
          bloque: "ESPECIAL DOMINGO",
          comerciales: [
            { hora: "16:00", empresas: ["ENTRETENIMIENTO", "FAMILIA"] },
            { hora: "18:00", empresas: ["CULTURA", "ARTE"] }
          ]
        }
      ]);
    } finally {
      setLoadingDomingos(false);
    }
  };

  const toggleTab = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
  };
  
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
            </Card>  
          </Col>  
        </Row>  

        <Row className="mt-4">
          <Col>
            <Card className="shadow">
              <CardHeader className="text-center">
                <h3 className="mb-0 font-bold text-uppercase">Programación del Canal 40</h3>
                <p className="text-primary font-semibold">Agosto 2025</p>
              </CardHeader>
              <CardBody>
                <Nav tabs>
                  <NavItem>
                    <NavLink
                      className={classnames({ active: activeTab === '1' })}
                      onClick={() => toggleTab('1')}
                    >
                      <i className="ni ni-calendar-grid-58 mr-2"></i>
                      Lunes a Sábado
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      className={classnames({ active: activeTab === '2' })}
                      onClick={() => toggleTab('2')}
                    >
                      <i className="ni ni-sun-fog-29 mr-2"></i>
                      Domingos
                    </NavLink>
                  </NavItem>
                </Nav>

                <TabContent activeTab={activeTab} className="mt-3">
                  <TabPane tabId="1">
                    <div className="text-center mb-3">
                      <h5 className="text-info">
                        <i className="ni ni-time-alarm mr-2"></i>
                        Programación Regular - Lunes a Sábado
                      </h5>
                    </div>
                    {loading ? (  
                      <div className="text-center">  
                        <Spinner color="primary" />  
                        <p>Cargando programación...</p>  
                      </div>  
                    ) : (  
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
                                        <Badge key={eIdx} color="primary" pill className="text-black">  
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
                    )}
                  </TabPane>

                  <TabPane tabId="2">
                    <div className="text-center mb-3">
                      <h5 className="text-warning">
                        <i className="ni ni-sun-fog-29 mr-2"></i>
                        Programación Dominical
                      </h5>
                    </div>
                    {loadingDomingos ? (
                      <div className="text-center">
                        <Spinner color="warning" />
                        <p>Cargando programación dominical...</p>
                      </div>
                    ) : (
                      <div style={{ overflowX: "auto", whiteSpace: "nowrap" }}>
                        {pautaDomingos.map((bloque, index) => (
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
                              <CardHeader className="bg-warning text-white text-center py-2">
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
                                        <Badge key={eIdx} color="warning" pill className="text-black">
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
                    )}
                  </TabPane>
                </TabContent>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>  
    </>  
  );  
};  
  
export default Programacion;