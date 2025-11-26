import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Activity, Shield, AlertTriangle, ChevronRight, Search } from 'lucide-react';
import { db } from '../services/db';

const ClientCard = ({ client, onEditProtocol, navigate }) => {
    const lastActive = new Date(client.joined); // Placeholder, ideally get from logs
    const isActive = client.status === 'Active';

    return (
        <div className="hud-card group hover:bg-neon-green/5 transition-all duration-300 border-l-4 border-l-transparent hover:border-l-neon-green">
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 border border-neon-green/30 bg-neon-green/5 flex items-center justify-center text-neon-green font-orbitron text-xl relative">
                        {client.name.charAt(0)}
                        {isActive && <div className="absolute top-0 right-0 w-2 h-2 bg-neon-green shadow-[0_0_5px_#39ff14]"></div>}
                    </div>
                    <div className="cursor-pointer" onClick={() => navigate(`/client/${client.id}`)}>
                        <h3 className="font-orbitron text-white text-lg tracking-wide group-hover:text-neon-green transition-colors">{client.name}</h3>
                        <p className="text-xs text-gray-500 font-mono">ID: {client.id.toUpperCase()}</p>
                    </div>
                </div>
                <div className={`px-2 py-1 text-[10px] font-bold uppercase tracking-widest border ${isActive ? 'border-neon-green text-neon-green bg-neon-green/10' : 'border-gray-600 text-gray-500'}`}>
                    {client.status}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="bg-black/40 p-2 border border-white/5">
                    <p className="text-[9px] text-gray-500 uppercase tracking-wider mb-1">COMPLIANCE</p>
                    <p className="text-neon-blue font-mono">92%</p>
                </div>
                <div className="bg-black/40 p-2 border border-white/5">
                    <p className="text-[9px] text-gray-500 uppercase tracking-wider mb-1">LAST ACTIVE</p>
                    <p className="text-white font-mono text-xs">2 DAYS AGO</p>
                </div>
            </div>

            <button
                onClick={() => onEditProtocol(client.id)}
                className="w-full btn-hud flex items-center justify-center gap-2 text-xs py-2"
            >
                <Shield size={14} /> EDIT PROTOCOL
            </button>
        </div>
    );
};

const TrainerDashboard = () => {
    const navigate = useNavigate();
    const [clients, setClients] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        setClients(db.getClients());
    }, []);

    const filteredClients = (clients || []).filter(c => 
        c.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neon-green/20 pb-6">
                <div>
                    <h1 className="text-3xl font-orbitron text-white mb-1">COMMAND <span className="text-neon-green">DECK</span></h1>
                    <p className="text-neon-green/60 font-mono text-xs tracking-widest uppercase">UNIT OVERSIGHT // ACTIVE AGENTS: {clients.length}</p>
                </div>
                
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neon-green/40" size={18} />
                    <input 
                        type="text" 
                        placeholder="SEARCH UNITS..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-black/40 border border-neon-green/30 text-white pl-10 pr-4 py-2 font-mono text-sm focus:outline-none focus:border-neon-green focus:shadow-[0_0_10px_rgba(57,255,20,0.2)] w-full md:w-64"
                    />
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="hud-card p-4 flex items-center justify-between bg-neon-green/5 border-neon-green/30">
                    <div>
                        <p className="text-neon-green/60 text-[10px] uppercase font-bold tracking-widest">TOTAL UNITS</p>
                        <p className="text-3xl font-orbitron text-white">{clients.length}</p>
                    </div>
                    <Users className="text-neon-green opacity-50" size={32} />
                </div>
                <div className="hud-card p-4 flex items-center justify-between">
                    <div>
                        <p className="text-neon-green/60 text-[10px] uppercase font-bold tracking-widest">ACTIVE MISSIONS</p>
                        <p className="text-3xl font-orbitron text-neon-blue">5</p>
                    </div>
                    <Activity className="text-neon-blue opacity-50" size={32} />
                </div>
                <div className="hud-card p-4 flex items-center justify-between">
                    <div>
                        <p className="text-neon-green/60 text-[10px] uppercase font-bold tracking-widest">CRITICAL ALERTS</p>
                        <p className="text-3xl font-orbitron text-alert-red">0</p>
                    </div>
                    <AlertTriangle className="text-alert-red opacity-50" size={32} />
                </div>
            </div>

            {/* Client Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredClients.map(client => (
                    <ClientCard 
                        key={client.id} 
                        client={client} 
                        onEditProtocol={(id) => navigate(`/trainer/protocol/${id}`)} 
                        navigate={navigate}
                    />
                ))}
            </div>
        </div>
    );
};

export default TrainerDashboard;
