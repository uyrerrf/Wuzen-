const express = require('express');
const router = express.Router();
const db = require('../utils/db');
const { authMiddleware } = require('../utils/auth');

router.post('/send/:deviceId', authMiddleware, async (req, res) => {
  const { title, body, packageName } = req.body;
  await db.query(
    `INSERT INTO commands (device_id, command_type, payload, priority)
     VALUES ((SELECT id FROM devices WHERE device_id = $1), 'push_notification', $2, 1)`,
    [req.params.deviceId, JSON.stringify({ title, body, packageName })]
  );
  res.json({ queued: true });
});

module.exports = router;
