import React, { useState, useEffect } from 'react';  
import { useParams, useNavigate } from 'react-router-dom';  
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
  Alert  
} from 'reactstrap';  
import { inventarioService } from '../../services/inventario/inventarioService';  
import { useToast } from '../../hooks/useToast';  
import HeaderBlanco from 'components/Headers/HeaderBlanco';  
import Toast from 'components/Toast/Toast';  
  
const DetalleActivo = () => {  
  const { id } = useParams();  
  const navigate = useNavigate();  
  const [activo, setActivo] = useState(null);  
  const [loading, setLoading] = useState(true);  
  const [error, setError] = useState('');  
  const { toast, showError, hideToast } = useToast();  
  
    useEffect(() => {
    const cargarActivo = async () => {
      try {
        setLoading(true);
        const data = await inventarioService.obtenerInventarioPorId(id);
        console.log('Datos del activo recibidos:', data);
        console.log('Empleado:', data.Empleado);
        console.log('Proveedor:', data.Proveedor);
        setActivo(data);
      } catch (error) {
        console.error('Error al cargar activo:', error);
        setError('Error al cargar los detalles del activo');
        showError('Error al cargar los detalles del activo');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      cargarActivo();
    }
  }, [id, showError]);  
  
  const formatearFecha = (fecha) => {  
    if (!fecha) return 'No especificada';  
    return new Date(fecha).toLocaleDateString('es-ES', {  
      year: 'numeric',  
      month: 'long',  
      day: 'numeric'  
    });  
  };  
  
  const formatearMoneda = (valor) => {  
    if (!valor) return 'No especificado';  
    return `L. ${parseFloat(valor).toFixed(2)}`;  
  };  
  
  const getEstadoBadge = (estado) => {  
    const colores = {  
      'Disponible': 'success',  
      'Asignado': 'info',  
      'En Mantenimiento': 'warning',  
      'Baja': 'danger'  
    };  
    return colores[estado] || 'secondary';  
  };  
  
  if (loading) {  
    return (  
      <>  
        <HeaderBlanco />  
        <Container className="mt--7" fluid>  
          <div className="text-center py-5">  
            <Spinner size="lg" color="primary" />  
            <p className="mt-3">Cargando detalles del activo...</p>  
          </div>  
        </Container>  
      </>  
    );  
  }  
  
  if (error || !activo) {  
    return (  
      <>  
        <HeaderBlanco />  
        <Toast show={toast.show} message={toast.message} type={toast.type} onClose={hideToast} />  
        <Container className="mt--7" fluid>  
          <Row>  
            <Col>  
              <Alert color="danger">  
                {error || 'Activo no encontrado'}  
              </Alert>  
              <Button color="secondary" onClick={() => navigate('/admin/lista-activos')}>  
                Volver a Lista de Activos  
              </Button>  
            </Col>  
          </Row>  
        </Container>  
      </>  
    );  
  }  
  
  return (  
    <>  
      <HeaderBlanco />  
      <Toast show={toast.show} message={toast.message} type={toast.type} onClose={hideToast} />  
      <Container className="mt--7" fluid>  
        <Row>  
          <Col>  
            <Card className="shadow">  
              <CardHeader className="border-0">  
                <Row className="align-items-center">  
                  <Col xs="8">  
                    <h3 className="mb-0">Detalles del Activo</h3>  
                    <p className="text-sm mb-0 text-muted">  
                      Información completa del activo seleccionado  
                    </p>  
                  </Col>  
                  <Col xs="4" className="text-right">  
                    <Button  
                      color="primary"  
                      size="sm"  
                      onClick={() => navigate(`/admin/editar-activo/${activo.idInventario}`)}  
                    >  
                      <i className="fas fa-edit mr-1" />  
                      Editar  
                    </Button>  
                    <Button  
                      color="secondary"  
                      size="sm"  
                      onClick={() => navigate('/admin/lista-activos')}  
                      className="ml-2"  
                    >  
                      <i className="fas fa-arrow-left mr-1" />  
                      Volver  
                    </Button>  
                  </Col>  
                </Row>  
              </CardHeader>  
              <CardBody>  
                <Row>  
                  {/* Información Básica */}  
                  <Col lg="6">  
                    <Card className="card-stats mb-4">  
                      <CardBody>  
                        <h6 className="heading-small text-muted mb-4">  
                          <i className="fas fa-info-circle mr-2" />  
                          Información Básica  
                        </h6>  
                        <Row>  
                          <Col>  
                            <div className="mb-3">  
                              <label className="form-control-label">Código</label>  
                              <div className="form-control-plaintext font-weight-bold">  
                                {activo.codigo}  
                              </div>  
                            </div>  
                            <div className="mb-3">  
                              <label className="form-control-label">Nombre</label>  
                              <div className="form-control-plaintext">  
                                {activo.nombre}  
                              </div>  
                            </div>  
                            <div className="mb-3">  
                              <label className="form-control-label">Descripción</label>  
                              <div className="form-control-plaintext">  
                                {activo.descripcion || 'Sin descripción'}  
                              </div>  
                            </div>  
                            <div className="mb-3">  
                              <label className="form-control-label">Estado</label>  
                              <div>  
                                <Badge color={getEstadoBadge(activo.estado)} className="badge-lg">  
                                  {activo.estado}  
                                </Badge>  
                              </div>  
                            </div>  
                          </Col>  
                        </Row>  
                      </CardBody>  
                    </Card>  
                  </Col>  
  
                  {/* Información de Inventario */}  
                  <Col lg="6">  
                    <Card className="card-stats mb-4">  
                      <CardBody>  
                        <h6 className="heading-small text-muted mb-4">  
                          <i className="fas fa-boxes mr-2" />  
                          Información de Inventario  
                        </h6>  
                        <Row>  
                          <Col>  
                            <div className="mb-3">  
                              <label className="form-control-label">Cantidad</label>  
                              <div className="form-control-plaintext font-weight-bold text-primary">  
                                {activo.cantidad} unidades  
                              </div>  
                            </div>  
                            <div className="mb-3">  
                              <label className="form-control-label">Ubicación</label>  
                              <div className="form-control-plaintext">  
                                <i className="fas fa-map-marker-alt mr-1" />  
                                {activo.ubicacion}  
                              </div>  
                            </div>  
                            <div className="mb-3">  
                              <label className="form-control-label">Valor</label>  
                              <div className="form-control-plaintext">  
                                {formatearMoneda(activo.valor)}  
                              </div>  
                            </div>  
                            <div className="mb-3">  
                              <label className="form-control-label">Marca</label>  
                              <div className="form-control-plaintext">  
                                {activo.marca || 'No especificada'}  
                              </div>  
                            </div>  
                          </Col>  
                        </Row>  
                      </CardBody>  
                    </Card>  
                  </Col>  
                </Row>  
  
                <Row>  
                  {/* Información de Asignación */}  
                  <Col lg="6">  
                    <Card className="card-stats mb-4">  
                      <CardBody>  
                        <h6 className="heading-small text-muted mb-4">  
                          <i className="fas fa-user mr-2" />  
                          Información de Asignación  
                        </h6>  
                        <Row>  
                          <Col>  
                                                        <div className="mb-3">
                              <label className="form-control-label">Empleado Asignado</label>
                              <div className="form-control-plaintext">
                                {activo.Empleado ? (
                                  <span>
                                    <i className="fas fa-user-circle mr-1" />
                                    {activo.Empleado.nombre || activo.Empleado.persona?.nombreCompleto || 'Nombre no disponible'}
                                  </span>
                                ) : (
                                  <span className="text-muted">No asignado</span>
                                )}
                              </div>
                            </div>  
                                                        <div className="mb-3">
                              <label className="form-control-label">Proveedor</label>
                              <div className="form-control-plaintext">
                                {activo.Proveedor ? (
                                  <span>
                                    <i className="fas fa-building mr-1" />
                                    {activo.Proveedor.nombre || activo.Proveedor.persona?.nombreCompleto || 'Nombre no disponible'}
                                  </span>
                                ) : (
                                  <span className="text-muted">No especificado</span>
                                )}
                              </div>
                            </div>  
                          </Col>  
                        </Row>  
                      </CardBody>  
                    </Card>  
                  </Col>  
  
                  {/* Información de Fechas */}  
                  <Col lg="6">  
                    <Card className="card-stats mb-4">  
                      <CardBody>  
                        <h6 className="heading-small text-muted mb-4">  
                          <i className="fas fa-calendar mr-2" />  
                          Información de Fechas  
                        </h6>  
                        <Row>  
                          <Col>  
                            <div className="mb-3">  
                              <label className="form-control-label">Fecha de Compra</label>  
                              <div className="form-control-plaintext">  
                                <i className="fas fa-shopping-cart mr-1" />  
                                {formatearFecha(activo.fechaCompra)}  
                              </div>  
                            </div>  
                            <div className="mb-3">  
                              <label className="form-control-label">Fecha de Registro</label>  
                              <div className="form-control-plaintext">  
                                <i className="fas fa-plus-circle mr-1" />  
                                {formatearFecha(activo.fechaRegistro)}  
                              </div>  
                            </div>  
                          </Col>  
                        </Row>  
                      </CardBody>  
                    </Card>  
                  </Col>  
                </Row>  
  
                {/* Observaciones */}  
                {activo.observacion && (  
                  <Row>  
                    <Col>  
                      <Card className="card-stats">  
                        <CardBody>  
                          <h6 className="heading-small text-muted mb-4">  
                            <i className="fas fa-sticky-note mr-2" />  
                            Observaciones  
                          </h6>  
                          <div className="form-control-plaintext">  
                            {activo.observacion}  
                          </div>  
                        </CardBody>  
                      </Card>  
                    </Col>  
                  </Row>  
                )}  
              </CardBody>  
            </Card>  
          </Col>  
        </Row>  
      </Container>  
    </>  
  );  
};  
  
export default DetalleActivo;