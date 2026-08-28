const express = require('express');
const router = express.Router();
const db = require('../utils/db');
const { authMiddleware, adminMiddleware } = require('../utils/auth');

router.get('/', authMiddleware, adminMiddleware, async (req, res) => {
  const result = await db.query('SELECT id, username, email, role, is_active, last_login, created_at FROM users');
  res.json(result.rows);
});

router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  await db.query('DELETE FROM users WHERE id = $1', [req.params.id]);
  res.json({ deleted: true });
});

module.exports = router;
