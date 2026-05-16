import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, Plus, Search, Filter, TrendingUp, 
  Clock, Award, ChevronUp, ChevronDown, Share2, 
  MoreVertical, Hash, Brain, Code, Shield, Users,
  Bot, Star, Zap
} from 'lucide-react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Magnetic from '../components/Magnetic';

export default function Discussions() {
  const { user } = useAuth();
  const [discussions, setDiscussions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const categories = ['All', 'General', 'Technical', 'AI / ML', 'Web Dev', 'Cyber Security', 'Career', 'Projects'];

  useEffect(() => {
    fetchDiscussions();
  }, [activeCategory]);

  const fetchDiscussions = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/discussions?category=${activeCategory}`);
      if (res.data.success) {
        setDiscussions(res.data.discussions);
      }
    } catch (err) {
      console.error('Failed to fetch discussions');
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (id, type) => {
    if (!user) return;
    try {
      const res = await axios.post(`/api/discussions/${id}/vote`, { type });
      if (res.data.success) {
        setDiscussions(prev => prev.map(d => 
          d._id === id ? { ...d, upvotes: res.data.upvotes, downvotes: res.data.downvotes } : d
        ));
      }
    } catch (err) {
      console.error('Vote failed');
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 pt-32 pb-20 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* LEFT COLUMN - NAVIGATION & CATEGORIES */}
        <div className="hidden lg:block lg:col-span-3 space-y-8">
           <div className="p-8 bg-slate-50 dark:bg-white/5 rounded-[2.5rem] border border-black/5 dark:border-white/10">
              <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em] block mb-6">Neural Sectors</span>
              <div className="flex flex-col gap-2">
                 {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`flex items-center justify-between px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                        activeCategory === cat 
                        ? 'bg-emerald-500 text-white shadow-lg' 
                        : 'text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-white/5'
                      }`}
                    >
                      {cat}
                      {cat === 'All' ? <Hash className="w-3 h-3" /> : null}
                      {cat === 'AI / ML' ? <Brain className="w-3 h-3" /> : null}
                      {cat === 'Web Dev' ? <Code className="w-3 h-3" /> : null}
                      {cat === 'Cyber Security' ? <Shield className="w-3 h-3" /> : null}
                    </button>
                 ))}
              </div>
           </div>

           {/* Trending Section Mock */}
           <div className="p-8 bg-slate-50 dark:bg-white/5 rounded-[2.5rem] border border-black/5 dark:border-white/10">
              <div className="flex items-center gap-2 mb-6 text-orange-500">
                 <TrendingUp className="w-4 h-4" />
                 <span className="text-[10px] font-black uppercase tracking-[0.3em]">Trending Now</span>
              </div>
              <div className="flex flex-col gap-4">
                 {[
                   { title: 'AI vs Traditional Dev', tags: ['Debate', 'AI'] },
                   { title: 'Best MERN stack practices', tags: ['Web', 'Tutorial'] },
                   { title: 'GCC Hackathon 2024 Prep', tags: ['Events'] }
                 ].map((t, i) => (
                   <div key={i} className="flex flex-col gap-1 cursor-pointer group">
                      <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-emerald-500 transition-colors leading-tight">{t.title}</span>
                      <div className="flex gap-2">
                         {t.tags.map(tag => <span key={tag} className="text-[8px] font-black text-slate-400 uppercase tracking-widest">#{tag}</span>)}
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </div>

        {/* MIDDLE COLUMN - FEED */}
        <div className="lg:col-span-6 space-y-8">
           {/* Feed Header */}
           <div className="flex items-center justify-between gap-4">
              <div className="flex-1 relative">
                 <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                 <input 
                   type="text" 
                   placeholder="Search discussions, debates, roadmaps..."
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                   className="w-full bg-slate-50 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl pl-12 pr-6 py-4 text-xs font-bold outline-none focus:border-emerald-500 transition-all text-slate-900 dark:text-white"
                 />
              </div>
              <Magnetic strength={0.3}>
                 <button 
                   onClick={() => setIsCreateOpen(true)}
                   className="p-4 bg-emerald-500 text-white rounded-2xl shadow-xl shadow-emerald-500/20 hover:scale-105 transition-all"
                 >
                    <Plus className="w-5 h-5" />
                 </button>
              </Magnetic>
           </div>

           {/* Thread List */}
           <div className="flex flex-col gap-6">
              {loading ? (
                <div className="py-20 flex flex-col items-center gap-4">
                   <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Loading Neural Feed...</span>
                </div>
              ) : discussions.length > 0 ? (
                discussions.map((thread) => (
                  <motion.div 
                    key={thread._id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="group bg-white dark:bg-white/5 rounded-[2.5rem] border border-black/5 dark:border-white/10 hover:border-emerald-500/30 transition-all duration-500 overflow-hidden shadow-lg"
                  >
                     <div className="flex">
                        {/* Vote Sidebar */}
                        <div className="w-16 bg-slate-50/50 dark:bg-black/10 flex flex-col items-center py-6 gap-2">
                           <button 
                             onClick={() => handleVote(thread._id, 'up')}
                             className={`p-1.5 rounded-lg transition-all ${thread.upvotes?.includes(user?._id) ? 'text-emerald-500 bg-emerald-500/10' : 'text-slate-400 hover:text-emerald-500'}`}
                           >
                              <ChevronUp className="w-6 h-6" />
                           </button>
                           <span className="text-xs font-black text-slate-900 dark:text-white italic">
                              {(thread.upvotes?.length || 0) - (thread.downvotes?.length || 0)}
                           </span>
                           <button 
                             onClick={() => handleVote(thread._id, 'down')}
                             className={`p-1.5 rounded-lg transition-all ${thread.downvotes?.includes(user?._id) ? 'text-red-500 bg-red-500/10' : 'text-slate-400 hover:text-red-500'}`}
                           >
                              <ChevronDown className="w-6 h-6" />
                           </button>
                        </div>

                        {/* Content Area */}
                        <div className="flex-1 p-8">
                           <div className="flex items-center gap-3 mb-4">
                              <Link to={`/profile/${thread.author?._id}`} className="w-6 h-6 rounded-lg overflow-hidden bg-slate-200">
                                 <img src={thread.author?.avatar || 'https://via.placeholder.com/150'} alt="" className="w-full h-full object-cover" />
                              </Link>
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                 {thread.author?.name} 
                                 <span className="w-1 h-1 bg-slate-300 rounded-full" />
                                 {thread.category}
                                 <span className="w-1 h-1 bg-slate-300 rounded-full" />
                                 {new Date(thread.createdAt).toLocaleDateString()}
                              </span>
                           </div>

                           <Link to={`/discussions/${thread._id}`}>
                              <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight group-hover:text-emerald-500 transition-colors leading-tight">
                                 {thread.title}
                              </h2>
                           </Link>

                           <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium line-clamp-2 mt-4 leading-relaxed">
                              {thread.content}
                           </p>

                           {/* AI Summary Badge (If exists) */}
                           {thread.aiSummary && (
                              <div className="mt-4 flex items-center gap-3 p-3 bg-emerald-500/5 rounded-xl border border-emerald-500/10">
                                 <Bot className="w-3.5 h-3.5 text-emerald-500" />
                                 <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest italic">AI Summarized</span>
                              </div>
                           )}

                           <div className="flex items-center gap-6 mt-6">
                              <div className="flex items-center gap-2 text-slate-400">
                                 <MessageSquare className="w-4 h-4" />
                                 <span className="text-[10px] font-black uppercase tracking-widest">{thread.comments?.length || 0} Comments</span>
                              </div>
                              <div className="flex items-center gap-2 text-slate-400">
                                 <Share2 className="w-4 h-4" />
                                 <span className="text-[10px] font-black uppercase tracking-widest">Share</span>
                              </div>
                           </div>
                        </div>
                     </div>
                  </motion.div>
                ))
              ) : (
                <div className="py-20 text-center flex flex-col items-center">
                   <div className="w-16 h-16 bg-slate-50 dark:bg-white/5 rounded-full flex items-center justify-center mb-4">
                      <MessageSquare className="w-6 h-6 text-slate-400" />
                   </div>
                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">No discussions found in this neural sector.</span>
                </div>
              )}
           </div>
        </div>

        {/* RIGHT COLUMN - COMMUNITY STATS */}
        <div className="hidden lg:block lg:col-span-3 space-y-8">
           <div className="p-8 bg-slate-950 rounded-[2.5rem] border border-white/5 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-10">
                 <Zap className="w-12 h-12 text-emerald-500" />
              </div>
              <div className="relative z-10">
                 <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em] block mb-2">Ecosystem Health</span>
                 <h4 className="text-2xl font-black text-white italic uppercase mb-6">Elite Rank Only.</h4>
                 
                 <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-1">
                       <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Active Debates</span>
                       <span className="text-xl font-black text-white">42</span>
                    </div>
                    <div className="flex flex-col gap-1">
                       <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Questions Resolved</span>
                       <span className="text-xl font-black text-white">1,204</span>
                    </div>
                    <div className="flex flex-col gap-1">
                       <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Mentors Online</span>
                       <span className="text-xl font-black text-emerald-500">12</span>
                    </div>
                 </div>

                 <button className="w-full mt-8 py-4 bg-white text-slate-950 text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl hover:scale-105 transition-all">
                    View Rules
                 </button>
              </div>
           </div>

           {/* Daily Challenge Mock */}
           <div className="p-8 bg-slate-50 dark:bg-white/5 rounded-[2.5rem] border border-black/5 dark:border-white/10">
              <div className="flex items-center gap-2 mb-4 text-emerald-500">
                 <Award className="w-4 h-4" />
                 <span className="text-[10px] font-black uppercase tracking-[0.3em]">Daily Challenge</span>
              </div>
              <p className="text-xs font-bold text-slate-900 dark:text-white leading-relaxed mb-4">
                 How would you optimize a Redis queue for 10K concurrent emails?
              </p>
              <button className="text-[9px] font-black text-emerald-500 uppercase tracking-widest hover:translate-x-1 transition-all flex items-center gap-2">
                 Submit Answer <Plus className="w-3 h-3" />
              </button>
           </div>
        </div>

      </div>
    </div>
  );
}
