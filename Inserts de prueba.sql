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
-- Empleados
('José', 'Dolores', 'Gámez', 'Suazo', 'Colonia San Miguel N°2', '12171961001526', 'jose.gamez@televisioncomayagua.com', '1961-07-12', 'M'),
('Luisa', 'María', 'Gómez', 'Hernández', 'Boulevard del Sur', '0801198505678', 'luisa.gomez@televisioncomayagua.com', '1985-03-15', 'F'),
('Carlos', 'Eduardo', 'Martínez', 'López', 'Col. Kennedy', '0801199001234', 'carlos.martinez@massPublicidad.com', '1990-01-15', 'M'),
('Laura', 'Beatriz', 'Castro', 'Gómez', 'Col. Trejo', '0801199505678', 'laura.castro@creativosunidos.com', '1995-06-22', 'F'),
('Juan', 'Antonio', 'Pérez', 'Rodríguez', 'Centro Comayagua', '0801198801234', 'juan.perez@empresa.com', '1988-08-10', 'M'),
('Juana', 'A', 'Pérez', 'Rodríguez', 'Centro Comayagua', '0801198801235', 'juana.perez@empresa.com', '1988-08-10', 'F'),

-- Proveedores (valores NULL en campos no aplicables)
('Distribuidora', NULL, 'TecnoHonduras', NULL, 'Tegucigalpa, Honduras', '0801199876543', 'ventas@tecnohonduras.hn', NULL, 'M'),
('Sony', NULL, 'Professional', NULL, 'Miami, FL, USA', '0000000000001', 'sales@sonypro.com', NULL, 'M'),
('Canon', NULL, 'Honduras', NULL, 'San Pedro Sula, Honduras', '0801199876544', 'info@canonhn.com', NULL, 'M'),
('Shure', NULL, 'Incorporated', NULL, 'Illinois, USA', '0000000000002', 'sales@shure.com', NULL, 'M');
  
-- Personas para empresas anunciantes  
INSERT INTO persona (Pnombre, Papellido, Direccion, DNI, correo, genero) VALUES  
('CLARO', 'Honduras', 'Tegucigalpa, Honduras', '0801199000001', 'publicidad@claro.hn', 'M'),  
('SECOPV', 'Seguros', 'Comayagua, Honduras', '0801199000002', 'marketing@secopv.hn', 'M'),  
('MUNICOM', 'Comunicaciones', 'Comayagua, Honduras', '0801199000003', 'ventas@municom.hn', 'M'),  
('MACONSA', 'Constructora', 'Comayagua, Honduras', '0801199000004', 'publicidad@maconsa.hn', 'M'),  
('UNAH', 'Universidad', 'Tegucigalpa, Honduras', '0801199000005', 'comunicacion@unah.edu.hn', 'M'),  
('MOTOMUNDO', 'Concesionario', 'Comayagua, Honduras', '0801199000006', 'ventas@motomundo.hn', 'M'),  
('SINET', 'Telecomunicaciones', 'San Pedro Sula, Honduras', '0801199000007', 'marketing@sinet.hn', 'M'),  
('SANMARQUEÑA COOP', 'Cooperativa', 'La Esperanza, Honduras', '0801199000008', 'publicidad@sanmarquena.hn', 'M'),  
('SONRÍA', 'Dental', 'Comayagua, Honduras', '0801199000009', 'info@sonria.hn', 'M'),  
('COFICESA', 'Financiera', 'Tegucigalpa, Honduras', '0801199000010', 'marketing@coficesa.hn', 'M'),  
('VILLAMIX', 'Construcción', 'Comayagua, Honduras', '0801199000011', 'ventas@villamix.hn', 'M'),  
('LACOLONIA', 'Seguros', 'Tegucigalpa, Honduras', '0801199000012', 'publicidad@lacolonia.hn', 'M'),  
('TIENDAERFA', 'Retail', 'Comayagua, Honduras', '0801199000013', 'marketing@tiendaerfa.hn', 'M'),  
('CABLECOLOR', 'Televisión', 'Tegucigalpa, Honduras', '0801199000014', 'ventas@cablecolor.hn', 'M'),  
('PROMODJFLECHA', 'Promociones', 'Comayagua, Honduras', '0801199000015', 'info@promodjflecha.hn', 'M'),  
('CHAVERYASOCIADO', 'Servicios', 'Comayagua, Honduras', '0801199000016', 'contacto@chaveryasociado.hn', 'M');  
  

-- Tabla: rol  
INSERT INTO rol (nombre, descripcion) VALUES 
('Gerente', 'Gerencia General'),   
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
  
--  *************************************************************************************************************************************************
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
INSERT INTO empleado (idPersona, idRol, Fecha_Registro) VALUES   
(1, 1, NOW()),  
(2, 2, NOW()),  
(3, 2, NOW());  


-- Tabla: Proveedores  
INSERT INTO proveedor (idPersona, codigoProveedor, tipoProveedor, estado, fechaRegistro) VALUES
-- idPersona debe coincidir con los registros en la tabla persona
(7, 'PROV001', 'Nacional', 'Activo', NOW()),
(8, 'PROV002', 'Internacional', 'Activo', NOW()),
(9, 'PROV003', 'Nacional', 'Activo', NOW()),
(10, 'PROV004', 'Internacional', 'Activo', NOW());
  
-- Tabla: cliente  
-- Clientes para Modulo de Anuncio
INSERT INTO cliente (fechaRegistro, idPersona) VALUES    
(NOW(), 11),    
(NOW(), 12),    
(NOW(), 13),    
(NOW(), 14),    
(NOW(), 15),    
(NOW(), 16),    
(NOW(), 17),    
(NOW(), 18),    
(NOW(), 19),    
(NOW(), 20),    
(NOW(), 21),    
(NOW(), 22),    
(NOW(), 23),    
(NOW(), 24),    
(NOW(), 25),    
(NOW(), 26); 
  
-- ********************************************************************************************************************************************

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
  
  -- *******************************************************************************************************************************************
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
  
  
  

-- ***********************************************************************************************************************************************
-- Modulo de Programacion - Publicidad
-- Tabla: programa

