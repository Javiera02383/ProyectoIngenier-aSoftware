const multer = require('multer');
const path = require('path');
const fs = require('fs');

const almacenarUsuarios = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../public/img/usuarios'));
  },
  filename: (req, file, cb) => {
    if (['image/jpeg', 'image/png', 'image/jpg'].includes(file.mimetype)) {
      const aleatorio = Math.floor(Math.random() * (99998 - 10001)) + 10001;
      cb(
        null,
        `usuario-${aleatorio}-${req.query.id}-${file.mimetype.replace('/', '.')}`
      );
    }
  }
});

const almacenarProductos = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../public/img/productos'));
  },
  filename: (req, file, cb) => {
    if (['image/jpeg', 'image/png', 'image/jpg'].includes(file.mimetype)) {
      const aleatorio = Math.floor(Math.random() * (99998 - 10001)) + 10001;
      cb(
        null,
        `producto-${aleatorio}-${req.query.id}-${file.mimetype.replace('/', '.')}`
      );
    }
  }
});
//Para almacenaar la imagen del formulario de registro de mantenimiento
const almacenarMantenimiento = multer.diskStorage({  
  destination: (req, file, cb) => {  
    try {
      const dir = path.join(__dirname, '../public/img/mantenimiento');
      // Crear el directorio si no existe
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      cb(null, dir);
    } catch (error) {
      console.error('Error creando directorio de mantenimiento:', error);
      cb(new Error('Error al crear directorio para imagen'), null);
    }
  },  
  filename: (req, file, cb) => {  
    try {
      if (['image/jpeg', 'image/png', 'image/jpg'].includes(file.mimetype)) {  
         
        let nombreArchivo;
        
        // Si estamos actualizando un mantenimiento existente, usar el idMantenimiento
        if (req.params && req.params.id) {
          const idMantenimiento = req.params.id;
          const timestamp = Date.now();
          const extension = file.mimetype.replace('image/', '');
          nombreArchivo = `mantenimiento-${idMantenimiento}-${timestamp}.${extension}`;
          console.log('Nombre de archivo generado para actualización:', nombreArchivo);
        } else {
          // Para nuevos mantenimientos, usar timestamp y número aleatorio
          const timestamp = Date.now();
          const randomNum = Math.floor(Math.random() * 10000);
          const extension = file.mimetype.replace('image/', '');
          nombreArchivo = `mantenimiento-nuevo-${timestamp}-${randomNum}.${extension}`;
          console.log('Nombre de archivo generado para nuevo mantenimiento:', nombreArchivo);
        }
        
        cb(null, nombreArchivo);  
      } else {
        cb(new Error('Tipo de archivo no permitido. Solo se permiten JPG, JPEG y PNG'), null);
      }
    } catch (error) {
      console.error('Error generando nombre de archivo:', error);
      cb(new Error('Error al generar nombre de archivo'), null);
    }
  }  
});

exports.uploadImagenMantenimiento = multer({  
  storage: almacenarMantenimiento,  
  fileFilter: (req, file, cb) => {  
    try {
      if (['image/jpeg', 'image/png', 'image/jpg'].includes(file.mimetype)) {  
        cb(null, true);  
      } else {  
        cb(new Error("Solo se permiten archivos png, jpeg, jpg"), false);  
      }  
    } catch (error) {
      console.error('Error en fileFilter:', error);
      cb(new Error('Error al validar el archivo'), false);
    }
  },  
  limits: { 
    fileSize: 5 * 1024 * 1024, // 5MB máximo
    files: 1 // Solo un archivo
  }
}).single('imagen');

exports.uploadImagenUsuario = multer({
  storage: almacenarUsuarios,
  fileFilter: (req, file, cb) => {
    if (['image/jpeg', 'image/png', 'image/jpg'].includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("Solo se permiten archivos png, jpeg, jpg"));
    }
  },
  limits: { fileSize: 2000000 }
}).single('imagen');

exports.uploadImagenProducto = multer({
  storage: almacenarProductos,
  fileFilter: (req, file, cb) => {
    if (['image/jpeg', 'image/png', 'image/jpg'].includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("Solo se permiten archivos png, jpeg, jpg"));
    }
  },
  limits: { fileSize: 2000000 }
}).single('imagen');

