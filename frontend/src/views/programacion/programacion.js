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
  TabPane,
  Alert
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
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });
  
  useEffect(() => {  
    cargarProgramacion();  
    cargarProgramacionDomingos();  
  }, []);  
  
  const cargarProgramacion = async () => {  
    try {  
      setLoading(true);  
      const data = await programacionService.obtenerProgramacionPorTipoCalendario('Lunes_Sabado');  
      console.log('✅ Datos de programación cargados:', data);
      setPauta(data);  
    } catch (error) {  
      console.error("❌ Error al cargar programación:", error);  
      // Mostrar mensaje de error
      mostrarMensaje('warning', 'No se pudieron cargar los datos del servidor. Mostrando datos de demostración.');
      
      // Mantener datos hardcodeados como fallback si hay error  
      setPauta([  
        {  
          bloque: "NOTICIAS 60 MINUTOS",  
          idPrograma: null, // Marcar como datos de demostración
          comerciales: [  
            { hora: "7:05", idPauta: null, empresas: [] },  
            { hora: "7:30", idPauta: null, empresas: ["CLARO", "SECOPV", "MUNICOM", "MACONSA", "UNAH"] }  
          ]  
        },
        {
          bloque: "PELÍCULA MATUTINA",
          idPrograma: null,
          comerciales: [
            { hora: "8:00", idPauta: null, empresas: ["CINE", "ENTRETENIMIENTO"] },
            { hora: "9:30", idPauta: null, empresas: ["PELICULA", "SERIE"] }
          ]
        },
        {
          bloque: "TELENOVELA",
          idPrograma: null,
          comerciales: [
            { hora: "14:00", idPauta: null, empresas: ["DRAMA", "ROMANCE"] },
            { hora: "15:00", idPauta: null, empresas: ["TELENOVELA", "SERIE"] }
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
      console.log('✅ Datos de programación dominical cargados:', data);
      setPautaDomingos(data);
    } catch (error) {
      console.error("❌ Error al cargar programación dominical:", error);
      // Mostrar mensaje de error
      mostrarMensaje('warning', 'No se pudieron cargar los datos del servidor. Mostrando datos de demostración.');
      
      // Datos hardcodeados de ejemplo para domingos
      setPautaDomingos([
        {
          bloque: "MISA DOMINICAL",
          idPrograma: null,
          comerciales: [
            { hora: "8:00", idPauta: null, empresas: ["IGLESIA", "COMUNIDAD"] },
            { hora: "9:00", idPauta: null, empresas: ["RELIGION", "FE"] }
          ]
        },
        {
          bloque: "PROGRAMA FAMILIAR",
          idPrograma: null,
          comerciales: [
            { hora: "10:30", idPauta: null, empresas: ["FAMILIA", "COLEGIO"] },
            { hora: "11:30", idPauta: null, empresas: ["EDUCACION", "CULTURA"] }
          ]
        },
        {
          bloque: "ESPECIAL DOMINGO",
          idPrograma: null,
          comerciales: [
            { hora: "16:00", idPauta: null, empresas: ["ENTRETENIMIENTO", "FAMILIA"] },
            { hora: "18:00", idPauta: null, empresas: ["CULTURA", "ARTE"] }
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

  // Función para eliminar programa
  const eliminarPrograma = async (idPrograma, nombrePrograma) => {
    // Verificar que tenemos un ID válido
    if (!idPrograma || typeof idPrograma === 'string' || idPrograma === null) {
      mostrarMensaje('warning', 'No se puede eliminar este programa. Los datos están en modo de demostración.');
      return;
    }

    if (window.confirm(`¿Está seguro de eliminar el programa "${nombrePrograma}"? Esta acción no se puede deshacer.`)) {
      try {
        console.log('🔄 Eliminando programa con ID:', idPrograma);
        const resultado = await programacionService.eliminarPrograma(idPrograma);
        console.log('✅ Resultado de eliminación de programa:', resultado);
        
        mostrarMensaje('success', `Programa "${nombrePrograma}" eliminado exitosamente`);
        
        // Recargar la programación inmediatamente
        console.log('🔄 Recargando programación después de eliminar programa...');
        await cargarProgramacion();
        await cargarProgramacionDomingos();
        console.log('✅ Programación recargada exitosamente');
        
      } catch (error) {
        console.error('❌ Error eliminando programa:', error);
        
        // Si el error es específico de programa con bloques
        if (error.response?.data?.codigo === 'PROGRAMA_CON_BLOQUES') {
          const { mensaje, bloquesAsociados } = error.response.data;
          mostrarMensaje('warning', `${mensaje} (${bloquesAsociados} bloques asociados)`);
        }
        // Si el error es específico de programa con órdenes
        else if (error.response?.data?.codigo === 'PROGRAMA_CON_ORDENES') {
          const { mensaje, ordenesAsociadas } = error.response.data;
          
          const opcion = window.confirm(
            `${mensaje}\n\n` +
            `Órdenes asociadas: ${ordenesAsociadas.length}\n\n` +
            `Opciones:\n` +
            `1. Eliminar programa y órdenes en cascada (recomendado)\n` +
            `2. Cancelar eliminación\n\n` +
            `¿Desea eliminar el programa y todas sus órdenes de programación?`
          );
          
          if (opcion) {
            try {
              console.log('🔄 Eliminando programa con órdenes en cascada...');
              
              // Eliminar en cascada
              const resultadoCascada = await programacionService.eliminarProgramaConOrdenes(idPrograma);
              console.log('✅ Resultado de eliminación en cascada:', resultadoCascada);
              
              mostrarMensaje('success', `Programa "${nombrePrograma}" y ${ordenesAsociadas.length} órdenes eliminados exitosamente`);
              
              // Recargar la programación después de eliminación en cascada
              console.log('🔄 Recargando programación después de eliminación en cascada...');
              await cargarProgramacion();
              await cargarProgramacionDomingos();
              console.log('✅ Programación recargada exitosamente');
              
            } catch (cascadeError) {
              console.error('❌ Error eliminando en cascada:', cascadeError);
              mostrarMensaje('danger', `Error al eliminar en cascada: ${cascadeError.message}`);
            }
          }
        } else {
          // Error genérico
          mostrarMensaje('danger', `Error al eliminar el programa: ${error.message}`);
        }
      }
    }
  };

  // Función para eliminar pauta
  const eliminarPauta = async (idPauta, nombrePauta) => {
    // Verificar que tenemos un ID válido
    if (!idPauta || typeof idPauta === 'string' || idPauta === null) {
      mostrarMensaje('warning', 'No se puede eliminar esta pauta. Los datos están en modo de demostración.');
      return;
    }

    try {
      // Primero intentar eliminar normalmente
      console.log('🔄 Eliminando pauta con ID:', idPauta);
      await programacionService.eliminarPauta(idPauta);
      mostrarMensaje('success', `Pauta "${nombrePauta}" eliminada exitosamente`);
      
      // Recargar la programación inmediatamente
      await cargarProgramacion();
      await cargarProgramacionDomingos();
      
    } catch (error) {
      console.error('Error eliminando pauta:', error);
      
      // Si el error es específico de bloque con anuncios
      if (error.response?.data?.codigo === 'BLOQUE_CON_ANUNCIOS') {
        const { mensaje, opciones, anunciosAsociados } = error.response.data;
        
        // Mostrar opciones al usuario
        const opcion = window.confirm(
          `${mensaje}\n\n` +
          `Anuncios asociados: ${anunciosAsociados.length}\n\n` +
          `Opciones:\n` +
          `1. Eliminar bloque y anuncios (recomendado)\n` +
          `2. Cancelar\n\n` +
          `¿Desea eliminar el bloque y todos sus anuncios?`
        );
        
        if (opcion) {
          try {
            console.log('🔄 Eliminando en cascada bloque y anuncios...');
            
            // Eliminar en cascada
            const resultado = await programacionService.eliminarPautaConAnuncios(idPauta);
            console.log('✅ Resultado de eliminación en cascada:', resultado);
            
            mostrarMensaje('success', `Pauta "${nombrePauta}" y ${anunciosAsociados.length} anuncios eliminados exitosamente`);
            
            // Recargar la programación después de eliminación en cascada
            console.log('🔄 Recargando programación después de eliminación en cascada...');
            await cargarProgramacion();
            await cargarProgramacionDomingos();
            
            console.log('✅ Programación recargada exitosamente');
            
          } catch (cascadeError) {
            console.error('❌ Error eliminando en cascada:', cascadeError);
            mostrarMensaje('danger', `Error al eliminar en cascada: ${cascadeError.message}`);
          }
        }
      } else {
        // Error genérico
        mostrarMensaje('danger', `Error al eliminar la pauta: ${error.message}`);
      }
    }
  };

  // Función para verificar si un elemento se puede eliminar
  const sePuedeEliminar = (id) => {
    return id && typeof id === 'number' && id > 0;
  };

  // Función para mostrar mensajes
  const mostrarMensaje = (tipo, texto) => {
    setMensaje({ tipo, texto });
    setTimeout(() => setMensaje({ tipo: '', texto: '' }), 5000);
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
                  <Button color="success" className="me-2" onClick={() => navigate("/admin/crear-pauta")}>  
                    <i className="ni ni-fat-add mr-2"></i> Nueva Pauta  
                  </Button>
                  
                </div>  
              </CardHeader>   
            </Card>  
          </Col>  
        </Row>  

        {/* Mensajes de estado */}
        {mensaje.texto && (
          <Row className="mt-3">
            <Col>
              <Alert color={mensaje.tipo} className="mb-0">
                {mensaje.texto}
              </Alert>
            </Col>
          </Row>
        )}

        {/* Indicador de modo demostración */}
        {(pauta.length > 0 && pauta[0].idPrograma === null) || 
         (pautaDomingos.length > 0 && pautaDomingos[0].idPrograma === null) ? (
          <Row className="mt-3">
            <Col>
              <Alert color="info" className="mb-0">
                <i className="ni ni-info-2 mr-2"></i>
                <strong>Modo Demostración:</strong> Los datos mostrados son de ejemplo. 
                Los botones de eliminar solo funcionan con datos reales del servidor.
              </Alert>
            </Col>
          </Row>
        ) : null}

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
                              <CardHeader className="bg-info text-white text-center py-2 d-flex justify-content-between align-items-center">  
                                <strong>{bloque.bloque}</strong>
                                <div>
                                  <Button
                                    color="danger"
                                    size="sm"
                                    onClick={() => eliminarPrograma(bloque.idPrograma, bloque.bloque)}
                                    title={sePuedeEliminar(bloque.idPrograma) ? 
                                      `Eliminar Programa: ${bloque.bloque}` : 
                                      'No se puede eliminar - Datos de demostración'}
                                    className="ml-2"
                                    disabled={!sePuedeEliminar(bloque.idPrograma)}
                                  >
                                    <i className="ni ni-fat-remove"></i>
                                    {sePuedeEliminar(bloque.idPrograma) ? '' : ' Demo'}
                                  </Button>
                                </div>
                              </CardHeader>
                              <CardBody style={{ maxHeight: "400px", overflowY: "auto" }}>  
                                {bloque.comerciales.map((comercial, idx) => (  
                                  <div key={idx} className="mb-3">  
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                      <h6 className="text-muted mb-0">  
                                        ⏰ <strong>{comercial.hora}</strong>  
                                      </h6>
                                      <Button
                                        color="warning"
                                        size="sm"
                                        onClick={() => eliminarPauta(comercial.idPauta, `${bloque.bloque} - ${comercial.hora}`)}
                                        title={sePuedeEliminar(comercial.idPauta) ? 
                                          `Eliminar Pauta: ${bloque.bloque} - ${comercial.hora}` : 
                                          'No se puede eliminar - Datos de demostración'}
                                        disabled={!sePuedeEliminar(comercial.idPauta)}
                                      >
                                        <i className="ni ni-fat-remove"></i>
                                        {sePuedeEliminar(comercial.idPauta) ? '' : ' Demo'}
                                      </Button>
                                    </div>
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
                              <CardHeader className="bg-warning text-white text-center py-2 d-flex justify-content-between align-items-center">
                                <strong>{bloque.bloque}</strong>
                                <div>
                                  <Button
                                    color="danger"
                                    size="sm"
                                    onClick={() => eliminarPrograma(bloque.idPrograma, bloque.bloque)}
                                    title={sePuedeEliminar(bloque.idPrograma) ? 
                                      `Eliminar Programa: ${bloque.bloque}` : 
                                      'No se puede eliminar - Datos de demostración'}
                                    className="ml-2"
                                    disabled={!sePuedeEliminar(bloque.idPrograma)}
                                  >
                                    <i className="ni ni-fat-remove"></i>
                                    {sePuedeEliminar(bloque.idPrograma) ? '' : ' Demo'}
                                  </Button>
                                </div>
                              </CardHeader>
                              <CardBody style={{ maxHeight: "400px", overflowY: "auto" }}>
                                {bloque.comerciales.map((comercial, idx) => (
                                  <div key={idx} className="mb-3">
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                      <h6 className="text-muted mb-0">
                                        ⏰ <strong>{comercial.hora}</strong>
                                      </h6>
                                      <Button
                                        color="warning"
                                        size="sm"
                                        onClick={() => eliminarPauta(comercial.idPauta, `${bloque.bloque} - ${comercial.hora}`)}
                                        title="Eliminar Pauta"
                                        disabled={!comercial.idPauta}
                                      >
                                        <i className="ni ni-fat-remove"></i>
                                      </Button>
                                    </div>
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