-- Programas de Noticias  
INSERT INTO `programa` (`idPrograma`, `nombre`, `tipoCalendario`, `horaInicio`, `duracion`, `categoria`, `estado`, `idEmpleado`, `fechaCreacion`) VALUES
(1, 'NOTICIAS 60 MINUTOS', 'Lunes_Sabado', '07:00:00', 151, 'Noticias', 'Activo', 2, '2025-08-08 07:32:27'),
(2, 'PELÍCULA MATUTINA', 'Lunes_Sabado', '09:00:00', 120, 'Entretenimiento', 'Activo', 1, '2025-08-09 21:22:11'),
(3, 'DOCUMENTALES', 'Lunes_Sabado', '11:00:00', 60, 'Cultural', 'Activo', 1, '2025-08-09 21:39:27'),
(4, 'TVN40 MERIDIANO', 'Lunes_Sabado', '12:00:00', 60, 'Noticias', 'Activo', 1, '2025-08-09 21:50:37'),
(5, 'INFANTILES', 'Lunes_Sabado', '13:00:00', 60, 'Infantil', 'Activo', 1, '2025-08-09 22:18:38'),
(6, 'VIVA LA MÚSICA', 'Lunes_Sabado', '14:00:00', 180, 'Entretenimiento', 'Activo', 1, '2025-08-09 22:28:05'),
(7, 'SERIES', 'Lunes_Sabado', '17:00:00', 58, 'Entretenimiento', 'Activo', 1, '2025-08-09 23:07:18'),
(8, 'TV NOTICIAS 40', 'Lunes_Sabado', '18:00:00', 240, 'Noticias', 'Activo', 1, '2025-08-09 23:13:28'),
(9, 'CIERRE', 'Lunes_Sabado', '22:00:00', 1, 'Noticias', 'Activo', 1, '2025-08-09 23:39:04'),
(10, 'DOMINGO MATUTINO', 'Domingo', '10:00:00', 120, 'Noticias', 'Activo', 1, '2025-08-10 03:12:50'),
(11, 'DOMINGO VESPERTINO', 'Domingo', '12:00:00', 359, 'Noticias', 'Activo', 1, '2025-08-10 03:21:16'),
(12, 'DOMINGO NOCTURNO', 'Domingo', '18:00:00', 240, 'Noticias', 'Activo', 1, '2025-08-10 04:00:51'); 

-- ************************************************
-- Tabla: Bloque publicitario

-- Bloques publicitarios adicionales para programas existentes  
-- Usando clientes con IDs del 11 al 26  
  
INSERT INTO `bloque_publicitario` (`idBloque`, `idPrograma`, `horaBloque`, `ordenBloque`, `duracionTotal`, `fechaVigencia`, `estado`) VALUES
(1, 1, '07:55:00', 3, 30, '2025-08-09', 'Activo'),
(2, 1, '07:05:00', 2, 60, '2025-08-09', 'Activo'),
(3, 1, '08:20:00', 4, 45, '2025-08-09', 'Activo'),
(4, 1, '08:30:00', 5, 45, '2025-08-09', 'Activo'),
(5, 2, '09:00:00', 1, 45, '2025-08-09', 'Activo'),
(6, 2, '09:30:00', 2, 30, '2025-08-09', 'Activo'),
(7, 2, '10:00:00', 3, 30, '2025-08-09', 'Activo'),
(8, 2, '10:30:00', 4, 30, '2025-08-09', 'Activo'),
(9, 2, '11:00:00', 5, 30, '2025-08-09', 'Activo'),
(10, 3, '11:15:00', 1, 30, '2025-08-09', 'Activo'),
(11, 3, '11:30:00', 2, 30, '2025-08-09', 'Activo'),
(12, 3, '11:55:00', 3, 45, '2025-08-09', 'Activo'),
(13, 4, '12:10:00', 1, 30, '2025-08-09', 'Activo'),
(14, 4, '12:25:00', 2, 45, '2025-08-09', 'Activo'),
(15, 4, '12:35:00', 1, 30, '2025-08-09', 'Activo'),
(18, 4, '12:45:00', 4, 30, '2025-08-09', 'Activo'),
(19, 4, '12:55:00', 5, 30, '2025-08-09', 'Activo'),
(20, 5, '13:15:00', 1, 30, '2025-08-09', 'Activo'),
(21, 5, '13:45:00', 2, 30, '2025-08-09', 'Activo'),
(22, 6, '14:00:00', 1, 30, '2025-08-09', 'Activo'),
(23, 6, '14:30:00', 2, 45, '2025-08-09', 'Activo'),
(24, 6, '15:00:00', 3, 45, '2025-08-09', 'Activo'),
(25, 6, '15:30:00', 4, 45, '2025-08-09', 'Activo'),
(26, 6, '16:00:00', 5, 30, '2025-08-09', 'Activo'),
(27, 7, '17:00:00', 1, 45, '2025-08-09', 'Activo'),
(28, 7, '17:15:00', 2, 30, '2025-08-09', 'Activo'),
(29, 7, '17:30:00', 3, 30, '2025-08-09', 'Activo'),
(30, 7, '17:45:00', 4, 30, '2025-08-09', 'Activo'),
(31, 7, '18:00:00', 5, 30, '2025-08-09', 'Activo'),
(32, 8, '18:10:00', 1, 60, '2025-08-09', 'Activo'),
(33, 8, '18:25:00', 2, 60, '2025-08-09', 'Activo'),
(34, 8, '18:35:00', 3, 45, '2025-08-09', 'Activo'),
(35, 8, '18:45:00', 4, 60, '2025-08-09', 'Activo'),
(36, 8, '18:55:00', 5, 45, '2025-08-09', 'Activo'),
(37, 8, '19:30:00', 6, 60, '2025-08-09', 'Activo'),
(38, 8, '20:00:00', 7, 60, '2025-08-09', 'Activo'),
(39, 8, '20:30:00', 8, 75, '2025-08-09', 'Activo'),
(40, 8, '21:00:00', 9, 74, '2025-08-09', 'Activo'),
(41, 8, '21:30:00', 10, 60, '2025-08-09', 'Activo'),
(42, 10, '11:00:00', 1, 45, '2025-08-10', 'Activo'),
(43, 10, '11:30:00', 2, 45, '2025-08-10', 'Activo'),
(44, 10, '12:00:00', 3, 45, '2025-08-10', 'Activo'),
(45, 11, '12:30:00', 1, 30, '2025-08-10', 'Activo'),
(46, 11, '13:00:00', 2, 30, '2025-08-10', 'Activo'),
(47, 11, '13:30:00', 3, 30, '2025-08-10', 'Activo'),
(48, 11, '14:00:00', 4, 30, '2025-08-10', 'Activo'),
(49, 11, '14:30:00', 5, 30, '2025-08-10', 'Activo'),
(50, 11, '15:00:00', 6, 30, '2025-08-10', 'Activo'),
(51, 11, '15:30:00', 7, 30, '2025-08-10', 'Activo'),
(53, 11, '16:00:00', 8, 30, '2025-08-10', 'Activo'),
(54, 11, '16:30:00', 9, 30, '2025-08-10', 'Activo'),
(55, 11, '17:00:00', 10, 30, '2025-08-10', 'Activo'),
(56, 11, '17:30:00', 11, 30, '2025-08-10', 'Activo'),
(57, 11, '18:00:00', 12, 30, '2025-08-10', 'Activo'),
(58, 12, '18:30:00', 1, 30, '2025-08-10', 'Activo'),
(59, 12, '19:00:00', 2, 30, '2025-08-10', 'Activo'),
(60, 12, '19:30:00', 3, 30, '2025-08-10', 'Activo'),
(61, 12, '20:00:00', 4, 30, '2025-08-10', 'Activo');

