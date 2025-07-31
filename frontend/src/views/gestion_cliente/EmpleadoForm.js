import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Card, CardHeader, CardBody, Container, Row, Col, Form, FormGroup, Label, Input } from 'reactstrap';
import { empleadoService } from '../../services/gestion_cliente/empleadoService';
import { personaService } from '../../services/seguridad/personaService';
import { useToast } from '../../hooks/useToast';
import Header from 'components/Headers/Header.js';
import Toast from 'components/Toast/Toast';

const EmpleadoForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast, showSuccess, showError, hideToast } = useToast();
  const [empleado, setEmpleado] = useState({ idPersona: '', Fecha_Registro: new Date().toISOString().slice(0, 10) });
  const [personas, setPersonas] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPersonas = async () => {
      try {
        const data = await personaService.obtenerPersonas();
        setPersonas(data);
      } catch (error) {
        showError('Error al cargar las personas');
      }
    };

    fetchPersonas();

    if (id) {
      const fetchEmpleado = async () => {
        try {
          const data = await empleadoService.obtenerEmpleadoPorId(id);
          setEmpleado(data);
        } catch (error) {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (id) {
        await empleadoService.editarEmpleado(id, empleado);
        showSuccess('Empleado actualizado exitosamente');
      } else {
        await empleadoService.crearEmpleado(empleado);
        showSuccess('Empleado creado exitosamente');
      }
      setTimeout(() => navigate('/admin/empleados'), 1000);
    } catch (error) {
      showError('Error al guardar el empleado');
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
          <Col>
            <Card className="shadow">
              <CardHeader>
                <h3>{id ? 'Editar Empleado' : 'Nuevo Empleado'}</h3>
              </CardHeader>
              <CardBody>
                <Form onSubmit={handleSubmit}>
                  <FormGroup>
                    <Label for="idPersona">Persona</Label>
                    <Input type="select" name="idPersona" id="idPersona" value={empleado.idPersona} onChange={handleChange} required>
                      <option value="">Seleccione una persona</option>
                      {personas.map(p => (
                        <option key={p.idPersona} value={p.idPersona}>{p.Pnombre} {p.Papellido}</option>
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
