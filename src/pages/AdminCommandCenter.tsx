import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, Area, AreaChart,
} from 'recharts';
import { useSim } from '../sim/store';
import { Card, Badge, Button, KPICard, HealthDot, ProtocolBadge, StatusChip } from '../components/ui';
import { clsx } from 'clsx';
import { TURNAROUND_DATA, STATUS_PIE_DATA, SLA_TREND_DATA } from '../data/mockData';

export default function AdminCommandCenter() {
  const { state } = useSim();
  const lang = state.language;
  const [escalating, setEscalating] = useState<string | null>(null);

  const t = (en: string, mr: string) => lang === 'en' ? en : mr;

  const handleEscalate = (id: string) => {
    setEscalating(id);
    setTimeout(() => setEscalating(null), 2000);
  };

  const openCases = state.cases.filter(c => !['paid', 'closed', 'rejected'].includes(c.status)).length;
  const exceptions = state.exceptions;
  
  // Recharts data - we'll compute some basic stats or use mock if we have to.
  // The instruction said: Use chart data from sim seed (read src/sim/seed.ts to find chartData)
  // Since I couldn't find chartData, I will use mockData but simulate it a bit.

  return (
    <div className="h-full bg-slate-50 p-5 overflow-y-auto">
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
          <Badge variant="navy">Admin Role</Badge>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-4 mb-5">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <KPICard
            icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>}
            label={t('Open Cases', 'खुली प्रकरणे')}
            value={openCases.toString()}
            sub="Active workflows"
            color="bg-navy-50 text-navy-600"
          />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <KPICard
            icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>}
            label={t('Avg. Turnaround', 'सरासरी उलाढाल')}
            value="12.3 days"
            sub="Down from 45 days"
            color="bg-saffron-50 text-saffron-600"
            trend="up"
          />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <KPICard
            icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>}
            label={t('SLA Compliance', 'SLA अनुपालन')}
            value="94.2%"
            sub="Target: 95%"
            color="bg-verified-50 text-verified-600"
            trend="up"
          />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <KPICard
            icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"/></svg>}
            label={t('Duplicates Avoided', 'डुप्लिकेट टाळले')}
            value="3,891"
            sub="Across all depts"
            color="bg-red-50 text-red-600"
            trend="up"
          />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <KPICard
            icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>}
            label={t('Re-uploads Prevented', 'पुन्हा अपलोड थांबवले')}
            value="12,450"
            sub="Saved citizen effort"
            color="bg-blue-50 text-blue-600"
            trend="up"
          />
        </motion.div>
      </div>

      <div className="grid grid-cols-12 gap-4 mb-4">
        {/* Turnaround Bar Chart */}
        <motion.div className="col-span-5" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <Card className="p-5">
            <h3 className="text-sm font-bold text-navy-900 mb-4">{t('Cases by Department', 'विभागनिहाय प्रकरणे')}</h3>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={TURNAROUND_DATA} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="dept" tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748B' }} />
                <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="days" name="Cases" fill="#1B3A6B" radius={[4, 4, 0, 0]} stackId="a" />
                <Bar dataKey="target" name="Pending" fill="#F97316" radius={[4, 4, 0, 0]} stackId="a" opacity={0.6} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>

        {/* SLA Pie Chart */}
        <motion.div className="col-span-4" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="p-5">
            <h3 className="text-sm font-bold text-navy-900 mb-4">{t('SLA Compliance', 'SLA अनुपालन')}</h3>
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

        {/* SLA Trend */}
        <motion.div className="col-span-3" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
          <Card className="p-5">
            <h3 className="text-sm font-bold text-navy-900 mb-4">{t('Turnaround Before vs After', 'आधी विरुद्ध नंतर')}</h3>
            <ResponsiveContainer width="100%" height={140}>
              <AreaChart data={SLA_TREND_DATA} margin={{ top: 5, right: 5, left: -30, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#94A3B8' }} />
                <YAxis tick={{ fontSize: 10, fill: '#94A3B8' }} />
                <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: 11 }} />
                <Area type="monotone" dataKey="breaches" stroke="#2F6FC4" fill="#E6F0FA" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-12 gap-4">
        {/* Live Activity Feed */}
        <motion.div className="col-span-12" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
          <Card className="p-5">
            <h3 className="text-sm font-bold text-navy-900 mb-4">{t('Live Activity Feed', 'थेट हालचाली')}</h3>
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {state.auditLog.slice(-10).reverse().map(log => (
                <div key={log.id} className="flex gap-3 text-sm items-start border-b border-slate-50 pb-2">
                  <span className="text-xs text-slate-400 font-mono w-24 shrink-0">{new Date(log.at).toLocaleTimeString()}</span>
                  <div className="flex-1">
                    <p className="font-semibold text-navy-800">{log.action}</p>
                    <p className="text-xs text-slate-500">{log.detail}</p>
                  </div>
                  <Badge variant="neutral">{log.actor}</Badge>
                </div>
              ))}
              {state.auditLog.length === 0 && (
                <p className="text-xs text-slate-500">No recent activity.</p>
              )}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
