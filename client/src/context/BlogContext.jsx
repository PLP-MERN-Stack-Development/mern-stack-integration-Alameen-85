// context/BlogContext.jsx - Global state context for blog app

import React, { createContext, useState, useCallback } from 'react';

export const BlogContext = createContext();

export const BlogProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [currentPost, setCurrentPost] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

    const login = useCallback((userData, token) => {
        setUser(userData);
        setIsAuthenticated(true);
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
    }, []);

    const logout = useCallback(() => {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }, []);

    const value = {
        user,
        setUser,
        posts,
        setPosts,
        categories,
        setCategories,
        currentPost,
        setCurrentPost,
        isAuthenticated,
        login,
        logout,
    };

    return (
        <BlogContext.Provider value={value}>
            {children}
        </BlogContext.Provider>
    );
};
