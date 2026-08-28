const express = require('express');
const router = express.Router();
const db = require('../utils/db');
const { minioClient, BUCKET_NAME } = require('../utils/minio');
const { authMiddleware } = require('../utils/auth');

router.get('/device/:deviceId', authMiddleware, async (req, res) => {
  const result = await db.query(
    `SELECT * FROM audio_recordings WHERE device_id = (SELECT id FROM devices WHERE device_id = $1) 
     ORDER BY recorded_at DESC`,
    [req.params.deviceId]
  );
  res.json(result.rows);
});

router.get('/download/:recordingId', authMiddleware, async (req, res) => {
  const result = await db.query('SELECT minio_key FROM audio_recordings WHERE id = $1', [req.params.recordingId]);
  if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
  try {
    const url = await minioClient.presignedGetObject(BUCKET_NAME, result.rows[0].minio_key, 3600);
    res.json({ url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
