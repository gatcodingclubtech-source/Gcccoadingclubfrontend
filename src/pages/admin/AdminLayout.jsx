import React, { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, Users, Calendar, HelpCircle, 
  Layers, LogOut, Menu, X, Bell, Search, 
  Settings, ExternalLink, Shield, MessageSquare, Video
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import GccLogo from '../../assets/logo/gcc logo.png';
import AnimatedBackground from '../../components/AnimatedBackground';

export default function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const menuItems = [
    { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard className="w-5 h-5" /> },
    { name: 'Users', path: '/admin/users', icon: <Users className="w-5 h-5" /> },
    { name: 'Events', path: '/admin/events', icon: <Calendar className="w-5 h-5" /> },
    { name: 'Discussions', path: '/admin/discussions', icon: <MessageSquare className="w-5 h-5" /> },
    { name: 'Live Rooms', path: '/admin/live-rooms', icon: <Video className="w-5 h-5" /> },
    { name: 'Quiz', path: '/admin/quiz', icon: <HelpCircle className="w-5 h-5" /> },
    { name: 'Domains', path: '/admin/domains', icon: <Layers className="w-5 h-5" /> },
    { name: 'Live Tests', path: '/admin/test-sessions', icon: <ExternalLink className="w-5 h-5" /> },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black text-slate-900 dark:text-slate-400 font-cyber flex overflow-x-hidden relative">
      <AnimatedBackground />
      
      {/* Sidebar - Now fixed always on large screens too with proper transition */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 bg-white/10 dark:bg-black/40 backdrop-blur-3xl border-r border-black/5 dark:border-white/5 transition-all duration-500 ease-in-out lg:translate-x-0 ${
          isSidebarOpen 
            ? 'w-64 translate-x-0' 
            : 'w-20 -translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="h-24 flex items-center px-6 gap-4 border-b border-black/5 dark:border-white/5">
            <div className="w-12 h-12 flex-shrink-0 bg-white/50 dark:bg-white/5 rounded-2xl border border-black/5 dark:border-white/10 flex items-center justify-center p-2 shadow-xl shadow-emerald-500/10">
              <img src={GccLogo} alt="Logo" className="w-full h-full object-contain" />
            </div>
            {isSidebarOpen && (
              <div className="flex flex-col">
                <span className="text-slate-900 dark:text-white font-black tracking-tighter text-base uppercase leading-none">GCC Admin</span>
                <span className="text-[9px] text-emerald-500 font-black tracking-widest uppercase mt-1">Admin Panel</span>
              </div>
            )}
          </div>

          {/* Sidebar Content */}
          <nav className="flex-1 px-4 py-8 flex flex-col gap-2 overflow-y-auto scrollbar-hide">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group ${
                  location.pathname === item.path 
                    ? 'bg-emerald-500 text-white shadow-xl shadow-emerald-500/30' 
                    : 'hover:bg-black/5 dark:hover:bg-white/5 hover:text-emerald-500 dark:text-white/60'
                }`}
              >
                <div className={`transition-transform duration-500 group-hover:scale-110 ${
                  location.pathname === item.path ? 'text-white' : 'text-slate-500 group-hover:text-emerald-500'
                }`}>
                  {item.icon}
                </div>
                {isSidebarOpen && (
                  <span className="text-[10px] font-black tracking-widest uppercase truncate">
                    {item.name}
                  </span>
                )}
              </Link>
            ))}
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-black/5 dark:border-white/5">
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-red-500 hover:bg-red-500/10 transition-all group"
            >
              <LogOut className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
              {isSidebarOpen && (
                <span className="text-[10px] font-black tracking-widest uppercase">Logout</span>
              )}
            </button>
          </div>
        </div>
      </aside>
      
      {/* Backdrop for mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content - Added dynamic padding to account for fixed sidebar */}
      <div 
        className={`flex-1 flex flex-col min-w-0 transition-all duration-500 ease-in-out ${
          isSidebarOpen ? 'lg:pl-64' : 'lg:pl-20'
        } pl-0 relative`}
      >
        {/* Topbar - sticky is good, but ensuring it doesn't cause horizontal overflow */}
        <header className="h-20 md:h-24 bg-white/5 dark:bg-black/20 backdrop-blur-xl border-b border-black/5 dark:border-white/5 flex items-center justify-between px-4 md:px-8 sticky top-0 z-40 w-full overflow-hidden">
          <div className="flex items-center gap-8">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2.5 md:p-3 rounded-2xl bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 hover:border-emerald-500/50 transition-all text-slate-900 dark:text-white shadow-lg shadow-black/5"
            >
              {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div className="hidden md:flex flex-col">
              <h2 className="text-slate-900 dark:text-white font-black text-xs uppercase tracking-[0.2em]">
                {menuItems.find(i => i.path === location.pathname)?.name || 'Admin Panel'}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">
                  System Online
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-8">
            <div className="hidden lg:flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 shadow-inner">
              <Search className="w-4 h-4 text-slate-500" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="bg-transparent border-none outline-none text-[10px] text-slate-900 dark:text-white placeholder:text-slate-400 w-56 font-black uppercase tracking-widest"
              />
            </div>
            
            <div className="flex items-center gap-5 pl-8 border-l border-black/5 dark:border-white/10">
              <div className="flex flex-col items-end hidden sm:flex">
                <span className="text-slate-900 dark:text-white text-[11px] font-black uppercase tracking-tighter">{user?.name}</span>
                <span className="text-[9px] text-emerald-500 font-black uppercase tracking-widest">Administrator</span>
              </div>
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 flex items-center justify-center p-0.5 overflow-hidden ring-4 ring-emerald-500/5 shadow-xl shadow-emerald-500/10 transition-transform hover:scale-105">
                {user?.avatar ? (
                  <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover rounded-xl" />
                ) : (
                  <Shield className="w-5 h-5 md:w-6 md:h-6 text-emerald-500" />
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Viewport */}
        <main className="flex-1 p-4 md:p-8 lg:p-12 relative overflow-y-auto overflow-x-hidden">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
          
          {/* Glass Decor */}
          <div className="absolute top-20 right-20 w-[600px] h-[600px] bg-emerald-500/5 blur-[150px] rounded-full -z-10 pointer-events-none" />
          <div className="absolute bottom-20 left-20 w-[400px] h-[400px] bg-cyan-500/5 blur-[120px] rounded-full -z-10 pointer-events-none" />
        </main>
      </div>
    </div>
  );
}
