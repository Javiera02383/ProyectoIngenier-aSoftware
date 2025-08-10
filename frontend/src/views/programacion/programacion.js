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
  Spinner  
} from "reactstrap";  
import { useNavigate } from "react-router-dom";  
import HeaderResponsive from "components/Headers/HeaderResponsive";  
import { programacionService } from "../../services/programacion/programacionService";  
  
const Programacion = () => {  
  const navigate = useNavigate();  
  const [pauta, setPauta] = useState([]);  
  const [loading, setLoading] = useState(true);  
  
  useEffect(() => {  
    cargarProgramacion();  
  }, []);  
  
  const cargarProgramacion = async () => {  
    try {  
      setLoading(true);  
      const data = await programacionService.obtenerProgramacionCompleta();  
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
        }  
        // ... resto de datos hardcodeados como fallback  
      ]);  
    } finally {  
      setLoading(false);  
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
                <h3 className="mb-0 font-bold text-uppercase">Programación</h3>  
                <p className="text-primary font-semibold">Lunes a Sábado - Agosto 2025</p>  
              </CardHeader>  
              <CardBody>  
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
              </CardBody>  
            </Card>  
          </Col>  
        </Row>  
      </Container>  
    </>  
  );  
};  
  
export default Programacion;