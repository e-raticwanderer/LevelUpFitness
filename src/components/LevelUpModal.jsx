import React from 'react';
import { useGamification, getRankIcon } from '../context/GamificationContext';
import { Shield, Star, Zap } from 'lucide-react';

const LevelUpModal = () => {
    const { showLevelUp, levelUpData, closeLevelUp } = useGamification();

    if (!showLevelUp || !levelUpData) return null;

    const NewRankIcon = levelUpData.newRank ? getRankIcon(levelUpData.newRank.icon) : null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
            <div className="hud-card max-w-sm w-full text-center animate-[scaleIn_0.3s_ease-out] border-neon-green shadow-[0_0_50px_rgba(57,255,20,0.2)]">
                
                <div className="mb-6 relative">
                    <div className="absolute inset-0 bg-neon-green/20 blur-xl rounded-full animate-pulse"></div>
                    <Shield size={80} className="text-neon-green mx-auto relative z-10 drop-shadow-[0_0_10px_rgba(57,255,20,0.8)]" />
                    <Star size={40} className="text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-[spin_3s_linear_infinite]" />
                </div>

                <h2 className="text-3xl font-orbitron text-white mb-2 tracking-widest">SYSTEM UPGRADE</h2>
                <p className="text-neon-green font-mono text-lg mb-6 tracking-widest">
                    LEVEL {levelUpData.oldLevel} <span className="text-white mx-2">➔</span> <span className="text-white font-bold text-2xl">{levelUpData.newLevel}</span>
                </p>

                {levelUpData.newRank && NewRankIcon && (
                    <div className="bg-black border border-neon-green p-4 mb-6 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-scanline opacity-20"></div>
                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-neon-green/10 to-transparent opacity-50 animate-pulse"></div>
                        <p className="text-xs text-neon-green/80 font-mono uppercase tracking-widest mb-2 relative z-10">NEW DESIGNATION ASSIGNED</p>
                        <div className="flex items-center justify-center gap-3 relative z-10">
                            <NewRankIcon size={32} className="text-neon-green drop-shadow-[0_0_5px_#39ff14]" />
                            <p className="text-2xl font-orbitron text-white font-bold tracking-wide">{levelUpData.newRank.name.toUpperCase()}</p>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-black/40 p-3 border border-neon-green/20">
                        <p className="text-[10px] text-neon-green/60 uppercase">STR +</p>
                        <p className="text-white font-bold">1.5%</p>
                    </div>
                    <div className="bg-black/40 p-3 border border-neon-green/20">
                        <p className="text-[10px] text-neon-green/60 uppercase">END +</p>
                        <p className="text-white font-bold">2.0%</p>
                    </div>
                </div>

                <button 
                    onClick={closeLevelUp}
                    className="btn-hud w-full flex items-center justify-center gap-2"
                >
                    <Zap size={18} />
                    CONTINUE MISSION
                </button>
            </div>
        </div>
    );
};

export default LevelUpModal;
