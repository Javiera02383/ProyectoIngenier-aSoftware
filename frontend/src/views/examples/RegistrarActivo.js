import React, { useState, useEffect } from "react";
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

  const [empleados, setEmpleados] = useState([]);
  const navigate = useNavigate();

  // Cargar empleados al montar el componente
  useEffect(() => {
    const fetchEmpleados = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:4051/api/optica/empleados/todos-empleados", {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("Error al cargar empleados");
        const data = await res.json();
        setEmpleados(data);
      } catch (error) {
        console.error("Error cargando empleados", error);
      }
    };
    fetchEmpleados();
  }, []);

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
      const response = await fetch("http://localhost:4051/api/optica/inventario/nuevoInventario", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Activo registrado con éxito!");
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
        // Opcional: navigate("/admin/inventario");
      } else {
        const errorData = await response.json();
        alert(`Error al registrar el activo: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error de red:", error);
      alert("No se pudo conectar con el servidor.");
    }
  };

  return (
    <>
      <HeaderBlanco />
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
                  <h6 className="heading-small text-muted mb-4">Información del Activo</h6>
                  <div className="pl-lg-4">
                    <Row>
                      <Col lg="6">
                        <FormGroup>
                          <Label>Código</Label>
                          <Input
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
                          <Label>Nombre</Label>
                          <Input
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
                          <Label>Descripción</Label>
                          <Input
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
                          <Label>Cantidad</Label>
                          <Input
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
                          <Label>Ubicación</Label>
                          <Input
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
                          <Label>Empleado Asignado</Label>
                          <Input
                            type="select"
                            name="idEmpleado"
                            value={formData.idEmpleado}
                            onChange={handleChange}
                            required
                          >
                            <option value="">Seleccione un empleado</option>
                            {empleados.map((emp) => (
                              <option key={emp.idEmpleado} value={emp.idEmpleado}>
                                {emp.persona?.Pnombre} {emp.persona?.Snombre} {emp.persona?.Papellido} {emp.persona?.Sapellido}
                              </option>
                            ))}
                          </Input>
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg="6">
                        <FormGroup>
                          <Label>Valor</Label>
                          <Input
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
                          <Label>Estado</Label>
                          <Input
                            type="select"
                            name="estado"
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
                          <Label>Observación</Label>
                          <Input
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
