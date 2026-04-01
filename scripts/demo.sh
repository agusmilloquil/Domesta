#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
API_DIR="$ROOT_DIR/apps/api"

cleanup() {
  if [[ -n "${API_PID:-}" ]] && kill -0 "$API_PID" 2>/dev/null; then
    kill "$API_PID" >/dev/null 2>&1 || true
    wait "$API_PID" 2>/dev/null || true
  fi
}
trap cleanup EXIT

echo "🚀 Domesta demo (API)"

cd "$API_DIR"
if [[ ! -d node_modules ]]; then
  echo "📦 Instalando dependencias API..."
  npm install --silent
fi

echo "▶️  Iniciando API en background..."
node src/server.js > /tmp/domesta_demo_api.log 2>&1 &
API_PID=$!
sleep 2

echo "🔎 Healthcheck"
HEALTH=$(curl -s http://localhost:4000/health)
echo "$HEALTH"

WORKER_PAYLOAD='{"role":"worker","fullName":"Ana Perez","email":"ana.demo@domesta.local","password":"123456","city":"Mar del Plata","hourlyRate":3500,"experienceYears":3,"availability":["Lunes mañana"]}'
CLIENT_PAYLOAD='{"role":"client","fullName":"Carlos Gomez","email":"carlos.demo@domesta.local","password":"123456","city":"Mar del Plata"}'

echo "👷 Registrando worker..."
WORKER=$(curl -s -X POST http://localhost:4000/auth/register -H 'Content-Type: application/json' -d "$WORKER_PAYLOAD")
echo "$WORKER"

echo "🧑 Registrando cliente..."
CLIENT=$(curl -s -X POST http://localhost:4000/auth/register -H 'Content-Type: application/json' -d "$CLIENT_PAYLOAD")
echo "$CLIENT"

WORKER_ID=$(python -c "import json,sys; print(json.loads(sys.argv[1])['id'])" "$WORKER")
CLIENT_ID=$(python -c "import json,sys; print(json.loads(sys.argv[1])['id'])" "$CLIENT")

echo "🔐 Login cliente..."
LOGIN=$(curl -s -X POST http://localhost:4000/auth/login -H 'Content-Type: application/json' -d '{"email":"carlos.demo@domesta.local","password":"123456"}')
echo "$LOGIN"

echo "🔍 Buscar workers en Mar del Plata..."
SEARCH=$(curl -s 'http://localhost:4000/workers/search?city=mar%20del%20plata&minExp=1&maxRate=4000')
echo "$SEARCH"

echo "🧾 Crear job..."
JOB_PAYLOAD=$(cat <<JSON
{"clientId":"$CLIENT_ID","workerId":"$WORKER_ID","date":"2026-04-10","hours":4,"city":"Mar del Plata","notes":"Limpieza general demo"}
JSON
)
JOB=$(curl -s -X POST http://localhost:4000/jobs -H 'Content-Type: application/json' -d "$JOB_PAYLOAD")
echo "$JOB"

JOB_ID=$(python -c "import json,sys; print(json.loads(sys.argv[1])['id'])" "$JOB")

echo "✅ Aceptar job..."
UPDATED=$(curl -s -X PATCH "http://localhost:4000/jobs/$JOB_ID/status" -H 'Content-Type: application/json' -d '{"status":"accepted"}')
echo "$UPDATED"

echo "\n🎉 Demo OK. Endpoints verificados con flujo completo en memoria."
