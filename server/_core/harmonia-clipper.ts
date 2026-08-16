/**
 * HARMONÍA Durable Engine & Three-Phase Workflow for Web-to-Markdown Clipper
 * Fases: PREPARAR -> CONFIRMAR -> COMMIT
 */

import crypto from 'crypto';

export type NodePhase = 'prepare' | 'confirm' | 'commit';
export type NodeStatus = 'pending' | 'preparing' | 'awaiting_confirmation' | 'executing' | 'succeeded' | 'failed' | 'cancelled';

export interface ClipperWorkflowState {
  workflowId: string;
  url: string;
  title: string;
  markdownContent: string;
  wordCount: number;
  phase: NodePhase;
  status: NodeStatus;
  inputHash: string;
  idempotencyKey: string;
  approvalRequired: boolean;
  approved: boolean;
  createdAt: string;
  updatedAt: string;
  auditTrail: { event: string; timestamp: string }[];
}

export class HarmoniaClipperWorkflow {
  private state: ClipperWorkflowState;

  constructor(url: string, title: string, htmlContent: string) {
    const workflowId = `wf_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const markdown = this.htmlToMarkdown(htmlContent, title, url);
    const inputHash = crypto.createHash('sha256').update(markdown).digest('hex');
    const idempotencyKey = `${workflowId}:${inputHash}:commit`;

    this.state = {
      workflowId,
      url,
      title,
      markdownContent: markdown,
      wordCount: markdown.split(/\s+/).length,
      phase: 'prepare',
      status: 'pending',
      inputHash,
      idempotencyKey,
      approvalRequired: true,
      approved: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      auditTrail: [{ event: 'workflow_created', timestamp: new Date().toISOString() }],
    };
  }

  private htmlToMarkdown(html: string, title: string, url: string): string {
    // Clean conversion heuristic for MVP
    const cleanText = html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    return `# ${title}\n\n*Source:* [${url}](${url})\n*Captured:* ${new Date().toISOString()}\n\n## Content\n\n${cleanText}`;
  }

  /**
   * FASE A: PREPARAR
   */
  public prepare(): ClipperWorkflowState {
    this.state.phase = 'prepare';
    this.state.status = 'awaiting_confirmation';
    this.state.updatedAt = new Date().toISOString();
    this.state.auditTrail.push({ event: 'phase_prepare_completed', timestamp: this.state.updatedAt });
    return { ...this.state };
  }

  /**
   * FASE B: CONFIRMAR
   */
  public confirm(approved: boolean): ClipperWorkflowState {
    if (this.state.phase !== 'prepare' && this.state.status !== 'awaiting_confirmation') {
      throw new Error('Workflow not in awaiting_confirmation state');
    }

    this.state.phase = 'confirm';
    this.state.approved = approved;
    this.state.updatedAt = new Date().toISOString();

    if (approved) {
      this.state.status = 'executing';
      this.state.auditTrail.push({ event: 'phase_confirm_approved', timestamp: this.state.updatedAt });
    } else {
      this.state.status = 'cancelled';
      this.state.auditTrail.push({ event: 'phase_confirm_rejected', timestamp: this.state.updatedAt });
    }

    return { ...this.state };
  }

  /**
   * FASE C: COMMIT / EJECUTAR (Idempotente)
   */
  public commit(): { success: boolean; state: ClipperWorkflowState; fileContent: string } {
    if (this.state.status !== 'executing' || !this.state.approved) {
      throw new Error('Cannot commit unapproved or non-executing workflow');
    }

    try {
      this.state.phase = 'commit';
      this.state.status = 'succeeded';
      this.state.updatedAt = new Date().toISOString();
      this.state.auditTrail.push({ event: 'phase_commit_succeeded', timestamp: this.state.updatedAt });

      return {
        success: true,
        state: { ...this.state },
        fileContent: this.state.markdownContent,
      };
    } catch (error) {
      this.state.status = 'failed';
      this.state.updatedAt = new Date().toISOString();
      this.state.auditTrail.push({ event: 'phase_commit_failed', timestamp: this.state.updatedAt });
      return {
        success: false,
        state: { ...this.state },
        fileContent: '',
      };
    }
  }

  public getState(): ClipperWorkflowState {
    return { ...this.state };
  }
}
