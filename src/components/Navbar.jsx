import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Menu, X, Sun, Moon, LogOut, Users, 
  ArrowRight, Shield, Zap, Bell
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import GccLogo from '../assets/logo/gcc logo.png';
import NotificationCenter from './NotificationCenter';

export default function Navbar() {
  const { user, logout, theme, toggleTheme } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Scrolled state for background change
      setScrolled(currentScrollY > 20);

      // Visibility logic: show on up, hide on down
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setVisible(false);
      } else {
        setVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const handleNavClick = (e, targetId) => {
    e.preventDefault();
    setMobileMenuOpen(false);

    if (targetId === 'events') {
      navigate('/events');
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

    if (location.pathname !== '/') {
      navigate('/', { state: { scrollTo: targetId } });
    } else {
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate('/');
  };

  const navItems = [
    { label: 'Home', id: 'home' },
    { label: 'Events', id: 'events' },
    { label: 'Arena', id: 'live-rooms' },
    { label: 'Quiz', id: 'quiz' },
    { label: 'Domains', id: 'domains' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[9999] transition-all duration-500 
      ${scrolled ? 'py-2' : 'py-4'} 
      ${mobileMenuOpen ? 'bg-white' : 'bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-black/5 dark:border-white/5'}
      ${visible ? 'translate-y-0' : '-translate-y-full'}
      flex flex-col`}
      style={mobileMenuOpen ? { backgroundColor: '#ffffff', opacity: 1 } : {}}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-16 flex items-center justify-between w-full">
        {/* Logo & Brand */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-14 h-14 sm:w-11 sm:h-11 flex-shrink-0 relative">
            <div className="absolute inset-0 bg-emerald-500/20 blur-lg rounded-full group-hover:bg-emerald-500/40 transition-all"></div>
            <img src={GccLogo} alt="GCC Logo" className="relative w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" />
          </div>
          <div className="flex flex-col">
            <span className="text-slate-900 dark:text-white font-black tracking-tighter text-lg sm:text-base leading-none uppercase">GCC CLUB</span>
            <span className="text-[9px] sm:text-[9px] text-emerald-500 font-bold tracking-[0.2em] uppercase mt-1 sm:mt-1">GAT CHAPTER</span>
          </div>
        </Link>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={toggleTheme}
            className="hidden md:flex p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 transition-all text-slate-500 dark:text-slate-400"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          <NotificationCenter />

          {/* Desktop Nav Items */}
          <div className="hidden md:flex items-center gap-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={(e) => handleNavClick(e, item.id)}
                className="px-4 py-2 text-[10px] font-black text-slate-500 dark:text-slate-400 hover:text-emerald-500 dark:hover:text-white transition-all uppercase tracking-widest relative group"
              >
                {item.label}
                <span className="absolute bottom-1 left-4 right-4 h-0.5 bg-emerald-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
              </button>
            ))}
          </div>

          {user ? (
            <div id="navbar-user-section" className="hidden md:flex items-center gap-3 ml-2 pl-4 border-l border-black/5 dark:border-white/5">
              <Link 
                to="/profile" 
                className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center overflow-hidden border border-black/5 dark:border-white/10 hover:scale-105 transition-all shadow-lg"
              >
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <Users className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                )}
              </Link>
              <button 
                onClick={handleLogout}
                className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-red-500/10 text-slate-500 hover:text-red-500 transition-all"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <Link 
              id="navbar-auth-button"
              to="/auth" 
              className="hidden sm:flex px-6 py-2.5 rounded-xl bg-slate-950 dark:bg-white text-white dark:text-slate-950 text-[10px] font-black tracking-widest uppercase hover:scale-105 transition-all shadow-xl"
            >
              Join Club
            </Link>
          )}

          {/* Mobile Menu Toggle */}
          <button 
            id="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 text-slate-900 dark:text-white"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div 
        className={`md:hidden fixed inset-0 top-16 bg-white z-[9999] transition-all duration-300 ease-in-out
        ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
        style={{ backgroundColor: '#ffffff', opacity: 1 }}
      >
        <div className="flex flex-col p-6 gap-4 pt-8 bg-white h-[calc(100vh-4rem)] overflow-y-auto custom-scrollbar">
          <div className="flex flex-col gap-3">
            {user ? (
              <div className="flex flex-col gap-2">
                <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-between py-3 px-5 rounded-xl bg-emerald-500 text-white font-black text-sm shadow-lg shadow-emerald-500/20">
                  MY PROFILE <Users className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              <Link to="/auth" onClick={() => setMobileMenuOpen(false)} className="py-4 px-6 rounded-xl bg-slate-950 text-white font-black text-center text-sm shadow-xl shadow-slate-950/20 flex items-center justify-center gap-3">
                JOIN GCC CLUB <ArrowRight className="w-4 h-4 text-emerald-500" />
              </Link>
            )}
          </div>

          <div className="h-px bg-black/5 dark:border-white/5 my-2" />

          <div className="flex flex-col gap-1">
             <div className="flex items-center justify-between mb-2">
                <span className="text-[9px] font-black text-slate-400 tracking-[0.3em] uppercase">Navigation</span>
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-black/5 dark:border-white/10 text-slate-900 dark:text-white"
                >
                  {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </button>
             </div>
             {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={(e) => handleNavClick(e, item.id)}
                  className="text-lg font-bold text-slate-950 tracking-tight text-left py-2 bg-white relative z-10 uppercase"
                >
                  {item.label}
                </button>
              ))}
          </div>

          {user && (
            <div className="mt-auto pt-6 pb-8">
              <button onClick={handleLogout} className="w-full py-3 px-5 rounded-xl bg-slate-50 text-red-500 font-black text-xs text-center border border-red-500/10 uppercase tracking-widest">LOGOUT</button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
