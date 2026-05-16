import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Layers, Zap, ArrowLeft, Loader2, Search } from 'lucide-react';
import gsap from 'gsap';
import axios from 'axios';

const IconMap = {
  Code: <Layers className="w-14 h-14" />,
  Sparkles: <Zap className="w-14 h-14" />,
  // Add other mappings if they exist in Home.jsx
};

export default function Domains() {
  const [domains, setDomains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchDomains();
    window.scrollTo(0, 0);
  }, []);

  const fetchDomains = async () => {
    try {
      const res = await axios.get('/api/domains');
      if (res.data.success) {
        setDomains(res.data.domains);
      }
    } catch (err) {
      console.error('Error fetching domains', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!loading) {
      gsap.fromTo('.domain-card-reveal', 
        { y: 30, opacity: 0, scale: 0.95 }, 
        { y: 0, opacity: 1, scale: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out' }
      );
    }
  }, [loading, searchQuery]);

  const filteredDomains = domains.filter(domain => 
    domain.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    domain.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen pt-32 pb-24 px-6 relative bg-white dark:bg-slate-950">
      <div className="max-w-7xl mx-auto flex flex-col gap-16">
        
        {/* Header */}
        <div className="flex flex-col gap-6 max-w-3xl">
          <Link to="/" className="flex items-center gap-2 text-emerald-500 font-black text-xs uppercase tracking-widest hover:gap-3 transition-all">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <h1 className="text-4xl md:text-7xl font-black tracking-tighter text-slate-900 dark:text-white leading-tight uppercase font-cyber">
            Specialized <span className="text-emerald-500">Domains</span>
          </h1>
          <p className="text-lg font-medium text-slate-600 dark:text-slate-400 max-w-2xl">
            Our elite vertical divisions. Dedicated ecosystems of tools, mentorship, and high-impact projects. Explore the domains and join the one that fits your passion.
          </p>
        </div>

        {/* Search Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 p-4 bg-slate-50 dark:bg-white/5 backdrop-blur-3xl rounded-3xl border border-black/5 dark:border-white/10">
          <div className="flex items-center gap-4 px-6 py-2 bg-white dark:bg-slate-900 rounded-2xl border border-black/5 dark:border-white/5 flex-1">
            <Search className="w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search domains (e.g. Web, AI, App)..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-sm font-bold text-slate-900 dark:text-white w-full py-2"
            />
          </div>
          <div className="flex items-center gap-3 px-6 text-xs font-black text-slate-400 uppercase tracking-widest">
            Total Sectors: <span className="text-emerald-500">{filteredDomains.length}</span>
          </div>
        </div>

        {/* Results Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {loading ? (
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="glass-panel h-[400px] animate-pulse bg-black/5 dark:bg-white/5 rounded-[2.5rem]" />
            ))
          ) : filteredDomains.length === 0 ? (
            <div className="col-span-full py-32 text-center flex flex-col items-center gap-4">
              <span className="text-4xl text-slate-300 dark:text-slate-700 font-black tracking-tighter uppercase">No domains found</span>
              <button onClick={() => setSearchQuery('')} className="text-emerald-500 font-black text-xs uppercase tracking-widest hover:underline">Clear search</button>
            </div>
          ) : (
            filteredDomains.map((domain) => (
              <div 
                key={domain._id} 
                className="domain-card-reveal group relative flex flex-col h-[400px] rounded-[2.5rem] overflow-hidden bg-white dark:bg-slate-900/40 border border-black/5 dark:border-white/10 hover:border-emerald-500/30 transition-all duration-700 hover:shadow-2xl hover:shadow-emerald-500/10"
              >
                {/* Visual Accent */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-bl-[100%] transition-all duration-700 group-hover:bg-emerald-500/10" />
                
                {/* Content Container */}
                <div className="relative z-10 flex flex-col h-full p-8 md:p-10 justify-between">
                  <div className="flex flex-col gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 shadow-md group-hover:scale-110 transition-all duration-700">
                      <Layers className="w-8 h-8" />
                    </div>
                    
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center gap-2">
                         <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                         <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Sector</span>
                      </div>
                      <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight uppercase group-hover:text-emerald-500 transition-colors">
                        {domain.title}
                      </h3>
                      <p className="text-sm font-medium text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-4">
                        {domain.desc}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4 pt-6 border-t border-black/5 dark:border-white/5">
                    <div className="grid grid-cols-2 gap-4">
                      <Link 
                        to={`/register/domain/${domain._id}`} 
                        className="py-4 rounded-2xl bg-slate-950 dark:bg-white text-white dark:text-slate-950 text-[10px] font-black tracking-widest uppercase hover:scale-[1.02] active:scale-[0.98] transition-all text-center flex items-center justify-center gap-2"
                      >
                        JOIN <Zap className="w-3 h-3 text-emerald-500" />
                      </Link>
                      <Link 
                        to={`/domain/${domain.slug}`} 
                        className="py-4 rounded-2xl bg-white dark:bg-slate-800 border border-black/5 dark:border-white/5 text-slate-900 dark:text-white text-[10px] font-black tracking-widest uppercase hover:bg-slate-50 dark:hover:bg-slate-700 transition-all text-center flex items-center justify-center"
                      >
                        DETAILS
                      </Link>
                    </div>
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
