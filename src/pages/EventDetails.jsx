import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Calendar, Globe, Users, Share2, 
  MapPin, Clock, CheckCircle2, Zap, Timer,
  AlertTriangle, Rocket, ChevronRight
} from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  const [error, setError] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  
  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true);
      setError(false);
      try {
        const res = await axios.get(`/api/events/${id}`);
        if (res.data.success) {
          setEvent(res.data.event);
          if (user && res.data.event.attendees?.includes(user._id)) {
            setIsRegistered(true);
          }
        } else {
          setError(true);
        }
      } catch (err) {
        console.error('Error fetching event:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id, user]);

  // Countdown Logic
  useEffect(() => {
    if (!event) return;
    
    const targetDate = new Date(event.date);
    
    const calculateTime = () => {
      const now = new Date();
      const difference = targetDate - now;
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      }
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);
    return () => clearInterval(timer);
  }, [event]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Loading Experience...</span>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-black p-6">
        <div className="flex flex-col gap-6 text-center items-center max-w-md">
          <div className="w-20 h-20 rounded-3xl bg-red-500/10 flex items-center justify-center text-red-500">
             <Calendar className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Event Not Found</h1>
          <p className="text-sm text-slate-500 font-medium leading-relaxed">The event you are looking for does not exist or has been removed. Check the URL or return to home.</p>
          <Link to="/" className="px-10 py-4 rounded-xl bg-emerald-500 text-white font-black hover:scale-105 transition-transform shadow-xl uppercase tracking-widest text-[10px]">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black text-slate-900 dark:text-white pb-32">
      
      {/* 1. Header Section */}
      <div className="relative w-full bg-slate-900 overflow-hidden pt-24 pb-12">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]" />
        
        <div className="max-w-7xl mx-auto px-6 py-12 md:py-24 relative z-10">
          <div className="flex flex-col gap-8">
            <Link to="/" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-white/50 hover:text-emerald-400 transition-all w-fit">
              <ArrowLeft className="w-4 h-4" /> Back to Events
            </Link>

            <div className="grid lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-7 flex flex-col gap-6">
                <div className="flex items-center gap-3">
                   <span className="px-4 py-1.5 rounded-lg bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest">
                     {event.category}
                   </span>
                   <div className="flex items-center gap-2 text-emerald-400">
                      <Zap className="w-4 h-4 animate-pulse" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Live Now</span>
                   </div>
                </div>
                
                <h1 className="text-4xl md:text-7xl font-black tracking-tighter text-white uppercase leading-[0.9]">
                  {event.title}
                </h1>

                <div className="flex flex-wrap gap-4 text-white/60 text-xs font-bold uppercase tracking-widest mt-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-emerald-500" /> 
                    {new Date(event.date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-emerald-500" /> {event.venue}
                  </div>
                </div>
              </div>

              {/* Countdown Card */}
              <div className="lg:col-span-5">
                <div className="bg-white/10 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 md:p-10 flex flex-col gap-8 shadow-2xl">
                   <div className="flex flex-col gap-2 text-center">
                      <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400">Event Starts In</h4>
                      <div className="grid grid-cols-4 gap-4">
                        {[
                          { label: 'Days', val: timeLeft.days },
                          { label: 'Hrs', val: timeLeft.hours },
                          { label: 'Min', val: timeLeft.minutes },
                          { label: 'Sec', val: timeLeft.seconds }
                        ].map((t, idx) => (
                          <div key={idx} className="flex flex-col items-center">
                            <span className="text-3xl md:text-4xl font-black text-white">{String(t.val).padStart(2, '0')}</span>
                            <span className="text-[8px] font-black uppercase tracking-widest text-white/40">{t.label}</span>
                          </div>
                        ))}
                      </div>
                   </div>

                   <div className="h-px bg-white/10" />

                   <Link 
                     to={`/register/event/${id}`}
                     className={`w-full py-5 rounded-2xl text-xs font-black tracking-[0.2em] flex items-center justify-center gap-3 transition-all active:scale-95 uppercase shadow-xl ${isRegistered ? 'bg-emerald-500 text-white' : 'bg-white text-slate-900 hover:bg-emerald-500 hover:text-white'}`}
                   >
                     {isRegistered ? <><CheckCircle2 className="w-4 h-4" /> YOU ARE IN</> : 'REGISTER FOR EVENT'}
                   </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Content Sections */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-3 gap-16">
          
          <div className="lg:col-span-2 flex flex-col gap-12">
            <div>
               <h2 className="text-2xl font-black uppercase tracking-tighter mb-6 flex items-center gap-3 text-slate-900 dark:text-white">
                  <div className="w-1 h-8 bg-emerald-500 rounded-full" />
                  Overview
               </h2>
               <p className="text-lg text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                 {event.description}
               </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-8">
               <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-black/5 dark:border-white/5 shadow-sm">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-emerald-500 mb-6">
                    <Rocket className="w-6 h-6" />
                  </div>
                  <h4 className="text-lg font-black uppercase tracking-tighter mb-3 text-slate-900 dark:text-white">The Experience</h4>
                  <p className="text-sm text-slate-500 font-medium leading-relaxed">A high-energy session designed to accelerate your technical skills through collaborative building and expert guidance.</p>
               </div>
               <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-black/5 dark:border-white/5 shadow-sm">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-emerald-500 mb-6">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="text-lg font-black uppercase tracking-tighter mb-3 text-slate-900 dark:text-white">Requirements</h4>
                  <p className="text-sm text-slate-500 font-medium leading-relaxed">Open to all students with basic coding knowledge. Please bring your laptop and high enthusiasm!</p>
               </div>
            </div>

            {event.rules && (
              <div>
                 <h2 className="text-2xl font-black uppercase tracking-tighter mb-6 flex items-center gap-3 text-slate-900 dark:text-white">
                    <div className="w-1 h-8 bg-red-500 rounded-full" />
                    Rules & Regulations
                 </h2>
                 <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-black/5 dark:border-white/5 shadow-sm flex flex-col gap-4">
                    {event.rules.split('\n').map((rule, idx) => {
                      if (!rule.trim()) return null;
                      return (
                        <div key={idx} className="flex gap-4 items-start">
                          <div className="mt-1 min-w-[6px] w-1.5 h-1.5 rounded-full bg-red-500" />
                          <p className="text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed">{rule}</p>
                        </div>
                      );
                    })}
                 </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-1 flex flex-col gap-10">
             <div className="p-8 rounded-[2rem] border-2 border-dashed border-slate-200 dark:border-white/10">
                <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                  <Clock className="w-4 h-4" /> Registration Due In
                </h4>
                <div className="flex items-center gap-4 text-emerald-500">
                  <div className="flex flex-col">
                    <span className="text-3xl font-black leading-none">{timeLeft.days}d</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest">Left</span>
                  </div>
                  <div className="w-px h-10 bg-slate-200 dark:bg-white/10" />
                  <p className="text-[11px] font-medium leading-tight text-slate-500 max-w-[120px]">
                    Register before the portal closes to ensure entry.
                  </p>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
