#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
API_DIR="$ROOT_DIR/apps/api"
WEB_DIR="$ROOT_DIR/apps/web"

cleanup() {
  [[ -n "${API_PID:-}" ]] && kill "$API_PID" >/dev/null 2>&1 || true
  [[ -n "${WEB_PID:-}" ]] && kill "$WEB_PID" >/dev/null 2>&1 || true
}
trap cleanup EXIT

echo "🚀 Iniciando demo visual de Domesta"

cd "$API_DIR"
npm install --silent
node src/server.js > /tmp/domesta_api_full.log 2>&1 &
API_PID=$!

cd "$WEB_DIR"
npm install --silent
npm run dev -- --host 0.0.0.0 --port 5173 > /tmp/domesta_web_full.log 2>&1 &
WEB_PID=$!

sleep 3

echo "✅ API: http://localhost:4000"
echo "✅ WEB: http://localhost:5173"
echo "\nAbrí la web y usá: Verificar API -> Cargar worker demo -> Buscar ahora"
echo "Presioná Ctrl+C para finalizar."

wait
