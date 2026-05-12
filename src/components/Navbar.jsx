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
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo & Brand */}
        <Link to="/" className="flex items-center gap-4 group">
          <div className="w-12 h-12 flex-shrink-0 relative">
            <div className="absolute inset-0 bg-emerald-500/20 blur-lg rounded-full group-hover:bg-emerald-500/40 transition-all"></div>
            <img src={GccLogo} alt="GCC Logo" className="relative w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" />
          </div>
          <div className="flex flex-col">
            <span className="text-slate-900 dark:text-white font-black tracking-tighter text-lg leading-none">GCC CLUB</span>
            <span className="text-[10px] text-emerald-500 font-bold tracking-[0.2em] uppercase mt-1">GAT CHAPTER</span>
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
        <div className="flex items-center gap-6">
          <button
            onClick={toggleTheme}
            className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 transition-all text-slate-500 dark:text-slate-400"
            title="Toggle Theme"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {user ? (
            <div className="flex items-center gap-4 pl-6 border-l border-black/5 dark:border-white/5">
              <Link 
                to="/profile" 
                className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 hover:scale-105 transition-all"
              >
                <Users className="w-5 h-5" />
              </Link>
              <button 
                onClick={handleLogout}
                className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-red-500/10 text-slate-500 hover:text-red-500 transition-all"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <Link 
              to="/auth" 
              className="px-8 py-3 rounded-xl bg-slate-950 dark:bg-white text-white dark:text-slate-950 text-[11px] font-black tracking-widest uppercase hover:scale-105 active:scale-95 transition-all shadow-xl"
            >
              Join Club
            </Link>
          )}

          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-white/5 text-slate-900 dark:text-white"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div 
        className={`md:hidden fixed inset-0 top-20 bg-white dark:bg-slate-950 z-[90] transition-all duration-500 ease-in-out
        ${mobileMenuOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}
      >
        <div className="flex flex-col p-8 gap-6">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={(e) => handleNavClick(e, item.id)}
              className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter text-left"
            >
              {item.label}
            </button>
          ))}
          <div className="h-px bg-black/5 dark:border-white/5 my-4"></div>
          {user ? (
            <>
              <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="text-xl font-bold text-emerald-500">My Profile</Link>
              <button onClick={handleLogout} className="text-xl font-bold text-red-500 text-left">Logout</button>
            </>
          ) : (
            <Link to="/auth" onClick={() => setMobileMenuOpen(false)} className="py-4 rounded-2xl bg-emerald-500 text-white font-black text-center text-lg shadow-xl shadow-emerald-500/20">
              Join Club
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
