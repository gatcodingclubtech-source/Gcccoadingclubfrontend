import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Video, Users, Trash2, Search, Filter, AlertCircle, 
  ArrowUpRight, Clock, Shield, Code, Sword
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export default function LiveRoomsManager() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeType, setActiveType] = useState('All');

  const roomTypes = ['All', 'Debate', 'Coding', 'Workshop', 'Study', 'Hackathon'];

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/live-rooms`);
      setRooms(res.data);
      setLoading(false);
    } catch (err) {
      toast.error('Failed to load rooms');
      setLoading(false);
    }
  };

  const handleTerminate = async (id) => {
    if (!window.confirm('FORCE TERMINATE this room? All participants will be disconnected.')) return;
    
    try {
      await axios.delete(`${API_BASE_URL}/live-rooms/${id}`);
      toast.success('Room terminated');
      fetchRooms();
    } catch (err) {
      toast.error('Failed to terminate');
    }
  };

  const filteredRooms = rooms.filter(room => {
    const matchesSearch = room.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = activeType === 'All' || room.type === activeType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white uppercase">Manage <span className="text-brand">Live Rooms</span></h1>
          <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mt-1">Real-time Session Moderation</p>
        </div>
        
        <div className="flex items-center gap-4 bg-brand/10 border border-brand/20 px-6 py-3 rounded-2xl">
           <div className="text-right">
              <div className="text-2xl font-black text-brand">{rooms.length}</div>
              <div className="text-[10px] font-black text-brand uppercase tracking-widest">Active Rooms</div>
           </div>
           <Video className="w-8 h-8 text-brand opacity-40" />
        </div>
      </div>

      {/* Controls */}
      <div className="grid md:grid-cols-12 gap-6">
         <div className="md:col-span-8 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input 
              type="text"
              placeholder="Search by title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-white/5 rounded-2xl py-4 pl-12 pr-6 font-bold text-sm outline-none focus:border-brand/50 transition-all"
            />
         </div>
         <div className="md:col-span-4 relative">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <select 
              value={activeType}
              onChange={(e) => setActiveType(e.target.value)}
              className="w-full bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-white/5 rounded-2xl py-4 pl-12 pr-6 font-bold text-sm outline-none appearance-none focus:border-brand/50 transition-all"
            >
              {roomTypes.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
         </div>
      </div>

      {/* Room List */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-white/5 overflow-hidden">
         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead>
                  <tr className="border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/5">
                     <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Session Details</th>
                     <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Type</th>
                     <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Host</th>
                     <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Live Stats</th>
                     <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                  {loading ? (
                     <tr>
                        <td colSpan="5" className="px-8 py-20 text-center animate-pulse text-slate-400 font-bold uppercase tracking-widest">Scanning Network for Live Signals...</td>
                     </tr>
                  ) : filteredRooms.length === 0 ? (
                     <tr>
                        <td colSpan="5" className="px-8 py-20 text-center text-slate-400 font-bold uppercase tracking-widest flex flex-col items-center gap-4">
                           <AlertCircle className="w-12 h-12 opacity-20" />
                           No live rooms detected.
                        </td>
                     </tr>
                  ) : (
                     filteredRooms.map((room) => (
                        <tr key={room._id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group">
                           <td className="px-8 py-6">
                              <div className="flex flex-col gap-1">
                                 <div className="flex items-center gap-2">
                                    <span className="text-sm font-black text-slate-900 dark:text-white group-hover:text-brand transition-colors uppercase">{room.title}</span>
                                    {room.isLocked && <Shield className="w-3 h-3 text-amber-500" />}
                                 </div>
                                 <div className="flex items-center gap-2 mt-1">
                                    <Clock className="w-3 h-3 text-slate-400" />
                                    <span className="text-[10px] font-bold text-slate-400 uppercase">Started {new Date(room.createdAt).toLocaleTimeString()}</span>
                                 </div>
                              </div>
                           </td>
                           <td className="px-8 py-6">
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 text-[10px] font-black uppercase tracking-widest">
                                 {room.type === 'Coding' && <Code className="w-3 h-3 text-blue-400" />}
                                 {room.type === 'Debate' && <Sword className="w-3 h-3 text-red-400" />}
                                 {room.type}
                              </span>
                           </td>
                           <td className="px-8 py-6">
                              <div className="flex items-center gap-3">
                                 <img 
                                   src={room.host?.profileImage || 'https://via.placeholder.com/40'} 
                                   className="w-8 h-8 rounded-full ring-2 ring-brand/10" 
                                 />
                                 <span className="text-xs font-black text-slate-900 dark:text-white uppercase">{room.host?.username || 'Host'}</span>
                              </div>
                           </td>
                           <td className="px-8 py-6">
                              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-500 w-fit">
                                 <Users className="w-3 h-3" />
                                 <span className="text-[10px] font-black">{room.participants?.length || 0} / {room.maxParticipants}</span>
                              </div>
                           </td>
                           <td className="px-8 py-6 text-right">
                              <div className="flex items-center justify-end gap-2">
                                 <button 
                                   onClick={() => window.open(room.type === 'Coding' ? `/coding-hub/${room._id}` : `/live-rooms/${room._id}`, '_blank')}
                                   className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-brand hover:bg-brand/10 transition-all"
                                   title="Spy Join"
                                 >
                                    <ArrowUpRight className="w-4 h-4" />
                                 </button>
                                 <button 
                                   onClick={() => handleTerminate(room._id)}
                                   className="p-2.5 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-400 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-500/20 transition-all"
                                   title="Terminate Room"
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
    </div>
  );
}
