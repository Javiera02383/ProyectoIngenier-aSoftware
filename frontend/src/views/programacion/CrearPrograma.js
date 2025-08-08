import React, { useState } from "react";  
import {  
  Card, CardHeader, CardBody, Container, Row, Col,  
  Form, FormGroup, Label, Input, Button, Alert  
} from "reactstrap";  
import HeaderResponsive from "components/Headers/HeaderResponsive";  
import { programacionService } from "../../services/programacion/programacionService";  
  
const CrearPrograma = () => {  
  const [programa, setPrograma] = useState({  
    nombre: "",  
    tipo: "",  
    horaInicio: "",  
    duracion: "",  
    diasEmision: "",  
    descripcion: "",  
    estado: "Activo"  
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
        nombre: "", tipo: "", horaInicio: "", duracion: "",  
        diasEmision: "", descripcion: "", estado: "Activo"  
      });  
    } catch (error) {  
      setMensaje({ tipo: 'danger', texto: 'Error al crear programa' });  
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
                      required  
                    />  
                  </FormGroup>  
                  <FormGroup>  
                    <Label>Tipo</Label>  
                    <Input  
                      type="select"  
                      value={programa.tipo}  
                      onChange={(e) => setPrograma({...programa, tipo: e.target.value})}  
                      required  
                    >  
                      <option value="">Seleccionar tipo</option>  
                      <option value="Noticias">Noticias</option>  
                      <option value="Entretenimiento">Entretenimiento</option>  
                      <option value="Deportes">Deportes</option>  
                      <option value="Cultural">Cultural</option>  
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
                          onChange={(e) => setPrograma({...programa, duracion: e.target.value})}  
                          required  
                        />  
                      </FormGroup>  
                    </Col>  
                  </Row>  
                  <FormGroup>  
                    <Label>Días de Emisión</Label>  
                    <Input  
                      type="text"  
                      placeholder="Ej: Lunes a Viernes"  
                      value={programa.diasEmision}  
                      onChange={(e) => setPrograma({...programa, diasEmision: e.target.value})}  
                      required  
                    />  
                  </FormGroup>  
                  <FormGroup>  
                    <Label>Descripción</Label>  
                    <Input  
                      type="textarea"  
                      rows="3"  
                      value={programa.descripcion}  
                      onChange={(e) => setPrograma({...programa, descripcion: e.target.value})}  
                    />  
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