# api-cmpc

API REST para CMPC 

## Requisitos

- Node 24 (solo para el modo desarrollo)

## Instalación

la api trae un seed que carga datos de usuarios y libros para el testing,
es fundamental que se ejecute, abajo dejo los comados para esto.

Tanto la web como la api, estan configuradas para cuando se corra el comando docker compose, queden arriba los servicios.
Con el fin de llegar y testearlos. Pero ademas adjunto los comandos para una revision en desarrollo

```bash
docker compose up -d --build
docker compose exec api npx prisma db seed
```
La API queda en `http://localhost:3000`.


## Autenticación. 
Todas las rutas, excepto `POST /auth/login`, requieren el header `Authorization: Bearer <token>`.

## Usuario para  login en web

`admin@admin.com` / `admin123`.

## Esquema
En el directorio `Esquema_db` se encuentra una imagen del modelo de datos y el esquema del sistema
 .- Diagrama.png
 .- schemma

##  Swagger
http://localhost:3000/docs

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
- `npm run build`: compilar
- `npm run start:prod`: correr lo compilado

## Frontend

El repo `web-cmpc` espera esta API en `http://localhost:3000`.

## Tests unitarios

Por el tiempo disponible, escribí tests unitarios solo para los módulos principales: `books` y `auth` (controlador y servicio). Usan Jest con Prisma y las dependencias mockeadas.

Para correrlos:
    
```npm test
    npm run test:cov.
```

## Qué no alcancé hacer y cómo lo haría

- **Imagen de libros:** `multer` en `POST /books` con validación de tipo y tamaño, guardada en un volumen de Docker. En producción iría a S3 o similar. La columna `imgUrl` existe en el esquema y hoy queda en `null`.

- **Utilizar interceptores en NestJS para transformación y manipulación de respuestas.** 
Un ResponseInterceptor global con NestInterceptor y map() de RxJS. Que envuelve la respuesta en { data, meta }. meta lleva total, page y limit en los listados.


## Modo desarrollo

No lo uses con el contenedor `api` arriba: ambos ocupan el puerto 3000.

```bash
npm install
cp .env.example .env
docker compose up -d db
npx prisma migrate deploy
npx prisma db seed
npm run start:dev
```

## Variables de entorno
Solo se usan en el modo desarrollo. En Docker las define `docker-compose.yml`.

| Variable | Descripción |
|---|---|
| `DATABASE_URL` | Conexión a PostgreSQL |
| `JWT_SECRET` | Clave para firmar el token |
| `JWT_EXPIRES_IN` | Duración del token (ej. `1h`) |