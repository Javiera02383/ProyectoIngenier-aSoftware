import React, { useState } from "react";
import {
  Card, CardBody, CardHeader,
  Container, Row, Col,
  Table, Button, FormGroup, Label, Input, Form, Badge
} from "reactstrap";
import HeaderResponsive from "components/Headers/HeaderResponsive";

const Contratos = () => {
  const [contratos, setContratos] = useState([]);
  const [nuevoContrato, setNuevoContrato] = useState({
    cliente: "",
    categoria:"",
    estadoPago: "Pendiente", 
    tipoPublicidad: "",
    descripcion: "",
    fechaInicio: "",
    fechaFin: "",
    montoContrato: "",
    SaldoContrato: "",
    renovable: false,
    activo: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNuevoContrato({
      ...nuevoContrato,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const agregarContrato = () => {
    if (!nuevoContrato.cliente || !nuevoContrato.descripcion || !nuevoContrato.tipoPublicidad || !nuevoContrato.fechaInicio || !nuevoContrato.fechaFin || !nuevoContrato.monto) {
      alert("Todos los campos son obligatorios.");
      return;
    }
    setContratos([...contratos, { ...nuevoContrato }]);
    setNuevoContrato({
      cliente: "",
      tipoPublicidad: "",
      descripcion: "",
      fechaInicio: "",
      fechaFin: "",
      monto: "",
      renovable: false,
      activo: true,
    });
  };

  return (
    <>
      <HeaderResponsive />
      <Container className="mt-4">
        <Card>
          <CardHeader><h4>Gestión de Contratos Publicitarios</h4></CardHeader>
          <CardBody>
            <Form>
              <Row form>
                <Col md={6}>
                  <FormGroup>
                    <Label>Cliente</Label>
                    <Input
                      name="cliente"
                      value={nuevoContrato.cliente}
                      onChange={handleChange}
                      placeholder="Nombre del cliente"
                    />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label>Tipo de Publicidad</Label>
                    <Input
                      type="select"
                      name="tipoPublicidad"
                      value={nuevoContrato.tipoPublicidad}
                      onChange={handleChange}
                    >
                      <option value="">Seleccionar...</option>
                      <option value="TV">TV</option>
                      <option value="Redes Sociales">Redes Sociales</option>
                      <option value="Radio">Radio</option>
                      <option value="Otro">Otro</option>
                    </Input>
                  </FormGroup>
                </Col>
              </Row>

              <Row form>
                <Col md={12}>
                  <FormGroup>
                    <Label>Descripción</Label>
                    <Input
                      type="textarea"
                      name="descripcion"
                      value={nuevoContrato.descripcion}
                      onChange={handleChange}
                      placeholder="Descripción del contrato"
                    />
                  </FormGroup>
                </Col>
              </Row>

              <Row form>
                <Col md={4}>
                  <FormGroup>
                    <Label>Fecha de Inicio</Label>
                    <Input
                      type="date"
                      name="fechaInicio"
                      value={nuevoContrato.fechaInicio}
                      onChange={handleChange}
                    />
                  </FormGroup>
                </Col>
                <Col md={4}>
                  <FormGroup>
                    <Label>Fecha de Fin</Label>
                    <Input
                      type="date"
                      name="fechaFin"
                      value={nuevoContrato.fechaFin}
                      onChange={handleChange}
                    />
                  </FormGroup>
                </Col>
                <Col md={4}>
                  <FormGroup>
                    <Label>Monto del Contrato (L)</Label>
                    <Input
                      type="number"
                      name="monto"
                      value={nuevoContrato.monto}
                      onChange={handleChange}
                      placeholder="Monto en lempiras"
                    />
                  </FormGroup>
                </Col>
              </Row>

              <Row form>
                <Col md={2}>
                  <FormGroup check className="mt-4">
                    <Label check>
                      <Input
                        type="checkbox"
                        name="renovable"
                        checked={nuevoContrato.renovable}
                        onChange={handleChange}
                      />
                      Renovable
                    </Label>
                  </FormGroup>
                </Col>
                <Col md={2}>
                  <FormGroup check className="mt-4">
                    <Label check>
                      <Input
                        type="checkbox"
                        name="activo"
                        checked={nuevoContrato.activo}
                        onChange={handleChange}
                      />
                      Activo
                    </Label>
                  </FormGroup>
                </Col>
              </Row>

              <Button className="mt-4" color="primary" onClick={agregarContrato}>
                Guardar Contrato
              </Button>
            </Form>

            <hr />
            <h5 className="mt-4">Lista de Contratos</h5>
            <Table responsive striped>
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>Tipo</th>
                  <th>Descripción</th>
                  <th>Inicio</th>
                  <th>Fin</th>
                  <th>Monto</th>
                  <th>Renovable</th>
                  <th>Activo</th>
                </tr>
              </thead>
              <tbody>
                {contratos.map((c, idx) => (
                  <tr key={idx}>
                    <td>{c.cliente}</td>
                    <td>{c.tipoPublicidad}</td>
                    <td>{c.descripcion}</td>
                    <td>{c.fechaInicio}</td>
                    <td>{c.fechaFin}</td>
                    <td>L {parseFloat(c.monto).toFixed(2)}</td>
                    <td>
                      <Badge color={c.renovable ? "info" : "secondary"}>
                        {c.renovable ? "Sí" : "No"}
                      </Badge>
                    </td>
                    <td>
                      <Badge color={c.activo ? "success" : "danger"}>
                        {c.activo ? "Activo" : "Inactivo"}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </CardBody>
        </Card>
      </Container>
    </>
  );
};

export default Contratos;
