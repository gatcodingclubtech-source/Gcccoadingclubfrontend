import React, { useState, useEffect } from 'react';
import { 
  Search, MoreVertical, Trash2, Shield, User, 
  Filter, Download, ChevronLeft, ChevronRight 
} from 'lucide-react';
import axios from 'axios';

export default function UsersManager() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');

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
    if (window.confirm('Terminate this terminal access permanently?')) {
      try {
        const res = await axios.delete(`/api/users/${id}`);
        if (res.data.success) {
          setUsers(users.filter(u => u._id !== id));
        }
      } catch (err) {
        alert('Failed to delete user');
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
      alert('Failed to update role');
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (user.usn && user.usn.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="flex flex-col gap-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Terminal Directory</h1>
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">Manage all active user nodes and permissions.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <button className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 text-slate-400 hover:text-emerald-500 hover:bg-emerald-500/10 transition-all shadow-sm">
            <Download className="w-5 h-5" />
          </button>
          <div className="relative group flex-1 md:flex-none">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Search USN, Name, Email..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl pl-14 pr-6 py-4 text-[11px] text-slate-900 dark:text-white outline-none focus:border-emerald-500/50 transition-all w-full md:w-80 font-black uppercase tracking-widest shadow-inner"
            />
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-6 py-5 px-8 glass-panel">
        <span className="text-[10px] font-black uppercase text-slate-500 flex items-center gap-3">
          <Filter className="w-4 h-4" /> Filter Status:
        </span>
        <div className="flex gap-3">
          {['all', 'admin', 'user'].map((role) => (
            <button 
              key={role}
              onClick={() => setFilterRole(role)}
              className={`px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] transition-all border ${
                filterRole === role 
                  ? 'bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-500/20' 
                  : 'bg-black/5 dark:bg-white/5 text-slate-500 border-transparent hover:bg-black/10 dark:hover:bg-white/10'
              }`}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className="glass-panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-white/[0.02]">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Identify</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Terminal Auth</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Sync Level</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5 dark:divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan="4" className="py-24 text-center">
                    <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-6" />
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Syncing Nodes...</span>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="4" className="py-24 text-center">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest opacity-40">No matching terminals found in database</span>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user._id} className="group hover:bg-black/[0.01] dark:hover:bg-white/[0.01] transition-all">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-5">
                        <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-white/5 border border-black/5 dark:border-white/10 flex items-center justify-center p-0.5 overflow-hidden shadow-sm">
                          {user.avatar ? (
                            <img src={user.avatar} className="w-full h-full object-cover rounded-xl" />
                          ) : (
                            <User className="w-6 h-6 text-slate-400" />
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-black text-slate-900 dark:text-white group-hover:text-emerald-500 transition-colors leading-tight">{user.name}</span>
                          <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-0.5">{user.usn || 'NO_USN_FOUND'}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs text-slate-700 dark:text-slate-300 font-bold">{user.email}</span>
                        <span className="text-[9px] text-emerald-500 font-black uppercase tracking-widest">{user.department || 'DEPT_PENDING'}</span>
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
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button 
                          onClick={() => handleDelete(user._id)}
                          className="p-3 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-500/10 transition-all shadow-sm"
                        >
                          <Trash2 className="w-5 h-5" />
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
        
        {/* Pagination */}
        <div className="px-8 py-6 border-t border-black/5 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6">
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
            Showing {filteredUsers.length} of {users.length} active nodes
          </span>
          <div className="flex items-center gap-3">
            <button className="p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 text-slate-400 disabled:opacity-30 hover:bg-emerald-500/10 hover:text-emerald-500 transition-all">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex gap-1">
               <span className="w-8 h-8 flex items-center justify-center rounded-lg bg-emerald-500 text-white text-[10px] font-black">1</span>
            </div>
            <button className="p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 text-slate-400 disabled:opacity-30 hover:bg-emerald-500/10 hover:text-emerald-500 transition-all">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
