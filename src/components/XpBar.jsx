import React from 'react';
import { useGamification, getRankIcon } from '../context/GamificationContext';

const XpBar = () => {
    const { currentXp, nextLevelXp, level, rank } = useGamification();
    
    // Calculate progress percentage
    // Current Level Base XP = (Level - 1) * 500
    const currentLevelBaseXp = (level - 1) * 500;
    const xpInCurrentLevel = currentXp - currentLevelBaseXp;
    const xpNeededForCurrentLevel = 500; // Fixed 500 per level for now
    
    const progress = Math.min(100, Math.max(0, (xpInCurrentLevel / xpNeededForCurrentLevel) * 100));

    const RankIcon = getRankIcon(rank.icon);

    return (
        <div className="w-full max-w-md mx-auto mb-6">
            <div className="flex justify-between items-end mb-1 px-1">
                <div className="flex items-center gap-2">
                    <div className="text-neon-green">
                        <RankIcon size={24} />
                    </div>
                    <div>
                        <p className="text-[10px] text-neon-green/60 font-mono uppercase tracking-widest leading-none">RANK: {rank.name}</p>
                        <p className="text-white font-orbitron font-bold leading-none">LVL {level}</p>
                    </div>
                </div>
                <p className="text-[10px] text-neon-green/60 font-mono">
                    <span className="text-white">{xpInCurrentLevel}</span> / {xpNeededForCurrentLevel} XP
                </p>
            </div>
            
            {/* Bar Container */}
            <div className="h-2 bg-black border border-neon-green/30 relative overflow-hidden skew-x-[-15deg]">
                {/* Fill */}
                <div 
                    className="h-full bg-neon-green shadow-[0_0_10px_#39ff14] transition-all duration-1000 ease-out relative"
                    style={{ width: `${progress}%` }}
                >
                    {/* Scanline effect on bar */}
                    <div className="absolute inset-0 bg-white/20 w-full animate-[shimmer_2s_infinite]"></div>
                </div>
            </div>
        </div>
    );
};

export default XpBar;
