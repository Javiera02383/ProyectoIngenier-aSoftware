import React, { useState } from 'react';
import { useToast } from '../../hooks/useToast';
import Toast from '../../components/Toast/Toast';
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
  Col
} from "reactstrap";
import { useAuth } from '../../contexts/AuthContext';
import { authService } from '../../services/seguridad/authService';

const Login = () => {
  const [formData, setFormData] = useState({
    Nombre_Usuario: '',
    contraseña: ''
  });
  const [pinData, setPinData] = useState({
    Nombre_Usuario: '',
    pin: ''
  });
  const [showPinForm, setShowPinForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login, verifyPin } = useAuth();
  const { toast, showSuccess, showError, hideToast } = useToast();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePinChange = (e) => {
    setPinData({
      ...pinData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await login(formData);

      if (response.requiere_2fa) {
        setPinData({
          Nombre_Usuario: formData.Nombre_Usuario,
          pin: ''
        });
        setShowPinForm(true);
        showSuccess(response.mensaje || 'PIN de verificación enviado');
      } else {
        showSuccess('Inicio de sesión exitoso. Bienvenido!');
        setTimeout(() => {
          navigate('/admin/index');
        }, 1000);
      }
    } catch (error) {
      showError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePinSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await verifyPin(pinData);
      showSuccess('Verificación exitosa. Bienvenido!');

      setTimeout(() => {
        navigate('/admin/index');
      }, 1000);
    } catch (error) {
      showError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    setShowPinForm(false);
    setFormData({ Nombre_Usuario: '', contraseña: '' });
    setPinData({ Nombre_Usuario: '', pin: '' });
  };

  return (
    <>
      <Toast
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={hideToast}
      />
      <Col lg="5" md="7">
        <Card className="bg-secondary shadow border-0">
          <CardHeader className="bg-transparent pb-5">
            <div className="text-muted text-center mt-2 mb-3">
              <small>Inicia sesión con</small>
            </div>
            <div className="btn-wrapper text-center">
              <Button
                className="btn-neutral btn-icon"
                color="default"
                href="#pablo"
                onClick={(e) => e.preventDefault()}
              >
                <span className="btn-inner--icon">
                  <img
                    alt="..."
                    src={require("../../assets/img/icons/common/github.svg").default}
                  />
                </span>
                <span className="btn-inner--text">Github</span>
              </Button>
              <Button
                className="btn-neutral btn-icon"
                color="default"
                href="#pablo"
                onClick={(e) => e.preventDefault()}
              >
                <span className="btn-inner--icon">
                  <img
                    alt="..."
                    src={require("../../assets/img/icons/common/google.svg").default}
                  />
                </span>
                <span className="btn-inner--text">Google</span>
              </Button>
            </div>
          </CardHeader>
          <CardBody className="px-lg-5 py-lg-5">
            {showPinForm ? (
              <>
                <div className="text-center text-muted mb-4">
                  <small>Ingrese el PIN de verificación</small>
                </div>
                <Form role="form" onSubmit={handlePinSubmit}>
                  <FormGroup className="mb-3">
                    <InputGroup className="input-group-alternative">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="ni ni-key-25" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        placeholder="PIN"
                        type="text"
                        name="pin"
                        value={pinData.pin}
                        onChange={handlePinChange}
                        required
                      />
                    </InputGroup>
                  </FormGroup>
                  <div className="text-center">
                    <Button className="my-4" color="primary" type="submit" disabled={loading}>
                      {loading ? 'Verificando...' : 'Verificar PIN'}
                    </Button>
                  </div>
                  <div className="text-center">
                    <a href="#" className="text-light" onClick={handleBackToLogin}>
                      <small>Volver al inicio de sesión</small>
                    </a>
                  </div>
                </Form>
              </>
            ) : (
              <>
                <div className="text-center text-muted mb-4">
                  <small>O inicia sesión con tus credenciales</small>
                </div>
                <Form role="form" onSubmit={handleSubmit}>
                  <FormGroup className="mb-3">
                    <InputGroup className="input-group-alternative">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="ni ni-single-02" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        placeholder="Nombre de usuario"
                        type="text"
                        name="Nombre_Usuario"
                        value={formData.Nombre_Usuario}
                        onChange={handleChange}
                        autoComplete="username"
                        required
                      />
                    </InputGroup>
                  </FormGroup>
                  <FormGroup>
                    <InputGroup className="input-group-alternative">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="ni ni-lock-circle-open" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        placeholder="Contraseña"
                        type="password"
                        name="contraseña"
                        value={formData.contraseña}
                        onChange={handleChange}
                        autoComplete="current-password"
                        required
                      />
                    </InputGroup>
                  </FormGroup>
                  <div className="custom-control custom-control-alternative custom-checkbox">
                    <input
                      className="custom-control-input"
                      id="customCheckLogin"
                      type="checkbox"
                    />
                    <label
                      className="custom-control-label"
                      htmlFor="customCheckLogin"
                    >
                      <span className="text-muted">Recordarme</span>
                    </label>
                  </div>
                  <div className="text-center">
                    <Button
                      className="my-4"
                      color="primary"
                      type="submit"
                      disabled={loading}
                    >
                      {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
                    </Button>
                  </div>
                </Form>
              </>
            )}
          </CardBody>
        </Card>
        <Row className="mt-3">
          <Col xs="6">
            <a
              className="text-light"
              href="#pablo"
              onClick={(e) => e.preventDefault()}
            >
              <small>¿Olvidaste tu contraseña?</small>
            </a>
          </Col>
          <Col className="text-right" xs="6">
            <a
              className="text-light"
              href="#pablo"
              onClick={(e) => navigate('/auth/register')}
            >
              <small>Crear una cuenta</small>
            </a>
          </Col>
        </Row>
      </Col>
    </>
  );
};

export default Login;
