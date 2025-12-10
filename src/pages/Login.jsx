import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, User, Fingerprint, Scan } from 'lucide-react';

const Login = () => {
    const { login, register } = useAuth();
    const navigate = useNavigate();
    const [scanning, setScanning] = useState(false);
    const [selectedRole, setSelectedRole] = useState(null);
    const [mode, setMode] = useState('login'); // 'login' | 'register'
    const [form, setForm] = useState({ name: '', email: '', password: '' });
    const [submitting, setSubmitting] = useState(false);

    const handleDemoLogin = (role) => {
        setScanning(true);
        setTimeout(async () => {
            await login({ role, demoId: role === 'trainer' ? 'trainer-1' : 'client-1', demoName: role === 'trainer' ? 'Commander Shepard' : 'John Doe' });
            navigate(role === 'trainer' ? '/trainer' : '/');
        }, 800);
    };

    const submitAuth = async (e) => {
        e.preventDefault();
        if (!selectedRole) return;
        setSubmitting(true);
        try {
            if (mode === 'register') {
                await register({ name: form.name, email: form.email, password: form.password, role: selectedRole });
                navigate(selectedRole === 'trainer' ? '/trainer' : '/');
            } else {
                await login({ email: form.email, password: form.password });
                navigate(selectedRole === 'trainer' ? '/trainer' : '/');
            }
        } catch (err) {
            console.error('Auth error', err);
            // In a real UI we'd show a message
        } finally {
            setSubmitting(false);
        }
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
                        {!selectedRole ? (
                            <>
                                <button
                                    onClick={() => setSelectedRole('client')}
                                    disabled={scanning}
                                    className="w-full group relative overflow-hidden p-4 bg-black/40 border border-neon-green/30 hover:border-neon-green hover:bg-neon-green/10 transition-all duration-300"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="p-2 bg-neon-green/10 text-neon-green rounded-sm">
                                            <User size={24} />
                                        </div>
                                        <div className="text-left">
                                            <h3 className="font-orbitron text-white text-lg tracking-wide">OPERATIVE</h3>
                                            <p className="text-xs text-gray-500 font-mono">CLIENT ACCESS</p>
                                        </div>
                                    </div>
                                </button>

                                <button
                                    onClick={() => setSelectedRole('trainer')}
                                    disabled={scanning}
                                    className="w-full group relative overflow-hidden p-4 bg-black/40 border border-neon-blue/30 hover:border-neon-blue hover:bg-neon-blue/10 transition-all duration-300"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="p-2 bg-neon-blue/10 text-neon-blue rounded-sm">
                                            <Shield size={24} />
                                        </div>
                                        <div className="text-left">
                                            <h3 className="font-orbitron text-white text-lg tracking-wide">COMMANDER</h3>
                                            <p className="text-xs text-gray-500 font-mono">TRAINER ACCESS</p>
                                        </div>
                                    </div>
                                </button>
                            </>
                        ) : (
                            <div>
                                {/* Portal mode switch */}
                                <div className="flex justify-between items-center mb-4">
                                    <div className="font-mono text-xs text-gray-400">Portal: <span className="text-white">{selectedRole === 'trainer' ? 'Trainer' : 'Client'}</span></div>
                                    <div className="flex gap-2">
                                        <button onClick={() => setMode('login')} className={`px-3 py-1 text-xs rounded ${mode==='login' ? 'bg-neon-green text-black' : 'border border-white/5 text-white'}`}>Login</button>
                                        <button onClick={() => setMode('register')} className={`px-3 py-1 text-xs rounded ${mode==='register' ? 'bg-neon-blue text-black' : 'border border-white/5 text-white'}`}>Register</button>
                                    </div>
                                </div>

                                <form onSubmit={submitAuth} className="space-y-3">
                                    {mode === 'register' && (
                                        <input value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} required placeholder="Full name" className="w-full p-2 bg-black/30 border border-white/5 text-white rounded" />
                                    )}
                                    <input value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} required placeholder="Email" type="email" className="w-full p-2 bg-black/30 border border-white/5 text-white rounded" />
                                    <input value={form.password} onChange={e=>setForm(f=>({...f,password:e.target.value}))} required placeholder="Password" type="password" className="w-full p-2 bg-black/30 border border-white/5 text-white rounded" />
                                    <div className="flex gap-2">
                                        <button type="submit" disabled={submitting} className="flex-1 p-2 bg-neon-green text-black rounded">{mode==='register' ? 'Create account' : 'Sign in'}</button>
                                        <button type="button" onClick={()=>{ setSelectedRole(null); setForm({name:'',email:'',password:''}); setMode('login'); }} className="p-2 border border-white/10 rounded">Back</button>
                                    </div>
                                    <div className="text-center text-xs text-gray-500">or</div>
                                    <div className="flex gap-2">
                                        <button type="button" onClick={()=>handleDemoLogin(selectedRole)} className="flex-1 p-2 border border-white/10 rounded">Quick Demo</button>
                                    </div>
                                </form>
                            </div>
                        )}
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
