import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, ArrowRight, Sparkles, X, Trophy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';

const CountdownUnit = ({ value, label }) => (
  <div className="flex flex-col items-center">
    <span className="text-lg md:text-3xl font-black text-white leading-none">{value.toString().padStart(2, '0')}</span>
    <span className="text-[6px] md:text-[8px] font-black text-white/40 uppercase tracking-widest mt-1">{label}</span>
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
    }, 8000); // Slower rotation for better readability
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

  const handleDragEnd = (event, info) => {
    if (banners.length <= 1) return;
    const swipeThreshold = 30; // More sensitive swipe
    if (info.offset.x > swipeThreshold) {
      setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
    } else if (info.offset.x < -swipeThreshold) {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }
  };

  if (!banner || !isVisible) return null;

  return (
    <>
      {/* Mobile Floating Overlay Background */}
      <AnimatePresence>
        {!isVisible ? null : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[998] md:hidden"
            onClick={() => setIsVisible(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence mode="popLayout">
        {!isVisible ? null : (
          <motion.div 
            key={currentIndex}
            initial={{ x: "100%", rotateY: 45, opacity: 0, scale: 0.9 }}
            animate={{ x: 0, rotateY: 0, opacity: 1, scale: 1 }}
            exit={{ x: "-100%", rotateY: -45, opacity: 0, scale: 0.9 }}
            transition={{ 
              type: "spring",
              stiffness: 250, // Higher stiffness for instant snap
              damping: 30,    // Controlled bounce
              mass: 0.8,      // Lighter weight for speed
              opacity: { duration: 0.2 }
            }}
            style={{ perspective: 1200 }}
            drag="x"
            dragElastic={0.2}
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={handleDragEnd}
            className="fixed md:relative inset-x-0 bottom-10 md:bottom-auto top-20 md:top-auto z-[999] md:z-50 px-4 md:px-6 cursor-grab active:cursor-grabbing flex items-center justify-center"
          >
        <div className="w-full max-w-7xl mx-auto">
          <div className="relative group h-[70vh] md:h-[380px] rounded-[2.5rem] overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10">
            
            {/* Background Image with Parallax & Overlay */}
            <div className="absolute inset-0">
              <img 
                src={banner.image} 
                alt={banner.title} 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-b md:bg-gradient-to-r from-black via-black/80 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
            </div>

            {/* Animated Glow Elements */}
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] md:w-[500px] h-[400px] md:h-[500px] bg-${banner.color}-500/30 rounded-full blur-[100px] md:blur-[120px] pointer-events-none animate-pulse`} />

            {/* Content Container */}
            <div className="relative h-full flex flex-col justify-center p-6 md:p-16">
              <div className="flex flex-col gap-3 md:gap-5 max-w-2xl text-center md:text-left items-center md:items-start">
                <div className="flex items-center gap-3">
                  <div className={`px-5 py-2 rounded-full bg-${banner.color}-500 text-white text-[10px] md:text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-${banner.color}-500/40 flex items-center gap-2`}>
                    <Sparkles className="w-3.5 h-3.5" /> {banner.type}
                  </div>
                  {banner.targetDate && (
                    <div className="flex items-center gap-2 text-white text-[10px] font-black uppercase tracking-widest">
                      <Calendar className="w-4 h-4 text-emerald-400" /> Upcoming
                    </div>
                  )}
                </div>

                <h1 className="text-2xl md:text-6xl font-black text-white uppercase tracking-tighter leading-none drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]">
                  {banner.title}
                </h1>
                
                <p className="text-[10px] md:text-lg text-white/80 font-bold max-w-lg leading-relaxed mb-4 md:mb-8">
                  {banner.subtitle}
                </p>

                <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 md:gap-8 w-full md:w-auto">
                  <button 
                    onClick={(e) => { e.stopPropagation(); navigate(banner.link); }}
                    className={`px-8 md:px-10 py-4 md:py-5 rounded-xl md:rounded-2xl bg-white text-black text-[10px] md:text-xs font-black tracking-[0.2em] hover:scale-105 transition-all shadow-2xl flex items-center justify-center gap-3 group/btn`}
                  >
                    JOIN NOW <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                  </button>

                  {/* Countdown Timer */}
                  {banner.targetDate && (
                    <div className="flex items-center justify-center gap-4 md:gap-8 px-6 md:px-8 py-3 md:py-4 bg-white/10 backdrop-blur-2xl rounded-2xl md:rounded-3xl border border-white/20 shadow-2xl">
                      <CountdownUnit value={timeLeft.d} label="Days" />
                      <div className="w-px h-10 bg-white/20" />
                      <CountdownUnit value={timeLeft.h} label="Hrs" />
                      <div className="w-px h-10 bg-white/20" />
                      <CountdownUnit value={timeLeft.m} label="Min" />
                      <div className="w-px h-10 bg-white/20" />
                      <CountdownUnit value={timeLeft.s} label="Sec" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Navigation Dots for Mobile */}
            {banners.length > 1 && (
              <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3 md:hidden">
                {banners.map((_, i) => (
                  <button 
                    key={i} 
                    onClick={(e) => { e.stopPropagation(); setCurrentIndex(i); }}
                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${i === currentIndex ? 'bg-white w-8' : 'bg-white/20'}`} 
                  />
                ))}
              </div>
            )}

            {/* Close Button */}
            <button 
              onClick={(e) => { e.stopPropagation(); setIsVisible(false); }}
              className="absolute top-8 right-8 w-12 h-12 rounded-full bg-white/20 backdrop-blur-xl flex items-center justify-center text-white hover:bg-white/40 transition-all border border-white/20 z-[1000] shadow-2xl"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Branding Accent */}
            <div className="absolute bottom-8 right-8 hidden md:flex items-center gap-3 opacity-30">
               <span className="text-[10px] font-black text-white uppercase tracking-[0.3em]">GCC ELITE NODE</span>
               <div className={`w-8 h-[2px] bg-${banner.color}-500`} />
            </div>

          </div>
        </div>
      </motion.div>
    )}
    </AnimatePresence>
    </>
  );
}
