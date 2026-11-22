import React from 'react';
import { 
  Network, 
  Layers, 
  FileCheck2, 
  GitCompare, 
  AlertOctagon, 
  CheckCircle2, 
  ExternalLink,
  ShieldCheck,
  Code2
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab }) {
  const menuItems = [
    { id: 'matrix', label: 'Contract Matrix & Diff', icon: Network, badge: 'Live Grid' },
    { id: 'fixtures', label: 'Synthetic Fixtures & Mocks', icon: Code2, badge: 'Pact v4' },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between shrink-0">
      <div>
        <div className="p-6 border-b border-slate-800 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
            <Network className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-slate-100 text-sm tracking-wide">ContractGrid</h1>
            <p className="text-xs text-cyan-400 font-medium">Consumer-Driven Pact</p>
          </div>
        </div>

        <nav className="p-4 space-y-1.5">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-3 mb-2">
            Verification Engine
          </div>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                    isActive ? 'bg-cyan-500/20 text-cyan-300' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="p-4 mx-3 mt-4 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs">
          <div className="flex items-center justify-between text-slate-300 mb-2 font-medium">
            <span className="flex items-center space-x-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>CI/CD Deploy Gate</span>
            </span>
            <span className="text-emerald-400 text-[10px] font-semibold">CAN-I-DEPLOY: PASS</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Provider verification runs on commit. Breaking API changes trigger immediate build-block warnings.
          </p>
        </div>
      </div>

      <div className="p-4 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
        <div>
          <p className="text-slate-300 font-semibold text-[11px]">Pact Broker v4.2</p>
          <p className="text-[10px] text-slate-400">Specification Compliant</p>
        </div>
        <a 
          href="https://github.com/Prasunnandi/consumer-contract-testing-grid" 
          target="_blank" 
          rel="noreferrer" 
          className="text-cyan-400 hover:text-cyan-300 p-1.5 hover:bg-slate-800 rounded"
        >
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </aside>
  );
}
