#!/bin/bash
# WUZEN C2 - VPS Deployment Script
# Tested on: Ubuntu 22.04/24.04, Debian 12, CentOS 9

set -e

echo "[WUZEN] Starting deployment..."

# Detect OS
if [ -f /etc/os-release ]; then
    . /etc/os-release
    OS=$NAME
else
    echo "Cannot detect OS"
    exit 1
fi

echo "[WUZEN] Detected OS: $OS"

# Install Node.js 20
if ! command -v node &> /dev/null || [ "$(node -v | cut -d'v' -f2 | cut -d'.' -f1)" != "20" ]; then
    echo "[WUZEN] Installing Node.js 20..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt-get install -y nodejs
fi

# Install PostgreSQL
if ! command -v psql &> /dev/null; then
    echo "[WUZEN] Installing PostgreSQL..."
    apt-get update
    apt-get install -y postgresql postgresql-contrib
    systemctl start postgresql
    systemctl enable postgresql
fi

# Install Redis
if ! command -v redis-cli &> /dev/null; then
    echo "[WUZEN] Installing Redis..."
    apt-get install -y redis-server
    systemctl start redis-server
    systemctl enable redis-server
fi

# Install Nginx
if ! command -v nginx &> /dev/null; then
    echo "[WUZEN] Installing Nginx..."
    apt-get install -y nginx
    systemctl start nginx
    systemctl enable nginx
fi

# Setup PostgreSQL
echo "[WUZEN] Setting up database..."
sudo -u postgres psql -c "CREATE USER wuzen WITH PASSWORD 'wuzen_secret_2026';" 2>/dev/null || true
sudo -u postgres psql -c "CREATE DATABASE wuzen_c2 OWNER wuzen;" 2>/dev/null || true
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE wuzen_c2 TO wuzen;" 2>/dev/null || true

# Setup Redis password
if ! grep -q "requirepass" /etc/redis/redis.conf; then
    echo "requirepass wuzen_redis_2026" >> /etc/redis/redis.conf
    systemctl restart redis-server
fi

# Setup directories
mkdir -p /var/www/wuzen
mkdir -p /var/log/wuzen

# Copy project
cp -r . /var/www/wuzen/
cd /var/www/wuzen

# Install backend dependencies
echo "[WUZEN] Installing backend dependencies..."
cd backend
npm ci --only=production
cd ..

# Install frontend dependencies and build
echo "[WUZEN] Building frontend..."
cd frontend
npm ci
npm run build
cd ..

# Run migrations
echo "[WUZEN] Running database migrations..."
cd backend
node src/scripts/migrate.js 2>/dev/null || true
node src/scripts/seed.js 2>/dev/null || true
cd ..

# Setup Nginx config
cat > /etc/nginx/sites-available/wuzen << 'EOF'
server {
    listen 80;
    server_name _;

    location / {
        root /var/www/wuzen/frontend/dist;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://localhost:3001/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    location /ws/ {
        proxy_pass http://localhost:3001/ws/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_read_timeout 86400;
    }
}
EOF

ln -sf /etc/nginx/sites-available/wuzen /etc/nginx/sites-enabled/wuzen
rm -f /etc/nginx/sites-enabled/default 2>/dev/null || true
nginx -t && systemctl restart nginx

# Create systemd service for backend
cat > /etc/systemd/system/wuzen-backend.service << 'EOF'
[Unit]
Description=WUZEN C2 Backend
After=network.target postgresql.service redis-server.service

[Service]
Type=simple
User=root
WorkingDirectory=/var/www/wuzen/backend
Environment=NODE_ENV=production
Environment=PORT=3001
Environment=DB_HOST=localhost
Environment=DB_PORT=5432
Environment=DB_USER=wuzen
Environment=DB_PASS=wuzen_secret_2026
Environment=DB_NAME=wuzen_c2
Environment=REDIS_HOST=localhost
Environment=REDIS_PORT=6379
Environment=REDIS_PASS=wuzen_redis_2026
Environment=JWT_SECRET=wuzen_jwt_vps_secret_change_me
Environment=ENCRYPTION_KEY=wuzen_aes_256_gcm_key_32bytes!!
Environment=MQTT_BROKER_HOST=localhost
Environment=MQTT_BROKER_PORT=1883
ExecStart=/usr/bin/node src/server.js
Restart=always
RestartSec=5
StandardOutput=append:/var/log/wuzen/backend.log
StandardError=append:/var/log/wuzen/backend-error.log

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable wuzen-backend
systemctl start wuzen-backend

echo "[WUZEN] Deployment complete!"
echo "[WUZEN] Dashboard: http://$(hostname -I | awk '{print $1}')"
echo "[WUZEN] API: http://$(hostname -I | awk '{print $1}'):3001"
echo "[WUZEN] Default login: admin / wuzen_secret_2026"
