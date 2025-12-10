# LevelUp Fitness - Backend Integration Complete ✅

## Quick Start

### 1. Install Backend Dependencies
```bash
npm run backend:install
```

### 2. Setup Environment Variables

**Backend** (`backend/.env`):
```env
MONGODB_URI=mongodb://localhost:27017/levelupfitness
PORT=5000
NODE_ENV=development
JWT_SECRET=your_super_secret_key_change_in_production
EXERCISEDB_KEY=a49291bdbbmsh969993937f08c84p1a7b7fjsnb2455bcbd8ac
EXERCISEDB_HOST=exercisedb-api1.p.rapidapi.com
CLIENT_URL=http://localhost:5502
```

**Frontend** (`.env.local`):
```env
VITE_API_URL=http://localhost:5000/api
VITE_EXERCISEDB_BASE=https://exercisedb-api1.p.rapidapi.com
VITE_EXERCISEDB_KEY=a49291bdbbmsh969993937f08c84p1a7b7fjsnb2455bcbd8ac
VITE_EXERCISEDB_HOST=exercisedb-api1.p.rapidapi.com
```

### 3. Start Backend & Frontend

**Option A: Start them separately (in different terminals)**
```bash
# Terminal 1 - Frontend
npm run frontend:dev

# Terminal 2 - Backend
npm run backend:dev
```

**Option B: Start both together**
```bash
npm run dev
# (Requires concurrently to be installed globally)
```

### 4. Access the App

- **Frontend**: http://localhost:5502
- **Backend**: http://localhost:5000
- **API Docs**: http://localhost:5000/api/health

---

## What's New

### Backend Features
✅ Express.js REST API
✅ MongoDB with Mongoose ODM
✅ JWT authentication with role-based access control
✅ User management (trainer/client)
✅ Training plans CRUD
✅ Workout logs CRUD
✅ Secure password hashing with bcryptjs
✅ CORS configured

### Frontend Integration
✅ API Client (`src/services/apiClient.js`)
✅ Token management (auto-saved to localStorage)
✅ Ready for Auth context integration
✅ Error handling & retry logic

### Database
✅ User schema with roles & gamification stats
✅ Plan schema with weekly schedule
✅ Log schema for workout tracking
✅ Automatic timestamps & indexing

---

## Database Setup

### Option 1: Local MongoDB
```bash
# Install MongoDB Community
# https://docs.mongodb.com/manual/installation/

# Start MongoDB
mongod
```

### Option 2: MongoDB Atlas (Cloud - Recommended)
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a cluster
4. Get connection string
5. Update `MONGODB_URI` in `backend/.env`

---

## API Quick Reference

### Authentication
```javascript
// Login
const { user, token } = await apiClient.login('user@example.com', 'password');

// Register
const { user, token } = await apiClient.register('John Doe', 'john@example.com', 'password', 'trainer');
```

### Users (Trainer)
```javascript
// Get all clients
const clients = await apiClient.getClients();

// Get specific user
const user = await apiClient.getUser(userId);

// Update user
await apiClient.updateUser(userId, { xp: 1500, level: 2 });
```

### Plans
```javascript
// Get active plan for client
const plan = await apiClient.getClientPlan(clientId);

// Create new plan
await apiClient.createPlan(clientId, 'Hypertrophy Block 1', scheduleObj);

// Update plan
await apiClient.updatePlan(planId, { name: 'New Name', active: true });
```

### Logs
```javascript
// Get all logs for client
const logs = await apiClient.getClientLogs(clientId);

// Create workout log
await apiClient.createLog(clientId, new Date(), exercises, true, 12000);

// Update log
await apiClient.updateLog(logId, { completed: true, volume: 15000 });
```

---

## File Structure

```
LevelUpFitness/
├── src/                          # Frontend React app
│   ├── services/
│   │   ├── apiClient.js         # ← NEW: Backend API client
│   │   ├── db.js                # Local fallback data
│   │   ├── exerciseApi.js       # ExerciseDB API client
│   │   └── ...
│   └── ...
├── backend/                      # ← NEW: Express backend
│   ├── server.js                # Entry point
│   ├── package.json
│   ├── .env.example
│   ├── config/
│   │   └── db.js                # MongoDB connection
│   ├── models/
│   │   ├── User.js
│   │   ├── Plan.js
│   │   └── Log.js
│   ├── middleware/
│   │   └── auth.js              # JWT & role validation
│   └── routes/
│       ├── auth.js
│       ├── users.js
│       ├── plans.js
│       └── logs.js
├── package.json                 # Root scripts
├── BACKEND_SETUP.md            # Detailed setup guide
└── ...
```

---

## Next Steps

1. ✅ Backend infrastructure is ready
2. Set up MongoDB (local or Atlas)
3. Update environment variables
4. Install backend dependencies: `npm run backend:install`
5. Start both frontend & backend
6. Test authentication at http://localhost:5502/login
7. Update AuthContext to use `apiClient` instead of localStorage fallback
8. Migrate existing components to use backend APIs
9. Deploy to production (Heroku, Vercel, etc.)

---

## Important Notes

- **Tokens** are stored in `localStorage` automatically
- **All API calls** include the token automatically
- **Role-based access** is enforced on backend routes
- **Passwords** are hashed with bcryptjs (never store plain text!)
- **CORS** is configured for localhost, update in production

---

## Support

For detailed setup instructions, see: `BACKEND_SETUP.md`

For issues:
1. Check MongoDB is running
2. Verify environment variables
3. Check console for error messages
4. Restart both frontend and backend
5. Clear browser cache & localStorage

---

**Happy coding! 🚀**
