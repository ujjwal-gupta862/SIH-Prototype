import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Area, AreaChart,
} from 'recharts';
import { useApp } from '../context/AppContext';
import { TURNAROUND_DATA, STATUS_PIE_DATA, SLA_TREND_DATA, KPI, DEPT_NODES } from '../data/mockData';
import { Card, Badge, Button, KPICard, HealthDot, ProtocolBadge } from '../components/ui';
import { clsx } from 'clsx';

const EXCEPTIONS = [
  {
    id: 'EX-4821-01', case: 'SUT-2026-004821', type: 'SOAP Timeout', dept: 'Revenue',
    retries: 2, status: 'Resolved', time: '2026-09-27 08:51:22', message: 'MahaRevenue SOAP 504 — recovered on retry 2/3',
  },
  {
    id: 'EX-4815-01', case: 'SUT-2026-004815', type: 'SLA Breach', dept: 'Social Justice',
    retries: 0, status: 'Active', time: '2026-09-27 18:00:00', message: 'Sunita Kamble case — 2-day SLA exceeded by 14h',
  },
  {
    id: 'EX-4800-01', case: 'SUT-2026-004800', type: 'Schema Mismatch', dept: 'Higher Ed',
    retries: 1, status: 'Pending', time: '2026-09-26 14:30:00', message: 'Income field format mismatch — manual review required',
  },
];

