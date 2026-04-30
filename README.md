# 📝 Inkwell — Full-Stack MERN Blog Application

A complete, production-ready blog platform built with MongoDB, Express, React, and Node.js.

---

## 📁 Complete Folder Structure

```
mern-blog/
│
├── backend/                        # Express + Node.js API
│   ├── config/
│   │   └── db.js                   # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js       # Register, login, profile
│   │   ├── blogController.js       # CRUD + like + search
│   │   ├── commentController.js    # Comment CRUD + like
│   │   └── adminController.js      # Admin dashboard logic
│   ├── middleware/
│   │   ├── authMiddleware.js       # JWT protect + optionalAuth
│   │   └── adminMiddleware.js      # Admin role guard
│   ├── models/
│   │   ├── User.js                 # User schema + bcrypt hooks
│   │   ├── Blog.js                 # Blog schema + text indexes
│   │   └── Comment.js              # Comment schema
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── blogRoutes.js
│   │   ├── commentRoutes.js
│   │   └── adminRoutes.js
│   ├── .env.example
│   ├── package.json
│   └── server.js                   # Express entry point
│
└── frontend/                       # React + Vite + Tailwind
    ├── src/
    │   ├── api/
    │   │   └── index.js            # Axios instance + all API calls
    │   ├── components/
    │   │   ├── BlogCard.jsx
    │   │   ├── BlogForm.jsx        # Shared create/edit form
    │   │   ├── CommentSection.jsx
    │   │   ├── Footer.jsx
    │   │   ├── Layout.jsx
    │   │   ├── Navbar.jsx
    │   │   ├── SearchBar.jsx
    │   │   └── Spinner.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx     # Global auth state
    │   ├── pages/
    │   │   ├── AdminDashboard.jsx
    │   │   ├── BlogDetailPage.jsx
    │   │   ├── BlogListPage.jsx
    │   │   ├── CreateBlogPage.jsx
    │   │   ├── EditBlogPage.jsx
    │   │   ├── HomePage.jsx
    │   │   ├── LoginPage.jsx
    │   │   ├── MyBlogsPage.jsx
    │   │   ├── NotFoundPage.jsx
    │   │   ├── ProfilePage.jsx
    │   │   └── RegisterPage.jsx
    │   ├── styles/
    │   │   └── index.css           # Tailwind + custom design system
    │   ├── App.jsx                 # Route definitions
    │   └── main.jsx                # React entry point
    ├── .env.example
    ├── index.html
    ├── package.json
    ├── postcss.config.js
    ├── tailwind.config.js
    └── vite.config.js
```

---

## 🗄️ Database Schemas

### User Schema
| Field     | Type    | Notes                          |
|-----------|---------|--------------------------------|
| username  | String  | Unique, 3–30 chars             |
| email     | String  | Unique, validated              |
| password  | String  | Hashed with bcrypt (salt 12)   |
| avatar    | String  | URL (optional)                 |
| bio       | String  | Max 200 chars                  |
| role      | String  | 'user' or 'admin'              |
| isActive  | Boolean | For ban/unban                  |

### Blog Schema
| Field      | Type     | Notes                           |
|------------|----------|---------------------------------|
| title      | String   | 5–150 chars, required           |
| content    | String   | Min 20 chars                    |
| excerpt    | String   | Auto-generated from content     |
| category   | String   | Enum: 10 categories             |
| image      | String   | Cover image URL (optional)      |
| author     | ObjectId | Ref: User                       |
| likes      | [ObjectId]| Array of user refs             |
| views      | Number   | Auto-incremented on view        |
| tags       | [String] | Indexed for text search         |
| slug       | String   | Auto-generated, unique          |
| isPublished| Boolean  | Default true                    |

### Comment Schema
| Field         | Type     | Notes                       |
|---------------|----------|-----------------------------|
| content       | String   | 1–500 chars                 |
| author        | ObjectId | Ref: User                   |
| blog          | ObjectId | Ref: Blog                   |
| likes         | [ObjectId]| User refs                  |
| parentComment | ObjectId | Ref: Comment (for replies)  |

---

## 🔑 API Routes Reference

### Auth  `/api/auth`
| Method | Endpoint           | Auth | Description         |
|--------|--------------------|------|---------------------|
| POST   | /register          | ✗    | Register new user   |
| POST   | /login             | ✗    | Login               |
| GET    | /me                | ✓    | Get current user    |
| PUT    | /profile           | ✓    | Update profile      |
| PUT    | /change-password   | ✓    | Change password     |

