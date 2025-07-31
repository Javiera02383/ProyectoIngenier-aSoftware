-- ============================================  
-- SCRIPT COMPLETO DE INSERCIÓN DE DATOS  
-- Sistema de Gestión Televisión Comayagua Canal 40  
-- ============================================  
  
-- 1. TABLAS BASE (sin foreign keys)  
  
-- Tabla: atributo  
INSERT INTO atributo (nombre, tipo) VALUES   
('Color', 'texto'),  
('Tamaño', 'texto'),  
('Material', 'texto'),  
('Graduación', 'numero'),  
('Duración', 'numero'),  
('Horario', 'texto');  
  
-- Tabla: persona  
INSERT INTO persona (Pnombre, Snombre, Papellido, Sapellido, Direccion, DNI, correo, fechaNacimiento, genero) VALUES   
('José', 'Dolores', 'Gámez', 'Suazo', 'Colonia San Miguel N°2', '12171961001526', 'jose.gamez@televisioncomayagua.com', '1961-07-12', 'M'),  
('Luisa', 'María', 'Gómez', 'Hernández', 'Boulevard del Sur', '0801198505678', 'luisa.gomez@televisioncomayagua.com', '1985-03-15', 'F'),  
('Carlos', 'Eduardo', 'Martínez', 'López', 'Col. Kennedy', '0801199001234', 'carlos.martinez@massPublicidad.com', '1990-01-15', 'M'),  
('Laura', 'Beatriz', 'Castro', 'Gómez', 'Col. Trejo', '0801199505678', 'laura.castro@creativosunidos.com', '1995-06-22', 'F'),  
('Juan', 'Antonio', 'Pérez', 'Rodríguez', 'Centro Comayagua', '0801198801234', 'juan.perez@empresa.com', '1988-08-10', 'M');  
  
-- Tabla: rol  
INSERT INTO rol (nombre, descripcion) VALUES   
('Administrador', 'Control total del sistema'),  
('Vendedor', 'Gestión de ventas y clientes'),  
('Operador', 'Operación de equipos de transmisión'),  
('Contador', 'Gestión financiera y contable');  
  
-- Tabla: categoriaproducto  
INSERT INTO categoriaproducto (Nombre, descripcion, marca) VALUES   
('Servicios Publicitarios', 'Spots y programas publicitarios', 'Canal 40'),  
('Servicios de Transmisión', 'Servicios de transmisión televisiva', 'Canal 40'),  
('Productos Digitales', 'Contenido digital y streaming', 'Canal 40');  
  
-- Tabla: tipo_enfermedad (mantenemos para compatibilidad)  
INSERT INTO tipo_enfermedad (Nombre, Descripcion) VALUES   
('N/A', 'No aplica para sistema televisivo'),  
('Otro', 'Otros casos especiales');  
  
-- Tabla: descuento  
INSERT INTO descuento (Tipo, Estado, Porcentaje) VALUES   
('Sin descuento', 'Activo', 0),  
('Cliente Frecuente', 'Activo', 5),  
('Contrato Anual', 'Activo', 10),  
('Pago Anticipado', 'Activo', 8),  
('Volumen Alto', 'Activo', 15);  
  
-- Tabla: formapago  
INSERT INTO formapago (idFormaPago, Formapago, Estado, validacionRequerida, cuentaBancaria, nombreBeneficiario) VALUES   
(1, 'Efectivo', 'A', false, NULL, 'Televisión Comayagua Canal 40'),  
(2, 'Transferencia Bancaria', 'A', true, '1234567890', 'Televisión Comayagua Canal 40'),  
(3, 'Cheque', 'A', true, '1234567890', 'Televisión Comayagua Canal 40'),  
(4, 'Tarjeta de Crédito', 'A', false, NULL, 'Televisión Comayagua Canal 40');  
  
