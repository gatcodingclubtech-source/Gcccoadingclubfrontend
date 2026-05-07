import React, { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import DrGirish from './assets/Dr. Girish Rao Salanke N S.png';
import ProfAshoka from './assets/Prof. Ashoka S.png';
import ProfRavindranath from './assets/Prof. R C Ravindranath.png';
import ProfSharadadevi from './assets/Prof. Sharadadevi Kaganurmath.png';
import ProfSharmila from './assets/Prof. Sharmila Chidaravalli.png';
import ProfVasugi from './assets/Prof. Vasugi I.png';
import RecruitmentBanner from './assets/banners/gcc-club-recruitment-instagram.webp';
import WorkshopBanner1 from './assets/banners/workshop 1.webp';
import GccLogo from './assets/gcc logo 1.svg';
import { 
  Code, Menu, X, ArrowRight, Sun, Moon, Sparkles, Terminal as TerminalIcon, Shield, Layers, Award, Users, ChevronRight, Check, Calendar, Globe
} from 'lucide-react';

const Github = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
);

const Instagram = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
);

const Linkedin = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
);

const SplitText = ({ text, className }) => {
  return (
    <span className={`inline-block ${className}`}>
      {text.split('').map((char, i) => (
        <span key={i} className="char inline-block whitespace-pre">
          {char}
        </span>
      ))}
    </span>
  );
};

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const [theme, setTheme] = useState('light');
  const [loading, setLoading] = useState(true);
  const [counter, setCounter] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [eventCategory, setEventCategory] = useState('all');
  const [eventTimeFilter, setEventTimeFilter] = useState('all');
  const [navVisible, setNavVisible] = useState(true);
  const [visibleEvents, setVisibleEvents] = useState(3);
  const [showAllDomains, setShowAllDomains] = useState(false);

  // Scroll Tracker for Navbar Hiding/Showing
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setNavVisible(false); // scrolling down
      } else {
        setNavVisible(true); // scrolling up
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Terminal State
  const [terminalHistory, setTerminalHistory] = useState([
    { text: 'Starting GAT Club System...', type: 'system' },
    { text: 'Type "help" to see what you can do.', type: 'info' }
  ]);
  const [terminalInput, setTerminalInput] = useState('');
  const termRef = useRef(null);

  // Theme Toggler
  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Preloader Countdown Simulation
  useEffect(() => {
    document.documentElement.classList.remove('dark'); // light mode by default
    
    let interval = setInterval(() => {
      setCounter(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          // Wait a fraction of a second and trigger the shutter door sequence
          setTimeout(() => {
            const tl = gsap.timeline();
            tl.to('#preloader-content', { opacity: 0, y: -20, duration: 0.5, ease: 'power2.inOut' })
              .to('#preloader-line-fill', { scaleX: 1.2, opacity: 0, duration: 0.4, ease: 'power2.inOut' }, '-=0.2')
              .to('#preloader', { opacity: 0, scale: 0.98, duration: 0.6, ease: 'power2.inOut', onComplete: () => {
                setLoading(false);
                const preloaderEl = document.getElementById('preloader');
                if (preloaderEl) preloaderEl.style.display = 'none';
                // Trigger Entrance Animations once preloader clears
                gsap.fromTo('#hero-title', { y: 60, opacity: 0, scale: 0.9 }, { y: 0, opacity: 1, scale: 1, duration: 1.5, ease: 'power4.out' });
                gsap.fromTo('#hero-desc', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 1.5, delay: 0.15, ease: 'power4.out' });
                gsap.fromTo('#hero-cta', { y: 30, opacity: 0, scale: 0.95 }, { y: 0, opacity: 1, scale: 1, duration: 1.5, delay: 0.3, ease: 'power4.out' });
                gsap.fromTo('#hero-terminal', { x: 60, opacity: 0, rotateY: -10 }, { x: 0, opacity: 1, rotateY: 0, duration: 1.5, delay: 0.4, ease: 'power4.out' });
              }});
          }, 300);
          return 100;
        }
        return prev + 4;
      });
    }, 45);

    return () => clearInterval(interval);
  }, []);

  // 1. Smooth Scroll Initialization (Once)
  useEffect(() => {
    if (loading) return;
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => lenis.destroy();
  }, [loading]);

  // 2. GSAP & ScrollTrigger Initialization (When content changes)
  useEffect(() => {
    if (loading) return;

    const ctx = gsap.context(() => {
      // Character Reveal Animations for Headings
      gsap.utils.toArray('.char-reveal').forEach((heading) => {
        const chars = heading.querySelectorAll('.char');
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

      // Scroll-linked Glow Highlight for Descriptions
      gsap.utils.toArray('.text-glow-scroll').forEach((text) => {
        gsap.to(text, {
          backgroundSize: '100% 100%',
          ease: 'none',
          scrollTrigger: {
            trigger: text,
            start: 'top 80%',
            end: 'top 20%',
            scrub: true,
          }
        });
      });

      // Section Content animations (Cards, etc)
      gsap.utils.toArray('section').forEach((section) => {
        const elements = section.querySelectorAll('.animate-on-scroll:not(.char-reveal)');
        if (elements.length > 0) {
          gsap.fromTo(elements, 
            { y: 60, opacity: 0, scale: 0.98 },
            { 
              y: 0, 
              opacity: 1, 
              scale: 1,
              duration: 1.2,
              stagger: { amount: 0.4, ease: "power2.out" },
              ease: 'power4.out',
              scrollTrigger: {
                trigger: section,
                start: window.innerWidth < 768 ? 'top 95%' : 'top 85%',
                end: 'bottom 15%',
                toggleActions: 'play reverse play reverse',
              }
            }
          );
        }
      });

      // Pinned Layouts (Desktop Only)
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
          trigger: '#home',
          start: 'top top',
          endTrigger: '#about',
          end: 'top top',
          pin: true,
          pinSpacing: false,
          invalidateOnRefresh: true,
        });

        gsap.to('#home-content', {
          scrollTrigger: {
            trigger: '#hero-terminal',
            start: 'bottom top',
            endTrigger: '#about',
            end: 'top top',
            scrub: true,
          },
          scale: 0.9,
          opacity: 0.3,
          ease: 'none',
        });
      }
    });

    // Final refresh to catch all dynamic heights
    ScrollTrigger.refresh();

    return () => ctx.revert();
  }, [loading, showAllDomains, visibleEvents]);


  // Terminal Auto Scroll to bottom
  useEffect(() => {
    if (termRef.current) {
      termRef.current.scrollTop = termRef.current.scrollHeight;
    }
  }, [terminalHistory]);

  // Terminal Command Parser
  const handleTerminalCommand = (e) => {
    if (e.key === 'Enter') {
      const cmd = terminalInput.trim().toLowerCase();
      setTerminalInput('');

      let response = [];
      if (cmd === 'help') {
        response = [
          { text: '> help', type: 'command' },
          { text: 'Available commands: about, events, clear, join, sudo', type: 'info' }
        ];
      } else if (cmd === 'about') {
        response = [
          { text: '> about', type: 'command' },
          { text: 'The GAT Coding Club is a group of students who love technology and building cool projects.', type: 'info' }
        ];
      } else if (cmd === 'events') {
        response = [
          { text: '> events', type: 'command' },
          { text: 'Check the Events Radar below! Upcoming: 404 Hackathon and Workshop.', type: 'info' }
        ];
      } else if (cmd === 'clear') {
        setTerminalHistory([]);
        return;
      } else if (cmd === 'join') {
        response = [
          { text: '> join', type: 'command' },
          { text: 'Starting onboarding... Welcome to the club!', type: 'success' }
        ];
      } else if (cmd.startsWith('sudo')) {
        response = [
          { text: `> ${cmd}`, type: 'command' },
          { text: 'Access denied: You don\'t have permission to do that.', type: 'error' }
        ];
      } else if (cmd === '') {
        return;
      } else {
        response = [
          { text: `> ${cmd}`, type: 'command' },
          { text: `Command not found: "${cmd}". Type "help" to see valid commands.`, type: 'error' }
        ];
      }

      setTerminalHistory(prev => [...prev, ...response]);
    }
  };

  return (
    <div className="relative font-sans select-none overflow-x-hidden min-h-screen">
      {/* Dynamic Background Mesh & Watermark */}
      <div className="bg-mesh-grid"></div>
      <div className="bg-mesh-gradient"></div>
      <div className="gcc-watermark font-black select-none">GCC</div>

      {/* 1. Ultra-Premium Horizon Warp Preloader */}
      <div id="preloader" className="fixed inset-0 z-[100] flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100 font-sans select-none overflow-hidden transition-all duration-700">
        <div id="preloader-content" className="relative flex flex-col items-center max-w-lg w-full px-8 gap-6">
          {/* Elite big numbers */}
          <div className="flex justify-between items-baseline w-full">
            <span className="text-sm font-mono tracking-widest text-brand font-black uppercase">GAT CLUB</span>
            <span className="text-6xl md:text-8xl font-black font-sans text-slate-900 tracking-tight leading-none tabular-nums select-none flex items-start">
              {counter < 10 ? `0${counter}` : counter}
              <span className="text-xl md:text-2xl text-brand font-light ml-1">%</span>
            </span>
          </div>

          {/* Futuristic luminous bar */}
          <div className="w-full h-1.5 md:h-2 bg-slate-200/80 rounded-full overflow-hidden backdrop-blur-md border border-black/5 relative flex items-center">
            <div 
              id="preloader-line-fill" 
              className="h-full bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-400 rounded-full transition-all duration-300 ease-out flex items-center justify-end relative select-none"
              style={{ width: `${counter}%` }}
            >
              <div className="w-4 h-4 rounded-full bg-white absolute -right-1 filter drop-shadow-[0_0_10px_#2997ff]"></div>
            </div>
          </div>

          {/* Bottom simulated terminal-like logs */}
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

      {/* 2. Responsive White Translucent Glowing Navbar */}
      <nav className={`fixed top-6 w-full z-50 px-6 transition-all duration-500 ease-in-out ${navVisible ? 'translate-y-0 opacity-100' : '-translate-y-24 opacity-0'}`} id="navbar">
        <div className="max-w-6xl mx-auto navbar-glow-glass rounded-[2rem] px-6 py-4 flex justify-between items-center relative z-20">
          <a href="#" className="flex items-center group">
            <img src={GccLogo} alt="GAT Coding Club" className="h-12 md:h-14 w-auto group-hover:scale-110 transition-transform duration-500" />
          </a>

          {/* Desktop Nav links with Characterwise hover rolling effect */}
          <div className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-700 dark:text-slate-200">
            {['Home', 'About', 'Workflow', 'Events', 'Leaderboard', 'Team'].map((item) => (
              <a
                key={item}
                href={`#${item === 'Workflow' ? 'domains' : item.toLowerCase()}`}
                className="nav-link-rolling text-slate-900 dark:text-slate-100 hover:text-brand transition-colors relative"
              >
                <span data-text={item === 'Workflow' ? 'Domains' : item}>{item === 'Workflow' ? 'Domains' : item}</span>
              </a>
            ))}
          </div>

          <div className="flex items-center gap-4">
            {/* Theme Toggle Switch */}
            <button
              onClick={toggleTheme}
              className="w-10 h-10 flex items-center justify-center rounded-full border border-black/10 dark:border-white/10 hover:bg-slate-200 dark:hover:bg-slate-800 transition-all text-slate-900 dark:text-white"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Magnetic CTA desktop */}
            <div className="hidden md:block">
              <button className="px-6 py-3 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-bold transition-transform hover:scale-105 shadow-xl">
                Join Club
              </button>
            </div>

            {/* Mobile menu hamburger toggle */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden w-10 h-10 flex items-center justify-center rounded-full border border-black/10 dark:border-white/10 text-slate-900 dark:text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown container (Extreme white high-contrast bg on light) */}
        {mobileMenuOpen && (
          <div id="mobile-menu" className="md:hidden absolute top-full left-6 right-6 mt-4 bg-white dark:bg-slate-900 border border-black/10 dark:border-white/10 rounded-[2rem] px-8 py-6 flex flex-col gap-4 text-center text-slate-900 dark:text-white shadow-2xl z-50 backdrop-blur-3xl">
            {['Home', 'About', 'Workflow', 'Events', 'Leaderboard', 'Team'].map((item) => (
              <a 
                key={item}
                href={`#${item === 'Workflow' ? 'domains' : item.toLowerCase()}`} 
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 font-black text-slate-900 dark:text-white hover:text-brand transition-colors mobile-nav-link"
              >
                {item === 'Workflow' ? 'Domains' : item}
              </a>
            ))}
            <button className="px-6 py-3 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-bold transition-transform hover:scale-105 shadow-xl mt-2 w-full">
              Join Club
            </button>
          </div>
        )}
      </nav>

      {/* 3. Hero Section (Split Interactive Desktop Grid Layout) */}
      <section className="min-h-screen relative flex items-center justify-center px-6 pt-32 pb-32 md:pb-40 overflow-hidden z-10" id="home">
        <div id="home-content" className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-12 lg:gap-16 items-center w-full">
          {/* Left Column Text / CTAs */}
          <div className="lg:col-span-7 flex flex-col gap-6 md:gap-8 max-w-2xl text-left">
            <span className="text-xs md:text-sm font-bold uppercase tracking-widest text-brand bg-brand/5 dark:bg-brand/10 border border-brand/20 rounded-full px-4 py-2 self-start flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5" /> GAT CODING CLUB
            </span>
            <h1 id="hero-title" className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-tight md:leading-none text-slate-900 dark:text-white char-reveal">
              <SplitText text="Learn Coding. Build " />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500">
                <SplitText text="Cool Projects." />
              </span>
            </h1>
            <p id="hero-desc" className="text-base md:text-lg font-medium text-slate-600 dark:text-slate-400 max-w-xl animate-on-scroll">
              GAT Coding Club helps students learn by building projects and working together. Join us to grow your skills and build a great future.
            </p>
            <div id="hero-cta" className="flex flex-wrap items-center gap-4 mt-2">
              <button className="px-8 py-4 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-black flex items-center gap-2 hover:scale-105 transition-all shadow-xl">
                See Our Projects <ArrowRight className="w-4 h-4" />
              </button>
              <button className="px-8 py-4 rounded-full bg-slate-200/50 dark:bg-slate-800/40 border border-black/5 dark:border-white/5 backdrop-blur-md text-slate-900 dark:text-white text-sm font-bold flex items-center gap-2 hover:bg-slate-200 dark:hover:bg-slate-800 transition-all">
                Learn More
              </button>
            </div>
          </div>

          {/* Right Column Interactive macOS Hacker Terminal */}
          <div id="hero-terminal" className="lg:col-span-5 relative w-full h-[360px] md:h-[420px] rounded-[2.5rem] bg-slate-950 text-white font-mono flex flex-col overflow-hidden border border-white/10 terminal-premium-shadow select-none">
            <div className="h-10 md:h-12 bg-slate-900/80 border-b border-white/5 px-4 md:px-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500"></span>
                <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                <span className="w-3 h-3 rounded-full bg-green-500"></span>
              </div>
              <span className="text-xs md:text-sm text-slate-400 select-none flex items-center gap-2">
                <TerminalIcon className="w-3.5 h-3.5 text-cyan-400" /> user@gat-core:~
              </span>
              <div className="w-4"></div>
            </div>

            {/* Terminal Parser Feed */}
            <div className="flex-1 p-4 md:p-6 overflow-y-auto flex flex-col gap-2 text-xs md:text-sm leading-relaxed" ref={termRef}>
              {terminalHistory.map((item, idx) => (
                <div key={idx} className={`${item.type === 'system' ? 'text-indigo-400' : item.type === 'success' ? 'text-green-400' : item.type === 'error' ? 'text-red-400' : item.type === 'command' ? 'text-brand' : 'text-slate-200'}`}>
                  {item.text}
                </div>
              ))}
            </div>

            {/* Interactive console CLI prompt row */}
            <div className="h-10 md:h-12 border-t border-white/5 bg-slate-900/50 px-4 md:px-6 flex items-center gap-3">
              <span className="text-brand font-bold flex items-center gap-1 select-none">
                <ChevronRight className="w-4 h-4" /> gat
              </span>
              <input
                type="text"
                autoFocus
                autoComplete="off"
                spellCheck="false"
                className="flex-1 bg-transparent border-none outline-none font-mono text-xs md:text-sm text-slate-100 select-all"
                value={terminalInput}
                onChange={(e) => setTerminalInput(e.target.value)}
                onKeyDown={handleTerminalCommand}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 4. Pinned Left / Scrolling Right About Section */}
      <section id="about" className="relative z-30 bg-slate-50 dark:bg-slate-950 py-24 md:py-32 px-6 border-t border-black/5 dark:border-white/5 select-none">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-12 md:gap-16 items-start">
          {/* Pinned Left Side Content */}
          <div id="about-left" className="lg:col-span-5 self-start flex flex-col gap-6 md:gap-8 animate-on-scroll">
            <span className="text-xs md:text-sm font-bold uppercase tracking-widest text-brand flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" /> WHO WE ARE
            </span>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-tight text-slate-900 dark:text-white char-reveal">
              <SplitText text="About Our " />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                <SplitText text="Club" />
              </span>
            </h2>
            <p className="text-sm md:text-base font-medium text-slate-600 dark:text-slate-400 leading-relaxed text-glow-scroll">
              We are a group of students who love technology. We work together to learn new skills and build amazing software projects.
            </p>
            <p className="text-sm md:text-base font-medium text-slate-600 dark:text-slate-400 leading-relaxed text-glow-scroll">
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

      {/* 5. Horizontal Workflow Showcase Section */}
      <section id="domains" className="py-24 md:py-32 px-6 scroll-fade-in relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col gap-4 text-left max-w-2xl mb-12 md:mb-16 animate-on-scroll">
            <span className="text-xs md:text-sm font-bold uppercase tracking-widest text-brand">Our Domains</span>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-tight text-slate-900 dark:text-white char-reveal">
              <SplitText text="Our Areas of Expertise" />
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[
              { 
                title: 'Web Development', 
                icon: <Code className="w-6 h-6" />, 
                color: 'blue', 
                desc: 'Build modern, responsive websites using the latest frameworks and cloud technologies.' 
              },
              { 
                title: 'AI / ML', 
                icon: <Sparkles className="w-6 h-6" />, 
                color: 'purple', 
                desc: 'Dive into the world of Artificial Intelligence and Machine Learning to build smart systems.' 
              },
              { 
                title: 'Competitive Coding', 
                icon: <TerminalIcon className="w-6 h-6" />, 
                color: 'cyan', 
                desc: 'Master algorithms and data structures to solve complex problems and win competitions.' 
              },
              { 
                title: 'App Development', 
                icon: <Layers className="w-6 h-6" />, 
                color: 'indigo', 
                desc: 'Create powerful mobile applications for iOS and Android using modern cross-platform tools.' 
              },
              { 
                title: 'Cyber Security', 
                icon: <Shield className="w-6 h-6" />, 
                color: 'red', 
                desc: 'Learn the essentials of network security, ethical hacking, and data protection.' 
              },
              { 
                title: 'Cloud Computing', 
                icon: <Globe className="w-6 h-6" />, 
                color: 'emerald', 
                desc: 'Explore cloud architecture, serverless computing, and scalable infrastructure.' 
              }
            ].slice(0, showAllDomains ? 6 : 3).map((domain, idx) => (
              <div key={idx} className="elite-card p-8 md:p-10 flex flex-col gap-6 animate-on-scroll group hover:scale-[1.02] transition-all duration-500">
                <div className={`w-14 h-14 rounded-2xl bg-${domain.color}-500/10 flex items-center justify-center text-${domain.color}-600 shadow-lg shadow-${domain.color}-500/5 group-hover:scale-110 transition-transform`}>
                  {domain.icon}
                </div>
                <div className="flex flex-col gap-3">
                  <h4 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">{domain.title}</h4>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400 leading-relaxed">
                    {domain.desc}
                  </p>
                </div>
                <div className="flex flex-col gap-3 mt-auto">
                  <button className={`w-full py-3 rounded-xl bg-${domain.color}-600 text-white text-xs font-black tracking-widest hover:bg-${domain.color}-700 transition-colors shadow-lg shadow-${domain.color}-600/20`}>
                    JOIN NOW
                  </button>
                  <button className="w-full py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-black tracking-widest hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                    VIEW DETAILS
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-12 animate-on-scroll">
            <button 
              onClick={() => setShowAllDomains(!showAllDomains)}
              className="px-10 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full font-black text-xs tracking-widest hover:scale-105 transition-transform shadow-xl flex items-center gap-2"
            >
              {showAllDomains ? 'VIEW LESS' : 'VIEW ALL DOMAINS'}
              <ChevronRight className={`w-4 h-4 transition-transform duration-500 ${showAllDomains ? '-rotate-90' : 'rotate-90'}`} />
            </button>
          </div>
        </div>
      </section>

      {/* 6. Advanced Event Radar - REDESIGNED 2.0 */}
      <section id="events" className="bg-slate-50 dark:bg-slate-950 py-24 md:py-40 px-6 relative z-10 overflow-hidden border-t border-b border-black/5 dark:border-white/5">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/5 rounded-full blur-[120px] -z-10 animate-on-scroll"></div>
        <div className="max-w-7xl mx-auto flex flex-col gap-16 md:gap-24">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-12 animate-on-scroll">
            <div className="flex flex-col gap-5 max-w-2xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-[2px] bg-brand"></div>
                <span className="text-xs md:text-sm font-bold uppercase tracking-[0.3em] text-brand">Latest Activities</span>
              </div>
              <h2 className="text-4xl md:text-7xl font-black tracking-tighter text-slate-900 dark:text-white leading-[0.9] font-cyber char-reveal">
                <SplitText text="Events & " />
                <span className="event-gradient-text">
                  <SplitText text="Workshops" />
                </span>
              </h2>
            </div>

            {/* Futuristic floating control center */}
            <div className="flex flex-col gap-4 p-2 bg-white/40 dark:bg-slate-900/40 backdrop-blur-3xl border border-black/5 dark:border-white/5 rounded-[2.5rem] shadow-2xl">
              <div className="flex p-1 bg-slate-200/50 dark:bg-slate-800/50 rounded-full border border-black/5 dark:border-white/5">
                <button
                  onClick={() => { setEventCategory('all'); setVisibleEvents(6); }}
                  className={`px-6 py-3 rounded-full text-[10px] font-black transition-all duration-500 ${eventCategory === 'all' ? 'bg-brand text-white shadow-lg shadow-brand/20' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
                >
                  ALL
                </button>
                <button
                  onClick={() => { setEventCategory('events'); setVisibleEvents(6); }}
                  className={`px-6 py-3 rounded-full text-[10px] font-black transition-all duration-500 ${eventCategory === 'events' ? 'bg-brand text-white shadow-lg shadow-brand/20' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
                >
                  EVENTS
                </button>
                <button
                  onClick={() => { setEventCategory('workshops'); setVisibleEvents(6); }}
                  className={`px-6 py-3 rounded-full text-[10px] font-black transition-all duration-500 ${eventCategory === 'workshops' ? 'bg-brand text-white shadow-lg shadow-brand/20' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
                >
                  WORKSHOPS
                </button>
              </div>
              <div className="flex justify-center gap-6 px-6 py-2">
                <button
                  onClick={() => { setEventTimeFilter('all'); setVisibleEvents(6); }}
                  className={`text-[9px] font-black tracking-widest transition-all ${eventTimeFilter === 'all' ? 'text-brand scale-110' : 'text-slate-400 hover:text-slate-900'}`}
                >
                  ALL TIME
                </button>
                <button
                  onClick={() => { setEventTimeFilter('upcoming'); setVisibleEvents(6); }}
                  className={`text-[9px] font-black tracking-widest transition-all ${eventTimeFilter === 'upcoming' ? 'text-brand scale-110' : 'text-slate-400 hover:text-slate-900'}`}
                >
                  UPCOMING
                </button>
                <button
                  onClick={() => { setEventTimeFilter('past'); setVisibleEvents(6); }}
                  className={`text-[9px] font-black tracking-widest transition-all ${eventTimeFilter === 'past' ? 'text-brand scale-110' : 'text-slate-400 hover:text-slate-900'}`}
                >
                  PAST
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-12">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
              {[
                {
                  id: 1,
                  category: 'events',
                  time: 'upcoming',
                  title: 'Sub Core Recruitment Drive',
                  type: 'RECRUITMENT',
                  desc: 'GAT Coding Club is recruiting Sub Core members for 2nd and 3rd year students! Join our dynamic team to organize tech events and lead workshops.',
                  img: RecruitmentBanner,
                  date: '2026-03-10',
                  location: 'GAT Campus',
                },
                {
                  id: 2,
                  category: 'workshops',
                  time: 'past',
                  title: 'Hands-On Generative AI',
                  type: 'WORKSHOP',
                  desc: "Unlocking the Power of AI: An interactive session introducing fundamentals of GenAI with hands-on practice using popular tools.",
                  img: WorkshopBanner1,
                  date: '7th March 2026',
                  location: 'AIB-LAB-2, GAT Campus',
                  participants: '70 participants'
                },
                {
                  id: 3,
                  category: 'events',
                  time: 'upcoming',
                  title: 'Bug Hunt 2026',
                  type: 'COMPETITION',
                  desc: 'Join our massive debugging competition. Find and fix errors in complex systems to win prizes.',
                  img: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=640',
                  date: 'TBA',
                  location: 'GAT Campus'
                },
                {
                  id: 4,
                  category: 'workshops',
                  time: 'upcoming',
                  title: 'AWS Cloud Basics',
                  type: 'WORKSHOP',
                  desc: 'Learn how to host your projects on the cloud using AWS. We will show you how to get started.',
                  img: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=640',
                  date: 'TBA',
                  location: 'Online'
                },
                {
                  id: 5,
                  category: 'events',
                  time: 'upcoming',
                  title: 'Hack-a-Thon',
                  type: 'HACKATHON',
                  desc: '24 hours of non-stop building. Turn your wild ideas into reality and win grand prizes.',
                  img: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=640',
                  date: 'April 2026',
                  location: 'GAT Main Hall'
                },
                {
                  id: 6,
                  category: 'workshops',
                  time: 'past',
                  title: 'React Fundamentals',
                  type: 'WORKSHOP',
                  desc: 'Learn the basics of React and how to build modern web interfaces.',
                  img: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=640',
                  date: 'Feb 2026',
                  location: 'AIB-LAB-1',
                  participants: '45 participants'
                }
              ]
                .filter(item => (eventCategory === 'all' || item.category === eventCategory) && (eventTimeFilter === 'all' || item.time === eventTimeFilter))
                .slice(0, visibleEvents)
                .map((item) => (
                  <div key={item.id} className="elite-card group bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border border-black/5 dark:border-white/10 rounded-[2.5rem] overflow-hidden hover:shadow-2xl transition-all duration-500 animate-on-scroll flex flex-col h-full hover:-translate-y-2">
                    <div className="relative aspect-[4/5] sm:aspect-[3/4] overflow-hidden w-full bg-slate-200/30 dark:bg-slate-800/30">
                      <img src={item.img} alt={item.title} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700" />
                      <div className="absolute top-6 left-6">
                        <span className="px-5 py-2 rounded-xl bg-brand/90 backdrop-blur-xl text-[10px] font-black text-white tracking-widest shadow-xl">{item.type}</span>
                      </div>
                    </div>
                    <div className="p-8 md:p-10 flex flex-col flex-1 gap-8">
                      <div className="flex flex-col gap-4">
                        <h4 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tighter uppercase group-hover:text-brand transition-colors leading-tight">{item.title}</h4>
                        <div className="flex flex-wrap gap-3 md:gap-4 text-[10px] md:text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                          <span className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg"><Calendar className="w-3.5 h-3.5 text-brand" /> {item.date}</span>
                          <span className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg"><Globe className="w-3.5 h-3.5 text-brand" /> {item.location}</span>
                          {item.participants && <span className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg"><Users className="w-3.5 h-3.5 text-brand" /> {item.participants}</span>}
                        </div>
                        <p className="text-sm md:text-base font-medium text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-4 mt-2">
                          {item.desc}
                        </p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mt-auto pt-8 border-t border-black/5 dark:border-white/5">
                        <button className="py-4 rounded-2xl bg-brand text-white text-[10px] font-black tracking-widest hover:bg-blue-700 transition-all hover:shadow-2xl hover:shadow-brand/40 active:scale-95">
                          REGISTER NOW
                        </button>
                        <button className="py-4 rounded-2xl bg-white dark:bg-slate-800 border border-black/5 dark:border-white/10 text-slate-900 dark:text-white text-[10px] font-black tracking-widest hover:bg-slate-50 dark:hover:bg-slate-700 transition-all active:scale-95">
                          VIEW DETAILS
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            <div className="flex justify-center mt-8">
              <button 
                onClick={() => setVisibleEvents(prev => prev === 3 ? 12 : 3)}
                className="px-12 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full font-black text-xs tracking-widest hover:scale-105 transition-transform active:scale-95 shadow-xl"
              >
                {visibleEvents > 3 ? 'VIEW LESS' : 'VIEW ALL ACTIVITIES'}
              </button>
            </div>
          </div>

        </div>
      </section>


      {/* 7. Premium SaaS-style Leaderboard Table Section */}
      <section id="leaderboard" className="py-24 md:py-32 px-6 scroll-fade-in relative z-10">
        <div className="max-w-6xl mx-auto flex flex-col gap-12 md:gap-16">
          <div className="flex flex-col gap-4 text-left max-w-2xl animate-on-scroll">
            <span className="text-xs md:text-sm font-bold uppercase tracking-widest text-brand">Leaderboard</span>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-tight text-slate-900 dark:text-white char-reveal">
              <SplitText text="Our Top Contributors" />
            </h2>
          </div>

          <div className="glass-panel overflow-hidden w-full flex flex-col animate-on-scroll">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 px-8 py-6 border-b border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 font-black text-xs md:text-sm text-slate-900 dark:text-white uppercase tracking-wider text-left">
              <div className="col-span-2">Rank</div>
              <div className="col-span-6 flex items-center gap-3">Member</div>
              <div className="col-span-2 text-right">PRs</div>
              <div className="col-span-2 text-right">Points</div>
            </div>

            {/* Table Rows */}
            {[
              { rank: '🥇 #1', name: 'Tharun Prasad', role: 'Next.js Wizard', prs: 142, points: 9481 },
              { rank: '🥈 #2', name: 'Ananya Sharma', role: 'Python System Architect', prs: 118, points: 8122 },
              { rank: '🥉 #3', name: 'Rahul Murthy', role: 'System Optimizer', prs: 94, points: 7450 },
              { rank: '#4', name: 'Pooja Reddy', role: 'Full Stack Dev', prs: 88, points: 6814 },
            ].map((row, idx) => (
              <div key={idx} className="grid grid-cols-12 gap-4 px-8 py-6 border-b border-black/5 dark:border-white/5 last:border-b-0 items-center text-left hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                <div className="col-span-2 text-sm md:text-base font-black text-slate-900 dark:text-white tracking-tight">
                  {row.rank}
                </div>
                <div className="col-span-6 flex flex-col">
                  <span className="text-sm md:text-base font-black text-slate-900 dark:text-white leading-tight">{row.name}</span>
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{row.role}</span>
                </div>
                <div className="col-span-2 text-right text-xs md:text-sm font-black text-slate-700 dark:text-slate-300">
                  {row.prs}
                </div>
                <div className="col-span-2 text-right text-sm md:text-base font-black tracking-tight text-brand">
                  {row.points}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Team Accordion Section */}
      <section id="team" className="py-24 md:py-32 px-6 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col gap-20">
          {/* Header Section */}
          <div className="flex flex-col gap-4 text-center max-w-3xl mx-auto animate-on-scroll">
            <span className="text-sm font-bold uppercase tracking-widest text-brand">Our Team</span>
            <h2 className="text-4xl md:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-tight char-reveal">
              <SplitText text="Meet the People Behind GAT Club" />
            </h2>
            <p className="text-slate-600 dark:text-slate-400 font-medium max-w-2xl mx-auto text-glow-scroll">The teachers and students who make everything happen.</p>
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

      {/* 9. Premium Redesigned Footer 3.0 */}
      <footer className="pt-32 pb-16 px-6 relative z-10 overflow-hidden bg-slate-50/50 dark:bg-slate-950/20 backdrop-blur-3xl border-t border-black/5 dark:border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col gap-24">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 md:gap-12">
            {/* Brand Section */}
            <div className="flex flex-col gap-8 col-span-2">
              <div className="flex items-center">
                <img src={GccLogo} alt="GAT Coding Club" className="h-16 md:h-20 w-auto" />
              </div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs">
                Helping students learn coding and build a better future together.
              </p>
              <div className="flex items-center gap-4">
                <a href="https://github.com/gatclub" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-black/10 dark:border-white/10 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-brand hover:text-white hover:border-brand transition-all duration-300 shadow-xl"><Github className="w-4 h-4" /></a>
                <a href="https://instagram.com/gatclub" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-black/10 dark:border-white/10 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-brand hover:text-white hover:border-brand transition-all duration-300 shadow-xl"><Instagram className="w-4 h-4" /></a>
                <a href="https://linkedin.com/company/gatclub" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-black/10 dark:border-white/10 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-brand hover:text-white hover:border-brand transition-all duration-300 shadow-xl"><Linkedin className="w-4 h-4" /></a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="flex flex-col gap-8">
              <h5 className="text-xs font-black tracking-[0.3em] text-slate-900 dark:text-white uppercase">Navigation</h5>
              <ul className="flex flex-col gap-5">
                <li><a href="#about" className="footer-link text-sm font-bold text-slate-500 dark:text-slate-400">Who We Are</a></li>
                <li><a href="#workflow" className="footer-link text-sm font-bold text-slate-500 dark:text-slate-400">Workflow</a></li>
                <li><a href="#events" className="footer-link text-sm font-bold text-slate-500 dark:text-slate-400">Events Radar</a></li>
                <li><a href="#leaderboard" className="footer-link text-sm font-bold text-slate-500 dark:text-slate-400">Leaderboard</a></li>
              </ul>
            </div>

            {/* Resources */}
            <div className="flex flex-col gap-8">
              <h5 className="text-xs font-black tracking-[0.3em] text-slate-900 dark:text-white uppercase">Resources</h5>
              <ul className="flex flex-col gap-5">
                <li><a href="#" className="footer-link text-sm font-bold text-slate-500 dark:text-slate-400">Code Guidelines</a></li>
                <li><a href="#" className="footer-link text-sm font-bold text-slate-500 dark:text-slate-400">Open Source Lab</a></li>
                <li><a href="#" className="footer-link text-sm font-bold text-slate-500 dark:text-slate-400">Tech Stack</a></li>
                <li><a href="#" className="footer-link text-sm font-bold text-slate-500 dark:text-slate-400">Alumni Network</a></li>
              </ul>
            </div>

            {/* Stay Updated */}
            <div className="flex flex-col gap-8">
              <h5 className="text-xs font-black tracking-[0.3em] text-slate-900 dark:text-white uppercase">Stay Updated</h5>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 leading-relaxed">
                Join our mailing list to hear about our next workshops and events.
              </p>
              <div className="flex p-1 bg-slate-200/50 dark:bg-slate-800/50 rounded-2xl border border-black/5 dark:border-white/5 shadow-inner">
                <input type="email" placeholder="Email" className="bg-transparent border-none focus:ring-0 text-xs px-4 py-3 flex-1 text-slate-900 dark:text-white outline-none" />
                <button className="bg-brand text-white text-[10px] font-black px-6 py-3 rounded-xl hover:scale-[1.02] transition-all shadow-lg shadow-brand/20">JOIN</button>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 pt-12 border-t border-black/5 dark:border-white/5">
            <div className="text-[10px] font-black tracking-widest text-slate-400 dark:text-slate-600 uppercase flex items-center gap-3">
              <span>© 2026 GCC Web dev Team</span>
              <div className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-800"></div>
              <span>ALL RIGHTS RESERVED</span>
            </div>
            
            <div className="flex items-center gap-8 text-[10px] font-black tracking-widest text-slate-400 dark:text-slate-600 uppercase">
              <a href="#" className="hover:text-brand transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-brand transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
        
        {/* Large Background Watermark in Footer */}
        <div className="absolute -bottom-24 -right-24 text-[25vw] font-black text-black/5 dark:text-white/5 font-cyber pointer-events-none select-none z-[-1] leading-none uppercase">
          GAT
        </div>
      </footer>
    </div>
  );
}
