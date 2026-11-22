import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import crypto from 'crypto';
import { initialContracts, initialGridStats } from './data.js';

const app = express();
const PORT = process.env.PORT || 5011;

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

let contracts = [...initialContracts];
let stats = { ...initialGridStats };

// Health
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'Consumer-Driven Contract Testing & Synthetic Test Grid',
    engine: 'Pact.io Specification v4',
    version: '1.0.0'
  });
});

// Stats
app.get('/api/v1/contracts/stats', (req, res) => {
  res.json(stats);
});

// List contracts
app.get('/api/v1/contracts', (req, res) => {
  res.json(contracts);
});

// Verify contract / trigger new contract
app.post('/api/v1/contracts/verify', (req, res) => {
  const { consumerService, producerService, endpointPath, httpMethod, willBreak } = req.body;
  const id = `CDC-PACT-${Math.floor(10 + Math.random() * 90)}`;
  const isBreaking = Boolean(willBreak);

  const newContract = {
    contractId: id,
    consumerService: consumerService || "Frontend_Portal",
    producerService: producerService || "Backend_API",
    endpointPath: endpointPath || "/api/v1/resource",
    httpMethod: httpMethod || "GET",
    contractVersion: "v1.0.0",
    pactHash: crypto.randomBytes(16).toString('hex'),
    breakingChangeDetected: isBreaking,
    schemaDriftStatus: isBreaking ? "BREAKING_NULL_MUTATION" : "ZERO_DRIFT",
    piiMaskingApplied: true,
    verificationStatus: isBreaking ? "BREAKING_CHANGE_BLOCKED" : "VERIFIED_PASS",
    lastVerifiedAt: new Date().toISOString(),
    schemaPayload: {
      request: { query: "synthetic_param" },
      response: { id: "res_1001", success: true }
    }
  };

  contracts.unshift(newContract);
  stats.totalContracts += 1;
  if (isBreaking) {
    stats.breakingChangesBlocked += 1;
  } else {
    stats.verifiedPassing += 1;
  }

  res.status(201).json(newContract);
});

// Generate synthetic PII-masked fixture
app.post('/api/v1/contracts/generate-fixtures', (req, res) => {
  const { count, entityType } = req.body;
  const num = parseInt(count) || 5;
  const fixtures = [];

  for (let i = 1; i <= num; i++) {
    fixtures.push({
      fixtureId: `FIX-${1000 + i}`,
      entity: entityType || "Customer_Profile",
      fullName: `User_${crypto.randomBytes(3).toString('hex')}`,
      emailMasked: `usr_${i}****@masked-domain.internal`,
      creditCardSynthetic: `4242-****-****-${1000 + i}`,
      taxIdentifierHash: crypto.createHash('sha256').update(`SSN-${i}`).digest('hex').slice(0, 16),
      accountStatus: "ACTIVE",
      balanceUsd: parseFloat((Math.random() * 5000).toFixed(2))
    });
  }

  res.json({
    message: `Generated ${num} PII-masked synthetic test fixtures conforming to OpenAPI schema.`,
    fixtures
  });
});

app.listen(PORT, () => {
  console.log(`Contract Testing backend listening on port http://localhost:${PORT}`);
});
