import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Globe, MapPin, Calendar, Award, Zap, 
  Users, MessageSquare, Plus, Check,
  Terminal, Code, Cpu, Shield, Globe as WebIcon, Smartphone,
  Activity, Star, ExternalLink, Share2
} from 'lucide-react';
import { Github, Linkedin, Instagram } from '../components/Icons';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Magnetic from '../components/Magnetic';

export default function PublicProfile() {
  const { id } = useParams();
  const { user: currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchProfile();
  }, [id]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/users/profile/${id}`);
      if (res.data.success) {
        setProfile(res.data.user);
        setIsFollowing(res.data.user.followers?.includes(currentUser?._id));
      }
    } catch (err) {
      console.error('Failed to fetch profile', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async () => {
    if (!currentUser) return;
    try {
      const res = await axios.post(`/api/users/follow/${id}`);
      if (res.data.success) {
        setIsFollowing(!isFollowing);
        setProfile(prev => ({
          ...prev,
          followers: isFollowing 
            ? (prev.followers || []).filter(fid => fid !== currentUser._id)
            : [...(prev.followers || []), currentUser._id]
        }));
      }
    } catch (err) {
      console.error('Follow action failed');
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-white dark:bg-slate-950 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Syncing Profile Data...</span>
      </div>
    </div>
  );

  if (!profile) return (
    <div className="min-h-screen bg-white dark:bg-slate-950 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-black text-slate-900 dark:text-white uppercase">Profile Not Found</h1>
        <Link to="/" className="text-emerald-500 font-bold mt-4 inline-block">Return to Command Center</Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 pt-24 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* HERO SECTION */}
        <div className="relative mb-8">
           {/* Cinematic Backdrop */}
           <div className="h-[250px] md:h-[300px] w-full bg-slate-900 rounded-[2.5rem] overflow-hidden relative border border-white/5 shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 via-transparent to-purple-500/10" />
              <div className="absolute inset-0 opacity-20 technical-grid" />
           </div>

           {/* Profile Header Card */}
           <div className="relative -mt-24 md:-mt-32 px-6 md:px-12 flex flex-col md:flex-row items-end gap-6 md:gap-10">
              {/* Avatar */}
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-cyan-400 rounded-[2rem] blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative w-40 h-40 md:w-48 md:h-48 rounded-[2rem] bg-white dark:bg-slate-900 p-2 border border-white/10 overflow-hidden shadow-2xl">
                   {profile.avatar ? (
                     <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover rounded-[1.5rem]" />
                   ) : (
                     <div className="w-full h-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center rounded-[1.5rem]">
                        <Users className="w-12 h-12 text-slate-400" />
                     </div>
                   )}
                </div>
                {/* Rank Badge Overlay */}
                <div className="absolute -bottom-2 -right-2 px-4 py-1.5 bg-emerald-500 text-white text-[10px] font-black uppercase rounded-full shadow-xl border-2 border-white dark:border-slate-900 z-10">
                  {profile.rank}
                </div>
              </div>

              {/* Identity Info */}
              <div className="flex-1 pb-4">
                 <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between w-full">
                    <div>
                      <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic">{profile.name}</h1>
                      <div className="flex flex-wrap items-center gap-4 mt-2 text-slate-500 dark:text-slate-400 font-bold text-xs uppercase tracking-widest">
                         {profile.usn && <span className="flex items-center gap-1.5"><Terminal className="w-3.5 h-3.5 text-emerald-500" /> {profile.usn}</span>}
                         {profile.department && <span className="flex items-center gap-1.5"><Cpu className="w-3.5 h-3.5 text-emerald-500" /> {profile.department}</span>}
                         <span className="flex items-center gap-1.5"><Award className="w-3.5 h-3.5 text-emerald-500" /> {profile.xp} XP</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                       <Magnetic strength={0.2}>
                          <button 
                            onClick={handleFollow}
                            className={`px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-2 ${
                              isFollowing 
                                ? 'bg-slate-100 dark:bg-white/5 text-slate-900 dark:text-white' 
                                : 'bg-emerald-500 text-white shadow-[0_15px_30px_rgba(16,185,129,0.2)]'
                            }`}
                          >
                            {isFollowing ? <><Check className="w-4 h-4" /> FOLLOWING</> : <><Plus className="w-4 h-4" /> FOLLOW</>}
                          </button>
                       </Magnetic>
                       <Magnetic strength={0.2}>
                          <button className="p-4 rounded-2xl bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 text-slate-900 dark:text-white shadow-xl">
                             <Share2 className="w-4 h-4" />
                          </button>
                       </Magnetic>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-12">
           {/* LEFT COLUMN - STATS & ABOUT */}
           <div className="lg:col-span-4 flex flex-col gap-6">
              {/* Reputation & Bio */}
              <div className="p-8 bg-slate-50 dark:bg-white/5 rounded-[2.5rem] border border-black/5 dark:border-white/10">
                 <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em] block mb-4">Neural Profile</span>
                 <p className="text-slate-600 dark:text-slate-300 text-xs font-medium leading-relaxed mb-6">
                    {profile.bio || "This elite developer hasn't synchronized their neural bio yet."}
                 </p>
                 
                 <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between p-4 bg-white dark:bg-black/20 rounded-2xl border border-black/5 dark:border-white/5">
                       <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                             <Zap className="text-emerald-500 w-4 h-4" />
                          </div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Trust Score</span>
                       </div>
                       <span className="text-sm font-black text-slate-900 dark:text-white">{profile.trustScore || 0}%</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-white dark:bg-black/20 rounded-2xl border border-black/5 dark:border-white/5">
                       <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
                             <Activity className="text-orange-500 w-4 h-4" />
                          </div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Streak</span>
                       </div>
                       <span className="text-sm font-black text-slate-900 dark:text-white">{profile.streak || 0} Days</span>
                    </div>
                 </div>

                 {/* Social Links */}
                 <div className="flex items-center gap-2 mt-8">
                    {profile.githubUrl && (
                      <a href={profile.githubUrl} className="p-3 rounded-xl bg-white dark:bg-black/20 border border-black/5 dark:border-white/5 text-slate-600 dark:text-slate-400 hover:text-emerald-500 transition-all">
                        <Github className="w-4 h-4" />
                      </a>
                    )}
                    {profile.linkedinUrl && (
                      <a href={profile.linkedinUrl} className="p-3 rounded-xl bg-white dark:bg-black/20 border border-black/5 dark:border-white/5 text-slate-600 dark:text-slate-400 hover:text-emerald-500 transition-all">
                        <Linkedin className="w-4 h-4" />
                      </a>
                    )}
                    {profile.portfolioUrl && (
                      <a href={profile.portfolioUrl} className="p-3 rounded-xl bg-white dark:bg-black/20 border border-black/5 dark:border-white/5 text-slate-600 dark:text-slate-400 hover:text-emerald-500 transition-all">
                        <Globe className="w-4 h-4" />
                      </a>
                    )}
                 </div>
              </div>

              {/* Skill Matrix */}
              <div className="p-8 bg-slate-50 dark:bg-white/5 rounded-[2.5rem] border border-black/5 dark:border-white/10">
                 <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em] block mb-6">Skill Matrix</span>
                 <div className="flex flex-col gap-5">
                    {[
                      { label: 'Web Development', val: profile.skillMatrix?.web || 0, icon: <WebIcon /> },
                      { label: 'AI / Machine Learning', val: profile.skillMatrix?.ai || 0, icon: <Cpu /> },
                      { label: 'Cyber Security', val: profile.skillMatrix?.cyber || 0, icon: <Shield /> },
                      { label: 'DSA / Competitive', val: profile.skillMatrix?.dsa || 0, icon: <Code /> },
                      { label: 'Cloud / DevOps', val: profile.skillMatrix?.cloud || 0, icon: <Globe /> },
                    ].map((skill, i) => (
                      <div key={i} className="flex flex-col gap-2">
                         <div className="flex items-center justify-between text-[9px] font-black text-slate-400 uppercase tracking-widest">
                            <span className="flex items-center gap-2">
                               {React.cloneElement(skill.icon, { className: "w-3 h-3 text-emerald-500" })}
                               {skill.label}
                            </span>
                            <span className="text-slate-900 dark:text-white">{skill.val}%</span>
                         </div>
                         <div className="w-full h-1.5 bg-slate-200 dark:bg-white/5 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${skill.val}%` }}
                              className="h-full bg-emerald-500 rounded-full"
                            />
                         </div>
                      </div>
                    ))}
                 </div>
              </div>
           </div>

           {/* RIGHT COLUMN - CONTENT TABS */}
           <div className="lg:col-span-8">
              {/* Tab Navigation */}
              <div className="flex items-center gap-8 mb-8 border-b border-black/5 dark:border-white/5 overflow-x-auto pb-1 custom-scrollbar">
                 {['overview', 'projects', 'discussions', 'achievements'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`pb-4 text-[10px] font-black uppercase tracking-[0.3em] relative transition-all whitespace-nowrap ${
                        activeTab === tab ? 'text-emerald-500' : 'text-slate-400 hover:text-slate-600'
                      }`}
                    >
                      {tab}
                      {activeTab === tab && (
                        <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500" />
                      )}
                    </button>
                 ))}
              </div>

              {/* Tab Content */}
              <div className="min-h-[400px]">
                 {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       {/* Featured Badges */}
                       <div className="col-span-full mb-4">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] block mb-6">Distinguished Badges</span>
                          <div className="flex flex-wrap gap-4">
                             {profile.badges?.length > 0 ? profile.badges.map((badge, i) => (
                               <div key={i} className="flex items-center gap-3 px-5 py-3 bg-white dark:bg-white/5 rounded-2xl border border-black/5 dark:border-white/5">
                                  <div className="text-2xl">{badge.icon || "🏆"}</div>
                                  <span className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest">{badge.name}</span>
                               </div>
                             )) : (
                               <div className="text-xs font-bold text-slate-400 italic">No badges awarded yet.</div>
                             )}
                          </div>
                       </div>

                       {/* Recent Activity Mock (To be real later) */}
                       <div className="p-8 bg-slate-50 dark:bg-white/5 rounded-[2.5rem] border border-black/5 dark:border-white/10">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] block mb-6">Recent Deployments</span>
                          <div className="flex flex-col gap-4">
                             {[1,2,3].map(i => (
                               <div key={i} className="flex items-start gap-4">
                                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                                  <div className="flex flex-col gap-1">
                                     <span className="text-xs font-bold text-slate-900 dark:text-white">Completed registration for "Elite Hackathon 2024"</span>
                                     <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">2 Days Ago</span>
                                  </div>
                               </div>
                             ))}
                          </div>
                       </div>
                    </div>
                 )}

                 {activeTab === 'projects' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       {profile.projects?.length > 0 ? profile.projects.map((project, i) => (
                          <div key={i} className="group relative bg-white dark:bg-white/5 rounded-[2.5rem] border border-black/5 dark:border-white/10 overflow-hidden shadow-xl hover:scale-[1.02] transition-all duration-500">
                             <div className="h-40 bg-slate-100 dark:bg-slate-900 relative overflow-hidden">
                                {project.thumbnail ? (
                                  <img src={project.thumbnail} alt={project.title} className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center opacity-20">
                                     <Terminal className="w-16 h-16" />
                                  </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                                   <div className="flex items-center gap-3">
                                      <a href={project.githubLink} className="p-2 rounded-lg bg-white/20 backdrop-blur-md text-white hover:bg-white/40 transition-all"><Github className="w-4 h-4" /></a>
                                      <a href={project.link} className="p-2 rounded-lg bg-white/20 backdrop-blur-md text-white hover:bg-white/40 transition-all"><ExternalLink className="w-4 h-4" /></a>
                                   </div>
                                </div>
                             </div>
                             <div className="p-8">
                                <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase italic">{project.title}</h3>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium line-clamp-2 mt-2 leading-relaxed">
                                   {project.description}
                                </p>
                                <div className="flex flex-wrap gap-2 mt-4">
                                   {project.tags?.map((tag, j) => (
                                     <span key={j} className="px-3 py-1 bg-slate-100 dark:bg-white/5 rounded-full text-[8px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">{tag}</span>
                                   ))}
                                </div>
                             </div>
                          </div>
                       )) : (
                          <div className="col-span-full py-20 text-center flex flex-col items-center">
                             <div className="w-16 h-16 bg-slate-50 dark:bg-white/5 rounded-full flex items-center justify-center mb-4">
                                <Code className="w-6 h-6 text-slate-400" />
                             </div>
                             <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">No projects deployed to this sector yet.</span>
                          </div>
                       )}
                    </div>
                 )}

                 {/* Other tabs follow similar logic... */}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
