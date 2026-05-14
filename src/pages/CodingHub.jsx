import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { motion } from 'framer-motion';
import { Play, Save, Share2, Users, MessageCircle, Settings, LogOut, Code, Terminal as TerminalIcon } from 'lucide-react';
import socket from '../utils/socket';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

export default function CodingHub() {
  const { roomId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [code, setCode] = useState('// Start building something elite...\n\nfunction initGCC() {\n  console.log("Welcome to the Hub");\n}\n');
  const [language, setLanguage] = useState('javascript');
  const [activeUsers, setActiveUsers] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    if (!user) return;
    
    socket.emit('join-coding-room', { roomId, user: { _id: user._id, username: user.username, color: '#10b981' } });

    socket.on('code-update', (newCode) => {
      setCode(newCode);
    });

    socket.on('room-users', (users) => {
      setActiveUsers(users);
    });

    return () => {
      socket.emit('leave-coding-room', roomId);
      socket.off('code-update');
      socket.off('room-users');
    };
  }, [roomId, user]);

  const handleEditorChange = (value) => {
    setCode(value);
    socket.emit('code-change', { roomId, code: value });
  };

  const runCode = () => {
    toast.success('Compiling and executing on GCC Cloud...');
    // In a real startup, we'd send this to a sandboxed execution engine (Judge0)
  };

  return (
    <div className="h-screen w-full flex bg-[#1e1e1e] text-white overflow-hidden">
      
      {/* Side Control Bar */}
      <div className={`w-16 border-r border-white/5 flex flex-col items-center py-6 gap-8 bg-[#181818] transition-all`}>
         <div className="p-3 rounded-xl bg-brand/10 text-brand">
            <Code className="w-6 h-6" />
         </div>
         <div className="flex flex-col gap-6">
            <button className="text-slate-500 hover:text-white transition-colors"><Users className="w-5 h-5" /></button>
            <button className="text-slate-500 hover:text-white transition-colors"><MessageCircle className="w-5 h-5" /></button>
            <button className="text-slate-500 hover:text-white transition-colors"><Settings className="w-5 h-5" /></button>
         </div>
         <div className="mt-auto mb-4">
            <button 
              onClick={() => navigate('/live-rooms')}
              className="p-3 rounded-xl hover:bg-red-500/10 text-slate-500 hover:text-red-500 transition-all"
            >
              <LogOut className="w-5 h-5" />
            </button>
         </div>
      </div>

      {/* Editor Main */}
      <div className="flex-1 flex flex-col">
         {/* Editor Header */}
         <div className="h-12 border-b border-white/5 flex items-center justify-between px-6 bg-[#181818]">
            <div className="flex items-center gap-4">
               <span className="text-xs font-black uppercase tracking-widest text-slate-500">Project: {roomId?.slice(0,8) || 'ELITE_SESSION'}</span>
               <select 
                 value={language}
                 onChange={(e) => setLanguage(e.target.value)}
                 className="bg-transparent text-[10px] font-black uppercase tracking-widest text-brand outline-none cursor-pointer"
               >
                 <option value="javascript">JavaScript</option>
                 <option value="python">Python</option>
                 <option value="cpp">C++</option>
                 <option value="html">HTML/CSS</option>
               </select>
            </div>
            
            <div className="flex items-center gap-4">
               <div className="flex -space-x-2">
                  {activeUsers.map((u, i) => (
                    <motion.div 
                      key={i}
                      initial={{ scale: 0 }} animate={{ scale: 1 }}
                      className="w-6 h-6 rounded-full border-2 border-[#181818] bg-slate-700 flex items-center justify-center text-[8px] font-black"
                      title={u?.username || 'Anonymous'}
                    >
                      {u?.username?.[0]?.toUpperCase() || '?'}
                    </motion.div>
                  ))}
               </div>
               <button 
                 onClick={runCode}
                 className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-brand text-white text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-transform"
               >
                 <Play className="w-3 h-3 fill-current" /> Run Code
               </button>
               <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 transition-colors">
                 <Share2 className="w-4 h-4" />
               </button>
            </div>
         </div>

         {/* Monaco Editor */}
         <div className="flex-1 relative">
            <Editor
              height="100%"
              theme="vs-dark"
              language={language}
              value={code}
              onChange={handleEditorChange}
              options={{
                fontSize: 14,
                fontFamily: 'JetBrains Mono',
                minimap: { enabled: false },
                scrollbar: { vertical: 'hidden', horizontal: 'hidden' },
                lineNumbers: 'on',
                glyphMargin: false,
                folding: true,
                lineDecorationsWidth: 10,
                lineNumbersMinChars: 3,
                automaticLayout: true,
              }}
            />
         </div>

         {/* Bottom Terminal Simulation */}
         <div className="h-40 border-t border-white/5 bg-[#181818] flex flex-col">
            <div className="flex items-center gap-2 px-4 py-2 border-b border-white/5">
               <TerminalIcon className="w-3 h-3 text-slate-500" />
               <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Output Console</span>
            </div>
            <div className="p-4 font-mono text-xs text-slate-400 overflow-y-auto">
               <div className="flex gap-2">
                  <span className="text-brand">⚡</span>
                  <span>System initialized. Ready for execution.</span>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
