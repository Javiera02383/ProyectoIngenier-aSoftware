import React, { useState, useEffect } from "react";
import {
  Badge,
  Card,
  CardHeader,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Media,
  Table,
  Container,
  Row,
  FormGroup,
  Input,
  Label,
  Col,
  Spinner,
} from "reactstrap";

import axios from "axios";
import HeaderBlanco from "components/Headers/HeaderBlanco.js";

const ListaActivos = () => {
  const [inventarioOriginal, setInventarioOriginal] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [uniqueCategories, setUniqueCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        const token = localStorage.getItem("token"); // o como estés guardando tu JWT

        const res = await axios.get("http://localhost:4051/api/optica/inventario/todos", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const data = res.data;

        setInventarioOriginal(data);
        setCargando(false);

        const categorias = [...new Set(data.map(item => item.nombre))]; // o usa otra propiedad si tienes una categoría real
        setUniqueCategories(["all", ...categorias]);
      } catch (error) {
        console.error("Error al obtener el inventario:", error);
        setCargando(false);
      }
    };

    obtenerDatos();
  }, []);

  const filteredAssets = inventarioOriginal.filter(asset => {
    const matchesCategory = selectedCategory === "all" || asset.Nombre === selectedCategory;
    const matchesSearch =
      asset.nombre?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.codigo?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.descripcion?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.ubicacion?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset?.Empleado?.nombre?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.observacion?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <>
      <HeaderBlanco />
      <Container className="mt--7" fluid>
        <Row className="mb-4">
          <Col md="4">
            <FormGroup>
              <Label>Filtrar por Categoría:</Label>
              <Input
                type="select"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="form-control-alternative"
              >
                {uniqueCategories.map(category => (
                  <option key={category} value={category}>
                    {category === "all" ? "Todas las Categorías" : category}
                  </option>
                ))}
              </Input>
            </FormGroup>
          </Col>
          <Col md="5">
            <FormGroup>
              <Label>Buscar por Nombre, Código o Detalles:</Label>
              <Input
                type="text"
                placeholder="Ej. Laptop, INV001, oficina"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="form-control-alternative"
              />
            </FormGroup>
          </Col>
        </Row>

        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader className="border-0">
                <h3 className="mb-0">Inventario de Activos</h3>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th>CÓDIGO</th>
                    <th>NOMBRE</th>
                    <th>DESCRIPCIÓN</th>
                    <th>CANTIDAD</th>
                    <th>UBICACIÓN</th>
                    <th>ASIGNADO</th>
                    <th>OBSERVACIÓN</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {cargando ? (
                    <tr><td colSpan="8" className="text-center"><Spinner /> Cargando...</td></tr>
                  ) : filteredAssets.length > 0 ? (
                    filteredAssets.map((asset) => (
                      <tr key={asset.codigo}>
                        <td>{asset.codigo}</td>
                        <td>{asset.nombre}</td>
                        <td>{asset.descripcion}</td>
                        <td>{asset.cantidad}</td>
                        <td>{asset.ubicacion}</td>
                        <td>{asset.Empleado?.nombre || "No asignado"}</td>
                        <td>{asset.observacion}</td>
                        <td className="text-right">
                          <UncontrolledDropdown>
                            <DropdownToggle className="btn-icon-only text-light" href="#" size="sm">
                              <i className="fas fa-ellipsis-v" />
                            </DropdownToggle>
                            <DropdownMenu className="dropdown-menu-arrow" right>
                              <DropdownItem href="#">Ver Detalles</DropdownItem>
                              <DropdownItem href="#">Editar</DropdownItem>
                              <DropdownItem href="#">Eliminar</DropdownItem>
                            </DropdownMenu>
                          </UncontrolledDropdown>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="text-center">No hay activos registrados o que coincidan con los filtros.</td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Card>
          </div>
        </Row>
      </Container>
    </>
  );
};

export default ListaActivos;
