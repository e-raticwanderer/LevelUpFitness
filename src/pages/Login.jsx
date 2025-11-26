import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, User, Fingerprint, Scan } from 'lucide-react';

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [scanning, setScanning] = useState(false);

    const handleLogin = (role) => {
        setScanning(true);
        setTimeout(() => {
            login(role, role === 'trainer' ? 'trainer-1' : 'client-1', role === 'trainer' ? 'Commander Shepard' : 'John Doe');
            navigate(role === 'trainer' ? '/trainer' : '/');
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-hud-black flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Grid */}
            <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none"></div>
            <div className="absolute inset-0 bg-scanline opacity-10 pointer-events-none"></div>

            <div className="hud-card max-w-md w-full p-8 relative z-10 border-neon-green/30 shadow-[0_0_50px_rgba(57,255,20,0.1)]">
                <div className="text-center mb-10">
                    <div className="w-20 h-20 mx-auto mb-4 border-2 border-neon-green rounded-full flex items-center justify-center relative">
                        <Fingerprint size={48} className={`text-neon-green ${scanning ? 'animate-pulse' : ''}`} />
                        {scanning && (
                            <div className="absolute inset-0 border-2 border-neon-green rounded-full animate-ping opacity-50"></div>
                        )}
                    </div>
                    <h1 className="text-3xl font-orbitron text-white tracking-widest mb-2">SYSTEM ACCESS</h1>
                    <p className="text-neon-green/60 font-mono text-xs uppercase tracking-[0.2em]">
                        {scanning ? 'VERIFYING BIOMETRICS...' : 'IDENTIFICATION REQUIRED'}
                    </p>
                </div>

                <div className="space-y-4">
                    <button
                        onClick={() => handleLogin('client')}
                        disabled={scanning}
                        className="w-full group relative overflow-hidden p-4 bg-black/40 border border-neon-green/30 hover:border-neon-green hover:bg-neon-green/10 transition-all duration-300 clip-path-polygon"
                        style={{ clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' }}
                    >
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-neon-green/10 text-neon-green rounded-sm group-hover:bg-neon-green group-hover:text-black transition-colors">
                                <User size={24} />
                            </div>
                            <div className="text-left">
                                <h3 className="font-orbitron text-white text-lg tracking-wide group-hover:text-neon-green transition-colors">OPERATIVE</h3>
                                <p className="text-xs text-gray-500 font-mono">CLIENT ACCESS LEVEL 1</p>
                            </div>
                        </div>
                    </button>

                    <button
                        onClick={() => handleLogin('trainer')}
                        disabled={scanning}
                        className="w-full group relative overflow-hidden p-4 bg-black/40 border border-neon-blue/30 hover:border-neon-blue hover:bg-neon-blue/10 transition-all duration-300 clip-path-polygon"
                        style={{ clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' }}
                    >
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-neon-blue/10 text-neon-blue rounded-sm group-hover:bg-neon-blue group-hover:text-black transition-colors">
                                <Shield size={24} />
                            </div>
                            <div className="text-left">
                                <h3 className="font-orbitron text-white text-lg tracking-wide group-hover:text-neon-blue transition-colors">COMMANDER</h3>
                                <p className="text-xs text-gray-500 font-mono">TRAINER ACCESS LEVEL 5</p>
                            </div>
                        </div>
                    </button>
                </div>

                <div className="mt-8 pt-6 border-t border-white/5 text-center">
                    <p className="text-[10px] text-gray-600 font-mono uppercase tracking-widest">
                        SECURE CONNECTION ESTABLISHED <span className="text-neon-green">●</span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
