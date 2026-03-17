"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { useUIState } from "@/hooks/useUIState";
import { useAIOrchestrator } from "@/hooks/useAIOrchestrator";
import { AIThinking } from "@/components/ui/AIThinking";
import { Users, TrendingUp, Award, ArrowUpRight, ArrowDownRight } from "lucide-react";

// KDE Curve Component (pure SVG simulation)
function KDECurve({ data, color }: { data: number[]; color: string }) {
  const w = 320, h = 120;
  const max = Math.max(...data);
  const points = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - (v / max) * (h - 10)}`).join(" ");
  const area = `0,${h} ${points} ${w},${h}`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-full overflow-visible">
      <defs>
        <linearGradient id={`fill-${color.replace("#","")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <polygon points={area} fill={`url(#fill-${color.replace("#","")})`} />
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
        style={{ filter: `drop-shadow(0 0 6px ${color})` }}
      />
    </svg>
  );
}

// Normal Distribution generator
function generateKDE(mean: number, std: number, n = 60): number[] {
  return Array.from({ length: n }, (_, i) => {
    const x = (i / n) * 120 - 20;
    return Math.exp(-0.5 * Math.pow((x - mean) / std, 2));
  });
}

const ROLES = [
  { name: "Software Engineer", mean: 55, cohortSize: 4820, yourPercentile: 78, avgSalary: 14.2, topSalary: 38 },
  { name: "Data Scientist", mean: 58, cohortSize: 2340, yourPercentile: 82, avgSalary: 16.8, topSalary: 42 },
  { name: "Cloud Engineer", mean: 52, cohortSize: 1890, yourPercentile: 65, avgSalary: 13.5, topSalary: 35 },
];

