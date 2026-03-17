"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { useUIState } from "@/hooks/useUIState";
import { useAIOrchestrator } from "@/hooks/useAIOrchestrator";
import { AIThinking } from "@/components/ui/AIThinking";
import { Building, CheckCircle2, XCircle, AlertCircle, ArrowRight } from "lucide-react";

const COMPANIES = [
  { name: "Google", logo: "G", color: "#4285F4", skills: ["Python", "System Design", "Kubernetes", "ML", "Data Structures"] },
  { name: "Microsoft", logo: "M", color: "#00A4EF", skills: ["Azure", "C#", ".NET", "System Design", "TypeScript"] },
  { name: "Amazon", logo: "A", color: "#FF9900", skills: ["AWS", "System Design", "Leadership Principles", "Java", "DynamoDB"] },
  { name: "Meta", logo: "f", color: "#0866FF", skills: ["React", "GraphQL", "Python", "PyTorch", "System Design"] },
  { name: "Flipkart", logo: "F", color: "#F74F04", skills: ["Java", "Kafka", "MySQL", "System Design", "Spring Boot"] },
];

const YOUR_SKILLS = ["Python", "React", "Docker", "SQL", "Machine Learning", "TypeScript", "Git"];

function SkillMatch({ skill, hasIt }: { skill: string; hasIt: boolean }) {
  return (
    <div className="flex items-center gap-2">
      {hasIt ? (
        <CheckCircle2 size={13} className="text-[var(--color-green)] flex-shrink-0" />
      ) : (
        <XCircle size={13} className="text-[var(--color-red)] flex-shrink-0" />
      )}
      <span className="font-dm-mono text-[0.75rem]" style={{ color: hasIt ? "#ede9ff" : "#7a789a" }}>
        {skill}
      </span>
    </div>
  );
}

