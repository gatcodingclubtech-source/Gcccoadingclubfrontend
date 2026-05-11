import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { 
  User, Mail, Hash, BookOpen, Calendar, 
  ShieldCheck, Award, Settings, LogOut, 
  ChevronRight, Terminal, ExternalLink,
  Code2, Zap, Trophy, Heart
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';

const Github = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
);

export default function Profile() {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [statsData, setStatsData] = useState({
    eventCount: 0,
    quizCount: 0,
    totalPoints: 0,
    rank: '#1'
  });
  const [fetchingStats, setFetchingStats] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get('/api/users/profile/stats');
        if (res.data.success) {
          setStatsData(res.data.stats);
        }
      } catch (err) {
        console.error('Error fetching stats:', err);
      } finally {
        setFetchingStats(false);
      }
    };

    if (user) {
      fetchStats();
    }
  }, [user]);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate('/auth');
      } else if (!user.profileComplete) {
        navigate('/profile/complete');
      }
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    window.scrollTo(0, 0);
    const ctx = gsap.context(() => {
      gsap.from('.profile-fade-in', {
        y: 20,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out'
      });
      
      gsap.from('.stat-card', {
        scale: 0.9,
        y: 20,
        duration: 0.6,
        stagger: 0.1,
        ease: 'back.out(1.7)',
        delay: 0.3
      });
    });
    return () => ctx.revert();
  }, []);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-brand border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const stats = [
    { label: 'Events Joined', value: statsData.eventCount.toString(), icon: Calendar, color: 'emerald' },
    { label: 'Quizzes Taken', value: statsData.quizCount.toString(), icon: Code2, color: 'cyan' },
    { label: 'Total Points', value: statsData.totalPoints.toString(), icon: Trophy, color: 'amber' },
    { label: 'Rank', value: statsData.rank, icon: Zap, color: 'purple' },
  ];

  return (
    <div className="min-h-screen pt-32 pb-24 px-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-1/4 -right-20 w-96 h-96 bg-brand/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto flex flex-col gap-12">
        {/* Header / Hero Section */}
        <div className="profile-fade-in flex flex-col md:flex-row items-center md:items-end gap-8 pb-8 border-b border-black/5 dark:border-white/5">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-[2.5rem] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-[2.2rem] bg-white dark:bg-slate-900 border-4 border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xl">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900">
                  <User className="w-16 h-16 text-slate-400" />
                </div>
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer backdrop-blur-sm">
                <Settings className="w-8 h-8 text-white animate-spin-slow" />
              </div>
            </div>
          </div>

          <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left gap-4">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-3 justify-center md:justify-start">
                <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-slate-900 dark:text-white uppercase font-cyber">
                  {user.name}
                </h1>
                {user.role === 'admin' && (
                  <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-black tracking-widest uppercase">
                    ADMIN
                  </span>
                )}
              </div>
              <p className="text-slate-500 dark:text-slate-400 font-bold flex items-center gap-2 justify-center md:justify-start">
                <Mail className="w-4 h-4 text-brand" /> {user.email}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-2">
               <div className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 border-2 border-slate-300 dark:border-white/10 flex items-center gap-2 text-xs font-black text-black dark:text-white uppercase tracking-tight shadow-md">
                 <Hash className="w-3.5 h-3.5 text-brand" /> {user.usn || 'USN Not Added'}
               </div>
               <div className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 border-2 border-slate-300 dark:border-white/10 flex items-center gap-2 text-xs font-black text-black dark:text-white uppercase tracking-tight shadow-md">
                 <BookOpen className="w-3.5 h-3.5 text-brand" /> {user.department || 'Dept'} • {user.year || 'Year'}
               </div>
               <button onClick={handleLogout} className="px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 transition-all flex items-center gap-2 text-xs font-black uppercase tracking-widest">
                 <LogOut className="w-3.5 h-3.5" /> Logout
               </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="stat-card relative z-20 p-6 rounded-[2.5rem] bg-white dark:bg-slate-900 shadow-2xl border-2 border-slate-300 dark:border-white/20 flex flex-col gap-4 group hover:border-brand transition-all duration-500">
                <div className={`w-12 h-12 rounded-2xl bg-${stat.color}-500/20 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm`}>
                  <Icon className={`w-6 h-6 text-${stat.color}-600`} />
                </div>
                <div className="flex flex-col gap-4">
                  <span className="text-2xl md:text-3xl font-black text-black dark:text-white tracking-tighter">{stat.value}</span>
                  <span className="text-[10px] font-black text-black dark:text-slate-200 uppercase tracking-widest mt-1 opacity-100">{stat.label}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Main Content Sections */}
        <div className="grid lg:grid-cols-3 gap-8 items-start">
          {/* Left Column - Details & Badges */}
          <div className="lg:col-span-1 flex flex-col gap-8">
            <div className="profile-fade-in bg-white dark:bg-slate-900 shadow-2xl border-2 border-slate-200 dark:border-white/10 p-8 flex flex-col gap-6 rounded-[2.5rem]">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black tracking-[0.2em] text-black dark:text-white uppercase flex items-center gap-2">
                  <Award className="w-4 h-4 text-brand" /> Achievements
                </h3>
                <span className="text-[9px] font-black text-brand uppercase cursor-pointer hover:underline">View All</span>
              </div>
              
              <div className="flex flex-col gap-4">
                {[
                  { title: 'Alpha Member', date: 'May 2024', icon: ShieldCheck },
                  { title: 'Bug Hunter', date: 'June 2024', icon: Terminal },
                  { title: 'Workshop Pro', date: 'Live', icon: Code2 }
                ].map((badge, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-100/50 dark:bg-white/5 border border-black/5 dark:border-white/5 group hover:bg-white dark:hover:bg-slate-800 transition-all cursor-default">
                    <div className="w-10 h-10 rounded-xl bg-brand/10 flex items-center justify-center group-hover:rotate-12 transition-transform">
                      <badge.icon className="w-5 h-5 text-brand" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-tight">{badge.title}</span>
                      <span className="text-[9px] text-slate-500 dark:text-slate-500 uppercase font-bold">{badge.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="profile-fade-in bg-white dark:bg-slate-900 shadow-2xl border-2 border-slate-200 dark:border-white/10 p-8 flex flex-col gap-6 rounded-[2.5rem]">
              <h3 className="text-xs font-black tracking-[0.2em] text-black dark:text-white uppercase flex items-center gap-2">
                <Github className="w-4 h-4 text-brand" /> Tech Links
              </h3>
              <div className="flex flex-col gap-3">
                <a href={user.githubUrl || '#'} target="_blank" rel="noreferrer" className="flex items-center justify-between p-4 rounded-xl bg-slate-900 text-white text-[10px] font-black tracking-widest hover:bg-black transition-all">
                  GITHUB PROFILE <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <button className="flex items-center justify-between p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-black tracking-widest hover:bg-emerald-500/20 transition-all">
                  CLUB PORTFOLIO <Terminal className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Activities & Recent */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            <div className="profile-fade-in bg-white dark:bg-slate-900 shadow-2xl border-2 border-slate-200 dark:border-white/10 p-8 flex flex-col gap-8 rounded-[2.5rem]">
              <div className="flex items-center justify-between">
                <div className="flex p-1 bg-slate-200 dark:bg-slate-800 rounded-xl border border-slate-300 dark:border-white/5">
                  <button 
                    onClick={() => setActiveTab('overview')}
                    className={`px-6 py-2 rounded-lg text-[10px] font-black tracking-widest transition-all ${activeTab === 'overview' ? 'bg-brand text-white shadow-lg' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
                  >
                    ACTIVITIES
                  </button>
                  <button 
                    onClick={() => setActiveTab('quizzes')}
                    className={`px-6 py-2 rounded-lg text-[10px] font-black tracking-widest transition-all ${activeTab === 'quizzes' ? 'bg-brand text-white shadow-lg' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
                  >
                    CERTIFICATES
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-6">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 rounded-3xl bg-slate-100/30 dark:bg-white/5 border border-black/5 dark:border-white/5 group hover:border-brand/30 transition-all">
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-white/5">
                        <div className="w-full h-full flex items-center justify-center">
                          <Code2 className="w-8 h-8 text-brand" />
                        </div>
                      </div>
                      <div className="flex flex-col gap-1">
                        <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">Summer Hackathon 2024</h4>
                        <p className="text-[10px] text-slate-700 dark:text-slate-400 font-bold uppercase tracking-widest">Workshop • Completed</p>
                      </div>
                    </div>
                    <button className="px-6 py-2.5 rounded-xl border border-black/10 dark:border-white/10 text-[9px] font-black tracking-[0.2em] uppercase hover:bg-brand hover:text-white hover:border-brand transition-all">
                      View Details
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-center pt-4">
                 <button className="flex items-center gap-2 text-[10px] font-black tracking-widest text-slate-400 hover:text-brand transition-all uppercase">
                   Load More History <ChevronRight className="w-4 h-4" />
                 </button>
              </div>
            </div>

            {/* Support Message */}
            <div className="profile-fade-in p-8 rounded-[2.5rem] bg-gradient-to-br from-emerald-500 to-cyan-600 flex flex-col md:flex-row items-center gap-6 shadow-2xl shadow-emerald-500/20">
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-xl flex items-center justify-center shrink-0">
                <Heart className="w-8 h-8 text-white fill-white animate-pulse" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h4 className="text-lg font-black text-white uppercase tracking-tight">Member of the Month Candidate?</h4>
                <p className="text-white/80 text-xs font-medium mt-1">Keep participating in workshops and hackathons to increase your ranking on the global leaderboard!</p>
              </div>
              <button className="px-8 py-3 rounded-xl bg-white text-emerald-600 text-[10px] font-black tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl">
                VIEW LEADERBOARD
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
