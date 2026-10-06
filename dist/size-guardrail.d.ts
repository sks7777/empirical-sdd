import type { SizeDecision } from "./protocol.js";
import type { CapabilityDelta, Criterion, FeatureSize, Phase, Profile, SizeGuardrailConfig } from "./types.js";
/** Features above either limit are flagged; equal counts stay within bounds. */
export declare const DEFAULT_SIZE_GUARDRAIL: SizeGuardrailConfig;
/** Phases where splitting is still cheaper than finishing one large feature. */
export declare const SIZE_GUARDRAIL_PHASES: readonly Phase[];
export interface FeatureSizeInput {
    criteria: readonly Pick<Criterion, "id">[];
    deltas: readonly Pick<CapabilityDelta, "capability" | "requirements">[];
}
/**
 * Pure and clock-free: counts acceptance criteria and capability deltas and
 * names each exceeded limit. Slices propose one boundary per capability.
 */
export declare function assessFeatureSize(input: FeatureSizeInput, config?: SizeGuardrailConfig): FeatureSize;
/**
 * A recorded choice covers the contract size it was made for; a contract that
 * grows past either recorded count asks again.
 */
export declare function sizeDecisionPending(size: FeatureSize, decision: SizeDecision | undefined): boolean;
/** Whether the guardrail applies to this profile and phase at all. */
export declare function sizeGuardrailApplies(profile: Profile, phase: Phase): boolean;
export declare function sizeWaitingText(size: FeatureSize): string;
export declare function sizeNextAction(size: FeatureSize, revision: number): string;
/** Normalizes the optional config block; absent stays absent so configs are never rewritten. */
export declare function normalizeSizeGuardrailConfig(value: unknown): SizeGuardrailConfig;
