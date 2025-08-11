import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Badge,
  Card,
  CardHeader,
  DropdownMenu,
  DropdownItem,
  Dropdown,  
  DropdownToggle,
  Media,
  Table,
  Container,
  Row,
  FormGroup,
  Input,
  Label,
  Col,
  Spinner,
  Button,
  Alert
} from 'reactstrap';
import { clienteService } from '../../services/gestion_cliente/clienteService';
import { useToast } from '../../hooks/useToast';
import HeaderBlanco from "components/Headers/HeaderBlanco.js";
import { FaPlus, FaSearch, FaEdit, FaTrash, FaEye, FaEllipsisV, FaUser, FaBuilding, FaCalendarAlt, FaIdCard, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

const Clientes = () => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('nombre');
  const [tipoPersona, setTipoPersona] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState({});

  useEffect(() => {
    cargarClientes();
  }, []);

  const cargarClientes = async () => {
    try {
      setLoading(true);
      const data = await clienteService.obtenerTodosLosClientes();
      setClientes(data);
    } catch (error) {
      console.error('Error al cargar clientes:', error);
      showError('Error al cargar la lista de clientes');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim() && !tipoPersona) {
      await cargarClientes();
      return;
    }

    try {
      setLoading(true);
      let filtros = {};
      
      if (searchTerm.trim()) {
        if (searchType === 'nombre') {
          filtros.Pnombre = searchTerm;
        } else if (searchType === 'apellido') {
          filtros.Papellido = searchTerm;
        } else if (searchType === 'razonSocial') {
          filtros.razonSocial = searchTerm;
        } else if (searchType === 'nombreComercial') {
          filtros.nombreComercial = searchTerm;
        }
      }
      
      if (tipoPersona) {
        filtros.tipoPersona = tipoPersona;
      }
      
      const data = await clienteService.obtenerClientes(filtros);
      setClientes(data || []);
    } catch (error) {
      console.error('Error en la búsqueda:', error);
      showError('Error al realizar la búsqueda');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Está seguro de que desea eliminar este cliente?')) {
      return;
    }

    try {
      setDeleteLoading(id);
      await clienteService.eliminarCliente(id);
      showSuccess('Cliente eliminado exitosamente');
      await cargarClientes(); // Recargar la lista
    } catch (error) {
      console.error('Error al eliminar cliente:', error);
      const errorMessage = error.response?.data?.message || 'Error al eliminar el cliente';
      showError(errorMessage);
    } finally {
      setDeleteLoading(null);
    }
  };

  const obtenerNombreCompleto = (persona) => {
    if (!persona) return '';
    
    if (persona.tipoPersona === 'comercial') {
      return persona.razonSocial || persona.nombreComercial || 'Empresa sin nombre';
    }
    
    const nombres = [persona.Pnombre, persona.Snombre].filter(Boolean).join(' ');
    const apellidos = [persona.Papellido, persona.Sapellido].filter(Boolean).join(' ');
    return `${nombres} ${apellidos}`.trim();
  };

  const obtenerIdentificacion = (persona) => {
    if (!persona) return 'No registrada';
    
    if (persona.tipoPersona === 'comercial') {
      return persona.rtn ? (
        <Badge color="info">{persona.rtn}</Badge>
      ) : (
        <span className="text-muted">RTN no registrado</span>
      );
    }
    
    return persona.DNI ? (
      <Badge color="info">{persona.DNI}</Badge>
    ) : (
      <span className="text-muted">DNI no registrado</span>
    );
  };

  const obtenerTipoPersona = (persona) => {
    if (!persona) return null;
    
    if (persona.tipoPersona === 'comercial') {
      return (
        <Badge color="warning">
          <FaBuilding className="me-1" />
          Empresa
        </Badge>
      );
    }
    
    return (
      <Badge color="primary">
        <FaUser className="me-1" />
        Natural
      </Badge>
    );
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return 'No registrada';
    return new Date(fecha).toLocaleDateString('es-ES');
  };

  const obtenerGeneroTexto = (genero) => {
    switch (genero) {
      case 'M': return 'Masculino';
      case 'F': return 'Femenino';
      case 'O': return 'Otro';
      default: return 'No especificado';
    }
  };

  const toggleDropdown = (id) => {
    setDropdownOpen(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const limpiarFiltros = () => {
    setSearchTerm('');
    setTipoPersona('');
    setSearchType('nombre');
    cargarClientes();
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <Spinner color="primary" size="lg" />
      </div>
    );
  }

  return (
    <>
      <HeaderBlanco />
      <Container className="mt--7" fluid>
        <Row className="mb-4">
          <Col md="3">
            <FormGroup>
              <Label>Tipo de Persona:</Label>
              <Input
                type="select"
                value={tipoPersona}
                onChange={(e) => setTipoPersona(e.target.value)}
                className="form-control-alternative"
              >
                <option value="">Todos los tipos</option>
                <option value="natural">Personas Naturales</option>
                <option value="comercial">Personas Comerciales</option>
              </Input>
            </FormGroup>
          </Col>
          <Col md="3">
            <FormGroup>
              <Label>Filtrar por:</Label>
              <Input
                type="select"
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
                className="form-control-alternative"
              >
                <option value="nombre">Por Nombre</option>
                <option value="apellido">Por Apellido</option>
                <option value="razonSocial">Por Razón Social</option>
                <option value="nombreComercial">Por Nombre Comercial</option>
              </Input>
            </FormGroup>
          </Col>
          <Col md="3">
            <FormGroup>
              <Label>Buscar clientes:</Label>
              <Input
                type="text"
                placeholder="Buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="form-control-alternative"
              />
            </FormGroup>
          </Col>
          <Col md="1">
            <FormGroup>
              <Label>&nbsp;</Label>
              <Button
                color="primary"
                size="sm"
                onClick={handleSearch}
                disabled={!searchTerm.trim() && !tipoPersona}
                className="form-control-alternative"
                style={{ height: '38px' }}
              >
                <FaSearch />
              </Button>
            </FormGroup>
          </Col>
          <Col md="2">
            <FormGroup>
              <Label>Resultados:</Label>
              <div className="form-control-plaintext">
                <Badge color="default">
                  {clientes.length} clientes encontrados
                </Badge>
              </div>
            </FormGroup>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col md="12" className="text-right">
            <Button
              color="outline-secondary"
              size="sm"
              onClick={limpiarFiltros}
              disabled={!searchTerm.trim() && !tipoPersona}
            >
              <FaSearch className="me-1" />
              Limpiar Filtros
            </Button>
            <Button
              color="primary"
              size="sm"
              className="ml-2"
              onClick={() => navigate('/admin/clientes/nuevo')}
            >
              <FaPlus className="me-1" />
              Nuevo Cliente
            </Button>
          </Col>
        </Row>

        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader className="border-0">
                <h3 className="mb-0">Gestión de Clientes</h3>
              </CardHeader>
                <Table className="align-items-center table-flush" responsive>
                  <thead className="thead-light">
                    <tr>
                    <th>ACCIONES</th>
                    <th>TIPO</th>
                    <th>CLIENTE</th>
                    
                    <th>CORREO</th>
                    <th>DIRECCIÓN</th>
                    <th>FECHA REGISTRO</th>
                    <th>RTN</th>
                    
                    </tr>
                  </thead>
                  <tbody>
                  {loading ? (
                    <tr><td colSpan="8" className="text-center"><Spinner /> Cargando...</td></tr>
                  ) : clientes.length > 0 ? (
                    clientes.map((cliente) => (
                      <tr key={cliente.idCliente}>
                        <td className="text-right">
                          <Dropdown isOpen={dropdownOpen[cliente.idCliente] || false} toggle={() => toggleDropdown(cliente.idCliente)}>
                            <DropdownToggle className="btn-icon-only text-light" size="sm">
                              <i className="fas fa-ellipsis-v" />
                            </DropdownToggle>
                            <DropdownMenu className="dropdown-menu-arrow" right>
                              <DropdownItem onClick={() => navigate(`/admin/clientes/editar/${cliente.idCliente}`)}>
                                <FaEdit className="me-2" />
                            Editar
                              </DropdownItem>
                              <DropdownItem onClick={() => handleDelete(cliente.idCliente)}>
                                <FaTrash className="me-2" />
                            Eliminar
                              </DropdownItem>
                            </DropdownMenu>
                          </Dropdown>
                        </td>
                        <td>
                          {obtenerTipoPersona(cliente.persona)}
                        </td>
                        <td>
                          <div>
                            <strong>{obtenerNombreCompleto(cliente.persona)}</strong>
                            {cliente.persona?.tipoPersona === 'natural' && cliente.persona?.Snombre && (
                              <div className="text-muted small">
                                {cliente.persona.Snombre} {cliente.persona.Sapellido}
                              </div>
                            )}
                            {cliente.persona?.tipoPersona === 'comercial' && cliente.persona?.nombreComercial && (
                              <div className="text-muted small">
                                {cliente.persona.nombreComercial}
                              </div>
                            )}
                          </div>
                        </td>
                        
                        <td>
                          {cliente.persona?.correo ? (
                            <a href={`mailto:${cliente.persona.correo}`} className="text-decoration-none">
                              {cliente.persona.correo}
                            </a>
                          ) : (
                            <span className="text-muted">No registrado</span>
                          )}
                        </td>
                        <td>
                          {cliente.persona?.Direccion ? (
                            <span title={cliente.persona.Direccion}>
                              {cliente.persona.Direccion.length > 30 
                                ? `${cliente.persona.Direccion.substring(0, 30)}...` 
                                : cliente.persona.Direccion
                              }
                            </span>
                          ) : (
                            <span className="text-muted">No registrada</span>
                          )}
                        </td>
                        <td>
                          <Badge color="success">
                            {formatearFecha(cliente.fechaRegistro)}
                          </Badge>
                        </td>
                        <td>
                          {cliente.persona?.tipoPersona === 'natural' ? (
                            <div className="small">
                              <div>
                                <strong>Género:</strong> {obtenerGeneroTexto(cliente.persona?.genero)}
                              </div>
                              {cliente.persona?.fechaNacimiento && (
                                <div>
                                  <strong>Nacimiento:</strong> {formatearFecha(cliente.persona.fechaNacimiento)}
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="small">
                              {cliente.persona?.rtn && (
                                <div>
                                  <strong>RTN:</strong> {cliente.persona.rtn}
                                </div>
                              )}
                            </div>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="text-center">
                        {searchTerm || tipoPersona ? 'No se encontraron clientes con los filtros especificados.' : 'No hay clientes registrados.'}
                        </td>
                      </tr>
                  )}
                  </tbody>
                </Table>
            </Card>
          </div>
        </Row>
      </Container>
    </>
  );
};

export default Clientes;
