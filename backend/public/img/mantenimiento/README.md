# Sistema de Imágenes de Mantenimiento

## Descripción
Este directorio almacena las imágenes de respaldo asociadas a los registros de mantenimiento del sistema de inventario.

## Estructura
- Las imágenes se almacenan con nombres únicos generados automáticamente
- Formato: `mantenimiento-{aleatorio}-{timestamp}-{extension}`
- Ejemplo: `mantenimiento-12345-1703123456789.jpg`

## Configuración
- **Tamaño máximo**: 5MB
- **Formatos permitidos**: JPG, JPEG, PNG
- **Directorio**: `/backend/public/img/mantenimiento/`

## Rutas de Acceso
- **Ruta estática**: `/api/optica/public/img/mantenimiento/{nombreArchivo}`
- **Ruta dinámica**: `/api/optica/inventario/mantenimiento/{id}/imagen`

## Notas
- Las imágenes se sirven a través de Express.static para mejor rendimiento
- Se incluye fallback a la ruta dinámica en caso de error
- El sistema crea automáticamente el directorio si no existe
