import type { Criterion, Phase } from "./types.js";
/**
 * Design happens in two moments.
 *
 * At onboarding a project settles its visual language and, if it wants them,
 * one or two representative screens. Those screens are offered rather than
 * required: a client project wants them, a small internal tool does not, and
 * forcing every repository to pause on visual design before any code would make
 * the harness feel like tax. Whichever way that goes it is recorded, because an
 * absent artifact is ambiguous — nobody can tell later whether a team decided
 * against app mockups or never saw the question.
 *
 * At Specify each interface feature gets its own mockup, approved before the
 * contract freezes. That timing is the whole point. Seeing a screen reveals
 * states, empty cases and flows that prose misses, and those are acceptance
 * criteria. A mockup produced after the contract is frozen can only comply with
 * it; a mockup produced while the contract is open can improve it.
 */
export declare const APP_MOCKUP_DIRECTORY = ".empirical/mockups";
export declare function appMockupDecisionPath(): string;
export declare function featureMockupDirectory(feature: string): string;
export declare function mockupApprovalPath(feature: string): string;
export declare function featureMockupEntryPath(feature: string): string;
export declare function fidelityReportPath(feature: string): string;
/** Mockups are approved while the contract is still open. */
export declare const MOCKUP_GATE_PHASE: Phase;
/** Loyalty to the approved design is proven where evidence is already gathered. */
export declare const FIDELITY_GATE_PHASE: Phase;
/**
 * Where the approved design is handed over rather than checked.
 *
 * Loyalty is far cheaper to achieve by giving the builder the artifact than by
 * detecting divergence afterwards, and this phase used to receive nothing at
 * all: the contract spoke at Specify and at Verify and said nothing in between,
 * so the phase that actually builds the interface reconstructed it from prose.
 */
export declare const MOCKUP_CONTEXT_PHASE: Phase;
export type AppMockupChoice = "adopted" | "declined";
export type MockupStyling = "tokens" | "reference";
export type FidelityVerdict = "loyal" | "diverged";
export interface AppMockupDecision {
    choice: AppMockupChoice;
    decidedBy: string;
}
/**
 * Declining is a decision, so it parses exactly as strictly as adopting.
 */
export declare function parseAppMockupDecision(text: string): AppMockupDecision;
export interface MockupApproval {
    chosen: string;
    approvedBy: string;
    /** What was considered and rejected. The fidelity gate checks this later. */
    ruledOut: string;
    styling: MockupStyling;
}
/**
 * A mockup either imports the repository's real stylesheet and tokens, or says
 * plainly that it is a layout reference. Leaving that ambiguous is how a builder
 * guesses and the result diverges, so the approval has to state which it is.
 */
export declare function parseMockupApproval(text: string): MockupApproval;
export interface FidelityDivergence {
    screen: string;
    divergence: string;
    /** An accepted divergence needs a reason; silence is not acceptance. */
    accepted: boolean;
    rationale: string;
}
export interface FidelityReport {
    verdict: FidelityVerdict;
    divergences: FidelityDivergence[];
}
export declare function parseFidelityReport(text: string): FidelityReport;
/** A divergence that was not accepted sends the work back to implementation. */
export declare function unacceptedDivergence(report: FidelityReport): FidelityDivergence | null;
/** The exact shape an approval has to take, so nobody has to guess at it. */
export declare const MOCKUP_APPROVAL_SKELETON: string;
/** The exact shape a fidelity report has to take. */
export declare const FIDELITY_REPORT_SKELETON: string;
export interface MockupGateInput {
    feature: string;
    phase: Phase;
    criteria?: readonly Criterion[] | undefined;
    /** Omission preserves the existing pre-coding requirement. */
    mockupsBeforeCoding?: boolean;
    /** Returns file contents, or null when the file is absent. */
    read: (path: string) => Promise<string | null>;
}
export interface MockupGateResult {
    /** True when this feature shows an interface at all. */
    interfaceSurface: boolean;
    requiredPaths: string[];
    missingPaths: string[];
    /**
     * A document that exists but could not be read, with the reason. Reporting
     * this as missing would tell an author to write a file they already wrote.
     */
    malformed: {
        path: string;
        reason: string;
    }[];
    /** Set when the build diverged from the approved design without acceptance. */
    blocked: {
        path: string;
        reason: string;
    } | null;
}
/**
 * Evaluate the mockup obligations for one phase.
 *
 * Specify requires an approved mockup for an interface when enabled by config.
 * Verify requires a fidelity report, but only where a mockup was approved, so
 * this can never retroactively block work that predates the design flow.
 */
export declare function evaluateMockupGate(input: MockupGateInput): Promise<MockupGateResult>;
