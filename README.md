# Sistema de Turnos Médicos

API REST para la gestión de turnos médicos con autenticación JWT y control de acceso por roles.

---

## Tecnologías

- **Node.js** + **Express**
- **MongoDB** + **Mongoose**
- **JWT** para autenticación
- **bcrypt** para hash de contraseñas
- **express-validator** para validación de datos
- **Jest** + **Supertest** para testing

---

## Estructura del proyecto

```
src/
├── config/
│   └── db.js                   # Conexión a MongoDB
├── middlewares/
│   └── auth.middleware.js      # Autenticación JWT y control de roles
├── usuarios/
│   ├── usuarios.model.js       # Schema de usuario
│   ├── usuarios.service.js     # Lógica de negocio
│   ├── usuarios.controller.js  # Manejo de requests/responses
│   └── usuarios.routes.js      # Definición de rutas
├── profesionales/
│   ├── profesionales.model.js
│   ├── profesionales.service.js
│   ├── profesionales.controller.js
│   └── profesionales.routes.js
└── turnos/
    ├── turnos.model.js
    ├── turnos.service.js
    ├── turnos.controller.js
    └── turnos.routes.js
server.js
```

---

## Instalación y configuración

### 1. Clonar el repositorio

```bash
git clone <url-del-repo>
cd proyecto-programacion-2
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crear un archivo `.env` en la raíz del proyecto:

```env
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/proyecto-programacion-2
JWT_SECRET=tu_clave_secreta
```

### 4. Iniciar MongoDB

Asegurate de tener MongoDB corriendo localmente en el puerto 27017.

### 5. Iniciar el servidor

```bash
node server.js
```

---

## Autenticación

La API usa JWT. Para acceder a rutas protegidas incluí el token en el header:

```
Authorization: Bearer <token>
```

El token se obtiene al hacer login exitoso.

### Roles disponibles

| Rol | Descripción |
|---|---|
| `admin` | Gestión completa de turnos y profesionales |
| `cliente` | Crear y ver sus propios turnos |

---

## Endpoints

### Usuarios — `/api/usuarios`

| Método | Ruta | Rol | Descripción |
|---|---|---|---|
| POST | `/register` | Público | Registro de usuario |
| POST | `/login` | Público | Login y obtención de token |
| GET | `/me` | cliente / admin | Ver perfil propio |
| GET | `/admin-only` | admin | Ruta de prueba de rol admin |

#### Ejemplo de registro

```json
POST /api/usuarios/register
{
  "nombre": "Juan",
  "apellido": "Pérez",
  "email": "juan@email.com",
  "contrasena": "123456"
}
```

#### Ejemplo de login

```json
POST /api/usuarios/login
{
  "email": "juan@email.com",
  "contrasena": "123456"
}
```

---

### Profesionales — `/api/profesionales`

Todas las rutas requieren token de **admin**.

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/` | Crear profesional |
| GET | `/` | Listar todos los profesionales |
| GET | `/:id` | Obtener profesional por ID |
| PUT | `/:id` | Actualizar profesional |
| DELETE | `/:id` | Eliminar profesional |

#### Ejemplo de creación

```json
POST /api/profesionales
{
  "nombre": "María",
  "apellido": "García",
  "especialidad": "Cardiología"
}
```

---

### Turnos — `/api/turnos`

| Método | Ruta | Rol | Descripción |
|---|---|---|---|
| POST | `/` | cliente | Crear turno propio |
| GET | `/mis-turnos` | cliente | Ver mis turnos |
| GET | `/` | admin | Ver todos los turnos (con filtros) |
| PUT | `/:id` | admin | Actualizar turno / cambiar estado |
| DELETE | `/:id` | admin | Eliminar turno |

#### Ejemplo de creación de turno (cliente)

```json
POST /api/turnos
{
  "fecha": "2026-06-20",
  "hora": "10:00",
  "profesionalId": "<id_del_profesional>",
  "especialidad": "Cardiología"
}
```

#### Filtros disponibles para admin

```
GET /api/turnos?estado=pendiente
GET /api/turnos?especialidad=Cardiología
GET /api/turnos?profesional=<id_profesional>
```

#### Estados posibles de un turno

| Estado | Descripción |
|---|---|
| `pendiente` | Estado inicial al crear el turno |
| `confirmado` | Turno confirmado por el admin |
| `cancelado` | Turno cancelado |

---

## Testing

```bash
npm test
```

Los tests cubren los flujos principales de usuarios y turnos usando Jest + Supertest.

---

## Notas

- El sistema previene turnos duplicados: no se puede crear un turno con el mismo profesional, fecha y hora.
- Las contraseñas nunca se exponen en las respuestas de la API.
- El paciente solo puede ver sus propios turnos, nunca los de otros usuarios.