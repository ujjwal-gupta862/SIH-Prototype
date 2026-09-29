import type {
  CitizenProfile, VerifiedFact, CaseStage, AuditEntry, DeptNode, OfficerCase, ConsentItem,
} from '../types';

// ─── Core Identifiers ──────────────────────────────────────────────────────
export const CASE_ID = 'SUT-2026-004821';

export const CITIZEN: CitizenProfile = {
  id: 'CIT-MH-20031289',
  name: 'Rohan Patil',
  nameMarathi: 'रोहन पाटील',
  dob: '15 Aug 2003',
  mobile: '9876543210',
  aadhaarLast4: '4821',
  district: 'Nashik',
  districtMarathi: 'नाशिक',
  revenueId: 'R-7781',
  educationId: 'E-44210',
  socialJusticeId: 'SJ-2281',
  caseId: CASE_ID,
};

// ─── Verified Facts ─────────────────────────────────────────────────────────
export const VERIFIED_FACTS: VerifiedFact[] = [
  {
    id: 'VF-001',
    label: 'Annual Family Income',
    labelMarathi: 'वार्षिक कौटुंबिक उत्पन्न',
    value: '₹1,12,000 per annum',
    valueMarathi: '₹1,12,000 प्रतिवर्ष',
    sourceDept: 'Revenue Department',
    sourceDeptMarathi: 'महसूल विभाग',
    sourceSystem: 'MahaRevenue eSetu (SOAP)',
    protocol: 'SOAP',
    timestamp: '2026-09-27 09:14:22',
    schemaValid: true,
    consentGiven: true,
    identityMapping: [
      { system: 'Revenue', id: 'R-7781' },
      { system: 'Education', id: 'E-44210' },
      { system: 'Case', id: 'SUT-2026-004821' },
    ],
  },
  {
    id: 'VF-002',
    label: 'Land Holding',
    labelMarathi: 'जमीन धारणा',
    value: '2.5 acres · Survey No. 142/B, Nashik',
    valueMarathi: '2.5 एकर · सर्वे नं. 142/B, नाशिक',
    sourceDept: 'Revenue Department',
    sourceDeptMarathi: 'महसूल विभाग',
    sourceSystem: 'MahaRevenue REST API v3',
    protocol: 'REST',
    timestamp: '2026-09-27 09:15:08',
    schemaValid: true,
    consentGiven: true,
    identityMapping: [
      { system: 'Revenue', id: 'R-7781' },
      { system: 'Case', id: 'SUT-2026-004821' },
    ],
  },
  {
    id: 'VF-003',
    label: 'Caste Category',
    labelMarathi: 'जातीवर्ग',
    value: 'OBC – Non-Creamy Layer (Validity: 31-Mar-2027)',
    valueMarathi: 'ओबीसी – नॉन-क्रिमी लेयर (वैधता: 31-Mar-2027)',
    sourceDept: 'Social Justice Department',
    sourceDeptMarathi: 'सामाजिक न्याय विभाग',
    sourceSystem: 'SJD Caste Validity Portal REST API',
    protocol: 'REST',
    timestamp: '2026-09-27 11:02:45',
    schemaValid: true,
    consentGiven: true,
    identityMapping: [
      { system: 'Social Justice', id: 'SJ-2281' },
      { system: 'Revenue', id: 'R-7781' },
      { system: 'Case', id: 'SUT-2026-004821' },
    ],
  },
  {
    id: 'VF-004',
    label: 'Enrollment Status',
    labelMarathi: 'नावनोंदणी स्थिती',
    value: 'Enrolled · Govt Polytechnic Nashik · 2024-25 · 1st Year',
    valueMarathi: 'नावनोंदणी · शासकीय पॉलिटेक्निक नाशिक · 2024-25 · प्रथम वर्ष',
    sourceDept: 'Higher Education Department',
    sourceDeptMarathi: 'उच्च शिक्षण विभाग',
    sourceSystem: 'MahaEdu ERP REST API v2',
    protocol: 'REST',
    timestamp: '2026-09-27 11:45:30',
    schemaValid: true,
    consentGiven: true,
    identityMapping: [
      { system: 'Education', id: 'E-44210' },
      { system: 'Case', id: 'SUT-2026-004821' },
    ],
  },
];

