
// Gestion Clientes
import Clientes from "views/gestion_cliente/Clientes.js";

import Index from "views/Index.js";
// seguridad
import Login from "views/seguridad/Login.js";
import Profile from "views/seguridad/Profile.js";
import Register from "views/seguridad/Register.js";
// Mapa
import Maps from "views/examples/Maps.js";

// Facturación
import CAI from "views/facturacion/Cai";
import Canjes from "views/facturacion/Canjes";
import Contratos from "views/facturacion/Contratos";
import CrearFactura from "views/facturacion/CrearFactura";
import Factura from "views/facturacion/Factura";
import HistorialFactura from "views/facturacion/HistorialFactura";
import PanelFacturacion from "views/facturacion/PanelFacturacion";
import RegistrarPago from "views/facturacion/RegistrarPago";
// Facturación - Crear Factura
import CrearFacturaNueva from "views/facturacion/CrearFacturaNueva";
import ListaFacturas from "views/facturacion/ListasFacturas.js";


// Reportes
import HistoricoReportes from "views/examples/HistoricoReportes.js";
import Reporte from "views/examples/Reporte.js";
import ReporteInventario from "views/examples/ReporteInventario.js";
import VerDetalle from "views/examples/VerDetalle.js";
import ReporteCliente from './views/examples/ReporteCliente.js';
import InformacionCliente from './views/examples/InformacionCliente.js';

// Inventario
import GenerarReportes from "views/examples/GenerarReportes.js";
import GestionarMantenimiento from "views/examples/GestionarMantenimiento.js";
import GestionarStock from "views/examples/GestionarStock.js";
import InventarioHub from "views/examples/InventarioHub.js";
import ListaActivos from "views/examples/ListaActivos.js";
import RegistrarActivo from "views/examples/RegistrarActivo.js";

// Programación
import ReportePautaPorCliente from "views/examples/ReportePautaPorCliente";
import CrearPauta from "views/programacion/CrearPauta.js";
import CrearPrograma from "views/programacion/CrearPrograma.js";
import Programacion from "views/programacion/programacion";




