module.exports = {
  apps: [{
    name: 'wuzen-backend',
    script: './backend/src/server.js',
    cwd: '/var/www/wuzen',
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production',
      PORT: 3001,
      DB_HOST: 'localhost',
      DB_PORT: 5432,
      DB_USER: 'wuzen',
      DB_PASS: 'wuzen_secret_2026',
      DB_NAME: 'wuzen_c2',
      REDIS_HOST: 'localhost',
      REDIS_PORT: 6379,
      REDIS_PASS: 'wuzen_redis_2026',
      JWT_SECRET: 'wuzen_jwt_pm2_secret_change_me',
      ENCRYPTION_KEY: 'wuzen_aes_256_gcm_key_32bytes!!',
      MQTT_BROKER_HOST: 'localhost',
      MQTT_BROKER_PORT: 1883
    },
    log_file: '/var/log/wuzen/combined.log',
    out_file: '/var/log/wuzen/out.log',
    error_file: '/var/log/wuzen/error.log',
    merge_logs: true,
    time: true,
    autorestart: true,
    max_restarts: 10,
    min_uptime: '10s',
    watch: false,
    max_memory_restart: '1G'
  }]
};
