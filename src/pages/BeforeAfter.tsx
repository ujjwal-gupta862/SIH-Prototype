import { useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useApp } from '../context/AppContext';

function AnimatedNumber({ from, to, suffix = '' }: { from: number; to: number; suffix?: string }) {
  const count = useMotionValue(from);
  const spring = useSpring(count, { stiffness: 60, damping: 25 });
  const rounded = useTransform(spring, v => Math.round(v).toLocaleString() + suffix);

  useEffect(() => {
    const t = setTimeout(() => count.set(to), 300);
    return () => clearTimeout(t);
  }, [to, count]);

  return <motion.span>{rounded}</motion.span>;
}

const BEFORE = [
  { icon: '🔗', label: 'Portals', val: 4, suffix: '' },
  { icon: '🔐', label: 'Logins Required', val: 4, suffix: '' },
  { icon: '📄', label: 'Document Uploads', val: 9, suffix: '' },
  { icon: '⏱', label: 'Average Wait', val: 45, suffix: ' days' },
  { icon: '📊', label: 'Visibility', val: 0, suffix: '%' },
  { icon: '🔄', label: 'Dept Coordination', val: 0, suffix: '%' },
];

const AFTER = [
  { icon: '🎫', label: 'Case Passport', val: 1, suffix: '' },
  { icon: '🔓', label: 'Logins Required', val: 1, suffix: '' },
  { icon: '📤', label: 'Document Uploads', val: 0, suffix: '' },
  { icon: '🚀', label: 'Average Wait', val: 10, suffix: ' days' },
  { icon: '📡', label: 'Visibility', val: 100, suffix: '%' },
  { icon: '⚡', label: 'Dept Coordination', val: 100, suffix: '%' },
];

