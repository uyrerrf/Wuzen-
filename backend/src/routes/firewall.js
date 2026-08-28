const express = require('express');
const router = express.Router();
const db = require('../utils/db');
const { authMiddleware } = require('../utils/auth');

router.get('/rules/:deviceId', authMiddleware, async (req, res) => {
  const result = await db.query(
    `SELECT * FROM network_events WHERE device_id = (SELECT id FROM devices WHERE device_id = $1) 
     AND event_type = 'firewall' ORDER BY recorded_at DESC`,
    [req.params.deviceId]
  );
  res.json(result.rows);
});

router.post('/rule/:deviceId', authMiddleware, async (req, res) => {
  const { action, target, port, protocol } = req.body;
  await db.query(
    `INSERT INTO commands (device_id, command_type, payload, priority)
     VALUES ((SELECT id FROM devices WHERE device_id = $1), 'firewall_rule', $2, 2)`,
    [req.params.deviceId, JSON.stringify({ action, target, port, protocol })]
  );
  res.json({ queued: true });
});

module.exports = router;
