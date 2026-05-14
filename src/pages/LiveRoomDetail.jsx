import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Video, VideoOff, PhoneOff, MessageSquare, Users, Shield, Share2, Hand, Smile } from 'lucide-react';
import socket from '../utils/socket';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

export default function LiveRoomDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const localVideoRef = useRef();

  useEffect(() => {
    if (!user) return;

    // Simulate Room Join
    socket.emit('join-live-room', { roomId: id, user });

    // Mock Room Data (In real app, fetch from API)
    setRoom({
       title: 'Elite AI Debate',
       type: 'Debate',
       isLocked: false
    });

    let localStream = null;

    // Get Local Media
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(stream => {
        localStream = stream;
        if (localVideoRef.current) localVideoRef.current.srcObject = stream;
      })
      .catch(err => toast.error("Media access denied"));

    return () => {
      socket.emit('leave-live-room', id);
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [id, user]);

  // Handle mute/video toggles on actual stream tracks
  useEffect(() => {
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      const stream = localVideoRef.current.srcObject;
      stream.getAudioTracks().forEach(track => track.enabled = !isMuted);
      stream.getVideoTracks().forEach(track => track.enabled = !isVideoOff);
    }
  }, [isMuted, isVideoOff]);

  return (
    <div className="h-screen w-full bg-slate-950 text-white flex flex-col overflow-hidden">
      
      {/* Top Header */}
      <div className="h-20 md:h-16 px-4 md:px-8 flex items-center justify-between border-b border-white/5 bg-slate-900/50 backdrop-blur-xl shrink-0">
         <div className="flex items-center gap-3 md:gap-4">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-brand/10 flex items-center justify-center text-brand">
               <Shield className="w-5 h-5" />
            </div>
            <div className="max-w-[150px] md:max-w-none">
               <h2 className="text-xs md:text-sm font-black uppercase tracking-widest truncate">{room?.title || 'Loading Room...'}</h2>
               <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-brand animate-pulse" />
                  <span className="text-[8px] md:text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Live Session <span className="hidden sm:inline">• 12 Participants</span></span>
               </div>
            </div>
         </div>

          <div className="flex items-center gap-2 md:gap-4">
            <button className="p-2 rounded-lg hover:bg-white/5 text-slate-400 transition-all hidden sm:block">
               <Share2 className="w-4 h-4" />
            </button>
            <button 
              onClick={() => navigate('/live-rooms')}
              className="flex items-center gap-2 px-4 md:px-6 py-2 rounded-xl bg-red-500 text-white text-[10px] font-black uppercase tracking-widest hover:bg-red-600 transition-all shadow-lg shadow-red-500/20"
            >
               <PhoneOff className="w-3 h-3 md:w-4 md:h-4" /> <span className="hidden xs:inline">LEAVE</span>
            </button>
          </div>
      </div>

      {/* Main Grid Section */}
      <div className="flex-1 p-4 md:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 overflow-y-auto">
         
         {/* Local User Card */}
         <div className="relative aspect-video rounded-3xl overflow-hidden bg-slate-900 border-2 border-brand/50 group">
            <video 
              ref={localVideoRef} 
              autoPlay 
              muted 
              className={`w-full h-full object-cover ${isVideoOff ? 'hidden' : 'block'}`} 
            />
            {isVideoOff && (
               <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
                  <div className="w-20 h-20 rounded-full bg-slate-700 flex items-center justify-center text-3xl font-black">
                     {user?.username?.[0]?.toUpperCase() || '?'}
                  </div>
               </div>
            )}
            <div className="absolute bottom-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/60 backdrop-blur-md border border-white/10">
               <span className="text-[10px] font-black uppercase tracking-widest">You (Host)</span>
               {isMuted && <MicOff className="w-3 h-3 text-red-500" />}
            </div>
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
               <div className="px-3 py-1 rounded-full bg-brand text-white text-[8px] font-black uppercase">Speaking</div>
            </div>
         </div>

         {/* Mock Participant Cards */}
         {[1,2,3,4,5].map(i => (
            <div key={i} className="relative aspect-video rounded-3xl overflow-hidden bg-slate-900 border border-white/5">
               <div className="absolute inset-0 flex items-center justify-center bg-slate-800/50">
                  <div className="w-16 h-16 rounded-full bg-slate-700 flex items-center justify-center text-xl font-black text-slate-500">
                     P{i}
                  </div>
               </div>
               <div className="absolute bottom-4 left-4 px-3 py-1.5 rounded-xl bg-black/40 backdrop-blur-md">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Participant_{i}</span>
               </div>
            </div>
         ))}
      </div>

      {/* Bottom Control Bar */}
      <div className="h-20 md:h-24 border-t border-white/5 bg-slate-900/80 backdrop-blur-2xl flex items-center justify-center gap-3 md:gap-6 shrink-0">
         <button 
           onClick={() => setIsMuted(!isMuted)}
           className={`p-3 md:p-4 rounded-xl md:rounded-2xl transition-all ${isMuted ? 'bg-red-500 text-white' : 'bg-white/5 hover:bg-white/10 text-white'}`}
         >
            {isMuted ? <MicOff className="w-5 h-5 md:w-6 md:h-6" /> : <Mic className="w-5 h-5 md:w-6 md:h-6" />}
         </button>
         <button 
           onClick={() => setIsVideoOff(!isVideoOff)}
           className={`p-3 md:p-4 rounded-xl md:rounded-2xl transition-all ${isVideoOff ? 'bg-red-500 text-white' : 'bg-white/5 hover:bg-white/10 text-white'}`}
         >
            {isVideoOff ? <VideoOff className="w-5 h-5 md:w-6 md:h-6" /> : <Video className="w-5 h-5 md:w-6 md:h-6" />}
         </button>
         <div className="w-[1px] h-6 md:h-8 bg-white/10 mx-1 md:mx-2" />
         <button className="p-3 md:p-4 rounded-xl md:rounded-2xl bg-white/5 hover:bg-white/10 text-white">
            <Hand className="w-5 h-5 md:w-6 md:h-6" />
         </button>
         <button className="p-3 md:p-4 rounded-xl md:rounded-2xl bg-white/5 hover:bg-white/10 text-white hidden xs:block">
            <Smile className="w-5 h-5 md:w-6 md:h-6" />
         </button>
         <button className="p-3 md:p-4 rounded-xl md:rounded-2xl bg-white/5 hover:bg-white/10 text-white">
            <MessageSquare className="w-5 h-5 md:w-6 md:h-6" />
         </button>
      </div>

    </div>
  );
}
