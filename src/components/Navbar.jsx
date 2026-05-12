import React from 'react';
import { Sun, Moon, Menu, X, Home as HomeIcon, Info, Layers, Calendar, Trophy, Users, BookOpen, Plus, LogOut } from 'lucide-react';
import GccLogo from '../assets/logo/gcc logo.png';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

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
    { label: 'Team', id: 'team' },
  ];

  return (
    <nav 
      className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 border-b
      ${navVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}
      ${location.pathname === '/' ? 'bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl border-black/5 dark:border-white/5' : 'bg-white dark:bg-slate-950 border-black/10 dark:border-white/10'}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 sm:h-20 flex items-center justify-between">
        {/* Logo & Brand */}
        <Link to="/" className="flex items-center gap-2 sm:gap-4 group">
          <div className="w-9 h-9 sm:w-12 sm:h-12 flex-shrink-0 relative">
            <div className="absolute inset-0 bg-emerald-500/20 blur-lg rounded-full group-hover:bg-emerald-500/40 transition-all"></div>
            <img src={GccLogo} alt="GCC Logo" className="relative w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" />
          </div>
          <div className="flex flex-col">
            <span className="text-slate-900 dark:text-white font-black tracking-tighter text-sm sm:text-lg leading-none">GCC CLUB</span>
            <span className="text-[7px] sm:text-[10px] text-emerald-500 font-bold tracking-[0.2em] uppercase mt-0.5 sm:mt-1">GAT CHAPTER</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={(e) => handleNavClick(e, item.id)}
              className={`text-[11px] font-black tracking-[0.15em] uppercase transition-all relative py-2 group
              ${location.pathname === '/' && item.id === 'home' ? 'text-emerald-500' : 'text-slate-500 dark:text-slate-400 hover:text-emerald-500'}`}
            >
              {item.label}
              <span className={`absolute bottom-0 left-0 h-0.5 bg-emerald-500 transition-all duration-300 ${location.pathname === '/' && item.id === 'home' ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 sm:gap-6">
          <button
            onClick={toggleTheme}
            className="hidden md:flex w-10 h-10 items-center justify-center rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 transition-all text-slate-500 dark:text-slate-400"
            title="Toggle Theme"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {user ? (
            <div className="flex items-center gap-2 sm:gap-4 sm:pl-6 sm:border-l border-black/5 dark:border-white/5">
              <Link 
                to="/profile" 
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 hover:scale-105 transition-all"
              >
                <Users className="w-4 h-4 sm:w-5 sm:h-5" />
              </Link>
            </div>
          ) : (
            <Link 
              to="/auth" 
              className="w-8 h-8 sm:w-auto sm:px-8 sm:py-3 rounded-lg sm:rounded-xl bg-slate-950 dark:bg-white text-white dark:text-slate-950 flex items-center justify-center hover:scale-105 transition-all shadow-xl"
            >
              <span className="hidden sm:inline text-[11px] font-black tracking-widest uppercase">Join Club</span>
              <img src={GccLogo} alt="Join" className="w-5 h-5 sm:hidden object-contain" />
            </Link>
          )}

          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-8 h-8 flex items-center justify-center rounded-lg bg-slate-100 dark:bg-white/5 text-slate-900 dark:text-white"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div 
        className={`md:hidden fixed inset-0 top-14 bg-white z-[110] transition-all duration-500 ease-in-out
        ${mobileMenuOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}
        style={{ backgroundColor: '#ffffff' }}
      >
        <div className="flex flex-col p-6 gap-5 pt-10">
          <div className="flex items-center justify-between mb-2">
             <span className="text-[10px] font-black text-slate-400 tracking-[0.3em] uppercase">Navigation</span>
             <button
              onClick={toggleTheme}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 text-slate-900 font-black text-[10px] tracking-widest uppercase border border-black/5"
            >
              {theme === 'dark' ? <><Sun className="w-3.5 h-3.5 text-emerald-500" /> LIGHT</> : <><Moon className="w-3.5 h-3.5 text-emerald-500" /> DARK</>}
            </button>
          </div>
          
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={(e) => handleNavClick(e, item.id)}
              className="text-2xl font-black text-slate-950 tracking-tighter text-left py-1"
            >
              {item.label}
            </button>
          ))}
          
          <div className="mt-6 flex flex-col gap-3">
            {user ? (
              <>
                <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-between py-4 px-6 rounded-xl bg-emerald-500 text-white font-black text-base shadow-xl shadow-emerald-500/20">
                  MY PROFILE <Users className="w-5 h-5" />
                </Link>
                <button onClick={handleLogout} className="py-4 px-6 rounded-xl bg-slate-50 text-red-500 font-black text-base text-center border border-red-500/10">LOGOUT</button>
              </>
            ) : (
              <Link to="/auth" onClick={() => setMobileMenuOpen(false)} className="py-4 px-6 rounded-xl bg-slate-950 text-white font-black text-center text-base shadow-xl shadow-slate-950/20 flex items-center justify-center gap-3">
                JOIN GCC CLUB <ArrowRight className="w-5 h-5 text-emerald-500" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
