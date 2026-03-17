"use client";

import { motion } from "framer-motion";
import { pageTransitions } from "@/lib/motion";

export function PageWrapper({ children, className = "" }: { children: React.ReactNode, className?: string }) {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransitions}
      className={`min-h-full ${className}`}
    >
      {children}
    </motion.div>
  );
}
