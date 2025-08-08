// src/views/programacion/CrearPauta.js - Versión actualizada  
import React, { useState, useEffect } from "react";  
import { useNavigate } from "react-router-dom";  
import {   
  Button, Card, CardHeader, CardBody, FormGroup,   
  Form, Input, Container, Row, Col, Alert, Label  
} from "reactstrap";  
import HeaderResponsive from "components/Headers/HeaderResponsive";  
import { programacionService } from "../../services/programacion/programacionService";  
import { clienteService } from '../../services/gestion_cliente/clienteService';  
  
const CrearPauta = () => {  
  const navigate = useNavigate();  
  const [programas, setProgramas] = useState([]);  
  const [clientes, setClientes] = useState([]);  
  const [loading, setLoading] = useState(false);  
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });  
    
  const [formData, setFormData] = useState({  
    idPrograma: "",  
    horaBloque: "",  
    ordenBloque: 1,  
    duracionTotal: 180,  
    fechaVigencia: new Date().toISOString().split('T')[0],  
    estado: "Activo",  
    anuncios: [  
      {  
        idCliente: "",  
        ordenAnuncio: 1,  
        duracionAnuncio: 60,  
        nombreComercial: "",  
        estado: "Programado"  
      }  
    ]  
  });  
  
  // Cargar datos de referencia al montar el componente  
  useEffect(() => {  
    const cargarDatos = async () => {  
      try {  
        // Cargar programas  
        const programasData = await programacionService.obtenerProgramas();  
        setProgramas(programasData);  
  
        // Cargar clientes usando el servicio existente  
        const clientesRes = await clienteService.obtenerTodosLosClientes();  
        setClientes(Array.isArray(clientesRes) ? clientesRes : clientesRes.data || []);  
      } catch (error) {  
        console.error("Error al cargar datos:", error);  
        setClientes([]);  
        setProgramas([]);  
      }  
    };  
  
    cargarDatos();  
  }, []);  
  
  const handleChange = (e) => {  
    const { name, value } = e.target;  
    setFormData(prev => ({ ...prev, [name]: value }));  
  };  
  
  const handleAnuncioChange = (index, field, value) => {  
    const nuevosAnuncios = [...formData.anuncios];  
    nuevosAnuncios[index][field] = value;  
    setFormData(prev => ({ ...prev, anuncios: nuevosAnuncios }));  
  };  
  
  const agregarAnuncio = () => {  
    const nuevoAnuncio = {  
      idCliente: "",  
      ordenAnuncio: formData.anuncios.length + 1,  
      duracionAnuncio: 60,  
      nombreComercial: "",  
      estado: "Programado"  
    };  
    setFormData(prev => ({  
      ...prev,  
      anuncios: [...prev.anuncios, nuevoAnuncio]  
    }));  
  };  
  
  const eliminarAnuncio = (index) => {  
    if (formData.anuncios.length > 1) {  
      const nuevosAnuncios = formData.anuncios.filter((_, i) => i !== index);  
      setFormData(prev => ({ ...prev, anuncios: nuevosAnuncios }));  
    }  
  };  
  
  const handleSubmit = async (e) => {  
    e.preventDefault();  
    try {  
      setLoading(true);  
      await programacionService.crearPauta(formData);  
      setMensaje({ tipo: 'success', texto: 'Pauta publicitaria creada exitosamente' });  
        
      // Reset form  
      setFormData({  
        idPrograma: "",  
        horaBloque: "",  
        ordenBloque: 1,  
        duracionTotal: 180,  
        fechaVigencia: new Date().toISOString().split('T')[0],  
        estado: "Activo",  
        anuncios: [{  
          idCliente: "",  
          ordenAnuncio: 1,  
          duracionAnuncio: 60,  
          nombreComercial: "",  
          estado: "Programado"  
        }]  
      });  
    } catch (error) {  
      setMensaje({ tipo: 'danger', texto: 'Error al crear pauta: ' + error.message });  
    } finally {  
      setLoading(false);  
    }  
  };    
  
  return (  
    <>  
      <HeaderResponsive />  
      <Container className="mt-5" fluid>  
        <Row className="justify-content-center">  
          <Col lg="10">  
            <Card className="bg-secondary shadow">  
              <CardHeader className="bg-white border-0">  
                <Row className="align-items-center">  
                  <Col xs="8">  
                    <h3 className="mb-0">Crear Nueva Pauta Publicitaria</h3>  
                  </Col>  
                  <Col className="text-right" xs="4">  
                    <Button  
                      color="secondary"  
                      onClick={() => navigate("/admin/programacion")}  
                      size="sm"  
                    >  
                      Cancelar  
                    </Button>  
                  </Col>  
                </Row>  
              </CardHeader>  
              <CardBody>  
                {mensaje.texto && (  
                  <Alert color={mensaje.tipo}>{mensaje.texto}</Alert>  
                )}  
                  
                <Form onSubmit={handleSubmit}>  
                  <h6 className="heading-small text-muted mb-4">  
                    Información del Bloque Publicitario  
                  </h6>  
                    
                  <div className="pl-lg-4">  
                    <Row>  
                      <Col lg="6">  
                        <FormGroup>  
                          <Label>Programa</Label>  
                          <Input  
                            type="select"  
                            name="idPrograma"  
                            value={formData.idPrograma}  
                            onChange={handleChange}  
                            required  
                          >  
                            <option value="">Seleccionar programa</option>  
                            {programas.map(programa => (  
                              <option key={programa.idPrograma} value={programa.idPrograma}>  
                                {programa.nombre} - {programa.horaInicio}  
                              </option>  
                            ))}  
                          </Input>  
                        </FormGroup>  
                      </Col>  
                      <Col lg="6">  
                        <FormGroup>  
                          <Label>Hora del Bloque</Label>  
                          <Input  
                            type="time"  
                            name="horaBloque"  
                            value={formData.horaBloque}  
                            onChange={handleChange}  
                            required  
                          />  
                        </FormGroup>  
                      </Col>  
                    </Row>  
                      
                    <Row>  
                      <Col lg="4">  
                        <FormGroup>  
                          <Label>Orden del Bloque</Label>  
                          <Input  
                            type="number"  
                            name="ordenBloque"  
                            value={formData.ordenBloque}  
                            onChange={handleChange}  
                            min="1"  
                            required  
                          />  
                        </FormGroup>  
                      </Col>  
                      <Col lg="4">  
                        <FormGroup>  
                          <Label>Duración Total (segundos)</Label>  
                          <Input  
                            type="number"  
                            name="duracionTotal"  
                            value={formData.duracionTotal}  
                            onChange={handleChange}  
                            min="30"  
                            max="600"  
                            required  
                          />  
                        </FormGroup>  
                      </Col>  
                      <Col lg="4">  
                        <FormGroup>  
                          <Label>Mes de Vigencia</Label>  
                          <Input  
                            type="month"  
                            name="fechaVigencia"  
                            value={formData.fechaVigencia.substring(0, 7)} // YYYY-MM format  
                            onChange={(e) => {  
                              // Convert month input to first day of selected month  
                              const selectedMonth = e.target.value; // YYYY-MM  
                              const firstDayOfMonth = `${selectedMonth}-01`;  
                              setFormData(prev => ({ ...prev, fechaVigencia: firstDayOfMonth }));  
                            }}  
                            required  
                          />  
                        </FormGroup> 
                      </Col>  
                    </Row>  
                  </div>  
  
                  <hr className="my-4" />  
                    
                  <h6 className="heading-small text-muted mb-4">  
                    Anuncios del Bloque  
                    <Button  
                      color="success"  
                      size="sm"  
                      className="ml-3"  
                      type="button"  
                      onClick={agregarAnuncio}  
                    >  
                      + Agregar Anuncio  
                    </Button>  
                  </h6>  
  
                  {formData.anuncios.map((anuncio, index) => (  
                    <div key={index} className="pl-lg-4 mb-4 border-left border-primary">  
                      <Row>  
                        <Col lg="6">  
                          <FormGroup>  
                            <Label>Cliente</Label>  
                            <Input  
                              type="select"  
                              value={anuncio.idCliente}  
                              onChange={(e) => handleAnuncioChange(index, 'idCliente', e.target.value)}  
                              required  
                            >  
                              <option value="">Seleccionar cliente</option>  
                              {clientes.map(cliente => (  
                                <option key={cliente.idCliente} value={cliente.idCliente}>  
                                  {cliente.persona?.Pnombre} {cliente.persona?.Papellido}  
                                </option>  
                              ))}  
                            </Input>  
                          </FormGroup>  
                        </Col>  
                        <Col lg="4">  
                          <FormGroup>  
                            <Label>Nombre Comercial</Label>  
                            <Input  
                              type="text"  
                              value={anuncio.nombreComercial}  
                              onChange={(e) => handleAnuncioChange(index, 'nombreComercial', e.target.value)}  
                              placeholder="Ej: CLARO"  
                              required  
                            />  
                          </FormGroup>  
                        </Col>  
                        <Col lg="2">  
                          <FormGroup>  
                            <Label>Duración (seg)</Label>  
                            <Input  
                              type="number"  
                              value={anuncio.duracionAnuncio}  
                              onChange={(e) => handleAnuncioChange(index, 'duracionAnuncio', parseInt(e.target.value))}  
                              min="5"  
                              max="120"  
                              required  
                            />  
                          </FormGroup>  
                        </Col>  
                      </Row>  
                        
                      {formData.anuncios.length > 1 && (  
                        <Button  
                          color="danger"  
                          size="sm"  
                          type="button"  
                          onClick={() => eliminarAnuncio(index)}  
                        >  
                          Eliminar Anuncio  
                        </Button>  
                      )}  
                    </div>  
                  ))}  
  
                  <div className="text-center">  
                    <Button type="submit" color="primary" disabled={loading}>  
                      {loading ? 'Creando Pauta...' : 'Crear Pauta Publicitaria'}  
                    </Button>  
                  </div>  
                </Form>  
              </CardBody>  
            </Card>  
          </Col>  
        </Row>  
      </Container>  
    </>  
  );  
};  
  
export default CrearPauta;