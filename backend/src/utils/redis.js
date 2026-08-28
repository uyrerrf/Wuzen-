const { createClient } = require('redis');

const client = createClient({
  socket: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379
  }
  // NO password — Render free Redis is unauthenticated
});

client.on('error', (err) => console.error('Redis error:', err));
client.on('connect', () => console.log('Redis connected'));
client.connect().catch(console.error);

module.exports = client;
