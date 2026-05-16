import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Medal, Crown, Zap, TrendingUp, Users, Search, Filter, ArrowUp, Award, Terminal } from 'lucide-react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Magnetic from '../components/Magnetic';

export default function Leaderboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('xp'); // xp, streak, contributions
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchLeaderboard();
  }, [filter]);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/users/leaderboard?type=${filter}`);
      if (res.data.success) {
        setUsers(res.data.users || []);
      }
    } catch (err) {
      console.error('Failed to fetch leaderboard');
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = (users || []).filter(user => 
    user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (user.usn && user.usn.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 pt-32 pb-20 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
           <div className="max-w-2xl">
              <div className="flex items-center gap-3 mb-4">
                 <div className="px-4 py-1.5 bg-emerald-500/10 rounded-full border border-emerald-500/20 text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-2">
                    <Crown className="w-3 h-3" /> Hall of Fame
                 </div>
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic leading-none">
                 Global <span className="text-emerald-500">Rankings.</span>
              </h1>
              <p className="text-slate-500 dark:text-slate-400 font-medium text-sm md:text-lg mt-6 leading-relaxed">
                 The elite performance metrics of the GCC Ecosystem. Compete, contribute, and ascend to the Legend status.
              </p>
           </div>

           {/* Quick Stats Cards */}
           <div className="flex gap-4">
              <div className="p-6 bg-slate-50 dark:bg-white/5 rounded-[2rem] border border-black/5 dark:border-white/5 flex flex-col gap-2 min-w-[150px]">
                 <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Members</span>
                 <span className="text-2xl font-black text-slate-900 dark:text-white">1.2K+</span>
              </div>
              <div className="p-6 bg-emerald-500 rounded-[2rem] flex flex-col gap-2 min-w-[150px] shadow-2xl shadow-emerald-500/20">
                 <span className="text-[10px] font-bold text-emerald-100 uppercase tracking-widest">Active Today</span>
                 <span className="text-2xl font-black text-white">450+</span>
              </div>
           </div>
        </div>

        {/* CONTROLS */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 mb-12">
           {/* Tab Switcher */}
           <div className="flex p-1.5 bg-slate-100 dark:bg-white/5 rounded-2xl border border-black/5 dark:border-white/5 w-full lg:w-auto">
              {[
                { id: 'xp', label: 'Overall XP', icon: <Trophy className="w-3.5 h-3.5" /> },
                { id: 'streak', label: 'Streaks', icon: <Zap className="w-3.5 h-3.5" /> },
                { id: 'contributions', label: 'Debates', icon: <MessageSquare className="w-3.5 h-3.5" /> }
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setFilter(t.id)}
                  className={`flex-1 lg:flex-none px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${
                    filter === t.id 
                    ? 'bg-white dark:bg-slate-900 text-emerald-500 shadow-xl' 
                    : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                  }`}
                >
                  {t.icon} {t.label}
                </button>
              ))}
           </div>

           {/* Search & Actions */}
           <div className="flex items-center gap-4 w-full lg:w-auto">
              <div className="relative flex-1 lg:w-80">
                 <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                 <input 
                   type="text" 
                   placeholder="Search developer or USN..."
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                   className="w-full bg-slate-50 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl pl-12 pr-6 py-4 text-xs font-bold outline-none focus:border-emerald-500 transition-all text-slate-900 dark:text-white"
                 />
              </div>
              <button className="p-4 bg-slate-900 dark:bg-white text-white dark:text-slate-950 rounded-2xl hover:scale-105 transition-all shadow-xl">
                 <Filter className="w-4 h-4" />
              </button>
           </div>
        </div>

        {/* LEADERBOARD LIST */}
        <div className="relative">
           {loading ? (
             <div className="py-20 flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Compiling Rankings...</span>
             </div>
           ) : (
             <div className="flex flex-col gap-4">
                <AnimatePresence mode="popLayout">
                  {filteredUsers.map((user, index) => (
                    <motion.div
                      key={user._id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: index * 0.05 }}
                      className={`group relative flex items-center justify-between p-6 rounded-[2.5rem] border transition-all duration-500 ${
                        index === 0 
                        ? 'bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent border-emerald-500/20' 
                        : 'bg-white dark:bg-white/5 border-black/5 dark:border-white/5 hover:border-emerald-500/30'
                      }`}
                    >
                      <div className="flex items-center gap-6 md:gap-10">
                         {/* Rank Number / Icon */}
                         <div className="w-10 flex items-center justify-center">
                            {index === 0 && <Crown className="w-8 h-8 text-yellow-500 filter drop-shadow-lg" />}
                            {index === 1 && <Medal className="w-7 h-7 text-slate-400" />}
                            {index === 2 && <Medal className="w-7 h-7 text-amber-600" />}
                            {index > 2 && <span className="text-lg font-black text-slate-300 dark:text-slate-700 italic">#{index + 1}</span>}
                         </div>

                         {/* User Info */}
                         <Link to={`/profile/${user._id}`} className="flex items-center gap-4 group/user">
                            <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 p-0.5 border border-black/5 overflow-hidden">
                               {user.avatar ? (
                                 <img src={user.avatar} alt={user.name} className="w-full h-full object-cover rounded-[0.9rem]" />
                               ) : (
                                 <div className="w-full h-full flex items-center justify-center rounded-[0.9rem]">
                                    <Users className="w-6 h-6 text-slate-400" />
                                 </div>
                               )}
                            </div>
                            <div className="flex flex-col">
                               <h3 className="text-sm md:text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight group-hover/user:text-emerald-500 transition-colors">
                                 {user.name}
                               </h3>
                               <div className="flex items-center gap-3 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                                  <span className="flex items-center gap-1"><Terminal className="w-3 h-3" /> {user.usn || 'GCC MEMBER'}</span>
                                  <span className="hidden md:flex items-center gap-1"><Zap className="w-3 h-3 text-emerald-500" /> STREAK: {user.streak || 0}</span>
                               </div>
                            </div>
                         </Link>
                      </div>

                      {/* Stats & Rank Badge */}
                      <div className="flex items-center gap-4 md:gap-12">
                         <div className="hidden sm:flex flex-col items-end">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{filter === 'xp' ? 'TOTAL XP' : filter.toUpperCase()}</span>
                            <span className="text-lg font-black text-slate-900 dark:text-white italic">
                               {filter === 'xp' ? user.xp.toLocaleString() : (user[filter] || 0)}
                            </span>
                         </div>
                         <div className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border ${
                           user.rank === 'Legend' ? 'bg-purple-500/10 border-purple-500/20 text-purple-500' :
                           user.rank === 'Elite' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' :
                           'bg-slate-100 dark:bg-white/5 border-black/5 dark:border-white/5 text-slate-500'
                         }`}>
                           {user.rank}
                         </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
             </div>
           )}
        </div>
      </div>
    </div>
  );
}
