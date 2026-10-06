import { type ProjectStore } from "./storage.js";
import type { DecisionSummary, DecisionValidationReport } from "./types.js";
export declare function decisionPath(store: ProjectStore, feature: string): string;
export declare function createDecisionTemplate(store: ProjectStore, feature: string): Promise<void>;
export declare function validateDecisions(store: ProjectStore, feature: string, requireAccepted?: boolean): Promise<DecisionValidationReport>;
export declare function parseDecisions(markdown: string, requireAccepted?: boolean): DecisionValidationReport;
/**
 * Fast decision records are optional and never gate a transition. Report
 * format issues as warnings and list Accepted entries; never throw for content.
 */
export declare function inspectFastDecisions(store: ProjectStore, feature: string): Promise<{
    decisions: DecisionSummary[];
    warnings: string[];
}>;
export declare function requireValidDecisions(store: ProjectStore, feature: string): Promise<DecisionSummary[]>;
