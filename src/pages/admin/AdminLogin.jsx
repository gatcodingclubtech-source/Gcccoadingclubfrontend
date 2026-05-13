import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Terminal, Lock, ShieldCheck, 
  ArrowRight, AlertCircle, User, Mail
} from 'lucide-react';
import gsap from 'gsap';
import { useAuth } from '../../context/AuthContext';
import GccLogo from '../../assets/logo/gcc logo.png';

export default function AdminLogin() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [localError, setLocalError] = useState('');
  const { login, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.role === 'admin') {
      navigate('/admin');
    }
  }, [user, navigate]);

  useEffect(() => {
    window.scrollTo(0, 0);
    const ctx = gsap.context(() => {
      gsap.from('.auth-card', {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: 'power4.out',
      });
      
      gsap.from('.auth-element', {
        y: 20,
        opacity: 0,
        duration: 0.8,
        stagger: 0.05,
        ease: 'power3.out',
        delay: 0.2
      });
    });
    return () => ctx.revert();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    
    // We pass username to the 'email' parameter of login
    const result = await login(formData.username, formData.password);

    if (!result.success) {
      setLocalError(result.message);
    }
  };

  return (
    <div className="min-h-screen py-12 px-6 flex items-center justify-center relative overflow-hidden">
      
      <div className="w-full max-w-md relative">
        <div className="auth-card glass-panel p-5 md:p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand/10 blur-3xl -z-10" />
          
          <div className="flex flex-col gap-3 md:gap-4">
            <div className="flex flex-col items-center text-center gap-2">
              <div className="auth-element p-2 rounded-xl bg-white dark:bg-slate-900 border border-black/5 dark:border-white/10 shadow-sm">
                <img src={GccLogo} alt="Logo" className="h-10 w-auto object-contain" />
              </div>
              <div className="flex flex-col gap-1">
                <h1 className="auth-element text-xl md:text-2xl font-black tracking-tighter text-slate-900 dark:text-white uppercase font-cyber">
                  Admin Access
                </h1>
                <p className="auth-element text-[10px] font-medium text-slate-500 dark:text-slate-400">
                  Admin Panel Access. Restricted.
                </p>
              </div>
            </div>

            {localError && (
              <div className="auth-element flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-bold">
                <AlertCircle className="w-4 h-4" />
                {localError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="auth-element flex flex-col gap-2">
                <label className="text-[10px] font-black tracking-widest text-slate-400 uppercase ml-2">Admin Username</label>
                <div className="relative group">
                  <Terminal className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-brand transition-colors" />
                  <input 
                    name="username"
                    type="text" 
                    required
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="GatAdmin"
                    className="w-full pl-10 pr-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-black/5 dark:border-white/10 focus:border-brand focus:ring-4 focus:ring-brand/10 outline-none transition-all text-[11px] font-bold"
                  />
                </div>
              </div>

              <div className="auth-element flex flex-col gap-2">
                <label className="text-[10px] font-black tracking-widest text-slate-400 uppercase ml-2">Access Key</label>
                <div className="relative group">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-brand transition-colors" />
                  <input 
                    name="password"
                    type="password" 
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-black/5 dark:border-white/10 focus:border-brand focus:ring-4 focus:ring-brand/10 outline-none transition-all text-[11px] font-bold"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={authLoading}
                className="w-full mt-2 py-3 rounded-xl bg-brand text-white font-black text-xs tracking-[0.2em] hover:bg-emerald-600 transition-all shadow-xl shadow-brand/20 active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {authLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>LOGGING IN...</span>
                  </div>
                ) : (
                  <>
                    LOGIN <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="flex flex-col gap-4 pt-3 border-t border-black/5 dark:border-white/5">
              <p className="auth-element text-center text-xs font-bold text-slate-500">
                Regular Member?{' '}
                <button 
                  onClick={() => navigate('/auth')}
                  className="text-brand hover:underline font-black"
                >
                  Member Login
                </button>
              </p>
            </div>
          </div>
        </div>

        <div className="auth-element mt-4 flex items-center justify-center gap-2 text-slate-400 dark:text-slate-600">
          <ShieldCheck className="w-3 h-3" />
          <span className="text-[9px] font-black tracking-widest uppercase">Admin Secured</span>
        </div>
      </div>
    </div>
  );
}
