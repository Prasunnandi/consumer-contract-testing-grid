import React, { useState } from 'react';
import { 
  Code2, 
  Terminal, 
  Copy, 
  Check, 
  Sparkles, 
  Zap, 
  Server, 
  Layers, 
  ShieldCheck,
  RefreshCw,
  Play
} from 'lucide-react';

export default function SyntheticFixturesView({ contracts }) {
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [selectedService, setSelectedService] = useState('PaymentGateway');
  const [fixtureType, setFixtureType] = useState('happy-path');
  const [generatedPayload, setGeneratedPayload] = useState(null);

  const mockServers = [
    { service: 'PaymentGateway', port: 9001, status: 'RUNNING', endpoint: '/api/v1/charge', specMatches: 4 },
    { service: 'OrderService', port: 9002, status: 'RUNNING', endpoint: '/api/v2/orders', specMatches: 6 },
    { service: 'CustomerProfile', port: 9003, status: 'RUNNING', endpoint: '/api/v1/users/:id', specMatches: 5 },
    { service: 'InventoryRegistry', port: 9004, status: 'RUNNING', endpoint: '/api/v1/stock/reserve', specMatches: 3 },
  ];

  const sampleFixtures = {
    PaymentGateway: {
      'happy-path': {
        transactionId: "tx_998341904a",
        amountCents: 14500,
        currency: "USD",
        status: "SETTLED",
        paymentMethod: {
          type: "CREDIT_CARD",
          lastFour: "4242",
          brand: "VISA"
        },
        riskScore: 0.04,
        idempotencyKey: "idem_91048821",
        createdAt: "2026-11-22T14:20:00Z"
      },
      'declined': {
        transactionId: "tx_88120349b",
        amountCents: 98000,
        currency: "USD",
        status: "DECLINED",
        declineCode: "INSUFFICIENT_FUNDS",
        retryable: false,
        createdAt: "2026-11-22T14:21:15Z"
      }
    },
    OrderService: {
      'happy-path': {
        orderId: "ord_live_88412",
        customerId: "cust_33190",
        items: [
          { sku: "SKU-PRO-44", qty: 2, unitPriceCents: 4500 }
        ],
        subtotalCents: 9000,
        taxCents: 720,
        shippingStatus: "AWAITING_FULFILLMENT",
        placedAt: "2026-11-22T14:15:32Z"
      }
    }
  };

  const handleCopy = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const activeData = sampleFixtures[selectedService]?.[fixtureType] || sampleFixtures.PaymentGateway['happy-path'];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center space-x-2">
            <Code2 className="w-5 h-5 text-cyan-400" />
            <span>Synthetic Mock Servers & Fixtures</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Zero-dependency mock endpoints derived strictly from verified Pact contracts.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs text-slate-400">Spec Engine:</span>
          <span className="text-xs font-mono bg-cyan-950/80 text-cyan-300 border border-cyan-800/60 px-2.5 py-1 rounded-lg">
            Pact Mock Server v4
          </span>
        </div>
      </div>

      {/* Mock Server Registry */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {mockServers.map((server, idx) => (
          <div key={idx} className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-semibold text-slate-200">{server.service}</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>:{server.port}</span>
              </span>
            </div>
            <p className="text-[11px] font-mono text-cyan-400 truncate">{server.endpoint}</p>
            <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
              <span>{server.specMatches} verified pacts</span>
              <span className="text-emerald-400 font-semibold">{server.status}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Fixture Playground */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Synthetic Contract Generator</span>
            </h3>

            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1.5 font-medium">Target Provider Service</label>
                <select
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-200 px-3 py-2.5 rounded-lg focus:outline-none focus:border-cyan-500"
                >
                  <option value="PaymentGateway">PaymentGateway (/api/v1/charge)</option>
                  <option value="OrderService">OrderService (/api/v2/orders)</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1.5 font-medium">Interaction Scenario</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setFixtureType('happy-path')}
                    className={`px-3 py-2 rounded-lg text-xs font-semibold border transition ${
                      fixtureType === 'happy-path'
                        ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/40 shadow-sm'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                    }`}
                  >
                    200 OK (Settled)
                  </button>
                  <button
                    onClick={() => setFixtureType('declined')}
                    className={`px-3 py-2 rounded-lg text-xs font-semibold border transition ${
                      fixtureType === 'declined'
                        ? 'bg-rose-500/15 text-rose-300 border-rose-500/40 shadow-sm'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                    }`}
                  >
                    402 Declined
                  </button>
                </div>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-950/80 border border-slate-800 text-xs text-slate-400 space-y-1.5">
                <span className="font-semibold text-slate-300 block">Deterministic Stubbing:</span>
                <p className="text-[11px] leading-relaxed">
                  Generated payloads strictly conform to regex matchers (e.g., UUID format, RFC 3339 timestamps) verified by the provider pact test suite.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Payload Preview and Curl Generator */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300 flex items-center space-x-1.5">
                <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                <span>Deterministic Mock Payload (JSON)</span>
              </span>
              <button
                onClick={() => handleCopy(JSON.stringify(activeData, null, 2), 1)}
                className="flex items-center space-x-1 text-xs text-cyan-400 hover:text-cyan-300 font-medium"
              >
                {copiedIndex === 1 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedIndex === 1 ? 'Copied!' : 'Copy JSON'}</span>
              </button>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 font-mono text-xs overflow-x-auto max-h-80">
              <pre className="text-cyan-300 leading-relaxed">
                {JSON.stringify(activeData, null, 2)}
              </pre>
            </div>

            <div className="space-y-2">
              <span className="text-[11px] font-semibold text-slate-400">Integration Curl Snippet</span>
              <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 font-mono text-xs text-slate-300 flex items-center justify-between">
                <code className="text-cyan-400 truncate mr-2">
                  curl -X POST http://localhost:9001/api/v1/charge -H "Content-Type: application/json" -d '{`{"orderId":"ord_8841"}`}'
                </code>
                <button
                  onClick={() => handleCopy(`curl -X POST http://localhost:9001/api/v1/charge -H "Content-Type: application/json" -d '{"orderId":"ord_8841"}'`, 2)}
                  className="shrink-0 text-slate-400 hover:text-white"
                >
                  {copiedIndex === 2 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
