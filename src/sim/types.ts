export type Role = 'citizen' | 'officer' | 'admin';
export type CaseStatus = 'submitted' | 'routing' | 'awaiting-consent' | 'processing'
  | 'referred' | 'needs-info' | 'approved' | 'rejected' | 'paid' | 'closed' | 'blocked';

export interface Department {
  id: string;
  name: string;
  nameHi: string;
  nameMr: string;
  protocol: 'REST/JSON' | 'SOAP/XML';
  nodalOfficer: string;
}

export interface Adapter {
  id: string;
  deptId: string;
  status: 'healthy' | 'degraded' | 'down';
  latencyMs: number[];
  successRate: number;
  lastSync: string;
  version: string;
  circuit: 'closed' | 'open' | 'half-open';
}

export interface VerifiedFact {
  id: string;
  key: string;
  label: string;
  value: string;
  sourceDeptId: string;
  verifiedAt: string;
  consentId: string;
  status: 'valid' | 'withdrawn' | 'expired';
}

export interface Consent {
  id: string;
  caseId: string;
  requesterDeptId: string;
  fields: string[];
  purpose: string;
  duration: string;
  grantedAt?: string;
  deniedAt?: string;
  revokedAt?: string;
  expiresAt: string;
  status: 'pending' | 'granted' | 'denied' | 'revoked';
}

export interface WorkflowStep {
  id: string;
  deptId: string;
  label: string;
  state: 'idle' | 'processing' | 'done' | 'failed' | 'waiting';
  startedAt?: string;
  completedAt?: string;
  slaHours: number;
}

export interface ServiceCase {
  id: string;
  service: string;
  citizenId: string;
  citizenName: string;
  status: CaseStatus;
  steps: WorkflowStep[];
  facts: VerifiedFact[];
  consents: Consent[];
  createdAt: string;
  slaDueAt: string;
  amount?: string;
  referenceNumber?: string;
}

export interface AuditEvent {
  id: string;
  caseId?: string;
  actor: string;
  actorRole: string;
  deptId?: string;
  action: string;
  detail: string;
  payload: Record<string, unknown>;
  at: string;
  prevHash: string;
  hash: string;
}

export interface ExceptionItem {
  id: string;
  adapterId: string;
  caseId: string;
  attempts: number;
  maxAttempts: number;
  lastError: string;
  state: 'retrying' | 'escalated' | 'resolved';
  createdAt: string;
  resolvedAt?: string;
}

export interface IdentityMap {
  sutradharId: string;
  citizenName: string;
  identifiers: { deptId: string; idLabel: string; maskedValue: string }[];
  confidence: number;
  conflicts: string[];
}

export interface Notification {
  id: string;
  caseId?: string;
  type: 'sms' | 'portal' | 'whatsapp';
  title: string;
  message: string;
  at: string;
  read: boolean;
}

export type EngineAction =
  | 'submitApplication'
  | 'runEligibility'
  | 'routeCase'
  | 'requestConsent'
  | 'grantConsent'
  | 'denyConsent'
  | 'revokeConsent'
  | 'fetchVerifiedFact'
  | 'departmentProcess'
  | 'smartReferral'
  | 'raiseException'
  | 'retryWithBackoff'
  | 'openCircuitBreaker'
  | 'escalate'
  | 'recover'
  | 'approve'
  | 'reject'
  | 'requestMoreInfo'
  | 'dispatchPayment'
  | 'closeCase';

export type SimSpeed = 0.5 | 1 | 2 | 4;

export interface SimState {
  // Core entities
  departments: Department[];
  adapters: Adapter[];
  cases: ServiceCase[];
  auditLog: AuditEvent[];
  exceptions: ExceptionItem[];
  identityMaps: IdentityMap[];
  notifications: Notification[];

  // Engine state
  speed: SimSpeed;
  paused: boolean;
  simTime: string; // ISO timestamp in simulated time
  startedAt: string;

  // UI state
  currentRole: Role;
  isLoggedIn: boolean;
  language: 'en' | 'hi' | 'mr';
}