-- Tabla: cai (Código de Autorización de Impresión)  
INSERT INTO cai (codigoCAI, numeroFacturaInicio, numeroFacturaFin, fechaEmision, fechaVencimiento, resolucionSAR, nombreEmpresa, rtnEmpresa, activo, facturasEmitidas, createdAt, updatedAt) VALUES   
('254F8-612F1-8A0E0-6E8B3-0099B876', '000-001-01-00000001', '000-001-01-99999999', '2025-01-01', '2025-12-31', 'SAR No. 45145', 'Televisión Comayagua Canal 40', '12171961001526', true, 0, NOW(), NOW()),  
('123A4-567B8-9C0D1-2E3F4-5678G901', '000-002-01-00000001', '000-002-01-99999999', '2024-01-01', '2024-12-31', 'SAR No. 44123', 'Televisión Comayagua Canal 40', '12171961001526', false, 1250, NOW(), NOW());  
  
-- 2. TABLAS CON FOREIGN KEYS A PERSONA  
  
-- Tabla: telefono  
INSERT INTO telefono (Numero, Estado, idPersona) VALUES   
('27727427', 'Activo', 1),  
('27706810', 'Activo', 1),  
('99574580', 'Activo', 1),  
('99998888', 'Activo', 2),  
('88887777', 'Activo', 3),  
('77776666', 'Activo', 4),  
('66665555', 'Activo', 5);  
  
-- Tabla: usuario  
INSERT INTO usuario (Nombre_Usuario, contraseña, estado, idPersona, idrol) VALUES   
('admin', 'admin123', 'Activo', 1, 1),  
('luisa.gomez', 'luisa456', 'Activo', 2, 2),  
('carlos.martinez', 'carlos789', 'Activo', 3, 2),  
('laura.castro', 'laura012', 'Activo', 4, 2);  
  
-- Tabla: empleado  
INSERT INTO empleado (idPersona, Fecha_Registro) VALUES   
(1, NOW()),  
(2, NOW()),  
(3, NOW()),  
(4, NOW());  
  
-- Tabla: cliente  
INSERT INTO cliente (fechaRegistro, idPersona) VALUES   
(NOW(), 3),  
(NOW(), 4),  
(NOW(), 5);  
  
-- 3. TABLAS DE PRODUCTOS/SERVICIOS  
  
-- Tabla: producto  
INSERT INTO producto (Nombre, idCategoriaProducto, impuesto, marca, precioCosto, precioVenta, stockInicial, imagen) VALUES   
('Spot 30 segundos Prime Time', 1, 0.15, 'Canal 40', 100, 150, 999, 'spot_30s.jpg'),  
('Spot 60 segundos Prime Time', 1, 0.15, 'Canal 40', 180, 280, 999, 'spot_60s.jpg'),  
('Programa Matutino 30 min', 1, 0.15, 'Canal 40', 800, 1200, 999, 'programa_matutino.jpg'),  
('Programa Nocturno 60 min', 1, 0.15, 'Canal 40', 1300, 2000, 999, 'programa_nocturno.jpg'),  
('Mención en Noticiero', 1, 0.15, 'Canal 40', 50, 80, 999, 'mencion_noticiero.jpg'),  
('Patrocinio Deportivo', 1, 0.15, 'Canal 40', 300, 500, 999, 'patrocinio_deportivo.jpg');  
  
-- Tabla: producto_has_atributo  
INSERT INTO producto_has_atributo (idProducto, idAtributo, stockActual) VALUES   
(1, 5, 999), -- Spot 30s - Duración  
(1, 6, 999), -- Spot 30s - Horario  
(2, 5, 999), -- Spot 60s - Duración  
(2, 6, 999), -- Spot 60s - Horario  
(3, 5, 999), -- Programa Matutino - Duración  
(3, 6, 999), -- Programa Matutino - Horario  
(4, 5, 999), -- Programa Nocturno - Duración  
(4, 6, 999), -- Programa Nocturno - Horario  
(5, 5, 999), -- Mención - Duración  
(6, 5, 999); -- Patrocinio - Duración  
  
-- 4. TABLAS DE CONSULTAS (adaptadas para TV)  
  
-- Tabla: consulta (adaptada para reuniones comerciales)  
INSERT INTO consulta (FechaRegistro, Fecha_consulta, Motivo_consulta, Observaciones, idCliente, idEmpleado) VALUES   
(NOW(), NOW(), 'Propuesta publicitaria', 'Cliente interesado en campaña deportiva', 1, 2),  
(NOW(), NOW(), 'Renovación contrato', 'Cliente quiere ampliar horarios', 2, 2),  
(NOW(), NOW(), 'Nueva campaña', 'Lanzamiento de producto', 3, 2);  
  
