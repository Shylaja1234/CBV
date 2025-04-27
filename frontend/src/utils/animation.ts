
export const animationVariants = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.5 }
  },
  fadeInUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
  },
  fadeInDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
  },
  fadeInLeft: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
  },
  fadeInRight: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
  },
  staggerChildren: {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  }
};

export const staggerContainer = (staggerTime = 0.1) => ({
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: staggerTime
    }
  }
});

export const fadeIn = (
  direction: 'up' | 'down' | 'left' | 'right' = 'up',
  duration = 0.5,
  delay = 0,
  ease = [0.22, 1, 0.36, 1]
) => {
  const directions = {
    up: { y: 20 },
    down: { y: -20 },
    left: { x: 20 },
    right: { x: -20 }
  };

  return {
    hidden: {
      opacity: 0,
      ...directions[direction]
    },
    show: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        type: 'tween',
        duration,
        delay,
        ease
      }
    }
  };
};