-- ************************************************
-- Tabla: anuncio_bloque

INSERT INTO `anuncio_bloque` (`idAnuncioBloque`, `idBloque`, `idCliente`, `ordenAnuncio`, `duracionAnuncio`, `nombreComercial`, `archivoAnuncio`, `estado`) VALUES
(1, 1, 6, 1, 10, 'MOTOMUNDO', NULL, 'Programado'),
(2, 1, 3, 2, 10, 'MUNICOM', NULL, 'Programado'),
(3, 1, 7, 3, 10, 'SINET', NULL, 'Programado'),
(4, 2, 1, 1, 10, 'CLARO', NULL, 'Programado'),
(5, 2, 2, 2, 10, 'SECOPV', NULL, 'Programado'),
(6, 2, 3, 3, 10, 'MUNICOM', NULL, 'Programado'),
(7, 2, 4, 4, 15, 'MACONSA', NULL, 'Programado'),
(8, 2, 5, 5, 15, 'UNAH', NULL, 'Programado'),
(9, 3, 1, 1, 10, 'CLARO', NULL, 'Programado'),
(10, 3, 3, 2, 10, 'MUNICOM', NULL, 'Programado'),
(11, 3, 8, 3, 10, 'COOPERATIVA SANMARQUEÑA', NULL, 'Programado'),
(12, 3, 9, 4, 15, 'SONRÍA', NULL, 'Programado'),
(13, 4, 1, 1, 10, 'CLARO', NULL, 'Programado'),
(14, 4, 10, 2, 10, 'COFICESA', NULL, 'Programado'),
(15, 4, 3, 3, 10, 'MUNICOM', NULL, 'Programado'),
(16, 4, 11, 4, 15, 'VILLAMIX', NULL, 'Programado'),
(17, 5, 1, 1, 10, 'CLARO', NULL, 'Programado'),
(18, 5, 2, 2, 10, 'SECOVP', NULL, 'Programado'),
(19, 5, 9, 3, 10, 'SONRÍA', NULL, 'Programado'),
(20, 5, 14, 4, 15, 'CABLE COLOR', NULL, 'Programado'),
(21, 6, 12, 1, 10, 'LA COLONIA', NULL, 'Programado'),
(22, 6, 13, 2, 10, 'TIENDA ERFA', NULL, 'Programado'),
(23, 6, 7, 3, 10, 'SINET', NULL, 'Programado'),
(24, 7, 1, 1, 10, 'CLARO', NULL, 'Programado'),
(25, 7, 8, 2, 10, 'COOPERATIVA SANMARQUEÑA', NULL, 'Programado'),
(26, 7, 10, 3, 10, 'COFICESA', NULL, 'Programado'),
(27, 8, 6, 1, 10, 'MOTOMUNDO', NULL, 'Programado'),
(28, 8, 2, 2, 10, 'SECOPV', NULL, 'Programado'),
(29, 8, 15, 3, 10, 'CLARO', NULL, 'Programado'),
(30, 9, 1, 1, 10, 'CLARO', NULL, 'Programado'),
(31, 9, 3, 2, 10, 'MUNICOM', NULL, 'Programado'),
(32, 9, 4, 3, 10, 'MACONSA', NULL, 'Programado'),
(33, 10, 10, 1, 15, 'COFICESA', NULL, 'Programado'),
(34, 10, 3, 2, 15, 'MUNICOM', NULL, 'Programado'),
(35, 11, 1, 1, 15, 'CLARO', NULL, 'Programado'),
(36, 11, 13, 2, 15, 'TIENDA ERFA', NULL, 'Programado'),
(37, 12, 2, 1, 10, 'SECOPV', NULL, 'Programado'),
(38, 12, 4, 2, 10, 'MACONSA', NULL, 'Programado'),
(39, 12, 5, 3, 10, 'UNAH', NULL, 'Programado'),
(40, 12, 11, 4, 15, 'VILLAMIX', NULL, 'Programado'),
(41, 13, 12, 1, 10, 'LA COLONIA', NULL, 'Programado'),
(42, 13, 13, 2, 10, 'TIENDA ERFA', NULL, 'Programado'),
(43, 13, 14, 3, 10, 'CABLE COLOR', NULL, 'Programado'),
(44, 14, 1, 1, 10, 'CLARO', NULL, 'Programado'),
(45, 14, 8, 2, 10, 'COOPERATIVA SANMARQUEÑA', NULL, 'Programado'),
(46, 14, 9, 3, 10, 'SONRÍA', NULL, 'Programado'),
(47, 14, 10, 4, 15, 'COFICESA', NULL, 'Programado'),
(48, 15, 6, 1, 10, 'MOTOMUNDO', NULL, 'Programado'),
(49, 15, 4, 2, 10, 'MACONSA', NULL, 'Programado'),
(50, 15, 13, 3, 10, 'TIENDA ERFA', NULL, 'Programado'),
(57, 18, 7, 1, 15, 'SINET', NULL, 'Programado'),
(58, 18, 3, 2, 15, 'MUNICOM', NULL, 'Programado'),
(59, 19, 1, 1, 10, 'CLARO', NULL, 'Programado'),
(60, 19, 9, 2, 10, 'SONRÍA', NULL, 'Programado'),
(61, 19, 2, 3, 11, 'SECOPV', NULL, 'Programado'),
(62, 20, 4, 1, 15, 'MACONSA', NULL, 'Programado'),
(63, 20, 15, 2, 14, 'DJ FLECHA', NULL, 'Programado'),
(64, 21, 3, 1, 30, 'MUNICOM', NULL, 'Programado'),
(65, 22, 1, 1, 10, 'CLARO', NULL, 'Programado'),
(66, 22, 8, 2, 10, 'COOPERATIVA SANMARQUEÑA', NULL, 'Programado'),
(67, 22, 2, 3, 10, 'SECOPV', NULL, 'Programado'),
(68, 23, 12, 1, 10, 'LA COLONIA', NULL, 'Programado'),
(69, 23, 6, 2, 10, 'MOTOMUNDO', NULL, 'Programado'),
(70, 23, 13, 3, 10, 'TIENDA ERFA', NULL, 'Programado'),
(71, 23, 10, 4, 15, 'COFICESA', NULL, 'Programado'),
(72, 24, 1, 1, 10, 'CLARO', NULL, 'Programado'),
(73, 24, 8, 2, 10, 'COOPERATIVA SANMARQUEÑA', NULL, 'Programado'),
(74, 24, 2, 3, 10, 'SECOPV', NULL, 'Programado'),
(75, 24, 11, 4, 15, 'VILLAMIX', NULL, 'Programado'),
(76, 25, 1, 1, 10, 'CLARO', NULL, 'Programado'),
(77, 25, 4, 2, 10, 'MACONSA', NULL, 'Programado'),
(78, 25, 7, 3, 10, 'SINET', NULL, 'Programado'),
(79, 25, 15, 4, 15, 'DJ FLECHA', NULL, 'Programado'),
(80, 26, 1, 1, 10, 'CLARO', NULL, 'Programado'),
(81, 26, 10, 2, 10, 'COFICESA', NULL, 'Programado'),
(82, 26, 14, 3, 10, 'CABLECOLOR', NULL, 'Programado'),
(83, 27, 1, 1, 10, 'CLARO', NULL, 'Programado'),
(84, 27, 14, 2, 10, 'CABLE COLOR', NULL, 'Programado'),
(85, 27, 3, 3, 10, 'MUNICOM', NULL, 'Programado'),
(86, 27, 15, 4, 15, 'DJ FLECHA', NULL, 'Programado'),
(87, 28, 2, 1, 30, 'SECOPV', NULL, 'Programado'),
(88, 29, 1, 1, 15, 'CLARO', NULL, 'Programado'),
(89, 29, 10, 2, 15, 'COFICESA', NULL, 'Programado'),
(90, 30, 4, 1, 30, 'MACONSA', NULL, 'Programado'),
(91, 31, 1, 1, 10, 'CLARO', NULL, 'Programado'),
(92, 31, 3, 2, 10, 'MUNICOM', NULL, 'Programado'),
(93, 31, 5, 3, 10, 'UNAH', NULL, 'Programado'),
(94, 32, 1, 1, 10, 'CLARO', NULL, 'Programado'),
(95, 32, 8, 2, 10, 'COOPERATIVA SANMARQUEÑA', NULL, 'Programado'),
(96, 32, 10, 3, 10, 'COFICESA', NULL, 'Programado'),
(97, 32, 13, 4, 15, 'TIENDA ERFA', NULL, 'Programado'),
(98, 32, 7, 5, 15, 'SINET', NULL, 'Programado'),
(99, 33, 12, 1, 10, 'LA COLONIA', NULL, 'Programado'),
(100, 33, 6, 2, 10, 'MOTOMUNDO', NULL, 'Programado'),
(101, 33, 9, 3, 10, 'SONRÍA', NULL, 'Programado'),
(102, 33, 2, 4, 15, 'SECOPV', NULL, 'Programado'),
(103, 33, 3, 5, 15, 'MUNICOM', NULL, 'Programado'),
(104, 34, 1, 1, 10, 'CLARO', NULL, 'Programado'),
(105, 34, 14, 2, 10, 'CABLE COLOR', NULL, 'Programado'),
(106, 34, 8, 3, 10, 'COOPERATIVA SANMARQUEÑA', NULL, 'Programado'),
(107, 34, 10, 4, 15, 'COFICESA', NULL, 'Programado'),
(108, 35, 6, 1, 10, 'MOTOMUNDO', NULL, 'Programado'),
(109, 35, 12, 2, 10, 'LA COLONIA', NULL, 'Programado'),
(110, 35, 9, 3, 10, 'SONRÍA', NULL, 'Programado'),
(111, 35, 4, 4, 15, 'MACONSA', NULL, 'Programado'),
(112, 35, 3, 5, 15, 'MUNICOM', NULL, 'Programado'),
(113, 36, 1, 1, 10, 'CLARO', NULL, 'Programado'),
(114, 36, 2, 2, 10, 'SECOPV', NULL, 'Programado'),
(115, 36, 16, 3, 10, 'CHAVER Y ASOCIADO', NULL, 'Programado'),
(116, 36, 11, 4, 15, 'VILLAMIX', NULL, 'Programado'),
(117, 37, 1, 1, 10, 'CLARO', NULL, 'Programado'),
(118, 37, 6, 2, 10, 'MOTOMUNDO', NULL, 'Programado'),
(119, 37, 8, 3, 10, 'COOPERATIVA SANMARQUEÑA', NULL, 'Programado'),
(120, 37, 9, 4, 15, 'SONRÍA', NULL, 'Programado'),
(121, 37, 3, 5, 15, 'MUNICOM', NULL, 'Programado'),
(122, 38, 12, 1, 10, 'LA COLONIA', NULL, 'Programado'),
(123, 38, 13, 2, 10, 'TIENDA ERFA', NULL, 'Programado'),
(124, 38, 10, 3, 10, 'COFICESA', NULL, 'Programado'),
(125, 38, 4, 4, 15, 'MACONSA', NULL, 'Programado'),
(126, 38, 7, 5, 15, 'SINET', NULL, 'Programado'),
(127, 39, 1, 1, 10, 'CLARO', NULL, 'Programado'),
(128, 39, 6, 2, 10, 'MOTOMUNDO', NULL, 'Programado'),
(129, 39, 8, 3, 10, 'COOPERATIVA SANMARQUEÑA', NULL, 'Programado'),
(130, 39, 3, 4, 15, 'MUNICOM', NULL, 'Programado'),
(131, 39, 2, 5, 15, 'SECOPV', NULL, 'Programado'),
(132, 39, 14, 6, 15, 'CABLE COLOR', NULL, 'Programado'),
(133, 40, 12, 1, 10, 'LA COLONIA', NULL, 'Programado'),
(134, 40, 13, 2, 10, 'TIENDA ERFA', NULL, 'Programado'),
(135, 40, 10, 3, 10, 'COFICESA', NULL, 'Programado'),
(136, 40, 4, 4, 15, 'MACONSA', NULL, 'Programado'),
(137, 40, 7, 5, 15, 'SINET', NULL, 'Programado'),
(138, 40, 15, 6, 15, 'DJ FLECHA', NULL, 'Programado'),
(139, 41, 1, 1, 10, 'CLARO', NULL, 'Programado'),
(140, 41, 6, 2, 10, 'MOTOMUNDO', NULL, 'Programado'),
(141, 41, 8, 3, 10, 'COOPERATIVA SANMARQUEÑA', NULL, 'Programado'),
(142, 41, 3, 4, 15, 'MUNICOM', NULL, 'Programado'),
(143, 41, 14, 5, 15, 'CABLE COLOR', NULL, 'Programado'),
(144, 42, 1, 1, 10, 'CLARO', NULL, 'Programado'),
(145, 42, 9, 2, 10, 'SONRÍA', NULL, 'Programado'),
(146, 42, 2, 3, 10, 'SECOPV', NULL, 'Programado'),
(147, 42, 3, 4, 10, 'MUNICOM', NULL, 'Programado'),
(148, 42, 5, 5, 15, 'UNAH', NULL, 'Programado'),
(149, 43, 1, 1, 10, 'CLARO', NULL, 'Programado'),
(150, 43, 12, 2, 10, 'LA COLONIA', NULL, 'Programado'),
(151, 43, 8, 3, 10, 'COOPERATIVA SAN MARQUEÑA', NULL, 'Programado'),
(152, 43, 10, 4, 10, 'COFICESA', NULL, 'Programado'),
(153, 43, 11, 5, 15, 'VILLAMIX', NULL, 'Programado'),
(154, 44, 1, 1, 10, 'CLARO', NULL, 'Programado'),
(155, 44, 6, 2, 10, 'MOTOMUNDO', NULL, 'Programado'),
(156, 44, 3, 3, 10, 'MUNICOM', NULL, 'Programado'),
(157, 44, 13, 4, 10, 'TIENDA ERFA', NULL, 'Programado'),
(158, 44, 14, 5, 15, 'CABLE COLOR', NULL, 'Programado'),
(159, 45, 1, 1, 10, 'CLARO', NULL, 'Programado'),
(160, 45, 12, 2, 10, 'LA COLONIA', NULL, 'Programado'),
(161, 45, 2, 3, 10, 'SECOPV', NULL, 'Programado'),
(162, 46, 1, 1, 10, 'CLARO', NULL, 'Programado'),
(163, 46, 6, 2, 10, 'MOTOMUNDO', NULL, 'Programado'),
(164, 46, 9, 3, 10, 'SONRÍA', NULL, 'Programado'),
(165, 47, 8, 1, 10, 'COOPERATIVA SANMARQUEÑA', NULL, 'Programado'),
(166, 47, 4, 2, 10, 'MACONSA', NULL, 'Programado'),
(167, 47, 7, 3, 10, 'SINET', NULL, 'Programado'),
(168, 48, 1, 1, 10, 'CLARO', NULL, 'Programado'),
(169, 48, 13, 2, 10, 'TIENDA ERFA', NULL, 'Programado'),
(170, 48, 14, 3, 10, 'CABLE COLOR', NULL, 'Programado'),
(171, 49, 6, 1, 10, 'MOTOMUNDO', NULL, 'Programado'),
(172, 49, 9, 2, 10, 'SONRÍA', NULL, 'Programado'),
(173, 49, 4, 3, 10, 'MACONSA', NULL, 'Programado'),
(174, 50, 1, 1, 10, 'CLARO', NULL, 'Programado'),
(175, 50, 10, 2, 10, 'COFICESA', NULL, 'Programado'),
(176, 50, 3, 3, 10, 'MUNICOM', NULL, 'Programado'),
(177, 51, 12, 1, 15, 'LA COLONIA ', NULL, 'Programado'),
(178, 51, 8, 2, 15, 'COOPERATIVA SANMARQUEÑA', NULL, 'Programado'),
(180, 53, 1, 1, 10, 'CLARO', NULL, 'Programado'),
(181, 53, 3, 2, 10, 'MUNICOM', NULL, 'Programado'),
(182, 53, 13, 3, 10, 'TIENDA ERFA', NULL, 'Programado'),
(183, 54, 6, 1, 10, 'MOTOMUNDO', NULL, 'Programado'),
(184, 54, 3, 2, 10, 'MUNICOM', NULL, 'Programado'),
(185, 54, 2, 3, 10, 'SECOPV', NULL, 'Programado'),
(186, 55, 1, 1, 10, 'CLARO', NULL, 'Programado'),
(187, 55, 3, 2, 10, 'MUNICOM', NULL, 'Programado'),
(188, 55, 10, 3, 10, 'COFICESA', NULL, 'Programado'),
(189, 56, 12, 1, 10, 'LA COLONIA', NULL, 'Programado'),
(190, 56, 8, 2, 10, 'COOPERATIVA SAN MARQUEÑA', NULL, 'Programado'),
(191, 56, 4, 3, 10, 'MACONSA', NULL, 'Programado'),
(192, 57, 1, 1, 10, 'CLARO', NULL, 'Programado'),
(193, 57, 3, 2, 10, 'MUNICOM', NULL, 'Programado'),
(194, 57, 13, 3, 10, 'TIENDA ERFA', NULL, 'Programado'),
(195, 58, 12, 1, 10, 'LA COLONIA', NULL, 'Programado'),
(196, 58, 10, 2, 10, 'COFICESA', NULL, 'Programado'),
(197, 58, 9, 3, 10, 'SONRÍA', NULL, 'Programado'),
(198, 59, 1, 1, 10, 'CLARO', NULL, 'Programado'),
(199, 59, 13, 2, 10, 'TIENDA ERFA', NULL, 'Programado'),
(200, 59, 4, 3, 10, 'MACONSA', NULL, 'Programado'),
(201, 60, 6, 1, 10, 'MOTOMUNDO', NULL, 'Programado'),
(202, 60, 8, 2, 10, 'COOPERATIVA SANMARQUEÑA', NULL, 'Programado'),
(203, 60, 7, 3, 10, 'SINET', NULL, 'Programado'),
(204, 61, 1, 1, 10, 'CLARO', NULL, 'Programado'),
(205, 61, 11, 2, 10, 'VILLAMIX', NULL, 'Programado'),
(206, 61, 5, 3, 10, 'UNAH', NULL, 'Programado');

