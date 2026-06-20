# Pruebas de Endpoints — Sistema de Turnos Médicos

Base URL: `http://localhost:3000`

Antes de comenzar, ejecutar `node seed.js` para crear el usuario administrador.
Credenciales: `admin@admin.com` / `admin123`

Las rutas protegidas requieren el header `Authorization: Bearer <token>` con el token del rol correspondiente.

---

## Usuarios

### Login administrador

```
POST /api/usuarios/login
```
```json
{
  "email": "admin@admin.com",
  "contrasena": "admin123"
}
```

### Registrar cliente

```
POST /api/usuarios/register
```
```json
{
  "nombre": "Lucía",
  "apellido": "Fernández",
  "email": "lucia.fernandez@test.com",
  "contrasena": "lucia2026"
}
```

### Login cliente

```
POST /api/usuarios/login
```
```json
{
  "email": "lucia.fernandez@test.com",
  "contrasena": "lucia2026"
}
```

### Ver perfil propio (token: cliente)

```
GET /api/usuarios/me
```

---

## Profesionales (token: admin)

### Crear profesional

```
POST /api/profesionales
```
```json
{
  "nombre": "Martín",
  "apellido": "Sosa",
  "especialidad": "Traumatología"
}
```

### Listar profesionales

```
GET /api/profesionales
```

### Obtener profesional por ID

```
GET /api/profesionales/:id
```

### Actualizar profesional

```
PUT /api/profesionales/:id
```
```json
{
  "especialidad": "Ortopedia"
}
```

### Eliminar profesional

```
DELETE /api/profesionales/:id
```

---

## Turnos

### Crear turno (token: cliente)

```
POST /api/turnos
```
```json
{
  "fecha": "2026-08-15",
  "hora": "16:30",
  "profesionalId": ":id",
  "especialidad": "Traumatología"
}
```

### Ver mis turnos (token: cliente)

```
GET /api/turnos/mis-turnos
```

### Listar todos los turnos (token: admin)

```
GET /api/turnos
```

### Filtrar turnos (token: admin)

```
GET /api/turnos?estado=pendiente
```
```
GET /api/turnos?especialidad=Traumatología
```
```
GET /api/turnos?profesional=:id
```

### Actualizar estado del turno (token: admin)

```
PUT /api/turnos/:id
```
```json
{
  "estado": "confirmado"
}
```

### Eliminar turno (token: admin)

```
DELETE /api/turnos/:id
```