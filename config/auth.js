const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Secret key for JWT
const JWT_SECRET = process.env.JWTSecret;

// generate JWT token
const generateToken = (user) => {
    return jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
};

// hash password
const hashPassword = async (password) => {
    return await bcrypt.hash(password, 10);
};

// compare password
const comparePassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
};
// < !--ℑ♑︎  亖⌽⎭🂱⎶☀️☀️⌶⍱   -->
module.exports = {
    JWT_SECRET,
    generateToken,
    hashPassword,
    comparePassword
};