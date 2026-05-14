import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Target, Zap, Crown, Search, TrendingUp, ArrowUpRight } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export default function Leaderboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/users/leaderboard`);
      setUsers(res.data);
      setLoading(false);
    } catch (err) {
      toast.error('Failed to load rankings');
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(u => 
    u.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRankBadge = (index) => {
    if (index === 0) return <Crown className="w-6 h-6 text-yellow-400 fill-yellow-400" />;
    if (index === 1) return <Medal className="w-6 h-6 text-slate-300 fill-slate-300" />;
    if (index === 2) return <Medal className="w-6 h-6 text-orange-400 fill-orange-400" />;
    return <span className="text-sm font-black text-slate-500">#{index + 1}</span>;
  };

  return (
    <div className="min-h-screen pt-24 pb-20 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-500 overflow-x-hidden">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="space-y-4">
             <span className="text-[10px] font-black uppercase tracking-[0.4em] text-brand bg-brand/10 px-4 py-2 rounded-full border border-brand/20">Global Rankings</span>
             <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-none uppercase">
               THE <span className="text-brand">ELITE</span> LIST
             </h1>
             <p className="text-slate-500 font-bold max-w-lg text-lg">
               Behold the top performers of GCC. Gain XP, conquer challenges, and claim your throne.
             </p>
          </div>
          
          <div className="flex gap-4">
             <div className="glass-panel px-8 py-6 text-center">
                <div className="text-3xl font-black text-brand">1.2k+</div>
                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Total Devs</div>
             </div>
             <div className="glass-panel px-8 py-6 text-center">
                <div className="text-3xl font-black text-blue-500">5.4k+</div>
                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">XP Earned</div>
             </div>
          </div>
        </div>

        {/* Search & Top 3 Podium */}
        <div className="grid lg:grid-cols-12 gap-12 mb-16">
           
           {/* Podium Section */}
           <div className="lg:col-span-8 flex flex-col gap-8">
              <div className="grid grid-cols-3 items-end gap-4 h-[400px]">
                 {/* 2nd Place */}
                 <div className="flex flex-col items-center gap-4">
                    <motion.div 
                      initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }}
                      className="w-full h-40 glass-panel bg-slate-100 dark:bg-slate-900/50 flex flex-col items-center justify-center gap-2 border-b-4 border-slate-300"
                    >
                       <img src={users[1]?.profileImage || 'https://via.placeholder.com/60'} className="w-16 h-16 rounded-full ring-4 ring-slate-300/30 -mt-20" />
                       <span className="font-black uppercase text-xs truncate w-full text-center px-2">{users[1]?.username || '---'}</span>
                       <span className="text-brand font-black text-lg">{users[1]?.xp || 0} XP</span>
                    </motion.div>
                    <div className="text-4xl font-black text-slate-300">2</div>
                 </div>

                 {/* 1st Place */}
                 <div className="flex flex-col items-center gap-4">
                    <motion.div 
                      initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                      className="w-full h-56 glass-panel bg-brand/5 dark:bg-brand/10 flex flex-col items-center justify-center gap-2 border-b-4 border-yellow-400 relative overflow-hidden"
                    >
                       <div className="absolute top-2 right-2 animate-bounce">👑</div>
                       <img src={users[0]?.profileImage || 'https://via.placeholder.com/80'} className="w-24 h-24 rounded-full ring-8 ring-yellow-400/20 -mt-28" />
                       <span className="font-black uppercase text-sm truncate w-full text-center px-2">{users[0]?.username || '---'}</span>
                       <span className="text-brand font-black text-2xl">{users[0]?.xp || 0} XP</span>
                    </motion.div>
                    <div className="text-6xl font-black text-yellow-400">1</div>
                 </div>

                 {/* 3rd Place */}
                 <div className="flex flex-col items-center gap-4">
                    <motion.div 
                      initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                      className="w-full h-32 glass-panel bg-slate-100 dark:bg-slate-900/50 flex flex-col items-center justify-center gap-2 border-b-4 border-orange-400"
                    >
                       <img src={users[2]?.profileImage || 'https://via.placeholder.com/50'} className="w-12 h-12 rounded-full ring-4 ring-orange-400/30 -mt-16" />
                       <span className="font-black uppercase text-[10px] truncate w-full text-center px-2">{users[2]?.username || '---'}</span>
                       <span className="text-brand font-black text-sm">{users[2]?.xp || 0} XP</span>
                    </motion.div>
                    <div className="text-3xl font-black text-orange-400">3</div>
                 </div>
              </div>
           </div>

           {/* Stats Sidebar */}
           <div className="lg:col-span-4 space-y-6">
              <div className="glass-panel p-8 space-y-6">
                 <h3 className="text-xl font-black uppercase tracking-tighter">Your Progress</h3>
                 <div className="space-y-4">
                    <div className="flex justify-between items-center text-sm font-bold">
                       <span className="text-slate-500">Global Rank</span>
                       <span className="text-brand">#124</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                       <div className="w-[60%] h-full bg-brand" />
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">340 XP to next rank</p>
                 </div>
                 <button className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all">
                    View Profile Details
                 </button>
              </div>
              
              <div className="elite-card p-8 bg-blue-500/5 border-blue-500/20">
                 <h3 className="text-sm font-black text-blue-500 mb-4 uppercase tracking-[0.2em]">Recent Gains</h3>
                 <div className="space-y-3">
                    {[1,2,3].map(i => (
                      <div key={i} className="flex items-center gap-3">
                         <div className="w-2 h-2 rounded-full bg-blue-500" />
                         <span className="text-xs font-bold">+25 XP from Debate</span>
                      </div>
                    ))}
                 </div>
              </div>
           </div>
        </div>

        {/* Table List */}
        <div className="glass-panel overflow-hidden">
           <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <h4 className="text-lg font-black uppercase tracking-widest">Contenders</h4>
              <div className="relative">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                 <input 
                   placeholder="Find developer..."
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                   className="pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-900 rounded-lg text-sm font-bold border-none focus:ring-1 ring-brand/50 outline-none"
                 />
              </div>
           </div>
           <div className="overflow-x-auto">
              <table className="w-full text-left">
                 <thead>
                    <tr className="text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 dark:border-slate-800">
                       <th className="px-8 py-6">Rank</th>
                       <th className="px-8 py-6">Developer</th>
                       <th className="px-8 py-6">Rank Title</th>
                       <th className="px-8 py-6">XP Points</th>
                       <th className="px-8 py-6">Growth</th>
                       <th className="px-8 py-6"></th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {filteredUsers.map((u, i) => (
                       <tr key={u._id} className="group hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                          <td className="px-8 py-6">
                             {getRankBadge(i)}
                          </td>
                          <td className="px-8 py-6">
                             <div className="flex items-center gap-3">
                                <img src={u.profileImage || 'https://via.placeholder.com/40'} className="w-8 h-8 rounded-full" />
                                <span className="text-sm font-black uppercase tracking-tight">{u.username}</span>
                             </div>
                          </td>
                          <td className="px-8 py-6">
                             <span className="px-3 py-1 rounded-full bg-brand/10 text-brand text-[9px] font-black uppercase tracking-widest">
                                {u.xp > 1000 ? 'LEGEND' : u.xp > 500 ? 'ELITE' : u.xp > 200 ? 'BUILDER' : 'ROOKIE'}
                             </span>
                          </td>
                          <td className="px-8 py-6">
                             <span className="text-sm font-black text-slate-700 dark:text-slate-300">{u.xp || 0}</span>
                          </td>
                          <td className="px-8 py-6">
                             <div className="flex items-center gap-1 text-emerald-500 font-black text-xs">
                                <TrendingUp className="w-3 h-3" /> +12%
                             </div>
                          </td>
                          <td className="px-8 py-6 text-right">
                             <button className="p-2 rounded-lg hover:bg-brand/10 text-slate-400 hover:text-brand transition-all">
                                <ArrowUpRight className="w-4 h-4" />
                             </button>
                          </td>
                       </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </div>

      </div>
    </div>
  );
}
