/** Git porcelain and tree paths are repository-relative, even for nested projects. */
export declare function gitProjectPrefix(root: string): string;
/** Unlike QA cleanliness, finalization includes workflow artifacts and generated files. */
export declare function checkoutChanges(root: string, ownedTransientPaths?: readonly string[]): string[];
/** Bind authored workflow inputs and capability projections, which QA's source digest excludes. */
export declare function finalizationArtifactsDigest(root: string, feature: string, includeIntegrationOutputs?: boolean): Promise<string>;
export declare function assertCleanCheckout(root: string, operation: string, ownedTransientPaths?: readonly string[]): void;
export interface FeatureFinalization {
    outcome: "prepared" | "finalized";
    feature: string;
    revision: number;
    completion: string;
    pendingPaths: string[];
    next: string;
}
/** Read-only confirmation: no journal, receipt, tracker or projection writes. */
export declare function inspectFinalization(root: string, feature: string, revision: number, completion: string): FeatureFinalization;
