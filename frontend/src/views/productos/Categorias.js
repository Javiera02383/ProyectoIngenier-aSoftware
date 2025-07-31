import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, CardHeader, CardBody, Container, Row, Col, Table, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { categoriaProductoService } from '../../services/productos/categoriaProductoService';
import { useToast } from '../../hooks/useToast';
import Header from 'components/Headers/Header.js';
import Toast from 'components/Toast/Toast';

const Categorias = () => {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState({});
  const navigate = useNavigate();
  const { toast, showSuccess, showError, hideToast } = useToast();

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const data = await categoriaProductoService.obtenerCategorias();
        setCategorias(data);
      } catch (error) {
        showError('Error al cargar las categorías');
      } finally {
        setLoading(false);
      }
    };
    fetchCategorias();
  }, [showError]);

  const toggleDropdown = (id) => {
    setDropdownOpen(prevState => ({ ...prevState, [id]: !prevState[id] }));
  };

  const handleEdit = (id) => {
    navigate(`/admin/categorias/editar/${id}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta categoría?')) {
      try {
        await categoriaProductoService.eliminarCategoria(id);
        setCategorias(categorias.filter(c => c.idCategoriaProducto !== id));
        showSuccess('Categoría eliminada exitosamente');
      } catch (error) {
        showError('Error al eliminar la categoría');
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
                    <h3 className="mb-0">Gestión de Categorías</h3>
                  </Col>
                  <Col className="text-right" xs="4">
                    <Button color="primary" onClick={() => navigate('/admin/categorias/nueva')}>
                      Nueva Categoría
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
                      <th scope="col">Descripción</th>
                      <th scope="col">Marca</th>
                      <th scope="col">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categorias.map(categoria => (
                      <tr key={categoria.idCategoriaProducto}>
                        <td>{categoria.idCategoriaProducto}</td>
                        <td>{categoria.Nombre}</td>
                        <td>{categoria.descripcion}</td>
                        <td>{categoria.marca}</td>
                        <td>
                          <Dropdown isOpen={dropdownOpen[categoria.idCategoriaProducto]} toggle={() => toggleDropdown(categoria.idCategoriaProducto)}>
                            <DropdownToggle>
                              <i className="fas fa-ellipsis-v" />
                            </DropdownToggle>
                            <DropdownMenu>
                              <DropdownItem onClick={() => handleEdit(categoria.idCategoriaProducto)}>Editar</DropdownItem>
                              <DropdownItem onClick={() => handleDelete(categoria.idCategoriaProducto)}>Eliminar</DropdownItem>
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

export default Categorias;
