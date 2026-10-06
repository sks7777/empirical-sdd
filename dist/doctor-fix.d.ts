import { type DoctorFixAction, type DoctorReport } from "./doctor.js";
/**
 * Doctor self-healing: turn the current Doctor findings into one previewable
 * plan, then apply exactly that plan. One approval (bound to the plan digest)
 * covers every `safe` and `confirm` entry; a `decision` entry runs only the
 * option the user chose, with the inputs they supplied.
 */
export interface DoctorFixEntry {
    id: string;
    code: string;
    scope: string;
    severity: "info" | "warning" | "error";
    kind: "safe" | "confirm" | "decision";
    summary: string;
    actions: DoctorFixAction[];
}
export interface DoctorFixPlan {
    schemaVersion: 1;
    root: string;
    entries: DoctorFixEntry[];
    /** Findings with no automated resolution, with Doctor's own guidance. */
    unfixable: Array<{
        code: string;
        scope: string;
        severity: "info" | "warning" | "error";
        summary: string;
    }>;
    digest: string;
}
export interface DoctorFixChoice {
    entry: string;
    option: string;
    inputs?: Record<string, string> | undefined;
}
export interface DoctorFixInput {
    /** The previewed plan's digest; omit it to preview. */
    planDigest?: string;
    /** One chosen option per decision entry to resolve now; others are left as they are. */
    choices?: DoctorFixChoice[];
}
export interface DoctorFixOutcome {
    entry: string;
    option: string;
    operation: string;
    /** `pending-host`: the operation returned an intent the agent must execute (Linear MCP). */
    status: "applied" | "failed" | "pending-host" | "skipped";
    detail: string;
}
export interface DoctorFixResult {
    outcome: "planned" | "applied";
    plan: DoctorFixPlan;
    results: DoctorFixOutcome[];
    /** A fresh Doctor report after applying; null for a preview. */
    after: DoctorReport | null;
}
export type DoctorFixExecutor = (action: DoctorFixAction, inputs: Record<string, string>) => Promise<Pick<DoctorFixOutcome, "status" | "detail">>;
export declare function buildDoctorFixPlan(root: string, report?: DoctorReport): Promise<DoctorFixPlan>;
/** Apply an approved plan: every safe/confirm entry, plus the chosen decisions. */
export declare function applyDoctorFixPlan(plan: DoctorFixPlan, choices: DoctorFixChoice[], execute: DoctorFixExecutor): Promise<DoctorFixOutcome[]>;
