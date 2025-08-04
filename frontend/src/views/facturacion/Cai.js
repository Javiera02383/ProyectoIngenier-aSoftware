import React, { useState, useEffect } from "react";    
import {    
  Button,    
  Card,    
  CardBody,    
  CardHeader,    
  Container,    
  Row,    
  Col,    
  FormGroup,    
  Label,    
  Input,    
  Alert,    
  Spinner,  
} from "reactstrap";    
import HeaderResponsive from "components/Headers/HeaderResponsive";    
import { caiService } from "../../services/facturacion/caiService";    
  
const CAI = () => {    
  const [caiData, setCaiData] = useState({    
    codigoCAI: "254F8-612F1-8A0E0-6E8B3-0099B876",    
    numeroFacturaInicio: "000-001-01-00000001",    
    numeroFacturaFin: "000-001-01-00999999",    
    fechaEmision: new Date().toISOString().split('T')[0],  
    fechaVencimiento: "2025-12-31",    
    resolucionSAR: "SAR No. 45145",    
    nombreEmpresa: "Televisión Comayagua Canal 40",    
    rtnEmpresa: "12171961001526",    
    activo: true,    
    facturasEmitidas: 0    
  });  
    
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });    
  const [loading, setLoading] = useState(false);    
  const [idCAI, setIdCAI] = useState(null);  
  const [modoEdicion, setModoEdicion] = useState(false);  
  
  // Cargar CAI activo al montar el componente    
  useEffect(() => {    
    cargarCAIActivo();    
  }, []);    
    
  const cargarCAIActivo = async () => {    
    setLoading(true);  
    try {    
      const data = await caiService.obtenerCAIActivo();  
      if (data.cai) {    
        setCaiData({    
          ...data.cai,    
          fechaEmision: data.cai.fechaEmision ? data.cai.fechaEmision.split('T')[0] : '',    
          fechaVencimiento: data.cai.fechaVencimiento ? data.cai.fechaVencimiento.split('T')[0] : ''    
        });  
        setIdCAI(data.cai.idCAI);  
        setModoEdicion(true);  
        setMensaje({  
          tipo: 'info',  
          texto: `CAI activo cargado: ${data.cai.codigoCAI}`  
        });  
      }    
    } catch (error) {    
      console.log('No hay CAI activo configurado o error al cargar:', error.message);    
      setMensaje({  
        tipo: 'warning',  
        texto: 'No se encontró CAI activo. Configurando nuevo CAI.'  
      });  
    } finally {  
      setLoading(false);  
    }  
  };   
    
  const handleChange = (e) => {    
    const { name, value, type, checked } = e.target;    
    setCaiData({     
      ...caiData,     
      [name]: type === 'checkbox' ? checked : value     
    });  
      
    // Limpiar mensajes al editar  
    if (mensaje.texto) {  
      setMensaje({ tipo: '', texto: '' });  
    }  
  };    
    
  const generarRangoFacturas = () => {    
    if (caiData.numeroFacturaInicio && caiData.numeroFacturaFin) {    
      return `Del ${caiData.numeroFacturaInicio} al ${caiData.numeroFacturaFin}`;    
    }    
    return 'N/A';    
  };    
    
  const validarFormulario = () => {    
    const errores = [];  
      
    if (!caiData.codigoCAI?.trim()) errores.push('Código CAI es obligatorio');  
    if (!caiData.numeroFacturaInicio?.trim()) errores.push('Número de factura inicio es obligatorio');  
    if (!caiData.numeroFacturaFin?.trim()) errores.push('Número de factura fin es obligatorio');  
    if (!caiData.fechaEmision) errores.push('Fecha de emisión es obligatoria');  
    if (!caiData.fechaVencimiento) errores.push('Fecha de vencimiento es obligatoria');  
    if (!caiData.resolucionSAR?.trim()) errores.push('Resolución SAR es obligatoria');  
    if (!caiData.nombreEmpresa?.trim()) errores.push('Nombre de empresa es obligatorio');  
    if (!caiData.rtnEmpresa?.trim()) errores.push('RTN de empresa es obligatorio');  
    
    if (caiData.fechaEmision && caiData.fechaVencimiento) {  
      if (new Date(caiData.fechaVencimiento) <= new Date(caiData.fechaEmision)) {    
        errores.push('La fecha de vencimiento debe ser posterior a la fecha de emisión');    
      }  
    }  
  
    // Validar formato RTN  
    if (caiData.rtnEmpresa && !/^\d{14}$/.test(caiData.rtnEmpresa.replace(/-/g, ''))) {  
      errores.push('RTN debe tener 14 dígitos');  
    }  
  
    return errores;  
  };    
    
  const guardarDatos = async () => {    
    // Validar formulario  
    const errores = validarFormulario();  
    if (errores.length > 0) {  
      setMensaje({  
        tipo: 'danger',  
        texto: errores.join(', ')  
      });  
      return;  
    }  
  
    setLoading(true);    
    setMensaje({ tipo: '', texto: '' });    
    
    try {    
      const datosParaEnviar = {    
        codigoCAI: caiData.codigoCAI,    
        numeroFacturaInicio: caiData.numeroFacturaInicio,    
        numeroFacturaFin: caiData.numeroFacturaFin,    
        fechaEmision: caiData.fechaEmision,    
        fechaVencimiento: caiData.fechaVencimiento,    
        resolucionSAR: caiData.resolucionSAR,    
        nombreEmpresa: caiData.nombreEmpresa,    
        rtnEmpresa: caiData.rtnEmpresa,    
        activo: caiData.activo,    
        facturasEmitidas: parseInt(caiData.facturasEmitidas) || 0    

        
      };    
  
      // Incluir idCAI si estamos en modo edición  
      if (idCAI) {  
        datosParaEnviar.idCAI = idCAI;  
      }  
    
      const token = localStorage.getItem('token');    
      const url = idCAI ? `/api/optica/cai/${idCAI}` : '/api/optica/cai';  
      const method = idCAI ? 'PUT' : 'POST';  
        
      const response = await fetch(url, {    
        method: method,    
        headers: {    
          'Content-Type': 'application/json',    
          'Authorization': `Bearer ${token}`    
        },    
        body: JSON.stringify(datosParaEnviar)    
      });    
    
      if (response.ok) {    
        const result = await response.json();  
          
        if (!idCAI && result.idCAI) {  
          setIdCAI(result.idCAI);  
          setModoEdicion(true);  
        }  
          
        setMensaje({    
          tipo: 'success',    
          texto: idCAI ?   
            'Datos del CAI actualizados correctamente en la base de datos.' :  
            `CAI creado exitosamente. ID: ${result.idCAI || result.cai?.idCAI}`  
        });    
          
        // Recargar datos actualizados solo si no estamos creando uno nuevo  
        if (idCAI) {  
          await cargarCAIActivo();    
        }  
      } else {    
        const errorData = await response.json();  
        throw new Error(errorData.mensaje || 'Error al guardar CAI en el servidor');    
      }    
    
    } catch (error) {    
      console.error('Error:', error);    
      setMensaje({    
        tipo: 'danger',    
        texto: error.message || 'Error al guardar los datos del CAI'    
      });    
    } finally {    
      setLoading(false);    
    }    
  };  
  
  const limpiarFormulario = () => {  
    setCaiData({  
      codigoCAI: "",  
      numeroFacturaInicio: "",  
      numeroFacturaFin: "",  
      fechaEmision: new Date().toISOString().split('T')[0],  
      fechaVencimiento: "",  
      resolucionSAR: "",  
      nombreEmpresa: "",  
      rtnEmpresa: "",  
      activo: true,  
      facturasEmitidas: 0  
    });  
    setIdCAI(null);  
    setModoEdicion(false);  
    setMensaje({ tipo: '', texto: '' });  
  };  
    
  return (    
    <>    
      <HeaderResponsive />    
      <Container className="mt-4" fluid>    
        <Card className="shadow">    
          <CardHeader className="d-flex justify-content-between align-items-center">  
            <div>  
              <h3 className="mb-0">Configuración de Datos CAI - SAR Honduras</h3>    
              <p className="text-muted mb-0">  
                Gestión del Código de Autorización de Impresión  
                {modoEdicion && idCAI && (  
                  <span className="ml-2 badge badge-info">Editando ID: {idCAI}</span>  
                )}  
              </p>  
            </div>  
            {modoEdicion && (  
              <Button color="secondary" size="sm" onClick={limpiarFormulario}>  
                Nuevo CAI  
              </Button>  
            )}  
          </CardHeader>    
          <CardBody>    
            {mensaje.texto && (    
              <Alert color={mensaje.tipo} className="mb-4">    
                {mensaje.texto}    
              </Alert>    
            )}  
  
            {loading && (  
              <div className="text-center mb-3">  
                <Spinner color="primary" />  
                <p className="mt-2">Procesando...</p>  
              </div>  
            )}  
    
            {/* Información de la Empresa */}    
            <h5 className="text-muted mb-3">Información de la Empresa</h5>    
            <Row form>    
              <Col md={8}>    
                <FormGroup>    
                  <Label>Nombre de la Empresa <span className="text-danger">*</span></Label>    
                  <Input     
                    name="nombreEmpresa"     
                    value={caiData.nombreEmpresa}     
                    onChange={handleChange}  
                    disabled={loading}  
                    placeholder="Ej: Televisión Comayagua Canal 40"  
                    required    
                  />    
                </FormGroup>    
              </Col>    
              <Col md={4}>    
                <FormGroup>    
                  <Label>RTN de la Empresa <span className="text-danger">*</span></Label>    
                  <Input     
                    name="rtnEmpresa"     
                    value={caiData.rtnEmpresa}     
                    onChange={handleChange}  
                    disabled={loading}  
                    placeholder="14 dígitos"  
                    maxLength="14"  
                    required    
                  />    
                </FormGroup>    
              </Col>    
            </Row>    
    
            <hr />    
    
            {/* Datos del CAI */}    
            <h5 className="text-muted mb-3">Configuración del CAI</h5>    
            <Row form>    
              <Col md={6}>    
                <FormGroup>    
                  <Label>Código CAI <span className="text-danger">*</span></Label>    
                  <Input     
                    name="codigoCAI"     
                    value={caiData.codigoCAI}     
                    onChange={handleChange}    
                    placeholder="254F8-612F1-8A0E0-6E8B3-0099B876"  
                    disabled={loading}  
                    required    
                  />    
                </FormGroup>    
              </Col>    
              <Col md={6}>    
                <FormGroup>    
                  <Label>Resolución SAR <span className="text-danger">*</span></Label>    
                  <Input     
                    name="resolucionSAR"     
                    value={caiData.resolucionSAR}     
                    onChange={handleChange}  
                    disabled={loading}  
                    placeholder="Ej: SAR No. 45145"  
                    required    
                  />    
                </FormGroup>    
              </Col>    
            </Row>    
    
            <Row form>    
              <Col md={6}>    
                <FormGroup>    
                  <Label>Número de Factura Inicio <span className="text-danger">*</span></Label>    
                  <Input     
                    name="numeroFacturaInicio"     
                    value={caiData.numeroFacturaInicio}     
                    onChange={handleChange}    
                    placeholder="000-001-01-00000001"  
                    disabled={loading}  
                    required    
                  />    
                </FormGroup>    
              </Col>    
              <Col md={6}>    
                <FormGroup>    
                  <Label>Número de Factura Fin <span className="text-danger">*</span></Label>    
                  <Input     
                    name="numeroFacturaFin"     
                    value={caiData.numeroFacturaFin}     
                    onChange={handleChange}    
                    placeholder="000-001-01-99999999"  
                    disabled={loading}  
                    required    
                  />    
                </FormGroup>    
              </Col>    
            </Row>    
    
            <Row form>    
              <Col md={4}>    
                <FormGroup>    
                  <Label>Fecha de Emisión <span className="text-danger">*</span></Label>    
                  <Input     
                    type="date"    
                    name="fechaEmision"     
                    value={caiData.fechaEmision}     
                    onChange={handleChange}  
                    disabled={loading}  
                    required    
                  />  
                  </FormGroup>   
              </Col>  
              <Col md={4}>    
                <FormGroup>    
                  <Label>Fecha de Fin <span className="text-danger">*</span></Label>    
                  <Input     
                    type="date"    
                    name="fechaVencimiento"     
                    value={caiData.ffechaVencimiento}     
                    onChange={handleChange}  
                    disabled={loading}  
                    required    
                  />  
                  </FormGroup>   
              </Col>
              <Col md={4}>  
                <FormGroup>  
                  <Label>Facturas Emitidas</Label>  
                  <Input   
                    type="number"  
                    name="facturasEmitidas"   
                    value={caiData.facturasEmitidas}   
                    onChange={handleChange}  
                    min="0"  
                  />  
                </FormGroup>  
              </Col>  
            </Row>  
  
            <Row form>  
              <Col md={12}>  
                <FormGroup check>  
                  <Label check>  
                    <Input   
                      type="checkbox"  
                      name="activo"   
                      checked={caiData.activo}   
                      onChange={handleChange}  
                    />  
                    CAI Activo  
                  </Label>  
                </FormGroup>  
              </Col>  
            </Row>  
  
            {/* Información de resumen */}  
            {caiData.numeroFacturaInicio && caiData.numeroFacturaFin && (  
              <Alert color="info" className="mt-3">  
                <strong>Rango Autorizado:</strong> {generarRangoFacturas()}  
              </Alert>  
            )}  
  
            <div className="mt-4">  
              <Button   
                color="primary"   
                onClick={guardarDatos}  
                disabled={loading}  
                size="lg"  
              >  
                {loading ? 'Guardando...' : 'Guardar Configuración CAI'}  
              </Button>  
                
              <Button   
                color="secondary"   
                onClick={cargarCAIActivo}  
                disabled={loading}  
                className="ml-2"  
              >  
                Recargar Cai Activo
              </Button>  
            </div>  
          </CardBody>  
        </Card>  
      </Container>  
    </>  
  );  
};  
  
export default CAI;