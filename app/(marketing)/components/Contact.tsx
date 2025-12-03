"use client";

import { AnimatePresence, motion, useInView, useScroll, useTransform } from "framer-motion";
import { Mail, Phone, MapPin, CheckCircle2 } from "lucide-react";
import { Reveal, SectionFade } from "../lib/scroll-motion";
import { useCallback, useState, useRef, useEffect } from "react";

// Floating geometric shapes component - reduced for performance
function FloatingShapes() {
  const shapes = [
    { delay: 0, duration: 10, size: 60, x: "10%", y: "20%" },
    { delay: 2, duration: 12, size: 50, x: "85%", y: "75%" },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {shapes.map((shape, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            left: shape.x,
            top: shape.y,
            width: shape.size,
            height: shape.size,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0.1, 0.2, 0.1],
            scale: [1, 1.05, 1],
            rotate: [0, 180],
          }}
          transition={{
            duration: shape.duration,
            delay: shape.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {/* Simplified tetrahedron */}
          <div
            className="relative w-full h-full"
            style={{
              clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
              background: "linear-gradient(135deg, rgba(14, 165, 233, 0.15), rgba(6, 182, 212, 0.1))",
            }}
          />
        </motion.div>
      ))}
    </div>
  );
}

// Confetti particles for success animation - reduced count for performance
function ConfettiParticles() {
  const particles = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: -10,
    delay: Math.random() * 0.5,
    duration: 1.5 + Math.random() * 0.5,
    color: ["#0ea5e9", "#06b6d4", "#10b981", "#f59e0b", "#8b5cf6"][Math.floor(Math.random() * 5)],
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-2 h-2 rounded-full"
          style={{
            left: `${particle.x}%`,
            backgroundColor: particle.color,
          }}
          initial={{ y: particle.y, opacity: 0, scale: 0 }}
          animate={{
            y: window.innerHeight + 50,
            opacity: [0, 1, 1, 0],
            scale: [0, 1, 1, 0],
            x: particle.x + (Math.random() - 0.5) * 100,
            rotate: 360,
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}

export default function Contact() {
  const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "hello@arvado.ca";
  const actionUrl = `https://formsubmit.co/${contactEmail}`;
  
  const contactDetails = [
    {
      icon: Mail,
      label: "Email",
      value: contactEmail,
      href: `mailto:${contactEmail}`,
    },
    {
      icon: Phone,
      label: "Call",
      value: "(416) 555-0199",
      href: "tel:+14165550199",
    },
    {
      icon: MapPin,
      label: "Studio",
      value: "Toronto & Remote",
    },
  ];

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, boolean>>({});
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState("#");
  
  const sectionRef = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const formInView = useInView(formRef, { once: false, amount: 0.3 });
  const [formHasAppeared, setFormHasAppeared] = useState(false);

  // Set redirect URL on client side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setRedirectUrl(window.location.href);
    }
  }, []);
  

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (isSubmitting) return;

      const form = event.currentTarget;
      const formData = new FormData(form);
      formData.set("_captcha", "false");
      formData.set("_template", "table");
      formData.set("_subject", "New Arvado inquiry");

      setIsSubmitting(true);
      setStatus("idle");

      try {
        // Correct AJAX endpoint format: /ajax/email (not /email/ajax)
        const ajaxUrl = `https://formsubmit.co/ajax/${contactEmail}`;
        const response = await fetch(ajaxUrl, {
          method: "POST",
          headers: { Accept: "application/json" },
          body: formData,
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error("FormSubmit AJAX error:", response.status, errorText);
          throw new Error(`Request failed with status ${response.status}`);
        }

        const result = (await response.json()) as { success?: string };
        if (result?.success !== "true") {
          console.error("FormSubmit AJAX unsuccessful response:", result);
          throw new Error("Unsuccessful response");
        }

        setStatus("success");
        setShowConfetti(true);
        setShowSuccessModal(true);
        form.reset();
        setFieldValues({});
        setFieldErrors({});
        setTimeout(() => setShowConfetti(false), 2000);
      } catch (error) {
        console.error("Contact form AJAX submission failed", error);
        setStatus("error");
        setShowErrorModal(true);
      } finally {
        setIsSubmitting(false);
      }
    },
    [actionUrl, contactEmail, isSubmitting]
  );

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
    layoutEffect: false, // Performance optimization
  });

  const backgroundOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 0.2, 0.2, 0]);

  // Mouse tracking for cursor glow - throttled for performance
  useEffect(() => {
    let ticking = false;
    const section = sectionRef.current;
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!ticking && sectionRef.current) {
        window.requestAnimationFrame(() => {
          const rect = sectionRef.current?.getBoundingClientRect();
          if (rect) {
            setMousePosition({
              x: ((e.clientX - rect.left) / rect.width) * 100,
              y: ((e.clientY - rect.top) / rect.height) * 100,
            });
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    if (section) {
      section.addEventListener("mousemove", handleMouseMove, { passive: true });
    }
    
    return () => {
      if (section) {
        section.removeEventListener("mousemove", handleMouseMove);
      }
    };
  }, []);

  useEffect(() => {
    if (formInView && !formHasAppeared) {
      setFormHasAppeared(true);
    }
  }, [formInView, formHasAppeared]);

  return (
    <section id="contact" ref={sectionRef} className="relative overflow-hidden py-16 sm:py-20 md:py-24 lg:py-32 px-4">
      {/* Animated mesh gradient background */}
      <div className="absolute inset-0 -z-10">
        <motion.div
          className="absolute inset-0"
          style={{ opacity: backgroundOpacity }}
        >
          <div className="absolute top-[20%] left-[10%] w-[500px] h-[500px] rounded-full bg-sky-500/10 blur-3xl" />
          <div className="absolute bottom-[20%] right-[15%] w-[400px] h-[400px] rounded-full bg-cyan-500/10 blur-3xl" />
          <motion.div
            className="absolute top-[60%] left-[60%] w-[350px] h-[350px] rounded-full bg-purple-500/8 blur-3xl"
            animate={{
              x: [0, 30, -20, 0],
              y: [0, -30, 20, 0],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.div>
        
        {/* Animated color-shifting mesh overlay */}
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              "radial-gradient(circle at 20% 30%, rgba(14, 165, 233, 0.1), transparent 60%)",
              "radial-gradient(circle at 80% 70%, rgba(6, 182, 212, 0.1), transparent 60%)",
              "radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.08), transparent 60%)",
              "radial-gradient(circle at 20% 30%, rgba(14, 165, 233, 0.1), transparent 60%)",
            ],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{ opacity: 0.3 }}
        />

        {/* Static grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)`,
            backgroundSize: "80px 80px",
          }}
        />
      </div>

      {/* Cursor-following glow */}
      <motion.div
        className="absolute inset-0 pointer-events-none -z-5"
        style={{
          background: `radial-gradient(circle 400px at ${mousePosition.x}% ${mousePosition.y}%, rgba(14, 165, 233, 0.08), transparent 70%)`,
        }}
        animate={{
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Floating geometric shapes */}
      {formHasAppeared && <FloatingShapes />}

      {/* Confetti on success */}
      {showConfetti && <ConfettiParticles />}

      <SectionFade>
        <div className="mx-auto grid w-full max-w-5xl gap-8 sm:gap-10 px-4 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:px-8 relative z-10">
          <div>
            <Reveal>
              <span className="tag mb-4">Contact</span>
              <h2 className="section-heading text-left">Let&apos;s build your unfair advantage</h2>
              <p className="section-subtitle text-left md:text-left">
                Tell us about your goals and we&apos;ll map a tailored growth plan—web, AI, and campaigns.
              </p>
            </Reveal>
            <div className="mt-10 space-y-6">
              {contactDetails.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -30, filter: "blur(8px)" }}
                  whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1], delay: index * 0.08 }}
                  className="flex items-center gap-4 group cursor-pointer"
                  whileHover={{ x: 4 }}
                >
                  <motion.div
                    className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 relative overflow-hidden"
                    whileHover={{ scale: 1.15, rotate: 5 }}
                    transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-br from-sky-500/30 to-cyan-500/30 opacity-0 group-hover:opacity-100"
                      transition={{ duration: 0.3 }}
                    />
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100"
                      animate={{
                        x: ["-100%", "100%"],
                      }}
                      transition={{
                        duration: 0.6,
                        repeat: Infinity,
                        repeatDelay: 2,
                      }}
                    />
                    <item.icon className="h-5 w-5 text-sky-400 relative z-10" strokeWidth={1.5} />
                  </motion.div>
                  <div>
                    <motion.p
                      className="text-xs uppercase tracking-[0.3em] text-white/50"
                      whileHover={{ color: "rgba(255, 255, 255, 0.7)" }}
                    >
                      {item.label}
                    </motion.p>
                    {item.href ? (
                      <motion.a
                        href={item.href}
                        className="text-base font-medium text-white hover:text-sky-400 transition-colors block"
                        whileHover={{ x: 2 }}
                      >
                        {item.value}
                      </motion.a>
                    ) : (
                      <p className="text-base font-medium text-white">{item.value}</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div ref={formRef}>
              <motion.div
                    className="glass-panel relative overflow-hidden rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10"
              initial={{ opacity: 0, y: 40, filter: "blur(12px)" }}
              animate={formHasAppeared ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 0, y: 40, filter: "blur(12px)" }}
              transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
            >
              {/* Animated gradient border */}
              <motion.div
                className="absolute inset-0 rounded-3xl"
                style={{
                  padding: "1px",
                  background: "linear-gradient(135deg, rgba(14, 165, 233, 0.3), rgba(6, 182, 212, 0.2), rgba(139, 92, 246, 0.2), rgba(14, 165, 233, 0.3))",
                  backgroundSize: "200% 200%",
                  WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                  WebkitMaskComposite: "xor",
                  maskComposite: "exclude",
                }}
                animate={{
                  backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />

              {/* Glow orb background */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={formHasAppeared ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                transition={{ duration: 1.2, ease: [0.19, 1, 0.22, 1] }}
                className="absolute -inset-20 -z-10 rounded-full blur-3xl"
                style={{
                  background: "radial-gradient(circle, rgba(14, 165, 233, 0.2), transparent 70%)",
                }}
              />

              {/* Animated gradient overlay */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-sky-500/10 to-cyan-500/10 opacity-0"
                animate={formHasAppeared ? { opacity: 0.05 } : { opacity: 0 }}
                transition={{ duration: 0.5 }}
              />

              <motion.form
                action={actionUrl}
                method="POST"
                className="space-y-6 relative z-10"
                initial={{ opacity: 0 }}
                animate={formHasAppeared ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                onSubmit={handleSubmit}
              >
                <input type="hidden" name="_captcha" value="false" />
                <input type="hidden" name="_template" value="table" />
                <input type="hidden" name="_subject" value="New Arvado inquiry" />
                <input type="hidden" name="_next" value={redirectUrl} />
                <div className="sr-only">
                  <label htmlFor="contact-hub">
                    Do not fill this field if you are human
                  </label>
                  <input
                    id="contact-hub"
                    name="_honey"
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>

                {/* Name field with floating label */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={formHasAppeared ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="relative"
                >
                  <motion.label
                    className="text-xs uppercase tracking-[0.3em] text-white/50 block mb-2"
                    animate={{
                      y: focusedField === "name" ? -2 : 0,
                      color: focusedField === "name" ? "rgba(14, 165, 233, 0.8)" : "rgba(255, 255, 255, 0.5)",
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    Name
                  </motion.label>
                  <div className="relative">
                    <motion.input
                      required
                      name="name"
                      placeholder="Your name"
                      value={fieldValues.name || ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        setFieldValues({ ...fieldValues, name: value });
                        setFieldErrors({ ...fieldErrors, name: value.length > 0 && value.length < 2 });
                      }}
                      onBlur={(e) => {
                        setFocusedField(null);
                        const value = e.target.value;
                        setFieldErrors({ ...fieldErrors, name: value.length > 0 && value.length < 2 });
                      }}
                      className={`mt-2 w-full rounded-2xl border px-4 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none transition-all relative z-10 ${
                        fieldErrors.name ? "border-rose-500/50 bg-rose-500/5" : focusedField === "name" ? "border-sky-500/50 bg-white/10" : "border-white/10 bg-white/5"
                      }`}
                      onFocus={() => setFocusedField("name")}
                      whileFocus={{ scale: 1.01 }}
                    />
                    <motion.div
                      className="absolute inset-0 rounded-2xl"
                      style={{
                        background: fieldErrors.name 
                          ? "linear-gradient(135deg, rgba(239, 68, 68, 0.4), rgba(220, 38, 38, 0.3))"
                          : "linear-gradient(135deg, rgba(14, 165, 233, 0.4), rgba(6, 182, 212, 0.3))",
                        opacity: focusedField === "name" || fieldErrors.name ? 1 : 0,
                        filter: "blur(8px)",
                        zIndex: 0,
                      }}
                      transition={{ duration: 0.3 }}
                    />
                    {/* Validation indicator */}
                    <AnimatePresence>
                      {fieldValues.name && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0 }}
                          className="absolute right-3 top-1/2 -translate-y-1/2 z-20"
                        >
                          {fieldErrors.name ? (
                            <motion.div
                              className="w-5 h-5 rounded-full bg-rose-500/20 flex items-center justify-center"
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ duration: 0.3 }}
                            >
                              <span className="text-rose-400 text-xs">✕</span>
                            </motion.div>
                          ) : (
                            <motion.div
                              className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center"
                              initial={{ rotate: -180 }}
                              animate={{ rotate: 0 }}
                            >
                              <span className="text-emerald-400 text-xs">✓</span>
                            </motion.div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>

                {/* Email field with floating label */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={formHasAppeared ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="relative"
                >
                  <motion.label
                    className="text-xs uppercase tracking-[0.3em] text-white/50 block mb-2"
                    animate={{
                      y: focusedField === "email" ? -2 : 0,
                      color: focusedField === "email" ? "rgba(14, 165, 233, 0.8)" : "rgba(255, 255, 255, 0.5)",
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    Email
                  </motion.label>
                  <div className="relative">
                    <motion.input
                      required
                      type="email"
                      name="email"
                      placeholder="you@brand.com"
                      value={fieldValues.email || ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        setFieldValues({ ...fieldValues, email: value });
                        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                        setFieldErrors({ ...fieldErrors, email: value.length > 0 && !emailRegex.test(value) });
                      }}
                      onBlur={(e) => {
                        setFocusedField(null);
                        const value = e.target.value;
                        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                        setFieldErrors({ ...fieldErrors, email: value.length > 0 && !emailRegex.test(value) });
                      }}
                      className={`mt-2 w-full rounded-2xl border px-4 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none transition-all relative z-10 ${
                        fieldErrors.email ? "border-rose-500/50 bg-rose-500/5" : focusedField === "email" ? "border-sky-500/50 bg-white/10" : "border-white/10 bg-white/5"
                      }`}
                      onFocus={() => setFocusedField("email")}
                      whileFocus={{ scale: 1.01 }}
                    />
                    <motion.div
                      className="absolute inset-0 rounded-2xl"
                      style={{
                        background: fieldErrors.email 
                          ? "linear-gradient(135deg, rgba(239, 68, 68, 0.4), rgba(220, 38, 38, 0.3))"
                          : "linear-gradient(135deg, rgba(14, 165, 233, 0.4), rgba(6, 182, 212, 0.3))",
                        opacity: focusedField === "email" || fieldErrors.email ? 1 : 0,
                        filter: "blur(8px)",
                        zIndex: 0,
                      }}
                      transition={{ duration: 0.3 }}
                    />
                    {/* Validation indicator */}
                    <AnimatePresence>
                      {fieldValues.email && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0 }}
                          className="absolute right-3 top-1/2 -translate-y-1/2 z-20"
                        >
                          {fieldErrors.email ? (
                            <motion.div
                              className="w-5 h-5 rounded-full bg-rose-500/20 flex items-center justify-center"
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ duration: 0.3 }}
                            >
                              <span className="text-rose-400 text-xs">✕</span>
                            </motion.div>
                          ) : (
                            <motion.div
                              className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center"
                              initial={{ rotate: -180 }}
                              animate={{ rotate: 0 }}
                            >
                              <span className="text-emerald-400 text-xs">✓</span>
                            </motion.div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>

                {/* Message field with floating label */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={formHasAppeared ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="relative"
                >
                  <motion.label
                    className="text-xs uppercase tracking-[0.3em] text-white/50 block mb-2"
                    animate={{
                      y: focusedField === "message" ? -2 : 0,
                      color: focusedField === "message" ? "rgba(14, 165, 233, 0.8)" : "rgba(255, 255, 255, 0.5)",
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    What do you need?
                  </motion.label>
                  <div className="relative">
                    <motion.textarea
                      name="message"
                      rows={4}
                      placeholder="Tell us what you want to launch or optimize."
                      className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none transition-all resize-none relative z-10"
                      onFocus={() => setFocusedField("message")}
                      onBlur={() => setFocusedField(null)}
                      whileFocus={{ scale: 1.01 }}
                    />
                    <motion.div
                      className="absolute inset-0 rounded-2xl"
                      style={{
                        background: "linear-gradient(135deg, rgba(14, 165, 233, 0.4), rgba(6, 182, 212, 0.3))",
                        opacity: focusedField === "message" ? 1 : 0,
                        filter: "blur(8px)",
                        zIndex: 0,
                      }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </motion.div>

                <motion.button
                  type="submit"
                  className="w-full rounded-2xl bg-sky-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition-all disabled:cursor-not-allowed disabled:opacity-70 relative overflow-hidden"
                  disabled={isSubmitting}
                  initial={{ opacity: 0, y: 20 }}
                  animate={formHasAppeared ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  whileHover={{ scale: 1.02, boxShadow: "0 10px 40px rgba(14, 165, 233, 0.3)" }}
                  whileTap={{ scale: 0.98 }}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-sky-400 to-cyan-400 opacity-0"
                    animate={isSubmitting ? { opacity: 0.3 } : { opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                  <span className="relative z-10">{isSubmitting ? "Sending..." : "Send message"}</span>
                </motion.button>

                <div aria-live="polite" role="status" className="min-h-[1.25rem]">
                  <AnimatePresence mode="wait" initial={false}>
                    {status === "success" && (
                      <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.8, y: -10, rotateX: -90 }}
                        animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                        className="mt-2 rounded-2xl border border-emerald-500/30 bg-emerald-500/15 px-4 py-3 relative overflow-hidden"
                      >
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20"
                          animate={{
                            x: ["-100%", "100%"],
                          }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                        />
                        {/* Pulsing glow effect */}
                        <motion.div
                          className="absolute inset-0 bg-emerald-400/30 rounded-2xl"
                          animate={{
                            scale: [1, 1.05, 1],
                            opacity: [0.3, 0.6, 0.3],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                        />
                        <div className="flex items-center gap-2 relative z-10">
                          <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ delay: 0.2, type: "spring", stiffness: 300, damping: 15 }}
                          >
                            <motion.div
                              animate={{
                                scale: [1, 1.2, 1],
                              }}
                              transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                ease: "easeInOut",
                              }}
                            >
                              <CheckCircle2 className="h-5 w-5 text-emerald-300" strokeWidth={2.5} />
                            </motion.div>
                          </motion.div>
                          <motion.p 
                            className="text-xs text-emerald-300 font-medium"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                          >
                            Thanks! We&apos;ll be in touch within one business day.
                          </motion.p>
                        </div>
                        {/* Success particles */}
                        {Array.from({ length: 8 }).map((_, i) => (
                          <motion.div
                            key={i}
                            className="absolute w-1 h-1 rounded-full bg-emerald-300"
                            style={{
                              left: "50%",
                              top: "50%",
                            }}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{
                              opacity: [0, 1, 0],
                              scale: [0, 1, 0],
                              x: Math.cos((i / 8) * Math.PI * 2) * 40,
                              y: Math.sin((i / 8) * Math.PI * 2) * 40,
                            }}
                            transition={{
                              duration: 1,
                              delay: 0.4 + i * 0.05,
                              ease: "easeOut",
                            }}
                          />
                        ))}
                      </motion.div>
                    )}
                    {status === "error" && (
                      <motion.p
                        key="error"
                        className="mt-2 rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-xs text-rose-300"
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      >
                        Something went wrong. We opened a fallback email tab—feel free to reach out directly.
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                <p className="text-xs text-white/40">
                  We reply within one business day. By submitting you agree to secure handling of your data.
                </p>
              </motion.form>

              {/* Corner accent */}
              <motion.div
                className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-sky-500/20 to-cyan-500/20 opacity-0 blur-2xl"
                animate={formHasAppeared ? { opacity: 0.15 } : { opacity: 0 }}
                transition={{ duration: 0.5 }}
              />
            </motion.div>
          </div>
        </div>
      </SectionFade>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccessModal && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSuccessModal(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            />
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none"
            >
              <motion.div
                className="relative bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-3xl p-8 max-w-md w-full shadow-2xl pointer-events-auto"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Animated gradient border */}
                <motion.div
                  className="absolute inset-0 rounded-3xl"
                  style={{
                    padding: "1px",
                    background: "linear-gradient(135deg, rgba(14, 165, 233, 0.4), rgba(6, 182, 212, 0.3), rgba(16, 185, 129, 0.3), rgba(14, 165, 233, 0.4))",
                    backgroundSize: "200% 200%",
                    WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                    WebkitMaskComposite: "xor",
                    maskComposite: "exclude",
                  }}
                  animate={{
                    backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
                
                {/* Glow effect */}
                <motion.div
                  className="absolute -inset-20 rounded-full blur-3xl bg-emerald-500/20 opacity-50"
                  animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.3, 0.5, 0.3],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />

                <div className="relative z-10 text-center">
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.1, type: "spring", stiffness: 300, damping: 15 }}
                    className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/20 mb-4"
                  >
                    <motion.div
                      animate={{
                        scale: [1, 1.2, 1],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      <CheckCircle2 className="h-8 w-8 text-emerald-400" strokeWidth={2.5} />
                    </motion.div>
                  </motion.div>
                  
                  <motion.h3
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-2xl font-semibold text-white mb-2"
                  >
                    Message sent
                  </motion.h3>
                  
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-sm text-white/70 mb-6"
                  >
                    We&apos;ll be in touch within one business day.
                  </motion.p>

                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    onClick={() => setShowSuccessModal(false)}
                    className="w-full rounded-2xl bg-sky-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition hover:bg-sky-400"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Close
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Error Modal */}
      <AnimatePresence>
        {showErrorModal && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowErrorModal(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            />
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none"
            >
              <motion.div
                className="relative bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-3xl p-8 max-w-md w-full shadow-2xl pointer-events-auto"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Animated gradient border */}
                <motion.div
                  className="absolute inset-0 rounded-3xl"
                  style={{
                    padding: "1px",
                    background: "linear-gradient(135deg, rgba(239, 68, 68, 0.4), rgba(220, 38, 38, 0.3), rgba(239, 68, 68, 0.4))",
                    backgroundSize: "200% 200%",
                    WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                    WebkitMaskComposite: "xor",
                    maskComposite: "exclude",
                  }}
                  animate={{
                    backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />

                <div className="relative z-10 text-center">
                  <motion.div
                    initial={{ scale: 0, rotate: 180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.1, type: "spring", stiffness: 300, damping: 15 }}
                    className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-rose-500/20 mb-4"
                  >
                    <motion.div
                      animate={{
                        scale: [1, 1.1, 1],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      <span className="text-rose-400 text-2xl">✕</span>
                    </motion.div>
                  </motion.div>
                  
                  <motion.h3
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-2xl font-semibold text-white mb-2"
                  >
                    Something went wrong
                  </motion.h3>
                  
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-sm text-white/70 mb-6"
                  >
                    Please try again or contact us directly at {contactEmail}
                  </motion.p>

                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    onClick={() => setShowErrorModal(false)}
                    className="w-full rounded-2xl bg-rose-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-rose-500/20 transition hover:bg-rose-400"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Close
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </section>
  );
}
