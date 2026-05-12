import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation, Navigate, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Home from './pages/Home';
import Events from './pages/Events';
import EventDetails from './pages/EventDetails';
import DomainDetails from './pages/DomainDetails';
import Quiz from './pages/Quiz';
import Auth from './pages/Auth';
import Profile from './pages/Profile';
import ProfileComplete from './pages/ProfileComplete';

// Admin Pages
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/Dashboard';
import UsersManager from './pages/admin/UsersManager';
import EventsManager from './pages/admin/EventsManager';
import QuizManager from './pages/admin/QuizManager';
import DomainsManager from './pages/admin/DomainsManager';
import TestSessionManager from './pages/admin/TestSessionManager';

import { AuthProvider, useAuth } from './context/AuthContext';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Route Guards
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? children : <Navigate to="/auth" />;
};

const AdminRoute = ({ children }) => {
  // TEMPORARY: Bypassing auth check for development
  return children;
  
  /* 
  // Re-enable this once backend is connected
  const { user, loading } = useAuth();
  if (loading) return null;
  return user && user.role === 'admin' ? children : <Navigate to="/" />;
  */
};

function AppLayout({ theme, toggleTheme, navVisible, mobileMenuOpen, setMobileMenuOpen }) {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && user && !user.profileComplete && location.pathname !== '/profile/complete') {
      navigate('/profile/complete');
    }
  }, [user, authLoading, location.pathname, navigate]);

  useEffect(() => {
    // Initialize Lenis smooth scroll
    const lenis = new Lenis({
      duration: window.innerWidth < 768 ? 0.8 : 1.2, // Snappier on mobile
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 1.5,
      infinite: false,
    });

    // Connect Lenis to GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(lenis.raf);
    };
  }, []);

  return (
    <div className="min-h-screen relative selection:bg-brand selection:text-white overflow-x-hidden bg-white dark:bg-slate-950 font-cyber flex flex-col transition-all duration-500 ease-in-out">
      {!isAdmin && (
        <Navbar
          theme={theme}
          toggleTheme={toggleTheme}
          navVisible={navVisible}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
        />
      )}
      <div className="flex-1 flex flex-col min-h-screen w-full">
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home theme={theme} />} />
            <Route path="/events" element={<Events />} />
            <Route path="/event/:id" element={<EventDetails />} />
            <Route path="/domain/:id" element={<DomainDetails />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/auth" element={<Auth />} />
            
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />

            <Route path="/profile/complete" element={
              <ProtectedRoute>
                <ProfileComplete />
              </ProtectedRoute>
            } />

            {/* Admin Routes */}
            <Route path="/admin" element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }>
              <Route index element={<AdminDashboard />} />
              <Route path="users" element={<UsersManager />} />
              <Route path="events" element={<EventsManager />} />
              <Route path="quiz" element={<QuizManager />} />
              <Route path="domains" element={<DomainsManager />} />
              <Route path="test-sessions" element={<TestSessionManager />} />
            </Route>
          </Routes>
        </main>
        {!isAdmin && <Footer />}
      </div>
    </div>
  );
}

export default function App() {
  const [theme, setTheme] = useState('light');
  const [navVisible, setNavVisible] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
      <AuthProvider>

        <AppLayout
          theme={theme}
          toggleTheme={toggleTheme}
          navVisible={navVisible}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
        />
      </AuthProvider>
    </Router>
  );
}
