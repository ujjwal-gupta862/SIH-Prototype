import { useState } from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { useSim } from '../sim/store';
import { Card, Badge, Button, Sparkline, HealthDot, ProtocolBadge } from '../components/ui';

export default function AdapterHealth() {
  const { state, dispatch } = useSim();
  const adapters = state.adapters;
  const exceptions = state.exceptions;
  const departments = state.departments;

  const [testing, setTesting] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleTestConnection = (id: string) => {
    setTesting(id);
    setTimeout(() => {
      setTesting(null);
      setToastMsg(`Successfully connected to adapter ${id}`);
      setTimeout(() => setToastMsg(null), 3000);
    }, 1500);
  };

  const handleRetry = (id: string) => {
    dispatch('retryWithBackoff', { exceptionId: id });
  };

  return (
    <div className="h-full bg-slate-50 p-6 overflow-y-auto">
      <div className="mb-6">
        <h1 className="text-xl font-black text-navy-900">Adapter & Connector Health</h1>
        <p className="text-sm text-slate-500">Monitor integrations with external department systems</p>
      </div>

      {toastMsg && (
        <div className="fixed top-4 right-4 bg-verified-500 text-white px-4 py-2 rounded shadow-lg z-50 transition-opacity">
          {toastMsg}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 mb-8">
        {adapters.map((adapter) => {
          const dept = departments.find(d => d.id === adapter.deptId);
          if (!dept) return null;

          const isDown = adapter.status === 'down';
          const isDegraded = adapter.status === 'degraded';

          return (
            <motion.div key={adapter.id} layout>
              <Card className={clsx('p-5 transition-colors', isDown ? 'border-red-300 bg-red-50/20' : isDegraded ? 'border-amber-300 bg-amber-50/20' : '')}>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-navy-900 text-lg flex items-center gap-2">
                      {dept.name}
                      <HealthDot health={adapter.status === 'healthy' ? 'healthy' : isDegraded ? 'warning' : 'critical'} />
                    </h3>
                    <div className="flex gap-2 mt-1">
                      <ProtocolBadge protocol={dept.protocol} />
                      {adapter.circuit !== 'closed' && (
                        <Badge variant="danger">Circuit: {adapter.circuit}</Badge>
                      )}
                    </div>
                  </div>
                  <Button variant="secondary" size="sm" loading={testing === adapter.id} onClick={() => handleTestConnection(adapter.id)}>
                    Test Connection
                  </Button>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-[10px] text-slate-400 font-semibold uppercase">Success Rate</p>
                    <p className="text-lg font-bold text-navy-800">{adapter.successRate}%</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-semibold uppercase">Latency</p>
                    <p className="text-lg font-bold text-navy-800">{adapter.latencyMs[adapter.latencyMs.length - 1] || 0}ms</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-semibold uppercase">Version</p>
                    <p className="text-lg font-bold text-navy-800">{adapter.version}</p>
                  </div>
                </div>

                <div>
                  <p className="text-[10px] text-slate-400 font-semibold uppercase mb-1">Latency Trend</p>
                  <Sparkline data={adapter.latencyMs} width={200} height={30} color={isDown ? '#ef4444' : isDegraded ? '#f59e0b' : '#22c55e'} />
                </div>
                
                {isDown && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-800">
                    <strong>Outage detected!</strong> Circuit breaker opened after consecutive failures. Escalated to Nodal Officer ({dept.nodalOfficer}).
                  </div>
                )}
              </Card>
            </motion.div>
          );
        })}
      </div>

      <div>
        <h2 className="text-lg font-bold text-navy-900 mb-4">Exception Queue</h2>
        <Card className="p-0 overflow-hidden">
          {exceptions.length === 0 ? (
            <div className="p-6 text-center text-slate-500 text-sm">No active exceptions.</div>
          ) : (
            <div className="divide-y divide-slate-100">
              {exceptions.map(ex => {
                const adapter = adapters.find(a => a.id === ex.adapterId);
                return (
                  <div key={ex.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-navy-900">{ex.id}</span>
                        <Badge variant={ex.state === 'resolved' ? 'verified' : 'warning'}>{ex.state}</Badge>
                      </div>
                      <p className="text-sm text-slate-600 mb-1">Case: {ex.caseId} | Adapter: {adapter?.deptId}</p>
                      <p className="text-xs text-red-600 font-mono">{ex.lastError}</p>
                    </div>
                    <div className="text-right flex flex-col items-end gap-2">
                      <div className="text-xs text-slate-500">
                        Attempt {ex.attempts} / {ex.maxAttempts}
                      </div>
                      {ex.state !== 'resolved' && (
                        <div className="flex gap-2">
                          <Button variant="secondary" size="sm" onClick={() => handleRetry(ex.id)}>Retry Now</Button>
                          <Button variant="danger" size="sm" onClick={() => dispatch('escalate', { exceptionId: ex.id })}>Escalate</Button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
