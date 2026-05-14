import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion'; // Cache cleared, re-scanning
import { MessageSquare, ArrowBigUp, ArrowBigDown, Hash, Plus, TrendingUp, Clock, Filter, MessageCircle, Share2, MoreHorizontal } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export default function Discussions() {
  const { user } = useAuth();
  const [discussions, setDiscussions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // New Discussion State
  const [newDisc, setNewDisc] = useState({ title: '', content: '', category: 'General' });

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

  const handleUpvote = async (id) => {
    if (!user) return toast.error('Login to participate');
    try {
      await axios.post(`${API_BASE_URL}/discussions/${id}/upvote`, { userId: user._id });
      fetchDiscussions();
    } catch (err) {
      toast.error('Error voting');
    }
  };

  const handleDownvote = async (id) => {
    if (!user) return toast.error('Login to participate');
    try {
      await axios.post(`${API_BASE_URL}/discussions/${id}/downvote`, { userId: user._id });
      fetchDiscussions();
    } catch (err) {
      toast.error('Error voting');
    }
  };

  const [sortBy, setSortBy] = useState('Trending');

  const handleShare = (id) => {
    const url = `${window.location.origin}/discussions/${id}`;
    navigator.clipboard.writeText(url);
    toast.success('Link copied to clipboard!');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return toast.error('Login required');
    try {
      await axios.post(`${API_BASE_URL}/discussions`, { ...newDisc, author: user._id });
      toast.success('Discussion started!');
      setIsModalOpen(false);
      setNewDisc({ title: '', content: '', category: 'General' });
      fetchDiscussions();
    } catch (err) {
      toast.error('Failed to post');
    }
  };

  const sortedDiscussions = [...discussions].sort((a, b) => {
    if (sortBy === 'New') return new Date(b.createdAt) - new Date(a.createdAt);
    return (b.upvotes?.length || 0) - (a.upvotes?.length || 0);
  });

  const filteredDiscussions = activeCategory === 'All' 
    ? sortedDiscussions 
    : sortedDiscussions.filter(d => d.category === activeCategory);

  return (
    <div className="min-h-screen pt-24 pb-20 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-12 gap-8">
        
        {/* Left Sidebar - Categories */}
        <div className="lg:col-span-3 space-y-6 hidden lg:block">
          <div className="glass-panel p-6 sticky top-24">
            <h2 className="text-xl font-black mb-6 flex items-center gap-2">
              <Hash className="text-brand w-5 h-5" /> TECH ARENA
            </h2>
            <div className="space-y-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-between group ${
                    activeCategory === cat 
                      ? 'bg-brand text-white shadow-lg shadow-brand/20' 
                      : 'hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {cat}
                  {activeCategory !== cat && <div className="w-1.5 h-1.5 rounded-full bg-brand opacity-0 group-hover:opacity-100" />}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Feed */}
        <div className="lg:col-span-6 space-y-6">
          {/* Top Bar / Filters */}
          <div className="flex items-center justify-between glass-panel p-4">
             <div className="flex items-center gap-4">
                <button 
                  onClick={() => setSortBy('Trending')}
                  className={`flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-lg transition-all ${sortBy === 'Trending' ? 'text-brand bg-brand/10' : 'text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
                >
                  <TrendingUp className="w-4 h-4" /> Trending
                </button>
                <button 
                  onClick={() => setSortBy('New')}
                  className={`flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-lg transition-all ${sortBy === 'New' ? 'text-brand bg-brand/10' : 'text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
                >
                  <Clock className="w-4 h-4" /> New
                </button>
             </div>
             <button 
               onClick={() => setIsModalOpen(true)}
               className="bg-brand text-white p-2 md:px-4 md:py-2 rounded-lg text-sm font-black flex items-center gap-2 shadow-lg shadow-brand/20 hover:scale-105 transition-transform"
             >
               <Plus className="w-5 h-5" /> <span className="hidden md:inline">START DISCUSSION</span>
             </button>
          </div>

          {loading ? (
             <div className="space-y-6">
               {[1,2,3].map(i => <div key={i} className="glass-panel h-48 animate-pulse bg-slate-200 dark:bg-slate-800" />)}
             </div>
          ) : (
            <div className="space-y-6">
              {filteredDiscussions.map((disc, idx) => (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  key={disc._id} 
                  className="glass-panel group relative overflow-hidden p-6 md:p-8 hover:border-brand/30 transition-colors"
                >
                  <div className="flex gap-6 items-start">
                    {/* Voting */}
                    <div className="flex flex-col items-center gap-1 bg-slate-100 dark:bg-slate-900 p-2 rounded-xl">
                      <button 
                        onClick={() => handleUpvote(disc._id)}
                        className={`hover:text-brand transition-colors ${disc.upvotes?.includes(user?._id) ? 'text-brand' : 'text-slate-400'}`}
                      >
                        <ArrowBigUp className="w-8 h-8" fill={disc.upvotes?.includes(user?._id) ? 'currentColor' : 'none'} />
                      </button>
                      <span className="text-xs font-black">{(disc.upvotes?.length || 0) - (disc.downvotes?.length || 0)}</span>
                      <button 
                        onClick={() => handleDownvote(disc._id)}
                        className={`hover:text-red-500 transition-colors ${disc.downvotes?.includes(user?._id) ? 'text-red-500' : 'text-slate-400'}`}
                      >
                        <ArrowBigDown className="w-8 h-8" fill={disc.downvotes?.includes(user?._id) ? 'currentColor' : 'none'} />
                      </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 space-y-4">
                      <div className="flex items-center gap-3">
                         <img 
                           src={disc.author?.profileImage || 'https://via.placeholder.com/40'} 
                           className="w-6 h-6 rounded-full ring-2 ring-brand/20"
                         />
                         <span className="text-xs font-bold text-slate-500">
                           {disc.author?.username || 'Member'} • {new Date(disc.createdAt).toLocaleDateString()}
                         </span>
                         <span className="text-[10px] font-black uppercase tracking-widest bg-brand/10 text-brand px-2 py-0.5 rounded">
                           {disc.category}
                         </span>
                      </div>
                      
                      <Link to={`/discussions/${disc._id}`}>
                        <h4 className="text-xl md:text-2xl font-black tracking-tight leading-tight group-hover:text-brand transition-colors cursor-pointer">
                          {disc.title}
                        </h4>
                      </Link>
                      <p className="text-sm md:text-base font-medium text-slate-600 dark:text-slate-400 line-clamp-2">
                        {disc.content}
                      </p>

                      <div className="flex items-center gap-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                          <MessageCircle className="w-4 h-4" /> {disc.comments?.length || 0} Comments
                        </div>
                        <div 
                          onClick={() => handleShare(disc._id)}
                          className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-brand cursor-pointer"
                        >
                          <Share2 className="w-4 h-4" /> Share
                        </div>
                        <button className="ml-auto text-slate-400 hover:text-white">
                           <MoreHorizontal className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Right Sidebar - Stats / Trending */}
        <div className="lg:col-span-3 space-y-6 hidden lg:block">
           <div className="glass-panel p-6 space-y-6">
              <h3 className="text-lg font-black flex items-center gap-2">
                <TrendingUp className="text-brand w-5 h-5" /> HOT DEBATES
              </h3>
              <div className="space-y-4">
                 {[
                   'Is AI taking over Junior jobs?',
                   'JavaScript vs Rust in 2024',
                   'Best resources for Web3'
                 ].map((t, i) => (
                   <div key={i} className="group cursor-pointer">
                      <p className="text-sm font-bold group-hover:text-brand transition-colors">{t}</p>
                      <span className="text-[10px] text-slate-500">2.4k upvotes • 150 comments</span>
                   </div>
                 ))}
              </div>
           </div>

           <div className="elite-card p-6 bg-brand/5 border-brand/20">
              <h3 className="text-sm font-black text-brand mb-2 uppercase tracking-widest">Community Stat</h3>
              <div className="text-3xl font-black">1.2k+</div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Active Developers</p>
           </div>
        </div>

      </div>

      {/* New Discussion Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-xl glass-panel p-8 md:p-10 space-y-8 bg-white dark:bg-slate-900"
            >
              <h3 className="text-3xl font-black tracking-tight">START A <span className="text-brand">DEBATE</span></h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Category</label>
                    <select 
                      value={newDisc.category}
                      onChange={(e) => setNewDisc({...newDisc, category: e.target.value})}
                      className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl p-4 font-bold text-sm outline-none focus:ring-2 ring-brand/50 transition-all"
                    >
                      {categories.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Title</label>
                    <input 
                      required
                      placeholder="What's on your mind?"
                      value={newDisc.title}
                      onChange={(e) => setNewDisc({...newDisc, title: e.target.value})}
                      className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl p-4 font-bold text-sm outline-none focus:ring-2 ring-brand/50 transition-all placeholder:text-slate-500"
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Content</label>
                    <textarea 
                      required
                      rows="5"
                      placeholder="Explain your topic..."
                      value={newDisc.content}
                      onChange={(e) => setNewDisc({...newDisc, content: e.target.value})}
                      className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl p-4 font-bold text-sm outline-none focus:ring-2 ring-brand/50 transition-all placeholder:text-slate-500 resize-none"
                    />
                 </div>
                 <button 
                   type="submit"
                   className="w-full py-4 bg-brand text-white rounded-xl font-black tracking-widest shadow-xl shadow-brand/20 hover:scale-[1.02] active:scale-[0.98] transition-all uppercase"
                 >
                   POST DISCUSSION
                 </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
