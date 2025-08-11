import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Card, CardHeader, CardBody, Container, Row, Col, Form, FormGroup, Label, Input } from 'reactstrap';
import { empleadoService } from '../../services/gestion_cliente/empleadoService';
import { personaService } from '../../services/seguridad/personaService';
import { rolService } from '../../services/seguridad/rolService';
import { useToast } from '../../hooks/useToast';
import HeaderBlanco from 'components/Headers/HeaderBlanco.js';
import Toast from 'components/Toast/Toast';

const EmpleadoForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast, showSuccess, showError, hideToast } = useToast();
  const [empleado, setEmpleado] = useState({ 
    idPersona: '', 
    idRol: '',
    Fecha_Registro: new Date().toISOString().slice(0, 10) 
  });
  
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
    tipoPersona: 'natural'
  });
  
  const [editarPersona, setEditarPersona] = useState(false);
  const [errors, setErrors] = useState({});
  
  const limpiarFormulario = () => {
    setEmpleado({
      idPersona: '', 
      idRol: '',
      Fecha_Registro: new Date().toISOString().slice(0, 10)
    });
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
      tipoPersona: 'natural'
    });
    setEditarPersona(false);
    setErrors({});
  };
  
  const [personas, setPersonas] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Cargar personas
        const personasData = await personaService.obtenerPersonas();
        setPersonas(personasData);
        
        // Cargar roles
        const rolesData = await rolService.obtenerRoles();
        setRoles(rolesData);
        
        console.log('📋 Personas cargadas:', personasData);
        console.log('🔑 Roles cargados:', rolesData);
      } catch (error) {
        console.error('❌ Error al cargar datos:', error);
        showError('Error al cargar los datos necesarios');
      }
    };

    fetchData();

    if (id) {
      const fetchEmpleado = async () => {
        try {
          const data = await empleadoService.obtenerEmpleadoPorId(id);
          console.log('👤 Empleado cargado:', data);
          setEmpleado(data);
          
          // Si el empleado tiene persona asociada, cargar sus datos
          if (data.persona) {
            setPersonaData({
              Pnombre: data.persona.Pnombre || '',
              Snombre: data.persona.Snombre || '',
              Papellido: data.persona.Papellido || '',
              Sapellido: data.persona.Sapellido || '',
              Direccion: data.persona.Direccion || '',
              DNI: data.persona.DNI || '',
              correo: data.persona.correo || '',
              fechaNacimiento: data.persona.fechaNacimiento ? data.persona.fechaNacimiento.split('T')[0] : '',
              genero: data.persona.genero || 'M',
              tipoPersona: data.persona.tipoPersona || 'natural'
            });
            setEditarPersona(true);
          }
        } catch (error) {
          console.error('❌ Error al cargar empleado:', error);
          showError('Error al cargar el empleado');
        }
      };
      fetchEmpleado();
    }
  }, [id, showError]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmpleado(prevState => ({ ...prevState, [name]: value }));
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

  // Función para renderizar campos de persona
  const renderPersonaFields = () => {
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
          </Row>
          
          <Row>
            <Col lg="12">
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
        </>
      );
    };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validaciones del frontend
    if (editarPersona) {
      // Validar campos de persona
      const newErrors = {};
      if (!personaData.Pnombre?.trim()) newErrors.Pnombre = 'El primer nombre es requerido';
      if (!personaData.Papellido?.trim()) newErrors.Papellido = 'El primer apellido es requerido';
      if (!personaData.DNI?.trim()) newErrors.DNI = 'El DNI es requerido';
      else if (personaData.DNI.length < 8) newErrors.DNI = 'El DNI debe tener al menos 8 caracteres';
      if (!personaData.correo?.trim()) newErrors.correo = 'El correo es requerido';
      else if (!/\S+@\S+\.\S+/.test(personaData.correo)) newErrors.correo = 'El correo no es válido';
      
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        showError('Por favor complete todos los campos requeridos de la persona');
        return;
      }
    } else {
      if (!empleado.idPersona) {
        showError('Debe seleccionar una persona');
        return;
      }
    }
    
    setLoading(true);
    try {
      console.log('💾 Guardando empleado:', empleado);
      console.log('📝 Datos de persona:', personaData);
      
      let datosParaEnviar = { ...empleado };
      
      if (editarPersona) {
        // Si estamos editando persona, incluir los datos
        datosParaEnviar.personaData = personaData;
        // Limpiar idPersona si estamos creando persona nueva
        delete datosParaEnviar.idPersona;
      }
      
      console.log('📤 Datos a enviar al backend:', datosParaEnviar);
      
      if (id) {
        await empleadoService.editarEmpleado(id, datosParaEnviar);
        showSuccess('Empleado actualizado exitosamente');
      } else {
        await empleadoService.crearEmpleado(datosParaEnviar);
        showSuccess('Empleado creado exitosamente');
      }
      
      setTimeout(() => navigate('/admin/empleados'), 1000);
    } catch (error) {
      console.error('❌ Error al guardar empleado:', error);
      
      // Mostrar mensaje de error más específico
      let errorMessage = 'Error al guardar el empleado';
      if (error.response?.data?.mensaje) {
        errorMessage = error.response.data.mensaje;
      } else if (error.response?.data?.errores) {
        errorMessage = error.response.data.errores.map(e => e.msg).join(', ');
      }
      
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <HeaderBlanco />
      <Container className="mt--7" fluid>
        <Toast show={toast.show} message={toast.message} type={toast.type} onClose={hideToast} />
        <Row>
          <Col>
            <Card className="shadow">
              <CardHeader>
                <h3>{id ? 'Editar Empleado' : 'Nuevo Empleado'}</h3>
              </CardHeader>
              <CardBody>
                <Form onSubmit={handleSubmit}>
                  {/* Sección de selección/edición de persona */}
                  <h6 className="heading-small text-muted mb-4">Información de la Persona</h6>
                  
                                     <div className="mb-3">
                     <Button
                       type="button"
                       color={editarPersona ? "secondary" : "primary"}
                       size="sm"
                       onClick={() => {
                         setEditarPersona(!editarPersona);
                         setErrors({}); // Limpiar errores al cambiar modo
                       }}
                       className="me-2"
                     >
                       {editarPersona ? "Seleccionar Persona Existente" : "Editar Datos de Persona"}
                     </Button>
                     

                   </div>
                  
                  {editarPersona ? (
                    // Campos para editar persona
                    renderPersonaFields()
                  ) : (
                    // Selector de persona existente
                    <FormGroup>
                      <Label for="idPersona">Persona <span className="text-danger">*</span></Label>
                      <Input type="select" name="idPersona" id="idPersona" value={empleado.idPersona} onChange={handleChange} required>
                        <option value="">Seleccione una persona</option>
                        {personas.map(p => (
                          <option key={p.idPersona} value={p.idPersona}>
                            {p.tipoPersona === 'comercial' ? 
                              (p.razonSocial || p.nombreComercial || 'Empresa Comercial') :
                              `${p.Pnombre || ''} ${p.Papellido || ''}`.trim()
                            }
                          </option>
                        ))}
                      </Input>
                    </FormGroup>
                  )}
                  
                  <hr className="my-4" />
                  
                  <h6 className="heading-small text-muted mb-4">Información del Empleado</h6>
                  
                  <FormGroup>
                    <Label for="idRol">Rol (Opcional)</Label>
                    <Input type="select" name="idRol" id="idRol" value={empleado.idRol} onChange={handleChange}>
                      <option value="">Sin rol asignado</option>
                      {roles.map(r => (
                        <option key={r.idrol} value={r.idrol}>{r.nombre}</option>
                      ))}
                    </Input>
                  </FormGroup>
                  
                  <FormGroup>
                    <Label for="Fecha_Registro">Fecha de Registro</Label>
                    <Input type="date" name="Fecha_Registro" id="Fecha_Registro" value={empleado.Fecha_Registro} onChange={handleChange} required />
                  </FormGroup>
                  <Button type="submit" color="primary" disabled={loading}>
                    {loading ? 'Guardando...' : 'Guardar'}
                  </Button>
                  <Button color="secondary" onClick={() => navigate('/admin/empleados')} disabled={loading}>Cancelar</Button>
                  <Button color="warning" onClick={limpiarFormulario} disabled={loading}>Limpiar</Button>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default EmpleadoForm;
