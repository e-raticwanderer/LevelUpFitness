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


// --- User & Auth ---
export function getTrainerProfile() {
    const data = loadDB();
    return data.users.find(u => u.id === SEED_TRAINER_ID);
}

export function getClients() {
    const data = loadDB();
    return data.users.filter(u => u.trainer_id === SEED_TRAINER_ID);
}

export function getClient(id) {
    const data = loadDB();
    return data.users.find(u => u.id === id);
}

// --- Dashboard Stats ---
export function getDashboardStats() {
    const data = loadDB();
    const clients = data.users.filter(u => u.trainer_id === SEED_TRAINER_ID);
    const clientIds = clients.map(c => c.id);
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
}

// --- Plans & Builder ---
export function getWeeklyPlan(clientId) {
    const data = loadDB();
    return data.plans.find(p => p.client_id === clientId && p.active) || null;
}

export function saveWeeklyPlan(plan) {
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
}

// --- Logs & Execution ---
export function getWorkoutLog(clientId, date) {
    const data = loadDB();
    return data.logs.find(l => l.client_id === clientId && l.date === date);
}

export function saveWorkoutLog(log) {
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
}

export function getClientHistory(clientId) {
    const data = loadDB();
    return data.logs
        .filter(l => l.client_id === clientId)
        .sort((a, b) => new Date(b.date) - new Date(a.date));
}

