// auth.js - User authentication API routes

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');
const {
    validateRegister,
    validateLogin,
    handleValidationErrors,
} = require('../middleware/validation');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Helper function to generate JWT token
const generateToken = (userId) => {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
};

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post(
    '/register',
    validateRegister,
    handleValidationErrors,
    async (req, res, next) => {
        try {
            const { name, email, password } = req.body;

            // Check if user already exists
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    error: 'User with this email already exists',
                });
            }

            // Create new user
            const user = new User({
                name,
                email,
                password,
            });

            await user.save();

            // Generate token
            const token = generateToken(user._id);

            res.status(201).json({
                success: true,
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
            });
        } catch (err) {
            next(err);
        }
    }
);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post(
    '/login',
    validateLogin,
    handleValidationErrors,
    async (req, res, next) => {
        try {
            const { email, password } = req.body;

            // Check if user exists
            const user = await User.findOne({ email }).select('+password');
            if (!user) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid credentials',
                });
            }

            // Check password
            const isPasswordMatch = await user.comparePassword(password);
            if (!isPasswordMatch) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid credentials',
                });
            }

            // Generate token
            const token = generateToken(user._id);

            res.json({
                success: true,
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
            });
        } catch (err) {
            next(err);
        }
    }
);

// @route   GET /api/auth/me
// @desc    Get current user profile (Protected)
// @access  Private
router.get('/me', auth, async (req, res, next) => {
    try {
        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found',
            });
        }

        res.json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                bio: user.bio,
                avatar: user.avatar,
                role: user.role,
            },
        });
    } catch (err) {
        next(err);
    }
});

// @route   PUT /api/auth/profile
// @desc    Update user profile (Protected)
// @access  Private
router.put('/profile', auth, async (req, res, next) => {
    try {
        const { name, bio, avatar } = req.body;

        let user = await User.findById(req.userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found',
            });
        }

        if (name) user.name = name;
        if (bio) user.bio = bio;
        if (avatar) user.avatar = avatar;

        await user.save();

        res.json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                bio: user.bio,
                avatar: user.avatar,
                role: user.role,
            },
        });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
