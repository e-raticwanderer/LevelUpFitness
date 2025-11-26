import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MessageSquare, Check, ChevronDown, ChevronUp, Dumbbell, Target, Shield, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';
import { db } from '../services/db';
import { useGamification } from '../context/GamificationContext';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const MissionObjective = ({ exercise, onUpdate, isCompleted }) => {
    const [isExpanded, setIsExpanded] = useState(true);
    const [sets, setSets] = useState(exercise.sets_data || Array(exercise.sets).fill({ weight: '', reps: '', rpe: '', completed: false }));

    useEffect(() => {
        if (exercise.sets_data) {
            setSets(exercise.sets_data);
        }
    }, [exercise]);

    const toggleSet = (index) => {
        const newSets = [...sets];
        const isCompleting = !newSets[index].completed;
        newSets[index].completed = isCompleting;
        setSets(newSets);
        onUpdate(newSets);

        if (isCompleting) {
            confetti({
                particleCount: 50,
                spread: 60,
                origin: { y: 0.7 },
                colors: ['#39ff14', '#00f3ff', '#ffffff']
            });
        }
    };

    const updateSet = (index, field, value) => {
        const newSets = [...sets];
        newSets[index] = { ...newSets[index], [field]: value };
        setSets(newSets);
        onUpdate(newSets);
    };

    return (
        <div className="hud-card p-0 overflow-hidden group hover:border-neon-green/50 transition-all duration-300">
            {/* Header */}
            <div
                className="p-4 flex items-center justify-between cursor-pointer bg-black/40 hover:bg-neon-green/5 transition-colors"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 border border-neon-green/30 bg-neon-green/5 flex items-center justify-center text-neon-green font-orbitron text-xl shrink-0" style={{ clipPath: 'polygon(20% 0, 100% 0, 100% 80%, 80% 100%, 0 100%, 0 20%)' }}>
                        {exercise.name.charAt(0)}
                    </div>
                    <div>
                        <h3 className="font-orbitron text-lg text-white tracking-wide group-hover:text-neon-green transition-colors">{exercise.name}</h3>
                        <p className="text-xs text-neon-green/60 font-mono flex items-center gap-3 uppercase tracking-wider">
                            <span className="flex items-center gap-1"><Target size={12} /> {exercise.sets} SETS</span>
                            <span className="flex items-center gap-1"><Zap size={12} /> {exercise.reps} REPS</span>
                        </p>
                    </div>
                </div>
                {isExpanded ? <ChevronUp size={20} className="text-neon-green" /> : <ChevronDown size={20} className="text-neon-green/40" />}
            </div>

            {/* Content */}
            {isExpanded && (
                <div className="p-4 space-y-6 bg-black/20 border-t border-neon-green/10">
                    {/* Notes */}
                    {exercise.notes && (
                        <div className="bg-neon-blue/5 border-l-2 border-neon-blue p-3 flex items-start gap-3 text-xs text-neon-blue/80 font-mono">
                            <MessageSquare size={14} className="mt-0.5 shrink-0 text-neon-blue" />
                            <p>{exercise.notes}</p>
                        </div>
                    )}

                    {/* Sets List */}
                    <div className="space-y-3">
                        {sets.map((set, idx) => (
                            <div
                                key={idx}
                                className={`
                                    relative p-3 border transition-all duration-300
                                    ${set.completed
                                        ? 'bg-neon-green/10 border-neon-green shadow-[0_0_10px_rgba(57,255,20,0.1)]'
                                        : 'bg-black/40 border-neon-green/20 hover:border-neon-green/40'}
                                `}
                            >
                                <div className="absolute top-0 left-0 bg-neon-green/10 px-2 py-0.5 text-[9px] font-bold text-neon-green uppercase tracking-widest border-r border-b border-neon-green/20">
                                    SEQ_0{idx + 1}
                                </div>

                                <div className="flex items-center justify-between mt-3">
                                    {/* Controls */}
                                    <div className="flex items-center gap-2 md:gap-6">
                                        <div className="flex flex-col gap-1">
                                            <label className="text-[9px] text-neon-green/40 uppercase font-bold text-center tracking-wider">LOAD (LBS)</label>
                                            <input
                                                type="number"
                                                value={set.weight}
                                                onChange={(e) => updateSet(idx, 'weight', e.target.value)}
                                                className="w-20 h-10 bg-black border border-neon-green/30 text-center text-white font-orbitron text-lg focus:outline-none focus:border-neon-green focus:shadow-[0_0_10px_rgba(57,255,20,0.3)] transition-all placeholder:text-gray-800"
                                                placeholder="000"
                                            />
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <label className="text-[9px] text-neon-green/40 uppercase font-bold text-center tracking-wider">REPS</label>
                                            <input
                                                type="number"
                                                value={set.reps}
                                                onChange={(e) => updateSet(idx, 'reps', e.target.value)}
                                                className="w-16 h-10 bg-black border border-neon-green/30 text-center text-white font-orbitron text-lg focus:outline-none focus:border-neon-green focus:shadow-[0_0_10px_rgba(57,255,20,0.3)] transition-all placeholder:text-gray-800"
                                                placeholder="00"
                                            />
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <label className="text-[9px] text-neon-green/40 uppercase font-bold text-center tracking-wider">RPE</label>
                                            <input
                                                type="number"
                                                value={set.rpe}
                                                onChange={(e) => updateSet(idx, 'rpe', e.target.value)}
                                                className="w-14 h-10 bg-black border border-neon-green/30 text-center text-white font-orbitron text-lg focus:outline-none focus:border-neon-green focus:shadow-[0_0_10px_rgba(57,255,20,0.3)] transition-all placeholder:text-gray-800"
                                                placeholder="-"
                                            />
                                        </div>
                                    </div>

                                    {/* Checkmark */}
                                    <button
                                        onClick={(e) => { e.stopPropagation(); toggleSet(idx); }}
                                        className={`
                                            w-12 h-12 flex items-center justify-center transition-all duration-300
                                            ${set.completed
                                                ? 'bg-neon-green text-black shadow-[0_0_15px_rgba(57,255,20,0.6)]'
                                                : 'bg-transparent border border-neon-green/30 text-neon-green/30 hover:text-neon-green hover:border-neon-green hover:bg-neon-green/10'}
                                        `}
                                        style={{ clipPath: 'polygon(20% 0, 100% 0, 100% 80%, 80% 100%, 0 100%, 0 20%)' }}
                                    >
                                        <Check size={24} strokeWidth={3} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

const ActivePlan = () => {
    // Simulate logged-in client
    const CLIENT_ID = 'client-1';

    const [selectedDay, setSelectedDay] = useState(DAYS[new Date().getDay()]);
    const [plan, setPlan] = useState(null);
    const [log, setLog] = useState(null);
    const [exercises, setExercises] = useState([]);

    useEffect(() => {
        // Load Plan
        const weeklyPlan = db.getWeeklyPlan(CLIENT_ID);
        setPlan(weeklyPlan);

        // Load Log for selected day (if exists)
        const date = new Date().toISOString().split('T')[0];
        const existingLog = db.getWorkoutLog(CLIENT_ID, date);

        if (existingLog && existingLog.day === selectedDay) {
            setLog(existingLog);
            setExercises(existingLog.exercises);
        } else if (weeklyPlan && weeklyPlan.schedule[selectedDay]) {
            // Load from Template
            setLog(null);
            setExercises(weeklyPlan.schedule[selectedDay].map(ex => ({
                ...ex,
                sets_data: Array(ex.sets).fill({ weight: '', reps: '', rpe: '', completed: false })
            })));
        } else {
            setExercises([]);
        }
    }, [selectedDay]);

    const handleUpdateExercise = (exIndex, setsData) => {
        const newExercises = [...exercises];
        newExercises[exIndex].sets_data = setsData;
        setExercises(newExercises);
    };

    const { addXp } = useGamification();

    const finishWorkout = () => {
        const totalVolume = exercises.reduce((acc, ex) => {
            return acc + (ex.sets_data || []).reduce((sAcc, s) => sAcc + (Number(s.weight) * Number(s.reps) || 0), 0);
        }, 0);

        const newLog = {
            id: log?.id, // Update if exists
            client_id: CLIENT_ID,
            date: new Date().toISOString().split('T')[0],
            day: selectedDay,
            completed: true,
            volume: totalVolume,
            exercises: exercises
        };

        db.saveWorkoutLog(newLog);
        
        // Award XP (e.g., 100 base + 1 per 100lbs volume)
        const xpEarned = 100 + Math.floor(totalVolume / 100);
        addXp(xpEarned);
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between border-b border-neon-green/20 pb-4">
                <div>
                    <h1 className="text-3xl font-orbitron text-white mb-1">MISSION <span className="text-neon-green">BRIEFING</span></h1>
                    <p className="text-neon-green/60 font-mono text-xs tracking-widest uppercase">
                        CURRENT OBJECTIVE: {plan ? plan.name : 'NO ACTIVE MISSION'}
                    </p>
                </div>
                <button
                    onClick={finishWorkout}
                    className="btn-hud hidden md:flex items-center gap-2"
                >
                    <Shield size={18} />
                    COMPLETE MISSION
                </button>
            </div>

            {/* Weekly Strip */}
            <div className="flex overflow-x-auto pb-4 gap-3 no-scrollbar">
                {DAYS.map(day => (
                    <button
                        key={day}
                        onClick={() => setSelectedDay(day)}
                        className={`
                            flex-shrink-0 w-16 h-20 flex flex-col items-center justify-center gap-1 transition-all border relative overflow-hidden
                            ${selectedDay === day
                                ? 'bg-neon-green/10 border-neon-green text-neon-green shadow-[0_0_15px_rgba(57,255,20,0.3)]'
                                : 'bg-black/40 border-neon-green/20 text-neon-green/40 hover:border-neon-green/60 hover:text-neon-green/80'}
                        `}
                        style={{ clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' }}
                    >
                        <span className="text-[10px] font-bold uppercase tracking-wider font-orbitron">{day.slice(0, 3)}</span>
                        {/* Dot indicator if workout exists/planned */}
                        <div className={`w-1.5 h-1.5 rounded-full ${plan?.schedule[day] ? 'bg-current shadow-[0_0_5px_currentColor]' : 'bg-transparent'}`} />
                        
                        {/* Scanline overlay for active tab */}
                        {selectedDay === day && (
                            <div className="absolute inset-0 bg-scanline opacity-20 pointer-events-none"></div>
                        )}
                    </button>
                ))}
            </div>

            {/* Workout Content */}
            <div className="space-y-4 pb-24">
                {exercises.length > 0 ? (
                    exercises.map((exercise, idx) => (
                        <MissionObjective
                            key={idx}
                            exercise={exercise}
                            onUpdate={(setsData) => handleUpdateExercise(idx, setsData)}
                        />
                    ))
                ) : (
                    <div className="text-center py-16 border border-dashed border-neon-green/20 bg-black/20 relative overflow-hidden">
                        <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none"></div>
                        <Dumbbell size={48} className="mx-auto text-neon-green/20 mb-4 animate-pulse" />
                        <p className="text-white font-orbitron text-xl tracking-widest">REST DAY</p>
                        <p className="text-xs text-neon-green/60 font-mono mt-2 uppercase">SYSTEM RECHARGE IN PROGRESS</p>
                    </div>
                )}
            </div>

            {/* Mobile Finish Button (Sticky FAB) */}
            {exercises.length > 0 && (
                <div className="fixed bottom-[calc(var(--bottom-nav-height)+20px)] left-0 right-0 px-6 md:hidden z-30">
                    <button
                        onClick={finishWorkout}
                        className="w-full bg-neon-green text-black font-orbitron font-bold py-4 text-xl uppercase tracking-widest shadow-[0_0_30px_rgba(57,255,20,0.4)] clip-path-polygon flex items-center justify-center gap-2"
                        style={{ clipPath: 'polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)' }}
                    >
                        <Shield size={24} /> COMPLETE MISSION
                    </button>
                </div>
            )}
        </div>
    );
};

export default ActivePlan;
