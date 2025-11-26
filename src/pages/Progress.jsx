import React, { useState } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Calendar, ArrowUpRight, Activity, Database, Cpu } from 'lucide-react';

const strengthData = [
    { date: 'Jan', squat: 225, bench: 135, deadlift: 275 },
    { date: 'Feb', squat: 245, bench: 145, deadlift: 295 },
    { date: 'Mar', squat: 255, bench: 155, deadlift: 315 },
    { date: 'Apr', squat: 275, bench: 165, deadlift: 335 },
    { date: 'May', squat: 295, bench: 175, deadlift: 355 },
    { date: 'Jun', squat: 315, bench: 185, deadlift: 375 },
];

const volumeData = [
    { week: 'W1', volume: 12000 },
    { week: 'W2', volume: 13500 },
    { week: 'W3', volume: 11000 }, // Deload
    { week: 'W4', volume: 14500 },
    { week: 'W5', volume: 15500 },
    { week: 'W6', volume: 16000 },
];

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-hud-black border border-neon-green p-3 shadow-[0_0_15px_rgba(57,255,20,0.3)]">
                <p className="text-neon-green font-orbitron text-xs mb-2 border-b border-neon-green/30 pb-1">{label}</p>
                {payload.map((entry, index) => (
                    <p key={index} className="text-xs font-mono flex items-center gap-2" style={{ color: entry.color }}>
                        <span className="w-2 h-2 bg-current inline-block"></span>
                        {entry.name.toUpperCase()}: <span className="text-white font-bold">{entry.value}</span>
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

const Progress = () => {
    const [timeRange, setTimeRange] = useState('6M');

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neon-green/20 pb-4">
                <div>
                    <h1 className="text-3xl font-orbitron text-white mb-1">SYSTEM <span className="text-neon-green">ANALYSIS</span></h1>
                    <p className="text-neon-green/60 font-mono text-xs tracking-widest uppercase">PERFORMANCE METRICS & DATA LOGS</p>
                </div>
                <div className="flex bg-black border border-neon-green/30 p-1">
                    {['1M', '3M', '6M', '1Y'].map((range) => (
                        <button
                            key={range}
                            onClick={() => setTimeRange(range)}
                            className={`
                                px-4 py-1 text-xs font-bold font-orbitron transition-all
                                ${timeRange === range 
                                    ? 'bg-neon-green text-black shadow-[0_0_10px_rgba(57,255,20,0.4)]' 
                                    : 'text-neon-green/60 hover:text-neon-green hover:bg-neon-green/10'}
                            `}
                        >
                            {range}
                        </button>
                    ))}
                </div>
            </div>

            {/* Strength Chart */}
            <div className="hud-card relative overflow-hidden">
                <div className="absolute top-0 right-0 p-2 opacity-20">
                    <Activity size={100} className="text-neon-green" />
                </div>
                
                <div className="flex items-center justify-between mb-8 relative z-10">
                    <h2 className="text-xl font-orbitron text-white flex items-center gap-2">
                        <TrendingUp className="text-neon-green" size={20} />
                        STRENGTH <span className="text-neon-green">VECTOR</span>
                    </h2>
                    <div className="flex gap-4 text-xs font-mono">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-neon-blue shadow-[0_0_5px_#00f3ff]"></div>
                            <span className="text-neon-blue">SQUAT</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-alert-red shadow-[0_0_5px_#ff2a2a]"></div>
                            <span className="text-alert-red">DEADLIFT</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-neon-green shadow-[0_0_5px_#39ff14]"></div>
                            <span className="text-neon-green">BENCH</span>
                        </div>
                    </div>
                </div>

                <div className="h-[400px] w-full relative z-10">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={strengthData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(57, 255, 20, 0.1)" />
                            <XAxis
                                dataKey="date"
                                stroke="#39ff14"
                                tickLine={false}
                                axisLine={{ stroke: '#39ff14', opacity: 0.3 }}
                                tick={{ fill: '#39ff14', fontSize: 10, fontFamily: 'Orbitron', opacity: 0.7 }}
                                dy={10}
                            />
                            <YAxis
                                stroke="#39ff14"
                                tickLine={false}
                                axisLine={{ stroke: '#39ff14', opacity: 0.3 }}
                                tick={{ fill: '#39ff14', fontSize: 10, fontFamily: 'Orbitron', opacity: 0.7 }}
                                dx={-10}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Line
                                type="monotone"
                                dataKey="squat"
                                stroke="#00f3ff"
                                strokeWidth={2}
                                dot={{ r: 3, fill: '#00f3ff', strokeWidth: 0 }}
                                activeDot={{ r: 6, stroke: '#00f3ff', strokeWidth: 2, fill: '#000' }}
                            />
                            <Line
                                type="monotone"
                                dataKey="deadlift"
                                stroke="#ff2a2a"
                                strokeWidth={2}
                                dot={{ r: 3, fill: '#ff2a2a', strokeWidth: 0 }}
                                activeDot={{ r: 6, stroke: '#ff2a2a', strokeWidth: 2, fill: '#000' }}
                            />
                            <Line
                                type="monotone"
                                dataKey="bench"
                                stroke="#39ff14"
                                strokeWidth={2}
                                dot={{ r: 3, fill: '#39ff14', strokeWidth: 0 }}
                                activeDot={{ r: 6, stroke: '#39ff14', strokeWidth: 2, fill: '#000' }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Volume Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="hud-card lg:col-span-2">
                    <h2 className="text-xl font-orbitron text-white mb-6 flex items-center gap-2">
                        <Database className="text-neon-green" size={20} />
                        VOLUME <span className="text-neon-green">LOAD</span>
                    </h2>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={volumeData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(57, 255, 20, 0.1)" vertical={false} />
                                <XAxis
                                    dataKey="week"
                                    stroke="#39ff14"
                                    tickLine={false}
                                    axisLine={{ stroke: '#39ff14', opacity: 0.3 }}
                                    tick={{ fill: '#39ff14', fontSize: 10, fontFamily: 'Orbitron', opacity: 0.7 }}
                                    dy={10}
                                />
                                <YAxis
                                    stroke="#39ff14"
                                    tickLine={false}
                                    axisLine={{ stroke: '#39ff14', opacity: 0.3 }}
                                    tick={{ fill: '#39ff14', fontSize: 10, fontFamily: 'Orbitron', opacity: 0.7 }}
                                    dx={-10}
                                />
                                <Tooltip cursor={{ fill: 'rgba(57, 255, 20, 0.05)' }} content={<CustomTooltip />} />
                                <Bar dataKey="volume" fill="#39ff14" radius={[2, 2, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* PRs Card */}
                <div className="hud-card flex flex-col">
                    <h2 className="text-xl font-orbitron text-white mb-6 flex items-center gap-2">
                        <Cpu className="text-neon-green" size={20} />
                        RECORDS
                    </h2>
                    <div className="space-y-4 flex-1">
                        {[
                            { lift: 'Deadlift', weight: '405 LBS', date: '2 DAYS AGO', color: 'text-alert-red' },
                            { lift: 'Squat', weight: '315 LBS', date: '1 WEEK AGO', color: 'text-neon-blue' },
                            { lift: 'Bench Press', weight: '225 LBS', date: '2 WEEKS AGO', color: 'text-neon-green' },
                        ].map((pr, i) => (
                            <div key={i} className="flex items-center justify-between p-4 border border-neon-green/20 bg-black/40 hover:border-neon-green hover:bg-neon-green/5 transition-all group">
                                <div>
                                    <p className="font-orbitron text-lg text-white tracking-wide group-hover:text-neon-green transition-colors">{pr.lift}</p>
                                    <p className="text-[10px] text-neon-green/50 font-mono uppercase tracking-widest">{pr.date}</p>
                                </div>
                                <div className={`flex items-center gap-1 font-bold text-xl font-orbitron ${pr.color}`}>
                                    {pr.weight}
                                    <ArrowUpRight size={16} />
                                </div>
                            </div>
                        ))}
                    </div>

                    <button className="btn-hud w-full mt-6 text-xs flex items-center justify-center gap-2">
                        ACCESS ARCHIVES
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Progress;
