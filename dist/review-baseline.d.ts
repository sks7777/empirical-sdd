import type { CanonicalReviewResult, ReviewDeferral, ReviewFinding, ReviewFindingState, ReviewReReview } from "./types.js";
/**
 * The last recorded review a re-review builds on. Written when a review is
 * recorded; read when the next packet is prepared.
 */
export interface ReviewBaselineRecord {
    schemaVersion: 1;
    resultPath: string;
    resultDigest: string;
    /** Digest of the criteria, decisions and amendments that review saw; a change forces a full review. */
    contractDigest?: string;
    /** Deferred findings carried from earlier rounds. */
    carriedDeferred?: ReviewFinding[];
}
/** Digest of the contract a review packet was built from. */
export declare function reviewContractDigest(input: {
    criteria: ReadonlyArray<{
        id: string;
        text: string;
    }>;
    decisions: unknown;
    contractAmendments: unknown;
}): string;
export declare function isReviewBaselineRecord(value: unknown): value is ReviewBaselineRecord;
/** True when the stored result is self-consistent and named by the baseline record. */
export declare function baselineResultMatches(record: ReviewBaselineRecord, result: CanonicalReviewResult | null): result is CanonicalReviewResult;
/**
 * Findings still open from the baseline review: every finding that was not
 * deferred against that exact result. Fixed findings are simply absent from
 * the next result.
 */
export declare function openBaselineFindings(baseline: CanonicalReviewResult, deferrals: readonly ReviewDeferral[]): ReviewFinding[];
/** Non-blocking findings of the baseline deferred against that exact result. */
export declare function deferredBaselineFindings(baseline: CanonicalReviewResult, deferrals: readonly ReviewDeferral[]): ReviewFinding[];
export declare function reReviewContext(baseline: CanonicalReviewResult, openFindings: ReviewFinding[], deferredFindings?: ReviewFinding[]): ReviewReReview;
/**
 * Carries finding ids across rounds: a previous open finding that the new
 * result repeats stays open, one it omits is fixed, and one deferred against
 * the previous result stays deferred.
 */
export declare function findingHistory(reReview: ReviewReReview | undefined, previousDeferredIds: readonly string[], current: readonly ReviewFinding[]): Array<{
    id: string;
    state: ReviewFindingState;
}>;
