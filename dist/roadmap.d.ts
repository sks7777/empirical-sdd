import type { MockupGateResult } from "./mockups.js";
import type { QaReceipt } from "./protocol.js";
import type { ConsultEvaluation } from "./specialists.js";
import type { ActionPacket, BudgetConfig, FeatureSize, Phase, Profile, FullSuiteApprovalConfirmation, PromotionRoute, QaGate, Roadmap, RoadmapCheck, RoadmapJob, RoadmapSummary, TrackerStatus, VerificationMatrix, VerificationSelectionEntry, WorkflowState } from "./types.js";
/**
 * The single non-terminal phase order per profile. Transitions, CLI step
 * counts and roadmaps all read it, so they cannot disagree.
 */
export declare const PHASE_ORDER: {
    readonly fast: readonly ["implement", "context"];
    readonly quick: readonly ["shape", "implement", "verify", "review"];
    readonly complex: readonly ["specify", "design", "plan", "implement", "verify", "review", "integrate"];
};
/**
 * Quick and Complex no longer enter Context: Implement's completion refreshes
 * repository knowledge itself. A feature already parked in Context advances
 * from where Implement would have led, so it sits at Implement's position.
 */
export declare function positionPhase(profile: Profile, phase: Phase): Phase;
/** Separately authorized phases that appear in a roadmap only once entered. */
export declare const POST_DONE_PHASES: readonly ["deliver", "publish"];
/** Complex order for features that review before verification (SDD-85). */
export declare const COMPLEX_REVIEW_FIRST_ORDER: readonly ["specify", "design", "plan", "implement", "review", "verify", "integrate"];
/** The phase order this feature follows. */
export declare function phaseOrderFor(state: Pick<WorkflowState, "profile" | "reviewFirst">): readonly Phase[];
/** Standard binding ends at the merge: there is nothing to run after Verify. */
export declare const MERGE_WAIT_TEXT = "Open and merge this verified feature's pull request; the merge closes the feature as integrated";
export declare const MERGE_NEXT_ACTION = "Commit and push the verified branch, open its pull request, then merge it after its checks pass; Empirical closes the feature as integrated when it sees the merge";
/** Longest one-line waitingOn text; the full message stays in rationale.reason. */
export declare const WAITING_TEXT_LIMIT = 160;
export interface RoadmapCommandPrefix {
    argv: readonly string[];
    cwd: string;
}
export interface RoadmapInput {
    state: WorkflowState;
    matrix: VerificationMatrix | null;
    /** Every QA receipt stored for this feature in this checkout, in any order. */
    qaReceipts: readonly QaReceipt[];
    /** Check id to its configured commands; changed-file runs append to these argv prefixes. */
    commandPrefixes: Readonly<Record<string, readonly RoadmapCommandPrefix[]>>;
    /** The rationale's unmet requirements; they become the current phase's needs. */
    missingContext: readonly string[];
    tracker: TrackerStatus;
    consults: ConsultEvaluation;
    mockups: MockupGateResult;
    completionTool: ActionPacket["completion"]["mcpTool"];
    /** Standard binding: a verified feature in Integrate only waits for its pull request merge. */
    waitingOnMerge?: boolean;
    /**
     * The current repository tree digest. A receipt only proves a check while it
     * matches, exactly as the completion gate requires; null proves nothing.
     */
    treeDigest: string | null;
    /**
     * Current scoped digests by QA receipt id, computed only for eligible
     * scope-bound receipts. A scoped receipt proves its check while its recorded
     * scopeDigest matches, exactly as the Verify gate accepts it.
     */
    scopeDigests?: Readonly<Record<string, string>>;
    /**
     * The current tree digest with text line endings normalized, present only
     * when a receipt could use it. A QA receipt below full CI proves its check
     * while its recorded normalized digest matches, as the Verify gate accepts it.
     */
    textTreeDigest?: string | null;
    /** Passing remote-checks proof that the promotion gate accepts for full CI, if any. */
    remoteFullCiReceiptId?: string | null;
    /** Canonical, current review validated by the core, only for non-UI work without a configured acceptance command. */
    freshContextReviewReceiptId?: string | null;
    /** Most recent background jobs of the active feature, newest first. */
    jobs?: readonly RoadmapJob[];
    /**
     * The contract size when it exceeds the size guardrail and no recorded choice
     * covers it. It adds a decision but never blocks a gate.
     */
    pendingSizeDecision?: FeatureSize | null;
    /** Journal-derived timing with the caller's clock; the roadmap stays clock-free and omits time without it. */
    timeline?: RoadmapTimeline | null;
    /** The static promotion route; the full-CI check reports it. */
    promotionRoute?: PromotionRoute | null;
    /** The Verify selection; each Verify check names the command it selects. */
    selection?: readonly VerificationSelectionEntry[];
    /** On route local at a promotion gate: the full-CI command, its estimate, and whether this exact run is approved. */
    fullSuite?: {
        commandId: string;
        estimateMs: number | null;
        approved: boolean;
        confirmation?: FullSuiteApprovalConfirmation;
    } | null;
    /** Checks already computed for this packet; recomputed from the same inputs when absent. */
    checks?: readonly RoadmapCheck[];
    /** Local-ref drift from the target branch, already filtered by the staleness settings; never blocks a gate. */
    staleness?: {
        notice: string;
        target: string;
    } | null;
}
export interface RoadmapTimeline {
    startedAt: string;
    phaseStartedAt: string;
    now: string;
    budgetMs: number;
    /** True when Review sent the work back to Implement, restarting the verification lap. */
    lapRestarted?: boolean;
    /** Journal event timestamps; when present, time counts active work instead of wall clock. */
    activity?: readonly string[];
}
/** Per-lane minutes applied when `.empirical/config.json` has no `budget`. */
export declare const DEFAULT_BUDGET_MINUTES: {
    readonly fast: 30;
    readonly quick: 60;
    readonly complex: 120;
};
/** The lane budget plus recorded checkpoint extensions, in milliseconds. */
export declare function budgetMsFor(profile: Profile, budget: BudgetConfig | undefined, extensionMinutes?: number): number;
/** The longest gap between journal events counted as work; anything longer is idle time. */
export declare const IDLE_GAP_CAP_MS: number;
/**
 * Active time from the first timestamp to `now`: the sum of the gaps between
 * consecutive events, each capped at IDLE_GAP_CAP_MS, so an overnight pause
 * costs at most one capped gap instead of the whole night.
 */