-- *******************************************************************
-- Tabla: Orden Publicidad
-- Órdenes de publicidad para empresas principales de Canal 40  
INSERT INTO orden_publicidad (numeroOrden, idCliente, producto, periodoInicio, periodoFin, valorSinImpuesto, impuesto, costoTotal, costoPeriodo, fechaAlAire, estado, idEmpleado, fechaCreacion, observaciones) VALUES  
('0001', 7, 'Servicios de Telecomunicaciones', '2024-03-01', '2024-03-31', 50000.00, 7500.00, 57500.00, 57500.00, '2024-03-01', 'Aprobada', 1, '2024-02-15 10:00:00', 'Campaña principal de marzo - horarios prime time'),  
  
('0002', 3, 'Servicios Municipales', '2024-03-01', '2024-03-31', 25000.00, 3750.00, 28750.00, 28750.00, '2024-03-01', 'Aprobada', 1, '2024-02-16 11:00:00', 'Promoción de servicios municipales'),  
  
('0003', 2, 'Seguros Vehiculares', '2024-03-01', '2024-03-31', 18000.00, 2700.00, 20700.00, 20700.00, '2024-03-01', 'Aprobada', 2, '2024-02-17 09:30:00', 'Campaña de seguros para temporada alta'),  
  
('0004', 6, 'Venta de Motocicletas', '2024-03-01', '2024-03-31', 22000.00, 3300.00, 25300.00, 25300.00, '2024-03-01', 'Aprobada', 2, '2024-02-18 14:15:00', 'Promoción de nuevos modelos 2024'),  
  
