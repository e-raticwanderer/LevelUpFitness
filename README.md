# LevelUp Fitness 🎮

A gamified fitness training platform with trainer management, client tracking, and integration with ExerciseDB. Built with React, Express, MongoDB, and Tailwind CSS.

## Features ✨

### Client Features
- **Gamification System**: Earn XP, level up, and unlock ranks
- **Workout Library (Armory)**: Browse 1000+ exercises from ExerciseDB
- **Active Plans**: Follow trainer-assigned weekly training programs
- **Progress Tracking**: Monitor workouts, volume, and performance
- **Personal Dashboard**: Real-time stats and achievement tracking

### Trainer Features
- **Client Management**: Search, filter, sort, and manage all clients
- **Protocol Editor**: Create and customize training plans
- **Data Export**: Export client data as CSV or JSON
- **Client Profiles**: Detailed stats, programs, and mission history
- **Dashboard**: System load charts, accuracy metrics, recent activity

### Technical Features
- ✅ **Backend**: Express.js REST API with MongoDB
- ✅ **Authentication**: JWT-based with role-based access control
- ✅ **API Integration**: ExerciseDB for exercise data
- ✅ **Data Persistence**: Full backend database integration
- ✅ **Security**: Bcryptjs password hashing, JWT tokens
- ✅ **Responsive Design**: Mobile, tablet, and desktop support

---

## Quick Start

### Prerequisites
- Node.js 16+ (LTS)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### 1. Install Dependencies
```bash
npm install
npm run backend:install
```

### 2. Setup Environment Variables

**Backend** (`backend/.env`):
```env
MONGODB_URI=mongodb://localhost:27017/levelupfitness
PORT=5000
NODE_ENV=development
JWT_SECRET=your_super_secret_key
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

### 3. Start the App

**Frontend only**:
```bash
npm run frontend:dev
```

**Backend only**:
```bash
npm run backend:dev
```

**Both (requires concurrently)**:
```bash
# Terminal 1
npm run frontend:dev

# Terminal 2
npm run backend:dev
```

### 4. Access
- **Frontend**: http://localhost:5502
- **Backend**: http://localhost:5000
- **API Health Check**: http://localhost:5000/api/health

---

## Architecture

### Frontend Stack
- **React 19** - UI framework
- **React Router 7** - Navigation
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Recharts** - Data visualization
- **Lucide React** - Icons

### Backend Stack
- **Express.js** - REST API framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin requests

### Database Schema
```
Users
  ├── name, email, password (hashed)
  ├── role (trainer/client)
  ├── status (Active/Inactive)
  ├── xp, level, rank (gamification)
  └── trainer_id (for clients)

Plans
  ├── client_id, trainer_id
  ├── name
  ├── schedule (day → exercises)
  └── active (boolean)

Logs
  ├── client_id
  ├── date, day, completed
  ├── volume, exercises (sets/reps/RPE)
  └── notes
```

---

## API Endpoints

### Authentication
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users/clients` - Get all clients (trainer)
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update user
- `GET /api/users/trainer/:id` - Get trainer profile

### Plans
- `GET /api/plans/client/:clientId` - Get active plan
- `GET /api/plans/client-all/:clientId` - Get all plans
- `POST /api/plans` - Create plan (trainer)
- `PUT /api/plans/:id` - Update plan (trainer)
- `DELETE /api/plans/:id` - Delete plan (trainer)

### Logs
- `GET /api/logs/client/:clientId` - Get workout logs
- `GET /api/logs/:id` - Get specific log
- `POST /api/logs` - Create log
- `PUT /api/logs/:id` - Update log
- `DELETE /api/logs/:id` - Delete log

---

## File Structure

