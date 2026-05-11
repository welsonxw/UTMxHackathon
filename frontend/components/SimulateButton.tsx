'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface SimulateButtonProps {
  onSimulate:  () => void;
  isSimulated: boolean;
  isAnimating: boolean;
  personaName?: string;
}

export default function SimulateButton({
  onSimulate,
  isSimulated,
  isAnimating,
  personaName,
}: SimulateButtonProps) {
  const disabled = isSimulated || isAnimating;

  return (
    <div className="flex flex-col items-center gap-3">
      <motion.button
        onClick={disabled ? undefined : onSimulate}
        disabled={disabled}
        whileTap={disabled ? undefined : { scale: 0.97 }}
        whileHover={disabled ? undefined : { scale: 1.02 }}
        className={`relative px-8 py-3.5 rounded-2xl font-semibold text-base transition-all duration-200 overflow-hidden ${
          isSimulated
            ? 'bg-slate-800 text-emerald-400 border border-emerald-800 cursor-default'
            : isAnimating
            ? 'bg-emerald-800 text-emerald-200 cursor-wait'
            : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/40 cursor-pointer'
        }`}
      >
        {/* Shimmer sweep on click */}
        {isAnimating && (
          <motion.span
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
            initial={{ x: '-100%' }}
            animate={{ x: '200%' }}
            transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
          />
        )}

        <AnimatePresence mode="wait">
          {isSimulated ? (
            <motion.span
              key="done"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2"
            >
              <span>✓</span> Simulated
            </motion.span>
          ) : isAnimating ? (
            <motion.span
              key="running"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2"
            >
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                style={{ display: 'inline-block' }}
              >
                ◌
              </motion.span>
              Simulating…
            </motion.span>
          ) : (
            <motion.span
              key="idle"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2"
            >
              <span>✦</span> Simulate this week
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {isSimulated && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-xs text-emerald-500 text-center"
          >
            {personaName
              ? `${personaName.split(' ')[0]}'s week simulated — deltas visible above`
              : 'Week simulated — deltas visible above'}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