('0005', 4, 'Construcción y Materiales', '2024-03-01', '2024-03-31', 30000.00, 4500.00, 34500.00, 34500.00, '2024-03-01', 'Aprobada', 1, '2024-02-19 16:20:00', 'Campaña de temporada de construcción'),  
  
('0006', 5, 'Servicios Educativos', '2024-03-01', '2024-03-31', 15000.00, 2250.00, 17250.00, 17250.00, '2024-03-01', 'Aprobada', 3, '2024-02-20 08:45:00', 'Promoción de inscripciones universitarias'),  
  
('0007', 7, 'Servicios de Internet', '2024-03-01', '2024-03-31', 20000.00, 3000.00, 23000.00, 23000.00, '2024-03-01', 'Aprobada', 2, '2024-02-21 13:30:00', 'Campaña de fibra óptica residencial'),  
  
('0008', 8, 'Servicios Financieros', '2024-03-01', '2024-03-31', 28000.00, 4200.00, 32200.00, 32200.00, '2024-03-01', 'Aprobada', 1, '2024-02-22 11:15:00', 'Promoción de créditos y ahorros'),  
  
('0009', 9, 'Servicios Dentales', '2024-03-01', '2024-03-31', 12000.00, 1800.00, 13800.00, 13800.00, '2024-03-01', 'Aprobada', 3, '2024-02-23 15:45:00', 'Campaña de salud dental familiar'),  
  
