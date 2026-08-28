const express = require('express');
const router = express.Router();
const { authMiddleware, adminMiddleware } = require('../utils/auth');

router.get('/c2', authMiddleware, adminMiddleware, async (req, res) => {
  res.json({
    wsEndpoint: process.env.WS_ENDPOINT || 'ws://localhost:3001/ws',
    mqttBroker: `${process.env.MQTT_BROKER_HOST || 'localhost'}:${process.env.MQTT_BROKER_PORT || 1883}`,
    encryption: 'AES-256-GCM',
    heartbeatInterval: 30,
    commandTimeout: 300
  });
});

module.exports = router;