export default function CompanyGap() {
  const { uiState, setUiState } = useUIState();
  const orchestrator = useAIOrchestrator();

  const [selected, setSelected] = useState<string[]>([]);
  const [results, setResults] = useState<(typeof COMPANIES[0] & { matchScore: number; gaps: string[] })[]>([]);

  const toggleCompany = (name: string) => {
    setSelected(prev => prev.includes(name) ? prev.filter(x => x !== name) : [...prev, name]);
  };

  const handleAnalyze = () => {
    if (selected.length === 0) return;
    setUiState("reasoning");
    orchestrator.startSequence("skill-gap", () => {
      const res = COMPANIES.filter(c => selected.includes(c.name)).map(c => {
        const gaps = c.skills.filter(s => !YOUR_SKILLS.includes(s));
        const matched = c.skills.filter(s => YOUR_SKILLS.includes(s));
        const matchScore = Math.round((matched.length / c.skills.length) * 100);
        return { ...c, matchScore, gaps };
      }).sort((a,b) => b.matchScore - a.matchScore);
      setResults(res);
      setUiState("result");
    });
  };

  return (
    <PageWrapper>
      <div className="max-w-5xl">
        <AnimatePresence>
          {uiState === "reasoning" && (
            <AIThinking type="skill-gap" stepText={orchestrator.currentStepText} progress={orchestrator.progress} />
          )}
        </AnimatePresence>

        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className={uiState === "reasoning" ? "opacity-30 blur-sm" : ""}>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-[rgba(247,200,110,0.15)] border border-[rgba(247,200,110,0.3)] flex items-center justify-center">
              <Building size={20} className="text-[var(--color-yellow)]" />
            </div>
            <div>
              <h1 className="font-syne text-[1.8rem] font-black tracking-tight">
                Company <span style={{ color: "#f7c86e" }}>Gap Analysis</span>
              </h1>
              <p className="font-dm-mono text-[0.72rem] text-[#7a789a] tracking-widest uppercase">
                6-Company Comparison · Skill Match Scoring
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
                className="max-w-3xl space-y-5"
              >
                {/* Your skills */}
                <div className="glass-panel rounded-3xl p-6">
                  <p className="font-dm-mono text-[0.7rem] uppercase tracking-widest text-[var(--color-yellow)] mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 bg-[var(--color-yellow)] rounded-full animate-pulse" />
                    Your Current Skills
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {YOUR_SKILLS.map(s => (
                      <span key={s} className="px-3 py-1.5 rounded-lg font-dm-mono text-[0.75rem] text-[#ede9ff]" style={{ background: "rgba(247,200,110,0.1)", border: "1px solid rgba(247,200,110,0.3)" }}>
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Company selector */}
                <div className="glass-panel rounded-3xl p-6">
                  <p className="font-dm-mono text-[0.7rem] uppercase tracking-widest text-[var(--color-yellow)] mb-4">Select Target Companies</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {COMPANIES.map((c) => (
                      <motion.button
                        key={c.name}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => toggleCompany(c.name)}
                        className="flex items-center gap-3 p-4 rounded-2xl border transition-all"
                        style={{
                          border: selected.includes(c.name) ? `1px solid ${c.color}50` : "1px solid rgba(255,255,255,0.06)",
                          background: selected.includes(c.name) ? `${c.color}10` : "rgba(255,255,255,0.02)",
                          boxShadow: selected.includes(c.name) ? `0 0 20px ${c.color}20` : "none",
                        }}
                      >
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center font-syne font-black text-white text-[0.9rem] flex-shrink-0" style={{ background: c.color }}>
                          {c.logo}
                        </div>
                        <span className="font-syne font-bold text-white">{c.name}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(247,200,110,0.3)" }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleAnalyze}
                  disabled={selected.length === 0}
                  className="w-full py-4 rounded-2xl font-syne font-bold text-black disabled:opacity-40 disabled:cursor-not-allowed tracking-wide"
                  style={{ background: "linear-gradient(135deg, #f7c86e, #f7956e)" }}
                >
                  Analyze {selected.length > 0 ? `${selected.length} Compan${selected.length > 1 ? "ies" : "y"}` : "Companies"}
                </motion.button>
              </motion.div>
            ) : (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                className="space-y-5 max-w-4xl"
              >
                {results.map((company, i) => (
                  <motion.div
                    key={company.name}
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.15 }}
                    className="glass-panel rounded-3xl p-7"
                  >
                    <div className="flex items-center justify-between mb-5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center font-syne font-black text-white text-xl flex-shrink-0" style={{ background: company.color, boxShadow: `0 0 20px ${company.color}50` }}>
                          {company.logo}
                        </div>
                        <div>
                          <h3 className="font-syne font-black text-white text-xl">{company.name}</h3>
                          <div className="flex items-center gap-2 mt-0.5">
                            {company.matchScore >= 80 ? (
                              <CheckCircle2 size={12} className="text-[var(--color-green)]" />
                            ) : company.matchScore >= 50 ? (
                              <AlertCircle size={12} className="text-[var(--color-yellow)]" />
                            ) : (
                              <XCircle size={12} className="text-[var(--color-red)]" />
                            )}
                            <span className="font-dm-mono text-[0.68rem]" style={{
                              color: company.matchScore >= 80 ? "#52d9a4" : company.matchScore >= 50 ? "#f7c86e" : "#e8625a"
                            }}>
                              {company.matchScore >= 80 ? "Strong Fit" : company.matchScore >= 50 ? "Partial Fit" : "Needs Work"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Match Score Ring */}
                      <div className="relative w-20 h-20 flex-shrink-0">
                        <svg viewBox="0 0 80 80" className="absolute inset-0 -rotate-90">
                          <circle cx="40" cy="40" r="32" stroke="rgba(255,255,255,0.05)" strokeWidth="7" fill="none" />
                          <motion.circle
                            cx="40" cy="40" r="32"
                            stroke={company.color} strokeWidth="7" fill="none"
                            strokeLinecap="round"
                            strokeDasharray={201}
                            initial={{ strokeDashoffset: 201 }}
                            animate={{ strokeDashoffset: 201 - (201 * company.matchScore / 100) }}
                            transition={{ duration: 1, ease: "easeOut", delay: 0.3 + i * 0.1 }}
                            style={{ filter: `drop-shadow(0 0 6px ${company.color})` }}
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="font-syne font-black text-[1.2rem]" style={{ color: company.color }}>{company.matchScore}%</span>
                        </div>
                      </div>
                    </div>

                    {/* Match bar */}
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden mb-5">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${company.matchScore}%` }}
                        transition={{ duration: 1, ease: "easeOut", delay: 0.4 + i * 0.1 }}
                        className="h-full rounded-full"
                        style={{ background: company.color, boxShadow: `0 0 8px ${company.color}80` }}
                      />
                    </div>

                    {/* Skill Grid */}
                    <div className="grid grid-cols-2 gap-x-6 gap-y-1.5">
                      {company.skills.map(skill => (
                        <SkillMatch key={skill} skill={skill} hasIt={YOUR_SKILLS.includes(skill)} />
                      ))}
                    </div>

                    {company.gaps.length > 0 && (
                      <div className="mt-4 p-3 rounded-xl bg-[rgba(232,98,90,0.06)] border border-[rgba(232,98,90,0.2)]">
                        <p className="font-dm-mono text-[0.68rem] text-[var(--color-red)] flex items-center gap-2 mb-1">
                          <ArrowRight size={11} /> Skills to acquire
                        </p>
                        <p className="font-dm-sans text-[0.8rem] text-[#ede9ff]">{company.gaps.join(" · ")}</p>
                      </div>
                    )}
                  </motion.div>
                ))}

                <motion.button
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
                  onClick={() => setUiState("idle")}
                  className="font-dm-mono text-[0.78rem] text-[#7a789a] hover:text-white transition-colors border-b border-transparent hover:border-white pb-0.5"
                >
                  [ NEW ANALYSIS ]
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </PageWrapper>
  );
}
