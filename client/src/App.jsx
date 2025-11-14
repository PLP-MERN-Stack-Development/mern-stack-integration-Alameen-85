// App.jsx - Main application component with routing

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import { BlogProvider, BlogContext } from './context/BlogContext';
import Navigation from './components/Navigation';
import PostList from './components/PostList';
import SinglePost from './components/SinglePost';
import CreatePost from './components/CreatePost';
import Login from './components/Login';
import Register from './components/Register';
import './App.css';

function AppContent() {
  const { isAuthenticated } = useContext(BlogContext);

  // Restore auth state from localStorage
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token && isAuthenticated) {
      // Will be handled by context on app load
    }
  }, [isAuthenticated]);

  return (
    <Router>
      <Navigation />
      <Routes>
        <Route path="/" element={<PostList />} />
        <Route path="/post/:id" element={<SinglePost />} />
        <Route
          path="/create"
          element={isAuthenticated ? <CreatePost /> : <Navigate to="/login" />}
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default function App() {
  return (
    <BlogProvider>
      <AppContent />
    </BlogProvider>
  );
}
