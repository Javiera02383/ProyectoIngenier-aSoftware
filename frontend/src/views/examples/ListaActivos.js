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
  Col
} from "reactstrap";

import HeaderBlanco from "components/Headers/HeaderBlanco.js";
import productosDePrueba from 'data/productosDePrueba'; 

const ListaActivos = () => { 
  const [inventarioOriginal, setInventarioOriginal] = useState([]); 
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [uniqueCategories, setUniqueCategories] = useState([]); 
  const [searchQuery, setSearchQuery] = useState("");

  
  useEffect(() => {
    setInventarioOriginal(productosDePrueba);

    if (productosDePrueba && productosDePrueba.length > 0) {
      const categories = [...new Set(productosDePrueba.map(asset => asset.categoria))];
      setUniqueCategories(["all", ...categories]);
    } else {
      setUniqueCategories(["all"]);
    }
  }, []); 

  const filteredAssets = inventarioOriginal.filter(asset => { 
    
    const matchesCategory = selectedCategory === "all" || asset.categoria === selectedCategory; 
    
    const matchesSearch = asset.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          asset.codigo.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (asset.descripcion && asset.descripcion.toLowerCase().includes(searchQuery.toLowerCase())) || 
                          (asset.ubicacion && asset.ubicacion.toLowerCase().includes(searchQuery.toLowerCase())) ||   
                          (asset.asignado && asset.asignado.toLowerCase().includes(searchQuery.toLowerCase())) ||     
                          (asset.observacion && asset.observacion.toLowerCase().includes(searchQuery.toLowerCase())); 
    return matchesCategory && matchesSearch; 
  });

  return (
    <>
      <HeaderBlanco />
      {}
      <Container className="mt--7" fluid>
        {}
        <Row className="mb-4">
          {}
          <Col md="4">
            <FormGroup>
              <Label htmlFor="category-filter">Filtrar por Categoría:</Label>
              <Input
                type="select"
                id="category-filter"
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
              <Label htmlFor="search-input">Buscar por Nombre, Código o Detalles:</Label>
              <Input
                type="text"
                id="search-input"
                placeholder="Ej. Laptop, INV001, PC de escritorio, Juan Pérez, En uso"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="form-control-alternative"
              />
            </FormGroup>
          </Col>
        </Row>
        {}
        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader className="border-0">
                <h3 className="mb-0">Inventario de Activos</h3>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">CÓDIGO</th>
                    <th scope="col">NOMBRE</th>
                    <th scope="col">DESCRIPCIÓN</th>
                    <th scope="col">CANTIDAD</th>
                    <th scope="col">UBICACIÓN</th>
                    <th scope="col">ASIGNADO</th>
                    <th scope="col">OBSERVACIÓN</th>
                    <th scope="col" /> 
                  </tr>
                </thead>
                <tbody>
                  {filteredAssets.length > 0 ? (
                    filteredAssets.map((asset) => (
                      <tr key={asset.codigo}>
                        <th scope="row">
                          <Media className="align-items-center">
                            <Media>
                              <span className="mb-0 text-sm">
                                {asset.codigo}
                              </span>
                            </Media>
                          </Media>
                        </th>
                        <td>{asset.nombre}</td>
                        <td>{asset.descripcion}</td>
                        <td>{asset.cantidad}</td>
                        <td>{asset.ubicacion}</td>
                        <td>{asset.asignado}</td>
                        <td>{asset.observacion}</td>
                        <td className="text-right">
                          <UncontrolledDropdown>
                            <DropdownToggle
                              className="btn-icon-only text-light"
                              href="#pablo"
                              role="button"
                              size="sm"
                              color=""
                              onClick={(e) => e.preventDefault()}
                            >
                              <i className="fas fa-ellipsis-v" />
                            </DropdownToggle>
                            <DropdownMenu className="dropdown-menu-arrow" right>
                              <DropdownItem
                                href="#pablo"
                                onClick={(e) => e.preventDefault()}
                              >
                                Ver Detalles
                              </DropdownItem>
                              <DropdownItem
                                href="#pablo"
                                onClick={(e) => e.preventDefault()}
                              >
                                Editar
                              </DropdownItem>
                              <DropdownItem
                                href="#pablo"
                                onClick={(e) => e.preventDefault()}
                              >
                                Eliminar
                              </DropdownItem>
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