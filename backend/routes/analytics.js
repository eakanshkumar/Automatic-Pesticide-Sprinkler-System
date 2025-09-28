const express = require('express');
const {
  getAnalytics,
  getEfficiencyComparison,
  getInfectionTrends,
  generateReport
} = require('../controllers/analyticsController');

const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getAnalytics);

router.route('/efficiency')
  .get(getEfficiencyComparison);

router.route('/infection-trends')
  .get(getInfectionTrends);

router.route('/generate-report')
  .post(generateReport);

module.exports = router;