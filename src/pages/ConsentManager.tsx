import { useState } from 'react';
import { useSim } from '../sim/store';
import { Card, Button, StatusChip, SectionHeader, EmptyState, Badge, Modal } from '../components/ui';
import { Shield, ShieldAlert, Key, Clock, AlertTriangle, FileText, CheckCircle, XCircle } from 'lucide-react';
import type { Consent, Department } from '../sim/types';

export default function ConsentManager() {
  const { state, dispatch } = useSim();
  const [revokeModalOpen, setRevokeModalOpen] = useState(false);
  const [selectedConsent, setSelectedConsent] = useState<Consent | null>(null);

  // Use the primary case for citizen
  const activeCase = state.cases.find(c => c.citizenId === 'cit-riya-1') || state.cases[0];
  const consents = activeCase?.consents || [];

  const pendingConsents = consents.filter(c => c.status === 'pending');
  const pastConsents = consents.filter(c => c.status !== 'pending');

  const getDeptName = (deptId: string) => {
    const dept = state.departments.find(d => d.id === deptId);
    return state.language === 'en' ? dept?.name : dept?.nameMr;
  };

  const handleGrant = (c: Consent) => {
    dispatch('grantConsent', { consentId: c.id, caseId: c.caseId });
  };

  const handleDeny = (c: Consent) => {
    dispatch('denyConsent', { consentId: c.id, caseId: c.caseId });
  };

  const handleRevoke = () => {
    if (selectedConsent) {
      dispatch('revokeConsent', { consentId: selectedConsent.id, caseId: selectedConsent.caseId });
      setRevokeModalOpen(false);
      setSelectedConsent(null);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <SectionHeader 
        title="Consent Manager" 
        subtitle="Manage who can access your data across departments" 
        icon={<Shield className="w-5 h-5" />} 
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          {/* Pending Consents */}
          <div>
            <h3 className="text-sm font-bold text-navy-800 mb-4 flex items-center gap-2">
              <Key className="w-4 h-4 text-saffron-500" />
              Action Required
              {pendingConsents.length > 0 && (
                <span className="bg-saffron-500 text-white text-[10px] px-2 py-0.5 rounded-full">{pendingConsents.length}</span>
              )}
            </h3>
            {pendingConsents.length === 0 ? (
              <Card className="p-6">
                <EmptyState 
                  icon={<Shield className="w-8 h-8 opacity-50" />}
                  title="No Pending Requests"
                  message="You don't have any pending data access requests at the moment."
                />
              </Card>
            ) : (
              <div className="space-y-4">
                {pendingConsents.map(c => (
                  <Card key={c.id} className="p-4 border-l-4 border-saffron-500">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-semibold text-navy-600">{getDeptName(c.requesterDeptId)}</span>
                          <Badge variant="warning">New Request</Badge>
                        </div>
                        <h4 className="text-sm font-bold text-navy-900">Requesting Data Access</h4>
                      </div>
                      <span className="text-[10px] text-slate-400 bg-slate-50 px-2 py-1 rounded">Case: {c.caseId}</span>
                    </div>
                    
                    <div className="bg-slate-50 rounded-lg p-3 mb-4 space-y-2">
                      <div className="flex text-xs">
                        <span className="w-24 text-slate-500">Fields:</span>
                        <span className="font-semibold text-navy-800">{c.fields.join(', ')}</span>
                      </div>
                      <div className="flex text-xs">
                        <span className="w-24 text-slate-500">Purpose:</span>
                        <span className="font-semibold text-navy-800">{c.purpose}</span>
                      </div>
                      <div className="flex text-xs">
                        <span className="w-24 text-slate-500">Duration:</span>
                        <span className="font-semibold text-navy-800">{c.duration}</span>
                      </div>
                    </div>

                    <div className="flex gap-2 justify-end">
                      <Button variant="ghost" size="sm" onClick={() => handleDeny(c)}>Deny</Button>
                      <Button variant="primary" size="sm" onClick={() => handleGrant(c)}>Approve Access</Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Consent Ledger */}
          <div>
            <h3 className="text-sm font-bold text-navy-800 mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-navy-500" />
              Consent History
            </h3>
            <Card>
              {pastConsents.length === 0 ? (
                <div className="p-6">
                  <EmptyState title="No History" message="Your past consents will appear here." />
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {pastConsents.map(c => (
                    <div key={c.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5">
                          {c.status === 'granted' ? <CheckCircle className="w-4 h-4 text-verified-500" /> :
                           c.status === 'revoked' ? <AlertTriangle className="w-4 h-4 text-amber-500" /> :
                           <XCircle className="w-4 h-4 text-danger-500" />}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-navy-900">{getDeptName(c.requesterDeptId)}</p>
                          <p className="text-xs text-slate-500 mt-0.5">Fields: {c.fields.join(', ')}</p>
                          <div className="flex items-center gap-2 mt-1.5">
                            <StatusChip status={c.status} />
                            <span className="text-[10px] text-slate-400">
                              Expires: {new Date(c.expiresAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      {c.status === 'granted' && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-danger-600 hover:bg-red-50 hover:text-danger-700"
                          onClick={() => { setSelectedConsent(c); setRevokeModalOpen(true); }}
                        >
                          Revoke
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>

        {/* Info Panel */}
        <div className="space-y-4">
          <Card className="p-4 bg-navy-50 border-navy-100">
            <h4 className="text-xs font-bold text-navy-900 mb-2 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-navy-600" />
              Your Data, Your Control
            </h4>
            <p className="text-xs text-navy-700 leading-relaxed mb-3">
              SUTRADHAR ensures no department can access your data without explicit permission. All accesses are logged on an immutable ledger.
            </p>
            <ul className="text-[10px] text-navy-600 space-y-1.5 list-disc pl-4">
              <li>Purpose-specific sharing only</li>
              <li>Time-bound access</li>
              <li>Revoke anytime</li>
            </ul>
          </Card>
        </div>
      </div>

      <Modal open={revokeModalOpen} onClose={() => setRevokeModalOpen(false)} title="Revoke Consent?">
        <div className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            <p className="text-xs text-amber-800 leading-relaxed">
              Revoking this consent may stall the processing of your case (ID: <strong>{selectedConsent?.caseId}</strong>). 
              The department will not be able to fetch required facts.
            </p>
          </div>
          <p className="text-xs text-slate-600">Are you sure you want to revoke access to {selectedConsent?.fields.join(', ')}?</p>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="ghost" onClick={() => setRevokeModalOpen(false)}>Cancel</Button>
            <Button variant="danger" onClick={handleRevoke}>Yes, Revoke Access</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
