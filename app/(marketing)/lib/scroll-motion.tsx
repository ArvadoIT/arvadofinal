"use client";

import {
  motion,
  useAnimation,
  useInView,
  useScroll,
  useTransform,
  useVelocity,
  useMotionValueEvent,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

export function Reveal({
  delay = 0,
  y = 16,
  className = "",
  children,
}: {
  delay?: number;
  y?: number;
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { 
    once: true, 
    margin: "-10% 0% -10% 0%",
    amount: 0.2,
  });
  const controls = useAnimation();
  const [isAnimating, setIsAnimating] = useState(false);
  
  useEffect(() => {
    if (inView) {
      setIsAnimating(true);
      controls.start({
        y: 0,
        opacity: 1,
        transition: { 
          duration: 0.6, 
          delay, 
          ease: [0.22, 1, 0.36, 1],
          onComplete: () => {
            // Animation finished, reset will-change after a brief delay
            setTimeout(() => setIsAnimating(false), 100);
          }
        },
      });
    }
  }, [inView, controls, delay]);
  
  return (
    <motion.div 
      ref={ref} 
      initial={{ y, opacity: 0 }} 
      animate={controls} 
      className={className}
      style={{ willChange: isAnimating ? 'transform, opacity' : 'auto' }}
    >
      {children}
    </motion.div>
  );
}

export function ParallaxY({
  from = -40,
  to = 40,
  className = "",
  children,
}: {
  from?: number;
  to?: number;
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [from, to]);
  return (
    <motion.div ref={ref} style={{ y, position: "relative" }} className={className}>
      {children}
    </motion.div>
  );
}

export function SkewOnScroll({
  maxSkew = 6,
  className = "",
  children,
}: {
  maxSkew?: number;
  className?: string;
  children: ReactNode;
}) {
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const skewY = useTransform(velocity, [-2000, 0, 2000], [maxSkew, 0, -maxSkew]);
  return (
    <motion.div style={{ skewY }} className={className}>
      {children}
    </motion.div>
  );
}

export function StickyChapter({
  heightVh = 220,
  className = "",
  children,
}: {
  heightVh?: number;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section style={{ height: `${heightVh}vh` }} className={`relative ${className}`}>
      <div className="sticky top-0 h-screen grid place-items-center">{children}</div>
    </section>
  );
}

export function CountUp({
  from = 0,
  to = 100,
  className = "",
}: {
  from?: number;
  to?: number;
  className?: string;
}) {
  const { scrollYProgress } = useScroll();
  const val = useTransform(scrollYProgress, [0.1, 0.3], [from, to]);
  const [rounded, setRounded] = useState(from);

  useMotionValueEvent(val, "change", (latest) => {
    setRounded(Math.round(latest));
  });

  return <motion.span className={className}>{rounded}</motion.span>;
}

export function SectionFade({
  className = "",
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 85%", "end 15%"],
  });
  // Crossfade curve: fade in near entry, stay visible, fade out near exit
  const opacity = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0]);
  return (
    <motion.div ref={ref} style={{ opacity }} className={className}>
      {children}
    </motion.div>
  );
}