export default function AdminCommandCenter() {
  const { state } = useApp();
  const lang = state.language;
  const [escalating, setEscalating] = useState<string | null>(null);

  const t = (en: string, mr: string) => lang === 'en' ? en : mr;

  const handleEscalate = (id: string) => {
    setEscalating(id);
    setTimeout(() => setEscalating(null), 2000);
  };

  return (
    <div className="h-full bg-slate-50 p-5 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-black text-navy-900">{t('Admin Command Center', 'प्रशासक नियंत्रण केंद्र')}</h1>
          <p className="text-slate-500 text-sm">Gov. of Maharashtra · SUTRADHAR Interoperability Dashboard</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-xs text-slate-500">
            <span className="w-2 h-2 rounded-full bg-verified-500 animate-pulse" />
            Live · Updated now
          </span>
          <Badge variant="navy">Suresh Rane · Admin</Badge>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4 mb-5">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <KPICard
            icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>}
            label={t('Cases in Flight', 'प्रक्रियेतील केसेस')}
            value="1,247"
            sub={t('↑ 89 since yesterday', '↑ 89 काल पासून')}
            color="bg-navy-50 text-navy-600"
          />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <KPICard
            icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>}
            label={t('Avg. Turnaround', 'सरासरी उलाढाल')}
            value="12.3 days"
            sub={t('Down from 45 days (↓ 72%)', '45 दिवसांपासून ↓ 72%')}
            color="bg-saffron-50 text-saffron-600"
            trend="up"
          />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <KPICard
            icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>}
            label={t('SLA Compliance', 'SLA अनुपालन')}
            value="94.2%"
            sub={t('Target: 95% — 0.8% gap', 'लक्ष्य: 95%')}
            color="bg-verified-50 text-verified-600"
            trend="up"
          />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <KPICard
            icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"/></svg>}
            label={t('Duplicates Prevented', 'डुप्लिकेट टाळले')}
            value="3,891"
            sub={t('Across all depts YTD', 'सर्व विभागांमध्ये')}
            color="bg-red-50 text-red-600"
            trend="up"
          />
        </motion.div>
      </div>

      <div className="grid grid-cols-12 gap-4 mb-4">
        {/* Turnaround Bar Chart */}
        <motion.div className="col-span-5" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <Card className="p-5">
            <h3 className="text-sm font-bold text-navy-900 mb-4">{t('Turnaround by Department (days)', 'विभागनिहाय उलाढाल (दिवस)')}</h3>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={TURNAROUND_DATA} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="dept" tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748B' }} />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: 12 }}
                />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="days" name="Actual (days)" fill="#1B3A6B" radius={[4, 4, 0, 0]} />
                <Bar dataKey="target" name="SLA Target" fill="#F97316" radius={[4, 4, 0, 0]} opacity={0.6} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>

        {/* Cases by Status Pie */}
        <motion.div className="col-span-4" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="p-5">
            <h3 className="text-sm font-bold text-navy-900 mb-4">{t('Cases by Status', 'स्थितीनुसार केसेस')}</h3>
            <div className="flex gap-4 items-center">
              <ResponsiveContainer width={140} height={140}>
                <PieChart>
                  <Pie data={STATUS_PIE_DATA} cx="50%" cy="50%" innerRadius={40} outerRadius={60} dataKey="value" stroke="none">
                    {STATUS_PIE_DATA.map((entry, index) => (
                      <Cell key={index} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2">
                {STATUS_PIE_DATA.map(d => (
                  <div key={d.name} className="flex items-center gap-2 text-xs">
                    <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: d.fill }} />
                    <span className="text-slate-600 flex-1">{d.name}</span>
                    <span className="font-bold text-navy-800">{d.value.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </motion.div>

        {/* SLA Breach Trend */}
        <motion.div className="col-span-3" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
          <Card className="p-5">
            <h3 className="text-sm font-bold text-navy-900 mb-4">{t('SLA Breaches (7 days)', 'SLA उल्लंघने (7 दिवस)')}</h3>
            <ResponsiveContainer width="100%" height={140}>
              <AreaChart data={SLA_TREND_DATA} margin={{ top: 5, right: 5, left: -30, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#94A3B8' }} />
                <YAxis tick={{ fontSize: 10, fill: '#94A3B8' }} />
                <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: 11 }} />
                <Area type="monotone" dataKey="breaches" stroke="#DC2626" fill="#FEE2E2" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-12 gap-4">
        {/* Exceptions Queue */}
        <motion.div className="col-span-7" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-navy-900">{t('Exceptions Queue', 'अपवाद रांग')}</h3>
              <Badge variant="danger">3 active</Badge>
            </div>
            <div className="space-y-3">
              {EXCEPTIONS.map(ex => (
                <div key={ex.id} className={clsx('border rounded-xl p-4 flex gap-4 items-start',
                  ex.status === 'Resolved' ? 'border-verified-100 bg-verified-50/30' :
                  ex.status === 'Active' ? 'border-red-200 bg-red-50/30' :
                  'border-amber-100 bg-amber-50/30'
                )}>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-xs font-bold text-navy-800">{ex.id}</span>
                      <span className="text-[10px] text-slate-400">·</span>
                      <span className="text-xs text-slate-500">{ex.case}</span>
                      <Badge variant={ex.status === 'Resolved' ? 'verified' : ex.status === 'Active' ? 'danger' : 'warning'}>
                        {ex.status}
                      </Badge>
                    </div>
                    <p className="text-xs font-semibold text-navy-700 mb-0.5">{ex.type} — {ex.dept}</p>
                    <p className="text-[11px] text-slate-500">{ex.message}</p>
                    <div className="flex gap-3 mt-1 text-[10px] text-slate-400">
                      <span>⏱ {ex.time}</span>
                      <span>🔄 Retries: {ex.retries}/3</span>
                    </div>
                  </div>
                  {ex.status !== 'Resolved' && (
                    <Button
                      variant="danger"
                      size="sm"
                      loading={escalating === ex.id}
                      onClick={() => handleEscalate(ex.id)}
                      className="shrink-0"
                    >
                      Escalate
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Adapter Health Table */}
        <motion.div className="col-span-5" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
          <Card className="p-5">
            <h3 className="text-sm font-bold text-navy-900 mb-4">{t('Adapter Health', 'अडॅप्टर स्वास्थ्य')}</h3>
            <div className="space-y-2">
              <div className="grid grid-cols-4 text-[10px] text-slate-400 font-semibold uppercase tracking-wide px-2 pb-1 border-b border-slate-100">
                <span>{t('Department', 'विभाग')}</span>
                <span className="text-center">{t('Protocol', 'प्रोटोकॉल')}</span>
                <span className="text-center">{t('Latency', 'विलंब')}</span>
                <span className="text-center">{t('Health', 'स्वास्थ्य')}</span>
              </div>
              {DEPT_NODES.map(d => (
                <div key={d.id} className={clsx('grid grid-cols-4 items-center text-xs px-2 py-2 rounded-lg', d.onboarded ? 'hover:bg-slate-50' : 'opacity-50')}>
                  <span className="font-medium text-navy-800 truncate">{d.label}</span>
                  <div className="flex justify-center"><ProtocolBadge protocol={d.adapter} /></div>
                  <span className="text-center text-slate-600 font-mono">{d.latency}</span>
                  <div className="flex justify-center items-center gap-1.5">
                    <HealthDot health={d.health} />
                    <span className={clsx('text-[10px] font-semibold',
                      d.health === 'healthy' ? 'text-verified-600' :
                      d.health === 'warning' ? 'text-warning-600' : 'text-slate-400'
                    )}>{d.health}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
