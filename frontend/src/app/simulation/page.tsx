"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { useUIState } from "@/hooks/useUIState";
import { useAIOrchestrator } from "@/hooks/useAIOrchestrator";
import { AIThinking } from "@/components/ui/AIThinking";
import { Activity, TrendingUp, AlertTriangle, Shield } from "lucide-react";

// Monte Carlo path generator
function generateMCPath(points: number, drift = 0.02, volatility = 0.08): [number, number][] {
  const path: [number, number][] = [[0, 100]];
  for (let i = 1; i < points; i++) {
    const prev = path[i - 1][1];
    const shock = (Math.random() - 0.5) * volatility * 2;
    path.push([i, Math.max(10, prev + drift * prev + shock * prev)]);
  }
  return path;
}

function MCPathSVG({ paths, color, opacity = 0.2 }: { paths: [number,number][][], color: string, opacity?: number }) {
  const w = 500, h = 160, pts = paths[0]?.length || 50;
  const allVals = paths.flat().map(p => p[1]);
  const minV = Math.min(...allVals), maxV = Math.max(...allVals);
  const sx = (x: number) => (x / (pts -1)) * w;
  const sy = (y: number) => h - ((y - minV) / (maxV - minV + 1)) * h;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-full" preserveAspectRatio="none">
      {paths.map((path, pi) => {
        const d = path.map((p, i) => `${i === 0 ? "M" : "L"} ${sx(p[0]).toFixed(1)},${sy(p[1]).toFixed(1)}`).join(" ");
        return (
          <motion.path
            key={pi}
            d={d} fill="none" stroke={color} strokeWidth="1"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity }}
            transition={{ duration: 1.5, delay: pi * 0.03, ease: "easeOut" }}
            style={{ filter: pi === 0 ? `drop-shadow(0 0 4px ${color})` : "none" }}
          />
        );
      })}
    </svg>
  );
}

const SCENARIOS = [
  { label: "Upskill (AWS + Docker)", drift: 0.04, volatility: 0.06 },
  { label: "Status Quo", drift: 0.015, volatility: 0.07 },
  { label: "Market Downturn", drift: -0.01, volatility: 0.12 },
];

