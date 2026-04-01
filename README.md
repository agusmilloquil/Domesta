# Domesta MVP

Domesta es una plataforma tipo marketplace para conectar clientes con trabajadores/as domésticos/as en Argentina.

## Stack elegido
- **Frontend web:** React + Vite
- **Backend:** Node.js + Express
- **Base de datos:** PostgreSQL
- **Auth:** JWT (MVP)
- **Deploy recomendado:** Vercel (web) + AWS ECS/Fargate (API) + RDS PostgreSQL

## Estructura del proyecto

```text
.
├── apps
│   ├── api                  # API Express
│   └── web                  # App React (Vite)
├── docs
│   ├── database-schema.sql  # Diseño inicial de base de datos
│   ├── mvp-scope.md         # Alcance del MVP
│   └── user-flows.md        # Flujos principales de usuarios
├── infra
│   └── architecture.md      # Arquitectura y escalabilidad
└── README.md
```

## Cómo correr el MVP localmente

### 1) API
```bash
cd apps/api
npm install
npm run dev
```
API en `http://localhost:4000`.

### 2) Web
```bash
cd apps/web
npm install
npm run dev
```
Web en `http://localhost:5173`.

## Endpoints MVP
- `GET /health` - healthcheck
- `POST /auth/register` - registro cliente/trabajador
- `POST /auth/login` - login y JWT
- `GET /workers/search` - búsqueda con filtros (ubicación, experiencia, tarifa, disponibilidad)
- `POST /jobs` - crear solicitud de trabajo
- `PATCH /jobs/:id/status` - aceptar/rechazar trabajo

> Nota: para producción, agregar integración con proveedor KYC para DNI/antecedentes y pasarela de pagos.


## Demo ejecutable (flujo completo API)



Desde la raíz del repo:

```bash
./scripts/demo.sh
```

El script levanta la API, ejecuta un flujo real (`register -> login -> search -> create job -> update status`) y muestra respuestas JSON en consola.


## Demo visual (API + Web)

Para levantar todo junto y probarlo visualmente:

```bash
./scripts/demo-full.sh
```

Luego abrí `http://localhost:5173` y en la UI hacé:
1. **Verificar API**
2. **Cargar worker demo**
3. **Buscar ahora**

## Entregables cubiertos
1. Estructura del proyecto ✅
2. Código base funcional ✅
3. Diseño de base de datos ✅
4. Flujo de usuarios ✅
5. Primer prototipo (MVP) ✅
6. Recomendaciones para escalar ✅
