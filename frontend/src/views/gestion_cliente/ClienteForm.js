import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import {
  Card,
  CardHeader,
  CardBody,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Row,
  Col,
  Alert,
  Spinner,
  InputGroup,
  InputGroupText,
  Container
} from 'reactstrap';
import { clienteService } from '../../services/gestion_cliente/clienteService';
import { personaService } from '../../services/seguridad/personaService';
import { useToast } from '../../hooks/useToast';
import { FaUser, FaEnvelope, FaIdCard, FaMapMarkerAlt, FaCalendarAlt, FaVenusMars, FaSave, FaTimes, FaArrowLeft, FaBuilding, FaGlobe } from 'react-icons/fa';
import HeaderBlanco from "components/Headers/HeaderBlanco.js";

const ClienteForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const { showSuccess, showError } = useToast();
  
  const formRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  // Estado para los campos de Persona
  const [personaData, setPersonaData] = useState({
    Pnombre: '',
    Snombre: '',
    Papellido: '',
    Sapellido: '',
    Direccion: '',
    DNI: '',
    correo: '',
    fechaNacimiento: '',
    genero: 'M',
    tipoPersona: 'natural',
    // Campos específicos para personas comerciales
    razonSocial: '',
    rtn: '',
    nombreComercial: ''
  });

  // Estado para los campos de Cliente
  const [clienteData, setClienteData] = useState({
    fechaRegistro: new Date().toISOString().split('T')[0]
  });

  // Estado para el modo de creación de persona
  const [crearNuevaPersona, setCrearNuevaPersona] = useState(true);
  const [personasExistentes, setPersonasExistentes] = useState([]);
  const [personaSeleccionada, setPersonaSeleccionada] = useState(null);

  // Determinar si estamos en modo edición o creación
  const isEditMode = location.pathname.includes('/editar/');

  useEffect(() => {
    if (isEditMode && id) {
      cargarCliente();
    } else {
      cargarPersonasExistentes();
    }
  }, [isEditMode, id]);

  // Efecto para limpiar campos cuando cambia el tipo de persona
  useEffect(() => {
    if (personaData.tipoPersona === 'natural') {
      // Limpiar campos comerciales
      setPersonaData(prev => ({
        ...prev,
        razonSocial: '',
        rtn: '',
        nombreComercial: ''
      }));
    } else {
      // Limpiar campos naturales
      setPersonaData(prev => ({
        ...prev,
        Pnombre: '',
        Snombre: '',
        Papellido: '',
        Sapellido: '',
        DNI: '',
        fechaNacimiento: ''
      }));
    }
    // Limpiar errores relacionados
    setErrors({});
  }, [personaData.tipoPersona]);

  // Función para renderizar campos según tipo de persona
  const renderPersonaFields = () => {
    if (personaData.tipoPersona === 'natural') {
      return (
        <>
          <Row>
            <Col lg="6">
              <FormGroup>
                <Label>Primer Nombre *</Label>
                <Input
                  type="text"
                  placeholder="Ej. Juan"
                  value={personaData.Pnombre}
                  onChange={(e) => handlePersonaChange('Pnombre', e.target.value)}
                  invalid={!!errors.Pnombre}
                  disabled={loading}
                  required
                />
                {errors.Pnombre && <div className="invalid-feedback d-block">{errors.Pnombre}</div>}
              </FormGroup>
            </Col>
            <Col lg="6">
              <FormGroup>
                <Label>Segundo Nombre</Label>
                <Input
                  type="text"
                  placeholder="Ej. Carlos"
                  value={personaData.Snombre}
                  onChange={(e) => handlePersonaChange('Snombre', e.target.value)}
                  disabled={loading}
                />
              </FormGroup>
            </Col>
          </Row>
          
          <Row>
            <Col lg="6">
              <FormGroup>
                <Label>Primer Apellido *</Label>
                <Input
                  type="text"
                  placeholder="Ej. Pérez"
                  value={personaData.Papellido}
                  onChange={(e) => handlePersonaChange('Papellido', e.target.value)}
                  invalid={!!errors.Papellido}
                  disabled={loading}
                  required
                />
                {errors.Papellido && <div className="invalid-feedback d-block">{errors.Papellido}</div>}
              </FormGroup>
            </Col>
            <Col lg="6">
              <FormGroup>
                <Label>Segundo Apellido</Label>
                <Input
                  type="text"
                  placeholder="Ej. García"
                  value={personaData.Sapellido}
                  onChange={(e) => handlePersonaChange('Sapellido', e.target.value)}
                  disabled={loading}
                />
              </FormGroup>
            </Col>
          </Row>
          
          <Row>
            <Col lg="6">
              <FormGroup>
                <Label>DNI *</Label>
                <Input
                  type="text"
                  placeholder="Ej. 12345678"
                  value={personaData.DNI}
                  onChange={(e) => handlePersonaChange('DNI', e.target.value)}
                  invalid={!!errors.DNI}
                  disabled={loading}
                  required
                />
                {errors.DNI && <div className="invalid-feedback d-block">{errors.DNI}</div>}
              </FormGroup>
            </Col>
            <Col lg="6">
              <FormGroup>
                <Label>Género</Label>
                <Input
                  type="select"
                  value={personaData.genero}
                  onChange={(e) => handlePersonaChange('genero', e.target.value)}
                  disabled={loading}
                >
                  <option value="M">Masculino</option>
                  <option value="F">Femenino</option>
                  <option value="O">Otro</option>
                </Input>
              </FormGroup>
            </Col>
          </Row>
          
          <Row>
            <Col lg="6">
              <FormGroup>
                <Label>Fecha de Nacimiento</Label>
                <Input
                  type="date"
                  value={personaData.fechaNacimiento}
                  onChange={(e) => handlePersonaChange('fechaNacimiento', e.target.value)}
                  disabled={loading}
                />
              </FormGroup>
            </Col>
          </Row>
        </>
      );
    } else {
      return (
        <>
          <Row>
            <Col lg="6">
              <FormGroup>
                <Label>Razón Social *</Label>
                <Input
                  type="text"
                  placeholder="Ej. Empresa Comercial S.A. de C.V."
                  value={personaData.razonSocial}
                  onChange={(e) => handlePersonaChange('razonSocial', e.target.value)}
                  invalid={!!errors.razonSocial}
                  disabled={loading}
                  required
                />
                {errors.razonSocial && <div className="invalid-feedback d-block">{errors.razonSocial}</div>}
              </FormGroup>
            </Col>
            <Col lg="6">
              <FormGroup>
                <Label>Nombre Comercial *</Label>
                <Input
                  type="text"
                  placeholder="Ej. Empresa Comercial"
                  value={personaData.nombreComercial}
                  onChange={(e) => handlePersonaChange('nombreComercial', e.target.value)}
                  invalid={!!errors.nombreComercial}
                  disabled={loading}
                  required
                />
                {errors.nombreComercial && <div className="invalid-feedback d-block">{errors.nombreComercial}</div>}
              </FormGroup>
            </Col>
          </Row>
          
          <Row>
            <Col lg="6">
              <FormGroup>
                <Label>RTN *</Label>
                <Input
                  type="text"
                  placeholder="Ej. 0801199000001"
                  value={personaData.rtn}
                  onChange={(e) => handlePersonaChange('rtn', e.target.value)}
                  invalid={!!errors.rtn}
                  disabled={loading}
                  required
                />
                {errors.rtn && <div className="invalid-feedback d-block">{errors.rtn}</div>}
              </FormGroup>
            </Col>
          </Row>
        </>
      );
    }
  };

  const cargarPersonasExistentes = async () => {
    try {
      const personas = await personaService.obtenerPersonas();
      setPersonasExistentes(personas);
    } catch (error) {
      console.error('Error al cargar personas:', error);
      showError('Error al cargar la lista de personas existentes');
    }
  };

  const cargarCliente = async () => {
    setInitialLoading(true);
    try {
      const cliente = await clienteService.obtenerClientePorId(id);
      if (cliente && cliente.persona) {
        setPersonaData({
          Pnombre: cliente.persona.Pnombre || '',
          Snombre: cliente.persona.Snombre || '',
          Papellido: cliente.persona.Papellido || '',
          Sapellido: cliente.persona.Sapellido || '',
          Direccion: cliente.persona.Direccion || '',
          DNI: cliente.persona.DNI || '',
          correo: cliente.persona.correo || '',
          fechaNacimiento: cliente.persona.fechaNacimiento ? cliente.persona.fechaNacimiento.split('T')[0] : '',
          genero: cliente.persona.genero || 'M',
          tipoPersona: cliente.persona.tipoPersona || 'natural',
          razonSocial: cliente.persona.razonSocial || '',
          rtn: cliente.persona.rtn || '',
          nombreComercial: cliente.persona.nombreComercial || ''
        });
        setClienteData({
          fechaRegistro: cliente.fechaRegistro ? cliente.fechaRegistro.split('T')[0] : new Date().toISOString().split('T')[0]
        });
        setCrearNuevaPersona(false);
        setPersonaSeleccionada(cliente.persona);
      }
    } catch (error) {
      console.error('Error al cargar cliente:', error);
      showError('Error al cargar los datos del cliente');
    } finally {
      setInitialLoading(false);
    }
  };

  const handlePersonaChange = (field, value) => {
    setPersonaData(prev => ({
      ...prev,
      [field]: value
    }));
    // Limpiar error del campo
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleClienteChange = (field, value) => {
    setClienteData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePersonaExistenteChange = (e) => {
    const personaId = e.target.value;
    if (personaId) {
      const persona = personasExistentes.find(p => p.idPersona === parseInt(personaId));
      if (persona) {
        setPersonaSeleccionada(persona);
        setPersonaData({
          Pnombre: persona.Pnombre || '',
          Snombre: persona.Snombre || '',
          Papellido: persona.Papellido || '',
          Sapellido: persona.Sapellido || '',
          Direccion: persona.Direccion || '',
          DNI: persona.DNI || '',
          correo: persona.correo || '',
          fechaNacimiento: persona.fechaNacimiento ? persona.fechaNacimiento.split('T')[0] : '',
          genero: persona.genero || 'M',
          tipoPersona: persona.tipoPersona || 'natural',
          razonSocial: persona.razonSocial || '',
          rtn: persona.rtn || '',
          nombreComercial: persona.nombreComercial || ''
        });
      }
    } else {
      setPersonaSeleccionada(null);
      setPersonaData({
        Pnombre: '',
        Snombre: '',
        Papellido: '',
        Sapellido: '',
        Direccion: '',
        DNI: '',
        correo: '',
        fechaNacimiento: '',
        genero: 'M',
        tipoPersona: 'natural',
        razonSocial: '',
        rtn: '',
        nombreComercial: ''
      });
    }
  };

  const validateForm = () => {
    console.log('Validando formulario...');
    console.log('personaData:', personaData);
    
    const newErrors = {};
    
    if (personaData.tipoPersona === 'natural') {
      // Validaciones para personas naturales
      if (!personaData.Pnombre.trim()) newErrors.Pnombre = 'El primer nombre es requerido';
      if (!personaData.Papellido.trim()) newErrors.Papellido = 'El primer apellido es requerido';
      if (!personaData.DNI.trim()) newErrors.DNI = 'El DNI es requerido';
    } else {
      // Validaciones para personas comerciales
      if (!personaData.razonSocial.trim()) newErrors.razonSocial = 'La razón social es requerida';
      if (!personaData.rtn.trim()) newErrors.rtn = 'El RTN es requerido';
      if (!personaData.nombreComercial.trim()) newErrors.nombreComercial = 'El nombre comercial es requerido';
    }
    
    // Validaciones comunes
    if (!personaData.correo.trim()) newErrors.correo = 'El correo es requerido';
    else if (!/\S+@\S+\.\S+/.test(personaData.correo)) newErrors.correo = 'El correo no es válido';
    
    console.log('Errores encontrados:', newErrors);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('Iniciando submit del formulario...');
    console.log('isEditMode:', isEditMode);
    console.log('id:', id);
    console.log('crearNuevaPersona:', crearNuevaPersona);
    console.log('personaSeleccionada:', personaSeleccionada);
    
    if (!validateForm()) {
      console.log('Validación falló, no se puede continuar');
      return;
    }

    try {
      setLoading(true);
      
      if (isEditMode && id) {
        // Modo edición
        let datosPersona = { ...personaData };
        
        // Para personas comerciales, no enviar Pnombre ya que no es requerido
        if (personaData.tipoPersona === 'comercial') {
          delete datosPersona.Pnombre;
        }
        
        const datosEdicion = {
          ...clienteData,
          personaData: datosPersona
        };
        
        console.log('Enviando datos de edición:', datosEdicion);
        await clienteService.editarCliente(id, datosEdicion);
        showSuccess('Cliente actualizado exitosamente');
      } else {
        // Modo creación
        if (crearNuevaPersona) {
          // Crear nueva persona junto con el cliente
          let datosPersona = { ...personaData };
          
          // Para personas comerciales, no enviar Pnombre ya que no es requerido
          if (personaData.tipoPersona === 'comercial') {
            delete datosPersona.Pnombre;
          }
          
          const datosCreacion = {
            ...clienteData,
            personaData: datosPersona
          };
          
          console.log('Enviando datos de creación:', datosCreacion);
          await clienteService.crearCliente(datosCreacion);
          showSuccess('Cliente creado exitosamente');
        } else if (personaSeleccionada) {
          // Usar persona existente
          const datosCreacion = {
            ...clienteData,
            idPersona: personaSeleccionada.idPersona
          };
          
          console.log('Enviando datos de creación con persona existente:', datosCreacion);
          await clienteService.crearCliente(datosCreacion);
          showSuccess('Cliente creado exitosamente');
        } else {
          throw new Error('Debe seleccionar una persona existente o crear una nueva');
        }
      }
      
      // Redirigir después de un breve delay
      setTimeout(() => {
        navigate('/admin/clientes');
      }, 1500);
      
    } catch (error) {
      console.error('Error al guardar cliente:', error);
      console.error('Error response:', error.response);
      console.error('Error data:', error.response?.data);
      
      let errorMessage = 'Error al guardar el cliente';
      
      if (error.response?.data?.mensaje) {
        errorMessage = error.response.data.mensaje;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.errores) {
        errorMessage = error.response.data.errores.map(e => e.msg).join(', ');
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };



  if (initialLoading) {
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
      <Container className="mt--7" fluid>
        <Row>
          <Col className="order-xl-1" xl="12">
            <Card className="bg-secondary shadow">
              <CardHeader className="bg-white border-0">
                <Row className="align-items-center">
                  <Col xs="8">
                    <h3 className="mb-0">
                      {isEditMode ? 'Editar Cliente' : 'Registrar Nuevo Cliente'}
                    </h3>
                  </Col>
                  <Col xs="4" className="text-right">
                    <Button
                      color="secondary"
                      size="sm"
                      onClick={() => navigate('/admin/clientes')}
                    >
                      <i className="fas fa-arrow-left mr-1" />
                      Volver
                    </Button>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                <Form ref={formRef} onSubmit={handleSubmit}>
                  <h6 className="heading-small text-muted mb-4">
                    Tipo de Cliente
                  </h6>
                  
                  <div className="pl-lg-4">
                    <Row>
                      <Col lg="6">
                        <FormGroup>
                          <Label>Tipo de Persona *</Label>
                          <Input
                            type="select"
                            value={personaData.tipoPersona}
                            onChange={(e) => handlePersonaChange('tipoPersona', e.target.value)}
                            disabled={loading}
                            required
                          >
                            <option value="natural">
                              <FaUser className="me-2" />
                              Persona Natural
                            </option>
                            <option value="comercial">
                              <FaBuilding className="me-2" />
                              Persona Comercial (Empresa)
                            </option>
                          </Input>
                        </FormGroup>
                      </Col>
                    </Row>
                  </div>
                  
                  <hr className="my-4" />
                  
                  <h6 className="heading-small text-muted mb-4">
                    {personaData.tipoPersona === 'natural' ? 'Información Personal' : 'Información de la Empresa'}
                  </h6>
                  
                                    <div className="pl-lg-4">
                    {/* Campos específicos según tipo de persona */}
                    {renderPersonaFields()}
                    
                    {/* Campos comunes */}
                    <Row>
                      <Col lg="6">
                        <FormGroup>
                          <Label>Correo Electrónico *</Label>
                          <Input
                            type="email"
                            placeholder="Ej. contacto@email.com"
                            value={personaData.correo}
                            onChange={(e) => handlePersonaChange('correo', e.target.value)}
                            invalid={!!errors.correo}
                            disabled={loading}
                            required
                          />
                          {errors.correo && <div className="invalid-feedback d-block">{errors.correo}</div>}
                        </FormGroup>
                      </Col>
                      <Col lg="6">
                        <FormGroup>
                          <Label>Dirección</Label>
                          <Input
                            type="text"
                            placeholder="Ej. Calle Principal 123"
                            value={personaData.Direccion}
                            onChange={(e) => handlePersonaChange('Direccion', e.target.value)}
                            disabled={loading}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    
                    <Row>
                      <Col lg="6">
                        <FormGroup>
                          <Label>Fecha de Registro</Label>
                          <Input
                            type="date"
                            value={clienteData.fechaRegistro}
                            onChange={(e) => handleClienteChange('fechaRegistro', e.target.value)}
                            disabled={loading}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                  </div>
                  

                  
                  <div className="text-center">
                    <Button color="primary" type="submit" disabled={loading}>
                      {loading ? (
                        <>
                          <Spinner size="sm" className="me-2" />
                          Guardando...
                        </>
                      ) : (
                        isEditMode ? 'Actualizar Cliente' : 'Registrar Cliente'
                      )}
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

export default ClienteForm;
