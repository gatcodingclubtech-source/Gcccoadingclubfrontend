import React, { useState, useEffect, useRef } from 'react';
import { 
  Users, Calendar, HelpCircle, ArrowUpRight, 
  TrendingUp, Activity, UserPlus, Zap
} from 'lucide-react';
import axios from 'axios';
import gsap from 'gsap';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeEvents: 0,
    quizQuestions: 0,
    newRegistrations: 0,
    activeLiveRooms: 0
  });
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const animatedRef = useRef(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [uR, eR, qR, lR] = await Promise.all([
          axios.get('/api/users'),
          axios.get('/api/events'),
          axios.get('/api/quiz'),
          axios.get('/api/live-rooms')
        ]);

        let newStats = { ...stats };

        if (uR.data?.success) {
          newStats.totalUsers = uR.data.users.length;
          newStats.newRegistrations = uR.data.users.filter(u => {
            const created = new Date(u.createdAt);
            const now = new Date();
            return (now - created) < (7 * 24 * 60 * 60 * 1000);
          }).length;
          setRecentUsers(uR.data.users.slice(0, 5));
        }

        if (eR.data?.success) {
          newStats.activeEvents = eR.data.events.length;
        }

        if (qR.data?.success) {
          newStats.quizQuestions = qR.data.questions.length;
        }

        const rooms = Array.isArray(lR.data) ? lR.data : (lR.data?.rooms || []);
        newStats.activeLiveRooms = rooms.length;

        setStats(newStats);
      } catch (err) {
        console.error('Error fetching dashboard stats', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!loading && !animatedRef.current) {
      const cards = document.querySelectorAll('.stat-card');
      if (cards.length > 0) {
        gsap.fromTo('.stat-card', 
          { y: 30, opacity: 0 },
          { 
            y: 0, 
            opacity: 1, 
            duration: 0.8, 
            stagger: 0.15, 
            ease: 'power4.out',
            clearProps: 'all'
          }
        );
        animatedRef.current = true;
      }
    }
  }, [loading]);

  const statCards = [
    { title: 'Total Members', value: stats.totalUsers, icon: <Users />, trend: '+12%' },
    { title: 'Active Events', value: stats.activeEvents, icon: <Calendar />, trend: '+2' },
    { title: 'Quiz Base', value: stats.quizQuestions, icon: <HelpCircle />, trend: '85%' },
    { title: 'Live Rooms', value: stats.activeLiveRooms, icon: <Activity />, trend: 'Live' },
    { title: 'New Members', value: stats.newRegistrations, icon: <UserPlus />, trend: 'Today' },
  ];

  if (loading) return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 animate-pulse">Initializing System...</span>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-12">
      {/* Welcome Section */}
      <div className="flex flex-col gap-3">
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Dashboard</h1>
        <div className="flex items-center gap-3">
          <div className="px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2">
            <Activity className="w-3.5 h-3.5 text-emerald-500" />
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-black uppercase tracking-widest">Live Updates</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((card, idx) => (
          <div key={idx} className="stat-card glass-panel p-8 group hover:border-emerald-500/30 transition-all cursor-default">
            <div className="flex justify-between items-start mb-8">
              <div className={`p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 shadow-lg shadow-emerald-500/5 transition-transform group-hover:scale-110 duration-500`}>
                {React.cloneElement(card.icon, { className: 'w-7 h-7' })}
              </div>
              <div className="flex items-center gap-1.5 text-[9px] font-black text-emerald-500 uppercase bg-emerald-500/5 px-3 py-1.5 rounded-full border border-emerald-500/10">
                <TrendingUp className="w-3 h-3" /> {card.trend}
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter mb-2">{card.value}</span>
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.25em]">{card.title}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-24">
        {/* Recent Users */}
        <div className="lg:col-span-2 glass-panel p-8 flex flex-col gap-10">
          <div className="flex justify-between items-center">
            <div className="flex flex-col gap-2">
              <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Latest Registrations</h3>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest opacity-60">Real-time member activity stream</p>
            </div>
          </div>
          
          <div className="overflow-x-auto custom-scrollbar" data-lenis-prevent>
            <table className="w-full min-w-[700px] text-left">
              <thead>
                <tr className="border-b border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-white/[0.02]">
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Member</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Department</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5 dark:divide-white/5">
                {recentUsers.map((user) => (
                  <tr key={user._id} className="group hover:bg-black/[0.01] dark:hover:bg-white/[0.01] transition-all">
                    <td className="py-6 px-8">
                      <div className="flex items-center gap-5">
                        <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-white/5 border border-black/5 dark:border-white/10 flex items-center justify-center overflow-hidden shadow-sm group-hover:border-emerald-500/30 transition-all">
                          {user.avatar ? (
                            <img src={user.avatar} className="w-full h-full object-cover" />
                          ) : (
                            <Users className="w-6 h-6 text-slate-400" />
                          )}
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[13px] font-black text-slate-900 dark:text-white group-hover:text-emerald-500 transition-colors leading-tight uppercase tracking-tight">{user.name}</span>
                          <span className="text-[10px] text-slate-500 font-medium lowercase tracking-tight">{user.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-6 px-8">
                      <span className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-white/5 text-[9px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest border border-black/5 dark:border-white/5">{user.department || 'GEN-MEMBER'}</span>
                    </td>
                    <td className="py-6 px-8">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-2 h-2 rounded-full ${user.profileComplete ? 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.5)]' : 'bg-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.5)]'}`} />
                        <span className="text-[9px] font-black uppercase text-slate-500 tracking-widest">
                          {user.profileComplete ? 'Verified' : 'Pending'}
                        </span>
                      </div>
                    </td>
                    <td className="py-6 px-8 text-right">
                      <div className="flex flex-col items-end gap-0.5">
                        <span className="text-[11px] font-black text-slate-900 dark:text-white tabular-nums">
                          {new Date(user.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </span>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tabular-nums">
                          {new Date(user.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions / System Status */}
        <div className="flex flex-col gap-8">
          <div className="glass-panel p-8 bg-gradient-to-br from-emerald-500/5 to-transparent border-emerald-500/20">
            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
              <Zap className="w-5 h-5 text-emerald-500" /> System Metrics
            </h3>
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-4">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em]">
                  <span className="text-slate-500">Core Availability</span>
                  <span className="text-emerald-500">99.8%</span>
                </div>
                <div className="h-2.5 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden border border-black/5 dark:border-white/5 p-0.5">
                  <div className="h-full bg-emerald-500 w-[99.8%] rounded-full shadow-[0_0_20px_rgba(16,185,129,0.4)] animate-pulse" />
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em]">
                  <span className="text-slate-500">Response Latency</span>
                  <span className="text-cyan-500">24ms</span>
                </div>
                <div className="h-2.5 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden border border-black/5 dark:border-white/5 p-0.5">
                  <div className="h-full bg-cyan-500 w-[85%] rounded-full shadow-[0_0_20px_rgba(6,182,212,0.4)]" />
                </div>
              </div>
            </div>
          </div>

          <div className="glass-panel p-8 flex flex-col gap-6">
             <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Administrator Notice</h3>
             <p className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-400 font-medium">
               The dashboard metrics are synchronized with the primary node. Please ensure to approve pending domain applications in the <span className="text-emerald-500 font-bold">Applications</span> tab.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}
