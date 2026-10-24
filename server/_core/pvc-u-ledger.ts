/**
 * Validation Ledger inmutable para el Protocolo PVC-U
 * Almacena cada Validation Envelope con sellado criptográfico y trazabilidad.
 */

import crypto from 'crypto';
import { ValidationEnvelope, verifyEnvelopeSignature, signLedgerPayload, verifyLedgerPayload } from './pvc-u-profile';

export interface LedgerRecord {
  sequenceId: number;
  workflowId: string;
  envelope: ValidationEnvelope;
  previousHash: string;
  recordHash: string;
  recordMac: string;
}

export class PVCULedger {
  private records: LedgerRecord[] = [];

  public append(workflowId: string, envelope: ValidationEnvelope): LedgerRecord {
    const sequenceId = this.records.length + 1;
    const previousHash = sequenceId === 1 ? '0000000000000000000000000000000000000000000000000000000000000000' : this.records[this.records.length - 1].recordHash;
    
    const payload = `${sequenceId}:${workflowId}:${envelope.envelopeId}:${envelope.inputHash}:${previousHash}`;
    const recordHash = crypto.createHash('sha256').update(payload).digest('hex');

    if (!verifyEnvelopeSignature(envelope)) {
      throw new Error('Invalid validation-envelope signature');
    }
    const record: LedgerRecord = {
      sequenceId,
      workflowId,
      envelope: structuredClone(envelope),
      previousHash,
      recordHash,
      recordMac: signLedgerPayload(payload),
    };

    this.records.push(record);
    return record;
  }

  public getRecords(): LedgerRecord[] {
    // Never return references to the internal append-only chain.
    return structuredClone(this.records);
  }

  public verifyIntegrity(): boolean {
    let previous = '0'.repeat(64);
    for (let i = 0; i < this.records.length; i++) {
      const rec = this.records[i];
      if (rec.sequenceId !== i + 1 || rec.previousHash !== previous) return false;
      if (!verifyEnvelopeSignature(rec.envelope)) return false;
      const payload = `${rec.sequenceId}:${rec.workflowId}:${rec.envelope.envelopeId}:${rec.envelope.inputHash}:${previous}`;
      const expected = crypto.createHash('sha256').update(payload).digest('hex');
      if (rec.recordHash !== expected) return false;
      if (!verifyLedgerPayload(payload, rec.recordMac)) return false;
      previous = expected;
    }
    return true;
  }
}
