const express = require('express');
const router = express.Router();
const db = require('../utils/db');
const { authMiddleware } = require('../utils/auth');

router.get('/audit', authMiddleware, async (req, res) => {
  const { limit = 100 } = req.query;
  const result = await db.query(
    `SELECT a.*, u.username FROM audit_logs a LEFT JOIN users u ON a.user_id = u.id 
     ORDER BY a.created_at DESC LIMIT $1`,
    [parseInt(limit)]
  );
  res.json(result.rows);
});

module.exports = router;
