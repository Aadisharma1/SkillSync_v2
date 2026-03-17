"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUIState } from "@/hooks/useUIState";
import {
  Home, Target, Search, DollarSign, TrendingUp, FileText,
  Lock, Users, Activity, Mic, Building, Zap, ChevronRight
} from "lucide-react";

const sections = [
  {
    label: "Overview",
    items: [
      { name: "Dashboard", path: "/", icon: Home, badge: null, color: "#9d8fff" },
    ],
  },
  {
    label: "ML Models",
    items: [
      { name: "Role Predictor", path: "/role", icon: Target, badge: "RF", color: "#7c6ef7" },
      { name: "Skill Gap Analyzer", path: "/skill-gap", icon: Search, badge: "RF", color: "#7c6ef7" },
      { name: "Salary Predictor", path: "/salary", icon: DollarSign, badge: "RF", color: "#7c6ef7" },
      { name: "Skill Demand", path: "/forecast", icon: TrendingUp, badge: "LR", color: "#52d9a4" },
    ],
  },
  {
    label: "AI Features",
    items: [
      { name: "Resume Parser", path: "/resume", icon: FileText, badge: "GPT", color: "#f7c86e" },
      { name: "FHE Privacy Mode", path: "/fhe", icon: Lock, badge: "FHE", color: "#f07aff" },
    ],
  },
  {
    label: "Novel Intelligence",
    items: [
      { name: "Cohort Benchmark", path: "/benchmark", icon: Users, badge: "KDE", color: "#52d9a4" },
      { name: "Career Simulation", path: "/simulation", icon: Activity, badge: "MC", color: "#f07aff" },
      { name: "Interview IQ", path: "/interview", icon: Mic, badge: "IQ", color: "#c4bdff" },
      { name: "Company Gap", path: "/company", icon: Building, badge: "6co", color: "#f7c86e" },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { uiState } = useUIState();
  const isReasoning = uiState === "reasoning";

  return (
    <motion.nav
      initial={{ x: -280 }}
      animate={{ x: 0, opacity: isReasoning ? 0.4 : 1, filter: isReasoning ? "blur(2px)" : "none" }}
      transition={{ type: "spring", stiffness: 260, damping: 28 }}
      className="fixed top-0 left-0 w-[260px] h-screen flex flex-col z-50"
      style={{
        background: "rgba(5,5,15,0.92)",
        backdropFilter: "blur(48px)",
        WebkitBackdropFilter: "blur(48px)",
        borderRight: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      {/* Logo */}
      <div className="px-6 pt-7 pb-5 border-b border-white/5">
        <Link href="/demo">
          <motion.div whileHover={{ scale: 1.02 }} className="cursor-pointer">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#7c6ef7] to-[#f07aff] flex items-center justify-center shadow-[0_0_20px_rgba(124,110,247,0.4)]">
                <Zap size={14} className="text-white" />
              </div>
              <h1 className="font-syne text-[1.3rem] font-black tracking-tight text-gradient">
                SkillSync
              </h1>
            </div>
            <p className="font-dm-mono text-[0.62rem] text-[#55536e] tracking-[0.2em] uppercase ml-11">
              Career AI · v4.0
            </p>
          </motion.div>
        </Link>
      </div>

      {/* Nav Items */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-4 space-y-6">
        {sections.map((section, sIdx) => (
          <div key={sIdx}>
            <p className="font-dm-mono text-[0.6rem] tracking-[0.25em] uppercase text-[#3d3d5c] px-3 mb-2">
              {section.label}
            </p>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const isActive = pathname === item.path;
                return (
                  <Link key={item.path} href={item.path}>
                    <motion.div
                      whileHover={{ x: 3 }}
                      whileTap={{ scale: 0.97 }}
                      className="relative flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer group transition-colors"
                      style={{
                        background: isActive ? `rgba(124,110,247,0.12)` : "transparent",
                      }}
                    >
                      {/* Active indicator bar */}
                      <AnimatePresence>
                        {isActive && (
                          <motion.div
                            layoutId="sidebar-active"
                            className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-[60%] rounded-r-full"
                            style={{ background: item.color }}
                            initial={{ opacity: 0, scaleY: 0 }}
                            animate={{ opacity: 1, scaleY: 1 }}
                            exit={{ opacity: 0, scaleY: 0 }}
                            transition={{ type: "spring", stiffness: 400, damping: 30 }}
                          />
                        )}
                      </AnimatePresence>

                      {/* Icon */}
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all"
                        style={{
                          background: isActive ? `${item.color}18` : "rgba(255,255,255,0.04)",
                          border: `1px solid ${isActive ? `${item.color}30` : "rgba(255,255,255,0.05)"}`,
                        }}
                      >
                        <item.icon
                          size={15}
                          style={{ color: isActive ? item.color : "#55536e" }}
                          className="transition-colors"
                        />
                      </div>

                      {/* Name */}
                      <span
                        className="text-[0.82rem] font-medium truncate transition-colors flex-1"
                        style={{ color: isActive ? "#ede9ff" : "#7a789a" }}
                      >
                        {item.name}
                      </span>

                      {/* Badge */}
                      {item.badge && (
                        <span
                          className="font-dm-mono text-[0.58rem] px-1.5 py-0.5 rounded-md border flex-shrink-0"
                          style={{
                            color: item.color,
                            borderColor: `${item.color}30`,
                            background: `${item.color}10`,
                          }}
                        >
                          {item.badge}
                        </span>
                      )}

                      {/* Hover arrow */}
                      <ChevronRight
                        size={12}
                        className="opacity-0 group-hover:opacity-30 transition-opacity flex-shrink-0 text-white"
                      />
                    </motion.div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-white/5">
        <div className="flex items-center justify-between mb-2">
          <span className="font-dm-mono text-[0.6rem] text-[#3d3d5c] uppercase tracking-widest">System</span>
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-[#52d9a4] animate-pulse" />
            <span className="font-dm-mono text-[0.6rem] text-[#52d9a4]">Online</span>
          </div>
        </div>
        <div className="font-dm-mono text-[0.6rem] text-[#2a2a46] leading-relaxed">
          RF · LR · LLM · FHE · MC · KDE<br/>
          8 features · 12 endpoints
        </div>
        <Link href="/demo">
          <motion.div
            whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(124,110,247,0.3)" }}
            whileTap={{ scale: 0.97 }}
            className="mt-3 w-full py-2 rounded-xl text-center font-dm-mono text-[0.72rem] text-[#9d8fff] cursor-pointer transition-all"
            style={{ background: "rgba(124,110,247,0.1)", border: "1px solid rgba(124,110,247,0.2)" }}
          >
            ▶ Launch Demo
          </motion.div>
        </Link>
      </div>
    </motion.nav>
  );
}
