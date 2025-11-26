"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState, useEffect } from "react";

export default function CinematicHero() {
	const sectionRef = useRef<HTMLElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const [loaded, setLoaded] = useState(false);
	const [enableScroll, setEnableScroll] = useState(false);

	// Disable ALL scroll tracking until after initial render for maximum performance
	const { scrollYProgress } = useScroll({
		target: enableScroll ? sectionRef : undefined,
		offset: ["start start", "end start"],
		layoutEffect: false,
	});

	// Disable scroll transforms initially for better performance
	const [enableParallax, setEnableParallax] = useState(false);
	const contentY = useTransform(scrollYProgress, [0, 1], [0, 20]);
	const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
	
	// Enable scroll and parallax after initial load - much longer delays
	useEffect(() => {
		const timer1 = setTimeout(() => setEnableScroll(true), 2500);
		const timer2 = setTimeout(() => setEnableParallax(true), 3000);
		return () => {
			clearTimeout(timer1);
			clearTimeout(timer2);
		};
	}, []);
	

	useEffect(() => {
		// Defer initial animation sequence - longer delay for better performance
		const timer = setTimeout(() => setLoaded(true), 600);
		return () => clearTimeout(timer);
	}, []);

	const headline = "Everything your business needs web, Al, SEO, automation crafted as one seamless system.";
	const subheadline = "We ship momentum systems—design, automation, and campaigns that move in sync and compound results.";

	return (
		<section 
			ref={sectionRef} 
			className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 sm:pt-24 md:pt-32 pb-12 sm:pb-16 md:pb-24 px-4"
		>
			{/* Ultra-simplified Background - maximum performance */}
			<div className="absolute inset-0 -z-10 bg-slate-950">
				{/* Single simple gradient orb - responsive sizes for mobile */}
				<div 
					className="absolute top-[20%] left-[15%] w-[200px] h-[200px] sm:w-[300px] sm:h-[300px] rounded-full opacity-15"
					style={{
						background: "radial-gradient(circle, rgba(14,165,233,0.3), transparent 70%)",
					}}
				/>
				<div 
					className="absolute bottom-[25%] right-[20%] w-[150px] h-[150px] sm:w-[250px] sm:h-[250px] rounded-full opacity-10"
					style={{
						background: "radial-gradient(circle, rgba(139,92,246,0.3), transparent 70%)",
					}}
				/>
			</div>

			{/* Floating Particle Elements - Removed for better initial performance */}

			{/* Main Content - simplified structure */}
			<motion.div
				ref={containerRef}
				className="relative z-10 mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8 text-center"
				style={{
					y: enableParallax ? contentY : 0,
					opacity: enableParallax ? contentOpacity : 1,
				}}
			>
				{loaded && (
					<div className="w-full opacity-0 animate-fade-in">
							{/* Tag - simplified, no animations */}
							<div className="mb-6 md:mb-8">
								<span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-5 py-2 text-xs uppercase tracking-[0.4em] text-white/70">
									<span className="inline-block h-1.5 w-1.5 rounded-full bg-sky-400 opacity-75" />
									Arvado
								</span>
							</div>

							{/* Headline - no JS animations, CSS only */}
							<h1 className="text-[clamp(1.875rem,5.5vw,4.5rem)] font-bold leading-[1.15] tracking-[-0.02em] text-white break-normal hyphens-none w-full max-w-5xl mx-auto mb-6 md:mb-8">
								{headline}
							</h1>

							{/* Subheadline - no animations */}
							<p className="mx-auto mb-10 md:mb-12 max-w-2xl text-base md:text-lg text-white/70 leading-relaxed">
								{subheadline}
							</p>

							{/* CTA Buttons - responsive and touch-friendly */}
							<div className="flex flex-col items-stretch sm:items-center sm:justify-center gap-3 sm:gap-4 sm:flex-row w-full sm:w-auto">
								<a
									href="#contact"
									className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-sky-500 to-cyan-500 px-6 sm:px-10 py-3 sm:py-4 text-sm sm:text-base font-semibold text-white shadow-lg shadow-sky-500/25 ring-1 ring-white/20 transition-transform hover:scale-105 active:scale-95 text-center touch-manipulation"
								>
									<div className="absolute inset-0 bg-gradient-to-r from-sky-400 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />
									<span className="relative z-10">Book a call</span>
								</a>

								<a
									href="#launch"
									className="rounded-2xl border border-white/15 bg-white/[0.05] px-6 sm:px-10 py-3 sm:py-4 text-sm sm:text-base font-medium text-white transition-all hover:bg-white/10 hover:scale-105 active:scale-95 text-center touch-manipulation"
								>
									See how we launch
								</a>
							</div>
						</div>
					)}
			</motion.div>
		</section>
	);
}
