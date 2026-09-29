import type { SimState } from './types';

export function createSeedState(): SimState {
  const now = new Date().toISOString();
  
  return {
    departments: [
      { id: 'dept-rev', name: 'Revenue Department', nameHi: 'राजस्व विभाग', nameMr: 'महसूल विभाग', protocol: 'SOAP/XML', nodalOfficer: 'Rajesh Patil' },
      { id: 'dept-sjd', name: 'Social Justice', nameHi: 'सामाजिक न्याय', nameMr: 'सामाजिक न्याय', protocol: 'REST/JSON', nodalOfficer: 'Smita Kadam' },
      { id: 'dept-hte', name: 'Higher & Tech Education', nameHi: 'उच्च आणि तंत्र शिक्षण', nameMr: 'उच्च व तंत्रशिक्षण', protocol: 'REST/JSON', nodalOfficer: 'Vikram Joshi' },
      { id: 'dept-try', name: 'Treasury / DBT', nameHi: 'कोषागार / डीबीटी', nameMr: 'कोषागार / डीबीटी', protocol: 'REST/JSON', nodalOfficer: 'Anand Rao' }
    ],
    adapters: [
      { id: 'adpt-rev', deptId: 'dept-rev', status: 'healthy', latencyMs: [120, 140, 110], successRate: 99.9, lastSync: now, version: '1.2.0', circuit: 'closed' },
      { id: 'adpt-sjd', deptId: 'dept-sjd', status: 'healthy', latencyMs: [45, 50, 42], successRate: 99.99, lastSync: now, version: '2.1.0', circuit: 'closed' },
      { id: 'adpt-hte', deptId: 'dept-hte', status: 'healthy', latencyMs: [60, 55, 65], successRate: 99.95, lastSync: now, version: '2.0.1', circuit: 'closed' },
      { id: 'adpt-try', deptId: 'dept-try', status: 'healthy', latencyMs: [80, 85, 90], successRate: 99.9, lastSync: now, version: '3.0.0', circuit: 'closed' }
    ],
    cases: [
      {
        id: 'SUT-MH-2026-000481',
        service: 'Post-Matric Scholarship (OBC)',
        citizenId: 'cit-riya-1',
        citizenName: 'Riya Deshmukh',
        status: 'submitted',
        createdAt: now,
        slaDueAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        steps: [
          { id: 'step-1', deptId: 'dept-hte', label: 'Submit Application', state: 'idle', slaHours: 24 },
          { id: 'step-2', deptId: 'dept-hte', label: 'Eligibility Check', state: 'idle', slaHours: 24 },
          { id: 'step-3', deptId: 'dept-rev', label: 'Revenue Verification (Income/Domicile)', state: 'idle', slaHours: 48 },
          { id: 'step-4', deptId: 'dept-sjd', label: 'Social Justice Verification (Caste)', state: 'idle', slaHours: 48 },
          { id: 'step-5', deptId: 'dept-hte', label: 'Education Dept Approval', state: 'idle', slaHours: 24 },
          { id: 'step-6', deptId: 'dept-try', label: 'Treasury DBT Payment', state: 'idle', slaHours: 48 },
        ],
        facts: [],
        consents: []
      },
      {
        id: 'SUT-MH-2026-000212',
        service: 'Senior Citizen Scheme',
        citizenId: 'cit-arjun-1',
        citizenName: 'Arjun Mane',
        status: 'paid',
        createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        slaDueAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        steps: [], facts: [], consents: []
      },
      {
        id: 'SUT-MH-2026-000305',
        service: 'EWS Certificate',
        citizenId: 'cit-priya-1',
        citizenName: 'Priya Jadhav',
        status: 'approved',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        slaDueAt: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
        steps: [], facts: [], consents: []
      }
    ],
    auditLog: [],
    exceptions: [],
    identityMaps: [
      {
        sutradharId: 'SUT-ID-7728-XXXX',
        citizenName: 'Riya Deshmukh',
        confidence: 0.99,
        conflicts: [],
        identifiers: [
          { deptId: 'dept-rev', idLabel: 'Aadhaar', maskedValue: 'XXXX-XXXX-4821' },
          { deptId: 'dept-hte', idLabel: 'Student ID', maskedValue: 'HTE-24-XXXX89' },
          { deptId: 'dept-sjd', idLabel: 'Caste Cert No', maskedValue: 'MH-CST-XXXX44' }
        ]
      }
    ],
    notifications: [],
    speed: 1,
    paused: true,
    simTime: now,
    startedAt: now,
    currentRole: 'citizen',
    isLoggedIn: false,
    language: 'en'
  };
}
