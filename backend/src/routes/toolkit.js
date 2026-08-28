const express = require('express');
const router = express.Router();
const db = require('../utils/db');
const { authMiddleware } = require('../utils/auth');

router.get('/config/:deviceId', authMiddleware, async (req, res) => {
  const result = await db.query(
    'SELECT c2_config FROM devices WHERE device_id = $1',
    [req.params.deviceId]
  );
  res.json(result.rows[0]?.c2_config || {});
});

router.post('/config/:deviceId', authMiddleware, async (req, res) => {
  const config = req.body;
  await db.query(
    'UPDATE devices SET c2_config = $1 WHERE device_id = $2',
    [JSON.stringify(config), req.params.deviceId]
  );
  res.json({ saved: true });
});

module.exports = router;
