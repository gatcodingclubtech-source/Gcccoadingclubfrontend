import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Editor from "@monaco-editor/react";
import { 
  Play, Save, Users, MessageSquare, 
  Settings, ChevronRight, Terminal, 
  Share2, Zap, Layout, FileCode, Bot,
  X, Send
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import socket from '../utils/socket';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

export default function CodingHub() {
  const { roomId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [code, setCode] = useState('// Welcome to GCC OS Coding Hub\n// Collaborate in real-time...\n\nfunction main() {\n  console.log("Neural Link Established");\n}\n\nmain();');
  const [language, setLanguage] = useState('javascript');
  const [activeUsers, setActiveUsers] = useState([]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMsg, setInputMsg] = useState('');
  const editorRef = useRef(null);

  useEffect(() => {
    if (user) {
      // Join coding room
      socket.emit('join-coding-room', { roomId, user });

      socket.on('workspace-update', (files) => {
        // Simple one-file sync for now
        if (files && files[0]) {
          setCode(files[0].content);
        }
      });

      socket.on('room-users', (users) => {
        setActiveUsers(users);
      });

      socket.on('receive-coding-message', (msg) => {
        setMessages(prev => [...prev, msg]);
      });
    }

    return () => {
      socket.off('workspace-update');
      socket.off('room-users');
      socket.off('receive-coding-message');
    };
  }, [roomId, user]);

  const handleEditorChange = (value) => {
    setCode(value);
    // Broadcast changes to others
    socket.emit('workspace-change', { roomId, files: [{ id: '1', name: 'main.js', content: value }] });
  };

  const handleSendMessage = () => {
    if (!inputMsg.trim()) return;
    const msg = { text: inputMsg, author: user.name, id: Date.now() };
    socket.emit('send-coding-message', { roomId, msg });
    setMessages(prev => [...prev, msg]);
    setInputMsg('');
  };

  const handleRunCode = () => {
    toast.success('Compiling neural sequence...', { icon: '⚡' });
    // TODO: Connect to Judge0 API
  };

  return (
    <div className="h-screen bg-slate-950 flex flex-col overflow-hidden text-slate-100">
      {/* HUB HEADER */}
      <header className="h-16 bg-black/40 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                <FileCode className="text-white w-5 h-5" />
             </div>
             <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Arena / Coding Hub</span>
                <span className="text-xs font-bold text-white tracking-tight">Project: {roomId}</span>
             </div>
          </div>
          <div className="h-6 w-px bg-white/10" />
          <div className="flex items-center gap-2">
             <select 
               value={language} 
               onChange={(e) => setLanguage(e.target.value)}
               className="bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-[10px] font-bold uppercase tracking-widest outline-none"
             >
                <option value="javascript">Javascript</option>
                <option value="python">Python</option>
                <option value="cpp">C++</option>
             </select>
          </div>
        </div>

        <div className="flex items-center gap-4">
           {/* Active Users */}
           <div className="flex -space-x-2">
              {activeUsers.map((u, i) => (
                <div key={i} className="w-8 h-8 rounded-full bg-slate-800 border-2 border-slate-950 flex items-center justify-center overflow-hidden" title={u.name}>
                   {u.avatar ? <img src={u.avatar} className="w-full h-full object-cover" /> : <span className="text-[8px] font-bold">{u.name[0]}</span>}
                </div>
              ))}
           </div>
           
           <button onClick={handleRunCode} className="px-5 py-2 bg-emerald-500 hover:bg-emerald-600 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all shadow-lg shadow-emerald-500/20">
              <Play className="w-3.5 h-3.5" /> RUN CODE
           </button>
           
           <button onClick={() => navigate('/live-rooms')} className="p-2 text-slate-400 hover:text-white transition-all">
              <X className="w-5 h-5" />
           </button>
        </div>
      </header>

      {/* MAIN WORKSPACE */}
      <div className="flex-1 flex overflow-hidden">
         {/* Sidebar Tools */}
         <aside className="w-16 bg-black/40 border-r border-white/5 flex flex-col items-center py-6 gap-6 shrink-0">
            <button className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl"><FileCode className="w-5 h-5" /></button>
            <button className="p-3 text-slate-500 hover:text-slate-300 transition-all"><Layout className="w-5 h-5" /></button>
            <button className="p-3 text-slate-500 hover:text-slate-300 transition-all"><Zap className="w-5 h-5" /></button>
            <button className="p-3 text-slate-500 hover:text-slate-300 transition-all"><Terminal className="w-5 h-5" /></button>
            
            <div className="mt-auto flex flex-col gap-6">
               <button onClick={() => setIsChatOpen(!isChatOpen)} className={`p-3 relative transition-all ${isChatOpen ? 'text-emerald-500 bg-emerald-500/10 rounded-xl' : 'text-slate-500'}`}>
                  <MessageSquare className="w-5 h-5" />
                  <div className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full border-2 border-slate-950" />
               </button>
               <button className="p-3 text-slate-500"><Settings className="w-5 h-5" /></button>
            </div>
         </aside>

         {/* Editor Container */}
         <div className="flex-1 relative bg-slate-950">
            <Editor
              height="100%"
              theme="vs-dark"
              language={language}
              value={code}
              onChange={handleEditorChange}
              onMount={(editor) => { editorRef.current = editor; }}
              options={{
                fontSize: 14,
                fontFamily: 'JetBrains Mono, monospace',
                minimap: { enabled: true },
                padding: { top: 20 },
                lineNumbers: 'on',
                glyphMargin: true,
                cursorBlinking: 'smooth',
                cursorSmoothCaretAnimation: 'on',
                smoothScrolling: true,
                roundedSelection: true,
                scrollBeyondLastLine: false,
                automaticLayout: true,
              }}
            />

            {/* Terminal Overlay (Minimized) */}
            <div className="absolute bottom-0 left-0 right-0 h-10 bg-black/60 backdrop-blur-md border-t border-white/5 flex items-center px-6 justify-between">
               <div className="flex items-center gap-3">
                  <Terminal className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Terminal Output / No active session</span>
               </div>
               <div className="flex items-center gap-4 text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                  <span>Line 1, Column 1</span>
                  <span>UTF-8</span>
               </div>
            </div>
         </div>

         {/* Chat Drawer */}
         <AnimatePresence>
            {isChatOpen && (
               <motion.div 
                 initial={{ x: 350 }}
                 animate={{ x: 0 }}
                 exit={{ x: 350 }}
                 className="w-[350px] bg-black/40 backdrop-blur-3xl border-l border-white/5 flex flex-col shrink-0"
               >
                  <div className="p-6 border-b border-white/5 flex items-center justify-between">
                     <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Neural Chat</span>
                     <button onClick={() => setIsChatOpen(false)}><X className="w-4 h-4 text-slate-400" /></button>
                  </div>

                  <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4 custom-scrollbar">
                     {messages.map((m, i) => (
                       <div key={i} className={`flex flex-col ${m.author === user.name ? 'items-end' : 'items-start'}`}>
                          <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">{m.author}</span>
                          <div className={`px-4 py-2 rounded-2xl text-xs font-medium max-w-[85%] ${m.author === user.name ? 'bg-emerald-500 text-white rounded-tr-none' : 'bg-white/5 text-slate-100 rounded-tl-none'}`}>
                             {m.text}
                          </div>
                       </div>
                     ))}
                  </div>

                  <div className="p-6 border-t border-white/5 bg-black/20">
                     <div className="relative">
                        <input 
                          value={inputMsg}
                          onChange={(e) => setInputMsg(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                          placeholder="Broadcast message..."
                          className="w-full bg-white/5 border border-white/10 rounded-xl pl-5 pr-12 py-3 text-xs font-bold outline-none focus:border-emerald-500 transition-all"
                        />
                        <button onClick={handleSendMessage} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-emerald-500 hover:text-emerald-400 transition-all">
                           <Send className="w-4 h-4" />
                        </button>
                     </div>
                  </div>
               </motion.div>
            )}
         </AnimatePresence>
      </div>
    </div>
  );
}
