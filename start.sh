#!/bin/bash
# WUZEN C2 - Quick Start Script

set -e

echo "╔══════════════════════════════════════════╗"
echo "║        WUZEN C2 - Quick Start            ║"
echo "╚══════════════════════════════════════════╝"

MODE=${1:-docker}

if [ "$MODE" = "docker" ]; then
    echo "[WUZEN] Starting with Docker Compose..."
    docker-compose up --build -d
    echo "[WUZEN] Services starting..."
    sleep 5
    echo "[WUZEN] Dashboard: http://localhost"
    echo "[WUZEN] API: http://localhost:3001"
    echo "[WUZEN] MinIO Console: http://localhost:9001"

elif [ "$MODE" = "local" ]; then
    echo "[WUZEN] Starting local development..."

    # Start backend
    cd backend
    npm install
    node src/scripts/migrate.js 2>/dev/null || true
    cd ..

    # Start frontend
    cd frontend
    npm install
    cd ..

    echo "[WUZEN] Run these commands in separate terminals:"
    echo "  Terminal 1: cd backend && npm run dev"
    echo "  Terminal 2: cd frontend && npm run dev"

elif [ "$MODE" = "vps" ]; then
    echo "[WUZEN] Deploying to VPS..."
    sudo bash scripts/deploy-vps.sh

else
    echo "Usage: ./start.sh [docker|local|vps]"
    exit 1
fi
