import React, { createContext, useState, useContext, useEffect } from 'react';
import apiClient from '../services/apiClient';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function init() {
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    // Try to get current user from backend
                    const me = await apiClient.getMe();
                    setUser(me);
                } else {
                    const storedUser = localStorage.getItem('codeMaster_user');
                    if (storedUser) setUser(JSON.parse(storedUser));
                }
            } catch (err) {
                console.warn('Auth init failed:', err.message);
            } finally {
                setLoading(false);
            }
        }
        init();
    }, []);

    // Register with backend
    const register = async ({ name, email, password, role = 'client' }) => {
        const data = await apiClient.register(name, email, password, role);
        if (data && data.user) {
            setUser(data.user);
            localStorage.setItem('codeMaster_user', JSON.stringify(data.user));
        }
        return data;
    };

    // Login with backend
    const login = async ({ email, password, role, demoId, demoName } = {}) => {
        // If email/password provided, call backend; otherwise allow demo login
        if (email && password) {
            const data = await apiClient.login(email, password);
            if (data && data.user) {
                setUser(data.user);
                localStorage.setItem('codeMaster_user', JSON.stringify(data.user));
            }
            return data;
        }

        // Demo/login-by-role (existing behaviour)
        const userData = { role: role || 'client', id: demoId || (role === 'trainer' ? 'trainer-1' : 'client-1'), name: demoName || (role === 'trainer' ? 'Demo Trainer' : 'Demo Client') };
        setUser(userData);
        localStorage.setItem('codeMaster_user', JSON.stringify(userData));
        return { user: userData };
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('codeMaster_user');
        apiClient.logout();
    };

    // Update user profile fields (avatar, bio, notes, name, etc.)
    const updateProfile = async (id, updates) => {
        try {
            const updated = await apiClient.updateUser(id, updates);
            if (updated) {
                setUser(updated);
                localStorage.setItem('codeMaster_user', JSON.stringify(updated));
            }
            return updated;
        } catch (err) {
            console.error('Profile update failed', err);
            throw err;
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, register, updateProfile, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
