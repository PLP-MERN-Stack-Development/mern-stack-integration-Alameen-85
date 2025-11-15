// mockdb.js - Mock MongoDB connection for testing when Atlas is unavailable
// This allows the app to run without MongoDB

const users = [];
const posts = [];
const categories = [];

// Mock Mongoose connection
const connectMockDB = async () => {
    console.log('✅ Connected to Mock MongoDB (Development Mode)');
    console.log('⚠️  WARNING: Using mock database. Data will not persist!');
    return true;
};

module.exports = {
    connectMockDB,
    users,
    posts,
    categories,
};
