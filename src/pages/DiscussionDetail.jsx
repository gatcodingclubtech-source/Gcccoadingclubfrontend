import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, MessageSquare, ArrowBigUp, ArrowBigDown, Send, Share2, MoreHorizontal, User, MoreVertical, Trash2, Flag, ChevronDown } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export default function DiscussionDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [discussion, setDiscussion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [sortBy, setSortBy] = useState('New'); // New or Top
  const [activeMenu, setActiveMenu] = useState(null);

  const fetchDiscussion = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/discussions`);
      const disc = res.data.find(d => d._id === id);
      setDiscussion(disc);
      setLoading(false);
    } catch (err) {
      toast.error('Failed to load thread');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiscussion();
  }, [id]);

  const handlePostComment = async (e) => {
    e.preventDefault();
    if (!user) return toast.error('Login required');
    if (!commentText.trim()) return;
    try {
      await axios.post(`${API_BASE_URL}/discussions/${id}/comments`, {
        author: user._id,
        content: commentText
      });
      setCommentText('');
      toast.success('Comment posted');
      fetchDiscussion();
    } catch (err) {
      toast.error('Failed to post');
    }
  };

  const handleUpvote = async () => {
    if (!user) return toast.error('Login to participate');
    try {
      await axios.post(`${API_BASE_URL}/discussions/${id}/upvote`, { userId: user._id });
      fetchDiscussion();
    } catch (err) {
      toast.error('Error voting');
    }
  };

  const handleDownvote = async () => {
    if (!user) return toast.error('Login to participate');
    try {
      await axios.post(`${API_BASE_URL}/discussions/${id}/downvote`, { userId: user._id });
      fetchDiscussion();
    } catch (err) {
      toast.error('Error voting');
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard!');
  };

  if (loading) return <div className="min-h-screen pt-40 text-center animate-pulse">Loading Discussion...</div>;
  if (!discussion) return <div className="min-h-screen pt-40 text-center">Thread not found</div>;

  return (
    <div className="min-h-screen pt-24 pb-20 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-500">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        <Link to="/discussions" className="flex items-center gap-2 text-slate-500 hover:text-brand transition-colors mb-8 text-sm font-black uppercase tracking-widest">
           <ArrowLeft className="w-4 h-4" /> BACK TO ARENA
        </Link>

        {/* Main Thread */}
        <div className="glass-panel p-8 md:p-12 mb-10 border-brand/20">
           <div className="flex gap-6 mb-8">
              <div className="flex flex-col items-center gap-2 bg-slate-100 dark:bg-slate-900 p-2 rounded-xl h-fit">
                <button 
                   onClick={handleUpvote}
                   className={`hover:text-brand transition-colors ${discussion.upvotes?.includes(user?._id) ? 'text-brand' : 'text-slate-400'}`}
                >
                   <ArrowBigUp className="w-8 h-8" fill={discussion.upvotes?.includes(user?._id) ? 'currentColor' : 'none'} />
                </button>
                <span className="text-xs font-black">{(discussion.upvotes?.length || 0) - (discussion.downvotes?.length || 0)}</span>
                <button 
                   onClick={handleDownvote}
                   className={`hover:text-red-500 transition-colors ${discussion.downvotes?.includes(user?._id) ? 'text-red-500' : 'text-slate-400'}`}
                >
                   <ArrowBigDown className="w-8 h-8" fill={discussion.downvotes?.includes(user?._id) ? 'currentColor' : 'none'} />
                </button>
              </div>
              <div className="flex-1 space-y-4">
                 <div className="flex items-center gap-3">
                    <img src={discussion.author?.profileImage || 'https://via.placeholder.com/40'} className="w-8 h-8 rounded-full ring-2 ring-brand/20" />
                    <div className="flex flex-col">
                       <span className="text-xs font-black">{discussion.author?.username || 'Member'}</span>
                       <span className="text-[10px] text-slate-500 font-bold uppercase">{new Date(discussion.createdAt).toLocaleDateString()}</span>
                    </div>
                    <span className="ml-auto text-[10px] font-black uppercase tracking-widest bg-brand/10 text-brand px-3 py-1 rounded-full">{discussion.category}</span>
                 </div>
                 <h1 className="text-3xl md:text-5xl font-black tracking-tighter uppercase leading-tight">{discussion.title}</h1>
                 <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">{discussion.content}</p>
                 <div className="flex items-center gap-6 pt-6 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                       <MessageSquare className="w-4 h-4" /> {discussion.comments?.length || 0} Comments
                    </div>
                    <div 
                       onClick={handleShare}
                       className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-brand cursor-pointer"
                    >
                       <Share2 className="w-4 h-4" /> Share
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* Post Comment */}
        <div className="glass-panel p-6 mb-10">
           <form onSubmit={handlePostComment} className="flex gap-4">
              <input 
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="What are your thoughts?"
                className="flex-1 bg-slate-100 dark:bg-slate-900 border-none rounded-xl px-6 py-4 font-bold text-sm outline-none focus:ring-2 ring-brand/50"
              />
              <button type="submit" className="bg-brand text-white p-4 rounded-xl shadow-lg shadow-brand/20 hover:scale-105 transition-all">
                 <Send className="w-5 h-5" />
              </button>
           </form>
        </div>

        {/* Comments Feed */}
        <div className="space-y-6">
           <div className="flex items-center justify-between mb-6">
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-500">REPLIES</h3>
              <div className="relative">
                 <button 
                   onClick={() => setActiveMenu(activeMenu === 'sort' ? null : 'sort')}
                   className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-brand transition-colors"
                 >
                   Sort By: {sortBy} <ChevronDown className="w-3 h-3" />
                 </button>
                 {activeMenu === 'sort' && (
                   <div className="absolute right-0 mt-2 w-32 glass-panel border-white/10 z-20 shadow-2xl">
                      <button onClick={() => { setSortBy('New'); setActiveMenu(null); }} className="w-full text-left px-4 py-2 text-[10px] font-black uppercase hover:bg-brand/10 hover:text-brand transition-colors">Newest</button>
                      <button onClick={() => { setSortBy('Top'); setActiveMenu(null); }} className="w-full text-left px-4 py-2 text-[10px] font-black uppercase hover:bg-brand/10 hover:text-brand transition-colors">Top Voted</button>
                   </div>
                 )}
              </div>
           </div>

           {discussion.comments?.sort((a, b) => {
              if (sortBy === 'Top') return (b.upvotes?.length || 0) - (a.upvotes?.length || 0);
              return new Date(b.createdAt) - new Date(a.createdAt);
           }).map((comment, i) => (
             <motion.div 
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               key={i} 
               className="glass-panel p-6 flex gap-4"
             >
                <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center shrink-0">
                   <User className="w-5 h-5 text-slate-400" />
                </div>
                <div className="space-y-2 flex-grow">
                   <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-brand">{comment.author?.username || 'Member'}</span>
                      <span className="text-[9px] font-bold text-slate-500 uppercase">{new Date(comment.createdAt).toLocaleDateString()}</span>
                   </div>
                   <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{comment.content}</p>
                </div>
                
                <div className="ml-auto flex items-center gap-2">
                   <button className="text-slate-400 hover:text-brand transition-colors">
                      <ArrowBigUp className="w-4 h-4" />
                   </button>
                   <button className="text-slate-400 hover:text-red-500 transition-colors">
                      <ArrowBigDown className="w-4 h-4" />
                   </button>
                   <div className="relative">
                      <button 
                        onClick={() => setActiveMenu(activeMenu === `comment-${i}` ? null : `comment-${i}`)}
                        className="p-1 rounded-lg hover:bg-white/5 text-slate-400"
                      >
                         <MoreVertical className="w-4 h-4" />
                      </button>
                      {activeMenu === `comment-${i}` && (
                        <div className="absolute right-0 mt-2 w-32 glass-panel border-white/10 z-20 shadow-2xl">
                           <button className="w-full text-left px-4 py-2 text-[10px] font-black uppercase text-red-500 hover:bg-red-500/10 transition-colors flex items-center gap-2">
                              <Flag className="w-3 h-3" /> Report
                           </button>
                           {user?._id === comment.author?._id && (
                              <button className="w-full text-left px-4 py-2 text-[10px] font-black uppercase text-red-500 hover:bg-red-500/10 transition-colors flex items-center gap-2">
                                 <Trash2 className="w-3 h-3" /> Delete
                              </button>
                           )}
                        </div>
                      )}
                   </div>
                </div>
             </motion.div>
           ))}
        </div>

      </div>
    </div>
  );
}
