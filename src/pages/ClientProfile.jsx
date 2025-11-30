import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { User, Calendar, TrendingUp, ChevronLeft, CheckCircle, XCircle, Shield, Activity, Clock, Download, Edit3 } from 'lucide-react';
import { getClient, getClientHistory, getWeeklyPlan } from '../services/db';
import { exportToCSV, exportToJSON } from '../services/exportUtils';

const ClientProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [client, setClient] = useState(null);
    const [workouts, setWorkouts] = useState([]);
    const [plan, setPlan] = useState(null);

    useEffect(() => {
        const clientData = getClient(id);
        const workoutData = getClientHistory(id);
        const planData = getWeeklyPlan(id);
        setClient(clientData);
        setWorkouts(workoutData);
        setPlan(planData);
    }, [id]);

    if (!client) return <div className="p-8 text-neon-green font-orbitron text-xl animate-pulse">ACCESSING ARCHIVES...</div>;

    const successRate = workouts.length ? Math.round((workouts.filter(w => w.completed).length / workouts.length) * 100) : 0;
    const totalVolume = workouts.reduce((acc, w) => acc + (w.volume || 0), 0);

    const handleExportWorkouts = (format) => {
        const data = workouts.map(w => ({
            Date: w.date,
            Status: w.completed ? 'Completed' : 'Pending',
            Volume: w.volume || 0,
            Exercises: w.exercises ? w.exercises.map(e => e.name).join('; ') : 'N/A'
        }));
        if (format === 'csv') {
            exportToCSV(data, `${client.name}_workouts.csv`);
        } else if (format === 'json') {
            exportToJSON(data, `${client.name}_workouts.json`);
        }
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col gap-4">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-neon-green/60 hover:text-neon-green transition-colors font-mono text-xs tracking-widest uppercase w-fit"
                >
                    <ChevronLeft size={16} /> RETURN TO COMMAND
                </button>

                <div className="flex items-center justify-between border-b border-neon-green/20 pb-6">
                    <div className="flex items-center gap-6">
                        <div className="w-20 h-20 border border-neon-green/30 bg-neon-green/5 flex items-center justify-center text-neon-green text-4xl font-orbitron relative">
                            {client.name.charAt(0)}
                            <div className="absolute top-0 right-0 w-2 h-2 bg-neon-green shadow-[0_0_5px_#39ff14]"></div>
                            <div className="absolute bottom-0 left-0 w-2 h-2 border-l border-b border-neon-green"></div>
                        </div>
                        <div>
                            <h1 className="text-3xl font-orbitron text-white mb-1">{client.name.toUpperCase()}</h1>
                            <div className="flex items-center gap-4 text-xs font-mono">
                                <span className={`px-2 py-0.5 border ${client.status === 'Active' ? 'border-neon-green text-neon-green bg-neon-green/10' : 'border-gray-500 text-gray-500'}`}>
                                    STATUS: {client.status.toUpperCase()}
                                </span>
                                <span className="text-neon-green/60">LVL {client.level} • {client.rank}</span>
                                <span className="text-neon-green/60">XP: {client.xp}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2 md:flex-row">
                        <button
                            onClick={() => navigate(`/trainer/protocol/${id}`)}
                            className="btn-hud flex items-center gap-2"
                        >
                            <Edit3 size={14} />
                            EDIT PROTOCOL
                        </button>
                        <button
                            onClick={() => handleExportWorkouts('csv')}
                            className="btn-hud flex items-center gap-2"
                        >
                            <Download size={14} />
                            CSV
                        </button>
                        <button
                            onClick={() => handleExportWorkouts('json')}
                            className="btn-hud flex items-center gap-2"
                        >
                            <Download size={14} />
                            JSON
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="hud-card p-4 text-center group hover:bg-neon-green/5 transition-colors">
                    <p className="text-neon-green/60 text-[10px] uppercase font-bold tracking-widest mb-2">TOTAL MISSIONS</p>
                    <p className="text-3xl font-orbitron text-white group-hover:text-neon-green transition-colors">{workouts.length}</p>
                </div>
                <div className="hud-card p-4 text-center group hover:bg-neon-green/5 transition-colors">
                    <p className="text-neon-green/60 text-[10px] uppercase font-bold tracking-widest mb-2">SUCCESS RATE</p>
                    <p className="text-3xl font-orbitron text-neon-blue group-hover:text-white transition-colors">{successRate}%</p>
                </div>
                <div className="hud-card p-4 text-center group hover:bg-neon-green/5 transition-colors">
                    <p className="text-neon-green/60 text-[10px] uppercase font-bold tracking-widest mb-2">TOTAL LOAD</p>
                    <p className="text-3xl font-orbitron text-electric-purple group-hover:text-white transition-colors">
                        {(totalVolume / 1000).toFixed(1)}k
                    </p>
                </div>
                <div className="hud-card p-4 text-center group hover:bg-neon-green/5 transition-colors">
                    <p className="text-neon-green/60 text-[10px] uppercase font-bold tracking-widest mb-2">LAST ACTIVE</p>
                    <p className="text-xl font-orbitron text-white mt-2">
                        {workouts[0] ? new Date(workouts[0].date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'N/A'}
                    </p>
                </div>
            </div>

            {/* Current Program */}
            {plan && (
                <div className="hud-card">
                    <h2 className="text-xl font-orbitron text-white mb-6 flex items-center gap-2">
                        <Shield className="text-neon-green" />
                        ACTIVE PROGRAM
                    </h2>
                    <div className="p-4 border border-neon-green/20 bg-neon-green/5">
                        <p className="text-white font-orbitron text-lg mb-2">{plan.name}</p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {Object.entries(plan.schedule).map(([day, exercises]) => (
                                <div key={day} className="bg-black/40 p-3 border border-neon-green/10">
                                    <p className="font-mono text-xs text-neon-green uppercase font-bold mb-2">{day}</p>
                                    <div className="space-y-1">
                                        {exercises.map((ex, idx) => (
                                            <p key={idx} className="text-xs text-gray-300 truncate">• {ex.name}</p>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Workout History */}
            <div className="hud-card">
                <h2 className="text-xl font-orbitron text-white mb-6 flex items-center gap-2">
                    <Activity className="text-neon-green" />
                    MISSION LOGS
                </h2>
                <div className="space-y-2">
                    {workouts.map((workout) => (
                        <div key={workout.id} className="flex items-center justify-between p-4 border border-neon-green/10 bg-black/40 hover:border-neon-green hover:bg-neon-green/5 transition-all group">
                            <div className="flex items-center gap-4">
                                <div className={`p-2 border ${workout.completed ? 'border-neon-green text-neon-green' : 'border-gray-600 text-gray-600'}`}>
                                    {workout.completed ? <CheckCircle size={20} /> : <Calendar size={20} />}
                                </div>
                                <div>
                                    <p className="font-orbitron text-white text-sm tracking-wide group-hover:text-neon-green transition-colors">
                                        {new Date(workout.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).toUpperCase()}
                                    </p>
                                    <p className="text-xs text-neon-green/60 font-mono flex items-center gap-2">
                                        <Shield size={12} />
                                        {workout.volume ? `${workout.volume.toLocaleString()} LBS LOAD` : 'NO DATA'}
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 border ${workout.completed ? 'border-neon-green text-neon-green bg-neon-green/10' : 'border-alert-red text-alert-red bg-alert-red/10'}`}>
                                    {workout.completed ? 'COMPLETED' : 'PENDING'}
                                </span>
                            </div>
                        </div>
                    ))}
                    {workouts.length === 0 && (
                        <div className="text-center py-12 border border-dashed border-neon-green/20">
                            <Clock size={48} className="mx-auto text-neon-green/20 mb-4" />
                            <p className="text-neon-green/60 font-mono text-sm">NO MISSION DATA FOUND</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ClientProfile;
