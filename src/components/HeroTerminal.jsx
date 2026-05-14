import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Terminal as TerminalIcon, ChevronRight } from 'lucide-react';

export default function HeroTerminal() {
  const [lines, setLines] = useState([
    { text: 'Initializing GCC_OS v4.0.2...', delay: 0 },
    { text: 'Loading Neural Network Pipelines...', delay: 800 },
    { text: 'Establishing Secure Handshake with Render...', delay: 1500 },
    { text: 'Access Granted: Welcome, Developer.', delay: 2200 },
  ]);

  const [input, setInput] = useState('');
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines]);

  const handleCommand = (e) => {
    if (e.key === 'Enter') {
      const cmd = input.trim().toLowerCase();
      let response = '';
      
      if (cmd === 'help') response = 'Available: about, join, explore, ping';
      else if (cmd === 'about') response = 'GCC: GAT Coding Club. The elite dev community.';
      else if (cmd === 'ping') response = 'Pong! Latency: 14ms';
      else if (cmd === 'ls') response = 'domains/  events/  discussions/  live_rooms/';
      else response = `Command not found: ${cmd}. Type 'help' for options.`;

      setLines([...lines, { text: `> ${input}`, type: 'input' }, { text: response, type: 'response' }]);
      setInput('');
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1, duration: 1 }}
      className="w-full max-w-2xl glass-panel bg-black/80 backdrop-blur-2xl border-white/10 rounded-2xl overflow-hidden shadow-2xl shadow-brand/20"
    >
      <div className="bg-white/5 border-b border-white/10 px-4 py-2 flex items-center gap-2">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
        </div>
        <div className="flex-1 text-center">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">GCC_SYSTEM_CORE</span>
        </div>
        <TerminalIcon className="w-3 h-3 text-slate-500" />
      </div>
      
      <div 
        ref={scrollRef}
        className="p-6 h-64 overflow-y-auto font-mono text-xs md:text-sm scrollbar-hide space-y-1.5"
      >
        {lines.map((line, i) => (
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: line.delay ? line.delay / 1000 : 0 }}
            key={i}
            className={`${line.type === 'input' ? 'text-brand' : line.type === 'response' ? 'text-blue-400' : 'text-slate-300'}`}
          >
            {line.text}
          </motion.div>
        ))}
        <div className="flex items-center gap-2 text-brand">
          <ChevronRight className="w-3 h-3" />
          <input 
            autoFocus
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleCommand}
            className="bg-transparent border-none outline-none flex-1 text-white font-bold"
            placeholder="Type 'help'..."
          />
        </div>
      </div>
    </motion.div>
  );
}