```
LevelUpFitness/
├── src/
│   ├── components/          # Reusable components
│   ├── context/             # Auth, Gamification contexts
│   ├── hooks/               # useExercises, etc.
│   ├── pages/               # Dashboard, Armory, etc.
│   ├── services/
│   │   ├── apiClient.js     # Backend API client
│   │   ├── db.js            # Local data (fallback)
│   │   ├── exerciseApi.js   # ExerciseDB client
│   │   └── ...
│   └── App.jsx              # Main routing
├── backend/
│   ├── server.js            # Express entry point
│   ├── config/              # Database config
│   ├── models/              # Mongoose schemas
│   ├── routes/              # API routes
│   └── middleware/          # Auth middleware
├── package.json             # Root dependencies
└── ...
```

---

## Development

### Running Tests
```bash
npm run lint              # ESLint
npm run build            # Build production
npm run preview          # Preview build
```

### Backend Development
```bash
cd backend
npm run dev              # Start with nodemon (auto-reload)
npm start               # Start production
```

### Frontend Development
```bash
npm run frontend:dev    # Start Vite dev server
```

---

## Deployment

### Backend (Heroku)
```bash
heroku create levelupfitness-backend
heroku config:set JWT_SECRET=your_secret
heroku config:set MONGODB_URI=your_atlas_uri
git push heroku main
```

### Frontend (Vercel)
```bash
npm install -g vercel
vercel
# Set VITE_API_URL to your backend URL
```

---

## Authentication Flow

1. User registers/logs in via `apiClient.login()` or `apiClient.register()`
2. Backend returns `{ user, token }`
3. Token stored in `localStorage`
4. All API requests include `Authorization: Bearer <token>` header
5. Backend validates token and returns data
6. On logout, token is cleared from localStorage

---

## Database Setup

### Local MongoDB
```bash
# Install MongoDB Community
# https://docs.mongodb.com/manual/installation/

# Start MongoDB
mongod
```

### MongoDB Atlas (Cloud - Recommended)
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create cluster
3. Add database user
4. Get connection string
5. Update `MONGODB_URI` in `backend/.env`

---

## Security Notes

⚠️ **Before Production:**
- [ ] Change `JWT_SECRET` to a strong random string
- [ ] Use HTTPS everywhere
- [ ] Enable MongoDB authentication
- [ ] Set proper CORS origins
- [ ] Add rate limiting
- [ ] Implement request logging
- [ ] Use environment variables for all secrets
- [ ] Test all authentication flows

---

## Troubleshooting

### MongoDB Connection Failed
- Ensure MongoDB is running: `mongod`
- Check `MONGODB_URI` is correct
- Verify network access (if Atlas)

### CORS Errors
- Check `CLIENT_URL` in `backend/.env`
- Restart backend after changes
- Verify frontend URL matches

### Token Errors
- Ensure `JWT_SECRET` is consistent
- Check token is in Authorization header
- Tokens expire after 7 days

### Port Already in Use
```bash
# Find process on port (Linux/Mac)
lsof -i :5000        # Backend
lsof -i :5502        # Frontend

# Kill process
kill -9 <PID>
```

---

## Documentation

- **Backend Setup**: See `BACKEND_SETUP.md`
- **Quick Start**: See `BACKEND_QUICK_START.md`
- **Implementation Summary**: See `IMPLEMENTATION_SUMMARY.md`
- **ExerciseDB Setup**: See `README-ExerciseDB.md`

---

## Status

- ✅ Frontend: Complete with gamification, routing, UI
- ✅ Backend: Express API with MongoDB integration
- ✅ Database: User, Plan, Log schemas
- ✅ Authentication: JWT with role-based access
- ✅ API Client: Ready for integration
- 🚀 Ready for deployment

---

## Contributing

1. Clone the repo
2. Create a branch: `git checkout -b feature/your-feature`
3. Make changes and test
4. Commit: `git commit -m "Add your feature"`
5. Push: `git push origin feature/your-feature`
6. Create Pull Request

---

## License

MIT - See LICENSE file

---

## Author

Created by e-raticwanderer

---

## Support

For issues or questions:
1. Check troubleshooting section above
2. Review backend setup guide
3. Check console for error messages
4. Verify environment variables
5. Restart both servers

---

**Version**: 1.0.0  
**Last Updated**: November 30, 2025  
**Status**: Production Ready 🚀
