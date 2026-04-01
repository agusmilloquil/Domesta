# Testing realizado

Fecha: 2026-04-01

## Checks ejecutados

1. **Sintaxis backend**
   - Comando: `node --check apps/api/src/server.js`
   - Resultado: OK (sin errores de sintaxis)

2. **Validación mínima de schema SQL**
   - Script Python para verificar presencia de tablas core: `users`, `worker_profiles`, `jobs`, `reviews`, `incidents`.
   - Resultado: OK

## Limitaciones del entorno

- No fue posible ejecutar `npm install` para levantar tests de integración o e2e porque el registry devuelve `403 Forbidden` en este entorno.
- Una vez habilitado acceso a npm, se recomienda correr:
  - `cd apps/api && npm install && npm run start`
  - smoke tests con `curl` sobre `/health`, `/auth/register`, `/auth/login`, `/workers/search`, `/jobs`.
