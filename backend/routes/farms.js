const express = require('express');
const {
  getFarms,
  getFarm,
  createFarm,
  updateFarm,
  deleteFarm,
  getFarmsInRadius
} = require('../controllers/farmController');

const { protect } = require('../middleware/auth');
const { validateFarm, handleValidationErrors } = require('../middleware/validation');

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getFarms)
  .post(validateFarm, handleValidationErrors, createFarm);

router.route('/radius/:zipcode/:distance')
  .get(getFarmsInRadius);

router.route('/:id')
  .get(getFarm)
  .put(validateFarm, handleValidationErrors, updateFarm)
  .delete(deleteFarm);

module.exports = router;