# Proyecto de Ingenieria de Software

Sistema de gestión integral para un canal de television.

Descripción del proyecto
El sistema es un ERP para "Televisión Comayagua Canal 40" (Honduras) que gestiona inventario de equipos de transmisión, facturación publicitaria con cumplimiento fiscal (CAI/SAR), programación de parrilla televisiva y gestión de clientes Inserts de prueba.sql:1-4 .

2. Stack tecnológico
Capa	Tecnología
Backend	Express.js 5, Sequelize 6, Passport-JWT, Swagger package.json:21-37
Frontend	React con React Router, layouts Admin.js/Auth.js routes.js:415-429
Base de datos	MySQL (base proyecto)
PDFs	pdfkit, @react-pdf/renderer para facturas package.json:15-33
3. Módulos funcionales
Facturación: facturas con CAI, canjes, contratos, pagos — rutas en views/facturacion/ routes.js:19-30
Programación: programas y pautas publicitarias routes.js:298-321
Inventario: activos, stock, mantenimiento, reportes routes.js:41-47
Clientes/Empleados/Personas: gestión con formularios routes.js:2-15
Seguridad: login, registro, roles (Gerente, Administrador, Vendedor, Operador, Contador) Inserts de prueba.sql:53-59
4. Instalación y ejecución
# Backend  
cd backend  
npm install  
npm run dev    # nodemon  
npm start      # producción
Los scripts disponibles son start y dev package.json:5-9 .

5. Datos de prueba
Mencionar que Inserts de prueba.sql puebla la base con 16 clientes, 21 programas, 16 equipos de inventario y usuarios de prueba como admin/admin123 Inserts de prueba.sql:85-90 .

6. Documentación API
Indicar que Swagger UI está disponible en /api-docs y que las rutas usan el prefijo /api/optica/ productoRutas.js:15-23 .