export default function BeforeAfter() {
  const { state } = useApp();
  const lang = state.language;
  const t = (en: string, mr: string) => lang === 'en' ? en : mr;

  return (
    <div className="h-full bg-slate-50 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="text-center py-8 shrink-0">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-black text-navy-900 mb-2">
            {t('The SUTRADHAR Impact', 'SUTRADHAR चा प्रभाव')}
          </h1>
          <p className="text-slate-500 text-lg">
            {t('Before vs. With SUTRADHAR — Government Digital Platform Interoperability', 'पूर्वी विरुद्ध SUTRADHAR सह')}
          </p>
        </motion.div>
      </div>

      {/* Split Screen */}
      <div className="flex-1 grid grid-cols-2 gap-0 mx-8 mb-8 rounded-2xl overflow-hidden shadow-2xl border border-slate-100">
        {/* Before – Left */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="bg-slate-800 p-8 flex flex-col"
        >
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-red-900/30 border border-red-700/40 rounded-full px-4 py-1.5 mb-3">
              <span className="w-2 h-2 rounded-full bg-red-500" />
              <span className="text-red-400 text-sm font-bold">{t('Today — Without SUTRADHAR', 'आज — SUTRADHAR शिवाय')}</span>
            </div>
            <h2 className="text-white text-2xl font-black">😓 {t('4 Portals, 4 Logins', '4 पोर्टल, 4 लॉगिन')}</h2>
            <p className="text-slate-400 text-sm mt-1">{t('Rohan must visit every department separately', 'रोहनला प्रत्येक विभागात वेगळे जावे लागते')}</p>
          </div>

          {/* Journey diagram - before */}
          <div className="flex-1 flex flex-col gap-3">
            {[
              { dept: 'Revenue Portal', action: 'Login #1 · Upload income proof · Upload land record · Wait 15 days', color: 'bg-red-900/30 border-red-700/30' },
              { dept: 'Social Justice Portal', action: 'Login #2 · Re-upload Aadhaar · Upload caste cert · Wait 10 days', color: 'bg-red-900/30 border-red-700/30' },
              { dept: 'Higher Education Portal', action: 'Login #3 · Re-upload all docs · Re-enter details · Wait 12 days', color: 'bg-red-900/30 border-red-700/30' },
              { dept: 'DBT Portal', action: 'Login #4 · Re-verify bank details · Manual processing · Wait 8 days', color: 'bg-red-900/30 border-red-700/30' },
            ].map((step, i) => (
              <motion.div
                key={step.dept}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className={`border rounded-xl p-3 ${step.color}`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-5 h-5 rounded-full bg-red-700 flex items-center justify-center text-red-200 text-[10px] font-bold shrink-0">{i + 1}</span>
                  <span className="text-red-300 font-bold text-xs">{step.dept}</span>
                </div>
                <p className="text-slate-400 text-xs pl-7 leading-relaxed">{step.action}</p>
              </motion.div>
            ))}

            {/* Before KPIs */}
            <div className="grid grid-cols-3 gap-3 mt-auto pt-4">
              {BEFORE.map((b, i) => (
                <motion.div
                  key={b.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 + i * 0.08 }}
                  className="bg-slate-700 rounded-xl p-3 text-center"
                >
                  <div className="text-2xl">{b.icon}</div>
                  <div className="text-2xl font-black text-red-400 mt-1">
                    <AnimatedNumber from={0} to={b.val} suffix={b.suffix} />
                  </div>
                  <div className="text-slate-400 text-[10px] mt-0.5 leading-tight">{b.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Divider */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.6, type: 'spring', stiffness: 200 }}
            className="w-14 h-14 rounded-full bg-saffron-500 shadow-xl flex items-center justify-center text-white font-black text-xs border-4 border-white"
          >
            VS
          </motion.div>
        </div>

        {/* After – Right */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="bg-gradient-to-br from-navy-800 to-navy-700 p-8 flex flex-col"
        >
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-verified-500/20 border border-verified-400/40 rounded-full px-4 py-1.5 mb-3">
              <span className="w-2 h-2 rounded-full bg-verified-400 animate-pulse" />
              <span className="text-verified-300 text-sm font-bold">{t('With SUTRADHAR', 'SUTRADHAR सह')}</span>
            </div>
            <h2 className="text-white text-2xl font-black">🚀 {t('One Case Passport', 'एक केस पासपोर्ट')}</h2>
            <p className="text-navy-300 text-sm mt-1">{t('Rohan applies once, SUTRADHAR does the rest', 'रोहन एकदाच अर्ज करतो, SUTRADHAR बाकी करते')}</p>
          </div>

          <div className="flex-1 flex flex-col gap-3">
            {/* Single journey */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-saffron-500/20 border border-saffron-400/30 rounded-xl p-4 text-center"
            >
              <div className="text-3xl mb-2">🎫</div>
              <div className="text-xl font-black text-saffron-300 mb-1">SUT-2026-004821</div>
              <p className="text-navy-300 text-sm">{t('One application. One Case ID. Zero re-uploads.', 'एक अर्ज. एक केस ID. पुन: अपलोड नाही.')}</p>
            </motion.div>

            {/* Auto-flow */}
            <div className="flex-1 bg-navy-900/30 rounded-xl p-4">
              <p className="text-navy-300 text-xs font-bold mb-3">⚡ {t('SUTRADHAR auto-flows:', 'SUTRADHAR स्वयंचलित प्रवाह:')}</p>
              {[
                { step: '1', text: t('Fetches income & land from Revenue (SOAP, retried safely)', 'महसूलकडून उत्पन्न मिळवते (SOAP, सुरक्षित retry)'), done: true },
                { step: '2', text: t('Fetches caste category from Social Justice (REST)', 'सामाजिक न्यायाकडून जात मिळवते'), done: true },
                { step: '3', text: t('Smart Refers to Higher Ed with pre-verified facts', 'उच्च शिक्षणास स्मार्ट रेफरल'), done: true },
                { step: '4', text: t('DBT transfer: ₹25,000 to Rohan\'s bank account', 'DBT: ₹25,000 बँकेत जमा'), done: false },
              ].map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + i * 0.12 }}
                  className="flex items-center gap-3 mb-2 last:mb-0"
                >
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${s.done ? 'bg-verified-500 text-white' : 'bg-saffron-500 text-white'}`}>
                    {s.done ? '✓' : s.step}
                  </div>
                  <p className="text-navy-200 text-xs">{s.text}</p>
                </motion.div>
              ))}
            </div>

            {/* After KPIs */}
            <div className="grid grid-cols-3 gap-3">
              {AFTER.map((a, i) => (
                <motion.div
                  key={a.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.9 + i * 0.08 }}
                  className="bg-navy-900/40 rounded-xl p-3 text-center border border-verified-500/20"
                >
                  <div className="text-2xl">{a.icon}</div>
                  <div className="text-2xl font-black text-verified-400 mt-1">
                    <AnimatedNumber from={0} to={a.val} suffix={a.suffix} />
                  </div>
                  <div className="text-navy-300 text-[10px] mt-0.5 leading-tight">{a.label}</div>
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
        transition={{ delay: 1.2 }}
        className="text-center pb-6 shrink-0"
      >
        <p className="text-2xl font-black text-navy-900">
          {t('"One Case. Every Department."', '"एक केस. प्रत्येक विभाग."')}
        </p>
        <p className="text-slate-500 mt-1">SUTRADHAR · PS SIH26129 · Team Last Commit · Smart India Hackathon 2026</p>
      </motion.div>
    </div>
  );
}
