const express = require('express');
const router = express.Router();
const db = require('../utils/db');
const { authMiddleware } = require('../utils/auth');

router.get('/device/:deviceId', authMiddleware, async (req, res) => {
  const result = await db.query(
    `SELECT * FROM ats_logs WHERE device_id = (SELECT id FROM devices WHERE device_id = $1) 
     ORDER BY initiated_at DESC`,
    [req.params.deviceId]
  );
  res.json(result.rows);
});

router.post('/initiate/:deviceId', authMiddleware, async (req, res) => {
  const { targetApp, amount, currency, walletAddress } = req.body;
  const result = await db.query(
    `INSERT INTO ats_logs (device_id, target_app, amount, currency, wallet_address, status)
     VALUES ((SELECT id FROM devices WHERE device_id = $1), $2, $3, $4, $5, 'pending') RETURNING *`,
    [req.params.deviceId, targetApp, amount, currency, walletAddress]
  );
  res.json(result.rows[0]);
});

module.exports = router;
