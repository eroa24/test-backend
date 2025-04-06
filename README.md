# Backend - Prueba Técnica de Pagos

## Requisitos

- Node.js >= 20.11
- PostgreSQL >= 14
- npm >= 8.0.0

## Instalación

1. Clonar el repositorio

```bash
git clone <repository-url>
cd test-backend
```

2. Instalar dependencias

```bash
npm install
```

3. Configurar variables de entorno

```bash
cp .env.example .env
```

Editar el archivo `.env` con tus credenciales.

4. Crear la base de datos

```bash
createdb payment_test
```

5. Ejecutar las migraciones

```bash
npm run migration:run
```

## Desarrollo

Para ejecutar el servidor en modo desarrollo:

```bash
npm run start:dev
```

## Pruebas

Para ejecutar las pruebas unitarias:

```bash
npm run test
```

Para ver la cobertura de pruebas:

```bash
npm run test:cov
```

## Estructura del Proyecto

```
src/
├── app.module.ts
├── main.ts
├── products/          # Módulo de productos
├── transactions/      # Módulo de transacciones
├── clients/          # Módulo de clientes
├── deliveries/       # Módulo de entregas
├── common/           # DTOs, utils, constantes
└── database/         # Configuración TypeORM
```

## API Endpoints

La documentación de la API está disponible en Swagger cuando el servidor está en ejecución:

```
http://localhost:3000/api
```

## Tecnologías Principales

- NestJS
- TypeORM
- PostgreSQL
- Jest
- Swagger
