// Consumer Contract Testing API Service

const API_BASE = 'http://localhost:5011';

export const fallbackContracts = [
  {
    contractId: "CDC-PACT-01",
    consumerService: "Web_Checkout_SPA",
    producerService: "Payments_API_v3",
    endpointPath: "/api/v3/charges",
    httpMethod: "POST",
    contractVersion: "v3.4.1",
    pactHash: "a591a6d40bf420404a011733cfb7b190",
    breakingChangeDetected: false,
    schemaDriftStatus: "ZERO_DRIFT",
    piiMaskingApplied: true,
    verificationStatus: "VERIFIED_PASS",
    lastVerifiedAt: "2026-03-29T10:15:00Z",
    schemaPayload: {
      request: { amountCents: 14500, currency: "USD", sourceToken: "tok_visa_4242" },
      response: { chargeId: "ch_3Nk19028a", status: "succeeded", captured: true }
    }
  },
  {
    contractId: "CDC-PACT-02",
    consumerService: "Mobile_iOS_App",
    producerService: "Order_Service",
    endpointPath: "/api/v1/orders/{orderId}",
    httpMethod: "GET",
    contractVersion: "v1.8.0",
    pactHash: "bf5258f3be7d5bb2f01f4ab98064bf63",
    breakingChangeDetected: false,
    schemaDriftStatus: "ZERO_DRIFT",
    piiMaskingApplied: true,
    verificationStatus: "VERIFIED_PASS",
    lastVerifiedAt: "2026-03-29T11:20:00Z",
    schemaPayload: {
      response: { orderId: "ord_8829104", trackingNumber: "1Z9999999999999999", itemCount: 3 }
    }
  },
  {
    contractId: "CDC-PACT-03",
    consumerService: "Partner_Webhook_Worker",
    producerService: "Inventory_Catalog",
    endpointPath: "/api/v2/products/sku/{sku}",
    httpMethod: "GET",
    contractVersion: "v2.1.0",
    pactHash: "7d793037a0760186574b0282f2f435e7",
    breakingChangeDetected: true,
    schemaDriftStatus: "FIELD_TYPE_MUTATION",
    piiMaskingApplied: false,
    verificationStatus: "BREAKING_CHANGE_BLOCKED",
    lastVerifiedAt: "2026-03-29T13:45:00Z",
    schemaPayload: {
      driftAlert: "Producer mutated 'inventoryCount' from Integer (42) to String ('42 in stock'). This invalidates consumer numeric parsing.",
      response: { sku: "SKU-99218", inventoryCount: "42 in stock" }
    }
  },
  {
    contractId: "CDC-PACT-05",
    consumerService: "Analytics_Data_Ingestor",
    producerService: "Telemetry_Gateway",
    endpointPath: "/api/v1/events/batch",
    httpMethod: "POST",
    contractVersion: "v2.0.0",
    pactHash: "f2ca1bb6c7e907d06dafe4687e579fce",
    breakingChangeDetected: true,
    schemaDriftStatus: "REMOVED_REQUIRED_FIELD",
    piiMaskingApplied: false,
    verificationStatus: "BREAKING_CHANGE_BLOCKED",
    lastVerifiedAt: "2026-03-29T14:10:00Z",
    schemaPayload: {
      driftAlert: "Required field 'anonymousId' was removed from root payload schema.",
      request: { events: [{ type: "pageview", url: "/pricing" }] }
    }
  }
];

export async function fetchContracts() {
  try {
    const res = await fetch(`${API_BASE}/api/v1/contracts`);
    if (!res.ok) throw new Error('Network error');
    return await res.json();
  } catch (e) {
    return fallbackContracts;
  }
}

export async function fetchStats() {
  try {
    const res = await fetch(`${API_BASE}/api/v1/contracts/stats`);
    if (!res.ok) throw new Error('Network error');
    return await res.json();
  } catch (e) {
    return {
      totalContracts: 6,
      verifiedPassing: 4,
      breakingChangesBlocked: 2,
      activeConsumers: 5,
      activeProducers: 4,
      piiMaskingCoveragePct: 100.0
    };
  }
}

export async function verifyContract(data) {
  try {
    const res = await fetch(`${API_BASE}/api/v1/contracts/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Verify error');
    return await res.json();
  } catch (e) {
    return {
      contractId: `CDC-PACT-${Math.floor(10 + Math.random() * 90)}`,
      consumerService: data.consumerService || "Portal_Web",
      producerService: data.producerService || "Core_API",
      endpointPath: data.endpointPath || "/api/v1/orders",
      httpMethod: data.httpMethod || "POST",
      contractVersion: "v1.0.0",
      pactHash: "2c26b46b68ffc68ff99b453c1d304134",
      breakingChangeDetected: Boolean(data.willBreak),
      schemaDriftStatus: data.willBreak ? "BREAKING_FIELD_TYPE" : "ZERO_DRIFT",
      piiMaskingApplied: true,
      verificationStatus: data.willBreak ? "BREAKING_CHANGE_BLOCKED" : "VERIFIED_PASS",
      lastVerifiedAt: new Date().toISOString()
    };
  }
}

export async function generateSyntheticFixtures(count = 5) {
  try {
    const res = await fetch(`${API_BASE}/api/v1/contracts/generate-fixtures`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ count, entityType: "Customer_Profile" })
    });
    if (!res.ok) throw new Error('Fixture error');
    return await res.json();
  } catch (e) {
    return {
      fixtures: [
        { fixtureId: "FIX-1001", entity: "Customer_Profile", fullName: "User_e891ab", emailMasked: "usr_1****@masked.internal", creditCardSynthetic: "4242-****-****-1001", balanceUsd: 1420.50 },
        { fixtureId: "FIX-1002", entity: "Customer_Profile", fullName: "User_c729de", emailMasked: "usr_2****@masked.internal", creditCardSynthetic: "4242-****-****-1002", balanceUsd: 2890.00 }
      ]
    };
  }
}


export const api = {
  getContracts: fetchContracts,
  verifyContract: verifyContractProvider,
  generateFixtures: generateSyntheticFixtures
};
