import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import apiClient from '../services/apiClient';

const AVATAR_OPTIONS = Array.from({ length: 10 }).map((_, i) => `/avatars/avatar0${i+1}.svg`);

const Settings = () => {
  const { user, updateProfile } = useAuth();
  const [profile, setProfile] = useState({});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const containerRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        if (!user) return;
        const full = await apiClient.getUser(user.id || user._id || user.id);
        if (mounted) setProfile(full || {});
      } catch (err) {
        console.warn('Failed to load user profile', err.message);
      }
    }
    load();
    return () => { mounted = false; };
  }, [user]);

  const handleAvatarSelect = (url) => {
    setProfile(p => ({ ...p, avatar: url }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    setMessage('');
    try {
      const updates = {
        avatar: profile.avatar || '',
        bio: profile.bio || '',
        notes: profile.notes || '',
        name: profile.name || ''
      };
      const updated = await updateProfile(user.id || user._id || user.id, updates);
      setProfile(updated);
      setMessage('Saved');
    } catch (err) {
      setMessage('Save failed');
    } finally {
      setSaving(false);
      setTimeout(()=>setMessage(''), 2500);
    }
  };

  // Keyboard accessibility: arrow keys navigate avatar options
  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;
    function onKey(e) {
      const focus = document.activeElement;
      if (focus && focus.dataset && focus.dataset.avatarIndex) {
        const idx = Number(focus.dataset.avatarIndex);
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
          const next = Math.min(AVATAR_OPTIONS.length - 1, idx + 1);
          const el = node.querySelector(`[data-avatar-index="${next}"]`);
          el?.focus();
          e.preventDefault();
        }
        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
          const prev = Math.max(0, idx - 1);
          const el = node.querySelector(`[data-avatar-index="${prev}"]`);
          el?.focus();
          e.preventDefault();
        }
      }
    }
    node.addEventListener('keydown', onKey);
    return () => node.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div className="bg-hud-dark p-6 rounded-md border border-neon-green/20">
      <h2 className="text-xl font-orbitron text-white mb-4">Settings</h2>

      <form onSubmit={handleSave} className="space-y-4" aria-labelledby="settings-heading">
        <div>
          <label className="block text-sm text-gray-300 mb-2">Display name</label>
          <input className="w-full p-2 bg-black/30 border border-white/5 rounded text-white" value={profile.name || ''} onChange={e=>setProfile(p=>({...p,name:e.target.value}))} />
        </div>

        <div>
          <label className="block text-sm text-gray-300 mb-2">Select avatar</label>
          <div ref={containerRef} className="grid grid-cols-4 gap-2" role="list" aria-label="Avatar choices">
            {AVATAR_OPTIONS.map((url, idx) => (
              <button
                key={url}
                type="button"
                data-avatar-index={idx}
                onClick={() => handleAvatarSelect(url)}
                className={`p-1 border rounded ${profile.avatar === url ? 'border-neon-green' : 'border-transparent'}`}
                aria-pressed={profile.avatar === url}
                title={`Select avatar ${idx+1}`}
                style={{ backgroundImage: `url(${url})`, backgroundSize: 'cover', height: 64, width: 64 }}
              />
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-300 mb-2">Bio</label>
          <textarea value={profile.bio || ''} onChange={e=>setProfile(p=>({...p,bio:e.target.value}))} rows={4} className="w-full p-2 bg-black/30 border border-white/5 rounded text-white" />
        </div>

        <div>
          <label className="block text-sm text-gray-300 mb-2">Notes</label>
          <textarea value={profile.notes || ''} onChange={e=>setProfile(p=>({...p,notes:e.target.value}))} rows={3} className="w-full p-2 bg-black/30 border border-white/5 rounded text-white" />
        </div>

        <div className="flex items-center gap-3">
          <button type="submit" disabled={saving} className="px-4 py-2 bg-neon-green text-black rounded">{saving ? 'Saving...' : 'Save changes'}</button>
          <div className="text-sm text-gray-400">{message}</div>
        </div>
      </form>
    </div>
  );
};

export default Settings;
