import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, ArrowRight, Sparkles, X, Trophy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';

const CountdownUnit = ({ value, label }) => (
  <div className="flex flex-col items-center">
    <span className="text-2xl md:text-3xl font-black text-white leading-none">{value.toString().padStart(2, '0')}</span>
    <span className="text-[8px] font-black text-white/40 uppercase tracking-widest mt-1">{label}</span>
  </div>
);

export default function BannerSpotlight({ banners }) {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState({ d: 0, h: 0, m: 0, s: 0 });
  const [isVisible, setIsVisible] = useState(true);

  const banner = banners?.[currentIndex];

  useEffect(() => {
    if (banners?.length <= 1) return;
    const slideTimer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(slideTimer);
  }, [banners]);

  useEffect(() => {
    if (!banner?.targetDate) return;

    const timer = setInterval(() => {
      const target = new Date(banner.targetDate).getTime();
      const now = new Date().getTime();
      const distance = target - now;

      if (distance < 0) {
        clearInterval(timer);
        return;
      }

      setTimeLeft({
        d: Math.floor(distance / (1000 * 60 * 60 * 24)),
        h: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        m: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        s: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [banner]);

  if (!banner || !isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        className="w-full px-6 mb-12 relative z-50"
      >
        <div className="max-w-7xl mx-auto">
          <div className="relative group h-[300px] md:h-[350px] rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/10">
            
            {/* Background Image with Parallax & Overlay */}
            <div className="absolute inset-0">
              <img 
                src={banner.image} 
                alt={banner.title} 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            </div>

            {/* Animated Glow Elements */}
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-${banner.color}-500/20 rounded-full blur-[120px] pointer-events-none animate-pulse`} />

            {/* Content Container */}
            <div className="relative h-full flex flex-col justify-center p-8 md:p-16">
              <div className="flex flex-col gap-4 max-w-2xl">
                <div className="flex items-center gap-3">
                  <div className={`px-4 py-1.5 rounded-full bg-${banner.color}-500 text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-${banner.color}-500/30 flex items-center gap-2`}>
                    <Sparkles className="w-3 h-3" /> {banner.type}
                  </div>
                  {banner.targetDate && (
                    <div className="flex items-center gap-2 text-white/60 text-[10px] font-black uppercase tracking-widest">
                      <Calendar className="w-3.5 h-3.5" /> Upcoming
                    </div>
                  )}
                </div>

                <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter leading-none drop-shadow-2xl">
                  {banner.title}
                </h1>
                
                <p className="text-base md:text-lg text-white/70 font-medium max-w-lg leading-relaxed mb-4">
                  {banner.subtitle}
                </p>

                <div className="flex flex-wrap items-center gap-8 mt-4">
                  <button 
                    onClick={() => navigate(banner.link)}
                    className={`px-10 py-5 rounded-2xl bg-white text-black text-xs font-black tracking-[0.2em] hover:scale-105 transition-all shadow-2xl flex items-center gap-3 group/btn`}
                  >
                    JOIN NOW <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                  </button>

                  {/* Countdown Timer */}
                  {banner.targetDate && (
                    <div className="flex items-center gap-6 px-8 py-4 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10">
                      <CountdownUnit value={timeLeft.d} label="Days" />
                      <div className="w-px h-8 bg-white/10" />
                      <CountdownUnit value={timeLeft.h} label="Hrs" />
                      <div className="w-px h-8 bg-white/10" />
                      <CountdownUnit value={timeLeft.m} label="Min" />
                      <div className="w-px h-8 bg-white/10" />
                      <CountdownUnit value={timeLeft.s} label="Sec" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Close Button */}
            <button 
              onClick={() => setIsVisible(false)}
              className="absolute top-8 right-8 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-all border border-white/10"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Branding Accent */}
            <div className="absolute bottom-8 right-8 flex items-center gap-3 opacity-30">
               <span className="text-[10px] font-black text-white uppercase tracking-[0.3em]">GCC ELITE NODE</span>
               <div className={`w-8 h-[2px] bg-${banner.color}-500`} />
            </div>

          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
