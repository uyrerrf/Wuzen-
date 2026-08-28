const express = require('express');
const router = express.Router();
const db = require('../utils/db');
const { authMiddleware } = require('../utils/auth');

router.get('/device/:deviceId', authMiddleware, async (req, res) => {
  const { search } = req.query;
  let query = `SELECT * FROM contacts WHERE device_id = (SELECT id FROM devices WHERE device_id = $1)`;
  const params = [req.params.deviceId];
  if (search) { params.push(`%${search}%`); query += ` AND display_name ILIKE $${params.length}`; }
  query += ' ORDER BY display_name';
  const result = await db.query(query, params);
  res.json(result.rows);
});

module.exports = router;