// ─── Case Timeline (7 Stages) ────────────────────────────────────────────────
export const CASE_STAGES: CaseStage[] = [
  {
    id: 0,
    label: 'Citizen Request',
    labelMarathi: 'नागरिक अर्ज',
    status: 'completed',
    timestamp: '2026-09-27 · 08:50:11',
    details: 'Application submitted. Case ID SUT-2026-004821 generated. Scheme: Post-Matric OBC Scholarship.',
    detailsMarathi: 'अर्ज सादर केला. केस ID SUT-2026-004821 तयार केला.',
    dept: 'Citizen Portal',
  },
  {
    id: 1,
    label: 'Intelligent Routing',
    labelMarathi: 'बुद्धिमान मार्गनिर्देशन',
    status: 'completed',
    timestamp: '2026-09-27 · 08:51:00 – 09:16:04',
    details: 'Eligibility verified. Income, land record (REST), caste category & enrollment fetched. ⚠ Revenue SOAP timed out – retry 2/3 succeeded at 08:52:28.',
    detailsMarathi: 'पात्रता तपासली. उत्पन्न, जमीन, जात, नावनोंदणी माहिती मिळवली.',
    dept: 'SUTRADHAR Engine',
  },
  {
    id: 2,
    label: 'Department Processing',
    labelMarathi: 'विभाग प्रक्रिया',
    status: 'completed',
    timestamp: '2026-09-27 · 10:30:00',
    details: 'Revenue Dept approved income & land records. Social Justice validated caste certificate. Pre-verified facts forwarded automatically.',
    detailsMarathi: 'महसूल विभागाने उत्पन्न व जमीन मंजूर केली. जात प्रमाणपत्र मान्य.',
    dept: 'Revenue + Social Justice',
  },
  {
    id: 3,
    label: 'Inter-Dept Coordination',
    labelMarathi: 'आंतर-विभाग समन्वय',
    status: 'completed',
    timestamp: '2026-09-27 · 14:00:00',
    details: 'Smart Referral triggered. Higher Education Dept auto-notified with pre-verified facts. Zero re-submission by citizen.',
    detailsMarathi: 'स्मार्ट रेफरल: उच्च शिक्षण विभागास माहिती स्वयंचलित पाठवली.',
    dept: 'Higher Education Dept',
  },
  {
    id: 4,
    label: 'Track & Notify',
    labelMarathi: 'ट्रॅक आणि सूचना',
    status: 'active',
    timestamp: '2026-09-28 · 09:00:00',
    details: 'SLA: 2 days remaining (deadline 2026-09-30). Citizen notified via SMS + portal. Officer review in progress.',
    detailsMarathi: 'SLA: 2 दिवस शिल्लक. SMS व पोर्टलद्वारे नागरिकाला सूचित केले.',
    dept: 'SUTRADHAR',
  },
  {
    id: 5,
    label: 'Service Delivery',
    labelMarathi: 'सेवा वितरण',
    status: 'pending',
    details: 'Awaiting DBT transfer. Amount: ₹25,000. Bank: Canara Bank · IFSC: CNRB0001234.',
    detailsMarathi: 'DBT हस्तांतरणाची प्रतीक्षा. रक्कम: ₹25,000.',
    dept: 'DBT / Treasury',
  },
  {
    id: 6,
    label: 'Secure Records & Audit',
    labelMarathi: 'सुरक्षित नोंदी व लेखापरीक्षण',
    status: 'pending',
    details: 'Blockchain-anchored audit trail will be sealed post-disbursal. Tamper-evident hash logged.',
    detailsMarathi: 'वितरणानंतर ऑडिट ट्रेल सील होईल.',
    dept: 'Audit System',
  },
];

