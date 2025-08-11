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
  Table,
  Spinner
} from "reactstrap";
import { clienteService } from "../../services/gestion_cliente/clienteService";
import { empleadoService } from "../../services/gestion_cliente/empleadoService";
import { ordenPublicidadService } from "../../services/programacion/ordenpublicidadService";
import { ordenProgramacionService } from "../../services/programacion/ordenProgramacionService";
  
const Contratos = () => {  
  // Estados principales  
  const [ordenes, setOrdenes] = useState([]);  
  const [clientes, setClientes] = useState([]);  
  const [empleados, setEmpleados] = useState([]);  
  const [loading, setLoading] = useState(false);  
  const [loadingData, setLoadingData] = useState(true);  
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });  
  // Estados para programación
  const [programas, setProgramas] = useState([]);
  
  // Estados del formulario  
  const [nuevaOrden, setNuevaOrden] = useState({  
    // Información básica de la orden
    idCliente: '',
    producto: '',
    periodoInicio: '',
    periodoFin: '',
    valorSinImpuesto: '',
    costoTotal: '',
    costoPeriodo: '',
    idEmpleado: '',
    observaciones: ''
  });

  // Estado para manejar múltiples pautas de programación
  const [pautas, setPautas] = useState([]);
  const [nuevaPauta, setNuevaPauta] = useState({
    idPrograma: '',
    duracionPauta: 30,
    cantidadSpots: 1,
    diasEmision: '',
    observaciones: ''
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

  // Debug effect para monitorear cambios en programas
  useEffect(() => {
    console.log('🔄 Estado actual de programas:', programas);
  }, [programas]);
  
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
      costoPeriodo: total.toFixed(2)
    }));
  }
}, [nuevaOrden.valorSinImpuesto]);
  
  const cargarDatosIniciales = async () => {  
    try {  
      setLoadingData(true);  
      const [clientesRes, empleadosRes, programasRes] = await Promise.all([  
        clienteService.obtenerTodosLosClientes(),  
        empleadoService.obtenerTodosLosEmpleados(),
        ordenProgramacionService.obtenerProgramas()
      ]);  

      console.log('Respuesta de programas:', programasRes);
  
      setClientes(clientesRes.data || clientesRes || []);  
      setEmpleados(empleadosRes.data || empleadosRes || []);  
      setProgramas(programasRes.data || programasRes || []);
        
      console.log('Programas cargados:', programasRes.data || programasRes || []);
        
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
  try {
    if (!nuevaOrden.idCliente || !nuevaOrden.producto || !nuevaOrden.periodoInicio || 
        !nuevaOrden.periodoFin || !nuevaOrden.valorSinImpuesto || !nuevaOrden.idEmpleado) {
      mostrarToast('Por favor complete todos los campos obligatorios de la orden', 'warning');
      return;
    }

    if (pautas.length === 0) {
      mostrarToast('Debe agregar al menos una pauta de programación', 'warning');
      return;
    }

      setLoading(true);  

    // 1. Crear la orden básica
      const ordenData = {  
      idCliente: nuevaOrden.idCliente,
      producto: nuevaOrden.producto,
      periodoInicio: nuevaOrden.periodoInicio,
      periodoFin: nuevaOrden.periodoFin,
        valorSinImpuesto: parseFloat(nuevaOrden.valorSinImpuesto),  
        costoTotal: parseFloat(nuevaOrden.costoTotal),  
      costoPeriodo: parseFloat(nuevaOrden.costoPeriodo),
      idEmpleado: nuevaOrden.idEmpleado,
      observaciones: nuevaOrden.observaciones
    };

    const ordenCreada = await ordenPublicidadService.crearOrden(ordenData);
    const idOrden = ordenCreada.orden?.idOrden || ordenCreada.idOrden;

    // 2. Crear todas las pautas de programación
    const pautasData = pautas.map(pauta => {
      const programa = programas.find(p => p.idPrograma == pauta.idPrograma);
      return {
        idOrden: idOrden,
        idPrograma: pauta.idPrograma,
        duracionPauta: parseInt(pauta.duracionPauta),
        cantidadSpots: parseInt(pauta.cantidadSpots),
        diasEmision: pauta.diasEmision,
        observaciones: pauta.observaciones || null
      };
    });

    await ordenProgramacionService.crearMultiplesPautas(idOrden, pautasData);

    // 3. Generar PDF automáticamente
    await ordenPublicidadService.generarPDF(idOrden);

    mostrarToast('Orden de publicidad creada exitosamente con todas las pautas', 'success');
    
    // Limpiar formularios
    limpiarFormularios();
    
    // Cerrar modal y recargar datos
    toggleModalCrear();
    cargarDatosIniciales();
    
    } catch (error) {  
    console.error('Error al crear orden:', error);
    mostrarToast('Error al crear la orden de publicidad', 'error');
    } finally {  
      setLoading(false);  
    }  
  };  
  
// Función para agregar una nueva pauta
const agregarPauta = () => {
  if (!nuevaPauta.idPrograma || !nuevaPauta.diasEmision) {
    mostrarToast('Por favor complete todos los campos obligatorios de la pauta', 'warning');
    return;
  }

  const pautaConId = {
    ...nuevaPauta,
    id: Date.now() // ID temporal para el frontend
  };

  setPautas([...pautas, pautaConId]);
  
  // Limpiar formulario de pauta
  setNuevaPauta({
    idPrograma: '',
    duracionPauta: 30,
    cantidadSpots: 1,
    diasEmision: '',
    observaciones: ''
  });

  mostrarToast('Pauta agregada exitosamente', 'success');
};

// Función para remover una pauta
const removerPauta = (idPauta) => {
  setPautas(pautas.filter(pauta => pauta.id !== idPauta));
  mostrarToast('Pauta removida', 'info');
};

// Función para editar una pauta
const editarPauta = (idPauta) => {
  const pauta = pautas.find(p => p.id === idPauta);
  if (pauta) {
    setNuevaPauta(pauta);
    setPautas(pautas.filter(p => p.id !== idPauta));
    mostrarToast('Pauta cargada para edición', 'info');
  }
};

// Función para limpiar formularios
const limpiarFormularios = () => {
  setNuevaOrden({
    idCliente: '',
    producto: '',
    periodoInicio: '',
    periodoFin: '',
    valorSinImpuesto: '',
    costoTotal: '',
    costoPeriodo: '',
    idEmpleado: '',
    observaciones: ''
  });
  
  setPautas([]);
  setNuevaPauta({
    idPrograma: '',
    duracionPauta: 30,
    cantidadSpots: 1,
    diasEmision: '',
    observaciones: ''
  });
};

// Función para mostrar toast (si no existe)
const mostrarToast = (mensaje, tipo = 'info') => {
  // Si tienes un sistema de toast, úsalo aquí
  // Por ahora usamos console.log
  console.log(`${tipo.toUpperCase()}: ${mensaje}`);
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
      setLoading(true);
      await ordenPublicidadService.generarPDF(id);  
      setMensaje({  
        tipo: 'success',  
        texto: 'PDF generado exitosamente. Ahora puede visualizarlo o descargarlo.'  
      });  
      // Recargar las órdenes para obtener la información actualizada del PDF
      await cargarOrdenes();
    } catch (error) {  
      console.error('Error generando PDF:', error);  
      let mensajeError = 'Error al generar el PDF.';
      
      if (error.response?.status === 404) {
        mensajeError = 'Orden no encontrada.';
      } else if (error.response?.status === 401) {
        mensajeError = 'No autorizado. Verifique su sesión.';
      } else if (error.response?.status === 500) {
        mensajeError = 'Error del servidor al generar el PDF.';
      }
      
      setMensaje({  
        tipo: 'danger',  
        texto: mensajeError
      });  
    } finally {
      setLoading(false);
    }  
  };  
  
  const visualizarPDF = async (id) => {  
    try {
      await ordenPublicidadService.visualizarPDF(id);
      setMensaje({
        tipo: 'success',
        texto: 'PDF abierto en nueva pestaña.'
      });
    } catch (error) {
      console.error('Error visualizando PDF:', error);
      let mensajeError = 'Error al visualizar el PDF.';
      
      if (error.response?.status === 404) {
        mensajeError = 'PDF no encontrado. Intente generar el PDF primero.';
      } else if (error.response?.status === 401) {
        mensajeError = 'No autorizado. Verifique su sesión.';
      } else if (error.response?.status === 500) {
        mensajeError = 'Error del servidor al procesar el PDF.';
      }
      
      setMensaje({
        tipo: 'danger',
        texto: mensajeError
      });
    }
  };  
  
  const descargarPDF = async (id) => {  
    try {  
      await ordenPublicidadService.descargarPDF(id);  
      setMensaje({
        tipo: 'success',
        texto: 'PDF descargado exitosamente.'
      });
    } catch (error) {  
      console.error('Error descargando PDF:', error);  
      let mensajeError = 'Error al descargar el PDF.';
      
      if (error.response?.status === 404) {
        mensajeError = 'PDF no encontrado. Intente generar el PDF primero.';
      } else if (error.response?.status === 401) {
        mensajeError = 'No autorizado. Verifique su sesión.';
      } else if (error.response?.status === 500) {
        mensajeError = 'Error del servidor al procesar el PDF.';
      }
      
      setMensaje({  
        tipo: 'danger',  
        texto: mensajeError
      });  
    }  
  };  
  
  const abrirModalCrear = () => {  
    setModalCrear(true);  
  limpiarFormularios();
};

