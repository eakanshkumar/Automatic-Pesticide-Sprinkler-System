const express = require('express');
const router = express.Router();
const { analyzeDisease } = require('../controllers/diseaseController');
const { protect } = require('../middleware/auth');  // ✅ import correct function

// POST /api/disease/analyze - Analyze plant disease
router.post('/analyze', protect, analyzeDisease);

module.exports = router;
