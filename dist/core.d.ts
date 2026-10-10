import { type FeatureTransferInput } from "./transfer.js";
import { type ClosureObserver } from "./closure.js";
import { type FeatureFinalization } from "./finalization.js";
import { type DoctorFixInput, type DoctorFixResult } from "./doctor-fix.js";
import { type DiscoverySubmission, type DiscoverySubmissionResult } from "./discovery.js";
import { type EvidenceReceipt, type QaReceipt } from "./protocol.js";
import { type MockupGateResult } from "./mockups.js";
import { type QaJobStartResult, type QaJobView, type QaStatusResult } from "./jobs.js";
import { type PromotionProofDependencies } from "./promotion-proof.js";
import { type ReviewOperationDependencies } from "./review.js";
import { type ActionPacket, type AdoptionOptions, type AgentHandoffOffer, type AgentIntegrationId, type AuthorizedAgentHandoff, type ArchiveResult, type CapabilitySummary, type CompletionInput, type CollectEvidenceInput, type Criterion, type DefaultModeReport, type DeliveryInput, type DeliveryResult, type DirectInput, type DirectResult, type SplitDecisionInput, type SplitDecisionResult, type ExecuteEvidenceInput, type ExplainReport, type ExplorationPacket, type FeatureStartResult, type FeatureStartOptions, type InitOptions, type IntegrationReport, type IntegrationResult, type PolicyReport, type ProjectConfig, type ProjectPolicy, type ProjectStatus, type QaPlanOptions, type RoadmapSummary, type VerificationProfilePlan, type ProjectConfigurationInput, type PublicationInput, type PublicationResult, type ReviewOperationResult, type ReviewDeferInput, type ReviewDeferResult, type ReviewSubmission, type QaExecuteInput, type QaStartInput, type QaExecutionOptions, type QaRecordInput, type StartOptions, type TrackerBindInput, type TrackerBindResult, type TrackerWaiveInput, type TrackerWaiveResult, type TrackerDependencies, type TrackerDiscovery, type TrackerDiscoveryInput, type TrackerPolicy, type TrackerPolicyPreview, type TrackerMappingSuggestion, type TrackerSyncResult, type TrackerRecordInput, type TrackerRecordResult, type ValidationReport, type FullSuiteApproval, type FullSuiteApprovalRequest, type QaApproveInput, type VerificationMatrix, type VerificationMatrixPlan, type VerificationRuntimeOptions, type Workflow, type WorkflowState, type WorktreeCreateInput, type WorktreePrepareInput, type WorktreePreparePreview, type WorktreePrepareResult, type WorktreeHandoff, type WorktreeProposal, type YoloOptions, type ConsultReport, type CleanupInput, type CleanupResult, type FeatureCloseInput, type FeatureCloseResult, type ReconcileInput, type ReconcileResult } from "./types.js";
export declare class EmpiricalProject {
    private readonly readOnly;
    private readonly trackerDependencies;
    private readonly trackerHealth;
    private constructor();
    static open(start?: string, options?: {
        migrate?: boolean;
        feature?: string;
        selection?: "discover" | "selected";
        trackerDependencies?: TrackerDependencies;
        /** Injected only by tests; production observes merges on the real forge. */
        mergeObserver?: ClosureObserver;
    }): Promise<EmpiricalProject>;
    private mergeObserver;
    private withMergeObserver;
    /**
     * An explicit feature id reaches on-demand optional checks only for an
     * implemented, not-integrated Fast Done feature, which is no longer selected.
     * Every other feature is addressed through selection.
     */
    assertOptionalChecksAddressable(): Promise<void>;
    select(feature: string): Promise<ActionPacket>;
    transfer(input: FeatureTransferInput): Promise<ActionPacket>;
    static openReadOnly(start?: string, options?: {
        selection?: "discover" | "selected";
        feature?: string;
    }): Promise<EmpiricalProject>;
    /**
     * Read-only roadmap summary for one spec copy, for the overview inventory.
     * Selects nothing and writes nothing.
     */
    static roadmapSummary(root: string, feature: string): Promise<RoadmapSummary | null>;
    static initialize(root?: string, options?: InitOptions): Promise<{
        project: EmpiricalProject;
        state: WorkflowState;
        integrations: IntegrationReport;
    }>;
    static adopt(root?: string, options?: AdoptionOptions): Promise<{
        project: EmpiricalProject;
        state: WorkflowState;
        integrations: IntegrationReport;
    }>;
    status(): Promise<WorkflowState>;
    statusReport(): Promise<ProjectStatus>;
    /**
     * Offline hint for status: unfinished features whose state is exactly what
     * the target branch holds. Reads projections directly and never replays a
     * journal, so it stays cheap in repositories with many specs.
     */
    private mergedNotClosedFeatures;
    /** Team, personal and effective default lanes; an invalid personal file only warns. */
    defaultModeReport(config?: ProjectConfig): Promise<DefaultModeReport>;
    trackerPolicy(): Promise<TrackerPolicy | null>;
    configureTracker(value: unknown, dependencies?: TrackerDependencies): Promise<TrackerPolicy | null>;
    discoverTracker(input: TrackerDiscoveryInput, dependencies?: TrackerDependencies): Promise<TrackerDiscovery>;
    previewTracker(value: unknown, dependencies?: TrackerDependencies): Promise<TrackerPolicyPreview>;
    proposeTrackerMapping(value: unknown, dependencies?: TrackerDependencies): Promise<TrackerMappingSuggestion>;
    /** `linkOnly` attaches a terminal feature without publishing to its ticket. */
    bindTracker(input: TrackerBindInput, dependencies?: TrackerDependencies, options?: {
        linkOnly?: boolean;
    }): Promise<TrackerBindResult>;
    /**
     * Close a selected or terminal feature's unsynchronized tracker projection without a
     * provider call: one journal event carries the audited waiver, then the
     * resolved pending projection and any Linear MCP bridge intent are removed.
     */
    waiveTracker(value: TrackerWaiveInput): Promise<TrackerWaiveResult>;
    /**
     * An explicit feature id reaches tracker binding only for a terminal feature,
     * which can no longer be selected, or for the feature this checkout selected.
     * Returns whether the addressed feature is terminal.
     */
    assertTrackerBindAddressable(): Promise<boolean>;
    syncTracker(dependencies?: TrackerDependencies): Promise<TrackerSyncResult>;
    private assertTrackerMutationAllowed;
    private assertNoTerminalStrictTrackerBlockers;
    private workflowStore;
    recordTrackerLifecycle(input: TrackerRecordInput): Promise<TrackerRecordResult>;
    private currentTrackerStatus;
    private afterWorkflowCommit;
    config(): Promise<ProjectConfig>;
    configure(input: ProjectConfigurationInput, options?: {
        integrations?: boolean;
    }): Promise<ProjectConfig>;
    policy(): Promise<ProjectPolicy>;
    /** Policy with its digest and read-only effective values for transports. */
    policyReport(): Promise<PolicyReport>;
    configurePolicy(value: unknown): Promise<ProjectPolicy>;
    explore(problem: string): Promise<ExplorationPacket>;
    discovery(input: DiscoverySubmission): Promise<DiscoverySubmissionResult>;
    capabilities(): Promise<CapabilitySummary[]>;
    route(request: string, options?: {
        mode?: "normal" | "yolo";
        requestedProfile?: Workflow;
        declaredContractNeutral?: boolean;
        requestedRoute?: import("./types.js").WorkRoute;
        formalSddApproved?: boolean;
        exploration?: import("./types.js").WorkExploration;
    }): import("./routing.js").WorkRouteDecision;
    context(): Promise<import("./types.js").RepositoryKnowledgeReport>;
    /** Standard binding outside YOLO: the pull request merge integrates, so Integrate only waits for it. */
    private mergeIntegrates;
    /**
     * A verified feature in Integrate waits only for its merge when the merge
     * integrates and its capability specs already carry the approved deltas.
     * Work that reached Integrate before projection moved to Implement keeps
     * local finalization, so its merge never skips the capability update.
     */
    private waitsOnMerge;
    /**
     * Context and capability projection fold into Implement's completion, so
     * what Review sees is what merges: approved deltas are projected into the
     * capability specs (when the merge integrates), then repository knowledge is
     * refreshed. Refuses only when a context page still needs a person or agent.
     * Returns the paths left uncommitted, for the agent to commit with the code.
     */
    private prepareForReview;
    executeEvidence(input: ExecuteEvidenceInput): Promise<EvidenceReceipt>;
    /** Configured argv, narrowed to changed-file tests when the command opts in. */
    private commandArgv;
    /** Tests the active feature's plan lists under `## Affected tests`; empty without a plan. */
    private planDeclaredTests;
    /** Narrow follow-ups from the latest passing run of this same configured command. */
    private changedTestsBase;
    collectEvidence(input: CollectEvidenceInput): Promise<EvidenceReceipt>;
    review(submission?: ReviewSubmission, dependencies?: ReviewOperationDependencies): Promise<ReviewOperationResult>;
    /**
     * Records an explicit deferral of non-blocking findings from the current
     * canonical review. Blocking findings and failed criteria are never deferrable.
     */
    reviewDefer(input: ReviewDeferInput): Promise<ReviewDeferResult>;
    /** A recorded re-review context counts only when its previous result exists with the same digest and heads. */
    private verifiedReReview;
    private reviewDeferralsPath;
    private reviewDeferrals;
    /** The recorded canonical review result the pointer names, or null when none is recorded. */
    private currentReviewResult;
    /** The last recorded review a re-review builds on, or undefined for a full review. */
    private reReviewBaseline;
    private reviewTriageFor;
    private reviewTriageCore;
    /**
     * Non-blocking findings never start another lap (SDD-157): they are deferred
     * as soon as the review is recorded, with no ticket yet. Triage then offers
     * one follow-up ticket for them when a tracker is configured.
     */
    private deferNonBlockingFindings;
    /** Recorded canonical review results for this feature whose verdict requested changes. */
    private reviewRoundsRequestingChanges;
    /** What a fix re-runs: every Verify-gate check, because a tree change invalidates its proof. */
    private reviewRerunCost;
    /** Appends non-blocking findings and their deferrals to the delivered PR body, so none disappear silently. */
    private withReviewFindings;
    qaPlan(): Promise<VerificationMatrix>;
    qaPlan(options: QaPlanOptions): Promise<VerificationProfilePlan>;
    /** The QA plan transports return: the unchanged matrix (and digest) plus its Verify selection. */
    qaPlanReport(): Promise<VerificationMatrixPlan>;
    /** The configured full-CI command, its current estimate, and whether its exact run is approved. */
    private fullSuiteStatus;
    /** Each configured command's median recent duration from this feature's stored receipts. */
    private commandEstimates;
    /** Read-only Verify selection for a matrix: per-command estimates from stored receipts and one changed-test probe. */
    private verificationSelection;
    /** Read-only: which configured commands the profile may execute against this matrix. */
    private verificationProfilePlan;
    /** Optional Fast matrix, built only for explicit verification profile requests. */
    private fastVerificationMatrix;
    qaExecute(input: QaExecuteInput, options?: QaExecutionOptions): Promise<QaReceipt>;
    /** Queue a matrix-authorized command as a background job in a snapshot of the exact commit. */
    qaStart(input: QaStartInput): Promise<QaJobStartResult>;
    /** Read background job records; stale jobs keep their receipt but cannot satisfy the current revision. */
    qaStatus(input?: {
        jobId?: string;
    }): Promise<QaStatusResult>;
    /** Cancel a queued or running job: terminate its worker tree and remove its snapshot. */
    qaCancel(input: {
        jobId: string;
    }): Promise<QaJobView>;
    /** Detached worker entry: drain queued jobs one at a time under the repository runner lock. */
    static runQaWorker(root: string): Promise<void>;
    private static runQaJob;
    /** Validate a QA request exactly like qaExecute without running anything. */
    private selectQaCommand;
    private executeQa;
    /**
     * Record the user's explicit approval for one fresh local full-CI run at the
     * current revision, source and estimate. It never changes workflow state, so
     * approving invalidates no proof; only qa-execute consumes it.
     */
    qaApprove(input: QaApproveInput): Promise<FullSuiteApproval>;
    /** Records an unconsumed approval for this identity: the first renewal whose record no run has used. */
    private recordFullSuiteApproval;
    private fullSuiteApprovalUsePath;
    private fullSuiteApprovalConsumed;
    /**
     * An approval authorizes one fresh run: record its use exclusively before the
     * command starts. A second use fails closed; a crashed run needs a new yes.
     */
    private consumeFullSuiteApproval;
    /**
     * Validate an approval request exactly as qaApprove does, without recording
     * anything, and return what the user must be shown before saying yes.
     */
    qaApprovalRequest(input: Omit<QaApproveInput, "confirmation">): Promise<FullSuiteApprovalRequest>;
    private prepareFullSuiteApproval;
    /**
     * A fresh local full-CI execution needs the user's exact approval before
     * anything starts. At the publication boundary a bound publication
     * authorization is that approval and is recorded as such.
     */
    private assertFullSuiteApproved;
    /** The static promotion route for the selected feature, using the same target source as remote-proof eligibility. */
    private promotionRouteFor;
    private deliverRouteFallbackPath;
    /** The local route Deliver recorded for this exact Deliver revision after an auto fallback, if any. */
    private deliverRouteFallback;
    /** Persists (or clears) Deliver's auto fallback so status and roadmap show the pending approval. */
    private recordDeliverRouteFallback;
    /** The identity a fresh full-CI run would bind. Full-CI commands never append changed files, so argv is the configured one. */
    private fullSuiteIdentity;
    private fullSuiteApprovalDirectory;
    /** Idempotent: an identical record converges, and different content under the same id conflicts. */
    private writeFullSuiteApproval;
    /** A stored approval that matches this exact identity; unreadable records never match. */
    private matchingFullSuiteApproval;
    /**
     * At the publication boundary, a verified publication authorization bound to
     * this repository, feature and current commit approves Publish's own full-CI
     * run. Returns its digest, or null when it does not apply.
     */
    private publicationApproval;
    qaRecord(input: QaRecordInput): Promise<QaReceipt>;
    handoff(): Promise<AgentHandoffOffer>;
    authorizeHandoff(agent: AgentIntegrationId, approvalToken: string, approved: boolean): Promise<AuthorizedAgentHandoff>;
    capability(name: string): Promise<string | null>;
    start(request: string, options?: StartOptions): Promise<FeatureStartResult>;
    private startFeature;
    /** Begin an explicitly requested adjustment without replacing the selected feature. */
    iterate(revision: number, request: string, options?: {
        reviseContract?: boolean;
        amendContract?: boolean;
        actor?: string;
    }): Promise<ActionPacket>;
    /** The exact iterate transition, shared by iterate and a direct-mode resume that folds changes in. */
    private iterationTransition;
    /** Explicitly finish feedback and enter the existing full assurance pipeline. */
    consolidate(revision: number, summary?: string, actor?: string): Promise<ActionPacket>;
    /**
     * Fast adjusts without consolidation: a follow-up returns the same Fast
     * feature to Implement, and only an explicit promotion enters Complex.
     */
    private fastIteration;
    private assertLifecycleTransition;
    fast(request: string, options?: FeatureStartOptions): Promise<FeatureStartResult>;
    complex(request: string, options?: FeatureStartOptions): Promise<FeatureStartResult>;
    yolo(request: string, options?: YoloOptions): Promise<FeatureStartResult>;
    /**
     * Direct mode's only engine surface: pause the selected feature, resume it by
     * folding the direct diff in as one iteration, or track recent direct Git
     * changes as a new feature. It never runs a configured check, test or build.
     */
    direct(input: DirectInput): Promise<DirectResult>;
    /** Pause records only its time and base commit; no spec, delta, decision, receipt or tracker gate applies. */
    private directPause;
    /** Resume clears the pause and folds the direct diff in as at most one iteration under iterate's guards. */
    private directResume;
    /** Track rebuilds direct entries from Git, starts a feature under the normal start rules, then advances the marker. */
    private directTrack;
    loop(): Promise<ActionPacket>;
    private begin;
    proposeWorktree(request: string, workflow: Workflow, overrides?: {
        iterative?: boolean;
        changeType?: "feature" | "fix" | "chore";
        feature?: string;
        branch?: string;
        path?: string;
        base?: string;
    }): Promise<WorktreeProposal>;
    private worktreeProposalContext;
    /**
     * Rebuilds the approved selection from current explicit configuration and
     * the proposal's echoed discovered list. Discovery drift cannot change the
     * token; an explicit configuration change does.
     */
    private approvedWorktreeProposal;
    createWorktree(input: WorktreeCreateInput): Promise<WorktreeHandoff>;
    /** Previews or applies local file copies for a registered worktree; see prepareWorktree. */
    prepareWorktree(input?: WorktreePrepareInput): Promise<WorktreePreparePreview | WorktreePrepareResult>;
    explain(): Promise<ExplainReport>;
    /**
     * Read-only. Returns one bounded packet per specialist gated at the current
     * phase. Creates no revision and mutates nothing.
     */
    consult(): Promise<ConsultReport>;
    next(): Promise<ActionPacket>;
    complete(input: CompletionInput): Promise<ActionPacket>;
    integrate(expectedRevision: number, targetRoot: string, actor?: string, receiptIds?: string[], dependencies?: PromotionProofDependencies, runtime?: VerificationRuntimeOptions, decisionBy?: string): Promise<IntegrationResult>;
    private integrateLocked;
    /** Prepare all local completion artifacts before the feature PR is merged. */
    finalizeFeature(input: {
        revision: number;
        targetRoot?: string | undefined;
        actor?: string | undefined;
        decisionBy?: string | undefined;
    }, runtime?: VerificationRuntimeOptions): Promise<FeatureFinalization>;
    deliver(input: DeliveryInput, reviewDependencies?: ReviewOperationDependencies, proofDependencies?: PromotionProofDependencies): Promise<DeliveryResult>;
    publish(input: PublicationInput): Promise<PublicationResult>;
    archive(_expectedRevision: number, _actor?: string): Promise<ArchiveResult>;
    /** Continue the same Fast spec through Complex, retaining its prior history. */
    promote(expectedRevision: number, reason: string, actor?: string): Promise<ActionPacket>;
    retry(expectedRevision: number, actor?: string): Promise<ActionPacket>;
    verify(): Promise<ValidationReport>;
    integrations(): Promise<IntegrationReport>;
    migrate(): Promise<Record<string, unknown>>;
    doctor(): Promise<Record<string, unknown>>;
    /**
     * Close a feature that cannot satisfy its next gate, or force-advance exactly
     * one stage past it.
     *
     * Closure is an authorization, not a suppression: it records why the feature
     * stopped, and it records nothing about what the feature achieved. It writes
     * no receipt and adds no completion fact, so `status` stays honest afterwards.
     */
    closeFeature(input: FeatureCloseInput): Promise<FeatureCloseResult>;
    /**
     * Apply one closure plan to one feature's store. Shared by forced closure
     * and reconcile so both write the same record, journal event and compaction.
     * `releaseClaim` releases the feature's claim, which must then be this
     * checkout's; reconcile passes false for claims it does not own.
     */
    private commitClosure;
    /**
     * Close every unfinished feature whose work already merged on the forge, as
     * merged-externally, after the user approved the exact previewed plan. Each
     * feature closes in its own transaction without being selected.
     */
    reconcile(input: ReconcileInput): Promise<ReconcileResult>;
    /** Close one proven-merged feature as merged-externally, keeping its honest completion level. */
    private closeMergedCandidate;
    /**
     * Standard binding makes a merged pull request the finish line (SDD-155):
     * every unfinished feature whose merge the forge proves is closed here,
     * instead of waiting for a manual reconcile. The merge is the user's
     * decision, so no second approval is asked; strict binding keeps reconcile
     * an explicit, approved step. Offline or unproven features stay open and
     * are reported by status and Doctor.
     */
    private closeMergedFeatures;
    private reconcilePlan;
    /**
     * Prune the orphans the read-only Doctor report names. It never touches
     * journals, receipts, specifications, policy or live locks.
     */
    /**
     * Doctor self-healing. Without a digest, previews one plan built from the
     * current findings. With the previewed digest, applies every safe and confirm
     * entry plus the chosen decision options, then re-runs Doctor.
     */
    doctorFix(input?: DoctorFixInput): Promise<DoctorFixResult>;
    private runDoctorFix;
    cleanup(input: CleanupInput): Promise<CleanupResult>;
    private validateIntegrationTarget;
    private integrateNonBehavioral;
    private assertEvidencePhase;
    private assertQaPhase;
    private verificationMatrixForState;
    private qaProvenance;
    private readQaRetry;
    private exactPromotionQaReceipt;
    /**
     * Integrate proof: an exact local full-CI receipt first. Under remote-checks,
     * GitHub required checks may prove an exact commit that is already pushed;
     * Integrate never pushes, fetches or polls to obtain that proof.
     */
    private integratePromotionReceipt;
    /** Evaluate remote checks once for an exact head and persist only passing proof. */
    private collectRemoteChecksReceipt;
    /**
     * Remote-checks callbacks for Deliver. Eligibility is checked before any push
     * unless an earlier attempt already bound proof to a pushed head.
     */
    private remoteDeliveryProof;
    /** The full-CI approval Deliver needs after an auto fallback to route local, or null without a full-CI command. */
    private deliverApprovalRequest;
    /** Integrated capability projection digests the delivered head may carry beyond the proof commit. */
    private integratedCapabilityDigests;
    /** Deliver proof: an exact current-revision receipt, else the receipt Integrate recorded. */
    private deliverPromotionReceipt;
    /**
     * The single cross-revision exception: Deliver accepts the full-CI receipt
     * Integrate recorded when the verified journal head is exactly that
     * Integrate completion and every other identity is unchanged. Publish and
     * reuseReceiptId never use this path.
     */
    private integrateCarryOverReceipt;
    private validateEvidenceCriteria;
    private evidenceProvenance;
    private receiptContext;
    private receiptRecords;
    /**
     * Reads only for derived reporting: every receipt that validates against this
     * exact revision, source and policy. One invalid or stale id is skipped on its
     * own and never hides the receipts that are still valid.
     */
    private acceptedReceipts;
    private validatePhasePass;
    /** Review can cover non-UI acceptance only when the exact canonical review still validates. */
    private freshContextReviewCoverage;
    private validateCanonicalReviewPass;
    private contractSnapshotPath;
    /** The feature's contract as it exists on disk, whether or not it is still approved. */
    private readFeatureContract;
    /** The full approved contract, retained before feedback opens and after each amendment. */
    private contractBaselineSnapshot;
    /**
     * Compares the contract on disk with the retained baseline while an iterative
     * Complex feature is at its iteration stage. Returns null when the contract
     * still matches its approval, when the feature never opted into the iterative
     * lifecycle, or when no trusted baseline exists, so the existing
     * `SPEC_CHANGED`, `DELTA_CHANGED` and `IMPACT_CHANGED` guards apply instead.
     */
    private evaluateIterationAmendment;
    /** One stable error for every rejected amendment, naming the baseline and the way forward. */
    private contractRevisionRequired;
    /**
     * An amendment is re-approved only when the amended contract is still valid:
     * criteria parse, declared deltas project, and decision links stay reciprocal.
     * A missing superseding decision is a Review finding, not a completion gate.
     */
    private assertAmendedContractValid;
    private assertCapabilityDeltasUnchanged;
    /** Journal timestamps against the lane budget; null when the journal cannot be read. */
    private roadmapTimeline;
    /**
     * Record the user's checkpoint choice to continue with a new budget. It
     * appends one journal event and raises this feature's budget; the other
     * exits are ordinary workflow actions.
     */
    checkpoint(input: {
        revision: number;
        extendMinutes: number;
        actor?: string;
    }): Promise<ActionPacket>;
    private packet;
    /**
     * Current scoped digests for eligible scope-bound QA receipts whose whole-tree
     * binding changed, keyed by receipt id. Equal scope inputs are digested once;
     * an unreadable scope proves nothing.
     */
    private currentScopeDigests;
    /** The active feature's most recent background jobs, newest first, with stable fields only. */
    private roadmapJobs;
    /** The size guardrail view for a Complex feature over its limits in Specify through Implement; null otherwise. */
    private featureSize;
    /**
     * Records the user's answer to the size guardrail at the exact revision. Keep
     * requires a reason and covers the current contract size; split records the
     * choice and returns guidance to start each slice as its own feature.
     */
    splitDecision(input: SplitDecisionInput): Promise<SplitDecisionResult>;
    /** Living capability paths named by the feature's own deltas; unreadable deltas list none. */
    private featureCapabilityPaths;
    private contractSummary;
    /** In-place amendments since the last full approval, read from their immutable records. */
    private contractAmendments;
    /**
     * Mockup obligations are derived the same way consults are: from the feature's
     * own criteria, never persisted and never caller-supplied.
     */
    private evaluateFeatureMockups;
    /**
     * Specialist consults are derived from the work itself, never persisted and
     * never caller-supplied, so they need no schema field and cannot be forged.
     */
    private evaluateFeatureConsults;
}
export declare function parseCriteria(markdown: string): Criterion[];
/** Fast with at least one follow-up iteration; its terminal journal is retained uncompacted. */
export declare function isIteratedFast(state: Pick<WorkflowState, "profile" | "lifecycle">): boolean;
/**
 * Consults are an obligation on the current phase, not a transition. A blocking
 * in-domain finding stops the gate; anything else is advice the agent must read.
 */
/**
 * A mockup obligation is an instruction, not a transition.
 *
 * At Specify the agent is told to build and get approval for a mockup while the
 * contract can still absorb what the mockup reveals. At Verify it is told to
 * compare what was built against what was approved.
 */
export declare function appendMockups(base: string, state: WorkflowState, mockups: MockupGateResult): string;
export declare function routeDeliveryReviewFailure(state: WorkflowState, stage: "source" | "evidence", maxRepairAttempts: number): WorkflowState;
