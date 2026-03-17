"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { useUIState } from "@/hooks/useUIState";
import { useAIOrchestrator } from "@/hooks/useAIOrchestrator";
import { AIThinking } from "@/components/ui/AIThinking";
import { CheckCircle2, ChevronRight, XCircle } from "lucide-react";

function SkillGapContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const isDemo = searchParams.get("demo") === "true";

  const { uiState, setUiState } = useUIState();
  const orchestrator = useAIOrchestrator();

  const [role, setRole] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [missingSkills, setMissingSkills] = useState<string[]>([]);

  // Auto-play demo sequence
  useEffect(() => {
    if (!isDemo) return;
    
    // Simulate user selection
    const t1 = setTimeout(() => { setRole("Software Engineer"); setUiState("input"); }, 1500);
    const t2 = setTimeout(() => setSelectedSkills(["Python"]), 2500);
    const t3 = setTimeout(() => setSelectedSkills(["Python", "React"]), 3000);
    const t4 = setTimeout(() => setSelectedSkills(["Python", "React", "SQL"]), 3500);
    const t5 = setTimeout(() => handleAnalyze(), 4500);

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); clearTimeout(t5); };
  }, [isDemo]);

  // Navigate to salary predictor after result finishes
  useEffect(() => {
    if (!isDemo || uiState !== "result") return;
    const tEnd = setTimeout(() => router.push("/salary?demo=true"), 14000);
    return () => clearTimeout(tEnd);
  }, [isDemo, uiState, router]);

  const allSkills = [
    "Python", "Java", "C++", "JavaScript", "React", "Next.js", "Node.js", 
    "Django", "SQL", "MongoDB", "AWS", "Azure", "Docker", "Kubernetes", 
    "TensorFlow", "PyTorch", "Git", "Cypress"
  ];

  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(s => s.filter(x => x !== skill));
    } else {
      setSelectedSkills(s => [...s, skill]);
    }
  };

  const handleAnalyze = () => {
    if (!role || selectedSkills.length === 0) return;
    
    setUiState("reasoning");
    
    // Simulate API logic determining missing skills for output
    const mockMissing = ["Kubernetes", "Docker", "AWS", "TensorFlow"].filter(s => !selectedSkills.includes(s));
    
    orchestrator.startSequence("skill-gap", () => {
      setMissingSkills(mockMissing);
      setUiState("result");
    });
  };

  const reset = () => {
    setUiState("idle");
    setRole("");
    setSelectedSkills([]);
    setMissingSkills([]);
  };

  return (
    <div className="flex flex-col gap-6 relative">
      {/* Absolute Centered Orchestrator Overlay */}
      <AnimatePresence>
        {uiState === "reasoning" && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="absolute inset-0 z-[60] flex items-center justify-center pointer-events-none"
          >
            <AIThinking type={orchestrator.currentType!} stepText={orchestrator.currentStepText} progress={orchestrator.progress} />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className={uiState === "reasoning" ? "opacity-30 blur-sm pointer-events-none transition-all duration-300" : ""}>
        <h1 className="font-syne text-[clamp(1.6rem,3vw,2.4rem)] font-extrabold tracking-tight">
          🔍 Skill Gap Analyzer
        </h1>
        <p className="text-[0.9rem] text-[#7a789a] mt-1 font-light flex items-center gap-2">
          MultiOutput RandomForest trained on 5,000 samples 
        </p>
      </motion.div>

      {/* INPUT STAGE */}
      <AnimatePresence mode="wait">
        {(uiState === "idle" || uiState === "input" || uiState === "reasoning") && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`flex flex-col gap-6 w-full ${uiState === "reasoning" ? "opacity-40 blur-sm pointer-events-none transition-all duration-500" : ""}`}
          >
            <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-6">
              <div className="font-dm-mono text-[0.68rem] tracking-widest uppercase text-[var(--color-accent)] mb-4">
                // Target Role
              </div>
              <div className="flex flex-col gap-2 max-w-sm">
                <label className="text-[0.78rem] text-[var(--color-muted)] font-medium">Select the role you want to achieve</label>
                <select 
                  value={role} 
                  onChange={(e) => { setRole(e.target.value); setUiState("input"); }}
                  className="w-full bg-[#080810] border border-[#252535] rounded-xl text-white px-4 py-3 outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[rgba(124,110,247,0.2)] transition-all font-dm-sans cursor-pointer hover:border-[#55536e]"
                >
                  <option value="" disabled>Choose a target role…</option>
                  <option>Data Scientist</option>
                  <option>Software Engineer</option>
                  <option>Cloud/DevOps Engineer</option>
                  <option>ML Engineer</option>
                </select>
              </div>
            </div>

            {role && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }} 
                animate={{ opacity: 1, height: "auto" }}
                className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-6"
              >
                <div className="font-dm-mono text-[0.68rem] tracking-widest uppercase text-[var(--color-accent)] mb-4">
                  // Your Current Skills
                </div>
                <div className="flex flex-wrap gap-2">
                  {allSkills.map(skill => {
                    const isSelected = selectedSkills.includes(skill);
                    return (
                      <motion.button
                        key={skill}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => toggleSkill(skill)}
                        className={`px-4 py-2 rounded-lg text-[0.85rem] font-dm-mono transition-colors border ${
                          isSelected 
                            ? "bg-[rgba(82,217,164,0.1)] border-[rgba(82,217,164,0.4)] text-[var(--color-green)] shadow-[0_0_15px_rgba(82,217,164,0.15)]" 
                            : "bg-[var(--color-surface)] border-[var(--color-border)] text-[var(--color-muted)] hover:border-[var(--color-accent)] hover:text-white"
                        }`}
                      >
                        {skill}
                      </motion.button>
                    );
                  })}
                </div>
                
                <div className="mt-8 flex justify-end">
                  <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleAnalyze}
                    disabled={selectedSkills.length === 0}
                    className="px-6 py-3 bg-[var(--color-accent)] hover:bg-[#9183ff] text-white font-syne font-bold rounded-xl shadow-[0_4px_18px_rgba(124,110,247,0.3)] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    🔍 Analyze My Skill Gaps
                  </motion.button>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
        
        {/* RESULT STAGE */}
        {uiState === "result" && (
          <SkillGraphResult role={role} selectedSkills={selectedSkills} missingSkills={missingSkills} reset={reset} />
        )}
      </AnimatePresence>
    </div>
  );
}

