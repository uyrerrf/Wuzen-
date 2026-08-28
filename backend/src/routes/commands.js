const express = require('express');
const router = express.Router();
const db = require('../utils/db');
const { authMiddleware } = require('../utils/auth');

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { deviceId, commandType, payload, priority = 5 } = req.body;
    const result = await db.query(
      `INSERT INTO commands (device_id, command_type, payload, priority) 
       VALUES ((SELECT id FROM devices WHERE device_id = $1), $2, $3, $4) RETURNING *`,
      [deviceId, commandType, JSON.stringify(payload), priority]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/device/:deviceId', authMiddleware, async (req, res) => {
  const result = await db.query(
    'SELECT * FROM commands WHERE device_id = (SELECT id FROM devices WHERE device_id = $1) ORDER BY created_at DESC',
    [req.params.deviceId]
  );
  res.json(result.rows);
});

router.get('/pending/:deviceId', authMiddleware, async (req, res) => {
  const result = await db.query(
    `SELECT * FROM commands 
     WHERE device_id = (SELECT id FROM devices WHERE device_id = $1) 
     AND status = 'pending' ORDER BY priority ASC, created_at ASC`,
    [req.params.deviceId]
  );
  res.json(result.rows);
});

module.exports = router;
