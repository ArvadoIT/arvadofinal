 "use client";
 
 import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
 
 type MotionContextValue = {
   reduceMotion: boolean;
   setReduceMotion: (value: boolean) => void;
 };
 
 const MotionContext = createContext<MotionContextValue | null>(null);
 
 export function MotionProvider({ children }: { children: ReactNode }) {
   const [reduceMotion, setReduceMotion] = useState(false);
 
   // Respect system preference on first load
   useEffect(() => {
     const media = window.matchMedia("(prefers-reduced-motion: reduce)");
     if (media.matches) setReduceMotion(true);
     const onChange = () => setReduceMotion(media.matches);
     media.addEventListener("change", onChange);
     return () => media.removeEventListener("change", onChange);
   }, []);
 
   const value = useMemo(() => ({ reduceMotion, setReduceMotion }), [reduceMotion]);
   return <MotionContext.Provider value={value}>{children}</MotionContext.Provider>;
 }
 
 export function useMotionSettings() {
   const ctx = useContext(MotionContext);
   if (!ctx) throw new Error("useMotionSettings must be used within MotionProvider");
   return ctx;
 }
 


