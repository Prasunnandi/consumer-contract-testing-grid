import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import ContractsMatrixView from './pages/ContractsMatrixView';
import SyntheticFixturesView from './pages/SyntheticFixturesView';

const INITIAL_CONTRACTS = [
  {
    id: "pact_checkout_payment_01",
    consumer: "CheckoutFrontend",
    provider: "PaymentGateway",
    endpoint: "/api/v1/charge",
    method: "POST",
    pactVersion: "4.0",
    consumerVersion: "2.14.0",
    providerVersion: "3.2.1",
    status: "PASSED",
    latencyMs: 84,
    interactionsCount: 3,
    providerState: "account has available balance",
    commitSha: "f8a920b",
    lastVerified: "2026-11-22T14:10:00Z",
    expectedBody: {
      transactionId: "string (uuid)",
      amount: "number",
      currency: "string (USD|EUR)",
      status: "SETTLED",
      authCode: "string"
    },
    actualBody: {
      transactionId: "d9f8e4a1-8930-4b33",
      amount: 4500,
      currency: "USD",
      status: "SETTLED",
      authCode: "AUTH_883921"
    }
  },
  {
    id: "pact_orders_inventory_02",
    consumer: "OrderService",
    provider: "InventoryRegistry",
    endpoint: "/api/v1/stock/reserve",
    method: "POST",
    pactVersion: "4.0",
    consumerVersion: "1.8.2",
    providerVersion: "2.0.0-rc1",
    status: "BREAKING_DIFF",
    latencyMs: 142,
    interactionsCount: 2,
    providerState: "warehouse item exists",
    commitSha: "b319f0a",
    lastVerified: "2026-11-22T14:18:22Z",
    expectedBody: {
      reservationId: "string (uuid)",
      reservedUnits: "integer",
      expiresAt: "iso8601-timestamp",
      warehouseCode: "string"
    },
    actualBody: {
      resId: "string (RENAMED_FIELD_DIFF)",
      units: 10,
      expires_epoch: 1763821000
    }
  },
  {
    id: "pact_mobile_customer_03",
    consumer: "MobileApp-iOS",
    provider: "CustomerProfile",
    endpoint: "/api/v1/users/me",
    method: "GET",
    pactVersion: "4.0",
    consumerVersion: "4.5.1",
    providerVersion: "1.12.0",
    status: "PASSED",
    latencyMs: 46,
    interactionsCount: 4,
    providerState: "user profile is verified",
    commitSha: "c771da2",
    lastVerified: "2026-11-22T14:05:00Z",
    expectedBody: {
      userId: "string",
      email: "string (email)",
      tier: "string (GOLD|PLATINUM)",
      loyaltyPoints: "integer"
    },
    actualBody: {
      userId: "usr_99182",
      email: "alex.chen@enterprise.io",
      tier: "PLATINUM",
      loyaltyPoints: 12500
    }
  },
  {
    id: "pact_analytics_orders_04",
    consumer: "DataWarehouseIngest",
    provider: "OrderService",
    endpoint: "/api/v2/orders/events",
    method: "GET",
    pactVersion: "4.0",
    consumerVersion: "3.0.1",
    providerVersion: "2.4.0",
    status: "PASSED",
    latencyMs: 95,
    interactionsCount: 5,
    providerState: "orders batch streaming",
    commitSha: "e441bc8",
    lastVerified: "2026-11-22T13:50:00Z",
    expectedBody: {
      eventId: "string",
      orderId: "string",
      eventType: "ORDER_CREATED",
      grossAmountCents: "number"
    },
    actualBody: {
      eventId: "evt_991204",
      orderId: "ord_5521",
      eventType: "ORDER_CREATED",
      grossAmountCents: 8900
    }
  },
  {
    id: "pact_checkout_notification_05",
    consumer: "CheckoutFrontend",
    provider: "NotificationService",
    endpoint: "/api/v1/notifications/receipt",
    method: "POST",
    pactVersion: "4.0",
    consumerVersion: "2.14.0",
    providerVersion: "1.4.0",
    status: "PASSED",
    latencyMs: 62,
    interactionsCount: 2,
    providerState: "customer notification preferences enabled",
    commitSha: "7b89ee1",
    lastVerified: "2026-11-22T13:42:00Z",
    expectedBody: {
      messageId: "string",
      deliveryChannel: "EMAIL",
      dispatched: "boolean"
    },
    actualBody: {
      messageId: "msg_448190",
      deliveryChannel: "EMAIL",
      dispatched: true
    }
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('matrix');
  const [contracts, setContracts] = useState(INITIAL_CONTRACTS);
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  const handleRunVerification = (contractId) => {
    setVerifying(true);
    setTimeout(() => {
      setContracts(prev => prev.map(c => {
        if (c.id === contractId) {
          return {
            ...c,
            status: 'PASSED',
            lastVerified: new Date().toISOString(),
            actualBody: c.expectedBody
          };
        }
        return c;
      }));
      setVerifying(false);
    }, 600);
  };

  const handleSimulateBreakingDiff = () => {
    setContracts(prev => [
      {
        id: `pact_diff_${Date.now().toString().slice(-4)}`,
        consumer: "InventorySyncWorker",
        provider: "WarehouseIQ",
        endpoint: "/api/v3/bins/allocation",
        method: "PUT",
        pactVersion: "4.0",
        consumerVersion: "1.2.0",
        providerVersion: "2.5.0-alpha",
        status: "BREAKING_DIFF",
        latencyMs: 112,
        interactionsCount: 1,
        providerState: "pallet assigned to bin",
        commitSha: "8fa001d",
        lastVerified: new Date().toISOString(),
        expectedBody: {
          palletId: "string",
          binCoordinates: "string (A-12-04)",
          weightKg: "number"
        },
        actualBody: {
          pallet_code: "RENAMED_FIELD_DIFF",
          coordinates: "UNMATCHED_KEY"
        }
      },
      ...prev
    ]);
  };

  const metrics = {
    total: contracts.length,
    verified: contracts.filter(c => c.status === 'PASSED').length,
    breakingChanges: contracts.filter(c => c.status === 'BREAKING_DIFF').length,
    uniqueServices: 7
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar 
          onRefresh={handleRefresh} 
          loading={loading} 
          metrics={metrics} 
        />

        <main className="flex-1 overflow-y-auto p-6">
          {activeTab === 'matrix' ? (
            <ContractsMatrixView 
              contracts={contracts}
              metrics={metrics}
              onRunVerification={handleRunVerification}
              onSimulateBreakingDiff={handleSimulateBreakingDiff}
              verifying={verifying}
            />
          ) : (
            <SyntheticFixturesView contracts={contracts} />
          )}
        </main>
      </div>
    </div>
  );
}