export default function CohortBenchmark() {
  const { uiState, setUiState } = useUIState();
  const orchestrator = useAIOrchestrator();

  const [selectedRole, setSelectedRole] = useState("");
  const [yourScore] = useState(72);
  const [result, setResult] = useState<typeof ROLES[0] | null>(null);

  const handleBenchmark = () => {
    if (!selectedRole) return;
    setUiState("reasoning");
    orchestrator.startSequence("skill-gap", () => {
      setResult(ROLES.find(r => r.name === selectedRole) || ROLES[0]);
      setUiState("result");
    });
  };

  const kde = result ? generateKDE(result.mean, 15) : [];
  const userKde = result ? generateKDE(result.yourPercentile * 0.72, 8) : [];

  return (
    <PageWrapper>
      <div className="max-w-5xl">
        <AnimatePresence>
          {uiState === "reasoning" && (
            <AIThinking type="skill-gap" stepText={orchestrator.currentStepText} progress={orchestrator.progress} />
          )}
        </AnimatePresence>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={uiState === "reasoning" ? "opacity-30 blur-sm" : ""}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-[rgba(82,217,164,0.15)] border border-[rgba(82,217,164,0.3)] flex items-center justify-center">
              <Users size={20} className="text-[var(--color-green)]" />
            </div>
            <div>
              <h1 className="font-syne text-[1.8rem] font-black tracking-tight">
                Cohort <span className="text-gradient-green">Benchmark</span>
              </h1>
              <p className="font-dm-mono text-[0.72rem] text-[#7a789a] tracking-widest uppercase">
                Kernel Density Estimation · Percentile Analysis
              </p>
            </div>
          </div>
        </motion.div>

        <div className={`mt-8 ${uiState === "reasoning" ? "opacity-30 blur-sm pointer-events-none" : ""}`}>
          <AnimatePresence mode="wait">
            {uiState !== "result" ? (
              <motion.div
                key="input"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                className="glass-panel rounded-3xl p-8 max-w-2xl"
              >
                <p className="font-dm-mono text-[0.7rem] tracking-widest uppercase text-[var(--color-green)] mb-6 flex items-center gap-2">
                  <span className="w-2 h-2 bg-[var(--color-green)] rounded-full animate-pulse" />
                  Select Reference Cohort
                </p>

                <div className="space-y-3 mb-8">
                  {ROLES.map((role) => (
                    <motion.button
                      key={role.name}
                      whileHover={{ scale: 1.01, x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedRole(role.name)}
                      className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all text-left ${
                        selectedRole === role.name
                          ? "border-[var(--color-green)] bg-[rgba(82,217,164,0.08)] shadow-[0_0_20px_rgba(82,217,164,0.1)]"
                          : "border-white/5 hover:border-white/10 bg-white/2"
                      }`}
                    >
                      <div>
                        <div className="font-syne font-bold text-white text-[0.95rem]">{role.name}</div>
                        <div className="font-dm-mono text-[0.7rem] text-[#7a789a] mt-0.5">{role.cohortSize.toLocaleString()} engineers benchmarked</div>
                      </div>
                      <div className="text-right">
                        <div className="font-syne font-black text-[1.1rem] text-[var(--color-green)]">₹{role.avgSalary}L</div>
                        <div className="font-dm-mono text-[0.65rem] text-[#7a789a]">avg salary</div>
                      </div>
                    </motion.button>
                  ))}
                </div>

                <motion.button
                  whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(82,217,164,0.3)" }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleBenchmark}
                  disabled={!selectedRole}
                  className="w-full py-4 rounded-2xl font-syne font-bold text-black disabled:opacity-40 disabled:cursor-not-allowed tracking-wide"
                  style={{ background: "linear-gradient(135deg, #52d9a4, #52b8d9)" }}
                >
                  Run KDE Analysis
                </motion.button>
              </motion.div>
            ) : (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Top Stats */}
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: "Your Percentile", value: `${result!.yourPercentile}th`, sub: "vs cohort", color: "var(--color-green)", up: true },
                    { label: "Cohort Size", value: result!.cohortSize.toLocaleString(), sub: "engineers", color: "var(--color-accent)", up: null },
                    { label: "Top 10% Salary", value: `₹${result!.topSalary}L`, sub: "per annum", color: "var(--color-yellow)", up: true },
                  ].map((stat, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.15 }}
                      className="glass-panel rounded-2xl p-5"
                    >
                      <div className="font-dm-mono text-[0.65rem] uppercase tracking-widest mb-3" style={{ color: stat.color }}>
                        {stat.label}
                      </div>
                      <div className="font-syne font-black text-[2rem] leading-none mb-1" style={{ color: stat.color }}>
                        {stat.value}
                      </div>
                      <div className="flex items-center gap-1 font-dm-mono text-[0.7rem] text-[#7a789a]">
                        {stat.up !== null && (stat.up
                          ? <ArrowUpRight size={12} className="text-[var(--color-green)]" />
                          : <ArrowDownRight size={12} className="text-[var(--color-red)]" />
                        )}
                        {stat.sub}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* KDE Visualization */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                  className="glass-panel rounded-3xl p-8"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="font-syne font-bold text-white text-lg">Salary Distribution</h3>
                      <p className="font-dm-mono text-[0.7rem] text-[#7a789a] mt-1">KDE density estimation of {result!.name} cohort</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-0.5 bg-[var(--color-accent)]" style={{ boxShadow: "0 0 6px var(--color-accent)" }} />
                        <span className="font-dm-mono text-[0.65rem] text-[#7a789a]">Cohort</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-0.5 bg-[var(--color-green)]" style={{ boxShadow: "0 0 6px var(--color-green)" }} />
                        <span className="font-dm-mono text-[0.65rem] text-[#7a789a]">Your Profile</span>
                      </div>
                    </div>
                  </div>

                  <div className="relative h-36">
                    <div className="absolute inset-0 opacity-60">
                      <KDECurve data={kde} color="#7c6ef7" />
                    </div>
                    <div className="absolute inset-0">
                      <KDECurve data={userKde} color="#52d9a4" />
                    </div>
                    {/* X axis ticks */}
                    <div className="absolute bottom-0 left-0 right-0 flex justify-between font-dm-mono text-[0.6rem] text-[#55536e] pt-2 border-t border-white/5">
                      {["₹5L", "₹15L", "₹25L", "₹35L", "₹45L+"].map(l => <span key={l}>{l}</span>)}
                    </div>
                  </div>
                </motion.div>

                {/* Percentile Tracker */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
                  className="glass-panel rounded-3xl p-8"
                >
                  <h3 className="font-syne font-bold text-white text-lg mb-6">Where You Stand</h3>
                  <div className="relative h-8 bg-[rgba(255,255,255,0.04)] rounded-full overflow-hidden mb-3">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${result!.yourPercentile}%` }}
                      transition={{ duration: 1.5, ease: "easeOut", delay: 0.8 }}
                      className="h-full rounded-full"
                      style={{ background: "linear-gradient(90deg, #52d9a4, #52b8d9)", boxShadow: "0 0 20px rgba(82,217,164,0.4)" }}
                    />
                    <div className="absolute inset-0 flex items-center px-4 font-syne font-bold text-black text-[0.85rem]">
                      {result!.yourPercentile}th percentile
                    </div>
                  </div>
                  <div className="flex justify-between font-dm-mono text-[0.65rem] text-[#55536e]">
                    <span>Bottom 10%</span>
                    <span>Median</span>
                    <span>Top 10%</span>
                  </div>
                </motion.div>

                <motion.button
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
                  onClick={() => setUiState("idle")}
                  className="font-dm-mono text-[0.78rem] text-[#7a789a] hover:text-white transition-colors border-b border-transparent hover:border-white pb-0.5"
                >
                  [ RUN NEW BENCHMARK ]
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </PageWrapper>
  );
}
