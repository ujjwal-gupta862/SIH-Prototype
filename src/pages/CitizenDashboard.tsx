import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { useApp } from '../context/AppContext';
import { CITIZEN, CASE_ID, VERIFIED_FACTS } from '../data/mockData';
import { Card, Badge, Progress, StatusChip, VerifiedTick, SectionHeader } from '../components/ui';

const NOTIFICATIONS = [
  { id: 1, time: '2 hrs ago', icon: '✅', title: 'Caste Certificate Verified', body: 'Social Justice Dept validated OBC (NCL) status.', type: 'success' },
  { id: 2, time: '5 hrs ago', icon: '⚠️', title: 'Revenue SOAP Timeout – Resolved', body: 'Income certificate fetch retried (2/3) and recovered.', type: 'warning' },
  { id: 3, time: '1 day ago', icon: '📋', title: 'Case SUT-2026-004821 Created', body: 'Your application is being processed.', type: 'info' },
];

const ACTIVE_CASES = [
  {
    id: CASE_ID, scheme: 'Post-Matric OBC Scholarship', dept: 'Higher Education',
    progress: 57, stage: 'Track & Notify', status: 'active' as const,
    amount: '₹25,000', sla: '30 Sep 2026',
  },
];

export default function CitizenDashboard() {
  const { state } = useApp();
  const navigate = useNavigate();
  const lang = state.language;
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null);

  const t = (en: string, mr: string) => lang === 'en' ? en : mr;

  return (
    <div className="h-full bg-slate-50 p-6 overflow-y-auto">
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-navy-800 to-navy-600 rounded-2xl p-6 mb-6 flex items-center justify-between relative overflow-hidden"
      >
        <div className="absolute right-0 top-0 w-64 h-full opacity-10">
          <svg viewBox="0 0 200 200" className="w-full h-full" fill="none">
            <circle cx="160" cy="40" r="80" stroke="white" strokeWidth="40"/>
            <circle cx="40" cy="160" r="60" stroke="white" strokeWidth="30"/>
          </svg>
        </div>
        <div className="relative z-10">
          <p className="text-navy-200 text-sm">{t('Welcome back,', 'स्वागत आहे,')}</p>
          <h1 className="text-white text-2xl font-bold">{t(CITIZEN.name, CITIZEN.nameMarathi)}</h1>
          <div className="flex items-center gap-3 mt-2">
            <span className="text-navy-300 text-xs">{t('Aadhaar ending', 'आधार शेवटचे')} ****{CITIZEN.aadhaarLast4}</span>
            <span className="text-navy-400">·</span>
            <span className="text-navy-300 text-xs">{t(CITIZEN.district, CITIZEN.districtMarathi)}, Maharashtra</span>
          </div>
        </div>
        <div className="relative z-10 flex gap-3">
          <button
            id="apply-btn"
            onClick={() => navigate('/citizen/apply')}
            className="flex items-center gap-2 bg-saffron-500 hover:bg-saffron-600 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/></svg>
            {t('Apply Once', 'अर्ज करा')}
          </button>
          <button
            id="track-btn"
            onClick={() => navigate('/citizen/tracker')}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors border border-white/20"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/></svg>
            {t('Track Case', 'केस ट्रॅक करा')}
          </button>
        </div>
      </motion.div>

      <div className="grid grid-cols-12 gap-5">
        {/* Case Passport */}
        <motion.div className="col-span-4" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-navy-900">
                {t('Case Passport', 'केस पासपोर्ट')}
              </h2>
              <Badge variant="verified">Active</Badge>
            </div>

            {/* QR Placeholder */}
            <div className="flex gap-4 mb-4">
              <div className="w-20 h-20 rounded-xl qr-placeholder bg-slate-100 shrink-0 border border-slate-200 flex items-center justify-center">
                <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"/></svg>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wide">Case ID</p>
                <p className="text-navy-800 font-bold text-sm mt-0.5">{CASE_ID}</p>
                <p className="text-[10px] text-slate-400 mt-2 font-medium uppercase tracking-wide">Scheme</p>
                <p className="text-navy-700 text-xs font-semibold mt-0.5 leading-tight">Post-Matric OBC Scholarship</p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-slate-500">{t('Overall Progress', 'एकूण प्रगती')}</span>
                  <span className="text-xs font-bold text-navy-700">57%</span>
                </div>
                <Progress value={57} />
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { k: t('Stage', 'टप्पा'), v: '5 / 7' },
                  { k: t('SLA', 'SLA'), v: '2 days left' },
                  { k: t('Amount', 'रक्कम'), v: '₹25,000' },
                  { k: t('Dept', 'विभाग'), v: 'Higher Ed' },
                ].map(({ k, v }) => (
                  <div key={k} className="bg-slate-50 rounded-lg p-2">
                    <p className="text-slate-400 text-[10px]">{k}</p>
                    <p className="text-navy-700 font-semibold text-xs">{v}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Identity Mapping */}
            <div className="mt-4 border-t border-slate-100 pt-4">
              <p className="text-[10px] text-slate-400 uppercase tracking-wide mb-2">{t('Identity Mapping', 'ओळख मॅपिंग')}</p>
              <div className="flex flex-wrap gap-1.5">
                <Badge variant="neutral">Rev: R-7781</Badge>
                <Badge variant="navy">Edu: E-44210</Badge>
                <Badge variant="saffron">SJ: SJ-2281</Badge>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Active Cases */}
        <motion.div className="col-span-5" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Card className="p-5">
            <SectionHeader
              icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>}
              title={t('Active Cases', 'सक्रिय केसेस')}
              subtitle={t('1 case in progress', '1 केस प्रक्रियेत')}
            />
            {ACTIVE_CASES.map(c => (
              <div key={c.id} className="border border-slate-100 rounded-xl p-4 hover:border-navy-200 hover:shadow-sm transition-all cursor-pointer" onClick={() => navigate('/citizen/tracker')}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-sm font-bold text-navy-800">{c.scheme}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{c.id} · {c.dept}</p>
                  </div>
                  <StatusChip status={c.status} />
                </div>
                <Progress value={c.progress} className="mb-3" />
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Stage: <strong className="text-navy-700">{c.stage}</strong></span>
                  <span>SLA: <strong className="text-navy-700">{c.sla}</strong></span>
                  <span>Amount: <strong className="text-verified-600">{c.amount}</strong></span>
                </div>
              </div>
            ))}

            {/* Department journey */}
            <div className="mt-4 border-t border-slate-100 pt-4">
              <p className="text-xs font-semibold text-slate-500 mb-3">{t('Department Journey', 'विभाग प्रवास')}</p>
              <div className="flex items-center gap-2">
                {[
                  { name: 'Revenue', status: 'done' },
                  { name: 'Social Justice', status: 'done' },
                  { name: 'Higher Ed', status: 'active' },
                  { name: 'DBT', status: 'pending' },
                ].map((d, i) => (
                  <div key={d.name} className="flex items-center gap-2">
                    <div className={clsx('flex flex-col items-center gap-1', i > 0 && 'ml-0')}>
                      <div className={clsx('w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all',
                        d.status === 'done' ? 'bg-verified-500 border-verified-500 text-white' :
                        d.status === 'active' ? 'bg-saffron-500 border-saffron-500 text-white animate-pulse' :
                        'bg-slate-100 border-slate-200 text-slate-400'
                      )}>
                        {d.status === 'done' ? '✓' : i + 1}
                      </div>
                      <span className="text-[9px] text-slate-500 text-center leading-tight w-14">{d.name}</span>
                    </div>
                    {i < 3 && <div className={clsx('w-8 h-0.5 mb-5', d.status === 'done' ? 'bg-verified-300' : 'bg-slate-200')} />}
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Notifications */}
        <motion.div className="col-span-3" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="p-5 h-full">
            <SectionHeader
              icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>}
              title={t('Notifications', 'सूचना')}
            />
            <div className="space-y-3">
              {NOTIFICATIONS.map(n => (
                <div key={n.id} className={clsx('flex gap-3 p-3 rounded-xl border',
                  n.type === 'success' ? 'bg-verified-50 border-verified-100' :
                  n.type === 'warning' ? 'bg-amber-50 border-amber-100' : 'bg-navy-50 border-navy-100'
                )}>
                  <span className="text-lg shrink-0">{n.icon}</span>
                  <div>
                    <p className="text-xs font-semibold text-navy-800">{n.title}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5 leading-relaxed">{n.body}</p>
                    <p className="text-[10px] text-slate-400 mt-1">{n.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Verified Documents Vault */}
        <motion.div className="col-span-12" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <Card className="p-5">
            <SectionHeader
              icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>}
              title={t('Verified Documents Vault', 'सत्यापित दस्तऐवज तिजोरी')}
              subtitle={t('4 facts verified across 3 departments', '3 विभागांमध्ये 4 तथ्ये सत्यापित')}
              action={<button onClick={() => navigate('/citizen/facts')} className="text-xs text-navy-600 font-semibold hover:underline">{t('View full exchange →', 'पूर्ण पाहा →')}</button>}
            />
            <div className="grid grid-cols-4 gap-4">
              {VERIFIED_FACTS.map(f => (
                <div
                  key={f.id}
                  onClick={() => setSelectedDoc(selectedDoc === f.id ? null : f.id)}
                  className={clsx('border rounded-xl p-4 cursor-pointer transition-all',
                    selectedDoc === f.id ? 'border-navy-300 bg-navy-50 shadow-md' : 'border-slate-100 hover:border-navy-200 hover:shadow-sm'
                  )}
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-lg">
                      {f.id === 'VF-001' ? '💰' : f.id === 'VF-002' ? '🌾' : f.id === 'VF-003' ? '📄' : '🎓'}
                    </span>
                    <VerifiedTick />
                  </div>
                  <p className="text-sm font-bold text-navy-800 leading-tight">{lang === 'en' ? f.label : f.labelMarathi}</p>
                  <p className="text-xs text-slate-500 mt-1 truncate">{lang === 'en' ? f.value : f.valueMarathi}</p>
                  <div className="mt-3 flex flex-wrap gap-1">
                    <Badge variant={f.protocol === 'REST' ? 'rest' : 'soap'}>
                      {f.protocol}
                    </Badge>
                    <Badge variant="neutral">{f.sourceDept.split(' ')[0]}</Badge>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-2">{f.timestamp}</p>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
