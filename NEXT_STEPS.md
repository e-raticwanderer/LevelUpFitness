# Next Steps - LevelUp Fitness 🚀

Your backend infrastructure is complete and ready to deploy. Follow these steps to get the system fully operational.

---

## Phase 1: MongoDB Setup (Choose One)

### Option A: Local MongoDB (5 minutes)
```powershell
# 1. Download from: https://www.mongodb.com/try/download/community
# 2. Run installer and follow setup wizard
# 3. Start MongoDB service (Windows):
net start MongoDB

# 4. Verify it's running:
mongosh  # Should connect to local database

# 5. Create database
use levelupfitness
db.createCollection("users")
```

### Option B: MongoDB Atlas (Recommended - 5 minutes)
1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up for free account
3. Create a cluster (free tier available)
4. Create a database user (save credentials)
5. Get connection string (click "Connect")
6. Copy connection string format

---

## Phase 2: Environment Variables (5 minutes)

### Create `backend/.env`
```powershell
# Navigate to backend
cd backend

# Create .env file
New-Item -Path ".env" -ItemType File

# Add these variables (replace with your values):
```

**Content for `backend/.env`**:
```env
# Database
MONGODB_URI=mongodb://localhost:27017/levelupfitness
# OR if using MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/levelupfitness

# Server
PORT=5000
NODE_ENV=development

# JWT Secret (change to something random!)
JWT_SECRET=my_super_secret_jwt_key_change_in_production_123456789

# ExerciseDB (already configured)
EXERCISEDB_KEY=a49291bdbbmsh969993937f08c84p1a7b7fjsnb2455bcbd8ac
EXERCISEDB_HOST=exercisedb-api1.p.rapidapi.com

# Client URL (for CORS)
CLIENT_URL=http://localhost:5502
```

### Create `frontend/.env.local`
```powershell
# Navigate to root
cd ..

# Create .env.local
New-Item -Path ".env.local" -ItemType File
```

**Content for `frontend/.env.local`**:
```env
VITE_API_URL=http://localhost:5000/api
VITE_EXERCISEDB_BASE=https://exercisedb-api1.p.rapidapi.com
VITE_EXERCISEDB_KEY=a49291bdbbmsh969993937f08c84p1a7b7fjsnb2455bcbd8ac
VITE_EXERCISEDB_HOST=exercisedb-api1.p.rapidapi.com
```

---

## Phase 3: Install Backend Dependencies (2 minutes)

```powershell
npm run backend:install
```

This will install:
- express (REST API framework)
- mongoose (MongoDB ODM)
- jsonwebtoken (JWT authentication)
- bcryptjs (password hashing)
- cors (cross-origin support)
- dotenv (environment variables)
- nodemon (development auto-reload)

---

## Phase 4: Start the Application (5 minutes)

### Terminal 1 - Frontend
```powershell
npm run frontend:dev
```

Output should show:
```
VITE v7.2.4 ready in 500 ms
➜ Local:   http://localhost:5502/
```

### Terminal 2 - Backend
```powershell
npm run backend:dev
```

Output should show:
```
Server running on port 5000
MongoDB connected: levelupfitness
```

### Terminal 3 - Verify Health (Optional)
```powershell
# Check backend is responding
Invoke-WebRequest -Uri "http://localhost:5000/api/health"
```

---

## Phase 5: Test Authentication (5 minutes)

### In Browser (http://localhost:5502)

1. **Register New Account**
   - Click "Sign Up"
   - Email: `trainer@example.com`
   - Password: `password123`
   - Role: Choose "Trainer" or "Client"
   - Click "Register"

2. **Verify Registration**
   - Should redirect to dashboard
   - Check browser DevTools → Application → LocalStorage
   - Should see `auth_token` saved

3. **Create Another Account (Client)**
   - Logout (if needed)
   - Register: `client@example.com` as Client
   - This creates a test client for trainer to manage

4. **Login as Trainer**
   - Login: `trainer@example.com` / `password123`
   - Should see Dashboard with trainer menu
   - Click "Trainer Dashboard" to manage clients

