import React, { useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

function AnimatedNumber({ from, to, suffix = '' }: { from: number; to: number; suffix?: string }) {
  const count = useMotionValue(from);
  const spring = useSpring(count, { stiffness: 50, damping: 20 });
  const rounded = useTransform(spring, v => Math.round(v).toLocaleString() + suffix);

  useEffect(() => {
    const t = setTimeout(() => count.set(to), 400);
    return () => clearTimeout(t);
  }, [to, count]);

  return <motion.span>{rounded}</motion.span>;
}

const BEFORE_KPIS = [
  { icon: '🔗', label: 'Portals', val: 4, from: 0 },
  { icon: '📝', label: 'Forms Filled', val: 4, from: 0 },
  { icon: '📄', label: 'Document Uploads', val: 11, from: 0 },
  { icon: '🏢', label: 'Office Visits', val: 3, from: 0 },
  { icon: '⏱', label: 'Average Wait', val: 23, from: 0, suffix: ' days' },
  { icon: '🚫', label: 'Visibility', val: 0, from: 0, suffix: '%' },
];

const AFTER_KPIS = [
  { icon: '🎫', label: 'Case Passport', val: 1, from: 4 },
  { icon: '📝', label: 'Forms Filled', val: 1, from: 4 },
  { icon: '📤', label: 'Re-uploads', val: 0, from: 11 },
  { icon: '🏠', label: 'Office Visits', val: 0, from: 3 },
  { icon: '🚀', label: 'Average Wait', val: 6, from: 23, suffix: ' days' },
  { icon: '📡', label: 'Visibility', val: 100, from: 0, suffix: '%' },
];

export default function BeforeAfter() {
  return (
    <div className="h-full bg-slate-50 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="text-center py-6 shrink-0 z-10">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-black text-navy-900 mb-2 tracking-tight">
            The SUTRADHAR Impact
          </h1>
          <p className="text-slate-500 text-lg font-medium">
            Transforming the citizen experience through interoperability
          </p>
        </motion.div>
      </div>

      {/* Split Screen */}
      <div className="flex-1 grid grid-cols-2 gap-0 mx-8 mb-6 rounded-2xl overflow-hidden shadow-2xl border border-slate-200 relative">
        {/* Before – Left */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="bg-white p-8 flex flex-col border-r border-slate-100 relative overflow-hidden"
        >
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]" />
          
          <div className="text-center mb-8 relative z-10">
            <div className="inline-flex items-center gap-2 bg-red-50 border border-red-100 text-red-600 rounded-full px-4 py-1.5 mb-3 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-red-500" />
              <span className="text-xs font-bold uppercase tracking-widest">Today</span>
            </div>
            <h2 className="text-slate-800 text-3xl font-black tracking-tight">Siloed & Repetitive</h2>
            <p className="text-slate-500 text-sm mt-2">Citizens navigate the bureaucracy, not the service.</p>
          </div>

          <div className="flex-1 flex flex-col justify-center">
            {/* Before KPIs */}
            <div className="grid grid-cols-2 gap-4">
              {BEFORE_KPIS.map((b, i) => (
                <motion.div
                  key={b.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="bg-slate-50 border border-slate-100 rounded-2xl p-5 text-center shadow-sm"
                >
                  <div className="text-3xl mb-2">{b.icon}</div>
                  <div className="text-4xl font-black text-slate-800 tracking-tighter">
                    <AnimatedNumber from={b.from} to={b.val} suffix={b.suffix} />
                  </div>
                  <div className="text-slate-500 text-xs font-bold uppercase tracking-wide mt-2">{b.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Divider badge */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
          <motion.div
            initial={{ scale: 0, opacity: 0, rotate: -180 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ delay: 1, type: 'spring', stiffness: 200, damping: 20 }}
            className="w-16 h-16 rounded-full bg-navy-600 shadow-2xl flex items-center justify-center text-white font-black text-sm border-[6px] border-white"
          >
            VS
          </motion.div>
        </div>

        {/* After – Right */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="bg-gradient-to-br from-navy-900 to-navy-800 p-8 flex flex-col relative overflow-hidden"
        >
          {/* Background decoration */}
          <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-verified-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-64 h-64 bg-saffron-500/20 rounded-full blur-3xl" />

          <div className="text-center mb-8 relative z-10">
            <div className="inline-flex items-center gap-2 bg-verified-500/20 border border-verified-400/30 text-verified-300 rounded-full px-4 py-1.5 mb-3 shadow-inner">
              <span className="w-2 h-2 rounded-full bg-verified-400 animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.8)]" />
              <span className="text-xs font-bold uppercase tracking-widest">With SUTRADHAR</span>
            </div>
            <h2 className="text-white text-3xl font-black tracking-tight">Unified & Invisible</h2>
            <p className="text-navy-200 text-sm mt-2">Data travels so the citizen doesn't have to.</p>
          </div>

          <div className="flex-1 flex flex-col justify-center relative z-10">
            {/* After KPIs */}
            <div className="grid grid-cols-2 gap-4">
              {AFTER_KPIS.map((a, i) => (
                <motion.div
                  key={a.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.2 + i * 0.1 }}
                  className="bg-navy-800/50 backdrop-blur-sm border border-navy-700/50 rounded-2xl p-5 text-center shadow-lg"
                >
                  <div className="text-3xl mb-2">{a.icon}</div>
                  <div className="text-4xl font-black text-white tracking-tighter drop-shadow-md">
                    <AnimatedNumber from={a.from} to={a.val} suffix={a.suffix} />
                  </div>
                  <div className="text-navy-300 text-xs font-bold uppercase tracking-wide mt-2">{a.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom tagline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2 }}
        className="text-center pb-6 shrink-0"
      >
        <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-3 font-semibold">
          * Metrics are illustrative based on simulated data flow
        </p>
        <h3 className="text-3xl font-black text-navy-900 tracking-tight">
          One case. <span className="text-saffron-500">One journey.</span> Every department.
        </h3>
      </motion.div>
    </div>
  );
}
