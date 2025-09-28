const express = require('express');
const router = express.Router();
const { sendCommand, getStatus } = require('../controllers/esp32Controller');
const { protect } = require('../middleware/auth');

// POST /api/esp32/command - Send command to ESP32
router.post('/command', protect, sendCommand);

// GET /api/esp32/status - Get ESP32 status
router.get('/status', protect, getStatus);

module.exports = router;