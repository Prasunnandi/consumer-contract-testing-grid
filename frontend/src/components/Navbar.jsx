import React from 'react';
import { 
  Network, 
  Search, 
  GitBranch, 
  RefreshCw, 
  CheckCircle, 
  ShieldAlert,
  Server,
  Terminal
} from 'lucide-react';

export default function Navbar({ onRefresh, loading, metrics }) {
  return (
    <header className="h-16 bg-slate-900 border-b border-slate-800 px-6 flex items-center justify-between shrink-0">
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2 text-xs text-slate-400">
          <GitBranch className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-slate-300 font-mono">env: staging-k8s</span>
          <span className="text-slate-600">|</span>
          <span className="text-emerald-400 flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Broker Online</span>
          </span>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {metrics && (
          <div className="hidden lg:flex items-center space-x-4 px-3 py-1.5 rounded-lg bg-slate-950/60 border border-slate-800 text-xs">
            <div className="flex items-center space-x-1.5 text-slate-300">
              <Server className="w-3.5 h-3.5 text-cyan-400" />
              <span>Services:</span>
              <span className="font-semibold text-white">{metrics.uniqueServices || 7}</span>
            </div>
            <div className="w-px h-3 bg-slate-700" />
            <div className="flex items-center space-x-1.5 text-slate-300">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>Verified:</span>
              <span className="font-semibold text-emerald-400">{metrics.verified || 22}</span>
            </div>
            <div className="w-px h-3 bg-slate-700" />
            <div className="flex items-center space-x-1.5 text-slate-300">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
              <span>Breaking Diffs:</span>
              <span className="font-semibold text-rose-400">{metrics.breakingChanges || 2}</span>
            </div>
          </div>
        )}

        <button
          onClick={onRefresh}
          disabled={loading}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
          <span>Sync Matrix</span>
        </button>

        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-white font-bold text-xs ring-2 ring-cyan-500/30">
          QA
        </div>
      </div>
    </header>
  );
}
