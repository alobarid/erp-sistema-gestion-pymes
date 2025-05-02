<h1 align="center">📦 Sigmafy ERP</h1>
<p align="center">Sistema de planificación y gestión para pequeñas y medianas empresas</p>

---

### 🧾 ¿Qué es Sigmafy?

Sigmafy es un sistema ERP (Enterprise Resource Planning) diseñado para ayudar a pequeñas y medianas empresas a planificar, controlar y optimizar sus operaciones internas. Está construido sobre el framework Laravel y ofrece una solución moderna, modular y personalizable para la administración empresarial.

---

### 🎯 ¿Para qué sirve?

Sigmafy permite gestionar de forma centralizada:

- 📦 Productos, categorías e inventarios
- 🛒 Ventas, compras y proveedores
- 👤 Usuarios y roles de acceso
- 📈 Reportes administrativos y operativos
- 📄 Generación de documentos en PDF

Su objetivo es mejorar la eficiencia operativa, reducir errores administrativos y facilitar la toma de decisiones mediante información en tiempo real.

---

### ⚙️ Estructura general

El sistema está organizado por módulos independientes que se integran bajo una misma interfaz:

- Módulo de productos
- Módulo de ventas
- Módulo de compras
- Módulo de usuarios
- Módulo de reportes

Cada módulo puede personalizarse o ampliarse según las necesidades específicas del negocio.

---

### ✅ Ventajas principales

- Interfaz amigable y en español
- Basado en tecnologías modernas (Laravel + Bootstrap)
- Fácil de instalar y mantener
- Adaptable a cualquier tipo de empresa
- Ideal para pruebas, implementaciones académicas o uso real

---

### 🔒 Acceso por roles

El sistema incluye autenticación y control de permisos. Cada usuario accede únicamente a las funciones permitidas según su rol:

- Administrador
- Vendedor
- Comprador

Esto permite asegurar la información y delimitar responsabilidades.

---

### 📦 Aplicaciones reales

Sigmafy puede usarse en entornos como:

- Tiendas físicas
- Distribuidoras
- Ferreterías
- Papelerías
- Comercios de venta al por mayor o menor

---

### 📚 Documentación técnica

> Para desarrolladores e implementadores, la documentación completa se encuentra en la carpeta `/docs`.

Incluye:
- Requisitos del sistema
- Proceso de instalación
- Estructura de base de datos
- Instrucciones de despliegue

---

### 📝 Autor y créditos

Desarrollado a partir del proyecto base de [alobarid](https://github.com/alobarid/erp-sistema-gestion-pymes), con mejoras adaptadas al contexto de PYMES latinoamericanas.

---

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
