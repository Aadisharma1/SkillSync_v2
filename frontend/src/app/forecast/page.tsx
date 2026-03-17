"use client";

import { motion, AnimatePresence } from "framer-motion";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { useUIState } from "@/hooks/useUIState";
import { useAIOrchestrator } from "@/hooks/useAIOrchestrator";
import { AIThinking } from "@/components/ui/AIThinking";

export default function SkillDemandForecast() {
  const { uiState, setUiState } = useUIState();
  const orchestrator = useAIOrchestrator();

  const handlePredict = () => {
    setUiState("reasoning");
    orchestrator.startSequence("forecast", () => {
      setUiState("result");
    });
  };

  const skills = [
    { name: "GenAI (LLMs)", change: "+ 14.2%", trend: "up", sparks: [10, 25, 40, 60, 80, 100] },
    { name: "Rust", change: "+ 8.5%", trend: "up", sparks: [10, 15, 30, 45, 65, 80] },
    { name: "Kubernetes", change: "+ 4.1%", trend: "up", sparks: [40, 45, 50, 60, 65, 75] },
    { name: "Angular", change: "- 2.8%", trend: "dn", sparks: [80, 70, 65, 50, 40, 30] },
  ];

  return (
    <PageWrapper>
      <div className="flex flex-col gap-6 relative">
        <AnimatePresence>
          {uiState === "reasoning" && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
              className="absolute inset-0 z-[60] flex items-center justify-center pointer-events-none"
            >
              <AIThinking type="forecast" stepText={orchestrator.currentStepText} progress={orchestrator.progress} />
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div className={uiState === "reasoning" ? "opacity-30 blur-sm pointer-events-none transition-all duration-300" : ""}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-syne text-[clamp(1.6rem,3vw,2.4rem)] font-extrabold tracking-tight">
                📈 Skill Demand Forecast
              </h1>
              <p className="text-[0.9rem] text-[#7a789a] mt-1 font-light flex items-center gap-2">
                Linear Regression temporal forecasting (6-Month Projection)
              </p>
            </div>
            
            {(uiState === "idle" || uiState === "input") && (
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(82,217,164,0.4)" }} 
                whileTap={{ scale: 0.95 }} 
                onClick={handlePredict}
                className="px-6 py-3 bg-[rgba(82,217,164,0.1)] border border-[rgba(82,217,164,0.3)] text-[var(--color-green)] font-syne font-bold rounded-xl transition-all"
              >
                Run Temporal Simulation
              </motion.button>
            )}
          </div>
        </motion.div>

        {uiState === "result" && (
           <motion.div 
             initial={{ opacity: 0 }} animate={{ opacity: 1 }}
             className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4"
           >
             {skills.map((s, i) => (
                <motion.div
                  key={s.name}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, type: "spring" }}
                  whileHover={{ borderColor: "var(--color-border2)" }}
                  className="bg-[var(--color-bg)] border border-[var(--color-border)] rounded-2xl p-5 transition-colors"
                >
                   <div className="font-syne font-bold text-[0.95rem] mb-1">{s.name}</div>
                   <div className={`font-dm-mono text-[1.1rem] font-medium mb-4 ${s.trend === "up" ? "text-[var(--color-green)]" : "text-[var(--color-red)]"}`}>
                     {s.change}
                   </div>
                   
                   {/* Mini Sparkline Simulation */}
                   <div className="flex items-end gap-1 h-10 w-full overflow-hidden">
                      {s.sparks.map((val, idx) => (
                         <motion.div 
                           key={idx}
                           initial={{ height: 0 }}
                           animate={{ height: `${val}%` }}
                           transition={{ delay: 0.5 + (i * 0.1) + (idx * 0.05), ease: "easeOut" }}
                           className={`w-full rounded-t-sm ${s.trend === "up" ? "bg-[var(--color-green)]" : "bg-[var(--color-red)]"} opacity-${20 + (idx*10)}`}
                         />
                      ))}
                   </div>
                </motion.div>
             ))}
           </motion.div>
        )}
      </div>
    </PageWrapper>
  );
}
