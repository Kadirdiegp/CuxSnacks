import React from 'react';
import { motion } from "framer-motion";

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ 
          opacity: [0, 1, 1, 0],
          scale: [0.8, 1.1, 0.9, 1.1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="relative"
      >
        <img
          src="/Cuxsnacklogo.png"
          alt="Cuxsnack Logo"
          className="w-32 h-32 object-contain"
        />
        <motion.div
          className="absolute inset-0 border-2 border-white rounded-lg"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ 
            opacity: [0, 1, 0],
            scale: [0.8, 1.2, 1.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </motion.div>
    </div>
  );
}
