"use client";

import { motion, useInView, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { SectionFade } from "../lib/scroll-motion";

export default function CTA() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [hasAppeared, setHasAppeared] = useState(false);
  
  const contentInView = useInView(contentRef, { once: false, amount: 0.3 });
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    mass: 0.5,
    stiffness: 100,
    damping: 30,
  });

  const backgroundOpacity = useTransform(smoothProgress, [0, 0.3, 0.7, 1], [0, 0.2, 0.2, 0]);

  useEffect(() => {
    if (contentInView && !hasAppeared) {
      setHasAppeared(true);
    }
  }, [contentInView, hasAppeared]);

  return (
    <section ref={sectionRef} className="relative overflow-hidden py-24 md:py-32">
      {/* Animated background */}
      <div className="absolute inset-0 -z-10">
        <motion.div
          className="absolute inset-0"
          style={{ opacity: backgroundOpacity }}
        >
          <div className="absolute top-[20%] left-[10%] w-[500px] h-[500px] rounded-full bg-sky-500/10 blur-3xl" />
          <div className="absolute bottom-[20%] right-[15%] w-[400px] h-[400px] rounded-full bg-cyan-500/10 blur-3xl" />
        </motion.div>
        
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.015]">
          <div className="h-full w-full [background-image:linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] [background-size:80px_80px]" />
        </div>
      </div>

      <SectionFade>
        <div className="mx-auto w-full max-w-4xl px-6 text-center lg:px-8 relative z-10">
          <motion.div
            ref={contentRef}
            initial={{ opacity: 0, y: 40, filter: "blur(12px)" }}
            animate={hasAppeared ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 0, y: 40, filter: "blur(12px)" }}
            transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
            className="glass-panel relative overflow-hidden rounded-3xl px-8 py-16 md:px-12 mx-auto"
          >
            {/* Glow orb background */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={hasAppeared ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
              transition={{ duration: 1.2, ease: [0.19, 1, 0.22, 1] }}
              className="absolute -inset-20 -z-10 rounded-full blur-3xl"
              style={{
                background: "radial-gradient(circle, rgba(14, 165, 233, 0.2), transparent 70%)",
              }}
            />

            {/* Animated gradient overlay */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-sky-500/10 to-cyan-500/10 opacity-0"
              animate={hasAppeared ? { opacity: 0.05 } : { opacity: 0 }}
              transition={{ duration: 0.5 }}
            />

            <div className="relative z-10">
              <motion.span
                className="tag mb-5"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={hasAppeared ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Start
              </motion.span>
              
              <motion.h2
                className="section-heading"
                initial={{ opacity: 0, y: 30 }}
                animate={hasAppeared ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                Ready to ship momentum?
              </motion.h2>
              
              <motion.p
                className="section-subtitle"
                initial={{ opacity: 0, y: 20 }}
                animate={hasAppeared ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Book a 30-minute strategy session to map a focused 90‑day plan.
              </motion.p>
              
              <motion.div
                className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
                initial={{ opacity: 0, y: 20 }}
                animate={hasAppeared ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                <motion.a
                  href="#contact"
                  className="rounded-2xl bg-sky-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition-all relative overflow-hidden"
                  whileHover={{ scale: 1.02, boxShadow: "0 10px 40px rgba(14, 165, 233, 0.3)" }}
                  whileTap={{ scale: 0.98 }}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-sky-400 to-cyan-400 opacity-0"
                    whileHover={{ opacity: 0.2 }}
                    transition={{ duration: 0.3 }}
                  />
                  <span className="relative z-10">Book a strategy session</span>
                </motion.a>
                
                <motion.a
                  href="mailto:team@arvado.ca"
                  className="rounded-2xl border border-white/20 bg-white/5 px-6 py-3 text-sm text-white transition-all relative overflow-hidden"
                  whileHover={{ scale: 1.02, borderColor: "rgba(255, 255, 255, 0.3)", backgroundColor: "rgba(255, 255, 255, 0.1)" }}
                  whileTap={{ scale: 0.98 }}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 opacity-0"
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                  <span className="relative z-10">Email the team</span>
                </motion.a>
              </motion.div>
            </div>

            {/* Corner accent */}
            <motion.div
              className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-sky-500/20 to-cyan-500/20 opacity-0 blur-2xl"
              animate={hasAppeared ? { opacity: 0.15 } : { opacity: 0 }}
              transition={{ duration: 0.5 }}
            />
          </motion.div>
        </div>
      </SectionFade>
    </section>
  );
}


