import type { ContractSummary, Criterion, DecisionSummary } from "./types.js";
/** About 1.5k tokens; character counts are stable across hosts. */
export declare const CONTRACT_SUMMARY_BUDGET = 6000;
export interface ContractSummaryInput {
    feature: string;
    spec: string;
    criteria: readonly Criterion[];
    /** Parsed decision records; only Accepted, not superseded entries are summarized. */
    decisions: readonly DecisionSummary[];
    /** Existing full documents, listed as optional references. */
    references: readonly string[];
    /**
     * "ids" names each criterion without its text, for a caller that already
     * carries the full criteria beside the summary (the action packet's
     * acceptanceCriteria). Defaults to "text".
     */
    criteriaDetail?: "text" | "ids";
}
/**
 * Builds a deterministic contract extract without a model call. Equal inputs
 * produce identical text: sections are fixed, items keep source order, and
 * nothing time- or host-dependent is rendered. Ids are never dropped.
 */
export declare function buildContractSummary(input: ContractSummaryInput): ContractSummary;