const toggleModalCrear = () => {
  setModalCrear(!modalCrear);
  if (!modalCrear) {
    limpiarFormularios();
  }
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
                      <th>Acciones</th>
                      <th>Estado</th>
                      <th>No. Orden</th>  
                      <th>Cliente</th>  
                      <th>Producto</th>  
                      <th>Período</th>  
                      <th>Valor Sin ISV</th>  
                      <th>Impuesto (15%)</th>  
                      <th>Costo Total</th>  
                        
                      <th>PDF</th>
                    </tr>  
                  </thead> 
                  <tbody>  
                    {ordenes.map(orden => (  
                      
                      <tr key={orden.idOrden}> 
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
                        <td>{getEstadoBadge(orden.estado)}</td>  
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
                        
                        <td>
                          {orden.archivo_pdf ? (
                            <Badge color="success" className="d-flex align-items-center">
                              <i className="fas fa-file-pdf mr-1" />
                              Disponible
                            </Badge>
                          ) : (
                            <Badge color="warning" className="d-flex align-items-center">
                              <i className="fas fa-exclamation-triangle mr-1" />
                              Pendiente
                            </Badge>
                          )}
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
        <Modal isOpen={modalCrear} toggle={toggleModalCrear} size="lg">
          <ModalHeader toggle={toggleModalCrear}>
            Crear Nueva Orden de Publicidad
          </ModalHeader>  
          <ModalBody>  
            <Alert color="info">
              <strong>Información:</strong> El PDF se generará automáticamente después de crear la orden.
            </Alert>
            
            {/* Sección 1: Información básica de la orden */}
            <h5 className="mb-3">Información de la Orden</h5>
              <Row>  
              <Col md={6}>
                  <FormGroup>  
                    <Label>Cliente *</Label>  
                    <Input  
                      type="select"  
                      value={nuevaOrden.idCliente}  
                    onChange={(e) => setNuevaOrden({...nuevaOrden, idCliente: e.target.value})}
                    >  
                    <option value="">Seleccionar cliente</option>
                      {clientes.map(cliente => (  
                        <option key={cliente.idCliente} value={cliente.idCliente}>  
                        {cliente.persona?.Pnombre} {cliente.persona?.Papellido}
                        </option>  
                      ))}  
                    </Input>  
                  </FormGroup>  
                </Col>  
              <Col md={6}>
                  <FormGroup>  
                  <Label>Producto *</Label>
                  <Input
                    value={nuevaOrden.producto}
                    onChange={(e) => setNuevaOrden({...nuevaOrden, producto: e.target.value})}
                    placeholder="Descripción del producto o servicio"
                  />
                </FormGroup>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label>Período de Inicio *</Label>
                  <Input
                    type="date"
                    value={nuevaOrden.periodoInicio}
                    onChange={(e) => setNuevaOrden({...nuevaOrden, periodoInicio: e.target.value})}
                  />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label>Período de Fin *</Label>
                  <Input
                    type="date"
                    value={nuevaOrden.periodoFin}
                    onChange={(e) => setNuevaOrden({...nuevaOrden, periodoFin: e.target.value})}
                  />
                </FormGroup>
              </Col>
            </Row>

            <Row>
              <Col md={4}>
                <FormGroup>
                  <Label>Valor sin Impuesto *</Label>
                  <Input
                    type="number"
                    value={nuevaOrden.valorSinImpuesto}
                    onChange={(e) => {
                      const valor = parseFloat(e.target.value) || 0;
                      const impuesto = valor * 0.15;
                      const total = valor + impuesto;
                      setNuevaOrden({
                        ...nuevaOrden, 
                        valorSinImpuesto: e.target.value,
                        costoTotal: total.toFixed(2)
                      });
                    }}
                    placeholder="0.00"
                    step="0.01"
                  />
                </FormGroup>
              </Col>
              <Col md={4}>
                <FormGroup>
                  <Label>Impuesto (15%)</Label>
                  <Input
                    type="number"
                    value={((parseFloat(nuevaOrden.valorSinImpuesto) || 0) * 0.15).toFixed(2)}
                    disabled
                  />
                </FormGroup>
              </Col>
              <Col md={4}>
                <FormGroup>
                  <Label>Costo Total</Label>
                  <Input
                    type="number"
                    value={nuevaOrden.costoTotal}
                    onChange={(e) => setNuevaOrden({...nuevaOrden, costoTotal: e.target.value})}
                    placeholder="0.00"
                    step="0.01"
                  />
                </FormGroup>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label>Costo del Período *</Label>
                  <Input
                    type="number"
                    value={nuevaOrden.costoPeriodo}
                    onChange={(e) => setNuevaOrden({...nuevaOrden, costoPeriodo: e.target.value})}
                    placeholder="0.00"
                    step="0.01"
                  />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label>Empleado *</Label>
                    <Input  
                      type="select"  
                      value={nuevaOrden.idEmpleado}  
                    onChange={(e) => setNuevaOrden({...nuevaOrden, idEmpleado: e.target.value})}
                    >  
                    <option value="">Seleccionar empleado</option>
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
              <Col md={12}>
                  <FormGroup>  
                  <Label>Observaciones</Label>
                    <Input  
                    type="textarea"
                    value={nuevaOrden.observaciones}
                    onChange={(e) => setNuevaOrden({...nuevaOrden, observaciones: e.target.value})}
                    placeholder="Observaciones adicionales sobre la orden"
                    />  
                  </FormGroup>  
                </Col>  
              </Row>  
  
            <hr className="my-4" />

            {/* Sección 2: Gestión de pautas de programación */}
            <h5 className="mb-3">Pautas de Programación</h5>
            
            {/* Indicador de estado de datos */}
            <Alert color={loadingData ? "warning" : "success"} className="mb-3">
              {loadingData ? (
                <><i className="fas fa-spinner fa-spin mr-2" />Cargando datos de programación...</>
              ) : (
                <><i className="fas fa-check mr-2" />
                  Datos cargados: {programas.length} programas disponibles
                </>
              )}
              <Button 
                color="info" 
                size="sm" 
                className="ml-3" 
                onClick={() => {
                  console.log('🔄 Recargando datos manualmente...');
                  cargarDatosIniciales();
                }}
              >
                <i className="fas fa-sync-alt mr-1" />Recargar
              </Button>
            </Alert>

            {/* Formulario para nueva pauta */}
            <Card className="mb-3">
              <CardHeader>
                <h6 className="mb-0">Agregar Nueva Pauta</h6>
              </CardHeader>
              <CardBody>
              <Row>  
                  <Col md={4}>
                  <FormGroup>  
                      <Label>Programa *</Label>
                    <Input  
                        type="select"
                        value={nuevaPauta.idPrograma}
                        onChange={(e) => setNuevaPauta({...nuevaPauta, idPrograma: e.target.value})}
                        disabled={loadingData}
                      >
                        <option value="">
                          {loadingData ? 'Cargando programas...' : 'Seleccionar programa'}
                        </option>
                        {programas.map(programa => (
                          <option key={programa.idPrograma} value={programa.idPrograma}>
                            {programa.nombre}
                          </option>
                        ))}
                      </Input>
                  </FormGroup>  
                </Col>  
                  <Col md={4}>
                  <FormGroup>  
                      <Label>Duración (min) *</Label>
                    <Input  
                      type="number"  
                        value={nuevaPauta.duracionPauta}
                        onChange={(e) => setNuevaPauta({...nuevaPauta, duracionPauta: e.target.value})}
                        min="1"
                    />  
                  </FormGroup>  
                </Col>  
                  <Col md={4}>
                  <FormGroup>  
                      <Label>Cantidad Spots *</Label>
                    <Input  
                      type="number"  
                        value={nuevaPauta.cantidadSpots}
                        onChange={(e) => setNuevaPauta({...nuevaPauta, cantidadSpots: e.target.value})}
                        min="1"
                    />  
                  </FormGroup>  
                </Col>  
                  <Col md={6}>
                  <FormGroup>  
                      <Label>Días de Emisión *</Label>
                    <Input  
                        value={nuevaPauta.diasEmision}
                        onChange={(e) => setNuevaPauta({...nuevaPauta, diasEmision: e.target.value})}
                        placeholder="Lunes,Martes,Miércoles"
                    />  
                  </FormGroup>  
                </Col>  
                </Row>

                <Row>
                  <Col md={12}>
                  <FormGroup>  
                      <Label>Observaciones de Pauta</Label>
                    <Input  
                      type="textarea"  
                        value={nuevaPauta.observaciones}
                        onChange={(e) => setNuevaPauta({...nuevaPauta, observaciones: e.target.value})}
                        placeholder="Observaciones específicas de esta pauta"
                    />  
                  </FormGroup>  
                </Col>  
              </Row>  

                <div className="text-center mt-3">
                  <Button color="primary" onClick={agregarPauta}>
                    <i className="fas fa-plus mr-2"></i>
                    Agregar Pauta
                  </Button>
                </div>
              </CardBody>
            </Card>

            {/* Lista de pautas agregadas */}
            {pautas.length > 0 && (
              <Card>
                <CardHeader>
                  <h6 className="mb-0">Pautas Agregadas ({pautas.length})</h6>
                </CardHeader>
                <CardBody>
                  <div className="table-responsive">
                    <Table size="sm">
                      <thead>
                        <tr>
                          <th>Programa</th>
                          <th>Hora</th>
                          <th>Duración</th>
                          <th>Spots</th>
                          <th>Días</th>
                          <th>Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pautas.map((pauta, index) => (
                          <tr key={pauta.id}>
                            <td>
                              {programas.find(p => p.idPrograma == pauta.idPrograma)?.nombre || 'N/A'}
                            </td>
                            <td>
                              {programas.find(p => p.idPrograma == pauta.idPrograma)?.horaInicio || 'N/A'}
                            </td>
                            <td>{pauta.duracionPauta} min</td>
                            <td>{pauta.cantidadSpots}</td>
                            <td>{pauta.diasEmision}</td>
                            <td>
                              <Button
                                color="warning"
                                size="sm"
                                onClick={() => editarPauta(pauta.id)}
                                className="mr-1"
                              >
                                <i className="fas fa-edit"></i>
                              </Button>
                              <Button
                                color="danger"
                                size="sm"
                                onClick={() => removerPauta(pauta.id)}
                              >
                                <i className="fas fa-trash"></i>
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                </CardBody>
              </Card>
            )}
          </ModalBody>  
          <ModalFooter>  
            <Button color="primary" onClick={crearOrden} disabled={loading || pautas.length === 0}>
              {loading ? (  
                <>  
                  <Spinner size="sm" className="mr-2" />
                  Creando...
                </>  
              ) : (  
                <>  
                  <i className="fas fa-save mr-2"></i>
                  Crear Orden
                </>  
              )}  
            </Button>  
            <Button color="secondary" onClick={toggleModalCrear}>
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