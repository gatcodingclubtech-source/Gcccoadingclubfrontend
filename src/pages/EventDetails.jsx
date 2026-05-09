import React, { useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Globe, Users, Share2, MapPin, Clock } from 'lucide-react';
import gsap from 'gsap';
import { eventsData } from '../data/events';

export default function EventDetails() {
  const { id } = useParams();
  const event = eventsData.find(e => e.id === parseInt(id));
  
  const heroRef = useRef(null);
  const contentRef = useRef(null);
  const elementsRef = useRef([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    if (!event) return;

    // Reset elements for animation
    gsap.set(heroRef.current, { scale: 1.1, opacity: 0 });
    gsap.set(contentRef.current, { y: 100, opacity: 0 });
    gsap.set(elementsRef.current, { y: 30, opacity: 0 });

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.to(heroRef.current, { scale: 1, opacity: 1, duration: 1.5 })
      .to(contentRef.current, { y: 0, opacity: 1, duration: 1 }, "-=1")
      .to(elementsRef.current, { y: 0, opacity: 1, duration: 0.8, stagger: 0.1 }, "-=0.6");

    return () => tl.kill();
  }, [id, event]);

  const addToRefs = (el) => {
    if (el && !elementsRef.current.includes(el)) {
      elementsRef.current.push(el);
    }
  };

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-black">
        <div className="flex flex-col gap-6 text-center items-center">
          <div className="w-24 h-24 rounded-full bg-brand/10 flex items-center justify-center text-brand">
            <span className="text-4xl font-black">?</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white">Event Not Found</h1>
          <p className="text-slate-500 font-medium">The event you are looking for does not exist or has been removed.</p>
          <Link to="/" className="px-8 py-4 rounded-full bg-brand text-white font-black hover:scale-105 transition-transform shadow-xl shadow-brand/20">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black selection:bg-brand selection:text-white">
      {/* 1. Massive Hero Image Header */}
      <div className="relative w-full h-[50vh] md:h-[65vh] overflow-hidden flex items-start p-6 md:p-10 z-0">
        <div 
          ref={heroRef}
          className="absolute inset-0 w-full h-full"
        >
          {typeof event.img === 'string' ? (
            <img src={event.img} alt={event.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-slate-900 flex items-center justify-center">No Image Available</div>
          )}
          {/* Gradient Overlay for text readability and premium fade effect */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-slate-900/40 to-transparent dark:from-black"></div>
        </div>

        {/* Floating Back Button */}
        <Link 
          to="/" 
          className="relative z-10 w-12 h-12 rounded-full bg-white/20 dark:bg-black/20 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-slate-900 transition-all duration-300 shadow-2xl group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* 2. Overlapping Content Panel */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 -mt-32 md:-mt-48 pb-32">
        <div 
          ref={contentRef}
          className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-3xl border border-white/50 dark:border-white/10 rounded-[2.5rem] p-8 md:p-14 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)]"
        >
          {/* Header Area */}
          <div className="flex flex-col gap-6 border-b border-black/5 dark:border-white/5 pb-10">
            <div ref={addToRefs} className="flex items-center justify-between">
              <span className="text-xs font-black tracking-[0.2em] text-brand uppercase bg-brand/10 px-5 py-2 rounded-xl border border-brand/20">
                {event.type}
              </span>
              <button className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-brand transition-colors">
                <Share2 className="w-4 h-4" />
              </button>
            </div>
            
            <h1 ref={addToRefs} className="text-4xl md:text-6xl lg:text-7xl font-black text-slate-900 dark:text-white tracking-tighter leading-[1.1]">
              {event.title}
            </h1>
            
            <div ref={addToRefs} className="flex flex-wrap gap-3 md:gap-6 mt-2">
              <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800/50">
                <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center"><Calendar className="w-4 h-4 text-emerald-500" /></div>
                <span className="text-xs md:text-sm font-bold text-slate-700 dark:text-slate-300">{event.date}</span>
              </div>
              <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800/50">
                <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center"><MapPin className="w-4 h-4 text-emerald-500" /></div>
                <span className="text-xs md:text-sm font-bold text-slate-700 dark:text-slate-300">{event.location}</span>
              </div>
              {event.participants && (
                <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800/50">
                  <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center"><Users className="w-4 h-4 text-purple-500" /></div>
                  <span className="text-xs md:text-sm font-bold text-slate-700 dark:text-slate-300">{event.participants}</span>
                </div>
              )}
            </div>
          </div>

          {/* Body Content */}
          <div className="grid lg:grid-cols-3 gap-12 mt-10">
            <div className="lg:col-span-2 flex flex-col gap-8">
              <div ref={addToRefs}>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4">About this {event.category === 'events' ? 'Event' : 'Workshop'}</h3>
                <p className="text-base md:text-lg text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                  {event.desc}
                </p>
                <p className="text-base md:text-lg text-slate-600 dark:text-slate-400 font-medium leading-relaxed mt-4">
                  Join us for an exciting session where we dive deep into the subject matter. Whether you are a beginner or an experienced developer, there's something for everyone to learn and enjoy. Networking opportunities and hands-on guidance will be provided by our core team and special guests.
                </p>
              </div>
              
              <div ref={addToRefs} className="p-6 md:p-8 rounded-3xl bg-slate-50 dark:bg-slate-950 border border-black/5 dark:border-white/5">
                <h4 className="text-lg font-black text-slate-900 dark:text-white mb-3">Agenda</h4>
                <ul className="flex flex-col gap-4 text-sm font-medium text-slate-600 dark:text-slate-400">
                  <li className="flex items-start gap-4"><span className="text-brand font-black w-16">10:00 AM</span> Registration & Welcome</li>
                  <li className="flex items-start gap-4"><span className="text-brand font-black w-16">10:30 AM</span> Main Keynote & Intro</li>
                  <li className="flex items-start gap-4"><span className="text-brand font-black w-16">11:30 AM</span> Hands-on Session starts</li>
                  <li className="flex items-start gap-4"><span className="text-brand font-black w-16">01:00 PM</span> Networking & Conclusion</li>
                </ul>
              </div>
            </div>

            {/* Sidebar Action Area */}
            <div className="lg:col-span-1 flex flex-col gap-6">
              <div ref={addToRefs} className="p-8 rounded-[2rem] bg-gradient-to-br from-brand to-emerald-600 text-white shadow-2xl shadow-brand/30 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 transition-transform group-hover:scale-150 duration-700"></div>
                <h4 className="text-xl font-black mb-2 relative z-10">Ready to join?</h4>
                <p className="text-xs font-medium text-white/80 mb-8 relative z-10">Secure your spot before seats run out.</p>
                <button className="w-full py-4 rounded-xl bg-white text-brand text-sm font-black tracking-widest hover:scale-105 transition-transform active:scale-95 shadow-xl relative z-10">
                  REGISTER NOW
                </button>
              </div>

              <div ref={addToRefs} className="p-6 rounded-[2rem] border border-black/10 dark:border-white/10 flex flex-col gap-4">
                <button className="w-full py-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-black tracking-widest hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-2">
                  <Calendar className="w-4 h-4" /> ADD TO CALENDAR
                </button>
                <p className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Open to all GAT students
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
