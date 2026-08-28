const express = require('express');
const router = express.Router();
const db = require('../utils/db');
const { authMiddleware } = require('../utils/auth');

router.get('/device/:deviceId', authMiddleware, async (req, res) => {
  const result = await db.query(
    `SELECT * FROM running_processes WHERE device_id = (SELECT id FROM devices WHERE device_id = $1) 
     ORDER BY recorded_at DESC LIMIT 200`,
    [req.params.deviceId]
  );
  res.json(result.rows);
});

module.exports = router;
