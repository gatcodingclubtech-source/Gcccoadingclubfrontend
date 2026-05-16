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
import EventRegistration from './pages/EventRegistration';
import DomainRegistration from './pages/DomainRegistration';
import Resources from './pages/Resources';
import MyResources from './pages/MyResources';
import PublicProfile from './pages/PublicProfile';
import Leaderboard from './pages/Leaderboard';
import Domains from './pages/Domains';

// Admin Pages
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/Dashboard';
import AdminLogin from './pages/admin/AdminLogin';
import UsersManager from './pages/admin/UsersManager';
import EventsManager from './pages/admin/EventsManager';
import QuizManager from './pages/admin/QuizManager';
import DomainCentral from './pages/admin/DomainCentral';
import TestSessionManager from './pages/admin/TestSessionManager';
import TestResults from './pages/admin/TestResults';
import LiveRoomsManager from './pages/admin/LiveRoomsManager';
import RegistrationsManager from './pages/admin/RegistrationsManager';
import ManageResources from './pages/admin/ManageResources';
import BannersManager from './pages/admin/BannersManager';
import ClubSettings from './pages/admin/ClubSettings';
import LiveRooms from './pages/LiveRooms';
import LiveRoomDetail from './pages/LiveRoomDetail';
import CodingHub from './pages/CodingHub';
import InteractiveDots from './components/InteractiveDots';
import AIMentor from './components/AIMentor';
import SystemAlert from './components/SystemAlert';

import socket from './utils/socket';
import { toast, Toaster } from 'react-hot-toast';

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
  const { user, loading } = useAuth();
  if (loading) return null;
  
  // Only allow admin role
  if (user && user.role === 'admin') {
    return children;
  }
  
  return <Navigate to="/auth" />;
};

function AppLayout({ theme, toggleTheme, navVisible, mobileMenuOpen, setMobileMenuOpen }) {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
  const isImmersive = location.pathname.includes('/live-rooms/') || location.pathname.includes('/coding-hub/');
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && user && !user.profileComplete && location.pathname !== '/profile/complete') {
      navigate('/profile/complete');
    }
    
    if (user) {
      socket.emit('register', user._id);
      
      socket.on('NOTIFICATION', (notif) => {
        toast.success(`${notif.title}: ${notif.message}`, {
          icon: notif.type === 'RANK' ? '🎉' : '🔥',
          duration: 5000,
          position: 'bottom-right',
        });
      });

      socket.on('XP_UPDATE', (data) => {
        console.log('XP Updated:', data);
      });
    }

    return () => {
      socket.off('NOTIFICATION');
      socket.off('XP_UPDATE');
    };
  }, [user, authLoading, location.pathname, navigate]);

  useEffect(() => {
    // Initialize Lenis smooth scroll
    const lenis = new Lenis({
      duration: 1.5,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.2,
      lerp: 0.1,
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
      {!isAdmin && !isImmersive && (
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
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/domains" element={<Domains />} />
            <Route path="/profile/:id" element={<PublicProfile />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/live-rooms" element={<LiveRooms />} />
            <Route path="/live-rooms/:id" element={<LiveRoomDetail />} />
            <Route path="/coding-hub/:roomId" element={<CodingHub />} />
            
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />

            <Route path="/my-resources" element={
              <ProtectedRoute>
                <MyResources />
              </ProtectedRoute>
            } />

            <Route path="/profile/complete" element={
              <ProtectedRoute>
                <ProfileComplete />
              </ProtectedRoute>
            } />

            {/* Registration routes (Publicly accessible for guest flow) */}
            <Route path="/register/event/:id" element={<EventRegistration />} />
            <Route path="/register/domain/:slug" element={<DomainRegistration />} />

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
              <Route path="resources" element={<ManageResources />} />
              <Route path="domains" element={<DomainCentral />} />
              <Route path="live-rooms" element={<LiveRoomsManager />} />
              <Route path="banners" element={<BannersManager />} />
              <Route path="test-sessions" element={<TestSessionManager />} />
              <Route path="test-sessions/:id/results" element={<TestResults />} />
              <Route path="settings" element={<ClubSettings />} />
              <Route path="events/:id/registrations" element={<RegistrationsManager />} />
              <Route path="domain-apps" element={<Navigate to="/admin/domains" replace />} />
              <Route path="domains/registrations" element={<Navigate to="/admin/domains" replace />} />
            </Route>

            <Route path="/admin-login" element={<AdminLogin />} />
          </Routes>
        </main>
        {!isAdmin && !isImmersive && <Footer />}
      </div>
      {!isAdmin && !isImmersive && <AIMentor />}
      <SystemAlert />
    </div>
  );
}

export default function App() {
  const [theme, setTheme] = useState('light');
  const [navVisible, setNavVisible] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Initial theme check: Priority -> Local Storage -> System Preference
    const savedTheme = localStorage.getItem('gcc-theme');
    const systemDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
      setTheme(savedTheme);
      if (savedTheme === 'dark') document.documentElement.classList.add('dark');
      else document.documentElement.classList.remove('dark');
    } else if (systemDark) {
      setTheme('dark');
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('gcc-theme', newTheme);
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
    <AuthProvider>
      <Router>
        <Toaster />
        <InteractiveDots />
        <AppLayout
          theme={theme}
          toggleTheme={toggleTheme}
          navVisible={navVisible}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
        />
      </Router>
    </AuthProvider>
  );
}
