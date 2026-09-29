import React, { useState } from 'react';
import { useSim } from '../sim/store';
import { Card, SectionHeader, Progress, Badge, JsonView, Button } from '../components/ui';
import { ShieldAlert, Fingerprint, Database, Check, Merge, X, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

const XML_EXAMPLE = `<?xml version="1.0" encoding="UTF-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <GetCitizenDetailsResponse xmlns="http://revenue.mah.gov.in/">
      <Citizen>
        <AadhaarRef>XXXX-XXXX-4821</AadhaarRef>
        <FullName>Riya A. Deshmukh</FullName>
        <DOB>22-04-2005</DOB>
        <Gender>F</Gender>
        <Income>120000</Income>
        <Address>
          <District>Pune</District>
          <Taluka>Haveli</Taluka>
        </Address>
      </Citizen>
    </GetCitizenDetailsResponse>
  </soap:Body>
</soap:Envelope>`;

const JSON_EXAMPLE = {
  sutradharId: 'SUT-ID-7728-XXXX',
  canonicalName: 'Riya Deshmukh',
  dob: '2005-04-22',
  gender: 'F',
  identifiers: [
    { type: 'aadhaar', value: 'XXXX-XXXX-4821' },
    { type: 'student_id', value: 'HTE-24-XXXX89' }
  ],
  verifiedFacts: [
    { key: 'annual_income', value: 120000, source: 'dept-rev' }
  ]
};

export default function IdentityMapping() {
  const { state } = useSim();
  const identityMap = state.identityMaps[0];
  const [activeTab, setActiveTab] = useState<'mapping' | 'schema'>('mapping');

  if (!identityMap) {
    return <div className="p-8 text-center text-slate-500">No identity records found.</div>;
  }

  return (
    <div className="p-8 h-full overflow-y-auto bg-slate-50">
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-black text-navy-900">Identity Mapping & Data Quality</h1>
          <p className="text-slate-500 text-sm mt-1">Cross-departmental deduplication and schema normalization.</p>
        </div>

        {/* Top KPI row */}
        <div className="grid grid-cols-4 gap-4">
          <Card className="p-4 bg-white border-l-4 border-l-navy-500">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Canonical ID</p>
                <p className="text-xl font-bold text-navy-800">{identityMap.sutradharId}</p>
              </div>
              <Fingerprint className="text-navy-300 w-6 h-6" />
            </div>
            <p className="text-[10px] text-slate-400 mt-2">Primary Golden Record</p>
          </Card>

          <Card className="p-4 bg-white border-l-4 border-l-verified-500">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Match Confidence</p>
                <p className="text-xl font-bold text-navy-800">{(identityMap.confidence * 100).toFixed(1)}%</p>
              </div>
              <Activity className="text-verified-300 w-6 h-6" />
            </div>
            <div className="mt-2">
              <Progress value={identityMap.confidence * 100} className="h-1.5" />
            </div>
          </Card>
          
          <Card className="p-4 bg-white border-l-4 border-l-saffron-500">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Active Links</p>
                <p className="text-xl font-bold text-navy-800">{identityMap.identifiers.length}</p>
              </div>
              <Database className="text-saffron-300 w-6 h-6" />
            </div>
            <p className="text-[10px] text-slate-400 mt-2">Across {state.departments.length} departments</p>
          </Card>

          <Card className="p-4 bg-white border-l-4 border-l-amber-500">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Known Conflicts</p>
                <p className="text-xl font-bold text-navy-800">{identityMap.conflicts.length || 2}</p>
              </div>
              <ShieldAlert className="text-amber-300 w-6 h-6" />
            </div>
            <p className="text-[10px] text-slate-400 mt-2">Requires resolution</p>
          </Card>
        </div>

        {/* Tab Selection */}
        <div className="flex gap-2 border-b border-slate-200">
          <button
            onClick={() => setActiveTab('mapping')}
            className={\`px-4 py-2 text-sm font-semibold border-b-2 transition-colors \${activeTab === 'mapping' ? 'border-navy-600 text-navy-800' : 'border-transparent text-slate-500 hover:text-navy-600'}\`}
          >
            Identity Map
          </button>
          <button
            onClick={() => setActiveTab('schema')}
            className={\`px-4 py-2 text-sm font-semibold border-b-2 transition-colors \${activeTab === 'schema' ? 'border-navy-600 text-navy-800' : 'border-transparent text-slate-500 hover:text-navy-600'}\`}
          >
            Schema Normalization
          </button>
        </div>

        {activeTab === 'mapping' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-3 gap-6">
            <div className="col-span-2 space-y-4">
              <Card className="p-5">
                <SectionHeader title="Cross-Department Linking" subtitle="How identifiers map to the SUTRADHAR ID" />
                <div className="space-y-4 relative mt-6">
                  {/* The Golden Record Center */}
                  <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-slate-200" />
                  
                  {identityMap.identifiers.map((ident, i) => {
                    const dept = state.departments.find(d => d.id === ident.deptId);
                    return (
                      <div key={ident.deptId} className="relative flex items-center pl-12 gap-4">
                        <div className="absolute left-[21px] w-4 h-0.5 bg-slate-200" />
                        <div className="absolute left-[19px] w-2 h-2 rounded-full bg-navy-500 shadow ring-4 ring-white" />
                        
                        <div className="flex-1 border border-slate-100 bg-white rounded-xl p-3 shadow-sm flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 font-bold text-xs border border-slate-100">
                              {dept?.name ? dept.name.charAt(0) : '?'}
                            </div>
                            <div>
                              <p className="text-xs font-bold text-navy-800">{dept?.name || 'Unknown Department'}</p>
                              <p className="text-[10px] text-slate-500">{ident.idLabel}: {ident.maskedValue}</p>
                            </div>
                          </div>
                          <Badge variant="verified">Linked</Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </div>

            <div className="col-span-1 space-y-4">
              <Card className="p-5 border-amber-200 bg-amber-50/30">
                <SectionHeader title="Conflict Resolution" subtitle="Fuzzy match differences" icon={<ShieldAlert className="text-amber-500 w-5 h-5" />} />
                
                <div className="space-y-4 mt-4">
                  <div className="bg-white border border-amber-100 rounded-lg p-3">
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-xs font-bold text-navy-800">Name Spelling Mismatch</span>
                      <Badge variant="warning">94% Match</Badge>
                    </div>
                    <div className="text-[10px] space-y-1 mb-3">
                      <div className="flex justify-between"><span className="text-slate-500">Revenue:</span> <span className="font-mono text-red-600 bg-red-50 px-1 rounded">Riya A. Deshmukh</span></div>
                      <div className="flex justify-between"><span className="text-slate-500">SUTRADHAR:</span> <span className="font-mono text-verified-600 bg-verified-50 px-1 rounded">Riya Deshmukh</span></div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="secondary" className="w-full text-[10px] h-7"><Merge className="w-3 h-3 mr-1" /> Merge Alias</Button>
                      <Button size="sm" variant="ghost" className="w-full text-[10px] h-7 text-red-600"><X className="w-3 h-3 mr-1" /> Reject</Button>
                    </div>
                  </div>

                  <div className="bg-white border border-amber-100 rounded-lg p-3">
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-xs font-bold text-navy-800">DOB Format Mismatch</span>
                      <Badge variant="warning">Auto-Fixed</Badge>
                    </div>
                    <div className="text-[10px] space-y-1">
                      <div className="flex justify-between"><span className="text-slate-500">Revenue:</span> <span className="font-mono line-through text-slate-400">22-04-2005</span></div>
                      <div className="flex justify-between"><span className="text-slate-500">SUTRADHAR:</span> <span className="font-mono text-verified-600 bg-verified-50 px-1 rounded">2005-04-22</span></div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </motion.div>
        )}

        {activeTab === 'schema' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-2 gap-4">
            <Card className="flex flex-col h-[500px]">
              <div className="p-3 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-bold text-slate-700">Legacy Response (SOAP/XML)</h3>
                  <p className="text-[10px] text-slate-500">From Revenue Department Adapter</p>
                </div>
                <Badge variant="soap">Raw Payload</Badge>
              </div>
              <div className="flex-1 p-4 bg-slate-900 overflow-auto rounded-b-xl">
                <pre className="text-[11px] font-mono leading-relaxed text-blue-300">
                  {XML_EXAMPLE.split('\n').map((line, i) => (
                    <div key={i}>
                      <span className="text-slate-600 select-none mr-4">{String(i + 1).padStart(2, ' ')}</span>
                      {line}
                    </div>
                  ))}
                </pre>
              </div>
            </Card>

            <Card className="flex flex-col h-[500px]">
              <div className="p-3 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-bold text-slate-700">SUTRADHAR Canonical (REST/JSON)</h3>
                  <p className="text-[10px] text-slate-500">Normalized by Data Engine</p>
                </div>
                <Badge variant="rest">Schema Validated</Badge>
              </div>
              <div className="flex-1 p-4 bg-white overflow-auto rounded-b-xl border-t border-slate-100">
                <JsonView data={JSON_EXAMPLE} />
                
                <div className="mt-8 pt-4 border-t border-slate-100">
                  <h4 className="text-xs font-bold text-navy-800 mb-2">Transformations Applied:</h4>
                  <ul className="text-[11px] text-slate-600 space-y-1.5 list-disc pl-4">
                    <li>Extracted <code className="bg-slate-100 px-1 rounded">AadhaarRef</code> as primary identifier</li>
                    <li>Normalized <code className="bg-slate-100 px-1 rounded">DOB</code> from DD-MM-YYYY to ISO 8601</li>
                    <li>Mapped <code className="bg-slate-100 px-1 rounded">Income</code> to <code className="bg-slate-100 px-1 rounded">annual_income</code> verified fact</li>
                    <li>Discarded unrequested <code className="bg-slate-100 px-1 rounded">Address</code> fields (Data Minimization)</li>
                  </ul>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
