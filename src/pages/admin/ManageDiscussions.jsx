import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  MessageSquare, Trash2, Search, Filter, AlertCircle, 
  ArrowUpRight, Clock, User, Hash, CheckCircle2 
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export default function ManageDiscussions() {
  const [discussions, setDiscussions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Tech Debate', 'Career Advice', 'Project Showcase', 'General', 'Help Wanted', 'AI vs Human'];

  useEffect(() => {
    fetchDiscussions();
  }, []);

  const fetchDiscussions = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/discussions`);
      setDiscussions(res.data);
      setLoading(false);
    } catch (err) {
      toast.error('Failed to load discussions');
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this discussion? This action cannot be undone.')) return;
    
    try {
      await axios.delete(`${API_BASE_URL}/discussions/${id}`);
      toast.success('Discussion deleted');
      fetchDiscussions();
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  const filteredDiscussions = discussions.filter(disc => {
    const matchesSearch = disc.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         disc.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'All' || disc.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white uppercase">Manage <span className="text-brand">Discussions</span></h1>
          <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mt-1">Tech Arena Moderation Hub</p>
        </div>
        
        <div className="flex items-center gap-4 bg-emerald-500/10 border border-emerald-500/20 px-6 py-3 rounded-2xl">
           <div className="text-right">
              <div className="text-2xl font-black text-emerald-600">{discussions.length}</div>
              <div className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Total Threads</div>
           </div>
           <MessageSquare className="w-8 h-8 text-emerald-500 opacity-40" />
        </div>
      </div>

      {/* Controls */}
      <div className="grid md:grid-cols-12 gap-6">
         <div className="md:col-span-8 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input 
              type="text"
              placeholder="Search discussions by title or content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-white/5 rounded-2xl py-4 pl-12 pr-6 font-bold text-sm outline-none focus:border-brand/50 transition-all"
            />
         </div>
         <div className="md:col-span-4">
            <div className="relative">
               <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
               <select 
                 value={activeCategory}
                 onChange={(e) => setActiveCategory(e.target.value)}
                 className="w-full bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-white/5 rounded-2xl py-4 pl-12 pr-6 font-bold text-sm outline-none appearance-none focus:border-brand/50 transition-all"
               >
                 {categories.map(c => <option key={c} value={c}>{c}</option>)}
               </select>
            </div>
         </div>
      </div>

      {/* Discussion List */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-white/5 overflow-hidden">
         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead>
                  <tr className="border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/5">
                     <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Thread Detail</th>
                     <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Category</th>
                     <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Author</th>
                     <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Stats</th>
                     <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                  {loading ? (
                     <tr>
                        <td colSpan="5" className="px-8 py-20 text-center animate-pulse text-slate-400 font-bold uppercase tracking-widest">Fetching Arena Data...</td>
                     </tr>
                  ) : filteredDiscussions.length === 0 ? (
                     <tr>
                        <td colSpan="5" className="px-8 py-20 text-center text-slate-400 font-bold uppercase tracking-widest flex flex-col items-center gap-4">
                           <AlertCircle className="w-12 h-12 opacity-20" />
                           No discussions found matching your criteria.
                        </td>
                     </tr>
                  ) : (
                     filteredDiscussions.map((disc) => (
                        <tr key={disc._id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group">
                           <td className="px-8 py-6">
                              <div className="flex flex-col gap-1 max-w-md">
                                 <span className="text-sm font-black text-slate-900 dark:text-white group-hover:text-brand transition-colors line-clamp-1">{disc.title}</span>
                                 <span className="text-xs font-medium text-slate-400 line-clamp-1">{disc.content}</span>
                                 <div className="flex items-center gap-2 mt-2">
                                    <Clock className="w-3 h-3 text-slate-400" />
                                    <span className="text-[10px] font-bold text-slate-400 uppercase">{new Date(disc.createdAt).toLocaleString()}</span>
                                 </div>
                              </div>
                           </td>
                           <td className="px-8 py-6">
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand/10 text-brand text-[10px] font-black uppercase tracking-widest">
                                 <Hash className="w-3 h-3" /> {disc.category}
                              </span>
                           </td>
                           <td className="px-8 py-6">
                              <div className="flex items-center gap-3">
                                 <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                    <User className="w-4 h-4 text-slate-400" />
                                 </div>
                                 <div className="flex flex-col">
                                    <span className="text-xs font-black text-slate-900 dark:text-white uppercase">{disc.author?.username || 'Unknown'}</span>
                                    <span className="text-[9px] font-bold text-brand uppercase tracking-tighter">{disc.author?.rank || 'Rookie'}</span>
                                 </div>
                              </div>
                           </td>
                           <td className="px-8 py-6">
                              <div className="flex items-center gap-4">
                                 <div className="flex flex-col items-center">
                                    <span className="text-xs font-black text-slate-900 dark:text-white">{disc.upvotes?.length || 0}</span>
                                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Votes</span>
                                 </div>
                                 <div className="flex flex-col items-center">
                                    <span className="text-xs font-black text-slate-900 dark:text-white">{disc.comments?.length || 0}</span>
                                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Replies</span>
                                 </div>
                              </div>
                           </td>
                           <td className="px-8 py-6 text-right">
                              <div className="flex items-center justify-end gap-2">
                                 <button 
                                   onClick={() => window.open(`/discussions/${disc._id}`, '_blank')}
                                   className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-brand hover:bg-brand/10 transition-all"
                                   title="View Thread"
                                 >
                                    <ArrowUpRight className="w-4 h-4" />
                                 </button>
                                 <button 
                                   onClick={() => handleDelete(disc._id)}
                                   className="p-2.5 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-400 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-500/20 transition-all"
                                   title="Delete Discussion"
                                 >
                                    <Trash2 className="w-4 h-4" />
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
      
      {/* Moderation Guide */}
      <div className="bg-amber-500/5 border border-amber-500/10 rounded-3xl p-8 flex items-start gap-6">
         <div className="w-12 h-12 rounded-2xl bg-amber-500/20 flex items-center justify-center shrink-0">
            <AlertCircle className="w-6 h-6 text-amber-500" />
         </div>
         <div>
            <h3 className="text-lg font-black text-amber-600 uppercase tracking-tight">Moderation Guidelines</h3>
            <p className="text-sm font-medium text-amber-600/80 leading-relaxed mt-1">
               Ensure the Tech Arena remains professional and constructive. Remove any content that violates community standards, including toxicity, spam, or harassment. Use the AI toxicity layer for automated filtering, but manual oversight is recommended for complex debates.
            </p>
         </div>
      </div>
    </div>
  );
}
