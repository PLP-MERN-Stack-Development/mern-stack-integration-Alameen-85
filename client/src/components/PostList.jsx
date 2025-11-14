// components/PostList.jsx - Display list of blog posts

import { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { postAPI } from '../services/api';
import { BlogContext } from '../context/BlogContext';
import { useApi } from '../hooks/useApi';
import '../styles/PostList.css';

export default function PostList() {
    const { posts, setPosts } = useContext(BlogContext);
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState(null);

    const { execute: fetchPosts, loading, error } = useApi(postAPI.getAll);

    useEffect(() => {
        const loadPosts = async () => {
            const result = await fetchPosts(page, 10);
            if (result) {
                setPosts(result.data);
                setPagination(result.pagination);
            }
        };

        loadPosts();
    }, [page, fetchPosts, setPosts]);

    return (
        <div className="posts-container">
            <h1>📚 Blog Posts</h1>

            {error && (
                <div className="error-message">
                    Error loading posts: {error}
                </div>
            )}

            {loading && <div className="loading">Loading posts...</div>}

            {!loading && posts.length === 0 && (
                <p className="no-posts">No posts yet. Be the first to write!</p>
            )}

            <div className="posts-grid">
                {posts.map((post) => (
                    <div key={post._id} className="post-card">
                        {post.featuredImage && post.featuredImage !== 'default-post.jpg' && (
                            <img
                                src={post.featuredImage}
                                alt={post.title}
                                className="post-image"
                            />
                        )}
                        <div className="post-content">
                            <h2>{post.title}</h2>
                            {post.category && (
                                <span className="post-category">
                                    📂 {post.category.name}
                                </span>
                            )}
                            <p className="post-excerpt">
                                {post.excerpt || post.content.substring(0, 100)}...
                            </p>
                            <div className="post-meta">
                                <span className="post-author">
                                    By {post.author?.name}
                                </span>
                                <span className="post-date">
                                    {new Date(post.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                            <Link to={`/post/${post._id}`} className="read-more">
                                Read More →
                            </Link>
                        </div>
                    </div>
                ))}
            </div>

            {pagination && pagination.pages > 1 && (
                <div className="pagination">
                    {page > 1 && (
                        <button onClick={() => setPage(page - 1)} className="btn btn-secondary">
                            ← Previous
                        </button>
                    )}

                    <span className="page-info">
                        Page {page} of {pagination.pages}
                    </span>

                    {page < pagination.pages && (
                        <button onClick={() => setPage(page + 1)} className="btn btn-secondary">
                            Next →
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
