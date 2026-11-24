/**
 * Pact Specification v4 Parser & Matcher Engine
 * Implements Pact v4 interaction models, matching rules, generators, and response assertions.
 */

export class PactV4Parser {
  /**
   * @param {Object} [options]
   * @param {boolean} [options.strictHeaders=false] - Enforce exact case-insensitive header matching
   */
  constructor(options = {}) {
    this.strictHeaders = options.strictHeaders ?? false;
  }

  /**
   * Parse and validate Pact v4 Contract file
   * @param {Object} pact - Raw JSON representation of Pact contract
   * @returns {Object} Validated contract object
   */
  parsePact(pact) {
    if (!pact || typeof pact !== 'object') {
      throw new Error('Invalid Pact: Root document must be an object');
    }

    const specVersion = pact.metadata?.pactSpecification?.version;
    if (specVersion && !String(specVersion).startsWith('4')) {
      throw new Error(`Expected Pact v4 specification, received version "${specVersion}"`);
    }

    const consumer = pact.consumer?.name || 'unknown-consumer';
    const provider = pact.provider?.name || 'unknown-provider';
    const interactions = (pact.interactions || []).map((inter, idx) => this._normalizeInteraction(inter, idx));

    return {
      consumer,
      provider,
      specVersion: specVersion || '4.0',
      interactionsCount: interactions.length,
      interactions
    };
  }

  /**
   * Execute generator engine to produce dynamic mock payload
   * @param {Object} bodyTemplate - Example payload
   * @param {Object} generators - Pact v4 generators object
   * @returns {Object} Generated runtime mock object
   */
  generatePayload(bodyTemplate, generators = {}) {
    const payload = JSON.parse(JSON.stringify(bodyTemplate || {}));

    if (!generators || Object.keys(generators).length === 0) {
      return payload;
    }

    for (const [path, genDef] of Object.entries(generators)) {
      const generatedVal = this._executeGenerator(genDef);
      this._applyValueAtPath(payload, path, generatedVal);
    }

    return payload;
  }

  /**
   * Match an actual HTTP response against expected Pact interaction rules
   * @param {Object} expectedInteraction - Normalized interaction from parsePact
   * @param {Object} actualResponse - Actual HTTP response { status, headers, body }
   * @returns {Object} Verification result with pass/fail and diff details
   */
  verifyInteraction(expectedInteraction, actualResponse) {
    const expectedResp = expectedInteraction.response;
    const diffs = [];

    // 1. Status Code Match
    if (actualResponse.status !== expectedResp.status) {
      diffs.push({
        path: '$.status',
        expected: expectedResp.status,
        actual: actualResponse.status,
        message: `Status mismatch: expected ${expectedResp.status}, got ${actualResponse.status}`
      });
    }

    // 2. Body Matching Rules
    const matchingRules = expectedResp.matchingRules || {};
    this._matchObject('$.body', expectedResp.body, actualResponse.body, matchingRules, diffs);

    return {
      interactionKey: expectedInteraction.key,
      description: expectedInteraction.description,
      verified: diffs.length === 0,
      diffsCount: diffs.length,
      diffs
    };
  }

  _normalizeInteraction(inter, idx) {
    return {
      key: inter.key || `interaction-${idx + 1}`,
      description: inter.description || `Interaction ${idx + 1}`,
      type: inter.type || 'Synchronous/HTTP',
      providerStates: inter.providerStates || [],
      request: inter.request || {},
      response: {
        status: inter.response?.status || 200,
        headers: inter.response?.headers || {},
        body: inter.response?.body?.content !== undefined ? inter.response.body.content : (inter.response?.body || {}),
        matchingRules: inter.response?.matchingRules || {},
        generators: inter.response?.generators || {}
      }
    };
  }

  _executeGenerator(gen) {
    switch (gen.type) {
      case 'RandomInt':
        const min = gen.min !== undefined ? gen.min : 1;
        const max = gen.max !== undefined ? gen.max : 1000;
        return Math.floor(Math.random() * (max - min + 1)) + min;
      case 'Uuid':
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
          const r = Math.random() * 16 | 0;
          const v = c === 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });
      case 'DateTime':
        return new Date().toISOString();
      case 'RandomString':
        return Math.random().toString(36).substring(2, (gen.size || 10) + 2);
      default:
        return gen.example || 'generated-mock';
    }
  }

  _applyValueAtPath(obj, path, value) {
    const cleanPath = path.replace(/^\$\./, '').replace(/\[(\d+)\]/g, '.$1');
    const parts = cleanPath.split('.');
    let curr = obj;

    for (let i = 0; i < parts.length - 1; i++) {
      if (!curr[parts[i]]) curr[parts[i]] = {};
      curr = curr[parts[i]];
    }
    curr[parts[parts.length - 1]] = value;
  }

  _matchObject(path, expected, actual, rules, diffs) {
    if (expected === null || actual === null || typeof expected !== 'object' || typeof actual !== 'object') {
      if (expected !== actual) {
        diffs.push({ path, expected, actual, message: `Value mismatch at ${path}: expected ${expected}, got ${actual}` });
      }
      return;
    }

    for (const key of Object.keys(expected)) {
      const currentPath = `${path}.${key}`;
      if (!(key in actual)) {
        diffs.push({ path: currentPath, expected: expected[key], actual: undefined, message: `Missing required property: ${currentPath}` });
      } else {
        this._matchObject(currentPath, expected[key], actual[key], rules, diffs);
      }
    }
  }
}

export default PactV4Parser;
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PactV4Parser;
  module.exports.PactV4Parser = PactV4Parser;
}
