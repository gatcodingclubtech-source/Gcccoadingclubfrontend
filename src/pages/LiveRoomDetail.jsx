import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Video, VideoOff, PhoneOff, MessageSquare, Users, Shield, Share2, Hand, Smile, Send, X } from 'lucide-react';
import socket from '../utils/socket';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import Peer from 'simple-peer';

const EMOJIS = ['❤️', '🔥', '👏', '😂', '😮', '🙌', '💯', '✨'];

const ReactionFloating = ({ emoji }) => (
  <motion.div
    initial={{ y: 20, opacity: 0, scale: 0.5 }}
    animate={{ y: -100, opacity: 1, scale: 1.5 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 1.5, ease: "easeOut" }}
    className="absolute bottom-10 left-1/2 -translate-x-1/2 pointer-events-none text-4xl z-50"
  >
    {emoji}
  </motion.div>
);

const RemoteVideo = ({ peer, user, reaction }) => {
  const ref = useRef();

  useEffect(() => {
    peer.on("stream", (stream) => {
      if (ref.current) ref.current.srcObject = stream;
    });
  }, [peer]);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      layout
      className="relative aspect-[4/3] md:aspect-video rounded-3xl md:rounded-[2rem] overflow-hidden bg-slate-900/30 border border-white/5 hover:border-white/10 transition-all group"
    >
      <video playsInline autoPlay ref={ref} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
      
      <AnimatePresence>
        {reaction && <ReactionFloating key={Date.now()} emoji={reaction} />}
      </AnimatePresence>

      <div className="absolute bottom-3 md:bottom-4 left-3 md:left-4 flex items-center gap-2 px-2 md:px-3 py-1 md:py-1.5 rounded-xl md:rounded-2xl bg-black/40 backdrop-blur-xl border border-white/5">
        <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-white transition-colors truncate max-w-[80px] md:max-w-none">
          {user.username}
        </span>
        <div className="flex items-center gap-1.5 border-l border-white/10 pl-2">
          {user.isMuted && <MicOff className="w-2.5 md:w-3 h-2.5 md:h-3 text-red-500/70" />}
          {user.isHandRaised && <Hand className="w-2.5 md:w-3 h-2.5 md:h-3 text-brand animate-bounce" />}
        </div>
      </div>

      {user.isHandRaised && (
        <div className="absolute top-3 md:top-4 right-3 md:right-4 px-2 md:px-3 py-1 rounded-full bg-brand/20 border border-brand/30 text-brand text-[7px] md:text-[8px] font-black uppercase flex items-center gap-1">
          <Hand className="w-2 md:w-2.5 h-2 md:h-2.5" /> Hand Raised
        </div>
      )}
    </motion.div>
  );
};

