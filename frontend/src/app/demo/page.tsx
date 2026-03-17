"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function HackathonDemo() {
  const router = useRouter();
  const [stage, setStage] = useState<"splash" | "transitioning">("splash");

  useEffect(() => {
    // 1. Splash Screen
    const timer1 = setTimeout(() => {
      setStage("transitioning");
    }, 2500);

    // 2. Automate Routing to Flagship Skill Gap Analyzer
    const timer2 = setTimeout(() => {
      router.push("/skill-gap?demo=true");
    }, 4000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [router]);

  return (
    <div className="fixed inset-0 z-[100] bg-[#080810] flex flex-col items-center justify-center pointer-events-none">
      <AnimatePresence mode="wait">
        {stage === "splash" && (
          <motion.div
            key="splash"
            initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
            transition={{ duration: 1.5, ease: [0.25, 1, 0.5, 1] }}
            className="flex flex-col items-center justify-center text-center"
          >
            <motion.div
              animate={{ 
                boxShadow: ["0 0 0px #7c6ef7", "0 0 100px #7c6ef7", "0 0 0px #7c6ef7"] 
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-24 h-24 rounded-[30%] bg-gradient-to-br from-[#c4bdff] via-accent to-pink flex items-center justify-center mb-8"
            >
               <span className="text-white font-syne font-black text-4xl">S</span>
            </motion.div>
            <h1 className="font-syne text-[4rem] font-extrabold tracking-tight text-gradient leading-none mb-2">
              SkillSync
            </h1>
            <p className="font-dm-mono text-[#7a789a] tracking-[0.3em] uppercase text-sm mt-4">
              Autonomous Demo Sequence
            </p>
          </motion.div>
        )}
        
        {stage === "transitioning" && (
          <motion.div 
            key="trans"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center"
          >
             <motion.div
               animate={{ rotate: 360 }}
               transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
               className="w-8 h-8 rounded-full border-t-2 border-r-2 border-[var(--color-accent)]"
             />
             <p className="font-dm-mono text-[var(--color-accent)] mt-6 tracking-widest text-sm uppercase">Loading AI Models...</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
