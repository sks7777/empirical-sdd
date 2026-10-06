import type { RiskFloor } from "./protocol.js";
import type { Criterion, Phase } from "./types.js";
export type ConsultVerdict = "advisory" | "blocking";
export type FindingSeverity = "critical" | "high" | "medium" | "low";
export interface SpecialistDefinition {
    /** Stable slug used in paths, packets, and advisories. */
    id: string;
    title: string;
    /** What this specialist is for. Rendered into the consult packet. */
    charter: string;
    /** The single question the consult must answer. */
    question: string;
    /** Lowest risk floor that requires this specialist, or null when never triggered by risk. */
    riskFloor: RiskFloor | null;
    /** When true, any [UI] acceptance criterion requires this specialist. */
    uiSurface: boolean;
    /** Feature-relative paths this specialist may read. Kept strictly narrower than a phase packet. */
    contextSlice: readonly string[];
    /** Phases whose gate this specialist's advisory is required at. */
    gatePhases: readonly Phase[];
    /** Finding categories in which this specialist may block. */
    domain: readonly string[];
}
export declare const SPECIALISTS: readonly SpecialistDefinition[];
export declare function assertSpecialistRegistryIntegrity(): void;
export declare function specialistById(id: string): SpecialistDefinition | undefined;
export interface DeriveConsultsInput {
    riskFloor: RiskFloor;
    criteria?: readonly Criterion[] | undefined;
}
/**
 * Derive the required specialist ids from the work itself. Deliberately accepts
 * no caller-supplied specialist names: the set must not be forgeable.
 */
export declare function deriveConsults(input: DeriveConsultsInput): string[];
export declare function consultAdvisoryPath(feature: string, specialistId: string): string;
export interface ConsultFinding {
    severity: FindingSeverity;
    category: string;
    location: string;
    recommendation: string;
}
export interface ConsultAdvisory {
    specialist: string;
    verdict: ConsultVerdict;
    findings: ConsultFinding[];
}
/**
 * Strict advisory parse. Fails closed: anything malformed throws rather than
 * being treated as a pass.
 */
export declare function parseConsultAdvisory(text: string): ConsultAdvisory;
/**
 * A finding stops a gate only when the advisory blocks, the severity is
 * critical or high, and the category is inside the specialist's own domain.
 */
export declare function blockingFinding(definition: SpecialistDefinition, advisory: ConsultAdvisory): ConsultFinding | null;
export interface ConsultPacket {
    specialist: string;
    title: string;
    charter: string;
    question: string;
    contextSlice: string[];
    advisoryPath: string;
    gatePhases: Phase[];
    domain: string[];
}
export declare function consultPackets(feature: string, specialistIds: readonly string[]): ConsultPacket[];
export interface ConsultEvaluationInput {
    feature: string;
    phase: Phase;
    riskFloor: RiskFloor;
    criteria?: readonly Criterion[] | undefined;
    /** Returns the advisory text, or null when the artifact is absent. */
    readAdvisory: (path: string) => Promise<string | null>;
}
export interface ConsultEvaluation {
    required: string[];
    requiredPaths: string[];
    missingPaths: string[];
    blocked: {
        specialist: string;
        finding: ConsultFinding;
    } | null;
}
export declare function evaluateConsults(input: ConsultEvaluationInput): Promise<ConsultEvaluation>;
