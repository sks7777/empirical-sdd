/** Long operations serialize only their own checkout. */
export declare function withCheckoutLock<T>(root: string, operation: () => Promise<T>): Promise<T>;
/** A shared feature lock prevents a writer from racing ownership transfer. */
export declare function withFeatureLock<T>(root: string, feature: string, operation: () => Promise<T>, options?: {
    allowPendingTransfer?: boolean;
    /** Completed tracking may use its recorded owner or a validated delivery event. */
    completedTransfer?: "tracker-owner" | "lifecycle-record";
}): Promise<T>;
export interface CheckoutSelection {
    feature: string | null;
    linked: boolean;
    selectionPath: string | null;
    claimedElsewhere: Set<string>;
}
export declare function readCheckoutSelection(rootInput: string): Promise<CheckoutSelection>;
export declare function writeCheckoutSelection(rootInput: string, feature: string | null, expectedFeature?: string): Promise<void>;
/** Transfer releases an unfinished owner without creating terminal obligations. */
export declare function moveCheckoutSelection(sourceRoot: string, targetRoot: string, feature: string): Promise<void>;
/** Call under the shared feature lock before automatic external side effects. */
export declare function assertCheckoutFeatureOwner(root: string, feature: string): Promise<void>;
/** A receipt-backed delivery event may adopt completed work in another checkout.
 * Call as the guarded journal effect, and roll back if that commit fails. */
export declare function adoptCompletedTrackerFeature(root: string, feature: string): Promise<() => Promise<void>>;
/** Read only this checkout's recovery anchor, never sibling selections. */
export declare function readCheckoutLastFeature(rootInput: string): Promise<{
    git: boolean;
    feature: string | null;
}>;
export declare function readCheckoutRecoveryFeatures(rootInput: string): Promise<{
    git: boolean;
    features: string[];
}>;
/** Write-ahead ownership: call after validation but before a terminal journal
 * commit, so a process exit before selector cleanup cannot orphan the effect. */
export declare function recordCheckoutRecoveryFeature(rootInput: string, feature: string): Promise<void>;
export declare function forgetCheckoutRecoveryFeatures(rootInput: string, resolvedFeatures: string[]): Promise<void>;
/** A checkout-local runtime file under `<git-dir>/empirical-sdd/`, guarded like the selector; null outside Git. */
export declare function checkoutRuntimePath(rootInput: string, name: string): Promise<string | null>;
