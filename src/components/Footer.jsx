import React from 'react';
import GccLogo from '../assets/gcc logo 1.svg';
import { useNavigate, useLocation } from 'react-router-dom';

const Github = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
);

const Instagram = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
);

const Linkedin = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
);

export default function Footer() {
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/';

  const handleNavClick = (e, targetId) => {
    e.preventDefault();
    if (isHome) {
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      } else if (targetId === 'home') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(targetId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        } else if (targetId === 'home') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 100);
    }
  };

  return (
    <footer className="py-12 px-6 relative z-10 overflow-hidden bg-white/5 dark:bg-black/20 backdrop-blur-3xl border-t border-black/5 dark:border-white/5 text-slate-900 dark:text-white/90">
      <div className="max-w-7xl mx-auto flex flex-col gap-12">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <img src={GccLogo} alt="GCC" className="h-10 w-auto" />
              <div className="flex flex-col">
                <span className="text-lg font-black tracking-tighter uppercase leading-none">GAT Coding Club</span>
                <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Global Academy of Technology</span>
              </div>
            </div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 max-w-xs">
              Building the future of tech, one line of code at a time. Join the most elite community at GAT.
            </p>
          </div>

          {/* Nav & Social */}
          <div className="flex flex-col md:items-end gap-6">
            <div className="flex flex-wrap gap-6 text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white/70">
              <button onClick={(e) => handleNavClick(e, 'home')} className="hover:text-emerald-500 transition-colors">Home</button>
              <button onClick={(e) => handleNavClick(e, 'about')} className="hover:text-emerald-500 transition-colors">About</button>
              <button onClick={(e) => handleNavClick(e, 'domains')} className="hover:text-emerald-500 transition-colors">Domains</button>
              <button onClick={(e) => handleNavClick(e, 'events')} className="hover:text-emerald-500 transition-colors">Events</button>
              <button onClick={(e) => handleNavClick(e, 'team')} className="hover:text-emerald-500 transition-colors">Team</button>
            </div>
            <div className="flex items-center gap-4">
              <a href="#" className="w-8 h-8 rounded-full border border-black/10 dark:border-white/10 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-emerald-500 hover:border-emerald-500 hover:text-white transition-all duration-300"><Github className="w-3.5 h-3.5" /></a>
              <a href="#" className="w-8 h-8 rounded-full border border-black/10 dark:border-white/10 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-emerald-500 hover:border-emerald-500 hover:text-white transition-all duration-300"><Instagram className="w-3.5 h-3.5" /></a>
              <a href="#" className="w-8 h-8 rounded-full border border-black/10 dark:border-white/10 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-emerald-500 hover:border-emerald-500 hover:text-white transition-all duration-300"><Linkedin className="w-3.5 h-3.5" /></a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-8 border-t border-black/5 dark:border-white/5">
          <div className="text-[9px] font-bold tracking-[0.2em] text-slate-400 dark:text-white/30 uppercase flex items-center gap-3">
            <span>© 2026 GAT CODING CLUB</span>
            <div className="w-1 h-1 rounded-full bg-black/10 dark:bg-white/10"></div>
            <span>Dev by Naseer</span>
          </div>
          
          <div className="flex items-center gap-6 text-[9px] font-bold tracking-[0.2em] text-slate-400 dark:text-white/30 uppercase">
            <a href="#" className="hover:text-emerald-500 transition-colors">Privacy</a>
            <a href="#" className="hover:text-emerald-500 transition-colors">Terms</a>
          </div>
        </div>
      </div>

      {/* Subtle Background Watermark */}
      <div className="absolute -bottom-10 -right-10 text-[20vw] font-black text-white/[0.02] font-cyber pointer-events-none select-none z-[-1] leading-none uppercase">
        GAT
      </div>
    </footer>
  );
}
