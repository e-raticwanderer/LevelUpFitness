import React, { useEffect, useState } from 'react';
import { Activity, Shield, Trophy, Zap, Target, Crosshair } from 'lucide-react';
import { getDashboardStats } from '../services/db';
import { useGamification } from '../context/GamificationContext';
import { calculateSystemLoad, calculateAccuracy } from '../services/dashboardUtils';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [systemLoad, setSystemLoad] = useState([]);
    const [accuracy, setAccuracy] = useState(90);
    const { rank, level, currentXp, nextLevelXp } = useGamification();

    useEffect(() => {
        const dashboardStats = getDashboardStats();
        setStats(dashboardStats);
        setSystemLoad(calculateSystemLoad());
        setAccuracy(calculateAccuracy());
    }, []);

    if (!stats) return <div className="text-neon-green font-orbitron animate-pulse">LOADING TACTICAL DATA...</div>;

    const StatCard = ({ icon: Icon, label, value, subtext, color = "text-neon-green" }) => (
        <div className="hud-card group hover:bg-neon-green/5 transition-all duration-300">
            <div className="flex items-start justify-between mb-2">
                <div className={`p-2 rounded bg-black border border-current ${color} bg-opacity-20`}>
                    <Icon size={20} />
                </div>
                <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">{label}</span>
            </div>
            <div className="text-3xl font-orbitron font-bold text-white mb-1 group-hover:scale-105 transition-transform origin-left">
                {value}
            </div>
            <div className={`text-xs font-mono ${color} opacity-80`}>
                {subtext}
            </div>
        </div>
    );

    return (
        <div className="space-y-8">
            {/* Header / Service Record */}
            <div className="flex flex-col md:flex-row justify-between items-end border-b border-neon-green/20 pb-6 gap-6">
                <div>
                    <h1 className="text-4xl font-orbitron text-white mb-2">COMMAND <span className="text-neon-green">CENTER</span></h1>
                    <div className="flex items-center gap-4">
                        <div className="text-4xl">{rank.icon}</div>
                        <div>
                            <p className="text-neon-green/60 font-mono text-xs tracking-widest uppercase">CURRENT RANK</p>
                            <p className="text-xl text-white font-orbitron font-bold">{rank.name}</p>
                        </div>
                        <div className="h-8 w-px bg-neon-green/20 mx-2"></div>
                        <div>
                            <p className="text-neon-green/60 font-mono text-xs tracking-widest uppercase">CLEARANCE</p>
                            <p className="text-xl text-white font-orbitron font-bold">LEVEL {level}</p>
                        </div>
                    </div>
                </div>
                
                <div className="text-right hidden md:block">
                    <p className="text-xs font-mono text-neon-green/60 mb-1">NEXT PROMOTION</p>
                    <p className="text-2xl font-orbitron text-white">{nextLevelXp - currentXp} <span className="text-sm text-neon-green">XP REQUIRED</span></p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard 
                    icon={Target} 
                    label="Active Units" 
                    value={stats.activeClients} 
                    subtext="OPERATIONAL" 
                />
                <StatCard 
                    icon={Trophy} 
                    label="Missions Complete" 
                    value={stats.completedWorkouts} 
                    subtext="+12% THIS WEEK" 
                    color="text-neon-blue"
                />
                <StatCard 
                    icon={Zap} 
                    label="Total Volume" 
                    value={(stats.totalVolume / 1000).toFixed(1) + 'k'} 
                    subtext="LBS LIFTED" 
                    color="text-electric-purple"
                />
                <StatCard 
                    icon={Crosshair} 
                    label="Accuracy" 
                    value={`${accuracy}%`} 
                    subtext="RPE TARGETS MET" 
                    color="text-alert-red"
                />
            </div>

            {/* System Load Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="hud-card lg:col-span-2 min-h-[300px] flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-orbitron text-white flex items-center gap-2">
                            <Activity className="text-neon-green" size={20} />
                            SYSTEM <span className="text-neon-green">LOAD</span>
                        </h2>
                        <div className="flex gap-2">
                            <span className="w-2 h-2 bg-neon-green rounded-full animate-pulse"></span>
                            <span className="text-xs font-mono text-neon-green">LIVE FEED</span>
                        </div>
                    </div>
                    
                    <div className="flex-1 w-full min-h-[200px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={systemLoad}>
                                <defs>
                                    <linearGradient id="colorLoad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#39ff14" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#39ff14" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(57, 255, 20, 0.1)" />
                                <XAxis dataKey="name" stroke="#39ff14" tick={{fill: '#39ff14', fontSize: 10}} tickLine={false} />
                                <YAxis stroke="#39ff14" tick={{fill: '#39ff14', fontSize: 10}} tickLine={false} />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#050505', borderColor: '#39ff14' }}
                                    itemStyle={{ color: '#39ff14' }}
                                />
                                <Area type="monotone" dataKey="load" stroke="#39ff14" fillOpacity={1} fill="url(#colorLoad)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Recent Logs */}
                <div className="hud-card flex flex-col">
                    <h2 className="text-xl font-orbitron text-white mb-4 flex items-center gap-2">
                        <Shield className="text-neon-green" size={20} />
                        RECENT <span className="text-neon-green">LOGS</span>
                    </h2>
                    <div className="space-y-4 overflow-y-auto flex-1 pr-2 custom-scrollbar">
                        {stats.recentActivity.map((log) => (
                            <div key={log.id} className="flex items-start gap-3 p-3 border border-neon-green/10 bg-black/40 hover:bg-neon-green/5 transition-colors">
                                <div className="w-8 h-8 rounded bg-neon-green/10 flex items-center justify-center text-neon-green font-bold text-xs border border-neon-green/20">
                                    {log.clientName.charAt(0)}
                                </div>
                                <div>
                                    <p className="text-white text-sm font-bold">{log.clientName}</p>
                                    <p className="text-xs text-gray-400">{log.action}</p>
                                    <p className="text-[10px] text-neon-green/60 font-mono mt-1">{log.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
