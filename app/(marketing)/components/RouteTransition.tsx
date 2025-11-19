 "use client";
 
 import { AnimatePresence, motion } from "framer-motion";
 import { usePathname } from "next/navigation";
 import type { ReactNode } from "react";
 import { useMotionSettings } from "./MotionProvider";
 
 export default function RouteTransition({ children }: { children: ReactNode }) {
   const pathname = usePathname();
   const { reduceMotion } = useMotionSettings();
 
   const variants = {
     initial: { opacity: 0, y: reduceMotion ? 0 : 8, filter: "blur(2px)" },
     animate: { opacity: 1, y: 0, filter: "blur(0px)" },
     exit: { opacity: 0, y: reduceMotion ? 0 : -8, filter: "blur(2px)" },
   };
 
   return (
     <AnimatePresence mode="wait">
       <motion.main
         key={pathname}
         initial="initial"
         animate="animate"
         exit="exit"
         variants={variants}
         transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
         className="site-reveal"
       >
         {children}
       </motion.main>
     </AnimatePresence>
   );
 }
 


