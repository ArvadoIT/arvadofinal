"use client";

import { motion } from "framer-motion";
import { Mail, Instagram } from "lucide-react";
import { Reveal } from "../lib/scroll-motion";

export default function Footer() {
  return (
    <section id="footer" className="relative w-full bg-slate-950 border-t border-white/10 overflow-hidden">
      {/* Subtle background effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 w-[400px] h-[400px] rounded-full bg-sky-500/5 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[300px] h-[300px] rounded-full bg-cyan-500/5 blur-3xl" />
      </div>

      <footer className="mx-auto w-full max-w-7xl px-4 sm:px-6 py-8 sm:py-10 md:py-12 lg:py-16 lg:px-8">
        {/* Main content - two columns */}
        <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2 md:gap-12 lg:gap-16 mb-6 sm:mb-8">
          {/* Left Column - Brand */}
          <Reveal>
            <div>
              <motion.h2
                className="text-2xl md:text-3xl font-semibold text-sky-400 mb-3"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                Arvado
              </motion.h2>
              <motion.p
                className="text-sm md:text-base text-white/70 max-w-md"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                Transforming businesses through custom IT solutions.
              </motion.p>
            </div>
          </Reveal>

          {/* Right Column - Contact */}
          <Reveal>
            <div>
              <motion.h3
                className="text-lg md:text-xl font-semibold text-sky-400 mb-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                Contact
              </motion.h3>
              <motion.p
                className="text-sm md:text-base text-white/70 mb-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                Ready to get started?{" "}
                <motion.a
                  href="#contact"
                  className="text-sky-400 hover:text-sky-300 transition-colors inline-block relative group"
                  whileHover={{ scale: 1.02 }}
                >
                  <span className="relative z-10">Book your free consultation today.</span>
                  <motion.span
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-sky-400/50 block"
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.a>
              </motion.p>

              {/* Email */}
              <motion.a
                href="mailto:hello@arvado.ca"
                className="flex items-center gap-3 text-sm md:text-base text-white/70 hover:text-white transition-colors mb-4 group touch-manipulation min-h-[44px]"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                whileHover={{ x: 4 }}
              >
                <motion.div
                  className="flex items-center justify-center w-5 h-5 text-sky-400"
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <Mail className="w-5 h-5" strokeWidth={1.5} />
                </motion.div>
                <span>hello@arvado.ca</span>
              </motion.a>

              {/* Instagram */}
              <motion.a
                href="https://instagram.com/Arvado.ca"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-sm md:text-base text-white/70 hover:text-white transition-colors group touch-manipulation min-h-[44px]"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                whileHover={{ x: 4 }}
              >
                <motion.div
                  className="flex items-center justify-center w-5 h-5 text-sky-400"
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <Instagram className="w-5 h-5" strokeWidth={1.5} />
                </motion.div>
                <span>@Arvado.ca</span>
              </motion.a>
            </div>
          </Reveal>
        </div>

        {/* Separator line */}
        <motion.div
          className="h-px bg-white/10 mb-8"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        />

        {/* Bottom section - Legal links */}
        <motion.div
          className="flex flex-col items-center gap-4 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs sm:text-sm text-white/60">
            <motion.a
              href="/privacy-policy"
              className="hover:text-white transition-colors relative group"
              whileHover={{ scale: 1.05 }}
            >
              <span className="relative z-10">Privacy Policy</span>
              <motion.div
                className="absolute -bottom-1 left-0 right-0 h-0.5 bg-sky-400/50"
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.3 }}
              />
            </motion.a>
            <span className="text-white/30">|</span>
            <motion.a
              href="/terms-of-service"
              className="hover:text-white transition-colors relative group"
              whileHover={{ scale: 1.05 }}
            >
              <span className="relative z-10">Terms of Service</span>
              <motion.div
                className="absolute -bottom-1 left-0 right-0 h-0.5 bg-sky-400/50"
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.3 }}
              />
            </motion.a>
          </div>
          <p className="text-xs text-white/50">Effective Date: September 20, 2025</p>
        </motion.div>
      </footer>
    </section>
  );
}

