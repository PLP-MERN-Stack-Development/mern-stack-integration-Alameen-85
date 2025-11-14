// components/Login.jsx - User login form

import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import { BlogContext } from '../context/BlogContext';
import { useApi } from '../hooks/useApi';
import '../styles/Auth.css';

export default function Login() {
    const navigate = useNavigate();
    const { login } = useContext(BlogContext);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [errors, setErrors] = useState({});

    const { execute: loginUser, loading, error } = useApi(authAPI.login);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.email) {
            newErrors.email = 'Email is required';
        }
        if (!formData.password) {
            newErrors.password = 'Password is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        const result = await loginUser(formData);
        if (result) {
            login(result.user, result.token);
            navigate('/');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h1>Login</h1>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="your@email.com"
                        />
                        {errors.email && <span className="error">{errors.email}</span>}
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="••••••"
                        />
                        {errors.password && (
                            <span className="error">{errors.password}</span>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn btn-primary"
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                <p className="auth-link">
                    Don't have an account?{' '}
                    <Link to="/register">Register here</Link>
                </p>
            </div>
        </div>
    );
}
