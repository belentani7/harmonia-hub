import {
  decimal,
  index,
  int,
  json,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const crmContacts = mysqlTable(
  "crm_contacts",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("user_id").notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    status: varchar("status", { length: 50 }).default("lead").notNull(),
    value: decimal("value", { precision: 10, scale: 2 }).default("0.00").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull().onUpdateNow(),
  },
  (table) => ({
    ownerIdx: index("crm_contacts_user_idx").on(table.userId),
  }),
);

export const automationJobs = mysqlTable(
  "automation_jobs",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("user_id").notNull(),
    jobName: varchar("job_name", { length: 255 }).notNull(),
    schedule: varchar("schedule", { length: 100 }).notNull(),
    status: varchar("status", { length: 50 }).default("active").notNull(),
    scheduleCronTaskUid: varchar("schedule_cron_task_uid", { length: 65 }),
    lastRunAt: timestamp("last_run_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    ownerIdx: index("automation_jobs_user_idx").on(table.userId),
    taskUidIdx: uniqueIndex("automation_jobs_task_uid_idx").on(table.scheduleCronTaskUid),
  }),
);

export const automationRuns = mysqlTable(
  "automation_runs",
  {
    id: int("id").autoincrement().primaryKey(),
    jobId: int("job_id").notNull(),
    idempotencyKey: varchar("idempotency_key", { length: 191 }).notNull(),
    status: varchar("status", { length: 50 }).notNull(),
    phase: varchar("phase", { length: 30 }).notNull(),
    result: json("result"),
    error: text("error"),
    startedAt: timestamp("started_at").defaultNow().notNull(),
    finishedAt: timestamp("finished_at"),
  },
  (table) => ({
    jobIdx: index("automation_runs_job_idx").on(table.jobId),
    idemIdx: uniqueIndex("automation_runs_idem_idx").on(table.idempotencyKey),
  }),
);

export const pvcuLedgerRecords = mysqlTable(
  "pvcu_ledger_records",
  {
    id: int("id").autoincrement().primaryKey(),
    sequenceId: int("sequence_id").notNull(),
    workflowId: varchar("workflow_id", { length: 191 }).notNull(),
    envelopeId: varchar("envelope_id", { length: 191 }).notNull(),
    inputHash: varchar("input_hash", { length: 128 }).notNull(),
    previousHash: varchar("previous_hash", { length: 128 }).notNull(),
    recordHash: varchar("record_hash", { length: 128 }).notNull(),
    passed: int("passed").notNull().default(1),
    envelope: json("envelope").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    sequenceIdx: uniqueIndex("pvcu_sequence_idx").on(table.sequenceId),
    workflowIdx: index("pvcu_workflow_idx").on(table.workflowId),
  }),
);

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type CrmContact = typeof crmContacts.$inferSelect;
export type InsertCrmContact = typeof crmContacts.$inferInsert;
export type AutomationJob = typeof automationJobs.$inferSelect;
export type InsertAutomationJob = typeof automationJobs.$inferInsert;
export type AutomationRun = typeof automationRuns.$inferSelect;
export type InsertAutomationRun = typeof automationRuns.$inferInsert;
export type PvcuLedgerRecord = typeof pvcuLedgerRecords.$inferSelect;
export type InsertPvcuLedgerRecord = typeof pvcuLedgerRecords.$inferInsert;
