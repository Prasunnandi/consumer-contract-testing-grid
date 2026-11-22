import React, { useState } from 'react';
import { 
  FileCheck2, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Clock, 
  ArrowRight, 
  GitCommit, 
  ShieldAlert, 
  Play, 
  Terminal, 
  Filter,
  CheckCircle2,
  Sparkles,
  Layers,
  ChevronRight
} from 'lucide-react';

export default function ContractsMatrixView({ 
  contracts, 
  metrics, 
  onRunVerification, 
  onSimulateBreakingDiff,
  verifying 
}) {
  const [selectedContract, setSelectedContract] = useState(contracts[0] || null);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = contracts.filter(c => {
    const matchesStatus = filterStatus === 'ALL' || c.status === filterStatus;
    const matchesSearch = c.consumer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.endpoint.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner & KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Total Active Contracts</span>
            <FileCheck2 className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-white font-mono">{metrics?.total || contracts.length}</span>
            <span className="text-xs text-slate-400">across 7 microservices</span>
          </div>
          <div className="mt-2 text-[11px] text-cyan-400 flex items-center space-x-1">
            <span>Pact Spec v4 Compatibility</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Verified Contracts</span>
            <CheckCircle className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-emerald-400 font-mono">{metrics?.verified || 22}</span>
            <span className="text-xs text-emerald-500/80 font-medium">91.6% Pass Rate</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400">
            Provider verification green in staging
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Breaking Schema Diffs</span>
            <ShieldAlert className="w-4 h-4 text-rose-400" />
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-rose-400 font-mono">{metrics?.breakingChanges || 2}</span>
            <span className="text-xs text-rose-400/80 font-medium">Build Blocking</span>
          </div>
          <div className="mt-2 text-[11px] text-rose-400">
            Requires contract version bump or rollback
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Can-I-Deploy Evaluation</span>
            <Play className="w-4 h-4 text-purple-400" />
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className={`text-base font-bold font-mono px-2 py-0.5 rounded ${
              metrics?.breakingChanges > 0 ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-300'
            }`}>
              {metrics?.breakingChanges > 0 ? 'CONDITIONAL (2 GATED)' : 'READY FOR PROD'}
            </span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400">
            Release gate matrix synced with GitHub Actions
          </div>
        </div>
      </div>

      {/* Main Grid: Left List / Right Diff Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Contracts List & Filter */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-4">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="Filter consumer, provider, path..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-slate-950 border border-slate-800 text-xs text-slate-200 px-3 py-2 rounded-lg w-full sm:w-60 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex items-center space-x-2">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="bg-slate-950 border border-slate-800 text-xs text-slate-300 px-2.5 py-2 rounded-lg focus:outline-none focus:border-cyan-500"
                >
                  <option value="ALL">All Statuses ({contracts.length})</option>
                  <option value="PASSED">Passed Only</option>
                  <option value="BREAKING_DIFF">Breaking Diff</option>
                  <option value="PENDING">Pending Verification</option>
                </select>

                <button
                  onClick={onSimulateBreakingDiff}
                  className="px-2.5 py-2 rounded-lg bg-rose-500/15 text-rose-300 border border-rose-500/30 text-xs font-medium hover:bg-rose-500/25 transition whitespace-nowrap"
                  title="Simulate breaking field change in Provider API"
                >
                  + Inject Breaking Diff
                </button>
              </div>
            </div>

            {/* Contract Cards */}
            <div className="space-y-2.5 max-h-[580px] overflow-y-auto pr-1">
              {filtered.map((contract) => {
                const isSelected = selectedContract?.id === contract.id;
                const isPassed = contract.status === 'PASSED';
                const isBreaking = contract.status === 'BREAKING_DIFF';

                return (
                  <div
                    key={contract.id}
                    onClick={() => setSelectedContract(contract)}
                    className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-slate-800/90 border-cyan-500/60 shadow-md ring-1 ring-cyan-500/30'
                        : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-800/50 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-slate-200">{contract.consumer}</span>
                        <ArrowRight className="w-3 h-3 text-slate-400" />
                        <span className="font-semibold text-cyan-400">{contract.provider}</span>
                      </div>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center space-x-1 ${
                        isPassed 
                          ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                          : isBreaking
                          ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                          : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                      }`}>
                        {isPassed && <CheckCircle className="w-2.5 h-2.5 mr-1" />}
                        {isBreaking && <XCircle className="w-2.5 h-2.5 mr-1" />}
                        {contract.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                      <div className="flex items-center space-x-2">
                        <span className={`px-1.5 py-0.5 rounded font-bold text-[10px] ${
                          contract.method === 'GET' ? 'bg-blue-500/20 text-blue-300' :
                          contract.method === 'POST' ? 'bg-emerald-500/20 text-emerald-300' :
                          'bg-amber-500/20 text-amber-300'
                        }`}>
                          {contract.method}
                        </span>
                        <span className="text-slate-300 truncate max-w-xs">{contract.endpoint}</span>
                      </div>
                      <span className="text-slate-400 text-[10px]">{contract.latencyMs}ms</span>
                    </div>

                    <div className="mt-2 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-400">
                      <span>Pact v{contract.pactVersion} | Consumer: {contract.consumerVersion}</span>
                      <span className="flex items-center space-x-1 text-slate-400">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{new Date(contract.lastVerified).toLocaleTimeString()}</span>
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Schema Diff & Contract Specification Inspector */}
        <div className="lg:col-span-6 space-y-4">
          {selectedContract ? (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-5">
              <div className="flex items-start justify-between border-b border-slate-800 pb-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-800/60 px-2 py-0.5 rounded">
                      ID: {selectedContract.id}
                    </span>
                    <span className="text-xs text-slate-400">Spec: Pact-v4</span>
                  </div>
                  <h2 className="text-base font-bold text-white mt-1.5 flex items-center space-x-2">
                    <span>{selectedContract.consumer}</span>
                    <span className="text-slate-400 text-sm">consumes from</span>
                    <span className="text-cyan-400">{selectedContract.provider}</span>
                  </h2>
                  <p className="text-xs font-mono text-slate-400 mt-1">
                    {selectedContract.method} {selectedContract.endpoint}
                  </p>
                </div>

                <button
                  onClick={() => onRunVerification(selectedContract.id)}
                  disabled={verifying}
                  className="flex items-center space-x-1.5 px-3.5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-lg shadow-cyan-600/20 transition disabled:opacity-50"
                >
                  <Play className={`w-3.5 h-3.5 ${verifying ? 'animate-spin' : ''}`} />
                  <span>{verifying ? 'Verifying...' : 'Verify Provider'}</span>
                </button>
              </div>

              {/* Status Alert */}
              {selectedContract.status === 'BREAKING_DIFF' ? (
                <div className="p-3.5 rounded-lg bg-rose-950/40 border border-rose-800/80 text-xs text-rose-300 flex items-start space-x-3">
                  <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-rose-200">Schema Incompatibility Detected</h4>
                    <p className="mt-0.5 text-rose-300/90 leading-relaxed">
                      Provider response payload is missing required consumer fields or has an incompatible type. 
                      CI/CD Can-I-Deploy check will exit with code 1.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-3.5 rounded-lg bg-emerald-950/40 border border-emerald-800/80 text-xs text-emerald-300 flex items-start space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-emerald-200">Contract In Sync & Verified</h4>
                    <p className="mt-0.5 text-emerald-300/90 leading-relaxed">
                      Provider satisfies all {selectedContract.interactionsCount || 3} expected interactions. 
                      All required attributes matched by type and regex value rules.
                    </p>
                  </div>
                </div>
              )}

              {/* Interaction Details */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-lg">
                  <span className="text-slate-400 block text-[11px]">Provider State Precondition</span>
                  <span className="font-mono text-slate-200 mt-1 block">
                    {selectedContract.providerState || 'default-seeded-state'}
                  </span>
                </div>
                <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-lg">
                  <span className="text-slate-400 block text-[11px]">Can-I-Deploy Status</span>
                  <span className={`font-semibold mt-1 block ${
                    selectedContract.status === 'PASSED' ? 'text-emerald-400' : 'text-rose-400'
                  }`}>
                    {selectedContract.status === 'PASSED' ? 'APPROVED FOR PROD' : 'BLOCKED IN CI'}
                  </span>
                </div>
              </div>

              {/* Diff Viewer */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-300 flex items-center space-x-1.5">
                    <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Contract Response Body & Diff Viewer</span>
                  </span>
                  <span className="text-[11px] text-slate-400">JSON Schema v7</span>
                </div>

                <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
                  {/* Expected by Consumer */}
                  <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 overflow-x-auto">
                    <div className="text-[10px] text-cyan-400 uppercase font-semibold mb-2 flex items-center space-x-1">
                      <span>Expected Consumer Schema</span>
                    </div>
                    <pre className="text-slate-300 whitespace-pre-wrap leading-relaxed">
                      {JSON.stringify(selectedContract.expectedBody || {
                        id: "string",
                        status: "string (ACTIVE|SUSPENDED)",
                        balance: "number",
                        currency: "string (USD|EUR)",
                        lastUpdated: "iso8601-timestamp"
                      }, null, 2)}
                    </pre>
                  </div>

                  {/* Actual Provided by Service */}
                  <div className={`bg-slate-950 border rounded-lg p-3 overflow-x-auto ${
                    selectedContract.status === 'BREAKING_DIFF' ? 'border-rose-900/80 bg-rose-950/20' : 'border-slate-800'
                  }`}>
                    <div className="text-[10px] uppercase font-semibold mb-2 flex items-center space-x-1">
                      <span className={selectedContract.status === 'BREAKING_DIFF' ? 'text-rose-400' : 'text-emerald-400'}>
                        Actual Provider Response
                      </span>
                    </div>
                    <pre className="text-slate-300 whitespace-pre-wrap leading-relaxed">
                      {JSON.stringify(selectedContract.actualBody || {
                        id: "string",
                        status: "string (ACTIVE|SUSPENDED)",
                        balance: "number",
                        currency: "string (USD|EUR)",
                        lastUpdated: "iso8601-timestamp"
                      }, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>

              {/* Action Button Footer */}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span>Pact CLI: <code className="text-cyan-400">pact-broker can-i-deploy --pacticipant {selectedContract.consumer}</code></span>
                <span className="text-slate-400">Git commit: #{selectedContract.commitSha || 'a4f81c9'}</span>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center text-slate-400">
              Select a contract from the list to inspect schema details and execution diffs.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