const routes = [

 
  // Dashboard
  {
    path: "/index",
    name: "Panel de Control",
    icon: "ni ni-tv-2 text-primary",
    component: Index,
    layout: "/admin",
  },

// Clientes
  {
  path: "/clientes",
  name: "Clientes",
  icon: "ni ni-single-02 text-primary",
  component: Clientes,
  layout: "/admin"
  },


  // Inventario
  {
    path: "/panel-inventario",
    name: "Inventario",
    icon: "ni ni-archive-2 text-blue",
    component: InventarioHub,
    layout: "/admin",
  },
  {
    path: "/lista-activos",
    name: "Inventario General",
    icon: "ni ni-box-2 text-primary",
    component: ListaActivos,
    layout: "/admin",
    hidden: true,
  },
  {
    path: "/registrar-activo",
    name: "Registrar Activo",
    icon: "ni ni-fat-add text-success",
    component: RegistrarActivo,
    layout: "/admin",
    hidden: true,
  },
  {
    path: "/gestionar-stock",
    name: "Gestionar Stock",
    icon: "ni ni-chart-bar-32 text-info",
    component: GestionarStock,
    layout: "/admin",
    hidden: true,
  },
  {
    path: "/gestionar-mantenimiento",
    name: "Controlar Mantenimiento",
    icon: "ni ni-settings-gear-65 text-primary",
    component: GestionarMantenimiento,
    layout: "/admin",
    hidden: true,
  },
  {
    path: "/generar-reportes",
    name: "Generar Reportes",
    icon: "ni ni-book-bookmark text-green",
    component: GenerarReportes,
    layout: "/admin",
    hidden: true,
  },

  
  // Facturación
  {
    path: "/facturacion/panel",
    name: "Facturación",
    icon: "ni ni-collection text-blue",
    component: PanelFacturacion,
    layout: "/admin",
  },
  {  
    path: "/crear-factura-nueva",  
    name: "Nueva Factura",  
    icon: "ni ni-fat-add text-green",  
    component: CrearFacturaNueva,  
    layout: "/admin",  
    hidden: true,
  },
  {  
    path: "/facturas",  
    name: "Facturas",  
    icon: "ni ni-single-copy-04 text-pink",  
    component: ListaFacturas,  
    layout: "/admin", 
    hidden: true, 
  }, 
  {
    path: "/facturacion/crear",
    name: "Crear Factura",
    icon: "ni ni-fat-add text-green",
    component: CrearFactura,
    layout: "/admin",
    hidden: true,
  },
  {
    path: "/facturacion/historial",
    name: "Historial Facturas",
    icon: "ni ni-time-alarm text-orange",
    component: HistorialFactura,
    layout: "/admin",
    hidden: true,
  },
  {
    path: "/facturacion/factura/:id",
    name: "Historial Facturas",
    icon: "ni ni-time-alarm text-orange",
    component: Factura,
    layout: "/admin",
    hidden: true,
  },  
    {
    path: "/facturacion/pagos",
    name: "Registrar Pago",
    icon: "ni ni-money-coins text-success",
    component: RegistrarPago,
    layout: "/admin",
    hidden: true,
  },
  {
    path: "/facturacion/cai",
    name: "Control CAI",
    icon: "ni ni-key-25 text-warning",
    component: CAI,
    layout: "/admin",
    hidden: true,
  },
  {
    path: "/facturacion/contratos",
    name: "Contratos",
    icon: "ni ni-briefcase-24 text-info",
    component: Contratos,
    layout: "/admin",
    hidden: true,
  },
  {
    path: "/facturacion/canjes",
    name: "Canjes",
    icon: "ni ni-basket text-danger",
    component: Canjes,
    layout: "/admin",
    hidden: true,
  },
// Programación
  {
    path: "/programacion",
    name: "Programación",
    icon: "ni ni-calendar-grid-58 text-primary",
    component: Programacion,
    layout: "/admin",
  },
  {
    path: "/crear-programa",
    name: "Crear Programa",
    icon: "ni ni-fat-add text-primary",
    component: CrearPrograma,
    layout: "/admin",
    hidden: true,
  },
  {
    path: "/crear-pauta",
    name: "Crear Pauta Publicitaria",
    icon: "ni ni-bullet-list-67 text-green",
    component: CrearPauta,
    layout: "/admin",
    hidden: true,
  },

// Reportes
 {
    path: "/reporte",
    name: "Reportes",
    icon: "ni ni-archive-2 text-primary",
    component: Reporte,
    layout: "/admin",
  },
  {
    path: "/detalle/:id",
    name: "Detalle de Reporte",
    icon: "ni ni-bullet-list-67 text-info",
    component: VerDetalle ,
    layout: "/admin",
    hidden: true, // Oculto del sidebar
  },
  {
    path: "/historico",
    name: "Histórico de Reportes",
    icon: "ni ni-archive-2 text-warning",
    component: HistoricoReportes ,
    layout: "/admin",
    hidden: true,
  },
  {
    path: "/ReporteInventario",
    name: "Informe de Inventario",
    icon: "ni ni-archive-2 text-info",
    component: ReporteInventario,
    layout: "/admin",
    hidden: true,
  },
  {
    path: "/ReportePautaPorCliente",
    name: "Informe de Pauta Publicitaria",
    icon: "ni ni-archive-2 text-info",
    component: ReportePautaPorCliente,
    layout: "/admin",
    hidden: true,
  },
  {
    path: "/ReporteCliente",
    name: "Informe de Clientes",
    icon: "ni ni-archive-2 text-info",
    component: ReporteCliente,
    layout: "/admin",
    hidden: true,
  },
  {
    path: "/InformacionCliente",
    name: "Informe de Clientes",
    icon: "ni ni-archive-2 text-info",
    component: InformacionCliente,
    layout: "/admin",
    hidden: true,
  },
  // Perfil de Usuario
    {
    path: "/user-profile",
    name: "Perfil de Usuario",
    icon: "ni ni-single-02 text-yellow",
    component: Profile,
    layout: "/admin",
    hidden: true,
  },
// Mapa
    {
    path: "/mapas",
    name: "Mapa",
    icon: "ni ni-pin-3 text-orange",
    component: Maps,
    layout: "/admin",
  },

  // Authentication Login/Register
  {
    path: "/login",
    name: "Login",
    icon: "ni ni-key-25 text-info",
    component: Login,
    layout: "/auth",
  },
  {
    path: "/register",
    name: "Register",
    icon: "ni ni-circle-08 text-pink",
    component: Register,
    layout: "/auth",
  },
];

export default routes;


