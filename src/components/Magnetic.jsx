import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function Magnetic({ children, strength = 0.5 }) {
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const xTo = gsap.quickTo(element, "x", { duration: 1, ease: "elastic.out(1, 0.3)" });
    const yTo = gsap.quickTo(element, "y", { duration: 1, ease: "elastic.out(1, 0.3)" });

    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const { width, height, left, top } = element.getBoundingClientRect();
      const x = (clientX - (left + width / 2)) * strength;
      const y = (clientY - (top + height / 2)) * strength;
      xTo(x);
      yTo(y);
    };

    const handleMouseLeave = () => {
      xTo(0);
      yTo(0);
    };

    element.addEventListener("mousemove", handleMouseMove);
    element.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      element.removeEventListener("mousemove", handleMouseMove);
      element.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [strength]);

  return (
    <div ref={ref} className="inline-block">
      {children}
    </div>
  );
}
