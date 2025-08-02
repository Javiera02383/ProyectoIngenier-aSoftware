Drop database proyecto;

-- Borrar base de datos a la cual le hice cambio en el modelo. 
CREATE DATABASE proyecto CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
use proyecto;

SELECT User, Host FROM mysql.user;

-- Crear usuario (si no existe)
CREATE USER IF NOT EXISTS 'sistemas'@'localhost' IDENTIFIED BY 'Sistemas123.';

-- Otorgar todos los privilegios sobre la base de datos tareaclientes
GRANT ALL PRIVILEGES ON proyecto.* TO 'sistemas'@'localhost';

-- Aplicar los cambios
FLUSH PRIVILEGES;

-- Ver usuarios y sus privilegios sobre la base de datos tareaclientes
SELECT user, host, db, select_priv, insert_priv, update_priv, delete_priv
FROM mysql.db
WHERE db = 'proyecto' AND user = 'sistemas';