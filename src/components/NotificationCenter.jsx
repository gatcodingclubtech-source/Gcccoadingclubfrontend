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
      // Set initial welcome notification immediately for better UX
      const welcomeNotif = {
        _id: 'welcome_notif',
        title: 'Welcome to GCC Club!',
        message: 'Explore domains, join events, and start your journey with the elite GAT Chapter.',
        type: 'SYSTEM',
        icon: 'zap',
        createdAt: new Date().toISOString(),
        isRead: false
      };
      setNotifications([welcomeNotif]);
      setUnreadCount(1);
      
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get('/api/users/notifications');
      if (res.data.success) {
        const welcomeNotif = {
          _id: 'welcome_notif',
          title: 'Welcome to GCC Club!',
          message: 'Explore domains, join events, and start your journey with the elite GAT Chapter.',
          type: 'SYSTEM',
          icon: 'zap',
          createdAt: new Date().toISOString(),
          isRead: false
        };
        
        const serverNotifs = res.data.notifications || [];
        const all = [welcomeNotif, ...serverNotifs];
        setNotifications(all);
        setUnreadCount(all.filter(n => !n.isRead).length);
      }
    } catch (err) {
      console.error('Error fetching notifications:', err);
    }
  };

  useEffect(() => {
    if (isOpen && notifications.length > 0) {
      const timer = setTimeout(() => {
        gsap.from('.notification-item', {
          y: 20,
          opacity: 0,
          stagger: 0.1,
          duration: 0.4,
          ease: 'back.out(1.7)'
        });
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen, notifications.length]);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  const getIcon = (type) => {
    switch (type) {
      case 'EVENT': return <Calendar className="w-5 h-5 text-emerald-500" />;
      case 'QUIZ': return <Trophy className="w-5 h-5 text-amber-500" />;
      case 'RANK': return <Zap className="w-5 h-5 text-purple-500" />;
      default: return <ShieldCheck className="w-5 h-5 text-emerald-600" />;
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000 / 60);
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
        <Bell className="w-5 h-5 text-emerald-500 md:text-inherit" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-3.5 h-3.5 bg-emerald-500 text-white text-[7px] font-black flex items-center justify-center rounded-full border-2 border-white dark:border-slate-900 animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          {/* Solid Backdrop */}
          <div className="fixed inset-0 z-[99998] bg-black/60 backdrop-blur-md md:hidden" onClick={() => setIsOpen(false)} />
          
          {/* Centered for mobile, dropdown for desktop */}
          <div className="fixed left-4 right-4 top-20 md:absolute md:top-full md:left-auto md:right-0 md:mt-4 md:w-96 bg-white dark:bg-slate-900 z-[99999] shadow-[0_30px_90px_rgba(0,0,0,0.4)] rounded-[2rem] border-2 border-black/5 dark:border-white/10 flex flex-col max-h-[70vh] overflow-hidden">
            
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-black/5 dark:border-white/10 bg-slate-50/50 dark:bg-white/5">
              <h3 className="text-sm font-black tracking-[0.2em] text-slate-900 dark:text-white uppercase flex items-center gap-2">
                <Zap className="w-4 h-4 text-emerald-500" /> Notifications
              </h3>
              <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-all">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-white dark:bg-slate-900">
              {notifications.length === 0 ? (
                <div className="py-20 flex flex-col items-center gap-3 opacity-20">
                  <Bell className="w-12 h-12" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Clear for now</span>
                </div>
              ) : (
                notifications.map((n) => (
                  <div 
                    key={n._id} 
                    className="notification-item p-4 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-black/5 dark:border-white/5 flex gap-4 transition-all cursor-default"
                  >
                    <div className="w-11 h-11 rounded-2xl bg-white dark:bg-slate-700 flex items-center justify-center border border-black/5 dark:border-white/5 shrink-0 shadow-sm">
                      {getIcon(n.type)}
                    </div>
                    <div className="flex flex-col gap-1">
                      <h4 className="text-[12px] font-black text-slate-900 dark:text-white uppercase tracking-tight leading-none mb-1">{n.title}</h4>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium leading-relaxed">{n.message}</p>
                      <div className="flex items-center gap-1.5 mt-2 opacity-50">
                        <Clock className="w-3 h-3" />
                        <span className="text-[9px] font-bold uppercase tracking-widest">{formatTime(n.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-black/5 dark:border-white/10 bg-slate-50/30 dark:bg-black/20 text-center">
              <button className="text-[10px] font-black text-emerald-600 dark:text-emerald-500 uppercase tracking-widest hover:opacity-70 transition-all">
                MARK ALL AS READ
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