-- Tabla: receta (adaptada para propuestas comerciales)  
INSERT INTO receta (Agudeza_Visual, EsferaIzquierdo, Esfera_Derecho, Cilindro_Izquierdo, Cilindro_Derecho, Eje_Izquierdo, Eje_Derecho, Distancia_Pupilar, Tipo_Lente, Diagnostico, idCliente, idEmpleado, Fecha) VALUES   
('N/A', 0, 0, 0, 0, 0, 0, 0, 'Propuesta', 'Campaña publicitaria aprobada', 1, 2, NOW()),  
('N/A', 0, 0, 0, 0, 0, 0, 0, 'Contrato', 'Renovación de servicios', 2, 2, NOW());  
  
-- Tabla: examen_vista (adaptada para evaluaciones comerciales)  
INSERT INTO examen_vista (idConsulta, Fecha_Examen, Observaciones, idReceta) VALUES   
(1, NOW(), 'Propuesta aceptada por el cliente', 1),  
(2, NOW(), 'Términos de contrato acordados', 2);  
  
-- Tabla: diagnostico  
INSERT INTO diagnostico (idExamen, idTipoEnfermedad) VALUES   
(1, 1),  
(2, 1);  
  
-- Tabla: reparacion_de_lentes (adaptada para servicios técnicos)  
INSERT INTO reparacion_de_lentes (Tipo_Reparacion, idConsulta, Descripcion, Costo) VALUES   
('Ajuste de horario', 1, 'Cambio de horario de transmisión', 0),  
('Modificación de contenido', 2, 'Actualización de spot publicitario', 50);  
  
-- 5. TABLAS DE FACTURACIÓN  
 INSERT INTO factura (  
  idFactura,  
  Fecha,  
  Total_Facturado,  
  Tipo_documento,  
  productoCliente,  
  mencion,  
  periodoInicio,  
  periodoFin,  
  tipoServicio,  
  agencia,  
  ordenNo,  
  ordenCompraExenta,  
  numeroRegistroSAG,  
  constanciaExonerado,  
  idCliente,  
  idFormaPago,  
  idEmpleado,  
  archivo_pdf,  
  estadoFactura  
) VALUES (  
  1,                                    -- idFactura  
  '2025-01-15 10:30:00',               -- Fecha  
  2500.00,                             -- Total_Facturado  
  'Factura',                           -- Tipo_documento  
  'Supermercados La Colonia',          -- productoCliente  
  'Comercial',                         -- mencion  
  '2025-01-01',                        -- periodoInicio  
  '2025-01-31',                        -- periodoFin  
  'spot',                              -- tipoServicio (spot, programa, contrato)  
  'MASS PUBLICIDAD',                   -- agencia  
  1001,                                -- ordenNo  
  'EX-2025-001',                       -- ordenCompraExenta  
  'SAG-12345',                         -- numeroRegistroSAG  
  'CONST-2025-001',                    -- constanciaExonerado  
  1,                                   -- idCliente (FK requerida)  
  1,                                   -- idFormaPago (FK requerida)  
  1,                                   -- idEmpleado (FK requerida)  
  'factura_1.pdf',                     -- archivo_pdf  
  'activa'                             -- estadoFactura (activa, anulada, cobrada, pendiente)  
);
INSERT INTO factura (  
  idFactura,  
  Fecha,  
  Total_Facturado,  
  Tipo_documento,  
  productoCliente,  
  mencion,  
  periodoInicio,  
  periodoFin,  
  tipoServicio,  
  agencia,  
  ordenNo,  
  ordenCompraExenta,  
  numeroRegistroSAG,  
  constanciaExonerado,  
  idCliente,  
  idFormaPago,  
  idEmpleado,  
  archivo_pdf,  
  estadoFactura  
) VALUES (  
  3,                                    -- idFactura  
  '2025-01-20 09:15:00',               -- Fecha  
  4500.75,                             -- Total_Facturado  
  'Factura',                           -- Tipo_documento  
  'Banco Atlántida',                   -- productoCliente  
  'Financiera',                        -- mencion  
  '2025-02-01',                        -- periodoInicio  
  '2025-02-28',                        -- periodoFin  
  'contrato',                          -- tipoServicio  
  'Publicidad Creativa S.A.',          -- agencia  
  2025,                                -- ordenNo  
  NULL,                                -- ordenCompraExenta  
  NULL,                                -- numeroRegistroSAG  
  NULL,                                -- constanciaExonerado  
  3,                                   -- idCliente (FK requerida)  
  2,                                   -- idFormaPago (FK requerida)  
  2,                                   -- idEmpleado (FK requerida)  
  'factura_3.pdf',                     -- archivo_pdf  
  'activa'                             -- estadoFactura  
);
INSERT INTO factura (  
  idFactura,  
  Fecha,  
  Total_Facturado,  
  Tipo_documento,  
  productoCliente,  
  mencion,  
  periodoInicio,  
  periodoFin,  
  tipoServicio,  
  agencia,  
  ordenNo,  
  ordenCompraExenta,  
  numeroRegistroSAG,  
  constanciaExonerado,  
  idCliente,  
  idFormaPago,  
  idEmpleado,  
  archivo_pdf,  
  estadoFactura  
) VALUES (  
  2,                                   -- idFactura  
  '2025-01-15 14:45:00',              -- Fecha  
  1800.50,                            -- Total_Facturado  
  'Factura',                          -- Tipo_documento  
  NULL,                               -- productoCliente (opcional)  
  NULL,                               -- mencion (opcional)  
  NULL,                               -- periodoInicio (opcional)  
  NULL,                               -- periodoFin (opcional)  
  'programa',                         -- tipoServicio  
  NULL,                               -- agencia (opcional)  
  NULL,                               -- ordenNo (opcional)  
  NULL,                               -- ordenCompraExenta (opcional)  
  NULL,                               -- numeroRegistroSAG (opcional)  
  NULL,                               -- constanciaExonerado (opcional)  
  2,                                  -- idCliente (FK requerida)  
  2,                                  -- idFormaPago (FK requerida)  
  1,                                  -- idEmpleado (FK requerida)  
  NULL,                               -- archivo_pdf (opcional)  
  'activa'                            -- estadoFactura (valor por defecto)  
);


  
-- Tabla: detalle_descuento  
INSERT INTO detalle_descuento (idFactura, idDescuento, Monto) VALUES   
(1, 2, 75.00),  -- Cliente frecuente 5%  
(2, 3, 230.00), -- Contrato anual 10%  
(3, 4, 120.00); -- Pago anticipado 8%  
  
