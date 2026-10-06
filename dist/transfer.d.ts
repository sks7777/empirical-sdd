import type { WorkflowState } from "./types.js";
export interface FeatureTransferInput {
    feature: string;
    sourceRoot: string;
    revision: number;
    actor?: string;
}
type TransferStage = "prepared" | "claim" | "selection" | "receipt" | "journal";
/** Exact retry is the recovery operation; pending transfers block only their feature. */
export declare function transferFeature(targetRoot: string, input: FeatureTransferInput, dependencies?: {
    onStage?: (stage: TransferStage) => Promise<void>;
}): Promise<WorkflowState>;
export {};
