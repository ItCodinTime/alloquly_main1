import { Variants } from "framer-motion";

// Standard easing curve (easeInOut)
const easeInOut: [number, number, number, number] = [0.42, 0, 0.58, 1];

// 👇 Fade in and slide up
export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: easeInOut },
  },
};

// 👇 Fade in and slide down
export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: easeInOut },
  },
};

// 👇 Fade in and slide left
export const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: easeInOut },
  },
};

// 👇 Fade in and slide right
export const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: easeInOut },
  },
};

// 👇 Subtle scale-in (for icons or cards)
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: easeInOut },
  },
};

// 👇 Reveal from bottom (for sections)
export const revealFromBottom: Variants = {
  hidden: { opacity: 0, y: 80 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: easeInOut },
  },
};

// 👇 Parent-level staggering (for lists or grids)
export const staggerChildren: Variants = {
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};