('0010', 10, 'Servicios Financieros COFICESA', '2024-03-01', '2024-03-31', 35000.00, 5250.00, 40250.00, 40250.00, '2024-03-01', 'Aprobada', 1, '2024-02-24 09:00:00', 'Promoción de préstamos personales');


-- Órdenes en diferentes estados del flujo de trabajo  
INSERT INTO orden_publicidad (numeroOrden, idCliente, producto, periodoInicio, periodoFin, valorSinImpuesto, impuesto, costoTotal, costoPeriodo, estado, idEmpleado, fechaCreacion, observaciones) VALUES  
('0011', 11, 'Materiales de Construcción', '2024-04-01', '2024-04-30', 25000.00, 3750.00, 28750.00, 28750.00, 'Pendiente', 2, '2024-03-01 10:30:00', 'Orden pendiente de aprobación gerencial'),  
  
('0012', 12, 'Seguros', '2024-04-01', '2024-04-30', 32000.00, 4800.00, 36800.00, 36800.00, 'En_Emision', 1, '2024-03-02 14:20:00', 'Actualmente en emisión - horarios nocturnos'),  
  
('0013', 13, 'Retail', '2024-04-01', '2024-04-30', 18000.00, 2700.00, 20700.00, 20700.00, 'Finalizada', 3, '2024-02-01 16:45:00', 'Campaña completada exitosamente'),  
  
('0014', 14, 'Televisión', '2024-04-01', '2024-04-30', 40000.00, 6000.00, 46000.00, 46000.00, 'Cancelada', 2, '2024-03-03 12:10:00', 'Cancelada por solicitud del cliente'),  
  
('0015', 15, 'Promociones', '2024-04-01', '2024-04-30', 8000.00, 1200.00, 9200.00, 9200.00, 'Pendiente', 3, '2024-03-04 08:30:00', 'Orden para eventos especiales');



-- Tabla: Orden Programacion


-- ********************************************************************************
-- Modulo de Facturacion  
  
-- Tabla: descuento  
INSERT INTO descuento (Tipo, Estado, Porcentaje) VALUES   
('Sin descuento', 'Activo', 0),  
('Cliente Frecuente', 'Activo', 5),  
('Contrato Anual', 'Activo', 10),  
('Pago Anticipado', 'Activo', 8),  
('Volumen Alto', 'Activo', 15);  
  
-- Tabla: formapago  
INSERT INTO formapago (idFormaPago, Formapago, Estado, validacionRequerida, cuentaBancaria, nombreBeneficiario) VALUES   
(1, 'Contado', 'A', false, NULL, 'Televisión Comayagua Canal 40'),  
(2, 'Transferencia Bancaria', 'A', true, '1234567890', 'Televisión Comayagua Canal 40'),  
(3, 'Cheque', 'A', true, '1234567890', 'Televisión Comayagua Canal 40'),  
(4, 'Tarjeta de Crédito', 'A', false, NULL, 'Televisión Comayagua Canal 40');  
  
-- Tabla: cai (Código de Autorización de Impresión)  
INSERT INTO cai (codigoCAI, numeroFacturaInicio, numeroFacturaFin, fechaEmision, fechaVencimiento, resolucionSAR, nombreEmpresa, rtnEmpresa, activo, facturasEmitidas, createdAt, updatedAt) VALUES   
('254F8-612F1-8A0E0-6E8B3-0099B876', '000-001-01-00000001', '000-001-01-99999999', '2025-01-01', '2025-12-31', 'SAR No. 45145', 'Televisión Comayagua Canal 40', '12171961001526', true, 0, NOW(), NOW()),  
('123A4-567B8-9C0D1-2E3F4-5678G901', '000-002-01-00000001', '000-002-01-99999999', '2024-01-01', '2024-12-31', 'SAR No. 44123', 'Televisión Comayagua Canal 40', '12171961001526', false, 1250, NOW(), NOW());  
  
 
  
