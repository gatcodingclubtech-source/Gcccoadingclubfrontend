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

  const stats = [
    { label: 'Events Joined', value: statsData.eventCount.toString(), icon: Calendar, color: 'emerald' },
    { label: 'Quizzes Taken', value: statsData.quizCount.toString(), icon: Code2, color: 'cyan' },
    { label: 'Total Points', value: statsData.totalPoints.toString(), icon: Trophy, color: 'amber' },
    { label: 'Global Rank', value: statsData.rank, icon: Zap, color: 'purple' },
  ];

  return (
    <div className="min-h-screen pt-32 pb-24 px-4 sm:px-6 relative overflow-hidden bg-white dark:bg-slate-950 transition-colors duration-500">
      {/* Background Decor */}
      <div className="absolute top-1/4 -right-20 w-96 h-96 bg-brand/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto flex flex-col gap-10 md:gap-16">
        {/* Header / Hero Section */}
        <div className="profile-fade-in flex flex-col md:flex-row items-center md:items-end gap-8 pb-10 border-b border-black/5 dark:border-white/5">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-[2.5rem] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative w-32 h-32 md:w-44 md:h-44 rounded-[2.2rem] bg-white dark:bg-slate-900 border-4 border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xl">
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
            {/* Status Indicator */}
            <div className="absolute bottom-2 right-2 w-8 h-8 bg-white dark:bg-slate-900 rounded-full flex items-center justify-center border-2 border-slate-200 dark:border-slate-800 shadow-lg">
               <div className="w-3.5 h-3.5 bg-emerald-500 rounded-full animate-pulse shadow-glow shadow-emerald-500/50" />
            </div>
          </div>

          <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left gap-4">
            <div className="flex flex-col gap-1 w-full">
              <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-4">
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
                <button 
                  onClick={() => setIsEditing(!isEditing)}
                  className={`px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${isEditing ? 'bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white' : 'bg-brand text-white shadow-xl shadow-brand/20'}`}
                >
                  {isEditing ? 'Cancel Editing' : 'Edit Profile'}
                </button>
              </div>
              <p className="text-slate-500 dark:text-slate-400 font-bold flex items-center gap-2 justify-center md:justify-start">
                <Mail className="w-4 h-4 text-brand" /> {user.email}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-2">
               <div className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-white/5 flex items-center gap-2 text-[11px] font-black text-slate-700 dark:text-slate-300 uppercase tracking-tight shadow-sm">
                 <Hash className="w-3.5 h-3.5 text-brand" /> {user.usn || 'USN Not Added'}
               </div>
               <div className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-white/5 flex items-center gap-2 text-[11px] font-black text-slate-700 dark:text-slate-300 uppercase tracking-tight shadow-sm">
                 <GraduationCap className="w-3.5 h-3.5 text-brand" /> {user.department || 'Dept'} • {user.year || 'Year'}
               </div>
               <button onClick={handleLogout} className="px-5 py-2 rounded-xl bg-red-500/10 hover:bg-red-500 hover:text-white text-red-500 border border-red-500/20 transition-all duration-300 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest group">
                 <LogOut className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" /> Logout
               </button>
            </div>
          </div>
        </div>

        {isEditing ? (
          /* EDIT MODE SECTION */
          <div className="profile-fade-in bg-white dark:bg-slate-900 shadow-2xl border-2 border-brand/20 p-8 md:p-12 rounded-[2.5rem] flex flex-col gap-10">
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white uppercase font-cyber">Personal Data Center</h2>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Update your records in the GCC Global Database</p>
            </div>

            <form onSubmit={handleUpdate} className="grid md:grid-cols-2 gap-8">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Full Name</label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/5 focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all outline-none text-slate-900 dark:text-white font-bold"
                    placeholder="Enter full name"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Phone Number</label>
                  <input 
                    type="text" 
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/5 focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all outline-none text-slate-900 dark:text-white font-bold"
                    placeholder="Enter phone number"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">USN</label>
                    <input 
                      type="text" 
                      value={formData.usn}
                      onChange={(e) => setFormData({...formData, usn: e.target.value})}
                      className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/5 focus:border-brand transition-all outline-none text-slate-900 dark:text-white font-bold uppercase"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Year</label>
                    <select 
                      value={formData.year}
                      onChange={(e) => setFormData({...formData, year: e.target.value})}
                      className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/5 focus:border-brand transition-all outline-none text-slate-900 dark:text-white font-bold"
                    >
                      <option value="">Select Year</option>
                      <option value="1st Year">1st Year</option>
                      <option value="2nd Year">2nd Year</option>
                      <option value="3rd Year">3rd Year</option>
                      <option value="4th Year">4th Year</option>
                    </select>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Bio / Headline</label>
                  <textarea 
                    value={formData.bio}
                    onChange={(e) => setFormData({...formData, bio: e.target.value})}
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/5 focus:border-brand transition-all outline-none text-slate-900 dark:text-white font-bold min-h-[120px]"
                    placeholder="Tell us about yourself..."
                  />
                </div>
              </div>

              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Skills (Comma separated)</label>
                  <input 
                    type="text" 
                    value={formData.skills}
                    onChange={(e) => setFormData({...formData, skills: e.target.value})}
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/5 focus:border-brand transition-all outline-none text-slate-900 dark:text-white font-bold"
                    placeholder="React, Node.js, Python..."
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">GitHub URL</label>
                  <input 
                    type="text" 
                    value={formData.githubUrl}
                    onChange={(e) => setFormData({...formData, githubUrl: e.target.value})}
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/5 focus:border-brand transition-all outline-none text-slate-900 dark:text-white font-bold"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">LinkedIn URL</label>
                  <input 
                    type="text" 
                    value={formData.linkedinUrl}
                    onChange={(e) => setFormData({...formData, linkedinUrl: e.target.value})}
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/5 focus:border-brand transition-all outline-none text-slate-900 dark:text-white font-bold"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Instagram URL</label>
                  <input 
                    type="text" 
                    value={formData.instagramUrl}
                    onChange={(e) => setFormData({...formData, instagramUrl: e.target.value})}
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/5 focus:border-brand transition-all outline-none text-slate-900 dark:text-white font-bold"
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={updating}
                  className="mt-4 w-full py-5 rounded-2xl bg-brand text-white font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-brand/20 disabled:opacity-50 flex items-center justify-center gap-3"
                >
                  {updating ? <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> SAVING...</> : 'SAVE CHANGES'}
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* VIEW MODE SECTION */
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="stat-card relative z-20 p-6 rounded-[2.5rem] bg-white dark:bg-slate-900 shadow-xl border border-slate-100 dark:border-white/10 flex flex-col gap-4 group hover:border-brand transition-all duration-500 hover:-translate-y-2">
                <div className={`w-12 h-12 rounded-2xl bg-${stat.color}-500/10 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm`}>
                  <Icon className={`w-6 h-6 text-${stat.color}-500`} />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tighter">{stat.value}</span>
                  <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">{stat.label}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Main Content Sections */}
        <div className="grid lg:grid-cols-12 gap-8 md:gap-12 items-start">
          
          {/* Left Column - Core Info & Skills (Col Span 4) */}
          <div className="lg:col-span-4 flex flex-col gap-8">
            
            {/* Technical Skills - NEW Tracking Subsection */}
            <div className="profile-fade-in bg-white dark:bg-slate-900 shadow-2xl border border-slate-100 dark:border-white/10 p-8 flex flex-col gap-8 rounded-[2.5rem]">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black tracking-[0.2em] text-slate-900 dark:text-white uppercase flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-brand" /> Skills Matrix
                </h3>
                <Star className="w-4 h-4 text-amber-500 fill-amber-500 animate-pulse" />
              </div>
              
              <div className="flex flex-col gap-6">
                {[
                  { name: 'Web Development', level: 85, color: 'emerald' },
                  { name: 'Data Structures', level: 70, color: 'cyan' },
                  { name: 'System Design', level: 45, color: 'purple' },
                  { name: 'Cloud Computing', level: 30, color: 'blue' }
                ].map((skill, i) => (
                  <div key={i} className="flex flex-col gap-3">
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                      <span className="text-slate-700 dark:text-slate-300">{skill.name}</span>
                      <span className={`text-${skill.color}-500`}>{skill.level}%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden border border-black/5 dark:border-white/5">
                      <div 
                        className={`h-full bg-${skill.color}-500 rounded-full transition-all duration-1000 ease-out`}
                        style={{ width: `${skill.level}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Achievements & Badges */}
            <div className="profile-fade-in bg-white dark:bg-slate-900 shadow-2xl border border-slate-100 dark:border-white/10 p-8 flex flex-col gap-6 rounded-[2.5rem]">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black tracking-[0.2em] text-slate-900 dark:text-white uppercase flex items-center gap-2">
                  <Award className="w-4 h-4 text-brand" /> Achievements
                </h3>
                <ChevronRight className="w-4 h-4 text-slate-400 cursor-pointer hover:text-brand" />
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                {[
                  { title: 'Alpha', icon: ShieldCheck, color: 'emerald' },
                  { title: 'Bug', icon: Terminal, color: 'slate' },
                  { title: 'Expert', icon: Code2, color: 'cyan' },
                  { title: 'Hero', icon: Trophy, color: 'amber' },
                  { title: 'Mentor', icon: Heart, color: 'rose' },
                  { title: 'Fast', icon: Zap, color: 'purple' }
                ].map((badge, i) => (
                  <div key={i} className="flex flex-col items-center gap-2 group cursor-help">
                    <div className={`w-14 h-14 rounded-2xl bg-${badge.color}-500/10 flex items-center justify-center border border-${badge.color}-500/20 group-hover:scale-110 group-hover:rotate-6 transition-all`}>
                      <badge.icon className={`w-6 h-6 text-${badge.color}-500`} />
                    </div>
                    <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">{badge.title}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Social & Connect */}
            <div className="profile-fade-in bg-white dark:bg-slate-900 shadow-2xl border border-slate-100 dark:border-white/10 p-8 flex flex-col gap-6 rounded-[2.5rem]">
              <h3 className="text-xs font-black tracking-[0.2em] text-slate-900 dark:text-white uppercase flex items-center gap-2">
                <Globe className="w-4 h-4 text-brand" /> Presence
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <a href={user.githubUrl || '#'} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-3 p-4 rounded-xl bg-slate-900 text-white text-[10px] font-black tracking-widest hover:bg-black transition-all">
                  <Github className="w-4 h-4" /> GITHUB
                </a>
                <a href="#" className="flex items-center justify-center gap-3 p-4 rounded-xl bg-blue-600 text-white text-[10px] font-black tracking-widest hover:bg-blue-700 transition-all">
                  <Linkedin className="w-4 h-4" /> LINKEDIN
                </a>
                <a href="#" className="flex items-center justify-center gap-3 p-4 rounded-xl bg-pink-600 text-white text-[10px] font-black tracking-widest hover:bg-pink-700 transition-all">
                  <Instagram className="w-4 h-4" /> INSTA
                </a>
                <a href="#" className="flex items-center justify-center gap-3 p-4 rounded-xl bg-slate-200 dark:bg-white text-slate-900 text-[10px] font-black tracking-widest hover:bg-white transition-all">
                  <ExternalLink className="w-4 h-4" /> WEB
                </a>
              </div>
            </div>
          </div>

          {/* Right Column - Deep Tracking & History (Col Span 8) */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            
            {/* ADVANCED TRACKING SUBSECTION - Activity & Performance */}
            <div className="profile-fade-in bg-white dark:bg-slate-900 shadow-2xl border border-slate-100 dark:border-white/10 p-10 flex flex-col gap-10 rounded-[2.5rem]">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex flex-col gap-2">
                  <h3 className="text-xl md:text-2xl font-black tracking-tighter text-slate-900 dark:text-white uppercase flex items-center gap-3 font-cyber">
                    <Activity className="w-6 h-6 text-emerald-500 animate-pulse" /> Activity Timeline
                  </h3>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Deep Tracking: User Participation Record</p>
                </div>
                <div className="flex p-1.5 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-white/5 self-start">
                  {['overview', 'events', 'quizzes'].map((tab) => (
                    <button 
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-6 py-2.5 rounded-xl text-[10px] font-black tracking-widest transition-all uppercase ${activeTab === tab ? 'bg-brand text-white shadow-lg' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              {/* Enhanced Timeline List */}
              <div className="flex flex-col gap-6 relative">
                {/* Timeline Connector Line */}
                <div className="absolute left-8 top-0 bottom-0 w-1 bg-slate-100 dark:bg-slate-800 rounded-full hidden md:block" />
                
                {[
                  { title: 'Project Submission', desc: 'Personal Portfolio Project', type: 'DEVELOPMENT', date: 'Yesterday', icon: Terminal, color: 'emerald' },
                  { title: 'Workshop Attended', desc: 'React Hooks Deep Dive', type: 'EDUCATION', date: '3 Days Ago', icon: BookOpen, color: 'cyan' },
                  { title: 'Quiz Completed', desc: 'JavaScript Advanced Test', type: 'EXAMINATION', date: 'Last Week', icon: Trophy, color: 'amber' },
                  { title: 'Account Verified', desc: 'Official GCC Member ID Issued', type: 'SYSTEM', date: 'May 12, 2024', icon: ShieldCheck, color: 'purple' }
                ].map((log, i) => (
                  <div key={i} className="flex flex-col md:flex-row md:items-center gap-8 p-6 md:p-8 rounded-[2rem] bg-slate-50/50 dark:bg-white/5 border border-black/5 dark:border-white/5 group hover:border-brand/40 transition-all duration-500 hover:scale-[1.01] relative z-10">
                    <div className={`w-16 h-16 rounded-2xl bg-${log.color}-500/10 flex items-center justify-center shrink-0 border border-${log.color}-500/20 group-hover:bg-${log.color}-500 group-hover:text-white transition-all duration-500`}>
                      <log.icon className="w-8 h-8" />
                    </div>
                    <div className="flex-1 flex flex-col gap-1">
                      <div className="flex items-center gap-3">
                        <span className={`px-2 py-0.5 rounded bg-${log.color}-500/10 text-${log.color}-500 text-[8px] font-black tracking-widest uppercase`}>{log.type}</span>
                        <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{log.date}</span>
                      </div>
                      <h4 className="text-base md:text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight mt-1">{log.title}</h4>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium leading-relaxed">{log.desc}</p>
                    </div>
                    <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-[9px] font-black tracking-[0.2em] uppercase hover:bg-brand hover:text-white transition-all border border-black/5 dark:border-white/10 shadow-sm">
                      DETAILS <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-center pt-6">
                 <button className="px-10 py-4 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[10px] font-black tracking-widest uppercase hover:scale-105 transition-all shadow-2xl flex items-center gap-3">
                   Export History Report <ExternalLink className="w-4 h-4" />
                 </button>
              </div>
            </div>

            {/* Performance Stats Cards */}
            <div className="grid md:grid-cols-2 gap-8">
               <div className="profile-fade-in p-8 rounded-[2.5rem] bg-slate-900 text-white flex flex-col gap-6 shadow-2xl hover:scale-[1.02] transition-transform">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                      <Briefcase className="w-6 h-6 text-brand" />
                    </div>
                    <span className="text-[10px] font-black tracking-[0.2em] uppercase text-slate-400">Professional</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <h4 className="text-2xl font-black tracking-tight uppercase">Internship Ready</h4>
                    <p className="text-slate-400 text-[11px] leading-relaxed">Your profile has enough points and workshop completions to qualify for top-tier club internship recommendations.</p>
                  </div>
                  <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="w-3/4 h-full bg-brand rounded-full" />
                  </div>
               </div>

               <div className="profile-fade-in p-8 rounded-[2.5rem] bg-gradient-to-br from-indigo-600 to-purple-700 text-white flex flex-col gap-6 shadow-2xl hover:scale-[1.02] transition-transform">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                      <Zap className="w-6 h-6 text-amber-400" />
                    </div>
                    <span className="text-[10px] font-black tracking-[0.2em] uppercase text-white/50">Current Streak</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <h4 className="text-4xl font-black tracking-tighter">05 <span className="text-lg text-white/60">DAYS</span></h4>
                    <p className="text-white/70 text-[11px] leading-relaxed">Daily portal activity streak. Keep it up to earn the "Consistent Coder" badge next week!</p>
                  </div>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map(i => <div key={i} className="flex-1 h-1.5 bg-white rounded-full" />)}
                    {[1, 2].map(i => <div key={i} className="flex-1 h-1.5 bg-white/20 rounded-full" />)}
                  </div>
               </div>
            </div>
            </div>
          </div>
        </>
      )}
      </div>
    </div>
  );
}
