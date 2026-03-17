"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";
import { type AIAction } from "@/hooks/useAIOrchestrator";

interface AIThinkingProps {
  type: AIAction;
  stepText: string;
  progress: number;
}

export function AIThinking({ type, stepText, progress }: AIThinkingProps) {
  const renderVisualizer = () => {
    switch (type) {
      case "skill-gap":
        return <SkillGraphVisualizer progress={progress} />;
      case "salary":
        return <DataStreamVisualizer progress={progress} />;
      case "role":
        return <ProbabilityVisualizer progress={progress} />;
      default:
        return <DefaultPulseVisualizer />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
      animate={{ opacity: 1, backdropFilter: "blur(20px)" }}
      exit={{ opacity: 0, backdropFilter: "blur(0px)", transition: { duration: 0.6 } }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-8 bg-[#080810]/60"
    >
      {/* Background Particles/Orbits */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none flex items-center justify-center">
        <motion.div 
          className="w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] rounded-full border border-[rgba(124,110,247,0.05)]"
          animate={{ rotate: 360, scale: [1, 1.1, 1] }} 
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        <motion.div 
          className="absolute w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] rounded-full border border-[rgba(240,122,255,0.05)]"
          animate={{ rotate: -360, scale: [1, 1.05, 1] }} 
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
        transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
        className="relative z-10 flex flex-col items-center justify-center p-12 glass-panel-heavy rounded-3xl w-full max-w-xl mx-auto overflow-hidden"
      >
        {/* Inner Glare */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        
        <div className="mb-12 w-full h-40 flex items-center justify-center relative">
          {renderVisualizer()}
        </div>

        <div className="flex flex-col items-center gap-4 mb-8">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="p-3 rounded-full bg-[rgba(124,110,247,0.1)] border border-[rgba(124,110,247,0.2)]"
          >
            <Loader2 className="text-[var(--color-accent)] w-6 h-6 shadow-[0_0_15px_var(--color-accent)]" />
          </motion.div>
          
          <div className="h-8 overflow-hidden relative w-full text-center">
            <AnimatePresence mode="popLayout">
              <motion.p
                key={stepText}
                initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -20, filter: "blur(4px)" }}
                transition={{ duration: 0.4 }}
                className="font-syne font-bold text-xl tracking-wide text-gradient absolute inset-0 w-full"
              >
                {stepText}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>

        {/* Cinematic Progress Track */}
        <div className="w-full h-1.5 bg-[#1a1a24] rounded-full overflow-hidden relative shadow-inner">
          <motion.div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-[var(--color-accent)] via-[var(--color-pink)] to-[var(--color-green)]"
            initial={{ width: "0%" }}
            animate={{ width: `${progress}%` }}
            transition={{ ease: "easeOut", duration: 0.4 }}
          />
          <motion.div 
            className="absolute inset-0 bg-gradient-to-r from-transparent to-white/30 mix-blend-overlay"
            animate={{ x: ["-100%", "200%"] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}

// Cinematic Sub-visualizers
function SkillGraphVisualizer({ progress }: { progress: number }) {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Center Node / Brain */}
      <motion.div 
        className="absolute w-12 h-12 rounded-full bg-[rgba(124,110,247,0.15)] border-2 border-[var(--color-accent)] z-20 flex items-center justify-center backdrop-blur-md"
        animate={{ scale: [1, 1.1, 1], boxShadow: ["0 0 10px #7c6ef7", "0 0 40px #7c6ef7", "0 0 10px #7c6ef7"] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-4 h-4 bg-white rounded-full animate-pulse-ring" />
      </motion.div>

      {/* Dynamic Edges SVG */}
      <motion.svg className="absolute inset-0 w-full h-full z-10 overflow-visible" style={{ filter: "drop-shadow(0 0 6px rgba(124,110,247,0.4))" }}>
        <motion.line x1="50%" y1="50%" x2="20%" y2="20%" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: progress > 15 ? 1 : 0, opacity: progress > 15 ? 0.6 : 0 }} transition={{ duration: 0.8 }} />
        <motion.line x1="50%" y1="50%" x2="85%" y2="30%" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: progress > 40 ? 1 : 0, opacity: progress > 40 ? 0.6 : 0 }} transition={{ duration: 0.8 }} />
        <motion.line x1="50%" y1="50%" x2="75%" y2="85%" stroke="var(--color-pink)" strokeWidth="2" strokeDasharray="6 6" strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: progress > 70 ? 1 : 0, opacity: progress > 70 ? 0.8 : 0 }} transition={{ duration: 0.8 }} />
        <motion.line x1="50%" y1="50%" x2="25%" y2="80%" stroke="var(--color-green)" strokeWidth="2" strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: progress > 90 ? 1 : 0, opacity: progress > 90 ? 0.6 : 0 }} transition={{ duration: 0.8 }} />
      </motion.svg>

      {/* Orbiting Nodes */}
      <motion.div className="absolute top-[15%] left-[17%] w-6 h-6 rounded-full bg-gradient-to-br from-accent to-blue-500 shadow-[0_0_15px_var(--color-accent)] z-20"
        initial={{ opacity: 0, scale: 0 }} animate={{ opacity: progress > 20 ? 1 : 0, scale: progress > 20 ? 1 : 0 }} transition={{ type: "spring", bounce: 0.5 }} />
      <motion.div className="absolute top-[25%] left-[82%] w-5 h-5 rounded-full bg-gradient-to-br from-accent to-blue-500 shadow-[0_0_15px_var(--color-accent)] z-20"
        initial={{ opacity: 0, scale: 0 }} animate={{ opacity: progress > 45 ? 1 : 0, scale: progress > 45 ? 1 : 0 }} transition={{ type: "spring", bounce: 0.5 }} />
      <motion.div className="absolute top-[75%] left-[22%] w-5 h-5 rounded-full bg-gradient-to-br from-green to-emerald-500 shadow-[0_0_15px_var(--color-green)] z-20"
        initial={{ opacity: 0, scale: 0 }} animate={{ opacity: progress > 95 ? 1 : 0, scale: progress > 95 ? 1 : 0 }} transition={{ type: "spring", bounce: 0.5 }} />
      
      {/* Missing Skill Pulsing Node */}
      <motion.div className="absolute top-[82%] left-[72%] w-7 h-7 rounded-full border-2 border-[var(--color-pink)] bg-[rgba(240,122,255,0.1)] flex items-center justify-center z-20"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: progress > 75 ? 1 : 0, scale: progress > 75 ? 1 : 0, boxShadow: ["0 0 10px #f07aff", "0 0 30px #f07aff", "0 0 10px #f07aff"] }}
        transition={{ scale: { type: "spring", bounce: 0.5 }, boxShadow: { duration: 1.5, repeat: Infinity } }}
      >
        <div className="w-1.5 h-1.5 bg-[var(--color-pink)] rounded-full animate-pulse" />
      </motion.div>
    </div>
  );
}

