import React from 'react';

export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 z-[-20] overflow-hidden pointer-events-none bg-slate-50 dark:bg-black transition-colors duration-500">
      {/* Top Left Massive Sphere */}
      <div className="absolute -top-[10%] -left-[10%] w-[40vw] h-[40vw] min-w-[400px] min-h-[400px] bg-emerald-500/20 dark:bg-emerald-500/30 rounded-full blur-[80px] md:blur-[120px] animate-pulse" style={{ animationDuration: '8s' }} />
      
      {/* Bottom Right Massive Sphere */}
      <div className="absolute -bottom-[10%] -right-[10%] w-[45vw] h-[45vw] min-w-[500px] min-h-[500px] bg-cyan-500/15 dark:bg-cyan-500/25 rounded-full blur-[100px] md:blur-[150px] animate-pulse" style={{ animationDuration: '12s', animationDelay: '1s' }} />

      {/* Middle Accent Sphere */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] bg-emerald-400/5 dark:bg-emerald-400/10 rounded-full blur-[120px] md:blur-[180px]" />

      {/* Full Layout Blur Overlay */}
      <div className="absolute inset-0 backdrop-blur-[40px] md:backdrop-blur-[60px]" />
    </div>
  );
}

