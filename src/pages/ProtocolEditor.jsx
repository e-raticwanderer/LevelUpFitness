import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Save, Plus, Trash2, Dumbbell, Calendar, X } from 'lucide-react';
import { db } from '../services/db';
import WorkoutLibrary from './WorkoutLibrary';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const ProtocolEditor = () => {
    const { clientId } = useParams();
    const navigate = useNavigate();
    const [client, setClient] = useState(null);
    const [plan, setPlan] = useState(null);
    const [selectedDay, setSelectedDay] = useState('Monday');
    const [isSaving, setIsSaving] = useState(false);
    const [showLibrary, setShowLibrary] = useState(false);

    // Load Data
    useEffect(() => {
        const clientData = db.getClient(clientId);
        const planData = db.getWeeklyPlan(clientId);
        
        setClient(clientData);
        setPlan(planData || { 
            id: `plan-${clientId}`, 
            client_id: clientId, 
            name: 'New Protocol', 
            schedule: {} 
        });
    }, [clientId]);

    const handleSave = () => {
        setIsSaving(true);
        db.saveWeeklyPlan(plan);
        setTimeout(() => {
            setIsSaving(false);
            alert('PROTOCOL UPDATED SUCCESSFULLY');
        }, 800);
    };

    const updateDayExercises = (exercises) => {
        setPlan(prev => ({
            ...prev,
            schedule: {
                ...prev.schedule,
                [selectedDay]: exercises
            }
        }));
    };

    const removeExercise = (index) => {
        const currentExercises = plan.schedule[selectedDay] || [];
        const newExercises = currentExercises.filter((_, i) => i !== index);
        updateDayExercises(newExercises);
    };

    const handleAddExercise = (workout) => {
        const currentExercises = plan.schedule[selectedDay] || [];
        const newExercise = {
            id: Date.now(),
            name: workout.title,
            sets: 3,
            reps: '10',
            rpe: 7,
            notes: ''
        };
        updateDayExercises([...currentExercises, newExercise]);
        setShowLibrary(false);
    };

    if (!client || !plan) return <div className="text-neon-green font-orbitron animate-pulse">LOADING PROTOCOL...</div>;

    return (
        <div className="space-y-6 h-[calc(100vh-100px)] flex flex-col relative">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-neon-green/20 pb-4 shrink-0">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/trainer')} className="text-neon-green/60 hover:text-neon-green transition-colors">
                        <ChevronLeft size={24} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-orbitron text-white">PROTOCOL EDITOR</h1>
                        <p className="text-neon-green/60 font-mono text-xs tracking-widest uppercase">UNIT: {client.name} // ID: {client.id}</p>
                    </div>
                </div>
                <button 
                    onClick={handleSave}
                    className="btn-hud flex items-center gap-2"
                >
                    <Save size={18} />
                    {isSaving ? 'SAVING...' : 'SAVE PROTOCOL'}
                </button>
            </div>

            <div className="flex flex-1 gap-6 min-h-0">
                {/* Day Selector (Sidebar) */}
                <div className="w-48 flex flex-col gap-2 overflow-y-auto pr-2 custom-scrollbar shrink-0">
                    {DAYS.map(day => {
                        const exerciseCount = (plan.schedule[day] || []).length;
                        return (
                            <button
                                key={day}
                                onClick={() => setSelectedDay(day)}
                                className={`
                                    p-4 text-left border transition-all duration-300 relative overflow-hidden group
                                    ${selectedDay === day 
                                        ? 'bg-neon-green/10 border-neon-green text-white shadow-[0_0_10px_rgba(57,255,20,0.2)]' 
                                        : 'bg-black/40 border-white/10 text-gray-500 hover:border-neon-green/40 hover:text-neon-green'}
                                `}
                            >
                                <div className="font-orbitron text-sm tracking-wider mb-1">{day.toUpperCase()}</div>
                                <div className="text-[10px] font-mono flex items-center gap-1 opacity-60">
                                    <Dumbbell size={10} /> {exerciseCount} EXERCISES
                                </div>
                                {selectedDay === day && <div className="absolute left-0 top-0 bottom-0 w-1 bg-neon-green"></div>}
                            </button>
                        );
                    })}
                </div>

                {/* Day Editor (Main Area) */}
                <div className="flex-1 hud-card bg-black/40 flex flex-col min-h-0">
                    <div className="flex items-center justify-between mb-6 shrink-0">
                        <h2 className="text-xl font-orbitron text-white flex items-center gap-2">
                            <Calendar className="text-neon-green" />
                            {selectedDay.toUpperCase()} MISSION
                        </h2>
                        <button 
                            onClick={() => setShowLibrary(true)}
                            className="flex items-center gap-2 text-xs font-bold bg-neon-green/10 text-neon-green border border-neon-green/30 px-3 py-2 hover:bg-neon-green hover:text-black transition-all"
                        >
                            <Plus size={14} /> ADD EXERCISE
                        </button>
                    </div>

                    <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar flex-1">
                        {(plan.schedule[selectedDay] || []).length > 0 ? (
                            (plan.schedule[selectedDay] || []).map((ex, idx) => (
                                <div key={idx} className="p-4 border border-white/10 bg-black/60 hover:border-neon-green/30 transition-colors group">
                                    <div className="flex items-start justify-between mb-3">
                                        <h3 className="font-orbitron text-white">{ex.name}</h3>
                                        <button 
                                            onClick={() => removeExercise(idx)}
                                            className="text-gray-600 hover:text-alert-red transition-colors"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                    
                                    <div className="grid grid-cols-4 gap-4">
                                        <div>
                                            <label className="text-[9px] text-gray-500 uppercase font-bold block mb-1">SETS</label>
                                            <input 
                                                type="number" 
                                                value={ex.sets}
                                                onChange={(e) => {
                                                    const newEx = [...(plan.schedule[selectedDay] || [])];
                                                    newEx[idx].sets = parseInt(e.target.value);
                                                    updateDayExercises(newEx);
                                                }}
                                                className="w-full bg-black border border-white/20 text-white px-2 py-1 font-mono text-sm focus:border-neon-green outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[9px] text-gray-500 uppercase font-bold block mb-1">REPS</label>
                                            <input 
                                                type="text" 
                                                value={ex.reps}
                                                onChange={(e) => {
                                                    const newEx = [...(plan.schedule[selectedDay] || [])];
                                                    newEx[idx].reps = e.target.value;
                                                    updateDayExercises(newEx);
                                                }}
                                                className="w-full bg-black border border-white/20 text-white px-2 py-1 font-mono text-sm focus:border-neon-green outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[9px] text-gray-500 uppercase font-bold block mb-1">RPE</label>
                                            <input 
                                                type="number" 
                                                value={ex.rpe}
                                                onChange={(e) => {
                                                    const newEx = [...(plan.schedule[selectedDay] || [])];
                                                    newEx[idx].rpe = e.target.value;
                                                    updateDayExercises(newEx);
                                                }}
                                                className="w-full bg-black border border-white/20 text-white px-2 py-1 font-mono text-sm focus:border-neon-green outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[9px] text-gray-500 uppercase font-bold block mb-1">NOTES</label>
                                            <input 
                                                type="text" 
                                                value={ex.notes || ''}
                                                onChange={(e) => {
                                                    const newEx = [...(plan.schedule[selectedDay] || [])];
                                                    newEx[idx].notes = e.target.value;
                                                    updateDayExercises(newEx);
                                                }}
                                                className="w-full bg-black border border-white/20 text-white px-2 py-1 font-mono text-sm focus:border-neon-green outline-none"
                                                placeholder="Optional..."
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-gray-600 border-2 border-dashed border-white/5 rounded-lg">
                                <Dumbbell size={48} className="mb-4 opacity-20" />
                                <p className="font-mono text-sm">NO MISSION DATA CONFIGURED</p>
                                <p className="text-xs mt-2">ADD EXERCISES TO INITIALIZE</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Library Modal */}
            {showLibrary && (
                <div className="absolute inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-8">
                    <div className="bg-hud-black border border-neon-green/30 w-full h-full max-w-5xl flex flex-col shadow-[0_0_50px_rgba(57,255,20,0.1)] relative">
                        <button 
                            onClick={() => setShowLibrary(false)}
                            className="absolute top-4 right-4 text-gray-500 hover:text-white z-10"
                        >
                            <X size={24} />
                        </button>
                        <div className="p-6 border-b border-white/10">
                            <h2 className="text-2xl font-orbitron text-white">SELECT ORDNANCE</h2>
                            <p className="text-neon-green/60 font-mono text-xs tracking-widest uppercase">CHOOSE EXERCISE TO ADD TO PROTOCOL</p>
                        </div>
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                            <WorkoutLibrary onSelect={handleAddExercise} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProtocolEditor;
