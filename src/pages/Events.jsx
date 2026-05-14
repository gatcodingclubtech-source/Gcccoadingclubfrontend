import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Globe, Users, ArrowLeft, Loader2 } from 'lucide-react';
import gsap from 'gsap';
import axios from 'axios';

export default function Events() {
  const [eventCategory, setEventCategory] = useState('all');
  const [eventTimeFilter, setEventTimeFilter] = useState('all');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await axios.get('/api/events');
      if (res.data.success) {
        setEvents(res.data.events);
      }
    } catch (err) {
      console.error('Error fetching events', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    gsap.fromTo('.event-card-reveal', 
      { y: 30, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out' }
    );
  }, [eventCategory, eventTimeFilter]);

  const filteredEvents = events.filter(item => {
    const matchesCategory = eventCategory === 'all' || item.category.toLowerCase() === eventCategory.toLowerCase();
    
    // Date filter logic
    const eventDate = new Date(item.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let matchesTime = true;
    if (eventTimeFilter === 'upcoming') {
      matchesTime = eventDate >= today;
    } else if (eventTimeFilter === 'past') {
      matchesTime = eventDate < today;
    }

    return matchesCategory && matchesTime && item.isActive !== false;
  });

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
          {loading ? (
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="glass-panel h-[450px] animate-pulse bg-black/5 dark:bg-white/5 rounded-[2.5rem]" />
            ))
          ) : filteredEvents.length === 0 ? (
            <div className="col-span-full py-32 text-center flex flex-col items-center gap-4">
              <span className="text-4xl text-slate-300 dark:text-slate-700 font-black tracking-tighter uppercase">No results found</span>
              <button onClick={() => { setEventCategory('all'); setEventTimeFilter('all'); }} className="text-brand font-black text-xs uppercase tracking-widest hover:underline">Clear all filters</button>
            </div>
          ) : (
            filteredEvents.map((item) => (
              <div key={item._id} className="event-card-reveal group bg-white/50 dark:bg-slate-900/50 glass-panel border border-black/5 dark:border-white/10 rounded-[2.5rem] overflow-hidden hover:shadow-2xl transition-all duration-500 flex flex-col h-full hover:-translate-y-2">
                <div className="relative aspect-[16/10] overflow-hidden w-full bg-slate-200/30 dark:bg-slate-800/30 border-b border-black/5 dark:border-white/5">
                  <img src={item.image || 'https://via.placeholder.com/800x500'} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute top-4 left-4">
                    <span className="px-4 py-1.5 rounded-lg bg-brand/90 backdrop-blur-xl text-[9px] font-black text-white tracking-widest shadow-xl uppercase">{item.category}</span>
                  </div>
                </div>
                <div className="p-6 md:p-8 flex flex-col flex-1 gap-6">
                  <div className="flex flex-col gap-3">
                    <h4 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tighter uppercase group-hover:text-brand transition-colors leading-tight line-clamp-2 min-h-[3.5rem]">{item.title}</h4>
                    <div className="flex flex-wrap gap-2 text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      <span className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
                        <Calendar className="w-3 h-3 text-brand" /> 
                        {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                      <span className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg"><Globe className="w-3 h-3 text-brand" /> {item.venue}</span>
                    </div>
                    <p className="text-xs font-medium text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2 mt-2">
                      {item.shortDesc || item.description}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 mt-auto pt-6 border-t border-black/5 dark:border-white/5">
                    <Link to={`/event/${item._id}`} className="py-3.5 rounded-xl bg-white dark:bg-slate-800 border border-black/5 dark:border-white/10 text-slate-900 dark:text-white text-[9px] font-black tracking-widest hover:bg-slate-50 dark:hover:bg-slate-700 transition-all active:scale-95 text-center flex items-center justify-center">
                      DETAILS
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}
