# 📝 MERN Stack Blog Application

A full-stack blog application built with **MongoDB**, **Express.js**, **React.js**, and **Node.js** demonstrating seamless integration between front-end and back-end components.

## 🎯 Features

### ✅ Task 1: Project Setup
- ✔️ Clear directory structure for client and server
- ✔️ MongoDB connection using Mongoose
- ✔️ Express.js server with middleware (CORS, JSON parsing)
- ✔️ React front-end with Vite
- ✔️ Vite proxy configured for API calls
- ✔️ Environment variables for configuration

### ✅ Task 2: Back-End API
- ✔️ RESTful API with all 7 endpoints:
  - `GET /api/posts` - Get all posts with pagination
  - `GET /api/posts/:id` - Get a specific post
  - `POST /api/posts` - Create a new post (Protected)
  - `PUT /api/posts/:id` - Update a post (Protected)
  - `DELETE /api/posts/:id` - Delete a post (Protected)
  - `GET /api/categories` - Get all categories
  - `POST /api/categories` - Create a category (Protected)
- ✔️ Mongoose models: `Post`, `Category`, `User`
- ✔️ Input validation using `express-validator`
- ✔️ Global error handling middleware
- ✔️ Comments feature on blog posts

### ✅ Task 3: Front-End Development
- ✔️ React components:
  - **PostList** - Display all posts with pagination
  - **SinglePost** - View individual post with comments
  - **CreatePost** - Form to create/edit posts
  - **Navigation** - App navigation bar
  - **Login** - User login form
  - **Register** - User registration form
- ✔️ React Router for navigation
- ✔️ React hooks: `useState`, `useEffect`, `useContext`
- ✔️ Custom hook: `useApi` for API calls

### ✅ Task 4: Integration & Data Flow
- ✔️ API service layer with axios
- ✔️ Global state management using React Context (`BlogContext`)
- ✔️ Form validation on client side
- ✔️ Loading and error states for all API calls
- ✔️ Optimistic UI updates (comments load immediately)

### ✅ Task 5: Advanced Features
- ✔️ **User Authentication** (ADVANCED FEATURE IMPLEMENTED)
  - User registration with password hashing (bcryptjs)
  - User login with JWT tokens
  - Protected routes and API endpoints
  - User profile management
- ✔️ View count tracking on posts
- ✔️ Comments system on posts
- ✔️ Pagination for post lists
- ✔️ Post categorization

## 🚀 Setup Instructions

### Prerequisites
- Node.js v18+ and npm
- MongoDB (local or Atlas)
- Git

### Step 1: Clone the Repository
```bash
git clone <your-repo-url>
cd mern-stack-integration-Alameen-85
```

### Step 2: Install Dependencies

**Root Directory:**
```bash
npm install
```

**Server:**
```bash
cd server
npm install
```

**Client:**
```bash
cd ../client
npm install
```

### Step 3: Configure Environment Variables

