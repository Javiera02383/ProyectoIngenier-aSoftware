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
  Table,  
  Alert,  
} from "reactstrap";  
import HeaderBlanco from "components/Headers/HeaderBlanco.js";  
import { inventarioService } from '../../services/inventario/inventarioService';  
import { useToast } from '../../hooks/useToast';  
import Toast from 'components/Toast/Toast';  
  
const GenerarReportes = () => {  
  // Estados principales  
  const [reportType, setReportType] = useState("");  
  const [generatedReport, setGeneratedReport] = useState(null);  
    
  // Estados para cargar datos  
  const [inventoryData, setInventoryData] = useState([]);  
  const [loading, setLoading] = useState(true);  
  const [error, setError] = useState(null);  
    
  const { toast, showSuccess, showError, hideToast } = useToast();  
  
  // Cargar datos del inventario al montar el componente  
  useEffect(() => {  
    const cargarInventario = async () => {  
      try {  
        setLoading(true);  
        setError(null);  
        const data = await inventarioService.obtenerInventarios();  
        setInventoryData(Array.isArray(data) ? data : []);  
      } catch (error) {  
        console.error('Error al cargar inventario:', error);  
        setError('Error al cargar el inventario');  
        showError('Error al cargar el inventario');  
        setInventoryData([]);  
      } finally {  
        setLoading(false);  
      }  
    };  
  
    cargarInventario();  
  }, [showError]);  
  
  // Función para generar el contenido del reporte  
  const generateReport = () => {  
    if (!inventoryData || inventoryData.length === 0) {  
      setGeneratedReport(  
        <Alert color="warning">  
          <h5>No hay datos disponibles</h5>  
          <p>No se encontraron activos en el inventario para generar el reporte.</p>  
        </Alert>  
      );  
      return;  
    }  
  
    let reportContent = null;  
      
    switch (reportType) {  
      case "all_assets":  
        reportContent = (  
          <div>  
            <div className="text-center mb-4">  
              <h3>TELEVISIÓN COMAYAGUA - CANAL 40</h3>  
              <h4>Reporte de Inventario General de Activos</h4>  
              <p>Fecha: {new Date().toLocaleDateString('es-HN')}</p>  
              <p>Total de activos: {inventoryData.length}</p>  
            </div>  
              
            <Table className="align-items-center table-flush" responsive borderless size="sm">  
              <thead className="thead-light">  
                <tr>  
                  <th>Código</th>  
                  <th>Nombre</th>  
                  <th>Cantidad</th>  
                  <th>Estado</th>  
                  <th>Ubicación</th>  
                  <th>Valor</th>  
                  <th>Marca</th>  
                  <th>Empleado Asignado</th>  
                </tr>  
              </thead>  
              <tbody>  
                {inventoryData.map((asset) => (  
                  <tr key={asset.idInventario}>  
                    <td>{asset.codigo || 'N/A'}</td>  
                    <td>{asset.nombre || 'N/A'}</td>  
                    <td>{asset.cantidad || 0}</td>  
                    <td>{asset.estado || 'N/A'}</td>  
                    <td>{asset.ubicacion || 'N/A'}</td>  
                    <td>L. {asset.valor ? parseFloat(asset.valor).toLocaleString() : '0.00'}</td>  
                    <td>{asset.marca || 'N/A'}</td>  
                    <td>  
                      {asset.empleado?.persona ?   
                        `${asset.empleado.persona.Pnombre} ${asset.empleado.persona.Papellido}` :   
                        'No asignado'  
                      }  
                    </td>  
                  </tr>  
                ))}  
              </tbody>  
            </Table>  
              
            <div className="mt-4">  
              <h6>Resumen:</h6>  
              <p>Total de activos: {inventoryData.length}</p>  
              <p>Valor total del inventario: L. {inventoryData.reduce((total, asset) => total + (parseFloat(asset.valor) || 0), 0).toLocaleString()}</p>  
            </div>  
          </div>  
        );  
        break;  
        
      case "low_stock":  
        const lowStockAssets = inventoryData.filter(asset => (asset.cantidad || 0) <= 5);  
          
        reportContent = (  
          <div>  
            <div className="text-center mb-4">  
              <h3>TELEVISIÓN COMAYAGUA - CANAL 40</h3>  
              <h4>Reporte de Activos con Stock Bajo</h4>  
              <p>Activos con 5 unidades o menos</p>  
              <p>Fecha: {new Date().toLocaleDateString('es-HN')}</p>  
            </div>  
              
            {lowStockAssets.length > 0 ? (  
              <>  
                <Table className="align-items-center table-flush" responsive borderless size="sm">  
                  <thead className="thead-light">  
                    <tr>  
                      <th>Código</th>  
                      <th>Nombre</th>  
                      <th>Cantidad</th>  
                      <th>Estado</th>  
                      <th>Ubicación</th>  
                      <th>Empleado Asignado</th>  
                    </tr>  
                  </thead>  
                  <tbody>  
                    {lowStockAssets.map((asset) => (  
                      <tr key={asset.idInventario}>  
                        <td>{asset.codigo || 'N/A'}</td>  
                        <td>{asset.nombre || 'N/A'}</td>  
                        <td className="text-danger font-weight-bold">{asset.cantidad || 0}</td>  
                        <td>{asset.estado || 'N/A'}</td>  
                        <td>{asset.ubicacion || 'N/A'}</td>  
                        <td>  
                          {asset.empleado?.persona ?   
                            `${asset.empleado.persona.Pnombre} ${asset.empleado.persona.Papellido}` :   
                            'No asignado'  
                          }  
                        </td>  
                      </tr>  
                    ))}  
                  </tbody>  
                </Table>  
                  
                <div className="mt-4">  
                  <Alert color="warning">  
                    <h6>⚠️ Atención requerida</h6>  
                    <p>Se encontraron {lowStockAssets.length} activos con stock bajo que requieren atención.</p>  
                  </Alert>  
                </div>  
              </>  
            ) : (  
              <Alert color="success">  
                <h5>✅ Stock adecuado</h5>  
                <p>Todos los activos tienen stock suficiente (más de 5 unidades).</p>  
              </Alert>  
            )}  
          </div>  
        );  
        break;  
        
      case "by_status":  
        const statusGroups = inventoryData.reduce((groups, asset) => {  
          const status = asset.estado || 'Sin estado';  
          if (!groups[status]) groups[status] = [];  
          groups[status].push(asset);  
          return groups;  
        }, {});  
          
        reportContent = (  
          <div>  
            <div className="text-center mb-4">  
              <h3>TELEVISIÓN COMAYAGUA - CANAL 40</h3>  
              <h4>Reporte de Activos por Estado</h4>  
              <p>Fecha: {new Date().toLocaleDateString('es-HN')}</p>  
            </div>  
              
            {Object.entries(statusGroups).map(([status, assets]) => (  
              <div key={status} className="mb-4">  
                <h5 className="text-primary">Estado: {status} ({assets.length} activos)</h5>  
                <Table className="align-items-center table-flush" responsive borderless size="sm">  
                  <thead className="thead-light">  
                    <tr>  
                      <th>Código</th>  
                      <th>Nombre</th>  
                      <th>Cantidad</th>  
                      <th>Ubicación</th>  
                      <th>Valor</th>  
                    </tr>  
                  </thead>  
                  <tbody>  
                    {assets.map((asset) => (  
                      <tr key={asset.idInventario}>  
                        <td>{asset.codigo || 'N/A'}</td>  
                        <td>{asset.nombre || 'N/A'}</td>  
                        <td>{asset.cantidad || 0}</td>  
                        <td>{asset.ubicacion || 'N/A'}</td>  
                        <td>L. {asset.valor ? parseFloat(asset.valor).toLocaleString() : '0.00'}</td>  
                      </tr>  
                    ))}  
                  </tbody>  
                </Table>  
              </div>  
            ))}  
              
            <div className="mt-4">  
              <h6>Resumen por estado:</h6>  
              {Object.entries(statusGroups).map(([status, assets]) => (  
                <p key={status}>{status}: {assets.length} activos</p>  
              ))}  
            </div>  
          </div>  
        );  
        break;  
        
      default:  
        reportContent = (  
          <Alert color="info">  
            <h5>Selecciona un tipo de reporte</h5>  
            <p>Elige una opción del menú desplegable para generar un reporte.</p>  
          </Alert>  
        );  
        break;  
    }  
      
    setGeneratedReport(reportContent);  
  };  
  
  // Función mejorada para imprimir/generar PDF  
  const printReport = () => {  
    const reportOutput = document.getElementById("report-output");  
    if (!reportOutput) {  
      alert('No hay reporte generado para imprimir.');  
      return;  
    }  
  
    // Crear una nueva ventana con estilos completos  
    const printWindow = window.open('', '_blank', 'width=800,height=600');  
      
    // Escribir el HTML completo con estilos mejorados  
    printWindow.document.write(`  
      <html>  
        <head>  
          <title>Reporte de Inventario Canal 40</title>  
          <meta charset="utf-8">  
          <style>  
            * {  
              box-sizing: border-box;  
            }  
            body {  
              font-family: 'Arial', sans-serif;  
              margin: 20px;  
              color: #333;  
              line-height: 1.4;  
            }  
            h3, h4, h5 {  
              color: #2c3e50;  
              margin-bottom: 10px;  
            }  
            h3 {  
              font-size: 18px;  
              border-bottom: 2px solid #3498db;  
              padding-bottom: 8px;  
            }  
            h4 {  
              font-size: 16px;  
              margin-bottom: 15px;  
            }  
            h5 {  
              font-size: 14px;  
              margin-bottom: 10px;  
            }  
            h6 {  
              font-size: 12px;  
              margin-bottom: 8px;  
              font-weight: bold;  
            }  
            p {  
              margin-bottom: 8px;  
              font-size: 12px;  
            }  
            table {  
              width: 100%;  
              border-collapse: collapse;  
              margin-bottom: 20px;  
              font-size: 11px;  
            }  
            th, td {  
              border: 1px solid #ddd;  
              padding: 6px 8px;  
              text-align: left;  
              vertical-align: top;  
            }  
            th {  
              background-color: #f8f9fa;  
              font-weight: bold;  
              color: #495057;  
            }  
            tr:nth-child(even) {  
              background-color: #f9f9f9;  
            }  
            .text-center {  
              text-align: center;  
            }  
            .text-primary {  
              color: #007bff;  
            }  
            .text-danger {  
              color: #dc3545;  
              font-weight: bold;  
            }  
            .font-weight-bold {  
              font-weight: bold;  
            }  
            .mb-4 {  
              margin-bottom: 1.5rem;  
            }  
            .mt-4 {  
              margin-top: 1.5rem;  
            }  
            .alert {  
              padding: 12px;  
              margin-bottom: 20px;  
              border: 1px solid transparent;  
              border-radius: 4px;  
            }  
            .alert-warning {  
              color: #856404;  
              background-color: #fff3cd;  
              border-color: #ffeaa7;  
            }  
            .alert-success {  
              color: #155724;  
              background-color: #d4edda;  
              border-color: #c3e6cb;  
            }  
            .alert-info {  
              color: #0c5460;  
              background-color: #d1ecf1;  
              border-color: #bee5eb;  
            }  
            @media print {  
              body {   
                margin: 0;   
                font-size: 10px;  
              }  
              h3, h4, h5 {   
                page-break-after: avoid;   
              }  
              table {   
                page-break-inside: avoid;   
              }  
              tr {  
                page-break-inside: avoid;  
              }  
            }  
          </style>  
        </head>  
        <body>  
          ${reportOutput.innerHTML}  
        </body>  
      </html>  
    `);  
      
    printWindow.document.close();  
      
    // Esperar a que se cargue el contenido antes de imprimir  
    printWindow.onload = function() {  
      setTimeout(() => {  
        printWindow.print();  
        printWindow.close();  
      }, 500);  
    };  
  };  
  
  if (loading) {  
    return (  
      <>  
        <HeaderBlanco />  
        <Container className="mt--7" fluid>  
          <div className="text-center py-5">  
            <div className="spinner-border text-primary" role="status">  
              <span className="sr-only">Cargando...</span>  
            </div>  
            <p className="mt-3">Cargando datos del inventario...</p>  
          </div>  
        </Container>  
      </>  
    );  
  }  
  
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
                    <h3 className="mb-0">Generar Reportes de Inventario</h3>  
                  </Col>  
                </Row>  
              </CardHeader>  
              <CardBody>  
                {error && (  
                  <Alert color="danger" className="mb-4">  
                    {error}  
                  </Alert>  
                )}  
                  
                <Form>  
                  <h6 className="heading-small text-muted mb-4">  
                    Opciones de Reporte  
                  </h6>  
                  <div className="pl-lg-4">  
  <Row className="align-items-end">  
    <Col lg="6">  
      <FormGroup>  
        <Label htmlFor="report-type">Tipo de Reporte</Label>  
        <Input  
          type="select"  
          id="report-type"  
          className="form-control-alternative"  
          value={reportType}  
          onChange={(e) => {  
            setReportType(e.target.value);  
            setGeneratedReport(null);  
          }}  
        >  
          <option value="">Selecciona un tipo de reporte...</option>  
          <option value="all_assets">Inventario General de Activos</option>  
          <option value="low_stock">Activos con Stock Bajo</option>  
          <option value="by_status">Activos por Estado</option>  
        </Input>  
      </FormGroup>  
    </Col>  
    <Col lg="3">  
       
        <Button  
          color="primary"  
          onClick={generateReport}  
          disabled={!reportType || loading}  
          className="mb-4"  
        >  
          Generar Reporte  
        </Button>  </Col>
        <Col lg="3"> 
        {generatedReport && (  
          <Button color="info" onClick={printReport} className="mb-4"  >  
            Imprimir Reporte  
          </Button>  
        )}  
       
    </Col>  
  </Row>  
</div>
                </Form>  
              </CardBody>  
            </Card>  
          </Col>  
        </Row>  
          
        {generatedReport && (  
          <Row className="mt-5">  
            <Col xl="12">  
              <Card className="shadow">  
                <CardHeader className="border-0">  
                  <h3 className="mb-0">Vista Previa del Reporte</h3>  
                </CardHeader>  
                <CardBody id="report-output">  
                  {generatedReport}  
                </CardBody>  
              </Card>  
            </Col>  
          </Row>  
        )}  
      </Container>  
    </>  
  );  
};  
  
export default GenerarReportes;  