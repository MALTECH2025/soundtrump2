
import React from "react";
import { motion } from "framer-motion";

interface AnimatedTransitionProps {
  children: React.ReactNode;
  className?: string;
}

export const AnimatedTransition = ({ 
  children, 
  className = ""
}: AnimatedTransitionProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