// ─── Audit Trail ─────────────────────────────────────────────────────────────
export const AUDIT_ENTRIES: AuditEntry[] = [
  {
    id: 'AUD-001', timestamp: '2026-09-27 08:50:11',
    actor: 'Rohan Patil', role: 'Citizen',
    action: 'Application Submitted',
    source: 'Citizen Portal', destination: 'SUTRADHAR Engine',
    purpose: 'Post-Matric OBC Scholarship', consentId: 'CST-2026-88210',
    status: 'success', hash: '4a7f2e9c1b3d8f6a',
  },
  {
    id: 'AUD-002', timestamp: '2026-09-27 08:50:15',
    actor: 'SUTRADHAR Engine', role: 'System',
    action: 'Case ID Generated · SUT-2026-004821',
    source: 'SUTRADHAR Engine', destination: 'Case Registry',
    purpose: 'Unique case tracking', consentId: 'CST-2026-88210',
    status: 'success', hash: 'b91e4f7c2a5d0e8b',
  },
  {
    id: 'AUD-003', timestamp: '2026-09-27 08:51:22',
    actor: 'SUTRADHAR Adapter', role: 'System',
    action: 'SOAP Fetch Initiated – Income Certificate',
    source: 'SUTRADHAR Adapter', destination: 'MahaRevenue SOAP API',
    purpose: 'Income Verification', consentId: 'CST-2026-88210',
    status: 'exception', hash: 'c22a9f4e1b6d3f7c',
  },
  {
    id: 'AUD-004', timestamp: '2026-09-27 08:51:55',
    actor: 'SUTRADHAR Adapter', role: 'System',
    action: 'SOAP Retry 1/3 – Timeout (504)',
    source: 'SUTRADHAR Adapter', destination: 'MahaRevenue SOAP API',
    purpose: 'Income Verification – Retry', consentId: 'CST-2026-88210',
    status: 'retry', hash: 'd33b0a5f2c7e4g8d',
  },
  {
    id: 'AUD-005', timestamp: '2026-09-27 08:52:28',
    actor: 'SUTRADHAR Adapter', role: 'System',
    action: 'SOAP Retry 2/3 – Recovered ✓',
    source: 'SUTRADHAR Adapter', destination: 'MahaRevenue SOAP API',
    purpose: 'Income Verification – Success', consentId: 'CST-2026-88210',
    status: 'success', hash: 'e44c1b6g3d8f5h9e',
  },
  {
    id: 'AUD-006', timestamp: '2026-09-27 09:02:11',
    actor: 'SUTRADHAR Engine', role: 'System',
    action: 'Fact Fetched – Caste Category (OBC)',
    source: 'SJD Caste Portal', destination: 'SUTRADHAR Fact Store',
    purpose: 'OBC Category Verification', consentId: 'CST-2026-88210',
    status: 'success', hash: 'f55d2c7h4e9g6i0f',
  },
  {
    id: 'AUD-007', timestamp: '2026-09-27 09:15:44',
    actor: 'SUTRADHAR Engine', role: 'System',
    action: 'Smart Referral – Higher Education Dept',
    source: 'Revenue + Social Justice', destination: 'Higher Education Dept',
    purpose: 'Scholarship Eligibility Forwarding', consentId: 'CST-2026-88210',
    status: 'success', hash: 'g66e3d8i5f0h7j1g',
  },
  {
    id: 'AUD-008', timestamp: '2026-09-27 10:30:00',
    actor: 'Meena Kulkarni', role: 'Revenue Officer',
    action: 'Income & Land Records Approved',
    source: 'Officer Console', destination: 'SUTRADHAR Engine',
    purpose: 'Revenue verification cleared', consentId: 'CST-2026-88210',
    status: 'success', hash: 'h77f4e9j6g1i8k2h',
  },
  {
    id: 'AUD-009', timestamp: '2026-09-27 14:05:00',
    actor: 'Priya Sharma', role: 'Higher Education Officer',
    action: 'Scholarship Eligibility Approved',
    source: 'Officer Console', destination: 'DBT Treasury',
    purpose: 'Scholarship disbursement authorization', consentId: 'CST-2026-88210',
    status: 'success', hash: 'i88g5f0k7h2j9l3i',
  },
  {
    id: 'AUD-010', timestamp: '2026-09-28 09:15:00',
    actor: 'DBT Treasury System', role: 'System',
    action: 'Transfer Initiated – ₹25,000',
    source: 'Treasury Portal', destination: 'Canara Bank CNRB0001234',
    purpose: 'Post-Matric OBC Scholarship Disbursal', consentId: 'CST-2026-88210',
    status: 'success', hash: 'j99h6g1l8i3k0m4j',
  },
];

