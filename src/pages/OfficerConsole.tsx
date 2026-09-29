import React, { useState } from 'react';
import { useSim } from '../sim/store';
import { Card, SectionHeader, Table, Th, Td, StatusChip, Badge, Button, Drawer, Modal } from '../components/ui';
import { Briefcase, CheckCircle, Clock, Shield, ArrowRight } from 'lucide-react';

function timeAgo(dateString: string) {
  const diff = Date.now() - new Date(dateString).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  return 'just now';
}

function timeDue(dateString: string) {
  const diff = new Date(dateString).getTime() - Date.now();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (diff < 0) return 'Overdue';
  if (days > 0) return `in ${days}d`;
  if (hours > 0) return `in ${hours}h`;
  return 'due soon';
}

export function OfficerConsole() {
  const { state, dispatch } = useSim();
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const activeCase = state.cases.find(c => c.id === selectedCaseId);

  // Filter cases for officer (e.g. pending ones)
  const pendingCases = state.cases.filter(c => ['submitted', 'processing', 'referred', 'needs-info'].includes(c.status));

  const handleApprove = () => {
    if (activeCase) {
      dispatch('approve', { caseId: activeCase.id });
      setSelectedCaseId(null);
    }
  };

  const handleReject = () => {
    if (activeCase && rejectReason) {
      dispatch('reject', { caseId: activeCase.id, reason: rejectReason });
      setRejectModalOpen(false);
      setSelectedCaseId(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <SectionHeader 
        icon={<Briefcase className="w-5 h-5" />} 
        title="Officer Inbox" 
        subtitle="Review and process citizen applications"
      />

      <Card className="p-0 overflow-hidden">
        <Table>
          <thead>
            <tr>
              <Th>Case ID</Th>
              <Th>Citizen</Th>
              <Th>Service</Th>
              <Th>Status</Th>
              <Th>SLA Due</Th>
              <Th className="text-right">Action</Th>
            </tr>
          </thead>
          <tbody>
            {pendingCases.map(c => {
              const slaDate = new Date(c.slaDueAt);
              const isOverdue = slaDate < new Date();
              return (
                <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                  <Td className="font-mono text-navy-600 font-medium">{c.id}</Td>
                  <Td>{c.citizenName}</Td>
                  <Td>{c.service}</Td>
                  <Td><StatusChip status={c.status} /></Td>
                  <Td>
                    <div className={`flex items-center gap-1 ${isOverdue ? 'text-red-600' : 'text-slate-600'}`}>
                      <Clock className="w-3 h-3" />
                      {timeDue(c.slaDueAt)}
                    </div>
                  </Td>
                  <Td className="text-right">
                    <Button variant="secondary" size="sm" onClick={() => setSelectedCaseId(c.id)}>Review</Button>
                  </Td>
                </tr>
              );
            })}
            {pendingCases.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-8 text-slate-400 text-sm">No pending cases in your inbox.</td>
              </tr>
            )}
          </tbody>
        </Table>
      </Card>

      <Drawer
        open={!!selectedCaseId}
        onClose={() => setSelectedCaseId(null)}
        title={`Case Review: ${activeCase?.id}`}
      >
        {activeCase && (
          <div className="space-y-6">
            <div>
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Applicant Info</h4>
              <p className="font-bold text-navy-900 text-lg">{activeCase.citizenName}</p>
              <p className="text-sm text-slate-600">{activeCase.service}</p>
            </div>

            <Card className="p-4 border-l-4 border-l-verified-500 bg-verified-50/30">
              <h4 className="text-xs font-semibold text-navy-800 flex items-center gap-2 mb-3">
                <Shield className="w-4 h-4 text-verified-600" /> Pre-Verified Facts
              </h4>
              <div className="space-y-3">
                {activeCase.facts.length > 0 ? activeCase.facts.map(f => (
                  <div key={f.id} className="flex justify-between items-center text-sm border-b border-slate-100 pb-2 last:border-0">
                    <span className="text-slate-600">{f.label}</span>
                    <div className="text-right">
                      <span className="font-medium text-navy-900 block">{f.value}</span>
                      <span className="text-[10px] text-verified-600 flex items-center gap-1 justify-end">
                        <CheckCircle className="w-3 h-3" /> Source: {f.sourceDeptId}
                      </span>
                    </div>
                  </div>
                )) : (
                  <p className="text-xs text-slate-500 italic">Simulate data fetch to see facts.</p>
                )}
              </div>
            </Card>

            <div>
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Eligibility Checklist</h4>
              <div className="space-y-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div className="flex justify-between items-center text-sm">
                  <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-verified-500" /> Income ≤ ₹2.5L</span>
                  <Badge variant="verified">Pass</Badge>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-verified-500" /> Caste valid</span>
                  <Badge variant="verified">Pass</Badge>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-verified-500" /> Domicile verified</span>
                  <Badge variant="verified">Pass</Badge>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-3">
              <Button className="w-full" variant="success" onClick={handleApprove}>Approve Application</Button>
              <div className="flex gap-2">
                <Button className="flex-1" variant="secondary" onClick={() => dispatch('requestMoreInfo', { caseId: activeCase.id })}>Ask for Info</Button>
                <Button className="flex-1" variant="danger" onClick={() => setRejectModalOpen(true)}>Reject</Button>
              </div>
              <Button className="w-full" variant="ghost" onClick={() => dispatch('smartReferral', { caseId: activeCase.id })}>
                Refer to Department <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}
      </Drawer>

      <Modal open={rejectModalOpen} onClose={() => setRejectModalOpen(false)} title="Reject Application">
        <div className="space-y-4">
          <p className="text-sm text-slate-600">Please provide a reason for rejection. This will be visible to the citizen.</p>
          <textarea 
            className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-danger-500 focus:border-danger-500 outline-none"
            rows={4}
            placeholder="E.g., Document unclear, eligibility criteria not met..."
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
          />
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setRejectModalOpen(false)}>Cancel</Button>
            <Button variant="danger" onClick={handleReject} disabled={!rejectReason.trim()}>Confirm Rejection</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