---

## Phase 6: Verify Database Persistence (10 minutes)

### Check MongoDB Data

**Local MongoDB**:
```powershell
mongosh
use levelupfitness
db.users.find()        # Should see registered users
db.plans.find()        # Should be empty until trainer creates plan
db.logs.find()         # Should be empty until client logs workout
```

**MongoDB Atlas**:
Use MongoDB Compass or Atlas Dashboard to view data

---

## Phase 7: Migrate Components to Backend (Optional but Recommended)

Your app currently works with both localStorage (fallback) and backend. To fully migrate:

### Files to Update:
1. `src/context/AuthContext.jsx`
   - Replace localStorage login with `apiClient.login()`
   - Replace localStorage register with `apiClient.register()`

2. `src/pages/TrainerDashboard.jsx`
   - Already set up to use `apiClient.getClients()`

3. `src/pages/ClientProfile.jsx`
   - Already set up for backend API

4. `src/pages/Dashboard.jsx`
   - Ready to use real user data from `/api/users/me`

---

## Phase 8: Deploy (Optional)

### Backend to Heroku
```powershell
# Install Heroku CLI first
npm install -g heroku

# Login
heroku login

# Create app
heroku create your-app-name-backend

# Set environment variables
heroku config:set MONGODB_URI=your_atlas_uri
heroku config:set JWT_SECRET=your_random_secret
heroku config:set CLIENT_URL=your_frontend_url

# Deploy
git push heroku main
```

### Frontend to Vercel
```powershell
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Set VITE_API_URL to your Heroku backend URL
```

---

## Troubleshooting

### MongoDB Connection Failed
```powershell
# Check if MongoDB is running
Get-Service MongoDB    # Windows
# Or restart:
net start MongoDB
```

### Port Already in Use
```powershell
# Find process on port 5000
Get-NetTCPConnection -LocalPort 5000

# Kill it
Stop-Process -Id <PID> -Force
```

### CORS Errors
- Verify `CLIENT_URL` in `backend/.env` matches your frontend URL
- Restart backend server
- Check browser console for exact error message

### Token Errors
- Ensure `JWT_SECRET` is set in `.env`
- Try logging out and back in
- Check localStorage for `auth_token`

### Blank Dashboard
- Check browser console for errors
- Verify MongoDB is running
- Ensure backend is running on port 5000
- Restart frontend dev server

---

## Quick Reference Commands

```powershell
# Start everything
npm run frontend:dev    # Terminal 1
npm run backend:dev     # Terminal 2

# Check health
curl http://localhost:5000/api/health

# Reinstall dependencies
npm install
npm run backend:install

# Access URLs
# Frontend:  http://localhost:5502
# Backend:   http://localhost:5000
# MongoDB:   mongodb://localhost:27017 (local)

# View logs
mongosh
use levelupfitness
db.users.find().pretty()
db.plans.find().pretty()
db.logs.find().pretty()
```

---

## What's Next After Setup?

1. ✅ Create trainer and client accounts
2. ✅ Trainer creates training plan for client
3. ✅ Client logs workouts
4. ✅ View client progress in Trainer Dashboard
5. ✅ Export client data as CSV/JSON
6. ✅ Deploy to production

---

## Key Files to Know

- `src/services/apiClient.js` - Frontend API client (all backend calls)
- `backend/server.js` - Express server entry point
- `backend/models/` - Database schemas (User, Plan, Log)
- `backend/routes/` - API routes (auth, users, plans, logs)
- `.env` files - Configuration (never commit!)

---

## Support Resources

- **MongoDB Setup**: https://docs.mongodb.com/manual/installation/
- **Express Docs**: https://expressjs.com/
- **Mongoose Docs**: https://mongoosejs.com/
- **JWT Explanation**: https://jwt.io/introduction
- **Vercel Deploy**: https://vercel.com/docs/deployments/overview
- **Heroku Deploy**: https://devcenter.heroku.com/articles/git

---

**Status**: Ready to Deploy 🚀  
**Last Updated**: November 30, 2025  
**Version**: 1.0.0
