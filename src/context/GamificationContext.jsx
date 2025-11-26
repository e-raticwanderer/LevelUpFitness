import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { db, RANKS } from '../services/db';
import confetti from 'canvas-confetti';
import { Shield, Zap, Crosshair, Star, Eye, Circle, User } from 'lucide-react';

const GamificationContext = createContext();

export const useGamification = () => useContext(GamificationContext);

// Helper to map rank identifiers to Lucide Icons
export const getRankIcon = (iconName) => {
    switch (iconName) {
        case 'rank-cadet': return User;
        case 'rank-trooper': return Shield;
        case 'rank-centurion': return Crosshair;
        case 'rank-fedaykin': return Zap;
        case 'rank-master': return Star;
        case 'rank-kwisatz': return Eye;
        default: return User;
    }
};

export const GamificationProvider = ({ children }) => {
    const { user, setUser } = useAuth(); // We need setUser to update local state when DB updates
    const [showLevelUp, setShowLevelUp] = useState(false);
    const [levelUpData, setLevelUpData] = useState(null);

    // Calculate Rank based on XP
    const getRank = (xp) => {
        return RANKS.slice().reverse().find(r => xp >= r.minXp) || RANKS[0];
    };

    // Calculate Level (Simple formula: Level = floor(sqrt(XP / 100)) + 1)
    // Or just linear: Level 1 = 0-1000, Level 2 = 1000-2000, etc.
    // Let's use a progressive curve: XP = Level * 500
    const getLevel = (xp) => {
        return Math.floor(xp / 500) + 1;
    };

    const getNextLevelXp = (level) => {
        return level * 500;
    };

    const addXp = (amount) => {
        if (!user) return;

        const currentXp = user.xp || 0;
        const newXp = currentXp + amount;
        
        const currentLevel = getLevel(currentXp);
        const newLevel = getLevel(newXp);
        
        const currentRank = getRank(currentXp);
        const newRank = getRank(newXp);

        // Update DB
        const updatedUser = db.updateUser(user.id, { xp: newXp, level: newLevel, rank: newRank.name });
        
        // Update Auth State
        // We need to merge the new gamification data into the auth user object
        // Assuming useAuth exposes a way to update user, or we just manually mutate it for now (not ideal but works for MVP if reference is shared)
        // Better: AuthContext should re-fetch or accept updates.
        // For now, let's assume AuthContext's user object is the source of truth for UI.
        
        // Trigger Level Up Event
        if (newLevel > currentLevel) {
            setLevelUpData({
                oldLevel: currentLevel,
                newLevel: newLevel,
                newRank: newRank.name !== currentRank.name ? newRank : null
            });
            setShowLevelUp(true);
            
            // "Data Drop" Confetti (Matrix Rain Style)
            const duration = 3000;
            const end = Date.now() + duration;

            (function frame() {
                confetti({
                    particleCount: 5,
                    angle: 270, // Straight down
                    spread: 180, // Wide spread across top
                    origin: { y: -0.1, x: Math.random() }, // Random x at top
                    colors: ['#39ff14', '#003300', '#00ff00'], // Matrix Greens
                    shapes: ['square'],
                    gravity: 2, // Fast fall
                    scalar: 0.8,
                    drift: 0,
                    ticks: 300
                });

                if (Date.now() < end) {
                    requestAnimationFrame(frame);
                }
            }());
        }

        // Small data burst for XP gain
        if (newLevel === currentLevel) {
             confetti({
                particleCount: 15,
                angle: 90,
                spread: 45,
                origin: { y: 0.9 },
                colors: ['#39ff14'],
                shapes: ['square'],
                scalar: 0.5
            });
        }
    };

    const closeLevelUp = () => {
        setShowLevelUp(false);
        setLevelUpData(null);
        // Force reload user from DB to ensure UI sync
        // In a real app, we'd use a reducer or SWR.
        window.location.reload(); // Brute force sync for MVP to ensure all components see new Level
    };

    return (
        <GamificationContext.Provider value={{ 
            rank: getRank(user?.xp || 0),
            level: getLevel(user?.xp || 0),
            nextLevelXp: getNextLevelXp(getLevel(user?.xp || 0)),
            currentXp: user?.xp || 0,
            addXp,
            showLevelUp,
            levelUpData,
            closeLevelUp
        }}>
            {children}
        </GamificationContext.Provider>
    );
};
