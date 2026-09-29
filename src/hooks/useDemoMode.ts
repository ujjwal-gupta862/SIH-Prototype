import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { DEMO_STEPS } from '../data/mockData';

export function useDemoMode() {
  const { state, dispatch, nextDemoStep } = useApp();
  const navigate = useNavigate();

  const goNext = useCallback(() => {
    nextDemoStep(navigate);
  }, [nextDemoStep, navigate]);

  const reset = useCallback(() => {
    dispatch({ type: 'RESET' });
    navigate('/');
  }, [dispatch, navigate]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Ignore when typing in inputs
      const tag = (e.target as HTMLElement).tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;

      if (e.key === 'd' || e.key === 'D') {
        dispatch({ type: 'TOGGLE_DEMO' });
      } else if (e.key === 'h' || e.key === 'H') {
        dispatch({ type: 'TOGGLE_CONTROLS_HIDDEN' });
      } else if (e.key === 'r' || e.key === 'R') {
        reset();
      } else if (e.key === 'n' || e.key === 'N') {
        goNext();
      } else if (e.key === 'a' || e.key === 'A') {
        dispatch({ type: 'TOGGLE_AUTO_PLAY' });
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [dispatch, goNext, reset]);

  // Auto-play: advance every 9 seconds
  useEffect(() => {
    if (!state.autoPlay) return;
    const interval = setInterval(() => {
      goNext();
    }, 9000);
    return () => clearInterval(interval);
  }, [state.autoPlay, goNext]);

  return {
    demoStep: state.demoStep,
    demoVisible: state.demoVisible,
    controlsHidden: state.controlsHidden,
    autoPlay: state.autoPlay,
    currentStep: DEMO_STEPS[state.demoStep],
    totalSteps: DEMO_STEPS.length,
    goNext,
    reset,
    goTo: (step: number) => {
      dispatch({ type: 'SET_DEMO_STEP', step });
      navigate(DEMO_STEPS[step].route);
    },
  };
}
