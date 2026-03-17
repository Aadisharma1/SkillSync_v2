import { SpringOptions, Variants } from "framer-motion";

export const durations = {
  fast: 0.2,
  normal: 0.4,
  slow: 0.8,
  cinematic: 1.5,
};

export const springs = {
  bouncy: {
    type: "spring",
    stiffness: 400,
    damping: 15,
  } as SpringOptions,
  stiff: {
    type: "spring",
    stiffness: 300,
    damping: 30,
  } as SpringOptions,
  smooth: {
    type: "spring",
    stiffness: 100,
    damping: 20,
    mass: 1,
  } as SpringOptions,
};

export const easings = {
  easeOut: [0.25, 1, 0.5, 1],
  easeInOut: [0.65, 0, 0.35, 1],
  anticipate: [0.4, 0, 0.2, 1],
};

export const pageTransitions = {
  initial: { opacity: 0, y: 20, filter: "blur(4px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  exit: { opacity: 0, y: -20, filter: "blur(4px)" },
  transition: { duration: durations.normal, ease: easings.easeOut },
};

export const staggeredContainer: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export const staggeredItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 30 } },
};
