import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, CardHeader, CardBody, Container, Row, Col, Table, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { personaService } from '../../services/seguridad/personaService';
import { useToast } from '../../hooks/useToast';
import Header from 'components/Headers/Header.js';
import Toast from 'components/Toast/Toast';

const Personas = () => {
  const [personas, setPersonas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState({});
  const navigate = useNavigate();
  const { toast, showSuccess, showError, hideToast } = useToast();

  useEffect(() => {
    const fetchPersonas = async () => {
      try {
        const data = await personaService.obtenerPersonas();
        setPersonas(data);
      } catch (error) {
        showError('Error al cargar las personas');
      } finally {
        setLoading(false);
      }
    };
    fetchPersonas();
  }, [showError]);

  const toggleDropdown = (id) => {
    setDropdownOpen(prevState => ({ ...prevState, [id]: !prevState[id] }));
  };

  const handleEdit = (id) => {
    navigate(`/admin/personas/editar/${id}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta persona?')) {
      try {
        await personaService.eliminarPersona(id);
        setPersonas(personas.filter(p => p.idPersona !== id));
        showSuccess('Persona eliminada exitosamente');
      } catch (error) {
        showError('Error al eliminar la persona');
      }
    }
  };

  return (
    <>
      <Header />
      <Container className="mt--7" fluid>
        <Toast show={toast.show} message={toast.message} type={toast.type} onClose={hideToast} />
        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader className="border-0">
                <Row className="align-items-center">
                  <Col xs="8">
                    <h3 className="mb-0">Gestión de Personas</h3>
                  </Col>
                  <Col className="text-right" xs="4">
                    <Button color="primary" onClick={() => navigate('/admin/personas/nueva')}>
                      Nueva Persona
                    </Button>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                <Table className="align-items-center table-flush" responsive>
                  <thead className="thead-light">
                    <tr>
                      <th scope="col">ID</th>
                      <th scope="col">Nombre Completo</th>
                      <th scope="col">DNI</th>
                      <th scope="col">Correo</th>
                      <th scope="col">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {personas.map(persona => (
                      <tr key={persona.idPersona}>
                        <td>{persona.idPersona}</td>
                        <td>{`${persona.Pnombre} ${persona.Snombre || ''} ${persona.Papellido || ''} ${persona.Sapellido || ''}`}</td>
                        <td>{persona.DNI}</td>
                        <td>{persona.correo}</td>
                        <td>
                          <Dropdown isOpen={dropdownOpen[persona.idPersona]} toggle={() => toggleDropdown(persona.idPersona)}>
                            <DropdownToggle>
                              <i className="fas fa-ellipsis-v" />
                            </DropdownToggle>
                            <DropdownMenu>
                              <DropdownItem onClick={() => handleEdit(persona.idPersona)}>Editar</DropdownItem>
                              <DropdownItem onClick={() => handleDelete(persona.idPersona)}>Eliminar</DropdownItem>
                            </DropdownMenu>
                          </Dropdown>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </div>
        </Row>
      </Container>
    </>
  );
};

export default Personas;
