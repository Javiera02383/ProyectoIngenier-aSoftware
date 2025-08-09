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
  Alert,    
} from "reactstrap";    
import HeaderBlanco from "components/Headers/HeaderBlanco.js";    
import { useNavigate } from "react-router-dom";    
import { inventarioService } from '../../services/inventario/inventarioService';    
import { useToast } from '../../hooks/useToast';    
import Toast from 'components/Toast/Toast';    
    
const GestionarStock = () => {    
  // Estados para datos del inventario    
  const [inventoryData, setInventoryData] = useState([]);    
  const [loading, setLoading] = useState(true);    
  const [loadingSubmit, setLoadingSubmit] = useState(false);    
      
  // Estados del formulario - SOLO SALIDAS  
  const [selectedAssetId, setSelectedAssetId] = useState("");    
  const [quantity, setQuantity] = useState("");    
  // Removido movementType ya que solo será salida  
      
  // Estados para mensajes    
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });    
      
  const navigate = useNavigate();    
  const { toast, showSuccess, showError, hideToast } = useToast();    
    
  // Cargar datos del inventario al montar el componente    
  useEffect(() => {    
    const cargarInventario = async () => {    
      try {    
        setLoading(true);    
        const data = await inventarioService.obtenerInventarios();    
        setInventoryData(Array.isArray(data) ? data : []);    
      } catch (error) {    
        console.error('Error al cargar inventario:', error);    
        showError('Error al cargar el inventario');    
        setInventoryData([]);    
      } finally {    
        setLoading(false);    
      }    
    };    
    
    cargarInventario();    
  }, [showError]);    
    
  // Función para actualizar stock    
  const updateStock = async (assetId, newQuantity) => {    
    try {    
      setLoadingSubmit(true);    
      await inventarioService.actualizarInventario(assetId, { cantidad: newQuantity });    
          
      // Actualizar el estado local    
      setInventoryData(prevData =>     
        prevData.map(asset =>     
          asset.idInventario === parseInt(assetId)     
            ? { ...asset, cantidad: newQuantity }    
            : asset    
        )    
      );    
          
      showSuccess('Stock actualizado exitosamente');    
      return true;    
    } catch (error) {    
      console.error('Error al actualizar stock:', error);    
      showError('Error al actualizar el stock');    
      return false;    
    } finally {    
      setLoadingSubmit(false);    
    }    
  };    
    
  const handleSubmit = async (e) => {    
    e.preventDefault();    
    setMensaje({ tipo: '', texto: '' });    
    
    if (!selectedAssetId || quantity <= 0) {    
      setMensaje({ tipo: 'danger', texto: 'Por favor, selecciona un activo y una cantidad válida.' });    
      return;    
    }    
    
    const qty = parseInt(quantity);    
    if (isNaN(qty) || qty <= 0) {    
      setMensaje({ tipo: 'danger', texto: 'La cantidad debe ser un número positivo.' });    
      return;    
    }    
    
    const currentAsset = inventoryData.find(asset => asset.idInventario === parseInt(selectedAssetId));    
    if (!currentAsset) {    
      setMensaje({ tipo: 'danger', texto: 'Activo no encontrado.' });    
      return;    
    }    
    
    // SOLO SALIDAS - Verificar stock suficiente  
    if (currentAsset.cantidad < qty) {    
      setMensaje({   
        tipo: 'danger',   
        texto: `No hay suficiente stock para la salida. Stock actual: ${currentAsset.cantidad}`   
      });    
      return;    
    }    
      
    const newQuantity = currentAsset.cantidad - qty;    
    
    // Actualizar stock    
    const success = await updateStock(selectedAssetId, newQuantity);    
        
    if (success) {    
      setMensaje({     
        tipo: 'success',     
        texto: `Salida registrada: ${qty} unidades de ${currentAsset.nombre}. Stock actual: ${newQuantity}`     
      });    
          
      // Limpiar formulario    
      setSelectedAssetId("");    
      setQuantity("");    
          
      // Opcional: redirigir después de un tiempo    
      setTimeout(() => {    
        navigate("/admin/lista-activos");    
      }, 2000);    
    }    
  };    
    
  // Función para renderizar opciones del select    
  const renderAssetOptions = () => {    
    if (loading) {    
      return <option value="">Cargando activos...</option>;    
    }    
        
    if (!Array.isArray(inventoryData) || inventoryData.length === 0) {    
      return <option value="">No hay activos disponibles</option>;    
    }    
    
    return inventoryData.map((asset) => (    
      <option key={asset.idInventario} value={asset.idInventario}>    
        {asset.codigo} - {asset.nombre} (Stock actual: {asset.cantidad || 0})    
      </option>    
    ));    
  };    
    
  return (    
    <>    
      <HeaderBlanco />    
      <Toast show={toast.show} message={toast.message} type={toast.type} onClose={hideToast} />    
      <Container className="mt--7" fluid>    
        <Row>    
          <Col className="order-xl-1" xl="12">    
            <Card className="bg-secondary shadow">    
              <CardHeader className="bg-white border-0">    
                <Row className="align-items-center">    
                  <Col xs="8">    
                    <h3 className="mb-0">Gestionar Stock de Activos - Solo Salidas</h3>    
                    <p className="text-sm mb-0 text-muted">  
                      Registrar salidas de stock de activos del inventario  
                    </p>  
                  </Col>    
                  <Col xs="4" className="text-right">    
                    <Button    
                      color="secondary"    
                      onClick={() => navigate("/admin/lista-activos")}    
                      size="sm"    
                    >    
                      Volver a Lista    
                    </Button>    
                  </Col>    
                </Row>    
              </CardHeader>    
              <CardBody>    
                <Form onSubmit={handleSubmit}>    
                  <h6 className="heading-small text-muted mb-4">    
                    <i className="fas fa-minus-circle mr-2 text-danger" />  
                    Salida de Stock    
                  </h6>    
                      
                  {/* Mostrar mensajes */}    
                  {mensaje.texto && (    
                    <Alert color={mensaje.tipo} className="mb-4">    
                      {mensaje.texto}    
                    </Alert>    
                  )}    
                      
                  <div className="pl-lg-4">    
                    <Row>    
                      <Col lg="6">    
                        <FormGroup>    
                          <Label htmlFor="input-asset">Seleccionar Activo *</Label>    
                          <Input    
                            type="select"    
                            id="input-asset"    
                            className="form-control-alternative"    
                            value={selectedAssetId}    
                            onChange={(e) => setSelectedAssetId(e.target.value)}    
                            required    
                            disabled={loading}    
                          >    
                            <option value="">Selecciona un activo...</option>    
                            {renderAssetOptions()}    
                          </Input>    
                        </FormGroup>    
                      </Col>    
                      <Col lg="6">    
                        <FormGroup>    
                          <Label htmlFor="input-quantity">Cantidad a Retirar *</Label>    
                          <Input    
                            className="form-control-alternative"    
                            id="input-quantity"    
                            placeholder="Cantidad a retirar"    
                            type="number"    
                            value={quantity}    
                            onChange={(e) => setQuantity(e.target.value)}    
                            required    
                            min="1"    
                            disabled={loading || loadingSubmit}    
                          />    
                          <small className="form-text text-muted">  
                            Solo se permiten salidas de stock  
                          </small>  
                        </FormGroup>    
                      </Col>    
                    </Row>    
                  </div>    
                  <hr className="my-4" />    
                  <div className="text-center">    
                    <Button     
                      color="danger"     
                      type="submit"    
                      disabled={loading || loadingSubmit || !selectedAssetId || !quantity}    
                    >    
                      <i className="fas fa-minus mr-2" />  
                      {loadingSubmit ? 'Procesando...' : 'Registrar Salida'}    
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
    
export default GestionarStock;