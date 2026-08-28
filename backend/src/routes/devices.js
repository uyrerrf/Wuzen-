const express = require('express');
const router = express.Router();
const db = require('../utils/db');
const { authMiddleware } = require('../utils/auth');

router.get('/', authMiddleware, async (req, res) => {
  try {
    const { status, search, limit = 50, offset = 0 } = req.query;
    let query = 'SELECT * FROM devices WHERE 1=1';
    const params = [];
    if (status) { params.push(status); query += ` AND status = $${params.length}`; }
    if (search) { params.push(`%${search}%`); query += ` AND (device_name ILIKE $${params.length} OR device_id ILIKE $${params.length})`; }
    query += ` ORDER BY last_seen DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(parseInt(limit), parseInt(offset));
    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM devices WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Device not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id/hardware', authMiddleware, async (req, res) => {
  const result = await db.query('SELECT * FROM device_hardware WHERE device_id = $1 ORDER BY recorded_at DESC LIMIT 1', [req.params.id]);
  res.json(result.rows[0] || {});
});

router.delete('/:id', authMiddleware, async (req, res) => {
  await db.query('DELETE FROM devices WHERE id = $1', [req.params.id]);
  res.json({ deleted: true });
});

module.exports = router;
