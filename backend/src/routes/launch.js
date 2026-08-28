const express = require('express');
const router = express.Router();
const db = require('../utils/db');
const { authMiddleware } = require('../utils/auth');

router.post('/app/:deviceId', authMiddleware, async (req, res) => {
  const { packageName } = req.body;
  await db.query(
    `INSERT INTO commands (device_id, command_type, payload, priority)
     VALUES ((SELECT id FROM devices WHERE device_id = $1), 'launch_app', $2, 1)`,
    [req.params.deviceId, JSON.stringify({ packageName })]
  );
  res.json({ queued: true });
});

router.post('/link/:deviceId', authMiddleware, async (req, res) => {
  const { url, inApp = false } = req.body;
  await db.query(
    `INSERT INTO commands (device_id, command_type, payload, priority)
     VALUES ((SELECT id FROM devices WHERE device_id = $1), 'launch_link', $2, 1)`,
    [req.params.deviceId, JSON.stringify({ url, inApp })]
  );
  res.json({ queued: true });
});

module.exports = router;
