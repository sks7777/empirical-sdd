import { z } from "zod";
import type { WorkflowState } from "./types.js";
export declare const completionRecordSchema: z.ZodObject<{
    schemaVersion: z.ZodLiteral<1>;
    implementedBy: z.ZodNullable<z.ZodString>;
    completedBy: z.ZodString;
    decisionBy: z.ZodNullable<z.ZodString>;
    method: z.ZodEnum<{
        abandoned: "abandoned";
        "merged-externally": "merged-externally";
        superseded: "superseded";
        workflow: "workflow";
    }>;
    reason: z.ZodString;
    at: z.ZodString;
    revision: z.ZodNumber;
    completion: z.ZodString;
    sourceTreeDigest: z.ZodOptional<z.ZodString>;
    artifactTreeDigest: z.ZodOptional<z.ZodString>;
    digest: z.ZodString;
}, z.core.$strict>;
export type CompletionRecord = z.infer<typeof completionRecordSchema>;
export declare function recordCompletion(state: WorkflowState, actor: string, summary: string, decisionBy?: string, sourceTreeDigest?: string, artifactTreeDigest?: string): CompletionRecord;
export declare function verifyCompletionRecord(value: unknown): CompletionRecord;
export declare function renderCompletionRecord(record?: CompletionRecord): string;
