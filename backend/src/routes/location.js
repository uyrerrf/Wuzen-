const express = require('express');
const router = express.Router();
const db = require('../utils/db');
const { authMiddleware } = require('../utils/auth');

router.get('/device/:deviceId', authMiddleware, async (req, res) => {
  const { limit = 100 } = req.query;
  const result = await db.query(
    `SELECT * FROM location_history WHERE device_id = (SELECT id FROM devices WHERE device_id = $1) 
     ORDER BY recorded_at DESC LIMIT $2`,
    [req.params.deviceId, parseInt(limit)]
  );
  res.json(result.rows);
});

router.get('/device/:deviceId/latest', authMiddleware, async (req, res) => {
  const result = await db.query(
    `SELECT * FROM location_history WHERE device_id = (SELECT id FROM devices WHERE device_id = $1) 
     ORDER BY recorded_at DESC LIMIT 1`,
    [req.params.deviceId]
  );
  res.json(result.rows[0] || null);
});

module.exports = router;