// ----------------------------------------------------------------------
// FLAGSHIP: LIVE SKILL GRAPH SYSTEM & PROGRESSIVE REVEAL
// ----------------------------------------------------------------------

function SkillGraphResult({ role, selectedSkills, missingSkills, reset }: { role: string, selectedSkills: string[], missingSkills: string[], reset: () => void }) {
  const [revealStage, setRevealStage] = useState(0);

  useEffect(() => {
    // Progressive Reveal Orchestrator
    const t1 = setTimeout(() => setRevealStage(1), 500);  // Early insight
    const t2 = setTimeout(() => setRevealStage(2), 2500); // Mid insight
    const t3 = setTimeout(() => setRevealStage(3), 4500); // Final structured result
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full flex flex-col gap-6 relative z-10"
    >
      <motion.div className="glass-panel-heavy rounded-3xl p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-accent)]/5 to-[var(--color-pink)]/5 pointer-events-none" />
        
        {/* Cinematic Header with Progressive Reveal */}
        <div className="h-20 mb-6 flex items-end">
          <AnimatePresence mode="wait">
            {revealStage === 0 && (
              <motion.h3 key="0" initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-10}} className="text-xl font-syne text-[var(--color-accent)] animate-pulse">
                Synthesizing multi-dimensional skill matrix...
              </motion.h3>
            )}
            {revealStage === 1 && (
              <motion.h3 key="1" initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-10}} className="text-2xl font-syne text-[var(--color-green)] drop-shadow-[0_0_15px_rgba(82,217,164,0.5)]">
                Strong foundational knowledge detected in {selectedSkills[0] || "core specs"}.
              </motion.h3>
            )}
            {revealStage === 2 && (
              <motion.h3 key="2" initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-10}} className="text-2xl font-syne text-[var(--color-pink)] drop-shadow-[0_0_15px_rgba(240,122,255,0.5)]">
                Identifying critical capability gaps for {role}...
              </motion.h3>
            )}
            {revealStage === 3 && (
              <motion.h2 key="3" initial={{opacity:0, filter:"blur(8px)", scale:0.95}} animate={{opacity:1, filter:"blur(0px)", scale:1}} transition={{duration: 0.8}} className="font-syne text-[clamp(2rem,4vw,3rem)] font-bold relative z-10 leading-none">
                Roadmap to <span className="text-gradient drop-shadow-lg">{role}</span>
              </motion.h2>
            )}
          </AnimatePresence>
        </div>

        {/* Live Skill Graph System */}
        <div className="relative w-full h-[400px] sm:h-[500px] border border-white/5 rounded-2xl bg-[#080810]/80 overflow-hidden mb-12 flex items-center justify-center shadow-inner">
           <div className="absolute inset-0 mesh-bg opacity-30 pointer-events-none" />
           <LiveSkillGraph selectedSkills={selectedSkills} missingSkills={missingSkills} stage={revealStage} />
        </div>

        <AnimatePresence>
          {revealStage === 3 && (
            <motion.div 
              initial={{opacity: 0, y: 30}} 
              animate={{opacity:1, y:0}} 
              transition={{duration: 0.6, staggerChildren: 0.2}}
              className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10"
            >
              <div>
                <h3 className="text-sm font-dm-mono text-[#c4bdff] mb-4 flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-[var(--color-green)]" />
                  Verified Competencies
                </h3>
                <div className="flex flex-wrap gap-2">
                    {selectedSkills.map((sk, i) => (
                      <motion.div 
                        key={sk} 
                        initial={{ opacity: 0, scale: 0.8 }} 
                        animate={{ opacity: 1, scale: 1 }} 
                        transition={{ delay: i * 0.05 }}
                        className="px-3 py-1.5 rounded-lg bg-[rgba(82,217,164,0.1)] border border-[rgba(82,217,164,0.3)] text-[var(--color-green)] font-dm-mono text-xs shadow-[0_0_10px_rgba(82,217,164,0.1)]"
                      >
                        {sk}
                      </motion.div>
                    ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-dm-mono text-[#c4bdff] mb-4 flex items-center gap-2">
                  <XCircle size={16} className="text-[var(--color-pink)] pulse" />
                  Critical Gaps Identified
                </h3>
                <div className="flex flex-col gap-3">
                    {missingSkills.length > 0 ? missingSkills.map((sk, i) => (
                      <motion.div 
                        key={sk} 
                        initial={{ opacity: 0, x: 20 }} 
                        animate={{ opacity: 1, x: 0 }} 
                        whileHover={{ scale: 1.02, x: 10, cursor: "pointer", backgroundColor: "rgba(240,122,255,0.1)" }}
                        transition={{ delay: i * 0.1, type: "spring" }}
                        className="flex items-center justify-between p-3 rounded-xl bg-[rgba(240,122,255,0.05)] border border-[rgba(240,122,255,0.2)] transition-colors"
                      >
                        <span className="font-dm-mono text-[0.85rem] text-[var(--color-pink)] drop-shadow-[0_0_8px_rgba(240,122,255,0.5)] font-bold">{sk}</span>
                        <ChevronRight size={16} className="text-[var(--color-pink)] opacity-50" />
                      </motion.div>
                    )) : (
                      <div className="text-sm text-[var(--color-green)] shadow-[0_0_15px_rgba(82,217,164,0.5)] p-4 rounded-xl border border-green-500/30 bg-green-500/10">You have all required core skills for this role!</div>
                    )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {revealStage === 3 && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              onClick={reset}
              className="mt-12 px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-sm font-dm-mono tracking-wider text-[#c4bdff] hover:text-white hover:bg-white/10 transition-all hover:shadow-[0_0_20px_rgba(124,110,247,0.3)] hover:scale-105 active:scale-95 flex mx-auto"
            >
              [ RE-INITIALIZE SCAN ]
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

function LiveSkillGraph({ selectedSkills, missingSkills, stage }: { selectedSkills: string[], missingSkills: string[], stage: number }) {
  const allNodes = [
    ...selectedSkills.map(s => ({name: s, type: 'has'})), 
    ...missingSkills.map(s => ({name: s, type: 'missing'}))
  ];
  
  const radius = 160;
  const centerX = 300; 
  const centerY = 250;

  return (
     <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
       <svg viewBox="0 0 600 500" className="w-full h-full max-w-[800px] absolute drop-shadow-[0_0_20px_rgba(124,110,247,0.2)]">
          
          {/* Edges from Center */}
          {allNodes.map((node, i) => {
             const angle = (i / allNodes.length) * Math.PI * 2;
             const targetX = centerX + Math.cos(angle) * radius;
             const targetY = centerY + Math.sin(angle) * radius;
             const isMissing = node.type === 'missing';
             
             return (
               <motion.line key={`line-${i}`} x1={centerX} y1={centerY} x2={targetX} y2={targetY} 
                  stroke={isMissing ? "rgba(240,122,255,0.4)" : "rgba(82,217,164,0.4)"} 
                  strokeWidth={isMissing ? "3" : "2"}
                  strokeDasharray={isMissing ? "5 5" : "none"}
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: stage >= (isMissing ? 2 : 1) ? 1 : 0, opacity: stage >= (isMissing ? 2 : 1) ? 0.8 : 0 }}
                  transition={{ duration: 1.2, delay: i * 0.08, ease: "easeOut" }}
               />
             )
          })}

          {/* Center Target Node */}
          <motion.g initial={{ scale: 0, opacity: 0 }} animate={{ scale: stage >= 1 ? 1 : 0, opacity: stage >= 1 ? 1 : 0 }} transition={{ type: "spring", stiffness: 200, damping: 20 }}>
            <circle cx={centerX} cy={centerY} r="35" fill="rgba(124,110,247,0.2)" stroke="#7c6ef7" strokeWidth="2" className="drop-shadow-[0_0_15px_#7c6ef7]" />
            <circle cx={centerX} cy={centerY} r="45" fill="none" stroke="#7c6ef7" strokeWidth="1" className="animate-pulse-ring" style={{transformOrigin: `${centerX}px ${centerY}px`}} />
            <text x={centerX} y={centerY} textAnchor="middle" dy=".3em" fill="#ede9ff" className="font-syne font-bold text-sm tracking-widest">TARGET</text>
          </motion.g>

          {/* Child Nodes */}
          {allNodes.map((node, i) => {
             const angle = (i / allNodes.length) * Math.PI * 2;
             const targetX = centerX + Math.cos(angle) * radius;
             const targetY = centerY + Math.sin(angle) * radius;
             
             const isMissing = node.type === 'missing';
             const color = isMissing ? "#f07aff" : "#52d9a4";
             
             return (
               <motion.g key={`node-${i}`}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: stage >= (isMissing ? 2 : 1) ? 1 : 0, scale: stage >= (isMissing ? 2 : 1) ? 1 : 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.5 + (i * 0.1) }}
                  className="animate-float"
                  style={{ animationDelay: `${i * -0.5}s` }} // offset float phase
               >
                  <circle cx={targetX} cy={targetY} r="22" fill={isMissing ? "rgba(240,122,255,0.15)" : "rgba(82,217,164,0.15)"} stroke={color} strokeWidth="2" 
                      style={isMissing ? { filter: "drop-shadow(0 0 15px #f07aff)" } : { filter: "drop-shadow(0 0 8px #52d9a4)" }}
                  />
                  {isMissing && (
                    <circle cx={targetX} cy={targetY} r="30" fill="none" stroke={color} strokeWidth="2" strokeDasharray="3 3" className="animate-spin-slow" style={{transformOrigin: `${targetX}px ${targetY}px`}} />
                  )}
                  <text x={targetX} y={targetY + 40} textAnchor="middle" fill="#ede9ff" className="font-dm-mono text-[12px] font-bold drop-shadow-md tracking-wider">
                    {node.name.toUpperCase()}
                  </text>
               </motion.g>
             )
          })}
       </svg>
     </div>
  );
}

export default function SkillGapAnalyzer() {
  return (
    <PageWrapper>
      <Suspense fallback={null}>
        <SkillGapContent />
      </Suspense>
    </PageWrapper>
  );
}


