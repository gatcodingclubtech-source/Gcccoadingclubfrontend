import React, { useState, useEffect } from 'react';
import { 
  Plus, Users, Trash2, Edit2, 
  Search, Shield, CheckCircle2, XCircle, 
  Save, X, Filter, ChevronDown, MoreVertical,
  Mail, Phone, Calendar, User, MapPin,
  Lock, Key, Power
} from 'lucide-react';
import axios from 'axios';

export default function UsersManager() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterRole, setFilterRole] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/users');
      if (res.data.success) {
        setUsers(res.data.users);
      }
    } catch (err) {
      console.error('Error fetching users', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this member?')) {
      try {
        const res = await axios.delete(`/api/users/${id}`);
        if (res.data.success) {
          setUsers(users.filter(u => u._id !== id));
        }
      } catch (err) {
        const message = err.response?.data?.message || 'Delete failed';
        alert(message);
      }
    }
  };

  const handleRoleToggle = async (id, currentRole) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    try {
      const res = await axios.patch(`/api/users/${id}/role`, { role: newRole });
      if (res.data.success) {
        setUsers(users.map(u => u._id === id ? { ...u, role: newRole } : u));
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Role update failed';
      alert(message);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesSearch = 
      user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.usn?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRole && matchesSearch;
  });

  return (
    <div className="flex flex-col gap-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Member List</h1>
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">Manage your community members and their roles.</p>
        </div>
        
        <div className="flex items-center gap-4 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl p-2 rounded-2xl border border-black/5 dark:border-white/5 shadow-xl shadow-black/5">
          <div className="flex items-center gap-3 px-5 py-3 bg-black/5 dark:bg-white/5 rounded-xl border border-black/5 dark:border-white/5">
            <Search className="w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search members..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-[11px] font-black uppercase tracking-widest text-slate-900 dark:text-white w-40 md:w-64"
            />
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 py-5 px-6 md:px-8 glass-panel">
        <span className="text-[10px] font-black uppercase text-slate-500 flex items-center gap-3">
          <Filter className="w-4 h-4" /> Filter Status:
        </span>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
          {['all', 'admin', 'user'].map((role) => (
            <button 
              key={role}
              onClick={() => setFilterRole(role)}
              className={`px-6 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border ${
                filterRole === role 
                  ? 'bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-500/20' 
                  : 'bg-black/5 dark:bg-white/5 text-slate-500 border-transparent hover:bg-black/10 dark:hover:bg-white/10'
              }`}
            >
              {role}
            </button>
          ))}
        </div>
        
        <div className="sm:ml-auto flex items-center gap-3">
          <span className="text-[10px] font-black uppercase text-slate-400">Total: {filteredUsers.length}</span>
        </div>
      </div>

      {/* Users Table */}
      <div className="glass-panel overflow-hidden border border-black/5 dark:border-white/5 shadow-2xl">
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-emerald-500/20 scrollbar-track-transparent">
          <table className="w-full min-w-[700px] text-left">
            <thead>
              <tr className="border-b border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-white/[0.02]">
                <th className="px-4 md:px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Member</th>
                <th className="px-4 md:px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Details</th>
                <th className="px-4 md:px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Role</th>
                <th className="px-4 md:px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5 dark:divide-white/5">
              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan="4" className="px-8 py-6">
                      <div className="h-10 bg-black/5 dark:bg-white/5 rounded-xl w-full" />
                    </td>
                  </tr>
                ))
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-8 py-24 text-center">
                    <div className="flex flex-col items-center gap-4 opacity-30">
                      <Users className="w-12 h-12" />
                      <span className="text-[10px] font-black uppercase tracking-[0.3em]">No members found</span>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user._id} className="group hover:bg-black/[0.01] dark:hover:bg-white/[0.01] transition-all">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-5">
                        <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-white/5 border border-black/5 dark:border-white/10 flex items-center justify-center p-0.5 overflow-hidden shadow-sm shrink-0">
                          {user.avatar ? (
                            <img src={user.avatar} className="w-full h-full object-cover rounded-xl" />
                          ) : (
                            <User className="w-6 h-6 text-slate-400" />
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[11px] font-black uppercase tracking-tight text-slate-900 dark:text-white truncate max-w-[120px] md:max-w-none">
                            {user.name}
                          </span>
                          <span className="text-[9px] text-slate-500 font-medium lowercase truncate max-w-[120px] md:max-w-none">
                            {user.usn || 'NO USN'}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs text-slate-700 dark:text-slate-300 font-bold truncate max-w-[150px]">{user.email}</span>
                        <span className="text-[9px] text-emerald-500 font-black uppercase tracking-widest">{user.department || 'Department Pending'}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <button 
                        onClick={() => handleRoleToggle(user._id, user.role)}
                        className={`flex items-center gap-3 px-4 py-2 rounded-xl border transition-all ${
                          user.role === 'admin' 
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500 shadow-lg shadow-emerald-500/5' 
                            : 'bg-black/5 dark:bg-white/5 border-transparent text-slate-500 hover:border-emerald-500/30 hover:text-emerald-500'
                        }`}
                      >
                        <Shield className={`w-3.5 h-3.5 ${user.role === 'admin' ? 'animate-pulse' : ''}`} />
                        <span className="text-[10px] font-black uppercase tracking-widest">{user.role}</span>
                      </button>
                    </td>
                    <td className="px-4 md:px-8 py-6 text-right sticky right-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
                      <div className="flex items-center justify-end gap-3">
                        <button 
                          onClick={() => handleDelete(user._id)}
                          className="p-3 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button className="p-3 rounded-xl text-slate-400 hover:text-emerald-500 hover:bg-emerald-500/10 transition-all shadow-sm">
                          <MoreVertical className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
