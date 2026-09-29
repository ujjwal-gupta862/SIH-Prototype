import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import { useApp } from '../context/AppContext';
import { OFFICER_QUEUE, VERIFIED_FACTS, CASE_ID } from '../data/mockData';
import { Card, Badge, Button, StatusChip, VerifiedTick, ProtocolBadge, Progress } from '../components/ui';
import { officerApprove } from '../hooks/useSimApi';
import type { OfficerCase } from '../types';

export default function OfficerConsole() {
  const { state, dispatch, addToast } = useApp();
  const lang = state.language;
  const [selectedCase, setSelectedCase] = useState<OfficerCase>(OFFICER_QUEUE[0]);
  const [approving, setApproving] = useState(false);
  const [showReferralAnim, setShowReferralAnim] = useState(false);

  const isRevenue = state.role === 'officer-revenue';
  const officerName = isRevenue ? 'Meena Kulkarni' : 'Priya Sharma';
  const officerDept = isRevenue ? 'Revenue Department' : 'Higher Education Department';
  const alreadyApproved = isRevenue ? state.officerApprovedRevenue : state.officerApprovedHigherEd;

  const t = (en: string, mr: string) => lang === 'en' ? en : mr;

  const handleApprove = async () => {
    setApproving(true);
    await officerApprove();
    if (isRevenue) dispatch({ type: 'APPROVE_REVENUE' });
    else dispatch({ type: 'APPROVE_HIGHER_ED' });
    setApproving(false);
    setShowReferralAnim(true);
    addToast({
      type: 'success',
      title: `${isRevenue ? 'Revenue' : 'Higher Education'} Approved ✓`,
      message: isRevenue
        ? 'Case auto-referred to Higher Education Dept with pre-verified facts.'
        : 'Scholarship approved. DBT transfer initiated — ₹25,000.',
    });
    setTimeout(() => setShowReferralAnim(false), 3500);
  };

  const slaColor = (h: number) => h < 0 ? 'text-danger-600 bg-red-50' : h < 12 ? 'text-warning-600 bg-amber-50' : 'text-verified-600 bg-verified-50';
  const slaLabel = (h: number) => h < 0 ? `${Math.abs(h)}h overdue` : `${h}h remaining`;

  return (
    <div className="h-full bg-slate-50 p-6 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-black text-navy-900">{t('Officer Console', 'अधिकारी कन्सोल')}</h1>
          <p className="text-slate-500 text-sm">{officerName} · {officerDept}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-navy-50 border border-navy-100 rounded-lg px-3 py-1.5 text-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-saffron-500 animate-pulse" />
            <span className="text-navy-600 font-semibold">{OFFICER_QUEUE.length} cases in queue</span>
          </div>
          <Badge variant="danger">1 SLA Breach</Badge>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-5">
        {/* Queue */}
        <div className="col-span-4">
          <Card className="p-4">
            <h2 className="text-sm font-bold text-navy-900 mb-3">{t('Case Queue', 'केस रांग')}</h2>
            <div className="space-y-2">
              {OFFICER_QUEUE.map(c => (
                <div
                  key={c.id}
                  onClick={() => setSelectedCase(c)}
                  className={clsx(
                    'border rounded-xl p-3 cursor-pointer transition-all',
                    selectedCase.id === c.id ? 'border-navy-300 bg-navy-50 shadow-sm' :
                    c.status === 'sla-breach' ? 'border-red-200 bg-red-50/30 hover:border-red-300' :
                    'border-slate-100 hover:border-navy-200 hover:shadow-sm'
                  )}
                >
                  <div className="flex items-start justify-between mb-1">
                    <div>
                      <p className="text-xs font-bold text-navy-800">{c.citizen}</p>
                      <p className="text-[10px] text-slate-400">{c.id}</p>
                    </div>
                    {c.status === 'sla-breach' ? (
                      <span className="text-[10px] font-bold text-danger-600 bg-red-50 border border-red-200 px-1.5 py-0.5 rounded-md">SLA ⚠</span>
                    ) : c.priority === 'high' ? (
                      <span className="text-[10px] font-bold text-saffron-700 bg-saffron-50 border border-saffron-200 px-1.5 py-0.5 rounded-md">High</span>
                    ) : (
                      <span className="text-[10px] text-slate-400 bg-slate-50 border border-slate-200 px-1.5 py-0.5 rounded-md">Normal</span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-500 mb-2 leading-tight">{c.scheme}</p>
                  <div className="flex items-center justify-between">
                    <div className={clsx('text-[10px] font-semibold px-2 py-0.5 rounded-md', slaColor(c.slaHoursLeft))}>
                      {slaLabel(c.slaHoursLeft)}
                    </div>
                    {c.verificationComplete && <VerifiedTick />}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Case Detail */}
        <div className="col-span-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedCase.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col gap-4"
            >
              {/* Case header */}
              <Card className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h2 className="text-base font-black text-navy-900">{selectedCase.citizen}</h2>
                      <StatusChip status={selectedCase.status === 'sla-breach' ? 'sla-breach' : alreadyApproved && selectedCase.id === CASE_ID ? 'completed' : 'pending'} />
                    </div>
                    <p className="text-xs text-slate-500">{selectedCase.id} · {selectedCase.scheme}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-slate-400">Submitted</p>
                    <p className="text-xs font-semibold text-navy-700">{selectedCase.submitted}</p>
                    <p className="text-[10px] text-slate-400 mt-1">SLA Deadline</p>
                    <p className={clsx('text-xs font-semibold', selectedCase.slaHoursLeft < 0 ? 'text-danger-600' : 'text-navy-700')}>{selectedCase.slaDeadline}</p>
                  </div>
                </div>
                {selectedCase.id === CASE_ID && (
                  <>
                    <Progress value={57} className="mb-2" />
                    <p className="text-xs text-slate-400 text-right">Stage 5/7</p>
                  </>
                )}

                {/* SLA breach alert */}
                {selectedCase.status === 'sla-breach' && (
                  <div className="mt-3 bg-red-50 border border-red-200 rounded-xl p-3 flex gap-2">
                    <span className="text-red-500 text-sm shrink-0">🚨</span>
                    <div className="text-xs">
                      <p className="font-bold text-red-700">SLA Breach — {Math.abs(selectedCase.slaHoursLeft)} hours overdue</p>
                      <p className="text-red-500 mt-0.5">This case has exceeded the 2-day SLA for Social Justice verification. Escalation recommended.</p>
                    </div>
                    <Button variant="danger" size="sm" className="ml-auto shrink-0">Escalate</Button>
                  </div>
                )}
              </Card>

              {/* Pre-verified facts */}
              {selectedCase.id === CASE_ID && (
                <Card className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-navy-900">{t('Pre-Verified Facts', 'पूर्व-सत्यापित तथ्ये')}</h3>
                    <Badge variant="verified">No manual checks needed</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {VERIFIED_FACTS.map(f => (
                      <div key={f.id} className="flex items-start gap-3 bg-verified-50 border border-verified-100 rounded-xl p-3">
                        <span className="text-lg shrink-0">{f.id === 'VF-001' ? '💰' : f.id === 'VF-002' ? '🌾' : f.id === 'VF-003' ? '📄' : '🎓'}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <p className="text-xs font-bold text-navy-800 leading-tight">{f.label}</p>
                            <VerifiedTick />
                          </div>
                          <p className="text-xs text-navy-600 font-semibold truncate">{f.value}</p>
                          <div className="flex gap-1 mt-1">
                            <ProtocolBadge protocol={f.protocol} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Action buttons */}
              {selectedCase.id === CASE_ID && (
                <Card className="p-5">
                  <h3 className="text-sm font-bold text-navy-900 mb-4">{t('Actions', 'कृती')}</h3>
                  <div className="flex gap-3">
                    {alreadyApproved ? (
                      <div className="flex items-center gap-2 bg-verified-50 border border-verified-200 rounded-xl px-5 py-3 flex-1 justify-center">
                        <svg className="w-5 h-5 text-verified-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                        <span className="text-verified-700 font-bold">
                          {isRevenue ? 'Approved & Referred to Higher Education' : 'Scholarship Approved – ₹25,000 to DBT'}
                        </span>
                      </div>
                    ) : (
                      <>
                        <Button id="approve-btn" variant="success" size="lg" className="flex-1" onClick={handleApprove} loading={approving}>
                          ✓ {isRevenue ? t('Approve & Refer', 'मंजूर करा व रेफर') : t('Approve Scholarship', 'शिष्यवृत्ती मंजूर')}
                        </Button>
                        <Button variant="ghost" size="lg">
                          📋 {t('Seek More Info', 'अधिक माहिती')}
                        </Button>
                        <Button variant="ghost" size="lg">
                          ↪ {t('Re-Refer', 'पुनर्निर्देशित')}
                        </Button>
                      </>
                    )}
                  </div>
                </Card>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Smart Referral animation overlay */}
      <AnimatePresence>
        {showReferralAnim && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.7, opacity: 0 }}
              className="bg-white rounded-2xl p-8 shadow-2xl max-w-md text-center"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="w-16 h-16 rounded-full bg-saffron-500 flex items-center justify-center mx-auto mb-4"
              >
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
              </motion.div>
              <h3 className="text-xl font-black text-navy-900 mb-2">
                {isRevenue ? '⚡ Smart Referral Triggered!' : '🎉 Scholarship Approved!'}
              </h3>
              <p className="text-slate-500 text-sm mb-4">
                {isRevenue
                  ? "Rohan's verified facts auto-routed to Higher Education Dept. Zero re-uploads needed."
                  : 'DBT transfer of ₹25,000 initiated to Canara Bank, IFSC: CNRB0001234.'}
              </p>
              <div className="flex justify-center gap-3 text-sm text-slate-500">
                {isRevenue
                  ? <>Revenue<span className="text-saffron-500 mx-2">→</span>SUTRADHAR<span className="text-saffron-500 mx-2">→</span>Higher Ed</>
                  : <>Higher Ed<span className="text-verified-500 mx-2">→</span>DBT<span className="text-verified-500 mx-2">→</span>₹25,000</>}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
