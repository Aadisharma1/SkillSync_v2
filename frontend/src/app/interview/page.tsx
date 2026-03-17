"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { useUIState } from "@/hooks/useUIState";
import { useAIOrchestrator } from "@/hooks/useAIOrchestrator";
import { AIThinking } from "@/components/ui/AIThinking";
import { Mic, CheckCircle2, XCircle, Clock, Brain } from "lucide-react";

// Circular IQ Display
function IQDial({ score, max = 100, color }: { score: number; max?: number; color: string }) {
  const r = 56;
  const circ = 2 * Math.PI * r;
  const fill = (score / max) * circ;
  return (
    <div className="relative w-36 h-36 flex items-center justify-center">
      <svg viewBox="0 0 140 140" className="absolute inset-0 -rotate-90">
        <circle cx="70" cy="70" r={r} stroke="rgba(255,255,255,0.05)" strokeWidth="10" fill="none" />
        <motion.circle
          cx="70" cy="70" r={r}
          stroke={color} strokeWidth="10" fill="none"
          strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: circ - fill }}
          transition={{ duration: 2, ease: "easeOut", delay: 0.5 }}
          style={{ filter: `drop-shadow(0 0 8px ${color})` }}
        />
      </svg>
      <div className="relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", bounce: 0.5, delay: 0.8 }}
          className="font-syne font-black text-[2rem] leading-none"
          style={{ color }}
        >
          {score}
        </motion.div>
        <div className="font-dm-mono text-[0.6rem] text-[#7a789a] mt-1 uppercase tracking-widest">IQ Score</div>
      </div>
    </div>
  );
}

const TOPICS = [
  { name: "Data Structures & Algorithms", weight: 0.35 },
  { name: "System Design", weight: 0.25 },
  { name: "Behavioral (STAR)", weight: 0.2 },
  { name: "Domain Knowledge", weight: 0.2 },
];

const QUESTIONS = [
  { q: "Explain time complexity of merge sort.", topic: "DSA", difficulty: "Medium" },
  { q: "Design a URL shortener like bit.ly.", topic: "System Design", difficulty: "Hard" },
  { q: "Tell me about a time you resolved a conflict.", topic: "Behavioral", difficulty: "Easy" },
  { q: "What is gradient descent?", topic: "Domain", difficulty: "Medium" },
];

