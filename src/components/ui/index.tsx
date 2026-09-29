import { useState } from 'react';
import type { ReactNode, ButtonHTMLAttributes } from 'react';
import { X, CheckCircle, AlertTriangle, Info, AlertCircle, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

// ─── Toast ───────────────────────────────────────────────────────────────────

export interface ToastMsg {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
}

const TOAST_ICONS: Record<ToastMsg['type'], typeof CheckCircle> = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

const TOAST_COLORS: Record<ToastMsg['type'], string> = {
  success: 'border-verified-500 bg-verified-50',
  error: 'border-danger-500 bg-red-50',
  warning: 'border-saffron-500 bg-saffron-50',
  info: 'border-navy-500 bg-navy-50',
};

const TOAST_ICON_COLORS: Record<ToastMsg['type'], string> = {
  success: 'text-verified-600',
  error: 'text-danger-600',
  warning: 'text-saffron-600',
  info: 'text-navy-600',
};

export function Toast({ toast, onRemove }: { toast: ToastMsg; onRemove: () => void }) {
  const Icon = TOAST_ICONS[toast.type];
  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 40 }}
      className={`flex items-start gap-2 p-3 rounded-xl border-l-4 shadow-lg bg-white ${TOAST_COLORS[toast.type]} max-w-sm`}
    >
      <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${TOAST_ICON_COLORS[toast.type]}`} />
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-navy-800">{toast.title}</p>
        <p className="text-[10px] text-slate-600 mt-0.5">{toast.message}</p>
      </div>
      <button
        onClick={onRemove}
        className="text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
        aria-label="Dismiss"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </motion.div>
  );
}

export function ToastContainer({ toasts, onRemove }: { toasts: ToastMsg[]; onRemove: (id: string) => void }) {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2" aria-live="polite">
      <AnimatePresence>
        {toasts.map(t => (
          <Toast key={t.id} toast={t} onRemove={() => onRemove(t.id)} />
        ))}
      </AnimatePresence>
    </div>
  );
}

// ─── Card ────────────────────────────────────────────────────────────────────

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={clsx('bg-white rounded-xl shadow-sm border border-slate-100', className)}>
      {children}
    </div>
  );
}

// ─── Badge ───────────────────────────────────────────────────────────────────

const BADGE_VARIANTS: Record<string, string> = {
  verified: 'bg-verified-50 text-verified-700 border-verified-200',
  warning: 'bg-amber-50 text-amber-700 border-amber-200',
  danger: 'bg-red-50 text-red-700 border-red-200',
  neutral: 'bg-slate-50 text-slate-600 border-slate-200',
  navy: 'bg-navy-50 text-navy-700 border-navy-200',
  saffron: 'bg-saffron-50 text-saffron-700 border-saffron-200',
  rest: 'bg-blue-50 text-blue-700 border-blue-200',
  soap: 'bg-purple-50 text-purple-700 border-purple-200',
  info: 'bg-sky-50 text-sky-700 border-sky-200',
};

export function Badge({ children, variant = 'neutral', className = '' }: { children: ReactNode; variant?: keyof typeof BADGE_VARIANTS; className?: string }) {
  return (
    <span className={clsx('inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md border', BADGE_VARIANTS[variant] || BADGE_VARIANTS.neutral, className)}>
      {children}
    </span>
  );
}

// ─── Button ──────────────────────────────────────────────────────────────────

const BTN_VARIANTS: Record<string, string> = {
  primary: 'bg-navy-600 text-white hover:bg-navy-700 focus:ring-navy-400',
  secondary: 'bg-white text-navy-700 border border-slate-200 hover:bg-slate-50 focus:ring-navy-300',
  ghost: 'text-navy-600 hover:bg-navy-50 focus:ring-navy-300',
  danger: 'bg-danger-500 text-white hover:bg-danger-600 focus:ring-danger-400',
  success: 'bg-verified-500 text-white hover:bg-verified-600 focus:ring-verified-400',
};
const BTN_SIZES: Record<string, string> = {
  sm: 'px-2.5 py-1 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-2.5 text-sm',
};

export function Button({ children, variant = 'primary', size = 'md', loading = false, className = '', ...props }: {
  children: ReactNode;
  variant?: keyof typeof BTN_VARIANTS;
  size?: keyof typeof BTN_SIZES;
  loading?: boolean;
  className?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center gap-1.5 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2',
        BTN_VARIANTS[variant] || BTN_VARIANTS.primary,
        BTN_SIZES[size] || BTN_SIZES.md,
        loading && 'opacity-70 cursor-wait',
        className,
      )}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading && (
        <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </button>
  );
}

// ─── Progress ────────────────────────────────────────────────────────────────

export function Progress({ value, className = '' }: { value: number; className?: string }) {
  const color = value >= 80 ? 'bg-verified-500' : value >= 40 ? 'bg-saffron-500' : 'bg-navy-500';
  return (
    <div className={clsx('h-1.5 bg-slate-100 rounded-full overflow-hidden', className)}>
      <motion.div
        className={clsx('h-full rounded-full', color)}
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      />
    </div>
  );
}

// ─── StatusChip ──────────────────────────────────────────────────────────────

const STATUS_COLORS: Record<string, string> = {
  active: 'bg-blue-50 text-blue-700',
  completed: 'bg-verified-50 text-verified-700',
  pending: 'bg-slate-50 text-slate-600',
  failed: 'bg-red-50 text-red-700',
  approved: 'bg-verified-50 text-verified-700',
  rejected: 'bg-red-50 text-red-700',
  processing: 'bg-saffron-50 text-saffron-700',
  submitted: 'bg-blue-50 text-blue-700',
  routing: 'bg-sky-50 text-sky-700',
  paid: 'bg-verified-50 text-verified-700',
  closed: 'bg-slate-100 text-slate-500',
  blocked: 'bg-red-50 text-red-700',
  referred: 'bg-purple-50 text-purple-700',
  'needs-info': 'bg-amber-50 text-amber-700',
  'awaiting-consent': 'bg-saffron-50 text-saffron-700',
};

export function StatusChip({ status }: { status: string }) {
  return (
    <span className={clsx('text-[10px] font-semibold px-2 py-0.5 rounded-md capitalize', STATUS_COLORS[status] || 'bg-slate-50 text-slate-600')}>
      {status.replace(/-/g, ' ')}
    </span>
  );
}

// ─── VerifiedTick ────────────────────────────────────────────────────────────

export function VerifiedTick() {
  return (
    <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-verified-600 bg-verified-50 px-1.5 py-0.5 rounded">
      <Shield className="w-2.5 h-2.5" /> Verified
    </span>
  );
}

// ─── HealthDot ───────────────────────────────────────────────────────────────

export function HealthDot({ health }: { health: 'healthy' | 'warning' | 'critical' | 'degraded' | 'down' }) {
  const c = health === 'healthy' ? 'bg-verified-500' : health === 'warning' || health === 'degraded' ? 'bg-saffron-500' : 'bg-danger-500';
  return <span className={clsx('inline-block w-2 h-2 rounded-full shrink-0', c, health === 'healthy' && 'animate-pulse')} />;
}

// ─── ProtocolBadge ───────────────────────────────────────────────────────────

export function ProtocolBadge({ protocol }: { protocol: 'REST' | 'SOAP' | 'REST/JSON' | 'SOAP/XML' }) {
  const isRest = protocol.includes('REST');
  return (
    <span className={clsx('text-[9px] font-bold px-1.5 py-0.5 rounded font-mono',
      isRest ? 'bg-blue-50 text-blue-700' : 'bg-purple-50 text-purple-700'
    )}>
      {protocol}
    </span>
  );
}

// ─── KPICard ─────────────────────────────────────────────────────────────────

export function KPICard({ icon, label, value, sub, color }: {
  icon: ReactNode;
  label: string;
  value: string;
  sub?: string;
  color?: string;
  trend?: 'up' | 'down';
}) {
  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 mb-2">
        <div className={clsx('p-1.5 rounded-lg', color || 'bg-navy-50 text-navy-600')}>{icon}</div>
        <span className="text-xs text-slate-500 font-medium">{label}</span>
      </div>
      <p className="text-2xl font-bold text-navy-800 tabular-nums">{value}</p>
      {sub && <p className="text-[10px] text-slate-400 mt-0.5">{sub}</p>}
    </Card>
  );
}

// ─── SectionHeader ───────────────────────────────────────────────────────────

export function SectionHeader({ icon, title, subtitle, action }: {
  icon?: ReactNode;
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        {icon && <span className="text-navy-500">{icon}</span>}
        <div>
          <h3 className="text-sm font-bold text-navy-900">{title}</h3>
          {subtitle && <p className="text-[10px] text-slate-400 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {action}
    </div>
  );
}

// ─── Tabs ────────────────────────────────────────────────────────────────────

export function Tabs({ tabs, activeTab, onChange }: {
  tabs: { id: string; label: string; count?: number }[];
  activeTab: string;
  onChange: (id: string) => void;
}) {
  return (
    <div className="flex gap-1 border-b border-slate-100 mb-4">
      {tabs.map(t => (
        <button
          key={t.id}
          onClick={() => onChange(t.id)}
          className={clsx(
            'px-3 py-2 text-xs font-medium rounded-t-lg transition-colors focus:outline-none',
            activeTab === t.id
              ? 'bg-navy-50 text-navy-700 border-b-2 border-navy-500'
              : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
          )}
        >
          {t.label}
          {t.count !== undefined && (
            <span className="ml-1.5 text-[9px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-full">{t.count}</span>
          )}
        </button>
      ))}
    </div>
  );
}

// ─── Drawer ──────────────────────────────────────────────────────────────────

export function Drawer({ open, onClose, title, children }: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-96 bg-white shadow-2xl z-50 flex flex-col"
          >
            <div className="flex items-center justify-between p-4 border-b border-slate-100">
              <h3 className="text-sm font-bold text-navy-800">{title}</h3>
              <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-lg transition-colors" aria-label="Close">
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Modal ───────────────────────────────────────────────────────────────────

export function Modal({ open, onClose, title, children }: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative bg-white rounded-xl shadow-2xl max-w-lg w-full mx-4 max-h-[80vh] flex flex-col"
          >
            <div className="flex items-center justify-between p-4 border-b border-slate-100">
              <h3 className="text-sm font-bold text-navy-800">{title}</h3>
              <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-lg" aria-label="Close">
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

// ─── Sparkline ───────────────────────────────────────────────────────────────

export function Sparkline({ data, width = 80, height = 24, color = '#2B5ECC' }: {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
}) {
  if (data.length < 2) return null;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / range) * (height - 4) - 2;
    return `${x},${y}`;
  }).join(' ');
  return (
    <svg width={width} height={height} className="inline-block">
      <polyline fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" points={points} />
    </svg>
  );
}

// ─── JsonView ────────────────────────────────────────────────────────────────

export function JsonView({ data, collapsed = false }: { data: unknown; collapsed?: boolean }) {
  const [open, setOpen] = useState(!collapsed);
  if (data === null || data === undefined) return <span className="text-slate-400 text-xs font-mono">null</span>;
  if (typeof data === 'string') return <span className="text-verified-600 text-xs font-mono">"{data}"</span>;
  if (typeof data === 'number' || typeof data === 'boolean') return <span className="text-saffron-600 text-xs font-mono">{String(data)}</span>;
  if (Array.isArray(data)) {
    return (
      <div className="text-xs font-mono">
        <button onClick={() => setOpen(!open)} className="text-slate-400 hover:text-navy-600">
          {open ? '▼' : '▶'} [{data.length}]
        </button>
        {open && (
          <div className="ml-4 border-l border-slate-100 pl-2">
            {data.map((item, i) => <div key={i}><JsonView data={item} collapsed /></div>)}
          </div>
        )}
      </div>
    );
  }
  if (typeof data === 'object') {
    const entries = Object.entries(data as Record<string, unknown>);
    return (
      <div className="text-xs font-mono">
        <button onClick={() => setOpen(!open)} className="text-slate-400 hover:text-navy-600">
          {open ? '▼' : '▶'} {'{'}...{'}'}
        </button>
        {open && (
          <div className="ml-4 border-l border-slate-100 pl-2">
            {entries.map(([k, v]) => (
              <div key={k}>
                <span className="text-navy-600">{k}</span>: <JsonView data={v} collapsed />
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
  return null;
}

// ─── Stat ────────────────────────────────────────────────────────────────────

export function Stat({ label, value, sub, icon }: {
  label: string;
  value: string | number;
  sub?: string;
  icon?: ReactNode;
}) {
  return (
    <div className="bg-slate-50 rounded-lg p-3">
      <div className="flex items-center gap-1.5 mb-1">
        {icon}
        <span className="text-[10px] text-slate-400 uppercase tracking-wide font-medium">{label}</span>
      </div>
      <p className="text-lg font-bold text-navy-800 tabular-nums">{value}</p>
      {sub && <p className="text-[10px] text-slate-400 mt-0.5">{sub}</p>}
    </div>
  );
}

// ─── Table ───────────────────────────────────────────────────────────────────

export function Table({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={clsx('overflow-x-auto', className)}>
      <table className="w-full text-xs">
        {children}
      </table>
    </div>
  );
}

export function Th({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <th className={clsx('text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wide px-3 py-2 border-b border-slate-100', className)}>{children}</th>;
}

export function Td({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <td className={clsx('px-3 py-2.5 border-b border-slate-50 text-slate-700', className)}>{children}</td>;
}

// ─── EmptyState ──────────────────────────────────────────────────────────────

export function EmptyState({ icon, title, message }: { icon?: ReactNode; title: string; message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      {icon && <div className="text-slate-300 mb-3">{icon}</div>}
      <p className="text-sm font-semibold text-slate-500">{title}</p>
      {message && <p className="text-xs text-slate-400 mt-1 max-w-xs">{message}</p>}
    </div>
  );
}

// ─── LoadingState ────────────────────────────────────────────────────────────

export function LoadingState({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <svg className="animate-spin w-6 h-6 text-navy-500 mb-3" viewBox="0 0 24 24" fill="none">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>
      <p className="text-xs text-slate-400">{message}</p>
    </div>
  );
}
