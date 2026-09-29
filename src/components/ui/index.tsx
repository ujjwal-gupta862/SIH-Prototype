import React from 'react';
import { clsx } from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';
import type { ToastMsg } from '../../types';

// ─── Button ─────────────────────────────────────────────────────────────────
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

export function Button({ variant = 'primary', size = 'md', loading, className, children, disabled, ...props }: ButtonProps) {
  const base = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed select-none';
  const variants = {
    primary: 'bg-navy-600 text-white hover:bg-navy-700 focus:ring-navy-600 active:scale-95',
    secondary: 'bg-saffron-500 text-white hover:bg-saffron-600 focus:ring-saffron-500 active:scale-95',
    ghost: 'bg-transparent text-navy-600 hover:bg-navy-50 border border-navy-200 focus:ring-navy-400',
    danger: 'bg-danger-600 text-white hover:bg-danger-600/90 focus:ring-danger-500',
    success: 'bg-verified-500 text-white hover:bg-verified-600 focus:ring-verified-500',
  };
  const sizes = {
    sm: 'h-8 px-3 text-xs gap-1.5',
    md: 'h-10 px-4 text-sm gap-2',
    lg: 'h-12 px-6 text-base gap-2',
  };
  return (
    <button
      className={clsx(base, variants[variant], sizes[size], className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </button>
  );
}

// ─── Card ────────────────────────────────────────────────────────────────────
interface CardProps { children: React.ReactNode; className?: string; onClick?: () => void; }
export function Card({ children, className, onClick }: CardProps) {
  return (
    <div
      className={clsx('bg-white rounded-2xl shadow-sm border border-slate-100', onClick && 'cursor-pointer hover:shadow-md transition-shadow', className)}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

// ─── Badge ───────────────────────────────────────────────────────────────────
type BadgeVariant = 'navy' | 'saffron' | 'verified' | 'warning' | 'danger' | 'neutral' | 'rest' | 'soap';
export function Badge({ children, variant = 'neutral', className }: { children: React.ReactNode; variant?: BadgeVariant; className?: string }) {
  const variants: Record<BadgeVariant, string> = {
    navy: 'bg-navy-50 text-navy-700 border-navy-200',
    saffron: 'bg-saffron-50 text-saffron-700 border-saffron-200',
    verified: 'bg-verified-50 text-verified-700 border-verified-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    danger: 'bg-red-50 text-red-700 border-red-200',
    neutral: 'bg-slate-50 text-slate-600 border-slate-200',
    rest: 'bg-blue-50 text-blue-700 border-blue-200',
    soap: 'bg-purple-50 text-purple-700 border-purple-200',
  };
  return (
    <span className={clsx('inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold border', variants[variant], className)}>
      {children}
    </span>
  );
}

// ─── Progress ────────────────────────────────────────────────────────────────
export function Progress({ value, max = 100, className }: { value: number; max?: number; className?: string }) {
  const pct = Math.round((value / max) * 100);
  return (
    <div className={clsx('w-full bg-slate-100 rounded-full overflow-hidden', className)} style={{ height: 8 }}>
      <motion.div
        className="h-full bg-gradient-to-r from-navy-600 to-saffron-500 rounded-full"
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      />
    </div>
  );
}

// ─── Status Chip ─────────────────────────────────────────────────────────────
type StatusType = 'active' | 'completed' | 'pending' | 'exception' | 'retry' | 'sla-breach';
export function StatusChip({ status }: { status: StatusType }) {
  const map: Record<StatusType, { label: string; className: string; dot: string }> = {
    active:      { label: 'In Progress', className: 'bg-blue-50 text-blue-700', dot: 'bg-blue-500 animate-pulse' },
    completed:   { label: 'Completed', className: 'bg-verified-50 text-verified-700', dot: 'bg-verified-500' },
    pending:     { label: 'Pending', className: 'bg-slate-50 text-slate-500', dot: 'bg-slate-400' },
    exception:   { label: 'Exception', className: 'bg-red-50 text-red-700', dot: 'bg-danger-500 animate-pulse' },
    retry:       { label: 'Retry', className: 'bg-amber-50 text-amber-700', dot: 'bg-warning-500 animate-pulse' },
    'sla-breach':{ label: 'SLA Breached', className: 'bg-red-50 text-red-700', dot: 'bg-danger-600 animate-pulse' },
  };
  const { label, className, dot } = map[status];
  return (
    <span className={clsx('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold', className)}>
      <span className={clsx('w-1.5 h-1.5 rounded-full', dot)} />
      {label}
    </span>
  );
}

// ─── Modal / Dialog ──────────────────────────────────────────────────────────
interface ModalProps { open: boolean; onClose: () => void; title: string; children: React.ReactNode; className?: string; }
export function Modal({ open, onClose, title, children, className }: ModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="backdrop"
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            key="modal"
            className={clsx('fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl z-50 flex flex-col', className)}
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          >
            <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-slate-100">
              <h2 className="text-base font-bold text-navy-800">{title}</h2>
              <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Toast Container ─────────────────────────────────────────────────────────
export function ToastContainer({ toasts, onRemove }: { toasts: ToastMsg[]; onRemove: (id: string) => void }) {
  const icons: Record<ToastMsg['type'], React.ReactNode> = {
    success: <svg className="w-5 h-5 text-verified-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>,
    error:   <svg className="w-5 h-5 text-danger-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>,
    warning: <svg className="w-5 h-5 text-warning-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/></svg>,
    info:    <svg className="w-5 h-5 text-navy-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>,
  };
  const borders: Record<ToastMsg['type'], string> = {
    success: 'border-l-4 border-verified-500',
    error:   'border-l-4 border-danger-500',
    warning: 'border-l-4 border-warning-500',
    info:    'border-l-4 border-navy-500',
  };

  return (
    <div className="fixed top-20 right-5 z-[100] flex flex-col gap-2 w-80">
      <AnimatePresence>
        {toasts.map(t => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, x: 80 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 80 }}
            className={clsx('bg-white rounded-xl shadow-lg p-4 flex gap-3 items-start', borders[t.type])}
          >
            <div className="shrink-0 mt-0.5">{icons[t.type]}</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-800">{t.title}</p>
              <p className="text-xs text-slate-500 mt-0.5">{t.message}</p>
            </div>
            <button onClick={() => onRemove(t.id)} className="shrink-0 text-slate-300 hover:text-slate-500">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// ─── Skeleton ────────────────────────────────────────────────────────────────
export function Skeleton({ className }: { className?: string }) {
  return <div className={clsx('animate-shimmer rounded-lg', className)} />;
}

// ─── Verified Tick ────────────────────────────────────────────────────────────
export function VerifiedTick({ className }: { className?: string }) {
  return (
    <span className={clsx('inline-flex items-center gap-1 text-verified-600 text-xs font-semibold', className)}>
      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
        <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd"/>
      </svg>
      Schema Validated
    </span>
  );
}

// ─── Section Header ──────────────────────────────────────────────────────────
export function SectionHeader({ icon, title, subtitle, action }: { icon: React.ReactNode; title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-navy-50 flex items-center justify-center text-navy-600">{icon}</div>
        <div>
          <h2 className="text-base font-bold text-navy-900">{title}</h2>
          {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
        </div>
      </div>
      {action}
    </div>
  );
}

// ─── Protocol Badge ──────────────────────────────────────────────────────────
export function ProtocolBadge({ protocol }: { protocol: 'REST' | 'SOAP' }) {
  return (
    <Badge variant={protocol === 'REST' ? 'rest' : 'soap'}>
      {protocol === 'REST' ? '⚡ REST/JSON' : '🔌 SOAP/XML'}
    </Badge>
  );
}

// ─── Health Dot ────────────────────────────────────────────────────────────
export function HealthDot({ health }: { health: 'healthy' | 'warning' | 'critical' }) {
  const map = {
    healthy:  'bg-verified-500',
    warning:  'bg-warning-500',
    critical: 'bg-danger-500',
  };
  return <span className={clsx('inline-block w-2.5 h-2.5 rounded-full', map[health], health !== 'critical' && 'animate-pulse')} />;
}

// ─── KPI Card ──────────────────────────────────────────────────────────────
export function KPICard({ icon, label, value, sub, trend, color }: {
  icon: React.ReactNode; label: string; value: string | number; sub?: string;
  trend?: 'up' | 'down'; color?: string;
}) {
  return (
    <Card className="p-5 flex gap-4 items-start">
      <div className={clsx('w-11 h-11 rounded-xl flex items-center justify-center shrink-0', color || 'bg-navy-50 text-navy-600')}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-slate-500 font-medium">{label}</p>
        <p className="text-2xl font-bold text-navy-900 mt-0.5">{value}</p>
        {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
      </div>
      {trend && (
        <span className={clsx('text-xs font-semibold px-2 py-0.5 rounded-full', trend === 'up' ? 'bg-verified-50 text-verified-600' : 'bg-red-50 text-red-600')}>
          {trend === 'up' ? '↑' : '↓'}
        </span>
      )}
    </Card>
  );
}
