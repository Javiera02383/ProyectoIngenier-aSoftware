// views/Facturas/CrearFacturaNueva.js    
   
import React, { useState, useEffect, useMemo } from 'react';      
import {      
  Card,      
  CardHeader,      
  CardBody,      
  Form,      
  FormGroup,      
  Input,      
  Button,      
  Row,      
  Col,      
  Label,      
  Alert,      
  Table,      
  Container      
} from 'reactstrap'; 
import { InputGroup, InputGroupAddon, InputGroupText } from 'reactstrap';       
import HeaderBlanco from 'components/Headers/HeaderBlanco.js';      
import { facturaService } from '../../services/facturacion/facturaService.js';  
import { caiService } from '../../services/facturacion/caiService.js';
import { clienteService } from '../../services/gestion_cliente/clienteService';  
import { empleadoService } from '../../services/gestion_cliente/empleadoService';  
import { authService } from '../../services/seguridad/authService';
import { productoService } from '../../services/productos/productoService';  
import { ordenPublicidadService } from '../../services/programacion/ordenpublicidadService.js';


// Servicios que necesitas crear siguiendo el mismo patrón  
import axiosInstance from '../../utils/axiosConfig';  
  

const formaPagoService = {  
  obtenerFormasPago: async () => {  
    const response = await axiosInstance.get('/formas-pago');  
    return response.data;  
  }  
};  
  
const descuentoService = {  
  obtenerDescuentos: async () => {  
    const response = await axiosInstance.get('/descuentos');  
    return response.data;  
  }  
};  
  
const CrearFacturaNueva = () => {        
  const [factura, setFactura] = useState({    
    idFactura: '',       
    idCliente: '',  
    rtnCliente: '',      
    idFormaPago: '1',        
    idEmpleado: '',        
    Tipo_documento: 'Factura',        
    estadoFactura: 'activa',        
    Fecha: new Date().toISOString().slice(0, 16),        
    Total_Facturado: 0,      
    // Campos específicos para Canal 40      
    productoCliente: '',      
    mencion: '',      
    periodoInicio: '',      
    periodoFin: '',      
    tipoServicio: 'spot',      
    agencia: '',      
    ordenNo: '',      
    idOrdenPublicidad: '',
    ordenCompraExenta: '',      
    numeroRegistroSAG: '',      
    constanciaExonerado: ''      
  });        
        
  const [detalles, setDetalles] = useState([{        
    idProducto: '',        
    cantidad: 1        
  }]);        
        
  const [descuentos, setDescuentos] = useState([]);        
  const [loading, setLoading] = useState(false);        
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });        
    
  // Estados para datos de referencia 
  const [ordenesPublicidad, setOrdenesPublicidad] = useState([]);  
  const [caiActivo, setCaiActivo] = useState(null);   
  const [clientes, setClientes] = useState([]);    
  const [empleados, setEmpleados] = useState([]);    
  const [formasPago, setFormasPago] = useState([]);    
  const [productos, setProductos] = useState([]);    
  const [descuentosDisponibles, setDescuentosDisponibles] = useState([]);    
  const [loadingData, setLoadingData] = useState(true);    
    
  // Cargar CAI activo al montar el componente
  const cargarCAIActivo = async () => {  
    try {  
      const data = await caiService.obtenerCAIActivo();  
      if (data.cai) {  
        setCaiActivo(data.cai);  
        // Actualizar el campo CAI en la factura automáticamente  
        setFactura(prev => ({   
          ...prev,   
          cai: data.cai.codigoCAI   
        }));  
      }  
    } catch (error) {  
      console.error('Error al cargar CAI activo:', error);  
      
    }  
  };

  const cargarSiguienteNumeroFactura = async () => {  
    try {  
      const data = await facturaService.obtenerSiguienteNumeroFactura();  
      setFactura(prev => ({   
        ...prev,   
        idFactura: data.siguienteNumero.toString().padStart(5, '0')   
      }));  
    } catch (error) {  
      console.error('Error al cargar siguiente número de factura:', error);  
    }  
  };

  // Función para cargar órdenes de publicidad aprobadas  
  const cargarOrdenesPublicidad = async () => {  
    try {  
      console.log('🔄 Cargando órdenes de publicidad...');
      
      // Primero intentar obtener todas las órdenes
      let response;
      try {
        response = await axiosInstance.get('/ordenes-publicidad/orden');
        console.log('📋 Respuesta completa de órdenes:', response.data);
      } catch (error) {
        console.log('⚠️ No se pudieron obtener todas las órdenes, intentando con filtro...');
        response = await axiosInstance.get('/ordenes-publicidad/orden?estado=Aprobada');
      }
      
      let ordenes = [];
      
      // Manejar diferentes formatos de respuesta
      if (Array.isArray(response.data)) {
        ordenes = response.data;
      } else if (response.data?.ordenes && Array.isArray(response.data.ordenes)) {
        ordenes = response.data.ordenes;
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        ordenes = response.data.data;
      } else {
        console.log('⚠️ Formato de respuesta inesperado:', response.data);
        ordenes = [];
      }
      
      // Filtrar solo las órdenes aprobadas si no se filtró en el backend
      const ordenesAprobadas = ordenes.filter(orden => 
        orden.estado === 'Aprobada' || orden.estado === 'aprobada' || orden.estado === 'APROBADA'
      );
      
      console.log('✅ Órdenes aprobadas encontradas:', ordenesAprobadas);
      setOrdenesPublicidad(ordenesAprobadas);
      
    } catch (error) {  
      console.error('❌ Error cargando órdenes de publicidad:', error);
      // Si falla, usar datos simulados para desarrollo
      const ordenesSimuladas = [
        { idOrden: 1, numeroOrden: 'OP-001', estado: 'Aprobada', Cliente: { persona: { Pnombre: 'Cliente', Papellido: 'A' } } },
        { idOrden: 2, numeroOrden: 'OP-002', estado: 'Aprobada', Cliente: { persona: { Pnombre: 'Cliente', Papellido: 'B' } } }
      ];
      console.log('⚠️ Usando órdenes simuladas:', ordenesSimuladas);
      setOrdenesPublicidad(ordenesSimuladas);
    }  
  }; 

  // Función mejorada para calcular totales con desglose  
  const calcularDesglose = useMemo(() => {  
    const subtotal = detalles.reduce((sum, detalle) => {  
      const precio = detalle.precioUnitario || 0;  
      return sum + (detalle.cantidad * precio);  
    }, 0);  
  
    const totalDescuentos = descuentos.reduce((sum, desc) => {  
      return sum + (parseFloat(desc.monto) || 0);  
    }, 0);  
      
    const subtotalConDescuento = subtotal - totalDescuentos;  
    const isv = subtotalConDescuento * 0.15;  
    const total = subtotalConDescuento + isv;  
  
    return {  
      subtotal: Number(subtotal) || 0,  
      descuentos: Number(totalDescuentos) || 0,  
      subtotalConDescuento: Number(subtotalConDescuento) || 0,  
      isv: Number(isv) || 0,  
      total: Number(total) || 0  
    };  
  }, [detalles, descuentos]);
  
  // Cargar datos de referencia al montar el componente      