// --- Workouts ---
export function getWorkouts() {
    return [
        // CHEST
        {
            id: 1,
            title: 'Barbell Bench Press',
            category: 'Chest',
            difficulty: 'Intermediate',
            videoUrl: 'https://www.youtube.com/watch?v=rT7DgCr-3pg',
            thumbnail: 'https://img.youtube.com/vi/rT7DgCr-3pg/maxresdefault.jpg'
        },
        {
            id: 2,
            title: 'Incline Dumbbell Press',
            category: 'Chest',
            difficulty: 'Intermediate',
            videoUrl: 'https://www.youtube.com/watch?v=8iPEnn-ltC8',
            thumbnail: 'https://img.youtube.com/vi/8iPEnn-ltC8/maxresdefault.jpg'
        },
        {
            id: 3,
            title: 'Cable Flye',
            category: 'Chest',
            difficulty: 'Beginner',
            videoUrl: 'https://www.youtube.com/watch?v=Jle0bVo5Dn0',
            thumbnail: 'https://img.youtube.com/vi/Jle0bVo5Dn0/maxresdefault.jpg'
        },
        {
            id: 4,
            title: 'Dips',
            category: 'Chest',
            difficulty: 'Advanced',
            videoUrl: 'https://www.youtube.com/watch?v=KF-UwJrdFdY',
            thumbnail: 'https://img.youtube.com/vi/KF-UwJrdFdY/maxresdefault.jpg'
        },
        
        // BACK
        {
            id: 5,
            title: 'Deadlift',
            category: 'Back',
            difficulty: 'Advanced',
            videoUrl: 'https://www.youtube.com/watch?v=op9kVnSso6Q',
            thumbnail: 'https://img.youtube.com/vi/op9kVnSso6Q/maxresdefault.jpg'
        },
        {
            id: 6,
            title: 'Pull Up',
            category: 'Back',
            difficulty: 'Beginner',
            videoUrl: 'https://www.youtube.com/watch?v=eGo4IYlbE5g',
            thumbnail: 'https://img.youtube.com/vi/eGo4IYlbE5g/maxresdefault.jpg'
        },
        {
            id: 7,
            title: 'Barbell Row',
            category: 'Back',
            difficulty: 'Intermediate',
            videoUrl: 'https://www.youtube.com/watch?v=p2OPXmnXnqA',
            thumbnail: 'https://img.youtube.com/vi/p2OPXmnXnqA/maxresdefault.jpg'
        },
        {
            id: 8,
            title: 'Lat Pulldown',
            category: 'Back',
            difficulty: 'Beginner',
            videoUrl: 'https://www.youtube.com/watch?v=Yw6W6CKXz-8',
            thumbnail: 'https://img.youtube.com/vi/Yw6W6CKXz-8/maxresdefault.jpg'
        },
        {
            id: 9,
            title: 'Single Arm Dumbbell Row',
            category: 'Back',
            difficulty: 'Intermediate',
            videoUrl: 'https://www.youtube.com/watch?v=roCP6wYEYX0',
            thumbnail: 'https://img.youtube.com/vi/roCP6wYEYX0/maxresdefault.jpg'
        },
        
        // LEGS
        {
            id: 10,
            title: 'Barbell Back Squat',
            category: 'Legs',
            difficulty: 'Intermediate',
            videoUrl: 'https://www.youtube.com/watch?v=ultWZbGWL5c',
            thumbnail: 'https://img.youtube.com/vi/ultWZbGWL5c/maxresdefault.jpg'
        },
        {
            id: 11,
            title: 'Leg Press',
            category: 'Legs',
            difficulty: 'Beginner',
            videoUrl: 'https://www.youtube.com/watch?v=IZxyjW7MPOU',
            thumbnail: 'https://img.youtube.com/vi/IZxyjW7MPOU/maxresdefault.jpg'
        },
        {
            id: 12,
            title: 'Leg Curl',
            category: 'Legs',
            difficulty: 'Beginner',
            videoUrl: 'https://www.youtube.com/watch?v=1Ip2w_-c2B0',
            thumbnail: 'https://img.youtube.com/vi/1Ip2w_-c2B0/maxresdefault.jpg'
        },
        {
            id: 13,
            title: 'Dumbbell Lunge',
            category: 'Legs',
            difficulty: 'Beginner',
            videoUrl: 'https://www.youtube.com/watch?v=D7KaRcUTQeE',
            thumbnail: 'https://img.youtube.com/vi/D7KaRcUTQeE/maxresdefault.jpg'
        },
        {
            id: 14,
            title: 'Leg Extension',
            category: 'Legs',
            difficulty: 'Beginner',
            videoUrl: 'https://www.youtube.com/watch?v=tfKuTU_hRvs',
            thumbnail: 'https://img.youtube.com/vi/tfKuTU_hRvs/maxresdefault.jpg'
        },
        {
            id: 15,
            title: 'Bulgarian Split Squat',
            category: 'Legs',
            difficulty: 'Advanced',
            videoUrl: 'https://www.youtube.com/watch?v=jsDMCFLB3Wg',
            thumbnail: 'https://img.youtube.com/vi/jsDMCFLB3Wg/maxresdefault.jpg'
        },
        
        // SHOULDERS
        {
            id: 16,
            title: 'Overhead Press',
            category: 'Shoulders',
            difficulty: 'Intermediate',
            videoUrl: 'https://www.youtube.com/watch?v=2yjwXTZQDDI',
            thumbnail: 'https://img.youtube.com/vi/2yjwXTZQDDI/maxresdefault.jpg'
        },
        {
            id: 17,
            title: 'Lateral Raise',
            category: 'Shoulders',
            difficulty: 'Beginner',
            videoUrl: 'https://www.youtube.com/watch?v=q9cJrMPg0pQ',
            thumbnail: 'https://img.youtube.com/vi/q9cJrMPg0pQ/maxresdefault.jpg'
        },
        {
            id: 18,
            title: 'Machine Shoulder Press',
            category: 'Shoulders',
            difficulty: 'Beginner',
            videoUrl: 'https://www.youtube.com/watch?v=oSVmCf6fvqU',
            thumbnail: 'https://img.youtube.com/vi/oSVmCf6fvqU/maxresdefault.jpg'
        },
        {
            id: 19,
            title: 'Face Pull',
            category: 'Shoulders',
            difficulty: 'Beginner',
            videoUrl: 'https://www.youtube.com/watch?v=eIwd5F7NVV0',
            thumbnail: 'https://img.youtube.com/vi/eIwd5F7NVV0/maxresdefault.jpg'
        },
        {
            id: 20,
            title: 'Reverse Pec Deck',
            category: 'Shoulders',
            difficulty: 'Beginner',
            videoUrl: 'https://www.youtube.com/watch?v=OlsKd-v5x7M',
            thumbnail: 'https://img.youtube.com/vi/OlsKd-v5x7M/maxresdefault.jpg'
        },
        
        // ARMS
        {
            id: 21,
            title: 'Barbell Curl',
            category: 'Arms',
            difficulty: 'Beginner',
            videoUrl: 'https://www.youtube.com/watch?v=kwG2ipFQV0I',
            thumbnail: 'https://img.youtube.com/vi/kwG2ipFQV0I/maxresdefault.jpg'
        },
        {
            id: 22,
            title: 'Dumbbell Curl',
            category: 'Arms',
            difficulty: 'Beginner',
            videoUrl: 'https://www.youtube.com/watch?v=ykJmreCEZK0',
            thumbnail: 'https://img.youtube.com/vi/ykJmreCEZK0/maxresdefault.jpg'
        },
        {
            id: 23,
            title: 'Tricep Rope Pushdown',
            category: 'Arms',
            difficulty: 'Beginner',
            videoUrl: 'https://www.youtube.com/watch?v=xHqqVBJkbcE',
            thumbnail: 'https://img.youtube.com/vi/xHqqVBJkbcE/maxresdefault.jpg'
        },
        {
            id: 24,
            title: 'Tricep Dip',
            category: 'Arms',
            difficulty: 'Intermediate',
            videoUrl: 'https://www.youtube.com/watch?v=KF-UwJrdFdY',
            thumbnail: 'https://img.youtube.com/vi/KF-UwJrdFdY/maxresdefault.jpg'
        },
        {
            id: 25,
            title: 'Overhead Tricep Extension',
            category: 'Arms',
            difficulty: 'Beginner',
            videoUrl: 'https://www.youtube.com/watch?v=4iKiM_QFf2Q',
            thumbnail: 'https://img.youtube.com/vi/4iKiM_QFf2Q/maxresdefault.jpg'
        },
        {
            id: 26,
            title: 'Hammer Curl',
            category: 'Arms',
            difficulty: 'Beginner',
            videoUrl: 'https://www.youtube.com/watch?v=zC3nLlEvin0',
            thumbnail: 'https://img.youtube.com/vi/zC3nLlEvin0/maxresdefault.jpg'
        },
        
        // CORE
        {
            id: 27,
            title: 'Barbell Back Squat',
            category: 'Core',
            difficulty: 'Intermediate',
            videoUrl: 'https://www.youtube.com/watch?v=ultWZbGWL5c',
            thumbnail: 'https://img.youtube.com/vi/ultWZbGWL5c/maxresdefault.jpg'
        },
        {
            id: 28,
            title: 'Decline Sit Up',
            category: 'Core',
            difficulty: 'Beginner',
            videoUrl: 'https://www.youtube.com/watch?v=_SjfknVTZ3c',
            thumbnail: 'https://img.youtube.com/vi/_SjfknVTZ3c/maxresdefault.jpg'
        },
        {
            id: 29,
            title: 'Cable Woodchop',
            category: 'Core',
            difficulty: 'Intermediate',
            videoUrl: 'https://www.youtube.com/watch?v=l8yASUiL9SE',
            thumbnail: 'https://img.youtube.com/vi/l8yASUiL9SE/maxresdefault.jpg'
        },
        {
            id: 30,
            title: 'Hanging Leg Raise',
            category: 'Core',
            difficulty: 'Advanced',
            videoUrl: 'https://www.youtube.com/watch?v=j40YM8F_Ado',
            thumbnail: 'https://img.youtube.com/vi/j40YM8F_Ado/maxresdefault.jpg'
        },
        
        // CARDIO
        {
            id: 31,
            title: 'Treadmill Running',
            category: 'Cardio',
            difficulty: 'Beginner',
            videoUrl: 'https://www.youtube.com/watch?v=u7F7AABN1Tw',
            thumbnail: 'https://img.youtube.com/vi/u7F7AABN1Tw/maxresdefault.jpg'
        },
        {
            id: 32,
            title: 'Rowing Machine',
            category: 'Cardio',
            difficulty: 'Beginner',
            videoUrl: 'https://www.youtube.com/watch?v=U7KSXWL8_oU',
            thumbnail: 'https://img.youtube.com/vi/U7KSXWL8_oU/maxresdefault.jpg'
        },
        {
            id: 33,
            title: 'Stationary Bike',
            category: 'Cardio',
            difficulty: 'Beginner',
            videoUrl: 'https://www.youtube.com/watch?v=yYbMU2gJ1xM',
            thumbnail: 'https://img.youtube.com/vi/yYbMU2gJ1xM/maxresdefault.jpg'
        },
        {
            id: 34,
            title: 'Jump Rope',
            category: 'Cardio',
            difficulty: 'Intermediate',
            videoUrl: 'https://www.youtube.com/watch?v=CSkQ3w19v4c',
            thumbnail: 'https://img.youtube.com/vi/CSkQ3w19v4c/maxresdefault.jpg'
        },
        {
            id: 35,
            title: 'Stair Climber',
            category: 'Cardio',
            difficulty: 'Intermediate',
            videoUrl: 'https://www.youtube.com/watch?v=HkHQfJkpFmQ',
            thumbnail: 'https://img.youtube.com/vi/HkHQfJkpFmQ/maxresdefault.jpg'
        }
    ];
}

