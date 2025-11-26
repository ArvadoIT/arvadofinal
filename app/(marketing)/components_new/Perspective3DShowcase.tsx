"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { 
  Sphere,
  Torus, 
  MeshDistortMaterial,
  Environment,
  PerspectiveCamera
} from "@react-three/drei";
import { Suspense, useRef, useMemo } from "react";
import type { MutableRefObject } from "react";
import { useScroll, useTransform, useSpring } from "framer-motion";
import { motion, useMotionValueEvent } from "framer-motion";
import { useMotionSettings } from "../components/MotionProvider";
import * as THREE from "three";

// Ultra-realistic 3D Model Component with optimized performance
function Model3D({ scrollProgressRef }: { scrollProgressRef: MutableRefObject<number> }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<any>(null);
  const reduceMotion = useMotionSettings().reduceMotion;
  
  // Memoize rotation calculations to avoid recalculation
  const lastProgress = useRef(0);
  const lastTime = useRef(0);
  
  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    
    const time = clock.getElapsedTime();
    const progress = scrollProgressRef.current;
    
    // Only update if progress changed significantly (performance optimization)
    const progressDelta = Math.abs(progress - lastProgress.current);
    const timeDelta = time - lastTime.current;
    
    if (progressDelta > 0.001 || timeDelta > 0.016) { // ~60fps threshold
      // Smooth rotation based on scroll with subtle time-based animation
      meshRef.current.rotation.y = progress * Math.PI * 2 + (reduceMotion ? 0 : time * 0.08);
      meshRef.current.rotation.x = reduceMotion ? 0 : Math.sin(time * 0.25) * 0.08;
      
      // Animate material distortion only if motion is enabled
      if (materialRef.current && !reduceMotion) {
        materialRef.current.distort = 0.12 + Math.sin(time * 0.4) * 0.04;
      }
      
      lastProgress.current = progress;
      lastTime.current = time;
    }
  });

  // Memoize material properties
  const materialProps = useMemo(() => ({
    speed: 1.2,
    roughness: 0.05, // Ultra-smooth, mirror-like surface
    metalness: 0.95, // Highly metallic
    emissive: "#0ea5e9",
    emissiveIntensity: 0.3,
    color: "#1e3a8a", // Deeper blue for realism
    transparent: true,
    opacity: 0.98,
    envMapIntensity: 2.5, // Strong environment reflections
  }), []);

  return (
    <group>
      {/* Ultra-realistic primary model - Reduced geometry for better performance */}
      <Sphere ref={meshRef} args={[1, 48, 48]}>
        {/* @ts-ignore */}
        <MeshDistortMaterial
          ref={materialRef}
          {...materialProps}
        />
      </Sphere>
      
      {/* Ultra-realistic metallic ring - further reduced segments for performance */}
      <Torus
        args={[1.5, 0.08, 16, 32]} // Further reduced segments for better performance
        rotation={[Math.PI / 2, 0, 0]}
      >
        <meshStandardMaterial
          color="#4476BF"
          roughness={0.3}
          metalness={0.2}
          emissive="#4476BF"
          emissiveIntensity={0.06}
          transparent
          opacity={0.9}
        />
      </Torus>
      
      {/* Inner ring detail - reduced segments */}
      <Torus
        args={[1.45, 0.018, 8, 16]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <meshStandardMaterial
          color="#4476BF"
          metalness={1.0}
          roughness={0.02}
          emissive="#4476BF"
          emissiveIntensity={0.2}
          transparent
          opacity={0.8}
        />
      </Torus>
    </group>
  );
}

// Optimized camera controller with performance improvements
function ScrollCamera({ scrollProgressRef }: { scrollProgressRef: MutableRefObject<number> }) {
  const { camera } = useThree();
  const reduceMotion = useMotionSettings().reduceMotion;
  const lastProgress = useRef(0);
  
  useFrame(() => {
    if (reduceMotion) return;
    
    const progress = scrollProgressRef.current;
    
    // Only update camera if progress changed significantly (performance optimization)
    const progressDelta = Math.abs(progress - lastProgress.current);
    if (progressDelta < 0.001) return;
    
    // Calculate camera position based on scroll progress
    // Creates a smooth orbital path around the model
    const radius = 5;
    const angle = progress * Math.PI * 2;
    const verticalOffset = Math.sin(progress * Math.PI) * 2;
    
    // Smooth camera movement
    camera.position.x = Math.cos(angle) * radius;
    camera.position.z = Math.sin(angle) * radius;
    camera.position.y = 1 + verticalOffset;
    
    // Camera always looks at center
    camera.lookAt(0, 0, 0);
    
    // Update camera projection only when needed
    camera.updateProjectionMatrix();
    
    lastProgress.current = progress;
  });

  return null;
}

