import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bell, X, Calendar, Trophy, Zap, ShieldCheck, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import gsap from 'gsap';

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user, logout } = useAuth();

  useEffect(() => {
    if (user) {
      fetchNotifications();
      // Poll for new notifications every 30 seconds for "Automation" feel
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get('/api/users/notifications');
      if (res.data.success) {
        setNotifications(res.data.notifications);
        setUnreadCount(res.data.notifications.filter(n => !n.isRead).length);
      }
    } catch (err) {
      console.error('Error fetching notifications:', err);
      if (err.response?.status === 401) {
        logout();
      }
    }
  };

  const toggleOpen = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      gsap.from('.notification-item', {
        x: 20,
        opacity: 0,
        stagger: 0.05,
        duration: 0.3
      });
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'EVENT': return <Calendar className="w-4 h-4 text-emerald-500" />;
      case 'QUIZ': return <Trophy className="w-4 h-4 text-amber-500" />;
      case 'RANK': return <Zap className="w-4 h-4 text-purple-500" />;
      default: return <ShieldCheck className="w-4 h-4 text-brand" />;
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000 / 60); // minutes
    if (diff < 1) return 'Just now';
    if (diff < 60) return `${diff}m ago`;
    if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="relative">
      <button 
        onClick={toggleOpen}
        className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 transition-all text-slate-500 dark:text-slate-400 relative border border-black/5 md:border-none"
      >
        <Bell className="w-5 h-5 md:w-5 md:h-5 text-emerald-500 md:text-inherit" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-3.5 h-3.5 bg-emerald-500 text-white text-[7px] font-black flex items-center justify-center rounded-full border-2 border-white dark:border-slate-900 animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-[9998]" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-4 w-80 md:w-96 glass-panel border-black/5 dark:border-white/5 p-4 z-[9999] shadow-2xl max-h-[500px] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-black/5 dark:border-white/5">
              <h3 className="text-xs font-black tracking-[0.2em] text-slate-900 dark:text-white uppercase flex items-center gap-2">
                <Zap className="w-4 h-4 text-brand" /> Smart Alerts
              </h3>
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
              {notifications.length === 0 ? (
                <div className="py-12 flex flex-col items-center gap-3 opacity-20">
                  <Bell className="w-8 h-8" />
                  <span className="text-[10px] font-black uppercase tracking-widest">No notifications</span>
                </div>
              ) : (
                notifications.map((n) => (
                  <div key={n._id} className="notification-item p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-black/5 dark:border-white/5 flex gap-4 hover:border-brand/30 transition-all cursor-default group">
                    <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center border border-black/5 dark:border-white/5 shrink-0 group-hover:scale-110 transition-transform">
                      {getIcon(n.type)}
                    </div>
                    <div className="flex flex-col gap-1">
                      <h4 className="text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-tight">{n.title}</h4>
                      <p className="text-[10px] text-slate-500 font-medium leading-tight">{n.message}</p>
                      <div className="flex items-center gap-1 mt-1 opacity-40">
                        <Clock className="w-2.5 h-2.5" />
                        <span className="text-[8px] font-bold uppercase tracking-widest">{formatTime(n.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="mt-4 pt-4 border-top border-black/5 dark:border-white/5 text-center">
              <button className="text-[9px] font-black text-brand uppercase tracking-widest hover:opacity-70 transition-all">
                MARK ALL AS READ
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
