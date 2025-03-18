
import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AnimatedTransitionProps {
  children: React.ReactNode;
  location?: string;
  className?: string;
}

const pageVariants = {
  initial: {
    opacity: 0,
    y: 10,
  },
  in: {
    opacity: 1,
    y: 0,
  },
  out: {
    opacity: 0,
    y: -10,
  },
};

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.4,
};

export const AnimatedTransition: React.FC<AnimatedTransitionProps> = ({
  children,
  location,
  className,
}) => {
  // Use a ref to prevent layout shifts during animation
  const containerRef = useRef<HTMLDivElement>(null);
  const key = location || 'page';

  // Set min-height to prevent content jump during page transitions
  useEffect(() => {
    if (containerRef.current) {
      const observer = new ResizeObserver(() => {
        if (containerRef.current) {
          const height = containerRef.current.offsetHeight;
          containerRef.current.style.minHeight = `${height}px`;
        }
      });
      
      observer.observe(containerRef.current);
      
      return () => {
        if (containerRef.current) {
          observer.unobserve(containerRef.current);
        }
      };
    }
  }, []);

  return (
    <div ref={containerRef} className={className}>
      <AnimatePresence mode="wait">
        <motion.div
          key={key}
          initial="initial"
          animate="in"
          exit="out"
          variants={pageVariants}
          transition={pageTransition}
          className="w-full"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default AnimatedTransition;
