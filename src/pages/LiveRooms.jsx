import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Video, Mic, MessageSquare, Users, Plus, Shield, Code, BookOpen, Sword, Search, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

const API_BASE_URL = '/api';

export default function LiveRooms() {
  const { user } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [discussions, setDiscussions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const [newRoom, setNewRoom] = useState({
    title: '',
    description: '',
    type: 'Debate',
    maxParticipants: 10,
    isLocked: false,
    password: ''
  });

  const roomTypes = [
    { name: 'Debate', icon: <Sword className="w-4 h-4" />, color: 'text-red-400', bg: 'bg-red-400/10' },
    { name: 'Coding', icon: <Code className="w-4 h-4" />, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { name: 'Workshop', icon: <Video className="w-4 h-4" />, color: 'text-purple-400', bg: 'bg-purple-400/10' },
    { name: 'Study', icon: <BookOpen className="w-4 h-4" />, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
    { name: 'Hackathon', icon: <Users className="w-4 h-4" />, color: 'text-orange-400', bg: 'bg-orange-400/10' },
  ];

  useEffect(() => {
    fetchRooms();
    fetchDiscussions();
    const interval = setInterval(() => {
      fetchRooms();
      fetchDiscussions();
    }, 10000); 
    return () => clearInterval(interval);
  }, []);

  const fetchRooms = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/live-rooms`);
      setRooms(res.data);
    } catch (err) {
      console.error('Failed to load live rooms');
    } finally {
      setLoading(false);
    }
  };

  const fetchDiscussions = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/discussions`);
      setDiscussions(res.data.slice(0, 5)); // Just top 5
    } catch (err) {
      console.error('Failed to load discussions');
    }
  };

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    if (!user) return toast.error('Login required');
    try {
      const res = await axios.post(`${API_BASE_URL}/live-rooms`, { ...newRoom, host: user._id });
      toast.success('Room initialized!');
      setIsModalOpen(false);
      fetchRooms();
    } catch (err) {
      toast.error('Failed to create room');
    }
  };

  const filteredRooms = rooms.filter(room => {
    const matchesSearch = room.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'All' || room.type === activeFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen pt-24 pb-20 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-500 overflow-x-hidden">
      
      {/* Background Cinematic Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
         <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand/10 blur-[120px] rounded-full animate-pulse" />
         <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-4">
             <motion.div 
               initial={{ opacity: 0, x: -20 }} 
               animate={{ opacity: 1, x: 0 }}
               className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand/10 border border-brand/20 text-brand text-[10px] font-black uppercase tracking-widest"
             >
               <span className="relative flex h-2 w-2">
                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand opacity-75"></span>
                 <span className="relative inline-flex rounded-full h-2 w-2 bg-brand"></span>
               </span>
               Live System Active
             </motion.div>
             <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none uppercase">
               LIVE <span className="text-brand">ROOMS</span>
             </h1>
             <p className="text-slate-500 font-bold max-w-lg">
               Join real-time technical debates, collaborative coding battles, or community workshops.
             </p>
          </div>
          
          <button 
            onClick={() => setIsModalOpen(true)}
            className="group relative flex items-center gap-3 px-8 py-4 bg-brand text-white rounded-2xl font-black tracking-widest overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-xl shadow-brand/20"
          >
             <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
             <Plus className="w-5 h-5" /> START ROOM
          </button>
        </div>

        {/* Filters & Search */}
        <div className="grid md:grid-cols-12 gap-6 mb-12">
           <div className="md:col-span-8 flex flex-wrap gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
             <button 
               onClick={() => setActiveFilter('All')}
               className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeFilter === 'All' ? 'bg-brand text-white' : 'glass-panel text-slate-500'}`}
             >
               All Arena
             </button>
             {roomTypes.map(type => (
               <button 
                 key={type.name}
                 onClick={() => setActiveFilter(type.name)}
                 className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeFilter === type.name ? 'bg-brand text-white' : 'glass-panel text-slate-500'}`}
               >
                 {type.icon} {type.name}
               </button>
             ))}
           </div>
           <div className="md:col-span-4 relative">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
             <input 
               placeholder="Filter live sessions..."
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="w-full pl-12 pr-6 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl font-bold text-xs outline-none focus:ring-2 ring-brand/50 transition-all shadow-sm"
             />
           </div>
        </div>

        {/* Unified Arena Layout */}
        <div className="grid lg:grid-cols-12 gap-12">
           
           {/* Left/Main Column: Live Rooms */}
           <div className="lg:col-span-8 space-y-8">
              <div className="flex items-center justify-between">
                 <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-500 flex items-center gap-2">
                    <Video className="w-4 h-4" /> ACTIVE SESSIONS
                 </h3>
              </div>

        {/* Rooms Grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="glass-panel h-64 animate-pulse bg-slate-200 dark:bg-slate-900 rounded-3xl" />
            ))}
          </div>
        ) : filteredRooms.length === 0 ? (
          <div className="text-center py-40 glass-panel border-dashed">
            <Users className="w-16 h-16 text-slate-200 dark:text-slate-800 mx-auto mb-6" />
            <h3 className="text-2xl font-black text-slate-400 uppercase tracking-widest">No active rooms found</h3>
            <p className="text-slate-500 font-bold mt-2">Why not start one yourself?</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredRooms.map((room, idx) => (
              <motion.div
                key={room._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="group relative"
              >
                <Link to={room.type === 'Coding' ? `/coding-hub/${room._id}` : `/live-rooms/${room._id}`}>
                  <div className="glass-panel p-8 h-full flex flex-col gap-6 hover:border-brand/40 transition-all duration-500 hover:shadow-2xl hover:shadow-brand/5 group-hover:translate-y-[-8px]">
                    <div className="flex justify-between items-start">
                       <div className={`p-3 rounded-2xl ${roomTypes.find(t => t.name === room.type)?.bg || 'bg-slate-100'} ${roomTypes.find(t => t.name === room.type)?.color || 'text-slate-400'}`}>
                         {roomTypes.find(t => t.name === room.type)?.icon}
                       </div>
                       <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-[10px] font-black uppercase">
                         <Users className="w-3 h-3 text-brand" /> {room.participants?.length || 0}/{room.maxParticipants}
                       </div>
                    </div>

                    <div className="space-y-2">
                       <h3 className="text-2xl font-black tracking-tight leading-tight uppercase group-hover:text-brand transition-colors">
                         {room.title}
                       </h3>
                       <p className="text-sm font-medium text-slate-500 line-clamp-2">
                         {room.description || "Join this room for a technical session."}
                       </p>
                    </div>

                    <div className="mt-auto pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                       <div className="flex items-center gap-2">
                          <img 
                            src={room.host?.profileImage || 'https://via.placeholder.com/40'} 
                            className="w-6 h-6 rounded-full ring-2 ring-brand/20"
                          />
                          <span className="text-[10px] font-black uppercase text-slate-500">{room.host?.username || 'Host'}</span>
                       </div>
                       <div className="flex items-center gap-2 text-brand font-black text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                         JOIN ROOM <ArrowRight className="w-3 h-3" />
                       </div>
                    </div>
                  </div>
                </Link>
                {room.isLocked && (
                  <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md p-1.5 rounded-lg">
                    <Shield className="w-3 h-3 text-white" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}

           </div>

           {/* Right Column: Trending Discussions */}
           <div className="lg:col-span-4 space-y-8">
              <div className="flex items-center justify-between">
                 <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-500 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-brand" /> TRENDING DEBATES
                 </h3>
                 <Link to="/discussions" className="text-[9px] font-black text-brand uppercase hover:underline">View All</Link>
              </div>

              <div className="space-y-4">
                 {discussions.map((disc, idx) => (
                    <motion.div 
                      key={disc._id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                    >
                       <Link to={`/discussions/${disc._id}`}>
                          <div className="glass-panel p-6 hover:border-brand/40 transition-all group">
                             <div className="flex flex-col gap-3">
                                <div className="flex items-center gap-2">
                                   <span className="text-[8px] font-black px-2 py-0.5 rounded-full bg-brand/10 text-brand uppercase tracking-widest">
                                      {disc.category}
                                   </span>
                                   <span className="text-[8px] font-bold text-slate-500 uppercase">{new Date(disc.createdAt).toLocaleDateString()}</span>
                                </div>
                                <h4 className="text-sm font-black uppercase leading-tight group-hover:text-brand transition-colors">
                                   {disc.title}
                                </h4>
                                <div className="flex items-center gap-4 mt-2 pt-4 border-t border-slate-100 dark:border-white/5">
                                   <div className="flex items-center gap-1.5 text-[9px] font-black text-slate-400">
                                      <MessageSquare className="w-3 h-3" /> {disc.comments?.length || 0}
                                   </div>
                                   <div className="flex items-center gap-1.5 text-[9px] font-black text-slate-400">
                                      <Sword className="w-3 h-3" /> {(disc.upvotes?.length || 0) + (disc.downvotes?.length || 0)}
                                   </div>
                                   <div className="ml-auto text-[9px] font-black text-slate-500 uppercase italic">
                                      By {disc.author?.username || 'Member'}
                                   </div>
                                </div>
                             </div>
                          </div>
                       </Link>
                    </motion.div>
                 ))}
                 
                 {discussions.length === 0 && (
                    <div className="p-8 text-center glass-panel border-dashed">
                       <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">No active debates yet</p>
                    </div>
                 )}
              </div>

              {/* Recruitment / Community CTA */}
              <div className="glass-panel p-8 bg-brand/5 border-brand/20 relative overflow-hidden group">
                 <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-brand/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                 <h4 className="text-lg font-black uppercase tracking-tight mb-2 text-slate-900 dark:text-white">Build Together</h4>
                 <p className="text-[10px] font-bold text-slate-500 uppercase leading-relaxed mb-6">
                    Join the GAT Coding Club core team and shape the future of tech.
                 </p>
                 <button className="w-full py-3 bg-brand text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:scale-105 transition-all">
                    JOIN CORE TEAM
                 </button>
              </div>
           </div>
        </div>

      {/* Create Room Modal */}
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
              <h3 className="text-3xl font-black tracking-tight uppercase">START A <span className="text-brand">SESSION</span></h3>
              <form onSubmit={handleCreateRoom} className="space-y-6">
                 <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Room Type</label>
                      <select 
                        value={newRoom.type}
                        onChange={(e) => setNewRoom({...newRoom, type: e.target.value})}
                        className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl p-4 font-bold text-sm outline-none focus:ring-2 ring-brand/50 transition-all"
                      >
                        {roomTypes.map(t => <option key={t.name} value={t.name}>{t.name}</option>)}
                      </select>
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Max Size</label>
                      <input 
                        type="number"
                        min="2"
                        max="50"
                        value={newRoom.maxParticipants}
                        onChange={(e) => setNewRoom({...newRoom, maxParticipants: e.target.value})}
                        className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl p-4 font-bold text-sm outline-none focus:ring-2 ring-brand/50 transition-all"
                      />
                   </div>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Room Title</label>
                    <input 
                      required
                      placeholder="Give your session a name..."
                      value={newRoom.title}
                      onChange={(e) => setNewRoom({...newRoom, title: e.target.value})}
                      className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl p-4 font-bold text-sm outline-none focus:ring-2 ring-brand/50 transition-all placeholder:text-slate-500"
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Security</label>
                    <div className="flex items-center gap-4 bg-slate-100 dark:bg-slate-800 p-4 rounded-xl">
                      <input 
                        type="checkbox"
                        checked={newRoom.isLocked}
                        onChange={(e) => setNewRoom({...newRoom, isLocked: e.target.checked})}
                        className="w-5 h-5 accent-brand"
                      />
                      <span className="text-sm font-bold text-slate-500 uppercase">Private Room (Password Required)</span>
                    </div>
                 </div>
                 {newRoom.isLocked && (
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Set Password</label>
                       <input 
                         required
                         type="password"
                         value={newRoom.password}
                         onChange={(e) => setNewRoom({...newRoom, password: e.target.value})}
                         className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl p-4 font-bold text-sm outline-none focus:ring-2 ring-brand/50 transition-all"
                       />
                    </div>
                 )}
                 <button 
                   type="submit"
                   className="w-full py-4 bg-brand text-white rounded-xl font-black tracking-widest shadow-xl shadow-brand/20 hover:scale-[1.02] active:scale-[0.98] transition-all uppercase"
                 >
                   LAUNCH ROOM
                 </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      </div>
    </div>
  );
}
