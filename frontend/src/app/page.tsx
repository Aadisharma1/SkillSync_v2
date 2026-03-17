"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { PageWrapper } from "@/components/layout/PageWrapper";
import Link from "next/link";
import {
  Target, Search, DollarSign, TrendingUp, FileText,
  Lock, Users, Activity, Mic, Building, ArrowUpRight, Zap, Brain
} from "lucide-react";

function CountUp({ to, decimals = 0, suffix = "" }: { to: number; decimals?: number; suffix?: string }) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let startTime: number;
    const duration = 2200;
    const tick = (time: number) => {
      if (!startTime) startTime = time;
      const p = Math.min((time - startTime) / duration, 1);
      setValue((1 - Math.pow(2, -10 * p)) * to);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [to]);
  return <>{value.toFixed(decimals)}{suffix}</>;
}

const STATS = [
  { label: "Role Accuracy", to: 99.4, decimals: 1, suffix: "%", model: "RandomForest", color: "#9d8fff" },
  { label: "Skill Gap F1", to: 98.4, decimals: 1, suffix: "%", model: "MultiOutput RF", color: "#52d9a4" },
  { label: "Salary R²", to: 0.75, decimals: 2, suffix: "", model: "RF Regressor", color: "#f7c86e" },
  { label: "GenAI Growth", to: 9.3, decimals: 1, suffix: "%", model: "6-mo Forecast", color: "#f07aff" },
];

const MODULES = [
  { name: "Role Predictor", path: "/role", icon: Target, desc: "RF Classifier · 99.4% accuracy", color: "#7c6ef7", badge: "RF" },
  { name: "Skill Gap Analyzer", path: "/skill-gap", icon: Search, desc: "MultiOutput RF · Live graph", color: "#9d8fff", badge: "RF" },
  { name: "Salary Predictor", path: "/salary", icon: DollarSign, desc: "RF Regressor · R² 0.75", color: "#52d9a4", badge: "RF" },
  { name: "Skill Demand Forecast", path: "/forecast", icon: TrendingUp, desc: "Linear Regression · 6-mo", color: "#52b8d9", badge: "LR" },
  { name: "Resume Parser", path: "/resume", icon: FileText, desc: "Semantic extraction · AI", color: "#f7c86e", badge: "AI" },
  { name: "FHE Privacy Mode", path: "/fhe", icon: Lock, desc: "CKKS homomorphic inference", color: "#f07aff", badge: "FHE" },
  { name: "Cohort Benchmark", path: "/benchmark", icon: Users, desc: "KDE density estimation", color: "#52d9a4", badge: "KDE" },
  { name: "Career Simulation", path: "/simulation", icon: Activity, desc: "Monte Carlo trajectories", color: "#f07aff", badge: "MC" },
  { name: "Interview IQ", path: "/interview", icon: Mic, desc: "Composite readiness score", color: "#c4bdff", badge: "IQ" },
  { name: "Company Gap", path: "/company", icon: Building, desc: "6-company skill matching", color: "#f7c86e", badge: "6co" },
];

const TIMELINE = [
  { step: "01", label: "Parse", desc: "Structured input ingestion" },
  { step: "02", label: "Infer", desc: "RandomForest ML inference" },
  { step: "03", label: "Graph", desc: "Live skill graph synthesis" },
  { step: "04", label: "Project", desc: "Salary elasticity mapping" },
  { step: "05", label: "Simulate", desc: "Monte Carlo career paths" },
];

