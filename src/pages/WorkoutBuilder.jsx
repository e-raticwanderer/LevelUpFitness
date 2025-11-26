import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, Plus, Trash2, ChevronLeft, Dumbbell } from 'lucide-react';
import { db } from '../services/db';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const WorkoutBuilder = () => {
    const { clientId } = useParams();
    const navigate = useNavigate();
    const [client, setClient] = useState(null);
    const [planName, setPlanName] = useState('New Program');
    const [schedule, setSchedule] = useState({});
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const clientData = db.getClient(clientId);
        setClient(clientData);

        const existingPlan = db.getWeeklyPlan(clientId);
        if (existingPlan) {
            setPlanName(existingPlan.name);
            setSchedule(existingPlan.schedule || {});
        }
    }, [clientId]);

    const addExercise = (day) => {
        const exerciseName = prompt('Enter exercise name:');
        if (!exerciseName) return;

        const newExercise = {
            id: Date.now().toString(),
            name: exerciseName,
            sets: 3,
            reps: '10',
            notes: ''
        };

        setSchedule(prev => ({
            ...prev,
            [day]: [...(prev[day] || []), newExercise]
        }));
    };

    const updateExercise = (day, exId, field, value) => {
        setSchedule(prev => ({
            ...prev,
            [day]: prev[day].map(ex => ex.id === exId ? { ...ex, [field]: value } : ex)
        }));
    };

    const removeExercise = (day, exId) => {
        setSchedule(prev => ({
            ...prev,
            [day]: prev[day].filter(ex => ex.id !== exId)
        }));
    };

    const handleSave = () => {
        setIsSaving(true);
        const plan = {
            id: db.getWeeklyPlan(clientId)?.id, // Keep ID if exists
            client_id: clientId,
            name: planName,
            active: true,
            schedule
        };

        db.saveWeeklyPlan(plan);

        setTimeout(() => {
            setIsSaving(false);
            alert('PLAN SAVED SUCCESSFULLY! ⚡');
        }, 500);
    };

    if (!client) return <div className="p-8 text-white font-heading text-xl">Loading System...</div>;

    return (
        <div className="space-y-6 h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between shrink-0">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="text-text-muted hover:text-primary transition-colors">
                        <ChevronLeft size={24} />
                    </button>
                    <div>
                        <h1 className="heading-1">Workout Builder</h1>
                        <p className="text-text-muted">Programming for <span className="text-primary font-bold uppercase">{client.name}</span></p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <input
                        value={planName}
                        onChange={(e) => setPlanName(e.target.value)}
                        className="bg-black border border-white/20 px-4 py-2 text-white focus:outline-none focus:border-primary font-bold uppercase tracking-wide"
                        placeholder="PROGRAM NAME"
                    />
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="btn btn-primary"
                    >
                        <Save size={18} />
                        {isSaving ? 'SAVING...' : 'SAVE PLAN'}
                    </button>
                </div>
            </div>

            {/* Builder Grid */}
            <div className="flex-1 overflow-x-auto pb-4 no-scrollbar">
                <div className="flex gap-4 min-w-max h-full">
                    {DAYS.map(day => (
                        <div key={day} className="w-80 bg-card border border-white/10 flex flex-col h-full relative group">
                            <div className="absolute top-0 left-0 w-full h-1 bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />

                            {/* Day Header */}
                            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/5">
                                <h3 className="font-heading text-xl text-white tracking-wide">{day}</h3>
                                <button
                                    onClick={() => addExercise(day)}
                                    className="p-1.5 hover:bg-white/10 text-primary transition-colors"
                                >
                                    <Plus size={18} />
                                </button>
                            </div>

                            {/* Exercises List */}
                            <div className="flex-1 overflow-y-auto p-3 space-y-3">
                                {(schedule[day] || []).map((ex, idx) => (
                                    <div key={ex.id} className="bg-black/40 p-3 border border-white/10 hover:border-primary/50 transition-colors group/card">
                                        <div className="flex items-start justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <Dumbbell size={14} className="text-text-muted" />
                                                <span className="font-bold text-white text-sm uppercase">{ex.name}</span>
                                            </div>
                                            <button
                                                onClick={() => removeExercise(day, ex.id)}
                                                className="text-text-muted hover:text-secondary opacity-0 group-hover/card:opacity-100 transition-opacity"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-2 gap-2 mb-2">
                                            <div>
                                                <label className="text-[10px] text-text-muted uppercase font-bold">Sets</label>
                                                <input
                                                    type="number"
                                                    value={ex.sets}
                                                    onChange={(e) => updateExercise(day, ex.id, 'sets', e.target.value)}
                                                    className="w-full bg-black border border-white/20 px-2 py-1 text-xs text-white font-mono focus:border-primary focus:outline-none"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-[10px] text-text-muted uppercase font-bold">Reps</label>
                                                <input
                                                    type="text"
                                                    value={ex.reps}
                                                    onChange={(e) => updateExercise(day, ex.id, 'reps', e.target.value)}
                                                    className="w-full bg-black border border-white/20 px-2 py-1 text-xs text-white font-mono focus:border-primary focus:outline-none"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <input
                                                value={ex.notes}
                                                onChange={(e) => updateExercise(day, ex.id, 'notes', e.target.value)}
                                                placeholder="Notes..."
                                                className="w-full bg-transparent border-b border-white/10 py-1 text-xs text-text-muted focus:outline-none focus:border-primary"
                                            />
                                        </div>
                                    </div>
                                ))}

                                {(schedule[day] || []).length === 0 && (
                                    <div className="h-32 flex items-center justify-center text-text-muted text-xs font-bold uppercase tracking-widest border border-dashed border-white/10 opacity-50">
                                        Rest Day
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default WorkoutBuilder;
