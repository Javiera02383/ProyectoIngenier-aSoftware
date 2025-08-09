// views/programacion/Contratos.js  
import HeaderBlanco from "components/Headers/HeaderBlanco.js";
import { useEffect, useState } from "react";
import {
  Alert,
  Badge,
  Button,
  Card, CardBody, CardHeader,
  Col,
  Container,
  Form,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody, ModalFooter,
  ModalHeader,
  Row,
  Table
} from "reactstrap";
import { clienteService } from "../../services/gestion_cliente/clienteService";
import { empleadoService } from "../../services/gestion_cliente/empleadoService";
import { ordenPublicidadService } from "../../services/programacion/ordenpublicidadService";
  
const Contratos = () => {  
  // Estados principales  
  const [ordenes, setOrdenes] = useState([]);  
  const [clientes, setClientes] = useState([]);  
  const [empleados, setEmpleados] = useState([]);  
  const [loading, setLoading] = useState(false);  
  const [loadingData, setLoadingData] = useState(true);  
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });  
  
  // Estados del formulario  
  const [nuevaOrden, setNuevaOrden] = useState({  
    idCliente: "",  
    producto: "",  
    periodoInicio: "",  
    periodoFin: "",  
    valorSinImpuesto: "",  
    impuesto: "",  // Agregar este campo  
    costoTotal: "",  
    costoPeriodo: "",  
    idEmpleado: "",  
    fechaAlAire: "",  
    observaciones: ""  
  }); 
  
  // Estados de filtros  
  const [filtros, setFiltros] = useState({  
    estado: "",  
    idCliente: "",  
    fechaInicio: "",  
    fechaFin: ""  
  });  
  
  // Estados de modales  
  const [modalCrear, setModalCrear] = useState(false);  
  const [modalEditar, setModalEditar] = useState(false);  
  const [ordenSeleccionada, setOrdenSeleccionada] = useState(null);  
  
  // Cargar datos iniciales  
  useEffect(() => {  
    cargarDatosIniciales();  
  }, []);  
  
  // Cargar órdenes cuando cambien los filtros  
  useEffect(() => {  
    cargarOrdenes();  
  }, [filtros]);  

  useEffect(() => {
  if (nuevaOrden.valorSinImpuesto) {
    const valorSin = parseFloat(nuevaOrden.valorSinImpuesto) || 0;
    const impuesto = valorSin * 0.15;
    const total = valorSin + impuesto;
    setNuevaOrden(prev => ({
      ...prev,
      impuesto: impuesto.toFixed(2),
      costoTotal: total.toFixed(2),
      costoPeriodo: total.toFixed(2),
    }));
  }
}, [nuevaOrden.valorSinImpuesto]);
  
  const cargarDatosIniciales = async () => {  
    try {  
      setLoadingData(true);  
      const [clientesRes, empleadosRes] = await Promise.all([  
        clienteService.obtenerTodosLosClientes(),  
        empleadoService.obtenerTodosLosEmpleados()  
      ]);  
  
      setClientes(clientesRes.data || clientesRes || []);  
      setEmpleados(empleadosRes.data || empleadosRes || []);  
        
      await cargarOrdenes();  
    } catch (error) {  
      console.error('Error cargando datos:', error);   
    } finally {  
      setLoadingData(false);  
    }  
  };  
  
  const cargarOrdenes = async () => {  
    try {  
      const ordenesRes = await ordenPublicidadService.obtenerOrdenes(filtros);  
      setOrdenes(ordenesRes || []);  
    } catch (error) {  
      console.error('Error cargando órdenes:', error);  
      setMensaje({  
        tipo: 'danger',  
        texto: 'Error al cargar las órdenes de publicidad.'  
      });  
    }  
  };  
  
  const handleChange = (e) => {  
    const { name, value } = e.target;  
    setNuevaOrden(prev => {  
      const updated = { ...prev, [name]: value };  
        
      // Calcular automáticamente costos cuando cambie valorSinImpuesto  
      if (name === 'valorSinImpuesto' && value) {  
        const valorSin = parseFloat(value) || 0;  
        const impuesto = valorSin * 0.15;  
        const total = valorSin + impuesto;  
        updated.impuesto = impuesto.toFixed(2);  
        updated.costoTotal = total.toFixed(2);  
        updated.costoPeriodo = total.toFixed(2);  
      }  
        
      return updated;  
    });  
  };  
  
  const handleFiltroChange = (e) => {  
    const { name, value } = e.target;  
    setFiltros(prev => ({ ...prev, [name]: value }));  
  };  
  
  const limpiarFiltros = () => {  
    setFiltros({  
      estado: "",  
      idCliente: "",  
      fechaInicio: "",  
      fechaFin: ""  
    });  
  };  
  
  const validarFormulario = () => {  
    const { idCliente, producto, periodoInicio, periodoFin, valorSinImpuesto, idEmpleado } = nuevaOrden;  
      
    if (!idCliente || !producto || !periodoInicio || !periodoFin || !valorSinImpuesto || !idEmpleado) {  
      setMensaje({  
        tipo: 'danger',  
        texto: 'Todos los campos obligatorios deben ser completados.'  
      });  
      return false;  
    }  
  
    if (new Date(periodoFin) <= new Date(periodoInicio)) {  
      setMensaje({  
        tipo: 'danger',  
        texto: 'La fecha de fin debe ser posterior a la fecha de inicio.'  
      });  
      return false;  
    }  
  
    return true;  
  };  
  
  const crearOrden = async () => {  
    if (!validarFormulario()) return;  
  
    try {  
      setLoading(true);  
      const ordenData = {  
        ...nuevaOrden,  
        idCliente: parseInt(nuevaOrden.idCliente),  
        idEmpleado: parseInt(nuevaOrden.idEmpleado),  
        valorSinImpuesto: parseFloat(nuevaOrden.valorSinImpuesto),  
        costoTotal: parseFloat(nuevaOrden.costoTotal),  
        costoPeriodo: parseFloat(nuevaOrden.costoPeriodo)  
      };  
  
      await ordenPublicidadService.crearOrden(ordenData);  
        
      setMensaje({  
        tipo: 'success',  
        texto: 'Orden de publicidad creada exitosamente.'  
      });  
  
      limpiarFormulario();  
      setModalCrear(false);  
      cargarOrdenes();  
    } catch (error) {  
      console.error('Error creando orden:', error);  
      setMensaje({  
        tipo: 'danger',  
        texto: error.response?.data?.mensaje || 'Error al crear la orden de publicidad.'  
      });  
    } finally {  
      setLoading(false);  
    }  
  };  
  
