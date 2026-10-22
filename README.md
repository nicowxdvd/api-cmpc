# api-cmpc

API REST para CMPC 

## Requisitos

- Node 20 o superior
- Docker

## Instalación

la api trae un seed que carga datos de usuarios y libros para el testing,
es fundamental que se ejecute, abajo dejo los comados para esto.

```bash
npm install
cp .env.example .env
docker compose up -d
npx prisma migrate deploy
npx prisma db seed
npm run start:dev
```
La API queda en `http://localhost:3000`.

## Variables de entorno

| Variable | Descripción |
|---|---|
| `DATABASE_URL` | Conexión a PostgreSQL |
| `JWT_SECRET` | Clave para firmar el token |
| `JWT_EXPIRES_IN` | Duración del token (ej. `1h`) |

## Usuario para  login en web

`admin@admin.com` / `admin123`.

## Endpoints

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/auth/login` | Iniciar sesión |
| GET | `/books` | Listado paginado |
| GET | `/books/:id` | Detalle |
| POST | `/books` | Crear |
| PATCH | `/books/:id` | Editar |
| DELETE | `/books/:id` | Borrar (soft delete) |
| GET | `/books/export/csv` | Exportar a CSV con los mismos filtros |
| GET | `/authors` | Autores |
| GET | `/publishers` | Editoriales |
| GET | `/genres` | Géneros |

## Scripts

- `npm run start:dev`: desarrollo