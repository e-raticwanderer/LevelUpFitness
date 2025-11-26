
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { GamificationProvider } from './context/GamificationContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import WorkoutLibrary from './pages/WorkoutLibrary';
import ActivePlan from './pages/ActivePlan';
import Progress from './pages/Progress';
import ClientProfile from './pages/ClientProfile';
import Login from './pages/Login';
import TrainerDashboard from './pages/TrainerDashboard';
import ProtocolEditor from './pages/ProtocolEditor';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) return <div className="min-h-screen bg-hud-black flex items-center justify-center text-neon-green font-orbitron animate-pulse">INITIALIZING SYSTEM...</div>;

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        // Redirect if role doesn't match (e.g. client trying to access trainer area)
        return <Navigate to="/" replace />;
    }

    return children;
};

const App = () => {
    return (
        <AuthProvider>
            <GamificationProvider>
                <Router>
                    <Routes>
                    <Route path="/login" element={<Login />} />
                    
                    {/* Client Routes */}
                    <Route path="/" element={
                        <ProtectedRoute allowedRoles={['client', 'trainer']}>
                            <Layout />
                        </ProtectedRoute>
                    }>
                        <Route index element={<Dashboard />} />
                        <Route path="workouts" element={<WorkoutLibrary />} />
                        <Route path="plan" element={<ActivePlan />} />
                        <Route path="progress" element={<Progress />} />
                        <Route path="client/:id" element={<ClientProfile />} />
                        
                        {/* Trainer Routes */}
                        <Route path="trainer" element={
                            <ProtectedRoute allowedRoles={['trainer']}>
                                <TrainerDashboard />
                            </ProtectedRoute>
                        } />
                        <Route path="trainer/protocol/:clientId" element={
                            <ProtectedRoute allowedRoles={['trainer']}>
                                <ProtocolEditor />
                            </ProtectedRoute>
                        } />
                    </Route>
                </Routes>
            </Router>
            </GamificationProvider>
        </AuthProvider>
    );
};

export default App;
