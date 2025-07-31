import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Card, CardHeader, CardBody, Container, Row, Col, Form, FormGroup, Label, Input } from 'reactstrap';
import { personaService } from '../../services/seguridad/personaService';
import { useToast } from '../../hooks/useToast';
import Header from 'components/Headers/Header.js';
import Toast from 'components/Toast/Toast';

const PersonaForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast, showSuccess, showError, hideToast } = useToast();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    Pnombre: '',
    Snombre: '',
    Papellido: '',
    Sapellido: '',
    Direccion: '',
    DNI: '',
    correo: '',
    fechaNacimiento: '',
    genero: 'M'
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit) {
      const fetchPersona = async () => {
        try {
          const persona = await personaService.obtenerPersonaPorId(id);
          setFormData({
            ...persona,
            fechaNacimiento: persona.fechaNacimiento ? persona.fechaNacimiento.split('T')[0] : ''
          });
        } catch (error) {
          showError('Error al cargar la persona');
          navigate('/admin/personas');
        }
      };
      fetchPersona();
    }
  }, [id, isEdit, showError, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isEdit) {
        await personaService.actualizarPersona(id, formData);
        showSuccess('Persona actualizada exitosamente');
      } else {
        await personaService.crearPersona(formData);
        showSuccess('Persona creada exitosamente');
      }
      
      setTimeout(() => {
        navigate('/admin/personas');
      }, 1500);
    } catch (error) {
      showError(error.message || 'Error al guardar la persona');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <Container className="mt--7" fluid>
        <Toast show={toast.show} message={toast.message} type={toast.type} onClose={hideToast} />
        <Row>
          <Col xl="8">
            <Card className="shadow">
              <CardHeader className="border-0">
                <Row className="align-items-center">
                  <Col xs="8">
                    <h3 className="mb-0">{isEdit ? 'Editar Persona' : 'Nueva Persona'}</h3>
                  </Col>
                  <Col className="text-right" xs="4">
                    <Button color="secondary" onClick={() => navigate('/admin/personas')}>
                      Cancelar
                    </Button>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md="6">
                      <FormGroup>
                        <Label className="form-control-label">Primer Nombre *</Label>
                        <Input
                          type="text"
                          name="Pnombre"
                          value={formData.Pnombre}
                          onChange={handleChange}
                          required
                          placeholder="Ingrese el primer nombre"
                        />
                      </FormGroup>
                    </Col>
                    <Col md="6">
                      <FormGroup>
                        <Label className="form-control-label">Segundo Nombre</Label>
                        <Input
                          type="text"
                          name="Snombre"
                          value={formData.Snombre}
                          onChange={handleChange}
                          placeholder="Ingrese el segundo nombre"
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  
                  <Row>
                    <Col md="6">
                      <FormGroup>
                        <Label className="form-control-label">Primer Apellido</Label>
                        <Input
                          type="text"
                          name="Papellido"
                          value={formData.Papellido}
                          onChange={handleChange}
                          placeholder="Ingrese el primer apellido"
                        />
                      </FormGroup>
                    </Col>
                    <Col md="6">
                      <FormGroup>
                        <Label className="form-control-label">Segundo Apellido</Label>
                        <Input
                          type="text"
                          name="Sapellido"
                          value={formData.Sapellido}
                          onChange={handleChange}
                          placeholder="Ingrese el segundo apellido"
                        />
                      </FormGroup>
                    </Col>
                  </Row>

                  <Row>
                    <Col md="6">
                      <FormGroup>
                        <Label className="form-control-label">DNI</Label>
                        <Input
                          type="text"
                          name="DNI"
                          value={formData.DNI}
                          onChange={handleChange}
                          placeholder="Ingrese el DNI"
                        />
                      </FormGroup>
                    </Col>
                    <Col md="6">
                      <FormGroup>
                        <Label className="form-control-label">Correo Electrónico</Label>
                        <Input
                          type="email"
                          name="correo"
                          value={formData.correo}
                          onChange={handleChange}
                          placeholder="Ingrese el correo electrónico"
                        />
                      </FormGroup>
                    </Col>
                  </Row>

                  <Row>
                    <Col md="12">
                      <FormGroup>
                        <Label className="form-control-label">Dirección</Label>
                        <Input
                          type="text"
                          name="Direccion"
                          value={formData.Direccion}
                          onChange={handleChange}
                          placeholder="Ingrese la dirección"
                        />
                      </FormGroup>
                    </Col>
                  </Row>

                  <Row>
                    <Col md="6">
                      <FormGroup>
                        <Label className="form-control-label">Fecha de Nacimiento</Label>
                        <Input
                          type="date"
                          name="fechaNacimiento"
                          value={formData.fechaNacimiento}
                          onChange={handleChange}
                        />
                      </FormGroup>
                    </Col>
                    <Col md="6">
                      <FormGroup>
                        <Label className="form-control-label">Género</Label>
                        <Input
                          type="select"
                          name="genero"
                          value={formData.genero}
                          onChange={handleChange}
                        >
                          <option value="M">Masculino</option>
                          <option value="F">Femenino</option>
                        </Input>
                      </FormGroup>
                    </Col>
                  </Row>

                  <div className="text-center">
                    <Button color="primary" type="submit" disabled={loading}>
                      {loading ? 'Guardando...' : (isEdit ? 'Actualizar' : 'Crear')}
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

export default PersonaForm;