export default function InterviewReadiness() {
  const { uiState, setUiState } = useUIState();
  const orchestrator = useAIOrchestrator();

  const [role, setRole] = useState("Software Engineer");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [iqScore, setIqScore] = useState(0);
  const [topicScores, setTopicScores] = useState<number[]>([]);

  const handleAnalyze = () => {
    setUiState("reasoning");
    orchestrator.startSequence("role", () => {
      const scores = TOPICS.map(() => Math.floor(Math.random() * 30 + 55));
      const weighted = scores.reduce((acc, s, i) => acc + s * TOPICS[i].weight, 0);
      setTopicScores(scores);
      setIqScore(Math.round(weighted));
      setUiState("result");
    });
  };

  const getBadge = (score: number) => {
    if (score >= 80) return { label: "Interview Ready", color: "#52d9a4" };
    if (score >= 65) return { label: "Needs Practice", color: "#f7c86e" };
    return { label: "Preparation Needed", color: "#e8625a" };
  };

  return (
    <PageWrapper>
      <div className="max-w-5xl">
        <AnimatePresence>
          {uiState === "reasoning" && (
            <AIThinking type="role" stepText={orchestrator.currentStepText} progress={orchestrator.progress} />
          )}
        </AnimatePresence>

        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className={uiState === "reasoning" ? "opacity-30 blur-sm" : ""}>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-[rgba(196,189,255,0.15)] border border-[rgba(196,189,255,0.3)] flex items-center justify-center">
              <Mic size={20} className="text-[#c4bdff]" />
            </div>
            <div>
              <h1 className="font-syne text-[1.8rem] font-black tracking-tight">
                Interview <span style={{ color: "#c4bdff" }}>IQ Score</span>
              </h1>
              <p className="font-dm-mono text-[0.72rem] text-[#7a789a] tracking-widest uppercase">
                Composite Readiness Assessment · Weighted Scoring
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
                className="max-w-2xl space-y-5"
              >
                <div className="glass-panel rounded-3xl p-7">
                  <p className="font-dm-mono text-[0.7rem] uppercase tracking-widest text-[#c4bdff] mb-5 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#c4bdff] animate-pulse" />
                    Configure Assessment
                  </p>
                  <div className="space-y-4">
                    <div>
                      <label className="font-dm-mono text-[0.7rem] text-[#7a789a] uppercase tracking-widest mb-2 block">Target Role</label>
                      <select
                        value={role} onChange={e => setRole(e.target.value)}
                        className="w-full bg-[#11111f] border border-white/8 rounded-xl px-4 py-3 text-white font-dm-sans outline-none focus:border-[#c4bdff] transition-colors cursor-pointer"
                      >
                        <option>Software Engineer</option>
                        <option>Data Scientist</option>
                        <option>Backend Engineer</option>
                        <option>ML Engineer</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {TOPICS.map((t) => (
                        <div key={t.name} className="p-3 rounded-xl border border-white/5 bg-white/2">
                          <div className="font-dm-mono text-[0.68rem] text-[#c4bdff] mb-1">{t.name}</div>
                          <div className="font-syne font-bold text-white">{Math.round(t.weight * 100)}% weight</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Sample Questions Preview */}
                <div className="glass-panel rounded-3xl p-7">
                  <p className="font-dm-mono text-[0.7rem] uppercase tracking-widest text-[#c4bdff] mb-5">Sample Interview Scenarios</p>
                  <div className="space-y-3">
                    {QUESTIONS.map((q, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                        className="flex items-start gap-3 p-3 rounded-xl border border-white/5 hover:border-white/10 transition-colors"
                      >
                        <div className="flex-shrink-0 mt-0.5">
                          <Brain size={14} className="text-[#c4bdff]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-dm-sans text-[0.82rem] text-white">{q.q}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="font-dm-mono text-[0.62rem] text-[#7a789a]">{q.topic}</span>
                            <span className="font-dm-mono text-[0.62rem]" style={{ color: q.difficulty === "Easy" ? "#52d9a4" : q.difficulty === "Medium" ? "#f7c86e" : "#e8625a" }}>{q.difficulty}</span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(196,189,255,0.3)" }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleAnalyze}
                  className="w-full py-4 rounded-2xl font-syne font-bold text-black tracking-wide"
                  style={{ background: "linear-gradient(135deg, #c4bdff, #9d8fff)" }}
                >
                  Compute Interview IQ Score
                </motion.button>
              </motion.div>
            ) : (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                className="space-y-6 max-w-4xl"
              >
                {/* IQ Score + Badge */}
                <div className="glass-panel rounded-3xl p-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-dm-mono text-[0.7rem] uppercase tracking-widest text-[#c4bdff] mb-3">Overall Assessment</div>
                      <div className="flex items-center gap-4">
                        <IQDial score={iqScore} color="#c4bdff" />
                        <div>
                          <div className="font-syne font-black text-[2.5rem] leading-none text-white mb-2">{iqScore}/100</div>
                          <div
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl font-syne font-bold text-[0.85rem]"
                            style={{ background: `${getBadge(iqScore).color}20`, color: getBadge(iqScore).color, border: `1px solid ${getBadge(iqScore).color}40` }}
                          >
                            {iqScore >= 80 ? <CheckCircle2 size={14} /> : <Clock size={14} />}
                            {getBadge(iqScore).label}
                          </div>
                          <p className="font-dm-mono text-[0.7rem] text-[#7a789a] mt-2">vs {role} at top companies</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Topic Breakdown */}
                <div className="glass-panel rounded-3xl p-8">
                  <h3 className="font-syne font-bold text-white text-lg mb-6">Topic Breakdown</h3>
                  <div className="space-y-5">
                    {TOPICS.map((topic, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + i * 0.15 }}
                      >
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-dm-sans text-[0.88rem] text-[#ede9ff]">{topic.name}</span>
                          <div className="flex items-center gap-3">
                            <span className="font-dm-mono text-[0.7rem] text-[#7a789a]">{Math.round(topic.weight * 100)}% weight</span>
                            <span className="font-syne font-bold text-[0.95rem]" style={{ color: topicScores[i] >= 75 ? "#52d9a4" : "#f7c86e" }}>
                              {topicScores[i]}/100
                            </span>
                          </div>
                        </div>
                        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${topicScores[i]}%` }}
                            transition={{ duration: 1.2, ease: "easeOut", delay: 0.5 + i * 0.15 }}
                            className="h-full rounded-full"
                            style={{
                              background: topicScores[i] >= 75 ? "linear-gradient(90deg, #52d9a4, #52b8d9)" : "linear-gradient(90deg, #f7c86e, #f07aff)",
                              boxShadow: `0 0 10px ${topicScores[i] >= 75 ? "rgba(82,217,164,0.4)" : "rgba(247,200,110,0.4)"}`
                            }}
                          />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <motion.button
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
                  onClick={() => setUiState("idle")}
                  className="font-dm-mono text-[0.78rem] text-[#7a789a] hover:text-white transition-colors border-b border-transparent hover:border-white pb-0.5"
                >
                  [ REASSESS ]
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </PageWrapper>
  );
}
