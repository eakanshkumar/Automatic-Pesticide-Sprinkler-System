const { body, validationResult } = require('express-validator');

// Handle validation errors
exports.handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: errors.array()
    });
  }
  next();
};

// User registration validation
exports.validateRegistration = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('farmName')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Farm name must be between 2 and 100 characters'),
  body('farmSize')
    .isFloat({ min: 0.1 })
    .withMessage('Farm size must be a positive number')
];

// User login validation
exports.validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

// Farm validation
exports.validateFarm = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Farm name must be between 2 and 100 characters'),
  body('size')
    .isFloat({ min: 0.1 })
    .withMessage('Farm size must be a positive number')
];

// Spray event validation
exports.validateSprayEvent = [
  body('field')
    .trim()
    .notEmpty()
    .withMessage('Field name is required'),
  body('pesticideUsed')
    .isFloat({ min: 0 })
    .withMessage('Pesticide used must be a positive number'),
  body('areaCovered')
    .isFloat({ min: 0 })
    .withMessage('Area covered must be a positive number')
];