// --- Gamification ---
export function updateUser(id, updates) {
    const data = loadDB();
    const index = data.users.findIndex(u => u.id === id);
    if (index !== -1) {
        data.users[index] = { ...data.users[index], ...updates };
        saveDB(data);
        return data.users[index];
    }
    return null;
}

export const RANKS = [
    { name: 'Cadet', minXp: 0, icon: 'rank-cadet' },           // BSG
    { name: 'Trooper', minXp: 500, icon: 'rank-trooper' },      // Star Wars
    { name: 'Centurion', minXp: 1000, icon: 'rank-centurion' }, // BSG
    { name: 'Fedaykin', minXp: 2500, icon: 'rank-fedaykin' },   // Dune
    { name: 'Master', minXp: 5000, icon: 'rank-master' },       // Star Wars
    { name: 'Kwisatz Haderach', minXp: 10000, icon: 'rank-kwisatz' } // Dune
];

// Backwards-compatible aggregate export for modules importing `{ db }`
export const db = {
    getTrainerProfile,
    getClients,
    getClient,
    getDashboardStats,
    getWeeklyPlan,
    saveWeeklyPlan,
    getWorkoutLog,
    saveWorkoutLog,
    getClientHistory,
    getWorkouts,
    updateUser,
    RANKS
};
