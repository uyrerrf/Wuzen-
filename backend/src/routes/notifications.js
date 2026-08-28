const express = require('express');
const router = express.Router();
const db = require('../utils/db');
const { authMiddleware } = require('../utils/auth');

router.get('/device/:deviceId', authMiddleware, async (req, res) => {
  const result = await db.query(
    `SELECT * FROM notifications WHERE device_id = (SELECT id FROM devices WHERE device_id = $1) 
     ORDER BY post_time DESC LIMIT 500`,
    [req.params.deviceId]
  );
  res.json(result.rows);
});

module.exports = router;
