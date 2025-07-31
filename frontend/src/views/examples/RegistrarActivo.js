import React, { useState } from "react";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  Label,
  Container,
  Row,
  Col,
} from "reactstrap";
import HeaderBlanco from "components/Headers/HeaderBlanco.js";
import { useNavigate } from "react-router-dom";

const RegistrarActivo = () => {
  const [formData, setFormData] = useState({
    codigo: "",
    nombre: "",
    descripcion: "",
    cantidad: 1,
    ubicacion: "",
    idEmpleado: "",
    valor: "",
    estado: "Disponible",
    observacion: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Envía los datos al backend a la URL correcta
      const response = await fetch("/inventario", {
  // ...
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Puedes añadir un token de autorización si lo usas
          // 'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Activo registrado con éxito!");
        // Limpia el formulario después de un registro exitoso
        setFormData({
          codigo: "",
          nombre: "",
          descripcion: "",
          cantidad: 1,
          ubicacion: "",
          idEmpleado: "",
          valor: "",
          estado: "Disponible",
          observacion: "",
        });
        // Opcional: Redirigir a la lista de activos después del registro
        // navigate("/admin/inventario");
      } else {
        const errorData = await response.json();
        alert(`Error al registrar el activo: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error de red:", error);
      alert("No se pudo conectar con el servidor para registrar el activo.");
    }
  };

  return (
    <>
      <HeaderBlanco />
      {/* Page content */}
      <Container className="mt--7" fluid>
        <Row>
          <Col className="order-xl-1" xl="12">
            <Card className="bg-secondary shadow">
              <CardHeader className="bg-white border-0">
                <Row className="align-items-center">
                  <Col xs="8">
                    <h3 className="mb-0">Registrar Nuevo Activo</h3>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                <Form onSubmit={handleSubmit}>
                  <h6 className="heading-small text-muted mb-4">
                    Información del Activo
                  </h6>
                  <div className="pl-lg-4">
                    <Row>
                      <Col lg="6">
                        <FormGroup>
                          <Label htmlFor="input-codigo">Código</Label>
                          <Input
                            className="form-control-alternative"
                            id="input-codigo"
                            name="codigo"
                            placeholder="Ej. LAP-001"
                            type="text"
                            value={formData.codigo}
                            onChange={handleChange}
                            required
                          />
                        </FormGroup>
                      </Col>
                      <Col lg="6">
                        <FormGroup>
                          <Label htmlFor="input-nombre">Nombre</Label>
                          <Input
                            className="form-control-alternative"
                            id="input-nombre"
                            name="nombre"
                            placeholder="Ej. Laptop Dell"
                            type="text"
                            value={formData.nombre}
                            onChange={handleChange}
                            required
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg="6">
                        <FormGroup>
                          <Label htmlFor="input-descripcion">Descripción</Label>
                          <Input
                            className="form-control-alternative"
                            id="input-descripcion"
                            name="descripcion"
                            placeholder="Ej. Laptop empresarial con 16GB RAM"
                            type="text"
                            value={formData.descripcion}
                            onChange={handleChange}
                          />
                        </FormGroup>
                      </Col>
                      <Col lg="6">
                        <FormGroup>
                          <Label htmlFor="input-cantidad">Cantidad</Label>
                          <Input
                            className="form-control-alternative"
                            id="input-cantidad"
                            name="cantidad"
                            type="number"
                            min="1"
                            value={formData.cantidad}
                            onChange={handleChange}
                            required
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg="6">
                        <FormGroup>
                          <Label htmlFor="input-ubicacion">Ubicación</Label>
                          <Input
                            className="form-control-alternative"
                            id="input-ubicacion"
                            name="ubicacion"
                            placeholder="Ej. Oficina 101"
                            type="text"
                            value={formData.ubicacion}
                            onChange={handleChange}
                          />
                        </FormGroup>
                      </Col>
                      <Col lg="6">
                        <FormGroup>
                          <Label htmlFor="input-idEmpleado">ID Empleado Asignado</Label>
                          <Input
                            className="form-control-alternative"
                            id="input-idEmpleado"
                            name="idEmpleado"
                            placeholder="Ej. 1"
                            type="number"
                            value={formData.idEmpleado}
                            onChange={handleChange}
                            required
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg="6">
                        <FormGroup>
                          <Label htmlFor="input-valor">Valor</Label>
                          <Input
                            className="form-control-alternative"
                            id="input-valor"
                            name="valor"
                            placeholder="Ej. 950.00"
                            type="number"
                            step="0.01"
                            value={formData.valor}
                            onChange={handleChange}
                          />
                        </FormGroup>
                      </Col>
                      <Col lg="6">
                        <FormGroup>
                          <Label htmlFor="input-estado">Estado</Label>
                          <Input
                            type="select"
                            id="input-estado"
                            name="estado"
                            className="form-control-alternative"
                            value={formData.estado}
                            onChange={handleChange}
                          >
                            <option value="Disponible">Disponible</option>
                            <option value="Asignado">Asignado</option>
                            <option value="En Mantenimiento">En Mantenimiento</option>
                            <option value="Baja">Baja</option>
                          </Input>
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg="12">
                        <FormGroup>
                          <Label htmlFor="input-observacion">Observación</Label>
                          <Input
                            className="form-control-alternative"
                            id="input-observacion"
                            name="observacion"
                            placeholder="Notas o comentarios adicionales"
                            rows="4"
                            type="textarea"
                            value={formData.observacion}
                            onChange={handleChange}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                  </div>
                  <hr className="my-4" />
                  <div className="text-center">
                    <Button color="primary" type="submit">
                      Registrar Activo
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

export default RegistrarActivo;