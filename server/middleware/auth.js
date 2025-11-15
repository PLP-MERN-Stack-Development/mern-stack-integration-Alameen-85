// auth.js - Authentication middleware

const jwt = require('jsonwebtoken');

// Use the SAME JWT_SECRET as in auth routes
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

const auth = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        console.log('🔴 No token provided');
        return res.status(401).json({
            success: false,
            error: 'No token, authorization denied',
        });
    }

    try {
        console.log('🔑 Verifying token with secret:', JWT_SECRET.substring(0, 10) + '...');
        const decoded = jwt.verify(token, JWT_SECRET);
        console.log('✅ Token verified for user:', decoded.userId);
        req.userId = decoded.userId;
        next();
    } catch (err) {
        console.error('❌ Token verification failed:', err.message);
        res.status(401).json({
            success: false,
            error: 'Token is not valid',
        });
    }
};

module.exports = auth;
