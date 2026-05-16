import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useAuth } from '../context/AuthContext';
import { useOnboarding } from '../hooks/useOnboarding';
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
  Code, Menu, X, ArrowLeft, ArrowRight, Sun, Moon, Sparkles, Terminal as TerminalIcon, Shield, Layers, Award, Users, ChevronRight, Check, Calendar, Globe, MessageSquare, ArrowBigUp, Monitor, Zap, Video, Mic, Sword, BookOpen, Rocket, Trophy
} from 'lucide-react';
import { Github, Instagram, Linkedin } from '../components/Icons';
import HeroTerminal from '../components/HeroTerminal';
import BannerSpotlight from '../components/BannerSpotlight';
import Magnetic from '../components/Magnetic';
import socket from '../utils/socket';


const CodeNebula = () => {
  const codeSnippets = [
    { text: 'async await', color: 'text-emerald-500', top: '15%', left: '10%', scale: 1.2, delay: 0 },
    { text: '=>', color: 'text-cyan-400', top: '25%', left: '80%', scale: 1.5, delay: 2 },
    { text: '{...}', color: 'text-amber-400', top: '65%', left: '15%', scale: 1.3, delay: 1 },
    { text: 'GCC.init()', color: 'text-emerald-400', top: '75%', left: '75%', scale: 1.1, delay: 3 },
    { text: 'const', color: 'text-purple-400', top: '45%', left: '5%', scale: 1.4, delay: 0.5 },
    { text: 'return', color: 'text-rose-400', top: '10%', left: '60%', scale: 1.2, delay: 1.5 },
    { text: '<html>', color: 'text-blue-400', top: '85%', left: '40%', scale: 1.6, delay: 2.5 },
    { text: '[ ]', color: 'text-emerald-500', top: '55%', left: '90%', scale: 1.4, delay: 0.2 },
    { text: 'await GAT()', color: 'text-cyan-500', top: '35%', left: '70%', scale: 1.3, delay: 1.8 },
    { text: 'import { Node }', color: 'text-slate-400', top: '80%', left: '10%', scale: 1.1, delay: 0.7 },
  ];

  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
      {codeSnippets.map((snippet, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ 
            opacity: [0.3, 0.6, 0.3, 0.7, 0.4],
            scale: [snippet.scale, snippet.scale * 1.05, snippet.scale],
            x: [0, 30, -30, 0],
            y: [0, -40, 40, 0],
            rotate: [0, 3, -3, 0]
          }}
          transition={{
            duration: 20 + Math.random() * 10,
            repeat: Infinity,
            delay: snippet.delay,
            ease: "easeInOut"
          }}
          className={`absolute font-black font-mono select-none tracking-tighter ${snippet.color}`}
          style={{ 
            top: snippet.top, 
            left: snippet.left,
            fontSize: `${20 * snippet.scale}px`,
            textShadow: '0 0 10px currentColor'
          }}
        >
          <motion.span
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 2, delay: snippet.delay + 1, ease: "steps(12)" }}
            className="inline-block overflow-hidden whitespace-nowrap"
          >
            {snippet.text}
          </motion.span>
        </motion.div>
      ))}
      
      {/* Neural Network Connections (Subtle) */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.03] dark:opacity-[0.07]">
        <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
          <path d="M 100 0 L 0 0 0 100" fill="none" stroke="currentColor" strokeWidth="0.5"/>
        </pattern>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* Central focus glow (Cleaned for White Backgrounds) */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(255,255,255,0.8)_100%)] dark:bg-[radial-gradient(circle_at_center,transparent_20%,rgba(15,23,42,0.6)_100%)]" />
    </div>
  );
};

const StaticCodeNebula = () => {
  const codeSnippets = [
    { text: 'async await', color: 'text-emerald-500/20', top: '15%', left: '10%', scale: 1.2 },
    { text: '=>', color: 'text-cyan-400/20', top: '25%', left: '80%', scale: 1.5 },
    { text: '{...}', color: 'text-amber-400/20', top: '65%', left: '15%', scale: 1.3 },
    { text: 'GCC.init()', color: 'text-emerald-400/20', top: '75%', left: '75%', scale: 1.1 },
    { text: 'const', color: 'text-purple-400/20', top: '45%', left: '5%', scale: 1.4 },
    { text: 'return', color: 'text-rose-400/20', top: '10%', left: '60%', scale: 1.2 },
    { text: '<html>', color: 'text-blue-400/20', top: '85%', left: '40%', scale: 1.6 },
  ];

  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-50">
      {codeSnippets.map((snippet, idx) => (
        <div
          key={idx}
          className={`absolute font-black font-mono select-none tracking-tighter ${snippet.color}`}
          style={{ 
            top: snippet.top, 
            left: snippet.left,
            fontSize: `${20 * snippet.scale}px`,
          }}
        >
          {snippet.text}
        </div>
      ))}
    </div>
  );
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

