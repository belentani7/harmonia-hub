import type { Request, Response } from "express";
import { eq } from "drizzle-orm";
import { automationJobs } from "../../drizzle/schema";
import { sdk } from "../_core/sdk";
import { executeAutomationJob, cronIdempotencyKey } from "./worker";
import { getDb } from "../db";

/**
 * Heartbeat callback. The cron identity and taskUid are authenticated by the
 * platform session; request-body values are intentionally ignored for lookup.
 */
export async function handleAutomationHeartbeat(req: Request, res: Response) {
  const context = { url: req.originalUrl, timestamp: new Date().toISOString() };
  try {
    const user = await sdk.authenticateRequest(req);
    if (!user.isCron || !user.taskUid) {
      res.status(403).json({ error: "cron-only" });
      return;
    }

    const db = await getDb();
    if (!db) throw new Error("DATABASE_URL is required for scheduled automation");
    const job = (
      await db
        .select()
        .from(automationJobs)
        .where(eq(automationJobs.scheduleCronTaskUid, user.taskUid))
        .limit(1)
    )[0];

    if (!job) {
      res.json({ ok: true, skipped: "orphan" });
      return;
    }

    const result = await executeAutomationJob({
      jobId: job.id,
      idempotencyKey: cronIdempotencyKey(user.taskUid),
    });
    res.json({ ok: true, result });
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      context,
    });
  }
}
