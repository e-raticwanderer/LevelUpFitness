import React, { useState, useEffect } from 'react';
import { Search, Filter, Play, Info, PlusCircle } from 'lucide-react';
import { db } from '../services/db';

const CATEGORIES = ['All', 'Legs', 'Chest', 'Back', 'Shoulders', 'Arms', 'Core', 'Cardio', 'HITT'];

const WorkoutLibrary = ({ onSelect }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [workouts, setWorkouts] = useState([]);

    useEffect(() => {
        setWorkouts(db.getWorkouts());
    }, []);

    const filteredWorkouts = workouts.filter(workout => {
        const matchesSearch = workout.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || workout.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const getDifficultyColor = (difficulty) => {
        switch (difficulty.toLowerCase()) {
            case 'beginner': return 'text-neon-green border-neon-green';
            case 'intermediate': return 'text-orange-400 border-orange-400';
            case 'advanced': return 'text-alert-red border-alert-red';
            default: return 'text-gray-400 border-gray-400';
        }
    };

    return (
        <div className={`space-y-6 ${onSelect ? 'p-4' : ''}`}>
            {/* Header - Only show if not in picker mode or simplified for picker */}
            {!onSelect && (
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neon-green/20 pb-6">
                    <div>
                        <h1 className="text-3xl font-orbitron text-white mb-1">ARMORY <span className="text-neon-green">ACCESS</span></h1>
                        <p className="text-neon-green/60 font-mono text-xs tracking-widest uppercase">TACTICAL DATABASE // LOADOUT CONFIG</p>
                    </div>
                </div>
            )}

            {/* Search & Filter */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neon-green/40" size={18} />
                    <input 
                        type="text" 
                        placeholder="SEARCH DATABASE..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-black/40 border border-neon-green/30 text-white pl-10 pr-4 py-2 font-mono text-sm focus:outline-none focus:border-neon-green focus:shadow-[0_0_10px_rgba(57,255,20,0.2)]"
                    />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 custom-scrollbar">
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider border transition-all whitespace-nowrap ${
                                selectedCategory === cat 
                                    ? 'bg-neon-green text-black border-neon-green' 
                                    : 'bg-black/40 text-gray-400 border-gray-700 hover:border-neon-green/50 hover:text-neon-green'
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grid */}
            <div className={`grid grid-cols-1 ${onSelect ? 'md:grid-cols-2' : 'md:grid-cols-2 lg:grid-cols-3'} gap-6`}>
                {filteredWorkouts.map(workout => (
                    <div 
                        key={workout.id}
                        onClick={() => onSelect && onSelect(workout)}
                        className={`hud-card group relative overflow-hidden transition-all duration-300 ${onSelect ? 'cursor-pointer hover:border-neon-green' : ''}`}
                    >
                        {/* Image/Thumbnail Area */}
                        <div className="relative h-40 bg-gray-900 overflow-hidden border-b border-white/10">
                            <img src={workout.thumbnail} alt={workout.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                            <div className="absolute bottom-2 left-2">
                                <span className={`text-[10px] px-2 py-0.5 border ${getDifficultyColor(workout.difficulty)} bg-black/60 uppercase tracking-wider`}>
                                    {workout.difficulty}
                                </span>
                            </div>
                            {onSelect && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <PlusCircle className="text-neon-green" size={48} />
                                </div>
                            )}
                        </div>

                        {/* Content */}
                        <div className="p-4 relative">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-orbitron text-white text-lg leading-tight group-hover:text-neon-green transition-colors">{workout.title}</h3>
                            </div>
                            
                            <div className="flex items-center justify-between text-xs text-gray-400 font-mono mt-4">
                                <span>{workout.category.toUpperCase()}</span>
                                {!onSelect && (
                                    <a 
                                        href={workout.videoUrl} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1 text-neon-blue hover:text-white transition-colors"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <Play size={12} /> INTEL
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WorkoutLibrary;