-- Tabla: Factura

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
  idOrdenPublicidad,  -- NUEVO CAMPO  
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
  'spot',                              -- tipoServicio    
  'MASS PUBLICIDAD',                   -- agencia    
  '0001',                              -- ordenNo (ahora STRING)  
  1,                                   -- idOrdenPublicidad (FK a orden_publicidad)  
  'EX-2025-001',                       -- ordenCompraExenta    
  'SAG-12345',                         -- numeroRegistroSAG    
  'CONST-2025-001',                    -- constanciaExonerado    
  1,                                   -- idCliente    
  1,                                   -- idFormaPago    
  1,                                   -- idEmpleado    
  'factura_1.pdf',                     -- archivo_pdf    
  'activa'                             -- estadoFactura    
),  
(    
  2,                                   -- idFactura    
  '2025-01-20 09:15:00',              -- Fecha    
  4500.75,                            -- Total_Facturado    
  'Factura',                          -- Tipo_documento    
  'Banco Atlántida',                  -- productoCliente    
  'Financiera',                       -- mencion    
  '2025-02-01',                       -- periodoInicio    
  '2025-02-28',                       -- periodoFin    
  'contrato',                         -- tipoServicio    
  'Publicidad Creativa S.A.',         -- agencia    
  '0002',                             -- ordenNo (STRING)  
  2,                                  -- idOrdenPublicidad (FK)  
  NULL,                               -- ordenCompraExenta    
  NULL,                               -- numeroRegistroSAG    
  NULL,                               -- constanciaExonerado    
  3,                                  -- idCliente    
  2,                                  -- idFormaPago    
  2,                                  -- idEmpleado    
  'factura_2.pdf',                    -- archivo_pdf    
  'activa'                            -- estadoFactura    
),  
(    
  3,                                  -- idFactura    
  '2025-01-15 14:45:00',             -- Fecha    
  1800.50,                           -- Total_Facturado    
  'Factura',                         -- Tipo_documento    
  'Servicios Varios',                -- productoCliente    
  'Comercial',                       -- mencion    
  NULL,                              -- periodoInicio    
  NULL,                              -- periodoFin    
  'programa',                        -- tipoServicio    
  NULL,                              -- agencia    
  NULL,                              -- ordenNo (sin orden asociada)  
  NULL,                              -- idOrdenPublicidad (sin orden)  
  NULL,                              -- ordenCompraExenta    
  NULL,                              -- numeroRegistroSAG    
  NULL,                              -- constanciaExonerado    
  2,                                 -- idCliente    
  2,                                 -- idFormaPago    
  1,                                 -- idEmpleado    
  NULL,                              -- archivo_pdf    
  'activa'                           -- estadoFactura    
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

-- *******************************************************************************************************************************************
-- Modulo de INVentario

-- Tabla: inventario
INSERT INTO inventario (codigo, nombre, descripcion, cantidad, ubicacion, idEmpleado, idProveedor, valor, estado, observacion, marca, fechaCompra, fechaRegistro) VALUES  
('CAM001', 'Cámara Sony PXW-X70', 'Cámara profesional para grabación de noticias y reportajes', 3, 'Estudio Principal', 2, 2, 85000.00, 'Disponible', 'Excelente estado, uso diario', 'Sony', '2023-01-15', '2023-01-16 09:30:00'),  
  
('CAM002', 'Cámara Canon XF405', 'Cámara 4K para producciones especiales y documentales', 2, 'Estudio Secundario', 2, 3, 95000.00, 'Disponible', 'Nueva adquisición 2023', 'Canon', '2023-03-20', '2023-03-21 10:15:00'),  
  
('MIC001', 'Micrófono Shure SM58', 'Micrófono dinámico para presentadores de noticias', 10, 'Estudio Principal', 1, 4, 3500.00, 'Disponible', 'Resistente y confiable', 'Shure', '2022-11-10', '2022-11-11 14:20:00'),  
  
('MIC002', 'Sistema Inalámbrico Sennheiser EW 100', 'Sistema completo para reporteros móviles', 5, 'Equipos Móviles', 1, 4, 12000.00, 'Disponible', 'Incluye receptor y transmisor', 'Sennheiser', '2023-02-05', '2023-02-06 11:45:00'),  
  
('LUZ001', 'Kit LED Aputure AL-M9', 'Panel LED compacto para iluminación de estudio', 4, 'Estudio Principal', 3, 1, 25000.00, 'Disponible', 'Luz fría y cálida ajustable', 'Aputure', '2023-04-12', '2023-04-13 16:00:00'),  
  
('LUZ002', 'Reflector Fresnel 2000W', 'Reflector profesional para exteriores y eventos', 6, 'Almacén de Equipos', 3, 1, 15000.00, 'Disponible', 'Para uso en exteriores', 'Arri', '2022-08-30', '2022-08-31 13:30:00'),  
  
('COMP001', 'Workstation Dell Precision 7760', 'Computadora para edición de video 4K', 4, 'Sala de Edición', 2, 1, 75000.00, 'Disponible', 'Intel i9, 32GB RAM, RTX 3080', 'Dell', '2023-05-18', '2023-05-19 08:45:00'),  
  
('COMP002', 'Servidor HP ProLiant DL380', 'Servidor para almacenamiento de contenido multimedia', 1, 'Cuarto de Servidores', 2, 1, 120000.00, 'Disponible', 'Almacenamiento 10TB RAID', 'HP', '2023-01-08', '2023-01-09 12:00:00'),  
  
('TRANS001', 'Transmisor Harris Flexstar', 'Transmisor principal FM de 5KW', 1, 'Torre de Transmisión', 1, 2, 450000.00, 'Asignado', 'Equipo crítico en operación', 'Harris', '2020-06-15', '2020-06-16 07:00:00'),  
  
('ANT001', 'Antena Dielectric TFU-25J', 'Antena de transmisión UHF banda IV-V', 1, 'Torre de Transmisión', 1, 2, 85000.00, 'Asignado', 'Instalada en torre principal', 'Dielectric', '2020-06-15', '2020-06-16 07:30:00'),  
  
('TRIP001', 'Trípode Manfrotto 546B', 'Trípode profesional de fibra de carbono', 8, 'Estudio Principal', 1, 1, 8500.00, 'Disponible', 'Ligero y resistente', 'Manfrotto', '2022-12-03', '2022-12-04 15:20:00'),  
  
('CABLE001', 'Cable HDMI 4K Belkin', 'Cable HDMI 2.1 de 10 metros', 20, 'Almacén de Cables', 3, 1, 1200.00, 'Disponible', 'Soporte 4K@120Hz', 'Belkin', '2023-06-01', '2023-06-02 09:15:00');
  
-- Equipos en mantenimiento  
INSERT INTO inventario (codigo, nombre, descripcion, cantidad, ubicacion, idEmpleado, idProveedor, valor, estado, observacion, marca, fechaCompra, fechaRegistro) VALUES  
('CAM003', 'Cámara Panasonic AG-CX350', 'Cámara con falla en sistema de zoom', 1, 'Taller de Reparación', 3, 3, 65000.00, 'En Mantenimiento', 'Requiere reparación de zoom', 'Panasonic', '2021-09-12', '2021-09-13 10:30:00'),  
  
('MIC003', 'Micrófono Audio-Technica AT2020', 'Micrófono condensador con ruido de fondo', 1, 'Taller de Reparación', 3, 4, 4500.00, 'En Mantenimiento', 'Posible problema en cápsula', 'Audio-Technica', '2022-04-18', '2022-04-19 14:45:00');  
  
-- Equipos dados de baja  
INSERT INTO inventario (codigo, nombre, descripcion, cantidad, ubicacion, idEmpleado, idProveedor, valor, estado, observacion, marca, fechaCompra, fechaRegistro) VALUES  
('COMP003', 'Computadora Dell Optiplex 7010', 'Equipo obsoleto para tareas básicas', 1, 'Bodega de Desechos', 2, 1, 35000.00, 'Baja', 'Obsoleto, reemplazado por nuevos equipos', 'Dell', '2015-03-10', '2015-03-11 11:00:00'),  
  
('CAM004', 'Cámara Sony HDR-FX1000', 'Cámara dañada por caída accidental', 1, 'Bodega de Desechos', 2, 2, 45000.00, 'Baja', 'Daño irreparable en lente y sensor', 'Sony', '2018-07-22', '2018-07-23 16:30:00');

  
-- Tabla: Movimientos

-- Movimientos de Asignación  
INSERT INTO movimiento (idInventario, tipoMovimiento, idEmpleado, observaciones, fechaMovimiento) VALUES  
(1, 'Asignacion', 1, 'Cámara asignada para cobertura de eventos municipales de enero', '2024-01-15 09:00:00'),  
(2, 'Asignacion', 2, 'Cámara Canon asignada para grabación de documentales especiales', '2024-01-20 10:30:00'),  
(7, 'Asignacion', 2, 'Workstation asignada para nueva sala de edición principal', '2024-02-05 08:15:00'),  
(11, 'Asignacion', 1, 'Trípodes asignados para equipo móvil de noticias', '2024-02-10 14:45:00'),  
(5, 'Asignacion', 3, 'Kit de iluminación LED para set de noticias matutinas', '2024-01-25 16:20:00');  
  
-- Movimientos de Mantenimiento  
INSERT INTO movimiento (idInventario, tipoMovimiento, idEmpleado, observaciones, fechaMovimiento) VALUES  
(3, 'Mantenimiento', 3, 'Revisión preventiva mensual de micrófonos Shure - limpieza y calibración', '2024-02-01 14:30:00'),  
(9, 'Mantenimiento', 3, 'Mantenimiento crítico del transmisor - calibración y ajuste de potencia RF', '2024-01-10 16:00:00'),  
(13, 'Mantenimiento', 3, 'Cámara Panasonic requiere reparación del sistema de zoom automático', '2024-02-15 11:20:00'),  
(6, 'Mantenimiento', 3, 'Mantenimiento preventivo de reflectores - reemplazo de lámparas', '2024-01-30 13:45:00'),  
(8, 'Mantenimiento', 2, 'Actualización de firmware y limpieza interna del servidor HP', '2024-02-08 09:30:00');  
  
-- Movimientos de Baja  
INSERT INTO movimiento (idInventario, tipoMovimiento, idEmpleado, observaciones, fechaMovimiento) VALUES  
(15, 'Baja', 2, 'Computadora Dell Optiplex declarada obsoleta - reemplazada por equipos más modernos', '2024-01-05 10:00:00'),  
(16, 'Baja', 2, 'Cámara Sony HDR-FX1000 dada de baja por daños irreparables tras caída accidental', '2024-01-12 15:30:00');  
  
-- Movimientos adicionales para historial completo  
INSERT INTO movimiento (idInventario, tipoMovimiento, idEmpleado, observaciones, fechaMovimiento) VALUES  
(4, 'Asignacion', 1, 'Sistema inalámbrico Sennheiser para reporteros en campo', '2024-02-12 07:45:00'),  
(10, 'Mantenimiento', 3, 'Revisión anual de antena UHF - inspección de conectores y cables', '2024-01-18 12:15:00'),  
(12, 'Asignacion', 3, 'Cables HDMI 4K asignados para nueva configuración de estudios', '2024-02-20 11:00:00'),  
(14, 'Mantenimiento', 3, 'Micrófono Audio-Technica en reparación por ruido de fondo persistente', '2024-02-18 14:20:00');  
  
-- Movimientos sin empleado asignado (casos especiales)  
INSERT INTO movimiento (idInventario, tipoMovimiento, idEmpleado, observaciones, fechaMovimiento) VALUES  
(1, 'Asignacion', NULL, 'Mesa de mezclas Yamaha asignada automáticamente al estudio de audio', '2024-02-22 08:00:00'),  
(12, 'Mantenimiento', NULL, 'Monitor LG programado para calibración automática mensual', '2024-02-25 06:30:00');

-- Tabla: Mantenimiento
INSERT INTO mantenimiento (
  idInventario,
  descripcionMantenimiento,
  costoMantenimiento,
  fechaInicio,
  fechaFin,
  idMovimiento,
  nombreImagen
) VALUES
(1, 'Mantenimiento preventivo: limpieza interna y cambio de filtros.', 1500.00, '2025-07-01', '2025-07-03', NULL, 'filtros-limpieza.jpg'),
(2, 'Reparación de fuente de poder dañada.', 3200.00, '2025-07-15', '2025-07-17', 5, 'fuente-pc-reparada.jpg'),
(3, 'Actualización de firmware y revisión de conectores.', 0.00, '2025-07-25', NULL, NULL, NULL);




-- ============================================  
-- FIN DEL SCRIPT DE INSERCIÓN  
-- =============================================