import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Save, Share2, Users, MessageCircle, Settings, LogOut, Code, Terminal as TerminalIcon, File as FileIcon, Plus, X, Folder, ChevronRight, ChevronDown, Trash2, Camera } from 'lucide-react';
import socket from '../utils/socket';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import axios from 'axios';

// External scripts for client-side execution
const loadScript = (src) => {
  return new Promise((resolve) => {
    if (document.querySelector(`script[src="${src}"]`)) return resolve();
    const script = document.createElement('script');
    script.src = src;
    script.onload = resolve;
    document.head.appendChild(script);
  });
};

// Unified Judge0 API mapping (Reliable & Free)
const JUDGE0_IDS = {
  javascript: 63,
  python: 71,
  cpp: 54,
  c: 50,
  java: 62,
  typescript: 74
};

const EXTENSION_MAP = {
  js: 'javascript',
  py: 'python',
  cpp: 'cpp',
  c: 'c',
  java: 'java',
  ts: 'typescript',
  html: 'html',
  css: 'css',
  json: 'json'
};

const getLanguageFromFilename = (filename) => {
  const ext = filename.split('.').pop();
  return EXTENSION_MAP[ext] || 'plaintext';
};

export default function CodingHub() {
  const { roomId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Workspace State
  const [files, setFiles] = useState([
    { id: '1', name: 'main.js', content: '// Start building something elite...\n\nfunction initGCC() {\n  console.log("Welcome to the Hub");\n}\n\ninitGCC();' }
  ]);
  const [activeFileId, setActiveFileId] = useState('1');
  
  // UI State
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [sidebarMode, setSidebarMode] = useState('explorer'); // 'explorer', 'users', 'chat'
  const [activeBottomTab, setActiveBottomTab] = useState('terminal'); // 'terminal', 'output'
  
  // Collaboration State
  const [activeUsers, setActiveUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  
  // Terminal / Execution State
  const [terminalOutput, setTerminalOutput] = useState([
    { type: 'info', text: 'GCC Cloud Terminal Initialized. Ready for execution.' }
  ]);
  const [codeResult, setCodeResult] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  
  // Modals / Input state
  const [newFileName, setNewFileName] = useState('');
  const [isCreatingFile, setIsCreatingFile] = useState(false);
  const newFileInputRef = useRef(null);
  const terminalEndRef = useRef(null);
  const chatEndRef = useRef(null);
  const profileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);

  const activeFile = files.find(f => f.id === activeFileId) || files[0];

  useEffect(() => {
    if (isCreatingFile && newFileInputRef.current) {
      newFileInputRef.current.focus();
    }
  }, [isCreatingFile]);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [terminalOutput]);

  useEffect(() => {
    if (!user) return;
    
    socket.emit('join-coding-room', { roomId, user: { _id: user._id, username: user.username, color: '#10b981' } });

    socket.on('workspace-update', (newFiles) => {
      setFiles(newFiles);
    });

    socket.on('room-users', (users) => {
      setActiveUsers(users);
    });

    socket.on('receive-coding-message', (msg) => {
       setMessages(prev => [...prev, msg]);
    });

    return () => {
      socket.emit('leave-coding-room', roomId);
      socket.off('workspace-update');
      socket.off('room-users');
      socket.off('receive-coding-message');
    };
  }, [roomId, user]);

  const handleProfileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    setIsUploading(true);
    const uploadToast = toast.loading('Uploading profile picture...');

    try {
      const { data } = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/users/profile-picture`, formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}` 
        }
      });

      if (data.success) {
        toast.success('Looking sharp! Profile updated.', { id: uploadToast });
        window.location.reload(); // Re-sync auth state
      }
    } catch (error) {
      toast.error('Upload failed. Try again.', { id: uploadToast });
    } finally {
      setIsUploading(false);
    }
  };

  const handleEditorChange = (value) => {
    const updatedFiles = files.map(f => f.id === activeFileId ? { ...f, content: value } : f);
    setFiles(updatedFiles);
    socket.emit('workspace-change', { roomId, files: updatedFiles });
  };

  const handleCreateFile = (e) => {
    e.preventDefault();
    if (!newFileName.trim()) {
      setIsCreatingFile(false);
      return;
    }
    
    const newFile = {
      id: Date.now().toString(),
      name: newFileName.trim(),
      content: ''
    };
    
    const updatedFiles = [...files, newFile];
    setFiles(updatedFiles);
    setActiveFileId(newFile.id);
    setNewFileName('');
    setIsCreatingFile(false);
    
    socket.emit('workspace-change', { roomId, files: updatedFiles });
  };

  const handleDeleteFile = (e, id) => {
    e.stopPropagation();
    if (files.length === 1) {
      toast.error("Cannot delete the last file.");
      return;
    }
    const updatedFiles = files.filter(f => f.id !== id);
    setFiles(updatedFiles);
    if (activeFileId === id) setActiveFileId(updatedFiles[0].id);
    socket.emit('workspace-change', { roomId, files: updatedFiles });
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;
    const msg = {
      user: user.username,
      avatar: user.avatar,
      text: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    socket.emit('send-coding-message', { roomId, msg });
    setMessages(prev => [...prev, msg]);
    setNewMessage('');
  };

  const runCode = async () => {
    if (!activeFile) return;
    
    const language = getLanguageFromFilename(activeFile.name);
    const languageId = JUDGE0_IDS[language];
    
    if (language === 'plaintext' || !languageId) {
      setTerminalOutput(prev => [...prev, { type: 'error', text: `Execution for .${activeFile.name.split('.').pop()} is not supported.` }]);
      return;
    }

    setIsRunning(true);
    setTerminalOutput(prev => [...prev, { type: 'info', text: `> Compiling & Executing ${activeFile.name} on GCC Cloud...` }]);

    try {
      const publicResponse = await fetch('https://ce.judge0.com/submissions?base64_encoded=false&wait=true', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language_id: languageId,
          source_code: activeFile.content,
        })
      });

      const data = await publicResponse.json();
      const { stdout, stderr, compile_output, status, time, memory } = data;
      
      if (compile_output) {
        setTerminalOutput(prev => [...prev, { type: 'error', text: compile_output }]);
      }
      
      if (stderr) {
        setTerminalOutput(prev => [...prev, { type: 'error', text: stderr }]);
      }
      
      if (stdout) {
        setTerminalOutput(prev => [...prev, { type: 'stdout', text: stdout }]);
        setCodeResult(prev => prev + stdout);
        setActiveBottomTab('output');
      }
      
      if (!stdout && !stderr && !compile_output) {
        setTerminalOutput(prev => [...prev, { type: 'info', text: `[Program exited with status: ${status?.description || 'Done'}]` }]);
      }
      
      setTerminalOutput(prev => [...prev, { type: 'info', text: `> Time: ${time || 0}s | Memory: ${memory || 0}KB` }]);

    } catch (err) {
      setTerminalOutput(prev => [...prev, { type: 'error', text: `Network Error: Could not connect to GCC Cloud. Please check your internet.` }]);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="h-screen w-full flex bg-[#1e1e1e] text-[#cccccc] overflow-hidden font-sans">
      
      {/* Activity Bar (VS Code left-most bar) */}
      <div className="w-12 shrink-0 border-r border-[#2d2d2d] bg-[#181818] flex flex-col items-center py-4 gap-6 z-20">
         <button 
           onClick={() => { setSidebarMode('explorer'); setIsSidebarOpen(true); }}
           className={`p-2.5 rounded-xl transition-all duration-200 ${sidebarMode === 'explorer' && isSidebarOpen ? 'text-white bg-brand shadow-lg shadow-brand/20' : 'text-[#858585] hover:text-white hover:bg-[#2a2d2e]'}`}
         >
            <FileIcon className="w-5 h-5" />
         </button>
         <button 
           onClick={() => { setSidebarMode('users'); setIsSidebarOpen(true); }}
           className={`p-2.5 rounded-xl transition-all duration-200 ${sidebarMode === 'users' && isSidebarOpen ? 'text-white bg-brand shadow-lg shadow-brand/20' : 'text-[#858585] hover:text-white hover:bg-[#2a2d2e]'}`}
         >
            <Users className="w-5 h-5" />
         </button>
         <button 
           onClick={() => { setSidebarMode('chat'); setIsSidebarOpen(true); }}
           className={`p-2.5 rounded-xl transition-all duration-200 ${sidebarMode === 'chat' && isSidebarOpen ? 'text-white bg-brand shadow-lg shadow-brand/20' : 'text-[#858585] hover:text-white hover:bg-[#2a2d2e]'}`}
         >
            <MessageCircle className="w-5 h-5" />
         </button>
         <div className="mt-auto flex flex-col items-center gap-4 mb-2">
            <input 
              type="file" 
              ref={profileInputRef} 
              className="hidden" 
              accept="image/*"
              onChange={handleProfileUpload}
            />
            <div className="relative group">
              <div 
                onClick={() => profileInputRef.current.click()}
                className="w-8 h-8 rounded-full border-2 border-brand/50 overflow-hidden cursor-pointer hover:border-brand transition-all shadow-lg"
              >
                {user?.avatar ? (
                  <img src={user.avatar} className="w-full h-full object-cover" alt="Profile" />
                ) : (
                  <div className="w-full h-full bg-[#3c3c3c] flex items-center justify-center text-[10px] font-bold text-brand">
                    {user?.username?.[0]?.toUpperCase() || '?'}
                  </div>
                )}
              </div>
              <div className="absolute -top-1 -right-1 p-0.5 bg-brand rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <Camera className="w-2.5 h-2.5" />
              </div>
            </div>

            <button className="p-2 rounded-lg text-[#858585] hover:text-white transition-colors">
               <Settings className="w-6 h-6" />
            </button>
            <button onClick={() => navigate('/live-rooms')} className="p-2 rounded-lg text-[#858585] hover:text-white transition-colors">
               <LogOut className="w-6 h-6" />
            </button>
         </div>
      </div>

      {/* Sidebar Content */}
      <AnimatePresence initial={false}>
        {isSidebarOpen && (
          <motion.div 
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 260, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="h-full border-r border-[#2d2d2d] bg-[#181818] flex flex-col overflow-hidden shrink-0 z-10"
          >
             {sidebarMode === 'explorer' && (
               <>
                 <div className="h-10 px-4 flex items-center justify-between shrink-0">
                    <span className="text-[11px] font-semibold tracking-wide text-[#cccccc] uppercase">EXPLORER</span>
                    <div className="flex gap-1">
                       <button onClick={() => setIsCreatingFile(true)} className="p-1 rounded hover:bg-[#2a2d2e] text-[#cccccc]">
                          <Plus className="w-4 h-4" />
                       </button>
                    </div>
                 </div>
                 
                 <div className="flex-1 overflow-y-auto custom-scrollbar">
                    <div className="flex items-center gap-2 px-4 py-2 text-[#cccccc] cursor-pointer hover:bg-[#2a2d2e] transition-colors">
                       <ChevronDown className="w-4 h-4 text-[#858585]" />
                       <span className="text-[10px] font-black tracking-[0.1em] uppercase text-[#858585]">PROJECT_{roomId?.slice(0,6)}</span>
                    </div>
                    
                    <div className="flex flex-col mt-1">
                       {files.map(f => (
                         <div 
                           key={f.id}
                           onClick={() => setActiveFileId(f.id)}
                           className={`flex items-center justify-between pl-10 pr-4 py-1.5 cursor-pointer text-sm group transition-all ${activeFileId === f.id ? 'bg-[#37373d] text-white border-l-2 border-brand' : 'text-[#cccccc] hover:bg-[#2a2d2e] border-l-2 border-transparent'}`}
                         >
                            <div className="flex items-center gap-2.5 min-w-0">
                               <FileIcon className={`w-4 h-4 shrink-0 ${activeFileId === f.id ? 'text-brand' : 'text-[#858585]'}`} />
                               <span className="truncate font-medium">{f.name}</span>
                            </div>
                            {files.length > 1 && (
                              <button onClick={(e) => handleDeleteFile(e, f.id)} className="opacity-0 group-hover:opacity-100 p-1 hover:bg-[#4d4d54] rounded shrink-0 ml-2">
                                 <Trash2 className="w-3 h-3 text-[#cccccc]" />
                              </button>
                            )}
                         </div>
                       ))}
                       
                       {isCreatingFile && (
                         <form onSubmit={handleCreateFile} className="px-6 py-1 flex items-center gap-2">
                            <FileIcon className="w-4 h-4 shrink-0 text-brand" />
                            <input 
                              ref={newFileInputRef}
                              type="text"
                              value={newFileName}
                              onChange={e => setNewFileName(e.target.value)}
                              onBlur={() => { if(!newFileName) setIsCreatingFile(false); }}
                              className="w-full bg-[#3c3c3c] border border-[#007fd4] text-[#cccccc] text-sm px-1 py-0.5 outline-none focus:outline-none shadow-inner"
                            />
                         </form>
                       )}
                    </div>
                 </div>
               </>
             )}

             {sidebarMode === 'users' && (
               <>
                 <div className="h-10 px-4 flex items-center shrink-0 border-b border-[#2d2d2d]">
                    <span className="text-[11px] font-semibold tracking-wide text-[#cccccc] uppercase">MEMBERS ({activeUsers.length})</span>
                 </div>
                 <div className="flex-1 overflow-y-auto py-2 custom-scrollbar">
                     {activeUsers.map((u, i) => (
                      <div key={i} className="flex items-center gap-3 px-4 py-2 hover:bg-[#2a2d2e] transition-colors group">
                        <div className="relative">
                          <div className="w-8 h-8 rounded-full bg-[#3c3c3c] flex items-center justify-center text-xs font-bold text-brand shadow-md overflow-hidden">
                            {u?.avatar ? (
                              <img src={u.avatar} className="w-full h-full object-cover" alt="" />
                            ) : (
                              u?.username?.[0]?.toUpperCase() || '?'
                            )}
                          </div>
                          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-[#181818]"></div>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm text-[#cccccc] font-medium">{u?.username || 'Guest'}</span>
                          <span className="text-[10px] text-green-500/80">Online</span>
                        </div>
                      </div>
                    ))}
                 </div>
               </>
             )}

             {sidebarMode === 'chat' && (
               <div className="flex flex-col h-full bg-[#181818]">
                 <div className="h-10 px-4 flex items-center shrink-0 border-b border-[#2d2d2d]">
                    <span className="text-[11px] font-semibold tracking-wide text-[#cccccc] uppercase">ROOM CHAT</span>
                 </div>
                 <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 custom-scrollbar min-h-0">
                    {messages.map((m, i) => (
                      <div key={i} className={`flex flex-col ${m.user === user?.username ? 'items-end' : 'items-start'}`}>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-bold text-brand">{m.user}</span>
                          <span className="text-[9px] text-[#858585]">{m.time}</span>
                        </div>
                         <div className={`max-w-[90%] px-3 py-2 rounded-xl text-xs shadow-sm flex items-start gap-2 ${m.user === user?.username ? 'bg-brand text-white rounded-tr-none' : 'bg-[#2a2d2e] text-[#cccccc] rounded-tl-none'}`}>
                           {m.user !== user?.username && m.avatar && (
                             <img src={m.avatar} className="w-4 h-4 rounded-full mt-0.5 object-cover" alt="" />
                           )}
                           <span>{m.text}</span>
                        </div>
                      </div>
                    ))}
                    <div ref={chatEndRef} />
                 </div>
                 <form onSubmit={sendMessage} className="p-4 border-t border-[#2d2d2d] bg-[#1e1e1e]">
                    <div className="relative">
                      <input 
                        type="text"
                        value={newMessage}
                        onChange={e => setNewMessage(e.target.value)}
                        placeholder="Send message..."
                        className="w-full bg-[#3c3c3c] text-[#cccccc] text-xs px-3 py-2 rounded-lg outline-none border border-transparent focus:border-brand transition-all pr-10"
                      />
                      <button type="submit" className="absolute right-2 top-1.5 p-1 text-brand hover:text-white transition-colors">
                        <MessageCircle className="w-4 h-4" />
                      </button>
                    </div>
                 </form>
               </div>
             )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Editor Area */}
      <div className="flex-1 flex flex-col min-w-0">
         
         {/* Top Navbar */}
         <div className="h-10 border-b border-[#2d2d2d] bg-[#1e1e1e] flex items-center justify-between pr-4">
            {/* Tabs */}
            <div className="flex h-full overflow-x-auto custom-scrollbar">
               {files.map(f => (
                  <div 
                    key={f.id}
                    onClick={() => setActiveFileId(f.id)}
                    className={`h-full px-4 flex items-center gap-2 cursor-pointer border-r border-[#2d2d2d] min-w-[120px] group ${activeFileId === f.id ? 'bg-[#1e1e1e] border-t-2 border-t-brand text-white' : 'bg-[#2d2d2d] text-[#858585] border-t-2 border-t-transparent hover:bg-[#2b2b2b]'}`}
                  >
                     <FileIcon className="w-3.5 h-3.5 text-brand shrink-0" />
                     <span className="text-[13px] truncate">{f.name}</span>
                     {files.length > 1 && (
                        <button onClick={(e) => handleDeleteFile(e, f.id)} className={`ml-auto p-0.5 rounded-md hover:bg-[#4d4d54] shrink-0 ${activeFileId === f.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                           <X className="w-3.5 h-3.5" />
                        </button>
                     )}
                  </div>
               ))}
            </div>

            {/* Run Button & Collaborators */}
            <div className="flex items-center gap-3 shrink-0 ml-4">
               <div className="flex -space-x-2">
                  {activeUsers.map((u, i) => (
                    <div 
                      key={i}
                      className="w-6 h-6 rounded-full border-2 border-[#1e1e1e] bg-slate-700 flex items-center justify-center text-[9px] font-black text-white"
                      title={u?.username || 'Anonymous'}
                    >
                      {u?.username?.[0]?.toUpperCase() || '?'}
                    </div>
                  ))}
               </div>
               
               <button 
                 onClick={runCode}
                 disabled={isRunning}
                 className="flex items-center gap-1.5 px-3 py-1 rounded bg-[#007fd4] hover:bg-[#0069a1] text-white text-[11px] font-semibold tracking-wide transition-colors disabled:opacity-50"
               >
                 {isRunning ? <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Play className="w-3 h-3 fill-current" />}
                 RUN
               </button>
            </div>
         </div>

         {/* Monaco Editor */}
         <div className="flex-1 relative">
            <Editor
              height="100%"
              theme="vs-dark"
              language={getLanguageFromFilename(activeFile?.name || '')}
              value={activeFile?.content || ''}
              onChange={handleEditorChange}
              options={{
                fontSize: 14,
                fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
                minimap: { enabled: true, scale: 0.75 },
                scrollbar: { verticalScrollbarSize: 10, horizontalScrollbarSize: 10 },
                lineNumbers: 'on',
                glyphMargin: false,
                folding: true,
                lineDecorationsWidth: 10,
                lineNumbersMinChars: 4,
                automaticLayout: true,
                padding: { top: 16 },
                wordWrap: 'on'
              }}
            />
         </div>

         {/* Terminal / Output Panel */}
         <div className="h-64 border-t border-[#2d2d2d] bg-[#1e1e1e] flex flex-col shrink-0">
            <div className="flex items-center justify-between px-4 h-9 border-b border-[#2d2d2d] shrink-0">
               <div className="flex gap-4 h-full">
                  <button 
                    onClick={() => setActiveBottomTab('terminal')}
                    className={`h-full flex items-center px-1 text-[11px] font-semibold tracking-widest uppercase transition-all ${activeBottomTab === 'terminal' ? 'border-b-2 border-brand text-white' : 'text-[#858585] hover:text-[#cccccc]'}`}
                  >
                     TERMINAL
                  </button>
                  <button 
                    onClick={() => setActiveBottomTab('output')}
                    className={`h-full flex items-center px-1 text-[11px] font-semibold tracking-widest uppercase transition-all ${activeBottomTab === 'output' ? 'border-b-2 border-brand text-white' : 'text-[#858585] hover:text-[#cccccc]'}`}
                  >
                     OUTPUT
                  </button>
               </div>
               <button onClick={() => { setTerminalOutput([]); setCodeResult(''); }} className="text-[#858585] hover:text-white p-1" title="Clear All">
                  <Trash2 className="w-3.5 h-3.5" />
               </button>
            </div>
            
            <div className="flex-1 p-6 font-mono text-[13px] overflow-y-auto bg-[#1e1e1e] custom-scrollbar selection:bg-brand/30">
               {activeBottomTab === 'terminal' ? (
                  <>
                    {terminalOutput.map((line, i) => (
                       <div key={i} className="mb-1 leading-relaxed">
                          {line.type === 'info' && <span className="text-[#007fd4] font-bold">{line.text}</span>}
                          {line.type === 'error' && <span className="text-[#f14c4c] whitespace-pre-wrap">{line.text}</span>}
                          {line.type === 'stdout' && <span className="text-[#cccccc] whitespace-pre-wrap">{line.text}</span>}
                       </div>
                    ))}
                    <div ref={terminalEndRef} />
                  </>
               ) : (
                  <div className="text-[#cccccc] whitespace-pre-wrap selection:bg-brand/40">
                     {codeResult || '[No execution output yet]'}
                  </div>
               )}
            </div>
         </div>
      </div>

    </div>
  );
}
