import { describe, it, expect } from 'vitest';
import { createHash } from 'node:crypto';
import { PVCUValidator, verifyEnvelopeSignature } from '../server/_core/pvc-u-profile';
import { PVCULedger, type LedgerRecord } from '../server/_core/pvc-u-ledger';

describe('Full-Stack Integration & PVC-U Protocol Test', () => {
  it('should execute end-to-end PVC-U validation and ledger append', () => {
    const validator = new PVCUValidator();
    const ledger = new PVCULedger();

    const envelope = validator.validateExtraction(
      'https://api.belentani.io/v1/sync',
      'Full-Stack Sync',
      '<p>Valid payload for enterprise CRM and automation sync.</p>'
    );

    expect(envelope.passed).toBe(true);
    
    const record = ledger.append('wf_full_stack_1', envelope);
    expect(record.sequenceId).toBe(1);
    expect(ledger.verifyIntegrity()).toBe(true);
  });

  it('rejects an envelope whose signed validation fields were modified', () => {
    const validator = new PVCUValidator();
    const envelope = validator.validateExtraction(
      'https://example.com/article',
      'Validated title',
      '<p>A sufficiently long legitimate article for signature validation.</p>'
    );
    expect(verifyEnvelopeSignature(envelope)).toBe(true);
    const tampered = { ...envelope, passed: !envelope.passed };
    expect(verifyEnvelopeSignature(tampered)).toBe(false);
    const ledger = new PVCULedger();
    expect(() => ledger.append('wf-tampered', tampered)).toThrow(/signature/);
  });

  it('keeps copies isolated and detects mutation of any internal ledger record', () => {
    const ledger = new PVCULedger();
    const envelope = new PVCUValidator().validateExtraction(
      'https://example.com/capture',
      'Immutable record',
      '<p>Enough content to create a valid signed append-only ledger record.</p>'
    );
    const originalHash = envelope.inputHash;
    ledger.append('workflow-a', envelope);
    envelope.inputHash = 'mutated-after-append';
    const externalCopy = ledger.getRecords();
    externalCopy[0].envelope.inputHash = 'mutated-external-copy';
    expect(ledger.getRecords()[0].envelope.inputHash).toBe(originalHash);
    expect(ledger.verifyIntegrity()).toBe(true);

    // Adversarial test bypassing the TypeScript private modifier.
    const internal = (ledger as unknown as { records: LedgerRecord[] }).records;
    internal[0].workflowId = 'forged-workflow';
    const rec = internal[0];
    const publicHashPayload = `${rec.sequenceId}:${rec.workflowId}:${rec.envelope.envelopeId}:${rec.envelope.inputHash}:${rec.previousHash}`;
    rec.recordHash = createHash('sha256').update(publicHashPayload).digest('hex');
    // Even a perfectly recalculated public SHA-256 hash cannot forge the HMAC.
    expect(ledger.verifyIntegrity()).toBe(false);
  });
});
