// categories.js - Blog categories API routes

const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const auth = require('../middleware/auth');
const {
    validateCategory,
    handleValidationErrors,
} = require('../middleware/validation');

// @route   GET /api/categories
// @desc    Get all categories
// @access  Public
router.get('/', async (req, res, next) => {
    try {
        const categories = await Category.find().sort({ createdAt: -1 });

        res.json({
            success: true,
            data: categories,
        });
    } catch (err) {
        next(err);
    }
});

// @route   GET /api/categories/:id
// @desc    Get a specific category
// @access  Public
router.get('/:id', async (req, res, next) => {
    try {
        const category = await Category.findById(req.params.id);

        if (!category) {
            return res.status(404).json({
                success: false,
                error: 'Category not found',
            });
        }

        res.json({
            success: true,
            data: category,
        });
    } catch (err) {
        next(err);
    }
});

// @route   POST /api/categories
// @desc    Create a new category (Protected - admin only)
// @access  Private
router.post(
    '/',
    auth,
    validateCategory,
    handleValidationErrors,
    async (req, res, next) => {
        try {
            const { name, description, color } = req.body;

            // Check if category already exists
            const existingCategory = await Category.findOne({ name });
            if (existingCategory) {
                return res.status(400).json({
                    success: false,
                    error: 'Category with this name already exists',
                });
            }

            const category = new Category({
                name,
                description,
                color: color || '#007bff',
            });

            await category.save();

            res.status(201).json({
                success: true,
                data: category,
            });
        } catch (err) {
            next(err);
        }
    }
);

// @route   PUT /api/categories/:id
// @desc    Update a category (Protected - admin only)
// @access  Private
router.put(
    '/:id',
    auth,
    validateCategory,
    handleValidationErrors,
    async (req, res, next) => {
        try {
            const { name, description, color } = req.body;

            let category = await Category.findById(req.params.id);

            if (!category) {
                return res.status(404).json({
                    success: false,
                    error: 'Category not found',
                });
            }

            category.name = name;
            category.description = description;
            if (color) category.color = color;

            await category.save();

            res.json({
                success: true,
                data: category,
            });
        } catch (err) {
            next(err);
        }
    }
);

// @route   DELETE /api/categories/:id
// @desc    Delete a category (Protected - admin only)
// @access  Private
router.delete('/:id', auth, async (req, res, next) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);

        if (!category) {
            return res.status(404).json({
                success: false,
                error: 'Category not found',
            });
        }

        res.json({
            success: true,
            message: 'Category deleted successfully',
        });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
