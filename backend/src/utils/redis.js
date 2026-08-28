const { createClient } = require('redis');

const client = createClient({
  socket: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379
  },
  password: process.env.REDIS_PASS || 'wuzen_redis_2026'
});

client.on('error', (err) => console.error('Redis error:', err));
client.connect().catch(console.error);

module.exports = client;
