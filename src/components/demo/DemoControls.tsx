import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import { useDemoMode } from '../../hooks/useDemoMode';
import { useSim } from '../../sim/store';
import { Play, Pause, FastForward, RotateCcw, AlertTriangle, Zap, Maximize2, SkipForward } from 'lucide-react';

export function DemoControls() {
  const { 
    demoVisible, 
    controlsHidden, 
    autoPlay, 
    toggleAutoPlay,
    toggleDemo,
    reset,
    triggerOutage,
    triggerJourney,
    caption,
    progress
  } = useDemoMode();

  const { state, engine } = useSim();

  if (controlsHidden) return null;

  return (
    <>
      {/* Floating toggle pill */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-2">
        {!demoVisible && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={toggleDemo}
            className="bg-navy-900/90 backdrop-blur border border-white/20 text-white text-xs font-bold px-4 py-2 rounded-full shadow-2xl flex items-center gap-2 hover:bg-navy-800 transition-colors"
          >
            <kbd className="bg-white/20 rounded px-1.5 py-0.5 font-mono text-[10px]">D</kbd>
            Demo Controller
          </motion.button>
        )}
      </div>

      {/* Control Panel */}
      <AnimatePresence>
        {demoVisible && (
          <motion.div
            key="demo-panel"
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            className="fixed bottom-6 right-6 z-[200] bg-slate-900/95 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl w-[360px] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-black/20">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-white font-bold text-sm tracking-wide">Director</span>
              </div>
              <button onClick={toggleDemo} className="w-6 h-6 flex items-center justify-center rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors">✕</button>
            </div>

            <div className="p-4 space-y-4">
              {/* Playback Controls */}
              <div className="bg-black/30 rounded-xl p-2 flex items-center justify-between">
                <button
                  onClick={toggleAutoPlay}
                  className={clsx(
                    'flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all flex-1',
                    autoPlay ? 'bg-saffron-500 text-white shadow-lg shadow-saffron-500/20' : 'bg-white/5 text-white hover:bg-white/10'
                  )}
                >
                  {autoPlay ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                  {autoPlay ? 'Pause Demo' : 'Auto-Play Demo'}
                </button>
              </div>

              {/* Simulation Speed */}
              <div className="flex items-center gap-2 bg-black/20 rounded-xl p-1">
                {[0.5, 1, 2, 4].map(s => (
                  <button
                    key={s}
                    onClick={() => engine.setSpeed(s as any)}
                    className={clsx(
                      'flex-1 py-1.5 rounded-lg text-xs font-semibold transition-colors',
                      state.speed === s ? 'bg-white/20 text-white' : 'text-white/40 hover:text-white/80 hover:bg-white/5'
                    )}
                  >
                    {s}x
                  </button>
                ))}
              </div>

              {/* Quick Actions */}
              <div className="space-y-2">
                <div className="text-[10px] uppercase font-bold text-white/30 tracking-widest px-1">Scenarios</div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={triggerJourney}
                    className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all group"
                  >
                    <Zap className="w-5 h-5 text-verified-400 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-medium text-white/80">Start Journey</span>
                  </button>
                  <button
                    onClick={triggerOutage}
                    className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all group"
                  >
                    <AlertTriangle className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-medium text-white/80">Rev Outage</span>
                  </button>
                </div>
              </div>

              {/* Reset */}
              <button onClick={reset} className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold text-white/40 hover:text-white hover:bg-white/10 transition-colors mt-2">
                <RotateCcw className="w-3.5 h-3.5" /> Reset Environment
              </button>
            </div>
            
            {/* Keyboard Shortcuts Footer */}
            <div className="bg-black/40 px-4 py-2 flex items-center justify-between text-[10px] text-white/30">
              <div className="flex gap-3">
                <span><kbd className="font-mono bg-white/10 px-1 py-0.5 rounded text-white/50">Space</kbd> Play</span>
                <span><kbd className="font-mono bg-white/10 px-1 py-0.5 rounded text-white/50">D</kbd> Hide</span>
              </div>
              <div>SIH 2026 Prototype</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Presentation Captions (Lower Third) */}
      <AnimatePresence>
        {caption && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[150] max-w-4xl w-full px-8 pointer-events-none"
          >
            <div className="bg-navy-900/80 backdrop-blur-xl border-t-4 border-saffron-500 rounded-2xl shadow-2xl overflow-hidden flex">
              <div className="bg-saffron-500 flex items-center justify-center px-6 shrink-0">
                <span className="text-4xl">💡</span>
              </div>
              <div className="p-6">
                <p className="text-2xl font-bold text-white leading-snug tracking-wide shadow-black/50 drop-shadow-md">
                  {caption}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Progress Bar (Top) */}
      {autoPlay && (
        <div className="fixed top-0 left-0 right-0 h-1.5 bg-black/20 z-[300]">
          <motion.div 
            className="h-full bg-saffron-500" 
            style={{ width: \`\${progress * 100}%\` }}
            layout
          />
        </div>
      )}
    </>
  );
}
