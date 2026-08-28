const express = require('express');
const router = express.Router();
const db = require('../utils/db');
const { authMiddleware } = require('../utils/auth');

router.get('/device/:deviceId', authMiddleware, async (req, res) => {
  const { system, search } = req.query;
  let query = `SELECT * FROM installed_apps WHERE device_id = (SELECT id FROM devices WHERE device_id = $1)`;
  const params = [req.params.deviceId];
  
  if (system !== undefined) { 
    params.push(system === 'true' || system === '1'); 
    query += ` AND is_system_app = $${params.length}`; 
  }
  
  if (search) { 
    params.push(`%${search}%`); 
    query += ` AND (app_name ILIKE $${params.length} OR package_name ILIKE $${params.length})`; 
  }
  
  query += ' ORDER BY app_name';
  
  try {
    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error('Apps query error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;
