# Prueba de Gestión de Transacciones - Justin Moreira

## 🎞️ Enlace de video demostrativo
[Video Demostrativo](https://drive.google.com/file/d/17diXqIyHMIgm5RzmyIzb81lZDIb2Eb5H/view?usp=sharing)

## 📋 Introducción

Este proyecto es una aplicación de prueba desarrollada en Java con Spring Boot en el backend y Angular en el frontend. Proporciona una solución completa para gestionar clientes, cuentas bancarias y transacciones.

La aplicación permite:
- Gestionar información de clientes
- Administrar múltiples cuentas bancarias por cliente
- Registrar y visualizar transacciones
- Consultar estados de cuenta detallados

---

## 🛠️ Tecnologías Utilizadas

### Backend
- **Java 21**: Lenguaje de programación
- **Spring Boot 4.0.5**: Framework para desarrollo web
- **Spring Data JPA**: Persistencia de datos y ORM
- **Spring Validation**: Validación de datos
- **Spring Web MVC**: Construcción de APIs REST
- **MySQL/Base de Datos**: Almacenamiento persistente
- **SpringDoc OpenAPI UI**: Documentación interactiva de APIs (Swagger)

### Frontend
- **Angular 21**: Framework web reactivo
- **TypeScript 5.9**: Lenguaje de programación tipado
- **Tailwind CSS 4**: Framework de estilos CSS
- **RxJS 7**: Programación reactiva
- **SweetAlert2**: Alertas visuales personalizadas
- **npm 11**: Gestor de dependencias

### Herramientas
- **Maven**: Gestor de construcción (backend)
- **Node.js/npm**: Gestor de dependencias (frontend)
- **Vitest**: Framework de testing
- **Prettier**: Formateador de código

---

## 🚀 Instrucciones para Levantar el Proyecto

### Requisitos Previos

- **Java Development Kit (JDK) 21** o superior
- **Node.js** versión 18 o superior
- **npm** versión 11 o superior
- **MySQL** versión 5.7 o superior
- **Git** (opcional, para clonar el repositorio)

### 1. Configuración de la Base de Datos

#### Crear la base de datos
```bash
mysql -u root -p < prueba2026justinmoreira.sql
```

O manualmente en MySQL:
```sql
-- Ejecutar el script SQL proporcionado
-- Archivo: prueba2026justinmoreira.sql
```

#### Actualizar credenciales en el backend
Edita el archivo `backend/prueba/src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/nombre_base_datos
spring.datasource.username=tu_usuario
spring.datasource.password=tu_contraseña
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.jpa.hibernate.ddl-auto=update
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect
```

### 2. Levantando el Backend

Abre una terminal en la carpeta del proyecto y ejecuta:

```bash
# Navegar a la carpeta del backend
cd backend/prueba

# Limpiar y compilar el proyecto
mvn clean install

# Ejecutar la aplicación
mvn spring-boot:run
```

O si prefieres usar el wrapper de Maven:

```bash
./mvnw spring-boot:run
```

El backend estará disponible en: **http://localhost:8080**

Documentación interactiva de la API: **http://localhost:8080/swagger-ui/index.html**

### 3. Levantando el Frontend

Abre una terminal (diferente de la del backend) y ejecuta:

```bash
# Navegar a la carpeta del frontend
cd front/prueba-transacciones

# Instalar dependencias
npm install

# Ejecutar la aplicación en modo desarrollo
npm start
```

El frontend estará disponible en: **http://localhost:4200**

---

## 📁 Estructura del Proyecto

```
prueba Justin Moreira 2026/
│
├── backend/
│   └── prueba/                          # Aplicación Spring Boot
│       ├── src/
│       │   ├── main/
│       │   │   ├── java/com/justinmoreira/prueba/
│       │   │   │   ├── application/     # Controladores
│       │   │   │   └── modules/         # Entidades y lógica
│       │   │   └── resources/
│       │   │       └── application.properties
│       │   └── test/
│       ├── pom.xml                      # Dependencias Maven
│       └── mvnw                         # Maven wrapper
│
├── front/
│   └── prueba-transacciones/            # Aplicación Angular
│       ├── src/
│       │   ├── app/
│       │   │   ├── core/                # Servicios y modelos
│       │   │   ├── features/            # Componentes principales
│       │   │   │   ├── accounts/        # Gestión de cuentas
│       │   │   │   ├── clients/         # Gestión de clientes
│       │   │   │   └── home/            # Página de inicio
│       │   │   ├── app.ts               # Componente raíz
│       │   │   └── app.routes.ts        # Rutas
│       │   └── index.html
│       ├── package.json                 # Dependencias npm
│       └── angular.json
│
├── prueba2026justinmoreira.sql          # Script de base de datos
└── README.md                            # Este archivo
```

---

## 🔌 API REST

### Colección Postman
La colección de Postman para probar los endpoints se encuentra en:
```
API REST - Aplicación de Prueba Justin Moreira.postman_collection.json
```

Importa este archivo en Postman para acceder a todos los endpoints disponibles.

### Endpoints Principales

- **Clientes**: `GET/POST/PUT/DELETE /api/clientes`
- **Cuentas**: `GET/POST/PUT/DELETE /api/cuentas`
- **Transacciones**: `GET/POST/PUT/DELETE /api/transacciones`

---

## 🧪 Testing

### Backend
```bash
cd backend/prueba
mvn test
```

### Frontend
```bash
cd front/prueba-transacciones
npm test
```

---

## 🔧 Solución de Problemas

### Puerto 4200 ocupado (Frontend)
```bash
ng serve --port 4300
```

### Puerto 8080 ocupado (Backend)
Modifica `backend/prueba/src/main/resources/application.properties`:
```properties
server.port=8081
```

### Error de conexión a base de datos
- Verifica que MySQL esté ejecutándose
- Confirma las credenciales en `application.properties`
- Asegúrate de que la base de datos fue creada correctamente

### Dependencias no encontradas
```bash
# Backend
mvn clean dependency:resolve

# Frontend
npm install --legacy-peer-deps
```

---

## 📝 Notas Adicionales

- El proyecto utiliza **Java 21** y **Angular 21**, asegúrate de tener estas versiones instaladas
- La documentación interactiva de la API (Swagger/OpenAPI) está disponible en el backend
- Para desarrollo, es recomendable usar un IDE como IntelliJ IDEA o VS Code
- El frontend incluye validación de formularios y manejo de errores robusto

---

## 👨‍💻 Autor

Justin Moreira - 2026

---

## 📄 Licencia

Este proyecto es de uso interno.

---

¡Listo! Ahora deberías poder ejecutar la aplicación correctamente. 🚀
