import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { 
  User, Mail, Hash, BookOpen, Calendar, 
  ShieldCheck, Award, Settings, LogOut, 
  ChevronRight, Terminal, ExternalLink,
  Code2, Zap, Trophy, Heart, Activity,
  Globe, Cpu, Star, Briefcase, GraduationCap
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';

const Github = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
);

const Linkedin = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
);

const Instagram = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
);

export default function Profile() {
  const { user, logout, loading, checkUserLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    usn: '',
    department: '',
    year: '',
    githubUrl: '',
    linkedinUrl: '',
    instagramUrl: '',
    bio: '',
    skills: ''
  });
  const [statsData, setStatsData] = useState({
    eventCount: 0,
    quizCount: 0,
    totalPoints: 0,
    rank: '#1',
    milestones: 12,
    hoursLearned: 45,
    streak: 5
  });
  const [fetchingStats, setFetchingStats] = useState(true);
  const [activities, setActivities] = useState([]);
  const [fetchingActivities, setFetchingActivities] = useState(true);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        usn: user.usn || '',
        department: user.department || '',
        year: user.year || '',
        githubUrl: user.githubUrl || '',
        linkedinUrl: user.linkedinUrl || '',
        instagramUrl: user.instagramUrl || '',
        bio: user.bio || '',
        skills: user.skills?.join(', ') || ''
      });
    }
  }, [user]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const skillsArray = formData.skills.split(',').map(s => s.trim()).filter(s => s !== '');
      const res = await axios.put('/api/users/profile', {
        ...formData,
        skills: skillsArray
      });
      if (res.data.success) {
        await checkUserLoggedIn(); // Refresh user data
        setIsEditing(false);
      }
    } catch (err) {
      console.error('Update failed:', err);
      alert('Failed to update profile. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get('/api/users/profile/stats');
        if (res.data.success) {
          setStatsData(prev => ({ ...prev, ...res.data.stats }));
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
    const fetchActivities = async () => {
      try {
        const res = await axios.get('/api/users/profile/activities');
        if (res.data.success) {
          setActivities(res.data.activities);
        }
      } catch (err) {
        console.error('Error fetching activities:', err);
      } finally {
        setFetchingActivities(false);
      }
    };

    if (user) {
      fetchActivities();
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
  }, [isEditing]);

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

  const getRankColor = (rank) => {
    const colors = {
      'Rookie': 'slate',
      'Builder': 'emerald',
      'Core Member': 'blue',
      'Elite': 'purple',
      'Legend': 'amber'
    };
    return colors[rank] || 'slate';
  };

  const getRankProgress = () => {
    const xp = user.xp || 0;
    if (xp >= 1000) return 100;
    if (xp >= 500) return ((xp - 500) / 500) * 100;
    if (xp >= 200) return ((xp - 200) / 300) * 100;
    if (xp >= 50) return ((xp - 50) / 150) * 100;
    return (xp / 50) * 100;
  };

  const getNextRank = () => {
    const xp = user.xp || 0;
    if (xp >= 1000) return 'MAX RANK';
    if (xp >= 500) return 'Legend (1000 XP)';
    if (xp >= 200) return 'Elite (500 XP)';
    if (xp >= 50) return 'Core Member (200 XP)';
    return 'Builder (50 XP)';
  };

  return (
    <div className="min-h-screen pt-32 pb-24 px-4 sm:px-6 relative overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand/10 rounded-full blur-[120px] pointer-events-none opacity-50" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none opacity-50" />

      <div className="max-w-7xl mx-auto flex flex-col gap-10 md:gap-16">
        {/* Header / Hero Section - Redesigned 2.0 */}
        <div className="profile-fade-in glass-panel p-8 md:p-12 flex flex-col md:flex-row items-center gap-10 border-brand/20 shadow-2xl shadow-brand/10">
          <div className="relative group">
            <div className={`absolute -inset-2 bg-gradient-to-r from-${getRankColor(user.rank)}-500 to-cyan-500 rounded-[3rem] blur opacity-30 group-hover:opacity-60 transition duration-1000`}></div>
            <div className="relative w-32 h-32 md:w-52 md:h-52 rounded-[2.8rem] bg-white dark:bg-slate-900 border-4 border-white dark:border-slate-800 overflow-hidden shadow-2xl">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 text-slate-400">
                  <User className="w-20 h-20" />
                </div>
              )}
            </div>
            {/* Rank Badge Indicator */}
            <div className={`absolute -bottom-4 -right-4 px-6 py-2 bg-${getRankColor(user.rank)}-500 text-white rounded-full text-[10px] font-black tracking-widest shadow-xl border-4 border-white dark:border-slate-900 uppercase`}>
              {user.rank}
            </div>
          </div>

          <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left gap-6">
            <div className="space-y-2 w-full">
               <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-slate-900 dark:text-white uppercase font-cyber leading-none">
                      {user.name}
                    </h1>
                    <p className="text-brand font-black text-xs tracking-[0.3em] uppercase opacity-80">
                      @{user.username || user.name.split(' ')[0].toLowerCase()}
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <button 
                      onClick={() => setIsEditing(!isEditing)}
                      className="px-6 py-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/5 text-slate-900 dark:text-white font-black text-xs uppercase tracking-widest shadow-xl hover:scale-105 transition-all"
                    >
                      {isEditing ? 'Cancel' : 'Edit Profile'}
                    </button>
                    <button onClick={handleLogout} className="p-3 rounded-2xl bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white transition-all shadow-lg">
                       <LogOut className="w-5 h-5" />
                    </button>
                  </div>
               </div>
            </div>

            {/* XP PROGRESS BAR */}
            <div className="w-full max-w-2xl space-y-3">
               <div className="flex justify-between items-end">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    XP PROGRESS: <span className="text-brand">{user.xp || 0} XP</span>
                  </span>
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    NEXT: <span className="text-slate-900 dark:text-white">{getNextRank()}</span>
                  </span>
               </div>
               <div className="h-4 w-full bg-slate-100 dark:bg-slate-800 rounded-full p-1 border border-black/5 dark:border-white/5 overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${getRankProgress()}%` }}
                    transition={{ duration: 1.5, ease: 'power4.out' }}
                    className={`h-full bg-gradient-to-r from-${getRankColor(user.rank)}-500 to-cyan-500 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.5)]`} 
                  />
               </div>
            </div>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
               <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-white/5 rounded-xl border border-black/5 dark:border-white/5 text-[10px] font-black uppercase text-slate-500">
                  <Hash className="w-3.5 h-3.5 text-brand" /> {user.usn || 'USN_PENDING'}
               </div>
               <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-white/5 rounded-xl border border-black/5 dark:border-white/5 text-[10px] font-black uppercase text-slate-500">
                  <Code2 className="w-3.5 h-3.5 text-brand" /> {user.department || 'TECH'} • {user.year || 'LVL1'}
               </div>
               <div className="flex items-center gap-2 px-4 py-2 bg-brand/10 rounded-xl border border-brand/20 text-[10px] font-black uppercase text-brand">
                  <ShieldCheck className="w-3.5 h-3.5" /> VERIFIED MEMBER
               </div>
            </div>
          </div>
        </div>

        {isEditing ? (
          /* EDIT MODE SECTION - Minimalist Clean */
          <div className="profile-fade-in glass-panel p-10 md:p-16 rounded-[3rem] border-brand/20 shadow-2xl">
            <div className="flex flex-col gap-2 mb-12">
              <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white uppercase font-cyber">Update Identity</h2>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Your digital footprint across the GCC ecosystem</p>
            </div>

            <form onSubmit={handleUpdate} className="grid lg:grid-cols-2 gap-12">
               <div className="space-y-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                    <input 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full p-5 bg-slate-100 dark:bg-slate-800 rounded-2xl border-none outline-none focus:ring-2 ring-brand/50 font-bold text-sm transition-all"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">USN</label>
                    <input 
                      value={formData.usn}
                      onChange={(e) => setFormData({...formData, usn: e.target.value})}
                      className="w-full p-5 bg-slate-100 dark:bg-slate-800 rounded-2xl border-none outline-none focus:ring-2 ring-brand/50 font-bold text-sm transition-all uppercase"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Bio / Status</label>
                    <textarea 
                      rows="4"
                      value={formData.bio}
                      onChange={(e) => setFormData({...formData, bio: e.target.value})}
                      className="w-full p-5 bg-slate-100 dark:bg-slate-800 rounded-2xl border-none outline-none focus:ring-2 ring-brand/50 font-bold text-sm transition-all resize-none"
                    />
                  </div>
               </div>

               <div className="space-y-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Skills (comma separated)</label>
                    <input 
                      value={formData.skills}
                      onChange={(e) => setFormData({...formData, skills: e.target.value})}
                      className="w-full p-5 bg-slate-100 dark:bg-slate-800 rounded-2xl border-none outline-none focus:ring-2 ring-brand/50 font-bold text-sm transition-all"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">GitHub Username</label>
                    <input 
                      value={formData.githubUrl}
                      onChange={(e) => setFormData({...formData, githubUrl: e.target.value})}
                      className="w-full p-5 bg-slate-100 dark:bg-slate-800 rounded-2xl border-none outline-none focus:ring-2 ring-brand/50 font-bold text-sm transition-all"
                    />
                  </div>
                  <button 
                    type="submit" 
                    disabled={updating}
                    className="w-full py-6 bg-brand text-white rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-brand/20 hover:scale-[1.02] active:scale-95 transition-all mt-6"
                  >
                    {updating ? 'SYNCING...' : 'SYNC DATA'}
                  </button>
               </div>
            </form>
          </div>
        ) : (
          /* VIEW MODE - Dashboard Style */
          <div className="grid lg:grid-cols-12 gap-8 md:gap-12">
             
             {/* LEFT SIDEBAR - Skills & Badges */}
             <div className="lg:col-span-4 space-y-8">
                {/* Stats Summary */}
                <div className="profile-fade-in grid grid-cols-2 gap-4">
                   <div className="glass-panel p-6 flex flex-col gap-2 border-emerald-500/20 group hover:bg-emerald-500/5 transition-colors">
                      <span className="text-3xl font-black">{statsData.eventCount}</span>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Events</span>
                   </div>
                   <div className="glass-panel p-6 flex flex-col gap-2 border-cyan-500/20 group hover:bg-cyan-500/5 transition-colors">
                      <span className="text-3xl font-black">{user.xp || 0}</span>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total XP</span>
                   </div>
                </div>

                {/* Skills Showcase */}
                <div className="profile-fade-in glass-panel p-8 space-y-8">
                   <h3 className="text-xs font-black uppercase tracking-[0.3em] flex items-center gap-3">
                      <Terminal className="w-4 h-4 text-brand" /> Tech Stack
                   </h3>
                   <div className="flex flex-wrap gap-2">
                      {(user.skills?.length > 0 ? user.skills : ['React', 'Node.js', 'Python', 'UI Design']).map((skill, i) => (
                        <span key={i} className="px-3 py-1.5 bg-slate-100 dark:bg-white/5 rounded-lg text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider border border-black/5 dark:border-white/5">
                          {skill}
                        </span>
                      ))}
                   </div>
                </div>

                {/* Badges Corridor */}
                <div className="profile-fade-in glass-panel p-8 space-y-8 overflow-hidden relative">
                   <div className="flex items-center justify-between">
                      <h3 className="text-xs font-black uppercase tracking-[0.3em] flex items-center gap-3">
                        <Award className="w-4 h-4 text-amber-500" /> Achievements
                      </h3>
                   </div>
                   <div className="flex flex-wrap gap-4 justify-center">
                      {(user.badges?.length > 0 ? user.badges : [
                        { name: 'Pioneer', icon: ShieldCheck, color: 'emerald' },
                        { name: 'Coder', icon: Code2, color: 'blue' },
                        { name: 'Elite', icon: Zap, color: 'amber' }
                      ]).map((badge, i) => {
                        const Icon = badge.icon || ShieldCheck;
                        return (
                          <div key={i} className="flex flex-col items-center gap-2 group">
                             <div className="w-14 h-14 rounded-2xl bg-brand/10 flex items-center justify-center border border-brand/20 group-hover:scale-110 transition-transform">
                                <Icon className="w-7 h-7 text-brand" />
                             </div>
                             <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">{badge.name}</span>
                          </div>
                        );
                      })}
                   </div>
                   <div className="absolute inset-0 bg-gradient-to-t from-white/10 dark:from-slate-900/10 to-transparent pointer-events-none" />
                </div>
             </div>

             {/* MAIN CONTENT - Timeline & Activities */}
             <div className="lg:col-span-8 space-y-8">
                <div className="profile-fade-in glass-panel p-8 md:p-12 space-y-10">
                   <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="space-y-1">
                        <h2 className="text-2xl md:text-3xl font-black tracking-tighter uppercase font-cyber flex items-center gap-3">
                          <Activity className="w-6 h-6 text-emerald-500" /> Performance Node
                        </h2>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Real-time activity logs from the portal</p>
                      </div>
                      <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
                        {['overview', 'events', 'quiz', 'discussions'].map((tab) => (
                          <button 
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-2 rounded-lg text-[9px] font-black tracking-widest uppercase transition-all ${activeTab === tab ? 'bg-brand text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
                          >
                            {tab}
                          </button>
                        ))}
                      </div>
                   </div>

                   <div className="space-y-6 relative">
                      <div className="absolute left-8 top-0 bottom-0 w-[2px] bg-slate-100 dark:bg-slate-800 rounded-full hidden md:block" />
                      
                      {fetchingActivities ? (
                        <div className="space-y-4">
                           {[1,2,3].map(i => <div key={i} className="h-24 bg-slate-100 dark:bg-white/5 animate-pulse rounded-2xl" />)}
                        </div>
                      ) : (
                        activities.filter(a => activeTab === 'overview' || a.type.toLowerCase() === activeTab).map((act, i) => {
                          const Icon = getTimelineIcon(act.icon);
                          return (
                            <motion.div 
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              key={i} 
                              className="relative z-10 flex flex-col md:flex-row md:items-center gap-6 p-6 bg-slate-50 dark:bg-white/5 rounded-2xl border border-black/5 dark:border-white/5 hover:border-brand/30 transition-all group"
                            >
                               <div className="w-16 h-16 rounded-xl bg-brand/10 flex items-center justify-center shrink-0 border border-brand/20 group-hover:bg-brand group-hover:text-white transition-all">
                                  <Icon className="w-8 h-8" />
                               </div>
                               <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-1">
                                     <span className="text-[8px] font-black tracking-widest text-brand uppercase">{act.type}</span>
                                     <span className="text-[9px] font-bold text-slate-500">{formatDate(act.date)}</span>
                                  </div>
                                  <h4 className="text-lg font-black tracking-tight leading-none uppercase">{act.title}</h4>
                                  <p className="text-[11px] text-slate-500 font-medium mt-1">{act.desc}</p>
                               </div>
                               <button className="px-5 py-2.5 bg-white dark:bg-slate-800 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-sm hover:bg-brand hover:text-white transition-all border border-black/5 dark:border-white/10">
                                  DETAILS
                               </button>
                            </motion.div>
                          );
                        })
                      )}

                      {activities.length === 0 && !fetchingActivities && (
                         <div className="py-20 text-center flex flex-col items-center gap-4 opacity-30">
                            <Activity className="w-12 h-12" />
                            <span className="text-[10px] font-black tracking-widest uppercase">No activities detected in this node</span>
                         </div>
                      )}
                   </div>
                </div>

                {/* Growth Card */}
                <div className="profile-fade-in p-8 md:p-12 rounded-[3rem] bg-gradient-to-br from-slate-900 to-black text-white relative overflow-hidden group shadow-2xl">
                   <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:scale-125 transition-transform duration-1000">
                      <Zap className="w-32 h-32 text-brand" />
                   </div>
                   <div className="relative z-10 space-y-6">
                      <div className="space-y-2">
                        <h3 className="text-3xl font-black tracking-tighter uppercase font-cyber leading-tight">Elite <span className="text-brand">Member</span> Status</h3>
                        <p className="text-slate-400 text-sm max-w-md leading-relaxed">
                          Your consistent participation in GAT Coding Club has placed you in the Top 10% of developers.
                          Keep contributing to unlock the "Mentor" badge and exclusive project access.
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-4">
                         <div className="px-6 py-3 bg-white/10 rounded-xl backdrop-blur-md border border-white/10 flex flex-col gap-1">
                            <span className="text-2xl font-black">8.4k</span>
                            <span className="text-[9px] font-black text-brand uppercase tracking-widest">Global Ranking</span>
                         </div>
                         <div className="px-6 py-3 bg-white/10 rounded-xl backdrop-blur-md border border-white/10 flex flex-col gap-1">
                            <span className="text-2xl font-black">450+</span>
                            <span className="text-[9px] font-black text-cyan-500 uppercase tracking-widest">Hours Learned</span>
                         </div>
                      </div>
                   </div>
                </div>
             </div>

          </div>
        )}
      </div>
    </div>
  );
}
