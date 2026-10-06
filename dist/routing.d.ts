import type { ExecutionMode, RiskFloor, Workflow } from "./protocol.js";
import type { Phase, PublicWorkState, WorkflowStatus, WorkExploration, WorkRoute } from "./types.js";
export interface RouteInput {
    request: string;
    mode?: ExecutionMode;
    requestedProfile?: Workflow;
    declaredContractNeutral?: boolean;
}
/**
 * Floors that still move an explicit Fast request to Complex. Integration and
 * delivery wording keeps Fast: its profile guards, not keyword routing, stop
 * Fast work before Integrate, Deliver or Publish.
 */
export declare const FAST_SAFETY_FLOORS: readonly RiskFloor[];
export interface RouteDecision {
    profile: Workflow;
    mode: ExecutionMode;
    riskFloor: RiskFloor;
    /** Every floor whose signal matched after the contract-neutral adjustment, in risk order. */
    matchedFloors: RiskFloor[];
    rationaleCodes: string[];
    gates: string[];
    promoted: boolean;
    /** Specialist ids implied by this request. Derived, never caller-supplied. */
    consults: string[];
}
export type HarnessRoute = WorkRoute;
export type HarnessEndpoint = "implemented" | "verified" | "reviewed" | "integrated" | "delivered" | "published";
export type HarnessPhase = "proposal" | "specification" | "technical-design" | "task-breakdown" | "implementation" | "verification" | "review" | "integration" | "delivery" | "publication";
export interface HarnessExploration {
    understood?: boolean;
    filesToRead?: number;
    nonTrivialFilesToWrite?: number;
    broadResearch?: boolean;
    freshContextUseful?: boolean;
    recoveryUseful?: boolean;
}
export interface HarnessRouteDecision {
    route: HarnessRoute;
    formalSddSelected: boolean;
    execution: {
        inspection: "minimal" | "bounded";
        delegation: "none" | "required";
        artifacts: "none" | "formal-sdd";
        phases: HarnessPhase[];
        endpoint: HarnessEndpoint;
    };
}
export interface WorkRouteInput extends RouteInput {
    requestedRoute?: WorkRoute;
    formalSddApproved?: boolean;
    exploration?: WorkExploration;
}
export interface WorkRouteDecision extends RouteDecision {
    route: WorkRoute;
    publicState: PublicWorkState;
    formalSddSelected: boolean;
    flowRecordRecommended: boolean;
    compatibility: {
        profile: Workflow;
        reason: string;
    };
}
/** Position on the risk ladder; a higher rank is a stronger floor. */
export declare function riskFloorRank(floor: RiskFloor): number;
export declare function routeRequest(input: RouteInput): RouteDecision;
/**
 * Select the public Empirical route independently from the legacy execution
 * profile. Flow routes remain agent-executed and never start Formal SDD merely
 * because the risk-only compatibility profile is Complex.
 */
export declare function routeWork(input: WorkRouteInput): WorkRouteDecision;
export declare function publicWorkState(phase: Phase, status: WorkflowStatus): PublicWorkState;
/**
 * Route the reproducible harness cases using current Direct/Complex
 * terminology. This is deliberately independent of repository preferences:
 * benchmark prompts must produce the same contract in isolated fixtures.
 */
export declare function routeHarnessRequest(input: {
    request: string;
    exploration?: HarnessExploration;
}): HarnessRouteDecision;
export interface ProductQuestionContext {
    materiallyDifferentOutcomes: string[];
    repositoryResolves: boolean;
    policyResolves: boolean;
    priorDecisionResolves: boolean;
    safeDefaultResolves: boolean;
}
export declare function isBlockingProductQuestion(context: ProductQuestionContext): boolean;
