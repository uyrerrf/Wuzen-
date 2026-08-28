const express = require('express');
const router = express.Router();
const db = require('../utils/db');
const { authMiddleware } = require('../utils/auth');

router.get('/device/:deviceId', authMiddleware, async (req, res) => {
  const result = await db.query(
    `SELECT id, device_id, sensors, cameras, recorded_at FROM device_hardware 
     WHERE device_id = (SELECT id FROM devices WHERE device_id = $1) ORDER BY recorded_at DESC LIMIT 1`,
    [req.params.deviceId]
  );
  res.json(result.rows[0] || { sensors: [], cameras: [] });
});

module.exports = router;
