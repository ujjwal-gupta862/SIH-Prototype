import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import { useApp } from '../context/AppContext';
import { CASE_STAGES, CASE_ID } from '../data/mockData';
import { Card, Badge, StatusChip } from '../components/ui';
import { simulateSoapTimeout, simulateSoapRetry } from '../hooks/useSimApi';

const DEPT_ICONS: Record<string, string> = {
  'Citizen Portal': '👤',
  'SUTRADHAR Engine': '⚡',
  'Revenue + Social Justice': '🏛',
  'Higher Education Dept': '🎓',
  'SUTRADHAR': '🔔',
  'DBT / Treasury': '💰',
  'Audit System': '🔐',
};

const SLA_BARS = [
  { dept: 'Revenue', used: 80, total: 100, label: '2d used / 2d SLA', status: 'warning' },
  { dept: 'Social Justice', used: 45, total: 100, label: '1d used / 2d SLA', status: 'ok' },
  { dept: 'Higher Education', used: 30, total: 100, label: '10h used / 3d SLA', status: 'ok' },
  { dept: 'DBT / Treasury', used: 0, total: 100, label: 'Awaiting', status: 'pending' },
];

export default function CaseTracker() {
  const { state, dispatch, addToast } = useApp();
  const lang = state.language;
  const retryPhase = state.retryPhase;
  const retryRan = useRef(false);

  // Trigger SOAP retry simulation once
  useEffect(() => {
    if (retryRan.current) return;
    retryRan.current = true;

    const run = async () => {
      await new Promise(r => setTimeout(r, 2000));
      dispatch({ type: 'SET_RETRY_PHASE', phase: 'timeout' });
      addToast({ type: 'error', title: 'Revenue SOAP Timeout', message: 'MahaRevenue eSetu did not respond within 30s. Initiating retry 1/3…' });

      await simulateSoapTimeout();
      dispatch({ type: 'SET_RETRY_PHASE', phase: 'retrying' });
      addToast({ type: 'warning', title: 'SOAP Retry 2/3', message: 'Retrying Revenue SOAP endpoint. Exponential back-off: 4s.' });

      await simulateSoapRetry();
      dispatch({ type: 'SET_RETRY_PHASE', phase: 'recovered' });
      addToast({ type: 'success', title: 'SOAP Recovered ✓', message: 'Income certificate fetched successfully. Case continues.' });
    };

    if (retryPhase === 'idle') run();
  }, []); // eslint-disable-line

  const t = (en: string, mr: string) => lang === 'en' ? en : mr;

  const stages = CASE_STAGES.map((s, i) => {
    // Inject exception state into stage 1 (Intelligent Routing)
    if (i === 1 && retryPhase !== 'idle' && retryPhase !== 'recovered') {
      return { ...s, status: 'exception' as const };
    }
    return s;
  });

  return (
    <div className="h-full bg-slate-50 p-6 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-xl font-black text-navy-900">{t('Case Tracker', 'केस ट्रॅकर')}</h1>
            <div className="flex items-center gap-1.5 bg-saffron-50 border border-saffron-200 rounded-lg px-3 py-1">
              <span className="text-saffron-600 font-bold text-sm">{CASE_ID}</span>
            </div>
          </div>
          <p className="text-slate-500 text-sm">Post-Matric OBC Scholarship · {t('Rohan Patil', 'रोहन पाटील')}</p>
        </div>
        <div className="flex items-center gap-3">
          <StatusChip status="active" />
          <Badge variant="warning">SLA: 2 days left</Badge>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-5">
        {/* Timeline */}
        <div className="col-span-6">
          <Card className="p-6 h-full">
            <h2 className="text-sm font-bold text-navy-900 mb-5">{t('7-Stage Workflow', '7-टप्पा कार्यप्रवाह')}</h2>
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-6 top-6 bottom-0 w-0.5 bg-slate-100" />

              <div className="space-y-2">
                {stages.map((stage, i) => (
                  <motion.div
                    key={stage.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="relative pl-14"
                  >
                    {/* Stage dot */}
                    <div className={clsx(
                      'absolute left-4 w-5 h-5 rounded-full border-2 flex items-center justify-center -translate-x-1/2 z-10',
                      stage.status === 'completed' ? 'bg-verified-500 border-verified-500' :
                      stage.status === 'active'    ? 'bg-saffron-500 border-saffron-500' :
                      stage.status === 'exception' ? 'bg-danger-500 border-danger-500 animate-pulse' :
                      'bg-white border-slate-200'
                    )}>
                      {stage.status === 'completed' && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>}
                      {stage.status === 'active'    && <div className="w-2 h-2 rounded-full bg-white animate-pulse" />}
                      {stage.status === 'exception' && <span className="text-white text-[10px] font-bold">!</span>}
                      {stage.status === 'pending'   && <div className="w-2 h-2 rounded-full bg-slate-200" />}
                    </div>

                    {/* Content */}
                    <div className={clsx(
                      'rounded-xl p-3 mb-2 border transition-all',
                      stage.status === 'completed' ? 'bg-verified-50/30 border-verified-100' :
                      stage.status === 'active'    ? 'bg-saffron-50 border-saffron-200 shadow-sm' :
                      stage.status === 'exception' ? 'bg-red-50 border-red-200 shadow-sm' :
                      'bg-slate-50 border-slate-100'
                    )}>
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div className="flex items-center gap-2">
                          <span>{DEPT_ICONS[stage.dept] || '🔹'}</span>
                          <span className={clsx('text-sm font-bold',
                            stage.status === 'completed' ? 'text-verified-700' :
                            stage.status === 'active'    ? 'text-saffron-700' :
                            stage.status === 'exception' ? 'text-red-700' :
                            'text-slate-400'
                          )}>
                            {lang === 'en' ? stage.label : stage.labelMarathi}
                          </span>
                        </div>
                        <StatusChip status={stage.status === 'exception' && retryPhase === 'recovered' ? 'completed' : stage.status} />
                      </div>
                      {stage.timestamp && (
                        <p className="text-[10px] text-slate-400 mb-1">{stage.timestamp}</p>
                      )}
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {lang === 'en' ? stage.details : stage.detailsMarathi}
                      </p>

                      {/* Exception inline indicator */}
                      {i === 1 && retryPhase !== 'idle' && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="mt-2 pt-2 border-t border-red-200"
                        >
                          <div className="flex items-center gap-2 text-xs">
                            <span className={clsx('w-2 h-2 rounded-full shrink-0',
                              retryPhase === 'timeout'   ? 'bg-danger-500 animate-pulse' :
                              retryPhase === 'retrying'  ? 'bg-warning-500 animate-pulse' :
                              'bg-verified-500'
                            )} />
                            <span className={clsx(
                              retryPhase === 'timeout'   ? 'text-red-600' :
                              retryPhase === 'retrying'  ? 'text-amber-600' :
                              'text-verified-600'
                            )}>
                              {retryPhase === 'timeout'  ? '⚠ SOAP timeout — retry 1/3' :
                               retryPhase === 'retrying' ? '🔄 SOAP retry 2/3 — back-off 4s' :
                               '✓ SOAP retry 2/3 recovered'}
                            </span>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Right column */}
        <div className="col-span-6 flex flex-col gap-5">
          {/* SLA Dashboard */}
          <Card className="p-5">
            <h2 className="text-sm font-bold text-navy-900 mb-4">{t('SLA Status', 'SLA स्थिती')}</h2>
            <div className="space-y-3">
              {SLA_BARS.map(bar => (
                <div key={bar.dept}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-medium text-navy-700">{bar.dept}</span>
                    <span className={clsx('text-xs font-semibold',
                      bar.status === 'warning' ? 'text-warning-600' :
                      bar.status === 'ok' ? 'text-verified-600' : 'text-slate-400'
                    )}>{bar.label}</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${bar.used}%` }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                      className={clsx('h-full rounded-full',
                        bar.status === 'warning' ? 'bg-warning-500' :
                        bar.status === 'ok' ? 'bg-verified-500' : 'bg-slate-200'
                      )}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Exception Log */}
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-navy-900">{t('Exception Log', 'अपवाद नोंद')}</h2>
              <AnimatePresence>
                {retryPhase !== 'idle' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                  >
                    <Badge variant={retryPhase === 'recovered' ? 'verified' : retryPhase === 'retrying' ? 'warning' : 'danger'}>
                      {retryPhase === 'recovered' ? 'Resolved' : retryPhase === 'retrying' ? 'Retrying' : 'Active'}
                    </Badge>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <AnimatePresence>
              {retryPhase === 'idle' ? (
                <p className="text-sm text-slate-400 text-center py-4">{t('Monitoring for exceptions…', 'अपवादांसाठी देखरेख…')}</p>
              ) : (
                <div className="space-y-2">
                  {[
                    {
                      time: '08:51:22', type: 'timeout', msg: 'MahaRevenue SOAP API — 504 Gateway Timeout',
                      show: true,
                    },
                    {
                      time: '08:51:55', type: 'retry', msg: 'Retry 1/3 initiated — exponential back-off 2s',
                      show: retryPhase === 'retrying' || retryPhase === 'recovered',
                    },
                    {
                      time: '08:52:28', type: 'success', msg: 'Retry 2/3 succeeded — income certificate fetched ✓',
                      show: retryPhase === 'recovered',
                    },
                  ].filter(e => e.show).map((e, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={clsx('flex gap-3 p-3 rounded-xl text-xs',
                        e.type === 'timeout' ? 'bg-red-50 border border-red-100' :
                        e.type === 'retry'   ? 'bg-amber-50 border border-amber-100' :
                        'bg-verified-50 border border-verified-100'
                      )}
                    >
                      <span className="font-mono text-slate-400 shrink-0">{e.time}</span>
                      <span className={clsx('font-medium',
                        e.type === 'timeout' ? 'text-red-700' :
                        e.type === 'retry'   ? 'text-amber-700' :
                        'text-verified-700'
                      )}>{e.msg}</span>
                    </motion.div>
                  ))}
                </div>
              )}
            </AnimatePresence>
          </Card>

          {/* Quick Stats */}
          <Card className="p-5">
            <h2 className="text-sm font-bold text-navy-900 mb-3">{t('Case Stats', 'केस आकडेवारी')}</h2>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: t('Departments', 'विभाग'), value: '4', icon: '🏛' },
                { label: t('Facts Verified', 'तथ्ये'), value: '4', icon: '✅' },
                { label: t('Re-uploads', 'पुन: अपलोड'), value: '0', icon: '📂' },
                { label: t('Days Elapsed', 'दिवस'), value: '2', icon: '📅' },
                { label: t('Auto-referrals', 'रेफरल'), value: '3', icon: '↪' },
                { label: t('SLA Remaining', 'SLA शिल्लक'), value: '2d', icon: '⏱' },
              ].map(s => (
                <div key={s.label} className="bg-slate-50 rounded-xl p-3 text-center">
                  <div className="text-xl">{s.icon}</div>
                  <div className="text-xl font-black text-navy-900 mt-1">{s.value}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5 leading-tight">{s.label}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
