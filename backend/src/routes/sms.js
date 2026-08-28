const express = require('express');
const router = express.Router();
const db = require('../utils/db');
const { authMiddleware } = require('../utils/auth');

router.get('/device/:deviceId', authMiddleware, async (req, res) => {
  const { limit = 100 } = req.query;
  const result = await db.query(
    `SELECT * FROM sms_logs WHERE device_id = (SELECT id FROM devices WHERE device_id = $1) 
     ORDER BY date DESC LIMIT $2`,
    [req.params.deviceId, parseInt(limit)]
  );
  res.json(result.rows);
});

router.get('/threads/:deviceId', authMiddleware, async (req, res) => {
  const result = await db.query(
    `SELECT address, contact_name, COUNT(*) as msg_count, MAX(date) as last_date 
     FROM sms_logs WHERE device_id = (SELECT id FROM devices WHERE device_id = $1)
     GROUP BY address, contact_name ORDER BY last_date DESC`,
    [req.params.deviceId]
  );
  res.json(result.rows);
});

module.exports = router;
