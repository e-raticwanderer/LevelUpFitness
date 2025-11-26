import React from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Dumbbell, Calendar, TrendingUp, Cpu, Users, Shield } from 'lucide-react';
import XpBar from './XpBar';
import LevelUpModal from './LevelUpModal';

const Layout = () => {
  const location = useLocation();
  const { user } = useAuth();

  const clientNavItems = [
    { icon: LayoutDashboard, label: 'SYSTEM', path: '/' },
    { icon: Dumbbell, label: 'ARMORY', path: '/workouts' },
    { icon: Calendar, label: 'MISSION', path: '/plan' },
    { icon: TrendingUp, label: 'STATS', path: '/progress' },
  ];

  const trainerNavItems = [
    { icon: LayoutDashboard, label: 'COMMAND', path: '/trainer' },
    { icon: Dumbbell, label: 'ARMORY', path: '/workouts' }, // Trainers also need access to library
  ];

  const navItems = user?.role === 'trainer' ? trainerNavItems : clientNavItems;

  return (
    <div className="min-h-screen bg-hud-black text-neon-green font-rajdhani relative overflow-hidden selection:bg-neon-green selection:text-black">
      
      <LevelUpModal />

      {/* Top HUD Bar */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-hud-dark border-b border-neon-green/30 z-50 flex items-center justify-between px-6 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <Cpu className="text-neon-green animate-pulse" />
          <span className="font-orbitron text-2xl font-bold tracking-widest text-white">
            LEVEL<span className="text-neon-green">UP</span>
          </span>
        </div>
        <div className="flex items-center gap-4 text-xs font-bold tracking-widest text-neon-green/60">
          <span>SYS.ONLINE</span>
          <span>V.2.1.0</span>
        </div>
      </header>

      {/* Side Navigation (Desktop) */}
      <nav className="fixed left-0 top-16 bottom-0 w-24 bg-hud-dark border-r border-neon-green/30 hidden md:flex flex-col items-center py-8 gap-8 z-40">
        
        {/* XP Bar in Sidebar */}
        <div className="w-full px-2 mb-4">
             <XpBar />
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.label}
              to={item.path}
              className={`group relative flex flex-col items-center gap-1 transition-all duration-300 ${isActive ? 'text-neon-green' : 'text-gray-500 hover:text-white'}`}
            >
              <div className={`p-3 rounded-sm border transition-all duration-300 ${isActive ? 'border-neon-green bg-neon-green/10 shadow-[0_0_10px_rgba(57,255,20,0.4)]' : 'border-transparent group-hover:border-white/20'}`}>
                <Icon size={24} />
              </div>
              <span className="text-[10px] font-bold tracking-widest opacity-0 group-hover:opacity-100 absolute left-16 bg-black border border-neon-green px-2 py-1 whitespace-nowrap transition-opacity z-50">
                {item.label}
              </span>
            </Link>
          )
        })}
      </nav>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-20 bg-hud-dark border-t border-neon-green/30 z-50 flex justify-around items-center px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.label}
              to={item.path}
              className={`flex flex-col items-center gap-1 ${isActive ? 'text-neon-green' : 'text-gray-600'}`}
            >
              <Icon size={24} className={isActive ? 'drop-shadow-[0_0_5px_rgba(57,255,20,0.8)]' : ''} />
              <span className="text-[10px] font-bold tracking-widest">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Main Content Area */}
      <main className="pt-20 pb-24 md:pl-28 md:pr-8 px-4 min-h-screen relative">
        {/* Grid Background Overlay */}
        <div className="fixed inset-0 bg-grid-pattern opacity-10 pointer-events-none z-0"></div>

        <div className="relative z-10 max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>

    </div>
  );
};

export default Layout;
