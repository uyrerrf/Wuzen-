const express = require('express');
const router = express.Router();
const db = require('../utils/db');
const { authMiddleware } = require('../utils/auth');

router.get('/device/:deviceId', authMiddleware, async (req, res) => {
  const { path = '/', search } = req.query;
  let query = `SELECT * FROM file_entries WHERE device_id = (SELECT id FROM devices WHERE device_id = $1)`;
  const params = [req.params.deviceId];
  if (search) { params.push(`%${search}%`); query += ` AND name ILIKE $${params.length}`; }
  else { params.push(path); query += ` AND parent_path = $${params.length}`; }
  query += ' ORDER BY is_directory DESC, name';
  const result = await db.query(query, params);
  res.json(result.rows);
});

router.get('/tree/:deviceId', authMiddleware, async (req, res) => {
  const result = await db.query(
    `SELECT DISTINCT parent_path FROM file_entries WHERE device_id = (SELECT id FROM devices WHERE device_id = $1) ORDER BY parent_path`,
    [req.params.deviceId]
  );
  res.json(result.rows.map(r => r.parent_path));
});

module.exports = router;
