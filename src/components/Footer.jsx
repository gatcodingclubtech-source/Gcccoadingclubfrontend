import React from 'react';
import GccLogo from '../assets/gcc logo 1.svg';

const Github = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
);

const Instagram = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
);

const Linkedin = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
);

import { useNavigate, useLocation } from 'react-router-dom';

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
    <footer className="pt-32 pb-16 px-6 relative z-10 overflow-hidden bg-slate-50/50 dark:bg-slate-950/20 backdrop-blur-3xl border-t border-black/5 dark:border-white/5">
      <div className="max-w-7xl mx-auto flex flex-col gap-24">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 md:gap-12">
          {/* Brand Section */}
          <div className="flex flex-col gap-8 col-span-2">
            <div className="flex flex-col gap-4">
              <img src={GccLogo} alt="GAT Coding Club" className="h-16 md:h-20 w-auto self-start" />
              <h4 className="text-xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Global Academy of Technology</h4>
            </div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm">
              Empowering students at Global Academy of Technology through innovation, collaboration, and a deep-rooted passion for coding.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="w-10 h-10 rounded-full border border-black/10 dark:border-white/10 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-brand hover:text-white hover:border-brand transition-all duration-300 shadow-xl"><Github className="w-4 h-4" /></a>
              <a href="#" className="w-10 h-10 rounded-full border border-black/10 dark:border-white/10 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-brand hover:text-white hover:border-brand transition-all duration-300 shadow-xl"><Instagram className="w-4 h-4" /></a>
              <a href="#" className="w-10 h-10 rounded-full border border-black/10 dark:border-white/10 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-brand hover:text-white hover:border-brand transition-all duration-300 shadow-xl"><Linkedin className="w-4 h-4" /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-8">
            <h5 className="text-xs font-black tracking-[0.3em] text-slate-900 dark:text-white uppercase">Navigation</h5>
            <ul className="flex flex-col gap-5">
              <li><button onClick={(e) => handleNavClick(e, 'home')} className="footer-link text-sm font-bold text-slate-500 dark:text-slate-400 text-left hover:text-brand transition-colors">Home</button></li>
              <li><button onClick={(e) => handleNavClick(e, 'about')} className="footer-link text-sm font-bold text-slate-500 dark:text-slate-400 text-left hover:text-brand transition-colors">About Us</button></li>
              <li><button onClick={(e) => handleNavClick(e, 'domains')} className="footer-link text-sm font-bold text-slate-500 dark:text-slate-400 text-left hover:text-brand transition-colors">Our Domains</button></li>
              <li><button onClick={(e) => handleNavClick(e, 'events')} className="footer-link text-sm font-bold text-slate-500 dark:text-slate-400 text-left hover:text-brand transition-colors">Events Radar</button></li>
              <li><button onClick={(e) => handleNavClick(e, 'team')} className="footer-link text-sm font-bold text-slate-500 dark:text-slate-400 text-left hover:text-brand transition-colors">Our Team</button></li>
            </ul>
          </div>

          {/* Connect */}
          <div className="flex flex-col gap-8">
            <h5 className="text-xs font-black tracking-[0.3em] text-slate-900 dark:text-white uppercase">Connect</h5>
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-black text-brand uppercase tracking-widest">Visit Us</span>
                <p className="text-sm font-bold text-slate-500 dark:text-slate-400">
                  Aditya Layout, Rajarajeshwari Nagar,<br />
                  Bengaluru, Karnataka - 560098
                </p>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-black text-brand uppercase tracking-widest">Email</span>
                <a href="mailto:info@gat.ac.in" className="text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-brand transition-colors">info@gat.ac.in</a>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-black text-brand uppercase tracking-widest">Phone</span>
                <a href="tel:08028603158" className="text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-brand transition-colors">080-28603158</a>
              </div>
            </div>
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
            <span>© 2026 GAT CODING CLUB</span>
            <div className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-800"></div>
            <span>Developed by Naseer</span>
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
  );
}
