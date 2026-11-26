/**
 * Semantic JSON Schema Diff & Breaking Change Detection Engine
 * Compares two JSON Schema definitions (e.g., OpenAPI / Pact contracts)
 * and detects backward-incompatible modifications across types, required fields, and constraints.
 */

export const CHANGE_SEVERITY = {
  BREAKING: 'BREAKING',
  NON_BREAKING: 'NON_BREAKING',
  INFORMATIONAL: 'INFORMATIONAL'
};

export class JsonSchemaDiffer {
  /**
   * Compare previous schema (v1) with updated schema (v2)
   * @param {Object} oldSchema - Baseline JSON schema
   * @param {Object} newSchema - Candidate target JSON schema
   * @param {string} [context='response'] - 'response' (downstream consumer) or 'request' (upstream provider)
   * @returns {Object} Comprehensive diff report with breaking change classification
   */
  diffSchemas(oldSchema, newSchema, context = 'response') {
    if (!oldSchema || !newSchema) {
      throw new Error('Both oldSchema and newSchema are required');
    }

    const changes = [];
    this._compareProperties('$', oldSchema, newSchema, context, changes);

    const breakingChanges = changes.filter(c => c.severity === CHANGE_SEVERITY.BREAKING);
    const nonBreakingChanges = changes.filter(c => c.severity === CHANGE_SEVERITY.NON_BREAKING);

    return {
      isBackwardCompatible: breakingChanges.length === 0,
      context,
      summary: {
        totalChanges: changes.length,
        breakingCount: breakingChanges.length,
        nonBreakingCount: nonBreakingChanges.length
      },
      breakingChanges,
      allChanges: changes
    };
  }

  _compareProperties(path, oldNode, newNode, context, changes) {
    if (!oldNode && !newNode) return;

    // Node added
    if (!oldNode && newNode) {
      const isBreaking = context === 'request' && newNode.required;
      changes.push({
        path,
        type: 'FIELD_ADDED',
        severity: isBreaking ? CHANGE_SEVERITY.BREAKING : CHANGE_SEVERITY.NON_BREAKING,
        description: `Field added at ${path}`,
        newNode
      });
      return;
    }

    // Node removed
    if (oldNode && !newNode) {
      const isBreaking = context === 'response'; // Removing a field from response breaks consumers expecting it
      changes.push({
        path,
        type: 'FIELD_REMOVED',
        severity: isBreaking ? CHANGE_SEVERITY.BREAKING : CHANGE_SEVERITY.NON_BREAKING,
        description: `Field removed at ${path}`,
        oldNode
      });
      return;
    }

    // Type change check
    const oldType = this._resolveType(oldNode);
    const newType = this._resolveType(newNode);

    if (oldType !== newType) {
      changes.push({
        path: `${path}.type`,
        type: 'TYPE_CHANGED',
        severity: CHANGE_SEVERITY.BREAKING,
        description: `Data type changed at ${path} from "${oldType}" to "${newType}"`,
        oldType,
        newType
      });
      return; // Stop deeper traversal if fundamental type changed
    }

    // Required fields check in object
    if (oldType === 'object') {
      const oldReq = new Set(oldNode.required || []);
      const newReq = new Set(newNode.required || []);

      // Check for newly required fields
      for (const req of newReq) {
        if (!oldReq.has(req)) {
          const isBreaking = context === 'request';
          changes.push({
            path: `${path}.required`,
            type: 'REQUIRED_FIELD_ADDED',
            severity: isBreaking ? CHANGE_SEVERITY.BREAKING : CHANGE_SEVERITY.NON_BREAKING,
            description: `Field "${req}" is now required at ${path}`,
            field: req
          });
        }
      }

      // Check child properties
      const oldProps = oldNode.properties || {};
      const newProps = newNode.properties || {};
      const allKeys = new Set([...Object.keys(oldProps), ...Object.keys(newProps)]);

      for (const key of allKeys) {
        this._compareProperties(`${path}.${key}`, oldProps[key], newProps[key], context, changes);
      }
    }

    // Enum value restrictions
    if (Array.isArray(oldNode.enum) && Array.isArray(newNode.enum)) {
      const oldEnum = new Set(oldNode.enum);
      const newEnum = new Set(newNode.enum);

      for (const val of oldEnum) {
        if (!newEnum.has(val)) {
          changes.push({
            path: `${path}.enum`,
            type: 'ENUM_VALUE_REMOVED',
            severity: CHANGE_SEVERITY.BREAKING,
            description: `Enum value "${val}" was removed at ${path}`,
            removedValue: val
          });
        }
      }
    }
  }

  _resolveType(node) {
    if (!node) return 'undefined';
    if (node.type) return String(node.type).toLowerCase();
    if (node.properties) return 'object';
    if (node.items) return 'array';
    return 'any';
  }
}

export default JsonSchemaDiffer;
if (typeof module !== 'undefined' && module.exports) {
  module.exports = JsonSchemaDiffer;
  module.exports.JsonSchemaDiffer = JsonSchemaDiffer;
  module.exports.CHANGE_SEVERITY = CHANGE_SEVERITY;
}
