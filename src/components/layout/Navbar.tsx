import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { clsx } from 'clsx';
import { useApp } from '../../context/AppContext';
import type { Role, Language } from '../../types';

const ROLE_LABELS: Record<Role, { label: string; badge: string; color: string }> = {
  'citizen':           { label: 'Citizen', badge: 'Rohan Patil', color: 'bg-navy-100 text-navy-800' },
  'officer-revenue':   { label: 'Revenue Officer', badge: 'Meena Kulkarni', color: 'bg-saffron-100 text-saffron-800' },
  'officer-education': { label: 'Education Officer', badge: 'Priya Sharma', color: 'bg-purple-100 text-purple-800' },
  'admin':             { label: 'Administrator', badge: 'Suresh Rane', color: 'bg-verified-100 text-verified-800' },
};

const ROLE_ROUTES: Record<Role, string> = {
  'citizen': '/citizen',
  'officer-revenue': '/officer',
  'officer-education': '/officer',
  'admin': '/admin',
};

const NAV_LINKS: Array<{ label: string; labelMr: string; path: string; roles: Role[] }> = [
  { label: 'Dashboard',     labelMr: 'डॅशबोर्ड',     path: '/citizen',          roles: ['citizen'] },
  { label: 'Apply Once',    labelMr: 'एकदाच अर्ज',    path: '/citizen/apply',    roles: ['citizen'] },
  { label: 'Case Tracker',  labelMr: 'केस ट्रॅकर',   path: '/citizen/tracker',  roles: ['citizen'] },
  { label: 'Fact Exchange', labelMr: 'तथ्य देवाण',   path: '/citizen/facts',    roles: ['citizen'] },
  { label: 'Consent',       labelMr: 'संमती',        path: '/citizen/consent',  roles: ['citizen'] },
  { label: 'My Queue',      labelMr: 'रांग',          path: '/officer',          roles: ['officer-revenue', 'officer-education'] },
  { label: 'Referral Map',  labelMr: 'रेफरल मॅप',    path: '/officer/referral', roles: ['officer-revenue', 'officer-education'] },
  { label: 'Command Center',labelMr: 'नियंत्रण केंद्र',path: '/admin',           roles: ['admin'] },
  { label: 'Audit Trail',   labelMr: 'ऑडिट ट्रेल',   path: '/admin/audit',      roles: ['admin'] },
  { label: 'Before vs After',labelMr: 'पूर्वी vs आता',path: '/before-after',     roles: ['citizen', 'officer-revenue', 'officer-education', 'admin'] },
];

