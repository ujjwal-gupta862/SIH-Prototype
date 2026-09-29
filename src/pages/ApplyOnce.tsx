import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import { useApp } from '../context/AppContext';
import { CITIZEN, CASE_ID, VERIFIED_FACTS, CONSENT_ITEMS } from '../data/mockData';
import { Button, Card, Badge, VerifiedTick, Modal } from '../components/ui';
import { submitApplication } from '../hooks/useSimApi';

const STEP_LABELS = [
  { en: 'Personal Details', mr: 'वैयक्तिक माहिती' },
  { en: 'Documents', mr: 'दस्तऐवज' },
  { en: 'Consent', mr: 'संमती' },
  { en: 'Review & Submit', mr: 'पुनरावलोकन' },
];

export default function ApplyOnce() {
  const { state, dispatch, addToast } = useApp();
  const navigate = useNavigate();
  const lang = state.language;
  const step = state.applyStep;
  const [consentOpen, setConsentOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedDocs, setSelectedDocs] = useState<Set<string>>(new Set(['VF-001', 'VF-002', 'VF-003', 'VF-004']));

  const t = (en: string, mr: string) => lang === 'en' ? en : mr;

  const goTo = (s: number) => dispatch({ type: 'SET_APPLY_STEP', step: s });

  const handleSubmit = async () => {
    setSubmitting(true);
    await submitApplication();
    setSubmitting(false);
    dispatch({ type: 'SET_APPLY_STEP', step: 4 });
    addToast({ type: 'success', title: 'Application Submitted!', message: `Case ID ${CASE_ID} generated successfully.` });
  };

  if (step === 4) {
    return (
      <div className="h-full flex items-center justify-center bg-slate-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <motion.div
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.2 }}
            className="w-24 h-24 rounded-full bg-verified-500 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-verified-500/30"
          >
            <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
          </motion.div>
          <h2 className="text-3xl font-black text-navy-900 mb-2">
            {t('Application Submitted!', 'अर्ज सादर झाला!')}
          </h2>
          <p className="text-slate-500 mb-6">
            {t('SUTRADHAR has created your Case Passport and is routing your application.', 'SUTRADHAR ने तुमचा केस पासपोर्ट तयार केला आहे.')}
          </p>

          <Card className="p-5 mb-6 text-left">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-saffron-500 flex items-center justify-center text-white font-bold text-sm">🎫</div>
              <div>
                <p className="text-xs text-slate-400">{t('Case ID / Case Passport', 'केस ID')}</p>
                <p className="text-xl font-black text-navy-900">{CASE_ID}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              {[
                { k: t('Scheme', 'योजना'), v: 'Post-Matric OBC Scholarship' },
                { k: t('Amount', 'रक्कम'), v: '₹25,000' },
                { k: t('Departments', 'विभाग'), v: '4 (auto-routed)' },
                { k: t('Documents Shared', 'दस्तऐवज'), v: '4 facts, 0 re-uploads' },
              ].map(({ k, v }) => (
                <div key={k} className="bg-slate-50 rounded-lg p-2.5">
                  <p className="text-slate-400">{k}</p>
                  <p className="text-navy-700 font-semibold mt-0.5">{v}</p>
                </div>
              ))}
            </div>
          </Card>

          <div className="flex gap-3 justify-center">
            <Button onClick={() => navigate('/citizen/tracker')} size="lg">
              {t('Track My Case →', 'केस ट्रॅक करा →')}
            </Button>
            <Button variant="ghost" onClick={() => { goTo(0); navigate('/citizen'); }}>
              {t('Back to Dashboard', 'डॅशबोर्डवर जा')}
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-full bg-slate-50 flex flex-col">
      {/* Progress Header */}
      <div className="bg-white border-b border-slate-100 px-8 py-4 shrink-0">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-lg font-bold text-navy-900">{t('Apply Once', 'एकदाच अर्ज')}</h1>
            <span className="text-xs text-slate-400">{t('Step', 'पायरी')} {step + 1} {t('of', 'पैकी')} 4</span>
          </div>
          <div className="flex gap-2">
            {STEP_LABELS.map((s, i) => (
              <div key={i} className="flex-1">
                <div className={clsx('h-1.5 rounded-full transition-all', i < step ? 'bg-verified-500' : i === step ? 'bg-saffron-500' : 'bg-slate-200')} />
                <p className={clsx('text-[10px] mt-1 font-medium', i === step ? 'text-saffron-600' : i < step ? 'text-verified-600' : 'text-slate-400')}>
                  {lang === 'en' ? s.en : s.mr}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Step Content */}
      <div className="flex-1 overflow-y-auto py-8">
        <div className="max-w-3xl mx-auto px-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
            >

              {/* STEP 0: Personal Details */}
              {step === 0 && (
                <Card className="p-6">
                  <div className="flex items-center gap-2 mb-5">
                    <div className="w-8 h-8 rounded-full bg-navy-100 flex items-center justify-center">
                      <svg className="w-4 h-4 text-navy-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-navy-900">{t('Personal Details', 'वैयक्तिक माहिती')}</h3>
                      <p className="text-xs text-slate-400">{t('Pre-filled from your Aadhaar profile', 'आधार प्रोफाइलमधून पूर्व-भरलेले')}</p>
                    </div>
                    <Badge variant="verified" className="ml-auto">Aadhaar Verified</Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    {[
                      { label: t('Full Name', 'पूर्ण नाव'), value: lang === 'en' ? CITIZEN.name : CITIZEN.nameMarathi, locked: true },
                      { label: t('Date of Birth', 'जन्मतारीख'), value: CITIZEN.dob, locked: true },
                      { label: t('Mobile', 'मोबाइल'), value: '+91 ' + CITIZEN.mobile, locked: true },
                      { label: t('District', 'जिल्हा'), value: lang === 'en' ? CITIZEN.district : CITIZEN.districtMarathi, locked: true },
                      { label: t('Aadhaar', 'आधार'), value: 'XXXX XXXX ' + CITIZEN.aadhaarLast4, locked: true },
                      { label: t('Category', 'वर्ग'), value: 'OBC (Non-Creamy Layer)', locked: true },
                    ].map(f => (
                      <div key={f.label}>
                        <label className="block text-xs font-semibold text-slate-500 mb-1">{f.label}</label>
                        <div className={clsx('flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm', f.locked ? 'bg-slate-50 border-slate-100 text-slate-700' : 'border-slate-200')}>
                          {f.value}
                          {f.locked && <svg className="w-3.5 h-3.5 text-slate-300 ml-auto" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/></svg>}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mb-6">
                    <label className="block text-xs font-semibold text-slate-500 mb-1">{t('Scheme Applying For', 'योजना')}</label>
                    <div className="flex gap-2">
                      {['Post-Matric OBC Scholarship', 'Rajarshi Shahu Scholarship', 'SC Merit Scholarship'].map(s => (
                        <div key={s} className={clsx('flex-1 border rounded-xl p-3 cursor-pointer transition-all text-center text-xs font-medium',
                          s === 'Post-Matric OBC Scholarship' ? 'border-saffron-300 bg-saffron-50 text-saffron-700' : 'border-slate-100 text-slate-400 hover:border-slate-200'
                        )}>
                          {s}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-navy-50 border border-navy-100 rounded-xl p-4 flex gap-3">
                    <span className="text-navy-500 shrink-0">ℹ️</span>
                    <p className="text-xs text-navy-700 leading-relaxed">
                      {t('Your personal details are pre-filled from Aadhaar. SUTRADHAR will fetch all required documents from Government systems — you do not need to upload anything.',
                         'तुमची वैयक्तिक माहिती आधारमधून आधीच भरली आहे. SUTRADHAR सर्व आवश्यक दस्तऐवज शासकीय प्रणालींमधून मिळवेल.')}
                    </p>
                  </div>
                </Card>
              )}

              {/* STEP 1: Documents */}
              {step === 1 && (
                <Card className="p-6">
                  <div className="flex items-center gap-2 mb-5">
                    <div className="w-8 h-8 rounded-full bg-verified-100 flex items-center justify-center">
                      <svg className="w-4 h-4 text-verified-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-navy-900">{t('Documents from Verified Vault', 'सत्यापित तिजोरीतून दस्तऐवज')}</h3>
                      <p className="text-xs text-slate-400">{t('Select facts to share. No uploads needed.', 'शेअर करण्यासाठी तथ्ये निवडा. अपलोड आवश्यक नाही.')}</p>
                    </div>
                    <Badge variant="verified" className="ml-auto">0 Uploads Required</Badge>
                  </div>

                  <div className="space-y-3 mb-5">
                    {VERIFIED_FACTS.map(f => (
                      <div
                        key={f.id}
                        onClick={() => {
                          const s = new Set(selectedDocs);
                          if (s.has(f.id)) s.delete(f.id); else s.add(f.id);
                          setSelectedDocs(s);
                        }}
                        className={clsx('flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-all',
                          selectedDocs.has(f.id) ? 'border-verified-300 bg-verified-50' : 'border-slate-100 hover:border-slate-200'
                        )}
                      >
                        <div className={clsx('w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all',
                          selectedDocs.has(f.id) ? 'bg-verified-500 border-verified-500' : 'border-slate-300'
                        )}>
                          {selectedDocs.has(f.id) && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <p className="text-sm font-bold text-navy-800">{lang === 'en' ? f.label : f.labelMarathi}</p>
                            <VerifiedTick />
                          </div>
                          <p className="text-xs text-slate-500">{lang === 'en' ? f.value : f.valueMarathi}</p>
                          <div className="flex gap-2 mt-2">
                            <Badge variant={f.protocol === 'REST' ? 'rest' : 'soap'}>{f.protocol}</Badge>
                            <Badge variant="neutral">{lang === 'en' ? f.sourceDept : f.sourceDeptMarathi}</Badge>
                            <span className="text-[10px] text-slate-400">{f.timestamp}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-saffron-50 border border-saffron-100 rounded-xl p-4 flex gap-3">
                    <span className="text-saffron-500 shrink-0">⚡</span>
                    <p className="text-xs text-saffron-800 leading-relaxed">
                      {t('All 4 facts are already verified by the respective government departments. SUTRADHAR will share these directly — no physical documents or re-verification needed.',
                         '4 तथ्ये संबंधित विभागांनी आधीच सत्यापित केली आहेत.')}
                    </p>
                  </div>
                </Card>
              )}

              {/* STEP 2: Consent */}
              {step === 2 && (
                <Card className="p-6">
                  <div className="flex items-center gap-2 mb-5">
                    <div className="w-8 h-8 rounded-full bg-saffron-100 flex items-center justify-center">
                      <svg className="w-4 h-4 text-saffron-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-navy-900">{t('Citizen Consent', 'नागरिक संमती')}</h3>
                      <p className="text-xs text-slate-400">{t('Control exactly what data is shared, with whom, and why', 'काय माहिती कोणाशी का शेअर होणार ते नियंत्रित करा')}</p>
                    </div>
                    <button onClick={() => setConsentOpen(true)} className="ml-auto text-xs text-navy-600 font-semibold border border-navy-200 px-3 py-1.5 rounded-lg hover:bg-navy-50 transition-colors">
                      {t('View Consent Modal →', 'संमती पाहा →')}
                    </button>
                  </div>

                  <div className="space-y-3 mb-5">
                    {CONSENT_ITEMS.map(ci => (
                      <div key={ci.factId} className={clsx('flex items-start gap-4 p-4 rounded-xl border transition-all',
                        state.consentEnabled[ci.factId] ? 'border-verified-200 bg-verified-50/40' : 'border-slate-100 opacity-60'
                      )}>
                        {/* Toggle */}
                        <button
                          onClick={() => dispatch({ type: 'TOGGLE_CONSENT', factId: ci.factId })}
                          className={clsx('w-10 h-6 rounded-full transition-all relative shrink-0 mt-0.5',
                            state.consentEnabled[ci.factId] ? 'bg-verified-500' : 'bg-slate-200'
                          )}
                        >
                          <div className={clsx('absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all',
                            state.consentEnabled[ci.factId] ? 'left-5' : 'left-1'
                          )} />
                        </button>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="text-sm font-bold text-navy-800">{ci.label}</p>
                            {state.consentEnabled[ci.factId] && <Badge variant="verified">Consented</Badge>}
                          </div>
                          <div className="flex gap-4 text-xs text-slate-500">
                            <span>→ <strong className="text-navy-600">{ci.dept}</strong></span>
                            <span>📋 {ci.purpose}</span>
                            <span>⏱ {ci.duration}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-navy-50 border border-navy-100 rounded-xl p-4 text-xs text-navy-600 leading-relaxed">
                    {t('Consent ID CST-2026-88210 will be generated. You can revoke consent at any time from your dashboard. All data exchanges are logged in the tamper-evident audit trail.',
                       'संमती ID CST-2026-88210 तयार केली जाईल. तुम्ही कधीही संमती रद्द करू शकता.')}
                  </div>
                </Card>
              )}

              {/* STEP 3: Review */}
              {step === 3 && (
                <Card className="p-6">
                  <div className="flex items-center gap-2 mb-5">
                    <div className="w-8 h-8 rounded-full bg-navy-100 flex items-center justify-center">
                      <svg className="w-4 h-4 text-navy-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-navy-900">{t('Review & Submit', 'पुनरावलोकन व सादर करा')}</h3>
                      <p className="text-xs text-slate-400">{t('Everything looks good. Submit to generate your Case Passport.', 'सर्व ठीक आहे. केस पासपोर्ट तयार करण्यासाठी सादर करा.')}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <p className="text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wide">{t('Application Summary', 'अर्ज सारांश')}</p>
                      <div className="space-y-2 text-xs">
                        {[
                          { k: t('Applicant', 'अर्जदार'), v: lang === 'en' ? CITIZEN.name : CITIZEN.nameMarathi },
                          { k: t('Scheme', 'योजना'), v: 'Post-Matric OBC Scholarship' },
                          { k: t('Amount', 'रक्कम'), v: '₹25,000' },
                          { k: t('Consent ID', 'संमती ID'), v: 'CST-2026-88210' },
                        ].map(({ k, v }) => (
                          <div key={k} className="flex justify-between py-2 border-b border-slate-50">
                            <span className="text-slate-500">{k}</span>
                            <span className="text-navy-700 font-semibold">{v}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wide">{t('Facts Shared', 'शेअर केलेली तथ्ये')}</p>
                      <div className="space-y-2">
                        {CONSENT_ITEMS.filter(ci => state.consentEnabled[ci.factId]).map(ci => (
                          <div key={ci.factId} className="flex items-center gap-2 text-xs">
                            <svg className="w-3.5 h-3.5 text-verified-500 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                            <span className="text-navy-700">{ci.label}</span>
                            <span className="text-slate-400">→ {ci.dept.split(' ')[0]}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Department routing preview */}
                  <div className="bg-navy-50 border border-navy-100 rounded-xl p-4 mb-4">
                    <p className="text-xs font-bold text-navy-700 mb-3">{t('Auto-routing preview', 'स्वयंचलित मार्गनिर्देशन पूर्वावलोकन')}</p>
                    <div className="flex items-center gap-2 text-xs overflow-x-auto pb-1">
                      {['Citizen', 'SUTRADHAR', 'Revenue', 'Social Justice', 'Higher Ed', 'DBT'].map((d, i) => (
                        <div key={d} className="flex items-center gap-2 shrink-0">
                          <div className={clsx('px-2.5 py-1.5 rounded-lg font-semibold',
                            d === 'SUTRADHAR' ? 'bg-saffron-500 text-white' :
                            d === 'Citizen' ? 'bg-navy-600 text-white' : 'bg-white border border-navy-200 text-navy-700'
                          )}>
                            {d}
                          </div>
                          {i < 5 && <svg className="w-4 h-4 text-navy-300 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>}
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Footer Nav */}
      <div className="bg-white border-t border-slate-100 px-8 py-4 flex items-center justify-between shrink-0">
        <div className="max-w-3xl mx-auto w-full flex items-center justify-between">
          <Button variant="ghost" onClick={() => step > 0 ? goTo(step - 1) : navigate('/citizen')} disabled={submitting}>
            ← {step === 0 ? t('Cancel', 'रद्द') : t('Back', 'मागे')}
          </Button>
          <div className="flex items-center gap-3">
            {STEP_LABELS.map((_, i) => (
              <div key={i} className={clsx('w-2 h-2 rounded-full transition-all', i === step ? 'bg-saffron-500 scale-125' : i < step ? 'bg-verified-500' : 'bg-slate-200')} />
            ))}
          </div>
          {step < 3 ? (
            <Button onClick={() => goTo(step + 1)}>
              {lang === 'en' ? STEP_LABELS[step + 1]?.en : STEP_LABELS[step + 1]?.mr} →
            </Button>
          ) : (
            <Button variant="success" onClick={handleSubmit} loading={submitting} size="lg">
              {t('Submit Application', 'अर्ज सादर करा')}
            </Button>
          )}
        </div>
      </div>

      {/* Consent Modal */}
      <Modal open={consentOpen} onClose={() => setConsentOpen(false)} title="Citizen Consent – Detailed View">
        <div className="p-6 space-y-4">
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-xs text-amber-700 flex gap-2">
            <span className="shrink-0">⚠️</span>
            <span>You are authorizing SUTRADHAR to share the following verified facts with Government departments for processing your application. You may disable individual items.</span>
          </div>
          {CONSENT_ITEMS.map(ci => (
            <div key={ci.factId} className={clsx('border rounded-xl p-4 transition-all', state.consentEnabled[ci.factId] ? 'border-verified-200 bg-verified-50/30' : 'border-slate-100 opacity-60')}>
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-sm font-bold text-navy-800">{ci.label}</p>
                  <p className="text-xs text-slate-500 mt-0.5">→ <strong>{ci.dept}</strong></p>
                </div>
                <button
                  onClick={() => dispatch({ type: 'TOGGLE_CONSENT', factId: ci.factId })}
                  className={clsx('w-10 h-6 rounded-full transition-all relative shrink-0', state.consentEnabled[ci.factId] ? 'bg-verified-500' : 'bg-slate-200')}
                >
                  <div className={clsx('absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all', state.consentEnabled[ci.factId] ? 'left-5' : 'left-1')} />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs text-slate-500">
                <div className="bg-slate-50 rounded-lg p-2">
                  <p className="text-slate-400">Purpose</p>
                  <p className="text-navy-700 font-medium mt-0.5">{ci.purpose}</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-2">
                  <p className="text-slate-400">Duration</p>
                  <p className="text-navy-700 font-medium mt-0.5">{ci.duration}</p>
                </div>
              </div>
            </div>
          ))}
          <div className="flex justify-end pt-2">
            <Button onClick={() => setConsentOpen(false)}>
              {t('Confirm Consent', 'संमती द्या')}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