-- Tabla: facturadetalle  
INSERT INTO facturadetalle (idConsulta, Cantidad, idFactura, idProductoAtributo) VALUES   
(1, '10', 1, 1), -- 10 spots de 30s  
(1, '5', 1, 2),  -- 5 spots de 60s  
(2, '1', 2, 3),  -- 1 programa matutino  
(2, '1', 2, 4),  -- 1 programa nocturno  
(3, '20', 3, 1), -- 20 spots de 30s  
(3, '5', 3, 5);  -- 5 menciones en noticiero  
  
  
INSERT INTO inventario (codigo, nombre, descripcion, cantidad, ubicacion, idEmpleado, valor, estado, observacion)
VALUES
('INV001', 'Laptop Dell Latitude', 'Laptop empresarial con 16GB RAM y SSD 512GB', 5, 'Oficina Principal', 1, 950.00, 'Disponible', 'Listas para asignar'),
('INV002', 'Proyector Epson X10', 'Proyector HD para salas de reuniones', 2, 'Sala de Juntas', 2, 450.00, 'Asignado', 'Usado en capacitaciones'),
('INV003', 'Silla Ergonómica', 'Silla con soporte lumbar para oficina', 10, 'Bodega 1', 3, 120.00, 'Disponible', NULL),
('INV004', 'Router MikroTik RB3011', 'Router de alta capacidad para red interna', 1, 'Centro de Datos', 4, 180.50, 'En Mantenimiento', 'Pendiente de revisión'),
('INV005', 'Monitor HP 24"', 'Monitor LED de 24 pulgadas Full HD', 4, 'Oficina Soporte Técnico', 4, 160.00, 'Baja', 'Pantallas defectuosas');
  
  
-- ============================================  
-- FIN DEL SCRIPT DE INSERCIÓN  
-- ============================================