**Server** (`server/.env`):
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
PORT=5000
NODE_ENV=development
JWT_SECRET=your-super-secret-jwt-key-change-in-production
```

**Client** (`client/.env.local` - optional):
```env
VITE_API_URL=http://localhost:5000
```

### Step 4: Start the Application

**Development Mode (runs both client and server):**
```bash
npm run dev
```

**Or run separately:**

Terminal 1 - Server:
```bash
npm run server
```

Terminal 2 - Client:
```bash
npm run client
```

The app will be available at:
- **Front-end:** http://localhost:5173
- **Back-end:** http://localhost:5000

## 📡 API Documentation

### Authentication Endpoints

**Register User:**
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Login:**
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Get Current User Profile (Protected):**
```http
GET /api/auth/me
Authorization: Bearer <token>
```

### Posts Endpoints

**Get All Posts (with Pagination):**
```http
GET /api/posts?page=1&limit=10
```

**Get Single Post:**
```http
GET /api/posts/:id
```

**Create Post (Protected):**
```http
POST /api/posts
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "My First Post",
  "content": "Post content here...",
  "categoryId": "category_id",
  "excerpt": "Brief summary",
  "tags": ["javascript", "react"],
  "featuredImage": "https://example.com/image.jpg"
}
```

**Update Post (Protected - Author Only):**
```http
PUT /api/posts/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Title",
  "content": "Updated content...",
  "categoryId": "category_id"
}
```

**Delete Post (Protected - Author Only):**
```http
DELETE /api/posts/:id
Authorization: Bearer <token>
```

**Add Comment (Protected):**
```http
POST /api/posts/:id/comments
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "Great post!"
}
```

### Categories Endpoints

**Get All Categories:**
```http
GET /api/categories
```

**Create Category (Protected):**
```http
POST /api/categories
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Technology",
  "description": "Tech-related posts",
  "color": "#3498db"
}
```

## 📁 Project Structure

```
mern-stack-integration-Alameen-85/
├── client/                      # React front-end
│   ├── src/
│   │   ├── components/          # React components
│   │   ├── context/             # React Context (BlogContext)
│   │   ├── hooks/               # Custom hooks (useApi)
│   │   ├── services/            # API service (axios)
│   │   ├── styles/              # Component styles
│   │   ├── App.jsx              # Main app with routing
│   │   └── main.jsx             # App entry point
│   ├── package.json
│   └── vite.config.js           # Vite config with API proxy
├── server/                      # Express.js back-end
│   ├── middleware/              # Custom middleware
│   │   ├── auth.js              # JWT authentication
│   │   ├── errorHandler.js      # Global error handling
│   │   └── validation.js        # Request validation
│   ├── models/                  # Mongoose models
│   │   ├── User.js              # User model
│   │   ├── Post.js              # Post model
│   │   └── Category.js          # Category model
│   ├── routes/                  # API routes
│   │   ├── auth.js              # Authentication routes
│   │   ├── posts.js             # Post routes
│   │   └── categories.js        # Category routes
│   ├── server.js                # Express app setup
│   ├── .env                     # Environment variables (don't commit)
│   ├── .env.example             # Environment template
│   └── package.json
├── .gitignore                   # Git ignore file
├── package.json                 # Root package.json
└── README.md                    # This file
```

## 🎓 Key Technologies

- **Frontend:**
  - React.js with Hooks
  - React Router for navigation
  - Axios for HTTP requests
  - Vite for fast development

- **Backend:**
  - Express.js for REST API
  - Mongoose for MongoDB
  - JWT for authentication
  - bcryptjs for password hashing
  - express-validator for input validation

- **Database:**
  - MongoDB with Mongoose ODM

## 🔐 Authentication Flow

1. User registers → Password hashed with bcryptjs → User stored in DB
2. User logs in → Credentials validated → JWT token issued
3. Token stored in localStorage
4. Authenticated requests include token in `Authorization: Bearer <token>` header
5. Server validates token and extracts userId
6. Protected routes check authentication before allowing access

## ✨ Advanced Features Implemented

### User Authentication System
- ✅ User registration with email validation
- ✅ Secure password hashing with bcryptjs
- ✅ JWT-based authentication
- ✅ Protected routes (only authenticated users can create posts)
- ✅ User profile viewing and editing
- ✅ Authorization checks (users can only edit/delete their own posts)

## 🐛 Error Handling

- Global error handling middleware on backend
- Validation error messages from express-validator
- User-friendly error messages on frontend
- Loading and error states for all async operations
- Proper HTTP status codes (400, 401, 403, 404, 500)

## 🚀 Performance Features

- **Pagination:** Posts load 10 per page to reduce load
- **Lazy Loading:** Images lazy-loaded on frontend
- **Request Optimization:** Only required fields returned from API
- **Client-side Validation:** Reduces unnecessary API calls
- **Error Recovery:** Graceful handling of network errors

## 📸 UI/UX Features

### Post List View
- Grid layout of all published posts
- Post preview with excerpt
- Category badge
- Author and date information
- Pagination controls
- Responsive design

### Single Post View
- Full post content with featured image
- Author information
- View count tracking
- Tags display
- Comments section (add and view comments)

### Create Post Form
- WYSIWYG-style textarea for content
- Category selection dropdown
- Tags input (comma-separated)
- Featured image URL input
- Form validation with error messages
- Edit existing posts

### Authentication Pages
- User-friendly login form
- Registration form with password confirmation
- Protected routes (redirect to login if not authenticated)
- User info displayed in navigation when logged in
- Logout functionality

## 🔄 Development Workflow

1. **Frontend Changes:** Update components, Vite hot-reloads automatically
2. **Backend Changes:** Restart server or use nodemon with `npm run dev`
3. **Database Changes:** Update models and migrations as needed
4. **Testing:** Test API endpoints with curl/Postman and UI with browser

## 📝 Example API Usage

### 1. Register a New User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### 2. Login User
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### 3. Create a Category
```bash
curl -X POST http://localhost:5000/api/categories \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-token>" \
  -d '{
    "name": "Technology",
    "description": "Tech posts",
    "color": "#3498db"
  }'
```

### 4. Create a Blog Post
```bash
curl -X POST http://localhost:5000/api/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-token>" \
  -d '{
    "title": "Getting Started with React",
    "content": "React is a JavaScript library...",
    "categoryId": "category_id_here",
    "excerpt": "Learn the basics of React",
    "tags": ["react", "javascript", "frontend"]
  }'
```

## 🛠️ Troubleshooting

**CORS Issues:**
- Ensure Vite proxy is configured correctly in `vite.config.js`
- Check that both client and server are running on correct ports

**MongoDB Connection Error:**
- Verify `MONGODB_URI` in `server/.env`
- Ensure IP whitelist includes your machine (MongoDB Atlas)
- Check internet connectivity

**Authentication Issues:**
- Token not being sent: Check browser localStorage for token
- Token expired: Login again to get new token
- 401 Unauthorized: Ensure token is passed in Authorization header

**Port Already in Use:**
- Check what's using the port and kill the process
- Or change `PORT` in `server/.env` to a different port

## 📚 Learning Resources

- [React Documentation](https://react.dev)
- [Express.js Guide](https://expressjs.com)
- [MongoDB Documentation](https://docs.mongodb.com)
- [Mongoose ODM](https://mongoosejs.com)
- [JWT Authentication](https://jwt.io)
- [Vite Documentation](https://vitejs.dev)
- [Express Validator](https://express-validator.github.io/docs/)

## 👤 Author

Alameen85 - PLP MERN Stack Development Program

## 📄 License

This project is part of an educational assignment and is meant for learning purposes.

---

**Last Updated:** November 14, 2025
**Status:** ✅ Complete - All tasks implemented with authentication advanced feature 