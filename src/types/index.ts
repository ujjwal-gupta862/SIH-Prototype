export type Role = 'citizen' | 'officer-revenue' | 'officer-education' | 'admin';
export type Language = 'en' | 'hi' | 'mr';
export type AdapterType = 'REST' | 'SOAP';
export type NodeHealth = 'healthy' | 'warning' | 'critical';
export type StageStatus = 'completed' | 'active' | 'pending' | 'exception';

export interface CitizenProfile {
  id: string;
  name: string;
  nameMarathi: string;
  dob: string;
  mobile: string;
  aadhaarLast4: string;
  district: string;
  districtMarathi: string;
  revenueId: string;
  educationId: string;
  socialJusticeId: string;
  caseId: string;
}

export interface VerifiedFact {
  id: string;
  label: string;
  labelMarathi: string;
  value: string;
  valueMarathi: string;
  sourceDept: string;
  sourceDeptMarathi: string;
  sourceSystem: string;
  protocol: AdapterType;
  timestamp: string;
  schemaValid: boolean;
  consentGiven: boolean;
  identityMapping: Array<{ system: string; id: string }>;
}

export interface CaseStage {
  id: number;
  label: string;
  labelMarathi: string;
  status: StageStatus;
  timestamp?: string;
  details: string;
  detailsMarathi: string;
  dept: string;
}

export interface AuditEntry {
  id: string;
  timestamp: string;
  actor: string;
  role: string;
  action: string;
  source: string;
  destination: string;
  purpose: string;
  consentId: string;
  status: 'success' | 'exception' | 'retry';
  hash: string;
}

export interface DeptNode {
  id: string;
  label: string;
  labelMarathi: string;
  adapter: AdapterType;
  health: NodeHealth;
  uptime: string;
  latency: string;
  lastSync: string;
  adapterVersion: string;
  onboarded: boolean;
}

export interface OfficerCase {
  id: string;
  citizen: string;
  scheme: string;
  submitted: string;
  slaDeadline: string;
  slaHoursLeft: number;
  priority: 'high' | 'critical' | 'normal';
  status: 'pending' | 'sla-breach' | 'approved';
  verificationComplete: boolean;
}

export interface ToastMsg {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
}

export interface ConsentItem {
  factId: string;
  label: string;
  dept: string;
  purpose: string;
  duration: string;
  enabled: boolean;
}
