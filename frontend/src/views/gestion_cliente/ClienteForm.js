import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Card, CardHeader, CardBody, Container, Row, Col, Form, FormGroup, Label, Input } from 'reactstrap';
import { clienteService } from '../../services/gestion_cliente/clienteService';
import { personaService } from '../../services/seguridad/personaService';
import { useToast } from '../../hooks/useToast';
import Header from 'components/Headers/Header.js';
import Toast from 'components/Toast/Toast';

const ClienteForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast, showSuccess, showError, hideToast } = useToast();
  const [cliente, setCliente] = useState({ idPersona: '', fechaRegistro: new Date().toISOString().slice(0, 10) });
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
      const fetchCliente = async () => {
        try {
          const data = await clienteService.obtenerClientePorId(id);
          setCliente(data);
        } catch (error) {
          showError('Error al cargar el cliente');
        }
      };
      fetchCliente();
    }
  }, [id, showError]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCliente(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (id) {
        await clienteService.editarCliente(id, cliente);
        showSuccess('Cliente actualizado exitosamente');
      } else {
        await clienteService.crearCliente(cliente);
        showSuccess('Cliente creado exitosamente');
      }
      setTimeout(() => navigate('/admin/clientes'), 1000);
    } catch (error) {
      showError('Error al guardar el cliente');
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
                <h3>{id ? 'Editar Cliente' : 'Nuevo Cliente'}</h3>
              </CardHeader>
              <CardBody>
                <Form onSubmit={handleSubmit}>
                  <FormGroup>
                    <Label for="idPersona">Persona</Label>
                    <Input type="select" name="idPersona" id="idPersona" value={cliente.idPersona} onChange={handleChange} required>
                      <option value="">Seleccione una persona</option>
                      {personas.map(p => (
                        <option key={p.idPersona} value={p.idPersona}>{p.Pnombre} {p.Papellido}</option>
                      ))}
                    </Input>
                  </FormGroup>
                  <FormGroup>
                    <Label for="fechaRegistro">Fecha de Registro</Label>
                    <Input type="date" name="fechaRegistro" id="fechaRegistro" value={cliente.fechaRegistro} onChange={handleChange} required />
                  </FormGroup>
                  <Button type="submit" color="primary" disabled={loading}>
                    {loading ? 'Guardando...' : 'Guardar'}
                  </Button>
                  <Button color="secondary" onClick={() => navigate('/admin/clientes')} disabled={loading}>Cancelar</Button>
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
