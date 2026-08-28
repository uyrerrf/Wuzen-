const express = require('express');
const router = express.Router();
const db = require('../utils/db');
const { authMiddleware } = require('../utils/auth');

router.get('/info/:deviceId', authMiddleware, async (req, res) => {
  const result = await db.query(
    `SELECT d.*, h.cpu_arch, h.cpu_cores, h.total_ram, h.available_ram, h.total_storage, 
            h.available_storage, h.screen_resolution, h.screen_density, h.sensors, h.cameras
     FROM devices d LEFT JOIN device_hardware h ON d.id = h.device_id
     WHERE d.device_id = $1 ORDER BY h.recorded_at DESC LIMIT 1`,
    [req.params.deviceId]
  );
  res.json(result.rows[0] || {});
});

router.post('/command/:deviceId', authMiddleware, async (req, res) => {
  const { command, params } = req.body;
  await db.query(
    `INSERT INTO commands (device_id, command_type, payload, priority)
     VALUES ((SELECT id FROM devices WHERE device_id = $1), 'hardware_control', $2, 1)`,
    [req.params.deviceId, JSON.stringify({ command, params })]
  );
  res.json({ queued: true });
});

module.exports = router;
