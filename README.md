# WUZEN C2 Dashboard

Full-stack Command & Control dashboard with dark cyberpunk UI.

## Quick Start

```bash
./start.sh docker
```

## Deployment Options

### 1. Docker Compose (Recommended)
```bash
docker-compose up --build
```
Services:
- Dashboard: http://localhost
- API: http://localhost:3001
- MinIO Console: http://localhost:9001
- PostgreSQL: localhost:5432
- Redis: localhost:6379
- MQTT: localhost:1883

### 2. Render.com
```bash
# Push to GitHub, then:
# 1. Create new Web Service from repo
# 2. Render will use render.yaml blueprint
# 3. Database and Redis provisioned automatically
```

### 3. VPS (Ubuntu/Debian/CentOS)
```bash
./scripts/deploy-vps.sh
```
This script auto-installs Node.js 20, PostgreSQL, Redis, Nginx, and configures everything.

### 4. PM2 (Production Process Manager)
```bash
npm install -g pm2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### 5. Local Development
```bash
# Terminal 1 - Backend
cd backend
npm install
npm run dev

# Terminal 2 - Frontend
cd frontend
npm install
npm run dev
```

## Default Login
- Username: `admin`
- Password: `wuzen_secret_2026`

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Backend port | 3001 |
| `DB_HOST` | PostgreSQL host | localhost |
| `DB_PORT` | PostgreSQL port | 5432 |
| `DB_USER` | PostgreSQL user | wuzen |
| `DB_PASS` | PostgreSQL password | wuzen_secret_2026 |
| `DB_NAME` | Database name | wuzen_c2 |
| `REDIS_HOST` | Redis host | localhost |
| `REDIS_PORT` | Redis port | 6379 |
| `REDIS_PASS` | Redis password | wuzen_redis_2026 |
| `JWT_SECRET` | JWT signing key | (generate) |
| `ENCRYPTION_KEY` | AES-256 key | (generate) |
| `MINIO_ENDPOINT` | MinIO host | localhost |
| `MINIO_PORT` | MinIO port | 9000 |
| `MQTT_BROKER_HOST` | MQTT host | localhost |
| `MQTT_BROKER_PORT` | MQTT port | 1883 |

## Structure
- `frontend/` — React 18 dashboard (30+ pages, dark cyberpunk theme)
- `backend/` — Node.js API (35 routes, WebSocket + MQTT handlers)
- `docker/` — Dockerfiles and configs
- `scripts/` — Deployment scripts
- `docker-compose.yml` — Full stack orchestration
- `render.yaml` — Render.com blueprint
- `ecosystem.config.js` — PM2 configuration

## Security Notes
- Change default passwords before production use
- Use `docker-compose.prod.yml` for production (binds to 127.0.0.1)
- Use `docker-compose.override.yml` for local development (binds to 0.0.0.0)
- Generate new `JWT_SECRET` and `ENCRYPTION_KEY` for each deployment
- Place SSL certificates in `docker/ssl/` for HTTPS
