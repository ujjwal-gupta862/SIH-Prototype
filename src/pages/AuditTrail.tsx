import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import { useSim } from '../sim/store';
import { Card, Badge, JsonView, Button } from '../components/ui';
import { exportCsv } from '../lib/csv';

export default function AuditTrail() {
  const { state } = useSim();
  const lang = state.language;
  const entries = state.auditLog;
  
  const [statusFilter, setStatusFilter] = useState('All');
  const [roleFilter, setRoleFilter] = useState('All');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const t = (en: string, mr: string) => lang === 'en' ? en : mr;

  const handleExport = () => {
    const headers = ['Timestamp', 'Actor', 'Role', 'Action', 'Details', 'Hash'];
    const rows = filtered.map(e => [
      new Date(e.at).toLocaleString(),
      e.actor,
      e.actorRole,
      e.action,
      e.detail,
      e.hash
    ]);
    exportCsv('audit_trail.csv', headers, rows);
  };

  const filtered = entries.filter(e => {
    const statusOk = statusFilter === 'All' || true; // In sim types, there is no status, so we ignore status filter for now
    const roleOk = roleFilter === 'All' || e.actorRole === roleFilter;
    return statusOk && roleOk;
  });

  const ROLE_FILTERS = ['All', ...new Set(entries.map(e => e.actorRole))];

  return (
    <div className="h-full bg-slate-50 p-6 flex flex-col overflow-hidden">
      <div className="bg-verified-50 border border-verified-200 text-verified-800 text-xs px-4 py-2 rounded-lg mb-4 flex items-center justify-between">
        <span className="flex items-center gap-2">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/></svg>
          <strong>Tamper-evident (simulated)</strong>: Each log entry is hash-chained to the previous one.
        </span>
        <Button variant="secondary" size="sm" onClick={handleExport}>Export CSV</Button>
      </div>

      <div className="flex items-center justify-between mb-5 shrink-0">
        <div>
          <h1 className="text-xl font-black text-navy-900">{t('Audit Explorer', 'ऑडिट एक्सप्लोरर')}</h1>
          <p className="text-slate-500 text-sm">Immutable ledger of all system events</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-verified-50 border border-verified-100 rounded-lg px-3 py-1.5 text-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-verified-500 animate-pulse" />
            <span className="text-verified-700 font-semibold">{entries.length} entries</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-4 shrink-0">
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

      <Card className="flex-1 overflow-hidden flex flex-col">
        <div className="grid text-[10px] font-bold text-slate-400 uppercase tracking-wide px-4 py-2.5 border-b border-slate-100 bg-slate-50 shrink-0"
          style={{ gridTemplateColumns: '150px 120px 100px 150px 1fr 120px' }}
        >
          <span>{t('Timestamp', 'वेळ')}</span>
          <span>{t('Actor', 'कर्ता')}</span>
          <span>{t('Role', 'भूमिका')}</span>
          <span>{t('Action', 'कृती')}</span>
          <span>{t('Details', 'तपशील')}</span>
          <span className="font-mono">{t('Hash', 'हॅश')}</span>
        </div>

        <div className="flex-1 overflow-y-auto">
          <AnimatePresence>
            {filtered.slice().reverse().map((e) => {
              const isExpanded = expandedId === e.id;
              return (
                <div key={e.id} className="border-b border-slate-50">
                  <motion.div
                    onClick={() => setExpandedId(isExpanded ? null : e.id)}
                    className="grid text-xs px-4 py-3 hover:bg-slate-50 transition-colors items-center gap-2 cursor-pointer"
                    style={{ gridTemplateColumns: '150px 120px 100px 150px 1fr 120px' }}
                  >
                    <span className="font-mono text-[10px] text-slate-400">{new Date(e.at).toLocaleString()}</span>
                    <span className="font-semibold text-navy-700 truncate">{e.actor}</span>
                    <span className="text-slate-500 text-[10px]">{e.actorRole}</span>
                    <span className="text-navy-800 font-medium leading-tight">{e.action}</span>
                    <span className="text-slate-500 text-[10px] leading-tight truncate">{e.detail}</span>
                    <div className="flex items-center gap-1">
                      <Badge variant="neutral" className="font-mono text-[9px] truncate max-w-[80px]">
                        {e.hash.substring(0, 8)}...
                      </Badge>
                    </div>
                  </motion.div>
                  {isExpanded && (
                    <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden bg-slate-50/50 px-4 py-3 border-t border-slate-100">
                      <h4 className="text-xs font-bold text-navy-900 mb-2">Payload Metadata</h4>
                      <div className="bg-white p-3 rounded border border-slate-200">
                        <JsonView data={e.payload} />
                      </div>
                      <div className="mt-3 text-[10px] text-slate-500 font-mono">
                        <p><strong>Previous Hash:</strong> {e.prevHash}</p>
                        <p><strong>Current Hash:</strong> {e.hash}</p>
                      </div>
                    </motion.div>
                  )}
                </div>
              );
            })}
          </AnimatePresence>
        </div>
      </Card>
    </div>
  );
}
