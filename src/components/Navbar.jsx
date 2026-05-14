import React from 'react';
import { Sun, Moon, Menu, X, Home as HomeIcon, Info, Layers, Calendar, Trophy, Users, BookOpen, Plus, LogOut, ArrowRight } from 'lucide-react';
import GccLogo from '../assets/logo/gcc logo.png';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NotificationCenter from './NotificationCenter';

export default function Navbar({ navVisible, theme, toggleTheme, mobileMenuOpen, setMobileMenuOpen }) {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const handleNavClick = (e, targetId) => {
    e.preventDefault();
    setMobileMenuOpen(false);

    if (targetId === 'events') {
      navigate('/events');
      return;
    }

    if (targetId === 'leaderboard') {
      navigate('/leaderboard');
      return;
    }

    if (targetId === 'quiz') {
      navigate('/quiz');
      return;
    }


    if (targetId === 'live-rooms') {
      navigate('/live-rooms');
      return;
    }

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

  const navItems = [
    { label: 'Home', id: 'home' },
    { label: 'About', id: 'about' },
    { label: 'Domains', id: 'domains' },
    { label: 'Events', id: 'events' },
    { label: 'Quiz', id: 'quiz' },
    { label: 'Leaderboard', id: 'leaderboard' },
    { label: 'Arena', id: 'live-rooms' },
    { label: 'Team', id: 'team' },
  ];

  return (
    <nav 
      className={`fixed top-0 left-0 w-full z-[9999] transition-all duration-500 border-b
      ${navVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}
      ${mobileMenuOpen 
        ? 'bg-white' 
        : (location.pathname === '/' 
            ? 'bg-white/70 md:bg-white/70 dark:bg-slate-950/70 md:dark:bg-slate-950/70 backdrop-blur-none md:backdrop-blur-xl border-black/5 dark:border-white/5' 
            : 'bg-white dark:bg-slate-950 border-black/10 dark:border-white/10')
      }
      flex flex-col`}
      style={mobileMenuOpen ? { backgroundColor: '#ffffff', opacity: 1 } : {}}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-24 sm:h-20 flex items-center justify-between w-full">
        {/* Logo & Brand */}
        <Link to="/" className="flex items-center gap-3 sm:gap-4 group">
          <div className="w-16 h-16 sm:w-12 sm:h-12 flex-shrink-0 relative">
            <div className="absolute inset-0 bg-emerald-500/20 blur-lg rounded-full group-hover:bg-emerald-500/40 transition-all"></div>
            <img src={GccLogo} alt="GCC Logo" className="relative w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" />
          </div>
          <div className="flex flex-col">
            <span className="text-slate-900 dark:text-white font-black tracking-tighter text-lg sm:text-lg leading-none uppercase">GCC CLUB</span>
            <span className="text-[9px] sm:text-[10px] text-emerald-500 font-bold tracking-[0.2em] uppercase mt-1">GAT CHAPTER</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={(e) => handleNavClick(e, item.id)}
              className={`text-[11px] font-black tracking-[0.15em] ${item.id === 'live-rooms' ? 'capitalize' : 'uppercase'} transition-all relative py-2 group flex items-center gap-1.5
              ${location.pathname === '/' && item.id === 'home' ? 'text-emerald-500' : 'text-slate-500 dark:text-slate-400 hover:text-emerald-500'}`}
            >
              {item.label}
              <span className={`absolute bottom-0 left-0 h-0.5 bg-emerald-500 transition-all duration-300 ${location.pathname === '/' && item.id === 'home' ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4 sm:gap-6">
          {user && <NotificationCenter />}
          <button
            onClick={toggleTheme}
            className="w-10 h-10 hidden md:flex items-center justify-center rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 transition-all text-slate-500 dark:text-slate-400"
            title="Toggle Theme"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {user ? (
            <div className="flex items-center gap-2 sm:gap-4 sm:pl-6 sm:border-l border-black/5 dark:border-white/5">
              {/* Profile Icon - Hidden on mobile, moved to drawer */}
              <Link 
                to="/profile" 
                className="hidden sm:flex w-10 h-10 rounded-xl bg-emerald-500 items-center justify-center text-white shadow-lg shadow-emerald-500/20 hover:scale-105 transition-all"
              >
                <Users className="w-5 h-5" />
              </Link>
              <button 
                onClick={handleLogout}
                className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-red-500/10 text-slate-500 hover:text-red-500 transition-all hidden sm:flex"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <>
              <Link 
                to="/auth" 
                className="hidden sm:flex px-8 py-3 rounded-xl bg-slate-950 dark:bg-white text-white dark:text-slate-950 text-[11px] font-black tracking-widest uppercase hover:scale-105 active:scale-95 transition-all shadow-xl"
              >
                Join Club
              </Link>
              <Link 
                to="/auth" 
                className="sm:hidden w-12 h-12 rounded-xl bg-slate-950 dark:bg-white text-white dark:text-slate-950 flex items-center justify-center hover:scale-105 transition-all shadow-xl"
              >
                <img src={GccLogo} alt="Join" className="w-6 h-6 object-contain" />
              </Link>
            </>
          )}

          {/* Mobile Menu Toggle - Increased Size */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-12 h-12 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-white/5 text-slate-900 dark:text-white border border-black/5"
          >
            {mobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div 
        className={`md:hidden fixed inset-0 top-24 bg-white z-[9999] transition-all duration-300 ease-in-out
        ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
        style={{ backgroundColor: '#ffffff', opacity: 1 }}
      >
        <div className="flex flex-col p-8 gap-6 pt-10 bg-white min-h-screen">
          <div className="flex items-center justify-between mb-4">
             <span className="text-[12px] font-black text-slate-400 tracking-[0.3em] uppercase">Navigation</span>
             <button
              onClick={toggleTheme}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-slate-50 text-slate-900 font-black text-[12px] tracking-widest uppercase border border-black/10 shadow-sm"
            >
              {theme === 'dark' ? <><Sun className="w-4 h-4 text-emerald-500" /> LIGHT</> : <><Moon className="w-4 h-4 text-emerald-500" /> DARK</>}
            </button>
          </div>
          
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={(e) => handleNavClick(e, item.id)}
              className="text-4xl font-black text-slate-950 tracking-tighter text-left py-2 bg-white relative z-10 uppercase"
            >
              {item.label}
            </button>
          ))}
          
          <div className="mt-8 flex flex-col gap-4">
            {user ? (
              <>
                <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-between py-6 px-8 rounded-[2rem] bg-emerald-500 text-white font-black text-xl shadow-2xl shadow-emerald-500/30">
                  MY PROFILE <Users className="w-7 h-7" />
                </Link>
                <button onClick={handleLogout} className="py-5 px-8 rounded-[2rem] bg-slate-50 text-red-500 font-black text-lg text-center border border-red-500/20 uppercase tracking-widest">LOGOUT</button>
              </>
            ) : (
              <Link to="/auth" onClick={() => setMobileMenuOpen(false)} className="py-6 px-8 rounded-[2rem] bg-slate-950 text-white font-black text-center text-lg shadow-2xl shadow-slate-950/30 flex items-center justify-center gap-4">
                JOIN GCC CLUB <ArrowRight className="w-6 h-6 text-emerald-500" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
