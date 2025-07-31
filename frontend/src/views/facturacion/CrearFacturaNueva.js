// views/Facturas/CrearFacturaNueva.js    
import React, { useState, useEffect } from 'react';    
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
import HeaderBlanco from 'components/Headers/HeaderBlanco.js';    
import { facturaService } from '../../services/facturacion/facturaService.js';    
    
// Servicios necesarios (deberás crearlos basándote en facturaService)  
// Función para obtener el token del localStorage  
// Función para obtener el token del localStorage    
const getAuthToken = () => {    
  return localStorage.getItem('token');    
};    
  
const clienteService = {  
  obtenerClientes: async () => {  
    const token = getAuthToken(); // Usar la función aquí  
    const response = await fetch('http://localhost:4051/api/optica/clientes/todos-clientes', {  
      headers: { 'Authorization': `Bearer ${token}` }  
    });  
    if (!response.ok) {  
      throw new Error(`HTTP error! status: ${response.status}`);  
    }  
    return response.json();  
  }  
};  
  
const empleadoService = {  
  obtenerEmpleados: async () => {  
    const token = getAuthToken(); // Y también aquí  
    const response = await fetch('http://localhost:4051/api/optica/empleados/todos-empleados', {  
      headers: { 'Authorization': `Bearer ${token}` }  
    });  
    if (!response.ok) {  
      throw new Error(`HTTP error! status: ${response.status}`);  
    }  
    return response.json();  
  }  
}; 
  
const formaPagoService = {  
  obtenerFormasPago: async () => {  
    const token = getAuthToken();  
    const response = await fetch('http://localhost:4051/api/optica/formas-pago', {  
      headers: { 'Authorization': `Bearer ${token}` }  
    });  
    return response.json();  
  }  
};  
  
const productoService = {  
  obtenerProductos: async () => {  
    const token = getAuthToken();  
    const response = await fetch('http://localhost:4051/api/optica/productos/producto', {  
      headers: { 'Authorization': `Bearer ${token}` }  
    });  
    return response.json();  
  }  
};  
  
