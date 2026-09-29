import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import { useDemoMode } from '../../hooks/useDemoMode';
import { useApp } from '../../context/AppContext';
import { DEMO_STEPS } from '../../data/mockData';

export function DemoControls() {
  const { state, dispatch } = useApp();
  const { demoVisible, controlsHidden, autoPlay, demoStep, goNext, reset, goTo, currentStep } = useDemoMode();

  if (controlsHidden) return null;

  return (
    <>
      {/* Floating toggle pill */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-2">
        {!demoVisible && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => dispatch({ type: 'TOGGLE_DEMO' })}
            className="bg-navy-800/90 backdrop-blur text-white text-xs font-semibold px-4 py-2 rounded-full shadow-lg flex items-center gap-2 hover:bg-navy-700 transition-colors"
          >
            <kbd className="bg-white/20 rounded px-1.5 py-0.5 font-mono text-[10px]">D</kbd>
            Demo Controls
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
            className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[200] bg-navy-900/95 backdrop-blur border border-white/10 rounded-2xl shadow-2xl w-[720px] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/10">
              <div className="flex items-center gap-3">
                <span className="text-saffron-400 font-bold text-sm">🎬 Demo Mode</span>
                <span className="bg-saffron-500/20 text-saffron-300 text-[10px] font-semibold px-2 py-0.5 rounded">SIH 2026 · Last Commit</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => dispatch({ type: 'TOGGLE_AUTO_PLAY' })}
                  className={clsx(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors',
                    autoPlay ? 'bg-saffron-500 text-white' : 'bg-white/10 text-white/70 hover:bg-white/20'
                  )}
                >
                  {autoPlay ? '⏸ Auto-Play ON' : '▶ Auto-Play'}
                </button>
                <button onClick={reset} className="px-3 py-1.5 rounded-lg bg-white/10 text-white/70 hover:bg-white/20 text-xs font-semibold transition-colors">
                  <kbd className="font-mono text-[10px] mr-1">R</kbd> Reset
                </button>
                <button onClick={goNext} className="px-3 py-1.5 rounded-lg bg-white/10 text-white/70 hover:bg-white/20 text-xs font-semibold transition-colors">
                  Next <kbd className="font-mono text-[10px] ml-1">N</kbd>
                </button>
                <button onClick={() => dispatch({ type: 'TOGGLE_DEMO' })} className="w-7 h-7 flex items-center justify-center rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors text-sm">✕</button>
              </div>
            </div>

            {/* Steps */}
            <div className="p-4">
              <div className="flex gap-2 flex-wrap">
                {DEMO_STEPS.map((step, i) => (
                  <button
                    key={step.id}
                    onClick={() => goTo(i)}
                    className={clsx(
                      'flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all',
                      i === demoStep
                        ? 'bg-saffron-500 text-white shadow-lg scale-105'
                        : i < demoStep
                        ? 'bg-verified-500/20 text-verified-300 hover:bg-verified-500/30'
                        : 'bg-white/10 text-white/60 hover:bg-white/20 hover:text-white/90'
                    )}
                  >
                    <span className={clsx('w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0',
                      i === demoStep ? 'bg-white text-saffron-600' : i < demoStep ? 'bg-verified-500 text-white' : 'bg-white/20 text-white/60'
                    )}>
                      {i < demoStep ? '✓' : i + 1}
                    </span>
                    {step.label}
                  </button>
                ))}
              </div>

              {/* Current step tip */}
              <div className="mt-3 bg-white/5 rounded-xl px-4 py-2.5 flex items-start gap-3">
                <span className="text-saffron-400 shrink-0 mt-0.5">💡</span>
                <div>
                  <p className="text-white/90 text-xs font-semibold">{currentStep?.label}</p>
                  <p className="text-white/50 text-xs mt-0.5">{currentStep?.tip}</p>
                </div>
                <div className="ml-auto text-white/30 text-xs shrink-0">
                  {demoStep + 1} / {DEMO_STEPS.length}
                </div>
              </div>
            </div>

            {/* Keyboard Shortcuts */}
            <div className="flex items-center gap-4 px-5 pb-3 text-[10px] text-white/30 border-t border-white/5 pt-2">
              <span><kbd className="font-mono bg-white/10 px-1.5 py-0.5 rounded text-white/50">D</kbd> Toggle panel</span>
              <span><kbd className="font-mono bg-white/10 px-1.5 py-0.5 rounded text-white/50">N</kbd> Next scene</span>
              <span><kbd className="font-mono bg-white/10 px-1.5 py-0.5 rounded text-white/50">R</kbd> Reset</span>
              <span><kbd className="font-mono bg-white/10 px-1.5 py-0.5 rounded text-white/50">A</kbd> Auto-play</span>
              <span><kbd className="font-mono bg-white/10 px-1.5 py-0.5 rounded text-white/50">H</kbd> Hide all</span>
              <div className="ml-auto flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-verified-400 animate-pulse" />
                <span className="text-white/30">{autoPlay ? 'Auto-advancing every 9s' : 'Manual navigation'}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Prototype badge (always visible, bottom-right) */}
      {!controlsHidden && (
        <div className="fixed bottom-4 right-4 z-[190] flex items-center gap-1.5 bg-navy-900/80 backdrop-blur border border-white/10 rounded-full px-3 py-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-saffron-400 animate-pulse" />
          <span className="text-white/60 text-[10px] font-medium">Prototype · Synthetic data · SIH 2026</span>
        </div>
      )}
    </>
  );
}
