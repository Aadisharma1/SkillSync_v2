"use client";

import { useState, useCallback, useRef } from "react";

export type AIAction = "skill-gap" | "salary" | "role" | "forecast" | "resume";

export interface AISequenceStep {
  message: string;
  durationMode?: "snappy" | "normal" | "cinematic"; // internal weighting
}

// Predefined sequences for progressive reveal
const SEQUENCES: Record<AIAction, AISequenceStep[]> = {
  "skill-gap": [
    { message: "Parsing profile...", durationMode: "snappy" },
    { message: "Building skill graph...", durationMode: "normal" },
    { message: "Analyzing role constraints...", durationMode: "cinematic" },
    { message: "Identifying gaps...", durationMode: "normal" },
  ],
  role: [
    { message: "Evaluating academic background...", durationMode: "snappy" },
    { message: "Running RandomForest Classifier...", durationMode: "cinematic" },
    { message: "Ranking probability distributions...", durationMode: "normal" },
  ],
  salary: [
    { message: "Cross-referencing market data...", durationMode: "normal" },
    { message: "Simulating salary boosters...", durationMode: "cinematic" },
  ],
  forecast: [
    { message: "Ingesting 6-month historical trends...", durationMode: "snappy" },
    { message: "Applying predictive modeling...", durationMode: "cinematic" },
  ],
  resume: [
    { message: "Running OCR extraction...", durationMode: "normal" },
    { message: "Contextualizing raw text...", durationMode: "cinematic" },
    { message: "Mapping entries to SkillSync ontology...", durationMode: "normal" },
  ],
};

const MIN_DURATION_MS = 1500;
const MAX_DURATION_MS = 4000;

export function useAIOrchestrator() {
  const [isReasoning, setIsReasoning] = useState(false);
  const [currentStepText, setCurrentStepText] = useState("");
  const [progress, setProgress] = useState(0);
  const [currentType, setCurrentType] = useState<AIAction | null>(null);

  const timeoutIds = useRef<NodeJS.Timeout[]>([]);

  const cleanup = () => {
    timeoutIds.current.forEach(clearTimeout);
    timeoutIds.current = [];
  };

  /**
   * Starts a dynamic thinking sequence.
   * Guarantees at least 1.5s runtime up to 4s based on step count.
   */
  const startSequence = useCallback(
    (action: AIAction, onComplete: () => void) => {
      cleanup();
      setIsReasoning(true);
      setCurrentType(action);
      setProgress(0);

      const steps = SEQUENCES[action];
      if (!steps || steps.length === 0) {
        // Fallback
        setTimeout(onComplete, MIN_DURATION_MS);
        return;
      }

      // Calculate adaptive step durations
      const totalSteps = steps.length;
      let allocatedTime = 0;
      const stepTimes = steps.map((s) => {
        const t =
          s.durationMode === "snappy" ? 600 : s.durationMode === "normal" ? 1000 : 1500;
        allocatedTime += t;
        return t;
      });

      // Clamp total time
      let scaleRatio = 1;
      if (allocatedTime < MIN_DURATION_MS) scaleRatio = MIN_DURATION_MS / allocatedTime;
      if (allocatedTime > MAX_DURATION_MS) scaleRatio = MAX_DURATION_MS / allocatedTime;

      let currentTimeCounter = 0;

      steps.forEach((step, index) => {
        const id = setTimeout(() => {
          setCurrentStepText(step.message);
          setProgress(((index + 1) / totalSteps) * 100);

          // If last step, trigger complete shortly afterwards
          if (index === totalSteps - 1) {
            const finalId = setTimeout(() => {
              setIsReasoning(false);
              onComplete();
            }, (stepTimes[index] * scaleRatio) / 2); // linger on final message
            timeoutIds.current.push(finalId);
          }
        }, currentTimeCounter);

        timeoutIds.current.push(id);
        currentTimeCounter += stepTimes[index] * scaleRatio;
      });
    },
    []
  );

  const cancelSequence = useCallback(() => {
    cleanup();
    setIsReasoning(false);
    setProgress(0);
  }, []);

  return {
    isReasoning,
    currentStepText,
    progress,
    currentType,
    startSequence,
    cancelSequence,
  };
}
