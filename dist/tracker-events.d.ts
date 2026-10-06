import type { TrackerLifecycleFact, WorkflowState } from "./types.js";
/** Read proved facts only. All affected features are validated before any mutation. */
export declare function loadTrackerLifecycleRecord(root: string, value: unknown): Promise<{
    fact: TrackerLifecycleFact;
    states: WorkflowState[];
}>;
export declare function sameTrackerLifecycleFact(left: TrackerLifecycleFact | undefined, right: TrackerLifecycleFact): boolean;
export declare function previousTrackerLifecycleFact(state: WorkflowState, fact: TrackerLifecycleFact): TrackerLifecycleFact | undefined;
export declare function assertTrackerFactOrder(state: WorkflowState, fact: TrackerLifecycleFact): void;
