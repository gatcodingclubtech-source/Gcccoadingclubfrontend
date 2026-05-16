import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X, Send, Sparkles, Terminal } from 'lucide-react';
import axios from 'axios';
import Magnetic from './Magnetic';

export default function AIMentor() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Neural link established. I am your GCC AI Mentor. How can I guide your technical journey today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await axios.post('/api/ai/mentor', { prompt: input });
      if (res.data.success) {
        setMessages(prev => [...prev, { role: 'assistant', content: res.data.response }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Connection to the AI Core lost. Please retry.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-10 right-10 z-[10000]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="absolute bottom-20 right-0 w-[350px] md:w-[400px] h-[550px] bg-white dark:bg-slate-950 rounded-[2.5rem] border border-black/5 dark:border-white/10 shadow-2xl flex flex-col overflow-hidden backdrop-blur-3xl"
          >
            {/* Header */}
            <div className="p-6 bg-emerald-500 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
                   <Bot className="text-white w-6 h-6" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-black text-white uppercase tracking-widest">AI Mentor</span>
                  <span className="text-[8px] font-bold text-emerald-100 uppercase tracking-tight">GAT Coding Club Core</span>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-xl transition-all">
                <X className="text-white w-5 h-5" />
              </button>
            </div>

            {/* Chat Area */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 flex flex-col gap-4 custom-scrollbar">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] p-4 rounded-3xl text-[11px] font-medium leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-slate-900 text-white rounded-tr-none' 
                      : 'bg-slate-100 dark:bg-white/5 text-slate-900 dark:text-slate-100 rounded-tl-none border border-black/5 dark:border-white/5'
                  }`}>
                    {msg.content}
                  </div>
                </motion.div>
              ))}
              {loading && (
                <div className="flex justify-start">
                   <div className="p-4 rounded-3xl bg-slate-100 dark:bg-white/5 rounded-tl-none animate-pulse flex gap-1">
                      <div className="w-1 h-1 bg-slate-400 rounded-full animate-bounce" />
                      <div className="w-1 h-1 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                      <div className="w-1 h-1 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                   </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-6 bg-slate-50 dark:bg-black/20 border-t border-black/5 dark:border-white/5">
              <div className="relative">
                <input 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask your mentor..."
                  className="w-full bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl pl-6 pr-14 py-4 text-xs font-bold outline-none focus:border-emerald-500 transition-all text-slate-900 dark:text-white"
                />
                <button 
                  onClick={handleSend}
                  disabled={loading}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white hover:scale-105 active:scale-95 transition-all shadow-lg"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Magnetic strength={0.2}>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className={`w-16 h-16 rounded-[2rem] flex items-center justify-center shadow-2xl transition-all duration-500 ${
            isOpen ? 'bg-slate-900 rotate-90' : 'bg-emerald-500'
          }`}
        >
          {isOpen ? <X className="text-white w-7 h-7" /> : <Bot className="text-white w-7 h-7" />}
          {!isOpen && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white dark:border-slate-950 animate-pulse" />
          )}
        </button>
      </Magnetic>
    </div>
  );
}
