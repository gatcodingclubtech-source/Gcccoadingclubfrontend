import React from 'react';
import { Sun, Moon, Menu, X, Home as HomeIcon, Info, Layers, Calendar, Trophy, Users, BookOpen, ChevronRight, Plus } from 'lucide-react';
import GccLogo from '../assets/gcc logo 1.svg';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function Navbar({ navVisible, theme, toggleTheme, mobileMenuOpen, setMobileMenuOpen, desktopMenuOpen, setDesktopMenuOpen }) {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const navigate = useNavigate();

  const isExpanded = desktopMenuOpen || mobileMenuOpen;

  const handleNavClick = (e, targetId) => {
    e.preventDefault();
    setMobileMenuOpen(false);

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
            <img src={GccLogo} alt="GAT Coding Club" className="h-10 w-auto group-hover:scale-110 transition-transform duration-500" />
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
          <div id="mobile-menu" className="absolute top-full left-6 right-6 mt-4 bg-white dark:bg-slate-900 border border-black/10 dark:border-white/10 rounded-[2rem] px-8 py-6 flex flex-col gap-4 text-center text-slate-900 dark:text-white shadow-2xl z-50 backdrop-blur-3xl">
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
            <button className="px-6 py-3 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-bold transition-transform hover:scale-105 shadow-xl mt-2 w-full">
              Join Club
            </button>
          </div>
        )}
      </nav>

      {/* 💻 Desktop Toggle Button */}
      <button 
        onClick={() => setDesktopMenuOpen(!desktopMenuOpen)}
        className={`hidden md:flex fixed top-8 z-[60] w-8 h-8 items-center justify-center rounded-full bg-white dark:bg-slate-800 border border-black/10 dark:border-white/10 text-slate-900 dark:text-white shadow-lg transition-all duration-500 ease-in-out hover:scale-110
        ${desktopMenuOpen ? 'left-[240px]' : 'left-[80px]'}`}
      >
        <ChevronRight className={`w-4 h-4 transition-transform duration-500 ${desktopMenuOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* 💻 Desktop Sidebar Nav */}
      <nav 
        className={`hidden md:flex fixed left-0 top-0 h-screen z-50 navbar-glow-glass transition-all duration-500 ease-in-out flex-col shadow-none
        ${desktopMenuOpen ? 'w-64' : 'w-24'} overflow-x-hidden overflow-y-auto no-scrollbar`}
      >
        {/* Logo section */}
        <div className="h-24 px-6 flex items-center border-b border-black/5 dark:border-white/5 justify-center transition-all duration-500">
          <Link to="/" className="flex items-center justify-center group h-full w-full">
            <img src={GccLogo} alt="GAT Coding Club" className={`transition-all duration-500 group-hover:scale-105 ${desktopMenuOpen ? 'h-14' : 'h-10'} w-auto`} />
          </Link>
        </div>

        {/* Links section */}
        <div className={`flex-1 py-8 flex flex-col gap-2 overflow-y-auto no-scrollbar ${desktopMenuOpen ? 'px-4' : 'px-3 md:px-4'}`}>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={(e) => handleNavClick(e, item.id)}
                className={`w-full text-left py-3.5 rounded-2xl font-bold text-slate-600 dark:text-slate-400 hover:bg-brand/10 hover:text-brand dark:hover:bg-brand/20 dark:hover:text-brand transition-all flex items-center gap-4 group ${desktopMenuOpen ? 'px-4' : 'justify-center md:px-0'}`}
                title={!desktopMenuOpen ? item.label : ''}
              >
                <Icon className="w-5 h-5 flex-shrink-0 group-hover:scale-110 transition-transform" />
                <span className={`whitespace-nowrap transition-all duration-500 ${desktopMenuOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 w-0 hidden md:block'}`}>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div className={`p-6 border-t border-black/5 dark:border-white/5 flex flex-col gap-4 ${!desktopMenuOpen ? 'items-center px-2' : ''}`}>
          <button
            onClick={toggleTheme}
            className={`w-full py-3.5 px-4 flex items-center rounded-2xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 border border-black/5 dark:border-white/5 transition-all text-slate-700 dark:text-slate-300 font-bold ${desktopMenuOpen ? 'justify-between' : 'justify-center px-0'}`}
            title="Toggle Theme"
          >
            <span className={`flex items-center gap-3 ${!desktopMenuOpen && 'justify-center w-full'}`}>
              {theme === 'dark' ? <Moon className="w-5 h-5 flex-shrink-0" /> : <Sun className="w-5 h-5 flex-shrink-0" />}
              <span className={`whitespace-nowrap transition-all duration-500 ${desktopMenuOpen ? 'opacity-100' : 'opacity-0 w-0 hidden'}`}>
                {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
              </span>
            </span>
            {desktopMenuOpen && (
              <div className="w-10 h-6 bg-slate-200 dark:bg-slate-700 rounded-full relative transition-colors flex-shrink-0">
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all shadow-sm ${theme === 'dark' ? 'left-5' : 'left-1'}`}></div>
              </div>
            )}
          </button>
          
          {desktopMenuOpen ? (
            <button className="w-full py-4 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black transition-all hover:scale-[1.02] active:scale-95 shadow-xl hover:shadow-brand/20 dark:hover:shadow-brand/20 whitespace-nowrap">
              Join Club
            </button>
          ) : (
            <button className="w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black transition-all hover:scale-105 active:scale-95 shadow-xl" title="Join Club">
              <Plus className="w-5 h-5" />
            </button>
          )}
        </div>
      </nav>
    </>
  );
}
