import React, { useState, useEffect } from "react";
import {
  Card, CardBody, CardHeader,
  Container, Row, Col,
  Table, Button, FormGroup, Label, Input, Form
} from "reactstrap";
import HeaderResponsive from "components/Headers/HeaderResponsive";
import { clienteService } from "../../services/gestion_cliente/clienteService";

const GestionCanjes = () => {
  const [canjes, setCanjes] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [cargandoClientes, setCargandoClientes] = useState(false);
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });
  const [nuevoCanje, setNuevoCanje] = useState({
    empresa: "",
    empresaId: "",
    descripcion: "",
    isv: false,
    activo: true,
    fechaInicio: "",
    fechaFin: ""
  });

  // Cargar clientes al montar el componente
  useEffect(() => {
    cargarClientes();
  }, []);

  const cargarClientes = async () => {
    setCargandoClientes(true);
    try {
      console.log('🔍 Cargando clientes...');
      const response = await clienteService.obtenerTodosLosClientes();
      console.log('📋 Respuesta del servicio:', response);
      
      // Verificar diferentes estructuras posibles de respuesta
      let clientesData = [];
      if (Array.isArray(response)) {
        // El controlador devuelve directamente el array
        clientesData = response;
      } else if (response.clientes) {
        clientesData = response.clientes;
      } else if (response.data && response.data.clientes) {
        clientesData = response.data.clientes;
      } else if (response.data && Array.isArray(response.data)) {
        clientesData = response.data;
      }
      
      console.log('👥 Clientes procesados:', clientesData);
      setClientes(clientesData);
    } catch (error) {
      console.error('❌ Error al cargar clientes:', error);
      setClientes([]);
    } finally {
      setCargandoClientes(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === "empresaId") {
      // Buscar el cliente seleccionado y actualizar tanto el ID como el nombre
      const clienteSeleccionado = clientes.find(cliente => cliente.idCliente.toString() === value);
      
      let nombreEmpresa = "";
      if (clienteSeleccionado && clienteSeleccionado.persona) {
        if (clienteSeleccionado.persona.tipoPersona === 'comercial') {
          nombreEmpresa = clienteSeleccionado.persona.razonSocial || clienteSeleccionado.persona.nombreComercial || 'Empresa Comercial';
        } else {
          nombreEmpresa = `${clienteSeleccionado.persona.Pnombre || ''} ${clienteSeleccionado.persona.Papellido || ''}`.trim();
        }
      }
      
      setNuevoCanje({
        ...nuevoCanje,
        empresaId: value,
        empresa: nombreEmpresa
      });
      
      console.log('🏢 Cliente seleccionado:', clienteSeleccionado);
      console.log('📝 Nombre de empresa establecido:', nombreEmpresa);
    } else {
      setNuevoCanje({
        ...nuevoCanje,
        [name]: type === "checkbox" ? checked : value
      });
    }
  };

  const agregarCanje = () => {
    console.log('💾 Intentando guardar canje:', nuevoCanje);
    
    if (!nuevoCanje.empresaId || !nuevoCanje.descripcion) {
      alert("Empresa y descripción son requeridas.");
      return;
    }
    
    if (!nuevoCanje.empresa) {
      alert("Error: No se pudo obtener el nombre de la empresa. Intente seleccionar la empresa nuevamente.");
      return;
    }
    
    const canjeParaGuardar = { ...nuevoCanje };
    console.log('✅ Canje a guardar:', canjeParaGuardar);
    
    setCanjes([...canjes, canjeParaGuardar]);
    
    // Mostrar mensaje de confirmación
    setMensaje({
      tipo: 'success',
      texto: `Canje guardado exitosamente para: ${canjeParaGuardar.empresa}`
    });
    
    // Limpiar formulario
    setNuevoCanje({
      empresa: "",
      empresaId: "",
      descripcion: "",
      isv: false,
      activo: true,
      fechaInicio: "",
      fechaFin: ""
    });
    
    console.log('📋 Canjes actualizados:', [...canjes, canjeParaGuardar]);
    
    // Limpiar mensaje después de 3 segundos
    setTimeout(() => {
      setMensaje({ tipo: '', texto: '' });
    }, 3000);
  };

  return (
    <>
      <HeaderResponsive />
      <Container className="mt-4">
        <Card>
                     <CardHeader>
             <h4>Gestión de Canjes</h4>
             <small className="text-muted">
               Los canjes se asocian con clientes existentes en el sistema. 
               {clientes.length > 0 && ` (${clientes.length} clientes cargados)`}
             </small>
           </CardHeader>
                     <CardBody>
             {mensaje.texto && (
               <div className={`alert alert-${mensaje.tipo === 'success' ? 'success' : 'danger'} mb-3`}>
                 {mensaje.texto}
               </div>
             )}
             <Form>
              <Row form>
                                 <Col md={6}>
                   <FormGroup>
                     <Label>Empresa <span className="text-danger">*</span></Label>
                     <Input
                       type="select"
                       name="empresaId"
                       value={nuevoCanje.empresaId}
                       onChange={handleChange}
                       required
                       disabled={cargandoClientes}
                     >
                       <option value="">
                         {cargandoClientes ? "Cargando clientes..." : `Seleccione una empresa (${clientes.length} disponibles)`}
                       </option>
                       {clientes.length > 0 ? (
                         clientes.map((cliente) => (
                                                    <option key={cliente.idCliente} value={cliente.idCliente}>
                           {cliente.persona ? 
                             (cliente.persona.tipoPersona === 'comercial' ? 
                               cliente.persona.razonSocial || cliente.persona.nombreComercial : 
                               `${cliente.persona.Pnombre || ''} ${cliente.persona.Papellido || ''}`.trim()
                             ) : 
                             'Cliente sin datos'
                           }
                         </option>
                         ))
                       ) : (
                         <option value="" disabled>
                           {cargandoClientes ? "Cargando..." : "No hay clientes disponibles"}
                         </option>
                       )}
                     </Input>
                                           {!cargandoClientes && clientes.length === 0 && (
                        <small className="text-warning">
                          No se pudieron cargar los clientes. Haga clic en "Recargar Clientes".
                        </small>
                      )}
                      {cargandoClientes && (
                        <small className="text-info">
                          Cargando lista de clientes...
                        </small>
                      )}
                      {nuevoCanje.empresa && (
                        <small className="text-success">
                          ✅ Empresa seleccionada: <strong>{nuevoCanje.empresa}</strong>
                        </small>
                      )}
                   </FormGroup>
                 </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label>Descripción</Label>
                    <Input
                      name="descripcion"
                      value={nuevoCanje.descripcion}
                      onChange={handleChange}
                      placeholder="Descripción del canje"
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Row form>
                <Col md={4}>
                  <FormGroup>
                    <Label>Fecha de inicio</Label>
                    <Input
                      type="date"
                      name="fechaInicio"
                      value={nuevoCanje.fechaInicio}
                      onChange={handleChange}
                    />
                  </FormGroup>
                </Col>
                <Col md={4}>
                  <FormGroup>
                    <Label>Fecha de fin</Label>
                    <Input
                      type="date"
                      name="fechaFin"
                      value={nuevoCanje.fechaFin}
                      onChange={handleChange}
                    />
                  </FormGroup>
                </Col>
                <Col md={2}>
                  <FormGroup check className="mt-4">
                    <Label check>
                      <Input
                        type="checkbox"
                        name="isv"
                        checked={nuevoCanje.isv}
                        onChange={handleChange}
                      />
                      Aplica 15% ISV
                    </Label>
                  </FormGroup>
                </Col>
                <Col md={2}>
                  <FormGroup check className="mt-4">
                    <Label check>
                      <Input
                        type="checkbox"
                        name="activo"
                        checked={nuevoCanje.activo}
                        onChange={handleChange}
                      />
                      Activo
                    </Label>
                  </FormGroup>
                </Col>
              </Row>
              <div className="d-flex gap-2">
                 <Button color="primary" onClick={agregarCanje}>Guardar Canje</Button>
                 
               </div>
            </Form>

            <hr />
            <h5 className="mt-4">Lista de Canjes</h5>
            <Table responsive striped>
              <thead>
                <tr>
                  <th>Empresa</th>
                  <th>Descripción</th>
                  <th>ISV</th>
                  <th>Activo</th>
                  <th>Inicio</th>
                  <th>Fin</th>
                </tr>
              </thead>
              <tbody>
                {canjes.map((c, i) => (
                  <tr key={i}>
                    <td>{c.empresa}</td>
                    <td>{c.descripcion}</td>
                    <td>{c.isv ? "Sí" : "No"}</td>
                    <td>{c.activo ? "Sí" : "No"}</td>
                    <td>{c.fechaInicio}</td>
                    <td>{c.fechaFin}</td>
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

export default GestionCanjes;
