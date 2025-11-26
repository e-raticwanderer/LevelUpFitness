import { v4 as uuidv4 } from 'uuid';

// Seed Data
const SEED_TRAINER_ID = 'trainer-1';

const INITIAL_DATA = {
    users: [
        { id: SEED_TRAINER_ID, role: 'trainer', name: 'Caster Trainer', email: 'Caster@alterfit.com' },
        { 
            id: 'client-1', 
            role: 'client', 
            trainer_id: SEED_TRAINER_ID, 
            name: 'John Doe', 
            status: 'Active', 
            joined: '2023-09-15',
            xp: 1450,
            level: 3,
            rank: 'Centurion'
        },
        { id: 'client-2', role: 'client', trainer_id: SEED_TRAINER_ID, name: 'Jane Smith', status: 'Active', joined: '2023-10-01', xp: 0, level: 1, rank: 'Recruit' },
        { id: 'client-3', role: 'client', trainer_id: SEED_TRAINER_ID, name: 'Mike Johnson', status: 'Inactive', joined: '2023-08-20', xp: 500, level: 2, rank: 'Scout' },
    ],
    // "The Plan" (Templates)
    plans: [
        {
            id: 'plan-1',
            client_id: 'client-1',
            name: 'Hypertrophy Block 1',
            active: true,
            schedule: {
                'Monday': [
                    { id: 'ex-1', name: 'Barbell Squat', sets: 3, reps: '8-10', rpe: 8, notes: 'Focus on depth' },
                    { id: 'ex-2', name: 'Leg Press', sets: 3, reps: '12-15', rpe: 7, notes: '' },
                ],
                'Wednesday': [
                    { id: 'ex-3', name: 'Bench Press', sets: 4, reps: '8-12', rpe: 8, notes: 'Pause at bottom' },
                    { id: 'ex-4', name: 'Incline Dumbbell Press', sets: 3, reps: '10-12', rpe: 7, notes: '' },
                ],
                'Friday': [
                    { id: 'ex-5', name: 'Deadlift', sets: 3, reps: '5', rpe: 9, notes: 'Heavy' },
                    { id: 'ex-6', name: 'Pull Ups', sets: 3, reps: 'AMRAP', rpe: 10, notes: '' },
                ]
            }
        }
    ],
    // "The Logs" (History)
    logs: [
        {
            id: 'log-1',
            client_id: 'client-1',
            date: '2023-10-23', // Last Monday
            day: 'Monday',
            completed: true,
            volume: 12000,
            exercises: [
                { name: 'Barbell Squat', sets: [{ weight: 225, reps: 8, rpe: 8 }, { weight: 225, reps: 8, rpe: 8.5 }, { weight: 225, reps: 8, rpe: 9 }] }
            ]
        }
    ]
};

// Load from localStorage or use Initial Data
const loadDB = () => {
    try {
        const stored = localStorage.getItem('alterfit_db');
        if (stored) {
            const data = JSON.parse(stored);
            // Simple validation: check if users array exists
            if (data && Array.isArray(data.users) && Array.isArray(data.plans)) {
                return data;
            }
        }
    } catch (e) {
        console.error("DB Load Error:", e);
    }

    // Save initial data if empty or invalid
    localStorage.setItem('alterfit_db', JSON.stringify(INITIAL_DATA));
    return INITIAL_DATA;
};

const saveDB = (data) => {
    localStorage.setItem('alterfit_db', JSON.stringify(data));
};

