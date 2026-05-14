import React, { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, BookOpen, Users, PlayCircle, Code, Sparkles, Terminal as TerminalIcon, Layers, Shield, Globe, ChevronRight } from 'lucide-react';
import axios from 'axios';
import gsap from 'gsap';

const IconMap = {
  Code: <Code className="w-8 h-8" />,
  Sparkles: <Sparkles className="w-8 h-8" />,
  Terminal: <TerminalIcon className="w-8 h-8" />,
  Layers: <Layers className="w-8 h-8" />,
  Shield: <Shield className="w-8 h-8" />,
  Globe: <Globe className="w-8 h-8" />
};

export default function DomainDetails() {
  const { id } = useParams();
  const [domain, setDomain] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const containerRef = useRef(null);
  const elementsRef = useRef([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchDomain();
  }, [id]);

  const fetchDomain = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/domains/${id}`);
      if (res.data.success) {
        setDomain(res.data.domain);
      }
    } catch (err) {
      console.error('Error fetching domain', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!domain) return;

    // Reset elements
    gsap.set('.bg-watermark', { opacity: 0, scale: 0.5, rotate: -20 });
    gsap.set(elementsRef.current, { y: 50, opacity: 0 });

    const tl = gsap.timeline({ defaults: { ease: 'back.out(1.2)' } });

    tl.to('.bg-watermark', { opacity: 1, scale: 1, rotate: 0, duration: 1.5, ease: 'power3.out' })
      .to(elementsRef.current, { y: 0, opacity: 1, duration: 0.8, stagger: 0.1 }, "-=1");

    return () => tl.kill();
  }, [domain]);

  const addToRefs = (el) => {
    if (el && !elementsRef.current.includes(el)) {
      elementsRef.current.push(el);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-black">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!domain) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-black">
        <div className="flex flex-col gap-6 text-center items-center">
          <h1 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Domain Not Found</h1>
          <Link to="/" className="px-8 py-4 rounded-full bg-emerald-500 text-white font-black hover:scale-105 transition-transform shadow-xl uppercase tracking-widest text-xs">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  const getColorClasses = (colorName) => {
    const map = {
      blue: { text: 'text-blue-500', bg: 'bg-blue-500', bgLight: 'bg-blue-500/10', border: 'border-blue-500/20', gradient: 'from-blue-600 to-cyan-500' },
      purple: { text: 'text-purple-500', bg: 'bg-purple-500', bgLight: 'bg-purple-500/10', border: 'border-purple-500/20', gradient: 'from-purple-600 to-pink-500' },
      cyan: { text: 'text-cyan-500', bg: 'bg-cyan-500', bgLight: 'bg-cyan-500/10', border: 'border-cyan-500/20', gradient: 'from-cyan-500 to-emerald-500' },
      emerald: { text: 'text-emerald-500', bg: 'bg-emerald-500', bgLight: 'bg-emerald-500/10', border: 'border-emerald-500/20', gradient: 'from-emerald-500 to-teal-400' },
      red: { text: 'text-red-500', bg: 'bg-red-500', bgLight: 'bg-red-500/10', border: 'border-red-500/20', gradient: 'from-red-600 to-orange-500' },
      amber: { text: 'text-amber-500', bg: 'bg-amber-500', bgLight: 'bg-amber-500/10', border: 'border-amber-500/20', gradient: 'from-amber-500 to-yellow-400' },
    };
    return map[colorName] || map.emerald;
  };

  const themeColors = getColorClasses(domain.color);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black relative overflow-hidden selection:bg-slate-900 selection:text-white dark:selection:bg-white dark:selection:text-slate-900" ref={containerRef}>
      
      {/* Massive Background Watermark */}
      <div className={`bg-watermark absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/4 ${themeColors.text} opacity-5 dark:opacity-10 pointer-events-none select-none blur-sm`}>
        {React.cloneElement(IconMap[domain.icon] || <Layers />, { className: "w-[800px] h-[800px]" })}
      </div>

      <div className="relative z-10 pt-32 pb-24 px-6 max-w-6xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 w-12 h-12 rounded-full bg-white dark:bg-slate-900 shadow-xl border border-black/5 dark:border-white/5 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-all justify-center group mb-12 relative z-20">
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        </Link>
        
        <div className="grid lg:grid-cols-12 gap-16 lg:gap-24 items-center">
          
          {/* Left Column: Title & Description */}
          <div className="lg:col-span-7 flex flex-col gap-8 relative z-20">
            <div ref={addToRefs} className="flex items-center gap-4">
              <div className={`w-16 h-16 rounded-2xl ${themeColors.bgLight} flex items-center justify-center ${themeColors.text} shadow-xl shadow-${domain.color}-500/20`}>
                {IconMap[domain.icon] || <Layers className="w-8 h-8" />}
              </div>
              <span className="text-xs font-black tracking-[0.3em] text-slate-400 uppercase">Domain Overview</span>
            </div>
            
            <h1 ref={addToRefs} className="text-5xl md:text-7xl font-black tracking-tighter leading-[1.1] text-slate-900 dark:text-white uppercase">
              <span className={`bg-clip-text text-transparent bg-gradient-to-r ${themeColors.gradient}`}>
                {domain.title}
              </span>
            </h1>
            
            <p ref={addToRefs} className="text-lg md:text-xl font-medium text-slate-600 dark:text-slate-400 leading-relaxed border-l-4 border-slate-200 dark:border-slate-800 pl-6 py-2 max-w-2xl">
              {domain.desc}
            </p>

            <div ref={addToRefs} className="flex flex-wrap gap-4 mt-4">
              <Link to={`/register/domain/${domain.slug}`} className={`px-10 py-5 rounded-full bg-gradient-to-r ${themeColors.gradient} text-white text-sm font-black tracking-widest hover:scale-105 transition-transform shadow-xl flex items-center gap-2 uppercase`}>
                JOIN {domain.title} <ChevronRight className="w-4 h-4" />
              </Link>
              <button className="px-10 py-5 rounded-full bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm font-black tracking-widest border border-black/10 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-2 shadow-xl uppercase">
                <PlayCircle className="w-4 h-4" /> WATCH INTRO
              </button>
            </div>
          </div>

          {/* Right Column: Floating Cards */}
          <div className="lg:col-span-5 flex flex-col gap-6 relative z-20">
            
            {/* Card 1 */}
            <div ref={addToRefs} className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/50 dark:border-white/10 p-8 rounded-[2rem] shadow-2xl hover:-translate-y-2 transition-transform duration-500">
              <div className={`w-12 h-12 rounded-xl ${themeColors.bgLight} ${themeColors.text} flex items-center justify-center mb-6`}>
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4 uppercase tracking-tighter">What You'll Learn</h3>
              <ul className="flex flex-col gap-3 text-sm font-medium text-slate-600 dark:text-slate-400">
                <li className="flex items-start gap-3">
                  <div className={`mt-1 w-1.5 h-1.5 rounded-full ${themeColors.bg}`}></div>
                  Industry-standard tools and frameworks
                </li>
                <li className="flex items-start gap-3">
                  <div className={`mt-1 w-1.5 h-1.5 rounded-full ${themeColors.bg}`}></div>
                  Hands-on project building from scratch
                </li>
                <li className="flex items-start gap-3">
                  <div className={`mt-1 w-1.5 h-1.5 rounded-full ${themeColors.bg}`}></div>
                  Best practices for scalable architecture
                </li>
              </ul>
            </div>

            {/* Card 2 */}
            <div ref={addToRefs} className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 p-8 rounded-[2rem] shadow-2xl hover:-translate-y-2 transition-transform duration-500 ml-0 md:ml-12 mt-0 md:-mt-12 relative">
              <div className="w-12 h-12 rounded-xl bg-white/10 dark:bg-black/10 flex items-center justify-center mb-6">
                <Users className="w-6 h-6 text-white dark:text-slate-900" />
              </div>
              <h3 className="text-2xl font-black mb-4 uppercase tracking-tighter">Who Should Join?</h3>
              <p className="text-sm font-medium leading-relaxed opacity-80">
                Anyone with a passion for {domain.title.toLowerCase()}. No prior experience is strictly required, but a strong desire to learn, experiment, and collaborate with peers is essential. We start from the basics and move to advanced concepts.
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
