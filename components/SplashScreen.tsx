'use client';

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function SplashScreen({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0);
  const [out, setOut] = useState(false);

  useEffect(() => {
    const iv = setInterval(() => setProgress(p => Math.min(p + 2.6, 100)), 48);
    const t1 = setTimeout(() => setOut(true), 2300);
    const t2 = setTimeout(onDone, 2800);
    return () => { clearInterval(iv); clearTimeout(t1); clearTimeout(t2); };
  }, [onDone]);

  return (
    <AnimatePresence>
      {!out && (
        <motion.div
          key="splash"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.03 }}
          transition={{ duration: 0.55, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] bg-black flex items-center justify-center overflow-hidden select-none"
        >
          {/* Vertical crosshair line */}
          <motion.div
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="absolute left-1/2 top-0 bottom-0 w-px bg-white/[0.07] -translate-x-1/2 origin-center"
          />

          {/* Tick mark above center */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="absolute left-1/2 -translate-x-1/2"
            style={{ top: "calc(50% - 108px)" }}
          >
            <div className="w-4 h-px bg-white/18" />
          </motion.div>

          {/* Tick mark below center */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="absolute left-1/2 -translate-x-1/2"
            style={{ top: "calc(50% + 108px)" }}
          >
            <div className="w-4 h-px bg-white/18" />
          </motion.div>

          {/* Center cluster: logo + flanking text */}
          <div className="relative flex items-center justify-center">
            {/* Star logo with gradient sheen */}
            <motion.div
              initial={{ scale: 0.3, opacity: 0, rotate: -15 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ duration: 1.1, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="w-[72px] h-[72px] relative z-10"
            >
              <svg viewBox="0 0 60 60" fill="none" className="w-full h-full drop-shadow-[0_0_24px_rgba(96,165,250,0.35)]">
                <defs>
                  <linearGradient id="sg" x1="0" y1="0" x2="60" y2="60" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#93c5fd" />
                    <stop offset="40%" stopColor="#e2e8f0" />
                    <stop offset="100%" stopColor="#60a5fa" />
                  </linearGradient>
                </defs>
                {/* 6-pointed asterisk / star */}
                <path d="M30 5L33.6 24L52 18.5L38.5 30L52 41.5L33.6 36L30 55L26.4 36L8 41.5L21.5 30L8 18.5L26.4 24L30 5Z"
                  fill="url(#sg)" />
              </svg>
            </motion.div>

            {/* Left: percentage */}
            <motion.div
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="absolute right-[calc(100%+28px)] text-right"
            >
              <span className="text-[13px] text-white/35 font-mono tabular-nums tracking-widest">
                {Math.floor(progress)}%
              </span>
            </motion.div>

            {/* Right: "loading." */}
            <motion.div
              initial={{ opacity: 0, x: 6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="absolute left-[calc(100%+28px)]"
            >
              <span className="text-[13px] text-white/35 font-mono tracking-widest">loading.</span>
            </motion.div>
          </div>

          {/* App name — very subtle at bottom */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
            className="absolute bottom-8 text-[9px] font-semibold uppercase tracking-[0.3em] text-white/18"
          >
            Spectrum AI
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
