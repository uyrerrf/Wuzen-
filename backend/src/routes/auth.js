const express = require('express');
const router = express.Router();
const db = require('../utils/db');
const { generateToken, hashPassword, comparePassword, authMiddleware } = require('../utils/auth');
const { logAudit } = require('../utils/audit');

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const result = await db.query('SELECT * FROM users WHERE username = $1 AND is_active = true', [username]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const user = result.rows[0];
    if (!comparePassword(password, user.password_hash)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    await db.query('UPDATE users SET last_login = NOW() WHERE id = $1', [user.id]);
    const token = generateToken(user);
    await logAudit(user.id, 'LOGIN', 'user', user.id, {}, req.ip);
    res.json({ token, user: { id: user.id, username: user.username, role: user.role, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/register', authMiddleware, async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    const hash = hashPassword(password);
    const result = await db.query(
      'INSERT INTO users (username, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, username, email, role',
      [username, email, hash, role || 'operator']
    );
    await logAudit(req.user.id, 'REGISTER_USER', 'user', result.rows[0].id, { newUser: username }, req.ip);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/me', authMiddleware, async (req, res) => {
  const result = await db.query('SELECT id, username, email, role, last_login, created_at FROM users WHERE id = $1', [req.user.id]);
  res.json(result.rows[0]);
});

module.exports = router;