const MobileHero = ({ banners }) => {
  return (
    <section className="md:hidden relative h-[100dvh] flex flex-col items-center justify-center px-6 overflow-hidden bg-white dark:bg-slate-950">
      <StaticCodeNebula />
      
      <div className="relative z-10 flex flex-col items-center text-center gap-12">
        <div className="flex flex-col gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-max mx-auto px-4 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-emerald-500 text-[10px] font-black uppercase tracking-[0.2em]"
          >
            GAT Coding Club
          </motion.div>
          
          <motion.h1 
            id="mobile-hero-title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.1]"
          >
            CODE. <br />
            BUILD. <br />
            <span className="text-emerald-500 underline decoration-4 underline-offset-8">INNOVATE.</span>
          </motion.h1>
        </div>

        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            const el = document.getElementById('about');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          className="px-12 py-5 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-black uppercase tracking-widest shadow-2xl"
        >
          Explore Now
        </motion.button>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 opacity-20">
        <ArrowRight className="w-6 h-6 rotate-90 text-slate-900 dark:text-white" />
      </div>
    </section>
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
          <div className="flex flex-col items-center mt-20 md:mt-24 lg:mt-32">
             <div className="relative mb-6">
                <div className="absolute inset-0 blur-2xl opacity-20 bg-emerald-500 rounded-full animate-pulse" />
             </div>
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
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeTab, setActiveTab] = useState('events');
  const [banners, setBanners] = useState([]);
  const [loadingBanners, setLoadingBanners] = useState(true);
  const [events, setEvents] = useState([]);
  const [domains, setDomains] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [domainsLoading, setDomainsLoading] = useState(true);
  const [rooms, setRooms] = useState([]);
  const [roomsLoading, setRoomsLoading] = useState(true);
  const [leaderboard, setLeaderboard] = useState([]);
  const [leaderboardLoading, setLeaderboardLoading] = useState(true);
  const termRef = useRef(null);
  const domainScrollRef = useRef(null);
  const [isTourRunning, setIsTourRunning] = useState(false);
  const { startHomeTour } = useOnboarding();

  useEffect(() => {
    fetchEvents();
    fetchDomains();
    fetchRooms();
    fetchLeaderboard();
  }, []);

  useEffect(() => {
    // Only start tour if not loading basic data to ensure elements exist
    if (!domainsLoading && !eventsLoading) {
      startHomeTour(
        () => setIsTourRunning(true),
        () => setIsTourRunning(false)
      );
    }
  }, [domainsLoading, eventsLoading]);

  const fetchLeaderboard = async () => {
    try {
      const res = await axios.get('/api/users/leaderboard');
      if (res.data.success) {
        setLeaderboard(res.data.users || []);
      }
    } catch (err) {
      console.error('Error fetching leaderboard', err);
    } finally {
      setLeaderboardLoading(false);
    }
  };

  const fetchEvents = async () => {
    try {
      const res = await axios.get('/api/events');
      if (res.data.success && Array.isArray(res.data.events)) {
        setEvents(res.data.events);
      } else {
        setEvents([]);
      }
    } catch (err) {
      console.error('Error fetching events', err);
    } finally {
      setEventsLoading(false);
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

  const scrollDomains = (direction) => {
    if (domainScrollRef.current) {
      const scrollAmount = window.innerWidth * 1.2;
      domainScrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // Drag-to-scroll functionality for Domains (Desktop & Touch)
  useEffect(() => {
    const slider = domainScrollRef.current;
    if (!slider) return;

    let isDown = false;
    let startX;
    let scrollLeft;

    const startDragging = (x) => {
      isDown = true;
      slider.style.cursor = 'grabbing';
      slider.style.scrollSnapType = 'none'; // Disable snap while dragging for smoothness
      startX = x - slider.offsetLeft;
      scrollLeft = slider.scrollLeft;
    };

    const stopDragging = () => {
      isDown = false;
      slider.style.cursor = 'grab';
      slider.style.scrollSnapType = 'x mandatory'; // Re-enable snap
    };

    const moveDragging = (e, x) => {
      if (!isDown) return;
      e.preventDefault();
      const walk = (x - slider.offsetLeft - startX) * 2.5; 
      slider.scrollLeft = scrollLeft - walk;
    };

    const handleScroll = () => {
      const maxScroll = slider.scrollWidth - slider.clientWidth;
      if (maxScroll <= 0) return;
      const progress = (slider.scrollLeft / maxScroll) * 100;
      setScrollProgress(progress);
    };

    // Mouse Events
    const onMouseDown = (e) => startDragging(e.pageX);
    const onMouseLeave = () => stopDragging();
    const onMouseUp = () => stopDragging();
    const onMouseMove = (e) => moveDragging(e, e.pageX);

    // Touch Events
    const onTouchStart = (e) => startDragging(e.touches[0].pageX);
    const onTouchEnd = () => stopDragging();
    const onTouchMove = (e) => moveDragging(e, e.touches[0].pageX);

    slider.addEventListener('mousedown', onMouseDown);
    slider.addEventListener('mouseleave', onMouseLeave);
    slider.addEventListener('mouseup', onMouseUp);
    slider.addEventListener('mousemove', onMouseMove);

    slider.addEventListener('touchstart', onTouchStart, { passive: false });
    slider.addEventListener('touchend', onTouchEnd);
    slider.addEventListener('touchmove', onTouchMove, { passive: false });

    slider.addEventListener('scroll', handleScroll);

    slider.style.cursor = 'grab';

    return () => {
      slider.removeEventListener('mousedown', onMouseDown);
      slider.removeEventListener('mouseleave', onMouseLeave);
      slider.removeEventListener('mouseup', onMouseUp);
      slider.removeEventListener('mousemove', onMouseMove);

      slider.removeEventListener('touchstart', onTouchStart);
      slider.removeEventListener('touchend', onTouchEnd);
      slider.removeEventListener('touchmove', onTouchMove);

      slider.removeEventListener('scroll', handleScroll);
    };
  }, [domainsLoading]);

  useEffect(() => {
    let interval = setInterval(() => {
      setCounter(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setLoading(false), 500);
          return 100;
        }
        return prev + 4;
      });
    }, 45);

    return () => clearInterval(interval);
  }, []);

  // Hero Reveal Animation
  useEffect(() => {
    if (loading) return;

    const tl = gsap.timeline();
    tl.to('#hero-door-l', { x: '-100%', duration: 1.5, ease: 'power4.inOut', delay: 0.2 })
      .to('#hero-door-r', { x: '100%', duration: 1.5, ease: 'power4.inOut' }, '-=1.5')
      .fromTo('#hero-title', { y: 60, opacity: 0, scale: 0.9 }, { y: 0, opacity: 1, scale: 1, duration: 1.5, ease: 'power4.out' }, '-=0.8')
      .fromTo('#hero-subtitle', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 1.5, ease: 'power4.out' }, '-=1.2')
      .fromTo('#hero-actions', { y: 30, opacity: 0, scale: 0.95 }, { y: 0, opacity: 1, scale: 1, duration: 1.5, ease: 'power4.out' }, '-=1.2');
  }, [loading]);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await axios.get('/api/banners');
        if (res.data.success) setBanners(res.data.banners);
      } catch (err) {
        console.error('Failed to fetch banners:', err);
      } finally {
        setLoadingBanners(false);
      }
    };
    fetchBanners();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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

      // Domain Horizontal Scroll (Desktop)
      if (window.innerWidth >= 1024) {
        const domainContainer = domainScrollRef.current;
        if (domainContainer) {
          gsap.to(domainContainer, {
            x: () => -(domainContainer.scrollWidth - window.innerWidth + window.innerWidth * 0.2),
            ease: 'none',
            scrollTrigger: {
              trigger: '#domains',
              pin: true,
              scrub: 0.5,
              start: 'top top',
              end: () => `+=${domainContainer.scrollWidth * 0.7}`,
              invalidateOnRefresh: true,
            }
          });
        }
      }
      
      // Digital Nexus Reveal Animation
      const nexusReveals = document.querySelectorAll('.nexus-reveal');
      
      // Mobile Wiggle Hint for Domains
      if (window.innerWidth < 1024) {
        const domainContainer = domainScrollRef.current;
        if (domainContainer) {
          gsap.fromTo(domainContainer, 
            { x: 0 },
            { 
              x: -30, 
              duration: 0.5, 
              repeat: 1, 
              yoyo: true, 
              ease: 'power2.inOut',
              scrollTrigger: {
                trigger: '#domains',
                start: 'top 80%',
                once: true
              }
            }
          );
        }
      }

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
      <AnimatePresence>
        {loading && (
          <motion.div 
            key="preloader"
            id="preloader" 
            initial={{ opacity: 1 }}
            exit={{ 
              opacity: 0, 
              scale: 1.05,
              transition: { duration: 0.8, ease: [0.43, 0.13, 0.23, 0.96] } 
            }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-black font-sans select-none overflow-hidden"
          >
            <motion.div 
              initial={{ opacity: 1 }}
              animate={counter === 100 ? { opacity: 0, y: -20 } : {}}
              className="relative flex flex-col items-center max-w-lg w-full px-8 gap-6"
            >
              <div className="flex justify-between items-baseline w-full">
                <span className="text-sm font-mono tracking-widest text-brand font-black uppercase">GAT CLUB</span>
                <span className="text-6xl md:text-8xl font-black font-sans text-slate-900 dark:text-white tracking-tight leading-none tabular-nums select-none flex items-start">
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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={`absolute top-[8rem] left-0 right-0 z-[1001] pointer-events-none transition-opacity duration-500 ${isTourRunning ? 'opacity-0' : 'opacity-100'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pointer-events-auto">
          <BannerSpotlight banners={banners} />
        </div>
      </div>

      {/* DESKTOP HERO */}
      <section id="hero" className={`hidden md:flex relative min-h-[100vh] flex-col items-center justify-center pb-6 px-6 overflow-hidden bg-white dark:bg-slate-950 ${banners.length > 0 ? 'pt-24 md:pt-32' : 'pt-32 md:pt-40'}`}>
        {/* Shutter Doors */}
        <div id="hero-door-l" className="hero-door hero-door-left"></div>
        <div id="hero-door-r" className="hero-door hero-door-right"></div>
        
        {/* Background Layers (Solid White for Desktop) */}
        <div className="absolute inset-0 z-0">
          {/* Technical Grid Overlay */}
          <div className="technical-grid opacity-10 dark:opacity-40" />
        </div>

        {/* Code Nebula Layer (Faded in center) */}
        <CodeNebula />

        <div id="home-content" className="max-w-6xl mx-auto flex flex-col items-center text-center gap-6 w-full relative z-20">
          <div className="flex flex-col gap-6 items-center">
            <h1 id="hero-title" className="font-black tracking-tight leading-[1.1] flex flex-col items-center text-center">
              <span className="text-[#10b981] text-5xl md:text-[72px]">Welcome to GCC.</span>
              <span className="text-[#0f172a] dark:text-white text-5xl md:text-[72px]">Learn Coding.</span>
              <span className="text-[#10b981] text-5xl md:text-[72px]">Build Cool Projects.</span>
            </h1>
            <p id="hero-subtitle" className="text-[#334155] dark:text-slate-300 max-w-2xl text-base md:text-lg font-medium opacity-90 leading-relaxed px-4">
              Unlock your potential at GAT Coding Club. Where innovation meets expertise, and beginners become masters of the digital realm.
            </p>
          </div>

          <div id="hero-actions" className="flex flex-wrap items-center justify-center gap-4 mt-4 px-4">
            <Magnetic strength={0.3}>
              <Link 
                to="/domains"
                className="px-10 py-4 rounded-xl bg-[#10b981] text-white text-xs font-black hover:bg-emerald-600 transition-all shadow-[0_15px_30px_rgba(16,185,129,0.25)] flex items-center gap-3 group uppercase tracking-widest"
              >
                Explore Domains <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Magnetic>
            
            <Magnetic strength={0.2}>
              <button 
                onClick={() => {
                  const el = document.getElementById('about');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-10 py-4 rounded-xl bg-white dark:bg-slate-900 border-2 border-slate-900 dark:border-white/20 text-slate-900 dark:text-white text-xs font-black flex items-center gap-3 hover:bg-slate-50 transition-all uppercase tracking-widest"
              >
                Our Mission
              </button>
            </Magnetic>
          </div>
        </div>
      </section>

      {/* MOBILE HERO (The Magnet) */}
      <MobileHero banners={banners} />
      {/* Stats Overlay for Desktop */}
      <div className="hidden lg:block pointer-events-none relative">
        <div className="absolute right-[4vw] bottom-[10dvh] flex flex-col gap-8 items-end text-right z-30">
           <div className="flex flex-col gap-1.5 group animate-on-scroll items-end text-right">
             <div className="w-6 h-[2px] bg-emerald-500 mb-1"></div>
             <span className="text-4xl font-black text-slate-900 dark:text-white leading-none">500+</span>
             <span className="text-[9px] font-black tracking-[0.2em] text-slate-400 uppercase">Members</span>
           </div>
           <div className="flex flex-col gap-1.5 group animate-on-scroll items-end text-right">
             <div className="w-6 h-[2px] bg-emerald-500 mb-1"></div>
             <span className="text-4xl font-black text-slate-900 dark:text-white leading-none">15+</span>
             <span className="text-[9px] font-black tracking-[0.2em] text-slate-400 uppercase">Projects</span>
           </div>
        </div>
      </div>

      <section id="about" className="relative z-10 py-16 md:py-32 px-4 sm:px-6 border-t border-black/5 dark:border-white/5 select-none overflow-hidden">
        <div className="absolute inset-0 bg-white/40 dark:bg-slate-950/40 backdrop-blur-[60px] z-0" />
        
        <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-12 md:gap-16 items-start relative z-10">
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

            <div className="lg:col-span-7 flex flex-col gap-8 md:gap-12">
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

      {/* Domains Section */}
      <section id="domains" className="relative py-24 md:py-0 overflow-hidden bg-slate-50 dark:bg-[#050811] z-20">
         <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.03] dark:opacity-[0.05]" />
        {/* Header Section */}
        <div className="max-w-7xl mx-auto mb-12 md:mb-3 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="flex flex-col gap-4 max-w-2xl animate-on-scroll">
            <div className="flex items-center gap-3">
              <div className="w-8 h-[2px] bg-emerald-500"></div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500">The Ecosystem</span>
            </div>
            <h2 className="text-3xl md:text-6xl font-black tracking-tighter text-slate-900 dark:text-white leading-[0.9] uppercase char-reveal">
              Specialized <span className="text-emerald-500">Domains</span>
            </h2>
            <p className="text-slate-500 dark:text-slate-400 font-bold text-[11px] md:text-xs max-w-lg leading-relaxed">
              Explore our elite vertical divisions. Dedicated ecosystems of tools, mentorship, and high-impact projects.
            </p>
          </div>
          
          {/* Custom Navigation */}
          <div className="flex gap-3 animate-on-scroll">
            <button 
              onClick={() => scrollDomains('left')}
              className="group w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-900 border border-black/5 dark:border-white/10 flex items-center justify-center text-slate-400 hover:text-emerald-500 transition-all active:scale-95"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            </button>
            <button 
              onClick={() => scrollDomains('right')}
              className="group w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20 hover:scale-105 transition-all active:scale-95"
            >
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>

        {/* Horizontal Domain Scroll Container */}
        <div 
          ref={domainScrollRef}
          className="domain-scroll-container relative flex items-start gap-5 md:gap-6 px-6 md:px-[6vw] overflow-x-auto snap-x snap-mandatory no-scrollbar pb-12"
        >
          {domainsLoading ? (
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="glass-panel h-[350px] min-w-[280px] md:min-w-[350px] animate-pulse bg-slate-100 dark:bg-slate-900/50 rounded-[2rem]" />
            ))
          ) : domains.length === 0 ? (
            <div className="w-full py-20 text-center">
               <Zap className="w-10 h-10 text-slate-200 dark:text-slate-800 mx-auto mb-4" />
               <h3 className="text-lg font-black text-slate-300 dark:text-slate-700 uppercase tracking-widest">No Active Sectors Found</h3>
            </div>
          ) : (
            domains.map((domain, idx) => (
              <div 
                key={domain._id} 
                className="group relative flex flex-col h-[380px] md:h-[420px] min-w-[75vw] md:min-w-[350px] rounded-[2rem] overflow-hidden bg-slate-50 dark:bg-slate-900/40 border border-black/5 dark:border-white/5 hover:border-emerald-500/30 transition-all duration-700 hover:shadow-xl hover:shadow-emerald-500/10 snap-center"
              >
                {/* Visual Accent */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-bl-[100%] transition-all duration-700" />
                
                {/* Content Container */}
                <div className="relative z-10 flex flex-col h-full p-6 md:p-10 justify-between">
                  <div className="flex flex-col gap-6">
                    <div className={`w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 shadow-md group-hover:scale-110 transition-all duration-700`}>
                      {IconMap[domain.icon] || <Layers className="w-7 h-7" />}
                    </div>
                    
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center gap-2">
                         <div className="w-1 h-1 rounded-full bg-emerald-500" />
                         <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Sector Active</span>
                      </div>
                      <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white leading-tight tracking-tight uppercase group-hover:text-emerald-500 transition-colors">
                        {domain.title}
                      </h3>
                      <p className="text-[11px] md:text-xs font-bold text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3">
                        {domain.desc}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4 pt-6 border-t border-black/5 dark:border-white/5">
                    <div className="grid grid-cols-2 gap-3">
                      <Link 
                        to={`/register/domain/${domain._id}`} 
                        className="py-3 rounded-xl bg-slate-950 dark:bg-white text-white dark:text-slate-950 text-[9px] font-black tracking-widest uppercase hover:scale-[1.02] active:scale-[0.98] transition-all text-center flex items-center justify-center gap-2"
                      >
                        JOIN <Zap className="w-2.5 h-2.5 text-emerald-500" />
                      </Link>
                      <Link 
                        to={`/domain/${domain.slug}`} 
                        className="py-3 rounded-xl bg-white dark:bg-slate-800 border border-black/5 dark:border-white/5 text-slate-900 dark:text-white text-[9px] font-black tracking-widest uppercase hover:bg-slate-50 dark:hover:bg-slate-700 transition-all text-center flex items-center justify-center"
                      >
                        DETAILS
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Scroll Hint */}
        <div className="flex flex-col items-center gap-4">
          <div className="w-32 h-[1px] bg-slate-100 dark:bg-slate-900 relative overflow-hidden">
             <motion.div 
               className="absolute top-0 left-0 h-full bg-emerald-500" 
               animate={{ width: `${Math.max(10, scrollProgress)}%` }}
               transition={{ type: 'spring', damping: 20, stiffness: 100 }}
             />
          </div>
          <span className="text-[8px] font-black uppercase tracking-[0.5em] text-slate-400 animate-pulse">Swipe Horizontal</span>
        </div>
      </section>

      {/* Events Section */}
      <section id="events" className="relative py-32 bg-white dark:bg-black overflow-hidden z-20">
         <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
          {/* Header with Admin Shortcut */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 animate-on-scroll">
            <div className="flex flex-col gap-6 max-w-2xl">
              <div className="flex items-center gap-3">
                <div className="w-12 h-[2px] bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.4em] text-emerald-500">System Activity Log</span>
              </div>
              <h2 className="text-5xl md:text-8xl font-black tracking-tighter text-slate-900 dark:text-white leading-[0.85] uppercase char-reveal">
                Latest <span className="text-emerald-500">Activities</span>
              </h2>
              <p className="text-slate-500 dark:text-slate-400 font-bold text-sm md:text-base max-w-lg leading-relaxed">
                The heartbeat of GAT Coding Club. From high-stakes hackathons to precision workshops and elite recruitment drives.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <Link 
                to="/events" 
                className="group flex items-center gap-4 px-10 py-5 rounded-2xl bg-emerald-500 text-white font-black text-[11px] tracking-widest uppercase shadow-2xl shadow-emerald-500/30 hover:scale-105 transition-all"
              >
                <span>Full Event Archive</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Dynamic Event Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 mt-20">
            {eventsLoading ? (
              Array(3).fill(0).map((_, i) => (
                <div key={i} className="glass-panel h-[500px] animate-pulse bg-slate-100 dark:bg-slate-900/50 rounded-[3rem]" />
              ))
            ) : events.length === 0 ? (
              <div className="col-span-full py-32 text-center">
                 <Zap className="w-16 h-16 text-slate-200 dark:text-slate-800 mx-auto mb-6" />
                 <h3 className="text-2xl font-black text-slate-300 dark:text-slate-700 uppercase tracking-widest">No Active Transmissions</h3>
              </div>
            ) : (
              events
                .filter(ev => ev.isActive !== false)
                .slice(0, 3)
                .map((item, idx) => (
                  <div 
                    key={item._id} 
                    className="group relative flex flex-col h-[520px] md:h-[600px] rounded-[3rem] overflow-hidden bg-slate-50 dark:bg-slate-900/40 border border-black/5 dark:border-white/5 hover:border-emerald-500/30 transition-all duration-700 hover:-translate-y-4 hover:shadow-2xl hover:shadow-emerald-500/10 animate-on-scroll"
                    style={{ transitionDelay: `${idx * 100}ms` }}
                  >
                    {/* Background Image with Parallax-like Effect */}
                    <div className="absolute inset-0 z-0">
                      <img 
                        src={item.image || 'https://via.placeholder.com/800x1200'} 
                        alt={item.title} 
                        className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000 opacity-40 dark:opacity-30" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent dark:from-slate-950 dark:via-slate-950/80 dark:to-transparent" />
                    </div>

                    {/* Content Overlay */}
                    <div className="relative z-10 flex flex-col h-full p-8 md:p-12 justify-end gap-8">
                       <div className="flex flex-col gap-4">
                          <div className="flex items-center gap-3">
                             <span className="px-4 py-1.5 rounded-full bg-emerald-500 text-white text-[9px] font-black tracking-widest uppercase shadow-lg shadow-emerald-500/20">
                               {item.type || 'Event'}
                             </span>
                             <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/50 dark:bg-white/5 backdrop-blur-md border border-black/5 dark:border-white/10">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-[9px] font-black text-slate-600 dark:text-slate-300 uppercase tracking-widest">{item.category}</span>
                             </div>
                          </div>
                          
                          <h3 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white leading-[0.95] tracking-tighter uppercase group-hover:text-emerald-500 transition-colors">
                            {item.title}
                          </h3>
                       </div>

                       <p className="text-sm font-bold text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                          {item.description || "An elite technical gathering hosted by GAT Coding Club."}
                       </p>

                       <div className="flex flex-col gap-6 pt-6 border-t border-black/5 dark:border-white/5">
                          <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                             <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-emerald-500" />
                                <span>{new Date(item.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                             </div>
                             <div className="flex items-center gap-2">
                                <Globe className="w-4 h-4 text-emerald-500" />
                                <span>{item.venue}</span>
                             </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                             <Link 
                               to={`/register/event/${item._id}`}
                               className="py-4 rounded-2xl bg-slate-950 dark:bg-white text-white dark:text-slate-950 text-[10px] font-black tracking-widest uppercase hover:scale-[1.02] active:scale-[0.98] transition-all text-center flex items-center justify-center gap-2 group/btn shadow-xl"
                             >
                               Register <Zap className="w-3 h-3 text-emerald-500" />
                             </Link>
                             
                             <Link 
                               to={`/event/${item._id}`}
                               className="py-4 rounded-2xl bg-white dark:bg-slate-800 border border-black/5 dark:border-white/5 text-slate-900 dark:text-white text-[10px] font-black tracking-widest uppercase hover:bg-slate-50 dark:hover:bg-slate-700 transition-all text-center flex items-center justify-center"
                             >
                               Details
                             </Link>
                          </div>
                       </div>
                    </div>

                    {/* Elite Corner Decoration */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-bl-[100%] transition-all duration-700 group-hover:bg-emerald-500/10" />
                  </div>
                ))
            )}
          </div>
        </div>
      </section>

      {/* Coding Hub / Live Rooms Teaser */}
      <section id="live-rooms-preview" className="relative py-32 overflow-hidden bg-slate-900 z-20">
        <div className="absolute inset-0 bg-slate-900" />
        <div className="max-w-6xl mx-auto px-6 flex flex-col lg:flex-row gap-12 lg:gap-20 items-center animate-on-scroll relative z-10">
          <div className="flex-1 flex flex-col gap-6 order-2 lg:order-1">
              <span className="text-xs font-bold uppercase tracking-widest text-brand flex items-center gap-2">
                <Video className="w-3.5 h-3.5" /> Live Community Arena
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-white">
                Join Active{' '}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-cyan-500">
                  Live
                </span>{' '}
                Sessions
              </h2>
              <p className="text-sm md:text-base font-medium text-slate-400 leading-relaxed max-w-md">
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

              <Link to="/live-rooms" className="w-max px-8 py-4 rounded-full bg-white text-slate-900 text-sm font-black flex items-center gap-2 hover:scale-105 transition-all shadow-xl hover:shadow-emerald-500/20 uppercase tracking-widest">
                Enter Arena <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="flex-1 w-full max-w-lg order-1 lg:order-2">
              <div className="glass-panel p-6 md:p-8 flex flex-col gap-6 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand/10 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-brand/20 transition-colors" />
                
                <div className="flex items-center justify-between relative z-10">
                  <div className="flex gap-2">
                    <span className="px-3 py-1 rounded-full text-[10px] font-black border bg-emerald-500/10 text-emerald-600 border-emerald-500/20 uppercase tracking-widest animate-pulse">Live</span>
                    <span className="px-3 py-1 rounded-full text-[10px] font-black border bg-slate-800 text-slate-300 border-white/5 uppercase tracking-widest">Coding Room</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <Users className="w-4 h-4" />
                    <span className="text-xs font-black">12 Active</span>
                  </div>
                </div>

                <div className="space-y-4 relative z-10">
                  <h4 className="text-xl font-black text-white uppercase tracking-tight">System Architecture Deep Dive</h4>
                  <div className="flex -space-x-3">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="w-10 h-10 rounded-full border-4 border-slate-900 bg-slate-800 overflow-hidden">
                        <img src={`https://i.pravatar.cc/150?u=${i}`} alt="user" className="w-full h-full object-cover" />
                      </div>
                    ))}
                    <div className="w-10 h-10 rounded-full border-4 border-slate-900 bg-brand text-white flex items-center justify-center text-[10px] font-black">+8</div>
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
            </div>
          </div>
        </div>
      </section>

      <QuizSection />

      {/* 7. Premium SaaS-style Leaderboard Table Section */}
      <section id="leaderboard" className="py-24 md:py-48 px-4 sm:px-6 relative z-10 overflow-hidden bg-slate-50 dark:bg-slate-950/50">
        <div className="max-w-6xl mx-auto flex flex-col gap-20 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 animate-on-scroll">
            <div className="flex flex-col gap-6 max-w-2xl">
              <div className="flex items-center gap-3">
                <div className="w-12 h-[2px] bg-brand shadow-[0_0_10px_rgba(var(--brand-rgb),0.5)]"></div>
                <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.4em] text-brand">Global Rankings</span>
              </div>
              <h2 className="text-5xl md:text-8xl font-black tracking-tighter text-slate-900 dark:text-white leading-[0.85] uppercase char-reveal">
                Elite <span className="text-brand">Leaderboard</span>
              </h2>
              <p className="text-slate-500 dark:text-slate-400 font-bold text-sm md:text-base max-w-lg leading-relaxed">
                The absolute vanguard of technical excellence. Track the top performers as they compete for dominance in the GAT ecosystem.
              </p>
            </div>
          </div>

          <div className="glass-panel overflow-hidden border-black/5 dark:border-white/5 bg-white/50 dark:bg-slate-900/50 backdrop-blur-3xl rounded-[3rem] shadow-2xl animate-on-scroll">
            <div className="overflow-x-auto scrollbar-hide">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-black/5 dark:border-white/10 bg-black/5 dark:bg-white/5">
                    <th className="px-8 py-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Rank</th>
                    <th className="px-8 py-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Operator</th>
                    <th className="px-8 py-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-right">XP Credits</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5 dark:divide-white/5">
                  {leaderboardLoading ? (
                    Array(4).fill(0).map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        <td className="px-8 py-8"><div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-lg" /></td>
                        <td className="px-8 py-8"><div className="w-48 h-10 bg-slate-100 dark:bg-slate-800 rounded-lg" /></td>
                        <td className="px-8 py-8"><div className="w-20 h-10 bg-slate-100 dark:bg-slate-800 rounded-lg" /></td>
                      </tr>
                    ))
                  ) : (leaderboard || []).length === 0 ? (
                    <tr>
                      <td colSpan="3" className="px-8 py-20 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">No Rankings Recorded Yet</td>
                    </tr>
                  ) : (
                    leaderboard.slice(0, 10).map((row, idx) => {
                      const rankNum = (idx + 1).toString().padStart(2, '0');
                      const rankColor = idx === 0 ? 'text-brand' : idx === 1 ? 'text-emerald-500' : idx === 2 ? 'text-blue-500' : 'text-slate-300 dark:text-slate-700';
                      
                      return (
                        <tr key={row._id} className="group hover:bg-brand/5 transition-all duration-300">
                          <td className="px-8 py-8">
                            <span className={`text-2xl font-black tracking-tighter ${rankColor}`}>
                              {rankNum}
                            </span>
                          </td>
                          <td className="px-8 py-8">
                            <div className="flex items-center gap-5">
                              <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-black text-slate-400 border border-black/5 dark:border-white/10 group-hover:border-brand/30 transition-all overflow-hidden shadow-sm">
                                 {row.avatar ? (
                                   <img src={row.avatar} className="w-full h-full object-cover" alt="" />
                                 ) : (
                                   row.name.charAt(0)
                                 )}
                              </div>
                              <div className="flex flex-col">
                                <span className="text-base font-black text-slate-900 dark:text-white uppercase tracking-tight group-hover:text-brand transition-colors">{row.name}</span>
                                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.1em]">{row.department} • {row.year}</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-8 text-right">
                            <div className="flex flex-col items-end">
                               <span className="text-xl font-black text-slate-900 dark:text-white tracking-tighter group-hover:text-brand transition-all">
                                 {row.totalPoints || 0}
                               </span>
                               <div className="w-24 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full mt-2 overflow-hidden">
                                  <div className="h-full bg-brand rounded-full" style={{ width: `${Math.min(100, (row.totalPoints / 1000) * 100)}%` }} />
                               </div>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
            
            <div className="p-8 bg-black/5 dark:bg-white/5 flex items-center justify-center">
               <button className="text-[10px] font-black text-brand uppercase tracking-[0.3em] hover:underline flex items-center gap-2">
                  View Full Global Index <ArrowRight className="w-4 h-4" />
               </button>
            </div>
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

      {/* Footer is handled globally in App.jsx */}
    </div>
  );
}
