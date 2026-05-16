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
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right
  const [timeLeft, setTimeLeft] = useState({ d: 0, h: 0, m: 0, s: 0 });
  const [isVisible, setIsVisible] = useState(true);

  const banner = banners?.[currentIndex];

  useEffect(() => {
    if (banners?.length <= 1) return;
    const slideTimer = setInterval(() => {
      setDirection(1);
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
      setDirection(-1);
      setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
    } else if (info.offset.x < -swipeThreshold) {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }
  };

  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
      zIndex: 1000
    }),
    center: {
      zIndex: 1000,
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      zIndex: 1000,
      x: direction < 0 ? 100 : -100,
      opacity: 0
    })
  };

  useEffect(() => {
    if (isVisible) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isVisible]);

  if (!banner || !isVisible) return null;

  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          nav { display: ${isVisible ? 'none' : 'flex'} !important; }
        }
      `}</style>
      
      {/* Mobile Floating Overlay Background (Hidden on Desktop) */}
      {isVisible && (
        <div 
          className="fixed inset-0 bg-black/95 z-[10000] md:hidden"
          onClick={() => setIsVisible(false)}
        />
      )}
      
      {isVisible && (
        <motion.div 
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.4}
          onDragEnd={handleDragEnd}
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsVisible(false);
          }}
          className="fixed md:relative inset-0 md:inset-auto md:top-auto md:bottom-auto z-[10001] md:z-50 px-4 md:px-6 flex items-center justify-center cursor-grab active:cursor-grabbing"
        >
          <div className="w-full h-auto max-w-7xl mx-auto flex items-center justify-center">
            {/* Main Card Container */}
            <div className="relative w-full h-[85vh] md:h-[500px] rounded-[2rem] md:rounded-[3rem] overflow-hidden bg-slate-950 border border-white/10 shadow-2xl">
              
              {/* Background Image Layer - GPU Accelerated */}
              <div className="absolute inset-0 z-0">
                <img 
                  src={banner.image} 
                  alt={banner.title} 
                  className="w-full h-full object-cover opacity-70 md:opacity-60 transform-gpu"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
              </div>

              {/* Content Layer */}
              <div className="relative z-10 h-full flex flex-col justify-end md:justify-center p-6 md:p-16 pb-12 md:pb-16">
                <div className="flex flex-col gap-4 md:gap-6 max-w-2xl text-left">
                  
                  {/* Badge & Meta */}
                  <div className="flex items-center gap-2">
                    <div className={`px-3 py-1 rounded-full bg-${banner.color}-500 text-white text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2`}>
                      <Sparkles className="w-3 h-3 md:w-3.5 md:h-3.5" /> {banner.type}
                    </div>
                    {banner.targetDate && (
                      <div className="px-2 py-1 rounded-full bg-white/10 border border-white/10 text-white text-[7px] md:text-[9px] font-black uppercase tracking-widest flex items-center gap-2">
                         <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" /> Live
                      </div>
                    )}
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-2 md:space-y-4">
                    <h1 className="text-2xl md:text-7xl font-black text-white uppercase tracking-tighter leading-[0.95]">
                      {banner.title}
                    </h1>
                    <p className="text-[10px] md:text-xl text-white/60 font-bold max-w-lg leading-relaxed">
                      {banner.subtitle}
                    </p>
                  </div>

                  {/* Action Area */}
                  <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 mt-2 md:mt-4">
                    <button 
                      onClick={(e) => { e.stopPropagation(); navigate(banner.link); }}
                      className="group relative px-6 md:px-10 py-3 md:py-5 rounded-xl md:rounded-2xl bg-white text-black text-[9px] md:text-xs font-black tracking-[0.2em] transition-all flex items-center justify-center gap-3 overflow-hidden"
                    >
                      <span className="relative z-10 uppercase">Connect Node</span>
                      <ArrowRight className="w-4 h-4 md:w-5 md:h-5 relative z-10" />
                    </button>

                    {/* Countdown Timer - SECONDS FIXED */}
                    {banner.targetDate && (
                      <div className="flex items-center justify-center gap-4 md:gap-8 px-4 md:px-8 py-2 md:py-4 bg-black/60 rounded-xl md:rounded-[2rem] border border-white/10">
                        <CountdownUnit value={timeLeft.d} label="Days" />
                        <div className="w-px h-5 md:h-10 bg-white/10" />
                        <CountdownUnit value={timeLeft.h} label="Hrs" />
                        <div className="w-px h-5 md:h-10 bg-white/10" />
                        <CountdownUnit value={timeLeft.m} label="Min" />
                        <div className="w-px h-5 md:h-10 bg-white/10" />
                        <div className="flex flex-col items-center">
                          <span className="text-sm md:text-3xl font-black text-emerald-400 leading-none">{timeLeft.s.toString().padStart(2, '0')}</span>
                          <span className="text-[6px] md:text-[8px] font-black text-white/40 uppercase tracking-widest mt-1">Sec</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              {banners.length > 1 && (
                <div className="absolute bottom-4 left-6 right-6 flex gap-1 z-20">
                  {banners.map((_, i) => (
                    <div 
                      key={i}
                      className="h-0.5 flex-1 rounded-full bg-white/10 overflow-hidden"
                    >
                      <div 
                        className={`h-full bg-white transition-all duration-500 ${i === currentIndex ? 'w-full' : 'w-0'}`}
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Close Button */}
              <button 
                onClick={(e) => { e.stopPropagation(); setIsVisible(false); }}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 flex items-center justify-center text-white border border-white/20 z-[10002]"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Branding Decorative Accent */}
              <div className="absolute top-4 left-6 flex items-center gap-2 opacity-40">
                 <div className={`w-4 h-[1px] bg-${banner.color}-500`} />
                 <span className="text-[7px] font-black text-white uppercase tracking-[0.3em]">N_{currentIndex.toString().padStart(2, '0')}</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
}
