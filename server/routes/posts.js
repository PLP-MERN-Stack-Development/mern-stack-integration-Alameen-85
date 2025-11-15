// posts.js - Blog posts API routes

const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const Category = require('../models/Category');
const auth = require('../middleware/auth');
const {
    validatePost,
    handleValidationErrors,
} = require('../middleware/validation');

// @route   GET /api/posts
// @desc    Get all blog posts with pagination
// @access  Public
router.get('/', async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const posts = await Post.find({ isPublished: true })
            .populate('author', 'name email avatar')
            .populate('category', 'name slug')
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        const total = await Post.countDocuments({ isPublished: true });

        res.json({
            success: true,
            data: posts,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        });
    } catch (err) {
        next(err);
    }
});

// @route   GET /api/posts/:id
// @desc    Get a specific blog post
// @access  Public
router.get('/:id', async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id)
            .populate('author', 'name email avatar bio')
            .populate('category', 'name slug')
            .populate('comments.user', 'name avatar');

        if (!post) {
            return res.status(404).json({
                success: false,
                error: 'Post not found',
            });
        }

        // Increment view count
        await post.incrementViewCount();

        res.json({
            success: true,
            data: post,
        });
    } catch (err) {
        next(err);
    }
});

// @route   POST /api/posts
// @desc    Create a new blog post (Protected)
// @access  Private
router.post(
    '/',
    auth,
    validatePost,
    handleValidationErrors,
    async (req, res, next) => {
        try {
            const { title, content, categoryId, excerpt, tags, featuredImage } = req.body;
            console.log('📝 Creating post:', { title, categoryId, author: req.userId });

            // Check if category exists
            const category = await Category.findById(categoryId);
            if (!category) {
                console.error('❌ Category not found:', categoryId);
                return res.status(404).json({
                    success: false,
                    error: 'Category not found',
                });
            }

            const post = new Post({
                title,
                content,
                category: categoryId,
                author: req.userId,
                excerpt,
                tags: tags || [],
                featuredImage: featuredImage || 'default-post.jpg',
                isPublished: true,
            });

            await post.save();
            console.log('✅ Post saved:', post._id);

            const populatedPost = await post
                .populate('author', 'name email avatar')
                .populate('category', 'name slug');

            res.status(201).json({
                success: true,
                data: populatedPost,
            });
        } catch (err) {
            console.error('❌ Error creating post:', err.message);
            next(err);
        }
    }
);

// @route   PUT /api/posts/:id
// @desc    Update a blog post (Protected - author only)
// @access  Private
router.put(
    '/:id',
    auth,
    validatePost,
    handleValidationErrors,
    async (req, res, next) => {
        try {
            const post = await Post.findById(req.params.id);

            if (!post) {
                return res.status(404).json({
                    success: false,
                    error: 'Post not found',
                });
            }

            // Check authorization
            if (post.author.toString() !== req.userId) {
                return res.status(403).json({
                    success: false,
                    error: 'Not authorized to update this post',
                });
            }

            const { title, content, categoryId, excerpt, tags, featuredImage } =
                req.body;

            // Check if category exists
            const category = await Category.findById(categoryId);
            if (!category) {
                return res.status(404).json({
                    success: false,
                    error: 'Category not found',
                });
            }

            post.title = title;
            post.content = content;
            post.category = categoryId;
            post.excerpt = excerpt;
            post.tags = tags || [];
            if (featuredImage) post.featuredImage = featuredImage;

            await post.save();

            const updatedPost = await post
                .populate('author', 'name email avatar')
                .populate('category', 'name slug');

            res.json({
                success: true,
                data: updatedPost,
            });
        } catch (err) {
            next(err);
        }
    }
);

// @route   DELETE /api/posts/:id
// @desc    Delete a blog post (Protected - author only)
// @access  Private
router.delete('/:id', auth, async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({
                success: false,
                error: 'Post not found',
            });
        }

        // Check authorization
        if (post.author.toString() !== req.userId) {
            return res.status(403).json({
                success: false,
                error: 'Not authorized to delete this post',
            });
        }

        await Post.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
            message: 'Post deleted successfully',
        });
    } catch (err) {
        next(err);
    }
});

// @route   POST /api/posts/:id/comments
// @desc    Add comment to a post (Protected)
// @access  Private
router.post('/:id/comments', auth, async (req, res, next) => {
    try {
        const { content } = req.body;

        if (!content || content.trim() === '') {
            return res.status(400).json({
                success: false,
                error: 'Comment content is required',
            });
        }

        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({
                success: false,
                error: 'Post not found',
            });
        }

        await post.addComment(req.userId, content);

        const updatedPost = await post
            .populate('author', 'name email avatar')
            .populate('category', 'name slug')
            .populate('comments.user', 'name avatar');

        res.status(201).json({
            success: true,
            data: updatedPost,
        });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