const editarOrden = async () => {
  if (!validarFormulario()) return;

  try {
    setLoading(true);
    const ordenData = {
      ...nuevaOrden,
      idCliente: parseInt(nuevaOrden.idCliente),
      idEmpleado: parseInt(nuevaOrden.idEmpleado),
      valorSinImpuesto: parseFloat(nuevaOrden.valorSinImpuesto),
      costoTotal: parseFloat(nuevaOrden.costoTotal),
      costoPeriodo: parseFloat(nuevaOrden.costoPeriodo)
    };

    await ordenPublicidadService.actualizarOrden(ordenSeleccionada.idOrden, ordenData);

    setMensaje({
      tipo: 'success',
      texto: 'Orden de publicidad actualizada exitosamente.'
    });

    // Recarga las órdenes desde el backend para tener datos frescos y completos
    await cargarOrdenes();

    limpiarFormulario();
    setModalEditar(false);
    setOrdenSeleccionada(null);
  } catch (error) {
    console.error('Error editando orden:', error);
    setMensaje({
      tipo: 'danger',
      texto: error.response?.data?.mensaje || 'Error al actualizar la orden de publicidad.'
    });
  } finally {
    setLoading(false);
  }
};


  
  const aprobarOrden = async (id) => {  
    try {  
      await ordenPublicidadService.aprobarOrden(id);  
      setMensaje({  
        tipo: 'success',  
        texto: 'Orden aprobada exitosamente.'  
      });  
      cargarOrdenes();  
    } catch (error) {  
      console.error('Error aprobando orden:', error);  
      setMensaje({  
        tipo: 'danger',  
        texto: error.response?.data?.mensaje || 'Error al aprobar la orden.'  
      });  
    }  
  };  
  
  const cancelarOrden = async (id) => {  
    if (window.confirm('¿Está seguro de cancelar esta orden?')) {  
      try {  
        await ordenPublicidadService.cancelarOrden(id);  
        setMensaje({  
          tipo: 'success',  
          texto: 'Orden cancelada exitosamente.'  
        });  
        cargarOrdenes();  
      } catch (error) {  
        console.error('Error cancelando orden:', error);  
        setMensaje({  
          tipo: 'danger',  
          texto: error.response?.data?.mensaje || 'Error al cancelar la orden.'  
        });  
      }  
    }  
  };  
  
  const eliminarOrden = async (id) => {  
    if (window.confirm('¿Está seguro de eliminar esta orden? Esta acción no se puede deshacer.')) {  
      try {  
        await ordenPublicidadService.eliminarOrden(id);  
        setMensaje({  
          tipo: 'success',  
          texto: 'Orden eliminada exitosamente.'  
        });  
        cargarOrdenes();  
      } catch (error) {  
        console.error('Error eliminando orden:', error);  
        setMensaje({  
          tipo: 'danger',  
          texto: error.response?.data?.mensaje || 'Error al eliminar la orden.'  
        });  
      }  
    }  
  };  
  
  const generarPDF = async (id) => {  
    try {  
      await ordenPublicidadService.generarPDF(id);  
      setMensaje({  
        tipo: 'success',  
        texto: 'PDF generado exitosamente.'  
      });  
    } catch (error) {  
      console.error('Error generando PDF:', error);  
      setMensaje({  
        tipo: 'danger',  
        texto: 'Error al generar el PDF.'  
      });  
    }  
  };  
  
  const visualizarPDF = (id) => {  
    ordenPublicidadService.visualizarPDF(id);  
  };  
  
  const descargarPDF = async (id) => {  
    try {  
      await ordenPublicidadService.descargarPDF(id);  
    } catch (error) {  
      console.error('Error descargando PDF:', error);  
      setMensaje({  
        tipo: 'danger',  
        texto: 'Error al descargar el PDF.'  
      });  
    }  
  };  
  
  const abrirModalCrear = () => {  
    limpiarFormulario();  
    setModalCrear(true);  
  };  
  
  const abrirModalEditar = (orden) => {  
    setOrdenSeleccionada(orden);  
    setNuevaOrden({  
      idCliente: orden.idCliente,  
      producto: orden.producto,  
      periodoInicio: orden.periodoInicio,  
      periodoFin: orden.periodoFin,  
      valorSinImpuesto: orden.valorSinImpuesto,  
      costoTotal: orden.costoTotal,  
      costoPeriodo: orden.costoPeriodo,  
      idEmpleado: orden.idEmpleado,  
      fechaAlAire: orden.fechaAlAire || "",  
      observaciones: orden.observaciones || ""  
    });  
    setModalEditar(true);  
  };  
  
  const limpiarFormulario = () => {  
    setNuevaOrden({  
      idCliente: "",  
      producto: "",  
      periodoInicio: "",  
      periodoFin: "",  
      valorSinImpuesto: "",  
      costoTotal: "",  
      costoPeriodo: "",  
      idEmpleado: "",  
      fechaAlAire: "",  
      observaciones: ""  
    });  
    setMensaje({ tipo: '', texto: '' });  
  };  
  
  const getEstadoBadge = (estado) => {  
    const colores = {  
      'Pendiente': 'warning',  
      'Aprobada': 'info',  
      'En_Emision': 'primary',  
      'Finalizada': 'success',  
      'Cancelada': 'danger'  
    };  
    return <Badge color={colores[estado] || 'secondary'}>{estado}</Badge>;  
  };  
  
  const getNombreCliente = (orden) => {  
    if (orden.Cliente?.persona) {  
      const p = orden.Cliente.persona;  
      return `${p.Pnombre} `.trim();  
    }  
    return 'Cliente no disponible';  
  };  
  
  const getNombreEmpleado = (orden) => {  
    if (orden.Empleado?.persona) {  
      const p = orden.Empleado.persona;  
      return `${p.Pnombre} ${p.Snombre || ''} ${p.Papellido} ${p.Sapellido || ''}`.trim();  
    }  
    return 'Empleado no disponible';  
  };  
  
  if (loadingData) {  
    return (  
      <>  
        <HeaderBlanco />  
        <Container className="mt--7" fluid>  
          <Row>  
            <Col>  
              <Card className="shadow">  
                <CardBody className="text-center">  
                  <i className="fas fa-spinner fa-spin fa-2x mb-3" />  
                  <p>Cargando datos...</p>  
                </CardBody>  
              </Card>  
            </Col>  
          </Row>  
        </Container>  
      </>  
    );  
  }  
  
  return (  
    <>  
      <HeaderBlanco />  
      <Container className="mt--7" fluid>  
        <Row>  
          <Col>  
            <Card className="shadow">  
              <CardHeader className="border-0  
    ">  
                <Row className="align-items-center">  
                  <Col xs="8">  
                    <h3 className="mb-0">Gestión de Órdenes de Publicidad - Canal 40</h3>  
                  </Col>  
                  <Col xs="4" className="text-right">  
                    <Button color="primary" onClick={abrirModalCrear}>  
                      <i className="fas fa-plus" /> Nueva Orden  
                    </Button>  
                  </Col>  
                </Row>  
  
                {/* Filtros */}  
                <Row className="mt-3">  
                  <Col md="3">  
                    <FormGroup>  
                      <Label>Estado</Label>  
                      <Input  
                        type="select"  
                        name="estado"  
                        value={filtros.estado}  
                        onChange={handleFiltroChange}  
                      >  
                        <option value="">Todos los estados</option>  
                        <option value="Pendiente">Pendiente</option>  
                        <option value="Aprobada">Aprobada</option>  
                        <option value="En_Emision">En Emisión</option>  
                        <option value="Finalizada">Finalizada</option>  
                        <option value="Cancelada">Cancelada</option>  
                      </Input>  
                    </FormGroup>  
                  </Col>  
                  <Col md="3">  
                    <FormGroup>  
                      <Label>Cliente</Label>  
                      <Input  
                        type="select"  
                        name="idCliente"  
                        value={filtros.idCliente}  
                        onChange={handleFiltroChange}  
                      >  
                        <option value="">Todos los clientes</option>  
                        {clientes.map(cliente => (  
                          <option key={cliente.idCliente} value={cliente.idCliente}>  
                            {cliente.persona?.Pnombre} {cliente.persona?.Papellido}  
                          </option>  
                        ))}  
                      </Input>  
                    </FormGroup>  
                  </Col>  
                  <Col md="3">  
                    <FormGroup>  
                      <Label>Fecha Inicio</Label>  
                      <Input  
                        type="date"  
                        name="fechaInicio"  
                        value={filtros.fechaInicio}  
                        onChange={handleFiltroChange}  
                      />  
                    </FormGroup>  
                  </Col>  
                  <Col md="3">  
                    <FormGroup>  
                      <Label>Fecha Fin</Label>  
                      <Input  
                        type="date"  
                        name="fechaFin"  
                        value={filtros.fechaFin}  
                        onChange={handleFiltroChange}  
                      />  
                    </FormGroup>  
                  </Col>  
                </Row>  
                <Row>  
                  <Col className="text-right">  
                    <Button color="secondary" size="sm" onClick={limpiarFiltros}>  
                      <i className="fas fa-times" /> Limpiar Filtros  
                    </Button>  
                  </Col>  
                </Row>  
              </CardHeader>  
  
              <CardBody>  
                {mensaje.texto && (  
                  <Alert color={mensaje.tipo} className="mb-4">  
                    {mensaje.texto}  
                  </Alert>  
                )}  
  
                {/* Tabla de Órdenes */}  
                <Table className="align-items-center table-flush" responsive>  
                  <thead className="thead-light">  
                    <tr>  
                      <th>No. Orden</th>  
                      <th>Cliente</th>  
                      <th>Producto</th>  
                      <th>Período</th>  
                      <th>Valor Sin ISV</th>  
                      <th>Impuesto (15%)</th>  
                      <th>Costo Total</th>  
                      <th>Estado</th>  
                      <th>Acciones</th>  
                    </tr>  
                  </thead> 
                  <tbody>  
                    {ordenes.map(orden => (  
                      <tr key={orden.idOrden}>  
                        <td>  
                          <span className="font-weight-bold">  
                            {orden.numeroOrden}  
                          </span>  
                        </td>  
                        <td>{getNombreCliente(orden)}</td>  
                        <td>{orden.producto}</td>  
                        <td>  
                          {new Date(orden.periodoInicio).toLocaleDateString()} -   
                          {new Date(orden.periodoFin).toLocaleDateString()}  
                        </td>  
                        <td>L. {parseFloat(orden.valorSinImpuesto).toFixed(2)}</td>
                        <td>L. {parseFloat(orden.impuesto).toFixed(2)}</td>
                        <td>L. {parseFloat(orden.costoTotal).toFixed(2)}</td>
                        <td>{getEstadoBadge(orden.estado)}</td>  
                        <td>  
                          <div className="btn-group" role="group">  
                            <Button  
                              color="info"  
                              size="sm"  
                              onClick={() => visualizarPDF(orden.idOrden)}  
                              title="Ver PDF"  
                            >  
                              <i className="fas fa-eye" />  
                            </Button>  
                            <Button  
                              color="success"  
                              size="sm"  
                              onClick={() => descargarPDF(orden.idOrden)}  
                              title="Descargar PDF"  
                            >  
                              <i className="fas fa-download" />  
                            </Button>  
                            {orden.estado === 'Pendiente' && (  
                              <>  
                                <Button  
                                  color="warning"  
                                  size="sm"  
                                  onClick={() => abrirModalEditar(orden)}  
                                  title="Editar"  
                                >  
                                  <i className="fas fa-edit" />  
                                </Button>  
                                <Button  
                                  color="primary"  
                                  size="sm"  
                                  onClick={() => aprobarOrden(orden.idOrden)}  
                                  title="Aprobar"  
                                >  
                                  <i className="fas fa-check" />  
                                </Button>  
                              </>  
                            )}  
                            {(orden.estado === 'Pendiente' || orden.estado === 'Aprobada') && (  
                              <Button  
                                color="danger"  
                                size="sm"  
                                onClick={() => cancelarOrden(orden.idOrden)}  
                                title="Cancelar"  
                              >  
                                <i className="fas fa-times" />  
                              </Button>  
                            )}  
                            {orden.estado === 'Pendiente' && (  
                              <Button  
                                color="danger"  
                                size="sm"  
                                onClick={() => eliminarOrden(orden.idOrden)}  
                                title="Eliminar"  
                              >  
                                <i className="fas fa-trash" />  
                              </Button>  
                            )}  
                          </div>  
                        </td>  
                      </tr>  
                    ))}  
                  </tbody>  
                </Table>  
  
                {ordenes.length === 0 && (  
                  <div className="text-center py-4">  
                    <i className="fas fa-file-contract fa-2x text-muted" />  
                    <p className="mt-2 text-muted">No hay órdenes de publicidad registradas</p>  
                  </div>  
                )}  
              </CardBody>  
            </Card>  
          </Col>  
        </Row>  
  
        {/* Modal Crear Orden */}  
        <Modal isOpen={modalCrear} toggle={() => setModalCrear(false)} size="lg">  
          <ModalHeader toggle={() => setModalCrear(false)}>  
            Nueva Orden de Publicidad  
          </ModalHeader>  
          <ModalBody>  
            <Form>  
              <Row>  
                <Col md="6">  
                  <FormGroup>  
                    <Label>Cliente *</Label>  
                    <Input  
                      type="select"  
                      name="idCliente"  
                      value={nuevaOrden.idCliente}  
                      onChange={handleChange}  
                      required  
                    >  
                      <option value="">Seleccionar cliente...</option>  
                      {clientes.map(cliente => (  
                        <option key={cliente.idCliente} value={cliente.idCliente}>  
                          {cliente.persona?.Pnombre} {cliente.persona?.Snombre} {cliente.persona?.Papellido} {cliente.persona?.Sapellido}  
                        </option>  
                      ))}  
                    </Input>  
                  </FormGroup>  
                </Col>  
                <Col md="6">  
                  <FormGroup>  
                    <Label>Empleado Responsable *</Label>  
                    <Input  
                      type="select"  
                      name="idEmpleado"  
                      value={nuevaOrden.idEmpleado}  
                      onChange={handleChange}  
                      required  
                    >  
                      <option value="">Seleccionar empleado...</option>  
                      {empleados.map(empleado => (  
                        <option key={empleado.idEmpleado} value={empleado.idEmpleado}>  
                          {empleado.persona?.Pnombre} {empleado.persona?.Papellido}  
                        </option>  
                      ))}  
                    </Input>  
                  </FormGroup>  
                </Col>  
              </Row>  
  
              <Row>  
                <Col md="12">  
                  <FormGroup>  
                    <Label>Producto/Servicio *</Label>  
                    <Input  
                      type="text"  
                      name="producto"  
                      value={nuevaOrden.producto}  
                      onChange={handleChange}  
                      placeholder="Ej: Spot publicitario 30 segundos"  
                      required  
                    />  
                  </FormGroup>  
                </Col>  
              </Row>  
  
              <Row>  
                <Col md="6">  
                  <FormGroup>  
                    <Label>Período Inicio *</Label>  
                    <Input  
                      type="date"  
                      name="periodoInicio"  
                      value={nuevaOrden.periodoInicio}  
                      onChange={handleChange}  
                      required  
                    />  
                  </FormGroup>  
                </Col>  
                <Col md="6">  
                  <FormGroup>  
                    <Label>Período Fin *</Label>  
                    <Input  
                      type="date"  
                      name="periodoFin"  
                      value={nuevaOrden.periodoFin}  
                      onChange={handleChange}  
                      required  
                    />  
                  </FormGroup>  
                </Col>  
              </Row>  
  
              <Row>  
                <Col md="3">  
                  <FormGroup>  
                    <Label>Valor Sin ISV (L.) *</Label>  
                    <Input  
                      type="number"  
                      step="0.01"  
                      name="valorSinImpuesto"  
                      value={nuevaOrden.valorSinImpuesto}  
                      onChange={handleChange}  
                      placeholder="0.00"  
                      required  
                    />  
                  </FormGroup>  
                </Col>  
                <Col md="3">  
                  <FormGroup>  
                    <Label>Impuesto 15% ISV (L.)</Label>  
                    <Input  
                      type="number"  
                      step="0.01"  
                      name="impuesto"  
                      value={nuevaOrden.impuesto || ''}  
                      readOnly  
                      placeholder="Calculado automáticamente"  
                    />  
                  </FormGroup>  
                </Col>  
                <Col md="3">  
                  <FormGroup>  
                    <Label>Costo Total (L.)</Label>  
                    <Input  
                      type="number"  
                      step="0.01"  
                      name="costoTotal"  
                      value={nuevaOrden.costoTotal}  
                      readOnly  
                      placeholder="Calculado automáticamente"  
                    />  
                  </FormGroup>  
                </Col>  
                <Col md="3">  
                  <FormGroup>  
                    <Label>Costo Período (L.)</Label>  
                    <Input  
                      type="number"  
                      step="0.01"  
                      name="costoPeriodo"  
                      value={nuevaOrden.costoPeriodo}  
                      readOnly  
                      placeholder="Calculado automáticamente"  
                    />  
                  </FormGroup>  
                </Col>  
              </Row> 
  
              <Row>  
                <Col md="6">  
                  <FormGroup>  
                    <Label>Fecha Al Aire</Label>  
                    <Input  
                      type="date"  
                      name="fechaAlAire"  
                      value={nuevaOrden.fechaAlAire}  
                      onChange={handleChange}  
                    />  
                  </FormGroup>  
                </Col>  
              </Row>  
  
              <Row>  
                <Col md="12">  
                  <FormGroup>  
                    <Label>Observaciones</Label>  
                    <Input  
                      type="textarea"  
                      name="observaciones"  
                      value={nuevaOrden.observaciones}  
                      onChange={handleChange}  
                      rows="3"  
                      placeholder="Observaciones adicionales..."  
                    />  
                  </FormGroup>  
                </Col>  
              </Row>  
            </Form>  
          </ModalBody>  
          <ModalFooter>  
            <Button color="primary" onClick={crearOrden} disabled={loading}>  
              {loading ? (  
                <>  
                  <i className="fas fa-spinner fa-spin" /> Creando...  
                </>  
              ) : (  
                <>  
                  <i className="fas fa-save" /> Crear Orden  
                </>  
              )}  
            </Button>  
            <Button color="secondary" onClick={() => setModalCrear(false)}>  
              Cancelar  
            </Button>  
          </ModalFooter>  
        </Modal>  
  
        {/* Modal Editar Orden */}  
        <Modal isOpen={modalEditar} toggle={() => setModalEditar(false)} size="lg">  
          <ModalHeader toggle={() => setModalEditar(false)}>  
            Editar Orden de Publicidad  
          </ModalHeader>  
          <ModalBody>  
            <Form>  
              {/* Mismo formulario que crear, pero con datos precargados */}  
              <Row>  
                <Col md="6">  
                  <FormGroup>  
                    <Label>Cliente *</Label>  
                    <Input  
                      type="select"  
                      name="idCliente"  
                      value={nuevaOrden.idCliente}  
                      onChange={handleChange}  
                      required  
                    >  
                      <option value="">Seleccionar cliente...</option>  
                      {clientes.map(cliente => (  
                        <option key={cliente.idCliente} value={cliente.idCliente}>  
                          {cliente.persona?.Pnombre} {cliente.persona?.Snombre} {cliente.persona?.Papellido} {cliente.persona?.Sapellido}  
                        </option>  
                      ))}  
                    </Input>  
                  </FormGroup>  
                </Col>  
                <Col md="6">  
                  <FormGroup>  
                    <Label>Empleado Responsable *</Label>  
                    <Input  
                      type="select"  
                      name="idEmpleado"  
                      value={nuevaOrden.idEmpleado}  
                      onChange={handleChange}  
                      required  
                    >  
                      <option value="">Seleccionar empleado...</option>  
                      {empleados.map(empleado => (  
                        <option key={empleado.idEmpleado} value={empleado.idEmpleado}>  
                          {empleado.persona?.Pnombre} {empleado.persona?.Papellido}  
                        </option>  
                      ))}  
                    </Input>  
                  </FormGroup>  
                </Col>  
              </Row>  
  
              <Row>  
                <Col md="12">  
                  <FormGroup>  
                    <Label>Producto/Servicio *</Label>  
                    <Input  
                      type="text"  
                      name="producto"  
                      value={nuevaOrden.producto}  
                      onChange={handleChange}  
                      placeholder="Ej: Spot publicitario 30 segundos"  
                      required  
                    />  
                  </FormGroup>  
               </Col>  
              </Row>  
  
              <Row>  
                <Col md="6">  
                  <FormGroup>  
                    <Label>Período Inicio *</Label>  
                    <Input  
                      type="date"  
                      name="periodoInicio"  
                      value={nuevaOrden.periodoInicio}  
                      onChange={handleChange}  
                      required  
                    />  
                  </FormGroup>  
                </Col>  
                <Col md="6">  
                  <FormGroup>  
                    <Label>Período Fin *</Label>  
                    <Input  
                      type="date"  
                      name="periodoFin"  
                      value={nuevaOrden.periodoFin}  
                      onChange={handleChange}  
                      required  
                    />  
                  </FormGroup>  
                </Col>  
              </Row>  
  
              <Row>  
                <Col md="4">  
                  <FormGroup>  
                    <Label>Valor Sin Impuesto (L.) *</Label>  
                    <Input  
                      type="number"  
                      step="0.01"  
                      name="valorSinImpuesto"  
                      value={nuevaOrden.valorSinImpuesto}  
                      onChange={handleChange}  
                      placeholder="0.00"  
                      required  
                    />  
                  </FormGroup>  
                </Col>  
                <Col md="4">  
                  <FormGroup>  
                    <Label>Costo Total (L.)</Label>  
                    <Input  
                      type="number"  
                      step="0.01"  
                      name="costoTotal"  
                      value={nuevaOrden.costoTotal}  
                      readOnly  
                      placeholder="Calculado automáticamente"  
                    />  
                  </FormGroup>  
                </Col>  
                <Col md="4">  
                  <FormGroup>  
                    <Label>Costo Período (L.)</Label>  
                    <Input  
                      type="number"  
                      step="0.01"  
                      name="costoPeriodo"  
                      value={nuevaOrden.costoPeriodo}  
                      readOnly  
                      placeholder="Calculado automáticamente"  
                    />  
                  </FormGroup>  
                </Col>  
              </Row>  
  
              <Row>  
                <Col md="6">  
                  <FormGroup>  
                    <Label>Fecha Al Aire</Label>  
                    <Input  
                      type="date"  
                      name="fechaAlAire"  
                      value={nuevaOrden.fechaAlAire}  
                      onChange={handleChange}  
                    />  
                  </FormGroup>  
                </Col>  
              </Row>  
  
              <Row>  
                <Col md="12">  
                  <FormGroup>  
                    <Label>Observaciones</Label>  
                    <Input  
                      type="textarea"  
                      name="observaciones"  
                      value={nuevaOrden.observaciones}  
                      onChange={handleChange}  
                      rows="3"  
                      placeholder="Observaciones adicionales..."  
                    />  
                  </FormGroup>  
                </Col>  
              </Row>  
            </Form>  
          </ModalBody>  
          <ModalFooter>  
            <Button color="primary" onClick={editarOrden} disabled={loading}>  
              {loading ? (  
                <>  
                  <i className="fas fa-spinner fa-spin" /> Actualizando...  
                </>  
              ) : (  
                <>  
                  <i className="fas fa-save" /> Actualizar Orden  
                </>  
              )}  
            </Button>  
            <Button color="secondary" onClick={() => setModalEditar(false)}>  
              Cancelar  
            </Button>  
          </ModalFooter>  
        </Modal>  
      </Container>  
    </>  
  );  
};  
  
export default Contratos;