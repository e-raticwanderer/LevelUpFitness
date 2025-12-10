# Backend Integration Setup Guide

## Overview
LevelUp Fitness now has a complete backend stack with MongoDB, Express, and JWT authentication. This document covers setup and deployment.

---

## Backend Architecture

### Structure
```
backend/
├── server.js              # Express server entry point
├── package.json           # Backend dependencies
├── .env.example           # Environment template
├── config/
│   └── db.js              # MongoDB connection
├── middleware/
│   └── auth.js            # JWT authentication & role-based access
├── models/
│   ├── User.js            # User schema (trainer/client)
│   ├── Plan.js            # Training plan schema
│   └── Log.js             # Workout log schema
└── routes/
    ├── auth.js            # Authentication (register, login)
    ├── users.js           # User management
    ├── plans.js           # Plan CRUD operations
    └── logs.js            # Workout log operations
```

### Database Models

#### User
- `name` - User's name
- `email` - Unique email (login credential)
- `password` - Hashed with bcryptjs
- `role` - 'trainer' or 'client'
- `status` - 'Active' or 'Inactive'
- `trainer_id` - Reference to trainer (for clients)
- `xp`, `level`, `rank` - Gamification stats
- `joined` - Account creation date
- `timestamps` - Auto-managed createdAt/updatedAt

#### Plan
- `client_id` - Reference to client
- `trainer_id` - Reference to trainer who created it
- `name` - Plan name (e.g., "Hypertrophy Block 1")
- `active` - Is this the current plan?
- `schedule` - Map of day → exercises
- `timestamps` - Auto-managed createdAt/updatedAt

#### Log
- `client_id` - Reference to client
- `date` - Workout date
- `day` - Day name (Monday, etc.)
- `completed` - Was it completed?
- `volume` - Total weight lifted
- `exercises` - Array of exercise details with sets/reps/RPE
- `notes` - Additional notes
- `timestamps` - Auto-managed createdAt/updatedAt

---

## Installation & Setup

### Prerequisites
- Node.js 16+ (LTS recommended)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### 1. Backend Setup

```bash
cd backend
npm install
```

### 2. Configure Environment Variables

Create `backend/.env` (copy from `.env.example`):

```env
# Database
MONGODB_URI=mongodb://localhost:27017/levelupfitness
# For MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/levelupfitness

# Server
PORT=5000
NODE_ENV=development

# JWT
JWT_SECRET=your_super_secret_key_change_in_production

# ExerciseDB (optional)
EXERCISEDB_KEY=your_key_here
EXERCISEDB_HOST=exercisedb-api1.p.rapidapi.com

# Client URL (for CORS)
CLIENT_URL=http://localhost:5502
```

### 3. Start Backend

**Development:**
```bash
cd backend
npm run dev        # Uses nodemon for auto-reload
```

**Production:**
```bash
cd backend
npm start
```

Backend runs on `http://localhost:5000`

### 4. Frontend Configuration

Create `frontend.env.local` or update `.env.local`:

```env
VITE_API_URL=http://localhost:5000/api
VITE_EXERCISEDB_BASE=https://exercisedb-api1.p.rapidapi.com
VITE_EXERCISEDB_KEY=your_key_here
VITE_EXERCISEDB_HOST=exercisedb-api1.p.rapidapi.com
```

### 5. Start Frontend

```bash
npm run dev        # Runs on http://localhost:5502
```

---

## API Endpoints

### Authentication
- `POST /api/auth/register` - Create new account
  - Body: `{ name, email, password, role }`
  - Returns: `{ user, token }`
- `POST /api/auth/login` - Login
  - Body: `{ email, password }`
  - Returns: `{ user, token }`
- `GET /api/auth/me` - Get current user (requires token)
  - Returns: `{ id, email, role, ... }`

### Users
- `GET /api/users/clients` - Get all clients (trainer only)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `GET /api/users/trainer/:id` - Get trainer profile

### Plans
- `GET /api/plans/client/:clientId` - Get active plan
- `GET /api/plans/client-all/:clientId` - Get all plans for client
- `POST /api/plans` - Create plan (trainer only)
- `PUT /api/plans/:id` - Update plan (trainer only)
- `DELETE /api/plans/:id` - Delete plan (trainer only)

### Logs
- `GET /api/logs/client/:clientId` - Get client's workout logs
- `GET /api/logs/:id` - Get specific log
- `POST /api/logs` - Create workout log
- `PUT /api/logs/:id` - Update log
- `DELETE /api/logs/:id` - Delete log

---

## Frontend Integration

### Using the API Client

```jsx
import { apiClient } from '../services/apiClient';

// Login
const { user, token } = await apiClient.login(email, password);

// Fetch client list (trainer)
const clients = await apiClient.getClients();

// Get client's workouts
const logs = await apiClient.getClientLogs(clientId);

// Create a workout log
await apiClient.createLog(clientId, new Date(), exercises, true, volume);

// Logout
apiClient.logout();
```

### Authentication Flow
1. User logs in via `apiClient.login()`
2. Token is stored in `localStorage`
3. All subsequent requests include `Authorization: Bearer <token>`
4. Token is automatically retrieved for protected routes

---

## Database Setup

### Local MongoDB
```bash
# Install MongoDB Community Edition
# https://docs.mongodb.com/manual/installation/

# Start MongoDB
mongod

# Connection string:
mongodb://localhost:27017/levelupfitness
```

### MongoDB Atlas (Cloud)
1. Create free account at https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Add database user
4. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/levelupfitness`

---

## Deployment

### Backend (Heroku Example)
```bash
# Install Heroku CLI
# Login
heroku login

# Create app
heroku create levelupfitness-backend

# Set environment variables
heroku config:set JWT_SECRET=your_secret
heroku config:set MONGODB_URI=your_atlas_uri
heroku config:set CLIENT_URL=your_frontend_url

# Deploy
git push heroku main
```

### Frontend (Vercel Example)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard:
VITE_API_URL=https://levelupfitness-backend.herokuapp.com/api
```

---

## Security Checklist

- [ ] Change `JWT_SECRET` to a strong random string
- [ ] Enable HTTPS in production
- [ ] Use environment variables for sensitive data
- [ ] Implement rate limiting
- [ ] Validate all inputs on backend
- [ ] Add HTTPS to MongoDB URI
- [ ] Use secure password hashing (bcryptjs included)
- [ ] Test authentication on all routes
- [ ] Add request logging
- [ ] Implement CORS properly

---

## Troubleshooting

### Backend won't connect to MongoDB
- Check MongoDB is running: `mongod`
- Verify connection string in `.env`
- Check firewall/network access

### CORS errors on frontend
- Verify `CLIENT_URL` in backend `.env` matches frontend URL
- Restart backend after changing CORS settings

### Token errors
- Ensure `JWT_SECRET` is the same in `.env`
- Check token is sent in `Authorization` header
- Tokens expire after 7 days by default

### Port already in use
- Backend: `lsof -i :5000` then kill the process
- Frontend: `lsof -i :5502` then kill the process

---

## Next Steps

1. Set up MongoDB (local or Atlas)
2. Copy `.env.example` to `.env` in both directories
3. Install dependencies: `npm install` in root and `backend/`
4. Start backend: `cd backend && npm run dev`
5. Start frontend: `npm run dev`
6. Test login at `http://localhost:5502/login`
7. Create trainer account and manage clients

---

For questions or issues, refer to:
- MongoDB: https://docs.mongodb.com
- Express: https://expressjs.com
- JWT: https://jwt.io
- Mongoose: https://mongoosejs.com
