import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Video, VideoOff, PhoneOff, MessageSquare, Users, Shield, Share2, Hand, Smile, Send, X, Moon, Sun } from 'lucide-react';
import socket from '../utils/socket';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

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

const RemoteVideo = ({ stream, user, reaction, isFocused, onClick, layoutId, isDarkTheme }) => {
  const ref = useRef();

  useEffect(() => {
    if (ref.current && stream) {
      ref.current.srcObject = stream;
      ref.current.onloadedmetadata = () => {
        ref.current.play().catch(e => console.error("Video play failed", e));
      };
    }
  }, [stream]);

  return (
    <motion.div 
      layoutId={layoutId}
      onClick={onClick}
      className={`relative overflow-hidden bg-[#0A0F1D]/80 border border-white/5 hover:border-white/10 transition-all cursor-pointer group shadow-2xl shadow-black/50 ${
        isFocused ? 'w-full h-full rounded-[2rem]' : 'aspect-[4/3] md:aspect-video w-full rounded-3xl'
      }`}
    >
      <video playsInline autoPlay ref={ref} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]" />
      
      <AnimatePresence>
        {reaction && <ReactionFloating key={Date.now()} emoji={reaction} />}
      </AnimatePresence>

      <div className={`absolute bottom-3 left-3 flex items-center gap-2 px-3 py-1.5 rounded-2xl backdrop-blur-xl border transition-colors duration-500 ${isFocused ? (isDarkTheme ? 'bg-black/60 border-white/10' : 'bg-white/80 border-white/50') : (isDarkTheme ? 'bg-black/60 border-white/10' : 'bg-white/80 border-white/50')}`}>
        <span className={`text-[10px] font-black uppercase tracking-widest transition-colors truncate max-w-[120px] ${isDarkTheme ? 'text-slate-300 group-hover:text-white' : 'text-slate-800'}`}>
          {user?.username || 'Participant'}
        </span>
        <div className={`flex items-center gap-1.5 border-l pl-2 ${isDarkTheme ? 'border-white/10' : 'border-slate-300'}`}>
          {user?.isMuted && <MicOff className="w-3 h-3 text-red-500/80" />}
          {user?.isHandRaised && <Hand className="w-3 h-3 text-amber-400 animate-bounce" />}
        </div>
      </div>

      {user?.isHandRaised && (
        <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-400 text-[8px] font-black uppercase flex items-center gap-1">
          <Hand className="w-2.5 h-2.5" /> Hand Raised
        </div>
      )}
      
      {/* Focus Indicator Overlay */}
      <div className={`absolute inset-0 border-2 rounded-3xl transition-colors pointer-events-none ${isFocused ? 'border-white/20' : 'border-transparent group-hover:border-white/10'}`} />
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
  const [activeReactions, setActiveReactions] = useState({});
  const [focusedVideo, setFocusedVideo] = useState(null); // 'local' | socketId
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  
  // Lobby / Approval State
  const [isApproved, setIsApproved] = useState(false);
  const [pendingRequests, setPendingRequests] = useState([]); // [{ socketId, user }]
  const [entryStatus, setEntryStatus] = useState('joining'); // 'joining', 'waiting', 'denied', 'approved'
  
  const [remoteStreams, setRemoteStreams] = useState({}); // { socketId: MediaStream }
  const peersRef = useRef({}); // { socketId: RTCPeerConnection }
  const participantsRef = useRef([]);
  const localVideoRef = useRef();
  const chatEndRef = useRef();
  const localStreamRef = useRef();

  const iceServers = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
      // Free TURN Server for NAT traversal (OpenRelay Project)
      {
        urls: 'turn:openrelay.metered.ca:80',
        username: 'openrelayproject',
        credential: 'openrelayproject'
      },
      {
        urls: 'turn:openrelay.metered.ca:443',
        username: 'openrelayproject',
        credential: 'openrelayproject'
      },
      {
        urls: 'turn:openrelay.metered.ca:443?transport=tcp',
        username: 'openrelayproject',
        credential: 'openrelayproject'
      }
    ]
  };

  const handleDenyEntry = (targetSocketId) => {
    socket.emit('deny-room-entry', { roomId: id, targetSocketId });
    setPendingRequests(prev => prev.filter(req => req.socketId !== targetSocketId));
  };

  const handleApproveEntry = (targetSocketId) => {
    socket.emit('approve-room-entry', { roomId: id, targetSocketId });
    setPendingRequests(prev => prev.filter(req => req.socketId !== targetSocketId));
  };

  useEffect(() => {
    if (!user) return;

    const joinTheRoom = () => {
      socket.emit('join-live-room', { roomId: id, user });
    };

    const fetchRoomDetails = async () => {
      try {
        const res = await axios.get(`/api/live-rooms/${id}`);
        setRoom(res.data);
        
        const hostId = res.data.host?._id || res.data.host;
        const currentUserId = user?._id || user?.id;
        const isAdmin = user?.role === 'Admin' || user?.isAdmin === true;
        const isHost = hostId === currentUserId || isAdmin;

        console.log('Room entry check:', { hostId, currentUserId, isHost, isAdmin });
        
        if (isHost || !res.data.requiresApproval) {
          setIsApproved(true);
          setEntryStatus('approved');
        } else {
          // If not approved, we still join the room socket but as a "spectator/waiting" 
          // so we can receive signaling if needed, or at least so host can see us?
          // Actually, we stay out of the room participants list for now.
          setEntryStatus('waiting');
          socket.emit('request-room-entry', { roomId: id, user });
          // We join the room socket specifically to receive the approval event
          socket.emit('join-live-room', { roomId: id, user, isWaiting: true });
        }
      } catch (err) {
        toast.error('Failed to load room details');
        navigate('/live-rooms');
      }
    };

    fetchRoomDetails();

    socket.on('entry-request', ({ socketId, user: requestingUser }) => {
      setPendingRequests(prev => [...prev, { socketId, user: requestingUser }]);
      toast.success(`${requestingUser.username} wants to join!`, { icon: '🚪' });
    });

    socket.on('entry-approved', () => {
      setIsApproved(true);
      setEntryStatus('approved');
      toast.success('Host approved your entry!');
    });

    socket.on('entry-denied', () => {
      setEntryStatus('denied');
      toast.error('Entry denied by host');
      setTimeout(() => navigate('/live-rooms'), 3000);
    });

    socket.on('new-reaction', ({ socketId, emoji }) => {
      setActiveReactions(prev => ({ ...prev, [socketId]: emoji }));
      setTimeout(() => setActiveReactions(prev => {
        const next = { ...prev };
        delete next[socketId];
        return next;
      }), 2000);
    });

    // ADMIN MODERATION LISTENERS
    socket.on('force-kick', ({ roomId: kickedRoomId, socketId: kickedSocketId }) => {
      if (kickedRoomId === id && kickedSocketId === socket.id) {
        toast.error('You have been kicked by an administrator', { duration: 5000 });
        navigate('/live-rooms');
      }
    });

    socket.on('admin-broadcast', ({ roomId: alertRoomId, message }) => {
      if (alertRoomId === id) {
        toast(message, {
          icon: '📢',
          duration: 10000,
          style: {
            borderRadius: '16px',
            background: '#0f172a',
            color: '#fff',
            border: '2px solid #10b981',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            fontSize: '12px'
          },
        });
      }
    });

    socket.on(`room-update-${id}`, (updatedRoom) => {
      setRoom(updatedRoom);
      toast.success('Room settings updated by admin');
    });

    return () => {
      socket.off('entry-request');
      socket.off('entry-approved');
      socket.off('entry-denied');
      socket.off('room-participants');
      socket.off('user-joined');
      socket.off('webrtc-signal');
      socket.off('user-left');
      socket.off('chat-history');
      socket.off('new-message');
      socket.off('new-reaction');
      socket.off('force-kick');
      socket.off('admin-broadcast');
      socket.off(`room-update-${id}`);
      socket.emit('leave-live-room', id);
      Object.values(peersRef.current).forEach(peer => peer.close());
    };
  }, [id, user, navigate]);

  const createPeerConnection = (targetSocketId, stream, initiator) => {
    if (peersRef.current[targetSocketId]) {
      return peersRef.current[targetSocketId];
    }

    const peer = new RTCPeerConnection(iceServers);

    if (stream) {
      stream.getTracks().forEach(track => peer.addTrack(track, stream));
    }

    peer.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit('webrtc-signal', { 
          to: targetSocketId, 
          from: socket.id, 
          signal: { type: 'candidate', candidate: event.candidate } 
        });
      }
    };

    peer.ontrack = (event) => {
      setRemoteStreams(prev => ({
        ...prev,
        [targetSocketId]: event.streams[0]
      }));
    };

    if (initiator) {
      peer.createOffer()
        .then(offer => peer.setLocalDescription(offer))
        .then(() => {
          socket.emit('webrtc-signal', {
            to: targetSocketId,
            from: socket.id,
            signal: { type: 'offer', sdp: peer.localDescription }
          });
        })
        .catch(err => console.error("Offer creation failed:", err));
    }

    peersRef.current[targetSocketId] = peer;
    return peer;
  };

  const hasInitMedia = useRef(false);
  const hasJoinedRoom = useRef(false);

  // 1. Media Initialization (Runs once when not joining)
  useEffect(() => {
    if (entryStatus === 'joining' || hasInitMedia.current) return;
    hasInitMedia.current = true;

    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(stream => {
        localStreamRef.current = stream;
        if (localVideoRef.current) localVideoRef.current.srcObject = stream;
        
        // Sync initial media state
        stream.getAudioTracks().forEach(track => track.enabled = !isMuted);
        stream.getVideoTracks().forEach(track => track.enabled = !isVideoOff);

        // If already approved (like host), join immediately now that media is ready
        if (entryStatus === 'approved' && !hasJoinedRoom.current) {
          hasJoinedRoom.current = true;
          socket.emit('join-live-room', { roomId: id, user });
        }
      })
      .catch(err => {
        console.error("Media access denied:", err);
        toast.error("Camera/Mic access denied");
      });
  }, [entryStatus, id, user]);

  // Clean up media strictly on unmount
  useEffect(() => {
    return () => {
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // 2. WebRTC & Socket Listeners (Runs when approved)
  useEffect(() => {
    if (entryStatus !== 'approved') return;

    // If media was already ready when we got approved, join now
    if (localStreamRef.current && !hasJoinedRoom.current) {
      hasJoinedRoom.current = true;
      socket.emit('join-live-room', { roomId: id, user });
    }

    socket.on('room-participants', (users) => {
      const others = users.filter(u => u.socketId !== socket.id);
      participantsRef.current = others;
      setParticipants(others);
    });

    socket.on('user-joined', ({ socketId }) => {
      createPeerConnection(socketId, localStreamRef.current, true);
    });

    socket.on('webrtc-signal', async ({ signal, from }) => {
      try {
        let peer = peersRef.current[from];
        if (signal.type === 'offer') {
          if (!peer) peer = createPeerConnection(from, localStreamRef.current, false);
          await peer.setRemoteDescription(new RTCSessionDescription(signal.sdp));
          const answer = await peer.createAnswer();
          await peer.setLocalDescription(answer);
          socket.emit('webrtc-signal', { to: from, from: socket.id, signal: { type: 'answer', sdp: peer.localDescription } });
        } else if (signal.type === 'answer' && peer) {
          await peer.setRemoteDescription(new RTCSessionDescription(signal.sdp));
        } else if (signal.type === 'candidate' && peer) {
          await peer.addIceCandidate(new RTCIceCandidate(signal.candidate));
        }
      } catch (err) { console.error("WebRTC Signaling Error:", err); }
    });

    socket.on('new-message', (msg) => {
      setMessages(prev => [...prev, msg]);
    });

    socket.on('chat-history', (history) => {
      setMessages(history);
    });

    socket.on('user-left', (id) => {
      if (peersRef.current[id]) {
        peersRef.current[id].close();
        delete peersRef.current[id];
      }
      setRemoteStreams(prev => {
        const newState = { ...prev };
        delete newState[id];
        return newState;
      });
    });

    return () => {
      socket.off('room-participants');
      socket.off('user-joined');
      socket.off('webrtc-signal');
      socket.off('new-message');
      socket.off('chat-history');
      socket.off('user-left');
    };
  }, [entryStatus, id, user]);

  // Sync video source when UI unmounts/remounts (Lobby -> Main Room)
  useEffect(() => {
    if (localVideoRef.current && localStreamRef.current && localVideoRef.current.srcObject !== localStreamRef.current) {
      localVideoRef.current.srcObject = localStreamRef.current;
    }
  });

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
    setActiveReactions(prev => ({ ...prev, [socket.id]: emoji }));
    setTimeout(() => {
      setActiveReactions(prev => {
        const newState = { ...prev };
        delete newState[socket.id];
        return newState;
      });
    }, 2000);
  };

  if (!room || entryStatus === 'joining') return (
    <div className="h-screen w-full bg-[#050811] flex items-center justify-center text-white">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-brand border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm font-black uppercase tracking-widest text-brand">Joining room...</p>
      </div>
    </div>
  );

  if (entryStatus === 'waiting') return (
    <div className="min-h-screen bg-[#0A0F1D] flex flex-col items-center justify-center p-6">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        className="glass-panel p-8 md:p-12 max-w-2xl w-full flex flex-col md:flex-row gap-8 md:gap-12 border-brand/20 shadow-2xl shadow-brand/10 bg-white/5"
      >
        {/* Preview Section */}
        <div className="flex-1 space-y-4">
           <div className="relative aspect-video rounded-3xl overflow-hidden bg-slate-900 border border-white/5">
              <video ref={localVideoRef} autoPlay playsInline muted className={`w-full h-full object-cover ${isVideoOff ? 'hidden' : ''}`} />
              {isVideoOff && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-900">
                  <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center">
                    <VideoOff className="w-8 h-8 text-slate-500" />
                  </div>
                </div>
              )}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3">
                 <button 
                   onClick={() => setIsMuted(!isMuted)}
                   className={`p-4 rounded-2xl transition-all ${isMuted ? 'bg-red-500 text-white' : 'bg-white/10 text-white backdrop-blur-xl hover:bg-white/20'}`}
                 >
                   {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                 </button>
                 <button 
                   onClick={() => setIsVideoOff(!isVideoOff)}
                   className={`p-4 rounded-2xl transition-all ${isVideoOff ? 'bg-red-500 text-white' : 'bg-white/10 text-white backdrop-blur-xl hover:bg-white/20'}`}
                 >
                   {isVideoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
                 </button>
              </div>
           </div>
           <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 text-center">Check your equipment before joining</p>
        </div>

        {/* Info Section */}
        <div className="flex-1 flex flex-col justify-center space-y-8 text-center md:text-left">
           <div className="space-y-2">
             <div className="flex items-center gap-3 justify-center md:justify-start">
               <Shield className="w-5 h-5 text-brand" />
               <h2 className="text-3xl font-black uppercase tracking-tighter text-white">Lobby</h2>
             </div>
             <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Waiting for Host Approval</p>
           </div>
           
           <div className="p-6 bg-brand/5 rounded-2xl border border-brand/10">
             <p className="text-sm font-medium text-slate-300 leading-relaxed">
               The host has been notified. You'll be admitted as soon as they approve your request to join <span className="text-brand font-black">"{room.title}"</span>.
             </p>
           </div>

           <button 
             onClick={() => navigate('/live-rooms')}
             className="w-full py-4 rounded-xl border border-white/10 text-slate-400 text-[10px] font-black uppercase tracking-widest hover:bg-white/5 transition-all"
           >
             Cancel Request
           </button>
        </div>
      </motion.div>
    </div>
  );

  if (entryStatus === 'denied') return (
    <div className="min-h-screen bg-[#0A0F1D] flex flex-col items-center justify-center p-6 text-center">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        className="glass-panel p-12 max-w-md w-full space-y-6 border-red-500/20 bg-white/5"
      >
        <X className="w-16 h-16 text-red-500 mx-auto" />
        <h2 className="text-3xl font-black uppercase tracking-tighter text-white">Entry Denied</h2>
        <p className="text-slate-400 font-medium">Sorry, the host has declined your request to join this room.</p>
        <button 
          onClick={() => navigate('/live-rooms')}
          className="w-full py-4 bg-slate-800 text-white rounded-xl font-black tracking-widest uppercase text-[10px]"
        >
          Return to Arena
        </button>
      </motion.div>
    </div>
  );

  return (
    <div className={`h-screen w-full flex flex-col overflow-hidden font-outfit relative transition-colors duration-500 ${isDarkTheme ? 'bg-[#050811] text-white' : 'bg-slate-50 text-slate-900'}`}>
      <div className={`absolute inset-0 z-0 pointer-events-none transition-colors duration-500 ${isDarkTheme ? 'bg-gradient-to-br from-[#0A0F1D] to-[#050811]' : 'bg-gradient-to-br from-blue-50/40 via-white/80 to-purple-50/40'}`} />
      
      <header className={`h-14 md:h-16 px-4 md:px-6 flex items-center justify-between border-b shrink-0 z-20 transition-colors duration-500 ${isDarkTheme ? 'border-white/5 bg-[#0A0F1D]/80 shadow-black/20' : 'border-slate-200/60 bg-white/60 shadow-sm shadow-slate-200/20'} backdrop-blur-2xl`}>
         <div className="flex items-center gap-3 md:gap-4 overflow-hidden">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl md:rounded-2xl bg-brand/10 border border-brand/20 flex items-center justify-center text-brand shrink-0">
               <Shield className="w-4 h-4 md:w-5 md:h-5" />
            </div>
             <div className="truncate">
               <h2 className="text-xs md:text-sm font-black uppercase tracking-widest text-slate-800 truncate">{room?.title || 'Loading...'}</h2>
               <div className="flex items-center gap-1.5 md:gap-2">
                  <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-emerald-500 animate-pulse shadow-sm shadow-emerald-500/50" />
                  <span className="text-[8px] md:text-[10px] font-bold text-slate-500 uppercase tracking-tighter truncate">
                    Live Session • {participants.length + 1} <span className="hidden xs:inline">Participants</span>
                  </span>
               </div>
            </div>
         </div>

           <div className="flex items-center gap-2 md:gap-4">
            <button className={`p-2 md:p-2.5 rounded-lg md:rounded-xl transition-all hidden sm:block ${isDarkTheme ? 'hover:bg-white/5 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}>
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

      <AnimatePresence>
        {pendingRequests.length > 0 && (
          <motion.div 
            initial={{ x: 300, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 300, opacity: 0 }}
            className="fixed top-24 right-6 w-80 z-50 space-y-4"
          >
            <div className="p-4 bg-white/90 backdrop-blur-2xl border border-brand/20 rounded-2xl shadow-2xl shadow-brand/10">
               <div className="flex items-center justify-between mb-4">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-brand">Entry Requests ({pendingRequests.length})</h4>
                  <Shield className="w-3 h-3 text-brand" />
               </div>
               <div className="space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar">
                  {pendingRequests.map((req) => (
                    <div key={req.socketId} className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-3 shadow-sm">
                       <div className="flex items-center gap-2 min-w-0">
                          <img src={req.user.profileImage || 'https://via.placeholder.com/40'} className="w-8 h-8 rounded-full border border-slate-200" alt="avatar" />
                          <span className="text-xs font-black text-slate-800 truncate">{req.user.username}</span>
                       </div>
                       <div className="flex gap-1 shrink-0">
                          <button onClick={() => handleApproveEntry(req.socketId)} className="p-2 rounded-lg bg-green-500/10 text-green-600 hover:bg-green-500 transition-all hover:text-white"><Send className="w-3 h-3 rotate-[-45deg]" /></button>
                          <button onClick={() => handleDenyEntry(req.socketId)} className="p-2 rounded-lg bg-red-500/10 text-red-600 hover:bg-red-500 transition-all hover:text-white"><X className="w-3 h-3" /></button>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 flex overflow-hidden relative">
        
        <main className="flex-1 overflow-hidden flex flex-col relative z-10">
           
           {focusedVideo ? (
             <div className="w-full h-full flex flex-col lg:flex-row gap-4 overflow-hidden p-3 md:p-6">
                 {/* Main Focused Video */}
                <div className={`flex-1 h-full min-h-[40vh] lg:min-h-0 relative rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl transition-colors duration-500 ${isDarkTheme ? 'bg-[#0A0F1D] border-white/5 shadow-black/50' : 'bg-slate-200 border-white/10'}`}>
                   {focusedVideo === 'local' ? (
                     <motion.div 
                       layoutId="local-video"
                       onClick={() => setFocusedVideo(null)}
                       className="w-full h-full relative group cursor-pointer"
                     >
                        <video ref={localVideoRef} autoPlay muted playsInline className={`w-full h-full object-cover transition-all duration-700 ${isVideoOff ? 'opacity-0' : 'opacity-100'}`} />
                        <AnimatePresence>{activeReactions[socket.id] && <ReactionFloating key={Date.now()} emoji={activeReactions[socket.id]} />}</AnimatePresence>
                        {isVideoOff && (
                           <div className="absolute inset-0 flex items-center justify-center bg-slate-300">
                              <div className="w-24 h-24 rounded-full bg-white/50 border border-white/20 flex items-center justify-center text-4xl font-black text-slate-600">{user?.username?.[0]?.toUpperCase() || '?'}</div>
                           </div>
                        )}
                        <div className="absolute bottom-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-white/80 backdrop-blur-xl border border-white/50">
                           <span className="text-[10px] font-black uppercase tracking-widest text-slate-800">You</span>
                           <div className="flex items-center gap-1.5 border-l border-slate-300 pl-2">
                             {isMuted && <MicOff className="w-3 h-3 text-red-500" />}
                             {isHandRaised && <Hand className="w-3 h-3 text-amber-500 animate-bounce" />}
                           </div>
                        </div>
                     </motion.div>
                   ) : (
                     Object.entries(remoteStreams).filter(([id]) => id === focusedVideo).map(([socketId, stream]) => (
                        <RemoteVideo key={socketId} layoutId={`remote-${socketId}`} stream={stream} reaction={activeReactions[socketId]} user={participantsRef.current.find(p => p.socketId === socketId)} isFocused={true} onClick={() => setFocusedVideo(null)} isDarkTheme={isDarkTheme} />
                     ))
                   )}
                </div>

                {/* Sidebar / Bottom Row for others */}
                <div className="w-full lg:w-72 shrink-0 flex flex-row lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto custom-scrollbar pb-2 lg:pb-0">
                   {focusedVideo !== 'local' && (
                     <motion.div 
                       layoutId="local-video"
                       onClick={() => setFocusedVideo('local')}
                       className="relative aspect-video w-[200px] lg:w-full shrink-0 rounded-2xl overflow-hidden bg-slate-200 border border-white/5 hover:border-white/20 transition-all cursor-pointer group shadow-xl"
                     >
                        <video ref={localVideoRef} autoPlay muted playsInline className={`w-full h-full object-cover ${isVideoOff ? 'opacity-0' : 'opacity-100'}`} />
                        {isVideoOff && (
                           <div className="absolute inset-0 flex items-center justify-center bg-slate-300">
                              <div className="w-12 h-12 rounded-full bg-white/50 border border-white/20 flex items-center justify-center text-xl font-black text-slate-600">{user?.username?.[0]?.toUpperCase() || '?'}</div>
                           </div>
                        )}
                        <div className="absolute bottom-2 left-2 flex items-center gap-2 px-2 py-1 rounded-xl bg-white/80 backdrop-blur-xl border border-white/50">
                           <span className="text-[8px] font-black uppercase tracking-widest text-slate-700">You</span>
                        </div>
                     </motion.div>
                   )}
                   {Object.entries(remoteStreams).filter(([id]) => id !== focusedVideo).map(([socketId, stream]) => (
                     <div key={socketId} className="w-[200px] lg:w-full shrink-0">
                       <RemoteVideo layoutId={`remote-${socketId}`} stream={stream} reaction={activeReactions[socketId]} user={participantsRef.current.find(p => p.socketId === socketId)} isFocused={false} onClick={() => setFocusedVideo(socketId)} isDarkTheme={isDarkTheme} />
                     </div>
                   ))}
                </div>
             </div>
           ) : (
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 auto-rows-max overflow-y-auto custom-scrollbar h-full p-4">
                
                 {/* Local User Card */}
                <motion.div 
                  layoutId="local-video"
                  onClick={() => setFocusedVideo('local')}
                  className={`relative aspect-[4/3] md:aspect-video rounded-3xl md:rounded-[2rem] overflow-hidden transition-all cursor-pointer group shadow-xl ${isDarkTheme ? 'bg-slate-900/50 border-white/5 hover:border-white/20 shadow-black/50' : 'bg-slate-200 border-white/20 hover:border-slate-300 shadow-slate-200/50'}`}
                >
                   <video ref={localVideoRef} autoPlay muted playsInline className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02] ${isVideoOff ? 'opacity-0' : 'opacity-100'}`} />
                   
                   <AnimatePresence>
                     {activeReactions[socket.id] && <ReactionFloating key={Date.now()} emoji={activeReactions[socket.id]} />}
                   </AnimatePresence>

                   {isVideoOff && (
                      <div className="absolute inset-0 flex items-center justify-center bg-slate-300">
                         <div className="w-16 h-16 md:w-24 md:h-24 rounded-full bg-white/50 border border-white flex items-center justify-center text-3xl md:text-4xl font-black text-slate-500 shadow-inner">
                            {user?.username?.[0]?.toUpperCase() || '?'}
                         </div>
                      </div>
                   )}
                   
                   <div className={`absolute bottom-3 left-3 flex items-center gap-2 px-3 py-1.5 rounded-2xl backdrop-blur-xl border transition-colors duration-500 ${isDarkTheme ? 'bg-black/60 border-white/10' : 'bg-white/80 border-white/50'}`}>
                      <span className={`text-[10px] font-black uppercase tracking-widest ${isDarkTheme ? 'text-slate-300 group-hover:text-white' : 'text-slate-800'}`}>You</span>
                      <div className={`flex items-center gap-1.5 border-l pl-2 ${isDarkTheme ? 'border-white/10' : 'border-slate-300'}`}>
                        {isMuted && <MicOff className="w-3 h-3 text-red-500/80" />}
                        {isHandRaised && <Hand className="w-3 h-3 text-amber-500 animate-bounce" />}
                      </div>
                   </div>

                   <div className="absolute top-3 right-3 flex gap-2">
                      <AnimatePresence>
                        {isHandRaised && (
                          <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }} className="px-3 py-1 rounded-full bg-amber-500 text-white text-[8px] font-black uppercase flex items-center gap-1 shadow-lg shadow-amber-500/20">
                            <Hand className="w-2.5 h-2.5" /> Hand Raised
                          </motion.div>
                        )}
                      </AnimatePresence>
                   </div>
                </motion.div>

                {/* Remote Participants */}
                <AnimatePresence>
                  {Object.entries(remoteStreams).map(([socketId, stream]) => (
                     <RemoteVideo key={socketId} layoutId={`remote-${socketId}`} stream={stream} reaction={activeReactions[socketId]} user={participantsRef.current.find(p => p.socketId === socketId)} isFocused={false} onClick={() => setFocusedVideo(socketId)} isDarkTheme={isDarkTheme} />
                  ))}
                </AnimatePresence>
             </div>
           )}

        </main>

        {/* Chat Sidebar */}
        <AnimatePresence>
          {showChat && (
            <motion.div 
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className={`w-full md:w-80 lg:w-96 backdrop-blur-3xl flex flex-col z-50 absolute right-0 inset-y-0 shadow-2xl transition-colors duration-500 border-l ${isDarkTheme ? 'border-white/5 bg-[#0A0F1D]/80 shadow-black/50' : 'border-slate-200 bg-white/90 shadow-slate-300/50'}`}
            >
              <div className={`p-4 md:p-6 border-b flex items-center justify-between transition-colors duration-500 ${isDarkTheme ? 'border-white/5 bg-[#0A0F1D]/40' : 'border-slate-100 bg-white/40'}`}>
                <div className="flex items-center gap-3">
                   <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-brand/10 flex items-center justify-center text-brand shadow-sm shadow-brand/10">
                      <MessageSquare className="w-3.5 h-3.5 md:w-4 md:h-4" />
                   </div>
                   <span className={`text-[10px] md:text-xs font-black uppercase tracking-widest ${isDarkTheme ? 'text-white' : 'text-slate-800'}`}>Live Chat</span>
                </div>
                <button onClick={() => setShowChat(false)} className={`p-1.5 md:p-2 rounded-lg transition-colors ${isDarkTheme ? 'hover:bg-white/5 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}>
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 md:space-y-6 custom-scrollbar">
                {messages.length === 0 && (
                  <div className="h-full flex flex-col items-center justify-center text-slate-400 text-center space-y-4">
                    <MessageSquare className="w-8 h-8 md:w-12 md:h-12 opacity-20" />
                    <p className="text-[8px] md:text-[10px] font-bold uppercase tracking-widest">No messages yet.</p>
                  </div>
                )}
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex flex-col ${msg.sender === user.username ? 'items-end' : 'items-start'}`}>
                    <span className="text-[7px] md:text-[8px] font-black uppercase tracking-tighter text-slate-400 mb-1 ml-1">{msg.sender}</span>
                    <div className={`max-w-[90%] md:max-w-[85%] px-3 md:px-4 py-2 md:py-2.5 rounded-xl md:rounded-2xl text-[10px] md:text-[11px] font-medium shadow-sm transition-colors duration-500 ${
                      msg.sender === user.username 
                      ? 'bg-brand text-white rounded-tr-none shadow-brand/20' 
                      : isDarkTheme ? 'bg-white/10 border border-white/5 text-slate-200 rounded-tl-none' : 'bg-slate-100 border border-slate-200 text-slate-700 rounded-tl-none'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>

              <form onSubmit={handleSendMessage} className={`p-4 md:p-6 border-t transition-colors duration-500 ${isDarkTheme ? 'border-white/5 bg-[#0A0F1D]/40' : 'border-slate-100 bg-white/40'}`}>
                <div className={`relative shadow-sm rounded-xl md:rounded-2xl transition-colors duration-500 ${isDarkTheme ? 'shadow-black/50' : 'shadow-slate-200/50'}`}>
                  <input 
                    type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Message..."
                    className={`w-full border rounded-xl md:rounded-2xl px-4 md:px-5 py-2.5 md:py-3.5 pr-10 md:pr-12 text-[10px] md:text-xs focus:outline-none focus:border-brand/50 focus:ring-4 focus:ring-brand/10 transition-all ${isDarkTheme ? 'bg-[#050811] border-white/10 text-white placeholder:text-slate-500' : 'bg-slate-50 border-slate-200 text-slate-800 placeholder:text-slate-400'}`}
                  />
                  <button type="submit" className="absolute right-1.5 md:right-2 top-1/2 -translate-y-1/2 p-1.5 md:p-2 rounded-lg md:rounded-xl bg-brand text-white shadow-md hover:bg-brand/90 transition-colors">
                    <Send className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Floating Control Pill */}
      <div className={`absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-3 rounded-[2rem] border backdrop-blur-xl shadow-2xl flex items-center justify-center gap-2 md:gap-3 z-40 transition-colors duration-500 ${isDarkTheme ? 'border-white/10 bg-[#0A0F1D]/80 shadow-black/50' : 'border-white/60 bg-white/70 shadow-slate-300/50'}`}>
         
         <button 
           onClick={() => setIsDarkTheme(!isDarkTheme)}
           className={`p-3 md:p-3.5 rounded-full transition-all shadow-sm ${isDarkTheme ? 'bg-white/5 text-slate-300 hover:bg-white/10 hover:shadow-md' : 'bg-slate-100/80 text-slate-600 hover:bg-white hover:shadow-md'}`}
         >
            {isDarkTheme ? <Sun className="w-5 h-5 md:w-5 md:h-5 text-amber-400" /> : <Moon className="w-5 h-5 md:w-5 md:h-5 text-slate-600" />}
         </button>
         
         <div className={`w-[1px] h-6 mx-1 md:mx-2 transition-colors duration-500 ${isDarkTheme ? 'bg-white/10' : 'bg-slate-300/50'}`} />

         <button 
           onClick={() => setIsMuted(!isMuted)}
           className={`p-3 md:p-3.5 rounded-full transition-all shadow-sm ${isMuted ? 'bg-red-500 text-white shadow-red-500/30' : isDarkTheme ? 'bg-white/5 text-slate-300 hover:bg-white/10' : 'bg-slate-100/80 text-slate-600 hover:bg-white'}`}
         >
            {isMuted ? <MicOff className="w-5 h-5 md:w-5 md:h-5" /> : <Mic className="w-5 h-5 md:w-5 md:h-5" />}
         </button>

         <button 
           onClick={() => setIsVideoOff(!isVideoOff)}
           className={`p-3 md:p-3.5 rounded-full transition-all shadow-sm ${isVideoOff ? 'bg-red-500 text-white shadow-red-500/30' : isDarkTheme ? 'bg-white/5 text-slate-300 hover:bg-white/10' : 'bg-slate-100/80 text-slate-600 hover:bg-white'}`}
         >
            {isVideoOff ? <VideoOff className="w-5 h-5 md:w-5 md:h-5" /> : <Video className="w-5 h-5 md:w-5 md:h-5" />}
         </button>

         <div className={`w-[1px] h-6 mx-1 md:mx-2 transition-colors duration-500 ${isDarkTheme ? 'bg-white/10' : 'bg-slate-300/50'}`} />

         <button 
           onClick={toggleHand}
           className={`p-3 md:p-3.5 rounded-full transition-all shadow-sm ${isHandRaised ? 'bg-amber-500 text-white shadow-amber-500/30' : isDarkTheme ? 'bg-white/5 text-slate-300 hover:bg-white/10' : 'bg-slate-100/80 text-slate-600 hover:bg-white'}`}
         >
            <Hand className={`w-5 h-5 md:w-5 md:h-5 ${isHandRaised ? 'animate-bounce' : ''}`} />
         </button>

         <div className="relative">
            <button 
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className={`p-3 md:p-3.5 rounded-full transition-all shadow-sm ${showEmojiPicker ? 'bg-brand text-white shadow-brand/30' : isDarkTheme ? 'bg-white/5 text-slate-300 hover:bg-white/10' : 'bg-slate-100/80 text-slate-600 hover:bg-white'}`}
            >
               <Smile className="w-5 h-5 md:w-5 md:h-5" />
            </button>
            <AnimatePresence>
              {showEmojiPicker && (
                <motion.div 
                  initial={{ y: 20, opacity: 0, scale: 0.8 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: 20, opacity: 0, scale: 0.8 }}
                  className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-4 p-2 md:p-3 rounded-2xl md:rounded-3xl backdrop-blur-2xl grid grid-cols-4 gap-1 md:gap-2 shadow-2xl z-50 transition-colors duration-500 ${isDarkTheme ? 'bg-[#0A0F1D]/90 border border-white/10 shadow-black/50' : 'bg-white/90 border border-slate-200/60 shadow-slate-200/50'}`}
                >
                   {EMOJIS.map(emoji => (
                     <button 
                       key={emoji} onClick={() => handleSendReaction(emoji)}
                       className={`w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-lg md:rounded-xl transition-all text-base md:text-xl ${isDarkTheme ? 'hover:bg-white/5' : 'hover:bg-slate-100'}`}
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
           className={`p-3 md:p-3.5 rounded-full transition-all relative shadow-sm ${showChat ? 'bg-brand text-white shadow-brand/30' : isDarkTheme ? 'bg-white/5 text-slate-300 hover:bg-white/10' : 'bg-slate-100/80 text-slate-600 hover:bg-white'}`}
         >
            <MessageSquare className="w-5 h-5 md:w-5 md:h-5" />
            {!showChat && messages.length > 0 && <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white shadow-sm" />}
         </button>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.1); }
        @media (max-width: 768px) {
          .custom-scrollbar::-webkit-scrollbar { width: 2px; }
        }
      `}</style>

    </div>
  );
}
