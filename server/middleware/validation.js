// validation.js - Request validation middleware

const { body, validationResult } = require('express-validator');

// Post validation
exports.validatePost = [
    body('title')
        .trim()
        .notEmpty()
        .withMessage('Title is required')
        .isLength({ max: 100 })
        .withMessage('Title cannot exceed 100 characters'),
    body('content')
        .notEmpty()
        .withMessage('Content is required'),
    body('categoryId')
        .notEmpty()
        .withMessage('Category is required')
        .isMongoId()
        .withMessage('Invalid category ID'),
    body('excerpt')
        .optional()
        .isLength({ max: 200 })
        .withMessage('Excerpt cannot exceed 200 characters'),
];

// Category validation
exports.validateCategory = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Category name is required')
        .isLength({ max: 50 })
        .withMessage('Name cannot exceed 50 characters'),
    body('description')
        .optional()
        .isLength({ max: 200 })
        .withMessage('Description cannot exceed 200 characters'),
];

// Auth validation
exports.validateRegister = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Name is required'),
    body('email')
        .isEmail()
        .withMessage('Please provide a valid email'),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters'),
];

exports.validateLogin = [
    body('email')
        .isEmail()
        .withMessage('Please provide a valid email'),
    body('password')
        .notEmpty()
        .withMessage('Password is required'),
];

// Middleware to handle validation errors
exports.handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.error('❌ Validation errors:', errors.array());
        return res.status(400).json({
            success: false,
            errors: errors.array(),
        });
    }
    next();
};
