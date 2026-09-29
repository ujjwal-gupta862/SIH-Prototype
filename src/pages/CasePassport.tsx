import { useParams } from 'react-router-dom';
import { useSim } from '../sim/store';
import { Card, StatusChip, SectionHeader, Tabs, Button, Badge, VerifiedTick, EmptyState } from '../components/ui';
import { FileText, Clock, ShieldCheck, Lock, Activity, ArrowRight, User } from 'lucide-react';
import { useState } from 'react';
import type { ServiceCase, WorkflowStep } from '../sim/types';

export default function CasePassport() {
  const { id } = useParams<{ id: string }>();
  const { state } = useSim();
  const [activeTab, setActiveTab] = useState('timeline');

  const caseData = state.cases.find(c => c.id === id);

  if (!caseData) {
    return (
      <div className="p-6 max-w-5xl mx-auto">
        <EmptyState title="Case Not Found" message={`Could not find case with ID ${id}`} />
      </div>
    );
  }

  const getDeptName = (deptId: string) => state.departments.find(d => d.id === deptId)?.name || deptId;
  const auditEvents = state.auditLog.filter(a => a.caseId === id).sort((a,b) => new Date(b.at).getTime() - new Date(a.at).getTime());

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <Card className="p-6 overflow-hidden relative">
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-slate-50 flex items-center justify-center border-l border-slate-100 opacity-50">
          {/* QR-like pattern via CSS */}
          <div className="w-16 h-16 grid grid-cols-4 grid-rows-4 gap-0.5">
            {Array.from({length: 16}).map((_, i) => (
              <div key={i} className={`bg-navy-900 ${[0,3,5,10,12,15].includes(i) ? 'opacity-100' : 'opacity-20'}`} />
            ))}
          </div>
        </div>

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-slate-500 tracking-wider">CASE PASSPORT</span>
              <StatusChip status={caseData.status} />
            </div>
            <h1 className="text-2xl font-black text-navy-900 tracking-tight">{caseData.id}</h1>
            <p className="text-sm font-semibold text-navy-600 mt-1">{caseData.service}</p>
          </div>
          
          <div className="flex gap-6 items-center">
            <div className="text-right">
              <p className="text-[10px] text-slate-500 uppercase tracking-wide font-semibold mb-1">Applicant</p>
              <div className="flex items-center gap-1.5 justify-end">
                <User className="w-3.5 h-3.5 text-navy-400" />
                <span className="text-sm font-bold text-navy-800">{caseData.citizenName}</span>
              </div>
            </div>
            <div className="h-10 w-px bg-slate-200" />
            <div className="text-right mr-16 md:mr-0">
              <p className="text-[10px] text-slate-500 uppercase tracking-wide font-semibold mb-1">SLA Due</p>
              <p className="text-sm font-bold text-danger-600">{new Date(caseData.slaDueAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </Card>

      <Tabs 
        tabs={[
          { id: 'timeline', label: 'Timeline', count: caseData.steps.length },
          { id: 'facts', label: 'Verified Facts', count: caseData.facts.length },
          { id: 'docs', label: 'Documents', count: 0 },
          { id: 'consents', label: 'Consents', count: caseData.consents.length },
          { id: 'audit', label: 'Audit Trail', count: auditEvents.length }
        ]} 
        activeTab={activeTab} 
        onChange={setActiveTab} 
      />

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 min-h-[400px]">
        
        {activeTab === 'timeline' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-navy-800">Processing Timeline</h3>
              <Badge variant="info">Live Engine Events</Badge>
            </div>
            <div className="relative border-l-2 border-slate-100 ml-4 space-y-8 pb-4">
              {caseData.steps.map((step, idx) => (
                <div key={step.id} className="relative pl-6">
                  {/* Status dot */}
                  <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-white ${
                    step.state === 'done' ? 'bg-verified-500' : 
                    step.state === 'processing' ? 'bg-saffron-500 animate-pulse' : 
                    step.state === 'failed' ? 'bg-danger-500' : 'bg-slate-300'
                  }`} />
                  
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className={`text-sm font-bold ${step.state === 'idle' ? 'text-slate-500' : 'text-navy-900'}`}>
                        {step.label}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                        <span className="font-medium text-navy-600">{getDeptName(step.deptId)}</span>
                        <span>•</span>
                        <span>SLA: {step.slaHours}h</span>
                      </p>
                    </div>
                    <div>
                      <Badge variant={step.state === 'done' ? 'verified' : step.state === 'processing' ? 'warning' : 'neutral'}>
                        {step.state}
                      </Badge>
                      {step.completedAt && (
                        <p className="text-[10px] text-slate-400 mt-1 text-right">
                          {new Date(step.completedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'facts' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-navy-800 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-verified-500" /> Single Source of Truth
            </h3>
            {caseData.facts.length === 0 ? (
              <EmptyState title="No Facts Verified Yet" message="Departments have not verified any facts via inter-dept APIs for this case." />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {caseData.facts.map(f => (
                  <Card key={f.id} className="p-4 bg-slate-50/50">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{f.label}</span>
                      <VerifiedTick />
                    </div>
                    <p className="text-lg font-bold text-navy-900 mb-2">{f.value}</p>
                    <div className="flex justify-between items-end border-t border-slate-100 pt-2 mt-2">
                      <div>
                        <p className="text-[10px] text-slate-400">Source</p>
                        <p className="text-xs font-medium text-navy-600">{getDeptName(f.sourceDeptId)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-slate-400">Consent Ref</p>
                        <p className="text-[10px] font-mono text-slate-500">{f.consentId.split('-')[0]}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'docs' && (
          <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
            <div className="w-16 h-16 bg-verified-50 text-verified-500 rounded-full flex items-center justify-center">
              <FileText className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-navy-900">0 Documents Re-uploaded</h3>
              <p className="text-sm text-slate-500 max-w-md mx-auto mt-2">
                This case runs entirely on verified facts fetched securely from source departments. No physical or scanned documents were required from the citizen.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'consents' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-navy-800 flex items-center gap-2">
              <Lock className="w-4 h-4 text-saffron-500" /> Citizen Data Consents
            </h3>
            {caseData.consents.length === 0 ? (
              <EmptyState title="No Consents" message="No data consents requested for this case yet." />
            ) : (
              <div className="space-y-3">
                {caseData.consents.map(c => (
                  <div key={c.id} className="border border-slate-100 rounded-lg p-4 flex justify-between items-center">
                    <div>
                      <p className="text-sm font-bold text-navy-900">{getDeptName(c.requesterDeptId)}</p>
                      <p className="text-xs text-slate-500">Fields: {c.fields.join(', ')}</p>
                      <p className="text-[10px] text-slate-400 mt-1">Purpose: {c.purpose}</p>
                    </div>
                    <div className="text-right">
                      <StatusChip status={c.status} />
                      <p className="text-[10px] text-slate-400 mt-1">Ref: {c.id.split('-')[0]}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'audit' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-navy-800 flex items-center gap-2">
              <Activity className="w-4 h-4 text-purple-500" /> Case Audit Trail
            </h3>
            {auditEvents.length === 0 ? (
              <EmptyState title="No Events" message="No audit events recorded for this case." />
            ) : (
              <div className="space-y-3">
                {auditEvents.map(a => (
                  <div key={a.id} className="flex gap-3 text-sm border-b border-slate-50 pb-3">
                    <div className="w-20 shrink-0 text-[10px] text-slate-400 pt-0.5">
                      {new Date(a.at).toLocaleTimeString()}
                    </div>
                    <div>
                      <p className="font-semibold text-navy-800">{a.action}</p>
                      <p className="text-xs text-slate-500">{a.detail}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">Actor: {a.actor} ({a.actorRole})</p>
                    </div>
                    <div className="ml-auto text-[10px] font-mono text-slate-300">
                      Hash: {a.hash.substring(0, 8)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
