import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { User, Calendar, TrendingUp, ChevronLeft, CheckCircle, XCircle, Shield, Activity, Clock } from 'lucide-react';
import { db } from '../services/db';

const ClientProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [client, setClient] = useState(null);
    const [workouts, setWorkouts] = useState([]);

    useEffect(() => {
        const clientData = db.getClient(id);
        const workoutData = db.getClientHistory(id);
        setClient(clientData);
        setWorkouts(workoutData);
    }, [id]);

    if (!client) return <div className="p-8 text-neon-green font-orbitron text-xl animate-pulse">ACCESSING ARCHIVES...</div>;

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
                                <span className="text-neon-green/60">ID: {client.id.toUpperCase()}</span>
                                <span className="text-neon-green/60">JOINED: {new Date(client.joined).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={() => navigate(`/trainer/protocol/${id}`)}
                        className="btn-hud hidden md:flex items-center gap-2"
                    >
                        <Shield size={18} />
                        EDIT PROTOCOL
                    </button>
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
                    <p className="text-3xl font-orbitron text-neon-blue group-hover:text-white transition-colors">
                        {workouts.length ? Math.round((workouts.filter(w => w.completed).length / workouts.length) * 100) : 0}%
                    </p>
                </div>
                <div className="hud-card p-4 text-center group hover:bg-neon-green/5 transition-colors">
                    <p className="text-neon-green/60 text-[10px] uppercase font-bold tracking-widest mb-2">TOTAL LOAD</p>
                    <p className="text-3xl font-orbitron text-electric-purple group-hover:text-white transition-colors">
                        {(workouts.reduce((acc, w) => acc + (w.volume || 0), 0) / 1000).toFixed(1)}k
                    </p>
                </div>
                <div className="hud-card p-4 text-center group hover:bg-neon-green/5 transition-colors">
                    <p className="text-neon-green/60 text-[10px] uppercase font-bold tracking-widest mb-2">LAST ACTIVE</p>
                    <p className="text-xl font-orbitron text-white mt-2">
                        {workouts[0] ? new Date(workouts[0].date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'N/A'}
                    </p>
                </div>
            </div>

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
