import { Variants } from 'framer-motion';

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

export const scaleReveal: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.35, ease: 'easeOut' } },
};

export const shimmerPulse: Variants = {
  hidden: { opacity: 0.6 },
  visible: {
    opacity: 1,
    transition: {
      repeat: Infinity,
      duration: 1.6,
      repeatType: 'reverse',
      ease: 'easeInOut',
    },
  },
};
