export const initialContracts = [
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
      request: {
        amountCents: 14500,
        currency: "USD",
        sourceToken: "tok_visa_4242",
        customerId: "cust_99214a"
      },
      response: {
        chargeId: "ch_3Nk19028a",
        status: "succeeded",
        captured: true,
        riskScore: 12
      }
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
      response: {
        orderId: "ord_8829104",
        trackingNumber: "1Z9999999999999999",
        deliveryEstimate: "2026-04-02T18:00:00Z",
        itemCount: 3
      }
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
      driftAlert: "Producer changed 'inventoryCount' from Integer (42) to String ('42 in stock'). This invalidates consumer numeric parsing.",
      response: {
        sku: "SKU-99218",
        inventoryCount: "42 in stock"
      }
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
      driftAlert: "Required field 'anonymousId' was removed from event root schema. Upstream telemetry aggregation halted.",
      request: {
        events: [{ type: "pageview", url: "/pricing" }]
      }
    }
  }
];

export const initialGridStats = {
  totalContracts: 6,
  verifiedPassing: 4,
  breakingChangesBlocked: 2,
  activeConsumers: 5,
  activeProducers: 4,
  piiMaskingCoveragePct: 100.0
};
