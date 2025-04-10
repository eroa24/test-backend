# Backend - Sistema de Gestión de Pagos y Productos

## Descripción del Proyecto

Este proyecto implementa un sistema backend para la gestión de productos, clientes, pagos y entregas. Se desarrolló utilizando NestJS y PostgreSQL con TypeORM como ORM.

## Características Implementadas

### 1. Gestión de Productos

- CRUD completo de productos
- Manejo de inventario con actualización de stock
- Soporte para imágenes de productos
- Validación de stock antes de transacciones

### 2. Gestión de Clientes

- Registro de clientes
- Validación de datos de cliente
- Búsqueda por email
- Manejo de excepciones para clientes duplicados

### 3. Sistema de Pagos

- Procesamiento de pagos
- Validación de tarjetas de crédito
- Manejo de estados de pago
- Integración con sistema de transacciones

### 4. Sistema de Entregas

- Creación de órdenes de entrega
- Actualización de estado de entregas
- Vinculación con transacciones

### 5. Transacciones

- Creación de transacciones
- Validación de stock de productos
- Integración con sistema de pagos
- Manejo de productos múltiples por transacción

## Cobertura de Pruebas

La aplicación cuenta con una cobertura de pruebas del 83.17% en statements, con los siguientes detalles:

- Statements: 83.17%
- Branches: 78.51%
- Functions: 72.38%
- Lines: 84.27%

### Módulos Probados

- Configuración de la aplicación
- Gestión de clientes
- Procesamiento de pagos
- Manejo de productos
- Sistema de transacciones
- Sistema de entregas
- Interceptores y filtros de excepciones

## Requisitos

- Node.js >= 20.11
- PostgreSQL >= 14
- npm >= 8.0.0

## Configuración

1. Clonar el repositorio e instalar dependencias:

```bash
git clone <repository-url>
cd test-backend
npm install
```

2. Configurar variables de entorno:

```bash
cp .env.example .env
```

Variables de entorno requeridas:

- `DATABASE_URL`: URL de conexión a PostgreSQL
- `PORT`: Puerto para el servidor (default: 3000)
- `NODE_ENV`: Entorno de ejecución

3. Iniciar la aplicación:

```bash
npm run start:dev
```

## Endpoints Principales

### Productos

- `POST /products`: Crear nuevo producto
- `GET /products`: Listar productos
- `GET /products/:id`: Obtener producto por ID
- `PUT /products/:id/stock`: Actualizar stock

### Clientes

- `POST /clients`: Registrar cliente
- `GET /clients`: Listar clientes
- `GET /clients/:id`: Obtener cliente por ID

### Entregas

- `POST /deliveries`: Crear entrega
- `PUT /deliveries/:id/status`: Actualizar estado

### Transacciones

- `POST /transactions`: Crear transacción
- `GET /transactions`: Listar transacciones
- `GET /transactions/:id`: Obtener detalles de transacción

## Manejo de Errores

Se implementó un sistema robusto de manejo de errores que incluye:

- Validación de datos de entrada
- Excepciones personalizadas por dominio
- Transformación de respuestas HTTP
- Interceptores para formato consistente de respuestas

## Tecnologías Utilizadas

- NestJS: Framework backend
- TypeORM: ORM para PostgreSQL
- PostgreSQL: Base de datos
- Jest: Framework de pruebas
- class-validator: Validación de DTOs
- Swagger: Documentación de API

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
