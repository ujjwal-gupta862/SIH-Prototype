import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { SimEngine } from './engine';
import { createSeedState } from './seed';
import type { SimState, EngineAction } from './types';

interface SimContextType {
  state: SimState;
  dispatch: (action: EngineAction, payload?: Record<string, unknown>) => void;
  engine: SimEngine;
  resetDemo: () => void;
}

const SimContext = createContext<SimContextType | null>(null);

export function SimProvider({ children }: { children: React.ReactNode }) {
  const [engine] = useState(() => {
    const saved = localStorage.getItem('sutradhar-sim');
    const initialState = saved ? JSON.parse(saved) : createSeedState();
    return new SimEngine(initialState);
  });

  const [state, setState] = useState<SimState>(engine.getState());

  useEffect(() => {
    const handleStateChange = () => {
      const newState = { ...engine.getState() };
      setState(newState);
      localStorage.setItem('sutradhar-sim', JSON.stringify(newState));
    };

    engine.addEventListener('change', handleStateChange);
    return () => {
      engine.removeEventListener('change', handleStateChange);
    };
  }, [engine]);

  const value = useMemo(() => ({
    state,
    engine,
    dispatch: (action: EngineAction, payload?: Record<string, unknown>) => engine.dispatch(action, payload),
    resetDemo: () => engine.reset(createSeedState())
  }), [state, engine]);

  return <SimContext.Provider value={value}>{children}</SimContext.Provider>;
}

export function useSim() {
  const ctx = useContext(SimContext);
  if (!ctx) throw new Error('useSim must be used within SimProvider');
  return ctx;
}
