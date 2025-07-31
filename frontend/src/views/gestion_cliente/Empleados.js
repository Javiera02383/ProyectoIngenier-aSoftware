import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, CardHeader, CardBody, Container, Row, Col, Table, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { empleadoService } from '../../services/gestion_cliente/empleadoService';
import { useToast } from '../../hooks/useToast';
import Header from 'components/Headers/Header.js';
import Toast from 'components/Toast/Toast';

const Empleados = () => {
  const [empleados, setEmpleados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState({});
  const navigate = useNavigate();
  const { toast, showSuccess, showError, hideToast } = useToast();

  useEffect(() => {
    const fetchEmpleados = async () => {
      try {
        const data = await empleadoService.obtenerEmpleados();
        setEmpleados(data);
      } catch (error) {
        showError('Error al cargar los empleados');
      } finally {
        setLoading(false);
      }
    };
    fetchEmpleados();
  }, [showError]);

  const toggleDropdown = (id) => {
    setDropdownOpen(prevState => ({ ...prevState, [id]: !prevState[id] }));
  };

  const handleEdit = (id) => {
    navigate(`/admin/empleados/editar/${id}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este empleado?')) {
      try {
        await empleadoService.eliminarEmpleado(id);
        setEmpleados(empleados.filter(e => e.idEmpleado !== id));
        showSuccess('Empleado eliminado exitosamente');
      } catch (error) {
        showError('Error al eliminar el empleado');
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
                    <h3 className="mb-0">Gestión de Empleados</h3>
                  </Col>
                  <Col className="text-right" xs="4">
                    <Button color="primary" onClick={() => navigate('/admin/empleados/nuevo')}>
                      Nuevo Empleado
                    </Button>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                <Table className="align-items-center table-flush" responsive>
                  <thead className="thead-light">
                    <tr>
                      <th scope="col">ID</th>
                      <th scope="col">Nombre</th>
                      <th scope="col">Fecha de Registro</th>
                      <th scope="col">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {empleados.map(empleado => (
                      <tr key={empleado.idEmpleado}>
                        <td>{empleado.idEmpleado}</td>
                        <td>{empleado.persona?.Pnombre} {empleado.persona?.Papellido}</td>
                        <td>{new Date(empleado.Fecha_Registro).toLocaleDateString()}</td>
                        <td>
                          <Dropdown isOpen={dropdownOpen[empleado.idEmpleado]} toggle={() => toggleDropdown(empleado.idEmpleado)}>
                            <DropdownToggle>
                              <i className="fas fa-ellipsis-v" />
                            </DropdownToggle>
                            <DropdownMenu>
                              <DropdownItem onClick={() => handleEdit(empleado.idEmpleado)}>Editar</DropdownItem>
                              <DropdownItem onClick={() => handleDelete(empleado.idEmpleado)}>Eliminar</DropdownItem>
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

export default Empleados;
