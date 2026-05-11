import React, { useEffect, useState, useMemo } from 'react';

export default function AnimatedBackground() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    const handleMouseMove = (e) => {
      if ('ontouchstart' in window) return;
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  const allElements = useMemo(() => [
    // Intense Glowing Orbs
    { type: 'orb', size: 'w-[300px] h-[300px] md:w-[400px] md:h-[400px]', color: 'bg-emerald-500/20 dark:bg-emerald-500/30', blur: 'blur-[30px] md:blur-[60px]', x: '10%', y: '15%', depth: 0.05, delay: '0s', duration: '20s', mobile: true },
    { type: 'orb', size: 'w-[400px] h-[400px] md:w-[500px] md:h-[500px]', color: 'bg-cyan-500/10 dark:bg-cyan-500/20', blur: 'blur-[40px] md:blur-[80px]', x: '85%', y: '65%', depth: 0.03, delay: '-5s', duration: '25s', mobile: true },
    { type: 'orb', size: 'w-[250px] h-[250px] md:w-[350px] md:h-[350px]', color: 'bg-emerald-400/15 dark:bg-emerald-400/25', blur: 'blur-[30px] md:blur-[50px]', x: '45%', y: '85%', depth: 0.04, delay: '-10s', duration: '22s' },
    { type: 'orb', size: 'w-[200px] h-[200px] md:w-[300px] md:h-[300px]', color: 'bg-emerald-600/10 dark:bg-emerald-600/20', blur: 'blur-[20px] md:blur-[40px]', x: '70%', y: '10%', depth: 0.06, delay: '-15s', duration: '18s' },
    
    // Glowing Tech Shapes
    { type: 'shape', shape: 'square', size: 'w-16 h-16 md:w-24 md:h-24', x: '15%', y: '60%', depth: 0.15, rotation: 15, delay: '-2s', duration: '15s', mobile: true },
    { type: 'shape', shape: 'circle', size: 'w-24 h-24 md:w-36 md:h-36', x: '80%', y: '25%', depth: 0.1, rotation: 0, delay: '-8s', duration: '18s', mobile: true },
    { type: 'shape', shape: 'triangle', size: 'w-16 h-16 md:w-20 md:h-20', x: '55%', y: '15%', depth: 0.2, rotation: -20, delay: '-1s', duration: '12s' },
    { type: 'shape', shape: 'square', size: 'w-10 h-10 md:w-14 md:h-14', x: '70%', y: '80%', depth: 0.12, rotation: 45, delay: '-12s', duration: '20s' },
    { type: 'shape', shape: 'circle', size: 'w-12 h-12 md:w-16 md:h-16', x: '10%', y: '85%', depth: 0.18, rotation: 0, delay: '-4s', duration: '16s' },
    { type: 'shape', shape: 'triangle', size: 'w-20 h-20 md:w-28 md:h-28', x: '40%', y: '45%', depth: 0.1, rotation: 10, delay: '-6s', duration: '22s', mobile: true },
    
    // Floating Code Symbols
    { type: 'symbol', content: '{ }', size: 'text-3xl md:text-5xl', x: '25%', y: '35%', depth: 0.25, rotation: 10, delay: '-3s', duration: '16s', mobile: true },
    { type: 'symbol', content: '</>', size: 'text-2xl md:text-4xl', x: '60%', y: '60%', depth: 0.18, rotation: -15, delay: '-7s', duration: '14s', mobile: true },
    { type: 'symbol', content: '()', size: 'text-4xl md:text-6xl', x: '90%', y: '10%', depth: 0.08, rotation: 5, delay: '-15s', duration: '24s' },
    { type: 'symbol', content: '=>', size: 'text-3xl md:text-5xl', x: '15%', y: '10%', depth: 0.2, rotation: -10, delay: '-2s', duration: '12s', mobile: true },
    { type: 'symbol', content: ';;', size: 'text-2xl md:text-4xl', x: '85%', y: '45%', depth: 0.15, rotation: 20, delay: '-8s', duration: '15s' },
    { type: 'symbol', content: '??', size: 'text-3xl md:text-5xl', x: '5%', y: '45%', depth: 0.12, rotation: -5, delay: '-12s', duration: '20s' },
    { type: 'symbol', content: '##', size: 'text-2xl md:text-4xl', x: '50%', y: '90%', depth: 0.22, rotation: 15, delay: '-5s', duration: '14s' },
    { type: 'symbol', content: '//', size: 'text-4xl md:text-6xl', x: '75%', y: '75%', depth: 0.05, rotation: -20, delay: '-18s', duration: '25s', mobile: true },
  ], []);

  const elements = useMemo(() => isMobile ? allElements.filter(el => el.mobile) : allElements, [isMobile, allElements]);

  return (
    <div className="fixed inset-0 z-[-20] overflow-hidden pointer-events-none bg-slate-50 dark:bg-black">
      {elements.map((el, i) => {
        const offsetX = isMobile ? 0 : mousePosition.x * 100 * el.depth;
        const offsetY = isMobile ? 0 : mousePosition.y * 100 * el.depth;

        const parallaxStyle = {
          position: 'absolute',
          left: el.x,
          top: el.y,
          transform: `translate(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px))`,
          transition: isMobile ? 'none' : 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          willChange: 'transform',
        };

        const innerStyle = {
          transform: `rotate(${el.rotation || 0}deg)`,
          animationDuration: el.duration,
          animationDelay: el.delay,
          willChange: 'transform',
        };

        if (el.type === 'orb') {
          return (
            <div key={i} style={parallaxStyle}>
              <div
                className={`rounded-full ${el.size} ${el.color} ${el.blur} float-complex`}
                style={innerStyle}
              />
            </div>
          );
        }

        if (el.type === 'shape') {
          let shapeClasses = 'float-complex border relative overflow-hidden';
          if (!isMobile) shapeClasses += ' backdrop-blur-md';
          
          const shapeStyle = {
            ...innerStyle,
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(6, 182, 212, 0.1) 100%)',
            borderColor: 'rgba(16, 185, 129, 0.3)',
            boxShadow: isMobile ? 'none' : '0 8px 32px 0 rgba(16, 185, 129, 0.2)',
          };
          
          if (el.shape === 'circle') shapeClasses += ' rounded-full';
          else if (el.shape === 'square') shapeClasses += ' rounded-2xl';
          else if (el.shape === 'triangle') {
             shapeClasses += ' rounded-xl'; 
             shapeStyle.transform += ` rotate(45deg)`; 
          }

          return (
            <div key={i} style={parallaxStyle}>
              <div
                className={`${el.size} ${shapeClasses}`}
                style={shapeStyle}
              >
                 <div className="absolute inset-0 rounded-[inherit] bg-gradient-to-br from-emerald-500/20 to-transparent" />
              </div>
            </div>
          );
        }

        if (el.type === 'symbol') {
          return (
            <div key={i} style={parallaxStyle}>
              <div
                className={`font-mono font-black text-emerald-500/40 dark:text-cyan-400/40 float-complex select-none ${el.size}`}
                style={innerStyle}
              >
                {el.content}
              </div>
            </div>
          );
        }

        return null;
      })}
    </div>
  );
}

