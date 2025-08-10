import React, { useState, useEffect } from "react";
import {
  Badge,
  Card,
  CardHeader,
  DropdownMenu,
  DropdownItem,
  Dropdown,  
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
import { useNavigate } from 'react-router-dom';  
import { inventarioService } from '../../services/inventario/inventarioService';  
import { useToast } from '../../hooks/useToast';
import HeaderBlanco from "components/Headers/HeaderBlanco.js";
import Toast from 'components/Toast/Toast';  

const ListaActivos = () => {
  const [inventarioOriginal, setInventarioOriginal] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [uniqueCategories, setUniqueCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [cargando, setCargando] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState({}); 

  const navigate = useNavigate();  
  const { toast, showSuccess, showError, hideToast } = useToast();

  useEffect(() => {  
    const obtenerDatos = async () => {  
      try {  
        const data = await inventarioService.obtenerInventarios();  
        setInventarioOriginal(Array.isArray(data) ? data : []);  
        setCargando(false);  
  
        // Obtener categorías únicas basadas en el nombre del activo
        const categorias = [...new Set(data.map(item => item.nombre))].filter(Boolean);
        setUniqueCategories(["all", ...categorias]);  
      } catch (error) {  
        console.error("Error al obtener el inventario:", error);  
        showError("Error al cargar el inventario");  
        setCargando(false);  
      }  
    }; 

    obtenerDatos();
  }, [showError]);

    const toggleDropdown = (id) => {  
    setDropdownOpen(prevState => ({ ...prevState, [id]: !prevState[id] }));  
  };  
  
  const handleEdit = (id) => {  
    navigate(`/admin/editar-activo/${id}`);  
  };  
  
  const handleDelete = async (id) => {  
    if (window.confirm('¿Estás seguro de eliminar este activo?')) {  
      try {  
        console.log('Intentando eliminar activo con ID:', id);
        const response = await inventarioService.eliminarInventario(id);  
        console.log('Respuesta del servidor:', response);
        setInventarioOriginal(inventarioOriginal.filter(a => a.idInventario !== id));  
        showSuccess('Activo eliminado exitosamente');  
      } catch (error) {  
        console.error('Error detallado al eliminar activo:', error);
        const errorMessage = error.response?.data?.mensaje || error.message || 'Error al eliminar el activo';
        showError(`Error al eliminar el activo: ${errorMessage}`);  
      }  
    }  
  };  
  
  const handleViewDetails = (id) => {  
    navigate(`/admin/detalle-activo/${id}`);  
  };

  const limpiarFiltros = () => {
    setSelectedCategory("all");
    setSearchQuery("");
  }; 

  // Función para normalizar texto (eliminar acentos y convertir a minúsculas)
  const normalizarTexto = (texto) => {
    if (!texto) return '';
    return texto
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Eliminar acentos
      .toLowerCase()
      .trim();
  };

  // Definir filteredAssets antes de usarlo en useEffect
  const filteredAssets = inventarioOriginal.filter(asset => {
    // Filtro por categoría
    const matchesCategory = selectedCategory === "all" || asset.nombre === selectedCategory;
    
    // Filtro de búsqueda insensible a acentos y mayúsculas
    const searchTerm = normalizarTexto(searchQuery);
    const matchesSearch = searchTerm === "" || (
      (asset.nombre && normalizarTexto(asset.nombre).includes(searchTerm)) ||
      (asset.codigo && normalizarTexto(asset.codigo).includes(searchTerm)) ||
      (asset.descripcion && normalizarTexto(asset.descripcion).includes(searchTerm)) ||
      (asset.ubicacion && normalizarTexto(asset.ubicacion).includes(searchTerm)) ||
      (asset?.Empleado?.persona?.nombreCompleto && normalizarTexto(asset.Empleado.persona.nombreCompleto).includes(searchTerm)) ||
      (asset.observacion && normalizarTexto(asset.observacion).includes(searchTerm))
    );

    return matchesCategory && matchesSearch;
  });

  // Debug: Loggear cambios en filtros (después de que filteredAssets esté definido)
  useEffect(() => {
    if (searchQuery) {
      console.log('Búsqueda normalizada:', {
        original: searchQuery,
        normalizada: normalizarTexto(searchQuery)
      });
    }
    console.log('Filtros actualizados:', {
      selectedCategory,
      searchQuery,
      totalAssets: inventarioOriginal.length,
      filteredAssets: filteredAssets.length
    });
  }, [selectedCategory, searchQuery, inventarioOriginal.length, filteredAssets.length]);

  return (
    <>
      <HeaderBlanco />
      <Container className="mt--7" fluid>
        <Row className="mb-4">
          <Col md="4">
            <FormGroup>
              <Label>Filtrar por Activo:</Label>
              <Input
                type="select"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="form-control-alternative"
              >
                {uniqueCategories.map(category => (
                  <option key={category} value={category}>
                    {category === "all" ? "Todas los productos" : category}
                  </option>
                ))}
              </Input>
            </FormGroup>
          </Col>
          <Col md="5">
                         <FormGroup>
               <Label>Buscar en todos los campos:</Label>
                             <Input
                 type="text"
                 placeholder="Buscar por nombre, código, descripción, ubicación, empleado..."
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 className="form-control-alternative"
               />
            </FormGroup>
          </Col>
          <Col md="3">
            <FormGroup>
              <Label>Resultados:</Label>
              <div className="form-control-plaintext">
                <Badge color="default">
                  {filteredAssets.length} de {inventarioOriginal.length} activos
                </Badge>
              </div>
            </FormGroup>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col md="12" className="text-right">
            <button
              type="button"
              className="btn btn-outline-secondary btn-sm"
              onClick={limpiarFiltros}
              disabled={selectedCategory === "all" && searchQuery === ""}
            >
              <i className="fas fa-times mr-1"></i>
              Limpiar Filtros
            </button>
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
                    <th>ACCIONES</th>
                    <th>CÓDIGO</th>
                    <th>NOMBRE</th>
                    <th>DESCRIPCIÓN</th>
                    <th>CANTIDAD</th>
                    <th>UBICACIÓN</th>
                    <th>ASIGNADO</th>
                    <th>OBSERVACIÓN</th>
                    
                  </tr>
                </thead>
                <tbody>
                  {cargando ? (
                    <tr><td colSpan="8" className="text-center"><Spinner /> Cargando...</td></tr>
                  ) : filteredAssets.length > 0 ? (
                    filteredAssets.map((asset) => (
                      <tr key={asset.codigo}>
                        <td className="text-right">
                          <Dropdown isOpen={dropdownOpen[asset.idInventario]} toggle={() => toggleDropdown(asset.idInventario)}>  
                              <DropdownToggle className="btn-icon-only text-light" size="sm">  
                                <i className="fas fa-ellipsis-v" />  
                              </DropdownToggle>  
                              <DropdownMenu className="dropdown-menu-arrow" right>  
                                <DropdownItem onClick={() => handleViewDetails(asset.idInventario)}>Ver Detalles</DropdownItem>  
                                <DropdownItem onClick={() => handleEdit(asset.idInventario)}>Editar</DropdownItem>  
                                <DropdownItem onClick={() => handleDelete(asset.idInventario)}>Eliminar</DropdownItem>  
                              </DropdownMenu>  
                            </Dropdown>
                        </td>
                        <td>{asset.codigo}</td>
                        <td>{asset.nombre}</td>
                        <td>{asset.descripcion}</td>
                        <td>{asset.cantidad}</td>
                        <td>{asset.ubicacion}</td>
                                                 <td>{asset.Empleado?.persona?.nombreCompleto || "No asignado"}</td>
                        <td>{asset.observacion}</td>

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