### Blogs  `/api/blogs`
| Method | Endpoint        | Auth | Description              |
|--------|-----------------|------|--------------------------|
| GET    | /               | ✗    | All blogs (search/filter)|
| GET    | /my-blogs       | ✓    | Current user's blogs     |
| GET    | /:id            | ✗    | Single blog              |
| POST   | /               | ✓    | Create blog              |
| PUT    | /:id            | ✓    | Edit blog (author/admin) |
| DELETE | /:id            | ✓    | Delete blog              |
| PUT    | /:id/like       | ✓    | Toggle like              |

### Comments  `/api/comments`
| Method | Endpoint      | Auth | Description             |
|--------|---------------|------|-------------------------|
| GET    | /:blogId      | ✗    | Get blog's comments     |
| POST   | /:blogId      | ✓    | Add comment             |
| PUT    | /:id          | ✓    | Edit comment (author)   |
| DELETE | /:id          | ✓    | Delete comment          |
| PUT    | /:id/like     | ✓    | Toggle comment like     |

### Admin  `/api/admin`  (Admin role required)
| Method | Endpoint                    | Description          |
|--------|-----------------------------|----------------------|
| GET    | /stats                      | Dashboard statistics |
| GET    | /users                      | List all users       |
| PUT    | /users/:id/toggle-status    | Ban / unban user     |
| PUT    | /users/:id/promote          | Promote to admin     |
| GET    | /blogs                      | All blogs (admin)    |
| DELETE | /blogs/:id                  | Delete any blog      |

---

## 🚀 Step-by-Step Setup

### Prerequisites
- Node.js ≥ 18
- npm ≥ 9
- MongoDB Atlas account (free tier works perfectly)

---

### Step 1 — Clone & Backend Setup

```bash
# Go to backend
cd mern-blog/backend

# Install dependencies
npm install

# Create .env file from example
cp .env.example .env
```

Edit `.env` with your real values:
```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/mern-blog
JWT_SECRET=a_very_long_random_secret_string_here_32chars_minimum
JWT_EXPIRE=7d
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

```bash
# Install nodemon globally (optional)
npm install -g nodemon

# Start backend dev server
npm run dev
# → Server running on http://localhost:5000
```

---

### Step 2 — Frontend Setup

```bash
cd mern-blog/frontend

# Install dependencies
npm install

# Create .env file
echo "VITE_API_URL=http://localhost:5000/api" > .env

# Start dev server
npm run dev
# → App running on http://localhost:5173
```

---

### Step 3 — MongoDB Connection

1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Create a free cluster
3. Create a database user (Settings → Database Access)
4. Whitelist your IP (Network Access → `0.0.0.0/0` for dev)
5. Click **Connect → Drivers** and copy the connection string
6. Replace `<username>` and `<password>` in your `.env`

The database and collections are created **automatically** when you first write data.

---

### Step 4 — Create Admin User

After starting the backend, register normally via the UI, then manually promote yourself to admin using MongoDB Atlas or Compass:

```javascript
// In MongoDB Atlas Data Explorer or Compass shell
db.users.updateOne(
  { email: "your@email.com" },
  { $set: { role: "admin" } }
)
```

Then re-login. The Admin link will appear in the navbar.

---

### Step 5 — Packages Installed

#### Backend
| Package            | Purpose                          |
|--------------------|----------------------------------|
| express            | Web framework                    |
| mongoose           | MongoDB ODM                      |
| bcryptjs           | Password hashing                 |
| jsonwebtoken       | JWT creation & verification      |
| cors               | Cross-origin resource sharing    |
| dotenv             | Environment variable loading     |
| multer             | File upload middleware (ready)   |
| express-validator  | Input validation helpers         |
| nodemon            | Dev auto-restart                 |

#### Frontend
| Package            | Purpose                          |
|--------------------|----------------------------------|
| react              | UI library                       |
| react-dom          | DOM renderer                     |
| react-router-dom   | Client-side routing              |
| axios              | HTTP client                      |
| react-hot-toast    | Toast notifications              |
| date-fns           | Date formatting utilities        |
| tailwindcss        | Utility-first CSS                |
| vite               | Build tool                       |

---

## 🧪 Testing API with Postman

### Register
```
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "username": "amith",
  "email": "amith@example.com",
  "password": "password123",
  "bio": "Full-stack developer"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Account created successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "6577abc123...",
    "username": "amith",
    "email": "amith@example.com",
    "role": "user"
  }
}
```

### Login
```
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{ "email": "amith@example.com", "password": "password123" }
```

### Create Blog (Protected)
```
POST http://localhost:5000/api/blogs
Authorization: Bearer <your_token>
Content-Type: application/json

