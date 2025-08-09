// app.js backend

const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');
const passport = require('passport');
const cors = require('cors');
const db = require('./configuraciones/db');

const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./configuraciones/swagger'); 

// Cargar variables de entorno
dotenv.config();

// Inicializar la app
const app = express();

const corsOptions = {
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With'],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));


// Middlewaress
app.use(morgan('dev'));
app.use(express.json());
app.use(passport.initialize());

/* ========== RUTAS ========== */

/* ========== RUTAS DE SEGURIDAD ========== */
const authRoutes = require('./rutas/seguridad/authRoutes');
const personaRutas = require('./rutas/seguridad/personaRutas');
const rolRutas = require('./rutas/seguridad/rolRutas');

/* ========== RUTAS DE PRODUCTOS/INVENTARIO ========== */
const productoRutas = require('./rutas/productos/productoRutas');
const categoriaProductoRutas = require('./rutas/productos/categoriaProductoRutas');
const atributoRutas = require('./rutas/productos/atributoRutas');
const productoAtributoRutas = require('./rutas/productos/productoAtributoRutas');
const imagenProductoRutas = require('./rutas/productos/imagenProductoRutas');

/* ========== RUTAS DE INVENTARIO ========== */
const inventarioRutas = require('./rutas/inventario/inventarioRutas');
const mantenimientoRutas = require('./rutas/inventario/mantenimientoRutas');
const movimientoRutas = require('./rutas/inventario/movimientosRutas.js');
const proveedorRutas = require('./rutas/inventario/proveedorRutas.js');

/* ========== RUTAS DE PROGRAMACION-PUBLICIDAD ========== */
const programaRuta = require('./rutas/programacion/programaRutas');  
const bloquePublicitarioRuta = require('./rutas/programacion/bloquePublicitarioRutas');  
const anuncioBloqueRuta = require('./rutas/programacion/anuncioBloqueRutas');  
const ordenPublicidadRuta = require('./rutas/programacion/ordenPublicidadRutas');  
const ordenProgramacionRuta = require('./rutas/programacion/ordenProgramacionRutas');
const programacionRutas = require('./rutas/programacion/programacionRutas');

/* ========== RUTAS DE GESTIÓN CLIENTE ========== */
const clienteRuta = require('./rutas/gestion_cliente/ClienteRuta');
const empleadoRuta = require('./rutas/gestion_cliente/EmpleadoRuta');
const telefonoRuta = require('./rutas/gestion_cliente/TelefonoRuta');
const consultaRuta = require('./rutas/gestion_cliente/ConsultaRuta');

/* ========== RUTAS DE CONSULTA EXAMENES ========== */
const tipoEnfermedadRuta = require('./rutas/consulta_examenes/TipoEnfermedadRuta');
const recetaRuta = require('./rutas/consulta_examenes/RecetaRuta');
const examenVistaRuta = require('./rutas/consulta_examenes/Examen_VistaRuta');
const diagnosticoRuta = require('./rutas/consulta_examenes/DiagnosticoRuta');
const reparacionDeLentesRuta = require('./rutas/consulta_examenes/ReparacionDeLentesRuta');

/* ========== RUTAS DE Facturacion ========== */
const facturaRutas = require('./rutas/facturacion/facturaRoutes');
const facturaDetalleRutas = require('./rutas/facturacion/facturaDetalleRoutes');
const detalleDescuentoRutas = require('./rutas/facturacion/detalleDescuentoRoutes');
const archivoRoutes = require('./rutas/facturacion/archivoRoutes');
const descuentoRoutes = require('./rutas/facturacion/descuentoRoutes');
const formaPagoRoutes = require('./rutas/facturacion/formaPagoRoutes');

const caiRoutes = require('./rutas/facturacion/caiRoutes.js');



// rutas de documentación Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Usar rutas de gestión cliente
app.use('/api/optica/clientes', clienteRuta);
app.use('/api/optica/empleados', empleadoRuta);
app.use('/api/optica/telefonos', telefonoRuta);
app.use('/api/optica/consultas', consultaRuta);

// Usar rutas de consulta exámenes
app.use('/api/optica', tipoEnfermedadRuta);
app.use('/api/optica', recetaRuta);
app.use('/api/optica', examenVistaRuta);
app.use('/api/optica', diagnosticoRuta);
app.use('/api/optica', reparacionDeLentesRuta);

// Usar rutas de Facturacion
app.use('/api/optica', facturaRutas);
app.use('/api/optica', facturaDetalleRutas);
app.use('/api/optica', detalleDescuentoRutas);
app.use('/api/optica', descuentoRoutes);
app.use('/api/optica', formaPagoRoutes);

app.use('/api/optica', caiRoutes);

app.use('/api/optica', archivoRoutes);
app.use('/api/optica', express.static('uploads')); 
// Servir archivos estáticos desde la carpeta uploads
app.use('/uploads', express.static('uploads'));

// Usar rutas de autenticación y seguridad
app.use('/api/optica/auth', authRoutes);
app.use('/api/optica/personas', personaRutas);
app.use('/api/optica/roles', rolRutas);

// Usar producto
app.use('/api/optica/productos', productoRutas);
app.use('/api/optica/categorias', categoriaProductoRutas);
app.use('/api/optica/atributos', atributoRutas);
app.use('/api/optica/asignaciones', productoAtributoRutas);
app.use('/api/optica/productos', imagenProductoRutas);

// Usar rutas de inventario
app.use('/api/optica/inventario', inventarioRutas);
app.use('/api/optica/inventario', proveedorRutas);  
app.use('/api/optica/inventario', movimientoRutas);  
app.use('/api/optica/inventario', mantenimientoRutas);

// Usar rutas de Programacion Publicidad 
app.use('/api/optica/programacion', programaRuta);  
app.use('/api/optica/programacion', bloquePublicitarioRuta);  
app.use('/api/optica/programacion', anuncioBloqueRuta);  
app.use('/api/optica/programacion', ordenPublicidadRuta);  
app.use('/api/optica/programacion', ordenProgramacionRuta);

app.use('/api/optica/programacion', programacionRutas);

/* ========== MODELOS A SINCRONIZAR (si querés controlar uno a uno) ========== */
const Persona = require('./modelos/seguridad/Persona');
const Rol = require('./modelos/seguridad/Rol');
const Usuario = require('./modelos/seguridad/Usuario');



// Modelos de consulta exámenes
const TipoEnfermedad = require('./modelos/consulta_examenes/TipoEnfermedad');
const Receta = require('./modelos/consulta_examenes/Receta');
const Examen_Vista = require('./modelos/consulta_examenes/Examen_Vista');
const Diagnostico = require('./modelos/consulta_examenes/Diagnostico');
const ReparacionDeLentes = require('./modelos/consulta_examenes/ReparacionDeLentes');

//modelo Gestion de Clientes
const Empleado = require('./modelos/gestion_cliente/Empleado')
const Cliente = require("./modelos/gestion_cliente/Cliente")
const Telefono = require("./modelos/gestion_cliente/Telefono")
const Consulta = require("./modelos/gestion_cliente/Consulta")

// Modelos de Facturacion
const FormaPago = require('./modelos/facturacion/FormaPago');
const Factura = require('./modelos/facturacion/Factura'); // <-- CORREGIDO
const FacturaDetalle = require('./modelos/facturacion/FacturaDetalle');
const Descuento = require('./modelos/facturacion/Descuento');
const DetalleDescuento = require('./modelos/facturacion/DetalleDescuento');


const Cai = require('./modelos/facturacion/Cai'); 

//modelos de productos
const Producto = require('./modelos/productos/ProductoModel');
const CategoriaProducto = require('./modelos/productos/CategoriaProducto');
const ProductoAtributo = require('./modelos/productos/ProductoAtributo');
const Atributo = require('./modelos/productos/Atributo');

// Modelo de inventario
const Inventario = require('./modelos/inventario/Inventario');
const Mantenimiento = require('./modelos/inventario/Mantenimiento.js');
const Movimiento = require('./modelos/inventario/Movimiento');
const Proveedor = require('./modelos/inventario/Proveedor.js');

// Modelo de Programacion - Publicidad
const Programa = require('./modelos/programacion/Programa');  
const BloquePublicitario = require('./modelos/programacion/BloquePublicitario');  
const AnuncioBloque = require('./modelos/programacion/AnuncioBloque');  
const OrdenPublicidad = require('./modelos/programacion/OrdenPublicidad');  
const OrdenProgramacion = require('./modelos/programacion/OrdenProgramacion'); 


const startServer = async () => {
  try {
    await db.authenticate();
    console.log('✅ Conexión a la base de datos establecida correctamente.');
    
    // Sincronizar modelos de seguridad
    await Persona.sync();
    await Rol.sync();
    await Usuario.sync();
    console.log('✅ Modelos de seguridad sincronizados.');

    await Empleado.sync();
    await Cliente.sync();
    await Telefono.sync();
    await Consulta.sync();
    console.log('✅ Modelos de gestion de cliente sincronizados.')

    // Sincronizar modelos de consulta exámenes
    await TipoEnfermedad.sync();
    await Receta.sync();
    await Examen_Vista.sync();
    await Diagnostico.sync();
    await ReparacionDeLentes.sync();
    console.log('✅ Modelos de consulta sincronizados.');

    // Sincronizar el resto (productos, etc.)
    await CategoriaProducto.sync();
    await Producto.sync();
    await Atributo.sync();
    await ProductoAtributo.sync();
    
    console.log('✅ Modelos de productos sincronizados.');

    await Proveedor.sync();  
    await Inventario.sync();  
    await Movimiento.sync();  
    await Mantenimiento.sync();

    console.log('✅ Modelos de Inventario sincronizados.');

    await Programa.sync();  
    await BloquePublicitario.sync();  
    await AnuncioBloque.sync();  
    await OrdenPublicidad.sync();  
    await OrdenProgramacion.sync();  
    console.log('✅ Modelos de programación-publicidad sincronizados.');

        // Sincronizar modelos de Facturacion
    await FormaPago.sync();
    await Factura.sync();
    await Descuento.sync();
    await DetalleDescuento.sync();
    await FacturaDetalle.sync();
    await Cai.sync();
    console.log('✅ Modelos de Facturacion sincronizados.');

    // Iniciar servidor
    const PORT = process.env.puerto || 3000;
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Error al iniciar la base de datos o el servidor:', err);
  }
};

startServer();
