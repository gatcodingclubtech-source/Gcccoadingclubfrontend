import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useAuth } from '../context/AuthContext';
import AnimatedBackground from '../components/AnimatedBackground';
import DrGirish from '../assets/Dr. Girish Rao Salanke N S.png';
import ProfAshoka from '../assets/Prof. Ashoka S.png';
import ProfRavindranath from '../assets/Prof. R C Ravindranath.png';
import ProfSharadadevi from '../assets/Prof. Sharadadevi Kaganurmath.png';
import ProfSharmila from '../assets/Prof. Sharmila Chidaravalli.png';
import ProfVasugi from '../assets/Prof. Vasugi I.png';
import RecruitmentBanner from '../assets/banners/gcc-club-recruitment-instagram.webp';
import WorkshopBanner1 from '../assets/banners/workshop 1.webp';
import GccLogo from '../assets/logo/gcc logo.png';
import { 
  Code, Menu, X, ArrowRight, Sun, Moon, Sparkles, Terminal as TerminalIcon, Shield, Layers, Award, Users, ChevronRight, Check, Calendar, Globe, MessageSquare, ArrowBigUp, Monitor, Zap, Video, Mic, Sword, BookOpen
} from 'lucide-react';
import HeroTerminal from '../components/HeroTerminal';
import socket from '../utils/socket';

const Github = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
);

const Instagram = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
);

const Linkedin = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
);

