"use client";

import { motion } from "framer-motion";

export function FloatingElements() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        animate={{ y: [0, -30, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[15%] left-[10%] w-16 h-16 border-3 border-primary-container/30 bg-primary-container/5"
        style={{ borderWidth: 3 }}
      />
      <motion.div
        animate={{ y: [0, 20, 0], rotate: [0, -8, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute top-[25%] right-[15%] w-12 h-12 border-3 border-on-surface/20 bg-primary-container/10"
        style={{ borderWidth: 3 }}
      />
      <motion.div
        animate={{ y: [0, -15, 0], x: [0, 10, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-[30%] left-[20%] w-8 h-8 bg-primary-container/20 border-2 border-primary-container/40"
        style={{ borderWidth: 2 }}
      />
      <motion.div
        animate={{ y: [0, 25, 0], rotate: [0, 12, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        className="absolute top-[60%] right-[25%] w-20 h-20 border-2 border-on-surface/10"
        style={{ borderWidth: 2 }}
      />
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.3, 0.1] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[40%] left-[5%] w-6 h-6 bg-primary-container rounded-full"
      />
      <motion.div
        animate={{ y: [0, -20, 0], rotate: [0, -5, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        className="absolute bottom-[20%] right-[10%] w-14 h-14 border-3 border-primary-container/20"
        style={{ borderWidth: 3 }}
      />
      <motion.div
        animate={{ y: [0, 15, 0], x: [0, -15, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
        className="absolute top-[10%] left-[45%] w-10 h-10 bg-primary-container/5 border-2 border-on-surface/15"
        style={{ borderWidth: 2 }}
      />
    </div>
  );
}
