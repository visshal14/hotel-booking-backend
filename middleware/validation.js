const { body, validationResult } = require('express-validator');

// user registration validation rules
const registerValidation = [
    body('username').notEmpty().withMessage('Username is required'),
    body('email').isEmail().withMessage('Invalid email address'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
];

// validate request data
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    // < !--ℑ♑︎  亖⌽⎭🂱⎶☀️☀️⌶⍱   -->
    next();
};

module.exports = {
    registerValidation,
    validate
};