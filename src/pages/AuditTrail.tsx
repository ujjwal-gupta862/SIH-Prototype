import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import { useApp } from '../context/AppContext';
import { AUDIT_ENTRIES } from '../data/mockData';
import { Card, Badge, StatusChip } from '../components/ui';
import type { AuditEntry } from '../types';

const LIVE_ENTRIES: Omit<AuditEntry, 'id'>[] = [
  {
    timestamp: '2026-09-29 21:34:00', actor: 'SUTRADHAR Monitor', role: 'System',
    action: 'Heartbeat Check', source: 'SUTRADHAR Engine', destination: 'All Adapters',
    purpose: 'Adapter health polling', consentId: '–', status: 'success', hash: 'k10i7h2m9j4l1n5k',
  },
  {
    timestamp: '2026-09-29 21:35:00', actor: 'DBT Treasury', role: 'System',
    action: 'Batch Settlement Run', source: 'Treasury Portal', destination: 'NPCI',
    purpose: 'Nightly scholarship batch', consentId: 'CST-2026-88210', status: 'success', hash: 'l11j8i3n0k5m2o6l',
  },
];

const STATUS_FILTERS = ['All', 'success', 'retry', 'exception'];
const ROLE_FILTERS = ['All', 'Citizen', 'System', 'Revenue Officer', 'Higher Education Officer'];

