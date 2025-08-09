import React, { useState, useEffect } from "react";  
import {  
  Button,  
  Card,  
  CardHeader,  
  CardBody,  
  FormGroup,  
  Form,  
  Input,  
  Label,  
  Container,  
  Row,  
  Col,  
  Alert,  
} from "reactstrap";  
import { useNavigate, useParams } from "react-router-dom";  
import { inventarioService } from '../../services/inventario/inventarioService';  
import { empleadoService } from '../../services/gestion_cliente/empleadoService';  
import { useToast } from '../../hooks/useToast';  
import HeaderBlanco from "components/Headers/HeaderBlanco.js";  
import Toast from 'components/Toast/Toast';  
  
const RegistrarActivo = () => {  
  const { id } = useParams();  
  const [editando, setEditando] = useState(false);  
  const [loading, setLoading] = useState(false);  
  const [loadingData, setLoadingData] = useState(false);  
    
  const [formData, setFormData] = useState({  
    codigo: "",  
    nombre: "",  
    descripcion: "",  
    cantidad: 1,  
    ubicacion: "",  
    idEmpleado: "",  
    idProveedor: "",  
    valor: "",  
    estado: "Disponible",  
    observacion: "",  
    marca: "",  
    fechaCompra: "",  
  });  
  
  const [proveedores, setProveedores] = useState([]);  
  const [empleados, setEmpleados] = useState([]);  
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });  
    
  const navigate = useNavigate();  
  const { toast, showSuccess, showError, hideToast } = useToast();  
  
  // Detectar modo edición y cargar datos  
  useEffect(() => {  
    if (id) {  
      setEditando(true);  
      cargarDatosActivo(id);  
    }  
  }, [id]);  
  
  // Cargar empleados y proveedores al montar el componente  
 useEffect(() => {  
  const fetchEmpleadosYProveedores = async () => {  
    try {  
      setLoadingData(true);  
        
      // Verificar token  
      const token = localStorage.getItem("token");  
      if (!token) {  
        showError('No hay token de autenticación disponible');  
        return;  
      }  
        
      // Cargar empleados (ya funciona correctamente)  
      try {  
        const empleadosData = await empleadoService.obtenerTodosLosEmpleados();  
        setEmpleados(Array.isArray(empleadosData) ? empleadosData : []);  
      } catch (empError) {  
        console.error('Error cargando empleados:', empError);  
        showError('Error al cargar empleados');  
        setEmpleados([]);  
      }  
        
      // Cargar proveedores - versión corregida  
      try {  
        const resProv = await fetch("http://localhost:4051/api/optica/inventario/proveedores/todos", { 
          method: 'GET',  
          headers: {   
            "Authorization": `Bearer ${token}`,  
            "Content-Type": "application/json",  
            "Accept": "application/json"  
          }  
        });  
         
        console.log('Status de respuesta:', resProv.status);  
  console.log('Status text:', resProv.statusText);  

        if (!resProv.ok) {  
    const errorText = await resProv.text();  
    console.error('Respuesta completa del error:', errorText);  
    throw new Error(`Error ${resProv.status}: ${errorText}`);  
  }  
          
        const dataProv = await resProv.json();  
  console.log('Proveedores recibidos:', dataProv);  
  setProveedores(Array.isArray(dataProv) ? dataProv : []);  
    
          
        if (dataProv && Array.isArray(dataProv)) {  
          setProveedores(dataProv);  
        } else {  
          console.warn('Respuesta de proveedores no es un array:', dataProv);  
          setProveedores([]);  
        }  
          
      } catch (provError) {  
  console.error('Error completo proveedores:', provError);  
  showError(`Error al cargar proveedores: ${provError.message}`);  
  setProveedores([]);  
} 
        
    } catch (error) {  
      console.error("Error general:", error);  
      showError('Error al cargar datos iniciales');  
      setEmpleados([]);  
      setProveedores([]);  
    } finally {  
      setLoadingData(false);  
    }  
  };  
    
  fetchEmpleadosYProveedores();  
}, [showError]);
  // Cargar datos del activo para edición  
  const cargarDatosActivo = async (activoId) => {  
    try {  
      setLoadingData(true);  
      const data = await inventarioService.obtenerInventarioPorId(activoId);  
        
      setFormData({  
        codigo: data.codigo || "",  
        nombre: data.nombre || "",  
        descripcion: data.descripcion || "",  
        cantidad: data.cantidad || 1,  
        ubicacion: data.ubicacion || "",  
        idEmpleado: data.idEmpleado || "",  
        idProveedor: data.idProveedor || "",  
        valor: data.valor || "",  
        estado: data.estado || "Disponible",  
        observacion: data.observacion || "",  
        marca: data.marca || "",  
        fechaCompra: data.fechaCompra ? data.fechaCompra.split('T')[0] : "",  
      });  
    } catch (error) {  
      console.error('Error al cargar datos del activo:', error);  
      showError('Error al cargar datos del activo');  
      navigate('/admin/lista-activos');  
    } finally {  
      setLoadingData(false);  
    }  
  };  
  
  const handleChange = (e) => {  
    const { name, value } = e.target;  
    setFormData((prevData) => ({  
      ...prevData,  
      [name]: name === "idProveedor" || name === "idEmpleado"  
        ? (value === "" ? "" : parseInt(value))  
        : value,  
    }));  
  };  
  
  const handleSubmit = async (e) => {  
    e.preventDefault();  
    setLoading(true);  
    setMensaje({ tipo: '', texto: '' });  
  
    try {  
      const datosParaEnviar = {  
        ...formData,  
        idEmpleado: formData.idEmpleado ? parseInt(formData.idEmpleado) : null,  
        idProveedor: formData.idProveedor ? parseInt(formData.idProveedor) : null,  
        cantidad: parseInt(formData.cantidad),  
        valor: formData.valor ? parseFloat(formData.valor) : null,  
      };  
  
      if (editando) {  
        await inventarioService.actualizarInventario(id, datosParaEnviar);  
        setMensaje({  
          tipo: 'success',  
          texto: 'Activo actualizado exitosamente'  
        });  
        showSuccess('Activo actualizado exitosamente');  
      } else {  
        await inventarioService.crearInventario(datosParaEnviar);  
        setMensaje({  
          tipo: 'success',  
          texto: 'Activo registrado exitosamente'  
        });  
        showSuccess('Activo registrado exitosamente');  
          
        // Limpiar formulario solo en modo creación  
        setFormData({  
          codigo: "",  
          nombre: "",  
          descripcion: "",  
          cantidad: 1,  
          ubicacion: "",  
          idEmpleado: "",  
          idProveedor: "",  
          valor: "",  
          estado: "Disponible",  
          observacion: "",  
          marca: "",  
          fechaCompra: "",  
        });  
      }  
  
      setTimeout(() => {  
        navigate('/admin/lista-activos');  
      }, 1500);  
  
    } catch (error) {  
      console.error('Error al guardar activo:', error);  
      const mensajeError = error.response?.data?.mensaje ||   
                          error.response?.data?.errores?.[0]?.msg ||   
                          'Error al guardar el activo';  
      setMensaje({  
        tipo: 'danger',  
        texto: mensajeError  
      });  
      showError(mensajeError);  
    } finally {  
      setLoading(false);  
    }  
  };  
  
  if (loadingData) {  
    return (  
      <>  
        <HeaderBlanco />  
        <Container className="mt--7" fluid>  
          <div className="text-center py-5">  
            <div className="spinner-border text-primary" role="status">  
              <span className="sr-only">Cargando...</span>  
            </div>  
            <p className="mt-3">Cargando datos...</p>  
          </div>  
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
          <Col className="order-xl-1" xl="12">  
            <Card className="bg-secondary shadow">  
              <CardHeader className="bg-white border-0">  
                <Row className="align-items-center">  
                  <Col xs="8">  
                    <h3 className="mb-0">  
                      {editando ? 'Editar Activo' : 'Registrar Nuevo Activo'}  
                    </h3>  
                  </Col>  
                  <Col xs="4" className="text-right">  
                    <Button  
                      color="secondary"  
                      size="sm"  
                      onClick={() => navigate('/admin/lista-activos')}  
                    >  
                      <i className="fas fa-arrow-left mr-1" />  
                      Volver  
                    </Button>  
                  </Col>  
                </Row>  
              </CardHeader>  
              <CardBody>  
                <Form onSubmit={handleSubmit}>  
                  <h6 className="heading-small text-muted mb-4">  
                    Información del Activo  
                  </h6>  
                    
                  {mensaje.texto && (  
                    <Alert color={mensaje.tipo} className="mb-4">  
                      {mensaje.texto}  
                    </Alert>  
                  )}  
                    
                  <div className="pl-lg-4">  
                    <Row>  
                      <Col lg="6">  
                        <FormGroup>  
                          <Label>Código *</Label>  
                          <Input  
                            name="codigo"  
                            placeholder="Ej. LAP-001"  
                            type="text"  
                            value={formData.codigo}  
                            onChange={handleChange}  
                            required  
                            disabled={loading}  
                          />  
                        </FormGroup>  
                      </Col>  
                      <Col lg="6">  
                        <FormGroup>  
                          <Label>Nombre *</Label>  
                          <Input  
                            name="nombre"  
                            placeholder="Ej. Laptop Dell"  
                            type="text"  
                            value={formData.nombre}  
                            onChange={handleChange}  
                            required  
                            disabled={loading}  
                          />  
                        </FormGroup>  
                      </Col>  
                    </Row>  
                    <Row>  
                      <Col lg="6">  
                        <FormGroup>  
                          <Label>Descripción</Label>  
                          <Input  
                            name="descripcion"  
                            placeholder="Ej. Laptop empresarial con 16GB RAM"  
                            type="text"  
                            value={formData.descripcion}  
                            onChange={handleChange}  
                            disabled={loading}  
                          />  
                        </FormGroup>  
                      </Col>  
                      <Col lg="6">  
                        <FormGroup>  
                          <Label>Cantidad *</Label>  
                          <Input  
                            name="cantidad"  
                            type="number"  
                            min="1"  
                            value={formData.cantidad}  
                            onChange={handleChange}  
                            required  
                            disabled={loading}  
                          />  
                        </FormGroup>  
                      </Col>  
                    </Row>  
                    <Row>  
                      <Col lg="6">  
                        <FormGroup>  
                          <Label>Ubicación *</Label>  
                          <Input  
                            name="ubicacion"  
                            placeholder="Ej. Oficina 101"  
                            type="text"  
                            value={formData.ubicacion}  
                            onChange={handleChange}  
                            required  
                            disabled={loading}  
                          />  
                        </FormGroup>  
                      </Col>  
                      <Col lg="6">  
                        <FormGroup>  
                          <Label>Asignado a *</Label>  
                          <Input  
                            type="select"  
                            name="idEmpleado"  
                            value={formData.idEmpleado}  
                            onChange={handleChange}  
                            required  
                            disabled={loading}  
                          >  
                            <option value="">Seleccione un empleado</option>  
                            {empleados.map((emp) => (  
                              <option key={emp.idEmpleado} value={emp.idEmpleado}>  
                                {emp.persona?.Pnombre} {emp.persona?.Snombre} {emp.persona?.Papellido} {emp.persona?.Sapellido}  
                              </option>  
                            ))}  
                          </Input>  
                        </FormGroup>  
                      </Col>  
                    </Row>  
                    <Row>  
                      <Col lg="6">  
                        <FormGroup>  
                          <Label>Valor</Label>  
                          <Input  
                            name="valor"  
                            placeholder="Ej. 950.00"  
                            type="number"  
                            step="0.01"  
                            value={formData.valor}  
                            onChange={handleChange}  
                            disabled={loading}  
                          />  
                        </FormGroup>  
                      </Col>  
                      <Col lg="6">  
                        <FormGroup>  
                          <Label>Estado *</Label>  
                          <Input  
                            type="select"  
                            name="estado"  
                            value={formData.estado}  
                            onChange={handleChange}  
                            disabled={loading}  
                          >  
                            <option value="Disponible">Disponible</option>  
                            <option value="Asignado">Asignado</option>  
                            <option value="En Mantenimiento">En Mantenimiento</option>  
                            <option value="Baja">Baja</option>  
                          </Input>  
                        </FormGroup>  
                      </Col>  
                    </Row>  
                    <Row>  
                      <Col lg="6">  
                        <FormGroup>  
                          <Label>Marca</Label>  
                          <Input  
                            name="marca"  
                            type="text"  
                            placeholder="Ej. Dell, HP, Samsung"  
                            value={formData.marca}  
                            onChange={handleChange}  
                            disabled={loading}  
                          />  
                        </FormGroup>  
                      </Col>  
                      <Col lg="6">  
                        <FormGroup>  
                          <Label>Fecha de Compra</Label>  
                          <Input  
                            name="fechaCompra"  
                            type="date"  
                            value={formData.fechaCompra}  
                            onChange={handleChange}  
                            disabled={loading}  
                          />  
                        </FormGroup>  
                      </Col>  
                    </Row>  
                    <Row>  
                      <Col lg="6">  
                        <FormGroup>  
                          <Label>Proveedor</Label>  
                          <Input  
                            type="select"  
                            name="idProveedor"  
                            value={formData.idProveedor}  
                            onChange={handleChange}  
                            disabled={loading}  
                          >  
                            <option value="">Seleccione un proveedor</option>  
                            {proveedores.map((prov) => (  
                              <option key={prov.idProveedor} value={prov.idProveedor}>  
                                {prov.persona?.Pnombre} {prov.persona?.Papellido}  
                              </option>  
                            ))}  
                          </Input>  
                        </FormGroup>  
                      </Col>  
                    </Row>  
                    <Row>   
                      <Col lg="12">  
                        <FormGroup>  
                          <Label>Observación</Label>  
                          <Input  
                            name="observacion"  
                            placeholder="Notas o comentarios adicionales"  
                            rows="4"  
                            type="textarea"  
                            value={formData.observacion}  
                            onChange={handleChange}  
                            disabled={loading}  
                          />  
                        </FormGroup>
                      </Col>
                    </Row>
                  </div>
                  <hr className="my-4" />
                  <div className="text-center">
                    <Button color="primary" type="submit">
                      Registrar Activo
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

export default RegistrarActivo;