// ─── Department Nodes (React Flow) ──────────────────────────────────────────
export const DEPT_NODES: DeptNode[] = [
  {
    id: 'revenue', label: 'Revenue Dept', labelMarathi: 'महसूल विभाग',
    adapter: 'SOAP', health: 'warning',
    uptime: '98.2%', latency: '340 ms', lastSync: '2 min ago',
    adapterVersion: 'v2.1.4', onboarded: true,
  },
  {
    id: 'social-justice', label: 'Social Justice', labelMarathi: 'सामाजिक न्याय',
    adapter: 'REST', health: 'healthy',
    uptime: '99.7%', latency: '120 ms', lastSync: 'just now',
    adapterVersion: 'v3.0.1', onboarded: true,
  },
  {
    id: 'higher-ed', label: 'Higher Education', labelMarathi: 'उच्च शिक्षण',
    adapter: 'REST', health: 'healthy',
    uptime: '99.4%', latency: '95 ms', lastSync: '1 min ago',
    adapterVersion: 'v2.8.0', onboarded: true,
  },
  {
    id: 'dbt', label: 'DBT / Treasury', labelMarathi: 'DBT / कोषागार',
    adapter: 'REST', health: 'healthy',
    uptime: '99.9%', latency: '85 ms', lastSync: 'just now',
    adapterVersion: 'v4.1.2', onboarded: true,
  },
  {
    id: 'health', label: 'Health Dept', labelMarathi: 'आरोग्य विभाग',
    adapter: 'REST', health: 'critical',
    uptime: '–', latency: '–', lastSync: 'Not connected',
    adapterVersion: 'v1.0.0-alpha', onboarded: false,
  },
  {
    id: 'agriculture', label: 'Agriculture', labelMarathi: 'कृषी विभाग',
    adapter: 'REST', health: 'critical',
    uptime: '–', latency: '–', lastSync: 'Not connected',
    adapterVersion: 'v1.0.0-alpha', onboarded: false,
  },
  {
    id: 'water', label: 'Water Resources', labelMarathi: 'जलसंपदा',
    adapter: 'SOAP', health: 'critical',
    uptime: '–', latency: '–', lastSync: 'Not connected',
    adapterVersion: 'v1.0.0-alpha', onboarded: false,
  },
  {
    id: 'womenchild', label: 'Women & Child', labelMarathi: 'महिला व बालकल्याण',
    adapter: 'REST', health: 'critical',
    uptime: '–', latency: '–', lastSync: 'Not connected',
    adapterVersion: 'v1.0.0-alpha', onboarded: false,
  },
];

// ─── Officer Queue ────────────────────────────────────────────────────────────
export const OFFICER_QUEUE: OfficerCase[] = [
  {
    id: 'SUT-2026-004821', citizen: 'Rohan Patil',
    scheme: 'Post-Matric OBC Scholarship',
    submitted: '27 Sep 2026', slaDeadline: '30 Sep 2026',
    slaHoursLeft: 6, priority: 'high', status: 'pending',
    verificationComplete: true,
  },
  {
    id: 'SUT-2026-004815', citizen: 'Sunita Kamble',
    scheme: 'SC Merit Scholarship',
    submitted: '25 Sep 2026', slaDeadline: '27 Sep 2026',
    slaHoursLeft: -14, priority: 'critical', status: 'sla-breach',
    verificationComplete: true,
  },
  {
    id: 'SUT-2026-004830', citizen: 'Amit Wadekar',
    scheme: 'Rajarshi Shahu Scholarship',
    submitted: '28 Sep 2026', slaDeadline: '01 Oct 2026',
    slaHoursLeft: 22, priority: 'normal', status: 'pending',
    verificationComplete: false,
  },
];