{
  "title": "Getting Started with React Hooks",
  "content": "React Hooks revolutionized the way we write components...",
  "category": "Programming",
  "image": "https://images.unsplash.com/photo-1633356122544-f134324a6cee",
  "tags": "react, hooks, javascript",
  "excerpt": "A complete guide to useState, useEffect and more."
}
```

### Get All Blogs with Filters
```
GET http://localhost:5000/api/blogs?page=1&limit=9&category=Programming&search=react
```

### Toggle Like
```
PUT http://localhost:5000/api/blogs/<blogId>/like
Authorization: Bearer <your_token>
```

### Add Comment
```
POST http://localhost:5000/api/comments/<blogId>
Authorization: Bearer <your_token>
Content-Type: application/json

{ "content": "Great article! Very informative." }
```

### Admin — Get Stats
```
GET http://localhost:5000/api/admin/stats
Authorization: Bearer <admin_token>
```

---

## 🌐 Deployment Guide

### Backend → Railway / Render

**Railway:**
```bash
# Install Railway CLI
npm install -g @railway/cli
railway login
cd backend
railway init
railway up

# Set environment variables in Railway dashboard:
# MONGO_URI, JWT_SECRET, JWT_EXPIRE, CLIENT_URL, NODE_ENV=production
```

**Render:**
1. Push backend to GitHub
2. New → Web Service → connect repo
3. Build command: `npm install`
4. Start command: `npm start`
5. Add all env vars in Environment tab

---

### Frontend → Vercel / Netlify

**Vercel:**
```bash
npm install -g vercel
cd frontend
npm run build
vercel
# Set VITE_API_URL=https://your-backend.railway.app/api
```

**Netlify:**
```bash
cd frontend
npm run build
# Upload dist/ folder to Netlify
# Or connect GitHub repo with build command: npm run build, publish dir: dist
```

Create `frontend/public/_redirects` for client-side routing:
```
/*  /index.html  200
```

---

### Production Checklist
- [ ] Change `JWT_SECRET` to a strong random string (32+ chars)
- [ ] Set `NODE_ENV=production`
- [ ] Set `CLIENT_URL` to your deployed frontend URL on the backend
- [ ] Set `VITE_API_URL` to your deployed backend URL on the frontend
- [ ] Enable MongoDB Atlas IP whitelist for production server IP
- [ ] Set up HTTPS (handled automatically by Railway/Render/Vercel)

---

## ✅ Feature Checklist

### Authentication
- [x] Register with username, email, password, bio
- [x] Login with email + password
- [x] JWT tokens with 7-day expiry
- [x] Protected routes (frontend + backend)
- [x] Logout functionality
- [x] Token auto-attach via Axios interceptor
- [x] 401 auto-redirect on token expiry

### Blog Features
- [x] Create blog (title, content, category, image, tags, excerpt)
- [x] Edit blog (author or admin only)
- [x] Delete blog (author or admin only)
- [x] View all blogs with pagination
- [x] View single blog with view counter
- [x] Display author + formatted date
- [x] Auto-generate slug and excerpt

### Extra Features
- [x] Like / unlike blogs
- [x] Like / unlike comments
- [x] Full comment system (add, edit, delete)
- [x] Search blogs by title/content (MongoDB text index)
- [x] Filter by category
- [x] Pagination (9 per page)
- [x] Tag filtering
- [x] Password strength indicator
- [x] Avatar support

### Admin Features
- [x] Admin dashboard with statistics
- [x] View all users
- [x] Ban / unban users
- [x] Delete any blog
- [x] Category breakdown chart
- [x] Recent posts overview

---

## 🎨 Design System

The UI uses a custom editorial aesthetic called **Inkwell** with:
- **Fonts**: Playfair Display (headings) + DM Sans (body) + JetBrains Mono (code/meta)
- **Colors**: Warm ink/parchment palette (`ink-*` scale + cream background)
- **Style**: Sharp corners, editorial typography, subtle animations
- **Components**: Cards, badges, custom buttons, skeleton loaders

---

Built with ❤️ using the MERN stack.
# INKWELL-Blog
