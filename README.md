# Microservicio Autenticación (Drizzle ORM)

![Node.js](https://img.shields.io/badge/Node.js-16+-green)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Express](https://img.shields.io/badge/Express-4.18-blue)
![Drizzle](https://img.shields.io/badge/Drizzle-0.33-purple)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-12+-blue)
![JWT](https://img.shields.io/badge/JWT-9.0-red)

Microservicio de autenticación con JWT utilizando Node.js, Express, TypeScript y Drizzle ORM con PostgreSQL.

## 🚀 Características

- ✅ Registro de usuarios con validación
- ✅ Login con JWT (24h de duración)
- ✅ Hash de contraseñas con bcrypt
- ✅ Endpoint protegido /auth/me
- ✅ TypeScript para type safety
- ✅ Migraciones con Drizzle

## Requisitos

- Node.js 16+
- PostgreSQL 12+
- npm o yarn

## Instalación

1. Clonar el repositorio:

```bash
git clone <repository-url>
cd backend-auth-drizzle
```

2. Instalar dependencias:

```bash
npm install
```

3. Configurar variables de entorno:

```bash
cp .env.example .env
```

Editar el archivo `.env` con tus credenciales:

```
PORT=3002
DB_HOST=localhost
DB_PORT=5432
DB_NAME=finanzas_db
DB_USER=postgres
DB_PASSWORD=tu_password
JWT_SECRET=tu_secreto_super_seguro_aqui
```

4. Ejecutar migraciones:

```bash
npm run migrate
```

## Ejecución

### Modo desarrollo:

```bash
npm run dev
```

### Compilar TypeScript:

```bash
npm run build
```

### Modo producción:

```bash
npm run build
npm start
```

El servidor estará disponible en `http://localhost:3002`

## Endpoints

### Autenticación

- **POST /auth/register** - Registrar nuevo usuario

  ```json
  {
    "email": "usuario@example.com",
    "password": "password123",
    "nombre": "Juan Pérez",
    "rol": "usuario"
  }
  ```

  Respuesta:

  ```json
  {
    "id": 1,
    "email": "usuario@example.com",
    "nombre": "Juan Pérez",
    "rol": "usuario",
    "fechaCreacion": "2026-01-06T10:00:00.000Z"
  }
  ```

- **POST /auth/login** - Iniciar sesión

  ```json
  {
    "email": "usuario@example.com",
    "password": "password123"
  }
  ```

  Respuesta:

  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "usuario": {
      "id": 1,
      "email": "usuario@example.com",
      "nombre": "Juan Pérez",
      "rol": "usuario"
    }
  }
  ```

- **GET /auth/me** - Obtener información del usuario autenticado

  - Headers: `Authorization: Bearer <token>`

  Respuesta:

  ```json
  {
    "id": 1,
    "email": "usuario@example.com",
    "nombre": "Juan Pérez",
    "rol": "usuario",
    "fechaCreacion": "2026-01-06T10:00:00.000Z"
  }
  ```

## Autenticación JWT

Para endpoints protegidos, incluir el token JWT en el header:

```
Authorization: Bearer <tu_token_jwt>
```

El token se obtiene al hacer login y tiene una duración de 24 horas.

## Migraciones con Drizzle

Las migraciones se ejecutan con el script personalizado:

```bash
npm run migrate
```

Para generar nuevas migraciones automáticamente con Drizzle Kit:

```bash
npm run db:generate
```

Para aplicar cambios directamente a la base de datos:

```bash
npm run db:push
```

## Estructura del proyecto

```
backend-auth-drizzle/
├── src/
│   ├── controllers/
│   │   └── authController.ts
│   ├── db/
│   │   ├── index.ts
│   │   ├── schema.ts
│   │   └── migrate.ts
│   ├── middleware/
│   │   └── auth.ts
│   ├── routes/
│   │   └── auth.ts
│   └── index.ts
├── .env.example
├── package.json
├── tsconfig.json
└── README.md
```

## Seguridad

- Las contraseñas se hashean con bcryptjs antes de almacenarse
- JWT para autenticación stateless
- Tokens con expiración de 24 horas
- Validación de datos de entrada

## Pruebas con Postman

Importar la colección `postman_collection.json` en Postman para probar todos los endpoints.

## Notas

- Este microservicio comparte la misma base de datos con el microservicio de Ventas/Gastos
- La tabla `usuarios` se crea en la misma base de datos `finanzas_db`
- El rol por defecto es 'usuario', pero se puede especificar al registrar
