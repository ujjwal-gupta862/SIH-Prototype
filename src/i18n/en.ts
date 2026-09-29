const en = {
  // Navigation
  nav: {
    home: 'Home',
    apply: 'Apply',
    tracker: 'Track Case',
    facts: 'Verified Facts',
    consent: 'Consent',
    inbox: 'Inbox',
    review: 'Case Review',
    workflow: 'Workflow Map',
    dashboard: 'Dashboard',
    audit: 'Audit Trail',
    adapters: 'Adapters',
    identity: 'Identity',
    impact: 'Before / After',
    logout: 'Logout',
  },
  // Login
  login: {
    title: 'SUTRADHAR',
    subtitle: 'Government Services Interoperability Layer',
    ssoButton: 'Sign in with SUTRADHAR SSO',
    ssoSimulated: 'Federated identity is simulated',
    citizen: 'Citizen',
    citizenDesc: 'Track your applications, verified documents and consents.',
    officer: 'Department Officer',
    officerDesc: 'Review, verify and process inter-department cases.',
    admin: 'Administrator',
    adminDesc: 'System-wide monitoring, adapter health, audit trails.',
    handshake: 'Establishing secure SSO handshake…',
    verifying: 'Verifying identity',
  },
  // Citizen
  citizen: {
    welcome: 'Welcome',
    activeCases: 'Active Cases',
    quickServices: 'Quick Services',
    applyForService: 'Apply for Service',
    verifiedFacts: 'Verified Facts',
    notifications: 'Notifications',
    trackCase: 'Track Case',
    casePassport: 'Case Passport',
  },
  // Apply Wizard
  wizard: {
    chooseService: 'Choose Service',
    yourDetails: 'Your Details',
    reviewConsent: 'Review & Consent',
    reviewSubmit: 'Review & Submit',
    next: 'Next',
    back: 'Back',
    submit: 'Submit Application',
    docsToUpload: 'documents to upload',
    verifiedFactsFetched: 'verified facts fetched',
    applicationSubmitted: 'Application Submitted!',
    prefilled: 'Pre-filled',
  },
  // Consent
  consent: {
    title: 'Consent Manager',
    approve: 'Approve',
    deny: 'Deny',
    revoke: 'Revoke',
    granted: 'Granted',
    denied: 'Denied',
    revoked: 'Revoked',
    pending: 'Pending',
    purpose: 'Purpose',
    duration: 'Duration',
    expiresAt: 'Expires',
    requestedBy: 'Requested by',
    fields: 'Fields',
    ledger: 'Consent Ledger',
    consentWithdrawn: 'Consent Withdrawn',
  },
  // Case
  case: {
    caseId: 'Case ID',
    status: 'Status',
    sla: 'SLA',
    timeline: 'Timeline',
    documents: 'Documents',
    consents: 'Consents',
    audit: 'Audit',
    verifiedFacts: 'Verified Facts',
    slaRemaining: 'remaining',
    slaBreached: 'SLA Breached',
  },
  // Officer
  officer: {
    inbox: 'Officer Inbox',
    caseReview: 'Case Review',
    approve: 'Approve',
    reject: 'Reject',
    askForInfo: 'Ask for Info',
    referToDept: 'Refer to Department',
    reasonRequired: 'Reason required',
    eligibilityChecklist: 'Eligibility Checklist',
  },
  // Admin
  admin: {
    commandCenter: 'Admin Command Center',
    casesInFlight: 'Cases in Flight',
    avgTurnaround: 'Avg Turnaround',
    slaCompliance: 'SLA Compliance',
    duplicatesPrevented: 'Duplicates Prevented',
    docsReuploadsPrevented: 'Re-uploads Prevented',
    adapterHealth: 'Adapter Health',
    liveActivityFeed: 'Live Activity Feed',
  },
  // Workflow
  workflow: {
    title: 'Workflow Orchestration Map',
    live: 'Live',
    processing: 'Processing',
    done: 'Done',
    failed: 'Failed',
    waiting: 'Waiting',
    idle: 'Idle',
    smartReferral: 'Smart Referral',
    autoReferralCreated: 'Auto-referral created',
  },
  // Adapter
  adapter: {
    healthy: 'Healthy',
    degraded: 'Degraded',
    down: 'Down',
    testConnection: 'Test Connection',
    circuitOpen: 'Circuit Open',
    circuitClosed: 'Circuit Closed',
    circuitHalfOpen: 'Half-Open',
    retrying: 'Retrying…',
  },
  // Impact
  impact: {
    title: 'Before vs After',
    today: 'Today (Without SUTRADHAR)',
    withSutradhar: 'With SUTRADHAR',
    portals: 'Portals visited',
    forms: 'Forms filled',
    uploads: 'Documents uploaded',
    days: 'Estimated days',
    visits: 'Office visits',
    illustrative: 'Numbers are illustrative, simulated',
    tagline: 'One case. One journey. Every department.',
  },
  // Audit
  audit: {
    title: 'Tamper-Evident Audit Log',
    exportCsv: 'Export CSV',
    hashChain: 'Hash-chained audit entries · tamper-evident (simulated)',
    filter: 'Filter',
  },
  // Common
  common: {
    prototype: 'Prototype',
    syntheticData: 'Synthetic Data',
    simulated: 'Simulated',
    loading: 'Loading…',
    error: 'Something went wrong',
    empty: 'No data available',
    resetDemo: 'Reset Demo',
    search: 'Search',
  },
} as const;

type DeepRecord<T> = {
  readonly [K in keyof T]: {
    readonly [P in keyof T[K]]: string;
  };
};

export type TranslationKeys = DeepRecord<typeof en>;
export default en;