// ─── Consent Items ─────────────────────────────────────────────────────────
export const CONSENT_ITEMS: ConsentItem[] = [
  {
    factId: 'VF-001', label: 'Annual Family Income',
    dept: 'Revenue Department', purpose: 'Verify income eligibility for OBC scholarship (≤ ₹2.5L)',
    duration: '12 months', enabled: true,
  },
  {
    factId: 'VF-002', label: 'Land Holding Record',
    dept: 'Revenue Department', purpose: 'Confirm small-farmer status for additional tier',
    duration: '12 months', enabled: true,
  },
  {
    factId: 'VF-003', label: 'Caste Category Certificate',
    dept: 'Social Justice Department', purpose: 'Validate OBC non-creamy layer status',
    duration: '12 months', enabled: true,
  },
  {
    factId: 'VF-004', label: 'Enrollment / Bonafide Status',
    dept: 'Higher Education Department', purpose: 'Confirm active enrollment for scholarship disbursement',
    duration: '12 months', enabled: true,
  },
];

// ─── Recharts Data ─────────────────────────────────────────────────────────
export const TURNAROUND_DATA = [
  { dept: 'Revenue', days: 3.2, target: 2 },
  { dept: 'Social Justice', days: 1.8, target: 2 },
  { dept: 'Higher Ed', days: 2.5, target: 3 },
  { dept: 'DBT', days: 1.4, target: 1 },
];

export const STATUS_PIE_DATA = [
  { name: 'Completed', value: 3842, fill: '#16A34A' },
  { name: 'In Progress', value: 1247, fill: '#2563EB' },
  { name: 'Pending Review', value: 389, fill: '#D97706' },
  { name: 'Exception', value: 67, fill: '#DC2626' },
];

export const SLA_TREND_DATA = [
  { day: 'Mon', breaches: 12 },
  { day: 'Tue', breaches: 8 },
  { day: 'Wed', breaches: 15 },
  { day: 'Thu', breaches: 6 },
  { day: 'Fri', breaches: 9 },
  { day: 'Sat', breaches: 4 },
  { day: 'Sun', breaches: 11 },
];

export const KPI = {
  casesInFlight: 1247,
  avgTurnaround: 12.3,
  slaCompliance: 94.2,
  duplicatesPrevented: 3891,
};

// ─── Demo Steps ─────────────────────────────────────────────────────────────
export const DEMO_STEPS = [
  { id: 0, label: 'Login as Citizen', route: '/', tip: 'OTP login – any 6 digits. Role: Citizen.' },
  { id: 1, label: 'Citizen Dashboard', route: '/citizen', tip: 'Case Passport, verified docs vault, notifications.' },
  { id: 2, label: 'Apply Once – Wizard', route: '/citizen/apply', tip: '4-step wizard with consent modal.' },
  { id: 3, label: 'Case Tracker', route: '/citizen/tracker', tip: 'Live 7-stage timeline with SOAP retry exception.' },
  { id: 4, label: 'Fact Exchange', route: '/citizen/facts', tip: 'Verified facts with protocol badges and identity map.' },
  { id: 5, label: 'Officer Console (Revenue)', route: '/officer', tip: "Queue with SLA timers. Approve Rohan's case." },
  { id: 6, label: 'Smart Referral Map', route: '/officer/referral', tip: 'React Flow graph with animated data packets.' },
  { id: 7, label: 'Admin Command Center', route: '/admin', tip: 'KPIs, Recharts, exceptions queue.' },
  { id: 8, label: 'Audit Trail', route: '/admin/audit', tip: 'Append-only, tamper-evident, live-updating.' },
  { id: 9, label: 'Before vs After', route: '/before-after', tip: 'Animated counter comparison.' },
];