// Ultra-realistic scene with optimized lighting setup
function Scene3D({ scrollProgressRef }: { scrollProgressRef: MutableRefObject<number> }) {
  const { reduceMotion } = useMotionSettings();
  
  // Memoize lighting setup for performance
  const lightingConfig = useMemo(() => ({
    ambient: reduceMotion ? 0.25 : 0.35,
    point1: { intensity: reduceMotion ? 0.9 : 1.4, color: "#60a5fa" },
    point2: { intensity: reduceMotion ? 0.6 : 0.8, color: "#a78bfa" },
    point3: { intensity: reduceMotion ? 0.4 : 0.6, color: "#34d399" },
    directional: { intensity: reduceMotion ? 0.5 : 0.7 },
  }), [reduceMotion]);
  
  return (
    <>
      {/* Realistic ambient lighting - softer base illumination */}
      <ambientLight intensity={lightingConfig.ambient} />
      
      {/* Key light - main illumination from top-right */}
      <pointLight 
        position={[5, 5, 5]} 
        intensity={lightingConfig.point1.intensity} 
        color={lightingConfig.point1.color}
        castShadow
        decay={2}
        distance={20}
      />
      
      {/* Fill light - softer illumination from opposite side */}
      <pointLight 
        position={[-5, 3, -5]} 
        intensity={lightingConfig.point2.intensity} 
        color={lightingConfig.point2.color}
        decay={2}
        distance={20}
      />
      
      {/* Bottom accent light - creates depth */}
      <pointLight 
        position={[0, -5, 0]} 
        intensity={lightingConfig.point3.intensity} 
        color={lightingConfig.point3.color}
        decay={2}
        distance={20}
      />
      
      {/* Rim light for dramatic edge lighting */}
      <directionalLight
        position={[0, 5, -5]}
        intensity={lightingConfig.directional.intensity}
        color="#ffffff"
        castShadow
      />
      
      {/* Additional accent lights for realism */}
      <spotLight
        position={[3, 4, 3]}
        angle={0.3}
        penumbra={0.5}
        intensity={0.4}
        color="#0ea5e9"
        castShadow
      />
      
      {/* 3D Model */}
      <Model3D scrollProgressRef={scrollProgressRef} />
      
      {/* Ultra-realistic environment for reflections - lower resolution for performance */}
      <Environment 
        preset="city"
        resolution={128} // Further reduced resolution for better performance
        background={false}
      />
      
      {/* Camera controller */}
      <ScrollCamera scrollProgressRef={scrollProgressRef} />
    </>
  );
}

