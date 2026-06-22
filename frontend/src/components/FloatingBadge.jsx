import React from 'react';
import { motion } from 'framer-motion';

function FloatingBadge({ icon, text, delay = 0 }) {
  return (
    <motion.div 
      className="floating-badge"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay, duration: 0.6, type: "spring" }}
      whileHover={{ y: -5 }}
    >
      {icon}
      <span>{text}</span>
    </motion.div>
  );
}

export default FloatingBadge;
