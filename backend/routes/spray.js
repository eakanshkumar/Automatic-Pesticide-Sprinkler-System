const express = require('express');
const {
  getSprayEvents,
  getSprayEvent,
  createSprayEvent,
  updateSprayEvent,
  deleteSprayEvent,
  getSprayStats
} = require('../controllers/sprayController');

const { protect } = require('../middleware/auth');
const { validateSprayEvent, handleValidationErrors } = require('../middleware/validation');

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getSprayEvents)
  .post(validateSprayEvent, handleValidationErrors, createSprayEvent);

router.route('/stats/overview')
  .get(getSprayStats);

router.route('/:id')
  .get(getSprayEvent)
  .put(validateSprayEvent, handleValidationErrors, updateSprayEvent)
  .delete(deleteSprayEvent);

module.exports = router;