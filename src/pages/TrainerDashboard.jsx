import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Activity, Shield, AlertTriangle, ChevronRight, Search, Filter, Download, Eye } from 'lucide-react';
import { getClients, getClientHistory } from '../services/db';
import { exportToCSV, exportToJSON } from '../services/exportUtils';

const ClientCard = ({ client, onEditProtocol, onViewProfile, navigate }) => {
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
                    <div className="cursor-pointer flex-1" onClick={() => onViewProfile && onViewProfile()}>
                        <h3 className="font-orbitron text-white text-lg tracking-wide group-hover:text-neon-green transition-colors">{client.name}</h3>
                        <p className="text-xs text-gray-500 font-mono">LVL {client.level} • {client.rank}</p>
                    </div>
                </div>
                <div className={`px-2 py-1 text-[10px] font-bold uppercase tracking-widest border ${isActive ? 'border-neon-green text-neon-green bg-neon-green/10' : 'border-gray-600 text-gray-500'}`}>
                    {client.status}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="bg-black/40 p-2 border border-white/5">
                    <p className="text-[9px] text-gray-500 uppercase tracking-wider mb-1">XP</p>
                    <p className="text-neon-blue font-mono">{client.xp}</p>
                </div>
                <div className="bg-black/40 p-2 border border-white/5">
                    <p className="text-[9px] text-gray-500 uppercase tracking-wider mb-1">JOINED</p>
                    <p className="text-white font-mono text-xs">{new Date(client.joined).toLocaleDateString()}</p>
                </div>
            </div>

            <div className="space-y-2">
                <button
                    onClick={() => onEditProtocol(client.id)}
                    className="w-full btn-hud flex items-center justify-center gap-2 text-xs py-2"
                >
                    <Shield size={14} /> EDIT PROTOCOL
                </button>
                <button
                    onClick={() => onViewProfile && onViewProfile()}
                    className="w-full btn-hud flex items-center justify-center gap-2 text-xs py-2"
                >
                    <Eye size={14} /> VIEW PROFILE
                </button>
            </div>
        </div>
    );
};

const TrainerDashboard = () => {
    const navigate = useNavigate();
    const [clients, setClients] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('name'); // 'name', 'status', 'joined', 'xp'
    const [filterStatus, setFilterStatus] = useState('All'); // 'All', 'Active', 'Inactive'
    const [selectedClient, setSelectedClient] = useState(null);

    useEffect(() => {
        setClients(getClients());
    }, []);

    // Filter and sort
    const filtered = clients.filter(c => {
        const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'All' || c.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const sorted = [...filtered].sort((a, b) => {
        switch (sortBy) {
            case 'name': return a.name.localeCompare(b.name);
            case 'status': return a.status.localeCompare(b.status);
            case 'joined': return new Date(b.joined) - new Date(a.joined);
            case 'xp': return b.xp - a.xp;
            default: return 0;
        }
    });

    const handleExport = (format) => {
        const data = sorted.map(c => ({
            Name: c.name,
            Email: c.email || 'N/A',
            Status: c.status,
            Joined: c.joined,
            XP: c.xp,
            Level: c.level,
            Rank: c.rank
        }));
        if (format === 'csv') {
            exportToCSV(data, 'clients_export.csv');
        } else if (format === 'json') {
            exportToJSON(data, 'clients_export.json');
        }
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neon-green/20 pb-6">
                <div>
                    <h1 className="text-3xl font-orbitron text-white mb-1">COMMAND <span className="text-neon-green">DECK</span></h1>
                    <p className="text-neon-green/60 font-mono text-xs tracking-widest uppercase">UNIT OVERSIGHT // ACTIVE AGENTS: {clients.length}</p>
                </div>
            </div>

            {/* Controls Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative md:col-span-2">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neon-green/40" size={18} />
                    <input 
                        type="text" 
                        placeholder="SEARCH UNITS..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-black/40 border border-neon-green/30 text-white pl-10 pr-4 py-2 font-mono text-sm focus:outline-none focus:border-neon-green focus:shadow-[0_0_10px_rgba(57,255,20,0.2)]"
                    />
                </div>

                <select 
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="bg-black/40 border border-neon-green/30 text-white px-4 py-2 font-mono text-sm focus:outline-none focus:border-neon-green"
                >
                    <option value="All">ALL STATUS</option>
                    <option value="Active">ACTIVE</option>
                    <option value="Inactive">INACTIVE</option>
                </select>

                <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-black/40 border border-neon-green/30 text-white px-4 py-2 font-mono text-sm focus:outline-none focus:border-neon-green"
                >
                    <option value="name">SORT: NAME</option>
                    <option value="status">SORT: STATUS</option>
                    <option value="joined">SORT: JOINED</option>
                    <option value="xp">SORT: XP</option>
                </select>
            </div>

            {/* Export Menu */}
            <div className="flex gap-2">
                <button
                    onClick={() => handleExport('csv')}
                    className="btn-hud flex items-center gap-2 text-xs py-2 px-4"
                >
                    <Download size={14} /> EXPORT CSV
                </button>
                <button
                    onClick={() => handleExport('json')}
                    className="btn-hud flex items-center gap-2 text-xs py-2 px-4"
                >
                    <Download size={14} /> EXPORT JSON
                </button>
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
                        <p className="text-neon-green/60 text-[10px] uppercase font-bold tracking-widest">FILTERED</p>
                        <p className="text-3xl font-orbitron text-neon-blue">{sorted.length}</p>
                    </div>
                    <Filter className="text-neon-blue opacity-50" size={32} />
                </div>
                <div className="hud-card p-4 flex items-center justify-between">
                    <div>
                        <p className="text-neon-green/60 text-[10px] uppercase font-bold tracking-widest">ACTIVE NOW</p>
                        <p className="text-3xl font-orbitron text-alert-red">{clients.filter(c => c.status === 'Active').length}</p>
                    </div>
                    <Activity className="text-alert-red opacity-50" size={32} />
                </div>
            </div>

            {/* Client Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sorted.map(client => (
                    <ClientCard 
                        key={client.id} 
                        client={client} 
                        onEditProtocol={(id) => navigate(`/trainer/protocol/${id}`)} 
                        onViewProfile={() => navigate(`/client/${client.id}`)}
                        navigate={navigate}
                    />
                ))}
            </div>
        </div>
    );
};

export default TrainerDashboard;
