import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Card, CardHeader, CardBody, Container, Row, Col, Form, FormGroup, Label, Input } from 'reactstrap';
import { categoriaProductoService } from '../../services/productos/categoriaProductoService';
import { useToast } from '../../hooks/useToast';
import Header from 'components/Headers/Header.js';
import Toast from 'components/Toast/Toast';

const CategoriaForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast, showSuccess, showError, hideToast } = useToast();
  const [categoria, setCategoria] = useState({ Nombre: '', descripcion: '', marca: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      const fetchCategoria = async () => {
        try {
          const data = await categoriaProductoService.obtenerCategoriaPorId(id);
          setCategoria(data);
        } catch (error) {
          showError('Error al cargar la categoría');
        }
      };
      fetchCategoria();
    }
  }, [id, showError]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCategoria(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (id) {
        await categoriaProductoService.actualizarCategoria(id, categoria);
        showSuccess('Categoría actualizada exitosamente');
      } else {
        await categoriaProductoService.crearCategoria(categoria);
        showSuccess('Categoría creada exitosamente');
      }
      setTimeout(() => navigate('/admin/categorias'), 1000);
    } catch (error) {
      showError('Error al guardar la categoría');
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
                <h3>{id ? 'Editar Categoría' : 'Nueva Categoría'}</h3>
              </CardHeader>
              <CardBody>
                <Form onSubmit={handleSubmit}>
                  <FormGroup>
                    <Label for="Nombre">Nombre</Label>
                    <Input type="text" name="Nombre" id="Nombre" value={categoria.Nombre} onChange={handleChange} required />
                  </FormGroup>
                  <FormGroup>
                    <Label for="descripcion">Descripción</Label>
                    <Input type="textarea" name="descripcion" id="descripcion" value={categoria.descripcion} onChange={handleChange} />
                  </FormGroup>
                  <FormGroup>
                    <Label for="marca">Marca</Label>
                    <Input type="text" name="marca" id="marca" value={categoria.marca} onChange={handleChange} />
                  </FormGroup>
                  <Button type="submit" color="primary" disabled={loading}>
                    {loading ? 'Guardando...' : 'Guardar'}
                  </Button>
                  <Button color="secondary" onClick={() => navigate('/admin/categorias')} disabled={loading}>Cancelar</Button>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default CategoriaForm;