export const db = {
    // --- User & Auth ---
    getTrainerProfile: () => {
        const data = loadDB();
        return data.users.find(u => u.id === SEED_TRAINER_ID);
    },

    getClients: () => {
        const data = loadDB();
        return data.users.filter(u => u.trainer_id === SEED_TRAINER_ID);
    },

    getClient: (id) => {
        const data = loadDB();
        return data.users.find(u => u.id === id);
    },

    // --- Dashboard Stats ---
    getDashboardStats: () => {
        const data = loadDB();
        const clients = data.users.filter(u => u.trainer_id === SEED_TRAINER_ID);
        const clientIds = clients.map(c => c.id);

        // Filter logs for these clients
        const logs = data.logs ? data.logs.filter(l => clientIds.includes(l.client_id)) : [];

        const activeClients = clients.filter(c => c.status === 'Active').length;
        const completedWorkouts = logs.filter(l => l.completed).length;
        const totalVolume = logs.reduce((acc, l) => acc + (l.volume || 0), 0);

        return {
            activeClients,
            completedWorkouts,
            totalVolume,
            recentActivity: logs.slice(0, 5).map(l => {
                const client = clients.find(c => c.id === l.client_id);
                return {
                    id: l.id,
                    clientId: l.client_id,
                    clientName: client?.name || 'Unknown',
                    action: l.completed ? 'completed a workout' : 'logged a workout',
                    time: new Date(l.date).toLocaleDateString()
                };
            })
        };
    },

    // --- Plans & Builder ---
    getWeeklyPlan: (clientId) => {
        const data = loadDB();
        return data.plans.find(p => p.client_id === clientId && p.active) || null;
    },

    saveWeeklyPlan: (plan) => {
        const data = loadDB();
        const existingIndex = data.plans.findIndex(p => p.id === plan.id);

        if (existingIndex >= 0) {
            data.plans[existingIndex] = plan;
        } else {
            plan.id = uuidv4();
            data.plans.push(plan);
        }
        saveDB(data);
        return plan;
    },

    // --- Logs & Execution ---
    getWorkoutLog: (clientId, date) => {
        const data = loadDB();
        // Simple date matching YYYY-MM-DD
        return data.logs.find(l => l.client_id === clientId && l.date === date);
    },

    saveWorkoutLog: (log) => {
        const data = loadDB();
        const existingIndex = data.logs.findIndex(l => l.id === log.id);

        if (existingIndex >= 0) {
            data.logs[existingIndex] = log;
        } else {
            if (!log.id) log.id = uuidv4();
            data.logs.push(log);
        }
        saveDB(data);
        return log;
    },

    getClientHistory: (clientId) => {
        const data = loadDB();
        return data.logs
            .filter(l => l.client_id === clientId)
            .sort((a, b) => new Date(b.date) - new Date(a.date));
    },

    // --- Workouts ---
    getWorkouts: () => {
        // For MVP, we'll return a static list if not in DB, or we could seed it.
        // Let's return the static list we had in WorkoutLibrary for now, but centralized here.
        return [
            {
                id: 1,
                title: 'Barbell Back Squat',
                category: 'Legs',
                difficulty: 'Intermediate',
                videoUrl: 'https://www.youtube.com/watch?v=ultWZbGWL5c',
                thumbnail: 'https://img.youtube.com/vi/ultWZbGWL5c/maxresdefault.jpg'
            },
            {
                id: 2,
                title: 'Bench Press',
                category: 'Chest',
                difficulty: 'Intermediate',
                videoUrl: 'https://www.youtube.com/watch?v=rT7DgCr-3pg',
                thumbnail: 'https://img.youtube.com/vi/rT7DgCr-3pg/maxresdefault.jpg'
            },
            {
                id: 3,
                title: 'Deadlift',
                category: 'Back',
                difficulty: 'Advanced',
                videoUrl: 'https://www.youtube.com/watch?v=op9kVnSso6Q',
                thumbnail: 'https://img.youtube.com/vi/op9kVnSso6Q/maxresdefault.jpg'
            },
            {
                id: 4,
                title: 'Overhead Press',
                category: 'Shoulders',
                difficulty: 'Intermediate',
                videoUrl: 'https://www.youtube.com/watch?v=2yjwXTZQDDI',
                thumbnail: 'https://img.youtube.com/vi/2yjwXTZQDDI/maxresdefault.jpg'
            },
            {
                id: 5,
                title: 'Pull Up',
                category: 'Back',
                difficulty: 'Beginner',
                videoUrl: 'https://www.youtube.com/watch?v=eGo4IYlbE5g',
                thumbnail: 'https://img.youtube.com/vi/eGo4IYlbE5g/maxresdefault.jpg'
            },
            {
                id: 6,
                title: 'Dumbbell Lunge',
                category: 'Legs',
                difficulty: 'Beginner',
                videoUrl: 'https://www.youtube.com/watch?v=D7KaRcUTQeE',
                thumbnail: 'https://img.youtube.com/vi/D7KaRcUTQeE/maxresdefault.jpg'
            }
        ];
    },

    // --- Gamification ---
    updateUser: (id, updates) => {
        const data = loadDB();
        const index = data.users.findIndex(u => u.id === id);
        if (index !== -1) {
            data.users[index] = { ...data.users[index], ...updates };
            saveDB(data);
            return data.users[index];
        }
        return null;
    }
};

export const RANKS = [
    { name: 'Cadet', minXp: 0, icon: 'rank-cadet' },           // BSG
    { name: 'Trooper', minXp: 500, icon: 'rank-trooper' },      // Star Wars
    { name: 'Centurion', minXp: 1000, icon: 'rank-centurion' }, // BSG
    { name: 'Fedaykin', minXp: 2500, icon: 'rank-fedaykin' },   // Dune
    { name: 'Master', minXp: 5000, icon: 'rank-master' },       // Star Wars
    { name: 'Kwisatz Haderach', minXp: 10000, icon: 'rank-kwisatz' } // Dune
];
