import type { EngineAction } from './types';

export interface ScenarioStep {
  delayMs: number;
  action: EngineAction;
  payload?: Record<string, unknown>;
}

export const scholarshipHappyPath: ScenarioStep[] = [
  { delayMs: 1000, action: 'submitApplication', payload: { caseId: 'SUT-MH-2026-000481' } },
  { delayMs: 2000, action: 'routeCase', payload: { caseId: 'SUT-MH-2026-000481', stepId: 'step-1' } },
  { delayMs: 3000, action: 'requestConsent', payload: { caseId: 'SUT-MH-2026-000481' } },
  { delayMs: 4000, action: 'routeCase', payload: { caseId: 'SUT-MH-2026-000481', stepId: 'step-2' } },
  { delayMs: 2000, action: 'departmentProcess', payload: { caseId: 'SUT-MH-2026-000481', stepId: 'step-3' } },
  { delayMs: 2000, action: 'departmentProcess', payload: { caseId: 'SUT-MH-2026-000481', stepId: 'step-4' } },
  { delayMs: 2000, action: 'departmentProcess', payload: { caseId: 'SUT-MH-2026-000481', stepId: 'step-5' } },
  { delayMs: 2000, action: 'dispatchPayment', payload: { caseId: 'SUT-MH-2026-000481' } }
];

export const revenueOutage: ScenarioStep[] = [
  { delayMs: 1000, action: 'routeCase', payload: { caseId: 'SUT-MH-2026-000481', stepId: 'step-2' } },
  { delayMs: 2000, action: 'raiseException', payload: { caseId: 'SUT-MH-2026-000481', adapterId: 'adpt-rev', error: 'SOAP Fault: 504 Gateway Timeout' } }
];
