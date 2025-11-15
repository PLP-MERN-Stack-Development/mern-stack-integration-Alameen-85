// components/CreatePost.jsx - Form to create/edit a blog post

import { useEffect, useState, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { postAPI, categoryAPI } from '../services/api';
import { BlogContext } from '../context/BlogContext';
import { useApi } from '../hooks/useApi';
import '../styles/CreatePost.css';

export default function CreatePost() {
    const navigate = useNavigate();
    const { id: postId } = useParams();
    const { isAuthenticated, categories, setCategories } = useContext(BlogContext);

    const [formData, setFormData] = useState({
        title: '',
        content: '',
        excerpt: '',
        categoryId: '',
        tags: '',
        featuredImage: '',
    });

    const [errors, setErrors] = useState({});
    const { execute: fetchCategories } = useApi(categoryAPI.getAll);
    const { execute: createPost, loading: createLoading } = useApi(
        postId ? (data) => postAPI.update(postId, data) : postAPI.create
    );
    const { execute: fetchPost } = useApi(postAPI.getById);

    // Load categories and existing post (if editing)
    useEffect(() => {
        const loadData = async () => {
            if (!isAuthenticated) {
                navigate('/login');
                return;
            }

            const catResult = await fetchCategories();
            if (catResult) {
                setCategories(catResult.data);
            }

            if (postId) {
                const postResult = await fetchPost(postId);
                if (postResult) {
                    const post = postResult.data;
                    setFormData({
                        title: post.title,
                        content: post.content,
                        excerpt: post.excerpt,
                        categoryId: post.category._id,
                        tags: post.tags.join(', '),
                        featuredImage: post.featuredImage,
                    });
                }
            }
        };

        loadData();
    }, [isAuthenticated, postId, fetchCategories, fetchPost, navigate, setCategories]);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.title.trim()) {
            newErrors.title = 'Title is required';
        }
        if (!formData.content.trim()) {
            newErrors.content = 'Content is required';
        }
        if (!formData.categoryId) {
            newErrors.categoryId = 'Category is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        // Validate excerpt length on client side
        if (formData.excerpt && formData.excerpt.length > 200) {
            alert('Excerpt must be 200 characters or less');
            return;
        }

        const submitData = {
            title: formData.title,
            content: formData.content,
            excerpt: formData.excerpt,
            categoryId: formData.categoryId,
            tags: formData.tags
                .split(',')
                .map((t) => t.trim())
                .filter((t) => t),
            featuredImage: formData.featuredImage,
        };

        try {
            const result = await createPost(submitData);
            if (result) {
                navigate(postId ? `/post/${postId}` : '/');
            }
        } catch (err) {
            console.error('Error creating post:', err);
            // Handle validation errors
            if (err.response?.data?.errors) {
                const validationErrors = err.response.data.errors.map(e => e.msg).join('\n');
                alert('Validation errors:\n' + validationErrors);
            } else {
                alert('Error creating post: ' + (err.response?.data?.error || err.message));
            }
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    if (!isAuthenticated) {
        return <div>Redirecting to login...</div>;
    }

    return (
        <div className="create-post-container">
            <h1>{postId ? '✏️ Edit Post' : '✍️ Create New Post'}</h1>

            <form onSubmit={handleSubmit} className="post-form">
                <div className="form-group">
                    <label>Title</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Post title"
                    />
                    {errors.title && <span className="error">{errors.title}</span>}
                </div>

                <div className="form-group">
                    <label>Category</label>
                    <select
                        name="categoryId"
                        value={formData.categoryId}
                        onChange={handleChange}
                    >
                        <option value="">Select a category</option>
                        {categories.map((cat) => (
                            <option key={cat._id} value={cat._id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                    {errors.categoryId && (
                        <span className="error">{errors.categoryId}</span>
                    )}
                </div>

                <div className="form-group">
                    <label>Excerpt (Optional - Max 200 characters)</label>
                    <textarea
                        name="excerpt"
                        value={formData.excerpt}
                        onChange={handleChange}
                        placeholder="Brief summary of the post"
                        rows={2}
                        maxLength={200}
                    />
                    <small style={{ color: formData.excerpt.length > 180 ? '#ff6b6b' : '#666' }}>
                        {formData.excerpt.length}/200 characters
                    </small>
                </div>

                <div className="form-group">
                    <label>Content</label>
                    <textarea
                        name="content"
                        value={formData.content}
                        onChange={handleChange}
                        placeholder="Post content"
                        rows={10}
                    />
                    {errors.content && <span className="error">{errors.content}</span>}
                </div>

                <div className="form-group">
                    <label>Tags (comma-separated)</label>
                    <input
                        type="text"
                        name="tags"
                        value={formData.tags}
                        onChange={handleChange}
                        placeholder="javascript, react, web"
                    />
                </div>

                <div className="form-group">
                    <label>Featured Image URL (Optional)</label>
                    <input
                        type="text"
                        name="featuredImage"
                        value={formData.featuredImage}
                        onChange={handleChange}
                        placeholder="https://example.com/image.jpg"
                    />
                </div>

                <div className="form-actions">
                    <button
                        type="submit"
                        disabled={createLoading}
                        className="btn btn-primary"
                    >
                        {createLoading
                            ? 'Saving...'
                            : postId
                                ? 'Update Post'
                                : 'Create Post'}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate('/')}
                        className="btn btn-secondary"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}