function DataStreamVisualizer({ progress }: { progress: number }) {
  return (
    <div className="flex gap-3 items-end h-[100px] w-full px-8 justify-between">
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="w-4 bg-gradient-to-t from-[var(--color-yellow)] to-[var(--color-green)] rounded-t-sm shadow-[0_0_10px_rgba(247,200,110,0.5)]"
          initial={{ height: "10%", opacity: 0.1 }}
          animate={{ 
            height: progress > (i*8) ? `${30 + Math.random() * 70}%` : "10%",
            opacity: progress > (i*8) ? [0.8, 1, 0.8] : 0.1 
          }}
          transition={{ height: { duration: 0.5, type: "spring" }, opacity: { duration: 1.5, repeat: Infinity } }}
        />
      ))}
    </div>
  );
}

function ProbabilityVisualizer({ progress }: { progress: number }) {
  return (
    <div className="relative w-32 h-32 flex items-center justify-center">
      <svg className="absolute inset-0 w-full h-full -rotate-90 drop-shadow-[0_0_15px_rgba(82,217,164,0.4)]">
        <circle cx="64" cy="64" r="56" stroke="rgba(255,255,255,0.05)" strokeWidth="8" fill="none" />
        <motion.circle 
          cx="64" cy="64" r="56" 
          stroke="var(--color-green)" strokeWidth="8" fill="none" 
          strokeLinecap="round"
          strokeDasharray="351.8"
          initial={{ strokeDashoffset: 351.8 }}
          animate={{ strokeDashoffset: 351.8 - (351.8 * (progress / 100)) }}
          transition={{ ease: "easeOut", duration: 0.4 }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-syne font-black text-3xl text-[var(--color-green)] leading-none">{Math.round(progress)}</span>
        <span className="font-dm-mono text-[0.6rem] text-[var(--color-green)] uppercase tracking-widest mt-1">Confidence</span>
      </div>
      <motion.div 
        className="absolute inset-0 border border-[var(--color-green)] rounded-full opacity-30"
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0, 0.3] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </div>
  );
}

function DefaultPulseVisualizer() {
  return (
    <div className="relative flex items-center justify-center w-full h-full">
      <motion.div
        className="absolute w-20 h-20 rounded-full bg-[var(--color-accent)]"
        animate={{ scale: [1, 2.5], opacity: [0.6, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
      />
      <motion.div
        className="absolute w-20 h-20 rounded-full bg-[var(--color-pink)]"
        animate={{ scale: [1, 2], opacity: [0.4, 0] }}
        transition={{ duration: 2, delay: 0.5, repeat: Infinity, ease: "easeOut" }}
      />
      <div className="w-12 h-12 bg-white rounded-full z-10 shadow-[0_0_30px_white]" />
    </div>
  );
}
