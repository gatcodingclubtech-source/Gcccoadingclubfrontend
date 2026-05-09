import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import EventDetails from './pages/EventDetails';
import DomainDetails from './pages/DomainDetails';

export default function App() {
  const [theme, setTheme] = useState('light');
  const [navVisible, setNavVisible] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [desktopMenuOpen, setDesktopMenuOpen] = useState(false);

  useEffect(() => {
    // Initial theme check
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  useEffect(() => {
    // Navbar scroll behavior
    let lastScrollY = window.scrollY;
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > 50) {
        if (currentScrollY > lastScrollY && !mobileMenuOpen) {
          setNavVisible(false);
        } else {
          setNavVisible(true);
        }
      } else {
        setNavVisible(true);
      }
      
      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [mobileMenuOpen]);

  return (
    <Router>
      <div className={`min-h-screen relative selection:bg-brand selection:text-white overflow-x-hidden font-cyber flex flex-col transition-all duration-500 ease-in-out ${desktopMenuOpen ? 'md:pl-64' : 'md:pl-24'}`}>
        <Navbar 
          theme={theme} 
          toggleTheme={toggleTheme} 
          navVisible={navVisible} 
          mobileMenuOpen={mobileMenuOpen} 
          setMobileMenuOpen={setMobileMenuOpen} 
          desktopMenuOpen={desktopMenuOpen}
          setDesktopMenuOpen={setDesktopMenuOpen}
        />
        <div className="flex-1 flex flex-col min-h-screen w-full">
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home theme={theme} />} />
              <Route path="/event/:id" element={<EventDetails />} />
              <Route path="/domain/:id" element={<DomainDetails />} />
            </Routes>
          </main>
          
          <Footer />
        </div>
      </div>
    </Router>
  );
}
