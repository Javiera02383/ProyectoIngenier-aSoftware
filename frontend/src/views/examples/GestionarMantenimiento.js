import React, { useState, useEffect, useMemo } from 'react';    
import { useNavigate } from 'react-router-dom';    
import {     
  Card, CardHeader, CardBody, Container, Row, Col, Button,     
  Form, FormGroup, Input, Label, Table, Modal, ModalHeader,     
  ModalBody, ModalFooter, Dropdown, DropdownToggle,     
  DropdownMenu, DropdownItem     
} from 'reactstrap';    
import { mantenimientoService } from '../../services/inventario/mantenimientoService';    
import { inventarioService } from '../../services/inventario/inventarioService';    
import { useToast } from '../../hooks/useToast';    
import HeaderBlanco from 'components/Headers/HeaderBlanco';    
import Toast from 'components/Toast/Toast';  
import { Alert } from 'reactstrap';  
    
const GestionarMantenimiento = () => {    
  const [todosLosMantenimientos, setTodosLosMantenimientos] = useState([]);    
  const [inventarios, setInventarios] = useState([]);    
  const [loading, setLoading] = useState(false);    
  const [modal, setModal] = useState(false);    
  const [editando, setEditando] = useState(false);    
  const [dropdownOpen, setDropdownOpen] = useState({});    
  const navigate = useNavigate();    
  const { toast, showSuccess, showError, hideToast } = useToast();    
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });  
  const [mantenimientoActual, setMantenimientoActual] = useState({    
    idInventario: '',    
    descripcionMantenimiento: '',    
    costoMantenimiento: '',    
    fechaInicio: '',    
    fechaFin: '',    
    nombreImagen: ''    
  });    
    
  // Filtros    
  const [filtros, setFiltros] = useState({    
    idInventario: '',    
    fechaInicio: '',    
    fechaFin: '',    
    costoMin: '',    
    costoMax: ''    
  });    
    
  // Cargar todos los datos una sola vezz  
  useEffect(() => {  
    cargarTodosLosDatos();  
  }, []);  
  
  const cargarTodosLosDatos = async () => {  
    try {  
      setLoading(true);  
      const [mantenimientosData, inventariosData] = await Promise.all([  
        mantenimientoService.obtenerMantenimientoTodos(),  
        inventarioService.obtenerInventarios()  
      ]);  
        
      setTodosLosMantenimientos(Array.isArray(mantenimientosData) ? mantenimientosData : []);  
      setInventarios(Array.isArray(inventariosData) ? inventariosData : []);  
    } catch (error) {  
      console.error('Error al cargar datos:', error);  
      showError('Error al cargar datos: ' + (error.message || 'Error desconocido'));  
    } finally {  
      setLoading(false);  
    }  
  };  
  
  // Filtrado local usando useMemo para optimización  
  const mantenimientosFiltrados = useMemo(() => {  
    return todosLosMantenimientos.filter(mantenimiento => {  
      // Filtro por inventario  
      if (filtros.idInventario && mantenimiento.idInventario !== parseInt(filtros.idInventario)) {  
        return false;  
      }  
  
      // Filtro por fecha inicio  
      if (filtros.fechaInicio) {  
        const fechaInicioMantenimiento = new Date(mantenimiento.fechaInicio);  
        const fechaFiltro = new Date(filtros.fechaInicio);  
        if (fechaInicioMantenimiento < fechaFiltro) {  
          return false;  
        }  
      }  
  
      // Filtro por fecha fin  
      if (filtros.fechaFin) {  
        const fechaInicioMantenimiento = new Date(mantenimiento.fechaInicio);  
        const fechaFiltro = new Date(filtros.fechaFin);  
        if (fechaInicioMantenimiento > fechaFiltro) {  
          return false;  
        }  
      }  
  
      // Filtro por costo mínimo  
      if (filtros.costoMin && mantenimiento.costoMantenimiento) {  
        if (parseFloat(mantenimiento.costoMantenimiento) < parseFloat(filtros.costoMin)) {  
          return false;  
        }  
      }  
  
      // Filtro por costo máximo  
      if (filtros.costoMax && mantenimiento.costoMantenimiento) {  
        if (parseFloat(mantenimiento.costoMantenimiento) > parseFloat(filtros.costoMax)) {  
          return false;  
        }  
      }  
  
      return true;  
    });  
  }, [todosLosMantenimientos, filtros]);  
    
  const toggleDropdown = (id) => {    
    setDropdownOpen(prevState => ({ ...prevState, [id]: !prevState[id] }));    
  };    
    
  const handleSubmit = async (e) => {  
  e.preventDefault();  
  setLoading(true);  
  setMensaje({ tipo: '', texto: '' });  
  
  try {  
    // Preparar datos con conversiones correctas  
    const datosMantenimiento = {  
      idInventario: parseInt(mantenimientoActual.idInventario),  
      descripcionMantenimiento: mantenimientoActual.descripcionMantenimiento.trim(),  
      fechaInicio: mantenimientoActual.fechaInicio  
    };  
  
    // Solo agregar campos opcionales si tienen valor  
    if (mantenimientoActual.fechaFin && mantenimientoActual.fechaFin.trim() !== '') {  
      datosMantenimiento.fechaFin = mantenimientoActual.fechaFin;  
    }  
  
    if (mantenimientoActual.costoMantenimiento && mantenimientoActual.costoMantenimiento !== '') {  
      datosMantenimiento.costoMantenimiento = parseFloat(mantenimientoActual.costoMantenimiento);  
    }  
  
    if (mantenimientoActual.nombreImagen && mantenimientoActual.nombreImagen.trim() !== '') {  
      datosMantenimiento.nombreImagen = mantenimientoActual.nombreImagen.trim();  
    }  
  
    console.log('Datos a enviar:', datosMantenimiento); // Para debug  
  
    if (editando) {  
      await mantenimientoService.editarMantenimiento(mantenimientoActual.idMantenimiento, datosMantenimiento);  
    } else {  
      await mantenimientoService.crearMantenimiento(datosMantenimiento);  
    }  
  
    setMensaje({  
      tipo: 'success',  
      texto: editando ? 'Mantenimiento actualizado exitosamente' : 'Mantenimiento creado exitosamente'  
    });  
  
    setTimeout(() => {  
      setModal(false);  
      cargarTodosLosDatos();  
    }, 1500);  
  
  } catch (error) {  
    console.error('Error completo:', error.response?.data || error);  
    setMensaje({  
      tipo: 'danger',  
      texto: error.response?.data?.mensaje || error.response?.data?.errores?.[0]?.msg || 'Error al guardar el mantenimiento'  
    });  
  } finally {  
    setLoading(false);  
  }  
};
    
  const handleEliminar = async (id) => {    
    if (window.confirm('¿Está seguro de eliminar este mantenimiento?')) {    
      try {    
        await mantenimientoService.eliminarMantenimiento(id);    
        // Actualizar el estado local filtrando el elemento eliminado  
        setTodosLosMantenimientos(todosLosMantenimientos.filter(m => m.idMantenimiento !== id));  
        showSuccess('Mantenimiento eliminado exitosamente');    
      } catch (error) {    
        showError('Error al eliminar mantenimiento');    
      }    
    }    
  };    
    
  const handleEditar = (mantenimiento) => {    
    setMantenimientoActual({    
      ...mantenimiento,    
      fechaInicio: mantenimiento.fechaInicio ? mantenimiento.fechaInicio.split('T')[0] : '',    
      fechaFin: mantenimiento.fechaFin ? mantenimiento.fechaFin.split('T')[0] : ''    
    });    
    setEditando(true);    
    setModal(true);    
  };    
    
  const resetForm = () => {    
    setMantenimientoActual({    
      idInventario: '',    
      descripcionMantenimiento: '',    
      costoMantenimiento: '',    
      fechaInicio: '',    
      fechaFin: '',    
      nombreImagen: ''    
    });    
    setEditando(false);    
  };    
    
  const limpiarFiltros = () => {    
    setFiltros({    
      idInventario: '',    
      fechaInicio: '',    
      fechaFin: '',    
      costoMin: '',    
      costoMax: ''    
    });    
  };    
    
  return (    
    <>    
      <HeaderBlanco />    
      <Container className="mt--7" fluid>    
        <Toast show={toast.show} message={toast.message} type={toast.type} onClose={hideToast} />    
        <Row>    
          <Col>    
            <Card className="shadow">    
              <CardHeader className="border-0">    
                <Row className="align-items-center">    
                  <Col xs="8">    
                    <h3 className="mb-0">Gestionar Mantenimiento</h3>    
                  </Col>    
                  <Col xs="4" className="text-right">    
                    <Button    
                      color="primary"    
                      onClick={() => {    
                        resetForm();    
                        setModal(true);    
                      }}    
                      size="sm"    
                    >    
                      Nuevo Mantenimiento    
                    </Button>    
                  </Col>    
                </Row>    
              </CardHeader>    
    
              {/* Filtros */}    
              <CardBody>    
                <Form>    
                  <Row>    
                    <Col md="2">    
                      <FormGroup>    
                        <Label>Activo</Label>    
                        <Input    
                          type="select"    
                          value={filtros.idInventario}    
                          onChange={(e) => setFiltros({...filtros, idInventario: e.target.value})}    
                        >    
                          <option value="">Todos</option>    
                          {inventarios.map(inv => (    
                            <option key={inv.idInventario} value={inv.idInventario}>    
                              {inv.codigo} - {inv.nombre}    
                            </option>    
                          ))}    
                        </Input>    
                      </FormGroup>    
                    </Col>    
                    <Col md="2">    
                      <FormGroup>    
                        <Label>Fecha Inicio</Label>    
                        <Input    
                          type="date"    
                          value={filtros.fechaInicio}    
                          onChange={(e) => setFiltros({...filtros, fechaInicio: e.target.value})}    
                        />    
                      </FormGroup>    
                    </Col>    
                    <Col md="2">    
                      <FormGroup>    
                        <Label>Fecha Fin</Label>    
                        <Input    
                          type="date"    
                          value={filtros.fechaFin}    
                          onChange={(e) => setFiltros({...filtros, fechaFin: e.target.value})}    
                        />    
                      </FormGroup>    
                    </Col>    
                    <Col md="2">    
                      <FormGroup>    
                        <Label>Costo Mín</Label>    
                        <Input    
                          type="number"    
                          step="0.01"    
                          value={filtros.costoMin}    
                          onChange={(e) => setFiltros({...filtros, costoMin: e.target.value})}    
                        />    
                      </FormGroup>    
                    </Col>    
                    <Col md="2">    
                      <FormGroup>    
                        <Label>Costo Máx</Label>    
                        <Input    
                          type="number"    
                          step="0.01"    
                          value={filtros.costoMax}    
                          onChange={(e) => setFiltros({...filtros, costoMax: e.target.value})}    
                        />    
                      </FormGroup>    
                    </Col>    
                    <Col md="2" className="d-flex align-items-end">    
                      <FormGroup>    
                        <Button color="secondary" onClick={limpiarFiltros}>    
                          Limpiar    
                        </Button>    
                      </FormGroup>    
                    </Col>    
                  </Row>    
                </Form>    
    
                {/* Tabla de mantenimientos */}    
                <Table className="align-items-center table-flush table-sm " responsive>    
                  <thead className="thead-light">    
                    <tr>    
                      <th scope="col">ID</th>    
                      <th scope="col">Activo</th>    
                      <th scope="col">Descripción</th>    
                      <th scope="col">Costo</th>    
                      <th scope="col">Fecha Inicio</th>    
                      <th scope="col">Fecha Fin</th>    
                      <th scope="col">Estado</th>    
                      <th scope="col">Acciones</th>    
                    </tr>    
                  </thead>    
                  <tbody>    
                    {loading ? (    
                      <tr>    
                        <td colSpan="8" className="text-center">Cargando...</td>    
                      </tr>    
                    ) : mantenimientosFiltrados.length === 0 ? (    
                      <tr>    
                        <td colSpan="8" className="text-center">  
                          {Object.values(filtros).some(valor => valor && valor !== '')   
                            ? 'No hay mantenimientos que coincidan con los filtros'   
                            : 'No hay mantenimientos registrados'  
                          }  
                        </td>    
                      </tr>    
                    ) : (    
                      mantenimientosFiltrados.map(mantenimiento => (    
                        <tr key={mantenimiento.idMantenimiento}>    
                          <td>{mantenimiento.idMantenimiento}</td>    
                          <td>      
                            {mantenimiento.Inventario ?       
                              `${mantenimiento.Inventario.codigo} - ${mantenimiento.Inventario.nombre}` :       
                              'N/A'      
                            }      
                          </td>    
                          <td>{mantenimiento.descripcionMantenimiento.substring(0, 50)}...</td>    
                          <td>L. {mantenimiento.costoMantenimiento || 'N/A'}</td>    
                          <td>{mantenimiento.fechaInicio ? new Date(mantenimiento.fechaInicio).toLocaleDateString() : 'N/A'}</td>    
                          <td>{mantenimiento.fechaFin ? new Date(mantenimiento.fechaFin).toLocaleDateString() : 'En proceso'}</td>    
                          <td>    
                            <span className={`badge ${mantenimiento.fechaFin ? 'badge-success' : 'badge-warning'}`}>    
                              {mantenimiento.fechaFin ? 'Completado' : 'En proceso'}    
                            </span>    
                          </td>    
                          <td>    
                            <Dropdown isOpen={dropdownOpen[mantenimiento.idMantenimiento]}     
                                      toggle={() => toggleDropdown(mantenimiento.idMantenimiento)}>    
                              <DropdownToggle>    
                                <i className="fas fa-ellipsis-v" />    
                              </DropdownToggle>    
                              <DropdownMenu>    
                                <DropdownItem onClick={() => handleEditar(mantenimiento)}>Editar</DropdownItem>    
                                <DropdownItem onClick={() => handleEliminar(mantenimiento.idMantenimiento)}>Eliminar</DropdownItem>    
                              </DropdownMenu>    
                            </Dropdown>    
                          </td>    
                        </tr>    
                      ))    
                    )}    
                  </tbody>  
                </Table>    
              </CardBody>    
            </Card>    
          </Col>    
        </Row>    
    
        {/* Modal para crear/editar mantenimiento */}  
<Modal isOpen={modal} toggle={() => setModal(!modal)} size="lg">  
  <ModalHeader toggle={() => setModal(!modal)}>  
    {editando ? 'Editar Mantenimiento' : 'Nuevo Mantenimiento'}  
  </ModalHeader>  
  <Form onSubmit={handleSubmit}>  
    <ModalBody>  
      {/* Mostrar errores si existen */}  
      {mensaje.texto && (  
        <Alert color={mensaje.tipo} className="mb-3">  
          {mensaje.texto}  
        </Alert>  
      )}  
        
      <Row>  
        <Col md="6">  
          <FormGroup>  
            <Label>Activo *</Label>  
            <Input  
              type="select"  
              value={mantenimientoActual.idInventario || ''}  
              onChange={(e) => setMantenimientoActual({...mantenimientoActual, idInventario: e.target.value})}  
              required  
            >  
              <option value="">Seleccione un activo</option>  
              {inventarios.map(inv => (  
                <option key={inv.idInventario} value={inv.idInventario}>  
                  {inv.codigo} - {inv.nombre}  
                </option>  
              ))}  
            </Input>  
          </FormGroup>  
        </Col>  
        <Col md="6">  
          <FormGroup>  
            <Label>Costo</Label>  
            <Input  
              type="number"  
              step="0.01"  
              value={mantenimientoActual.costoMantenimiento || ''}  
              onChange={(e) => setMantenimientoActual({...mantenimientoActual, costoMantenimiento: e.target.value})}  
              placeholder="0.00"  
            />  
          </FormGroup>  
        </Col>  
      </Row>  
      <Row>  
        <Col md="6">  
          <FormGroup>  
            <Label>Fecha Inicio *</Label>  
            <Input  
              type="date"  
              value={mantenimientoActual.fechaInicio || ''}  
              onChange={(e) => setMantenimientoActual({...mantenimientoActual, fechaInicio: e.target.value})}  
              required  
            />  
          </FormGroup>  
        </Col>  
        <Col md="6">  
          <FormGroup>  
            <Label>Fecha Fin</Label>  
            <Input  
              type="date"  
              value={mantenimientoActual.fechaFin || ''}  
              onChange={(e) => setMantenimientoActual({...mantenimientoActual, fechaFin: e.target.value})}  
            />  
          </FormGroup>  
        </Col>  
      </Row>  
      <FormGroup>  
        <Label>Descripción del Mantenimiento *</Label>  
        <Input  
          type="textarea"  
          rows="4"  
          value={mantenimientoActual.descripcionMantenimiento || ''}  
          onChange={(e) => setMantenimientoActual({...mantenimientoActual, descripcionMantenimiento: e.target.value})}  
          placeholder="Describa el mantenimiento realizado (mínimo 10 caracteres)"  
          required  
          minLength="10"  
          maxLength="1000"  
        />  
      </FormGroup>  
      <FormGroup>  
        <Label>Nombre de Imagen</Label>  
        <Input  
          type="text"  
          value={mantenimientoActual.nombreImagen || ''}  
          onChange={(e) => setMantenimientoActual({...mantenimientoActual, nombreImagen: e.target.value})}  
          placeholder="Nombre del archivo de imagen (opcional)"  
          maxLength="255"  
        />  
      </FormGroup>  
    </ModalBody>  
    <ModalFooter>  
      <Button color="secondary" onClick={() => setModal(false)}>  
        Cancelar  
      </Button>  
      <Button color="primary" type="submit" disabled={loading}>  
        {loading ? 'Guardando...' : (editando ? 'Actualizar' : 'Crear')}  
      </Button>  
    </ModalFooter>  
  </Form>  
</Modal>      
      </Container>    
    </>    
  );    
};    
    
export default GestionarMantenimiento; 