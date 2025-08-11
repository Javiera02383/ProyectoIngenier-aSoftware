import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, CardHeader, CardBody, Container, Row, Col, Table, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { empleadoService } from '../../services/gestion_cliente/empleadoService';
import { useToast } from '../../hooks/useToast';
import HeaderBlanco from 'components/Headers/HeaderBlanco.js';
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
        setLoading(true);
        const data = await empleadoService.obtenerTodosLosEmpleados();  
        console.log('📋 Empleados cargados:', data);
        setEmpleados(data);  
      } catch (error) {  
        console.error('❌ Error al cargar empleados:', error);
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
      <HeaderBlanco />
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
                {loading ? (
                  <div className="text-center py-4">
                    <div className="spinner-border text-primary" role="status">
                      <span className="sr-only">Cargando...</span>
                    </div>
                    <p className="mt-2">Cargando empleados...</p>
                  </div>
                ) : empleados.length === 0 ? (
                  <div className="text-center py-4">
                    <p className="text-muted">No hay empleados registrados</p>
                    <Button color="primary" onClick={() => navigate('/admin/empleados/nuevo')}>
                      Crear Primer Empleado
                    </Button>
                  </div>
                ) : (
                  <Table className="align-items-center table-flush" responsive>
                  <thead className="thead-light">
                    <tr>
                      <th scope="col">ID</th>
                      <th scope="col">Nombre Completo</th>
                      <th scope="col">Tipo Persona</th>
                      <th scope="col">Rol</th>
                      <th scope="col">Fecha de Registro</th>
                      <th scope="col">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {empleados.map(empleado => (
                      <tr key={empleado.idEmpleado}>
                        <td>{empleado.idEmpleado}</td>
                        <td>
                          {empleado.persona ? (
                            empleado.persona.tipoPersona === 'comercial' ? 
                              (empleado.persona.razonSocial || empleado.persona.nombreComercial || 'Empresa') :
                              `${empleado.persona.Pnombre || ''} ${empleado.persona.Papellido || ''}`.trim()
                          ) : 'Sin datos de persona'}
                        </td>
                        <td>
                          {empleado.persona?.tipoPersona === 'comercial' ? 'Comercial' : 'Natural'}
                        </td>
                        <td>
                          {empleado.rol?.nombre || 'Sin rol asignado'}
                        </td>
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
                )}
              </CardBody>
            </Card>
          </div>
        </Row>
      </Container>
    </>
  );
};

export default Empleados;