export default function AuditTrail() {
  const { state, dispatch } = useApp();
  const lang = state.language;
  const [statusFilter, setStatusFilter] = useState('All');
  const [roleFilter, setRoleFilter] = useState('All');
  const [entries, setEntries] = useState<AuditEntry[]>(AUDIT_ENTRIES);
  const [liveIdx, setLiveIdx] = useState(0);

  const t = (en: string, mr: string) => lang === 'en' ? en : mr;

  // Append live entries every 8 seconds
  useEffect(() => {
    if (liveIdx >= LIVE_ENTRIES.length) return;
    const timer = setInterval(() => {
      setLiveIdx(prev => {
        if (prev < LIVE_ENTRIES.length) {
          const newEntry: AuditEntry = {
            ...LIVE_ENTRIES[prev],
            id: `AUD-LIVE-00${prev + 1}`,
          };
          setEntries(e => [...e, newEntry]);
          dispatch({ type: 'INC_AUDIT_COUNT' });
          return prev + 1;
        }
        clearInterval(timer);
        return prev;
      });
    }, 8000);
    return () => clearInterval(timer);
  }, []); // eslint-disable-line

  const filtered = entries.filter(e => {
    const statusOk = statusFilter === 'All' || e.status === statusFilter;
    const roleOk = roleFilter === 'All' || e.role === roleFilter;
    return statusOk && roleOk;
  });

  const statusVariant = (s: AuditEntry['status']) =>
    s === 'success' ? 'verified' : s === 'retry' ? 'warning' : 'danger';
  const statusIcon = (s: AuditEntry['status']) =>
    s === 'success' ? '✓' : s === 'retry' ? '↻' : '⚠';

  return (
    <div className="h-full bg-slate-50 p-6 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-5 shrink-0">
        <div>
          <h1 className="text-xl font-black text-navy-900">{t('Audit Trail', 'ऑडिट ट्रेल')}</h1>
          <p className="text-slate-500 text-sm">{t('Append-only · Tamper-evident · Live-updating', 'फक्त जोडण्यायोग्य · छेडछाड-प्रूफ · लाइव्ह')}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-verified-50 border border-verified-100 rounded-lg px-3 py-1.5 text-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-verified-500 animate-pulse" />
            <span className="text-verified-700 font-semibold">{entries.length} entries · Live</span>
          </div>
          <Badge variant="navy">Consent: CST-2026-88210</Badge>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 mb-4 shrink-0">
        <div>
          <span className="text-xs font-semibold text-slate-400 mr-2">{t('Status:', 'स्थिती:')}</span>
          {STATUS_FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setStatusFilter(f)}
              className={clsx('px-3 py-1 rounded-full text-xs font-semibold mr-1 transition-colors',
                statusFilter === f ? 'bg-navy-600 text-white' : 'bg-white text-slate-500 hover:bg-navy-50 border border-slate-200'
              )}
            >
              {f}
            </button>
          ))}
        </div>
        <div>
          <span className="text-xs font-semibold text-slate-400 mr-2">{t('Role:', 'भूमिका:')}</span>
          {ROLE_FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setRoleFilter(f)}
              className={clsx('px-3 py-1 rounded-full text-xs font-semibold mr-1 transition-colors',
                roleFilter === f ? 'bg-navy-600 text-white' : 'bg-white text-slate-500 hover:bg-navy-50 border border-slate-200'
              )}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="ml-auto text-xs text-slate-400">
          {filtered.length} {t('entries shown', 'नोंदी दर्शविल्या')}
        </div>
      </div>

      {/* Table */}
      <Card className="flex-1 overflow-hidden flex flex-col">
        {/* Table Header */}
        <div className="grid text-[10px] font-bold text-slate-400 uppercase tracking-wide px-4 py-2.5 border-b border-slate-100 bg-slate-50 shrink-0"
          style={{ gridTemplateColumns: '120px 100px 90px 1fr 1fr 1fr 100px 130px 80px' }}
        >
          <span>{t('Timestamp', 'वेळ')}</span>
          <span>{t('Actor', 'कर्ता')}</span>
          <span>{t('Role', 'भूमिका')}</span>
          <span>{t('Action', 'कृती')}</span>
          <span>{t('Source → Dest', 'स्रोत → गंतव्य')}</span>
          <span>{t('Purpose', 'उद्देश')}</span>
          <span>{t('Consent ID', 'संमती ID')}</span>
          <span className="font-mono">{t('Hash', 'हॅश')}</span>
          <span>{t('Status', 'स्थिती')}</span>
        </div>

        {/* Table Body */}
        <div className="flex-1 overflow-y-auto">
          <AnimatePresence>
            {filtered.map((e, i) => {
              const isLive = e.id.startsWith('AUD-LIVE');
              return (
                <motion.div
                  key={e.id}
                  initial={isLive ? { opacity: 0, backgroundColor: '#FFF9F0' } : { opacity: 1 }}
                  animate={{ opacity: 1, backgroundColor: isLive ? '#FFFBF5' : 'white' }}
                  transition={{ duration: 0.5 }}
                  className={clsx(
                    'grid text-xs px-4 py-3 border-b border-slate-50 hover:bg-slate-50 transition-colors items-center gap-2',
                    e.status === 'exception' && 'bg-red-50/30 hover:bg-red-50/50',
                    e.status === 'retry' && 'bg-amber-50/30 hover:bg-amber-50/50',
                  )}
                  style={{ gridTemplateColumns: '120px 100px 90px 1fr 1fr 1fr 100px 130px 80px' }}
                >
                  <span className="font-mono text-[10px] text-slate-400">{e.timestamp}</span>
                  <span className="font-semibold text-navy-700 truncate">{e.actor}</span>
                  <span className="text-slate-500 text-[10px]">{e.role}</span>
                  <span className="text-navy-800 font-medium leading-tight">{e.action}</span>
                  <span className="text-slate-500 text-[10px] leading-tight">
                    {e.source}<br/>→ {e.destination}
                  </span>
                  <span className="text-slate-500 text-[10px] leading-tight">{e.purpose}</span>
                  <span className="font-mono text-[10px] text-navy-500">{e.consentId}</span>
                  <div className="flex items-center gap-1">
                    <span className="font-mono text-[10px] text-slate-400 truncate">{e.hash}</span>
                    <svg className="w-3 h-3 text-verified-400 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/></svg>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className={clsx('w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0',
                      e.status === 'success' ? 'bg-verified-500 text-white' :
                      e.status === 'retry' ? 'bg-warning-500 text-white' : 'bg-danger-500 text-white'
                    )}>{statusIcon(e.status)}</span>
                    {isLive && <span className="text-[9px] text-saffron-500 font-bold">LIVE</span>}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </Card>

      {/* Footer note */}
      <p className="text-[10px] text-slate-400 text-center mt-3 shrink-0">
        🔐 {t('All entries are cryptographically hashed and anchored. Tamper detection is automatic.', 'सर्व नोंदी क्रिप्टोग्राफिक हॅशद्वारे सुरक्षित आहेत.')}
        {' '}· {t('New entries stream in every 8 seconds.', 'दर 8 सेकंदाला नवीन नोंदी येतात.')}
      </p>
    </div>
  );
}
