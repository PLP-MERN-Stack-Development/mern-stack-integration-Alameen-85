// components/Navigation.jsx - Top navigation bar

import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { BlogContext } from '../context/BlogContext';
import '../styles/Navigation.css';

export default function Navigation() {
    const { isAuthenticated, user, logout } = useContext(BlogContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-brand">
                    📝 Blog App
                </Link>

                <ul className="nav-menu">
                    <li className="nav-item">
                        <Link to="/" className="nav-link">
                            Home
                        </Link>
                    </li>

                    {isAuthenticated && (
                        <>
                            <li className="nav-item">
                                <Link to="/create" className="nav-link">
                                    ✍️ Create Post
                                </Link>
                            </li>
                            <li className="nav-item">
                                <span className="nav-user">👤 {user?.name}</span>
                            </li>
                            <li className="nav-item">
                                <button
                                    onClick={handleLogout}
                                    className="nav-link logout-btn"
                                >
                                    Logout
                                </button>
                            </li>
                        </>
                    )}

                    {!isAuthenticated && (
                        <>
                            <li className="nav-item">
                                <Link to="/login" className="nav-link">
                                    Login
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/register" className="nav-link">
                                    Register
                                </Link>
                            </li>
                        </>
                    )}
                </ul>
            </div>
        </nav>
    );
}
