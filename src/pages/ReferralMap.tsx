import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ReactFlow, Background, Controls, Handle, Position, useNodesState, useEdgesState, MarkerType, type Node, type Edge } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { clsx } from 'clsx';
import { useApp } from '../context/AppContext';
import { DEPT_NODES } from '../data/mockData';
import { Card, Badge, HealthDot, ProtocolBadge } from '../components/ui';
import type { DeptNode } from '../types';

// ── Custom Node Types ─────────────────────────────────────────────────────
function CenterNode({ data }: { data: { label: string } }) {
  return (
    <div className="bg-gradient-to-br from-navy-700 to-navy-900 border-2 border-saffron-400 rounded-2xl px-5 py-3 shadow-xl min-w-[140px] text-center">
      <div className="text-saffron-400 text-xs font-bold uppercase tracking-widest mb-1">⚡</div>
      <div className="text-white font-black text-sm">{data.label}</div>
      <div className="text-navy-300 text-[10px] mt-0.5">Interoperability Layer</div>
      <Handle type="source" position={Position.Right} className="opacity-0" />
      <Handle type="source" position={Position.Left} className="opacity-0" />
      <Handle type="source" position={Position.Top} className="opacity-0" />
      <Handle type="source" position={Position.Bottom} className="opacity-0" />
      <Handle type="target" position={Position.Right} className="opacity-0" />
      <Handle type="target" position={Position.Left} className="opacity-0" />
      <Handle type="target" position={Position.Top} className="opacity-0" />
      <Handle type="target" position={Position.Bottom} className="opacity-0" />
    </div>
  );
}

