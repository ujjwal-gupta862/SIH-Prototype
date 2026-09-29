import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { useApp } from '../context/AppContext';
import type { Role } from '../types';

const ROLES: Array<{ id: Role; label: string; labelMr: string; desc: string; icon: string; route: string }> = [
  { id: 'citizen',           label: 'Citizen',           labelMr: 'नागरिक',        desc: 'Apply for services & track cases', icon: '👤', route: '/citizen' },
  { id: 'officer-revenue',   label: 'Revenue Officer',   labelMr: 'महसूल अधिकारी', desc: 'Process & approve income records', icon: '🏛', route: '/officer' },
  { id: 'officer-education', label: 'Education Officer', labelMr: 'शिक्षण अधिकारी',desc: 'Manage scholarship approvals',     icon: '🎓', route: '/officer' },
  { id: 'admin',             label: 'Administrator',     labelMr: 'प्रशासक',        desc: 'Command center & audit trail',    icon: '⚙️', route: '/admin' },
];

export default function Login() {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();
  const [mobile, setMobile] = useState('9876543210');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [selectedRole, setSelectedRole] = useState<Role>('citizen');
  const [step, setStep] = useState<'mobile' | 'otp'>('mobile');
  const [loading, setLoading] = useState(false);
  const lang = state.language;

  const handleOtpChange = (i: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    const newOtp = [...otp];
    newOtp[i] = val.slice(-1);
    setOtp(newOtp);
    if (val && i < 5) {
      const next = document.getElementById(`otp-${i + 1}`);
      next?.focus();
    }
  };

  const handleSendOtp = () => {
    if (mobile.length < 10) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); setStep('otp'); }, 700);
  };

  const handleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      dispatch({ type: 'SET_ROLE', role: selectedRole });
      dispatch({ type: 'LOGIN' });
      setLoading(false);
      const r = ROLES.find(r => r.id === selectedRole);
      navigate(r?.route || '/citizen');
    }, 600);
  };

  const otpFilled = otp.every(d => d !== '');

  return (
    <div className="w-full h-full flex bg-gradient-to-br from-navy-900 via-navy-800 to-navy-700 overflow-hidden">
      {/* Left Panel */}
      <div className="flex-1 flex flex-col items-center justify-center p-16 relative">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-saffron-500/5 blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-navy-400/10 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-white/5" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-white/5" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 text-center max-w-lg"
        >
          {/* Maharashtra Emblem */}
          <div className="flex justify-center mb-8">
            <div className="w-24 h-24 rounded-full bg-saffron-500/20 border-2 border-saffron-400/40 flex items-center justify-center">
              <svg viewBox="0 0 80 80" className="w-16 h-16" fill="none">
                {/* Stylized Ashoka wheel / emblem placeholder */}
                <circle cx="40" cy="40" r="36" stroke="#F97316" strokeWidth="2" fill="none"/>
                <circle cx="40" cy="40" r="24" stroke="#F97316" strokeWidth="1.5" fill="none"/>
                <circle cx="40" cy="40" r="4" fill="#F97316"/>
                {[0,30,60,90,120,150,180,210,240,270,300,330].map((deg, i) => {
                  const rad = (deg * Math.PI) / 180;
                  const x1 = 40 + 6 * Math.cos(rad);
                  const y1 = 40 + 6 * Math.sin(rad);
                  const x2 = 40 + 22 * Math.cos(rad);
                  const y2 = 40 + 22 * Math.sin(rad);
                  return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#F97316" strokeWidth="1.5"/>;
                })}
                <text x="40" y="66" textAnchor="middle" fill="#F97316" fontSize="5" fontWeight="600">महाराष्ट्र शासन</text>
              </svg>
            </div>
          </div>

          {/* Logo + Tagline */}
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-saffron-500 flex items-center justify-center">
              <svg viewBox="0 0 32 32" className="w-7 h-7 text-white" fill="currentColor">
                <path d="M16 4 L28 10 L28 22 L16 28 L4 22 L4 10 Z" fill="none" stroke="currentColor" strokeWidth="2.5"/>
                <circle cx="16" cy="16" r="3" fill="currentColor"/>
                <line x1="16" y1="16" x2="16" y2="6" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 2"/>
                <line x1="16" y1="16" x2="25" y2="11" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 2"/>
                <line x1="16" y1="16" x2="25" y2="21" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 2"/>
                <line x1="16" y1="16" x2="16" y2="26" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 2"/>
              </svg>
            </div>
            <h1 className="text-5xl font-black text-white tracking-tight">SUTRADHAR</h1>
          </div>
          <p className="text-saffron-300 text-xl font-semibold mb-2">
            {lang === 'en' ? 'One Case. Every Department.' : 'एक केस. प्रत्येक विभाग.'}
          </p>
          <p className="text-navy-300 text-sm leading-relaxed">
            {lang === 'en'
              ? 'Government Digital Platform Interoperability · Smart India Hackathon 2026'
              : 'शासकीय डिजिटल प्लॅटफॉर्म इंटरऑपरेबिलिटी · SIH 2026'}
          </p>
          <p className="text-navy-400 text-xs mt-1">PS SIH26129 · Team Last Commit</p>

          {/* Stats row */}
          <div className="mt-10 grid grid-cols-3 gap-6">
            {[
              { v: '1', u: 'Case ID',      u2: 'केस ID' },
              { v: '0', u: 'Repeat Docs',  u2: 'पुनरावृत्ती' },
              { v: '~10', u: 'Days avg.',  u2: 'सरासरी दिवस' },
            ].map(s => (
              <div key={s.u} className="bg-white/5 rounded-xl p-4 border border-white/10">
                <div className="text-3xl font-black text-saffron-400">{s.v}</div>
                <div className="text-navy-300 text-xs mt-1">{lang === 'en' ? s.u : s.u2}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right Panel – Login Card */}
      <div className="w-[480px] h-full flex items-center justify-center bg-white/5 backdrop-blur border-l border-white/10 p-10">
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full"
        >
          <h2 className="text-2xl font-bold text-white mb-1">
            {lang === 'en' ? 'Sign In' : 'साइन इन'}
          </h2>
          <p className="text-navy-300 text-sm mb-8">
            {lang === 'en' ? 'Use your registered mobile number' : 'नोंदणीकृत मोबाइल नंबर वापरा'}
          </p>

          {/* Role Selector */}
          <div className="mb-6">
            <label className="block text-navy-200 text-xs font-semibold mb-2 uppercase tracking-wide">
              {lang === 'en' ? 'Sign in as' : 'म्हणून साइन इन'}
            </label>
            <div className="grid grid-cols-2 gap-2">
              {ROLES.map(r => (
                <button
                  key={r.id}
                  id={`role-${r.id}`}
                  onClick={() => setSelectedRole(r.id)}
                  className={clsx(
                    'flex items-center gap-2 p-3 rounded-xl border text-left transition-all',
                    selectedRole === r.id
                      ? 'border-saffron-400 bg-saffron-500/20 text-white'
                      : 'border-white/10 bg-white/5 text-navy-300 hover:border-white/20 hover:bg-white/10'
                  )}
                >
                  <span className="text-xl shrink-0">{r.icon}</span>
                  <div>
                    <div className="text-xs font-bold">{lang === 'en' ? r.label : r.labelMr}</div>
                    <div className="text-[10px] opacity-60 leading-tight">{r.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Mobile Input */}
          <div className="mb-4">
            <label className="block text-navy-200 text-xs font-semibold mb-2 uppercase tracking-wide">
              {lang === 'en' ? 'Mobile Number' : 'मोबाइल नंबर'}
            </label>
            <div className="flex gap-2">
              <div className="flex items-center bg-white/10 border border-white/20 rounded-xl px-3 text-navy-200 text-sm font-medium">
                🇮🇳 +91
              </div>
              <input
                id="mobile-input"
                type="tel"
                value={mobile}
                onChange={e => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-navy-400 text-sm focus:outline-none focus:border-saffron-400 transition-colors"
                placeholder="9876543210"
                maxLength={10}
              />
            </div>
          </div>

          {step === 'mobile' ? (
            <button
              id="send-otp-btn"
              onClick={handleSendOtp}
              disabled={mobile.length < 10 || loading}
              className="w-full h-12 rounded-xl bg-saffron-500 hover:bg-saffron-600 text-white font-bold text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
              ) : null}
              {lang === 'en' ? 'Send OTP' : 'OTP पाठवा'}
            </button>
          ) : (
            <>
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-navy-200 text-xs font-semibold uppercase tracking-wide">
                    {lang === 'en' ? 'Enter OTP' : 'OTP प्रविष्ट करा'}
                  </label>
                  <span className="text-verified-400 text-xs">Sent to +91 {mobile}</span>
                </div>
                <div className="flex gap-2">
                  {otp.map((d, i) => (
                    <input
                      key={i}
                      id={`otp-${i}`}
                      type="text"
                      inputMode="numeric"
                      value={d}
                      onChange={e => handleOtpChange(i, e.target.value)}
                      className="w-full aspect-square text-center bg-white/10 border border-white/20 rounded-xl text-white text-xl font-bold focus:outline-none focus:border-saffron-400 transition-colors"
                      maxLength={1}
                      onKeyDown={e => {
                        if (e.key === 'Backspace' && !d && i > 0) {
                          document.getElementById(`otp-${i - 1}`)?.focus();
                        }
                      }}
                    />
                  ))}
                </div>
                <p className="text-navy-400 text-xs mt-2">
                  {lang === 'en' ? 'Demo: Enter any 6 digits' : 'डेमो: कोणतेही 6 अंक प्रविष्ट करा'}
                </p>
              </div>
              <button
                id="login-btn"
                onClick={handleLogin}
                disabled={!otpFilled || loading}
                className="w-full h-12 rounded-xl bg-saffron-500 hover:bg-saffron-600 text-white font-bold text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-98"
              >
                {loading ? <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg> : null}
                {lang === 'en' ? 'Verify & Sign In' : 'सत्यापित करा व साइन इन'}
              </button>
              <button onClick={() => { setStep('mobile'); setOtp(['','','','','','']); }} className="w-full mt-2 text-navy-300 text-xs hover:text-white transition-colors">
                ← {lang === 'en' ? 'Change mobile number' : 'मोबाइल बदला'}
              </button>
            </>
          )}

          {/* Demo hint */}
          <div className="mt-6 bg-saffron-500/10 border border-saffron-500/20 rounded-xl p-3 flex gap-2">
            <span className="text-saffron-400 text-sm shrink-0">💡</span>
            <p className="text-navy-300 text-xs leading-relaxed">
              {lang === 'en'
                ? 'Demo: Select a role, enter any mobile, tap Send OTP, then enter any 6 digits.'
                : 'डेमो: भूमिका निवडा, कोणताही मोबाइल प्रविष्ट करा, OTP पाठवा दाबा.'}
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
