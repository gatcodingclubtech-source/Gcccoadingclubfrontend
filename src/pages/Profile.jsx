import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { 
  User, Mail, Hash, BookOpen, Calendar, 
  ShieldCheck, Award, Settings, LogOut, 
  ChevronRight, Terminal, ExternalLink, ArrowRight,
  Code2, Zap, Trophy, Heart, Activity,
  Globe, Cpu, Star, Briefcase, GraduationCap,
  Layout, Fingerprint, Rocket, Swords, Code, Camera
} from 'lucide-react';
import ImageUpload from '../components/ImageUpload';
import { toast } from 'react-hot-toast';
import { useNavigate, Link } from 'react-router-dom';
import gsap from 'gsap';

const getTimelineIcon = (iconName) => {
  const icons = {
    award: Award,
    book: BookOpen,
    code: Code2,
    zap: Zap,
    activity: Activity,
    trophy: Trophy,
    star: Star,
    globe: Globe,
    cpu: Cpu,
    terminal: Terminal,
    briefcase: Briefcase,
    graduation: GraduationCap
  };
  return icons[iconName?.toLowerCase()] || Activity;
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

const ProfileCard = ({ title, value, icon: Icon, color }) => (
  <div className="glass-panel p-6 flex flex-col gap-4 border-black/5 dark:border-white/5 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
    <div className={`absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity`}>
      <Icon className="w-16 h-16" />
    </div>
    <div className={`w-10 h-10 rounded-xl bg-${color}-500/10 flex items-center justify-center text-${color}-600 dark:text-${color}-400`}>
      <Icon className="w-5 h-5" />
    </div>
    <div className="flex flex-col">
      <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{value}</span>
      <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">{title}</span>
    </div>
  </div>
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
    milestones: 0,
    hoursLearned: 0,
    streak: 0
  });
  const [fetchingStats, setFetchingStats] = useState(true);
  const [activities, setActivities] = useState([]);
  const [fetchingActivities, setFetchingActivities] = useState(true);
  const [applications, setApplications] = useState([]);
  const [fetchingApps, setFetchingApps] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

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
        await checkUserLoggedIn();
        setIsEditing(false);
      }
    } catch (err) {
      console.error('Update failed:', err);
    } finally {
      setUpdating(false);
    }
  };

  const handleAvatarUpdate = async (url) => {
    const uploadToast = toast.loading('Syncing your new look...');
    try {
      const { data } = await axios.put('/api/users/profile', { avatar: url });
      if (data.success) {
        toast.success('Looking sharp! Profile updated.', { id: uploadToast });
        window.location.reload();
      }
    } catch (error) {
      toast.error('Sync failed. Try again.', { id: uploadToast });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, activitiesRes, appsRes] = await Promise.all([
          axios.get('/api/users/profile/stats'),
          axios.get('/api/users/profile/activities'),
          axios.get('/api/domains/my-applications')
        ]);
        if (statsRes.data.success) setStatsData(prev => ({ ...prev, ...statsRes.data.stats }));
        if (activitiesRes.data.success) setActivities(activitiesRes.data.activities);
        if (appsRes.data.success) setApplications(appsRes.data.applications);
      } catch (err) {
        console.error('Error fetching profile data:', err);
      } finally {
        setFetchingStats(false);
        setFetchingActivities(false);
        setFetchingApps(false);
      }
    };

    if (user) fetchData();
  }, [user]);

  useEffect(() => {
    if (!loading) {
      if (!user) navigate('/auth');
      else if (!user.profileComplete) navigate('/profile/complete');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    window.scrollTo(0, 0);
    const ctx = gsap.context(() => {
      gsap.fromTo('.profile-reveal', 
        { y: 40, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          duration: 1, 
          stagger: 0.1, 
          ease: 'power4.out',
          clearProps: 'all' // Crucial for visibility after animation
        }
      );
    });
    return () => ctx.revert();
  }, [isEditing, activeTab]); // Re-run on tab change too

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-emerald-500/20 rounded-full" />
          <div className="absolute inset-0 w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  const getRankColor = (rank) => {
    const colors = {
      'Rookie': 'slate',
      'Builder': 'emerald',
      'Core Member': 'blue',
      'Elite': 'purple',
      'Legend': 'amber'
    };
    return colors[rank] || 'emerald';
  };

  const getRankProgress = () => {
    const xp = user.xp || 0;
    if (xp >= 1000) return 100;
    if (xp >= 500) return ((xp - 500) / 500) * 100;
    if (xp >= 200) return ((xp - 200) / 300) * 100;
    if (xp >= 50) return ((xp - 50) / 150) * 100;
    return (xp / 50) * 100;
  };

  return (
    <div className="min-h-screen pt-24 md:pt-32 pb-24 px-4 sm:px-6 relative overflow-hidden bg-slate-50/50 dark:bg-slate-950 transition-colors duration-500">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-emerald-500/5 to-transparent pointer-events-none" />
      <div className="absolute top-40 right-[10%] w-72 h-72 bg-emerald-500/10 rounded-full blur-[100px] animate-pulse pointer-events-none opacity-40 md:opacity-100" />
      <div className="absolute bottom-40 left-[10%] w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] animate-pulse pointer-events-none opacity-40 md:opacity-100" />

      <div className="max-w-7xl mx-auto flex flex-col gap-10 md:gap-12 relative z-10">
        
        {/* HEADER SECTION - PREMIUM CARD */}
        <div className="profile-reveal glass-panel p-6 md:p-12 rounded-[2.5rem] border-black/5 dark:border-white/10 flex flex-col lg:flex-row gap-8 md:gap-10 items-center lg:items-start relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full -mr-16 -mt-16 blur-3xl" />
          
          {/* Avatar Area */}
          <div className="relative group shrink-0">
            <div className="absolute -inset-1.5 bg-gradient-to-tr from-emerald-500 to-cyan-400 rounded-[2.8rem] blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
            <div className="relative w-36 h-36 md:w-52 md:h-52 rounded-[2.5rem] bg-white dark:bg-slate-900 border-4 border-white dark:border-slate-800 overflow-hidden shadow-2xl">
              <ImageUpload 
                value={user.avatar} 
                onChange={handleAvatarUpdate}
                label={null}
                className="w-full h-full !gap-0"
              />
            </div>
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-emerald-500 text-white rounded-full text-[9px] font-black tracking-widest shadow-xl border-2 border-white dark:border-slate-900 uppercase whitespace-nowrap">
              {user.rank}
            </div>
          </div>

          {/* User Info & Actions */}
          <div className="flex-1 flex flex-col gap-5 md:gap-6 w-full">
            <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-4 md:gap-6">
              <div className="text-center md:text-left space-y-2">
                <div className="flex items-center gap-3 justify-center md:justify-start flex-wrap">
                  <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white uppercase leading-none">
                    {user.name}
                  </h1>
                  {user.role === 'admin' && (
                    <span className="px-2 py-1 bg-red-500 text-white text-[8px] font-black rounded uppercase tracking-widest">ADMIN</span>
                  )}
                </div>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 md:gap-4">
                  <span className="text-emerald-600 dark:text-emerald-500 font-black text-xs tracking-widest uppercase">@{user.username || user.name.split(' ')[0].toLowerCase()}</span>
                  <div className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />
                  <span className="text-slate-600 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">{user.department} • {user.year} YEAR</span>
                </div>
              </div>

              <div className="flex gap-3 shrink-0">
                <button 
                  onClick={() => setIsEditing(!isEditing)}
                  className="px-6 py-3 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl"
                >
                  {isEditing ? 'CANCEL' : 'MODIFY BIO'}
                </button>
                <button onClick={logout} className="p-3 rounded-2xl bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white transition-all shadow-lg">
                   <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>

            <p className="text-sm md:text-base font-medium text-slate-600 dark:text-slate-400 leading-relaxed max-w-3xl text-center md:text-left">
              {user.bio || "Crafting the digital future, one line of code at a time. Part of the elite GCC developer core."}
            </p>

            <div className="h-px bg-black/5 dark:bg-white/5 w-full" />

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 md:gap-4">
               <div className="flex items-center gap-2.5 px-3 md:px-4 py-2 bg-white dark:bg-white/5 rounded-xl border border-black/5 dark:border-white/5 shadow-sm">
                  <Fingerprint className="w-4 h-4 text-emerald-500" />
                  <span className="text-[10px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest">ID: {user.usn || 'PENDING'}</span>
               </div>
               <div className="flex items-center gap-2.5 px-3 md:px-4 py-2 bg-white dark:bg-white/5 rounded-xl border border-black/5 dark:border-white/5 shadow-sm">
                  <Calendar className="w-4 h-4 text-emerald-500" />
                  <span className="text-[10px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest">JOINED {new Date(user.createdAt).getFullYear()}</span>
               </div>
               <div className="flex items-center gap-2.5 px-3 md:px-4 py-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20 shadow-sm">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-500 uppercase tracking-widest">Verified GCC Elite</span>
               </div>
            </div>
          </div>
        </div>

        {isEditing ? (
          /* EDITING INTERFACE */
          <div className="profile-reveal glass-panel p-8 md:p-12 rounded-[2.5rem] border-emerald-500/20 shadow-2xl bg-white dark:bg-slate-900">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase mb-8 flex items-center gap-3">
              <Settings className="w-6 h-6 text-emerald-500" /> Neural Link Update
            </h2>
            <form onSubmit={handleUpdate} className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Identity Tag</label>
                  <input 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-black/5 dark:border-white/5 focus:border-emerald-500 outline-none transition-all font-bold text-sm text-slate-900 dark:text-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">USN Registration</label>
                  <input 
                    value={formData.usn}
                    onChange={(e) => setFormData({...formData, usn: e.target.value})}
                    className="w-full p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-black/5 dark:border-white/5 focus:border-emerald-500 outline-none transition-all font-bold text-sm uppercase text-slate-900 dark:text-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Core Bio</label>
                  <textarea 
                    rows="4"
                    value={formData.bio}
                    onChange={(e) => setFormData({...formData, bio: e.target.value})}
                    className="w-full p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-black/5 dark:border-white/5 focus:border-emerald-500 outline-none transition-all font-medium text-sm resize-none text-slate-900 dark:text-white"
                  />
                </div>
              </div>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Skill Matrix (Comma Separated)</label>
                  <input 
                    value={formData.skills}
                    onChange={(e) => setFormData({...formData, skills: e.target.value})}
                    className="w-full p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-black/5 dark:border-white/5 focus:border-emerald-500 outline-none transition-all font-bold text-sm text-slate-900 dark:text-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">GitHub Username</label>
                  <input 
                    value={formData.githubUrl}
                    onChange={(e) => setFormData({...formData, githubUrl: e.target.value})}
                    className="w-full p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-black/5 dark:border-white/5 focus:border-emerald-500 outline-none transition-all font-bold text-sm text-slate-900 dark:text-white"
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={updating}
                  className="w-full py-5 bg-emerald-500 text-white rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-xl shadow-emerald-500/30 hover:scale-[1.02] active:scale-95 transition-all mt-4"
                >
                  {updating ? 'SYNCING...' : 'UPDATE SYSTEM DATA'}
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* MAIN DASHBOARD INTERFACE */
          <div className="grid lg:grid-cols-12 gap-8 md:gap-10">
            
            {/* Left Column: Stats & Skills */}
            <div className="lg:col-span-4 flex flex-col gap-6 md:gap-8">
              
              {/* Progress Summary */}
              <div className="profile-reveal glass-panel p-8 rounded-[2.5rem] border-black/5 dark:border-white/10 space-y-6 bg-white dark:bg-slate-900">
                <div className="flex justify-between items-end">
                   <div className="flex flex-col gap-1">
                      <span className="text-3xl font-black text-slate-900 dark:text-white leading-none">{user.xp || 0}</span>
                      <span className="text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Total XP Accumulated</span>
                   </div>
                   <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                      <Zap className="w-5 h-5 fill-current" />
                   </div>
                </div>
                <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5 border border-black/5 dark:border-white/5">
                   <motion.div 
                     initial={{ width: 0 }}
                     animate={{ width: `${getRankProgress()}%` }}
                     transition={{ duration: 1.5, ease: 'power4.out' }}
                     className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 rounded-full" 
                   />
                </div>
                <div className="flex justify-between items-center text-[8px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                   <span>{user.rank}</span>
                   <span>Top 5% Global</span>
                </div>
              </div>

              {/* Quick Stats Grid */}
              <div className="profile-reveal grid grid-cols-2 gap-4">
                <ProfileCard title="Events Joined" value={statsData.eventCount} icon={Rocket} color="blue" />
                <ProfileCard title="Quiz Arena" value={statsData.quizCount} icon={Swords} color="purple" />
                <ProfileCard title="Milestones" value={statsData.milestones || 5} icon={Award} color="amber" />
                <ProfileCard title="Streak" value={statsData.streak || 3} icon={Activity} color="rose" />
              </div>

              {/* Skills Matrix */}
              <div className="profile-reveal glass-panel p-8 rounded-[2.5rem] border-black/5 dark:border-white/10 space-y-6 bg-white dark:bg-slate-900">
                <h3 className="text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-[0.2em] flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-emerald-500" /> Skill Matrix
                </h3>
                <div className="flex flex-wrap gap-2">
                  {(user.skills?.length > 0 ? user.skills : ['React', 'Node.js', 'Python', 'Web3', 'System Design']).map((skill, i) => (
                    <span key={i} className="px-3 py-1.5 bg-slate-50 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-xl text-[10px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider shadow-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Achievements Corner */}
              <div className="profile-reveal glass-panel p-8 rounded-[2.5rem] border-black/5 dark:border-white/10 space-y-6 relative overflow-hidden group bg-white dark:bg-slate-900">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-125 transition-transform duration-1000">
                  <Trophy className="w-32 h-32 text-amber-500" />
                </div>
                <h3 className="text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-[0.2em] flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-amber-500" /> Top Badges
                </h3>
                <div className="flex gap-4">
                   {[1, 2, 3].map(i => (
                     <div key={i} className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20 relative group/badge shadow-sm">
                        <Award className="w-7 h-7 text-amber-500 group-hover/badge:scale-110 transition-transform" />
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900 flex items-center justify-center">
                           <Check className="w-2 h-2 text-white" />
                        </div>
                     </div>
                   ))}
                </div>
              </div>
            </div>

            {/* Right Column: Activity & Navigation */}
            <div className="lg:col-span-8 flex flex-col gap-8">
                             {/* Active Nodes: Data-Driven Redesign */}
               <div className="profile-reveal flex flex-col gap-10">
                  
                  {/* Events Sector */}
                  <div className="flex flex-col gap-6">
                    <div className="flex items-center justify-between px-2">
                       <div className="flex flex-col gap-1">
                          <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none">
                            Joined <span className="text-emerald-500">Events</span>
                          </h2>
                          <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Active Transmissions</span>
                       </div>
                       <Link to="/events" className="text-[9px] font-black text-emerald-500 uppercase tracking-widest hover:translate-x-1 transition-transform flex items-center gap-2">
                          Join More <ArrowRight className="w-3.5 h-3.5" />
                       </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                       {fetchingActivities ? (
                         Array(2).fill(0).map((_, i) => <div key={i} className="h-32 bg-slate-50 dark:bg-white/5 animate-pulse rounded-3xl" />)
                       ) : activities.filter(a => a.type === 'EVENT').length === 0 ? (
                         <div className="col-span-full p-12 glass-panel border-dashed border-slate-300 dark:border-slate-800 flex flex-col items-center justify-center gap-4 opacity-40">
                            <Zap className="w-10 h-10 text-slate-400" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-center">No event registrations detected</span>
                         </div>
                       ) : (
                         activities.filter(a => a.type === 'EVENT').slice(0, 4).map((event, idx) => (
                           <Link 
                             key={idx} 
                             to={`/event/${event.referenceId}`}
                             className="glass-panel p-6 flex items-center gap-5 group hover:border-emerald-500/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
                           >
                              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0">
                                 <Calendar className="w-7 h-7" />
                              </div>
                              <div className="flex-1 flex flex-col gap-1">
                                 <div className="flex items-center justify-between">
                                    <span className="text-[8px] font-black text-emerald-600 dark:text-emerald-500 uppercase tracking-widest">Confirmed</span>
                                    <span className="text-[8px] font-bold text-slate-400 uppercase">{formatDate(event.date)}</span>
                                 </div>
                                 <h4 className="text-base font-black text-slate-900 dark:text-white uppercase leading-tight line-clamp-1">{event.title}</h4>
                                 <p className="text-[10px] text-slate-500 font-medium truncate">{event.desc || 'Registered for GCC elite event'}</p>
                              </div>
                           </Link>
                         ))
                       )}
                    </div>
                  </div>

                  {/* Domains Sector */}
                  <div className="flex flex-col gap-6">
                    <div className="flex items-center justify-between px-2">
                       <div className="flex flex-col gap-1">
                          <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none">
                            Domain <span className="text-cyan-500">Status</span>
                          </h2>
                          <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Neural Link Applications</span>
                       </div>
                       <Link to="/domains" className="text-[9px] font-black text-cyan-500 uppercase tracking-widest hover:translate-x-1 transition-transform flex items-center gap-2">
                          Apply Domain <ArrowRight className="w-3.5 h-3.5" />
                       </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                       {fetchingApps ? (
                         Array(2).fill(0).map((_, i) => <div key={i} className="h-32 bg-slate-50 dark:bg-white/5 animate-pulse rounded-3xl" />)
                       ) : applications.length === 0 ? (
                         <div className="col-span-full p-12 glass-panel border-dashed border-slate-300 dark:border-slate-800 flex flex-col items-center justify-center gap-4 opacity-40">
                            <Rocket className="w-10 h-10 text-slate-400" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-center">No active domain applications</span>
                         </div>
                       ) : (
                         applications.map((app, idx) => (
                           <Link 
                             key={idx} 
                             to={`/domain/${app.domain?._id}`}
                             className="glass-panel p-6 flex items-center gap-5 group hover:border-cyan-500/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
                           >
                              <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-cyan-500 shrink-0">
                                 <Rocket className="w-7 h-7" />
                              </div>
                              <div className="flex-1 flex flex-col gap-1">
                                 <div className="flex items-center justify-between">
                                    <div className={`px-2 py-0.5 rounded-md text-[7px] font-black uppercase tracking-widest border ${
                                      app.status === 'approved' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                                      app.status === 'rejected' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                                      'bg-amber-500/10 text-amber-500 border-amber-500/20'
                                    }`}>
                                      {app.status}
                                    </div>
                                    <span className="text-[8px] font-bold text-slate-400 uppercase">Score: {app.testScore}/{app.totalQuestions}</span>
                                 </div>
                                 <h4 className="text-base font-black text-slate-900 dark:text-white uppercase leading-tight line-clamp-1">{app.domain?.title}</h4>
                                 <p className="text-[10px] text-slate-500 font-medium uppercase tracking-tighter">Applied on {formatDate(app.createdAt)}</p>
                              </div>
                           </Link>
                         ))
                       )}
                    </div>
                  </div>

               </div>

               {/* Growth Tracker */}
               <div className="profile-reveal p-10 md:p-14 rounded-[3rem] bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white relative overflow-hidden group shadow-2xl">
                  <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:scale-125 transition-transform duration-1000">
                     <Code className="w-40 h-40 text-emerald-500" />
                  </div>
                  <div className="relative z-10 space-y-8">
                     <div className="space-y-3">
                        <h3 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter leading-none">
                          Club Performance <span className="text-emerald-500">Node</span>
                        </h3>
                        <p className="text-slate-400 text-sm max-w-xl leading-relaxed">
                          Your current standing in the GAT Coding Club ecosystem is exceptional. You are currently within the top percentile of active members this semester.
                        </p>
                     </div>
                     <div className="flex flex-wrap gap-6">
                        <div className="flex flex-col gap-1">
                           <span className="text-3xl font-black text-white">#12</span>
                           <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Global Rank</span>
                        </div>
                        <div className="w-px h-12 bg-white/10 hidden sm:block" />
                        <div className="flex flex-col gap-1">
                           <span className="text-3xl font-black text-white">92%</span>
                           <span className="text-[9px] font-black text-cyan-400 uppercase tracking-widest">Skill Growth</span>
                        </div>
                        <div className="w-px h-12 bg-white/10 hidden sm:block" />
                        <div className="flex flex-col gap-1">
                           <span className="text-3xl font-black text-white">42h</span>
                           <span className="text-[9px] font-black text-purple-400 uppercase tracking-widest">Arena Time</span>
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

const Check = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M20 6 9 17l-5-5"/></svg>
);
