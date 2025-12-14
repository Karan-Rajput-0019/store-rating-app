// backend/middleware/validation.js
const { body, validationResult } = require('express-validator');

// Validation rules
const validateSignUp = [
  body('name')
    .trim()
    .isLength({ min: 20, max: 60 })
    .withMessage('Name must be between 20 and 60 characters'),
  body('email')
    .isEmail()
    .withMessage('Invalid email format'),
  body('password')
    .isLength({ min: 8, max: 16 })
    .withMessage('Password must be between 8 and 16 characters')
    .matches(/[A-Z]/)
    .withMessage('Password must contain at least one uppercase letter')
    .matches(/[!@#$%^&*(),.?":{}|<>]/)
    .withMessage('Password must contain at least one special character'),
  body('address')
    .trim()
    .isLength({ max: 400 })
    .withMessage('Address must not exceed 400 characters')
];

const validateCreateUser = [
  body('name')
    .trim()
    .isLength({ min: 1, max: 20 })
    .withMessage('Name must be between 1 and 20 characters'),
  body('email')
    .isEmail()
    .withMessage('Invalid email format'),
  body('password')
    .isLength({ min: 8, max: 16 })
    .withMessage('Password must be between 8 and 16 characters')
    .matches(/[A-Z]/)
    .withMessage('Password must contain at least one uppercase letter')
    .matches(/[!@#$%^&*(),.?":{}|<>]/)
    .withMessage('Password must contain at least one special character'),
  body('address')
    .trim()
    .isLength({ max: 400 })
    .withMessage('Address must not exceed 400 characters'),
  body('role')
    .isIn(['admin', 'normal_user', 'store_owner'])
    .withMessage('Invalid role')
];

const validateCreateStore = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Store name is required'),
  body('email')
    .isEmail()
    .withMessage('Invalid email format'),
  body('address')
    .trim()
    .notEmpty()
    .isLength({ max: 400 })
    .withMessage('Address is required and must not exceed 400 characters')
];

const validateRating = [
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5')
];

const validatePassword = [
  body('newPassword')
    .isLength({ min: 8, max: 16 })
    .withMessage('Password must be between 8 and 16 characters')
    .matches(/[A-Z]/)
    .withMessage('Password must contain at least one uppercase letter')
    .matches(/[!@#$%^&*(),.?":{}|<>]/)
    .withMessage('Password must contain at least one special character')
];

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = {
  validateSignUp,
  validateCreateUser,
  validateCreateStore,
  validateRating,
  validatePassword,
  handleValidationErrors
};
