import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { eventsData } from '../data/events';
import { Calendar, Globe, Users, ArrowLeft } from 'lucide-react';
import gsap from 'gsap';

export default function Events() {
  const [eventCategory, setEventCategory] = useState('all');
  const [eventTimeFilter, setEventTimeFilter] = useState('all');

  useEffect(() => {
    window.scrollTo(0, 0);
    gsap.fromTo('.event-card-reveal', 
      { y: 30, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out' }
    );
  }, [eventCategory, eventTimeFilter]);

  const filteredEvents = eventsData.filter(item => 
    (eventCategory === 'all' || item.category === eventCategory) && 
    (eventTimeFilter === 'all' || item.time === eventTimeFilter)
  );

  return (
    <div className="min-h-screen pt-32 pb-24 px-6 relative">
      <div className="max-w-7xl mx-auto flex flex-col gap-16">
        
        {/* Header */}
        <div className="flex flex-col gap-6 max-w-3xl">
          <Link to="/" className="flex items-center gap-2 text-brand font-black text-xs uppercase tracking-widest hover:gap-3 transition-all">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <h1 className="text-4xl md:text-7xl font-black tracking-tighter text-slate-900 dark:text-white leading-tight uppercase font-cyber">
            Events <span className="text-emerald-500">&</span> Workshops
          </h1>
          <p className="text-lg font-medium text-slate-600 dark:text-slate-400 max-w-2xl">
            Explore our upcoming hackathons, technical workshops, and community meetups. Filter by category to find what interests you most.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 p-6 bg-white/5 dark:bg-white/5 backdrop-blur-3xl rounded-[2.5rem] border border-black/5 dark:border-white/10">
          <div className="flex p-1 bg-slate-200/50 dark:bg-slate-800/50 rounded-full border border-black/5 dark:border-white/5 w-max">
            {['all', 'events', 'workshops'].map((cat) => (
              <button
                key={cat}
                onClick={() => setEventCategory(cat)}
                className={`px-8 py-3 rounded-full text-[10px] font-black transition-all duration-500 uppercase ${eventCategory === cat ? 'bg-brand text-white shadow-lg shadow-brand/20' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
              >
                {cat}
              </button>
            ))}
          </div>
          
          <div className="flex items-center gap-8 px-6">
            {['all', 'upcoming', 'past'].map((time) => (
              <button
                key={time}
                onClick={() => setEventTimeFilter(time)}
                className={`text-[10px] font-black tracking-widest transition-all uppercase ${eventTimeFilter === time ? 'text-brand scale-110' : 'text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
              >
                {time}
              </button>
            ))}
          </div>
        </div>

        {/* Results Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {filteredEvents.map((item) => (
            <div key={item.id} className="event-card-reveal group bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border border-black/5 dark:border-white/10 rounded-[2.5rem] overflow-hidden hover:shadow-2xl transition-all duration-500 flex flex-col h-full hover:-translate-y-2">
              <div className="relative aspect-[4/5] sm:aspect-[3/4] overflow-hidden w-full bg-slate-200/30 dark:bg-slate-800/30">
                <img src={item.img} alt={item.title} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute top-6 left-6">
                  <span className="px-5 py-2 rounded-xl bg-brand/90 backdrop-blur-xl text-[10px] font-black text-white tracking-widest shadow-xl uppercase">{item.type}</span>
                </div>
              </div>
              <div className="p-8 md:p-10 flex flex-col flex-1 gap-8">
                <div className="flex flex-col gap-4">
                  <h4 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tighter uppercase group-hover:text-brand transition-colors leading-tight">{item.title}</h4>
                  <div className="flex flex-wrap gap-3 md:gap-4 text-[10px] md:text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    <span className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg"><Calendar className="w-3.5 h-3.5 text-brand" /> {item.date}</span>
                    <span className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg"><Globe className="w-3.5 h-3.5 text-brand" /> {item.location}</span>
                  </div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3 mt-2">
                    {item.desc}
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-auto pt-8 border-t border-black/5 dark:border-white/5">
                  <button className="py-4 rounded-2xl bg-brand text-white text-[10px] font-black tracking-widest hover:bg-emerald-700 transition-all shadow-lg shadow-brand/20 active:scale-95">
                    REGISTER
                  </button>
                  <Link to={`/event/${item.id}`} className="py-4 rounded-2xl bg-white dark:bg-slate-800 border border-black/5 dark:border-white/10 text-slate-900 dark:text-white text-[10px] font-black tracking-widest hover:bg-slate-50 dark:hover:bg-slate-700 transition-all active:scale-95 text-center flex items-center justify-center">
                    DETAILS
                  </Link>
                </div>
              </div>
            </div>
          ))}

          {filteredEvents.length === 0 && (
            <div className="col-span-full py-32 text-center flex flex-col items-center gap-4">
              <span className="text-4xl text-slate-300 dark:text-slate-700 font-black tracking-tighter uppercase">No results found</span>
              <button onClick={() => { setEventCategory('all'); setEventTimeFilter('all'); }} className="text-brand font-black text-xs uppercase tracking-widest hover:underline">Clear all filters</button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
