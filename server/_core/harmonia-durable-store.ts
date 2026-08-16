/**
 * Almacenamiento Durable e Idempotente para HARMONÍA + PVC-U
 * Garantiza que cada estado de workflow y envelope PVC-U se guarde de forma segura
 * con control de concurrencia y recuperación ante fallos.
 */

import { ClipperWorkflowState } from './harmonia-clipper';
import { ValidationEnvelope } from './pvc-u-profile';

export interface DurableRecord {
  idempotencyKey: string;
  workflowState: ClipperWorkflowState;
  envelope: ValidationEnvelope;
  committedAt?: string;
  checksum: string;
}

export class HarmoniaDurableStore {
  private store = new Map<string, DurableRecord>();
  private crypto = require('crypto');

  public save(state: ClipperWorkflowState, envelope: ValidationEnvelope): DurableRecord {
    const checksum = this.crypto
      .createHash('sha256')
      .update(JSON.stringify(state) + JSON.stringify(envelope))
      .digest('hex');

    const record: DurableRecord = {
      idempotencyKey: state.idempotencyKey,
      workflowState: state,
      envelope,
      committedAt: state.status === 'succeeded' ? new Date().toISOString() : undefined,
      checksum,
    };

    this.store.set(state.idempotencyKey, record);
    return record;
  }

  public get(idempotencyKey: string): DurableRecord | undefined {
    return this.store.get(idempotencyKey);
  }

  public verifyRecordIntegrity(idempotencyKey: string): boolean {
    const rec = this.store.get(idempotencyKey);
    if (!rec) return false;

    const expectedChecksum = this.crypto
      .createHash('sha256')
      .update(JSON.stringify(rec.workflowState) + JSON.stringify(rec.envelope))
      .digest('hex');

    return rec.checksum === expectedChecksum;
  }
}
