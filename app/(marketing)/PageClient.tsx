"use client";

import { useEffect, Suspense, lazy, useState } from "react";
import { useLenis } from "./lib/lenis";
import { getLenisInstance } from "./lib/lenis";
import { MotionProvider } from "./components/MotionProvider";
import Navigation from "./components/Navigation";
import ScrollProgress from "./components/ScrollProgress";
import CinematicHero from "./components_new/CinematicHero";
import Portfolio from "./components/Portfolio";
import Contact from "./components/Contact";
import LazyLoadSection from "./components/LazyLoadSection";
import Footer from "./components/Footer";

// Lazy load heavy 3D components for better performance
const ServiceGlobe = lazy(() => import("./components_new/ServiceGlobe"));
const LaunchSequence = lazy(() => import("./components_new/LaunchSequence"));
const Perspective3DShowcase = lazy(() => import("./components_new/Perspective3DShowcase"));

export default function PageClient() {
  const [isReady, setIsReady] = useState(false);
  useLenis(true);

  // Ensure page starts at top on every reload
  useEffect(() => {
    // Disable browser's automatic scroll restoration immediately
    if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    // Scroll to top immediately on mount
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    
    // Also scroll to top when Lenis initializes
    const checkLenis = setInterval(() => {
      const lenis = getLenisInstance();
      if (lenis) {
        lenis.scrollTo(0, { immediate: true });
        clearInterval(checkLenis);
        setIsReady(true);
      }
    }, 50);

    // Fallback: mark as ready after a short delay even if Lenis isn't ready
    const fallbackTimer = setTimeout(() => {
      clearInterval(checkLenis);
      setIsReady(true);
    }, 1000);

    return () => {
      clearInterval(checkLenis);
      clearTimeout(fallbackTimer);
    };
  }, []);

  return (
    <MotionProvider>
      <ScrollProgress />
      <Navigation />
      <div className="pt-16 w-full overflow-x-hidden min-h-screen">
        {/* Hero section - first visible content */}
        <CinematicHero />
        <LazyLoadSection>
          <Suspense fallback={null}>
            <ServiceGlobe />
          </Suspense>
        </LazyLoadSection>
        <LazyLoadSection>
          <Portfolio />
        </LazyLoadSection>
        <LazyLoadSection>
          <Suspense fallback={null}>
            <LaunchSequence />
          </Suspense>
        </LazyLoadSection>
        <LazyLoadSection>
          <Suspense fallback={null}>
            <Perspective3DShowcase />
          </Suspense>
        </LazyLoadSection>
        <LazyLoadSection>
          <Contact />
        </LazyLoadSection>
        <Footer />
      </div>
    </MotionProvider>
  );
}
 
