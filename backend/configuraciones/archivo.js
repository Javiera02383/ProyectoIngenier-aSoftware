const multer = require('multer');
const path = require('path');

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
    cb(null, path.join(__dirname, '../../public/img/mantenimiento'));  
  },  
  filename: (req, file, cb) => {  
    if (['image/jpeg', 'image/png', 'image/jpg'].includes(file.mimetype)) {  
      const aleatorio = Math.floor(Math.random() * (99998 - 10001)) + 10001;  
      cb(null, `mantenimiento-${aleatorio}-${Date.now()}-${file.mimetype.replace('/', '.')}`);  
    }  
  }  
});

exports.uploadImagenMantenimiento = multer({  
  storage: almacenarMantenimiento,  
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

