import React, { useEffect, useState, useRef } from 'react';
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  Container,
  Row,
  Col,
  Alert,
  Label,
  Collapse,
} from "reactstrap";
import UserHeader from "components/Headers/UserHeader.js";
import { authService } from '../../services/seguridad/authService';
import { personaService } from '../../services/seguridad/personaService';
import { empleadoService } from '../../services/gestion_cliente/empleadoService';
import { rolService } from '../../services/seguridad/rolService';

// Estilos personalizados para el perfil
const profileStyles = {
  avatarUpload: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '1rem'
  },
  avatarPreview: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    border: '3px solid #5e72e4',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f9fa'
  },
  avatarPreviewInner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%'
  },
  employeeInfo: {
    marginBottom: '1rem'
  },
  roleBadge: {
    marginBottom: '0.5rem'
  },
  statusIndicator: {
    marginTop: '0.5rem'
  },
  statItem: {
    padding: '0.5rem'
  },
  infoItem: {
    padding: '0.5rem'
  },
  cardProfile: {
    borderRadius: '15px',
    overflow: 'hidden'
  },
  cardHeader: {
    borderBottom: 'none',
    padding: '1rem'
  },
  cardBody: {
    padding: '1.5rem'
  }
};

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [usuario, setUsuario] = useState({ idUsuario: '', Nombre_Usuario: '' });
  const [persona, setPersona] = useState({
    idPersona: '',
    Pnombre: '',
    Snombre: '',
    Papellido: '',
    Sapellido: '',
    Direccion: '',
    DNI: '',
    correo: '',
    fechaNacimiento: '',
    genero: ''
  });
  const [contrasenaActual, setContrasenaActual] = useState('');
  const [nuevaContrasena, setNuevaContrasena] = useState('');
  const [confirmarContrasena, setConfirmarContrasena] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [empleado, setEmpleado] = useState({ 
    idEmpleado: '', 
    Fecha_Registro: '',
    idRol: ''
  });
  const [roles, setRoles] = useState([]);
  const [validaciones, setValidaciones] = useState({});
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const passwordSectionRef = useRef(null);

  const cargarPerfil = async () => {
    try {
      setLoading(true);
      
      // IMPORTANTE: Asegurar que los campos de contraseña estén siempre vacíos
      setContrasenaActual('');
      setNuevaContrasena('');
      setConfirmarContrasena('');
      
      // Cargar roles disponibles
      const rolesData = await rolService.obtenerRoles();
      setRoles(rolesData);

      // Pedir perfil al backend para asegurar IDs/persona actualizados
      const perfil = await authService.getProfile();
      const userSrv = perfil.user || {};
      const empleadoSrv = perfil.empleado || null;

      const usuarioLocal = userSrv.idUsuario ? userSrv : authService.getCurrentUser();
      if (!usuarioLocal) throw new Error('Sesión no encontrada');

      setUsuario({ idUsuario: usuarioLocal.idUsuario, Nombre_Usuario: usuarioLocal.Nombre_Usuario });

      if (userSrv.idPersona || usuarioLocal.idPersona) {
        const idPer = userSrv.idPersona || usuarioLocal.idPersona;
        const dataPersona = await personaService.obtenerPersonaPorId(idPer);
        setPersona({
          idPersona: dataPersona.idPersona,
          Pnombre: dataPersona.Pnombre || '',
          Snombre: dataPersona.Snombre || '',
          Papellido: dataPersona.Papellido || '',
          Sapellido: dataPersona.Sapellido || '',
          Direccion: dataPersona.Direccion || '',
          DNI: dataPersona.DNI || '',
          correo: dataPersona.correo || '',
          fechaNacimiento: dataPersona.fechaNacimiento ? String(dataPersona.fechaNacimiento).substring(0, 10) : '',
          genero: dataPersona.genero || ''
        });
      }
      
      // Cargar empleado preferentemente del backend perfil
      if (empleadoSrv?.idEmpleado) {
        setEmpleado({ 
          idEmpleado: empleadoSrv.idEmpleado, 
          Fecha_Registro: empleadoSrv.Fecha_Registro || '',
          idRol: empleadoSrv.idRol || ''
        });
      } else if (userSrv.idEmpleado) {
        const dataEmpleado = await empleadoService.obtenerEmpleadoPorId(userSrv.idEmpleado);
        const emp = dataEmpleado?.empleado || dataEmpleado;
        setEmpleado({ 
          idEmpleado: emp?.idEmpleado || userSrv.idEmpleado, 
          Fecha_Registro: emp?.Fecha_Registro || '',
          idRol: emp?.idRol || ''
        });
      }
      setError('');
    } catch (e) {
      setError(e.message || 'Error al cargar el perfil');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarPerfil();
  }, []);

  // Asegurar que los campos de contraseña estén siempre vacíos al cargar
  useEffect(() => {
    setContrasenaActual('');
    setNuevaContrasena('');
    setConfirmarContrasena('');
    setShowPasswordSection(false);
  }, []);

  const handlePersonaChange = (e) => {
    const { name, value } = e.target;
    setPersona(prev => ({ ...prev, [name]: value }));
    // Limpiar validación del campo
    if (validaciones[name]) {
      setValidaciones(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleUsuarioChange = (e) => {
    const { name, value } = e.target;
    setUsuario(prev => ({ ...prev, [name]: value }));
    if (validaciones[name]) {
      setValidaciones(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleEmpleadoChange = (e) => {
    const { name, value } = e.target;
    setEmpleado(prev => ({ ...prev, [name]: value }));
    if (validaciones[name]) {
      setValidaciones(prev => ({ ...prev, [name]: null }));
    }
  };

  const togglePasswordSection = () => {
    setShowPasswordSection(!showPasswordSection);
    if (!showPasswordSection) {
      // Limpiar campos al abrir la sección
      setContrasenaActual('');
      setNuevaContrasena('');
      setConfirmarContrasena('');
      // Scroll to password section after a short delay to ensure it's rendered
      setTimeout(() => {
        passwordSectionRef.current?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      }, 100);
    }
  };

  const validarFormulario = () => {
    const errores = {};

    // Validar campos obligatorios del perfil (sin contraseñas)
    if (!usuario.Nombre_Usuario?.trim()) {
      errores.Nombre_Usuario = 'El nombre de usuario es obligatorio';
    }
    if (!persona.Pnombre?.trim()) {
      errores.Pnombre = 'El primer nombre es obligatorio';
    }
    if (!persona.Papellido?.trim()) {
      errores.Papellido = 'El primer apellido es obligatorio';
    }
    if (!persona.DNI?.trim()) {
      errores.DNI = 'El DNI es obligatorio';
    }
    if (!persona.correo?.trim()) {
      errores.correo = 'El correo electrónico es obligatorio';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(persona.correo)) {
      errores.correo = 'El correo electrónico no es válido';
    }

    setValidaciones(errores);
    return Object.keys(errores).length === 0;
  };

  const validarCambioContrasena = () => {
    const errores = {};

    if (!contrasenaActual.trim()) {
      errores.contrasenaActual = 'La contraseña actual es obligatoria';
    }
    if (!nuevaContrasena.trim()) {
      errores.nuevaContrasena = 'La nueva contraseña es obligatoria';
    } else if (nuevaContrasena.length < 6) {
      errores.nuevaContrasena = 'La contraseña debe tener al menos 6 caracteres';
    }
    if (!confirmarContrasena.trim()) {
      errores.confirmarContrasena = 'La confirmación de contraseña es obligatoria';
    } else if (nuevaContrasena !== confirmarContrasena) {
      errores.confirmarContrasena = 'Las contraseñas no coinciden';
    }

    setValidaciones(errores);
    return Object.keys(errores).length === 0;
  };

  const cambiarContrasena = async () => {
    try {
      if (!validarCambioContrasena()) {
        return;
      }

      setSaving(true);
      setMensaje('');
      setError('');

      // Solo cambiar contraseña
      if (usuario.idUsuario) {
        const axiosInstance = (await import('../../utils/axiosConfig')).default;
        await axiosInstance.put(`/auth/usuario/${usuario.idUsuario}`, {
          contraseñaActual: contrasenaActual,
          contraseña: nuevaContrasena 
        });
      }

      // Limpiar campos de contraseña
      setContrasenaActual('');
      setNuevaContrasena('');
      setConfirmarContrasena('');
      setShowPasswordSection(false);

      setMensaje('Contraseña cambiada correctamente');
    } catch (e) {
      setError(e.response?.data?.mensaje || e.message || 'Error al cambiar la contraseña');
    } finally {
      setSaving(false);
    }
  };

  const guardarCambios = async () => {
    try {
      if (!validarFormulario()) {
        return;
      }

      setSaving(true);
      setMensaje('');
      setError('');

      // Actualizar persona
      if (persona.idPersona) {
        await personaService.actualizarPersona(persona.idPersona, {
          Pnombre: persona.Pnombre,
          Snombre: persona.Snombre,
          Papellido: persona.Papellido,
          Sapellido: persona.Sapellido,
          Direccion: persona.Direccion,
          DNI: persona.DNI,
          correo: persona.correo,
          fechaNacimiento: persona.fechaNacimiento || null,
          genero: persona.genero
        });
      }

      // Actualizar empleado (rol)
      if (empleado.idEmpleado && empleado.idRol) {
        await empleadoService.editarEmpleado(empleado.idEmpleado, {
          idRol: empleado.idRol
        });
      }

      // Actualizar usuario (solo username, NO contraseña)
      if (usuario.idUsuario) {
        const axiosInstance = (await import('../../utils/axiosConfig')).default;
        await axiosInstance.put(`/auth/usuario/${usuario.idUsuario}`, {
          Nombre_Usuario: usuario.Nombre_Usuario
        });
      }

      // Refrescar datos locales del usuario (nombre actualizado)
      const current = authService.getCurrentUser() || {};
      const actualizado = { ...current, Nombre_Usuario: usuario.Nombre_Usuario };
      localStorage.setItem('usuario', JSON.stringify(actualizado));

      setMensaje('Perfil actualizado correctamente');
    } catch (e) {
      setError(e.response?.data?.mensaje || e.message || 'Error al guardar cambios');
    } finally {
      setSaving(false);
    }
  };

  const mostrarErrorCampo = (campo) => {
    return validaciones[campo] ? (
      <Alert color="danger" className="mt-1 py-1 px-2">
        <small>{validaciones[campo]}</small>
      </Alert>
    ) : null;
  };

  return (
    <>
      <UserHeader />
      <Container className="mt--7" fluid>
        <Row>
          <Col className="order-xl-2 mb-5 mb-xl-0" xl="4">
            <Card className="card-profile shadow" style={profileStyles.cardProfile}>

              <CardBody className="pt-0 pt-md-4" style={profileStyles.cardBody}>
                <div className="text-center">
                  {/* Avatar placeholder */}
                  <div style={profileStyles.avatarUpload}>
                    <div style={profileStyles.avatarPreview}>
                      <div style={profileStyles.avatarPreviewInner}>
                        <i className="ni ni-single-02" style={{ fontSize: '3rem', color: '#5e72e4' }} />
                      </div>
                    </div>
                  </div>
                  
                  {/* User name */}
                  <h3 className="mb-1">{usuario.Nombre_Usuario || 'Usuario'}</h3>
                  
                  {/* Company info */}
                  <div className="h5 font-weight-300 text-primary mb-2">
                    <i className="ni ni-building mr-2" /> Canal 40
                  </div>
                  
                  {/* Employee details */}
                  {empleado && empleado.idEmpleado && (
                    <div style={profileStyles.employeeInfo}>
                      <div className="badge badge-success mb-2" style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}>
                        <i className="ni ni-badge mr-1" />
                        Empleado #{empleado.idEmpleado}
                      </div>
                      
                      {/* Role display */}
                      {empleado.rol && (
                        <div style={profileStyles.roleBadge}>
                          <span className="badge badge-info" style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}>
                            <i className="ni ni-tag mr-1" />
                            {empleado.rol.nombre}
                          </span>
                        </div>
                      )}
                      
                      {/* Status indicator */}
                      <div style={profileStyles.statusIndicator}>
                        <span className="badge badge-success" style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}>
                          <i className="ni ni-check-bold mr-1" />
                          Activo
                        </span>
                      </div>
                    </div>
                  )}
                  
                  {/* Quick stats */}
                  <div className="row text-center mt-4">
                    <div className="col-6">
                      <div style={profileStyles.statItem}>
                        <h4 className="text-primary mb-0" style={{ fontSize: '1.5rem' }}>
                          {persona ? '✓' : '✗'}
                        </h4>
                        <small className="text-muted">Perfil</small>
                      </div>
                    </div>
                    <div className="col-6">
                      <div style={profileStyles.statItem}>
                        <h4 className="text-success mb-0" style={{ fontSize: '1.5rem' }}>
                          {empleado ? '✓' : '✗'}
                        </h4>
                        <small className="text-muted">Empleado</small>
                      </div>
                    </div>
                  </div>
                  
                  {/* Last login info */}
                  <div className="mt-3 pt-3 border-top">
                    <small className="text-muted">
                      <i className="ni ni-time-alarm mr-1" />
                      Última sesión: {new Date().toLocaleDateString()}
                    </small>
                  </div>
                </div>
              </CardBody>
            </Card>
            

          </Col>
          <Col className="order-xl-1" xl="8">
            <Card className="bg-secondary shadow">
              <CardHeader className="bg-white border-0">
                <Row className="align-items-center">
                  <Col xs="5">
                    <h3 className="mb-0">Mi cuenta</h3>
                  </Col>
                  <Col className="text-right" xs="4">
                  <Button
                    color="info"
                    size="sm"
                    onClick={togglePasswordSection}
                    className="btn-icon btn-sm"
                  > Ir a Cambiar Contraseña
                  </Button> </Col>
                  <Col className="text-right" xs="3">
                    <Button color="primary" onClick={guardarCambios} disabled={saving || loading} size="sm">
                      {saving ? 'Guardando...' : 'Guardar Cambios'}
                    </Button>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                {loading ? (
                  <div className="text-center py-4">Cargando...</div>
                ) : (
                  <Form>
                    {mensaje && <Alert color="success">{mensaje}</Alert>}
                    {error && <Alert color="danger">{error}</Alert>}

                    <h6 className="heading-small text-muted mb-4">Información del usuario</h6>
                    <div className="pl-lg-4">
                      <Row>
                        <Col lg="6">
                          <FormGroup>
                            <Label className="form-control-label" for="input-username">
                              Nombre de usuario *
                            </Label>
                            <Input 
                              id="input-username" 
                              type="text" 
                              name="Nombre_Usuario" 
                              value={usuario.Nombre_Usuario} 
                              onChange={handleUsuarioChange}
                              invalid={!!validaciones.Nombre_Usuario}
                            />
                            {mostrarErrorCampo('Nombre_Usuario')}
                          </FormGroup>
                        </Col>
                        <Col lg="6">
                          <FormGroup>
                            <Label className="form-control-label" for="input-email">
                              Correo electrónico *
                            </Label>
                            <Input 
                              id="input-email" 
                              type="email" 
                              name="correo" 
                              value={persona.correo} 
                              onChange={handlePersonaChange}
                              invalid={!!validaciones.correo}
                            />
                            {mostrarErrorCampo('correo')}
                          </FormGroup>
                        </Col>
                      </Row>
                    </div>

                    <hr className="my-4" />

                    <h6 className="heading-small text-muted mb-4">Información personal</h6>
                    <div className="pl-lg-4">
                      <Row>
                        <Col lg="6">
                          <FormGroup>
                            <Label className="form-control-label" for="input-first-name">
                              Primer nombre *
                            </Label>
                            <Input 
                              id="input-first-name" 
                              type="text" 
                              name="Pnombre" 
                              value={persona.Pnombre} 
                              onChange={handlePersonaChange}
                              invalid={!!validaciones.Pnombre}
                            />
                            {mostrarErrorCampo('Pnombre')}
                          </FormGroup>
                        </Col>
                        <Col lg="6">
                          <FormGroup>
                            <Label className="form-control-label" for="input-second-name">
                              Segundo nombre
                            </Label>
                            <Input 
                              id="input-second-name" 
                              type="text" 
                              name="Snombre" 
                              value={persona.Snombre} 
                              onChange={handlePersonaChange}
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col lg="6">
                          <FormGroup>
                            <Label className="form-control-label" for="input-first-lastname">
                              Primer apellido *
                            </Label>
                            <Input 
                              id="input-first-lastname" 
                              type="text" 
                              name="Papellido" 
                              value={persona.Papellido} 
                              onChange={handlePersonaChange}
                              invalid={!!validaciones.Papellido}
                            />
                            {mostrarErrorCampo('Papellido')}
                          </FormGroup>
                        </Col>
                        <Col lg="6">
                          <FormGroup>
                            <Label className="form-control-label" for="input-second-lastname">
                              Segundo apellido
                            </Label>
                            <Input 
                              id="input-second-lastname" 
                              type="text" 
                              name="Sapellido" 
                              value={persona.Sapellido} 
                              onChange={handlePersonaChange}
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                    </div>

                    <hr className="my-4" />

                    <h6 className="heading-small text-muted mb-4">Información de contacto</h6>
                    <div className="pl-lg-4">
                      <Row>
                        <Col md="12">
                          <FormGroup>
                            <Label className="form-control-label" for="input-address">
                              Dirección
                            </Label>
                            <Input 
                              id="input-address" 
                              type="text" 
                              name="Direccion" 
                              value={persona.Direccion} 
                              onChange={handlePersonaChange}
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col lg="4">
                          <FormGroup>
                            <Label className="form-control-label" for="input-dni">
                              DNI *
                            </Label>
                            <Input 
                              id="input-dni" 
                              type="text" 
                              name="DNI" 
                              value={persona.DNI} 
                              onChange={handlePersonaChange}
                              invalid={!!validaciones.DNI}
                            />
                            {mostrarErrorCampo('DNI')}
                          </FormGroup>
                        </Col>
                        <Col lg="4">
                          <FormGroup>
                            <Label className="form-control-label" for="input-fecha">
                              Fecha Nacimiento
                            </Label>
                            <Input 
                              id="input-fecha" 
                              type="date" 
                              name="fechaNacimiento" 
                              value={persona.fechaNacimiento} 
                              onChange={handlePersonaChange}
                            />
                          </FormGroup>
                        </Col>
                        <Col lg="4">
                          <FormGroup>
                            <Label className="form-control-label" for="input-genero">
                              Género
                            </Label>
                            <Input 
                              id="input-genero" 
                              type="select" 
                              name="genero" 
                              value={persona.genero} 
                              onChange={handlePersonaChange}
                            >
                              <option value="">Seleccionar...</option>
                              <option value="M">Masculino</option>
                              <option value="F">Femenino</option>
                            </Input>
                          </FormGroup>
                        </Col>
                      </Row>
                    </div>

                    <hr className="my-4" />

                    <h6 className="heading-small text-muted mb-4">Información laboral</h6>
                    <div className="pl-lg-4">
                      <Row>
                        <Col lg="6">
                          <FormGroup>
                            <Label className="form-control-label" for="input-rol">
                              Rol del empleado
                            </Label>
                            <Input 
                              id="input-rol" 
                              type="select" 
                              name="idRol" 
                              value={empleado.idRol || ''} 
                              onChange={handleEmpleadoChange}
                            >
                              <option value="">Seleccionar rol...</option>
                              {roles.map(rol => (
                                <option key={rol.idrol} value={rol.idrol}>
                                  {rol.nombre}
                                </option>
                              ))}
                            </Input>
                          </FormGroup>
                        </Col>
                        {empleado.idEmpleado && (
                          <Col lg="6">
                            <FormGroup>
                              <Label className="form-control-label">
                                Fecha Registro (Empleado)
                              </Label>
                              <Input 
                                type="text" 
                                value={empleado.Fecha_Registro ? String(empleado.Fecha_Registro).substring(0,10) : ''} 
                                disabled 
                              />
                            </FormGroup>
                          </Col>
                        )}
                      </Row>
                    </div>

                    <hr className="my-4" />

                    <h6 className="heading-small text-muted mb-4">Seguridad</h6>
                    <div className="pl-lg-4">
                      <Row>
                        <Col lg="12">
                          <Button
                            color="secondary"
                            outline
                            onClick={togglePasswordSection}
                            className="mb-3"
                          >
                            <i className={`ni ${showPasswordSection ? 'ni-bold-down' : 'ni-bold-right'} mr-2`}></i>
                            {showPasswordSection ? 'Ocultar cambio de contraseña' : 'Cambiar contraseña'}
                          </Button>
                        </Col>
                      </Row>
                      
                      <Collapse isOpen={showPasswordSection}>
                        <div ref={passwordSectionRef} className="mt-4">
                          <Card>
                            <CardHeader>
                              <h4 className="mb-0">Cambiar Contraseña</h4>
                            </CardHeader>
                            <CardBody>
                              <Row>
                                <Col md="6">
                                  <FormGroup>
                                    <label>Contraseña Actual</label>
                                    <Input
                                      type="password"
                                      value={contrasenaActual}
                                      onChange={(e) => setContrasenaActual(e.target.value)}
                                      placeholder="Ingrese su contraseña actual"
                                      autoComplete="off"
                                      data-lpignore="true"
                                    />
                                  </FormGroup>
                                </Col>
                              </Row>
                              <Row>
                                <Col md="6">
                                  <FormGroup>
                                    <label>Nueva Contraseña</label>
                                    <Input
                                      type="password"
                                      value={nuevaContrasena}
                                      onChange={(e) => setNuevaContrasena(e.target.value)}
                                      placeholder="Ingrese su nueva contraseña"
                                      autoComplete="off"
                                      data-lpignore="true"
                                    />
                                  </FormGroup>
                                </Col>
                                <Col md="6">
                                  <FormGroup>
                                    <label>Confirmar Nueva Contraseña</label>
                                    <Input
                                      type="password"
                                      value={confirmarContrasena}
                                      onChange={(e) => setConfirmarContrasena(e.target.value)}
                                      placeholder="Confirme su nueva contraseña"
                                      autoComplete="off"
                                      data-lpignore="true"
                                    />
                                  </FormGroup>
                                </Col>
                              </Row>
                              <Row>
                                <Col>
                                  <Button
                                    color="success"
                                    onClick={cambiarContrasena}
                                    disabled={!contrasenaActual || !nuevaContrasena || !confirmarContrasena}
                                  >
                                    Cambiar Contraseña
                                  </Button>
                                </Col>
                              </Row>
                            </CardBody>
                          </Card>
                        </div>
                      </Collapse>
                    </div>
                  </Form>
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Profile;