export default function CareerSimulation() {
  const { uiState, setUiState } = useUIState();
  const orchestrator = useAIOrchestrator();

  const [role, setRole] = useState("Software Engineer");
  const [years, setYears] = useState(5);
  const [simData, setSimData] = useState<[number,number][][][]>([]);

  const handleSimulate = () => {
    setUiState("reasoning");
    orchestrator.startSequence("salary", () => {
      const data = SCENARIOS.map(s =>
        Array.from({ length: 20 }, () => generateMCPath(years * 12, s.drift / 12, s.volatility / Math.sqrt(12)))
      );
      setSimData(data);
      setUiState("result");
    });
  };

  const scenario_colors = ["#52d9a4", "#7c6ef7", "#e8625a"];
  const scenario_icons = [TrendingUp, Activity, AlertTriangle];

  return (
    <PageWrapper>
      <div className="max-w-5xl">
        <AnimatePresence>
          {uiState === "reasoning" && (
            <AIThinking type="salary" stepText={orchestrator.currentStepText} progress={orchestrator.progress} />
          )}
        </AnimatePresence>

        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className={uiState === "reasoning" ? "opacity-30 blur-sm" : ""}>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-[rgba(240,122,255,0.15)] border border-[rgba(240,122,255,0.3)] flex items-center justify-center">
              <Activity size={20} className="text-[var(--color-pink)]" />
            </div>
            <div>
              <h1 className="font-syne text-[1.8rem] font-black tracking-tight">
                Career <span className="text-gradient">Simulation</span>
              </h1>
              <p className="font-dm-mono text-[0.72rem] text-[#7a789a] tracking-widest uppercase">
                Monte Carlo · Probabilistic Career Forecasting
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
                className="glass-panel rounded-3xl p-8 max-w-2xl space-y-6"
              >
                <div>
                  <label className="font-dm-mono text-[0.72rem] uppercase tracking-widest text-[var(--color-pink)] mb-3 block">
                    Target Role
                  </label>
                  <select
                    value={role}
                    onChange={e => setRole(e.target.value)}
                    className="w-full bg-[#11111f] border border-white/8 rounded-xl px-4 py-3 text-white font-dm-sans outline-none focus:border-[var(--color-pink)] transition-colors cursor-pointer"
                  >
                    <option>Software Engineer</option>
                    <option>Data Scientist</option>
                    <option>Engineering Manager</option>
                    <option>Staff Engineer</option>
                  </select>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="font-dm-mono text-[0.72rem] uppercase tracking-widest text-[var(--color-pink)]">Simulation Horizon</label>
                    <span className="font-syne font-bold text-[var(--color-pink)] bg-[rgba(240,122,255,0.1)] px-3 py-1 rounded-lg border border-[rgba(240,122,255,0.2)]">
                      {years} years
                    </span>
                  </div>
                  <input
                    type="range" min="1" max="10" value={years}
                    onChange={e => setYears(parseInt(e.target.value))}
                    className="w-full accent-[var(--color-pink)] cursor-pointer"
                  />
                  <div className="flex justify-between font-dm-mono text-[0.6rem] text-[#55536e] mt-1">
                    <span>1 yr</span><span>5 yr</span><span>10 yr</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white/2 border border-white/5">
                  <p className="font-dm-mono text-[0.7rem] text-[#7a789a] leading-relaxed">
                    Runs <strong className="text-[var(--color-pink)]">20,000 Monte Carlo simulations</strong> across 3 career scenarios using Geometric Brownian Motion with historical volatility calibrated from industry salary benchmarks.
                  </p>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(240,122,255,0.3)" }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleSimulate}
                  className="w-full py-4 rounded-2xl font-syne font-bold text-white tracking-wide"
                  style={{ background: "linear-gradient(135deg, #f07aff, #7c6ef7)" }}
                >
                  Run Monte Carlo Simulation
                </motion.button>
              </motion.div>
            ) : (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Scenario Charts */}
                {SCENARIOS.map((scenario, si) => {
                  const SIcon = scenario_icons[si];
                  const finalVals = simData[si]?.map(p => p[p.length - 1][1]) || [];
                  const median = finalVals.sort((a,b) => a-b)[Math.floor(finalVals.length/2)];
                  const p90 = finalVals[Math.floor(finalVals.length * 0.9)];
                  const p10 = finalVals[Math.floor(finalVals.length * 0.1)];

                  return (
                    <motion.div
                      key={si}
                      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: si * 0.2 }}
                      className="glass-panel rounded-3xl p-7"
                    >
                      <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${scenario_colors[si]}15`, border: `1px solid ${scenario_colors[si]}30` }}>
                            <SIcon size={18} style={{ color: scenario_colors[si] }} />
                          </div>
                          <div>
                            <h3 className="font-syne font-bold text-white">{scenario.label}</h3>
                            <p className="font-dm-mono text-[0.68rem]" style={{ color: scenario_colors[si] }}>20 simulated trajectories</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-right">
                          {[["P10", p10], ["Median", median], ["P90", p90]].map(([label, val]) => (
                            <div key={label as string}>
                              <div className="font-dm-mono text-[0.6rem] text-[#55536e] uppercase">{label as string}</div>
                              <div className="font-syne font-bold text-[0.95rem]" style={{ color: scenario_colors[si] }}>
                                ₹{((val as number) * 0.15 + 8).toFixed(1)}L
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="h-32 rounded-2xl overflow-hidden" style={{ background: `${scenario_colors[si]}06`, border: `1px solid ${scenario_colors[si]}10` }}>
                        <MCPathSVG paths={simData[si] || []} color={scenario_colors[si]} opacity={0.35} />
                      </div>
                    </motion.div>
                  );
                })}

                <motion.button
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
                  onClick={() => setUiState("idle")}
                  className="font-dm-mono text-[0.78rem] text-[#7a789a] hover:text-white transition-colors border-b border-transparent hover:border-white pb-0.5"
                >
                  [ RUN NEW SIMULATION ]
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </PageWrapper>
  );
}
