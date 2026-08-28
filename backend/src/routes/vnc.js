const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../utils/auth');

router.get('/stream/:deviceId', authMiddleware, async (req, res) => {
  // Returns WebSocket endpoint for VNC stream
  res.json({
    wsUrl: `ws://${req.headers.host}/ws?device=${req.params.deviceId}&vnc=true`,
    deviceId: req.params.deviceId
  });
});

module.exports = router;
