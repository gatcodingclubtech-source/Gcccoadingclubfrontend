import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Video, Users, Trash2, Search, Filter, AlertCircle, 
  ArrowUpRight, Clock, Shield, Code, Sword, Settings,
  Megaphone, X, Lock, Unlock, UserMinus, Activity
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export default function LiveRoomsManager() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeType, setActiveType] = useState('All');
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isMonitorModalOpen, setIsMonitorModalOpen] = useState(false);
  const [broadcastMsg, setBroadcastMsg] = useState('');

  const roomTypes = ['All', 'Debate', 'Coding', 'Workshop', 'Study', 'Hackathon'];

  useEffect(() => {
    fetchRooms();
    const interval = setInterval(fetchRooms, 10000); // Auto-refresh every 10s
    return () => clearInterval(interval);
  }, []);

  const fetchRooms = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/live-rooms/admin/monitor`);
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

  const handleUpdateRoom = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(`${API_BASE_URL}/live-rooms/${selectedRoom._id}`, selectedRoom);
      toast.success('Room updated');
      setIsEditModalOpen(false);
      fetchRooms();
    } catch (err) {
      toast.error('Update failed');
    }
  };

  const handleKick = async (roomId, socketId) => {
    if (!window.confirm('Kick this participant?')) return;
    try {
      await axios.post(`${API_BASE_URL}/live-rooms/${roomId}/kick/${socketId}`);
      toast.success('User kicked');
      fetchRooms();
    } catch (err) {
      toast.error('Kick failed');
    }
  };

  const handleBroadcast = async () => {
    if (!broadcastMsg) return;
    try {
      await axios.post(`${API_BASE_URL}/live-rooms/${selectedRoom._id}/broadcast`, { message: broadcastMsg });
      toast.success('Message broadcasted');
      setBroadcastMsg('');
    } catch (err) {
      toast.error('Broadcast failed');
    }
  };

  const filteredRooms = rooms.filter(room => {
    const matchesSearch = room.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = activeType === 'All' || room.type === activeType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white uppercase">Live <span className="text-brand">Command Center</span></h1>
          <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mt-1">Universal Real-time Session Control</p>
        </div>
        
        <div className="flex items-center gap-4 bg-brand/10 border border-brand/20 px-6 py-3 rounded-2xl">
           <div className="text-right">
              <div className="text-2xl font-black text-brand">{rooms.length}</div>
              <div className="text-[10px] font-black text-brand uppercase tracking-widest">Active Signals</div>
           </div>
           <Activity className="w-8 h-8 text-brand animate-pulse" />
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
              className="w-full bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-white/5 rounded-2xl py-4 pl-12 pr-6 font-bold text-sm outline-none focus:border-brand/50 transition-all shadow-sm"
            />
         </div>
         <div className="md:col-span-4 relative">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <select 
              value={activeType}
              onChange={(e) => setActiveType(e.target.value)}
              className="w-full bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-white/5 rounded-2xl py-4 pl-12 pr-6 font-bold text-sm outline-none appearance-none focus:border-brand/50 transition-all shadow-sm"
            >
              {roomTypes.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
         </div>
      </div>

      {/* Room List */}
      <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-white/5 overflow-hidden shadow-xl">
         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead>
                  <tr className="border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/5">
                     <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Session Details</th>
                     <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Live Feed</th>
                     <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Moderation</th>
                     <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                  {loading ? (
                     <tr>
                        <td colSpan="4" className="px-8 py-20 text-center animate-pulse text-slate-400 font-bold uppercase tracking-widest">Intercepting Live Data Streams...</td>
                     </tr>
                  ) : filteredRooms.length === 0 ? (
                     <tr>
                        <td colSpan="4" className="px-8 py-20 text-center text-slate-400 font-bold uppercase tracking-widest flex flex-col items-center gap-4">
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
                                 <div className="flex items-center gap-4 mt-1">
                                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 text-[9px] font-black uppercase">
                                       {room.type}
                                    </span>
                                    <div className="flex items-center gap-1.5">
                                       <Clock className="w-3 h-3 text-slate-400" />
                                       <span className="text-[10px] font-bold text-slate-400 uppercase">Live {new Date(room.createdAt).toLocaleTimeString()}</span>
                                    </div>
                                 </div>
                              </div>
                           </td>
                           <td className="px-8 py-6">
                              <div className="flex items-center gap-6">
                                 <div className="flex flex-col">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Host</span>
                                    <div className="flex items-center gap-2">
                                       <img src={room.host?.profileImage || 'https://via.placeholder.com/40'} className="w-6 h-6 rounded-full ring-2 ring-brand/10" />
                                       <span className="text-xs font-black text-slate-900 dark:text-white uppercase">{room.host?.username}</span>
                                    </div>
                                 </div>
                                 <div className="flex flex-col">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Signal</span>
                                    <button 
                                      onClick={() => { setSelectedRoom(room); setIsMonitorModalOpen(true); }}
                                      className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 transition-all w-fit"
                                    >
                                       <Users className="w-3 h-3" />
                                       <span className="text-[10px] font-black uppercase tracking-widest">{room.activeParticipants?.length || 0} Online</span>
                                    </button>
                                 </div>
                              </div>
                           </td>
                           <td className="px-8 py-6">
                              <div className="flex items-center gap-2">
                                 <button 
                                   onClick={() => { setSelectedRoom(room); setIsEditModalOpen(true); }}
                                   className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-brand hover:bg-brand/10 transition-all"
                                   title="Room Settings"
                                 >
                                    <Settings className="w-4 h-4" />
                                 </button>
                                 <button 
                                   onClick={() => { setSelectedRoom(room); setIsMonitorModalOpen(true); }}
                                   className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-amber-500 hover:bg-amber-500/10 transition-all"
                                   title="Broadcast Alert"
                                 >
                                    <Megaphone className="w-4 h-4" />
                                 </button>
                              </div>
                           </td>
                           <td className="px-8 py-6 text-right">
                              <div className="flex items-center justify-end gap-2">
                                 <button 
                                   onClick={() => window.open(room.type === 'Coding' ? `/coding-hub/${room._id}` : `/live-rooms/${room._id}`, '_blank')}
                                   className="px-4 py-2 rounded-xl bg-brand/10 text-brand text-[10px] font-black uppercase tracking-widest hover:bg-brand hover:text-white transition-all flex items-center gap-2"
                                 >
                                    Spy <ArrowUpRight className="w-3 h-3" />
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

      {/* MONITOR MODAL */}
      {isMonitorModalOpen && selectedRoom && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={() => setIsMonitorModalOpen(false)} />
          <div className="relative bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/5 animate-scale-in">
            <div className="p-8 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Signal Monitoring: <span className="text-brand">{selectedRoom.title}</span></h3>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Real-time Participant Matrix</p>
              </div>
              <button onClick={() => setIsMonitorModalOpen(false)} className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-brand transition-all">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-8 space-y-8">
              {/* Broadcast Alert */}
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Broadcast Admin Alert</label>
                <div className="flex gap-3">
                  <input 
                    type="text" 
                    value={broadcastMsg}
                    onChange={(e) => setBroadcastMsg(e.target.value)}
                    placeholder="Enter urgent message..."
                    className="flex-1 bg-slate-50 dark:bg-white/5 border-2 border-transparent focus:border-brand/50 rounded-2xl px-6 py-4 text-sm font-bold outline-none transition-all"
                  />
                  <button 
                    onClick={handleBroadcast}
                    className="px-6 rounded-2xl bg-brand text-white text-xs font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-brand/20 flex items-center gap-2"
                  >
                    Send <Megaphone className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Participant List */}
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Signals ({selectedRoom.activeParticipants?.length || 0})</label>
                <div className="grid gap-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                  {selectedRoom.activeParticipants?.length === 0 ? (
                     <div className="p-8 text-center text-slate-400 font-bold uppercase tracking-widest bg-slate-50 dark:bg-white/5 rounded-3xl">No active users in session.</div>
                  ) : (
                    selectedRoom.activeParticipants.map((user) => (
                      <div key={user.socketId} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-transparent hover:border-brand/20 transition-all">
                        <div className="flex items-center gap-3">
                          <img src={user.profileImage || 'https://via.placeholder.com/40'} className="w-10 h-10 rounded-full ring-2 ring-brand/10" />
                          <div>
                            <div className="text-sm font-black text-slate-900 dark:text-white uppercase">{user.username}</div>
                            <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{user.socketId}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                           <button 
                             onClick={() => handleKick(selectedRoom._id, user.socketId)}
                             className="p-2.5 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                             title="Kick User"
                           >
                              <UserMinus className="w-4 h-4" />
                           </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {isEditModalOpen && selectedRoom && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={() => setIsEditModalOpen(false)} />
          <div className="relative bg-white dark:bg-slate-900 w-full max-w-lg rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/5 animate-scale-in">
            <div className="p-8 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Override Room Settings</h3>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Host Privilege Bypass</p>
              </div>
              <button onClick={() => setIsEditModalOpen(false)} className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-brand transition-all">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateRoom} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Room Title</label>
                <input 
                  type="text"
                  value={selectedRoom.title}
                  onChange={(e) => setSelectedRoom({...selectedRoom, title: e.target.value})}
                  className="w-full bg-slate-50 dark:bg-white/5 border-2 border-transparent focus:border-brand/50 rounded-2xl px-6 py-4 text-sm font-bold outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Max Capacity</label>
                   <input 
                     type="number"
                     value={selectedRoom.maxParticipants}
                     onChange={(e) => setSelectedRoom({...selectedRoom, maxParticipants: parseInt(e.target.value)})}
                     className="w-full bg-slate-50 dark:bg-white/5 border-2 border-transparent focus:border-brand/50 rounded-2xl px-6 py-4 text-sm font-bold outline-none transition-all"
                   />
                 </div>
                 <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Status</label>
                   <button 
                     type="button"
                     onClick={() => setSelectedRoom({...selectedRoom, isLocked: !selectedRoom.isLocked})}
                     className={`w-full flex items-center justify-center gap-2 px-6 py-4 rounded-2xl border-2 transition-all font-black text-xs uppercase tracking-widest ${
                       selectedRoom.isLocked 
                       ? 'bg-amber-500/10 border-amber-500/50 text-amber-500' 
                       : 'bg-emerald-500/10 border-emerald-500/50 text-emerald-500'
                     }`}
                   >
                     {selectedRoom.isLocked ? <><Lock className="w-4 h-4" /> Locked</> : <><Unlock className="w-4 h-4" /> Open</>}
                   </button>
                 </div>
              </div>

              {selectedRoom.isLocked && (
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Override Password</label>
                  <input 
                    type="text"
                    value={selectedRoom.password || ''}
                    onChange={(e) => setSelectedRoom({...selectedRoom, password: e.target.value})}
                    placeholder="Set new entry code..."
                    className="w-full bg-slate-50 dark:bg-white/5 border-2 border-transparent focus:border-brand/50 rounded-2xl px-6 py-4 text-sm font-bold outline-none transition-all"
                  />
                </div>
              )}

              <button 
                type="submit"
                className="w-full bg-brand text-white py-5 rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-xl shadow-brand/20 hover:scale-[1.02] active:scale-[0.98] transition-all mt-4"
              >
                Sync Overrides
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
