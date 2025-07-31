import React, { useState } from "react";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  Container,
  Row,
  Col,
  Table,
} from "reactstrap";

// Header del dashboard
import UserHeader from "components/Headers/UserHeader.js";

const Clientes = () => {
  const [clientes, setClientes] = useState([
    {
      idCliente: 1,
      Nombre: "Carlos",
      Apellido: "Ramírez",
      RTN: "0801199912345",
      Correo: "carlos@example.com",
      Estado: "A",
    },
    {
      idCliente: 2,
      Nombre: "Ana",
      Apellido: "Gómez",
      RTN: "0801200034567",
      Correo: "ana@example.com",
      Estado: "A",
    },
    {
      idCliente: 3,
      Nombre: "Luis",
      Apellido: "Martínez",
      RTN: null,
      Correo: "luis@example.com",
      Estado: "I",
    },
  ]);

  const handleEditar = (id) => {
    alert(`Editar cliente con ID: ${id}`);
  };

  const handleEliminar = (id) => {
    if (window.confirm("¿Seguro que deseas eliminar este cliente?")) {
      const nuevosClientes = clientes.filter((c) => c.idCliente !== id);
      setClientes(nuevosClientes);
    }
  };

  return (
    <>
      <UserHeader />
      <Container className="mt--7" fluid>
        <Row>
          <Col>
            <Card className="shadow">
              <CardHeader className="d-flex justify-content-between align-items-center">
                <h3 className="mb-0">Gestión de Clientes</h3>
                <Button color="success" size="sm" onClick={() => alert("Registrar nuevo cliente")}>
                  Registrar Cliente
                </Button>
              </CardHeader>
              <CardBody>
                <Table className="align-items-center table-flush" responsive>
                  <thead className="thead-light">
                    <tr>
                      <th>ID</th>
                      <th>Nombre</th>
                      <th>RTN</th>
                      <th>Correo</th>
                      <th>Estado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clientes.map((cliente) => (
                      <tr key={cliente.idCliente}>
                        <td>{cliente.idCliente}</td>
                        <td>{cliente.Nombre} {cliente.Apellido}</td>
                        <td>{cliente.RTN || "N/A"}</td>
                        <td>{cliente.Correo}</td>
                        <td>{cliente.Estado === "A" ? "Activo" : "Inactivo"}</td>
                        <td>
                          <Button
                            color="info"
                            size="sm"
                            className="mr-2"
                            onClick={() => handleEditar(cliente.idCliente)}
                          >
                            Editar
                          </Button>
                          <Button
                            color="danger"
                            size="sm"
                            onClick={() => handleEliminar(cliente.idCliente)}
                          >
                            Eliminar
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Clientes;
