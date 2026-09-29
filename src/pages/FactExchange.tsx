import { useState } from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { useApp } from '../context/AppContext';
import { VERIFIED_FACTS, CASE_ID } from '../data/mockData';
import { Card, Badge, VerifiedTick, ProtocolBadge } from '../components/ui';
import type { VerifiedFact } from '../types';

export default function FactExchange() {
  const { state } = useApp();
  const lang = state.language;
  const [selected, setSelected] = useState<VerifiedFact>(VERIFIED_FACTS[0]);

  const t = (en: string, mr: string) => lang === 'en' ? en : mr;

  return (
    <div className="h-full bg-slate-50 p-6 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-black text-navy-900">{t('Verified Fact Exchange', 'सत्यापित तथ्य देवाणघेवाण')}</h1>
          <p className="text-slate-500 text-sm">{t('Case', 'केस')} {CASE_ID} · {t('4 facts exchanged across 3 departments', '3 विभागांमध्ये 4 तथ्ये')}</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="verified">4 Schema Valid</Badge>
          <Badge variant="navy">Consent: CST-2026-88210</Badge>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-5">
        {/* Left: Fact List */}
        <div className="col-span-5">
          <Card className="p-5">
            <h2 className="text-sm font-bold text-navy-900 mb-4">{t('Verified Facts', 'सत्यापित तथ्ये')}</h2>
            <div className="space-y-3">
              {VERIFIED_FACTS.map(f => (
                <motion.div
                  key={f.id}
                  whileHover={{ scale: 1.01 }}
                  onClick={() => setSelected(f)}
                  className={clsx(
                    'border rounded-xl p-4 cursor-pointer transition-all',
                    selected.id === f.id
                      ? 'border-navy-300 bg-navy-50 shadow-sm'
                      : 'border-slate-100 hover:border-navy-200 hover:shadow-sm'
                  )}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">
                        {f.id === 'VF-001' ? '💰' : f.id === 'VF-002' ? '🌾' : f.id === 'VF-003' ? '📄' : '🎓'}
                      </span>
                      <div>
                        <p className="text-sm font-bold text-navy-800">{lang === 'en' ? f.label : f.labelMarathi}</p>
                        <p className="text-xs text-slate-500 leading-tight">{lang === 'en' ? f.sourceDept : f.sourceDeptMarathi}</p>
                      </div>
                    </div>
                    {f.schemaValid && <VerifiedTick />}
                  </div>
                  <p className="text-sm font-semibold text-navy-700 mb-2 pl-9">{lang === 'en' ? f.value : f.valueMarathi}</p>
                  <div className="flex gap-2 pl-9">
                    <ProtocolBadge protocol={f.protocol} />
                    <span className="text-[10px] text-slate-400 self-center">{f.timestamp}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right: Detail Panel */}
        <div className="col-span-7 flex flex-col gap-4">
          <motion.div
            key={selected.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Fact Detail */}
            <Card className="p-6 mb-4">
              <div className="flex items-start justify-between mb-5">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-2xl">
                      {selected.id === 'VF-001' ? '💰' : selected.id === 'VF-002' ? '🌾' : selected.id === 'VF-003' ? '📄' : '🎓'}
                    </span>
                    <h2 className="text-lg font-black text-navy-900">{lang === 'en' ? selected.label : selected.labelMarathi}</h2>
                  </div>
                  <p className="text-sm text-slate-500">{selected.id}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  {selected.schemaValid && <VerifiedTick />}
                  <ProtocolBadge protocol={selected.protocol} />
                </div>
              </div>

              {/* Value */}
              <div className="bg-verified-50 border border-verified-100 rounded-xl p-4 mb-5">
                <p className="text-xs text-verified-600 font-semibold uppercase tracking-wide mb-1">{t('Verified Value', 'सत्यापित मूल्य')}</p>
                <p className="text-xl font-black text-navy-900">{lang === 'en' ? selected.value : selected.valueMarathi}</p>
              </div>

              {/* Metadata grid */}
              <div className="grid grid-cols-2 gap-3 mb-5 text-xs">
                {[
                  { k: t('Source Department', 'स्रोत विभाग'), v: lang === 'en' ? selected.sourceDept : selected.sourceDeptMarathi },
                  { k: t('Source System', 'स्रोत प्रणाली'), v: selected.sourceSystem },
                  { k: t('Protocol', 'प्रोटोकॉल'), v: selected.protocol === 'REST' ? 'REST / JSON (HTTP 200)' : 'SOAP / XML (WSDL v2.1)' },
                  { k: t('Fetched At', 'मिळवला'), v: selected.timestamp },
                  { k: t('Schema Validated', 'स्कीमा'), v: selected.schemaValid ? '✓ XSD v3.2 / JSON Schema Draft-07' : '✗ Failed' },
                  { k: t('Consent', 'संमती'), v: selected.consentGiven ? 'CST-2026-88210 · Active' : 'Not consented' },
                ].map(({ k, v }) => (
                  <div key={k} className="bg-slate-50 rounded-xl p-3">
                    <p className="text-slate-400 text-[10px] uppercase tracking-wide">{k}</p>
                    <p className="text-navy-700 font-semibold mt-0.5">{v}</p>
                  </div>
                ))}
              </div>

              {/* Identity Mapping */}
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">{t('Cross-System Identity Mapping', 'क्रॉस-सिस्टम ओळख मॅपिंग')}</p>
                <div className="flex items-center gap-2 flex-wrap">
                  {selected.identityMapping.map((m, i) => (
                    <div key={m.system} className="flex items-center gap-2">
                      <div className="flex items-center gap-1.5 bg-navy-50 border border-navy-200 rounded-lg px-3 py-1.5">
                        <span className="text-[10px] text-navy-400 font-medium">{m.system}</span>
                        <span className="text-navy-700 font-bold text-xs">{m.id}</span>
                      </div>
                      {i < selected.identityMapping.length - 1 && (
                        <svg className="w-4 h-4 text-saffron-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/></svg>
                      )}
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-slate-400 mt-2">
                  {t('SUTRADHAR maps disparate department IDs to a single Case Passport. No citizen re-identification required.',
                     'SUTRADHAR विविध विभाग IDs एकाच केस पासपोर्टशी जोडते.')}
                </p>
              </div>
            </Card>

            {/* Data flow card */}
            <Card className="p-5">
              <h3 className="text-sm font-bold text-navy-900 mb-4">{t('Data Flow Diagram', 'डेटा प्रवाह')}</h3>
              <div className="flex items-center justify-between gap-2">
                {/* Source */}
                <div className="flex-1 bg-slate-50 rounded-xl p-3 text-center border border-slate-100">
                  <div className="text-2xl mb-1">
                    {selected.id === 'VF-001' || selected.id === 'VF-002' ? '🏛' : selected.id === 'VF-003' ? '⚖️' : '🎓'}
                  </div>
                  <p className="text-xs font-bold text-navy-700">{lang === 'en' ? selected.sourceDept : selected.sourceDeptMarathi}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{selected.sourceSystem.split('(')[0]}</p>
                  <ProtocolBadge protocol={selected.protocol} className="mt-1" />
                </div>

                {/* Arrow with label */}
                <div className="flex flex-col items-center gap-1">
                  <div className="text-[10px] text-slate-400 font-medium">verified fact</div>
                  <div className="flex items-center gap-1">
                    <div className="w-8 h-0.5 bg-saffron-300" />
                    <motion.div
                      animate={{ x: [0, 4, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                    >
                      <svg className="w-4 h-4 text-saffron-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
                    </motion.div>
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">HTTPS + mTLS</div>
                </div>

                {/* SUTRADHAR */}
                <div className="flex-1 bg-navy-50 rounded-xl p-3 text-center border border-navy-200">
                  <div className="text-2xl mb-1">⚡</div>
                  <p className="text-xs font-bold text-navy-700">SUTRADHAR</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Fact Store</p>
                  <Badge variant="navy" className="mt-1">Schema Validated</Badge>
                </div>

                {/* Arrow */}
                <div className="flex flex-col items-center gap-1">
                  <div className="text-[10px] text-slate-400 font-medium">with consent</div>
                  <div className="flex items-center gap-1">
                    <div className="w-8 h-0.5 bg-verified-300" />
                    <motion.div animate={{ x: [0, 4, 0] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.5 }}>
                      <svg className="w-4 h-4 text-verified-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
                    </motion.div>
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">CST-2026-88210</div>
                </div>

                {/* Destination */}
                <div className="flex-1 bg-saffron-50 rounded-xl p-3 text-center border border-saffron-200">
                  <div className="text-2xl mb-1">🎓</div>
                  <p className="text-xs font-bold text-saffron-700">Higher Education</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Scholarship Portal</p>
                  <Badge variant="saffron" className="mt-1">REST API</Badge>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
