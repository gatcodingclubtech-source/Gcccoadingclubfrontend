import React, { useState, useEffect } from 'react';
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
    newRegistrations: 0
  });
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, eventsRes, quizRes] = await Promise.all([
          axios.get('/api/users'),
          axios.get('/api/events'),
          axios.get('/api/quiz')
        ]);

        if (usersRes.data.success) {
          setStats(prev => ({
            ...prev,
            totalUsers: usersRes.data.users.length,
            newRegistrations: usersRes.data.users.filter(u => {
              const created = new Date(u.createdAt);
              const now = new Date();
              return (now - created) < (7 * 24 * 60 * 60 * 1000); // last 7 days
            }).length
          }));
          setRecentUsers(usersRes.data.users.slice(0, 5));
        }

        if (eventsRes.data.success) {
          setStats(prev => ({ ...prev, activeEvents: eventsRes.data.events.length }));
        }

        if (quizRes.data.success) {
          setStats(prev => ({ ...prev, quizQuestions: quizRes.data.questions.length }));
        }
      } catch (err) {
        console.error('Error fetching dashboard stats', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    gsap.from('.stat-card', {
      y: 20,
      opacity: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: 'power3.out'
    });
  }, []);

  const statCards = [
    { title: 'Total Members', value: stats.totalUsers, icon: <Users />, color: 'emerald', trend: '+12%' },
    { title: 'Active Events', value: stats.activeEvents, icon: <Calendar />, color: 'cyan', trend: '+2' },
    { title: 'Quiz Base', value: stats.quizQuestions, icon: <HelpCircle />, color: 'blue', trend: '85%' },
    { title: 'New Syncs', value: stats.newRegistrations, icon: <UserPlus />, color: 'purple', trend: 'Today' },
  ];

  if (loading) return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="flex flex-col gap-12">
      {/* Welcome Section */}
      <div className="flex flex-col gap-3">
        <h1 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">System Overview</h1>
        <div className="flex items-center gap-3">
          <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2">
            <Activity className="w-3 h-3 text-emerald-500" />
            <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-black uppercase tracking-widest">Real-time Pulse Active</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, idx) => (
          <div key={idx} className="stat-card glass-panel p-8 group hover:border-emerald-500/30 transition-all cursor-default">
            <div className="flex justify-between items-start mb-6">
              <div className={`p-4 rounded-2xl bg-${card.color}-500/10 border border-${card.color}-500/20 text-${card.color}-600 dark:text-${card.color}-400 shadow-lg shadow-${card.color}-500/5`}>
                {React.cloneElement(card.icon, { className: 'w-6 h-6' })}
              </div>
              <div className="flex items-center gap-1 text-[9px] font-black text-emerald-500 uppercase bg-emerald-500/5 px-3 py-1.5 rounded-full border border-emerald-500/10">
                <TrendingUp className="w-3 h-3" /> {card.trend}
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter mb-1">{card.value}</span>
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{card.title}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Users */}
        <div className="lg:col-span-2 glass-panel p-8 flex flex-col gap-8">
          <div className="flex justify-between items-center">
            <div className="flex flex-col gap-1">
              <h3 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-tighter">Recent Terminals</h3>
              <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Latest community members synced.</p>
            </div>
            <button className="px-4 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 text-[9px] font-black text-emerald-500 uppercase flex items-center gap-2 hover:bg-emerald-500 hover:text-white transition-all">
              Full Log <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-black/5 dark:border-white/5">
                  <th className="pb-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Identity</th>
                  <th className="pb-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Sector</th>
                  <th className="pb-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Auth Level</th>
                  <th className="pb-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5 dark:divide-white/5">
                {recentUsers.map((user) => (
                  <tr key={user._id} className="group hover:bg-black/[0.01] dark:hover:bg-white/[0.01] transition-all">
                    <td className="py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/5 border border-black/5 dark:border-white/10 flex items-center justify-center overflow-hidden shadow-sm">
                          {user.avatar ? (
                            <img src={user.avatar} className="w-full h-full object-cover" />
                          ) : (
                            <Users className="w-5 h-5 text-slate-400" />
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-black text-slate-900 dark:text-white group-hover:text-emerald-500 transition-colors leading-tight">{user.name}</span>
                          <span className="text-[10px] text-slate-500 font-medium">{user.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-5">
                      <span className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-white/5 text-[9px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest">{user.department || 'PENDING'}</span>
                    </td>
                    <td className="py-5">
                      <div className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${user.profileComplete ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]'}`} />
                        <span className="text-[9px] font-black uppercase text-slate-500 tracking-tighter">
                          {user.profileComplete ? 'Verified' : 'Incomplete'}
                        </span>
                      </div>
                    </td>
                    <td className="py-5 text-right">
                      <span className="text-[10px] font-bold text-slate-400">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions / System Health */}
        <div className="flex flex-col gap-8">
          <div className="glass-panel p-8 bg-gradient-to-br from-emerald-500/5 to-transparent border-emerald-500/20">
            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest mb-6 flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-500" /> System Metrics
            </h3>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-3">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                  <span className="text-slate-500">Database Integrity</span>
                  <span className="text-emerald-500">99.8%</span>
                </div>
                <div className="h-2 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden border border-black/5 dark:border-white/5">
                  <div className="h-full bg-emerald-500 w-[99.8%] rounded-full shadow-[0_0_15px_rgba(16,185,129,0.3)]" />
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                  <span className="text-slate-500">Node Latency</span>
                  <span className="text-cyan-500">12ms</span>
                </div>
                <div className="h-2 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden border border-black/5 dark:border-white/5">
                  <div className="h-full bg-cyan-500 w-[15%] rounded-full shadow-[0_0_15px_rgba(6,182,212,0.3)]" />
                </div>
              </div>
            </div>
            <button className="w-full mt-8 py-4 rounded-2xl bg-emerald-500 text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
              Initialize Diagnostics
            </button>
          </div>

          <div className="glass-panel p-8">
            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest mb-6">Operations</h3>
            <div className="flex flex-col gap-3">
              <button className="flex items-center justify-between p-4 rounded-2xl bg-black/5 dark:bg-white/5 hover:bg-emerald-500/10 border border-black/5 dark:border-white/5 hover:border-emerald-500/30 transition-all text-left group">
                <span className="text-[10px] font-black uppercase text-slate-600 dark:text-slate-400 group-hover:text-emerald-500">Broadcast Event</span>
                <Calendar className="w-4 h-4 text-slate-400 group-hover:text-emerald-500" />
              </button>
              <button className="flex items-center justify-between p-4 rounded-2xl bg-black/5 dark:bg-white/5 hover:bg-emerald-500/10 border border-black/5 dark:border-white/5 hover:border-emerald-500/30 transition-all text-left group">
                <span className="text-[10px] font-black uppercase text-slate-600 dark:text-slate-400 group-hover:text-emerald-500">Inject Logic</span>
                <HelpCircle className="w-4 h-4 text-slate-400 group-hover:text-emerald-500" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
