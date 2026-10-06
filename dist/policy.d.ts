import { type ProjectPolicy, type PromotionBinding, type PromotionFullCi } from "./protocol.js";
export declare function defaultPolicy(): ProjectPolicy;
export declare function resolveRepositoryPath(root: string, configured: string): string;
export declare function parsePolicy(value: unknown, root: string): ProjectPolicy;
/** The promotion mode a parsed policy selects; omitted means auto. */
export declare function effectivePromotion(policy: Pick<ProjectPolicy, "promotion">): {
    fullCi: PromotionFullCi;
    binding: PromotionBinding;
};
/** Whether proof must match the exact commit (strict) or only the content it covered (standard). */
export declare function strictBinding(policy: Pick<ProjectPolicy, "promotion">): boolean;
export interface EffectivePolicy {
    policy: ProjectPolicy;
    digest: string;
}
export declare function effectivePolicy(value: unknown, root: string): EffectivePolicy;
export declare function migratePolicyV1(value: unknown): ProjectPolicy;