useEffect(() => {      
  const cargarClientes = async () => {  
    try {  
      const clientesRes = await clienteService.obtenerTodosLosClientes();  
      setClientes(Array.isArray(clientesRes) ? clientesRes : clientesRes.data || []);  
    } catch (error) {  
      console.error('Error cargando clientes:', error);  
      setClientes([]);  
    }  
  };  
  
  const cargarEmpleados = async () => {  
    try {  
      // Usar el método correcto para obtener todos los empleados  
      const empleadosRes = await empleadoService.obtenerTodosLosEmpleados();  
      setEmpleados(Array.isArray(empleadosRes) ? empleadosRes : empleadosRes.data || []);  
    } catch (error) {  
      console.error('Error cargando empleados:', error);  
      setEmpleados([]);  
    }  
  };  
  
  const cargarFormasPago = async () => {  
    try {  
      const formasPagoRes = await formaPagoService.obtenerFormasPago();  
      setFormasPago(Array.isArray(formasPagoRes) ? formasPagoRes : formasPagoRes.data || []);  
    } catch (error) {  
      console.error('Error cargando formas de pago:', error);  
      setFormasPago([]);  
    }  
  };  
  
  const cargarProductos = async () => {  
    try {  
      const productosRes = await productoService.obtenerProductos();  
      setProductos(Array.isArray(productosRes) ? productosRes : productosRes.data || []);  
    } catch (error) {  
      console.error('Error cargando productos:', error);  
      setProductos([]);  
    }  
  };  
  
  const cargarDescuentos = async () => {  
    try {  
      const descuentosRes = await descuentoService.obtenerDescuentos();  
      setDescuentosDisponibles(Array.isArray(descuentosRes) ? descuentosRes : descuentosRes.data || []);  
    } catch (error) {  
      console.error('Error cargando descuentos:', error);  
      setDescuentosDisponibles([]);  
    }  
  };  
  
  const cargarTodosLosDatos = async () => {  
    setLoadingData(true);  
      
    // Cargar cada servicio de forma individual  
    await Promise.allSettled([  
      cargarClientes(),  
      cargarEmpleados(),   
      cargarFormasPago(),  
      cargarProductos(),  
      cargarDescuentos(),
      cargarCAIActivo(),
      cargarOrdenesPublicidad(),
      
      cargarSiguienteNumeroFactura()
    ]);  
      
    // Preseleccionar empleado que inició sesión (si existe)
    const usuarioActual = authService.getCurrentUser();
    if (usuarioActual?.idEmpleado) {
      setFactura(prev => ({ ...prev, idEmpleado: String(usuarioActual.idEmpleado) }));
    }

    setLoadingData(false);  
  };  
  
  cargarTodosLosDatos();  
}, []);   
        
  // Calcular total automáticamente        
  useEffect(() => {  
    setFactura(prev => ({ ...prev, Total_Facturado: calcularDesglose.total }));  
  }, [calcularDesglose.total]);      
          

  

  const handleFacturaChange = (e) => {        
    const { name, value } = e.target;        
    console.log('🔄 Cambio en factura:', name, value);
    
    // Si se está cambiando el cliente, también actualizar el RTN automáticamente  
    if (name === 'idCliente' && value) {  
      console.log('👤 Cliente seleccionado:', value);
      console.log('📋 Lista de clientes disponible:', clientes);
      
      const clienteSeleccionado = clientes.find(cliente => cliente.idCliente == value);  
      console.log('🔍 Cliente encontrado:', clienteSeleccionado);
      
      if (clienteSeleccionado) {
        const rtn = clienteSeleccionado.persona?.DNI || clienteSeleccionado.persona?.rtn || '';
        console.log('🆔 RTN encontrado:', rtn);
        
        setFactura(prev => ({   
          ...prev,   
          [name]: value,  
          rtnCliente: rtn
        }));
      } else {
        console.log('⚠️ Cliente no encontrado en la lista');
        setFactura(prev => ({ ...prev, [name]: value }));
      }
    } else {  
      setFactura(prev => ({ ...prev, [name]: value }));  
    }          
  };        
        
  const handleDetalleChange = (index, field, value) => {    
    const nuevosDetalles = [...detalles];    
    nuevosDetalles[index][field] = value;    
        
    // Si se cambió el producto, actualizar también el precio    
    if (field === 'idProducto' && value) {    
      const productoSeleccionado = productos.find(p => p.idProducto == value);    
      if (productoSeleccionado) {    
        nuevosDetalles[index].precioUnitario = productoSeleccionado.precioVenta;    
      }    
    }    
        
    setDetalles(nuevosDetalles);    
  };       
        
  const agregarDetalle = () => {        
    setDetalles([...detalles, { idProducto: '', cantidad: 1 }]);        
  };        
        
  const eliminarDetalle = (index) => {        
    if (detalles.length > 1) {        
      setDetalles(detalles.filter((_, i) => i !== index));        
    }        
  };        
        
  const agregarDescuento = () => {        
    setDescuentos([...descuentos, { idDescuento: '', monto: 0 }]);        
  };        

  // Descuento 0% por defecto al cargar
  useEffect(() => {
    if (descuentosDisponibles.length >= 0 && descuentos.length === 0) {
      // Insertar un renglón de descuento 0% (monto 0)
      setDescuentos([{ idDescuento: '', monto: 0 }]);
    }
  }, [descuentosDisponibles]);
        
  const handleDescuentoChange = (index, field, value) => {  
    const nuevosDescuentos = [...descuentos];  
    nuevosDescuentos[index][field] = value;  
      
    // Si se cambió el descuento, calcular automáticamente el monto  
    if (field === 'idDescuento' && value) {  
      const descuentoSeleccionado = descuentosDisponibles.find(d => d.idDescuento == value);  
      if (descuentoSeleccionado) {  
        // Calcular el subtotal actual de los productos  
        const subtotalProductos = detalles.reduce((sum, detalle) => {  
          const precio = detalle.precioUnitario || 0;  
          return sum + (detalle.cantidad * precio);  
        }, 0);  
          
        // Calcular el monto del descuento basado en el porcentaje  
        const montoDescuento = subtotalProductos * (descuentoSeleccionado.Porcentaje / 100);  
        nuevosDescuentos[index].monto = montoDescuento.toFixed(2);  
      }  
    }  
      
    setDescuentos(nuevosDescuentos);  
  };       
        
  const eliminarDescuento = (index) => {        
    setDescuentos(descuentos.filter((_, i) => i !== index));        
  };        
        
  const handleSubmit = async (e) => {        
    e.preventDefault();        
    setLoading(true);        
    setMensaje({ tipo: '', texto: '' });        
        
    try {        
      // Validaciones básicas        
      if (!factura.idCliente || !factura.idFormaPago || !factura.idEmpleado) {        
        throw new Error('Todos los campos obligatorios deben ser completados');        
      }        
        
      if (detalles.some(d => !d.idProducto || d.cantidad <= 0)) {        
        throw new Error('Todos los productos deben tener ID válido y cantidad mayor a 0');        
      }        
      if (!factura.idFactura || !factura.idCliente || !factura.idFormaPago || !factura.idEmpleado) {        
        throw new Error('Todos los campos obligatorios deben ser completados');        
      }  
      const data = {         
        factura: {        
          ...factura,       
          idFactura: parseInt(factura.idFactura),   
          idCliente: parseInt(factura.idCliente),        
          idFormaPago: parseInt(factura.idFormaPago),        
          idEmpleado: parseInt(factura.idEmpleado),
          idOrdenPublicidad: factura.idOrdenPublicidad ? parseInt(factura.idOrdenPublicidad) : null
        },         
        detalles: detalles.map(d => ({        
          ...d,        
          idProducto: parseInt(d.idProducto),        
          cantidad: parseInt(d.cantidad)        
        })),         
        descuentos: descuentos.map(d => ({        
          ...d,        
          idDescuento: parseInt(d.idDescuento),        
          monto: parseFloat(d.monto)        
        }))        
      };        
        
      const response = await facturaService.crearFacturaCompleta(data);        
              
      setMensaje({         
        tipo: 'success',         
        texto: `Factura creada exitosamente. ID: ${response.factura?.idFactura}`         
      });        
        
      // Limpiar formulario        
      setFactura({        
        idFactura: '',  
        idCliente: '',
        rtnCliente: '',        
        idFormaPago: '1',
        idEmpleado: '',        
        Tipo_documento: 'Factura',        
        estadoFactura: 'activa',        
        Fecha: new Date().toISOString().slice(0, 16),        
        Total_Facturado: 0,      
        productoCliente: '',      
        mencion: '',      
        periodoInicio: '',      
        periodoFin: '',      
        tipoServicio: 'spot',      
        agencia: '',      
        ordenNo: '',
        idOrdenPublicidad: '',
        ordenCompraExenta: '',      
        numeroRegistroSAG: '',      
        constanciaExonerado: ''      
      });        
      setDetalles([{ idProducto: '', cantidad: 1 }]);        
      setDescuentos([]);        
        
    } catch (error) {        
      console.error('Error:', error);        
      setMensaje({         
        tipo: 'danger',         
        texto: error.message || 'Error al crear la factura'         
      });        
    } finally {        
      setLoading(false);        
    }        
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
              <CardHeader className="border-0">        
                <Row className="align-items-center">        
                  <Col>        
                    <h3 className="mb-0">Crear Nueva Factura - Canal 40</h3>        
                  </Col>        
                  <Col xs="auto">
                    <Button
                      color="info"
                      size="sm"
                      onClick={() => {
                        console.log('🔍 === DATOS DE DEPURACIÓN ===');
                        console.log('📋 Clientes:', clientes);
                        console.log('👥 Empleados:', empleados);
                        console.log('📦 Productos:', productos);
                        console.log('💳 Formas de pago:', formasPago);
                        console.log('🏷️ Descuentos:', descuentosDisponibles);
                        console.log('📺 Órdenes de publicidad:', ordenesPublicidad);
                        console.log('📄 Estado actual de factura:', factura);
                        console.log('🔍 === FIN DEPURACIÓN ===');
                      }}
                    >
                      <i className="fas fa-bug" /> Debug
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

                {/* Estado de carga de datos */}
                {loadingData && (
                  <Alert color="info" className="mb-4">
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Cargando datos de referencia... Por favor espere.
                  </Alert>
                )}

                {/* Información de estado de datos */}
                {!loadingData && (
                  <Alert color="success" className="mb-4">
                    <i className="fas fa-check-circle mr-2"></i>
                    <strong>Datos cargados:</strong> 
                    {clientes.length} clientes, {empleados.length} empleados, {productos.length} productos, 
                    {formasPago.length} formas de pago, {descuentosDisponibles.length} descuentos, 
                    {ordenesPublicidad.length} órdenes de publicidad
                  </Alert>
                )}
        
                <Form onSubmit={handleSubmit}>        
                  {/* Información Básica de la Factura */}        
                  <h6 className="heading-small text-muted mb-4">        
                    Información General de la Factura        
                  </h6>        
                  <div className="pl-lg-4">        
                    <Row>  
                        <Col lg="4">      
                          <FormGroup>      
                            <Label className="form-control-label" htmlFor="idFactura">      
                              No. Factura * (Automático)  
                            </Label>      
                            <Input      
                              className="form-control-alternative"      
                              id="idFactura"      
                              name="idFactura"      
                              type="text"      
                              value={factura.idFactura || 'Generando...'}  
                              disabled  
                              required      
                            />  
                            <small className="text-muted">  
                              Número generado automáticamente  
                            </small>  
                          </FormGroup>      
                        </Col>   
                        <Col lg="4">      
                          <FormGroup>      
                            <Label className="form-control-label" htmlFor="cai">      
                              CAI * 
                            </Label>      
                            <Input      
                              className="form-control-alternative"      
                              id="cai"      
                              name="cai"      
                              type="text"      
                              value={caiActivo?.codigoCAI || 'Cargando CAI...'}  
                              disabled  
                              required      
                            />  
                            {caiActivo && (  
                              <small className="text-muted">  
                                Válido hasta: {new Date(caiActivo.fechaVencimiento).toLocaleDateString('es-HN')}  
                              </small>  
                            )}  
                          </FormGroup>      
                        </Col>               
       
                      <Col lg="4">        
                        <FormGroup>        
                          <Label className="form-control-label" htmlFor="idFormaPago">        
                            Forma de Pago *        
                          </Label>        
                          <Input        
                            className="form-control-alternative"        
                            id="idFormaPago"        
                            name="idFormaPago"        
                            type="select"        
                            value={factura.idFormaPago}        
                            onChange={handleFacturaChange}        
                            required        
                          >    
                            <option value="">Seleccionar forma de pago...</option>    
                            {formasPago.map(forma => (    
                              <option key={forma.idFormaPago} value={forma.idFormaPago}>    
                                 {forma.Formapago}    
                              </option>    
                            ))}     
                       </Input>        
                        </FormGroup>        
                      </Col>  
                      <Col lg="6">      
                        <FormGroup>      
                          <Label className="form-control-label" htmlFor="agencia">      
                            Agencia Publicitaria      
                          </Label>      
                          <Input      
                            className="form-control-alternative"      
                            id="agencia"      
                            name="agencia"      
                            type="text"      
                            value={factura.agencia}      
                            onChange={handleFacturaChange}      
                            placeholder="Ej: MASS PUBLICIDAD"      
                          />      
                        </FormGroup>      
                      </Col> 
                      <Col lg="4">      
                        <FormGroup>
                          <Label className="form-control-label" htmlFor="idOrdenPublicidad">
                            Orden de Publicidad (Opcional)
                          </Label>
                          <Input
                            className="form-control-alternative"
                            id="idOrdenPublicidad"
                            name="idOrdenPublicidad"
                            type="select"
                            value={factura.idOrdenPublicidad}
                            onChange={(e) => {
                              const selectedId = e.target.value;
                              const orden = ordenesPublicidad.find(o => String(o.idOrden) === String(selectedId));
                              setFactura(prev => ({
                                ...prev,
                                idOrdenPublicidad: selectedId || '',
                                ordenNo: orden?.numeroOrden || ''
                              }));
                            }}
                          >
                            <option value="">Seleccionar orden...</option>
                            {ordenesPublicidad.map(orden => (
                              <option key={orden.idOrden} value={orden.idOrden}>
                                {orden.numeroOrden} ({orden.Cliente?.persona?.Pnombre} {orden.Cliente?.persona?.Papellido})
                              </option>
                            ))}
                          </Input>
                          {ordenesPublicidad.length === 0 && (
                            <small className="text-muted">
                              <i className="fas fa-info-circle mr-1"></i>
                              No hay órdenes de publicidad aprobadas disponibles
                            </small>
                          )}
                          {ordenesPublicidad.length > 0 && (
                            <small className="text-success">
                              <i className="fas fa-check-circle mr-1"></i>
                              {ordenesPublicidad.length} orden(es) de publicidad disponible(s)
                            </small>
                          )}
                          <div className="mt-2">
                            <Button
                              color="secondary"
                              size="sm"
                              onClick={cargarOrdenesPublicidad}
                              disabled={loadingData}
                            >
                              <i className="fas fa-sync-alt mr-1"></i>
                              Recargar Órdenes
                            </Button>
                          </div>
                        </FormGroup>
                      </Col>
                      <Col lg="4">        
                        <FormGroup>        
                          <Label className="form-control-label" htmlFor="idEmpleado">        
                            Empleado *        
                          </Label>        
                          <Input        
                            className="form-control-alternative"        
                            id="idEmpleado"        
                            name="idEmpleado"        
                            type="select"        
                            value={factura.idEmpleado}        
                            onChange={handleFacturaChange}        
                            required     
                              >    
                            <option value="">Seleccionar empleado...</option>    
                            {empleados.map(empleado => (    
                              <option key={empleado.idEmpleado} value={empleado.idEmpleado}>    
                                {empleado.persona?.Pnombre} {empleado.persona?.Snombre} {empleado.persona?.Papellido}  {empleado.persona?.Sapellido}   
                              </option>    
                            ))}    
                          </Input>        
                        </FormGroup>        
                      </Col>      
                    </Row>        
       
                  </div>        
    
                  <hr className="my-4" />      
    
                  {/* Información Específica de Canal 40 */}      
                  <h6 className="heading-small text-muted mb-4">      
                    Información del Cliente     
                  </h6>      
                  <div className="pl-lg-4">      
                    <Row>    
                      <Col lg="4">        
                        <FormGroup>        
                          <Label className="form-control-label" htmlFor="idCliente">        
                            Cliente *        
                          </Label>        
                          <Input        
                            className="form-control-alternative"        
                            id="idCliente"        
                            name="idCliente"        
                            type="select"        
                            value={factura.idCliente}        
                            onChange={handleFacturaChange}        
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
                      <Col lg="4">  
                        <FormGroup>  
                          <Label className="form-control-label" htmlFor="rtnCliente">  
                            RTN *  
                          </Label>  
                          <Input  
                            className="form-control-alternative"  
                            id="rtnCliente"  
                            name="rtnCliente"  
                            type="text"  
                            value={factura.rtnCliente}  
                            readOnly  
                            placeholder="Seleccione cliente"  
                            style={{ backgroundColor: '#f8f9fa' }}  
                          />  
                          {!factura.idCliente && (
                            <small className="text-muted">
                              <i className="fas fa-info-circle mr-1"></i>
                              Seleccione un cliente para ver su RTN
                            </small>
                          )}
                          {factura.idCliente && factura.rtnCliente && (
                            <small className="text-success">
                              <i className="fas fa-check-circle mr-1"></i>
                              RTN cargado automáticamente
                            </small>
                          )}
                          {factura.idCliente && !factura.rtnCliente && (
                            <small className="text-warning">
                              <i className="fas fa-exclamation-triangle mr-1"></i>
                              Cliente seleccionado pero sin RTN disponible
                            </small>
                          )}

                        </FormGroup>
                      </Col>
                      </Row>
                    <Row>
                      <Col lg="4">      
                        <FormGroup>      
                          <Label className="form-control-label" htmlFor="productoCliente">      
                            Producto del Cliente      
                          </Label>      
                          <Input      
                            className="form-control-alternative"      
                            id="productoCliente"      
                            name="productoCliente"      
                            type="text"      
                            value={factura.productoCliente}      
                            onChange={handleFacturaChange}      
                            placeholder="Ej: Motomundo S.A."      
                          />      
                        </FormGroup>      
                      </Col>            
                         
                      <Col lg="4">      
                        <FormGroup>      
                          <Label className="form-control-label" htmlFor="mencion">      
                            Mención      
                          </Label>      
                          <Input      
                            className="form-control-alternative"      
                            id="mencion"      
                            name="mencion"      
                            type="select"      
                            value={factura.mencion}      
                            onChange={handleFacturaChange}      
                          >      
                            <option value="">Seleccionar...</option>      
                            <option value="Deportiva">Deportiva</option>      
                            <option value="Comercial">Comercial</option>      
                            <option value="Financiera">Financiera</option>      
                            <option value="Educativa">Educativa</option>      
                            <option value="Salud">Salud</option>      
                            <option value="Entretenimiento">Entretenimiento</option>      
                          </Input>      
                        </FormGroup>      
                      </Col>      
                           
                    </Row>     
                    <Row>     
                      <Col lg="4">      
                        <FormGroup>      
                          <Label className="form-control-label" htmlFor="periodoInicio">      
                            Período Inicio      
                          </Label>      
                          <Input      
                            className="form-control-alternative"      
                            id="periodoInicio"      
                            name="periodoInicio"      
                            type="date"      
                            value={factura.periodoInicio}      
                            onChange={handleFacturaChange}      
                          />      
                        </FormGroup>      
                      </Col>      
                      <Col lg="4">      
                        <FormGroup>      
                          <Label className="form-control-label" htmlFor="periodoFin">      
                            Período Fin      
                          </Label>      
                          <Input      
                            className="form-control-alternative"      
                            id="periodoFin"      
                            name="periodoFin"      
                            type="date"      
                            value={factura.periodoFin}      
                            onChange={handleFacturaChange}      
                          />      
                        </FormGroup>      
                      </Col>      
                           
                      <Col lg="4">        
                        <FormGroup>        
                          <Label className="form-control-label" htmlFor="Fecha">        
                            Fecha Actual       
                          </Label>        
                          <Input        
                            className="form-control-alternative"        
                            id="Fecha"        
                            name="Fecha"        
                            type="datetime-local"        
                            value={factura.Fecha}        
                            onChange={handleFacturaChange}        
                          />        
                        </FormGroup>        
                      </Col>        
        
                    </Row>       
                  </div>      
    
                  <hr className="my-4" />      
    
                  {/* Información de Exoneración */}      
                  <h6 className="heading-small text-muted mb-4">      
                    Datos de Exoneración (Opcional)      
                  </h6>      
                  <div className="pl-lg-4">      
                    <Row>      
                      <Col lg="4">      
                        <FormGroup>      
                          <Label className="form-control-label" htmlFor="ordenCompraExenta">      
                            Orden Compra Exenta      
                          </Label>      
                          <Input      
                            className="form-control-alternative"      
                            id="ordenCompraExenta"      
                            name="ordenCompraExenta"      
                            type="text"      
                            value={factura.ordenCompraExenta}      
                            onChange={handleFacturaChange}      
                            placeholder="Ej: EX-2025-001"      
                          />      
                        </FormGroup>      
                      </Col>      
                      <Col lg="4">      
                        <FormGroup>      
                          <Label className="form-control-label" htmlFor="numeroRegistroSAG">      
                            No. Registro SAG      
                          </Label>      
                          <Input      
                            className="form-control-alternative"      
                            id="numeroRegistroSAG"      
                            name="numeroRegistroSAG"      
                            type="text"      
                            value={factura.numeroRegistroSAG}      
                            onChange={handleFacturaChange}      
                            placeholder="Ej: SAG-12345"      
                          />      
                        </FormGroup>      
                      </Col>      
                      <Col lg="4">      
                        <FormGroup>      
                          <Label className="form-control-label" htmlFor="constanciaExonerado">      
                            Constancia Exonerado      
                          </Label>      
                          <Input      
                            className="form-control-alternative"      
                            id="constanciaExonerado"      
                            name="constanciaExonerado"      
                            type="text"      
                            value={factura.constanciaExonerado}      
                            onChange={handleFacturaChange}      
                            placeholder="Ej: CONST-2025-001"      
                          />      
                        </FormGroup>      
                      </Col>      
                    </Row>      
                  </div>      
    
                  <hr className="my-4" />      
    
                  {/* Detalles de Productos */}      
                  <h6 className="heading-small text-muted mb-4">      
                    Servicios Publicitarios      
                  </h6>      
                  <div className="pl-lg-4">      
                    <Table className="align-items-center table-flush" responsive>      
                      <thead className="thead-light">      
                        <tr>      
                          <th>Cantidad *</th>      
                          <th>Servicio *</th>      
                          <th>Precio Unitario</th>  
                          <th>Total</th>  
                          <th></th>      
                        </tr>      
                      </thead>      
                      <tbody>      
                        {detalles.map((detalle, index) => (      
                          <tr key={index}>      
                            <td>      
                              <Input      
                                type="number"      
                                min="1"      
                                value={detalle.cantidad}      
                                onChange={(e) => handleDetalleChange(index, 'cantidad', e.target.value)}      
                                required  
                                maxLength="5"  
                                max="99999"  
                            
                              />      
                            </td>  
                            <td>      
                              <Input      
                                type="select"      
                                value={detalle.idProducto}      
                                onChange={(e) => handleDetalleChange(index, 'idProducto', e.target.value)}      
                                required      
                              >    
                                <option value="">Seleccionar servicio...</option>    
                                {productos.map(producto => (    
                                  <option key={producto.idProducto} value={producto.idProducto}>    
                                    {producto.Nombre}  
                                  </option>    
                                ))}    
                              </Input>      
                            </td>  
                            <td>  
                              
  
                                <InputGroup style={{ width: '120px' }}>  
                                  <InputGroupAddon addonType="prepend">  
                                    <InputGroupText>L. </InputGroupText>  
                                  </InputGroupAddon>  
                                  <Input    
                                    type="number"    
                                    step="0.01"  
                                    value={detalle.precioUnitario || 0}    
                                    disabled    
                                    className="text-right"  
                                  />  
                                </InputGroup>  
                            </td>  
                            <td> 
                              <InputGroup>  
                                  <InputGroupAddon addonType="prepend">  
                                    <InputGroupText>L. </InputGroupText>  
                                  </InputGroupAddon> 
                              <Input  
                                type="text"  
                                value={`${((detalle.cantidad || 0) * (detalle.precioUnitario || 0)).toFixed(2)}`}  
                                disabled  
                                className="text-right"  
                              />  </InputGroup> 
                            </td>      
                            <td>      
                              <Button      
                                color="danger"      
                                size="sm"      
                                onClick={() => eliminarDetalle(index)}      
                                disabled={detalles.length === 1}      
                              >      
                                <i className="fas fa-trash" />      
                              </Button>      
                            </td>      
                          </tr>      
                        ))}      
                      </tbody>      
                    </Table>     
                    <Button      
                      color="info"      
                      size="sm"      
                      onClick={agregarDetalle}      
                    >      
                      <i className="fas fa-plus" /> Agregar Servicio      
                    </Button>      
                  </div>      
    
                  <hr className="my-4" />      
    
                  {/* Descuentos */}      
                  <h6 className="heading-small text-muted mb-4">      
                    Descuentos (Opcional)      
                  </h6>      
                  <div className="pl-lg-4">      
                    {descuentos.length > 0 && (      
                      <Table className="align-items-center table-flush" responsive>      
                        <thead className="thead-light">      
                          <tr>      
                            <th>Descuento</th>      
                            <th>Monto (L.)</th>      
                            <th>Acciones</th>      
                          </tr>      
                        </thead>      
                        <tbody>      
                          {descuentos.map((descuento, index) => (      
                            <tr key={index}>      
                              <td>      
                                <Input      
                                  type="select"      
                                  value={descuento.idDescuento}      
                                  onChange={(e) => handleDescuentoChange(index, 'idDescuento', e.target.value)}      
                                >    
                                  <option value="">Seleccionar descuento...</option>    
                                  {descuentosDisponibles.map(desc => (    
                                    <option key={desc.idDescuento} value={desc.idDescuento}>      
                                      {desc.Tipo} - {desc.Porcentaje}%      
                                    </option>   
                                  ))}    
                                </Input>      
                              </td>      
                              <td>      
                                <Input  
                                  type="number"  
                                  step="0.01"  
                                  min="0"  
                                  value={descuento.monto}  
                                  onChange={(e) => handleDescuentoChange(index, 'monto', e.target.value)}  
                                  disabled={descuento.idDescuento !== ''} // Deshabilitar si hay descuento seleccionado  
                                  placeholder="Calculado automáticamente"  
                                />     
                              </td>      
                              <td>      
                                <Button      
                                  color="danger"      
                                  size="sm"      
                                  onClick={() => eliminarDescuento(index)}      
                                >   
   <i className="fas fa-trash" />      
                                </Button>      
                              </td>      
                            </tr>      
                          ))}      
                        </tbody>      
                      </Table>      
                    )}      
                    <Button      
                      color="info"      
                      size="sm"      
                      onClick={agregarDescuento}      
                    >      
                      <i className="fas fa-plus" /> Agregar Descuento      
                    </Button>      
                  </div>      
    
                  <hr className="my-4" />      

            
                  {/* Desglose de Totales */}  
                  
                  <div className="pl-lg-4">  
                    <Row className="justify-content-end">    
                      <Col lg="6">  
                        <Table className="table-borderless">  
                          <tbody>  
                            <tr>  
                              <td><strong>Subtotal:</strong></td>  
                              <td className="text-right">L. {calcularDesglose.subtotal.toFixed(2)}</td>  
                            </tr>  
                            <tr>  
                              <td><strong>Descuentos:</strong></td>  
                              <td className="text-right ">L. {calcularDesglose.descuentos.toFixed(2)}</td>  
                            </tr>  
                            <tr>  
                              <td><strong>Subtotal con Descuento:</strong></td>  
                              <td className="text-right">L. {calcularDesglose.subtotalConDescuento.toFixed(2)}</td>  
                            </tr>  
                            <tr>  
                              <td><strong>ISV (15%):</strong></td>  
                              <td className="text-right ">L. {calcularDesglose.isv.toFixed(2)}</td>  
                            </tr>  
                            <tr className="border-top">  
                              <td><strong>Total a Pagar:</strong></td>  
                              <td className="text-right"><strong>L. {calcularDesglose.total.toFixed(2)}</strong></td>  
                            </tr>  
                          </tbody>  
                        </Table>  
                      </Col>  
                    </Row>  
                  </div> 
                  <hr className="my-4" />      
    
                  {/* Botones */}        
                  <div className="pl-lg-4">      
                    <Button      
                      color="primary"      
                      type="submit"      
                      disabled={loading}      
                      size="lg"      
                    >      
                      {loading ? (      
                        <>      
                          <i className="fas fa-spinner fa-spin" /> Creando Factura...      
                        </>      
                      ) : (      
                        <>      
                          <i className="fas fa-save" /> Crear Factura Canal 40      
                        </>      
                      )}      
                    </Button>      
                    <Button      
                      color="secondary"      
                      type="button"      
                      className="ml-2"      
                      onClick={() => window.location.href = "/admin/facturas"}      
                    >      
                      <i className="fas fa-list" /> Ver Facturas      
                    </Button>      
                  </div>      
                </Form>      
              </CardBody>      
            </Card>      
          </Col>      
        </Row>      
      </Container>      
    </>      
  );      
};      
      
export default CrearFacturaNueva;