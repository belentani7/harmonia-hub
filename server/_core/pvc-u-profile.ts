/**
 * Protocolo de Validación Universal (PVC-U) - Perfil de Validación para HARMONÍA Clipper
 * Implementa esferas de validación, subesferas de IA (4-A, 2-A) y Validation Envelopes.
 */

import crypto from 'crypto';

// Development instances use an ephemeral key; production must configure a
// private, >=32-byte server-side secret. Never ship a default HMAC key.
const developmentKey = crypto.randomBytes(32);
function signingKey(): Buffer {
  const configured = process.env.PVCU_HMAC_SECRET;
  if (configured && Buffer.byteLength(configured, 'utf8') >= 32) {
    return Buffer.from(configured, 'utf8');
  }
  if (process.env.NODE_ENV === 'production') {
    throw new Error('PVCU_HMAC_SECRET must be configured with at least 32 bytes');
  }
  return developmentKey;
}

function unsignedEnvelope(envelope: Omit<ValidationEnvelope, 'signature'> | ValidationEnvelope) {
  return JSON.stringify({
    envelopeId: envelope.envelopeId,
    timestamp: envelope.timestamp,
    profileVersion: envelope.profileVersion,
    spheresChecked: envelope.spheresChecked,
    passed: envelope.passed,
    violations: envelope.violations,
    inputHash: envelope.inputHash,
  });
}

function envelopeMac(envelope: Omit<ValidationEnvelope, 'signature'> | ValidationEnvelope): Buffer {
  return crypto.createHmac('sha256', signingKey()).update(unsignedEnvelope(envelope)).digest();
}

export function signLedgerPayload(payload: string): string {
  return crypto.createHmac('sha256', signingKey()).update('pvc-ledger-v1:' + payload).digest('hex');
}

export function verifyLedgerPayload(payload: string, signature: string): boolean {
  if (typeof signature !== 'string' || !/^[a-f0-9]{64}$/.test(signature)) return false;
  const supplied = Buffer.from(signature, 'hex');
  const expected = Buffer.from(signLedgerPayload(payload), 'hex');
  return crypto.timingSafeEqual(supplied, expected);
}

export function verifyEnvelopeSignature(envelope: ValidationEnvelope): boolean {
  if (typeof envelope.signature !== 'string' || !/^[a-f0-9]{64}$/.test(envelope.signature)) return false;
  const received = Buffer.from(envelope.signature, 'hex');
  return crypto.timingSafeEqual(received, envelopeMac(envelope));
}

export interface ValidationEnvelope {
  envelopeId: string;
  timestamp: string;
  profileVersion: string;
  spheresChecked: number[];
  passed: boolean;
  violations: { sphere: string; code: string; message: string }[];
  inputHash: string;
  signature: string;
}

export class PVCUValidator {
  private profileVersion = '1.0.0';

  /**
   * Ejecuta la validación completa sobre el contenido extraído y metadatos de la URL.
   */
  public validateExtraction(url: string, title: string, htmlContent: string): ValidationEnvelope {
    const violations: { sphere: string; code: string; message: string }[] = [];
    const spheresChecked = [1, 2, 4, 4.1]; // Esferas activas para el Clipper

    // Esfera 1: Integridad y Tipos de Datos
    if (!url || typeof url !== 'string' || (!url.startsWith('http://') && !url.startsWith('https://'))) {
      violations.push({ sphere: 'Esfera-1', code: 'PVC-101', message: 'URL inválida o ausente' });
    }
    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      violations.push({ sphere: 'Esfera-1', code: 'PVC-102', message: 'Título ausente o vacío' });
    }

    // Esfera 4: Seguridad y Contenido Sensible
    if (htmlContent.includes('<script') && htmlContent.includes('eval(')) {
      violations.push({ sphere: 'Esfera-4', code: 'PVC-401', message: 'Contenido HTML contiene patrones sospechosos de ejecución de código' });
    }

    // Subesfera 4-A: Validación de Entradas / Prevención de Inyección / Fuga
    const lowerHtml = htmlContent.toLowerCase();
    if (lowerHtml.includes('ignore previous instructions') || lowerHtml.includes('system prompt')) {
      violations.push({ sphere: 'Subesfera-4A', code: 'PVC-4A-001', message: 'Intento detectado de manipulación o inyección de prompt en el contenido web' });
    }

    // Subesfera 2-A: Semántica Inteligente (Longitud y Coherencia)
    if (htmlContent.length < 20) {
      violations.push({ sphere: 'Subesfera-2A', code: 'PVC-2A-001', message: 'Contenido extraído demasiado corto para ser un artículo válido' });
    }

    const passed = violations.length === 0;
    const inputHash = crypto.createHash('sha256').update(htmlContent + url).digest('hex');
    const envelopeId = `env_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const unsigned = {
      envelopeId,
      timestamp: new Date().toISOString(),
      profileVersion: this.profileVersion,
      spheresChecked,
      passed,
      violations,
      inputHash,
    };
    const signature = envelopeMac(unsigned).toString('hex');

    return { ...unsigned, signature };
  }
}