export default function Dashboard() {
  return (
    <PageWrapper>
      <div className="flex flex-col gap-10 max-w-6xl">

        {/* Hero Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="px-3 py-1 rounded-full border border-[var(--color-accent)]/30 bg-[var(--color-accent)]/10 font-dm-mono text-[0.68rem] text-[var(--color-accent)] tracking-widest uppercase flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-green)] animate-pulse" />
              All Systems Online
            </div>
          </div>
          <h1 className="font-syne text-[clamp(2rem,4vw,3.2rem)] font-black tracking-tight leading-tight">
            <span className="text-white">Career Intelligence</span>
            <br />
            <span className="text-gradient">Command Center</span>
          </h1>
          <p className="text-[1rem] text-[#7a789a] mt-3 font-medium max-w-xl">
            10 ML-powered modules. Real patterns. Real predictions. Designed for engineers who want the truth about their career trajectory.
          </p>

          <div className="flex items-center gap-3 mt-5">
            <Link href="/demo">
              <motion.div
                whileHover={{ scale: 1.03, boxShadow: "0 0 30px rgba(124,110,247,0.4)" }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-syne font-bold text-white cursor-pointer"
                style={{ background: "linear-gradient(135deg, #7c6ef7, #f07aff)" }}
              >
                <Zap size={16} />
                Launch Demo
              </motion.div>
            </Link>
            <Link href="/skill-gap">
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-syne font-bold text-[#c4bdff] cursor-pointer border border-white/10 hover:border-[var(--color-accent)]/40 transition-colors"
              >
                <Brain size={16} />
                Try Skill Gap
                <ArrowUpRight size={14} />
              </motion.div>
            </Link>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {STATS.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.08, type: "spring", bounce: 0.3 }}
              whileHover={{ y: -4, scale: 1.02 }}
              className="glass-panel rounded-2xl p-5 relative overflow-hidden group cursor-default"
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background: `radial-gradient(circle at top right, ${stat.color}12, transparent 70%)` }}
              />
              <div className="font-dm-mono text-[0.62rem] uppercase tracking-widest mb-3" style={{ color: stat.color }}>
                {stat.label}
              </div>
              <div className="font-syne font-black text-[2.2rem] leading-none mb-1.5" style={{ color: stat.color, textShadow: `0 0 30px ${stat.color}60` }}>
                <CountUp to={stat.to} decimals={stat.decimals} suffix={stat.suffix} />
              </div>
              <div className="font-dm-mono text-[0.62rem] text-[#55536e]">{stat.model}</div>
            </motion.div>
          ))}
        </div>

        {/* Module Grid */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-syne font-bold text-white text-xl">Intelligence Modules</h2>
            <span className="font-dm-mono text-[0.68rem] text-[#55536e] uppercase tracking-widest">10 Active</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {MODULES.map((mod, i) => (
              <Link key={mod.path} href={mod.path}>
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.05, type: "spring" }}
                  whileHover={{ y: -3, scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className="glass rounded-2xl p-5 cursor-pointer group relative overflow-hidden transition-all"
                  style={{ border: `1px solid rgba(255,255,255,0.05)` }}
                >
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none"
                    style={{ background: `linear-gradient(135deg, ${mod.color}10, transparent)` }}
                  />

                  <div className="flex items-start justify-between mb-4">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all group-hover:scale-110"
                      style={{ background: `${mod.color}15`, border: `1px solid ${mod.color}30` }}
                    >
                      <mod.icon size={16} style={{ color: mod.color }} />
                    </div>
                    <span className="font-dm-mono text-[0.58rem] px-1.5 py-0.5 rounded border"
                      style={{ color: mod.color, borderColor: `${mod.color}40`, background: `${mod.color}10` }}>
                      {mod.badge}
                    </span>
                  </div>

                  <div className="font-syne font-bold text-white text-[0.9rem] mb-1 pr-4 group-hover:text-[#ede9ff]">{mod.name}</div>
                  <div className="font-dm-mono text-[0.65rem] text-[#55536e]">{mod.desc}</div>

                  <div className="mt-4 flex items-center gap-1 font-dm-mono text-[0.65rem] opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: mod.color }}>
                    Launch <ArrowUpRight size={11} />
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>

        {/* Pipeline Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="glass-panel rounded-3xl p-8"
        >
          <h2 className="font-syne font-bold text-white text-lg mb-2">AI Pipeline Architecture</h2>
          <p className="font-dm-mono text-[0.7rem] text-[#55536e] mb-7">End-to-end career intelligence processing flow</p>

          <div className="flex items-stretch gap-0">
            {TIMELINE.map((item, i) => (
              <div key={i} className="flex-1 flex flex-col items-center relative group">
                {i < TIMELINE.length - 1 && (
                  <div className="absolute top-5 left-1/2 w-full h-px" style={{ background: "linear-gradient(90deg, rgba(124,110,247,0.6), rgba(124,110,247,0.1))" }} />
                )}
                <motion.div
                  whileHover={{ scale: 1.1, y: -2 }}
                  className="w-10 h-10 rounded-full flex items-center justify-center font-syne font-black text-[0.75rem] text-white relative z-10 mb-3"
                  style={{ background: "linear-gradient(135deg, #7c6ef7, #f07aff)", boxShadow: "0 0 20px rgba(124,110,247,0.4)" }}
                >
                  {item.step}
                </motion.div>
                <div className="text-center px-2">
                  <div className="font-syne font-bold text-white text-[0.85rem] mb-0.5">{item.label}</div>
                  <div className="font-dm-mono text-[0.62rem] text-[#55536e]">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </PageWrapper>
  );
}