export function Navbar() {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [roleOpen, setRoleOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  const { label, badge, color } = ROLE_LABELS[state.role];
  const lang = state.language;

  const switchRole = (role: Role) => {
    dispatch({ type: 'SET_ROLE', role });
    setRoleOpen(false);
    navigate(ROLE_ROUTES[role]);
  };

  const visibleLinks = NAV_LINKS.filter(l => l.roles.includes(state.role));

  if (!state.isLoggedIn) return null;

  return (
    <header className="h-14 bg-navy-900 flex items-center px-6 gap-4 shrink-0 relative z-40">
      {/* Logo */}
      <button
        className="flex items-center gap-2.5 shrink-0 group"
        onClick={() => navigate(ROLE_ROUTES[state.role])}
      >
        {/* Sutradhar symbol */}
        <div className="w-8 h-8 rounded-lg bg-saffron-500 flex items-center justify-center">
          <svg viewBox="0 0 32 32" className="w-5 h-5 text-white" fill="currentColor">
            <path d="M16 4 L28 10 L28 22 L16 28 L4 22 L4 10 Z" fill="none" stroke="currentColor" strokeWidth="2.5"/>
            <circle cx="16" cy="16" r="3" fill="currentColor"/>
            <line x1="16" y1="16" x2="16" y2="6" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 2"/>
            <line x1="16" y1="16" x2="25" y2="11" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 2"/>
            <line x1="16" y1="16" x2="25" y2="21" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 2"/>
            <line x1="16" y1="16" x2="16" y2="26" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 2"/>
          </svg>
        </div>
        <div>
          <span className="text-white font-bold text-sm tracking-wide group-hover:text-saffron-300 transition-colors">SUTRADHAR</span>
          <span className="block text-navy-300 text-[9px] leading-none">Gov. of Maharashtra</span>
        </div>
      </button>

      {/* Nav Links */}
      <nav className="flex items-center gap-1 ml-4 overflow-hidden">
        {visibleLinks.slice(0, 7).map(link => (
          <button
            key={link.path}
            onClick={() => navigate(link.path)}
            className={clsx(
              'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap',
              location.pathname === link.path || location.pathname.startsWith(link.path + '/')
                ? 'bg-white/15 text-white'
                : 'text-navy-300 hover:text-white hover:bg-white/10'
            )}
          >
            {lang === 'en' ? link.label : link.labelMr}
          </button>
        ))}
      </nav>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Case ID pill */}
      {(state.role === 'citizen' || state.role === 'officer-revenue') && (
        <div className="hidden lg:flex items-center gap-1.5 bg-saffron-500/20 border border-saffron-500/40 rounded-lg px-3 py-1">
          <span className="text-saffron-300 text-[10px] font-medium">Active Case</span>
          <span className="text-saffron-200 text-xs font-bold">SUT-2026-004821</span>
        </div>
      )}

      {/* Language Toggle */}
      <div className="relative">
        <button
          onClick={() => { setLangOpen(!langOpen); setRoleOpen(false); }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-navy-200 hover:text-white hover:bg-white/10 transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"/></svg>
          {lang === 'en' ? 'EN' : lang === 'hi' ? 'हि' : 'मर'}
        </button>
        {langOpen && (
          <div className="absolute right-0 top-9 bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden z-50 w-28">
            {(['en', 'hi', 'mr'] as Language[]).map(l => (
              <button
                key={l}
                onClick={() => { dispatch({ type: 'SET_LANGUAGE', language: l }); setLangOpen(false); }}
                className={clsx('w-full px-4 py-2.5 text-left text-sm hover:bg-slate-50 transition-colors', lang === l ? 'text-navy-700 font-bold' : 'text-slate-600')}
              >
                {l === 'en' ? '🇬🇧 English' : l === 'hi' ? '🇮🇳 हिन्दी' : '🇮🇳 मराठी'}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Role Switcher */}
      <div className="relative">
        <button
          id="role-switcher"
          onClick={() => { setRoleOpen(!roleOpen); setLangOpen(false); }}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
        >
          <div className={clsx('px-2 py-0.5 rounded text-[10px] font-bold', color)}>{label}</div>
          <span className="text-white text-xs">{badge}</span>
          <svg className={clsx('w-3.5 h-3.5 text-navy-300 transition-transform', roleOpen && 'rotate-180')} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/></svg>
        </button>
        {roleOpen && (
          <div className="absolute right-0 top-10 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden z-50 w-52">
            {(Object.keys(ROLE_LABELS) as Role[]).map(r => (
              <button
                key={r}
                onClick={() => switchRole(r)}
                className={clsx('w-full px-4 py-3 text-left hover:bg-slate-50 transition-colors flex items-center gap-3', state.role === r && 'bg-navy-50')}
              >
                <div className={clsx('px-2 py-0.5 rounded text-[10px] font-bold', ROLE_LABELS[r].color)}>{ROLE_LABELS[r].label}</div>
                <span className="text-sm text-slate-600">{ROLE_LABELS[r].badge}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Mock JWT badge */}
      <div className="hidden lg:flex items-center gap-1 bg-white/5 border border-white/10 rounded-lg px-2 py-1">
        <svg className="w-3 h-3 text-verified-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/></svg>
        <span className="text-navy-300 text-[10px]">JWT·RBAC</span>
      </div>
    </header>
  );
}
