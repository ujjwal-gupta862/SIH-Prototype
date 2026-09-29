import React, { createContext, useContext, useReducer, useCallback, ReactNode } from 'react';
import type { Role, Language, ToastMsg } from '../types';
import { DEMO_STEPS } from '../data/mockData';

// ─── State ──────────────────────────────────────────────────────────────────
interface AppState {
  role: Role;
  language: Language;
  isLoggedIn: boolean;
  // Demo
  demoVisible: boolean;
  demoStep: number;
  autoPlay: boolean;
  controlsHidden: boolean;
  // Case flow
  applyStep: number;          // 0-3 wizard steps, 4 = success
  caseTrackStage: number;     // which stage is animating
  retryPhase: 'idle' | 'timeout' | 'retrying' | 'recovered';
  officerApprovedRevenue: boolean;
  officerApprovedHigherEd: boolean;
  referralAnimating: boolean;
  // Toasts
  toasts: ToastMsg[];
  // Consent
  consentEnabled: Record<string, boolean>;
  // Audit live
  auditLiveCount: number;
}

const INITIAL_STATE: AppState = {
  role: 'citizen',
  language: 'en',
  isLoggedIn: false,
  demoVisible: false,
  demoStep: 0,
  autoPlay: false,
  controlsHidden: false,
  applyStep: 0,
  caseTrackStage: 4,
  retryPhase: 'idle',
  officerApprovedRevenue: false,
  officerApprovedHigherEd: false,
  referralAnimating: false,
  toasts: [],
  consentEnabled: { 'VF-001': true, 'VF-002': true, 'VF-003': true, 'VF-004': true },
  auditLiveCount: 0,
};

// ─── Actions ─────────────────────────────────────────────────────────────────
type Action =
  | { type: 'SET_ROLE'; role: Role }
  | { type: 'SET_LANGUAGE'; language: Language }
  | { type: 'LOGIN' }
  | { type: 'LOGOUT' }
  | { type: 'TOGGLE_DEMO' }
  | { type: 'SET_DEMO_STEP'; step: number }
  | { type: 'TOGGLE_AUTO_PLAY' }
  | { type: 'TOGGLE_CONTROLS_HIDDEN' }
  | { type: 'SET_APPLY_STEP'; step: number }
  | { type: 'SET_RETRY_PHASE'; phase: AppState['retryPhase'] }
  | { type: 'APPROVE_REVENUE' }
  | { type: 'APPROVE_HIGHER_ED' }
  | { type: 'SET_REFERRAL_ANIMATING'; value: boolean }
  | { type: 'ADD_TOAST'; toast: ToastMsg }
  | { type: 'REMOVE_TOAST'; id: string }
  | { type: 'TOGGLE_CONSENT'; factId: string }
  | { type: 'INC_AUDIT_COUNT' }
  | { type: 'RESET' };

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_ROLE': return { ...state, role: action.role };
    case 'SET_LANGUAGE': return { ...state, language: action.language };
    case 'LOGIN': return { ...state, isLoggedIn: true };
    case 'LOGOUT': return { ...INITIAL_STATE };
    case 'TOGGLE_DEMO': return { ...state, demoVisible: !state.demoVisible };
    case 'SET_DEMO_STEP': return { ...state, demoStep: action.step };
    case 'TOGGLE_AUTO_PLAY': return { ...state, autoPlay: !state.autoPlay };
    case 'TOGGLE_CONTROLS_HIDDEN': return { ...state, controlsHidden: !state.controlsHidden };
    case 'SET_APPLY_STEP': return { ...state, applyStep: action.step };
    case 'SET_RETRY_PHASE': return { ...state, retryPhase: action.phase };
    case 'APPROVE_REVENUE': return { ...state, officerApprovedRevenue: true };
    case 'APPROVE_HIGHER_ED': return { ...state, officerApprovedHigherEd: true };
    case 'SET_REFERRAL_ANIMATING': return { ...state, referralAnimating: action.value };
    case 'ADD_TOAST': return { ...state, toasts: [...state.toasts, action.toast] };
    case 'REMOVE_TOAST': return { ...state, toasts: state.toasts.filter(t => t.id !== action.id) };
    case 'TOGGLE_CONSENT': return {
      ...state,
      consentEnabled: { ...state.consentEnabled, [action.factId]: !state.consentEnabled[action.factId] },
    };
    case 'INC_AUDIT_COUNT': return { ...state, auditLiveCount: state.auditLiveCount + 1 };
    case 'RESET': return { ...INITIAL_STATE };
    default: return state;
  }
}

// ─── Context ────────────────────────────────────────────────────────────────
interface AppContextValue {
  state: AppState;
  dispatch: React.Dispatch<Action>;
  addToast: (toast: Omit<ToastMsg, 'id'>) => void;
  nextDemoStep: (navigate: (path: string) => void) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

let toastCounter = 0;

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  const addToast = useCallback((toast: Omit<ToastMsg, 'id'>) => {
    const id = `toast-${++toastCounter}`;
    dispatch({ type: 'ADD_TOAST', toast: { ...toast, id } });
    setTimeout(() => dispatch({ type: 'REMOVE_TOAST', id }), 5000);
  }, []);

  const nextDemoStep = useCallback((navigate: (path: string) => void) => {
    const next = (state.demoStep + 1) % DEMO_STEPS.length;
    dispatch({ type: 'SET_DEMO_STEP', step: next });
    navigate(DEMO_STEPS[next].route);
  }, [state.demoStep]);

  return (
    <AppContext.Provider value={{ state, dispatch, addToast, nextDemoStep }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
