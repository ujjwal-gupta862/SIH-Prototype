import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSim } from '../sim/store';
import { scholarshipHappyPath, revenueOutage } from '../sim/scenarios';

import type { EngineAction } from '../sim/types';

const TIMELINE = [
  { time: 0, route: '/impact', role: 'admin', caption: 'The Problem: Siloed departments force citizens to re-upload documents and visit multiple portals.' },
  { time: 20, route: '/login', role: 'citizen', caption: 'With SUTRADHAR: Single Sign-On. One Case Passport.' },
  { time: 25, route: '/citizen/apply/SUT-SRV-001', role: 'citizen', caption: '0 Documents Required. Facts are fetched directly from source departments via APIs.' },
  { time: 40, action: 'startJourney' },
  { time: 45, route: '/citizen/consent', role: 'citizen', caption: 'Data is protected by the Consent Manager. The citizen retains full control.' },
  { time: 60, action: 'approveConsent' },
  { time: 70, route: '/workflow', role: 'admin', caption: 'The Workflow Engine orchestrates API calls across Revenue, Social Justice, and Higher Ed in parallel.' },
  { time: 105, route: '/officer', role: 'officer', caption: 'Officers see a unified, pre-verified dossier. No more manual document checking.' },
  { time: 115, action: 'officerApprove' },
  { time: 125, route: '/admin/adapters', role: 'admin', caption: 'What if a department goes down? Simulating a Revenue Department API outage...' },
  { time: 130, action: 'triggerOutage', caption: 'SUTRADHAR Circuit Breaker opens. Retries are queued. The system doesn\\'t crash.' },
  { time: 150, action: 'recoverOutage', caption: 'API recovered. Queued requests automatically process. No data loss.' },
  { time: 170, route: '/impact', role: 'admin', caption: 'SUTRADHAR: One case. One journey. Every department.' },
];

const TOTAL_DURATION = 180; // 3 minutes

export function useDemoMode() {
  const [demoVisible, setDemoVisible] = useState(false);
  const [controlsHidden, setControlsHidden] = useState(false);
  const [autoPlay, setAutoPlay] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [caption, setCaption] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { state, dispatch, resetDemo, engine } = useSim();
  
  const timerRef = useRef<number | null>(null);

  const toggleDemo = () => setDemoVisible(v => !v);
  const toggleAutoPlay = () => setAutoPlay(v => !v);
  
  const reset = useCallback(() => {
    resetDemo();
    setCurrentTime(0);
    setAutoPlay(false);
    setCaption(null);
    navigate('/');
  }, [resetDemo, navigate]);

  const executeScenario = useCallback((steps: {delayMs: number, action: EngineAction, payload?: Record<string, unknown>}[]) => {
    let totalDelay = 0;
    steps.forEach(step => {
      totalDelay += step.delayMs;
      setTimeout(() => {
        dispatch(step.action, step.payload);
      }, totalDelay);
    });
  }, [dispatch]);

  const triggerJourney = useCallback(() => {
    executeScenario(scholarshipHappyPath);
  }, [executeScenario]);

  const triggerOutage = useCallback(() => {
    executeScenario(revenueOutage);
  }, [executeScenario]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;

      if (e.key === 'd' || e.key === 'D') {
        toggleDemo();
      } else if (e.key === ' ') {
        e.preventDefault();
        toggleAutoPlay();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // Auto-play loop
  useEffect(() => {
    if (!autoPlay) return;

    timerRef.current = window.setInterval(() => {
      setCurrentTime(t => {
        if (t >= TOTAL_DURATION) {
          setAutoPlay(false);
          return t;
        }
        return t + 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [autoPlay]);

  // Handle timeline events
  useEffect(() => {
    if (!autoPlay) return;

    const event = TIMELINE.find(t => t.time === currentTime);
    if (!event) return;

    if (event.caption) {
      setCaption(event.caption);
    }

    if (event.route && location.pathname !== event.route) {
      navigate(event.route);
    }
    
    // We don't have dispatch for 'SET_ROLE', wait, type engine action?
    // The role is in sim state but maybe we just navigate. 

    if (event.action === 'startJourney') {
      triggerJourney();
    } else if (event.action === 'approveConsent') {
      // Find pending consent
      const pending = state.consents.find(c => c.status === 'pending');
      if (pending) {
        dispatch('grantConsent', { consentId: pending.id });
      }
    } else if (event.action === 'officerApprove') {
      const pendingCase = state.cases.find(c => c.status === 'processing' || c.status === 'submitted' || c.status === 'routing');
      if (pendingCase) {
        dispatch('approve', { caseId: pendingCase.id });
      }
    } else if (event.action === 'triggerOutage') {
      triggerOutage();
    } else if (event.action === 'recoverOutage') {
      dispatch('recover', { adapterId: 'adpt-rev' });
    }

  }, [currentTime, autoPlay, navigate, location.pathname, state.consents, state.cases, dispatch, triggerJourney, triggerOutage]);

  return {
    demoVisible,
    controlsHidden,
    autoPlay,
    toggleAutoPlay,
    toggleDemo,
    reset,
    triggerOutage,
    triggerJourney,
    caption,
    progress: currentTime / TOTAL_DURATION,
  };
}
