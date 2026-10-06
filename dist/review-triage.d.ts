import type { CanonicalReviewResult, ReviewFinding, ReviewTriage, ReviewRerunCost, ReviewDeferral } from "./types.js";
export declare const REVIEW_FINDING_SEVERITIES: readonly ["critical", "high", "medium", "low"];
export declare const REVIEW_FINDING_CATEGORIES: readonly ["security", "acceptance", "correctness", "design", "maintainability", "tests", "docs"];
export declare const FINDING_ID: RegExp;
export declare function findingBlocks(finding: Pick<ReviewFinding, "severity" | "category">): boolean;
/** Normalizes structured findings; throws a plain Error with the first problem. */
export declare function normalizeReviewFindings(value: unknown): ReviewFinding[];
/** An approval cannot coexist with a finding that blocks. */
/**
 * The verdict a review's own content implies: changes are requested when a
 * criterion fails or a finding blocks, and the work is approved otherwise.
 * Recording derives it instead of rejecting a reviewer's contradictory label.
 */
export declare function deriveReviewVerdict(criteria: ReadonlyArray<{
    passed: boolean;
}>, findings: ReadonlyArray<Pick<ReviewFinding, "severity" | "category">>): CanonicalReviewResult["verdict"];
export declare function assertFindingsMatchVerdict(verdict: CanonicalReviewResult["verdict"], findings: readonly ReviewFinding[]): void;
export interface ReviewTriageInput {
    result: Pick<CanonicalReviewResult, "verdict" | "findings" | "digest">;
    failedCriteria: readonly string[];
    deferrals: readonly ReviewDeferral[];
    /** Recorded review results for this feature that requested changes, including this one. */
    reviewRoundsRequestingChanges: number;
    maxRounds: number;
    rerunCost: ReviewRerunCost;
    /** A tracker is configured, so deferred findings can become one follow-up ticket. */
    trackerConfigured?: boolean;
}
export declare function reviewTriage(input: ReviewTriageInput): ReviewTriage;
export declare function renderDeferredFindingsSection(findings: readonly ReviewFinding[], deferrals: readonly ReviewDeferral[]): string;
