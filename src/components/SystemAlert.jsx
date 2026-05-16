import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldAlert, Zap, ArrowRight, MessageSquare } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

export default function SystemAlert() {
  const { user, setUser } = useAuth();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (user && user.systemRemark) {
      setShow(true);
    }
  }, [user]);

  const handleDismiss = async () => {
    try {
      // Clear the remark from backend when dismissed
      const res = await axios.patch(`/api/users/${user._id}/remark`, { remark: '' });
      if (res.data.success) {
        setUser({ ...user, systemRemark: '' });
        setShow(false);
      }
    } catch (err) {
      console.error('Failed to dismiss remark', err);
      // Fallback: just hide it
      setShow(false);
    }
  };

  return (
    <AnimatePresence>
      {show && user?.systemRemark && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 md:p-6 bg-slate-950/40 backdrop-blur-md">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-black/5 dark:border-white/10 overflow-hidden"
          >
            {/* Visual Accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-bl-[100%] transition-all duration-700" />
            
            <div className="p-8 md:p-10 flex flex-col gap-8 relative z-10">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                    <ShieldAlert className="w-6 h-6" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em]">Official Notification</span>
                    <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">System Message</h2>
                  </div>
                </div>
                <button 
                  onClick={handleDismiss}
                  className="p-3 rounded-2xl bg-slate-100 dark:bg-white/5 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Message Box */}
              <div className="p-6 md:p-8 rounded-[2rem] bg-slate-50 dark:bg-white/5 border border-black/5 dark:border-white/5 relative overflow-hidden group">
                <MessageSquare className="absolute -right-4 -bottom-4 w-24 h-24 text-black/5 dark:text-white/5 group-hover:scale-110 transition-transform duration-700" />
                <p className="text-sm md:text-base font-bold text-slate-700 dark:text-slate-300 leading-relaxed relative z-10 italic">
                   "{user.systemRemark}"
                </p>
              </div>

              {/* Footer Actions */}
              <div className="flex flex-col gap-4">
                <button 
                  onClick={handleDismiss}
                  className="w-full py-5 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-black uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all shadow-xl flex items-center justify-center gap-3 group"
                >
                  I Understand <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <div className="flex items-center justify-center gap-2">
                  <Zap className="w-3 h-3 text-emerald-500" />
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">GAT Coding Club Administrator</span>
                </div>
              </div>
            </div>
            
            {/* Bottom Accent Bar */}
            <div className="h-2 bg-emerald-500 shadow-[0_-5px_15px_rgba(16,185,129,0.3)]" />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