export default function Perspective3DShowcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollProgressRef = useRef<number>(0);
  const { reduceMotion } = useMotionSettings();
  
  // Scroll progress tracking with optimized offset
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 0.8", "end 0.2"],
    layoutEffect: false, // Performance optimization
  });
  
  // Optimized spring for scroll progress - smoother with better performance
  const smoothProgress = useSpring(scrollYProgress, {
    mass: 0.4, // Lighter mass for faster response
    stiffness: 120, // Higher stiffness for snappier feel
    damping: 28, // Slightly less damping for smoother motion
  });
  
  // Transform scroll progress to camera rotation (0 to 1)
  const cameraProgress = useTransform(smoothProgress, [0, 1], [0, 1]);
  
  // Optimized ref update - throttle updates for performance
  useMotionValueEvent(cameraProgress, "change", (latest) => {
    scrollProgressRef.current = latest;
  });
  
  // Content animations - memoized transforms
  const contentOpacity = useTransform(smoothProgress, [0, 0.15, 0.85, 1], [0, 1, 1, 0]);
  const contentY = useTransform(smoothProgress, [0, 0.4], [30, 0]);
  
  // Background effects
  const bgOpacity = useTransform(smoothProgress, [0, 0.5, 1], [0.3, 0.6, 0.3]);
  
  // Memoize Canvas GL config for performance
  const glConfig = useMemo(() => ({
    antialias: false, // Disable antialiasing for better performance
    powerPreference: "high-performance" as const,
    alpha: true,
    stencil: false, // Disable stencil buffer for performance
    depth: true,
    logarithmicDepthBuffer: false, // Disable for performance
    precision: "mediump" as const, // Use medium precision for better performance
  }), []);
  
  // Adaptive DPR based on device capabilities - mobile optimized
  const adaptiveDPR = useMemo((): [number, number] => {
    if (typeof window === 'undefined') return [1, 1.5];
    const isMobile = window.innerWidth < 640;
    const isTablet = window.innerWidth < 1024;
    if (isMobile) return [1, 1]; // Lower DPR on mobile for performance
    if (isTablet) return [1, 1.25]; // Medium DPR on tablet
    return [1, Math.min(window.devicePixelRatio || 1, 1.5)]; // Higher DPR on desktop
  }, []);
  
  return (
    <section
      ref={sectionRef}
      className="relative h-screen flex items-center justify-center overflow-hidden px-4"
      id="showcase"
    >
      {/* Background gradient layers */}
      <motion.div
        className="absolute inset-0 -z-10"
        style={{ opacity: bgOpacity }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_50%,rgba(14,165,233,0.15),transparent)]" />
      </motion.div>
      
      {/* 3D Canvas Container - Optimized for performance */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <Canvas
          dpr={adaptiveDPR} // Adaptive DPR for performance
          gl={glConfig}
          frameloop={reduceMotion ? "demand" : "always"}
          className="w-full h-full touch-pan-y touch-pinch-zoom"
          performance={{ min: 0.5 }} // Performance monitoring
          shadows={false} // Disable shadows for better performance
        >
          <Suspense fallback={null}>
            <PerspectiveCamera
              makeDefault
              position={[0, 0.7, 4.2]}
              fov={58}
              near={0.1}
              far={100}
            />
            <Scene3D scrollProgressRef={scrollProgressRef} />
          </Suspense>
        </Canvas>
      </div>
      
      {/* Overlay Content - responsive padding */}
      <motion.div
        className="relative z-10 mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center justify-center py-2 sm:py-3"
        style={{
          opacity: contentOpacity,
          y: contentY,
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Tag */}
          <motion.div
            className="mb-1 sm:mb-1.5"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 20 }}
          >
            <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.03] px-2 py-0.5 text-[8px] sm:text-[9px] uppercase tracking-[0.2em] text-white/70 backdrop-blur-md">
              <motion.span
                className="inline-block h-0.5 w-0.5 rounded-full bg-sky-400"
                animate={{
                  opacity: [0.5, 1, 0.5],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              Interactive Experience
            </span>
          </motion.div>
          
          {/* Heading - responsive text size */}
          <motion.h2
            className="text-[clamp(1rem,3.5vw,2rem)] sm:text-[clamp(1.2rem,3.8vw,2.5rem)] font-bold leading-[1.1] tracking-[-0.02em] text-white mb-0.5 sm:mb-1"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <span className="text-glass">
              Perspective-Shifting
            </span>
            <br />
            <span className="text-frozen">
              3D Showcase
            </span>
          </motion.h2>
          
          {/* Description */}
          <motion.p
            className="mx-auto mb-1.5 sm:mb-2 max-w-2xl text-[11px] sm:text-xs text-white/70 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Scroll to experience a cinematic camera orbit around our 3D model. 
            Each scroll movement shifts perspective, revealing new dimensions of depth and detail.
          </motion.p>
          
          {/* Enhanced Scroll Indicator - responsive */}
          <motion.div
            className="flex flex-col items-center gap-0.5"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <motion.span 
              className="text-[8px] sm:text-[9px] uppercase tracking-widest text-white/60 font-medium"
              animate={{
                opacity: [0.6, 1, 0.6],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <span className="hidden sm:inline">Scroll to rotate</span>
              <span className="sm:hidden">Swipe to rotate</span>
            </motion.span>
            <motion.div
              className="relative w-3 h-6 rounded-full border-2 border-white/30 flex items-start justify-center p-0.5 backdrop-blur-sm bg-white/5"
              animate={{
                y: [0, 4, 0],
                borderColor: ["rgba(255, 255, 255, 0.3)", "rgba(14, 165, 233, 0.6)", "rgba(255, 255, 255, 0.3)"],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <motion.div 
                className="w-0.5 h-2 rounded-full bg-gradient-to-b from-sky-400 to-cyan-400"
                animate={{
                  scaleY: [1, 0.5, 1],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              {/* Glow effect */}
              <motion.div
                className="absolute inset-0 rounded-full bg-sky-400/20 blur-md"
                animate={{
                  opacity: [0, 0.5, 0],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </motion.div>
            {/* Progress dots */}
            <div className="flex gap-0.5 mt-0">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-0.5 h-0.5 rounded-full bg-white/30"
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.3, 1, 0.3],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.2,
                  }}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
      
      {/* Vignette overlay */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 80% 60% at 50% 50%, transparent, rgba(2,6,23,0.4))",
        }}
      />
    </section>
  );
}