function DeptNodeComponent({ data }: { data: DeptNode & { onClick: () => void } }) {
  const healthColor = data.health === 'healthy' ? 'border-verified-400 bg-verified-50' :
                      data.health === 'warning'  ? 'border-warning-400 bg-amber-50' :
                      'border-slate-200 bg-slate-50 opacity-60';
  return (
    <div onClick={data.onClick} className={clsx('border-2 rounded-xl px-4 py-2.5 shadow-sm cursor-pointer hover:shadow-md transition-shadow min-w-[120px] text-center', healthColor)}>
      <div className="flex items-center justify-center gap-1.5 mb-1">
        <HealthDot health={data.health} />
        <span className="text-navy-800 font-bold text-xs">{data.label}</span>
      </div>
      <div className="flex justify-center gap-1">
        <span className={clsx('text-[9px] font-semibold px-1.5 py-0.5 rounded',
          data.protocol === 'REST' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
        )}>{data.adapter}</span>
        {!data.onboarded && <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-slate-100 text-slate-500">Next</span>}
      </div>
      <Handle type="target" position={Position.Left} className="opacity-0" />
      <Handle type="target" position={Position.Right} className="opacity-0" />
      <Handle type="target" position={Position.Top} className="opacity-0" />
      <Handle type="target" position={Position.Bottom} className="opacity-0" />
      <Handle type="source" position={Position.Left} className="opacity-0" />
      <Handle type="source" position={Position.Right} className="opacity-0" />
    </div>
  );
}

const nodeTypes = {
  center: CenterNode,
  dept: DeptNodeComponent,
};

// Node positions
const INITIAL_NODES: Node[] = [
  { id: 'sutradhar', type: 'center', position: { x: 360, y: 220 }, data: { label: 'SUTRADHAR' } },
  // Active depts
  { id: 'revenue',      type: 'dept', position: { x: 60,  y: 80  }, data: { ...DEPT_NODES[0] } },
  { id: 'social-justice',type: 'dept', position: { x: 60,  y: 220 }, data: { ...DEPT_NODES[1] } },
  { id: 'higher-ed',    type: 'dept', position: { x: 60,  y: 360 }, data: { ...DEPT_NODES[2] } },
  { id: 'dbt',          type: 'dept', position: { x: 700, y: 220 }, data: { ...DEPT_NODES[3] } },
  // Next depts
  { id: 'health',       type: 'dept', position: { x: 700, y: 80  }, data: { ...DEPT_NODES[4] } },
  { id: 'agriculture',  type: 'dept', position: { x: 700, y: 360 }, data: { ...DEPT_NODES[5] } },
  { id: 'water',        type: 'dept', position: { x: 360, y: 440 }, data: { ...DEPT_NODES[6] } },
  { id: 'womenchild',   type: 'dept', position: { x: 360, y: 0   }, data: { ...DEPT_NODES[7] } },
];

const mkEdge = (id: string, source: string, target: string, label: string, animated = true, dashed = false): Edge => ({
  id, source, target,
  label,
  animated,
  style: { stroke: animated ? '#F97316' : '#CBD5E1', strokeDasharray: dashed ? '6 3' : undefined },
  labelStyle: { fontSize: 9, fill: '#64748B', fontWeight: 600 },
  markerEnd: animated ? { type: MarkerType.ArrowClosed, color: '#F97316' } : undefined,
});

const INITIAL_EDGES: Edge[] = [
  mkEdge('e1', 'sutradhar', 'revenue',       'SOAP/XML', true),
  mkEdge('e2', 'sutradhar', 'social-justice','REST/JSON', true),
  mkEdge('e3', 'sutradhar', 'higher-ed',     'REST/JSON', true),
  mkEdge('e4', 'sutradhar', 'dbt',           'REST/JSON', true),
  mkEdge('e5', 'sutradhar', 'health',        'REST (planned)', false, true),
  mkEdge('e6', 'sutradhar', 'agriculture',   'REST (planned)', false, true),
  mkEdge('e7', 'sutradhar', 'water',         'SOAP (planned)', false, true),
  mkEdge('e8', 'sutradhar', 'womenchild',    'REST (planned)', false, true),
];

export default function ReferralMap() {
  const { state } = useApp();
  const lang = state.language;
  const [nodes, , onNodesChange] = useNodesState(INITIAL_NODES);
  const [edges, , onEdgesChange] = useEdgesState(INITIAL_EDGES);
  const [selectedNode, setSelectedNode] = useState<DeptNode | null>(null);

  const t = (en: string, mr: string) => lang === 'en' ? en : mr;

  // Inject onClick into dept nodes
  const nodesWithClick = nodes.map(n => {
    if (n.type === 'dept') {
      const deptData = DEPT_NODES.find(d => d.id === n.id);
      if (deptData) {
        return { ...n, data: { ...deptData, onClick: () => setSelectedNode(deptData) } };
      }
    }
    return n;
  });

  return (
    <div className="h-full bg-slate-50 p-6 flex flex-col overflow-hidden">
      <div className="flex items-center justify-between mb-5 shrink-0">
        <div>
          <h1 className="text-xl font-black text-navy-900">{t('Smart Referral Map', 'स्मार्ट रेफरल मॅप')}</h1>
          <p className="text-slate-500 text-sm">{t('SUTRADHAR ecosystem — adapter health & connectivity', 'SUTRADHAR इकोसिस्टम — अडॅप्टर स्वास्थ्य')}</p>
        </div>
        <div className="flex gap-3 items-center">
          <div className="flex items-center gap-2 text-xs">
            <HealthDot health="healthy" />
            <span className="text-slate-500">{t('Active', 'सक्रिय')}</span>
            <HealthDot health="warning" />
            <span className="text-slate-500">{t('Warning', 'चेतावणी')}</span>
            <HealthDot health="critical" />
            <span className="text-slate-500">{t('Not connected', 'जोडलेले नाही')}</span>
          </div>
          <Badge variant="verified">4 Depts Online</Badge>
        </div>
      </div>

      <div className="flex gap-5 flex-1 min-h-0">
        {/* React Flow canvas */}
        <div className="flex-1 rounded-2xl overflow-hidden border border-slate-100 shadow-sm bg-white">
          <ReactFlow
            nodes={nodesWithClick}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            nodeTypes={nodeTypes}
            fitView
            fitViewOptions={{ padding: 0.3 }}
            panOnDrag={false}
            zoomOnScroll={false}
            zoomOnPinch={false}
            nodesDraggable={false}
            elementsSelectable={false}
            proOptions={{ hideAttribution: true }}
          >
            <Background color="#E2E8F0" gap={20} />
          </ReactFlow>
        </div>

        {/* Side panel */}
        <div className="w-72 flex flex-col gap-4">
          {selectedNode ? (
            <motion.div key={selectedNode.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <Card className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <HealthDot health={selectedNode.health} />
                    <h3 className="text-sm font-bold text-navy-900">{selectedNode.label}</h3>
                  </div>
                  <button onClick={() => setSelectedNode(null)} className="text-slate-300 hover:text-slate-500 text-sm">✕</button>
                </div>
                <div className="space-y-3 text-xs">
                  {[
                    { k: t('Status', 'स्थिती'), v: selectedNode.onboarded ? '🟢 Connected' : '🔴 Not Onboarded' },
                    { k: t('Adapter', 'अडॅप्टर'), v: selectedNode.adapter },
                    { k: t('Version', 'आवृत्ती'), v: selectedNode.adapterVersion },
                    { k: t('Uptime', 'अपटाइम'), v: selectedNode.uptime },
                    { k: t('Avg Latency', 'विलंब'), v: selectedNode.latency },
                    { k: t('Last Sync', 'शेवटची सिंक'), v: selectedNode.lastSync },
                  ].map(({ k, v }) => (
                    <div key={k} className="flex justify-between py-1.5 border-b border-slate-50">
                      <span className="text-slate-400">{k}</span>
                      <span className="text-navy-700 font-semibold text-right">{v}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <ProtocolBadge protocol={selectedNode.adapter} />
                  {!selectedNode.onboarded && (
                    <div className="mt-3 bg-saffron-50 border border-saffron-100 rounded-xl p-3 text-xs text-saffron-700">
                      📋 Onboarding in progress. Estimated integration: Q1 2027.
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          ) : (
            <Card className="p-5">
              <h3 className="text-sm font-bold text-navy-900 mb-4">{t('Adapter Summary', 'अडॅप्टर सारांश')}</h3>
              <div className="space-y-3">
                {DEPT_NODES.map(d => (
                  <div key={d.id} className="flex items-center gap-3 text-xs">
                    <HealthDot health={d.health} />
                    <span className="flex-1 text-navy-700 font-medium">{d.label}</span>
                    <ProtocolBadge protocol={d.adapter} />
                    <span className={clsx('text-[10px]', d.onboarded ? 'text-verified-600' : 'text-slate-400')}>{d.latency}</span>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Click hint */}
          {!selectedNode && (
            <Card className="p-4 border-dashed border-saffron-200">
              <p className="text-xs text-slate-400 text-center">
                <span className="block text-2xl mb-2">👆</span>
                {t('Click any node to see adapter details, uptime, and latency.', 'कोणत्याही नोडवर क्लिक करा.')}
              </p>
            </Card>
          )}

          {/* Live data packets legend */}
          <Card className="p-4">
            <h3 className="text-xs font-bold text-navy-900 mb-3">{t('Live Data Packets', 'लाइव्ह डेटा पॅकेट')}</h3>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-0.5 bg-saffron-400" />
              <svg className="w-3 h-3 text-saffron-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
              <span className="text-xs text-slate-500">{t('Active exchange', 'सक्रिय देवाण')}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-0.5 border-t border-dashed border-slate-300" />
              <svg className="w-3 h-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
              <span className="text-xs text-slate-400">{t('Planned connection', 'नियोजित')}</span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