const CodeRainCanvas = () => {
  const canvasRef = React.useRef(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resize);
    resize();

    const symbols = ["await", "GCC", "React", "GAT", "const", "<div />", "JSON", "Map", "Git", "{...}", "</b>", "</h>", "<html>", "<body>", "API", "Node", "npm", "fetch", "async", "import", "export", "=>", "[ ]", "( )", "< >"];
    const drops = [];
    const columns = Math.floor(canvas.width / 40);

    for (let i = 0; i < columns * 2; i++) {
      drops[i] = {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        scale: Math.random() * Math.PI * 2,
        pulseSpeed: 0.005 + Math.random() * 0.01,
        symbol: symbols[Math.floor(Math.random() * symbols.length)],
        baseOpacity: 0.08 + Math.random() * 0.12
      };
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      drops.forEach(drop => {
        drop.scale += drop.pulseSpeed;
        const currentScale = 0.5 + Math.sin(drop.scale) * 0.5;
        const size = 20 + currentScale * 40;
        
        ctx.font = `900 ${size}px monospace`;
        ctx.fillStyle = `rgba(16, 185, 129, ${drop.baseOpacity * currentScale})`;
        ctx.fillText(drop.symbol, drop.x, drop.y);

        drop.x += Math.cos(drop.scale * 0.05) * 0.05;
        drop.y += Math.sin(drop.scale * 0.05) * 0.05;
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none opacity-100" />;
};

const SplitText = ({ text, className }) => {
  return (
    <span className={`inline-flex flex-wrap ${className}`}>
      {text.split('').map((char, i) => (
        <span key={i} className={`char inline-block ${char === ' ' ? 'w-[0.25em]' : ''}`}>
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </span>
  );
};

gsap.registerPlugin(ScrollTrigger);

const IconMap = {
  Code: <Code className="w-14 h-14" />,
  Sparkles: <Sparkles className="w-14 h-14" />,
  Terminal: <TerminalIcon className="w-14 h-14" />,
  Layers: <Layers className="w-14 h-14" />,
  Shield: <Shield className="w-14 h-14" />,
  Globe: <Globe className="w-14 h-14" />
};

function QuizSection() {
  return (
    <section id="quiz" className="panel py-24 md:py-32 px-6 relative z-10 border-t border-black/5 dark:border-white/5 overflow-hidden bg-white dark:bg-slate-950 min-h-screen flex items-center">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-12 lg:gap-20 items-center animate-on-scroll">
        <div className="flex-1 flex flex-col gap-6">
          <span className="text-xs font-bold uppercase tracking-widest text-brand flex items-center gap-2">
            <Code className="w-3.5 h-3.5" /> Challenge Arena
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-slate-900 dark:text-white">
            Test Your{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-cyan-500">
              Coding
            </span>{' '}
            Skills
          </h2>
          <p className="text-sm md:text-base font-medium text-slate-600 dark:text-slate-400 leading-relaxed max-w-md">
            Quick-fire coding questions covering Python, JavaScript, C++ and more. Pick the right answer, see the explanation, and track your score.
          </p>

          <div className="flex flex-wrap gap-3">
            {[
              { label: '20+ Questions', color: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' },
              { label: '3 Difficulty Levels', color: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20' },
              { label: 'Arena', color: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' },
            ].map(({ label, color }) => (
              <span key={label} className={`px-4 py-1.5 rounded-full text-xs font-black border ${color}`}>
                {label}
              </span>
            ))}
          </div>

          <Link to="/quiz" className="w-max px-8 py-4 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-black flex items-center gap-2 hover:scale-105 transition-all shadow-xl hover:shadow-emerald-500/20">
            Start Quiz <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="flex-1 w-full max-w-lg">
          <div className="glass-panel p-6 md:p-8 flex flex-col gap-5 select-none pointer-events-none relative">
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <span className="px-3 py-1 rounded-full text-[11px] font-black border bg-yellow-500/10 text-yellow-600 border-yellow-500/20">Medium</span>
                <span className="px-3 py-1 rounded-full text-[11px] font-black border bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-black/5 dark:border-white/5">JavaScript</span>
              </div>
              <span className="text-xs font-black text-slate-400 tracking-widest">Q 1 / 5</span>
            </div>

            <p className="text-sm font-bold text-slate-900 dark:text-white">What does <code className="text-brand bg-brand/10 px-1.5 py-0.5 rounded-md font-mono text-xs">typeof null</code> return in JavaScript?</p>

            <div className="bg-slate-950 rounded-xl overflow-hidden border border-white/10">
              <div className="px-4 py-2 bg-slate-900 border-b border-white/5 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500" />
                <span className="text-xs font-bold text-slate-500">Q 1 / 5</span>
              </div>
              <pre className="px-5 py-4 text-xs font-mono text-cyan-300">console.log(typeof null);</pre>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {["'null'", "'undefined'", "'object'", "'boolean'"].map((opt, i) => (
                <div key={i} className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 text-xs font-bold ${i === 2 ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300' : 'border-black/10 dark:border-white/10 text-slate-600 dark:text-slate-400'}`}>
                  <span className="w-5 h-5 rounded-full border-2 border-current flex items-center justify-center text-[9px] font-black flex-shrink-0">
                    {String.fromCharCode(65 + i)}
                  </span>
                  {opt}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function DiscussionOverview({ discussions, loading }) {
  return (
    <section id="discussions-overview" className="py-24 md:py-32 px-6 relative z-10 bg-slate-50 dark:bg-slate-950/50">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 animate-on-scroll">
          <div className="space-y-4">
            <span className="text-xs font-bold tracking-widest text-brand flex items-center gap-2">
              <MessageSquare className="w-3.5 h-3.5" /> Tech Arena
            </span>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
              Trending <span className="text-brand">Debates</span>
            </h2>
          </div>
          <Link to="/discussions" className="text-sm font-black text-brand hover:underline flex items-center gap-2 tracking-widest">
            Enter Arena <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {loading ? (
            [1, 2, 3].map(i => <div key={i} className="glass-panel h-64 animate-pulse bg-slate-200 dark:bg-slate-800" />)
          ) : (
            discussions.map((disc, idx) => (
              <Link to={`/discussions/${disc._id}`} key={disc._id} className="glass-panel p-8 flex flex-col gap-6 group hover:border-brand/40 transition-colors animate-on-scroll">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-black tracking-widest bg-brand/10 text-brand px-2 py-1 rounded">
                    {disc.category}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400">
                    {new Date(disc.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white leading-tight group-hover:text-brand transition-colors">
                  {disc.title}
                </h3>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 line-clamp-3 flex-1">
                  {disc.content}
                </p>
                <div className="flex items-center gap-4 pt-4 border-t border-black/5 dark:border-white/5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                   <div className="flex items-center gap-1.5">
                      <ArrowBigUp className="w-4 h-4" /> {disc.upvotes?.length || 0}
                   </div>
                   <div className="flex items-center gap-1.5">
                      <MessageSquare className="w-4 h-4" /> {disc.comments?.length || 0}
                   </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </section>
  );
}

export default function Home({ theme }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [counter, setCounter] = useState(0);
  const [showAllDomains, setShowAllDomains] = useState(false);
  const [terminalHistory, setTerminalHistory] = useState([
    { text: 'Starting GAT Club System...', type: 'system' },
    { text: 'Type "help" to see what you can do.', type: 'info' }
  ]);
  const [terminalInput, setTerminalInput] = useState('');
  const [events, setEvents] = useState([]);
  const [domains, setDomains] = useState([]);
  const [discussions, setDiscussions] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [domainsLoading, setDomainsLoading] = useState(true);
  const [discussionsLoading, setDiscussionsLoading] = useState(true);
  const [rooms, setRooms] = useState([]);
  const [roomsLoading, setRoomsLoading] = useState(true);
  const termRef = useRef(null);

  useEffect(() => {
    fetchEvents();
    fetchDomains();
    fetchDiscussions();
    fetchRooms();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await axios.get('/api/events');
      if (res.data.success) {
        setEvents(res.data.events);
      }
    } catch (err) {
      console.error('Error fetching events', err);
    } finally {
      setEventsLoading(false);
    }
  };

  const fetchDiscussions = async () => {
    try {
      const res = await axios.get('/api/discussions');
      setDiscussions(res.data.slice(0, 3)); // Only show top 3
    } catch (err) {
      console.error('Error fetching discussions', err);
    } finally {
      setDiscussionsLoading(false);
    }
  };

  const fetchDomains = async () => {
    try {
      const res = await axios.get('/api/domains');
      if (res.data.success) {
        setDomains(res.data.domains);
      }
    } catch (err) {
      console.error('Error fetching domains', err);
    } finally {
      setDomainsLoading(false);
    }
  };

  const fetchRooms = async () => {
    try {
      const res = await axios.get('/api/live-rooms');
      setRooms(res.data.slice(0, 3));
    } catch (err) {
      console.error('Error fetching rooms', err);
    } finally {
      setRoomsLoading(false);
    }
  };

  useEffect(() => {
    document.documentElement.classList.remove('dark');
    
    let interval = setInterval(() => {
      setCounter(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            const tl = gsap.timeline();
            tl.to('#preloader-content', { opacity: 0, y: -20, duration: 0.5, ease: 'power2.inOut' })
              .to('#preloader-line-fill', { scaleX: 1.2, opacity: 0, duration: 0.4, ease: 'power2.inOut' }, '-=0.2')
              .to('#preloader', { opacity: 0, scale: 0.98, duration: 0.6, ease: 'power2.inOut', onComplete: () => {
                window.scrollTo(0, 0);
                setLoading(false);
                const preloaderEl = document.getElementById('preloader');
                if (preloaderEl) preloaderEl.style.display = 'none';
                gsap.to('#hero-door-l', { x: '-100%', duration: 1.5, ease: 'power4.inOut', delay: 0.1 });
                gsap.to('#hero-door-r', { x: '100%', duration: 1.5, ease: 'power4.inOut', delay: 0.1 });
                gsap.fromTo('#hero-title', { y: 60, opacity: 0, scale: 0.9 }, { y: 0, opacity: 1, scale: 1, duration: 1.5, delay: 0.4, ease: 'power4.out' });
                gsap.fromTo('#hero-desc', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 1.5, delay: 0.55, ease: 'power4.out' });
                gsap.fromTo('#hero-cta', { y: 30, opacity: 0, scale: 0.95 }, { y: 0, opacity: 1, scale: 1, duration: 1.5, delay: 0.7, ease: 'power4.out' });
                gsap.fromTo('#hero-stats', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 1.5, delay: 0.8, ease: 'power4.out' });
              }});
          }, 300);
          return 100;
        }
        return prev + 4;
      });
    }, 45);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (loading) return;
    window.scrollTo(0, 0);
  }, [loading]);

  useEffect(() => {
    if (loading) return;

    const ctx = gsap.context(() => {
      gsap.utils.toArray('.char-reveal').forEach((heading) => {
        const chars = heading.querySelectorAll('.char');
        if (chars.length === 0) return;
        gsap.fromTo(chars, 
          { y: '100%', rotateX: -90, opacity: 0 },
          { 
            y: '0%', 
            rotateX: 0, 
            opacity: 1, 
            duration: 1, 
            stagger: 0.02, 
            ease: 'back.out(1.7)',
            scrollTrigger: {
              trigger: heading,
              start: 'top 90%',
              toggleActions: 'play reverse play reverse',
            }
          }
        );
      });

      // Removed conflicting animate-on-scroll trigger to fix opacity issues

      if (window.innerWidth >= 1024) {
        ScrollTrigger.create({
          trigger: '#about-left',
          start: 'top 120px',
          endTrigger: '#about',
          end: 'bottom bottom',
          pin: true,
          pinSpacing: false,
          invalidateOnRefresh: true,
        });

        ScrollTrigger.create({
          trigger: '#hero',
          start: 'top top',
          endTrigger: '#about',
          end: 'top top',
          pin: true,
          pinSpacing: false,
        });
      }

      gsap.utils.toArray('section').forEach((section) => {
        const elements = section.querySelectorAll('.animate-on-scroll:not(.char-reveal)');
        if (elements && elements.length > 0) {
          gsap.fromTo(elements, 
            { y: 30, opacity: 0, scale: 0.99 },
            { 
              y: 0, 
              opacity: 1, 
              scale: 1,
              duration: 0.8,
              stagger: { amount: 0.2, ease: "power2.out" },
              ease: 'power3.out',
              scrollTrigger: {
                trigger: section,
                start: window.innerWidth < 768 ? 'top 98%' : 'top 95%',
                toggleActions: 'play none none none',
                once: true
              }
            }
          );
        }
      });

      // Domain Horizontal Scroll
      if (window.innerWidth >= 1024) {
        const domainContainer = document.querySelector('.domain-scroll-container');
        if (domainContainer) {
          gsap.to(domainContainer, {
            x: () => -(domainContainer.scrollWidth - window.innerWidth + window.innerWidth * 0.2),
            ease: 'none',
            scrollTrigger: {
              trigger: '#domains',
              pin: true,
              scrub: 1,
              start: 'top top',
              end: () => `+=${domainContainer.scrollWidth}`,
              invalidateOnRefresh: true,
            }
          });
        }
      }
      // Digital Nexus Reveal Animation
      const nexusReveals = document.querySelectorAll('.nexus-reveal');
      const blade = document.querySelector('.nexus-blade');
      if (nexusReveals.length > 0) {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: '#nexus',
            start: 'top 60%',
            end: 'bottom 40%',
            toggleActions: 'play none none reverse'
          }
        });

        tl.to(nexusReveals, {
          y: 0,
          opacity: 1,
          duration: 1.2,
          stagger: 0.2,
          ease: 'power4.out'
        });

        if (blade) {
          tl.fromTo(blade, 
            { top: '0%', opacity: 0 },
            { top: '100%', opacity: 1, duration: 1.5, ease: 'power2.inOut' },
            '-=1'
          ).to(blade, { opacity: 0, duration: 0.5 });
        }
      }
    });

    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);

    return () => {
      ctx.revert();
      clearTimeout(timer);
    };
  }, [loading, showAllDomains]);

  return (
    <div className="relative font-sans select-none overflow-x-hidden min-h-screen">
      <div id="preloader" className="fixed inset-0 z-[100] flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100 font-sans select-none overflow-hidden transition-all duration-700">
        <div id="preloader-content" className="relative flex flex-col items-center max-w-lg w-full px-8 gap-6">
          <div className="flex justify-between items-baseline w-full">
            <span className="text-sm font-mono tracking-widest text-brand font-black uppercase">GAT CLUB</span>
            <span className="text-6xl md:text-8xl font-black font-sans text-slate-900 tracking-tight leading-none tabular-nums select-none flex items-start">
              {counter < 10 ? `0${counter}` : counter}
              <span className="text-xl md:text-2xl text-brand font-light ml-1">%</span>
            </span>
          </div>

          <div className="w-full h-1.5 md:h-2 bg-slate-200/80 rounded-full overflow-hidden backdrop-blur-md border border-black/5 relative flex items-center">
            <div 
              id="preloader-line-fill" 
              className="h-full bg-gradient-to-r from-emerald-600 via-emerald-500 to-cyan-400 rounded-full transition-all duration-300 ease-out flex items-center justify-end relative select-none"
              style={{ width: `${counter}%` }}
            >
              <div className="w-4 h-4 rounded-full bg-white absolute -right-1 filter drop-shadow-[0_0_10px_#10b981]"></div>
            </div>
          </div>

          <div className="flex justify-between items-center w-full text-xs font-mono font-bold tracking-widest text-slate-600 uppercase select-none">
            <span className="animate-pulse">
              {counter < 30 && 'Initializing Core Systems'}
              {counter >= 30 && counter < 60 && 'Constructing Nodes & Pipelines'}
              {counter >= 60 && counter < 90 && 'Compiling Premium Sections'}
              {counter >= 90 && counter <= 100 && 'Launch Imminent'}
            </span>
            <span className="text-brand/80">v1.0.0</span>
          </div>
        </div>
      </div>

      <section id="hero" className="relative min-h-[100vh] flex flex-col items-center justify-center pt-50 pb-6 px-6 overflow-hidden bg-white dark:bg-slate-950">
        <div id="hero-door-l" className="hero-door hero-door-left"></div>
        <div id="hero-door-r" className="hero-door hero-door-right"></div>
        
        {/* Subtle Cinematic Depth */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.03)_0%,transparent_70%)]" />
        </div>

        {/* High-Performance Canvas Code Blizzard (Zero Lag) */}
        <CodeRainCanvas />

        <div id="home-content" className="max-w-6xl mx-auto flex flex-col items-center text-center gap-6 w-full relative z-20">
          
          <div className="flex flex-col gap-6 items-center">
            <h1 id="hero-title" className="font-black tracking-tight leading-[1.1] flex flex-col items-center text-center">
              <span className="text-[#10b981] text-5xl md:text-[72px]">Welcome to GCC.</span>
              <span className="text-[#0f172a] dark:text-white text-5xl md:text-[72px]">Learn Coding.</span>
              <span className="text-[#10b981] text-5xl md:text-[72px]">Build Cool Projects.</span>
            </h1>
            
            <p id="hero-desc" className="text-sm md:text-base font-bold text-slate-600 dark:text-slate-400 max-w-2xl mx-auto animate-on-scroll leading-relaxed px-4">
              Step into the nexus of creativity and technology. Join an elite community building the software foundations of tomorrow.
            </p>
          </div>

          
          <div id="hero-cta" className="flex flex-wrap items-center justify-center gap-4">
            <Link 
              to="/events"
              className="px-10 py-4 rounded-xl bg-[#0a0c10] text-white text-xs font-black flex items-center gap-3 hover:scale-105 transition-all shadow-2xl uppercase tracking-widest"
            >
              Explore Activities <ArrowRight className="w-4 h-4" />
            </Link>
            <button 
              onClick={(e) => {
                const el = document.getElementById('about');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-10 py-4 rounded-xl bg-white dark:bg-slate-900 border-2 border-slate-900 dark:border-white/20 text-slate-900 dark:text-white text-xs font-black flex items-center gap-3 hover:bg-slate-50 transition-all uppercase tracking-widest"
            >
              Our Mission
            </button>
          </div>
        </div>

        {/* Mobile Stats - Keep at bottom for better mobile UX */}
        <div id="hero-stats" className="flex lg:hidden items-center justify-center gap-12 mt-8 w-full">
            <div className="flex flex-col items-center gap-1 group">
              <span className="text-4xl font-black text-slate-950 dark:text-white leading-none group-hover:text-emerald-500 transition-colors">500+</span>
              <span className="text-[9px] font-black tracking-[0.4em] text-slate-400 dark:text-slate-500 uppercase">Members</span>
            </div>
            <div className="flex flex-col items-center gap-1 group">
              <span className="text-4xl font-black text-slate-950 dark:text-white leading-none group-hover:text-emerald-500 transition-colors">15+</span>
              <span className="text-[9px] font-black tracking-[0.4em] text-slate-400 dark:text-slate-500 uppercase">Projects</span>
            </div>
          </div>
        
        {/* Floating Side Stats - Desktop Only, Positioned bottom-right */}
        <div className="hidden lg:block pointer-events-none">
          <div className="absolute right-[4vw] bottom-[10%] flex flex-col gap-8 items-end text-right z-30">
             <div className="flex flex-col gap-1.5 group animate-on-scroll items-end">
               <div className="w-6 h-[2px] bg-brand mb-1"></div>
               <span className="text-4xl font-black text-slate-950 dark:text-white leading-none">500+</span>
               <span className="text-[9px] font-black tracking-[0.2em] text-slate-400 uppercase">Members</span>
             </div>
             <div className="flex flex-col gap-1.5 group animate-on-scroll items-end">
               <div className="w-6 h-[2px] bg-brand mb-1"></div>
               <span className="text-4xl font-black text-slate-950 dark:text-white leading-none">15+</span>
               <span className="text-[9px] font-black tracking-[0.2em] text-slate-400 uppercase">Projects</span>
             </div>
          </div>
        </div>
      </section>

      {/* 4. Natural Flow About Section */}
      <section id="about" className="relative z-10 py-16 md:py-32 px-4 sm:px-6 border-t border-black/5 dark:border-white/5 select-none overflow-hidden">
        {/* Background Blur Overlay */}
        <div className="absolute inset-0 bg-white/40 dark:bg-slate-950/40 backdrop-blur-[60px] z-0" />
        
        <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-12 md:gap-16 items-start relative z-10">
          {/* Pinned Left Side Content */}
          <div id="about-left" className="lg:col-span-5 self-start flex flex-col gap-6 md:gap-8 animate-on-scroll">
            <span className="text-xs md:text-sm font-bold uppercase tracking-widest text-brand flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" /> WHO WE ARE
            </span>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-tight text-slate-900 dark:text-white char-reveal">
              <SplitText text="About Our " />
              <span className="text-emerald-500">
                <SplitText text="Club" />
              </span>
            </h2>
            <p className="text-sm md:text-base font-medium text-slate-600 dark:text-slate-400 leading-relaxed animate-on-scroll">
              We are a group of students who love technology. We work together to learn new skills and build amazing software projects.
            </p>
            <p className="text-sm md:text-base font-medium text-slate-600 dark:text-slate-400 leading-relaxed animate-on-scroll">
              We organize workshops and competitions to help students get better at coding. We believe in learning by doing and help everyone build projects that solve real problems.
            </p>
          </div>

            {/* Scrolling Right Side Content */}
            <div className="lg:col-span-7 flex flex-col gap-8 md:gap-12">
              {/* Vision Card */}
              <div className="glass-panel p-8 md:p-12 flex flex-col gap-6 animate-on-scroll hover:scale-[1.02] transition-transform duration-500">
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
                    <span className="text-yellow-400 text-3xl select-none">★</span> Vision
                  </h3>
                </div>
                <p className="text-sm md:text-base font-medium text-slate-600 dark:text-slate-400 leading-relaxed">
                  To build a community where everyone can learn coding, build cool things, and get ready for a great career in technology.
                </p>
              </div>

              {/* Mission Card */}
              <div className="glass-panel p-8 md:p-12 flex flex-col gap-8 animate-on-scroll hover:scale-[1.02] transition-transform duration-500">
                <h3 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
                  <span className="text-green-500 font-bold select-none text-2xl">✓</span> Mission
                </h3>
                <div className="flex flex-col gap-6">
                  {[
                    { title: 'Learn and Grow', desc: 'Join our regular coding sessions and workshops to learn new skills.' },
                    { title: 'Build Projects', desc: 'Work on real projects and join coding competitions.' },
                    { title: 'Career Help', desc: 'Get guidance on resumes and interviews to get ready for jobs.' }
                  ].map((item, idx) => (
                    <div key={idx} className="flex gap-4 items-start">
                      <span className="text-green-500 font-bold select-none mt-0.5">✓</span>
                      <div className="flex flex-col gap-1">
                        <span className="text-base md:text-lg font-black text-slate-900 dark:text-white leading-tight">{item.title}</span>
                        <span className="text-sm md:text-base font-medium text-slate-600 dark:text-slate-400">{item.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Objectives Card */}
              <div className="glass-panel p-8 md:p-12 flex flex-col gap-8 animate-on-scroll hover:scale-[1.02] transition-transform duration-500">
                <h3 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
                  <span className="text-brand font-bold select-none text-2xl">→</span> Objectives
                </h3>
                <div className="flex flex-col gap-6">
                  {[
                    'Learn new technology through projects and workshops.',
                    'Work together and help each other grow.',
                    'Help our college grow through technology.'
                  ].map((desc, idx) => (
                    <div key={idx} className="flex gap-4 items-start">
                      <span className="text-brand font-bold select-none mt-0.5">→</span>
                      <span className="text-sm md:text-base font-medium text-slate-600 dark:text-slate-400">{desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
        </div>
      </section>

      {/* 5. Horizontal Scrolling Domains Section */}
      <section id="domains" className="py-16 md:py-40 px-4 sm:px-6 relative z-10 bg-white dark:bg-slate-950 overflow-hidden">
        <div className="max-w-6xl mx-auto mb-20">
          <div className="flex flex-col gap-4 text-left max-w-2xl animate-on-scroll">
            <span className="text-xs md:text-sm font-bold uppercase tracking-widest text-brand">Our Domains</span>
            <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-tight text-slate-900 dark:text-white char-reveal">
              <SplitText text="Our Areas of Expertise" />
            </h2>
          </div>
        </div>

        {/* Horizontal Scroll Track */}
        <div className="domain-scroll-container relative flex items-start gap-10 px-[5vw] md:px-[10vw]">
          {domainsLoading ? (
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="glass-panel h-80 min-w-[300px] md:min-w-[450px] animate-pulse bg-black/5 dark:bg-white/5 rounded-[2.5rem]" />
            ))
          ) : domains.length === 0 ? (
            <div className="w-full py-20 text-center opacity-30 font-black uppercase tracking-widest text-slate-500">
              No active domains discovered
            </div>
          ) : (
            domains.map((domain, idx) => (
              <div key={domain._id} className="domain-card-horizontal p-10 md:p-14 min-w-[320px] md:min-w-[500px] flex flex-col gap-8 elite-card group hover:scale-[1.02] transition-all duration-500 bg-white dark:bg-slate-900 shadow-2xl relative">
                <div className={`w-20 h-20 rounded-3xl bg-brand/10 flex items-center justify-center text-brand shadow-lg shadow-brand/5 group-hover:scale-110 transition-transform`}>
                  {IconMap[domain.icon] || <Layers className="w-20 h-20" />}
                </div>
                <div className="flex flex-col gap-4">
                  <h4 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">{domain.title}</h4>
                  <p className="text-base font-medium text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3">
                    {domain.desc}
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 mt-auto">
                  <Link to={`/register/domain/${domain._id}`} className="flex-1 py-4 rounded-2xl bg-brand text-white text-[11px] font-black tracking-widest hover:bg-emerald-700 transition-colors shadow-xl shadow-brand/20 text-center flex items-center justify-center uppercase">
                    {user && user.joinedDomains?.includes(domain._id) ? "JOINED" : "JOIN NOW"}
                  </Link>
                  <Link to={`/domain/${domain.slug}`} className="flex-1 py-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white text-[11px] font-black tracking-widest hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-center inline-block uppercase">
                    DETAILS
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </section>





      {/* 6. Advanced Event Radar - REDESIGNED 2.0 */}
      <section id="events" className="relative py-16 md:py-40 px-4 sm:px-6 z-10 overflow-hidden border-t border-b border-black/5 dark:border-white/5 bg-white dark:bg-slate-950">

        <div className="max-w-7xl mx-auto flex flex-col gap-16 md:gap-24">
          <div className="flex flex-col gap-12 animate-on-scroll mb-16">
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-[2px] bg-brand"></div>
                <span className="text-xs md:text-sm font-bold uppercase tracking-[0.3em] text-brand">Latest Activities</span>
              </div>
              <h2 className="text-4xl md:text-7xl font-black tracking-tighter text-slate-900 dark:text-white leading-[0.9] font-cyber char-reveal">
                Latest <span className="text-emerald-500">Activities</span>
              </h2>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {eventsLoading ? (
              Array(3).fill(0).map((_, i) => (
                <div key={i} className="glass-panel h-[400px] animate-pulse bg-black/5 dark:bg-white/5 rounded-[2.5rem]" />
              ))
            ) : events.length === 0 ? (
              <div className="col-span-full py-20 text-center opacity-30 font-black uppercase tracking-widest text-slate-500">
                No active activities found
              </div>
            ) : (
              events
                .filter(ev => ev.isActive !== false)
                .slice(0, 3)
                .map((item) => (
                  <div key={item._id} className="elite-card group bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border border-black/5 dark:border-white/10 rounded-[2.5rem] overflow-hidden hover:shadow-2xl transition-all duration-500 animate-on-scroll flex flex-col hover:-translate-y-2">
                    <div className="relative aspect-[16/10] overflow-hidden w-full bg-slate-200/30 dark:bg-slate-800/30 border-b border-black/5 dark:border-white/5">
                      <img src={item.image || 'https://via.placeholder.com/800x500'} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      <div className="absolute top-4 left-4">
                        <span className="px-4 py-1.5 rounded-lg bg-brand/90 backdrop-blur-xl text-[9px] font-black text-white tracking-widest shadow-xl uppercase">{item.category}</span>
                      </div>
                    </div>
                    <div className="p-6 md:p-8 flex flex-col gap-6">
                      <div className="flex flex-col gap-3">
                        <h4 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tighter uppercase group-hover:text-brand transition-colors leading-tight line-clamp-2 min-h-[3.5rem]">{item.title}</h4>
                        <div className="flex flex-wrap gap-2 text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                          <span className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
                            <Calendar className="w-3 h-3 text-brand" /> 
                            {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </span>
                          <span className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg"><Globe className="w-3 h-3 text-brand" /> {item.venue}</span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 mt-4 pt-6 border-t border-black/5 dark:border-white/5">
                        <Link 
                          to={`/register/event/${item._id}`}
                          className="py-3.5 rounded-xl bg-brand text-white text-[9px] font-black tracking-widest hover:bg-emerald-700 transition-all active:scale-95 shadow-lg shadow-brand/20 text-center flex items-center justify-center"
                        >
                          REGISTER
                        </Link>
                        <Link to={`/event/${item._id}`} className="py-3.5 rounded-xl bg-white dark:bg-slate-800 border border-black/5 dark:border-white/10 text-slate-900 dark:text-white text-[9px] font-black tracking-widest hover:bg-slate-50 dark:hover:bg-slate-700 transition-all active:scale-95 text-center flex items-center justify-center">
                          DETAILS
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
            )}
          </div>

          <div className="flex justify-center mt-12">
            <Link 
              to="/events"
              className="px-12 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full font-black text-xs tracking-widest hover:scale-105 transition-transform active:scale-95 shadow-xl"
            >
              VIEW ALL ACTIVITIES
            </Link>
          </div>
        </div>
      </section>

      {/* 6.2 — Live Arena Overview (NEW - Quiz Style) */}
      <section id="live-rooms-preview" className="panel py-24 md:py-32 px-6 relative z-10 border-t border-black/5 dark:border-white/5 overflow-hidden bg-slate-50 dark:bg-slate-950 flex items-center">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-12 lg:gap-20 items-center animate-on-scroll">
          <div className="flex-1 flex flex-col gap-6 order-2 lg:order-1">
            <span className="text-xs font-bold uppercase tracking-widest text-brand flex items-center gap-2">
              <Video className="w-3.5 h-3.5" /> Live Community Arena
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-slate-900 dark:text-white">
              Join Active{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-cyan-500">
                Live
              </span>{' '}
              Sessions
            </h2>
            <p className="text-sm md:text-base font-medium text-slate-600 dark:text-slate-400 leading-relaxed max-w-md">
              Engage with fellow developers in real-time. From technical workshops to coding marathons and intense debates, the Arena is where the club comes alive.
            </p>

            <div className="flex flex-wrap gap-3">
              {[
                { label: 'Real-time Interaction', color: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' },
                { label: 'Voice & Video', color: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20' },
                { label: 'Screen Share', color: 'bg-blue-500/10 text-blue-600 border-blue-500/20' },
              ].map(({ label, color }) => (
                <span key={label} className={`px-4 py-1.5 rounded-full text-[10px] font-black border ${color} uppercase tracking-widest`}>
                  {label}
                </span>
              ))}
            </div>

            <Link to="/live-rooms" className="w-max px-8 py-4 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-black flex items-center gap-2 hover:scale-105 transition-all shadow-xl hover:shadow-emerald-500/20 uppercase tracking-widest">
              Enter Arena <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="flex-1 w-full max-w-lg order-1 lg:order-2">
            <div className="glass-panel p-6 md:p-8 flex flex-col gap-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand/10 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-brand/20 transition-colors" />
              
              <div className="flex items-center justify-between relative z-10">
                <div className="flex gap-2">
                  <span className="px-3 py-1 rounded-full text-[10px] font-black border bg-emerald-500/10 text-emerald-600 border-emerald-500/20 uppercase tracking-widest animate-pulse">Live</span>
                  <span className="px-3 py-1 rounded-full text-[10px] font-black border bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-black/5 dark:border-white/5 uppercase tracking-widest">Coding Room</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <Users className="w-4 h-4" />
                  <span className="text-xs font-black">12 Active</span>
                </div>
              </div>

              <div className="space-y-4 relative z-10">
                <h4 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">System Architecture Deep Dive</h4>
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full border-4 border-white dark:border-slate-900 bg-slate-200 dark:bg-slate-800 overflow-hidden">
                      <img src={`https://i.pravatar.cc/150?u=${i}`} alt="user" className="w-full h-full object-cover" />
                    </div>
                  ))}
                  <div className="w-10 h-10 rounded-full border-4 border-white dark:border-slate-900 bg-brand text-white flex items-center justify-center text-[10px] font-black">+8</div>
                </div>
              </div>

              <div className="bg-slate-950 rounded-2xl p-4 border border-white/5 relative z-10 group-hover:border-brand/30 transition-colors">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Streaming Terminal</span>
                </div>
                <div className="font-mono text-xs text-emerald-400/80 space-y-1">
                  <div className="flex gap-2"><span className="text-slate-600">01</span> <span className="text-pink-400">async function</span> <span className="text-blue-400">optimizePipeline</span>() {"{"}</div>
                  <div className="flex gap-2"><span className="text-slate-600">02</span> &nbsp;&nbsp;<span className="text-pink-400">const</span> nodes = <span className="text-pink-400">await</span> fetchNodes();</div>
                  <div className="flex gap-2"><span className="text-slate-600">03</span> &nbsp;&nbsp;<span className="text-pink-400">return</span> nodes.<span className="text-blue-400">map</span>(n ={'>'} n.<span className="text-yellow-400">id</span>);</div>
                  <div className="flex gap-2"><span className="text-slate-600">04</span> {"}"}</div>
                </div>
              </div>

              <button className="w-full py-4 rounded-xl bg-brand text-white text-[11px] font-black tracking-widest uppercase shadow-xl shadow-brand/20 hover:scale-[1.02] transition-all" onClick={() => navigate('/live-rooms')}>
                Quick Join
              </button>
            </div>
          </div>
        </div>
      </section>


      {/* 7.5 — Quiz Overview Section */}
      <QuizSection />


      {/* 7. Premium SaaS-style Leaderboard Table Section */}
      <section id="leaderboard" className="py-16 md:py-32 px-4 sm:px-6 scroll-fade-in relative z-10">
        <div className="max-w-6xl mx-auto flex flex-col gap-12 md:gap-16">
          <div className="flex flex-col gap-4 text-left max-w-2xl animate-on-scroll">
            <span className="text-xs md:text-sm font-bold uppercase tracking-widest text-brand">Leaderboard</span>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-tight text-slate-900 dark:text-white char-reveal">
              <SplitText text="Our Top Contributors" />
            </h2>
          </div>

          <div className="glass-panel overflow-hidden w-full flex flex-col animate-on-scroll">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-2 md:gap-4 px-4 sm:px-8 py-6 border-b border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 font-black text-[10px] sm:text-xs md:text-sm text-slate-900 dark:text-white uppercase tracking-wider text-left">
              <div className="col-span-2">Rank</div>
              <div className="col-span-6 flex items-center gap-3">Member</div>
              <div className="col-span-2 text-right">PRs</div>
              <div className="col-span-2 text-right">Pts</div>
            </div>

            {/* Table Rows */}
            {[
              { rank: '🥇 #1', name: 'Tharun Prasad', role: 'Next.js Wizard', prs: 142, points: 9481 },
              { rank: '🥈 #2', name: 'Ananya Sharma', role: 'Python Architect', prs: 118, points: 8122 },
              { rank: '🥉 #3', name: 'Rahul Murthy', role: 'System Optimizer', prs: 94, points: 7450 },
              { rank: '#4', name: 'Pooja Reddy', role: 'Full Stack Dev', prs: 88, points: 6814 },
            ].map((row, idx) => (
              <div key={idx} className="grid grid-cols-12 gap-2 md:gap-4 px-4 sm:px-8 py-6 border-b border-black/5 dark:border-white/5 last:border-b-0 items-center text-left hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                <div className="col-span-2 text-[10px] sm:text-sm md:text-base font-black text-slate-900 dark:text-white tracking-tight">
                  {row.rank}
                </div>
                <div className="col-span-6 flex flex-col">
                  <span className="text-[11px] sm:text-sm md:text-base font-black text-slate-900 dark:text-white leading-tight truncate">{row.name}</span>
                  <span className="text-[9px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 truncate">{row.role}</span>
                </div>
                <div className="col-span-2 text-right text-[10px] sm:text-xs md:text-sm font-black text-slate-700 dark:text-slate-300">
                  {row.prs}
                </div>
                <div className="col-span-2 text-right text-[11px] sm:text-sm md:text-base font-black tracking-tight text-brand">
                  {row.points}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Team Accordion Section */}
      <section id="team" className="py-16 md:py-32 px-4 sm:px-6 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col gap-20">
          {/* Header Section */}
          <div className="flex flex-col gap-4 text-center max-w-3xl mx-auto animate-on-scroll">
            <span className="text-sm font-bold uppercase tracking-widest text-brand">Our Team</span>
            <h2 className="text-4xl md:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-tight char-reveal">
              Meet the People Behind <span className="text-emerald-500">GAT Club</span>
            </h2>
            <p className="text-slate-600 dark:text-slate-400 font-medium max-w-2xl mx-auto animate-on-scroll">The teachers and students who make everything happen.</p>
          </div>

          {/* Faculty Mentor Spotlight */}
          <div className="flex flex-col gap-10 animate-on-scroll">
            <h3 className="text-center text-xs font-black tracking-widest text-slate-400 uppercase">Faculty Mentor</h3>
            <div className="flex justify-center">
              <div className="glass-panel group max-w-4xl w-full p-8 md:p-12 flex flex-col md:flex-row items-center gap-10">
                <div className="w-48 h-48 md:w-64 md:h-64 rounded-3xl overflow-hidden shadow-2xl">
                  <img src={DrGirish} alt="Dr. Girish Rao Salanke N S" className="w-full h-full object-cover" />
                </div>
                <div className="flex flex-col gap-4 text-center md:text-left flex-1">
                  <h4 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white">Dr. Girish Rao Salanke N S</h4>
                  <span className="text-lg font-bold text-brand">Faculty Mentor</span>
                  <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                    "Guiding students to become great engineers and leaders."
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Faculty Coordinators Grid */}
          <div className="flex flex-col gap-12 animate-on-scroll">
            <h3 className="text-center text-xs font-black tracking-widest text-slate-400 uppercase">Faculty Coordinators</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-16 md:gap-20">
              {[
                { name: 'Prof. Ashoka S', role: 'Faculty Coordinator', img: ProfAshoka, dept: 'AIDS' },
                { name: 'Prof. Vasugi I', role: 'Faculty Coordinator', img: ProfVasugi, dept: 'AIML' },
                { name: 'Prof. R C Ravindranath', role: 'Faculty Coordinator', img: ProfRavindranath, dept: 'CSE' },
                { name: 'Prof. Sharadadevi Kaganurmath', role: 'Faculty Coordinator', img: ProfSharadadevi, dept: 'CS-AIML' },
                { name: 'Prof. Sharmila Chidaravalli', role: 'Faculty Coordinator', img: ProfSharmila, dept: 'ISE' },
              ].map((member, idx) => (
                <div key={idx} className="flex flex-col items-center gap-6 text-center">
                  <div className="w-40 h-40 md:w-48 md:h-48 rounded-full overflow-hidden border-4 border-white dark:border-slate-800 shadow-xl">
                    <img src={member.img} alt={member.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <h4 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white leading-tight">{member.name}</h4>
                    <span className="text-sm font-bold text-brand">{member.dept} Department</span>
                    <span className="text-xs font-medium text-slate-500">{member.role}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Future Teams */}
          <div className="flex flex-col md:flex-row gap-8 justify-center mt-12 animate-on-scroll">
            <div className="px-12 py-8 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 text-center flex-1 max-w-md">
              <h4 className="text-xl font-black text-slate-900 dark:text-white mb-2">Core Team</h4>
              <p className="text-sm font-bold text-brand uppercase tracking-widest">Coming Soon</p>
            </div>
            <div className="px-12 py-8 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 text-center flex-1 max-w-md">
              <h4 className="text-xl font-black text-slate-900 dark:text-white mb-2">Sub Core Team</h4>
              <p className="text-sm font-bold text-brand uppercase tracking-widest">Coming Soon</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
