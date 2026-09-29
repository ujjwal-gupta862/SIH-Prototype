import React, { useMemo, useState, useCallback, useEffect } from 'react';
import { 
  ReactFlow, 
  Background, 
  Controls, 
  MarkerType,
  Handle,
  Position,
  useNodesState,
  useEdgesState,
  BaseEdge,
  getBezierPath,
  EdgeLabelRenderer
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useSim } from '../sim/store';
import { Card, Drawer, SectionHeader, StatusChip, ProtocolBadge } from '../components/ui';
import { Activity, Network, Settings, Database, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import type { Node, Edge, NodeProps, EdgeProps } from '@xyflow/react';
import type { Department, Adapter, WorkflowStep } from '../sim/types';

const NODE_COLORS = {
  idle: 'bg-slate-100 border-slate-300 text-slate-700',
  processing: 'bg-saffron-50 border-saffron-400 text-saffron-800 shadow-[0_0_15px_rgba(242,140,40,0.5)]',
  done: 'bg-verified-50 border-verified-400 text-verified-800',
  failed: 'bg-red-50 border-red-400 text-red-800',
  waiting: 'bg-amber-50 border-amber-400 text-amber-800 border-dashed border-2',
};

const CustomNode = ({ data, isConnectable }: NodeProps) => {
  const { label, state, type, protocol, latency } = data as { 
    label: string; 
    state: keyof typeof NODE_COLORS;
    type: 'citizen' | 'core' | 'dept' | 'outcome';
    protocol?: string;
    latency?: number;
  };

  const Icon = type === 'citizen' ? User : type === 'core' ? Network : type === 'dept' ? Database : Activity;

  return (
    <div className={`px-4 py-3 shadow-md rounded-xl border-2 min-w-[150px] bg-white transition-all duration-300 ${NODE_COLORS[state]}`}>
      <Handle type="target" position={Position.Left} isConnectable={isConnectable} className="w-2 h-2" />
      <div className="flex flex-col items-center text-center gap-2">
        <div className={`p-2 rounded-full ${state === 'processing' ? 'animate-pulse bg-saffron-100' : 'bg-slate-100'}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <div className="text-xs font-bold font-sans">{label}</div>
          {protocol && (
            <div className="mt-1 flex items-center justify-center gap-1 text-[10px]">
              <span className="bg-slate-200 px-1 rounded font-mono">{protocol}</span>
              {latency && <span className="text-slate-500">{latency}ms</span>}
            </div>
          )}
        </div>
      </div>
      <Handle type="source" position={Position.Right} isConnectable={isConnectable} className="w-2 h-2" />
    </div>
  );
};

const AnimatedEdge = ({
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  data
}: EdgeProps) => {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const isActive = data?.active;
  const isSmartReferral = data?.isSmartReferral;

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={{ 
        ...style, 
        strokeWidth: isSmartReferral ? 2 : 3,
        stroke: isSmartReferral ? '#F28C28' : (isActive ? '#2F6FC4' : '#cbd5e1'),
        strokeDasharray: isSmartReferral ? '5,5' : 'none'
      }} />
      
      {isActive && (
        <circle r="4" fill="#F28C28" className="animate-[dash_2s_linear_infinite]">
          <animateMotion dur="2s" repeatCount="indefinite" path={edgePath} />
        </circle>
      )}
      
      {data?.label && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              pointerEvents: 'all',
            }}
            className="nodrag nopan bg-white/90 px-2 py-1 rounded text-[10px] font-bold text-slate-600 shadow-sm border border-slate-200"
          >
            {data.label}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
};

const nodeTypes = { custom: CustomNode };
const edgeTypes = { animated: AnimatedEdge };

export function ReferralMap() {
  const { state } = useSim();
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  const initialNodes: Node[] = [
    { id: 'citizen', type: 'custom', position: { x: 50, y: 200 }, data: { label: 'Citizen Portal', type: 'citizen', state: 'done' } },
    { id: 'core', type: 'custom', position: { x: 300, y: 200 }, data: { label: 'SUTRADHAR Core', type: 'core', state: 'processing' } },
    { id: 'dept-rev', type: 'custom', position: { x: 600, y: 50 }, data: { label: 'Revenue Dept', type: 'dept', state: 'idle', protocol: 'SOAP/XML', latency: 120 } },
    { id: 'dept-sjd', type: 'custom', position: { x: 600, y: 150 }, data: { label: 'Social Justice', type: 'dept', state: 'idle', protocol: 'REST/JSON', latency: 45 } },
    { id: 'dept-hte', type: 'custom', position: { x: 600, y: 250 }, data: { label: 'Education Dept', type: 'dept', state: 'idle', protocol: 'REST/JSON', latency: 60 } },
    { id: 'dept-try', type: 'custom', position: { x: 600, y: 350 }, data: { label: 'Treasury / DBT', type: 'dept', state: 'idle', protocol: 'REST/JSON', latency: 85 } },
    { id: 'outcome', type: 'custom', position: { x: 900, y: 200 }, data: { label: 'Service Outcome', type: 'outcome', state: 'idle' } },
  ];

  const initialEdges: Edge[] = [
    { id: 'e-cit-core', source: 'citizen', target: 'core', type: 'animated', markerEnd: { type: MarkerType.ArrowClosed }, data: { active: true, label: 'Submit Case' } },
    { id: 'e-core-rev', source: 'core', target: 'dept-rev', type: 'animated', markerEnd: { type: MarkerType.ArrowClosed } },
    { id: 'e-core-sjd', source: 'core', target: 'dept-sjd', type: 'animated', markerEnd: { type: MarkerType.ArrowClosed } },
    { id: 'e-core-hte', source: 'core', target: 'dept-hte', type: 'animated', markerEnd: { type: MarkerType.ArrowClosed } },
    { id: 'e-core-try', source: 'core', target: 'dept-try', type: 'animated', markerEnd: { type: MarkerType.ArrowClosed } },
    { id: 'e-rev-out', source: 'dept-rev', target: 'outcome', type: 'animated', markerEnd: { type: MarkerType.ArrowClosed } },
    { id: 'e-sjd-out', source: 'dept-sjd', target: 'outcome', type: 'animated', markerEnd: { type: MarkerType.ArrowClosed } },
    { id: 'e-hte-out', source: 'dept-hte', target: 'outcome', type: 'animated', markerEnd: { type: MarkerType.ArrowClosed } },
    { id: 'e-try-out', source: 'dept-try', target: 'outcome', type: 'animated', markerEnd: { type: MarkerType.ArrowClosed } },
    
    // Smart Referral Edge
    { 
      id: 'e-smart-ref', source: 'dept-hte', target: 'dept-sjd', type: 'animated', 
      markerEnd: { type: MarkerType.ArrowClosed, color: '#F28C28' },
      data: { isSmartReferral: true, active: true, label: 'Smart Referral: Caste Cert' }
    }
  ];

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Sync nodes with simulation state logic can go here (omitted for brevity)

  const onNodeClick = useCallback((_, node: Node) => {
    setSelectedNode(node);
  }, []);

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col bg-slate-50 relative rounded-xl border border-slate-200 overflow-hidden">
      <div className="absolute top-4 left-4 z-10">
        <SectionHeader 
          icon={<Network className="w-6 h-6" />} 
          title="Workflow Orchestration Map" 
          subtitle="Real-time routing & smart referrals across departments"
        />
      </div>

      <div className="absolute top-4 right-4 z-10 flex items-center gap-2 bg-white px-3 py-1.5 rounded-full shadow-sm border border-slate-200">
        <div className="w-2 h-2 rounded-full bg-verified-500 animate-pulse" />
        <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wide">Live</span>
      </div>

      <div className="absolute bottom-4 left-4 z-10 bg-white p-3 rounded-xl shadow-sm border border-slate-200">
        <h4 className="text-[10px] font-bold uppercase text-slate-500 mb-2">Node States</h4>
        <div className="flex flex-col gap-2">
          {Object.entries(NODE_COLORS).map(([key, cls]) => (
            <div key={key} className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-sm border ${cls}`} />
              <span className="text-[10px] capitalize text-slate-600">{key}</span>
            </div>
          ))}
        </div>
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        attributionPosition="bottom-right"
      >
        <Background gap={16} color="#e2e8f0" />
        <Controls />
      </ReactFlow>

      <Drawer
        open={!!selectedNode}
        onClose={() => setSelectedNode(null)}
        title={selectedNode?.data?.label || 'Node Details'}
      >
        {selectedNode && (
          <div className="space-y-4">
            <Card className="p-4">
              <h4 className="text-xs font-semibold text-slate-500 mb-3 uppercase tracking-wide">Connection Info</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-600">Protocol</span>
                  {selectedNode.data.protocol ? <ProtocolBadge protocol={selectedNode.data.protocol} /> : <span className="text-slate-400">N/A</span>}
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-600">Avg Latency</span>
                  <span className="font-mono text-slate-800">{selectedNode.data.latency ? `${selectedNode.data.latency}ms` : 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-600">Status</span>
                  <StatusChip status={selectedNode.data.state} />
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <h4 className="text-xs font-semibold text-slate-500 mb-3 uppercase tracking-wide">Recent Activity</h4>
              <div className="text-xs text-slate-600 space-y-2 font-mono bg-slate-50 p-2 rounded-lg border border-slate-100">
                <p>➔ REQUEST: /api/v1/verify</p>
                <p className="text-verified-600">← 200 OK (45ms)</p>
                <p className="pl-4">{"{"}</p>
                <p className="pl-8">"status": "valid",</p>
                <p className="pl-8">"data": "..." </p>
                <p className="pl-4">{"}"}</p>
              </div>
            </Card>
          </div>
        )}
      </Drawer>
    </div>
  );
}
