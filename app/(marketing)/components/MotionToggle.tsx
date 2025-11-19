 "use client";
 
 import { motion } from "framer-motion";
 import { useMotionSettings } from "./MotionProvider";
 
 export default function MotionToggle() {
   const { reduceMotion, setReduceMotion } = useMotionSettings();
 
   return (
     <button
       type="button"
       onClick={() => setReduceMotion(!reduceMotion)}
       className="fixed bottom-5 right-5 z-50 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/80 backdrop-blur-md hover:bg-white/10 transition"
       aria-pressed={reduceMotion}
       aria-label={reduceMotion ? "Enable motion effects" : "Reduce motion"}
     >
       <span className="inline-flex items-center gap-2">
         <motion.span
           layout
           className={`inline-block h-2 w-2 rounded-full ${reduceMotion ? "bg-white/60" : "bg-sky-400"}`}
           transition={{ type: "spring", stiffness: 400, damping: 30 }}
         />
         {reduceMotion ? "Motion: Reduced" : "Motion: On"}
       </span>
     </button>
   );
 }
 


