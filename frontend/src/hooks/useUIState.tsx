"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";

export type UIState = "idle" | "input" | "processing" | "reasoning" | "result" | "explore";

interface UIStateContextProps {
  uiState: UIState;
  setUiState: (state: UIState) => void;
  activeModuleId: string | null;
  setActiveModuleId: (id: string | null) => void;
}

const UIStateContext = createContext<UIStateContextProps | undefined>(undefined);

export function UIStateProvider({ children }: { children: ReactNode }) {
  const [uiState, setUiState] = useState<UIState>("idle");
  const [activeModuleId, setActiveModuleId] = useState<string | null>(null);

  return (
    <UIStateContext.Provider value={{ uiState, setUiState, activeModuleId, setActiveModuleId }}>
      {/* Global Cinematic Focus Layer */}
      <AnimatePresence>
        {(uiState === "reasoning" || uiState === "processing") && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-md pointer-events-none"
          />
        )}
      </AnimatePresence>
      {children}
    </UIStateContext.Provider>
  );
}

export function useUIState() {
  const context = useContext(UIStateContext);
  if (!context) {
    throw new Error("useUIState must be used within a UIStateProvider");
  }
  return context;
}
