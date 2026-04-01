# Testing realizado

Fecha: 2026-04-01

## Checks ejecutados

0. **Instalación de dependencias API**
   - Comando: `cd apps/api && npm install`
   - Resultado: OK (87 paquetes instalados, 0 vulnerabilidades)

1. **Sintaxis backend**
   - Comando: `node --check apps/api/src/server.js`
   - Resultado: OK (sin errores de sintaxis)

2. **Validación mínima de schema SQL**
   - Script Python para verificar presencia de tablas core: `users`, `worker_profiles`, `jobs`, `reviews`, `incidents`.
   - Resultado: OK

3. **Test automatizado de contrato API (sin dependencias npm)**
   - Comando: `python -m unittest discover -s tests -p 'test_*.py'`
   - Cobertura: existencia de endpoints MVP y campos obligatorios del schema de registro.
   - Resultado: OK

4. **Smoke test endpoint health**
   - Comandos:
     - `cd apps/api`
     - `node src/server.js` (en background)
     - `curl -s http://localhost:4000/health`
   - Resultado: OK (`{\"ok\":true,\"service\":\"domesta-api\"}`)

## Limitaciones del entorno

- No se ejecutaron aún pruebas e2e completas sobre todo el flujo de contratación (`register -> login -> search -> create job -> update status`).
- Próximo paso recomendado:
  - agregar script de integración automatizado (por ejemplo, con `supertest`) para cubrir todos los endpoints del MVP.
