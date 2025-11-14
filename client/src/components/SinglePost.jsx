// components/SinglePost.jsx - Display a single blog post with comments

import { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { postAPI } from '../services/api';
import { BlogContext } from '../context/BlogContext';
import { useApi } from '../hooks/useApi';
import '../styles/SinglePost.css';

export default function SinglePost() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(BlogContext);
    const [post, setPost] = useState(null);
    const [commentText, setCommentText] = useState('');

    const { execute: fetchPost, loading, error } = useApi(postAPI.getById);
    const { execute: addComment, loading: commentLoading } = useApi(postAPI.addComment);

    useEffect(() => {
        const loadPost = async () => {
            const result = await fetchPost(id);
            if (result) {
                setPost(result.data);
            }
        };

        loadPost();
    }, [id, fetchPost]);

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!commentText.trim() || !user) {
            alert('Please login and enter a comment');
            return;
        }

        const result = await addComment(id, { content: commentText });
        if (result) {
            setPost(result.data);
            setCommentText('');
        }
    };

    if (loading) return <div className="loading">Loading post...</div>;
    if (error) return <div className="error-message">Error: {error}</div>;
    if (!post) return <div className="error-message">Post not found</div>;

    return (
        <div className="single-post-container">
            <Link to="/" className="back-link">
                ← Back to Posts
            </Link>

            <article className="post-article">
                {post.featuredImage && post.featuredImage !== 'default-post.jpg' && (
                    <img
                        src={post.featuredImage}
                        alt={post.title}
                        className="featured-image"
                    />
                )}

                <h1>{post.title}</h1>

                <div className="post-info">
                    <span className="author">By {post.author?.name}</span>
                    <span className="date">
                        {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                    {post.category && (
                        <span className="category">📂 {post.category.name}</span>
                    )}
                    <span className="views">👁️ {post.viewCount} views</span>
                </div>

                <div className="post-body">{post.content}</div>

                {post.tags && post.tags.length > 0 && (
                    <div className="tags">
                        {post.tags.map((tag) => (
                            <span key={tag} className="tag">
                                #{tag}
                            </span>
                        ))}
                    </div>
                )}
            </article>

            <section className="comments-section">
                <h3>💬 Comments ({post.comments?.length || 0})</h3>

                {user && (
                    <form onSubmit={handleAddComment} className="comment-form">
                        <textarea
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            placeholder="Add your comment..."
                            rows={4}
                        />
                        <button
                            type="submit"
                            disabled={commentLoading}
                            className="btn btn-primary"
                        >
                            {commentLoading ? 'Posting...' : 'Post Comment'}
                        </button>
                    </form>
                )}

                {!user && (
                    <p className="login-prompt">
                        <Link to="/login">Login</Link> to add a comment
                    </p>
                )}

                <div className="comments-list">
                    {post.comments?.map((comment) => (
                        <div key={comment._id} className="comment">
                            <div className="comment-header">
                                <strong>{comment.user?.name}</strong>
                                <span className="comment-date">
                                    {new Date(comment.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                            <p>{comment.content}</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
