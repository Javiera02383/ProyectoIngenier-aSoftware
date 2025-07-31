// views/examples/Register.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Row,
  Col,
  Alert
} from "reactstrap";
import { authService } from '../../services/seguridad/authService';
import { rolService } from '../../services/seguridad/rolService';
import { useToast } from '../../hooks/useToast';
import Toast from '../../components/Toast/Toast';

const Register = () => {
  const navigate = useNavigate();
  const { toast, showSuccess, showError, hideToast } = useToast();

  const [formData, setFormData] = useState({
    // Persona
    Pnombre: '',
    Snombre: '',
    Papellido: '',
    Sapellido: '',
    Direccion: '',
    DNI: '',
    correo: '',
    fechaNacimiento: '',
    genero: 'M',
    // Usuario
    Nombre_Usuario: '',
    contraseña: '',
    confirmarContraseña: '',
    idrol: ''
  });

  const [loading, setLoading] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    const loadRoles = async () => {
      try {
        const rolesData = await rolService.obtenerRoles();
        console.log('Roles obtenidos:', rolesData); // Para debug
        setRoles(rolesData); // Mostrar todos los roles disponibles
      } catch (error) {
        console.error('Error al cargar roles:', error);
        showError('Error al cargar los roles');
      }
    };
    loadRoles();
  }, [showError]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    console.log('Datos del formulario antes del envío:', formData);

    // Validar longitud de contraseña
    if (formData.contraseña.length < 6) {
      showError('La contraseña debe tener al menos 6 caracteres');
      setLoading(false);
      return;
    }

    if (formData.contraseña !== formData.confirmarContraseña) {
      showError('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }

    if (!acceptedTerms) {
      showError('Debes aceptar la Política de Privacidad');
      setLoading(false);
      return;
    }
    
    if (!formData.idrol) {
      showError('Debes seleccionar un rol');
      setLoading(false);
      return;
    }

    try {
      console.log('Enviando registro con datos:', formData);
      await authService.register(formData);
      showSuccess('Usuario registrado exitosamente. Serás redirigido al login.');
      setTimeout(() => {
        navigate('/auth/login');
      }, 2000);
    } catch (error) {
      console.error('Error en Register.js:', error);
      showError(error.message || 'Error al registrar el usuario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toast show={toast.show} message={toast.message} type={toast.type} onClose={hideToast} />
      <Col lg="6" md="8">
        <Card className="bg-secondary shadow border-0">
          <CardHeader className="bg-transparent pb-5">
            <div className="text-muted text-center mt-2 mb-4">
              <small>Regístrate con tus datos</small>
            </div>
          </CardHeader>
          <CardBody className="px-lg-5 py-lg-5">
            <Form role="form" onSubmit={handleSubmit}>
              {/* Campos de Persona */}
              <Row>
                <Col md="6">
                  <FormGroup>
                    <InputGroup className="input-group-alternative mb-3">
                      <InputGroupAddon addonType="prepend"><InputGroupText><i className="ni ni-hat-3" /></InputGroupText></InputGroupAddon>
                      <Input placeholder="Primer Nombre" type="text" name="Pnombre" value={formData.Pnombre} onChange={handleChange} required />
                    </InputGroup>
                  </FormGroup>
                </Col>
                <Col md="6">
                  <FormGroup>
                    <InputGroup className="input-group-alternative mb-3">
                      <Input placeholder="Segundo Nombre" type="text" name="Snombre" value={formData.Snombre} onChange={handleChange} />
                    </InputGroup>
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col md="6">
                  <FormGroup>
                    <InputGroup className="input-group-alternative mb-3">
                      <Input placeholder="Primer Apellido" type="text" name="Papellido" value={formData.Papellido} onChange={handleChange} required />
                    </InputGroup>
                  </FormGroup>
                </Col>
                <Col md="6">
                  <FormGroup>
                    <InputGroup className="input-group-alternative mb-3">
                      <Input placeholder="Segundo Apellido" type="text" name="Sapellido" value={formData.Sapellido} onChange={handleChange} />
                    </InputGroup>
                  </FormGroup>
                </Col>
              </Row>
                <FormGroup>
                    <InputGroup className="input-group-alternative mb-3">
                        <InputGroupAddon addonType="prepend"><InputGroupText><i className="ni ni-credit-card" /></InputGroupText></InputGroupAddon>
                        <Input placeholder="DNI" type="text" name="DNI" value={formData.DNI} onChange={handleChange} required />
                    </InputGroup>
                </FormGroup>
              <FormGroup>
                <InputGroup className="input-group-alternative mb-3">
                  <InputGroupAddon addonType="prepend"><InputGroupText><i className="ni ni-email-83" /></InputGroupText></InputGroupAddon>
                  <Input placeholder="Correo Electrónico" type="email" name="correo" value={formData.correo} onChange={handleChange} required />
                </InputGroup>
              </FormGroup>
              <Row>
                <Col md="6">
                  <FormGroup>
                    <InputGroup className="input-group-alternative mb-3">
                      <InputGroupAddon addonType="prepend"><InputGroupText><i className="ni ni-calendar-grid-58" /></InputGroupText></InputGroupAddon>
                      <Input type="date" name="fechaNacimiento" value={formData.fechaNacimiento} onChange={handleChange} />
                    </InputGroup>
                  </FormGroup>
                </Col>
                <Col md="6">
                  <FormGroup>
                    <InputGroup className="input-group-alternative mb-3">
                      <InputGroupAddon addonType="prepend"><InputGroupText><i className="ni ni-world-2" /></InputGroupText></InputGroupAddon>
                      <Input type="select" name="genero" value={formData.genero} onChange={handleChange} required>
                        <option value="M">Masculino</option>
                        <option value="F">Femenino</option>
                      </Input>
                    </InputGroup>
                  </FormGroup>
                </Col>
              </Row>
              <FormGroup>
                <InputGroup className="input-group-alternative mb-3">
                  <InputGroupAddon addonType="prepend"><InputGroupText><i className="ni ni-pin-3" /></InputGroupText></InputGroupAddon>
                  <Input placeholder="Dirección (opcional)" type="text" name="Direccion" value={formData.Direccion} onChange={handleChange} />
                </InputGroup>
              </FormGroup>
              {/* Campos de Usuario */}
              <FormGroup>
                <InputGroup className="input-group-alternative mb-3">
                  <InputGroupAddon addonType="prepend"><InputGroupText><i className="ni ni-single-02" /></InputGroupText></InputGroupAddon>
                  <Input placeholder="Nombre de usuario" type="text" name="Nombre_Usuario" value={formData.Nombre_Usuario} onChange={handleChange} required />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend"><InputGroupText><i className="ni ni-lock-circle-open" /></InputGroupText></InputGroupAddon>
                  <Input placeholder="Contraseña (mínimo 6 caracteres)" type="password" name="contraseña" value={formData.contraseña} onChange={handleChange} required autoComplete="new-password" />
                </InputGroup>
                <div className="text-muted font-italic mt-1">
                  <small>
                    Fortaleza: {" "}
                    <span className={`font-weight-700 ${
                      formData.contraseña.length === 0 ? 'text-muted' :
                      formData.contraseña.length < 6 ? 'text-danger' :
                      formData.contraseña.length < 8 ? 'text-warning' :
                      'text-success'
                    }`}>
                      {
                        formData.contraseña.length === 0 ? 'Ingrese una contraseña' :
                        formData.contraseña.length < 6 ? 'Muy débil (mínimo 6 caracteres)' :
                        formData.contraseña.length < 8 ? 'Aceptable' :
                        'Fuerte'
                      }
                    </span>
                  </small>
                </div>
              </FormGroup>
              <FormGroup>
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend"><InputGroupText><i className="ni ni-lock-circle-open" /></InputGroupText></InputGroupAddon>
                  <Input placeholder="Confirmar Contraseña" type="password" name="confirmarContraseña" value={formData.confirmarContraseña} onChange={handleChange} required autoComplete="new-password" />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup className="input-group-alternative mb-3">
                  <InputGroupAddon addonType="prepend"><InputGroupText><i className="ni ni-badge" /></InputGroupText></InputGroupAddon>
                  <Input type="select" name="idrol" value={formData.idrol} onChange={handleChange} required>
                    <option value="">Seleccionar Rol</option>
                    {roles.map(rol => (
                      <option key={rol.idrol} value={rol.idrol}>{rol.nombre}</option>
                    ))}
                  </Input>
                </InputGroup>
              </FormGroup>
              <Row className="my-4">
                <Col xs="12">
                  <div className="custom-control custom-control-alternative custom-checkbox">
                    <input className="custom-control-input" id="customCheckRegister" type="checkbox" checked={acceptedTerms} onChange={(e) => setAcceptedTerms(e.target.checked)} required />
                    <label className="custom-control-label" htmlFor="customCheckRegister">
                      <span className="text-muted">Acepto la{" "}
                        <a href="#pablo" onClick={(e) => e.preventDefault()}>Política de Privacidad</a>
                      </span>
                    </label>
                  </div>
                </Col>
              </Row>
              <div className="text-center">
                <Button className="mt-4" color="primary" type="submit" disabled={loading}>
                  {loading ? 'Creando cuenta...' : 'Crear cuenta'}
                </Button>
              </div>
            </Form>
          </CardBody>
        </Card>
        <Row className="mt-3">
          <Col className="text-center">
            <a className="text-light" href="#pablo" onClick={(e) => navigate('/auth/login')}>
              <small>¿Ya tienes cuenta? Inicia sesión</small>
            </a>
          </Col>
        </Row>
      </Col>
    </>
  );
};

export default Register;
