import React from 'react';
import { Sun, Moon, Menu, X, Home as HomeIcon, Info, Layers, Calendar, Trophy, Users, BookOpen, ChevronRight, Plus } from 'lucide-react';
import GccLogo from '../assets/logo/gcc logo.png';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ navVisible, theme, toggleTheme, mobileMenuOpen, setMobileMenuOpen, desktopMenuOpen, setDesktopMenuOpen }) {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const isExpanded = desktopMenuOpen || mobileMenuOpen;

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
    { label: 'Home', id: 'home', icon: HomeIcon },
    { label: 'About', id: 'about', icon: Info },
    { label: 'Domains', id: 'domains', icon: Layers },
    { label: 'Events', id: 'events', icon: Calendar },
    { label: 'Quiz', id: 'quiz', icon: BookOpen },
    { label: 'Leaderboard', id: 'leaderboard', icon: Trophy },
    { label: 'Team', id: 'team', icon: Users },
  ];

  return (
    <>
      {/* 📱 Mobile Top Floating Navbar (Classic) */}
      <nav className={`md:hidden fixed top-6 w-full z-50 px-6 transition-all duration-500 ease-in-out ${navVisible ? 'translate-y-0 opacity-100' : '-translate-y-24 opacity-0'}`} id="mobile-top-navbar">
        <div className="max-w-6xl mx-auto navbar-glow-glass rounded-[2rem] px-6 py-4 flex justify-between items-center relative z-20">
          <Link to="/" className="flex items-center group">
            <img src={GccLogo} alt="GAT Coding Club" className="h-14 w-auto group-hover:scale-110 transition-transform duration-500 object-contain" />
          </Link>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="w-10 h-10 flex items-center justify-center rounded-full border border-black/10 dark:border-white/10 hover:bg-slate-200 dark:hover:bg-slate-800 transition-all text-slate-900 dark:text-white"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-10 h-10 flex items-center justify-center rounded-full border border-black/10 dark:border-white/10 text-slate-900 dark:text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div id="mobile-menu" className="absolute top-full left-6 right-6 mt-4 bg-white dark:bg-slate-900 border border-black/10 dark:border-white/10 rounded-[2rem] px-8 py-6 flex flex-col gap-4 text-center text-slate-900 dark:text-white shadow-2xl z-50 backdrop-blur-3xl max-h-[70vh] overflow-y-auto no-scrollbar">
            {['Home', 'About', 'Workflow', 'Events', 'Quiz', 'Leaderboard', 'Team'].map((item) => {
              const targetId = item === 'Workflow' ? 'domains' : item.toLowerCase();
              return (
                <button 
                  key={item}
                  onClick={(e) => handleNavClick(e, targetId)}
                  className="py-2 font-black text-slate-900 dark:text-white hover:text-brand transition-colors mobile-nav-link"
                >
                  {item === 'Workflow' ? 'Domains' : item}
                </button>
              );
            })}
            {user ? (
              <>
                <Link 
                  to="/profile" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2 font-black text-brand uppercase mobile-nav-link"
                >
                  My Profile
                </Link>
                <button 
                  onClick={handleLogout}
                  className="px-6 py-3 rounded-full bg-red-500/10 text-red-500 text-sm font-bold mt-2 w-full text-center"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link 
                to="/auth" 
                onClick={() => setMobileMenuOpen(false)}
                className="px-6 py-3 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-bold transition-transform hover:scale-105 shadow-xl mt-2 w-full text-center"
              >
                Join Club
              </Link>
            )}
          </div>
        )}
      </nav>

      {/* 💻 Desktop Toggle Button */}
      <button 
        onClick={() => setDesktopMenuOpen(!desktopMenuOpen)}
        className={`hidden md:flex fixed top-8 z-[60] w-10 h-10 items-center justify-center rounded-2xl bg-white dark:bg-slate-900 border border-black/5 dark:border-white/10 text-slate-900 dark:text-white shadow-2xl transition-all duration-500 ease-in-out hover:scale-110 hover:border-emerald-500/50
        ${desktopMenuOpen ? 'left-[236px]' : 'left-[76px]'}`}
      >
        {desktopMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* 💻 Desktop Sidebar Nav */}
      <nav 
        data-lenis-prevent
        className={`hidden md:flex fixed left-0 top-0 h-screen z-50 bg-white/10 dark:bg-black/40 backdrop-blur-3xl border-r border-black/5 dark:border-white/5 transition-all duration-500 ease-in-out flex-col
        ${desktopMenuOpen ? 'w-64' : 'w-20'} overflow-x-hidden overflow-y-auto no-scrollbar`}
      >
        {/* Logo section */}
        <div className="h-24 px-6 flex items-center border-b border-black/5 dark:border-white/5 gap-4">
          <div className="w-12 h-12 flex-shrink-0 bg-white/50 dark:bg-white/5 rounded-2xl border border-black/5 dark:border-white/10 flex items-center justify-center p-2 shadow-xl shadow-emerald-500/10">
            <img src={GccLogo} alt="Logo" className="w-full h-full object-contain" />
          </div>
          {desktopMenuOpen && (
            <div className="flex flex-col">
              <span className="text-slate-900 dark:text-white font-black tracking-tighter text-base uppercase leading-none">GCC Club</span>
              <span className="text-[9px] text-emerald-500 font-black tracking-widest uppercase mt-1">Evolution Center</span>
            </div>
          )}
        </div>

        {/* Links section */}
        <div data-lenis-prevent className="flex-1 py-8 px-4 flex flex-col gap-2 overflow-y-auto no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={(e) => handleNavClick(e, item.id)}
                className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group ${
                  location.pathname === '/' && item.id === 'home' 
                    ? 'bg-emerald-500 text-white shadow-xl shadow-emerald-500/30' 
                    : 'hover:bg-black/5 dark:hover:bg-white/5 hover:text-emerald-500 dark:text-white/60 text-slate-500'
                }`}
              >
                <div className="transition-transform duration-500 group-hover:scale-110">
                  <Icon className="w-5 h-5 flex-shrink-0" />
                </div>
                {desktopMenuOpen && (
                  <span className="text-[10px] font-black tracking-widest uppercase truncate transition-all duration-500">
                    {item.label}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-black/5 dark:border-white/5 flex flex-col gap-2">
          <button
            onClick={toggleTheme}
            className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl hover:bg-black/5 dark:hover:bg-white/5 transition-all group text-slate-500 hover:text-emerald-500"
            title="Toggle Theme"
          >
            <div className="transition-transform duration-500 group-hover:rotate-12">
              {theme === 'dark' ? <Moon className="w-5 h-5 flex-shrink-0" /> : <Sun className="w-5 h-5 flex-shrink-0" />}
            </div>
            {desktopMenuOpen && (
              <span className="text-[10px] font-black tracking-widest uppercase">
                {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
              </span>
            )}
          </button>
          
          {user ? (
            <div className="flex flex-col gap-2">
              <Link 
                to="/profile" 
                className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group bg-emerald-500 text-white shadow-xl shadow-emerald-500/20 hover:scale-[1.02] active:scale-95 ${!desktopMenuOpen ? 'justify-center' : ''}`}
              >
                <Users className="w-5 h-5 flex-shrink-0" />
                {desktopMenuOpen && (
                  <span className="text-[10px] font-black tracking-widest uppercase">Profile</span>
                )}
              </Link>
              <button 
                onClick={handleLogout}
                className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group hover:bg-red-500/10 text-slate-500 hover:text-red-500 ${!desktopMenuOpen ? 'justify-center' : ''}`}
              >
                <X className="w-5 h-5 flex-shrink-0" />
                {desktopMenuOpen && (
                  <span className="text-[10px] font-black tracking-widest uppercase">Logout</span>
                )}
              </button>
            </div>
          ) : (
            <Link 
              to="/auth" 
              className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xl shadow-black/10 dark:shadow-white/5 hover:scale-[1.02] active:scale-95 ${!desktopMenuOpen ? 'justify-center' : ''}`}
            >
              <Plus className="w-5 h-5 flex-shrink-0" />
              {desktopMenuOpen && (
                <span className="text-[10px] font-black tracking-widest uppercase">Join Club</span>
              )}
            </Link>
          )}
        </div>
      </nav>
    </>
  );
}
