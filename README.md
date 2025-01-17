# erp-sistema-gestion-pymes
ERP básico diseñado para pequeñas y medianas empresas (PyMEs), enfocado en la gestión de inventarios, listas de materiales (BOM) y almacenes. Este sistema fue desarrollado utilizando PHP y Laravel, con el objetivo de proporcionar una solución accesible y adaptable que permita a las PyMEs centralizar y optimizar sus operaciones.
Requisitos del Sistema
PHP >= 8.0
Composer >= 2.0
Servidor web compatible (XAMPP, WAMP, o similar)
MySQL >= 5.7
Hosting opcional (como Hostinger)
Pasos de Instalación
Clonar el Repositorio
bash
Copiar
Editar
git clone https://github.com/tuusuario/erp-sistema-gestion-pymes.git
cd erp-sistema-gestion-pymes
Instalar Dependencias
Asegúrate de tener Composer instalado, luego ejecuta:

bash
Copiar
Editar
composer install
Configurar el Archivo .env
Copia el archivo de ejemplo .env.example y renómbralo como .env:
bash
Copiar
Editar
cp .env.example .env
Edita las variables de entorno en el archivo .env para configurar tu base de datos:
env
Copiar
Editar
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=nombre_base_datos
DB_USERNAME=usuario
DB_PASSWORD=contraseña
Generar la Clave de la Aplicación
bash
Copiar
Editar
php artisan key:generate
Configurar la Base de Datos
Crea una base de datos en MySQL con el nombre especificado en .env.
Ejecuta las migraciones para configurar las tablas:
bash
Copiar
Editar
php artisan migrate
Cargar Datos Iniciales (Opcional)
Si hay datos iniciales disponibles, ejecútalos con:

bash
Copiar
Editar
php artisan db:seed
Iniciar el Servidor Local
Para probar el sistema localmente, ejecuta:

bash
Copiar
Editar
php artisan serve
Accede al sistema en tu navegador en http://localhost:8000.

Opcional: Implementación en Hosting
Subir Archivos al Hosting
Comprime los archivos del proyecto y súbelos al servidor mediante FTP o el panel de control del hosting.
Configura el dominio o subdominio según las instrucciones del proveedor de hosting.
Configurar el Entorno en Hosting
Edita el archivo .env en el servidor para que apunte a la base de datos del hosting.
Asegúrate de que las carpetas storage y bootstrap/cache tengan los permisos adecuados.
Configurar Cron Jobs (Opcional)
Si necesitas tareas automáticas, consulta la configuración de cron jobs en el hosting para ejecutar comandos como:

bash
Copiar
Editar
php artisan schedule:run
Características Principales
Gestión de inventarios y almacenes.
Creación y manejo de listas de materiales (BOM).
Configuración de roles y permisos para usuarios.
Sistema accesible y escalable, ideal para PyMEs.
Capturas de Pantalla
Incluye aquí capturas del sistema funcional, mostrando ejemplos de módulos principales como:

Gestión de inventarios.
Creación de listas de materiales.
Configuración de roles de usuario.
Contribuciones
Este proyecto es de código abierto y acepta contribuciones. Si deseas colaborar, envía un pull request o abre un issue en el repositorio.

Licencia
Este proyecto está bajo la licencia MIT. Consulta el archivo LICENSE para más información.
