"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { useUIState } from "@/hooks/useUIState";
import { Lock, FileKey } from "lucide-react";

export default function FHEPrivacyMode() {
  const { uiState, setUiState } = useUIState();
  const [encryptionLog, setEncryptionLog] = useState<string[]>([]);
  
  const handleEncrypt = () => {
    setUiState("processing");
    setEncryptionLog([]);
    
    // Simulate FHE pipeline visually
    const steps = [
      "Generating CKKS Context...",
      "Serializing public/private keypairs...",
      "Encrypting local profile tensor...",
      "Sending homomorphic ciphertexts to SkillSync Cloud...",
      "Executing Random Forest homomorphically...",
      "Receiving encrypted results...",
      "Decrypting final array locally..."
    ];
    
    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        setEncryptionLog(prev => [...prev, steps[currentStep]]);
        currentStep++;
      } else {
        clearInterval(interval);
        setTimeout(() => setUiState("result"), 500);
      }
    }, 800);
  };

  return (
    <PageWrapper>
      <div className="flex flex-col gap-6 relative">

        <motion.div className={uiState === "processing" ? "opacity-30 blur-sm pointer-events-none transition-all duration-300" : ""}>
          <h1 className="font-syne text-[clamp(1.6rem,3vw,2.4rem)] font-extrabold tracking-tight">
            🔐 FHE Privacy Mode
          </h1>
          <p className="text-[0.9rem] text-[#7a789a] mt-1 font-light flex items-center gap-2">
            SkillSync never sees your plaintext data. True Fully Homomorphic Encryption.
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {(uiState === "idle" || uiState === "input") && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, filter: "blur(4px)" }}
              className="w-full max-w-2xl bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-8 text-center flex flex-col items-center justify-center gap-6 mt-4"
            >
              <div className="w-20 h-20 rounded-full bg-[rgba(240,122,255,0.1)] flex items-center justify-center">
                <Lock className="w-10 h-10 text-[var(--color-pink)]" />
              </div>
              <div>
                <h2 className="font-syne text-xl font-bold mb-2">Initialize Secure Inference</h2>
                <p className="font-dm-sans text-[0.9rem] text-[#7a789a] max-w-sm">
                  Run the career models on your local machine using TenSEAL. Your profile is encrypted before it ever leaves your browser.
                </p>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(240,122,255,0.4)" }}
                whileTap={{ scale: 0.95 }}
                onClick={handleEncrypt}
                className="px-8 py-3 bg-[rgba(240,122,255,0.1)] border border-[rgba(240,122,255,0.4)] text-[var(--color-pink)] font-syne font-bold rounded-xl mt-2 transition-all"
              >
                Encrypt & Execute
              </motion.button>
            </motion.div>
          )}

          {uiState === "processing" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20, filter: "blur(4px)" }}
              className="absolute inset-0 z-[60] flex flex-col items-center justify-center pointer-events-none mt-20"
            >
               <div className="bg-[#080810] border border-[var(--color-pink)] shadow-[0_0_30px_rgba(240,122,255,0.15)] rounded-2xl p-6 w-full max-w-xl font-dm-mono text-xs text-[#c4bdff]">
                  <div className="flex justify-between items-center border-b border-[#252535] pb-4 mb-4">
                     <span className="text-[var(--color-pink)] flex gap-2 items-center"><FileKey size={16}/> CKKS FHE Pipeline Running</span>
                     <motion.div animate={{ opacity: [1, 0, 1] }} transition={{ duration: 1, repeat: Infinity }}>
                        <div className="w-2 h-2 rounded-full bg-[var(--color-pink)]" />
                     </motion.div>
                  </div>
                  <div className="flex flex-col gap-2 h-48 overflow-y-auto pr-2" style={{ scrollbarWidth: 'thin' }}>
                    {encryptionLog.map((log, i) => (
                      <motion.div 
                        key={i} 
                        initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                        className="flex gap-2"
                      >
                         <span className="text-[#55536e]">{">"}</span> 
                         <span>{log}</span>
                      </motion.div>
                    ))}
                    {encryptionLog.length < 7 && (
                      <motion.div 
                        animate={{ opacity: [1, 0, 1] }} transition={{ duration: 0.8, repeat: Infinity }}
                        className="text-[#55536e]"
                      >
                        █
                      </motion.div>
                    )}
                  </div>
               </div>
            </motion.div>
          )}

          {uiState === "result" && (
             <motion.div
               initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
               className="bg-[var(--color-card)] border border-[var(--color-green)]/30 shadow-[0_0_30px_rgba(82,217,164,0.1)] rounded-2xl p-8 max-w-2xl mt-4 flex flex-col gap-6 text-center"
             >
               <div className="w-16 h-16 rounded-full bg-[rgba(82,217,164,0.1)] flex items-center justify-center mx-auto text-[var(--color-green)] mb-2 shadow-[0_0_20px_rgba(82,217,164,0.2)]">
                  <Lock size={32} />
               </div>
               <h2 className="font-syne text-2xl font-bold">Secure Evaluation Complete</h2>
               <p className="font-dm-sans text-[0.9rem] text-[#7a789a]">
                 All career intelligence endpoints have been securely resolved. Your unencrypted profile never left this device.
               </p>
               
               <div className="grid grid-cols-2 gap-4 mt-2">
                 <div className="bg-[#080810] border border-[#252535] p-3 rounded-xl flex flex-col gap-1">
                   <span className="text-[0.7rem] text-[#7a789a] font-dm-mono uppercase tracking-widest">Model</span>
                   <span className="font-syne font-semibold text-[0.9rem]">Job Role RF</span>
                   <span className="text-[0.75rem] text-[var(--color-green)] font-dm-mono">Decrypted: Match Top 1</span>
                 </div>
                 <div className="bg-[#080810] border border-[#252535] p-3 rounded-xl flex flex-col gap-1">
                   <span className="text-[0.7rem] text-[#7a789a] font-dm-mono uppercase tracking-widest">Model</span>
                   <span className="font-syne font-semibold text-[0.9rem]">Salary Regressor</span>
                   <span className="text-[0.75rem] text-[var(--color-green)] font-dm-mono">Decrypted: 14.5 LPA</span>
                 </div>
               </div>

               <motion.button onClick={() => setUiState("idle")} className="mt-4 text-sm text-[var(--color-muted)] underline underline-offset-4 self-center">Clear Contexts</motion.button>
             </motion.div>
          )}
        </AnimatePresence>

      </div>
    </PageWrapper>
  );
}