const descuentoService = {  
  obtenerDescuentos: async () => {  
    const token = localStorage.getItem('token');  
    const response = await fetch('http://localhost:4051/api/optica/descuentos', {  
      headers: { 'Authorization': `Bearer ${token}` }  
    });  
    return response.json();  
  }  
};


      
const CrearFacturaNueva = () => {      
  const [factura, setFactura] = useState({  
    idFactura: '',     
    idCliente: '',      
    idFormaPago: '',      
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
  const [clientes, setClientes] = useState([]);  
  const [empleados, setEmpleados] = useState([]);  
  const [formasPago, setFormasPago] = useState([]);  
  const [productos, setProductos] = useState([]);  
  const [descuentosDisponibles, setDescuentosDisponibles] = useState([]);  
  const [loadingData, setLoadingData] = useState(true);  
  
  const calcularTotal = () => {  
    const subtotal = detalles.reduce((sum, detalle) => {  
      const precio = detalle.precioUnitario || 0;  
      return sum + (detalle.cantidad * precio);  
    }, 0);  
      
    const totalDescuentos = descuentos.reduce((sum, desc) => sum + (desc.monto || 0), 0);  
    const subtotalConDescuento = subtotal - totalDescuentos;  
    const isv = subtotalConDescuento * 0.15;  
    return subtotalConDescuento + isv;  
  };

  // Cargar datos de referencia al montar el componente  
  useEffect(() => {  
    const cargarDatos = async () => {  
      try {  
        setLoadingData(true);  
        const [clientesRes, empleadosRes, formasPagoRes, productosRes, descuentosRes] = await Promise.all([  
          clienteService.obtenerClientes(),  
          empleadoService.obtenerEmpleados(),  
          formaPagoService.obtenerFormasPago(),  
          productoService.obtenerProductos(),  
          descuentoService.obtenerDescuentos()  
        ]);  
          
        setClientes(clientesRes.data || clientesRes || []);  
        setEmpleados(empleadosRes.data || empleadosRes || []);  
        setFormasPago(formasPagoRes.data || formasPagoRes || []);  
        setProductos(productosRes.data || productosRes || []);  
        setDescuentosDisponibles(descuentosRes.data || descuentosRes || []);  
      } catch (error) {  
        console.error('Error cargando datos:', error);  
        setMensaje({  
          tipo: 'danger',  
          texto: 'Error al cargar datos de referencia. Verifique su conexión.'  
        });  
      } finally {  
        setLoadingData(false);  
      }  
    };  
      
    cargarDatos();  
  }, []);  
      
  // Calcular total automáticamente      
  useEffect(() => {      
    const subtotal = detalles.reduce((sum, detalle) => {      
      return sum + (detalle.cantidad * (detalle.precioUnitario || 0));      
    }, 0);      
          
    const totalDescuentos = descuentos.reduce((sum, desc) => sum + (desc.monto || 0), 0);      
    const subtotalConDescuento = subtotal - totalDescuentos;      
    const isv = subtotalConDescuento * 0.15;      
    const total = subtotalConDescuento + isv;      
      
    setFactura(prev => ({ ...prev, Total_Facturado: total }));      
  }, [detalles, descuentos]);     
        
  const handleFacturaChange = (e) => {      
    const { name, value } = e.target;      
    setFactura(prev => ({ ...prev, [name]: value }));      
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
      
  const handleDescuentoChange = (index, field, value) => {      
    const nuevosDescuentos = [...descuentos];      
    nuevosDescuentos[index][field] = value;      
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
          idEmpleado: parseInt(factura.idEmpleado)      
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
        idCliente: '',      
        idFormaPago: '',      
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
                </Row>      
              </CardHeader>      
              <CardBody>      
                {mensaje.texto && (      
                  <Alert color={mensaje.tipo} className="mb-4">      
                    {mensaje.texto}      
                  </Alert>      
                )}      
      
                <Form onSubmit={handleSubmit}>      
                  {/* Información Básica de la Factura */}      
                  <h6 className="heading-small text-muted mb-4">      
                    Información Básica de la Factura      
                  </h6>      
                  <div className="pl-lg-4">      
                    <Row>
                        <Col lg="4">  
                          <FormGroup>  
                            <Label className="form-control-label" htmlFor="idFactura">  
                              No. Factura *  
                            </Label>  
                            <Input  
                              className="form-control-alternative"  
                              id="idFactura"  
                              name="idFactura"  
                              type="number"  
                              value={factura.idFactura}  
                              onChange={handleFacturaChange}  
                              required  
                              placeholder="Ej: 37"  
                            />  
                          </FormGroup>  
                        </Col>        
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
                    </Row>      
                    <Row>      
                      <Col lg="6">      
                        <FormGroup>      
                          <Label className="form-control-label" htmlFor="Fecha">      
                            Fecha      
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
                      <Col lg="6">      
                        <FormGroup>      
                          <Label className="form-control-label" htmlFor="Tipo_documento">      
                            Tipo de Documento      
                          </Label>      
                          <Input      
                            className="form-control-alternative"      
                            id="Tipo_documento"      
                            name="Tipo_documento"      
                            type="text"      
                            value={factura.Tipo_documento}      
                            onChange={handleFacturaChange}      
                            maxLength="45"      
                          />      
                        </FormGroup>      
                      </Col>      
                    </Row>      
                  </div>      
  
                  <hr className="my-4" />    
  
                  {/* Información Específica de Canal 40 */}    
                  <h6 className="heading-small text-muted mb-4">    
                    Información Específica de Televisión    
                  </h6>    
                  <div className="pl-lg-4">    
                    <Row>    
                      <Col lg="6">    
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
                    </Row>    
                    <Row>    
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
                      <Col lg="4">    
                        <FormGroup>    
                          <Label className="form-control-label" htmlFor="tipoServicio">    
                            Tipo de Servicio    
                          </Label>    
                          <Input    
                            className="form-control-alternative"    
                            id="tipoServicio"    
                            name="tipoServicio"    
                            type="select"    
                            value={factura.tipoServicio}    
                            onChange={handleFacturaChange}    
                          >    
                            <option value="spot">Spot</option>    
                            <option value="programa">Programa</option>    
                            <option value="contrato">Contrato</option>    
                          </Input>    
                        </FormGroup>    
                      </Col>    
                      <Col lg="4">    
                        <FormGroup>    
                          <Label className="form-control-label" htmlFor="ordenNo">    
                            Orden No.    
                          </Label>    
                          <Input    
                            className="form-control-alternative"    
                            id="ordenNo"    
                            name="ordenNo"    
                            type="text"    
                            value={factura.ordenNo}    
                            onChange={handleFacturaChange}    
                            placeholder="Ej: ORD-2025-001"    
                          />    
                        </FormGroup>    
                      </Col>    
                    </Row>   
                    <Row>   
                      <Col lg="6">    
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
                      <Col lg="6">    
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
                          <th>Servicio *</th>    
                          <th>Cantidad *</th>    
                          <th>Acciones</th>    
                        </tr>    
                      </thead>    
                      <tbody>    
                        {detalles.map((detalle, index) => (    
                          <tr key={index}>    
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
                                    {producto.Nombre} - L.{producto.precioVenta}   
                                  </option>  
                                ))}  
                              </Input>    
                            </td>    
                            <td>    
                              <Input    
                                type="number"    
                                min="1"    
                                value={detalle.cantidad}    
                                onChange={(e) => handleDetalleChange(index, 'cantidad', e.target.value)}    
                                required    
                              />    
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
  
                  {/* Total */}    
                  <div className="pl-lg-4">    
                    <Row>    
                      <Col lg="6">    
                        <FormGroup>    
                          <Label className="form-control-label">    
                            Total Calculado    
                          </Label>    
                          <Input    
                            className="form-control-alternative"    
                            type="text"    
                            value={`L. ${calcularTotal().toFixed(2)}`} 
                            disabled    
                          />    
                        </FormGroup>    
                      </Col>    
                    </Row>    
                  </div>    
  
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
                      href="/admin/facturas"    
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