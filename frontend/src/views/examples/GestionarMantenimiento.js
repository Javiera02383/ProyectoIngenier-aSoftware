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
  const [archivoImagen, setArchivoImagen] = useState(null); //cambio
  const [modalImagen, setModalImagen] = useState(false);  
  const [imagenActual, setImagenActual] = useState(null);
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
    // Validaciones básicas
    if (!mantenimientoActual.idInventario) {
      throw new Error('Debe seleccionar un activo');
    }
    
    if (!mantenimientoActual.descripcionMantenimiento || mantenimientoActual.descripcionMantenimiento.trim().length < 10) {
      throw new Error('La descripción debe tener al menos 10 caracteres');
    }
    
    if (!mantenimientoActual.fechaInicio) {
      throw new Error('Debe seleccionar una fecha de inicio');
    }

    let datosMantenimiento;

    if (archivoImagen){
      datosMantenimiento = new FormData();
      datosMantenimiento.append('idInventario', mantenimientoActual.idInventario);
      datosMantenimiento.append('descripcionMantenimiento', mantenimientoActual.descripcionMantenimiento.trim());
      datosMantenimiento.append('fechaInicio', mantenimientoActual.fechaInicio);
      datosMantenimiento.append('imagen', archivoImagen);
      
      // Solo agregar campos opcionales si tienen valor  
      if (mantenimientoActual.fechaFin && mantenimientoActual.fechaFin.trim() !== '') {  
        datosMantenimiento.append('fechaFin', mantenimientoActual.fechaFin); 
      }  
  
      if (mantenimientoActual.costoMantenimiento && mantenimientoActual.costoMantenimiento !== '' && !isNaN(mantenimientoActual.costoMantenimiento)) {  
        datosMantenimiento.append('costoMantenimiento', parseFloat(mantenimientoActual.costoMantenimiento));
      }  
      
      // Si estamos editando y hay una nueva imagen, NO enviar el nombreImagen anterior
      // El backend generará un nuevo nombre para la nueva imagen
      console.log('Enviando nueva imagen, no se incluye nombreImagen anterior');
      console.log('Imagen anterior en estado:', mantenimientoActual.nombreImagen);
      console.log('Nueva imagen seleccionada:', archivoImagen.name);
    } else {
      datosMantenimiento = {
        idInventario:parseInt(mantenimientoActual.idInventario),
        descripcionMantenimiento: mantenimientoActual.descripcionMantenimiento.trim(),
        fechaInicio: mantenimientoActual.fechaInicio
      };

      if (mantenimientoActual.fechaFin && mantenimientoActual.fechaFin.trim() !== ''){
        datosMantenimiento.fechaFin = mantenimientoActual.fechaFin;
      }
      if (mantenimientoActual.costoMantenimiento && mantenimientoActual.costoMantenimiento !== '' && !isNaN(mantenimientoActual.costoMantenimiento)) {
          datosMantenimiento.costoMantenimiento = parseFloat(mantenimientoActual.costoMantenimiento);
      }
      
      // Si estamos editando y NO hay nueva imagen, mantener el nombreImagen existente
      if (editando && mantenimientoActual.nombreImagen) {
        datosMantenimiento.nombreImagen = mantenimientoActual.nombreImagen;
        console.log('Manteniendo imagen existente:', mantenimientoActual.nombreImagen);
      } else if (editando && mantenimientoActual.nombreImagen === '') {
        // Si nombreImagen es string vacío, significa que se eliminó la imagen
        datosMantenimiento.nombreImagen = null;
        console.log('Editando sin imagen, se eliminará la imagen anterior');
      }
    }
  
    console.log('Datos a enviar:', datosMantenimiento); // Para debug  
  
    if (editando) {  
      if (archivoImagen) {
        // Si hay una nueva imagen, usar el método que soporta FormData
        await mantenimientoService.editarMantenimientoConImagen(mantenimientoActual.idMantenimiento, datosMantenimiento);
        console.log('Mantenimiento actualizado con nueva imagen');
      } else {
        // Si no hay nueva imagen, usar el método normal
        await mantenimientoService.editarMantenimiento(mantenimientoActual.idMantenimiento, datosMantenimiento);
        console.log('Mantenimiento actualizado sin cambios en imagen');
      }
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
    console.error('Error completo:', error);
    console.error('Error response:', error.response?.data);
    
    let mensajeError = 'Error al guardar el mantenimiento';
    
    if (error.message) {
      // Error de validación del frontend
      mensajeError = error.message;
    } else if (error.response?.data?.error) {
      // Error del backend
      mensajeError = error.response.data.error;
    } else if (error.response?.data?.mensaje) {
      // Mensaje del backend
      mensajeError = error.response.data.mensaje;
    } else if (error.response?.data?.errores?.[0]?.msg) {
      // Errores de validación del backend
      mensajeError = error.response.data.errores[0].msg;
    }
    
    setMensaje({  
      tipo: 'danger',  
      texto: mensajeError
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
   const handleVerImagen = (mantenimiento) => {  
    if (mantenimiento && mantenimiento.nombreImagen && mantenimiento.nombreImagen.trim() !== '') {
      // Usar la ruta estática con el puerto correcto
      const imagenUrl = `http://localhost:4051/api/optica/public/img/mantenimiento/${mantenimiento.nombreImagen}`;
      console.log('URL de imagen:', imagenUrl); // Debug
      console.log('Mantenimiento:', mantenimiento); // Debug adicional
      setImagenActual(imagenUrl);  
      setModalImagen(true);  
    } else {
      console.log('Mantenimiento sin imagen válida:', mantenimiento);
      showError('Este mantenimiento no tiene imagen asociada o el nombre de imagen es inválido');
    }
  };
  
  const handleVerImagenFallback = (idMantenimiento) => {
    // Fallback a la ruta dinámica si la estática falla
    const imagenUrl = `/api/optica/inventario/mantenimiento/${idMantenimiento}/imagen`;
    setImagenActual(imagenUrl);
    setModalImagen(true);
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
    setArchivoImagen(null);  
    setEditando(false);
    setMensaje({ tipo: '', texto: '' });
    console.log('Formulario reseteado, imagen limpiada');
  };
    
  const limpiarImagen = () => {
    setArchivoImagen(null);
    setMantenimientoActual(prev => ({
      ...prev,
      nombreImagen: ''
    }));
    console.log('Imagen limpiada, se eliminará al guardar');
  };
  
  const removerImagenExistente = async () => {
    if (editando && mantenimientoActual.nombreImagen) {
      try {
        console.log('Eliminando imagen existente durante edición:', mantenimientoActual.nombreImagen);
        
        // Llamar al backend para eliminar la imagen
        await mantenimientoService.eliminarImagenMantenimiento(mantenimientoActual.idMantenimiento);
        
        // Actualizar el estado local
        setMantenimientoActual(prev => ({
          ...prev,
          nombreImagen: ''
        }));
        
        // También limpiar cualquier nueva imagen seleccionada
        setArchivoImagen(null);
        
        // Mostrar mensaje de éxito
        showSuccess('Imagen eliminada exitosamente');
        
        // Recargar los datos para reflejar el cambio
        cargarTodosLosDatos();
        
      } catch (error) {
        console.error('Error al eliminar imagen:', error);
        let mensajeError = 'Error al eliminar la imagen';
        
        if (error.response?.data?.mensaje) {
          mensajeError = error.response.data.mensaje;
        } else if (error.response?.data?.error) {
          mensajeError = error.response.data.error;
        }
        
        showError(mensajeError);
      }
    }
  };
  
  const handleNuevaImagen = (file) => {
    if (!file) {
      console.log('No se seleccionó archivo');
      return;
    }

    // Validar tipo de archivo
    const tiposPermitidos = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!tiposPermitidos.includes(file.type)) {
      showError('Solo se permiten archivos de imagen (JPG, JPEG, PNG)');
      return;
    }

    // Validar tamaño (5MB máximo)
    const maxSize = 5 * 1024 * 1024; // 5MB en bytes
    if (file.size > maxSize) {
      showError('El archivo es demasiado grande. Máximo 5MB');
      return;
    }

    console.log('Archivo válido seleccionado:', file.name, 'Tipo:', file.type, 'Tamaño:', file.size);
    setArchivoImagen(file);
    
    if (editando && mantenimientoActual.nombreImagen) {
      console.log('Nueva imagen seleccionada, la imagen anterior será reemplazada');
      console.log('Imagen anterior:', mantenimientoActual.nombreImagen);
      console.log('Nueva imagen:', file.name);
      // No limpiar nombreImagen aquí, se manejará en handleSubmit
    }
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
                    <small className="text-muted">
                      Sistema de gestión de mantenimientos con soporte para imágenes de respaldo
                    </small>
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
                      <th scope="col">Acciones</th> 
                      <th scope="col">Estado</th>
                      <th scope="col">Activo</th>    
                      <th scope="col">Descripción</th>    
                      <th scope="col">Costo</th>    
                      <th scope="col">Fecha Inicio</th>    
                      <th scope="col">Fecha Fin</th>    
                       
                       
                         
                    </tr>    
                  </thead>    
                  <tbody>    
                    {loading ? (    
                      <tr>    
                        <td colSpan="9" className="text-center">Cargando...</td>    
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
                          <td>  
                            {mantenimiento.nombreImagen ? (  
                              <Button  
                                color="info"  
                                size="sm"  
                                onClick={() => {
                                  console.log('Botón Ver clickeado para mantenimiento:', mantenimiento);
                                  console.log('nombreImagen:', mantenimiento.nombreImagen);
                                  handleVerImagen(mantenimiento);
                                }}  
                              >  
                                <i className="fas fa-image" /> Ver  
                              </Button>  
                              
                            ) : (  
                              <span className="text-muted">Sin imagen</span>  
                            )}  
                          </td>     
                          <td>    
                            <span className={`badge ${mantenimiento.fechaFin ? 'badge-success' : 'badge-warning'}`}>    
                              {mantenimiento.fechaFin ? 'Completado' : 'En proceso'}    
                            </span>    
                          </td> 
                            
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
        <Label>Imagen de Respaldo</Label>  
        <Input  
          type="file"  
          accept="image/jpeg,image/png,image/jpg"  
          onChange={(e) => {
            const file = e.target.files[0];
            if (file) {
              handleNuevaImagen(file);
            } else {
              setArchivoImagen(null);
            }
          }}
          onInvalid={(e) => {
            e.preventDefault();
            showError('Por favor seleccione un archivo de imagen válido');
          }}
        />  
        <small className="form-text text-muted">
          Formatos permitidos: JPG, JPEG, PNG. Tamaño máximo: 5MB. 
          <br />
          
        </small>
        {mantenimientoActual.nombreImagen && !archivoImagen && (
          <div className="mt-2">
            <small className="text-muted">Imagen actual: {mantenimientoActual.nombreImagen}</small>
            <Button 
              color="info" 
              size="sm" 
              className="ml-2" 
              onClick={() => handleVerImagen(mantenimientoActual)}
            >
              <i className="fas fa-eye" /> Ver
            </Button>
            {editando && (
              <Button 
                color="warning" 
                size="sm" 
                className="ml-2" 
                onClick={removerImagenExistente}
                title="Eliminar la imagen existente del mantenimiento"
              >
                <i className="fas fa-times" /> Eliminar
              </Button>
            )}
          </div>
        )}
        {editando && !mantenimientoActual.nombreImagen && !archivoImagen && (
          <div className="mt-2">
            <small className="text-warning">
              <i className="fas fa-exclamation-triangle" /> La imagen será eliminada al guardar
            </small>
          </div>
        )}
        {archivoImagen && (
          <div className="mt-2">
            <small className="text-info">
              <i className="fas fa-info-circle" /> Nueva imagen seleccionada: {archivoImagen.name}
              {editando && mantenimientoActual.nombreImagen && (
                <span className="text-warning"> (reemplazará la imagen anterior)</span>
              )}
            </small>
            <Button 
              color="secondary" 
              size="sm" 
              className="ml-2" 
              onClick={() => {
                setArchivoImagen(null);
                console.log('Selección de nueva imagen cancelada');
              }}
            >
              <i className="fas fa-times" /> Cancelar
            </Button>
          </div>
        )}
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

      {/* Modal para mostrar imagen */}
      <Modal isOpen={modalImagen} toggle={() => setModalImagen(false)} size="lg">
        <ModalHeader toggle={() => setModalImagen(false)}>
          Imagen de Mantenimiento
        </ModalHeader>
        <ModalBody className="text-center">
          {imagenActual ? (
            <img  
              src={imagenActual}  
              alt="Imagen de mantenimiento"  
              style={{ maxWidth: '100%', maxHeight: '500px' }}  
              onError={(e) => {  
                console.log('Error cargando imagen estática, intentando fallback...');
                console.log('URL que falló:', imagenActual);
                
                // Extraer el nombre del archivo de la URL
                const urlParts = imagenActual.split('/');
                const nombreArchivo = urlParts[urlParts.length - 1];
                console.log('Nombre del archivo:', nombreArchivo);
                
                // Si la imagen falla, intentar con la ruta dinámica
                if (nombreArchivo && nombreArchivo !== 'undefined' && nombreArchivo !== 'null') {
                  // Buscar el mantenimiento actual para obtener el ID
                  const mantenimientoEncontrado = todosLosMantenimientos.find(m => m.nombreImagen === nombreArchivo);
                  if (mantenimientoEncontrado) {
                    const fallbackUrl = `/api/optica/inventario/mantenimiento/${mantenimientoEncontrado.idMantenimiento}/imagen`;
                    console.log('Intentando fallback con URL:', fallbackUrl);
                    e.target.src = fallbackUrl;
                  } else {
                    console.log('No se encontró el mantenimiento para el fallback');
                    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTgiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbWFnZW4gbm8gZGlzcG9uaWJsZTwvdGV4dD48L3N2Zz4=';  
                  }
                } else {
                  console.log('No se pudo extraer el nombre del archivo de la URL');
                  e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTgiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbWFnZW4gbm8gZGlzcG9uaWJsZTwvdGV4dD48L3N2Zz4=';  
                }
              }}  
              onLoad={() => {
                console.log('Imagen cargada exitosamente:', imagenActual);
              }}
            />  
          ) : (
            <div className="text-center p-4">
              <p className="text-muted">No se pudo cargar la imagen</p>
              <small className="text-danger">Error: URL de imagen no válida</small>
            </div>
          )}  
        </ModalBody>  
        <ModalFooter>  
          <Button color="secondary" onClick={() => setModalImagen(false)}>  
            Cerrar  
          </Button>  
        </ModalFooter>  
      </Modal>
      
      </Container>    
    </>    
  );    
};    
    
export default GestionarMantenimiento; 