"use client";

import { motion, AnimatePresence } from "framer-motion";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { useUIState } from "@/hooks/useUIState";
import { useAIOrchestrator } from "@/hooks/useAIOrchestrator";
import { AIThinking } from "@/components/ui/AIThinking";
import { UploadCloud, FileText, CheckCircle2 } from "lucide-react";
import { useState } from "react";

export default function ResumeParser() {
  const { uiState, setUiState } = useUIState();
  const orchestrator = useAIOrchestrator();
  const [isDragging, setIsDragging] = useState(false);

  const handleUpload = () => {
    setUiState("reasoning");
    setIsDragging(false);
    orchestrator.startSequence("resume", () => {
      setUiState("result");
    });
  };

  const extractedData = {
    name: "Aadi Sharma",
    email: "aadi@example.com",
    skills: ["Python", "Machine Learning", "React", "Next.js", "Docker", "PostgreSQL"],
    education: "B.Tech Computer Science, SRM Institute",
    experience: "3 Internships, 4 Major Projects",
  };

  return (
    <PageWrapper>
      <div className="flex flex-col gap-6 relative z-10 w-full max-w-4xl mx-auto">
        <AnimatePresence>
          {uiState === "reasoning" && (
            <AIThinking type="resume" stepText={orchestrator.currentStepText} progress={orchestrator.progress} />
          )}
        </AnimatePresence>

        <motion.div className={uiState === "reasoning" ? "opacity-30 blur-sm pointer-events-none transition-all duration-300" : ""}>
          <h1 className="font-syne text-[clamp(1.6rem,3vw,2.4rem)] font-extrabold tracking-tight pb-2">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-yellow)] to-white">
              Semantic Parser
            </span>
          </h1>
          <p className="text-[0.9rem] text-[#c4bdff] tracking-wide font-medium">
            AI-powered entity extraction & vector mapping
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {(uiState === "idle" || uiState === "input" || uiState === "reasoning") && (
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
              className={`w-full ${uiState === "reasoning" ? "opacity-40 blur-sm pointer-events-none transition-all duration-500" : ""}`}
            >
              <div 
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => { e.preventDefault(); handleUpload(); }}
                className={`glass-panel border-2 border-dashed rounded-3xl p-16 flex flex-col items-center justify-center text-center transition-all duration-500 cursor-pointer relative overflow-hidden group ${
                  isDragging 
                    ? "border-[var(--color-yellow)] bg-[rgba(247,200,110,0.1)] shadow-[0_0_50px_rgba(247,200,110,0.2)] scale-[1.02]" 
                    : "border-white/20 hover:border-[var(--color-yellow)] hover:bg-[rgba(247,200,110,0.05)] shadow-[0_10px_30px_rgba(0,0,0,0.3)] hover:shadow-[0_15px_40px_rgba(247,200,110,0.1)]"
                }`}
                onClick={handleUpload}
              >
                {/* Background radar sweep effect on drag */}
                {isDragging && (
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                    <div className="w-[800px] h-[800px] bg-[conic-gradient(from_0deg_at_50%_50%,rgba(247,200,110,0)_0%,rgba(247,200,110,0.1)_50%,rgba(247,200,110,0)_100%)] animate-[spin_4s_linear_infinite]" />
                  </div>
                )}
                
                <motion.div
                  animate={{ y: isDragging ? -15 : 0, scale: isDragging ? 1.1 : 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="relative z-10"
                >
                  <UploadCloud className={`w-16 h-16 mb-6 transition-colors duration-300 ${isDragging ? "text-[var(--color-yellow)] drop-shadow-[0_0_15px_rgba(247,200,110,0.8)]" : "text-[#7a789a]"}`} />
                </motion.div>
                
                <div className="font-syne font-black text-2xl mb-3 text-white tracking-wide relative z-10">
                  {isDragging ? "Drop to initialize ingest..." : "Drag and drop source document"}
                </div>
                
                <div className="font-dm-mono text-sm text-[#7a789a] tracking-widest uppercase relative z-10">
                  Supported formats: PDF, DOCX (Max 5MB)
                </div>
                
                <div className="mt-8 px-6 py-3 bg-white/5 border border-white/10 text-[#c4bdff] font-dm-mono tracking-wider rounded-xl text-sm transition-all group-hover:bg-[var(--color-yellow)] group-hover:text-black group-hover:border-[var(--color-yellow)] font-bold relative z-10">
                  [ BROWSE LOCAL FILES ]
                </div>
              </div>
            </motion.div>
          )}

          {uiState === "result" && (
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }}
              className="glass-panel-heavy border border-[var(--color-yellow)]/30 shadow-[0_0_50px_rgba(247,200,110,0.15)] rounded-3xl p-10 max-w-3xl flex flex-col gap-8 relative overflow-hidden"
            >
               {/* Scanning Beam Effect */}
               <motion.div 
                 initial={{ y: "-100%" }}
                 animate={{ y: "200%" }}
                 transition={{ duration: 3, ease: "linear", repeat: Infinity, repeatDelay: 1 }}
                 className="absolute inset-x-0 h-32 bg-gradient-to-b from-transparent via-[var(--color-yellow)]/10 to-transparent pointer-events-none -z-0"
               />

               <div className="flex items-center gap-6 border-b border-white/10 pb-8 relative z-10">
                 <motion.div 
                   initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
                   className="w-16 h-16 rounded-[20px] bg-[rgba(247,200,110,0.15)] border border-[rgba(247,200,110,0.4)] flex items-center justify-center text-[var(--color-yellow)] shadow-[0_0_20px_rgba(247,200,110,0.2)]"
                 >
                   <FileText size={32} />
                 </motion.div>
                 <div>
                   <h2 className="font-syne text-[2rem] font-bold text-white tracking-tight leading-none mb-2">Extraction Complete</h2>
                   <div className="font-dm-mono text-[0.85rem] text-[var(--color-green)] flex items-center gap-2 font-bold bg-[rgba(82,217,164,0.1)] w-fit px-3 py-1 rounded">
                     <CheckCircle2 size={14} /> Knowledge Graph Updated
                   </div>
                 </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 relative z-10">
                  {Object.entries(extractedData).map(([key, val], idx) => (
                    <motion.div 
                      key={key} 
                      initial={{ opacity: 0, x: -25 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 + (idx * 0.15), type: "spring", bounce: 0.3 }}
                      className={`${key === "skills" ? "md:col-span-2" : ""} bg-white/5 border border-white/10 p-5 rounded-2xl hover:bg-white/10 transition-colors duration-300`}
                    >
                      <div className="font-dm-mono text-[0.75rem] tracking-[0.2em] uppercase text-[var(--color-yellow)] mb-3 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-[var(--color-yellow)] rounded-full animate-pulse" />
                        {key}
                      </div>
                      
                      {Array.isArray(val) ? (
                        <div className="flex flex-wrap gap-2 pt-1">
                          {val.map((s, i) => (
                            <motion.span 
                              key={s} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.2 + (i * 0.1), type: "spring", bounce: 0.5 }}
                              className="px-4 py-1.5 bg-[rgba(247,200,110,0.1)] border border-[rgba(247,200,110,0.3)] rounded-lg text-sm font-dm-mono text-[#ede9ff] shadow-[0_0_10px_rgba(247,200,110,0.1)]"
                            >
                              {s}
                            </motion.span>
                          ))}
                        </div>
                      ) : (
                        <div className="font-syne font-bold text-[1.1rem] text-white tracking-wide">
                          {val}
                        </div>
                      )}
                    </motion.div>
                  ))}
               </div>

               <div className="mt-6 flex justify-center relative z-10">
                 <motion.button 
                   initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.5 }}
                   onClick={() => setUiState("idle")} 
                   className="text-[0.85rem] font-dm-mono text-[#7a789a] hover:text-[var(--color-yellow)] border-b border-transparent hover:border-[var(--color-yellow)] transition-all pb-1 tracking-widest uppercase"
                 >
                   [ RUN NEW EXTRACTION ]
                 </motion.button>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageWrapper>
  );
}