export default function LiveRoomDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [activeReactions, setActiveReactions] = useState({}); // { socketId: emoji }
  
  const [peers, setPeers] = useState([]);
  const peersRef = useRef([]);
  const localVideoRef = useRef();
  const chatEndRef = useRef();
  const localStreamRef = useRef();

  useEffect(() => {
    if (!user) return;

    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(stream => {
        localStreamRef.current = stream;
        if (localVideoRef.current) localVideoRef.current.srcObject = stream;

        socket.emit('join-live-room', { roomId: id, user });

        socket.on('room-participants', (users) => {
          setParticipants(users.filter(u => u.socketId !== socket.id));
        });

        socket.on('user-joined', ({ socketId, user: joinedUser }) => {
          const peer = createPeer(socketId, socket.id, stream);
          peersRef.current.push({ peerID: socketId, peer, user: joinedUser });
          setPeers(prev => [...prev, { peerID: socketId, peer, user: joinedUser }]);
        });

        socket.on('call-made', ({ signal, from }) => {
          const peer = addPeer(signal, from, stream);
          const callingUser = participants.find(p => p.socketId === from) || { username: 'Participant' };
          peersRef.current.push({ peerID: from, peer, user: callingUser });
          setPeers(prev => [...prev, { peerID: from, peer, user: callingUser }]);
        });

        socket.on('call-answered', ({ signal, from }) => {
          const item = peersRef.current.find(p => p.peerID === from);
          if (item) item.peer.signal(signal);
        });

        socket.on('new-message', (msg) => {
          setMessages(prev => [...prev, msg]);
        });

        socket.on('chat-history', (history) => {
          setMessages(history);
        });

        socket.on('new-reaction', ({ socketId, emoji }) => {
          setActiveReactions(prev => ({ ...prev, [socketId]: emoji }));
          setTimeout(() => {
            setActiveReactions(prev => {
              const newState = { ...prev };
              delete newState[socketId];
              return newState;
            });
          }, 2000);
        });

        socket.on('user-left', (id) => {
          const item = peersRef.current.find(p => p.peerID === id);
          if (item) item.peer.destroy();
          const newPeers = peersRef.current.filter(p => p.peerID !== id);
          peersRef.current = newPeers;
          setPeers(newPeers);
        });

        setRoom({ title: 'Elite AI Debate', type: 'Debate', isLocked: false });
      })
      .catch(err => {
        console.error(err);
        toast.error("Media access denied");
      });

    return () => {
      socket.emit('leave-live-room', id);
      socket.off('room-participants');
      socket.off('user-joined');
      socket.off('call-made');
      socket.off('call-answered');
      socket.off('new-message');
      socket.off('chat-history');
      socket.off('new-reaction');
      socket.off('user-left');
      
      peersRef.current.forEach(p => p.peer.destroy());
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [id, user]);

  function createPeer(userToCall, callerID, stream) {
    const peer = new Peer({ initiator: true, trickle: false, stream });
    peer.on("signal", signal => {
      socket.emit("call-user", { to: userToCall, from: callerID, signal });
    });
    return peer;
  }

  function addPeer(incomingSignal, callerID, stream) {
    const peer = new Peer({ initiator: false, trickle: false, stream });
    peer.on("signal", signal => {
      socket.emit("answer-call", { signal, to: callerID });
    });
    peer.signal(incomingSignal);
    return peer;
  }

  useEffect(() => {
    if (chatEndRef.current) chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [messages, showChat]);

  useEffect(() => {
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach(track => track.enabled = !isMuted);
      localStreamRef.current.getVideoTracks().forEach(track => track.enabled = !isVideoOff);
    }
    socket.emit('toggle-media', { roomId: id, type: 'audio', value: isMuted });
    socket.emit('toggle-media', { roomId: id, type: 'video', value: isVideoOff });
  }, [isMuted, isVideoOff, id]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    socket.emit('send-message', {
      roomId: id,
      message: { text: newMessage, sender: user.username, userId: user._id }
    });
    setNewMessage('');
  };

  const toggleHand = () => {
    const newState = !isHandRaised;
    setIsHandRaised(newState);
    socket.emit('raise-hand', { roomId: id, isRaised: newState });
  };

  const handleSendReaction = (emoji) => {
    socket.emit('send-reaction', { roomId: id, emoji });
    setShowEmojiPicker(false);
    // Local feedback
    setActiveReactions(prev => ({ ...prev, [socket.id]: emoji }));
    setTimeout(() => {
      setActiveReactions(prev => {
        const newState = { ...prev };
        delete newState[socket.id];
        return newState;
      });
    }, 2000);
  };

  return (
    <div className="h-screen w-full bg-[#050811] text-white flex flex-col overflow-hidden font-outfit">
      
      {/* Top Header */}
      <header className="h-14 md:h-16 px-4 md:px-6 flex items-center justify-between border-b border-white/5 bg-[#0A0F1D]/80 backdrop-blur-2xl shrink-0 z-20">
         <div className="flex items-center gap-3 md:gap-4 overflow-hidden">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl md:rounded-2xl bg-brand/10 border border-brand/20 flex items-center justify-center text-brand shrink-0">
               <Shield className="w-4 h-4 md:w-5 md:h-5" />
            </div>
            <div className="truncate">
               <h2 className="text-xs md:text-sm font-black uppercase tracking-widest text-white/90 truncate">{room?.title || 'Loading...'}</h2>
               <div className="flex items-center gap-1.5 md:gap-2">
                  <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[8px] md:text-[10px] font-bold text-slate-500 uppercase tracking-tighter truncate">
                    Live Session • {participants.length + 1} <span className="hidden xs:inline">Participants</span>
                  </span>
               </div>
            </div>
         </div>

          <div className="flex items-center gap-2 md:gap-4">
            <button className="p-2 md:p-2.5 rounded-lg md:rounded-xl hover:bg-white/5 text-slate-400 transition-all hidden sm:block">
               <Share2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
            </button>
            <button 
              onClick={() => navigate('/live-rooms')}
              className="group flex items-center gap-1.5 md:gap-2 px-3 md:px-6 py-1.5 md:py-2.5 rounded-lg md:rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-[9px] md:text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all duration-300"
            >
               <PhoneOff className="w-3.5 h-3.5 md:w-4 md:h-4" /> 
               <span className="hidden xs:inline">Leave Session</span>
               <span className="xs:hidden">LEAVE</span>
            </button>
          </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Grid Section */}
        <main className="flex-1 p-3 md:p-6 overflow-y-auto custom-scrollbar">
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6">
              
              {/* Local User Card */}
              <motion.div 
                layout
                className="relative aspect-[4/3] md:aspect-video rounded-3xl md:rounded-[2rem] overflow-hidden bg-slate-900/50 border-2 border-brand/30 group"
              >
                 <video 
                   ref={localVideoRef} 
                   autoPlay muted playsInline
                   className={`w-full h-full object-cover transition-transform duration-700 ${isVideoOff ? 'opacity-0' : 'opacity-100'}`} 
                 />
                 
                 <AnimatePresence>
                   {activeReactions[socket.id] && <ReactionFloating key={Date.now()} emoji={activeReactions[socket.id]} />}
                 </AnimatePresence>

                 {isVideoOff && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-900 to-[#0A0F1D]">
                       <div className="w-16 h-16 md:w-24 md:h-24 rounded-full bg-brand/10 border border-brand/20 flex items-center justify-center text-3xl md:text-4xl font-black text-brand">
                          {user?.username?.[0]?.toUpperCase() || '?'}
                       </div>
                    </div>
                 )}
                 
                 <div className="absolute bottom-3 md:bottom-4 left-3 md:left-4 flex items-center gap-2 px-2 md:px-3 py-1 md:py-1.5 rounded-xl md:rounded-2xl bg-black/60 backdrop-blur-xl border border-white/10">
                    <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-white/90">You (Host)</span>
                    <div className="flex items-center gap-1.5 border-l border-white/10 pl-2">
                      {isMuted && <MicOff className="w-2.5 md:w-3 h-2.5 md:h-3 text-red-500" />}
                      {isHandRaised && <Hand className="w-2.5 md:w-3 h-2.5 md:h-3 text-brand animate-bounce" />}
                    </div>
                 </div>

                 <div className="absolute top-3 md:top-4 right-3 md:right-4 flex gap-2">
                    <AnimatePresence>
                      {isHandRaised && (
                        <motion.div 
                          initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}
                          className="px-2 md:px-3 py-1 rounded-full bg-brand text-white text-[7px] md:text-[8px] font-black uppercase flex items-center gap-1 shadow-lg shadow-brand/40"
                        >
                          <Hand className="w-2 md:w-2.5 h-2 md:h-2.5" /> Hand Raised
                        </motion.div>
                      )}
                    </AnimatePresence>
                 </div>
              </motion.div>

              {/* Remote Participants */}
              <AnimatePresence>
                {peers.map((peerObj) => (
                   <RemoteVideo 
                     key={peerObj.peerID} 
                     peer={peerObj.peer} 
                     reaction={activeReactions[peerObj.peerID]}
                     user={participants.find(p => p.socketId === peerObj.peerID) || peerObj.user} 
                   />
                ))}
              </AnimatePresence>
           </div>
        </main>

        {/* Chat Sidebar */}
        <AnimatePresence>
          {showChat && (
            <motion.div 
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-full md:w-80 lg:w-96 border-l border-white/5 bg-[#0A0F1D]/60 backdrop-blur-3xl flex flex-col z-30 absolute right-0 inset-y-0"
            >
              <div className="p-4 md:p-6 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-brand/10 flex items-center justify-center text-brand">
                      <MessageSquare className="w-3.5 h-3.5 md:w-4 md:h-4" />
                   </div>
                   <span className="text-[10px] md:text-xs font-black uppercase tracking-widest">Live Chat</span>
                </div>
                <button onClick={() => setShowChat(false)} className="p-1.5 md:p-2 rounded-lg hover:bg-white/5 text-slate-500">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 md:space-y-6 custom-scrollbar">
                {messages.length === 0 && (
                  <div className="h-full flex flex-col items-center justify-center text-slate-600 text-center space-y-4">
                    <MessageSquare className="w-8 h-8 md:w-12 md:h-12 opacity-10" />
                    <p className="text-[8px] md:text-[10px] font-bold uppercase tracking-widest">No messages yet.</p>
                  </div>
                )}
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex flex-col ${msg.sender === user.username ? 'items-end' : 'items-start'}`}>
                    <span className="text-[7px] md:text-[8px] font-black uppercase tracking-tighter text-slate-500 mb-1 ml-1">{msg.sender}</span>
                    <div className={`max-w-[90%] md:max-w-[85%] px-3 md:px-4 py-2 md:py-2.5 rounded-xl md:rounded-2xl text-[10px] md:text-[11px] font-medium ${
                      msg.sender === user.username 
                      ? 'bg-brand text-white rounded-tr-none' 
                      : 'bg-white/5 text-slate-300 rounded-tl-none border border-white/5'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>

              <form onSubmit={handleSendMessage} className="p-4 md:p-6 border-t border-white/5">
                <div className="relative">
                  <input 
                    type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Message..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl md:rounded-2xl px-4 md:px-5 py-2.5 md:py-3.5 pr-10 md:pr-12 text-[10px] md:text-xs focus:outline-none focus:border-brand/50 placeholder:text-slate-600"
                  />
                  <button type="submit" className="absolute right-1.5 md:right-2 top-1/2 -translate-y-1/2 p-1.5 md:p-2 rounded-lg md:rounded-xl bg-brand text-white">
                    <Send className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Control Bar */}
      <footer className="h-20 md:h-24 border-t border-white/5 bg-[#0A0F1D]/90 backdrop-blur-3xl flex items-center justify-center gap-3 md:gap-6 shrink-0 z-20">
         <button 
           onClick={() => setIsMuted(!isMuted)}
           className={`p-3 md:p-4 rounded-xl md:rounded-2xl transition-all ${isMuted ? 'bg-red-500 text-white' : 'bg-white/5 text-slate-300'}`}
         >
            {isMuted ? <MicOff className="w-5 h-5 md:w-6 md:h-6" /> : <Mic className="w-5 h-5 md:w-6 md:h-6" />}
         </button>

         <button 
           onClick={() => setIsVideoOff(!isVideoOff)}
           className={`p-3 md:p-4 rounded-xl md:rounded-2xl transition-all ${isVideoOff ? 'bg-red-500 text-white' : 'bg-white/5 text-slate-300'}`}
         >
            {isVideoOff ? <VideoOff className="w-5 h-5 md:w-6 md:h-6" /> : <Video className="w-5 h-5 md:w-6 md:h-6" />}
         </button>

         <div className="w-[1px] h-8 md:h-10 bg-white/10 mx-1 md:mx-2" />

         <button 
           onClick={toggleHand}
           className={`p-3 md:p-4 rounded-xl md:rounded-2xl transition-all ${isHandRaised ? 'bg-brand text-white' : 'bg-white/5 text-slate-300'}`}
         >
            <Hand className={`w-5 h-5 md:w-6 md:h-6 ${isHandRaised ? 'animate-bounce' : ''}`} />
         </button>

         <div className="relative">
            <button 
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className={`p-3 md:p-4 rounded-xl md:rounded-2xl transition-all ${showEmojiPicker ? 'bg-brand text-white' : 'bg-white/5 text-slate-300'}`}
            >
               <Smile className="w-5 h-5 md:w-6 md:h-6" />
            </button>
            <AnimatePresence>
              {showEmojiPicker && (
                <motion.div 
                  initial={{ y: 20, opacity: 0, scale: 0.8 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: 20, opacity: 0, scale: 0.8 }}
                  className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 p-2 md:p-3 rounded-2xl md:rounded-3xl bg-[#0A0F1D]/90 backdrop-blur-2xl border border-white/10 grid grid-cols-4 gap-1 md:gap-2 shadow-2xl z-50"
                >
                   {EMOJIS.map(emoji => (
                     <button 
                       key={emoji} onClick={() => handleSendReaction(emoji)}
                       className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center hover:bg-white/5 rounded-lg md:rounded-xl transition-all text-base md:text-xl"
                     >
                        {emoji}
                     </button>
                   ))}
                </motion.div>
              )}
            </AnimatePresence>
         </div>

         <button 
           onClick={() => setShowChat(!showChat)}
           className={`p-3 md:p-4 rounded-xl md:rounded-2xl transition-all relative ${showChat ? 'bg-brand text-white' : 'bg-white/5 text-slate-300'}`}
         >
            <MessageSquare className="w-5 h-5 md:w-6 md:h-6" />
            {!showChat && messages.length > 0 && <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-[#0A0F1D]" />}
         </button>
      </footer>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.05); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.1); }
        @media (max-width: 768px) {
          .custom-scrollbar::-webkit-scrollbar { width: 2px; }
        }
      `}</style>

    </div>
  );
}
