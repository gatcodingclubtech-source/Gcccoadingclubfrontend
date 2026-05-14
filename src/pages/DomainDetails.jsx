import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, BookOpen, Users, Code, Sparkles, 
  Terminal as TerminalIcon, Layers, Shield, Globe, 
  ChevronRight, Zap, Target, Star, Brain, CheckCircle2
} from 'lucide-react';
import axios from 'axios';

const IconMap = {
  Code: <Code />,
  Sparkles: <Sparkles />,
  Terminal: <TerminalIcon />,
  Layers: <Layers />,
  Shield: <Shield />,
  Globe: <Globe />
};

export default function DomainDetails() {
  const { id } = useParams();
  const [domain, setDomain] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchDomain();
  }, [id]);

  const fetchDomain = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await axios.get(`/api/domains/${id}`);
      if (res.data.success) {
        setDomain(res.data.domain);
      } else {
        setError(true);
      }
    } catch (err) {
      console.error('Error fetching domain', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Syncing Data...</span>
        </div>
      </div>
    );
  }

  if (error || !domain) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-black p-6">
        <div className="flex flex-col gap-6 text-center items-center max-w-md">
          <div className="w-20 h-20 rounded-3xl bg-red-500/10 flex items-center justify-center text-red-500">
             <AlertTriangle className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Domain Not Found</h1>
          <p className="text-sm text-slate-500 font-medium leading-relaxed">The technical domain you are looking for does not exist or has been moved. Check the URL or return to the hub.</p>
          <Link to="/" className="px-10 py-4 rounded-xl bg-emerald-500 text-white font-black hover:scale-105 transition-transform shadow-xl uppercase tracking-widest text-[10px]">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  const getColorClasses = (colorName) => {
    const map = {
      blue: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
      purple: 'text-purple-500 bg-purple-500/10 border-purple-500/20',
      cyan: 'text-cyan-500 bg-cyan-500/10 border-cyan-500/20',
      emerald: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
      red: 'text-red-500 bg-red-500/10 border-red-500/20',
      amber: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
    };
    return map[colorName] || map.emerald;
  };

  const colors = getColorClasses(domain.color);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black text-slate-900 dark:text-white pb-32">
      
      {/* 1. Hero Banner */}
      <div className="bg-white dark:bg-slate-950 border-b border-black/5 dark:border-white/5 pt-32 pb-16 md:pt-44 md:pb-24 px-6 relative overflow-hidden">
        {/* Decor */}
        <div className={`absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 blur-[120px] rounded-full translate-x-1/4 -translate-y-1/4 pointer-events-none`} />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col gap-8 md:gap-12">
             <Link to="/" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-emerald-500 transition-all w-fit">
                <ArrowLeft className="w-4 h-4" /> Back to Domains
             </Link>

             <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div className="flex flex-col gap-6">
                   <div className={`w-16 h-16 rounded-2xl ${colors} flex items-center justify-center`}>
                      {IconMap[domain.icon] ? React.cloneElement(IconMap[domain.icon], { className: "w-8 h-8" }) : <Layers className="w-8 h-8" />}
                   </div>
                   <h1 className="text-5xl md:text-8xl font-black tracking-tighter uppercase leading-[0.9]">
                      {domain.title}
                   </h1>
                   <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-xl">
                      {domain.desc}
                   </p>
                </div>

                <div className="flex flex-col gap-6">
                   <div className="p-8 rounded-[2.5rem] bg-slate-950 dark:bg-white text-white dark:text-slate-900 flex flex-col gap-6 shadow-2xl">
                      <div className="flex flex-col gap-1">
                         <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-50">Current Enrollment</span>
                         <h4 className="text-2xl font-black uppercase tracking-tighter">Applications Open</h4>
                      </div>
                      <Link 
                        to={`/register/domain/${domain._id}`}
                        className={`w-full py-5 rounded-xl bg-emerald-500 text-white text-[11px] font-black tracking-[0.2em] flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all uppercase shadow-lg shadow-emerald-500/20`}
                      >
                        JOIN INTEREST GROUP <ChevronRight className="w-5 h-5" />
                      </Link>
                      <p className="text-[9px] font-bold text-center opacity-40 uppercase tracking-widest">
                        Requires Admin Approval After Submission
                      </p>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* 2. Features Grid */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-3 gap-8">
           {[
             { icon: <Brain />, title: 'Advanced Logic', desc: 'Deep dive into complex algorithms and architectural patterns used in the industry.' },
             { icon: <Zap />, title: 'Real-time Build', desc: 'Work on live projects and contribute to the club\'s open-source ecosystem.' },
             { icon: <Users />, title: 'Mentorship', desc: 'Get direct guidance from core team members and experienced industry seniors.' }
           ].map((feature, i) => (
             <div key={i} className="p-10 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-black/5 dark:border-white/5 shadow-sm hover:shadow-xl transition-all duration-500">
                <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-white/5 flex items-center justify-center text-emerald-500 mb-8">
                   {feature.icon ? React.cloneElement(feature.icon, { className: "w-6 h-6" }) : <Zap className="w-6 h-6" />}
                </div>
                <h4 className="text-xl font-black uppercase tracking-tighter mb-4">{feature.title}</h4>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">{feature.desc}</p>
             </div>
           ))}
        </div>

        {/* 3. The Roadmap Section */}
        <div className="mt-20 md:mt-32">
           <div className="flex flex-col gap-4 mb-16 text-center">
              <h3 className="text-3xl md:text-5xl font-black uppercase tracking-tighter italic">What you'll master</h3>
              <div className="w-20 h-1 bg-emerald-500 mx-auto rounded-full" />
           </div>

           <div className="grid gap-6">
              {[
                { title: 'Foundational Knowledge', desc: 'Syntax, environment setup, and understanding the core ecosystem.' },
                { title: 'Project Implementation', desc: 'Building functional prototypes and mastering state management.' },
                { title: 'Advanced Scalability', desc: 'Optimizing for performance, security, and global deployment.' }
              ].map((step, i) => (
                <div key={i} className="group p-8 md:p-10 rounded-3xl bg-white dark:bg-slate-900 border border-black/5 dark:border-white/5 flex items-center gap-8 hover:border-emerald-500/30 transition-all">
                   <div className="w-14 h-14 md:w-20 md:h-20 rounded-full border-2 border-slate-100 dark:border-white/5 flex items-center justify-center shrink-0 group-hover:border-emerald-500/50 transition-colors">
                      <span className="text-xl md:text-2xl font-black text-slate-300 dark:text-white/10 group-hover:text-emerald-500/50 transition-colors">0{i+1}</span>
                   </div>
                   <div className="flex flex-col gap-2">
                      <h4 className="text-lg md:text-xl font-black uppercase tracking-tighter">{step.title}</h4>
                      <p className="text-sm text-slate-500 font-medium">{step.desc}</p>
                   </div>
                   <div className="ml-auto hidden sm:block">
                      <CheckCircle2 className="w-6 h-6 text-slate-100 dark:text-white/5 group-hover:text-emerald-500 transition-colors" />
                   </div>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
}

// Missing icon fallback
const AlertTriangle = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
);
