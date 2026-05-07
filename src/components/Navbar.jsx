import React from 'react';
import { Sun, Moon, Menu, X } from 'lucide-react';
import GccLogo from '../assets/gcc logo 1.svg';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function Navbar({ navVisible, theme, toggleTheme, mobileMenuOpen, setMobileMenuOpen }) {
  const location = useLocation();
  const isHome = location.pathname === '/';

  const navigate = useNavigate();

  const handleNavClick = (e, targetId) => {
    e.preventDefault();
    setMobileMenuOpen(false);

    if (isHome) {
      // If we're already on the home page, just scroll to the element
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      } else if (targetId === 'home') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else {
      // If we're on a detail page, navigate home first, then scroll
      navigate('/');
      // Wait for React to render the Home page, then scroll
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
    <>
      <nav className={`fixed top-6 w-full z-50 px-6 transition-all duration-500 ease-in-out ${navVisible ? 'translate-y-0 opacity-100' : '-translate-y-24 opacity-0'}`} id="navbar">
        <div className="max-w-6xl mx-auto navbar-glow-glass rounded-[2rem] px-6 py-4 flex justify-between items-center relative z-20">
          <Link to="/" className="flex items-center group">
            <img src={GccLogo} alt="GAT Coding Club" className="h-12 md:h-14 w-auto group-hover:scale-110 transition-transform duration-500" />
          </Link>

          {/* Desktop Nav links with Characterwise hover rolling effect */}
          <div className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-700 dark:text-slate-200">
            {['Home', 'About', 'Workflow', 'Events', 'Leaderboard', 'Team'].map((item) => {
              const targetId = item === 'Workflow' ? 'domains' : item.toLowerCase();
              return (
                <button
                  key={item}
                  onClick={(e) => handleNavClick(e, targetId)}
                  className="nav-link-rolling text-slate-900 dark:text-slate-100 hover:text-brand transition-colors relative"
                >
                  <span data-text={item === 'Workflow' ? 'Domains' : item}>{item === 'Workflow' ? 'Domains' : item}</span>
                </button>
              );
            })}
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
            {['Home', 'About', 'Workflow', 'Events', 'Leaderboard', 'Team'].map((item) => {
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
    </>
  );
}
