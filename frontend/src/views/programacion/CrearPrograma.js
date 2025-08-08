// src/views/programacion/CrearPrograma.js - Versión actualizada  
import React, { useState, useEffect } from "react";  
import {  
  Card, CardHeader, CardBody, Container, Row, Col,  
  Form, FormGroup, Label, Input, Button, Alert  
} from "reactstrap";  
import HeaderResponsive from "components/Headers/HeaderResponsive";  
import { programacionService } from "../../services/programacion/programacionService";  
  
const CrearPrograma = () => {  
  const [programa, setPrograma] = useState({  
    nombre: "",  
    tipoCalendario: "",  
    horaInicio: "",  
    duracion: "",  
    categoria: "",  
    estado: "Activo",  
    idEmpleado: 1, // Deberías obtener esto del usuario logueado  
    fechaCreacion: new Date().toISOString()  
  });  
    
  const [loading, setLoading] = useState(false);  
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });  
  
  const handleSubmit = async (e) => {  
    e.preventDefault();  
    try {  
      setLoading(true);  
      await programacionService.crearPrograma(programa);  
      setMensaje({ tipo: 'success', texto: 'Programa creado exitosamente' });  
      // Reset form  
      setPrograma({  
        nombre: "",  
        tipoCalendario: "",  
        horaInicio: "",  
        duracion: "",  
        categoria: "",  
        estado: "Activo",  
        idEmpleado: 1,  
        fechaCreacion: new Date().toISOString()  
      });  
    } catch (error) {  
      setMensaje({ tipo: 'danger', texto: 'Error al crear programa: ' + error.message });  
    } finally {  
      setLoading(false);  
    }  
  };  
  
  return (  
    <>  
      <HeaderResponsive />  
      <Container className="mt-5" fluid>  
        <Row>  
          <Col lg="8" className="mx-auto">  
            <Card className="shadow">  
              <CardHeader>  
                <h3 className="mb-0">Crear Nuevo Programa</h3>  
              </CardHeader>  
              <CardBody>  
                {mensaje.texto && (  
                  <Alert color={mensaje.tipo}>{mensaje.texto}</Alert>  
                )}  
                <Form onSubmit={handleSubmit}>  
                  <FormGroup>  
                    <Label>Nombre del Programa</Label>  
                    <Input  
                      type="text"  
                      value={programa.nombre}  
                      onChange={(e) => setPrograma({...programa, nombre: e.target.value})}  
                      placeholder="Ej: NOTICIAS 60 MINUTOS"  
                      required  
                    />  
                  </FormGroup>  
                    
                  <FormGroup>  
                    <Label>Tipo de Calendario</Label>  
                    <Input  
                      type="select"  
                      value={programa.tipoCalendario}  
                      onChange={(e) => setPrograma({...programa, tipoCalendario: e.target.value})}  
                      required  
                    >  
                      <option value="">Seleccionar tipo de calendario</option>  
                      <option value="Lunes_Sabado">Lunes a Sábado</option>  
                      <option value="Domingo">Domingo</option>  
                      <option value="Diario">Diario</option>  
                    </Input>  
                  </FormGroup>  
  
                  <FormGroup>  
                    <Label>Categoría</Label>  
                    <Input  
                      type="select"  
                      value={programa.categoria}  
                      onChange={(e) => setPrograma({...programa, categoria: e.target.value})}  
                      required  
                    >  
                      <option value="">Seleccionar categoría</option>  
                      <option value="Noticias">Noticias</option>  
                      <option value="Entretenimiento">Entretenimiento</option>  
                      <option value="Deportes">Deportes</option>  
                      <option value="Educativo">Educativo</option>  
                      <option value="Cultural">Cultural</option>  
                      <option value="Infantil">Infantil</option>  
                    </Input>  
                  </FormGroup>  
                    
                  <Row>  
                    <Col md="6">  
                      <FormGroup>  
                        <Label>Hora de Inicio</Label>  
                        <Input  
                          type="time"  
                          value={programa.horaInicio}  
                          onChange={(e) => setPrograma({...programa, horaInicio: e.target.value})}  
                          required  
                        />  
                      </FormGroup>  
                    </Col>  
                    <Col md="6">  
                      <FormGroup>  
                        <Label>Duración (minutos)</Label>  
                        <Input  
                          type="number"  
                          value={programa.duracion}  
                          onChange={(e) => setPrograma({...programa, duracion: parseInt(e.target.value)})}  
                          min="1"  
                          max="480"  
                          placeholder="60"  
                          required  
                        />  
                      </FormGroup>  
                    </Col>  
                  </Row>  
                    
                  <FormGroup>  
                    <Label>Estado</Label>  
                    <Input  
                      type="select"  
                      value={programa.estado}  
                      onChange={(e) => setPrograma({...programa, estado: e.target.value})}  
                    >  
                      <option value="Activo">Activo</option>  
                      <option value="Inactivo">Inactivo</option>  
                    </Input>  
                  </FormGroup>  
                    
                  <Button type="submit" color="primary" disabled={loading}>  
                    {loading ? 'Creando...' : 'Crear Programa'}  
                  </Button>  
                </Form>  
              </CardBody>  
            </Card>  
          </Col>  
        </Row>  
      </Container>  
    </>  
  );  
};  
  
export default CrearPrograma;