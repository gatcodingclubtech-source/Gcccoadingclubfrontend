import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Save, Share2, Users, MessageCircle, Settings, LogOut, Code, Terminal as TerminalIcon, File as FileIcon, Plus, X, Folder, ChevronRight, ChevronDown, Trash2 } from 'lucide-react';
import socket from '../utils/socket';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import axios from 'axios';

// Piston API mapping
const LANGUAGE_VERSIONS = {
  javascript: '18.15.0',
  python: '3.10.0',
  cpp: '10.2.0',
  java: '15.0.2',
  typescript: '5.0.3'
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  // Collaboration State
  const [activeUsers, setActiveUsers] = useState([]);
  
  // Terminal State
  const [terminalOutput, setTerminalOutput] = useState([
    { type: 'info', text: 'GCC Cloud Terminal Initialized. Ready for execution.' }
  ]);
  const [isRunning, setIsRunning] = useState(false);
  
  // Modals / Input state
  const [newFileName, setNewFileName] = useState('');
  const [isCreatingFile, setIsCreatingFile] = useState(false);
  const newFileInputRef = useRef(null);
  const terminalEndRef = useRef(null);

  const activeFile = files.find(f => f.id === activeFileId) || files[0];

  useEffect(() => {
    if (isCreatingFile && newFileInputRef.current) {
      newFileInputRef.current.focus();
    }
  }, [isCreatingFile]);

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

    return () => {
      socket.emit('leave-coding-room', roomId);
      socket.off('workspace-update');
      socket.off('room-users');
    };
  }, [roomId, user]);

  const handleEditorChange = (value) => {
    const updatedFiles = files.map(f => f.id === activeFileId ? { ...f, content: value } : f);
    setFiles(updatedFiles);
    // Debounce this in production, but for now just emit
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

  const runCode = async () => {
    if (!activeFile) return;
    
    const language = getLanguageFromFilename(activeFile.name);
    const version = LANGUAGE_VERSIONS[language];
    
    if (!version) {
      setTerminalOutput(prev => [...prev, { type: 'error', text: `Cannot run .${activeFile.name.split('.').pop()} files directly here. Supported: JS, PY, CPP, JAVA, TS.` }]);
      return;
    }

    setIsRunning(true);
    setTerminalOutput(prev => [...prev, { type: 'info', text: `> Compiling & Executing ${activeFile.name} (${language})...` }]);
    
    try {
      const response = await axios.post('https://emkc.org/api/v2/piston/execute', {
        language: language,
        version: version,
        files: [
          {
            name: activeFile.name,
            content: activeFile.content
          }
        ]
      });

      const { run, compile } = response.data;
      
      if (compile && compile.stderr) {
         setTerminalOutput(prev => [...prev, { type: 'error', text: compile.stderr }]);
      }
      
      if (run.stderr) {
         setTerminalOutput(prev => [...prev, { type: 'error', text: run.stderr }]);
      }
      
      if (run.stdout) {
         setTerminalOutput(prev => [...prev, { type: 'stdout', text: run.stdout }]);
      }
      
      if (!run.stdout && !run.stderr && !compile?.stderr) {
         setTerminalOutput(prev => [...prev, { type: 'info', text: '[Program exited with no output]' }]);
      }
      
    } catch (err) {
      console.error(err);
      setTerminalOutput(prev => [...prev, { type: 'error', text: 'Execution API Error. Rate limit or network issue.' }]);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="h-screen w-full flex bg-[#1e1e1e] text-[#cccccc] overflow-hidden font-sans">
      
      {/* Activity Bar (VS Code left-most bar) */}
      <div className="w-12 shrink-0 border-r border-[#2d2d2d] bg-[#181818] flex flex-col items-center py-4 gap-6 z-20">
         <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className={`p-2 rounded-lg transition-colors ${isSidebarOpen ? 'text-white' : 'text-[#858585] hover:text-white'}`}>
            <FileIcon className="w-6 h-6" />
         </button>
         <button className="p-2 rounded-lg text-[#858585] hover:text-white transition-colors">
            <Users className="w-6 h-6" />
         </button>
         <button className="p-2 rounded-lg text-[#858585] hover:text-white transition-colors">
            <MessageCircle className="w-6 h-6" />
         </button>
         <div className="mt-auto flex flex-col gap-4">
            <button className="p-2 rounded-lg text-[#858585] hover:text-white transition-colors">
               <Settings className="w-6 h-6" />
            </button>
            <button onClick={() => navigate('/live-rooms')} className="p-2 rounded-lg text-[#858585] hover:text-white transition-colors">
               <LogOut className="w-6 h-6" />
            </button>
         </div>
      </div>

      {/* Explorer Sidebar */}
      <AnimatePresence initial={false}>
        {isSidebarOpen && (
          <motion.div 
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 250, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="border-r border-[#2d2d2d] bg-[#181818] flex flex-col overflow-hidden shrink-0 z-10"
          >
             <div className="h-10 px-4 flex items-center justify-between shrink-0">
                <span className="text-[11px] font-semibold tracking-wide text-[#cccccc]">EXPLORER</span>
                <div className="flex gap-1">
                   <button onClick={() => setIsCreatingFile(true)} className="p-1 rounded hover:bg-[#2a2d2e] text-[#cccccc]">
                      <Plus className="w-4 h-4" />
                   </button>
                </div>
             </div>
             
             <div className="flex-1 overflow-y-auto">
                <div className="flex items-center gap-1 px-2 py-1 text-[#cccccc] cursor-pointer hover:bg-[#2a2d2e]">
                   <ChevronDown className="w-4 h-4" />
                   <span className="text-[11px] font-bold tracking-wider">PROJECT_{roomId?.slice(0,6) || 'DEV'}</span>
                </div>
                
                <div className="flex flex-col mt-1">
                   {files.map(f => (
                     <div 
                       key={f.id}
                       onClick={() => setActiveFileId(f.id)}
                       className={`flex items-center justify-between px-6 py-1 cursor-pointer text-sm group ${activeFileId === f.id ? 'bg-[#37373d] text-white' : 'text-[#cccccc] hover:bg-[#2a2d2e]'}`}
                     >
                        <div className="flex items-center gap-2 min-w-0">
                           <FileIcon className="w-4 h-4 shrink-0 text-brand" />
                           <span className="truncate">{f.name}</span>
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
                          className="w-full bg-[#3c3c3c] border border-[#007fd4] text-[#cccccc] text-sm px-1 py-0.5 outline-none focus:outline-none"
                        />
                     </form>
                   )}
                </div>
             </div>
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

         {/* Terminal Panel */}
         <div className="h-48 border-t border-[#2d2d2d] bg-[#1e1e1e] flex flex-col shrink-0">
            <div className="flex items-center justify-between px-4 h-9 border-b border-[#2d2d2d]">
               <div className="flex gap-4 h-full">
                  <div className="h-full flex items-center border-b-2 border-brand text-[#cccccc]">
                     <span className="text-[11px] font-semibold tracking-widest uppercase">TERMINAL</span>
                  </div>
                  <div className="h-full flex items-center text-[#858585] cursor-pointer hover:text-[#cccccc]">
                     <span className="text-[11px] font-semibold tracking-widest uppercase">OUTPUT</span>
                  </div>
               </div>
               <button onClick={() => setTerminalOutput([])} className="text-[#858585] hover:text-white p-1" title="Clear Terminal">
                  <Trash2 className="w-3.5 h-3.5" />
               </button>
            </div>
            
            <div className="flex-1 p-4 font-mono text-[13px] overflow-y-auto bg-[#1e1e1e]">
               {terminalOutput.map((line, i) => (
                  <div key={i} className="mb-1 leading-relaxed">
                     {line.type === 'info' && <span className="text-[#007fd4]">{line.text}</span>}
                     {line.type === 'error' && <span className="text-[#f14c4c] whitespace-pre-wrap">{line.text}</span>}
                     {line.type === 'stdout' && <span className="text-[#cccccc] whitespace-pre-wrap">{line.text}</span>}
                  </div>
               ))}
               <div ref={terminalEndRef} />
            </div>
         </div>
      </div>

    </div>
  );
}
