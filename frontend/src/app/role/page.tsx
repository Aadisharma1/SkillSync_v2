"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { useUIState } from "@/hooks/useUIState";
import { useAIOrchestrator } from "@/hooks/useAIOrchestrator";
import { AIThinking } from "@/components/ui/AIThinking";

function CountUp({ to, decimals = 0, suffix = "" }: { to: number, decimals?: number, suffix?: string }) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let startTime: number;
    const duration = 2000;
    const animate = (time: number) => {
      if (!startTime) startTime = time;
      const progress = Math.min((time - startTime) / duration, 1);
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setValue(easeProgress * to);
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [to]);
  return <span>{value.toFixed(decimals)}{suffix}</span>;
}

export default function JobRolePredictor() {
  const { uiState, setUiState } = useUIState();
  const orchestrator = useAIOrchestrator();

  const [internships, setInternships] = useState(0);
  const [projects, setProjects] = useState(0);

  const [roles, setRoles] = useState([
    { name: "Software Engineer", prob: 0 },
    { name: "Backend Developer", prob: 0 },
    { name: "Data Analyst", prob: 0 },
    { name: "Cloud Engineer", prob: 0 },
    { name: "Machine Learning Engineer", prob: 0 },
  ]);

  const handlePredict = () => {
    setUiState("reasoning");
    
    // Simulate complex background calculations over time
    setTimeout(() => {
      const newRoles = roles.map(r => ({
        ...r,
        prob: Math.min(99, Math.floor(Math.random() * 40) + 40 + (internships * 3) + (projects * 2.5))
      })).sort((a,b) => b.prob - a.prob);
      setRoles(newRoles);
    }, 1500);

    orchestrator.startSequence("role", () => {
      setUiState("result");
    });
  };

  return (
    <PageWrapper>
      <div className="flex flex-col gap-6 relative">
        <AnimatePresence>
          {uiState === "reasoning" && (
            <AIThinking type="role" stepText={orchestrator.currentStepText} progress={orchestrator.progress} />
          )}
        </AnimatePresence>

        <motion.div className={uiState === "reasoning" ? "opacity-30 blur-sm pointer-events-none transition-all duration-300" : ""}>
          <h1 className="font-syne text-[clamp(1.6rem,3vw,2.4rem)] font-extrabold tracking-tight">
            🎯 Job Role Predictor
          </h1>
          <p className="text-[0.9rem] text-[#7a789a] mt-1 font-light flex items-center gap-2">
            RandomForest Classifier trained on 2,500 students
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {(uiState === "idle" || uiState === "input" || uiState === "reasoning") && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`flex flex-col gap-6 w-full max-w-2xl ${uiState === "reasoning" ? "opacity-40 blur-sm pointer-events-none transition-all duration-500" : ""}`}
            >
              <div className="glass-panel rounded-3xl p-8 relative overflow-hidden group hover:border-[rgba(124,110,247,0.3)] transition-all">
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-accent)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="font-dm-mono text-[0.68rem] tracking-widest uppercase text-[var(--color-accent)] mb-8 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                  Experience Vectors
                </div>
                
                <div className="flex flex-col gap-8 relative z-10">
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <label className="text-[0.85rem] text-[#ede9ff] font-bold tracking-wide">Internships</label>
                      <span className="font-dm-mono text-[0.85rem] text-[var(--color-accent)] bg-[rgba(124,110,247,0.15)] border border-[rgba(124,110,247,0.3)] px-3 py-1 rounded-lg font-bold shadow-[0_0_10px_rgba(124,110,247,0.2)]">{internships}</span>
                    </div>
                    <input 
                      type="range" min="0" max="10" value={internships} 
                      onChange={(e) => { setInternships(parseInt(e.target.value)); setUiState("input"); }}
                      className="w-full h-2 bg-[#17172a] rounded-lg appearance-none cursor-pointer accent-[var(--color-accent)] shadow-inner"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <label className="text-[0.85rem] text-[#ede9ff] font-bold tracking-wide">Projects Completed</label>
                      <span className="font-dm-mono text-[0.85rem] text-[var(--color-accent)] bg-[rgba(124,110,247,0.15)] border border-[rgba(124,110,247,0.3)] px-3 py-1 rounded-lg font-bold shadow-[0_0_10px_rgba(124,110,247,0.2)]">{projects}</span>
                    </div>
                    <input 
                      type="range" min="0" max="10" value={projects} 
                      onChange={(e) => { setProjects(parseInt(e.target.value)); setUiState("input"); }}
                      className="w-full h-2 bg-[#17172a] rounded-lg appearance-none cursor-pointer accent-[var(--color-accent)] shadow-inner"
                    />
                  </div>
                </div>

                <div className="mt-10 flex justify-end relative z-10">
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2, boxShadow: "0 10px 30px rgba(124,110,247,0.4)" }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handlePredict}
                    className="px-8 py-3.5 bg-[var(--color-accent)] text-white font-syne font-bold rounded-xl shadow-[0_4px_18px_rgba(124,110,247,0.3)] transition-all tracking-wide"
                  >
                    ⚡ Compute Role Classification
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}

          {uiState === "result" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="glass-panel-heavy border border-[var(--color-accent)]/30 shadow-[0_0_50px_rgba(124,110,247,0.15)] rounded-3xl p-8 max-w-2xl relative overflow-hidden"
            >
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--color-green)] to-transparent opacity-50" />
              
              <div className="text-center mb-10 relative">
                <div className="font-dm-mono text-[0.7rem] tracking-widest uppercase text-[var(--color-green)] mb-3 flex items-center justify-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[var(--color-green)] animate-pulse" />
                  Primary Projection
                </div>
                <h2 className="font-syne text-[clamp(2rem,5vw,3.5rem)] font-extrabold tracking-tight leading-none mb-6 drop-shadow-lg text-white">
                  {roles[0].name}
                </h2>
                <div className="inline-flex items-center gap-2 bg-[rgba(82,217,164,0.15)] border border-[rgba(82,217,164,0.4)] rounded-full px-5 py-1.5 font-dm-mono text-[0.9rem] text-[var(--color-green)] font-bold shadow-[0_0_15px_rgba(82,217,164,0.2)]">
                  <CountUp to={roles[0].prob} decimals={1} />% Confidence Bound
                </div>
              </div>

              <div className="flex flex-col gap-4 relative z-10">
                {roles.slice(1).map((r, i) => (
                  <motion.div 
                    layoutId={r.name}
                    key={r.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + (i * 0.1), layout: { type: "spring", stiffness: 300, damping: 30 } }}
                    className="flex flex-col gap-2 p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors"
                  >
                    <div className="flex justify-between items-center px-1">
                      <span className="font-syne font-bold text-[1.1rem] text-[#ede9ff]">{r.name}</span>
                      <span className="font-dm-mono font-bold text-[0.9rem] text-[#c4bdff]"><CountUp to={r.prob} decimals={1} />%</span>
                    </div>
                    <div className="w-full h-2 bg-[#080810] rounded-full overflow-hidden shadow-inner relative">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${r.prob}%` }}
                        transition={{ delay: 0.6 + (i * 0.1), duration: 1.5, type: "spring", bounce: 0.2 }}
                        className="absolute inset-y-0 left-0 bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-pink)] rounded-full"
                      />
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-8 flex justify-center">
                <motion.button 
                  onClick={() => setUiState("idle")} 
                  className="text-sm font-dm-mono text-[var(--color-muted)] hover:text-white transition-colors border-b border-white/20 hover:border-white pb-1"
                >
                  [ RESET CLASSIFIER ]
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageWrapper>
  );
}
