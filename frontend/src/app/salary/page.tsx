"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { useUIState } from "@/hooks/useUIState";
import { useAIOrchestrator } from "@/hooks/useAIOrchestrator";
import { AIThinking } from "@/components/ui/AIThinking";

function CountUp({ to, decimals = 0, suffix = "" }: { to: number; decimals?: number; suffix?: string }) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let startTime: number;
    const duration = 2500;
    const tick = (time: number) => {
      if (!startTime) startTime = time;
      const progress = Math.min((time - startTime) / duration, 1);
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setValue(ease * to);
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [to]);
  return <span>{value.toFixed(decimals)}{suffix}</span>;
}

function SalaryContent() {
  const { uiState, setUiState } = useUIState();
  const orchestrator = useAIOrchestrator();
  const searchParams = useSearchParams();
  const router = useRouter();
  const isDemo = searchParams.get("demo") === "true";

  const [role, setRole] = useState("");
  const [experience, setExperience] = useState(0);
  const [baseLpa, setBaseLpa] = useState(0);

  // Demo auto-play
  useEffect(() => {
    if (!isDemo) return;
    const t1 = setTimeout(() => { setRole("Data Scientist"); setUiState("input"); }, 1000);
    const t2 = setTimeout(() => { setExperience(2); setUiState("input"); }, 2000);
    const t3 = setTimeout(() => {
      setUiState("reasoning");
      setTimeout(() => setBaseLpa(14 + 2 * 1.5), 1500);
      orchestrator.startSequence("salary", () => setUiState("result"));
    }, 3000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDemo]);

  useEffect(() => {
    if (!isDemo || uiState !== "result") return;
    const t = setTimeout(() => router.push("/?demo=true"), 10000);
    return () => clearTimeout(t);
  }, [isDemo, uiState, router]);

  const handlePredict = () => {
    if (!role) return;
    setUiState("reasoning");
    setTimeout(() => {
      const base = role === "Data Scientist" ? 14 : role === "Software Engineer" ? 12 : 11;
      setBaseLpa(base + experience * 1.5);
    }, 1500);
    orchestrator.startSequence("salary", () => setUiState("result"));
  };

  const boosts = [
    { skill: "AWS Certification", val: 2.5, width: "80%" },
    { skill: "System Design", val: 1.8, width: "60%" },
    { skill: "Docker & K8s", val: 1.2, width: "40%" },
  ];

  return (
    <PageWrapper>
      <div className="flex flex-col gap-6 relative z-10">
        <AnimatePresence>
          {uiState === "reasoning" && (
            <AIThinking type="salary" stepText={orchestrator.currentStepText} progress={orchestrator.progress} />
          )}
        </AnimatePresence>

        <motion.div className={uiState === "reasoning" ? "opacity-30 blur-sm pointer-events-none transition-all duration-300" : ""}>
          <h1 className="font-syne text-[clamp(1.6rem,3vw,2.4rem)] font-extrabold tracking-tight">
            💰 Salary Predictor
          </h1>
          <p className="text-[0.9rem] text-[#7a789a] mt-1 font-light">
            RandomForest Regressor + Salary Boost Simulator
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {(uiState === "idle" || uiState === "input" || uiState === "reasoning") && (
            <motion.div
              key="input"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`flex flex-col gap-6 w-full max-w-2xl ${uiState === "reasoning" ? "opacity-40 blur-sm pointer-events-none" : ""}`}
            >
              <div className="glass-panel rounded-3xl p-8 relative overflow-hidden group hover:border-[rgba(124,110,247,0.3)] transition-all">
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-accent)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="font-dm-mono text-[0.68rem] tracking-widest uppercase text-[var(--color-accent)] mb-8 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[var(--color-accent)] animate-pulse" />
                  Target Role &amp; Experience
                </div>

                <div className="flex flex-col gap-8 relative z-10">
                  <div className="flex flex-col gap-3">
                    <label className="text-[0.85rem] text-[#ede9ff] font-bold tracking-wide">Select Target Role</label>
                    <select
                      value={role}
                      onChange={(e) => { setRole(e.target.value); setUiState("input"); }}
                      className="w-full bg-[#17172a] border border-white/5 rounded-xl text-white px-4 py-3.5 outline-none focus:border-[var(--color-accent)] cursor-pointer hover:bg-[#1a1a2e] transition-colors"
                    >
                      <option value="" disabled>Choose a target role…</option>
                      <option>Software Engineer</option>
                      <option>Data Scientist</option>
                      <option>Cloud Engineer</option>
                    </select>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <label className="text-[0.85rem] text-[#ede9ff] font-bold tracking-wide">Years of Experience</label>
                      <span className="font-dm-mono text-[0.85rem] text-[var(--color-accent)] bg-[rgba(124,110,247,0.15)] border border-[rgba(124,110,247,0.3)] px-3 py-1 rounded-lg font-bold">
                        {experience} YOE
                      </span>
                    </div>
                    <input
                      type="range" min="0" max="15" value={experience}
                      onChange={(e) => { setExperience(parseInt(e.target.value)); setUiState("input"); }}
                      className="w-full h-2 bg-[#17172a] rounded-lg appearance-none cursor-pointer accent-[var(--color-accent)]"
                    />
                  </div>
                </div>

                <div className="mt-10 flex justify-end relative z-10">
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2, boxShadow: "0 10px 30px rgba(124,110,247,0.4)" }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handlePredict}
                    disabled={!role}
                    className="px-8 py-3.5 bg-[var(--color-accent)] text-white font-syne font-bold rounded-xl shadow-[0_4px_18px_rgba(124,110,247,0.3)] disabled:opacity-50 disabled:cursor-not-allowed transition-all tracking-wide"
                  >
                    💰 Calculate Expected Package
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}

          {uiState === "result" && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="glass-panel-heavy border border-[var(--color-accent)]/30 shadow-[0_0_50px_rgba(124,110,247,0.15)] rounded-3xl p-8 max-w-2xl flex flex-col gap-8 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-[300px] h-[300px] rounded-full bg-gradient-to-br from-[var(--color-accent)]/20 to-[var(--color-pink)]/10 blur-[80px] -z-10 pointer-events-none" />

              <div className="text-center pb-8 border-b border-white/5 relative z-10">
                <div className="font-dm-mono text-[0.7rem] tracking-widest uppercase text-[var(--color-accent)] mb-4 flex justify-center items-center gap-2">
                  <span className="w-2 h-2 bg-[var(--color-accent)] rounded-full animate-pulse" />
                  Base Projection for {role} ({experience} YOE)
                </div>
                <div className="font-syne font-black text-[clamp(4rem,8vw,5rem)] tracking-tighter leading-none text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-[#c4bdff]">
                  <CountUp to={baseLpa} decimals={1} />
                  <span className="text-[1.5rem] tracking-widest opacity-80 ml-2 align-super font-bold text-[var(--color-accent)]">LPA</span>
                </div>
              </div>

              <div className="relative z-10">
                <div className="font-dm-mono text-[0.7rem] tracking-widest uppercase text-[var(--color-green)] mb-6">
                  // Recommended Salary Boosters
                </div>
                <div className="flex flex-col gap-4">
                  {boosts.map((b, i) => (
                    <motion.div
                      key={b.skill}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1 + i * 0.4, type: "spring" }}
                      className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition-colors"
                    >
                      <div className="font-dm-mono font-bold text-[0.9rem] flex-none w-[150px] truncate text-[#ede9ff]">{b.skill}</div>
                      <div className="font-syne font-black text-[1.1rem] text-[var(--color-green)] w-[90px] text-right">
                        +<CountUp to={b.val} decimals={1} /> L
                      </div>
                      <div className="flex-1 h-2 bg-[#080810] rounded-full overflow-hidden relative">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: b.width }}
                          transition={{ delay: 1.5 + i * 0.4, duration: 1.5, ease: "easeOut" }}
                          className="absolute inset-y-0 left-0 bg-gradient-to-r from-[var(--color-green)] to-[var(--color-blue)] rounded-full"
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <motion.button
                onClick={() => setUiState("idle")}
                className="mt-4 text-sm font-dm-mono text-[var(--color-muted)] hover:text-white border-b border-transparent hover:border-white transition-all pb-1 self-center relative z-10"
              >
                [ RECALCULATE ]
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageWrapper>
  );
}

export default function SalaryPredictor() {
  return (
    <Suspense fallback={null}>
      <SalaryContent />
    </Suspense>
  );
}