export declare function activeMs(times: readonly number[], now: number): number;
/**
 * Extension minutes after a continue checkpoint. The new budget is the
 * requested minutes on top of the time already used, so continuing an
 * exceeded budget never leaves the feature over budget again immediately.
 */
export declare function checkpointExtensionMinutes(input: {
    baseMinutes: number;
    currentExtensionMinutes: number;
    elapsedMs: number;
    extendMinutes: number;
}): number;
/**
 * Start of the feature and of the current phase from journal events in
 * sequence order. Null without events or with unreadable timestamps.
 */
export declare function journalTimeline(events: ReadonlyArray<{
    createdAt: string;
    summary: string;
    state: unknown;
}>): {
    startedAt: string;
    phaseStartedAt: string;
    lapRestarted: boolean;
    activity: string[];
} | null;
/** Journal summary prefix of a recorded checkpoint choice. */
export declare const CHECKPOINT_SUMMARY = "Checkpoint:";
export type RoadmapChecksInput = Pick<RoadmapInput, "matrix" | "qaReceipts" | "commandPrefixes" | "treeDigest" | "scopeDigests" | "textTreeDigest" | "remoteFullCiReceiptId" | "freshContextReviewReceiptId" | "promotionRoute" | "selection" | "fullSuite">;
/** The note on a full-CI check that auto's ci route leaves to pull-request CI. */
export declare const PR_CI_NOTE = "proven by PR CI at Deliver";
/**
 * The current phase and its 1-based position in the feature's phase order.
 * Verification progress and the roadmap read the same derivation — including
 * the review-first order — so a heartbeat can never claim a different phase or
 * total than the roadmap the host already has. A phase past the counted ones
 * (Deliver, Publish, or a legacy phase) reports the full total, exactly as the
 * roadmap does.
 */
export declare function phaseProgress(state: Pick<WorkflowState, "profile" | "reviewFirst" | "phase">): {
    phase: Phase;
    index: number;
    total: number;
};
/** Pure and clock-free: equal inputs always produce an identical roadmap. Null while idle. */
export declare function roadmapFor(input: RoadmapInput): Roadmap | null;
/** Checkpoint exits offered whenever the budget is exceeded or a verification lap restarts. */
export declare const CHECKPOINT_EXITS: readonly ["split", "defer non-blocking findings", "continue with a new budget", "stop"];
/** The feature's elapsed time as the roadmap reports it; zero when timestamps are unreadable. */
export declare function roadmapElapsedMs(timeline: RoadmapTimeline): number;
/**
 * One entry per matrix check, in matrix order. Passing uses the gates' own
 * missingQaChecks; other states come from the latest current-matrix receipt.
 */
export declare function roadmapChecks(input: RoadmapChecksInput): RoadmapCheck[];
/**
 * Median duration of the last three or fewer completed attempts of this check
 * whose recorded command matches a configured command. Null without history.
 */
export declare function estimateMs(checkId: string, receipts: readonly QaReceipt[], prefixes: readonly RoadmapCommandPrefix[]): number | null;
/**
 * Median duration of the last three or fewer completed attempts of one
 * configured command across every check. A bare command matches only its exact
 * argv and cwd, so a changed-file run that appends paths to the same argv never
 * stands in for it; only a `testFiles: "changed"` command matches its own
 * appended runs by prefix. Null without history.
 */
export declare function commandEstimateMs(receipts: readonly QaReceipt[], command: RoadmapCommandPrefix & {
    testFiles?: "changed" | undefined;
}): number | null;
export declare function summarizeRoadmap(roadmap: Roadmap, phase: Phase): RoadmapSummary;
/** `45s`, `2m 10s`, or `1h 3m`. */
export declare function formatDuration(ms: number): string;
/** The QA gate a phase answers to, or null when no gate is open at it. */
export declare function roadmapGate(phase: Phase): QaGate | null;
/**
 * The ways past a command timeout, so the user is never left without a choice:
 * background run, a smaller command, PR CI, a higher timeout, or stop.
 */
export declare function timeoutExitsText(checkId: string, timeoutMs: number): string;
