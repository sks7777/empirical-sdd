import type { RiskFloor } from "./protocol.js";
import type { CapabilityDelta, ContractCriterionChange, Criterion, DecisionSummary } from "./types.js";
/** Fixed D-001 limits; crossing any of them requires a full contract revision. */
export type ContractAmendmentViolation = "risk-floor" | "capability-set" | "requirement-set" | "impact";
export interface ContractAmendmentInput {
    baseline: {
        spec: string;
        deltas: readonly CapabilityDelta[];
        criteria: readonly Criterion[];
    };
    currentSpec: string;
    currentDeltas: readonly CapabilityDelta[];
    currentCriteria: readonly Criterion[];
    impactDigest: string | null;
    approvedImpactDigest: string | null;
    /** Risk levels produced by the baseline contract and by the amended contract with its request. */
    riskBefore: RiskFloor;
    riskAfter: RiskFloor;
}
export interface ContractAmendmentEvaluation {
    /** The specification text or parsed deltas differ from the approved baseline. */
    changed: boolean;
    violations: ContractAmendmentViolation[];
    criteria: ContractCriterionChange[];
}
/**
 * Compares an edited contract with its approved baseline. The evaluation is
 * pure: structural validity, storage and re-approval stay with the caller.
 */
export declare function evaluateContractAmendment(input: ContractAmendmentInput): ContractAmendmentEvaluation;
/** Decision ids the amendment marked superseded, in current-record order. */
export declare function supersededDecisionIds(baseline: readonly DecisionSummary[], current: readonly DecisionSummary[]): string[];
